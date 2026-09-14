import {
	AGENT_SKILLS_INDEX_PATH,
	AI_CATALOG_PATH,
	API_CATALOG_PATH,
	HEALTH_CONTENT_TYPE,
	HEALTH_PATH,
	JSON_CONTENT_TYPE,
	LINKSET_CONTENT_TYPE,
	LLMS_PATH,
	OPENAPI_CONTENT_TYPE,
	OPENAPI_PATH,
	discoveryHeaders
} from '$lib/agent-discovery';
import { absoluteUrl, site } from '$lib/site';

export const prerender = false;

/**
 * `/.well-known/api-catalog`, the RFC 9727 list of APIs this publisher offers, expressed
 * as an RFC 9264 link set.
 *
 * There is exactly one API here and it is the site itself. Every page answers at one URL
 * in two representations — the HTML a browser asks for and the markdown an agent asks for
 * — and the metadata documents around it are read the same way, over GET, with no key and
 * no session. Listing that one honestly is the point; a catalog padded with anchors for
 * services this origin does not run would be worse than no catalog, because each entry is
 * a promise a client will try to collect on.
 *
 * The first link set object is the catalog describing itself: `item` links to each API it
 * contains, which is what RFC 9727 Appendix A shows and what lets a client enumerate the
 * catalog without understanding any of the entries. The object after it describes that
 * one API with the RFC 8631 relations — where its machine-readable description is, where
 * its documentation is, where its metadata is, and where to ask whether it is up.
 */
const body = JSON.stringify(
	{
		linkset: [
			{
				anchor: absoluteUrl(API_CATALOG_PATH),
				item: [
					{
						href: absoluteUrl('/'),
						title: `${site.name} content API`,
						type: 'text/markdown'
					}
				]
			},
			{
				anchor: absoluteUrl('/'),
				'service-desc': [
					{
						href: absoluteUrl(OPENAPI_PATH),
						title: 'OpenAPI 3.1 description of every public GET endpoint',
						type: OPENAPI_CONTENT_TYPE
					}
				],
				'service-doc': [
					{
						href: absoluteUrl(LLMS_PATH),
						title: 'Site index for assistants, with a summary of every page',
						type: 'text/plain'
					}
				],
				'service-meta': [
					{
						href: absoluteUrl(AI_CATALOG_PATH),
						title: 'Agentic Resource Discovery capability manifest',
						type: JSON_CONTENT_TYPE
					}
				],
				status: [
					{
						href: absoluteUrl(HEALTH_PATH),
						title: 'Origin health check',
						type: HEALTH_CONTENT_TYPE
					}
				],
				describedby: [
					{
						href: absoluteUrl(AGENT_SKILLS_INDEX_PATH),
						title: 'Agent skills published for this site',
						type: JSON_CONTENT_TYPE
					}
				]
			}
		]
	},
	null,
	'\t'
);

export function GET() {
	return new Response(body, { headers: discoveryHeaders(LINKSET_CONTENT_TYPE) });
}
