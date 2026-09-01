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
	areaServed: ['Ohio', 'United States', 'Remote and hybrid teams']
};

/**
 * Last date the marketing pages, service pages, and location pages were revised, published as
 * `<lastmod>` in sitemap.xml. Google ignores a sitemap's `lastmod` when it disagrees with the
 * page it describes, so bump this in the same commit that changes that copy — and leave it
 * alone for changes that do not alter what a visitor reads. Resource articles carry their own
 * `updatedAt` and do not use this value.
 */
export const contentRevisedAt = '2026-08-07';

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
