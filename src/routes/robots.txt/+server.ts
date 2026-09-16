import { AI_CATALOG_PATH } from '$lib/agent-discovery';
import { absoluteUrl } from '$lib/site';

export const prerender = false;

/**
 * Crawler policy for h2technologiesllc.com.
 *
 * Every group below serves the same pages as a human visitor. Serving crawlers
 * different content than people is cloaking, so the only thing this file decides
 * is *who may fetch*, never *what they are shown*.
 *
 * The groups are written out one user agent at a time rather than left to the
 * `*` wildcard because robots.txt matching is most-specific-group-wins: a named
 * group is the only way to state a per-crawler decision, and an unstated
 * decision is indistinguishable from an oversight when this file is reviewed
 * later. The effective access is identical to the previous wildcard-only file;
 * what changed is that each answer is now explicit and attributable.
 *
 * Two categories are deliberately kept separate, because they are separate
 * business questions and the vendors gate them on different tokens:
 *
 *   Retrieval / citation — the crawler that decides whether this site can be
 *   quoted and linked in an AI answer. Allowed: being cited is the point.
 *     OAI-SearchBot .... ChatGPT search results (openai.com/searchbot.json)
 *     ChatGPT-User ..... a person asking ChatGPT to open a page
 *     Claude-SearchBot . Claude search result quality
 *     Claude-User ...... a person asking Claude to open a page
 *     PerplexityBot .... Perplexity index
 *     Googlebot/Bingbot  classic search, and the source for AI Overviews,
 *                        AI Mode, and Bing's AI answers — those features have
 *                        no separate token and no separate opt-in.
 *
 *   Model training — whether page text may be absorbed into a foundation model.
 *   Allowed, because the published BGP, IPv6, and firewall guidance is written
 *   to be quoted and carries no client-confidential material. This is the group
 *   to flip if that ever stops being true; blocking it costs no search ranking
 *   and no AI Overviews eligibility.
 *     GPTBot ........... OpenAI foundation model training
 *     ClaudeBot ........ Anthropic foundation model training
 *     Google-Extended .. Gemini apps and Vertex AI grounding. Not a Search
 *                        signal: Search and AI Overviews crawl as Googlebot.
 *     Applebot-Extended  Apple Intelligence training
 *     meta-externalagent Meta model training
 *     CCBot ............ Common Crawl, a common upstream training corpus
 */
const retrievalAgents = [
	'Googlebot',
	'Bingbot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'Claude-SearchBot',
	'Claude-User',
	'PerplexityBot'
];

const trainingAgents = [
	'GPTBot',
	'ClaudeBot',
	'Google-Extended',
	'Applebot-Extended',
	'meta-externalagent',
	'CCBot'
];

const group = (agents: string[]) => `${agents.map((a) => `User-agent: ${a}`).join('\n')}\nAllow: /`;

// `Agentmap` is the Agentic Resource Discovery equivalent of `Sitemap`: a pointer to
// `/.well-known/ai-catalog.json` for a client that reads robots.txt before it reads
// anything else. It ships commented out, because the two sides of that trade are lopsided.
//
// What it buys is currently nothing. Agentic Resource Discovery is a proposal, no shipping
// parser reads this line, and the catalog is already reachable three ways that clients do
// implement: the RFC 8615 well-known path it sits on, the `Link: rel="service-meta"` header
// on every response, and the `<link rel="ai-catalog">` in the page head.
//
// What it costs is a standing false alarm. `agentmap` is not on the directive safelist
// Lighthouse checks, so an uncommented line here fails the `robots-txt` audit with
// "Unknown directive" — one error, on every Lighthouse and PageSpeed Insights run, on
// every page of the site. That error says nothing about crawling (this file has no
// `Disallow`, and RFC 9309 requires a crawler to ignore lines it does not recognise), but
// it is indistinguishable at a glance from one that does, and it costs a real
// investigation every time someone reads a report and takes it seriously.
//
// Uncomment it when a client worth serving actually reads it. The audit error is the
// price, and at that point it buys something.
const body = `${group(retrievalAgents)}

${group(trainingAgents)}

User-agent: *
Allow: /

# Agentmap: ${absoluteUrl(AI_CATALOG_PATH)}
Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

export function GET() {
	return new Response(body, {
		headers: {
			'cache-control': 'public, max-age=3600',
			'content-type': 'text/plain; charset=utf-8'
		}
	});
}
