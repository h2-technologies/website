# H2 Technologies LLC Website

Production website for H2 Technologies LLC, built with SvelteKit, Svelte 5, Tailwind CSS, and the SvelteKit Node adapter.

The canonical public origin is `https://h2technologiesllc.com`. This repository builds a Node service; it is not a Cloudflare Pages or Workers project. In production, Cloudflare fronts the host, the host's HTTPS reverse proxy (currently Caddy) forwards traffic to the loopback-only Compose port, and the SvelteKit service listens inside the container.

```text
Browser -> Cloudflare -> host HTTPS reverse proxy -> 127.0.0.1:3002 -> website container
```

Cloudflare DNS, TLS, cache rules, and the host reverse-proxy configuration are operational infrastructure outside this repository.

## Requirements

- Node.js `24.18.0` (the supported range is `>=24.18.0 <25`)
- pnpm `9.14.4`
- Chromium installed through Playwright for the browser and accessibility tests
- Docker Engine with the Compose plugin for container builds and deployment

The pinned versions are recorded in `package.json`, the `volta` block, the `packageManager` field, the Docker build arguments, and the GitHub Actions workflow.

## Clean-checkout development

From a new clone:

```bash
git clone https://github.com/h2-technologies/website.git
cd website
npm install --global pnpm@9.14.4
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run dev
```

The development server prints its local URL. No `.env` file, application credentials, or developer-machine configuration is required. Do not add Cloudflare, GitHub, analytics, or deployment credentials to this repository or to client-visible environment variables.

## Verification

Run the same release gate used by CI:

```bash
pnpm run verify
```

`verify` runs the checks sequentially so the production build exists before the server and browser tests start:

```bash
pnpm run check
pnpm run lint
pnpm run build
pnpm test
pnpm audit --audit-level high
```

The test suite exercises the built adapter-node application, including primary routes, internal links and CTAs, responsive browser smoke checks, accessibility checks, metadata, `robots.txt`, `sitemap.xml`, `security.txt`, and the agent discovery documents. Run `pnpm run build` before invoking `pnpm test` by itself.

`pnpm run format` rewrites supported files with Prettier; it is not a read-only check. `pnpm run lint` performs the read-only formatting and ESLint checks used for release validation.

## Application architecture

- `src/routes` contains the SvelteKit pages and public metadata endpoints.
- `src/lib/services.ts`, `src/lib/locations.ts`, and `src/lib/posts.ts` provide the data for crawlable service, location, and resource routes.
- `src/lib/faqs.ts` holds the site-wide questions rendered at `/faq`; service- and location-specific questions stay with their own collection so each `FAQPage` block matches its page.
- `src/lib/routing-policy.ts` is the HTML source of record for the AS17290 routing policy published at `/routing`. Keep it in step with `static/bgp-routing-policy.pdf`, which is the same policy in downloadable form.
- `src/lib/site.ts` also carries the published name, address, and phone details (`nap`), the founder entity, and the `organizationProfiles` list used for `Organization.sameAs`. Empty values there are omitted from both the page and the schema graph rather than guessed, so anything published must match the Google Business Profile exactly.
- `src/app.html` carries one blocking script: it hides an already-dismissed promotional banner before the first paint. Its SHA-256 is pinned in the `script-src` policy in `svelte.config.js`, and `tests/promo-banner.test.mjs` recomputes it — if that test fails, paste the hash it prints.
- `src/lib/components/Seo.svelte` supplies canonical, Open Graph, social, and structured-data metadata, including the shared `Organization`/`ProfessionalService`, `Person`, and `WebSite` nodes that page-level schema references by `@id`.
- `src/hooks.server.ts` applies response security headers, attaches the discovery `Link` headers, and serves the markdown representation of a page when one is negotiated. The SvelteKit CSP is configured in `svelte.config.js`.
- `src/lib/server/markdown-negotiation.ts` decides, from the request's `Accept` header, which representation was asked for; `src/lib/server/html-to-markdown.ts` converts the rendered page. Both are dependency-free, and the production image keeps its zero runtime dependencies.
- `src/lib/server/discovery-links.ts` builds the `Link` header values every page carries. Add a relation there only for a resource the site actually publishes.
- `@sveltejs/adapter-node` produces the deployable `build/` directory.
- `server.js` wraps the generated handler with consistent static-asset security and cache headers.
- The multi-stage Docker build copies only the adapter output and `server.js` wrapper into the runtime image and runs it as the unprivileged `node` user.

