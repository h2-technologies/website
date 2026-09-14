/**
 * The agent-facing surface of this site, declared once.
 *
 * Five separate specifications want to be told the same three things: where the
 * machine-readable documents are, what media type each answers with, and what question
 * each one exists to answer. `/.well-known/api-catalog` (RFC 9727),
 * `/.well-known/ai-catalog.json` (ARD), `/openapi.json`, the `Link` response headers
 * (RFC 8288, assembled in `$lib/server/discovery-links.ts`), and `/llms.txt` all read
 * from here rather than from five hand-written copies, for the same reason `sitemap.xml`
 * is built from the route data: a list maintained in five places advertises a URL that
 * 404s the first time one of them is missed.
 *
 * Nothing here describes a capability this site does not have. An agent that follows one
 * of these links reaches a document that exists and is current, which is the only thing
 * that makes the advertisement worth publishing at all.
 */

export const API_CATALOG_PATH = '/.well-known/api-catalog';
export const AI_CATALOG_PATH = '/.well-known/ai-catalog.json';
export const AGENT_SKILLS_INDEX_PATH = '/.well-known/agent-skills/index.json';
export const OPENAPI_PATH = '/openapi.json';
export const AUTH_PATH = '/auth.md';
export const HEALTH_PATH = '/health';
export const LLMS_PATH = '/llms.txt';
export const SITEMAP_PATH = '/sitemap.xml';
export const SECURITY_TXT_PATH = '/.well-known/security.txt';

/**
 * `application/linkset+json` is RFC 9264's media type for a link set; RFC 9727 serves the
 * API catalog as one. The `profile` parameter RFC 9727 shows in its examples is left off:
 * it is informative, and a bare type is what every client that only compares the media
 * type will recognise.
 */
export const LINKSET_CONTENT_TYPE = 'application/linkset+json';

/** `+json` is a structured suffix (RFC 6839), so any JSON client can read this. */
export const OPENAPI_CONTENT_TYPE = 'application/openapi+json';

/** draft-inadarei-api-health-check's media type for a health response. */
export const HEALTH_CONTENT_TYPE = 'application/health+json';

export const JSON_CONTENT_TYPE = 'application/json';

/**
 * Headers shared by every discovery document.
 *
 * `Access-Control-Allow-Origin: *` is what makes these readable from a browser-based
 * agent at all: without it the fetch is made and then thrown away by the same-origin
 * policy before the caller sees it. It is safe here because every one of these documents
 * is public, unauthenticated, and identical for every requester — there is no session for
 * a cross-origin read to ride on.
 */
export function discoveryHeaders(contentType: string, maxAge = 3600) {
	return {
		'access-control-allow-origin': '*',
		'cache-control': `public, max-age=${maxAge}`,
		'content-type': contentType
	};
}

/**
 * A document an agent can fetch, with the media type it is actually served as and the
 * questions it exists to answer.
 *
 * `queries` are written the way a person would ask, because that is what a registry
 * embeds to decide which entry a question belongs to. ARD asks for two to five per entry;
 * padding the list with paraphrases of one question makes the entry match more loosely,
 * not better, so each entry lists only questions it genuinely answers.
 */
export type AgentDocument = {
	/** Site-relative path, or an absolute URL for a resource hosted elsewhere. */
	href: string;
	/** ARD namespace segment in `urn:air:<fqdn>:<namespace>:<name>`. */
	namespace: string;
	name: string;
	displayName: string;
	type: string;
	description: string;
	queries: string[];
};

