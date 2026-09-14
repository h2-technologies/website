import {
	AGENT_SKILLS_INDEX_PATH,
	AI_CATALOG_PATH,
	API_CATALOG_PATH,
	LLMS_PATH,
	OPENAPI_PATH,
	discoveryHeaders
} from '$lib/agent-discovery';
import { MARKDOWN_CONTENT_TYPE } from '$lib/server/markdown-negotiation';
import { absoluteUrl, site } from '$lib/site';

export const prerender = false;

/**
 * `/auth.md`, the agent-facing statement of how to authenticate here.
 *
 * The answer is that there is nothing to authenticate to, and saying so plainly is the
 * useful thing this file does. An agent that cannot find an auth document assumes one is
 * hidden and goes looking: it probes `/.well-known/oauth-authorization-server`, retries
 * on 401s it will never receive, or asks its user for an API key that does not exist.
 * This file ends that search in one request.
 *
 * That is also why the OAuth documents are absent rather than published empty.
 * `/.well-known/oauth-protected-resource` asserts that a resource *is* OAuth-protected
 * and names the servers that issue tokens for it; publishing one with no authorization
 * server would describe a gate that this origin does not have, and every agent that
 * believed it would be worse off than one that read this file. The same goes for an
 * authorization-server document without an authorization server behind it. If protected
 * endpoints are ever added, both belong here alongside this file — see
 * `docs/agent-discovery.md`.
 */
const body = `# auth.md

${site.name} publishes this file so an agent can stop looking for an authentication flow.
There is not one.

## Audience

Automated clients: AI agents, crawlers, MCP servers acting for a user, and scripts. People
should use ${absoluteUrl('/contact')} instead.

## Authentication

**None.** Every documented endpoint on ${site.url} is public, unauthenticated, and
read-only. There is no registration, no API key, no OAuth client, no token, and no account
to create. Nothing here returns 401 or 403 to a well-behaved client, so nothing here needs
a credential.

There is deliberately no \`/.well-known/oauth-protected-resource\` and no
\`/.well-known/oauth-authorization-server\`. Those documents describe a protected resource
and the servers that issue tokens for it; this origin has neither, and an empty or
placeholder copy would send agents through a flow that cannot complete.

## What you may do

- Fetch any page, in HTML or as markdown. Send \`Accept: text/markdown\` for the page text
  without the layout.
- Read, quote, and cite the content, with attribution to ${site.name} and a link to the
  canonical URL.
- Index the pages, and train on them. ${absoluteUrl('/robots.txt')} names each crawler and
  states its access explicitly rather than leaving it to a wildcard.

## How to behave

- Send a \`User-Agent\` that identifies the client and carries a contact URL or address. An
  anonymous, high-rate client is indistinguishable from an attack and gets treated as one.
- Fetch ${absoluteUrl(LLMS_PATH)} first. One request tells you which page you want; it
  saves you a crawl and it saves this origin the traffic.
- Respect \`Cache-Control\`, and re-fetch on the \`max-age\` it gives rather than on a timer
  of your own.
- Keep concurrency modest. This is a small origin serving a consulting business, not a
  content API with capacity to spare.

## Where the machine-readable documents are

- Site index: ${absoluteUrl(LLMS_PATH)}
- OpenAPI description: ${absoluteUrl(OPENAPI_PATH)}
- API catalog: ${absoluteUrl(API_CATALOG_PATH)}
- Capability manifest: ${absoluteUrl(AI_CATALOG_PATH)}
- Agent skills: ${absoluteUrl(AGENT_SKILLS_INDEX_PATH)}

## Contact

Security reports: ${site.securityEmail}, per ${absoluteUrl('/.well-known/security.txt')}.
Anything else, including a request for access this file does not describe:
${absoluteUrl('/contact')}.
`;

export function GET() {
	return new Response(body, { headers: discoveryHeaders(MARKDOWN_CONTENT_TYPE) });
}