The generated `.svelte-kit/` and `build/` directories are local artifacts and are not committed.

## SEO and public security endpoints

The canonical hostname has no `www` prefix, and public page URLs do not use trailing slashes.

- `/robots.txt` allows public crawling and references the canonical sitemap.
- `/sitemap.xml` is generated from the static route list and the service, location, and resource data collections.
- `/.well-known/security.txt` is the RFC 9116 contact document. Renew its `Expires` value before it lapses and confirm that the listed mailbox is monitored.
- `/llms.txt` describes the site and its pages for assistants that fetch it, generated from the same route data as the sitemap.
- Page metadata and schema are generated through the shared SEO component and route data.

### Link headers for agent discovery

Every page answers with `Link` response headers (RFC 8288) naming the site's machine-readable resources, so a client that reads only the response head — a `HEAD` request, a crawler deciding whether to spend the fetch, or an agent that negotiated markdown and so received no `<head>` at all — still finds them.

```bash
curl -sSI https://h2technologiesllc.com/ | grep -i '^link'
```

| Relation       | Target                                 | What it says                                             |
| -------------- | -------------------------------------- | -------------------------------------------------------- |
| `canonical`    | the page's own canonical URL           | the one address this page answers at                     |
| `alternate`    | the same URL, `text/markdown`          | the markdown representation, which has no URL of its own |
| `service-doc`  | `/llms.txt`                            | the written map of the site (RFC 8631)                   |
| `index`        | `/sitemap.xml`                         | the complete list of canonical URLs                      |
| `api-catalog`  | `/.well-known/api-catalog`             | the APIs this publisher offers (RFC 9727)                |
| `service-desc` | `/openapi.json`                        | the same surface described for a machine (RFC 8631)      |
| `service-meta` | `/.well-known/ai-catalog.json`         | metadata about the service (RFC 8631)                    |
| `describedby`  | `/.well-known/agent-skills/index.json` | skills published for working with this site              |
| `status`       | `/health`                              | whether the origin is currently serving (RFC 8631)       |

An error response carries the site-wide links but no `canonical` — the error page answers under whatever URL was mistyped and is marked `noindex`, so naming that URL canonical would contradict it. The discovery links are sent ahead of SvelteKit's per-build preload hints, which run to over a kilobyte in the same field; browsers apply those hints wherever in the field they appear. The markdown representation drops the preload hints entirely and keeps the rest, with the `alternate` pointing back at the HTML.

