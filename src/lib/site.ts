export const site = {
	name: 'H2 Technologies LLC',
	shortName: 'H2 Technologies',
	url: 'https://h2technologiesllc.com',
	description:
		'Ohio technology consulting for secure software, business websites, enterprise networks, cybersecurity, Google Workspace, Fortinet, IPv6, BGP, and IT support.',
	logo: '/squareLogo.png',
	socialImage: '/herobackground.jpg',
	socialImageAlt: 'H2 Technologies secure network infrastructure background',
	contactHref:
		'https://client-portal.app.intuit.com/contact-form?accountId=249325971&formId=287439',
	securityEmail: 'noc@h2technologiesllc.com',
	/** Sales mailbox used by the promotional banner's primary call to action. */
	salesEmail: 'sales@h2technologiesllc.com',
	areaServed: ['Ohio', 'United States', 'Remote and hybrid teams'],
	foundingDate: '2023'
};

/**
 * Last date the marketing pages, service pages, and location pages were revised, published as
 * `<lastmod>` in sitemap.xml. Google ignores a sitemap's `lastmod` when it disagrees with the
 * page it describes, so bump this in the same commit that changes that copy — and leave it
 * alone for changes that do not alter what a visitor reads. Resource articles carry their own
 * `updatedAt` and do not use this value.
 */
export const contentRevisedAt = '2026-09-03';

/**
 * Name, address, and phone details published on the site and in structured data.
 *
 * Every value here must match the Google Business Profile and any external
 * directory listing character for character; inconsistent NAP data is the most
 * common cause of weak local search results. Values left empty are omitted from
 * both the rendered page and the schema graph rather than guessed, so filling in
 * `streetAddress`, `postalCode`, and `telephone` is the highest-value manual
 * follow-up on this file.
 */
export const nap = {
	legalName: 'H2 Technologies LLC',
	streetAddress: '',
	addressLocality: 'Ashland',
	addressRegion: 'OH',
	addressRegionName: 'Ohio',
	postalCode: '',
	addressCountry: 'US',
	telephone: '',
	email: '',
	/** Public map link (Google Business Profile short link or place URL). */
	mapUrl: '',
	/** e.g. [{ days: ['Monday', ...], opens: '08:00', closes: '17:00' }] */
	openingHours: [] as { days: string[]; opens: string; closes: string }[]
};

/**
 * Profiles that unambiguously identify H2 Technologies, emitted as
 * `Organization.sameAs`. Add the Google Business Profile, LinkedIn company page,
 * and GitHub organization URLs here once confirmed. Unverified URLs are worse
 * than none, because a wrong `sameAs` splits the entity Google builds.
 */
export const organizationProfiles: string[] = [];

/**
 * The named operator behind the technical work. Search engines weigh
 * author-level expertise for technical content, and the AS17290 routing policy
 * published at /routing is registered to this person, so the site states the
 * relationship explicitly instead of attributing everything to the company.
 */
export const founder = {
	name: 'Austin Hadley',
	jobTitle: 'Founder and Chief Executive Officer',
	shortBio:
		'Austin Hadley founded H2 Technologies in 2023 and leads its software, network, and security engagements. He operates AS17290 and publishes its routing policy publicly.',
	knowsAbout: [
		'Border Gateway Protocol',
		'IPv6 deployment',
		'DNS architecture',
		'Network segmentation and firewall policy',
		'Custom software development',
		'Cloud infrastructure and disaster recovery planning'
	],
	/** Verified profiles for the person, emitted as `Person.sameAs`. */
	profiles: [] as string[]
};

/** Public autonomous system operated by H2 Technologies. */
export const network = {
	asn: 'AS17290',
	asnNumber: 17290,
	asSet: 'AS-17290:AS-AUSTIN-HADLEY',
	registrant: 'Austin Hadley',
	policyPath: '/routing',
	policyPdf: '/bgp-routing-policy.pdf',
	references: [
		{ label: 'AS17290 on bgp.tools', href: 'https://bgp.tools/as/17290' },
		{ label: 'AS17290 on RIPEstat', href: 'https://stat.ripe.net/AS17290' }
	]
};

/** Postal address fragment for schema.org, with unknown fields omitted. */
export function postalAddressSchema() {
	return {
		'@type': 'PostalAddress',
		...(nap.streetAddress ? { streetAddress: nap.streetAddress } : {}),
		addressLocality: nap.addressLocality,
		addressRegion: nap.addressRegion,
		...(nap.postalCode ? { postalCode: nap.postalCode } : {}),
		addressCountry: nap.addressCountry
	};
}

export const footerServices = [
	{ title: 'Custom Software Development', slug: 'custom-software-development' },
	{ title: 'Business Website Development', slug: 'business-website-development' },
	{ title: 'Enterprise Network Design', slug: 'enterprise-network-design' },
	{ title: 'BGP Consulting', slug: 'bgp-consulting' },
	{ title: 'IPv6 Consulting', slug: 'ipv6-consulting' },
	{ title: 'Fortinet Firewall Consulting', slug: 'fortinet-firewall-consulting' }
];

export const footerLocations = [
	{ title: 'IT Services in Ohio', slug: 'it-services-ohio' },
	{ title: 'Network Consulting in Ohio', slug: 'network-consulting-ohio' },
	{ title: 'Cybersecurity Consulting in Ohio', slug: 'cybersecurity-consulting-ohio' },
	{ title: 'Software Development in Ohio', slug: 'software-development-ohio' },
	{ title: 'Website Development in Ohio', slug: 'website-development-ohio' }
];

export const trustPoints = [
	'Enterprise Network Architecture',
	'Custom Software Development',
	'Google Workspace Administration',
	'Fortinet Security',
	'IPv6 / BGP Consulting',
	'Ohio-Based, Remote-Capable'
];

export const expertise = [
	'Experience with large multi-site network architectures',
	'Public ASN and BGP routing experience',
	'IPv4 and IPv6 infrastructure planning',
	'Secure software and infrastructure design',
	'Business-focused technical consulting'
];

export const industries = [
	'Professional services',
	'Manufacturing and operations',
	'Local service businesses',
	'Remote and hybrid teams',
	'Growing small and midsize businesses',
	'Technical teams needing outside architecture support'
];

export function absoluteUrl(path = '/') {
	return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function slugTitle(slug: string) {
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}