export const agentDocuments: AgentDocument[] = [
	{
		href: LLMS_PATH,
		namespace: 'content',
		name: 'site-index',
		displayName: 'Site index for assistants',
		type: 'text/plain',
		description:
			'Every public page of h2technologiesllc.com, grouped into services, service areas, guides, and company pages, each with its own one-line summary.',
		queries: [
			'What does H2 Technologies do?',
			'What pages are on the H2 Technologies website?',
			'Which IT services does H2 Technologies offer in Ohio?'
		]
	},
	{
		href: '/',
		namespace: 'content',
		name: 'pages-as-markdown',
		displayName: 'Every page as markdown',
		type: 'text/markdown',
		description:
			'Any page on this site returns its own text as markdown when the request carries `Accept: text/markdown`, at the same URL that serves the HTML. Responses include `x-markdown-tokens`, an estimate of the length.',
		queries: [
			'Fetch the H2 Technologies BGP consulting page as markdown',
			'Read this page without the HTML layout',
			'How long is this page in tokens?'
		]
	},
	{
		href: OPENAPI_PATH,
		namespace: 'api',
		name: 'openapi',
		displayName: 'OpenAPI description of the public HTTP surface',
		type: OPENAPI_CONTENT_TYPE,
		description:
			'OpenAPI 3.1 description of every public GET endpoint: the pages in both representations, the metadata documents, and the health endpoint.',
		queries: [
			'What HTTP endpoints does h2technologiesllc.com expose?',
			'Which URLs on this site return JSON?',
			'How do I request the markdown version of a page?'
		]
	},
	{
		href: API_CATALOG_PATH,
		namespace: 'api',
		name: 'catalog',
		displayName: 'API catalog',
		type: LINKSET_CONTENT_TYPE,
		description:
			'RFC 9727 catalog linking the site API to its description, documentation, metadata, and status endpoint.',
		queries: [
			'Does h2technologiesllc.com publish an API catalog?',
			'Where is the OpenAPI spec for this site?'
		]
	},
	{
		href: AGENT_SKILLS_INDEX_PATH,
		namespace: 'skills',
		name: 'index',
		displayName: 'Agent skills published by H2 Technologies',
		type: JSON_CONTENT_TYPE,
		description:
			'Skills an agent can load to read the content of this site, to prepare a BGP peering request that meets the published AS17290 policy, and to scope a consulting engagement.',
		queries: [
			'What agent skills does H2 Technologies publish?',
			'How should an agent work with the H2 Technologies site?',
			'Is there a skill for requesting BGP peering with AS17290?'
		]
	},
	{
		href: AUTH_PATH,
		namespace: 'auth',
		name: 'policy',
		displayName: 'Agent authentication and access policy',
		type: 'text/markdown',
		description:
			'How agents authenticate with this site, which is: they do not. Every documented endpoint is public, unauthenticated, and read-only.',
		queries: [
			'Do I need credentials to read h2technologiesllc.com?',
			'How does an agent register with H2 Technologies?',
			'Is there an API key for this site?'
		]
	},
	{
		href: '/routing',
		namespace: 'network',
		name: 'as17290-routing-policy',
		displayName: 'AS17290 BGP routing policy',
		type: 'text/html',
		description:
			'The published routing policy for AS17290: RPKI, IRR, and LOA validation rules, filtering behaviour, and the requirements a peering or transit request has to meet before it is opened.',
		queries: [
			"What are AS17290's peering requirements?",
			'Does AS17290 validate RPKI?',
			'What AS-SET should I filter AS17290 on?',
			'How do I request transit from AS17290?'
		]
	},
	{
		href: '/contact',
		namespace: 'contact',
		name: 'engagement',
		displayName: 'Contact and consultation booking',
		type: 'text/html',
		description:
			'Phone, address, and hours for H2 Technologies, the hosted scoping form, and the Microsoft Bookings page that writes a consultation straight onto the calendar.',
		queries: [
			'How do I contact H2 Technologies?',
			'Book a consultation with H2 Technologies',
			"What are H2 Technologies' business hours?"
		]
	},
	{
		href: SITEMAP_PATH,
		namespace: 'content',
		name: 'sitemap',
		displayName: 'XML sitemap',
		type: 'application/xml',
		description: 'Every crawlable URL on this site with its last modified date.',
		queries: [
			'List every URL on h2technologiesllc.com',
			'When was the H2 Technologies site last updated?'
		]
	},
	{
		href: SECURITY_TXT_PATH,
		namespace: 'security',
		name: 'contact',
		displayName: 'Security contact',
		type: 'text/plain',
		description: 'RFC 9116 security contact for reporting a vulnerability in this site.',
		queries: [
			'Who do I report a security issue to at H2 Technologies?',
			'Does h2technologiesllc.com have a security.txt?'
		]
	}
];
