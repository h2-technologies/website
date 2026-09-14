import { HEALTH_CONTENT_TYPE } from '$lib/agent-discovery';
import { site } from '$lib/site';

export const prerender = false;

/**
 * Health check in the `application/health+json` shape from
 * draft-inadarei-api-health-check, so the `status` link in the API catalog and the `Link`
 * headers points at something a client can parse rather than at a page it has to read.
 *
 * The answer is deliberately thin. Reaching this handler means the Node process is up,
 * the adapter is routing, and the container is accepting connections, which is the whole
 * of what this origin can fail at — it has no database, no queue, and no upstream API to
 * report on. A richer body would have to invent dependencies to check.
 *
 * Nothing version-specific is published. A build identifier here would tell an attacker
 * which dependency advisories apply before they have to probe for them, and it would tell
 * an operator nothing they cannot get from the deployment they ran.
 */
const body = JSON.stringify({
	status: 'pass',
	serviceId: new URL(site.url).hostname,
	description: 'H2 Technologies LLC website origin'
});

export function GET() {
	return new Response(body, {
		headers: {
			'access-control-allow-origin': '*',
			// A cached health response describes the moment it was stored, not the origin
			// asking the question now, which is the one thing a health check must never do.
			'cache-control': 'no-store',
			'content-type': HEALTH_CONTENT_TYPE
		}
	});
}
