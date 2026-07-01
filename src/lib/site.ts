export const site = {
	name: 'H2 Technologies LLC',
	shortName: 'H2 Technologies',
	url: 'https://h2technologiesllc.com',
	description:
		'Ohio-based technology consulting for secure software, enterprise networks, cybersecurity, Google Workspace, Fortinet, IPv6, BGP, and practical business IT support.',
	logo: '/wideLogo.png',
	image: '/wideLogo.png',
	contactHref:
		'https://client-portal.app.intuit.com/contact-form?accountId=249325971&formId=287439',
	areaServed: ['Ohio', 'United States', 'Remote and hybrid teams']
};

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
