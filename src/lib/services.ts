export type Service = {
	slug: string;
	title: string;
	seoTitle: string;
	meta: string;
	h1: string;
	intro: string;
	audience: string[];
	problems: string[];
	benefits: string[];
	process: string[];
	related: string[];
	faqs: { question: string; answer: string }[];
};

const faq = (question: string, answer: string) => ({ question, answer });

export const services: Service[] = [
	{
		slug: 'custom-software-development',
		title: 'Custom Software Development',
		seoTitle: 'Custom Software Development | H2 Technologies LLC',
		meta: 'Custom software development for secure web apps, workflow tools, integrations, dashboards, and maintainable business systems.',
		h1: 'Custom Software Development for Growing Businesses',
		intro:
			'H2 Technologies builds practical, secure software that fits how your business actually operates, from internal tools and portals to integrations and customer-facing applications.',
		audience: [
			'Businesses replacing spreadsheet-heavy workflows',
			'Teams that need custom portals, dashboards, or automation',
			'Organizations modernizing legacy processes'
		],
		problems: [
			'Manual processes slow down delivery',
			'Off-the-shelf tools do not match the workflow',
			'Data is duplicated across disconnected systems',
			'Existing software is hard to maintain or secure'
		],
		benefits: [
			'Clear project scoping before development',
			'Secure application architecture',
			'Business-focused UX and maintainable code',
			'Integrations with existing tools and data sources'
		],
		process: [
			'Discovery and workflow mapping',
			'Technical architecture and project plan',
			'Iterative build with usable milestones',
			'Launch, documentation, and support'
		],
		related: [
			'business-automation',
			'business-website-development',
			'cloud-infrastructure-consulting'
		],
		faqs: [
			faq(
				'What types of software can H2 build?',
				'We focus on business web applications, portals, workflow tools, integrations, dashboards, and practical automation.'
			),
			faq(
				'Can you improve an existing application?',
				'Yes. We can assess architecture, security, usability, maintainability, and identify the best next steps.'
			),
			faq(
				'Do you handle deployment?',
				'Yes. We can support hosting, DNS, security, monitoring, and rollout planning.'
			)
		]
	},
	{
		slug: 'business-website-development',
		title: 'Business Website Development',
		seoTitle: 'Business Website Development | H2 Technologies LLC',
		meta: 'Professional business website development with clear UX, technical SEO, fast pages, conversion-focused content, and practical maintenance support.',
		h1: 'Business Website Development That Turns Visitors Into Leads',
		intro:
			'We design and build fast, professional websites that explain what you do, help customers trust you, and make it easy for qualified prospects to contact your team.',
		audience: [
			'Service businesses that need a stronger web presence',
			'Companies redesigning outdated websites',
			'Teams that need SEO-ready service pages'
		],
		problems: [
			'The website does not clearly explain services',
			'Pages are slow or hard to use on mobile',
			'Lead flow is weak or buried',
			'Search engines have too little useful content to index'
		],
		benefits: [
			'Clear positioning and service messaging',
			'Responsive, accessible layouts',
			'SEO metadata and structured content',
			'Prominent calls to action'
		],
		process: [
			'Content and conversion audit',
			'Information architecture and wireframe',
			'Build, optimize, and test',
			'Launch support and iteration'
		],
		related: ['custom-software-development', 'business-automation', 'website-development-ohio'],
		faqs: [
			faq(
				'Can you write the website copy?',
				'Yes. We can turn technical service details into clear, professional, conversion-focused content.'
			),
			faq(
				'Do you include SEO basics?',
				'Yes. Page titles, meta descriptions, headings, internal links, schema, and sitemap support are included.'
			),
			faq(
				'Can the site stay fast?',
				'Yes. We prefer clean, crawlable pages and avoid unnecessary JavaScript.'
			)
		]
	},
	{
		slug: 'enterprise-network-design',
		title: 'Enterprise Network Design',
		seoTitle: 'Enterprise Network Design | H2 Technologies LLC',
		meta: 'Enterprise network design and infrastructure architecture for multi-site, secure, scalable business environments.',
		h1: 'Enterprise Network Design and Infrastructure Architecture',
		intro:
			'H2 Technologies helps plan, document, and improve business networks with practical architecture for security, reliability, segmentation, remote access, and growth.',
		audience: [
			'Businesses with multiple locations',
			'Teams planning network refreshes',
			'Organizations needing clearer network architecture'
		],
		problems: [
			'Flat networks create security risk',
			'Remote sites are inconsistent',
			'Network changes are poorly documented',
			'Performance and reliability issues are hard to isolate'
		],
		benefits: [
			'Experience with large multi-site network architectures',
			'Clear diagrams and implementation plans',
			'Segmentation and security-first design',
			'Scalable routing, VPN, and monitoring strategy'
		],
		process: [
			'Current-state assessment',
			'Architecture design and risk review',
			'Migration or implementation plan',
			'Documentation and ongoing support'
		],
		related: ['bgp-consulting', 'ipv6-consulting', 'network-monitoring'],
		faqs: [
			faq(
				'Do you work with existing equipment?',
				'Yes. We can assess current infrastructure and recommend practical improvements before new purchases.'
			),
			faq(
				'Can you support multi-site networks?',
				'Yes. We can help with site-to-site connectivity, routing, segmentation, VPN, and monitoring.'
			),
			faq(
				'Do you provide documentation?',
				'Yes. Documentation is part of the deliverable because it reduces future support risk.'
			)
		]
	},
	{
		slug: 'bgp-consulting',
		title: 'BGP Consulting',
		seoTitle: 'BGP Consulting for Public ASN Routing | H2 Technologies LLC',
		meta: 'BGP consulting for public ASN planning, routing design, ISP connectivity, IPv4 and IPv6 announcements, and resilient network architecture.',
		h1: 'BGP Consulting for Public ASN and Resilient Routing',
		intro:
			'We help organizations plan and operate BGP routing environments, including public ASN use, upstream connectivity, prefix announcements, and routing policy design.',
		audience: [
			'Organizations with a public ASN',
			'Businesses planning multi-homed connectivity',
			'Teams preparing IPv6 or routing policy changes'
		],
		problems: [
			'Routing policy is unclear or undocumented',
			'Failover does not behave as expected',
			'IPv4 and IPv6 announcements need planning',
			'ISP coordination is slowing the project'
		],
		benefits: [
			'Public ASN and BGP routing experience',
			'Practical routing policy documentation',
			'IPv4 and IPv6 infrastructure planning',
			'Reduced risk during network changes'
		],
		process: [
			'Routing goals and current-state review',
			'Prefix, ASN, and upstream planning',
			'Policy design and change plan',
			'Validation and documentation'
		],
		related: ['ipv6-consulting', 'enterprise-network-design', 'network-monitoring'],
		faqs: [
			faq(
				'Can H2 help with IPv6 BGP?',
				'Yes. We can plan IPv6 announcements, routing policy, and operational checks alongside IPv4.'
			),
			faq(
				'Do you configure routers directly?',
				'We can provide implementation support or detailed vendor-specific guidance depending on the engagement.'
			),
			faq(
				'Can you help before an ISP cutover?',
				'Yes. We can review routing plans, risks, validation steps, and rollback paths.'
			)
		]
	},
	{
		slug: 'ipv6-consulting',
		title: 'IPv6 Consulting',
		seoTitle: 'IPv6 Consulting and Infrastructure Planning | H2 Technologies LLC',
		meta: 'IPv6 consulting for addressing plans, dual-stack architecture, firewall policy, DNS, BGP routing, and business network readiness.',
		h1: 'IPv6 Consulting and Infrastructure Planning',
		intro:
			'H2 Technologies helps businesses plan IPv6 adoption with clear addressing, routing, security policy, DNS, monitoring, and operational readiness.',
		audience: [
			'Businesses preparing for IPv6 adoption',
			'Network teams modernizing public infrastructure',
			'Organizations needing dual-stack planning'
		],
		problems: [
			'IPv6 addressing is not planned',
			'Firewall rules only account for IPv4',
			'DNS and monitoring miss IPv6 traffic',
			'Teams are unsure how to phase adoption'
		],
		benefits: [
			'IPv4 and IPv6 infrastructure planning',
			'Dual-stack migration guidance',
			'Security-first firewall and routing review',
			'Clear documentation for operations teams'
		],
		process: [
			'Readiness assessment',
			'Addressing and routing plan',
			'Security and DNS review',
			'Pilot, validation, and rollout'
		],
		related: ['bgp-consulting', 'enterprise-network-design', 'cybersecurity-consulting'],
		faqs: [
			faq(
				'Should a small business care about IPv6?',
				'Yes, when public services, remote access, ISP changes, or long-term infrastructure planning matter.'
			),
			faq(
				'Can IPv6 be rolled out gradually?',
				'Yes. A phased dual-stack approach is usually the most practical path.'
			),
			faq(
				'Does IPv6 change firewall requirements?',
				'Yes. IPv6 must be included in security policy, monitoring, and access control design.'
			)
		]
	},
	{
		slug: 'fortinet-firewall-consulting',
		title: 'Fortinet Firewall Consulting',
		seoTitle: 'Fortinet Firewall Consulting | H2 Technologies LLC',
		meta: 'Fortinet firewall consulting for FortiGate planning, configuration review, VPN, segmentation, security policy, and practical business protection.',
		h1: 'Fortinet Firewall Consulting and Security Stack Support',
		intro:
			'We help businesses plan, configure, review, and improve Fortinet security environments with practical policies, remote access, segmentation, and documentation.',
		audience: [
			'Businesses deploying FortiGate firewalls',
			'Teams reviewing security policy',
			'Organizations improving VPN and remote access'
		],
		problems: [
			'Firewall rules have grown messy',
			'VPN access is unreliable or risky',
			'Security features are underused',
			'No one has reviewed the configuration recently'
		],
		benefits: [
			'Fortinet security planning',
			'Cleaner policies and segmentation',
			'VPN and remote-access guidance',
			'Documentation that supports future changes'
		],
		process: [
			'Configuration and goals review',
			'Risk and policy assessment',
			'Recommended changes and rollout plan',
			'Implementation support and handoff'
		],
		related: ['vpn-remote-access-solutions', 'cybersecurity-consulting', 'network-monitoring'],
		faqs: [
			faq(
				'Can you review an existing FortiGate setup?',
				'Yes. We can review rules, VPN, NAT, security profiles, logging, and administrative access.'
			),
			faq(
				'Do you help with Fortinet purchases?',
				'We can provide practical guidance around sizing and deployment planning.'
			),
			faq(
				'Can you support remote workers?',
				'Yes. Fortinet VPN and secure remote access planning are common engagements.'
			)
		]
	},
	{
		slug: 'google-workspace-administration',
		title: 'Google Workspace Administration',
		seoTitle: 'Google Workspace Administration | H2 Technologies LLC',
		meta: 'Google Workspace administration, setup, migration support, user management, security settings, email authentication, and business productivity consulting.',
		h1: 'Google Workspace Administration for Business Teams',
		intro:
			'H2 Technologies supports Google Workspace environments with setup, user administration, security settings, email authentication, migration planning, and practical support.',
		audience: [
			'Businesses adopting Google Workspace',
			'Teams needing admin support',
			'Companies improving email security and account controls'
		],
		problems: [
			'Users and groups are inconsistently managed',
			'Email authentication is incomplete',
			'Security settings are not reviewed',
			'Migration details create downtime risk'
		],
		benefits: [
			'Cleaner administration',
			'Better account and data controls',
			'Email authentication support',
			'Practical training and documentation'
		],
		process: [
			'Admin environment review',
			'Security and configuration recommendations',
			'Migration or cleanup plan',
			'Support, documentation, and handoff'
		],
		related: [
			'microsoft-365-migration',
			'cybersecurity-consulting',
			'google-workspace-consulting-ohio'
		],
		faqs: [
			faq(
				'Can you help set up Google Workspace?',
				'Yes. We can support domains, users, groups, email, security settings, and rollout planning.'
			),
			faq(
				'Do you support email authentication?',
				'Yes. SPF, DKIM, DMARC, and DNS coordination can be included.'
			),
			faq(
				'Can you help users after launch?',
				'Yes. We can provide practical support and documentation for administrators and staff.'
			)
		]
	},
	{
		slug: 'microsoft-365-migration',
		title: 'Microsoft 365 Migration',
		seoTitle: 'Microsoft 365 Migration Consulting | H2 Technologies LLC',
		meta: 'Microsoft 365 migration consulting for email, identity, security, DNS, user planning, and practical transition support.',
		h1: 'Microsoft 365 Migration Consulting',
		intro:
			'We help businesses plan Microsoft 365 migrations with attention to identity, email flow, DNS, security settings, user communication, and business continuity.',
		audience: [
			'Businesses moving to Microsoft 365',
			'Teams switching from another email platform',
			'Organizations needing migration planning help'
		],
		problems: [
			'Migration timing is unclear',
			'DNS and email authentication are risky',
			'Users need communication and support',
			'Security defaults are not enough'
		],
		benefits: [
			'Structured migration planning',
			'Reduced disruption risk',
			'Security and identity review',
			'Clear support path after cutover'
		],
		process: [
			'Current environment review',
			'Migration and communication plan',
			'DNS, identity, and mail flow preparation',
			'Cutover and post-migration support'
		],
		related: ['google-workspace-administration', 'cybersecurity-consulting', 'managed-it-support'],
		faqs: [
			faq(
				'Can H2 migrate from Google Workspace to Microsoft 365?',
				'We can help plan and support migrations between major business productivity platforms.'
			),
			faq(
				'Do you handle DNS changes?',
				'Yes. DNS and email authentication are part of a safe migration plan.'
			),
			faq(
				'Can you help after migration?',
				'Yes. We can assist with account cleanup, training, and support.'
			)
		]
	},
	{
		slug: 'cybersecurity-consulting',
		title: 'Cybersecurity Consulting',
		seoTitle: 'Cybersecurity Consulting for Small and Growing Businesses | H2 Technologies LLC',
		meta: 'Cybersecurity consulting for firewall policy, secure software, identity, remote access, disaster recovery, monitoring, and practical risk reduction.',
		h1: 'Cybersecurity Consulting With Practical Business Outcomes',
		intro:
			'H2 Technologies helps businesses reduce security risk through clear assessments, secure architecture, firewall review, identity controls, remote access planning, and disaster recovery readiness.',
		audience: [
			'Businesses without a dedicated security team',
			'Technical leaders needing outside review',
			'Organizations preparing for growth or compliance conversations'
		],
		problems: [
			'Security responsibilities are unclear',
			'Remote access is risky',
			'Backups and recovery plans are untested',
			'Software and infrastructure decisions happen separately'
		],
		benefits: [
			'Secure software and infrastructure design',
			'Business-focused technical consulting',
			'Prioritized risk reduction',
			'Practical security roadmap'
		],
		process: [
			'Risk and environment review',
			'Prioritized findings',
			'Implementation plan',
			'Follow-up support and documentation'
		],
		related: [
			'fortinet-firewall-consulting',
			'vpn-remote-access-solutions',
			'disaster-recovery-planning'
		],
		faqs: [
			faq(
				'Is this a compliance audit?',
				'No. We focus on practical technical risk reduction, though the work can support compliance readiness.'
			),
			faq(
				'Can you help with both software and infrastructure?',
				'Yes. Security is stronger when application, identity, network, and recovery decisions are aligned.'
			),
			faq(
				'Do you provide a roadmap?',
				'Yes. Recommendations are prioritized so teams know what to fix first.'
			)
		]
	},
	{
		slug: 'vpn-remote-access-solutions',
		title: 'VPN and Remote Access Solutions',
		seoTitle: 'VPN and Remote Access Solutions | H2 Technologies LLC',
		meta: 'VPN and remote access consulting for secure staff connectivity, Fortinet VPN, access controls, MFA planning, and remote work infrastructure.',
		h1: 'VPN and Remote Access Solutions for Secure Work',
		intro:
			'We design and improve remote access so employees can work securely without creating unnecessary network exposure or support headaches.',
		audience: [
			'Businesses supporting remote or hybrid staff',
			'Teams with unreliable VPN access',
			'Organizations tightening access controls'
		],
		problems: [
			'VPN connections are unreliable',
			'Access is broader than necessary',
			'MFA and identity controls are incomplete',
			'Remote work support consumes too much time'
		],
		benefits: [
			'Security-first access design',
			'Fortinet VPN planning support',
			'Better user experience',
			'Clear policies and documentation'
		],
		process: [
			'Use-case and access review',
			'Security and identity planning',
			'Configuration and testing',
			'User rollout and support'
		],
		related: ['fortinet-firewall-consulting', 'cybersecurity-consulting', 'managed-it-support'],
		faqs: [
			faq(
				'Can remote access be secure and easy to use?',
				'Yes. The right design balances authentication, least privilege, reliability, and clear user guidance.'
			),
			faq(
				'Do you support Fortinet VPN?',
				'Yes. Fortinet VPN planning and configuration review can be included.'
			),
			faq(
				'Can you help with hybrid teams?',
				'Yes. We plan access around real user workflows and support needs.'
			)
		]
	},
	{
		slug: 'network-monitoring',
		title: 'Network Monitoring',
		seoTitle: 'Network Monitoring Consulting | H2 Technologies LLC',
		meta: 'Network monitoring consulting for visibility, alerts, uptime, performance, remote sites, firewalls, switches, and business infrastructure.',
		h1: 'Network Monitoring for Business Infrastructure',
		intro:
			'H2 Technologies helps businesses improve visibility into network health, device status, performance issues, and service availability before problems become surprises.',
		audience: [
			'Businesses with multiple network devices or sites',
			'Teams lacking alerting and visibility',
			'Organizations improving operational support'
		],
		problems: [
			'Issues are discovered by users first',
			'No baseline exists for normal performance',
			'Alerts are noisy or missing',
			'Network inventory is incomplete'
		],
		benefits: [
			'Better uptime awareness',
			'Cleaner alerting strategy',
			'Improved troubleshooting',
			'Inventory and documentation support'
		],
		process: [
			'Monitoring goals and inventory',
			'Tooling and alert design',
			'Implementation and tuning',
			'Documentation and review'
		],
		related: ['enterprise-network-design', 'fortinet-firewall-consulting', 'managed-it-support'],
		faqs: [
			faq(
				'Do small businesses need monitoring?',
				'If downtime affects sales, staff productivity, or customer service, monitoring can be valuable.'
			),
			faq(
				'Can you monitor remote sites?',
				'Yes. We can plan monitoring for firewalls, switches, access points, servers, and key services.'
			),
			faq(
				'Will alerts be noisy?',
				'Good monitoring requires tuning. We focus on actionable alerts.'
			)
		]
	},
	{
		slug: 'business-automation',
		title: 'Business Automation',
		seoTitle: 'Business Automation Consulting | H2 Technologies LLC',
		meta: 'Business automation consulting for workflows, integrations, data cleanup, forms, dashboards, and practical process improvements.',
		h1: 'Business Automation That Removes Manual Work',
		intro:
			'We help businesses identify repetitive work, connect tools, build simple workflow systems, and reduce operational drag without overcomplicating the stack.',
		audience: [
			'Teams buried in manual admin work',
			'Businesses moving data between systems by hand',
			'Companies needing repeatable workflows'
		],
		problems: [
			'Staff re-enter the same data',
			'Important handoffs are missed',
			'Reports take too long to prepare',
			'Processes depend on one person'
		],
		benefits: [
			'Less manual work',
			'Cleaner handoffs',
			'Better reporting visibility',
			'Automation aligned with real operations'
		],
		process: [
			'Workflow discovery',
			'Automation opportunity ranking',
			'Build or integration plan',
			'Testing, rollout, and refinement'
		],
		related: [
			'custom-software-development',
			'google-workspace-administration',
			'cloud-infrastructure-consulting'
		],
		faqs: [
			faq(
				'Do you always build custom software for automation?',
				'No. We use the simplest durable approach, which may include existing tools, scripts, integrations, or custom software.'
			),
			faq(
				'Can automation work with Google Workspace?',
				'Yes. Google Workspace workflows, forms, files, and admin processes are common opportunities.'
			),
			faq(
				'How do you choose what to automate first?',
				'We prioritize repeatable work with clear business value and manageable risk.'
			)
		]
	},
	{
		slug: 'disaster-recovery-planning',
		title: 'Disaster Recovery Planning',
		seoTitle: 'Disaster Recovery Planning | H2 Technologies LLC',
		meta: 'Disaster recovery planning for backups, recovery priorities, business continuity, infrastructure documentation, and practical recovery testing.',
		h1: 'Disaster Recovery Planning for Business Continuity',
		intro:
			'H2 Technologies helps businesses create practical recovery plans that identify critical systems, backup gaps, recovery priorities, and testing steps.',
		audience: [
			'Businesses that depend on technology operations',
			'Teams unsure if backups are enough',
			'Organizations preparing for outages or cyber incidents'
		],
		problems: [
			'Backups are not tested',
			'Recovery priorities are unclear',
			'Vendor and access details are scattered',
			'No one knows the real downtime risk'
		],
		benefits: [
			'Clear recovery priorities',
			'Backup and restore review',
			'Practical incident readiness',
			'Documentation that can be used under pressure'
		],
		process: [
			'Critical system inventory',
			'Backup and dependency review',
			'Recovery plan and owner mapping',
			'Testing recommendations and updates'
		],
		related: ['cybersecurity-consulting', 'cloud-infrastructure-consulting', 'managed-it-support'],
		faqs: [
			faq(
				'Is a backup the same as disaster recovery?',
				'No. Backups are one part of recovery. A recovery plan defines priorities, access, dependencies, and testing.'
			),
			faq(
				'Can you test our recovery process?',
				'We can help design and support practical recovery tests.'
			),
			faq(
				'Do small businesses need a plan?',
				'Yes. Even a lightweight plan is better than improvising during an outage.'
			)
		]
	},
	{
		slug: 'cloud-infrastructure-consulting',
		title: 'Cloud Infrastructure Consulting',
		seoTitle: 'Cloud Infrastructure Consulting | H2 Technologies LLC',
		meta: 'Cloud infrastructure consulting for hosting, DNS, architecture, security, backups, monitoring, migrations, and scalable business systems.',
		h1: 'Cloud Infrastructure Consulting for Reliable Systems',
		intro:
			'We help businesses plan cloud infrastructure that is secure, understandable, maintainable, and aligned with real application and operational needs.',
		audience: [
			'Businesses moving systems to the cloud',
			'Teams launching web applications',
			'Organizations improving hosting reliability and security'
		],
		problems: [
			'Cloud costs are unclear',
			'Deployments are fragile',
			'Security and backup settings are incomplete',
			'Application and infrastructure planning are disconnected'
		],
		benefits: [
			'Scalable infrastructure architecture',
			'Secure deployment planning',
			'Monitoring and backup guidance',
			'Better alignment between software and operations'
		],
		process: [
			'Requirements and current-state review',
			'Architecture and cost planning',
			'Implementation or migration plan',
			'Monitoring, documentation, and support'
		],
		related: ['custom-software-development', 'disaster-recovery-planning', 'network-monitoring'],
		faqs: [
			faq(
				'Can you help choose a cloud provider?',
				'Yes. We compare options based on workload, budget, security, support, and operational complexity.'
			),
			faq(
				'Do you handle DNS and domains?',
				'Yes. DNS planning and implementation support can be included.'
			),
			faq(
				'Can you support existing cloud infrastructure?',
				'Yes. We can assess and improve existing environments.'
			)
		]
	},
	{
		slug: 'managed-it-support',
		title: 'Managed IT Support',
		seoTitle: 'Managed IT Support and Practical Business IT | H2 Technologies LLC',
		meta: 'Managed IT support for business technology planning, troubleshooting, accounts, networks, security, vendors, and practical day-to-day support.',
		h1: 'Managed IT Support for Practical Business Technology',
		intro:
			'H2 Technologies provides business-focused IT support that keeps users productive, improves infrastructure reliability, and aligns technology decisions with business goals.',
		audience: [
			'Small and growing businesses',
			'Teams without internal IT leadership',
			'Organizations needing a technical partner for ongoing needs'
		],
		problems: [
			'Support is reactive',
			'Vendors are hard to coordinate',
			'Security and infrastructure planning fall behind',
			'Users need consistent help'
		],
		benefits: [
			'Business-focused technical consulting',
			'One partner across software, network, and support needs',
			'Clear documentation and prioritization',
			'Remote-capable support'
		],
		process: [
			'Environment review',
			'Support priorities and roadmap',
			'Implementation and ongoing support',
			'Regular review and improvement'
		],
		related: ['network-monitoring', 'cybersecurity-consulting', 'google-workspace-administration'],
		faqs: [
			faq(
				'Is this only help desk support?',
				'No. Support can include users, accounts, vendors, networks, cloud services, cybersecurity, and project planning.'
			),
			faq(
				'Can H2 work remotely?',
				'Yes. H2 is Ohio-based and remote-capable for many consulting and support needs.'
			),
			faq(
				'Can support include project work?',
				'Yes. We can combine ongoing support with planned improvements.'
			)
		]
	}
];

export function getService(slug: string) {
	return services.find((service) => service.slug === slug);
}
