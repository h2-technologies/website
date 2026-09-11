import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	MARKDOWN_CONTENT_TYPE,
	estimateTokens,
	negotiatesMarkdown,
	prefersMarkdown,
	varyOn
} from '../src/lib/server/markdown-negotiation.ts';

// Sent verbatim by the named client. The browser headers are the reason this is a
// preference comparison and not a substring search: all of them accept markdown under
// their trailing wildcard, and none of them want it.
const browserAccept =
	'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';

describe('markdown content negotiation', () => {
	it('serves markdown to a client that asks for it', () => {
		for (const accept of [
			'text/markdown',
			'text/markdown, */*;q=0.1',
			'text/markdown;q=0.9, text/html;q=0.8',
			'text/x-markdown',
			'TEXT/MARKDOWN',
			'text/markdown , text/plain',
			'text/markdown;charset=utf-8'
		]) {
			assert.equal(prefersMarkdown(accept), true, `${accept} asks for markdown`);
		}
	});

	it('leaves every client that did not ask on HTML', () => {
		for (const accept of [
			browserAccept,
			'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'*/*',
			'text/*',
			'text/html',
			'application/json',
			'text/plain',
			'text/markdown;q=0',
			'text/markdown;q=0.5, text/html',
			'text/markdown;q=0.5, text/html;q=0.9',
			'',
			null,
			undefined
		]) {
			assert.equal(prefersMarkdown(accept), false, `${accept} does not ask for markdown`);
		}
	});

	it('reads a tie as a request for the default representation', () => {
		assert.equal(prefersMarkdown('text/markdown, text/html'), false);
		assert.equal(prefersMarkdown('text/markdown;q=0.6, text/html;q=0.6'), false);
	});

	it('honours the most specific range, not the highest weight', () => {
		// RFC 9110: `text/html;q=0.1` is what this client thinks of HTML, even though the
		// wildcard that also covers HTML carries a higher weight.
		assert.equal(prefersMarkdown('text/html;q=0.1, */*'), true);
		assert.equal(prefersMarkdown('text/markdown;q=0.1, */*'), false);
	});

	it('ignores a malformed header instead of guessing', () => {
		assert.equal(prefersMarkdown('text/markdown;q=banana'), true);
		assert.equal(prefersMarkdown(';;;'), false);
		assert.equal(prefersMarkdown('text markdown'), false);
	});

	it('negotiates only safe methods against an HTML response', () => {
		const html = () =>
			new Response('<main>x</main>', { headers: { 'content-type': 'text/html; charset=utf-8' } });
		const ask = (method) =>
			new Request('https://h2technologiesllc.com/about', {
				method,
				headers: { accept: 'text/markdown' }
			});

		assert.equal(negotiatesMarkdown(ask('GET'), html()), true);
		assert.equal(negotiatesMarkdown(ask('HEAD'), html()), true);
		assert.equal(negotiatesMarkdown(ask('POST'), html()), false);

		const plain = new Response('# llms.txt', {
			headers: { 'content-type': 'text/plain; charset=utf-8' }
		});
		const xml = new Response('<urlset/>', {
			headers: { 'content-type': 'application/xml; charset=utf-8' }
		});
		assert.equal(negotiatesMarkdown(ask('GET'), plain), false, 'llms.txt is already plain text');
		assert.equal(negotiatesMarkdown(ask('GET'), xml), false, 'sitemap.xml is not a page');
	});

	it('declares the registered media type with an encoding', () => {
		assert.equal(MARKDOWN_CONTENT_TYPE, 'text/markdown; charset=utf-8');
	});

	it('adds Accept to Vary without disturbing what is already there', () => {
		const headers = new Headers({ vary: 'Cookie' });
		varyOn(headers, 'Accept');
		assert.equal(headers.get('vary'), 'Cookie, Accept');

		varyOn(headers, 'accept');
		assert.equal(headers.get('vary'), 'Cookie, Accept', 'a field is listed once');

		const empty = new Headers();
		varyOn(empty, 'Accept');
		assert.equal(empty.get('vary'), 'Accept');

		const everything = new Headers({ vary: '*' });
		varyOn(everything, 'Accept');
		assert.equal(everything.get('vary'), '*', 'a wildcard already covers Accept');
	});

	it('estimates a token count that scales with the document', () => {
		assert.equal(estimateTokens(''), 0);
		assert.equal(estimateTokens('    '), 0);
		assert.equal(estimateTokens('abcd'), 1);
		assert.ok(estimateTokens('x'.repeat(4000)) > estimateTokens('x'.repeat(400)));
	});
});
