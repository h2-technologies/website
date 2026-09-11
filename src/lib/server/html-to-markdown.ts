/**
 * HTML to Markdown conversion for the pages this site renders.
 *
 * This exists so that an agent asking for `text/markdown` gets the page's own words
 * instead of the Tailwind-heavy markup they are wrapped in. Converting the rendered
 * HTML — rather than assembling a second, markdown-shaped copy of every page out of
 * `$lib` data — is what keeps the two representations from drifting: there is only
 * one set of copy, rendered once, and the markdown is a view of the same bytes a
 * browser receives. A page added or reworded tomorrow is negotiable the same day,
 * with nothing here to update.
 *
 * It is deliberately a converter for *this* site's output, not a general one. The
 * input is always SvelteKit's own server-rendered HTML, which is well-formed and
 * uses a small, known set of elements, so the parser below is tolerant where that
 * output can vary (void elements, self-closing SVG children, stray closing tags) and
 * indifferent to the malformed markup a general-purpose parser would have to
 * survive. Keeping it dependency-free keeps the production image at zero runtime
 * dependencies, which is the same reason `server.js` and `canonical-url.js` are
 * written the way they are.
 */

type Attributes = Record<string, string>;

type ElementNode = {
	kind: 'element';
	name: string;
	attributes: Attributes;
	children: HtmlNode[];
};

type TextNode = {
	kind: 'text';
	value: string;
};

type HtmlNode = ElementNode | TextNode;

type Context = {
	baseUrl: URL | undefined;
};

export type HtmlToMarkdownOptions = {
	/**
	 * Absolute URL of the page being converted. Relative links and image sources are
	 * resolved against it, because a markdown file is read detached from the request
	 * that produced it: `/services/bgp-consulting` means nothing once the document has
	 * been saved, quoted, or handed to another tool, while the absolute URL still
	 * resolves and matches the canonical form the rest of the site publishes.
	 */
	baseUrl?: string | URL;
};

const VOID_ELEMENTS = new Set([
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr'
]);

/** Elements whose text is not markup and must not be parsed as such. */
const RAW_TEXT_ELEMENTS = new Set(['script', 'style']);

/**
 * Subtrees that carry no prose. JSON-LD and the hydration payload live in `script`,
 * icons in `svg`; both are noise in a document whose whole purpose is to be read.
 * The structured data is not lost to an agent — it is still in the HTML, which is
 * still the default representation.
 */
const DISCARDED_ELEMENTS = new Set([
	'audio',
	'base',
	'canvas',
	'head',
	'link',
	'meta',
	'noscript',
	'object',
	'script',
	'style',
	'svg',
	'template',
	'video'
]);

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

/** Elements that break the flow of text, and so end the paragraph being collected. */
const BLOCK_ELEMENTS = new Set([
	'address',
	'article',
	'aside',
	'blockquote',
	'caption',
	'dd',
	'details',
	'dialog',
	'div',
	'dl',
	'dt',
	'fieldset',
	'figcaption',
	'figure',
	'footer',
	'form',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'header',
	'hgroup',
	'hr',
	'iframe',
	'legend',
	'li',
	'main',
	'nav',
	'ol',
	'p',
	'pre',
	'section',
	'summary',
	'table',
	'tbody',
	'td',
	'tfoot',
	'th',
	'thead',
	'tr',
	'ul'
]);

const TAG_PATTERN =
	/^<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>`]*))?)*)\s*(\/?)>/;

const ATTRIBUTE_PATTERN = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>`]+)))?/g;

/**
 * The named entities Svelte's escaping and this site's copy actually produce, plus the
 * punctuation an editor is likely to paste in. Anything outside the table is left
 * exactly as written rather than guessed at, so an unrecognised entity survives the
 * round trip instead of becoming mojibake.
 */
