/**
 * Content negotiation between the HTML a browser wants and the markdown an agent wants.
 *
 * The same URL serves both: there is no `.md` twin, no query parameter, and no separate
 * inventory to keep in step with `sitemap.xml`. A client states a preference in `Accept`
 * and gets the representation it asked for, which is what HTTP has always offered and
 * what Cloudflare's Markdown for Agents does at the edge for sites behind it. Doing it in
 * the application means the behaviour belongs to the site rather than to whatever sits in
 * front of it, and it is testable here.
 *
 * HTML stays the default. Markdown is served only to a client that asks for it *and*
 * prefers it to HTML, which is why the quality values below are compared rather than
 * scanned for a substring: every browser sends a wildcard range somewhere in its `Accept`
 * header, and a request that merely tolerates markdown is not a request for it.
 */

export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';

/**
 * `text/markdown` is the registered type (RFC 7763). `text/x-markdown` is the older
 * spelling, still emitted by some clients, and answering it costs nothing.
 */
const MARKDOWN_MEDIA_TYPES = [
	['text', 'markdown'],
	['text', 'x-markdown']
] as const;

type MediaRange = {
	type: string;
	subtype: string;
	quality: number;
};

type Preference = {
	quality: number;
	/** 2 for an exact type and subtype, 1 for a subtype wildcard, 0 for a full wildcard. */
	specificity: number;
};

const NO_PREFERENCE: Preference = { quality: 0, specificity: -1 };

function parseAcceptHeader(header: string): MediaRange[] {
	const ranges: MediaRange[] = [];

	for (const entry of header.split(',')) {
		const [rawRange, ...parameters] = entry.split(';').map((part) => part.trim());
		const [type, subtype] = rawRange.toLowerCase().split('/');
		if (!type || !subtype) continue;

		const weight = parameters.find((parameter) => /^q=/i.test(parameter));
		const parsed = weight === undefined ? 1 : Number.parseFloat(weight.slice(2));
		const quality = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 1;

		ranges.push({ type, subtype, quality });
	}

	return ranges;
}

/**
 * The quality a client assigned to one media type. Per RFC 9110 the most specific
 * matching range wins even when a broader one carries a higher weight, so
 * `text/html;q=0.1` alongside a wildcard range is a request that would rather not have it.
 */
function preferenceFor(ranges: MediaRange[], type: string, subtype: string): Preference {
	let best = NO_PREFERENCE;

	for (const range of ranges) {
		let specificity = -1;
		if (range.type === type && range.subtype === subtype) specificity = 2;
		else if (range.type === type && range.subtype === '*') specificity = 1;
		else if (range.type === '*' && range.subtype === '*') specificity = 0;
		if (specificity === -1) continue;

		if (
			specificity > best.specificity ||
			(specificity === best.specificity && range.quality > best.quality)
		) {
			best = { quality: range.quality, specificity };
		}
	}

	return best;
}

function strongerOf(first: Preference, second: Preference): Preference {
	if (second.quality > first.quality) return second;
	if (second.quality === first.quality && second.specificity > first.specificity) return second;
	return first;
}

/**
 * Whether a request asks for markdown in preference to HTML.
 *
 * A tie goes to HTML, which is what keeps a wildcard `Accept` — curl, most link checkers,
 * and anything that simply did not think about it — on the representation the whole web
 * already knows how to read.
 */
export function prefersMarkdown(accept: string | null | undefined): boolean {
	if (!accept) return false;

	const ranges = parseAcceptHeader(accept);
	if (ranges.length === 0) return false;

	const markdown = MARKDOWN_MEDIA_TYPES.map(([type, subtype]) =>
		preferenceFor(ranges, type, subtype)
	).reduce(strongerOf, NO_PREFERENCE);
	if (markdown.quality === 0) return false;

	const html = preferenceFor(ranges, 'text', 'html');

	return (
		markdown.quality > html.quality ||
		(markdown.quality === html.quality && markdown.specificity > html.specificity)
	);
}

/**
 * An estimate, and labelled as one. Counting real tokens would mean shipping a
 * tokenizer, and every model tokenizes differently anyway; roughly four characters per
 * token is the usual approximation for English prose and is enough for a client to
 * decide whether a page fits in the budget it has left before it spends the fetch.
 */
export function estimateTokens(text: string): number {
	return Math.ceil(text.trim().length / 4);
}

function isHtml(response: Response): boolean {
	return response.headers.get('content-type')?.toLowerCase().startsWith('text/html') ?? false;
}

/**
 * Adds a field to `Vary` without repeating one already listed. Caches key on it, so an
 * HTML response that omits it is the bug that serves markdown to a browser.
 */
export function varyOn(headers: Headers, field: string): void {
	const existing = headers.get('vary');
	if (existing === '*') return;

	const fields = existing ? existing.split(',').map((value) => value.trim()) : [];
	if (fields.some((value) => value.toLowerCase() === field.toLowerCase())) return;

	headers.set('vary', [...fields, field].filter(Boolean).join(', '));
}

/** Whether this request and response are a candidate for the markdown representation. */
export function negotiatesMarkdown(request: Request, response: Response): boolean {
	if (request.method !== 'GET' && request.method !== 'HEAD') return false;
	if (!isHtml(response)) return false;
	return prefersMarkdown(request.headers.get('accept'));
}
