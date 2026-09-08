import { locations } from '$lib/locations';
import { posts } from '$lib/posts';
import { services } from '$lib/services';
import { absoluteUrl, founder, nap, network, site } from '$lib/site';

export const prerender = false;

/**
 * `llms.txt` is a plain-language index for language models and answer engines, in the same
 * spirit as sitemap.xml but written to be read rather than parsed. Like the sitemap it is
 * generated from the same collections that define the routes, so it cannot describe a page
 * that does not exist or miss one that does.
 *
 * The format is the llmstxt.org convention: one H1, a blockquote summary, then H2 sections of
 * annotated links, with anything supplementary under `## Optional`.
 */
const summary = [
	`Ohio-based technology consulting: custom software and business websites, enterprise network`,
	`design (BGP, public ASN, IPv6), and cybersecurity (Fortinet, Google Workspace, disaster`,
	`recovery). Founder-led engineering — ${founder.name} does the technical work directly.`,
	`Based in ${nap.addressLocality}, ${nap.addressRegionName}; onsite coverage in Ashland,`,
	`Richland, and Wayne counties, remote delivery statewide and nationally.`
].join(' ');

const corePages: { title: string; path: string; description: string }[] = [
	{
		title: 'Services',
		path: '/services',
		description: services.map((service) => service.title).join(', ')
	},
	{
		title: 'FAQ',
		path: '/faq',
		description:
			'Direct answers on pricing, scoping, remote vs onsite work, whether BGP or IPv6 is warranted, and what a security review does and does not cover'
	},
	{
		title: 'About',
		path: '/about',
		description: `Company background and its founder, ${founder.name}`
	},
	{
		title: 'Resources',
		path: '/resources',
		description: 'Technical guides written for business decision makers'
	},
	{
		title: `${network.asn} Routing Policy`,
		path: network.policyPath,
		description: `Published BGP routing policy for ${network.asn}, the public autonomous system H2 Technologies operates`
	},
	{
		title: 'Contact',
		path: '/contact',
		description: 'Request a technology assessment or consultation'
	}
];

function link(title: string, path: string, description: string) {
	return `- [${title}](${absoluteUrl(path)}): ${description}`;
}

const body = `# ${site.name}

> ${summary}

## Core pages
${corePages.map(({ title, path, description }) => link(title, path, description)).join('\n')}

## Service pages
${services.map((service) => link(service.title, `/services/${service.slug}`, service.meta)).join('\n')}

## Technical guides
${posts.map((post) => link(post.title, `/resources/${post.slug}`, post.meta)).join('\n')}

## Optional
${locations.map((location) => link(location.title, `/locations/${location.slug}`, location.meta)).join('\n')}
`;

export function GET() {
	return new Response(body, {
		headers: {
			'cache-control': 'public, max-age=3600',
			'content-type': 'text/plain; charset=utf-8'
		}
	});
}
