export type FaqItem = { question: string; answer: string };

export type FaqGroup = {
	id: string;
	title: string;
	description: string;
	items: FaqItem[];
};

/**
 * Site-wide questions that are not specific to one service. Service-specific
 * questions live with their service in `services.ts`, and location-specific ones
 * in `locations.ts`, so that each `FAQPage` block matches the page it appears on.
 */
export const faqGroups: FaqGroup[] = [
	{
		id: 'working-together',
		title: 'Working with H2 Technologies',
		description:
			'How engagements start, who does the work, and what the arrangement looks like in practice.',
		items: [
			{
				question: 'What does H2 Technologies actually do?',
				answer:
					'Three connected areas: custom software and business websites, network and routing infrastructure including BGP and IPv6, and security work covering firewall policy, remote access, and recovery planning. The combination is deliberate, because decisions in one area routinely constrain the others.'
			},
			{
				question: 'Do I need to sign an ongoing contract?',
				answer:
					'No. A one-time assessment, a defined project, or ongoing support are all normal arrangements. Which one fits depends on how much technical ownership already exists inside your organization.'
			},
			{
				question: 'Who will I actually be working with?',
				answer:
					'H2 Technologies is a small firm led by its founder, Austin Hadley, who does the engineering work rather than handing it to a subcontractor after the sales conversation. The AS17290 routing policy published on this site is his own network documentation.'
			},
			{
				question: 'Do you work remotely or onsite?',
				answer:
					'Both, deliberately. Identity, cloud, software, monitoring, and documentation work is delivered remotely, which keeps travel off your invoice. Hardware replacement, cabling, site surveys, and cutovers are scheduled onsite because a remote session is not a substitute for them.'
			},
			{
				question: 'Where do you work geographically?',
				answer:
					'H2 Technologies is based in Ashland, Ohio. Onsite work centers on Ashland, Richland, and Wayne counties. Remote engagements are delivered anywhere in Ohio and nationally.'
			},
			{
				question: 'Can you work alongside our existing IT provider?',
				answer:
					'Yes. Second opinions on a network design, a firewall configuration review, or an architecture assessment before a major purchase are common, and findings are written so your current provider can act on them.'
			}
		]
	},
	{
		id: 'scoping-and-cost',
		title: 'Scoping, cost, and timelines',
		description: 'How work gets priced, and why an accurate number requires discovery first.',
		items: [
			{
				question: 'How much does custom software cost?',
				answer:
					'It depends entirely on scope, and any firm quoting a number before discovery is guessing. Scoping produces a range with the assumptions written down, so you can decide whether to proceed, cut scope, or use an existing product instead. Sometimes the honest answer is that software is not the right purchase.'
			},
			{
				question: 'What does a technology assessment include?',
				answer:
					'A current-state review of the systems the business depends on, the vendors and owners attached to each, and where the real risk sits. The deliverable is an inventory plus a prioritized list of findings with the business consequence and recommended fix written in plain language.'
			},
			{
				question: 'How long does a typical project take?',
				answer:
					'Assessments are usually measured in days and produce something you can act on immediately. Implementation timelines depend on scope, change windows, and vendor lead times, so a schedule is committed after scoping rather than before it.'
			},
			{
				question: 'What information do you need to give an accurate estimate?',
				answer:
					'The business outcome you want, the current environment, what has already been tried, any hard deadline, and a budget range. That last one is not a negotiating tactic; it determines whether the right answer is a configuration change or a build.'
			},
			{
				question: 'Do you resell hardware and licensing?',
				answer:
					'H2 Technologies can supply and support Fortinet equipment and coordinate licensing where that is useful. Sizing recommendations are made against the features you intend to run and your actual circuit speeds, and you are free to purchase elsewhere.'
			}
		]
	},
	{
		id: 'networks-and-routing',
		title: 'Networks, routing, and infrastructure',
		description:
			'Questions about the network engineering side, including public routing work most providers do not offer.',
		items: [
			{
				question: 'Does my business need BGP?',
				answer:
					'Usually not. Public BGP is warranted when you hold provider-independent address space, connect to more than one internet provider, or need direct control over public route announcements. Most single-homed networks are better served by provider-assigned addressing and simpler failover.'
			},
			{
				question: 'What is AS17290?',
				answer:
					'It is the public autonomous system operated by H2 Technologies. Its full routing policy, including inbound validation requirements and peering criteria, is published on this site rather than described in marketing terms.'
			},
			{
				question: 'Should a small business care about IPv6?',
				answer:
					'It matters when you run public-facing services, plan a provider change, or want to avoid treating address-family support as an emergency during a later migration. IPv6 connectivity also frequently already exists through providers and devices without having been deliberately deployed, which creates a visibility gap worth closing.'
			},
			{
				question: 'Can you document a network nobody has documented?',
				answer:
					'Yes, and it is one of the more common requests. A current-state review produces diagrams, an addressing plan, and change procedures another qualified engineer could follow, which is what makes the network survivable when staff change.'
			},
			{
				question: 'Do you work on networks you did not design?',
				answer:
					'Yes. Most network engagements involve inherited environments where the original documentation is missing or out of date.'
			}
		]
	},
	{
		id: 'security-and-continuity',
		title: 'Security and continuity',
		description: 'What security engagements cover, and what they deliberately do not.',
		items: [
			{
				question: 'Is a security review the same as an audit or certification?',
				answer:
					'No. H2 Technologies performs technical risk reduction and does not issue certifications or attestations. The work can support a compliance conversation or a cyber insurance questionnaire by establishing what is actually true in your environment.'
			},
			{
				question: 'Are our backups good enough?',
				answer:
					'A backup job that reports success is not evidence that recovery works. The question is answered by attempting a restore into an isolated environment and verifying that the application and its records are usable afterward, which is a normal part of a recovery review.'
			},
			{
				question: 'What should we fix first?',
				answer:
					'In most small and midsize environments the same items surface: multi-factor authentication on administrative accounts, a tested restore, removing broad remote access, and completing email authentication. Findings are always prioritized by business consequence rather than by severity label alone.'
			},
			{
				question: 'What happens if you find something serious mid-engagement?',
				answer:
					'It is raised immediately rather than held for the final report, along with the containment step we would take first.'
			}
		]
	}
];

export const allFaqItems: FaqItem[] = faqGroups.flatMap((group) => group.items);
