# Agent discovery

How an AI agent finds out what this site offers, what the site publishes to make that
possible, and — just as deliberately — what it does not.

The rule behind every decision here: **advertise only what exists.** A discovery document
is a promise a client will try to collect on. An entry pointing at a capability this origin
does not have costs an agent a fetch, a retry, and sometimes a wrong answer to its user,
which is worse than publishing nothing at all.

## What is published

| Document                                                   | Media type                 | What it answers                                                         |
| ---------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------- |
| `/llms.txt`                                                | `text/plain`               | Every page, grouped, with its own summary. Fetch this first.            |
| `/openapi.json`                                            | `application/openapi+json` | OpenAPI 3.1 for every public GET, including the slugs each route takes. |
| `/.well-known/api-catalog`                                 | `application/linkset+json` | RFC 9727 catalog: where the description, docs, metadata, status live.   |
| `/.well-known/ai-catalog.json`                             | `application/json`         | ARD manifest, with the questions each resource answers.                 |
| `/.well-known/agent-skills/index.json`                     | `application/json`         | Published skills, each with a SHA-256 digest of its SKILL.md.           |
| `/auth.md`                                                 | `text/markdown`            | How agents authenticate here: they do not.                              |
| `/health`                                                  | `application/health+json`  | Whether the origin is serving.                                          |
| `/sitemap.xml`, `/robots.txt`, `/.well-known/security.txt` | —                          | Crawl inventory, crawler policy, security contact.                      |

Every page also carries RFC 8288 `Link` headers naming those documents by registered
relation (`api-catalog`, `service-desc`, `service-doc`, `service-meta`, `describedby`,
`status`, `index`), plus `canonical` and an `alternate` that advertises the markdown
representation. The header is assembled in `src/lib/server/discovery-links.ts`; each path
and media type in it is declared once in `src/lib/agent-discovery.ts`, which the routes
serving those documents read from too.

In the browser, `src/lib/webmcp.ts` offers the same capabilities as WebMCP tools when
`navigator.modelContext` exists. The tools are read-only apart from one that navigates to
the contact page; none of them submits a form or books anything on a person's behalf.

## DNS for AI Discovery (DNS-AID)

DNS-AID publishes an agent entry point in DNS, so a client that knows only the domain can
find the discovery documents without an HTTP request first. **It cannot be implemented in
this repository.** Cloudflare DNS is operational infrastructure outside this codebase, as
the README's architecture section says, so these records are an ops change made in the
Cloudflare dashboard.

Publish one ServiceMode SVCB record under the `_agents` namespace, pointing at the host
that serves `/.well-known/ai-catalog.json`:

```zone
_index._agents.h2technologiesllc.com. 3600 IN SVCB 1 h2technologiesllc.com. (
        alpn="h2,http/1.1"
        port=443
        mandatory=alpn,port )
```

In the Cloudflare dashboard that is **DNS → Records → Add record → SVCB**, with:

- Name: `_index._agents`
- Priority: `1` (any non-zero priority is ServiceMode; `0` would be AliasMode and is wrong here)
- Target: `h2technologiesllc.com`
- Value: `alpn="h2,http/1.1" port=443 mandatory=alpn,port`

Notes before publishing:

- The draft's own example writes `alpn="https"`. That is not a registered ALPN token —
  the real ones are `h2`, `http/1.1`, and `h3` — so the record above uses those. If a
  validator insists on the draft's literal spelling, it is the validator that is wrong.
- The draft also defines `well-known` and `cap` SvcParams for naming the capability
  document. Both are unassigned, and the draft says experimental parameters should use the
  numeric `keyNNNNN` form. Leave them off until they are assigned: an agent that resolves
  this record reaches the host, and `/.well-known/ai-catalog.json` is where it looks next.
- **Sign the zone with DNSSEC.** Without it a validating resolver cannot tell this record
  from one an on-path attacker wrote, which removes most of the reason to publish it in
  DNS rather than over HTTPS. Cloudflare: **DNS → Settings → DNSSEC → Enable**, then add
  the DS record it prints at the registrar.

Do **not** publish `_mcp._agents` or `_a2a._agents`. Those advertise an MCP server and an
A2A agent endpoint; this domain runs neither, and a record pointing at a port nothing
listens on is a promise that fails on contact. Publish them in the same change that ships
the server they name.

## Deliberately not published

Each of these is a real specification that this site would be wrong to implement today.
Each entry says what would have to become true first.

### OAuth 2.0 / OpenID Connect discovery

`/.well-known/openid-configuration` and `/.well-known/oauth-authorization-server` describe
an authorization server: its issuer, authorization and token endpoints, JWKS, and supported
grants. This origin runs no authorization server. A document naming endpoints that answer
nothing sends every agent that reads it into a flow that cannot complete.

Publish when: an authorization server exists. The metadata must then be generated from that
server's real configuration, not hand-written alongside it.

### OAuth protected resource metadata (RFC 9728)

`/.well-known/oauth-protected-resource` asserts that a resource _is_ OAuth-protected and
names the servers that issue tokens for it. Nothing here is protected; nothing here returns 401. The document would be false in its first field.

Publish when: an endpoint on this origin requires a bearer token. `/auth.md` should change
in the same commit — it currently states the absence explicitly, and that statement is the
thing agents rely on.

### MCP Server Card (SEP-1649)

`/.well-known/mcp/server-card.json` advertises an MCP server: its `serverInfo`, transport
endpoint, and capabilities. There is no MCP server on this domain. A card is a connection
string; one that points nowhere fails at the first tool call, after the agent has already
told its user it found a server.

Publish when: an MCP server is deployed and reachable. Add the `_mcp._agents` SVCB record
and an `/.well-known/ai-catalog.json` entry in the same change, so the three agree.

## Verifying a change

```bash
pnpm run build && node --test tests/agent-discovery.test.mjs
```

`tests/agent-discovery.test.mjs` fetches every URL these documents advertise and fails if
one does not answer, recomputes each skill digest from the bytes actually served, and
asserts that the three documents above stay absent. `tests/browser.test.mjs` drives the
WebMCP tools in a real browser.

The external scanner at <https://isitagentready.com> checks the same surface:

```bash
curl -sS -X POST https://isitagentready.com/api/scan \
  -H 'content-type: application/json' \
  -d '{"url": "https://h2technologiesllc.com"}'
```

It will report the DNS-AID check as failing until the record above is published, and the
three OAuth and MCP checks as failing for as long as the capabilities behind them do not
exist. Those are correct results, not regressions.
