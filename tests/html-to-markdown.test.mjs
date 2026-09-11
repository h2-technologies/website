import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { htmlToMarkdown } from '../src/lib/server/html-to-markdown.ts';

const siteUrl = 'https://h2technologiesllc.com';

/** Wraps a fragment in the landmark every page renders its content into. */
function convert(fragment, options = { baseUrl: `${siteUrl}/services/bgp-consulting` }) {
	return htmlToMarkdown(`<main>${fragment}</main>`, options);
}

describe('HTML to Markdown conversion', () => {
	it('converts only the page content, not the chrome around it', () => {
		const page = [
			'<!doctype html><html lang="en"><head><title>Ignored</title>',
			'<script type="application/ld+json">{"@type":"Service"}</script></head>',
			'<body><header><nav><a href="/services">Services</a></nav></header>',
			'<main><h1>BGP Consulting</h1><p>Routing help.</p></main>',
			'<footer><a href="/faq">FAQ</a></footer></body></html>'
		].join('');

		assert.equal(htmlToMarkdown(page), '# BGP Consulting\n\nRouting help.\n');
	});

	it('falls back to the body when a document has no main landmark', () => {
		assert.equal(htmlToMarkdown('<body><p>Only this.</p></body>'), 'Only this.\n');
	});

	it('returns nothing for a document with no readable content', () => {
		assert.equal(htmlToMarkdown('<main><script>const a = 1;</script></main>'), '');
		assert.equal(htmlToMarkdown(''), '');
	});

	it('renders each heading level', () => {
		assert.equal(
			convert('<h1>One</h1><h2>Two</h2><h3>Three</h3><h4>Four</h4><h5>Five</h5><h6>Six</h6>'),
			'# One\n\n## Two\n\n### Three\n\n#### Four\n\n##### Five\n\n###### Six\n'
		);
	});

	it('collapses the whitespace the template indentation introduces', () => {
		assert.equal(
			convert('<p>\n\t\tA sentence\n\t\tacross lines.\n\t</p>'),
			'A sentence across lines.\n'
		);
	});

	it('keeps inline emphasis and code', () => {
		assert.equal(
			convert('<p>Use <strong>RPKI</strong> and <em>IRR</em> with <code>AS17290</code>.</p>'),
			'Use **RPKI** and _IRR_ with `AS17290`.\n'
		);
	});

	it('leaves the spacing around emphasis outside the markers', () => {
		assert.equal(convert('<p>a<strong> bold </strong>b</p>'), 'a **bold** b\n');
	});

	it('renders unordered, ordered, and nested lists', () => {
		assert.equal(convert('<ul><li>One</li><li>Two</li></ul>'), '- One\n- Two\n');
		assert.equal(
			convert('<ol start="3"><li>Third</li><li>Fourth</li></ol>'),
			'3. Third\n4. Fourth\n'
		);
		assert.equal(
			convert('<ul><li>Outer<ul><li>Inner</li></ul></li><li>Last</li></ul>'),
			'- Outer\n\n  - Inner\n- Last\n'
		);
	});

	it('resolves relative links and image sources against the page URL', () => {
		assert.equal(
			convert('<p><a href="/locations">Service areas</a></p>'),
			`[Service areas](${siteUrl}/locations)\n`
		);
		assert.equal(
			convert('<p><a href="#faq">Questions</a></p>'),
			`[Questions](${siteUrl}/services/bgp-consulting#faq)\n`
		);
		assert.equal(
			convert('<p><img src="/squareLogo.png" alt="H2 Technologies"></p>'),
			`![H2 Technologies](${siteUrl}/squareLogo.png)\n`
		);
	});

	it('leaves absolute, mail, and telephone destinations alone', () => {
		assert.equal(
			convert('<p><a href="mailto:noc@h2technologiesllc.com">Security</a></p>'),
			'[Security](mailto:noc@h2technologiesllc.com)\n'
		);
		assert.equal(
			convert('<p><a href="https://bgp.tools/as/17290">AS17290</a></p>'),
			'[AS17290](https://bgp.tools/as/17290)\n'
		);
	});

	it('drops links with no text and images with no alternative text', () => {
		assert.equal(
			convert('<p>Before<a href="/x"><svg><path d="M0 0"/></svg></a>After</p>'),
			'BeforeAfter\n'
		);
		assert.equal(convert('<p><img src="/decoration.png" alt="">Text</p>'), 'Text\n');
	});

	it('drops scripts, styles, icons, and content hidden from assistive technology', () => {
		assert.equal(
			convert(
				[
					'<style>.a{color:red}</style>',
					'<script>console.log("hydrate");</script>',
					'<!--[--><p>Visible<span aria-hidden="true"> /</span></p><!--]-->',
					'<p hidden>Hidden</p>'
				].join('')
			),
			'Visible\n'
		);
	});

	it('decodes character references', () => {
		assert.equal(
			convert('<p>&copy; 2026 H2 &amp; Co &mdash; 8&nbsp;AM&hellip;</p>'),
			'© 2026 H2 & Co — 8 AM…\n'
		);
		assert.equal(convert('<p>&#72;&#x32;</p>'), 'H2\n');
		assert.equal(convert('<p>&unknownentity;</p>'), '&unknownentity;\n');
	});

	it('escapes characters that would otherwise be read as markup', () => {
		assert.equal(
			convert('<p>Costs 2 * 3 and file_name_here</p>'),
			'Costs 2 \\* 3 and file\\_name\\_here\n'
		);
		assert.equal(convert('<p>- not a list item</p>'), '\\- not a list item\n');
		assert.equal(convert('<p>2026. Not a numbered item</p>'), '2026\\. Not a numbered item\n');
		assert.equal(convert('<p># not a heading</p>'), '\\# not a heading\n');
	});

	it('renders a table with its caption above it', () => {
		assert.equal(
			convert(
				[
					'<table><caption>Validation methods</caption>',
					'<thead><tr><th>Requirement</th><th>Description</th></tr></thead>',
					'<tbody><tr><th>RPKI valid</th><td>Covered by a ROA</td></tr></tbody></table>'
				].join('')
			),
			[
				'Validation methods',
				'',
				'| Requirement | Description |',
				'| --- | --- |',
				'| RPKI valid | Covered by a ROA |',
				''
			].join('\n')
		);
	});

	it('escapes a pipe inside a cell so the column count survives', () => {
		assert.equal(
			convert('<table><tr><th>A</th></tr><tr><td>one | two</td></tr></table>'),
			'| A |\n| --- |\n| one \\| two |\n'
		);
	});

	it('renders a disclosure as a bold question followed by its answer', () => {
		assert.equal(
			convert('<details><summary>Can H2 help with IPv6 BGP?</summary><p>Yes.</p></details>'),
			'**Can H2 help with IPv6 BGP?**\n\nYes.\n'
		);
	});

	it('links an embedded frame rather than dropping the document it holds', () => {
		assert.equal(
			convert(
				'<iframe src="/bgp-routing-policy.pdf" title="AS17290 routing policy, PDF copy"></iframe>'
			),
			`[AS17290 routing policy, PDF copy](${siteUrl}/bgp-routing-policy.pdf)\n`
		);
		assert.equal(convert('<iframe title="No source"></iframe>'), '');
	});

	it('renders block quotes, rules, and fenced code', () => {
		assert.equal(convert('<blockquote><p>Quoted.</p></blockquote>'), '> Quoted.\n');
		assert.equal(convert('<p>A</p><hr><p>B</p>'), 'A\n\n---\n\nB\n');
		assert.equal(
			convert('<pre><code class="language-bash">whois -h whois.radb.net AS17290</code></pre>'),
			'```bash\nwhois -h whois.radb.net AS17290\n```\n'
		);
	});

	it('keeps code spans and code blocks unescaped', () => {
		assert.equal(convert('<p><code>a_b*c</code></p>'), '`a_b*c`\n');
		assert.equal(convert('<pre><code>a_b*c</code></pre>'), '```\na_b*c\n```\n');
	});

	it('survives markup a strict parser would reject', () => {
		assert.equal(
			convert('<p>Unclosed paragraph<div>Then a block</div>'),
			'Unclosed paragraph\n\nThen a block\n'
		);
		assert.equal(convert('<p>Stray close</span></p>'), 'Stray close\n');
		assert.equal(convert('<p>5 &lt; 7 and 9 > 2</p>'), '5 < 7 and 9 > 2\n');
	});

	it('works without a base URL, leaving relative links as written', () => {
		assert.equal(htmlToMarkdown('<main><a href="/faq">FAQ</a></main>'), '[FAQ](/faq)\n');
	});
});
