export type Post = {
	slug: string;
	title: string;
	seoTitle: string;
	meta: string;
	summary: string;
	toc: string[];
	relatedServices: string[];
};

export const posts: Post[] = [
	{
		slug: 'choose-firewall-small-business',
		title: 'How to Choose a Firewall for a Small Business',
		seoTitle: 'How to Choose a Firewall for a Small Business | H2 Technologies LLC',
		meta: 'A practical guide to choosing a small business firewall based on risk, remote access, management, support, and growth.',
		summary:
			'The right firewall depends on your users, data, remote access needs, network size, and support model. This guide gives business owners a practical checklist.',
		toc: [
			'Start with business risk',
			'Plan remote access',
			'Check reporting and support',
			'Budget for lifecycle'
		],
		relatedServices: ['fortinet-firewall-consulting', 'cybersecurity-consulting']
	},
	{
		slug: 'google-workspace-vs-microsoft-365-small-business',
		title: 'Google Workspace vs Microsoft 365 for Small Businesses',
		seoTitle: 'Google Workspace vs Microsoft 365 for Small Businesses | H2 Technologies LLC',
		meta: 'Compare Google Workspace and Microsoft 365 for email, collaboration, administration, security, and small business operations.',
		summary:
			'Both platforms can work well. The better choice depends on how your team collaborates, handles files, manages identity, and supports users.',
		toc: [
			'Collaboration style',
			'Admin and identity',
			'Email and security',
			'Migration considerations'
		],
		relatedServices: ['google-workspace-administration', 'microsoft-365-migration']
	},
	{
		slug: 'what-is-bgp',
		title: 'What Is BGP and Why Does It Matter?',
		seoTitle: 'What Is BGP and Why Does It Matter? | H2 Technologies LLC',
		meta: 'A plain-English explanation of BGP, public ASN routing, internet connectivity, failover, and why routing design matters.',
		summary:
			'BGP is the routing system that helps networks exchange reachability information on the internet. For organizations with public routing needs, planning matters.',
		toc: ['What BGP does', 'When businesses use it', 'Common risks', 'Planning questions'],
		relatedServices: ['bgp-consulting', 'ipv6-consulting']
	},
	{
		slug: 'why-ipv6-matters',
		title: 'Why IPv6 Matters for Modern Businesses',
		seoTitle: 'Why IPv6 Matters for Modern Businesses | H2 Technologies LLC',
		meta: 'Why IPv6 matters for public services, network planning, security policy, DNS, and long-term infrastructure readiness.',
		summary:
			'IPv6 affects addressing, routing, firewall policy, DNS, and long-term network planning. A phased approach keeps adoption manageable.',
		toc: ['IPv6 basics', 'Business drivers', 'Security implications', 'Adoption plan'],
		relatedServices: ['ipv6-consulting', 'enterprise-network-design']
	},
	{
		slug: 'secure-remote-workers',
		title: 'How to Secure Remote Workers',
		seoTitle: 'How to Secure Remote Workers | H2 Technologies LLC',
		meta: 'A practical checklist for securing remote workers with identity controls, VPN, device hygiene, monitoring, and user guidance.',
		summary:
			'Remote access should be designed around identity, least privilege, device security, monitoring, and a support process users can follow.',
		toc: ['Identity first', 'Remote access design', 'Endpoint basics', 'Support process'],
		relatedServices: ['vpn-remote-access-solutions', 'cybersecurity-consulting']
	},
	{
		slug: 'website-redesign-checklist-small-business',
		title: 'Website Redesign Checklist for Small Businesses',
		seoTitle: 'Website Redesign Checklist for Small Businesses | H2 Technologies LLC',
		meta: 'A checklist for redesigning a business website with clearer messaging, SEO pages, conversion paths, speed, and accessibility.',
		summary:
			'A useful redesign improves clarity, trust, conversion paths, crawlability, accessibility, and speed. Visual polish is only one part of the work.',
		toc: ['Messaging', 'SEO structure', 'Conversion paths', 'Launch checks'],
		relatedServices: ['business-website-development', 'custom-software-development']
	},
	{
		slug: 'disaster-recovery-plan',
		title: 'What to Include in a Disaster Recovery Plan',
		seoTitle: 'What to Include in a Disaster Recovery Plan | H2 Technologies LLC',
		meta: 'The key sections every practical disaster recovery plan should include, from system inventory to restore testing.',
		summary:
			'Disaster recovery planning defines what matters most, how it is backed up, who owns recovery steps, and how restore processes are tested.',
		toc: ['Critical systems', 'Backups', 'Recovery priorities', 'Testing'],
		relatedServices: ['disaster-recovery-planning', 'cloud-infrastructure-consulting']
	},
	{
		slug: 'managed-it-vs-break-fix',
		title: 'Managed IT vs Break-Fix IT Support',
		seoTitle: 'Managed IT vs Break-Fix IT Support | H2 Technologies LLC',
		meta: 'Understand the difference between managed IT and break-fix support, including cost, risk, planning, and user experience.',
		summary:
			'Break-fix support reacts when something fails. Managed IT adds planning, monitoring, security review, and ongoing improvement.',
		toc: ['Support models', 'Cost and risk', 'Security impact', 'Choosing a fit'],
		relatedServices: ['managed-it-support', 'network-monitoring']
	}
];

export function getPost(slug: string) {
	return posts.find((post) => post.slug === slug);
}
