export type LocationPage = {
	slug: string;
	title: string;
	seoTitle: string;
	meta: string;
	h1: string;
	serviceSlugs: string[];
};

export const locations: LocationPage[] = [
	{
		slug: 'it-services-ohio',
		title: 'IT Services in Ohio',
		seoTitle: 'IT Services in Ohio | H2 Technologies LLC',
		meta: 'Ohio IT services for growing businesses that need practical support, cybersecurity, networks, cloud systems, and software guidance.',
		h1: 'IT Services in Ohio for Growing Businesses',
		serviceSlugs: ['managed-it-support', 'cybersecurity-consulting', 'network-monitoring']
	},
	{
		slug: 'network-consulting-ohio',
		title: 'Network Consulting in Ohio',
		seoTitle: 'Network Consulting in Ohio | H2 Technologies LLC',
		meta: 'Ohio network consulting for enterprise design, multi-site architecture, routing, VPN, monitoring, IPv6, and BGP planning.',
		h1: 'Network Consulting in Ohio',
		serviceSlugs: ['enterprise-network-design', 'bgp-consulting', 'ipv6-consulting']
	},
	{
		slug: 'cybersecurity-consulting-ohio',
		title: 'Cybersecurity Consulting in Ohio',
		seoTitle: 'Cybersecurity Consulting in Ohio | H2 Technologies LLC',
		meta: 'Ohio cybersecurity consulting for firewall review, remote access, secure infrastructure, recovery planning, and risk reduction.',
		h1: 'Cybersecurity Consulting in Ohio',
		serviceSlugs: [
			'cybersecurity-consulting',
			'fortinet-firewall-consulting',
			'disaster-recovery-planning'
		]
	},
	{
		slug: 'software-development-ohio',
		title: 'Software Development in Ohio',
		seoTitle: 'Software Development in Ohio | H2 Technologies LLC',
		meta: 'Ohio custom software development for workflow tools, portals, business automation, dashboards, and secure web applications.',
		h1: 'Software Development in Ohio',
		serviceSlugs: [
			'custom-software-development',
			'business-automation',
			'cloud-infrastructure-consulting'
		]
	},
	{
		slug: 'website-development-ohio',
		title: 'Website Development in Ohio',
		seoTitle: 'Website Development in Ohio | H2 Technologies LLC',
		meta: 'Ohio website development for service businesses that need clear messaging, fast pages, SEO structure, and stronger lead flow.',
		h1: 'Website Development in Ohio',
		serviceSlugs: [
			'business-website-development',
			'custom-software-development',
			'business-automation'
		]
	},
	{
		slug: 'google-workspace-consulting-ohio',
		title: 'Google Workspace Consulting in Ohio',
		seoTitle: 'Google Workspace Consulting in Ohio | H2 Technologies LLC',
		meta: 'Ohio Google Workspace consulting for administration, setup, migration planning, email security, and user support.',
		h1: 'Google Workspace Consulting in Ohio',
		serviceSlugs: [
			'google-workspace-administration',
			'microsoft-365-migration',
			'cybersecurity-consulting'
		]
	},
	{
		slug: 'fortinet-consulting-ohio',
		title: 'Fortinet Consulting in Ohio',
		seoTitle: 'Fortinet Consulting in Ohio | H2 Technologies LLC',
		meta: 'Ohio Fortinet consulting for FortiGate firewalls, VPN, policy review, segmentation, and security stack planning.',
		h1: 'Fortinet Consulting in Ohio',
		serviceSlugs: [
			'fortinet-firewall-consulting',
			'vpn-remote-access-solutions',
			'network-monitoring'
		]
	}
];

export function getLocation(slug: string) {
	return locations.find((location) => location.slug === slug);
}
