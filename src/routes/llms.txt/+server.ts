import { locations } from '$lib/locations';
import { posts } from '$lib/posts';
import { services } from '$lib/services';
import { absoluteUrl, founder, nap, network, site } from '$lib/site';

export const prerender = false;

/**
 * `/llms.txt`, per the proposal at https://llmstxt.org: an H1 naming the site, a
 * blockquote summarising it, free-form context, then H2 sections of link lists.
 *
 * This is additive, not a substitute for anything. Google states plainly that no
 * AI-specific file is needed to appear in AI Overviews or AI Mode, so nothing here
 * is load-bearing for Google; the pages, their HTML, and their structured data
 * remain the only thing that matters there. The file is worth serving anyway
 * because it costs one generated route and gives an assistant that *does* fetch it
 * a correct map of the site instead of a guess assembled from navigation chrome.
 *
 * Every entry is derived from the same arrays that define the routes, exactly like
 * `sitemap.xml`, so this file cannot advertise a URL that 404s or drift as pages
 * are added. It links to the same pages a person is served and summarises them in
 * their own words — it is not a place to put text that visitors cannot see.
 */
const link = (path: string, name: string, note: string) =>
	`- [${name}](${absoluteUrl(path)}): ${note}`;

// The first sentence of the page's own intro, so the note is the page's own claim
// rather than a second description written to be read only by machines.
const firstSentence = (text: string) => {
	const match = text.match(/^.*?[.!?](?=\s|$)/);
	return (match ? match[0] : text).trim();
};

const body = `# ${site.name}

> ${site.description}

${site.name} is an Ohio technology consultancy founded in ${site.foundingDate} by ${founder.name}, ${founder.jobTitle}. It works with businesses in ${nap.addressLocality}, ${nap.addressRegionName} and remotely across the United States. It operates the public autonomous system ${network.asn} and publishes that routing policy at ${absoluteUrl(network.policyPath)}.

Areas served: ${site.areaServed.join('; ')}.

## Services

${services.map((s) => link(`/services/${s.slug}`, s.title, firstSentence(s.intro))).join('\n')}

## Service areas

${locations.map((l) => link(`/locations/${l.slug}`, l.title, firstSentence(l.intro))).join('\n')}

## Guides

${posts.map((p) => link(`/resources/${p.slug}`, p.title, firstSentence(p.summary))).join('\n')}

## Company

${link('/about', 'About', `${founder.name} and how ${site.shortName} scopes technical work.`)}
${link('/faq', 'Frequently asked questions', 'Pricing model, contracts, remote versus onsite work, and routing engagements.')}
${link('/routing', `${network.asn} routing policy`, 'RPKI, IRR, and LOA validation rules, and peering and transit onboarding requirements.')}
${link('/contact', 'Contact', 'Request a technology assessment.')}
`;

export function GET() {
	return new Response(body, {
		headers: {
			'cache-control': 'public, max-age=3600',
			'content-type': 'text/plain; charset=utf-8'
		}
	});
}