const NAMED_ENTITIES: Record<string, string> = {
	amp: '&',
	apos: "'",
	bull: '•',
	cent: '¢',
	copy: '©',
	dagger: '†',
	deg: '°',
	emsp: ' ',
	ensp: ' ',
	euro: '€',
	gt: '>',
	half: '½',
	harr: '↔',
	hellip: '…',
	laquo: '«',
	larr: '←',
	ldquo: '“',
	lsquo: '‘',
	lt: '<',
	mdash: '—',
	middot: '·',
	minus: '−',
	ndash: '–',
	nbsp: ' ',
	para: '¶',
	permil: '‰',
	pound: '£',
	quot: '"',
	raquo: '»',
	rarr: '→',
	rdquo: '”',
	reg: '®',
	rsquo: '’',
	sect: '§',
	shy: '',
	thinsp: ' ',
	times: '×',
	trade: '™'
};

function decodeEntities(value: string): string {
	if (!value.includes('&')) return value;

	return value.replace(/&(#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]*);/gi, (entity, body: string) => {
		if (body.startsWith('#')) {
			const hex = body[1] === 'x' || body[1] === 'X';
			const code = Number.parseInt(hex ? body.slice(2) : body.slice(1), hex ? 16 : 10);
			// Lone surrogates and out-of-range code points would throw, so they stay written
			// as they arrived.
			if (!Number.isInteger(code) || code <= 0 || code > 0x10ffff) return entity;
			if (code >= 0xd800 && code <= 0xdfff) return entity;
			return String.fromCodePoint(code);
		}

		return NAMED_ENTITIES[body.toLowerCase()] ?? entity;
	});
}

function parseAttributes(source: string): Attributes {
	const attributes: Attributes = {};
	if (!source.trim()) return attributes;

	for (const match of source.matchAll(ATTRIBUTE_PATTERN)) {
		const [, name, doubleQuoted, singleQuoted, unquoted] = match;
		const value = doubleQuoted ?? singleQuoted ?? unquoted ?? '';
		attributes[name.toLowerCase()] = decodeEntities(value);
	}

	return attributes;
}

function parse(html: string): HtmlNode[] {
	const root: ElementNode = { kind: 'element', name: '#document', attributes: {}, children: [] };
	const stack: ElementNode[] = [root];
	let index = 0;

	const append = (node: HtmlNode) => stack[stack.length - 1].children.push(node);
	const appendText = (value: string) => {
		if (value) append({ kind: 'text', value: decodeEntities(value) });
	};

	while (index < html.length) {
		const start = html.indexOf('<', index);

		if (start === -1) {
			appendText(html.slice(index));
			break;
		}

		appendText(html.slice(index, start));

		// Svelte marks hydration boundaries with HTML comments, so a document holds many
		// more of them than its source suggests. All of them are dropped.
		if (html.startsWith('<!--', start)) {
			const end = html.indexOf('-->', start + 4);
			index = end === -1 ? html.length : end + 3;
			continue;
		}

		if (html.startsWith('<!', start) || html.startsWith('<?', start)) {
			const end = html.indexOf('>', start);
			index = end === -1 ? html.length : end + 1;
			continue;
		}

		const tag = TAG_PATTERN.exec(html.slice(start));
		if (!tag) {
			// A bare `<` in text. Emit it and move on rather than losing the character.
			appendText('<');
			index = start + 1;
			continue;
		}

		const [matched, closing, rawName, rawAttributes, selfClosing] = tag;
		const name = rawName.toLowerCase();
		index = start + matched.length;

		if (closing) {
			for (let depth = stack.length - 1; depth > 0; depth -= 1) {
				if (stack[depth].name === name) {
					stack.length = depth;
					break;
				}
			}
			continue;
		}

		const element: ElementNode = {
			kind: 'element',
			name,
			attributes: parseAttributes(rawAttributes),
			children: []
		};
		append(element);

		if (RAW_TEXT_ELEMENTS.has(name)) {
			const rest = html.slice(index);
			const end = new RegExp(`</${name}\\s*>`, 'i').exec(rest);
			element.children.push({ kind: 'text', value: end ? rest.slice(0, end.index) : rest });
			index += end ? end.index + end[0].length : rest.length;
			continue;
		}

		if (!selfClosing && !VOID_ELEMENTS.has(name)) stack.push(element);
	}

	return root.children;
}

