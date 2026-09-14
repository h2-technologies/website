import { JSON_CONTENT_TYPE, agentDocuments, discoveryHeaders } from '$lib/agent-discovery';
import { absoluteUrl, nap, site } from '$lib/site';

export const prerender = false;

/**
 * `/.well-known/ai-catalog.json`, the Agentic Resource Discovery manifest.
 *
 * ARD asks a publisher to describe its capabilities in a form a registry can index
 * semantically: a stable URN per entry, the media type behind it, and a handful of
 * questions the entry actually answers. That last part is the reason this file is not
 * just `sitemap.xml` in JSON — the queries are what a registry embeds to decide whether a
 * question belongs to this site at all, so they are written the way someone would ask
 * rather than as keyword bait.
 *
 * The entries come from `agentDocuments`, the same array the API catalog and `/llms.txt`
 * draw on, so a document added or moved is advertised consistently or not at all.
 */
const identifier = new URL(site.url).hostname;

const body = JSON.stringify(
	{
		specVersion: '1.0',
		host: {
			identifier,
			displayName: site.name,
			description: site.description,
			url: site.url,
			// Where the entity is, in the same words as the page footer and the schema graph.
			// A registry that resolves "an IT consultancy near Ashland, Ohio" to this manifest
			// needs the location to be in it.
			location: `${nap.addressLocality}, ${nap.addressRegionName}, ${nap.addressCountry}`,
			contact: absoluteUrl('/contact')
		},
		entries: agentDocuments.map((document) => ({
			identifier: `urn:air:${identifier}:${document.namespace}:${document.name}`,
			displayName: document.displayName,
			description: document.description,
			type: document.type,
			// Exactly one of `url` or `data` per entry, and every document listed here is
			// fetchable, so it is always `url`. Inlining a copy as `data` would create a second
			// version of a file that is already one request away and free to keep current.
			url: document.href.startsWith('/') ? absoluteUrl(document.href) : document.href,
			representativeQueries: document.queries
		}))
	},
	null,
	'\t'
);

export function GET() {
	return new Response(body, { headers: discoveryHeaders(JSON_CONTENT_TYPE) });
}
