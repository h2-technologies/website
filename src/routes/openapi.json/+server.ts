import {
	AGENT_SKILLS_INDEX_PATH,
	AI_CATALOG_PATH,
	API_CATALOG_PATH,
	AUTH_PATH,
	HEALTH_CONTENT_TYPE,
	HEALTH_PATH,
	JSON_CONTENT_TYPE,
	LINKSET_CONTENT_TYPE,
	LLMS_PATH,
	OPENAPI_CONTENT_TYPE,
	OPENAPI_PATH,
	SECURITY_TXT_PATH,
	SITEMAP_PATH,
	discoveryHeaders
} from '$lib/agent-discovery';
import { locationSlugs, postSlugs, serviceSlugs, staticPagePaths } from '$lib/pages';
import { nap, site } from '$lib/site';

export const prerender = false;

/**
 * OpenAPI 3.1 description of everything this origin serves over GET.
 *
 * The "API" is the site. Every page answers at one URL in two representations, chosen by
 * the request's `Accept` header, and the metadata documents around it are fetched the
 * same way. Writing that down in OpenAPI is what lets a client know the markdown
 * representation exists, know which paths are valid before it requests one, and know what
 * media type each answer arrives as — none of which is discoverable by fetching the home
 * page and guessing.
 *
 * Collection routes are described as one path item with the slug enumerated, rather than
 * as forty separate path items. The enumeration comes from the same arrays that define
 * the routes, so this document cannot offer a slug that 404s, and the file stays small
 * enough to be worth fetching.
 *
 * Nothing is described that this origin does not answer: there are no write operations,
 * no authenticated operations, and no endpoints behind a key, because there are none.
 */

/** The `Accept` header is the only input a page route takes. */
const acceptParameter = {
	name: 'Accept',
	in: 'header',
	required: false,
	description:
		'`text/markdown` returns the page text without the HTML layout. Anything else, including an absent or wildcard header, returns the HTML.',
	schema: { type: 'string', default: 'text/html' },
	examples: {
		html: { value: 'text/html', summary: 'The rendered page' },
		markdown: { value: 'text/markdown', summary: 'The same page as markdown' }
	}
};

const pageResponse = {
	'200': {
		description: 'The page, in whichever representation the request asked for.',
		headers: {
			Vary: {
				description: 'Always includes `Accept`, because the body depends on it.',
				schema: { type: 'string' }
			},
			'x-markdown-tokens': {
				description: 'Estimated token count of the markdown body. Markdown responses only.',
				schema: { type: 'integer' }
			},
			'x-original-tokens': {
				description: 'Estimated token count of the HTML the markdown was built from.',
				schema: { type: 'integer' }
			}
		},
		content: {
			'text/html': { schema: { type: 'string' } },
			'text/markdown': { schema: { type: 'string' } }
		}
	}
};

const notFound = {
	'404': {
		description: 'No page at this path.',
		content: { 'text/html': { schema: { type: 'string' } } }
	}
};

/** A page that exists at a fixed path. */
const page = (summary: string, description: string) => ({
	get: {
		summary,
		description,
		tags: ['Pages'],
		parameters: [acceptParameter],
		responses: pageResponse
	}
});

/** A collection route, with every slug it answers enumerated in the path parameter. */
const collection = (summary: string, description: string, slugs: string[]) => ({
	get: {
		summary,
		description,
		tags: ['Pages'],
		parameters: [
			{
				name: 'slug',
				in: 'path',
				required: true,
				description: 'One of the published slugs. Any other value returns 404.',
				schema: { type: 'string', enum: slugs }
			},
			acceptParameter
		],
		responses: { ...pageResponse, ...notFound }
	}
});

/** A metadata document, which has one representation and takes no input. */
const document = (summary: string, description: string, contentType: string) => ({
	get: {
		summary,
		description,
		tags: ['Metadata'],
		responses: {
			'200': {
				description: summary,
				content: { [contentType.split(';')[0]]: { schema: { type: 'string' } } }
			}
		}
	}
});