function isElement(node: HtmlNode): node is ElementNode {
	return node.kind === 'element';
}

function isDiscarded(node: ElementNode): boolean {
	if (DISCARDED_ELEMENTS.has(node.name)) return true;
	// Content hidden from assistive technology is decorative, and a markdown reader is in
	// the same position as a screen reader: it receives the text and none of the visual
	// scaffolding that explains it. On this site that is the breadcrumb separators, the
	// arrow glyphs on cards, and the step numbers printed beside headings that an ordered
	// list already numbers — keeping the last of those would number every item twice.
	if (node.attributes['aria-hidden'] === 'true') return true;
	const hidden = node.attributes.hidden;
	return hidden !== undefined && hidden !== 'false';
}

function findElement(nodes: HtmlNode[], name: string): ElementNode | undefined {
	for (const node of nodes) {
		if (!isElement(node)) continue;
		if (node.name === name) return node;
		const nested = findElement(node.children, name);
		if (nested) return nested;
	}

	return undefined;
}

function childElements(node: ElementNode, name: string): ElementNode[] {
	return node.children.filter(
		(child): child is ElementNode => isElement(child) && child.name === name
	);
}

function collapse(value: string): string {
	return value.replace(/\s+/g, ' ');
}

/**
 * Escapes the characters that would otherwise be read as markup. Only the inline
 * markers are handled here; the ones that matter solely at the start of a line are
 * escaped in `escapeLineStarts` once the text has been placed in a block, so that
 * this function can be applied to text that is about to become a heading or a list
 * item without escaping the marker that makes it one.
 */