Only relations registered with IANA are used, and only for resources the site publishes. The last five in the table were deliberately absent until the documents behind them existed — see [Agent discovery](#agent-discovery) — because a relation pointing at nothing costs a client a fetch and a retry and teaches it that this site's headers are not worth following. Adding a relation means adding it to `src/lib/server/discovery-links.ts`, which reads its paths and media types from `src/lib/agent-discovery.ts`; the production tests fetch every advertised target, so a link that 404s fails the build.

### Markdown for agents

Every page answers at one URL in two formats. A request carrying `Accept: text/markdown` gets the page's text as `text/markdown; charset=utf-8`; everything else, browsers included, gets the HTML unchanged. Both responses send `Vary: Accept`, so a shared cache keeps the two apart.

```bash
curl -H 'Accept: text/markdown' https://h2technologiesllc.com/services/bgp-consulting
```

The markdown is converted from the page's own rendered HTML — its `<main>` landmark, minus the navigation, the footer, the icons, and the hydration payload — so there is no second copy of the content to keep in step, and a page added or reworded is negotiable the same day. Links are rewritten to canonical absolute URLs, because a markdown file is read long after the request that produced it. The response also carries `x-markdown-tokens` and `x-original-tokens`, rough estimates of each representation's length.

Routes that are already machine-readable (`/robots.txt`, `/llms.txt`, `/sitemap.xml`, `/.well-known/security.txt`) are not converted, and carry no discovery links; they are not HTML pages, and they are the resources being pointed at.

### Edge caching

Pages are cached by Cloudflare and replayed to visitors without reaching this server, which puts two requirements on the HTML.

**Every visitor must get the same bytes.** A response shaped by one visitor's request is a response other visitors will be handed. Nothing in a page may depend on a cookie, and no page may send `Vary: Cookie` — Cloudflare honours `Vary` only for `Accept-Encoding`, so a cache-splitting header it ignores is worse than none at all. The promotional banner is the live example: whether the offer is _live_ is a clock decision and stays on the server, while whether _you_ dismissed it is per visitor and is applied in the browser, before paint, by the script in `src/app.html`.

`Vary: Accept` is the one exception, and it is safe only because a Cache Rule is configured for that header. Without that rule Cloudflare stores whichever representation was requested first and serves markdown to browsers.

**The Content Security Policy must survive being reused.** `csp.mode` is `hash`, not `auto`. A nonce is worth something only while it stays unpredictable, and a cached page freezes one response's nonce into a public constant that an injected script can quote. Hashes are derived from the scripts' own bytes and stay correct however often a stored response is replayed.

Deploys purge the cache. The `deploy` job calls Cloudflare's purge endpoint once the container is healthy, using `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_PURGE_TOKEN` from the Production environment; the token needs only _Zone → Cache Purge → Purge_ on this zone. **Both secrets are required** — without them that step fails the job deliberately, because a deploy the edge keeps hidden behind stale HTML is not a finished deploy.

### Agent discovery

Beyond the pages themselves, the site publishes a machine-readable description of what it offers, so an agent can find the right page without crawling for it:

- `/openapi.json` — OpenAPI 3.1 for every public GET endpoint, with the slugs each collection route accepts.
- `/.well-known/api-catalog` — the RFC 9727 catalog naming this API and where its description, documentation, metadata, and status live.
- `/.well-known/ai-catalog.json` — the Agentic Resource Discovery manifest, also advertised by an `Agentmap:` line in `robots.txt` and a `<link rel="ai-catalog">` in the page head.
- `/.well-known/agent-skills/index.json` — published skills, each with a SHA-256 digest of the SKILL.md it points at. Digest and document are produced from the same string in `src/lib/server/agent-skills.ts`, so they cannot disagree.
- `/auth.md` — how agents authenticate here, which is that they do not.
- `/health` — `application/health+json`, and the target of the Docker health check.

Every page names all of them in its `Link` headers, described above.

In the browser, `src/lib/webmcp.ts` offers the same capabilities as WebMCP tools when `navigator.modelContext` exists. Page inventory comes from `/llms.txt` at call time rather than from a copy in the bundle, so the tools answer the same thing the origin does and the 100 KB of page collections stays out of every page load.

Each document's path, media type, and purpose is declared once in `src/lib/agent-discovery.ts`, and the routes, `src/lib/server/discovery-links.ts`, and `/llms.txt` all read from there. Adding a document there puts it in the catalog, the manifest, the `Link` headers, and `llms.txt` together.

`docs/agent-discovery.md` covers the rest: the DNS-AID records to publish in Cloudflare, which are operational infrastructure rather than repository content, and why the OAuth discovery documents and the MCP Server Card are deliberately absent. The short version is that this origin has no authorization server, no protected resource, and no MCP server, and a discovery document that names one would send agents into a flow that cannot complete.

Location routes come in two kinds, and the distinction is what keeps them from competing for the same query. A `service` page covers one capability across Ohio; a `place` page covers one community across capabilities. Give every new page genuinely local detail rather than templated copy reused under a different town name.

When adding a service, location, or resource:

1. Add a complete, unique entry to the appropriate `src/lib/*.ts` collection.
2. Provide an accurate SEO title and meta description.
3. Add useful related-page links without keyword stuffing.
4. Confirm the canonical URL appears once in the generated sitemap.
5. Run `pnpm run verify` and review the page at mobile and desktop widths.

Do not create duplicate pages solely to target keyword variations. Redirect retired public URLs at the reverse-proxy or application layer and remove them from the sitemap.

## Container build and local production run

Build and start the same container used by production:

```bash
docker compose build --pull
docker compose up --detach --wait --remove-orphans
docker compose ps
```

Compose publishes the service as `127.0.0.1:3002:3002`; it is intentionally not exposed on every host interface. A host reverse proxy is required for public traffic.

Verify application readiness from inside the container, without relying on public DNS, TLS, Cloudflare, or the reverse proxy:

```bash
docker compose exec -T website node -e "fetch('http://127.0.0.1:3002/health').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1));"
```

The image also defines an equivalent Docker health check. Useful diagnostics are:

```bash
docker compose ps
docker compose logs --tail=200 website
docker inspect --format '{{json .State.Health}}' website-website-1
```

The exact generated container name can vary by Compose project, so obtain it from `docker compose ps` before using `docker inspect`.

The runtime image sets:

- `HOST=0.0.0.0`
- `PORT=3002`
- `NODE_ENV=production`
- `ORIGIN=https://h2technologiesllc.com`

These are non-secret application settings. The current site requires no runtime application secrets and Compose does not load a developer `.env` file.

## CI and deployment

`.github/workflows/build.yml` is the deployment source of truth.

- Pull requests targeting `dev` or `master` run the validation job.
- Pushes to `dev` and `master` run the validation job.
- Manual dispatch runs validation only.
- Deployment runs only after validation succeeds for a push to `master`.
- The deployment job uses the self-hosted runner assigned to the `Production` GitHub environment.
- Deployment rebuilds with current base images, starts Compose with `--wait`, removes orphaned containers, and performs a container-local readiness request.

The repository does not contain production credentials. GitHub runner registration, repository access, Cloudflare configuration, TLS certificates, and reverse-proxy administration remain host or platform responsibilities.

## Release checklist

Before merging a production release:

1. Confirm `pnpm install --frozen-lockfile` and `pnpm run verify` succeed from a clean checkout.
2. Review the pull-request checks and required approvals.
3. Confirm the production runner has Docker and the Compose plugin and that TCP port `127.0.0.1:3002` is available.
4. Merge through the protected branch workflow; do not push directly to `master`.
5. Wait for both validation and deployment jobs to succeed.

After deployment, validate the external layer separately:

1. Confirm HTTP redirects to HTTPS and the apex canonical host is served with a valid certificate.
2. Confirm every supported alternate hostname, including `www`, has valid DNS and TLS and redirects path and query parameters to the apex host.
3. Confirm Cloudflare and the reverse proxy preserve the application's CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and clickjacking protections.
4. Confirm fingerprinted assets receive an immutable cache policy and HTML is not cached beyond the intended release behavior.
5. Fetch `/robots.txt`, `/sitemap.xml`, and `/.well-known/security.txt` from the public origin and compare them with the new release.
6. Run critical navigation and contact CTA smoke tests against the public origin, with no browser console errors.
7. Submit or refresh the sitemap in Google Search Console and Bing Webmaster Tools when URLs change.

A successful repository build does not by itself prove that DNS, TLS, Cloudflare, the host proxy, or the currently running container has been updated.

## Rollback and recovery

The application has no database or persistent Compose volume, so replacing its container does not require a data migration.

For a bad release:

1. Re-run the last known-good successful `master` workflow run to redeploy that commit immediately.
2. Open a pull request that reverts the faulty change so `master` again represents the deployed state.
3. After the revert merges, let the normal `master` deployment complete and repeat the external release checks.

For a container that fails readiness, inspect `docker compose ps` and `docker compose logs --tail=200 website` before changing infrastructure. Once the cause is corrected, rebuild and force a fresh container:

```bash
docker compose build --pull
docker compose up --detach --wait --force-recreate --remove-orphans
```

Do not treat a successful public request as a substitute for container-local readiness, and do not treat a healthy container as proof that the Cloudflare or reverse-proxy layer is correct.
