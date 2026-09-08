import { absoluteUrl } from '$lib/site';

export const prerender = false;

/**
 * Answer-engine and LLM crawlers are named explicitly rather than left to the wildcard block.
 * Several of them only honour a group that matches their own token, and a site that says
 * nothing about them is treated inconsistently across vendors. H2 Technologies publishes
 * technical reference material it wants quoted, so these are allowed on purpose.
 */
const answerEngineCrawlers = [
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'ClaudeBot',
	'Claude-Web',
	'anthropic-ai',
	'PerplexityBot',
	'Google-Extended',
	'Applebot-Extended',
	'CCBot'
];

/** Crawlers with a documented history of ignoring crawl rate limits. */
const disallowedCrawlers = ['Bytespider'];

function allowGroup(userAgent: string) {
	return `User-agent: ${userAgent}\nAllow: /\nDisallow: /admin/\n`;
}

function disallowGroup(userAgent: string) {
	return `User-agent: ${userAgent}\nDisallow: /\n`;
}

// `/admin` is excluded here, marked `noindex` by an `X-Robots-Tag` response header in
// `src/hooks.server.ts`, and marked again with a `<meta name="robots">` tag in the admin
// layout. robots.txt alone only asks politely and does not keep a discovered URL out of an
// index, which is why the other two layers exist.
const body = [
	'User-agent: *\nAllow: /\nDisallow: /admin/\n',
	'# Answer engines and LLM crawlers, allowed deliberately.\n' +
		answerEngineCrawlers.map(allowGroup).join('\n'),
	'# Ignores crawl-delay and scrapes aggressively.\n' +
		disallowedCrawlers.map(disallowGroup).join('\n'),
	`Sitemap: ${absoluteUrl('/sitemap.xml')}\n`
].join('\n');

export function GET() {
	return new Response(body, {
		headers: {
			'cache-control': 'public, max-age=3600',
			'content-type': 'text/plain; charset=utf-8'
		}
	});
}