const pageSummaries: Record<string, [string, string]> = {
	'/': ['Home page', 'What H2 Technologies does, for whom, and how to start a conversation.'],
	'/about': ['About', 'The company, its founder, and how technical work is scoped.'],
	'/services': ['Service index', 'Every consulting service, each linking to its own page.'],
	'/locations': ['Service area index', 'Every Ohio service area page.'],
	'/resources': ['Guide index', 'Every published technical guide.'],
	'/faq': ['Frequently asked questions', 'Pricing model, contracts, and how engagements run.'],
	'/contact': ['Contact', 'Hosted scoping form, booking page, phone, and address.'],
	'/routing': [
		'AS17290 routing policy',
		'RPKI, IRR, and LOA validation rules, filtering behaviour, and peering and transit requirements.'
	]
};

const paths = {
	...Object.fromEntries(staticPagePaths.map((path) => [path, page(...pageSummaries[path])])),
	'/services/{slug}': collection(
		'Service page',
		'One consulting service: who it is for, what it covers, how it runs, and its own FAQ.',
		serviceSlugs
	),
	'/locations/{slug}': collection(
		'Service area page',
		'One Ohio service area, either a capability across the state or a community across capabilities.',
		locationSlugs
	),
	'/resources/{slug}': collection(
		'Technical guide',
		'One published guide on networking, security, or choosing business technology.',
		postSlugs
	),
	[LLMS_PATH]: document(
		'Site index for assistants',
		'Every public page grouped by kind, each with its own one-line summary, in the llmstxt.org format.',
		'text/plain'
	),
	[SITEMAP_PATH]: document(
		'XML sitemap',
		'Every crawlable URL with its last modified date.',
		'application/xml'
	),
	'/robots.txt': document(
		'Crawler policy',
		'Which crawlers may fetch this site. Every group is allowed the same pages a person is served.',
		'text/plain'
	),
	[SECURITY_TXT_PATH]: document(
		'Security contact',
		'RFC 9116 contact details for reporting a vulnerability.',
		'text/plain'
	),
	[API_CATALOG_PATH]: document(
		'API catalog',
		'RFC 9727 link set naming this API and where its description, documentation, metadata, and status live.',
		LINKSET_CONTENT_TYPE
	),
	[AI_CATALOG_PATH]: document(
		'ARD capability manifest',
		'Agentic Resource Discovery entries for each machine-readable resource, with the questions each one answers.',
		JSON_CONTENT_TYPE
	),
	[AGENT_SKILLS_INDEX_PATH]: document(
		'Agent skills index',
		'Skills published for this site, each with a SHA-256 digest of the SKILL.md it points at.',
		JSON_CONTENT_TYPE
	),
	[AUTH_PATH]: document(
		'Agent authentication policy',
		'How agents authenticate here, which is that they do not: every documented endpoint is public and read-only.',
		'text/markdown'
	),
	[OPENAPI_PATH]: document(
		'This document',
		'The OpenAPI description of this API.',
		OPENAPI_CONTENT_TYPE
	),
	[HEALTH_PATH]: document(
		'Origin health',
		'Whether this origin is serving, in the application/health+json shape.',
		HEALTH_CONTENT_TYPE
	)
};

const body = JSON.stringify(
	{
		openapi: '3.1.1',
		info: {
			title: `${site.name} content API`,
			summary:
				'Every page of h2technologiesllc.com as HTML or markdown, plus its metadata documents.',
			description:
				'Read-only HTTP surface of the H2 Technologies LLC website. Pages are negotiated: send `Accept: text/markdown` for the page text without the HTML layout, or take the default HTML. There is no authentication, no rate limit beyond ordinary abuse protection, and no write operation.',
			version: '1.0.0',
			contact: { name: site.name, url: `${site.url}/contact`, email: site.securityEmail }
		},
		servers: [{ url: site.url, description: `Production origin in ${nap.addressRegionName}` }],
		tags: [
			{ name: 'Pages', description: 'Content pages, negotiable as HTML or markdown.' },
			{ name: 'Metadata', description: 'Machine-readable documents describing this site.' }
		],
		paths
	},
	null,
	'\t'
);

export function GET() {
	return new Response(body, { headers: discoveryHeaders(OPENAPI_CONTENT_TYPE) });
}
