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
 * here advertises a resource this site does not publish: there is no HTTP API behind
 * these pages, so there is no `api-catalog` (RFC 9727) and no `service-desc`. If an API
 * is ever published, that is the point at which those belong, pointing at a real catalog
 * at `/.well-known/api-catalog` rather than at an empty one added in advance.
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
 */
import { absoluteUrl } from '$lib/site';

/** A media type with no parameters, which is what the `type` link parameter takes. */
const HTML_TYPE = 'text/html';
const MARKDOWN_TYPE = 'text/markdown';

/**
 * The same on every page, so it is built once. `/llms.txt` and `/sitemap.xml` are the
 * only two resources here that describe the site as a whole; `/robots.txt` and
 * `/.well-known/security.txt` are found at their own well-known locations and have no
 * registered relation type to be advertised under.
 */
const siteLinks = [
	`<${absoluteUrl('/llms.txt')}>; rel="service-doc"; type="text/plain"`,
	`<${absoluteUrl('/sitemap.xml')}>; rel="index"; type="application/xml"`
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
