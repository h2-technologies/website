/**
 * `Link` response headers (RFC 8288) that tell an agent where this site's
 * machine-readable resources are.
 *
 * A page states its canonical URL in its `<head>` already, but only for a client that
 * parses the document. The headers answer the same question from the response head alone,
 * which is what a `HEAD` request, a crawler budgeting a fetch, and — the case that matters
 * here — the markdown representation get. Markdown has no `<head>`: an agent that
 * negotiates it receives the page's prose and nothing else, so without these headers the
 * canonical URL and the rest of the site are simply not reachable from what it was
 * handed.
 *
 * Each relation is registered with IANA and used for what it was registered for. Nothing
 * here advertises a resource this site does not publish, which is the rule that decides
 * what belongs in the list rather than how impressive the list looks.
 *
 *   canonical ..... the one URL this page answers at, per the canonical policy the
 *                   `<link rel="canonical">` tag and `sitemap.xml` already state. Sent
 *                   only for a page that exists; see below.
 *   alternate ..... the same URL in the other representation. Content negotiation is
 *                   otherwise invisible — a client that never sends `Accept:
 *                   text/markdown` has no way to learn that it would have worked — and
 *                   an alternate whose target is the context URL with a different media
 *                   type is how that fact is stated in band.
 *   service-doc ... `/llms.txt`, the written map of the site: what it offers, where each
 *                   page is, and how to ask for markdown. RFC 8631 defines `service-doc`
 *                   as documentation intended to be read rather than executed, which is
 *                   what that file is.
 *   index ......... `/sitemap.xml`, the complete list of canonical URLs.
 *   api-catalog ... `/.well-known/api-catalog`, the RFC 9727 list of APIs this publisher
 *                   offers. There is one, and it is this site: every page answers at one
 *                   URL in two representations, over GET, with no key and no session.
 *   service-desc .. `/openapi.json`, the same surface described for a machine.
 *   service-meta .. `/.well-known/ai-catalog.json`, metadata about the service: which
 *                   resources exist and what question each one answers.
 *   describedby ... `/.well-known/agent-skills/index.json`, the skills published for
 *                   working with this site.
 *   status ........ `/health`, whether the origin is currently serving.
 *
 * The last five were deliberately absent until the documents behind them existed, on the
 * principle that a relation pointing at nothing costs a client a fetch and a retry and
 * teaches it that this site's headers are not worth following. They are here now because
 * the documents are; see `src/lib/agent-discovery.ts`, which declares each path once and
 * is where the routes serving them read it from too.
 */
import {
	AGENT_SKILLS_INDEX_PATH,
	AI_CATALOG_PATH,
	API_CATALOG_PATH,
	HEALTH_CONTENT_TYPE,
	HEALTH_PATH,
	JSON_CONTENT_TYPE,
	LINKSET_CONTENT_TYPE,
	OPENAPI_CONTENT_TYPE,
	OPENAPI_PATH
} from '$lib/agent-discovery';
import { absoluteUrl } from '$lib/site';

/** A media type with no parameters, which is what the `type` link parameter takes. */
const HTML_TYPE = 'text/html';
const MARKDOWN_TYPE = 'text/markdown';

/**
 * The same on every page, so it is built once. `/robots.txt` and
 * `/.well-known/security.txt` are absent: both are found at their own well-known
 * locations and neither has a registered relation type to be advertised under.
 */
const siteLinks = [
	`<${absoluteUrl('/llms.txt')}>; rel="service-doc"; type="text/plain"`,
	`<${absoluteUrl('/sitemap.xml')}>; rel="index"; type="application/xml"`,
	`<${absoluteUrl(API_CATALOG_PATH)}>; rel="api-catalog"; type="${LINKSET_CONTENT_TYPE}"`,
	`<${absoluteUrl(OPENAPI_PATH)}>; rel="service-desc"; type="${OPENAPI_CONTENT_TYPE}"`,
	`<${absoluteUrl(AI_CATALOG_PATH)}>; rel="service-meta"; type="${JSON_CONTENT_TYPE}"`,
	`<${absoluteUrl(AGENT_SKILLS_INDEX_PATH)}>; rel="describedby"; type="${JSON_CONTENT_TYPE}"`,
	`<${absoluteUrl(HEALTH_PATH)}>; rel="status"; type="${HEALTH_CONTENT_TYPE}"`
];

/**
 * The link values for one page, in the order they are sent.
 *
 * Both per-page values are derived from the response rather than passed in, so neither
 * can describe a response the site did not actually send.
 */
function discoveryLinks(response: Response, canonical: string): string[] {
	// The alternate is whichever representation this response is not. Reading it off the
	// content type rather than off the request means a page that fell back to HTML cannot
	// offer HTML as its own alternate.
	const servedMarkdown =
		response.headers.get('content-type')?.toLowerCase().startsWith(MARKDOWN_TYPE) ?? false;
	const alternate = `<${canonical}>; rel="alternate"; type="${servedMarkdown ? HTML_TYPE : MARKDOWN_TYPE}"`;

	// `rel="canonical"` asserts that this URL is the address of the resource, which is only
	// true where there is one. The error page answers under whatever URL was mistyped and
	// says `noindex` in its own head; naming that URL canonical would contradict it and
	// offer a crawler a 404 to index. The site-wide links below stay either way — an agent
	// that has just landed on a 404 is precisely the one that needs the map.
	return response.ok
		? [`<${canonical}>; rel="canonical"`, alternate, ...siteLinks]
		: [alternate, ...siteLinks];
}

/**
 * Prepends the discovery links to whatever `Link` header the response already carries.
 *
 * SvelteKit fills that header with one preload hint per hydration chunk — around twenty
 * of them, well over a kilobyte. Those are per-build advice that a browser acts on and
 * everything else ignores; these are the site's stable relations. Putting the stable ones
 * first keeps them in front of any consumer or intermediary that reads only the start of
 * a long field value, and costs the preload hints nothing: a browser applies them
 * wherever in the field they appear.
 */
export function addDiscoveryLinks(response: Response, canonical: string): void {
	const existing = response.headers.get('link');
	const links = discoveryLinks(response, canonical);

	response.headers.set('link', [...links, existing].filter(Boolean).join(', '));
}