function escapeInline(value: string): string {
	return value.replace(/([\\`*_[\]])/g, '\\$1');
}

function escapeLineStarts(value: string): string {
	return value.replace(/^(\s*)([#>+|-])/gm, '$1\\$2').replace(/^(\s*)(\d+)([.)])/gm, '$1$2\\$3');
}

function tidy(value: string): string {
	return value
		.split('\n')
		.map((line) => line.replace(/[^\S\n]+/g, ' ').trim())
		.join('\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

function rawText(node: HtmlNode): string {
	if (node.kind === 'text') return node.value;
	if (isDiscarded(node)) return '';
	return node.children.map(rawText).join('');
}

function resolveUrl(value: string, context: Context): string {
	const href = value.trim();
	if (!href || !context.baseUrl) return href;

	try {
		return new URL(href, context.baseUrl).href;
	} catch {
		return href;
	}
}

function formatUrl(value: string): string {
	// Angle brackets are the only way to write a destination containing whitespace or
	// unbalanced parentheses without the link silently ending early.
	return /[\s()<>]/.test(value) ? `<${value.replace(/([<>])/g, '\\$1')}>` : value;
}

function wrap(inner: string, marker: string): string {
	const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(inner);
	if (!match || !match[2]) return inner;
	return `${match[1]}${marker}${match[2]}${marker}${match[3]}`;
}

function codeSpan(value: string): string {
	const text = collapse(value).trim();
	if (!text) return '';
	const longest = [...text.matchAll(/`+/g)].reduce(
		(run, match) => Math.max(run, match[0].length),
		0
	);
	const fence = '`'.repeat(longest + 1);
	const padding = text.startsWith('`') || text.endsWith('`') ? ' ' : '';
	return `${fence}${padding}${text}${padding}${fence}`;
}

function renderLink(node: ElementNode, context: Context): string {
	const href = node.attributes.href?.trim();
	const text = renderInline(node.children, context);
	if (!href) return text;
	if (!text.trim()) return '';
	return `[${text.trim()}](${formatUrl(resolveUrl(href, context))})`;
}

function renderImage(node: ElementNode, context: Context): string {
	const src = node.attributes.src?.trim();
	const alt = collapse(node.attributes.alt ?? '').trim();
	// An image with no alternative text is decorative by declaration. Emitting a link to
	// it would put a filename in the prose where the page deliberately says nothing.
	if (!src || !alt) return '';
	return `![${escapeInline(alt)}](${formatUrl(resolveUrl(src, context))})`;
}

function renderInlineElement(node: ElementNode, context: Context): string {
	switch (node.name) {
		case 'br':
			return '\n';
		case 'img':
			return renderImage(node, context);
		case 'a':
			return renderLink(node, context);
		case 'strong':
		case 'b':
			return wrap(renderInline(node.children, context), '**');
		case 'em':
		case 'i':
		case 'cite':
		case 'dfn':
			return wrap(renderInline(node.children, context), '_');
		case 'del':
		case 's':
			return wrap(renderInline(node.children, context), '~~');
		case 'code':
		case 'kbd':
		case 'samp':
		case 'var':
			return codeSpan(rawText(node));
		case 'wbr':
			return '';
		default:
			return renderInline(node.children, context);
	}
}

function renderInline(nodes: HtmlNode[], context: Context): string {
	let output = '';

	for (const node of nodes) {
		if (node.kind === 'text') {
			output += escapeInline(collapse(node.value));
			continue;
		}

		if (isDiscarded(node)) continue;
		output += renderInlineElement(node, context);
	}

	return output;
}

function renderList(node: ElementNode, context: Context): string {
	const ordered = node.name === 'ol';
	const requestedStart = Number.parseInt(node.attributes.start ?? '1', 10);
	const start = Number.isInteger(requestedStart) && requestedStart > 0 ? requestedStart : 1;
	const lines: string[] = [];
	let position = 0;

	for (const item of childElements(node, 'li')) {
		if (isDiscarded(item)) continue;

		const content = renderBlocks(item.children, context).join('\n\n');
		if (!content) continue;

		const marker = ordered ? `${start + position}. ` : '- ';
		const indent = ' '.repeat(marker.length);
		const [first, ...rest] = content.split('\n');
		lines.push(`${marker}${first}`, ...rest.map((line) => (line ? `${indent}${line}` : '')));
		position += 1;
	}

	return lines.join('\n');
}

function renderCodeBlock(node: ElementNode): string {
	const code = childElements(node, 'code')[0];
	const source = rawText(code ?? node)
		.replace(/^\n/, '')
		.replace(/\s+$/, '');
	if (!source) return '';

	const language =
		(code ?? node).attributes.class?.match(/(?:language|lang)-([\w+#.-]+)/)?.[1] ?? '';
	const longest = [...source.matchAll(/^`{3,}/gm)].reduce(
		(run, match) => Math.max(run, match[0].length),
		2
	);
	const fence = '`'.repeat(longest + 1);

	return `${fence}${language}\n${source}\n${fence}`;
}

function renderTableCell(node: ElementNode, context: Context): string {
	return renderBlocks(node.children, context)
		.join(' ')
		.replace(/\s*\n\s*/g, ' ')
		.replace(/\|/g, '\\|')
		.trim();
}

function renderTable(node: ElementNode, context: Context): string[] {
	const blocks: string[] = [];
	const caption = findElement(node.children, 'caption');
	// A GFM table has nowhere to put a caption, and this one is the table's only label.
	if (caption) blocks.push(...renderBlocks(caption.children, context));

	const rows: ElementNode[] = [];
	const collectRows = (parent: ElementNode) => {
		for (const child of parent.children) {
			if (!isElement(child) || isDiscarded(child)) continue;
			if (child.name === 'tr') rows.push(child);
			else if (['thead', 'tbody', 'tfoot'].includes(child.name)) collectRows(child);
		}
	};
	collectRows(node);
	if (rows.length === 0) return blocks;

	const cells = rows.map((row) =>
		row.children
			.filter((cell): cell is ElementNode => isElement(cell) && ['td', 'th'].includes(cell.name))
			.map((cell) => renderTableCell(cell, context))
	);
	const columns = cells.reduce((width, row) => Math.max(width, row.length), 0);
	if (columns === 0) return blocks;

	const headed = rows[0].children.some((cell) => isElement(cell) && cell.name === 'th');
	const header = headed ? cells[0] : new Array<string>(columns).fill('');
	const body = headed ? cells.slice(1) : cells;
	const line = (values: string[]) =>
		`| ${Array.from({ length: columns }, (_, column) => values[column] ?? '').join(' | ')} |`;

	blocks.push(
		[
			line(header),
			`| ${new Array<string>(columns).fill('---').join(' | ')} |`,
			...body.map(line)
		].join('\n')
	);

	return blocks;
}

function renderFrame(node: ElementNode, context: Context): string {
	const src = node.attributes.src?.trim();
	if (!src) return '';
	// The frame's content is a separate document this converter cannot reach, so the
	// honest markdown for it is a link a reader can follow. `title` is what the page
	// already promises a screen reader the frame contains.
	const title = collapse(node.attributes.title ?? '').trim() || 'Embedded document';
	return `[${escapeInline(title)}](${formatUrl(resolveUrl(src, context))})`;
}

function renderBlocks(nodes: HtmlNode[], context: Context): string[] {
	const blocks: string[] = [];
	let inline = '';

	const flush = () => {
		const paragraph = tidy(inline);
		inline = '';
		if (paragraph) blocks.push(escapeLineStarts(paragraph));
	};

	const push = (block: string) => {
		const trimmed = block.trim();
		if (trimmed) blocks.push(trimmed);
	};

	for (const node of nodes) {
		if (node.kind === 'text') {
			inline += escapeInline(collapse(node.value));
			continue;
		}

		if (isDiscarded(node)) continue;

		if (HEADINGS.has(node.name)) {
			flush();
			const text = tidy(renderInline(node.children, context)).replace(/\n+/g, ' ');
			if (text) push(`${'#'.repeat(Number(node.name[1]))} ${text}`);
			continue;
		}

		switch (node.name) {
			case 'hr':
				flush();
				push('---');
				break;
			case 'ul':
			case 'ol':
				flush();
				push(renderList(node, context));
				break;
			case 'pre':
				flush();
				push(renderCodeBlock(node));
				break;
			case 'table':
				flush();
				for (const block of renderTable(node, context)) push(block);
				break;
			case 'iframe':
				flush();
				push(renderFrame(node, context));
				break;
			case 'dt':
			case 'summary': {
				flush();
				const text = tidy(renderInline(node.children, context)).replace(/\n+/g, ' ');
				if (text) push(`**${text}**`);
				break;
			}
			case 'blockquote': {
				flush();
				const quoted = renderBlocks(node.children, context).join('\n\n');
				if (quoted) {
					push(
						quoted
							.split('\n')
							.map((line) => (line ? `> ${line}` : '>'))
							.join('\n')
					);
				}
				break;
			}
			default:
				if (BLOCK_ELEMENTS.has(node.name)) {
					flush();
					for (const block of renderBlocks(node.children, context)) push(block);
				} else {
					inline += renderInlineElement(node, context);
				}
		}
	}

	flush();
	return blocks;
}

/**
 * Converts a rendered HTML document to markdown.
 *
 * Only `<main>` is converted when the document has one. Every page on this site puts
 * its content there — it is the target of the skip link and the page's one `main`
 * landmark — so the header navigation and the footer link farm, which repeat
 * identically on all 41 pages and say nothing about the page in hand, are left out.
 * An agent that wants the map of the site has `/llms.txt` and `/sitemap.xml`, both of
 * which describe it better than a flattened menu would.
 */
export function htmlToMarkdown(html: string, options: HtmlToMarkdownOptions = {}): string {
	const baseUrl =
		options.baseUrl === undefined
			? undefined
			: options.baseUrl instanceof URL
				? options.baseUrl
				: new URL(options.baseUrl);
	const context: Context = { baseUrl };

	const document = parse(html);
	const root = findElement(document, 'main') ?? findElement(document, 'body');
	const blocks = renderBlocks(root ? root.children : document, context);
	const markdown = blocks
		.join('\n\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();

	return markdown ? `${markdown}\n` : '';
}
