export type LocationSection = {
	heading: string;
	paragraphs: string[];
	bullets?: string[];
};

export type LocationArea = {
	/** Display name used in copy and in `Service.areaServed`. */
	name: string;
	schemaType: 'State' | 'City' | 'AdministrativeArea';
	/** County or state the area sits inside, for schema and visible context. */
	containedIn?: string;
	/** Communities named on the page so the copy is specific rather than templated. */
	nearby?: string[];
};

export type LocationPage = {
	slug: string;
	/**
	 * `service` pages cover one capability across Ohio. `place` pages cover one
	 * community across capabilities. Keeping the two kinds distinct is what stops
	 * them competing for the same query.
	 */
	kind: 'service' | 'place';
	title: string;
	seoTitle: string;
	meta: string;
	h1: string;
	eyebrow: string;
	intro: string;
	area: LocationArea;
	sections: LocationSection[];
	serviceSlugs: string[];
	faqs: { question: string; answer: string }[];
};

const faq = (question: string, answer: string) => ({ question, answer });

export const locations: LocationPage[] = [
	{
		slug: 'it-services-ohio',
		kind: 'service',
		title: 'IT Services in Ohio',
		seoTitle: 'IT Services in Ohio | H2 Technologies LLC',
		meta: 'Ohio IT services for growing businesses that need practical support, cybersecurity, networks, cloud systems, and software guidance.',
		h1: 'IT Services in Ohio for Growing Businesses',
		eyebrow: 'Statewide IT support',
		intro:
			'Most Ohio businesses that contact H2 Technologies are not looking for a full IT department. They have a specific problem — an aging firewall, a network nobody documented, a workflow held together by spreadsheets — and they need someone who can diagnose it accurately and say what it will take to fix.',
		area: { name: 'Ohio', schemaType: 'State' },
		sections: [
			{
				heading: 'Where an IT engagement usually starts',
				paragraphs: [
					'The first conversation is a current-state review rather than a sales pitch. We ask what the business depends on, what breaks, who currently owns each system, and what has already been tried. That produces a written picture of the environment: internet circuits, firewalls, switches, wireless, servers, cloud tenants, identity, backups, and the vendors attached to each.',
					'From there the work is prioritized by business impact rather than by what is easiest to sell. An untested backup usually outranks a slow laptop. An administrator account with no multi-factor authentication usually outranks a wiring cleanup. The output is a short list you can act on in order, with the reasoning attached so another engineer could review it.'
				],
				bullets: [
					'Inventory of systems, owners, vendors, renewal dates, and support status.',
					'Prioritized risk list with the business consequence written in plain language.',
					'A recommendation on what to fix now, what to schedule, and what to leave alone.'
				]
			},
			{
				heading: 'Remote delivery, and when it is not enough',
				paragraphs: [
					'Identity, cloud tenants, firewall policy, monitoring, documentation, and software work are delivered remotely without loss of quality, which keeps travel out of your invoice. That is how most engagements run.',
					'Some work genuinely requires being in the building: switch and firewall replacements, cabling, physical site surveys, and cutovers where somebody has to be standing next to the rack when the link drops. We schedule those explicitly rather than pretending a remote session can substitute for them. H2 Technologies is based in Ashland and travels for that class of work.'
				]
			},
			{
				heading: 'Working alongside an existing provider',
				paragraphs: [
					'Not every engagement replaces an incumbent. A second opinion on a network design, a firewall configuration review, or an architecture assessment before a large purchase are common reasons to bring in an outside engineer while keeping day-to-day support where it is.',
					'When that is the arrangement, findings are written so your current provider can act on them. The goal is a decision you can defend, not a document that only makes sense if you also change vendors.'
				]
			}
		],
		serviceSlugs: ['managed-it-support', 'cybersecurity-consulting', 'network-monitoring'],
		faqs: [
			faq(
				'Does H2 Technologies require a monthly contract?',
				'No. Engagements can be a one-time assessment, a defined project, or ongoing support. The right structure depends on how much internal ownership the business already has.'
			),
			faq(
				'Can you take over from another IT provider?',
				'Yes, and the transition matters as much as the work. That means documenting the environment, obtaining administrative access, and removing the previous provider’s remote access on an agreed date.'
			),
			faq(
				'How quickly can you review an urgent issue?',
				'Share what is failing and what has changed recently through the contact form. Urgent scoping conversations are usually the fastest path to an accurate answer.'
			)
		]
	},
	{
		slug: 'network-consulting-ohio',
		kind: 'service',
		title: 'Network Consulting in Ohio',
		seoTitle: 'Network Consulting in Ohio | H2 Technologies LLC',
		meta: 'Ohio network consulting for enterprise design, multi-site architecture, routing, VPN, monitoring, IPv6, and BGP planning.',
		h1: 'Network Consulting in Ohio',
		eyebrow: 'Routing and infrastructure',
		intro:
			'H2 Technologies operates AS17290 and publishes its routing policy publicly. Ohio network engagements are handled by the same person who runs that network, which is a different proposition from a help desk that subcontracts anything involving BGP.',
		area: { name: 'Ohio', schemaType: 'State' },
		sections: [
			{
				heading: 'The problems that actually arrive',
				paragraphs: [
					'Network consulting requests tend to fall into a few recognizable shapes. A business has grown into a second or third site and the connectivity between them was never designed, only added. A flat network means a compromised workstation can reach the accounting server. A provider migration is scheduled and nobody is certain what will break. Or an application is slow and it is unclear whether the network, the server, or the software is responsible.',
					'Each of those needs measurement before recommendation. We look at the current topology, routing behavior, VLAN and segmentation design, firewall policy, remote access paths, DNS, and what monitoring exists, then say which layer the symptom is actually coming from.'
				],
				bullets: [
					'Multi-site connectivity, site-to-site routing, and failover behavior.',
					'Segmentation design that separates users, servers, guests, cameras, and building systems.',
					'Provider migrations, circuit cutovers, and rollback plans with validation steps.'
				]
			},
			{
				heading: 'Public routing work',
				paragraphs: [
					'Organizations with provider-independent address space, multiple upstream providers, or their own autonomous system number need a level of routing detail most Ohio IT providers do not offer. That includes prefix and AS-SET registration, RPKI Route Origin Authorizations, IRR route objects, inbound and outbound policy, maximum-prefix limits, and validation from an external vantage point after every change.',
					'H2 Technologies maintains those controls on its own network, and the published AS17290 routing policy states the standard applied to inbound routes and peering requests. That document is the clearest available evidence of how this work is approached.'
				]
			},
			{
				heading: 'Documentation as a deliverable',
				paragraphs: [
					'A network design that exists only in one engineer’s head is a business risk regardless of how good it is. Engagements produce diagrams, addressing plans, policy statements, and change procedures that another qualified operator can follow.',
					'That matters most during the events where cost is highest: an outage at 2 a.m., a staff departure, an insurance questionnaire, or the next provider’s onboarding.'
				]
			}
		],
		serviceSlugs: ['enterprise-network-design', 'bgp-consulting', 'ipv6-consulting'],
		faqs: [
			faq(
				'Do you work on networks you did not design?',
				'Yes. Assessments of existing networks are a common engagement, including environments where the original documentation is missing or out of date.'
			),
			faq(
				'Can you coordinate directly with our internet provider?',
				'Yes. Provider coordination, circuit handoff details, and escalation during cutovers can be part of the engagement.'
			),
			faq(
				'Is BGP relevant to a business with one internet connection?',
				'Usually not. Most single-homed networks are better served by provider-assigned addressing and simpler failover. The AS17290 routing policy page explains when public routing is genuinely warranted.'
			)
		]
	},
	{
		slug: 'cybersecurity-consulting-ohio',
		kind: 'service',
		title: 'Cybersecurity Consulting in Ohio',
		seoTitle: 'Cybersecurity Consulting in Ohio | H2 Technologies LLC',
		meta: 'Ohio cybersecurity consulting for firewall review, remote access, secure infrastructure, recovery planning, and risk reduction.',
		h1: 'Cybersecurity Consulting in Ohio',
		eyebrow: 'Practical risk reduction',
		intro:
			'Security work for a small or midsize Ohio business is rarely about exotic threats. It is about the administrator account that never got multi-factor authentication, the backup nobody has restored from, and the firewall rule somebody added in 2019 to fix a printer.',
		area: { name: 'Ohio', schemaType: 'State' },
		sections: [
			{
				heading: 'What a review covers',
				paragraphs: [
					'A review starts with the controls that fail most often and cost the most when they do: identity and privileged access, remote access paths, firewall policy and exposed services, endpoint and update status, email authentication, logging, and whether backups can actually be restored.',
					'Findings are written with the business consequence attached, not just a severity label. "Anyone with this password can read every mailbox" is more useful to an owner than "weak authentication policy." Each finding gets a recommended fix, an owner, and a realistic sequence.'
				],
				bullets: [
					'Privileged accounts, multi-factor coverage, and offboarding procedure.',
					'Internet-exposed services, VPN design, and administrative interfaces.',
					'Backup scope, retention, immutability, and a tested restore.',
					'SPF, DKIM, and DMARC status across every system that sends mail for the business.'
				]
			},
			{
				heading: 'Security and architecture in the same conversation',
				paragraphs: [
					'Security decisions made separately from network and software decisions tend to be undone by the next project. A segmentation plan gets flattened to make an application work. A recovery plan assumes an identity provider that the cloud migration replaced.',
					'Because H2 Technologies also does the network design and software work, security requirements are set while the architecture is still being decided rather than bolted on afterward. That is the practical argument for keeping these engagements together.'
				]
			},
			{
				heading: 'Insurance questionnaires and customer security reviews',
				paragraphs: [
					'Many Ohio businesses first take security seriously because a cyber insurance renewal or a customer’s vendor questionnaire demands specific answers about multi-factor authentication, backups, endpoint protection, and incident response.',
					'These are not audits, and H2 Technologies does not issue certifications. What we can do is establish what is actually true in your environment, close the gaps that matter, and give you accurate answers you can sign.'
				]
			}
		],
		serviceSlugs: [
			'cybersecurity-consulting',
			'fortinet-firewall-consulting',
			'disaster-recovery-planning'
		],
		faqs: [
			faq(
				'Is this a compliance audit or certification?',
				'No. This is technical risk reduction. The work can support a compliance conversation or an insurance questionnaire, but H2 Technologies does not issue certifications or attestations.'
			),
			faq(
				'Do you run penetration tests?',
				'Engagements focus on configuration review, architecture, and control coverage. Where a formal penetration test is the right instrument, we will say so rather than substituting an assessment for it.'
			),
			faq(
				'What if we find something serious during the review?',
				'Serious findings are raised immediately rather than held for the final report, along with the containment step we would take first.'
			)
		]
	},
	{
		slug: 'software-development-ohio',
		kind: 'service',
		title: 'Software Development in Ohio',
		seoTitle: 'Software Development in Ohio | H2 Technologies LLC',
		meta: 'Ohio custom software development for workflow tools, portals, business automation, dashboards, and secure web applications.',
		h1: 'Software Development in Ohio',
		eyebrow: 'Build and integration',
		intro:
			'Custom software is worth building when an off-the-shelf product genuinely does not fit the way the business works — not because software feels like the modern answer. Most engagements begin by establishing which of those two situations you are in.',
		area: { name: 'Ohio', schemaType: 'State' },
		sections: [
			{
				heading: 'Scoping before building',
				paragraphs: [
					'Discovery maps the actual workflow: who does what, in what order, with which system, and where the handoffs fail. That usually surfaces two or three points where the real cost sits, and those points determine whether the answer is a configuration change to an existing tool, an integration between two systems, a small internal application, or a larger build.',
					'A written scope follows: what the software does, what it deliberately does not do, how data moves in and out, what happens when it fails, and who maintains it afterward. Projects that skip this step are the ones that end up half-finished.'
				],
				bullets: [
					'Internal portals, dashboards, and workflow tools that replace spreadsheet handoffs.',
					'Integrations between existing systems so data stops being re-keyed.',
					'Customer-facing web applications with authentication and access control designed in.'
				]
			},
			{
				heading: 'Built to be maintained',
				paragraphs: [
					'Software written for a business becomes that business’s responsibility. Architecture, dependency choices, deployment, logging, and documentation are treated as part of the deliverable so the application can survive the developer moving on.',
					'Hosting, DNS, TLS, backups, and monitoring are planned with the application rather than handed to whoever is available at launch. The infrastructure side of the same firm doing the build is the reason those pieces do not fall between chairs.'
				]
			},
			{
				heading: 'Assessing software you already own',
				paragraphs: [
					'A frequent request is a second opinion on an existing application: whether it is secure, whether it is maintainable, whether the current developer’s estimate is reasonable, or whether it should be rewritten or extended.',
					'That review covers architecture, dependency and platform support status, authentication and access control, data handling, deployment process, and the realistic cost of each path forward.'
				]
			}
		],
		serviceSlugs: [
			'custom-software-development',
			'business-automation',
			'cloud-infrastructure-consulting'
		],
		faqs: [
			faq(
				'How much does custom software cost?',
				'It depends entirely on scope, and any firm quoting before discovery is guessing. Scoping produces a range with the assumptions written down, so you can decide whether to proceed, reduce scope, or use an existing product instead.'
			),
			faq(
				'Will we own the code?',
				'Ownership and licensing are agreed in writing before development begins. It should never be ambiguous who can modify, host, or move the application later.'
			),
			faq(
				'Can you take over an unfinished project?',
				'Sometimes. It depends on the state of the code, the documentation, and the access available. An assessment establishes whether continuing or restarting is cheaper.'
			)
		]
	},
	{
		slug: 'website-development-ohio',
		kind: 'service',
		title: 'Website Development in Ohio',
		seoTitle: 'Website Development in Ohio | H2 Technologies LLC',
		meta: 'Ohio website development for service businesses that need clear messaging, fast pages, SEO structure, and stronger lead flow.',
		h1: 'Website Development in Ohio',
		eyebrow: 'Web presence',
		intro:
			'For an Ohio service business, the website has one job: let a qualified prospect understand what you do, decide you are credible, and contact you. Most sites that get rebuilt failed at one of those three steps, and it is worth knowing which one before redesigning anything.',
		area: { name: 'Ohio', schemaType: 'State' },
		sections: [
			{
				heading: 'Content structure before visual design',
				paragraphs: [
					'Search engines and prospects want the same thing: a page per service that explains who it is for, what problem it solves, how the work runs, and what happens next. A single page listing eight services gives neither audience enough to act on.',
					'That structure is decided first — which pages exist, what each one targets, how they link to each other, and where the calls to action sit. Visual design follows the structure rather than the other way around.'
				],
				bullets: [
					'A dedicated, substantive page for each service worth ranking for.',
					'Titles, meta descriptions, headings, and schema written per page, not generated from a template.',
					'Internal links that connect related services and lead toward a single clear next step.'
				]
			},
			{
				heading: 'Performance and accessibility are not optional extras',
				paragraphs: [
					'Page speed and accessibility affect both search performance and whether a visitor stays. Sites are built to serve fast, crawlable HTML with as little JavaScript as the job requires, images sized for their actual display, and keyboard navigation and contrast that hold up under testing.',
					'These are verified against a production build before launch, not assumed from a design mockup.'
				]
			},
			{
				heading: 'Migration without losing what already ranks',
				paragraphs: [
					'The most expensive redesign mistake is discarding URLs that already earn traffic. Before anything changes, current URLs, inbound links, and search landing pages are exported, and every retired address is mapped to its closest replacement with a permanent redirect.',
					'After launch, redirects, canonical tags, sitemap, structured data, and form delivery are verified against the live origin rather than the staging environment.'
				]
			}
		],
		serviceSlugs: [
			'business-website-development',
			'custom-software-development',
			'business-automation'
		],
		faqs: [
			faq(
				'Will a redesign hurt our current search rankings?',
				'It can, when URLs change without redirects or when substantive content is cut. A reviewed redirect map and a content inventory before launch are what prevent it.'
			),
			faq(
				'Do you write the content or do we?',
				'Either. Technical services are usually best drafted from an interview with the person who does the work, then edited, because that is where the specificity comes from.'
			),
			faq(
				'Can you work with our existing platform?',
				'Often yes. Whether to keep, upgrade, or replace a platform is a cost question that the assessment answers before any rebuild is proposed.'
			)
		]
	},
	{
		slug: 'google-workspace-consulting-ohio',
		kind: 'service',
		title: 'Google Workspace Consulting in Ohio',
		seoTitle: 'Google Workspace Consulting in Ohio | H2 Technologies LLC',
		meta: 'Ohio Google Workspace consulting for administration, setup, migration planning, email security, and user support.',
		h1: 'Google Workspace Consulting in Ohio',
		eyebrow: 'Productivity platform',
		intro:
			'Google Workspace is usually adopted quickly and administered gradually. The result, a few years in, is a tenant with inherited settings nobody chose, shared drives with unclear ownership, and email authentication that was never finished.',
		area: { name: 'Ohio', schemaType: 'State' },
		sections: [
			{
				heading: 'Administration cleanup',
				paragraphs: [
					'A tenant review covers users, groups, aliases, shared drives and their owners, delegated administration, third-party application access, device policy, and the security settings that were left at their defaults.',
					'External sharing defaults and legacy access methods get particular attention, because they are where data leaves quietly. The output is a list of settings to change, each with what it affects and who it might inconvenience.'
				],
				bullets: [
					'Individual administrator accounts with multi-factor authentication and a protected break-glass account.',
					'Documented joiner, role-change, and departure procedures.',
					'Reviewed external sharing, forwarding rules, and third-party app consent.'
				]
			},
			{
				heading: 'Email authentication done completely',
				paragraphs: [
					'SPF, DKIM, and DMARC only work when every system that sends mail on the domain is accounted for — the marketing platform, the accounting software, the ticketing system, the copier. Missing one is how a DMARC policy change starts silently discarding legitimate invoices.',
					'The work is to inventory every sender first, publish DMARC in monitoring mode, read the reports, and only then move to a stricter policy. DNS is coordinated as part of that, since the same team handling the domain handles the mail flow.'
				]
			},
			{
				heading: 'Migrations in either direction',
				paragraphs: [
					'Moves to Google Workspace and moves from it to Microsoft 365 both involve the same risks: mail flow, identity, delegated access, shared calendars, files and permissions, mobile devices, and the applications that quietly depend on one platform.',
					'Migrations are planned with a pilot group, acceptance checks, a communication plan, and a rollback window, and the source environment is kept until validation is complete.'
				]
			}
		],
		serviceSlugs: [
			'google-workspace-administration',
			'microsoft-365-migration',
			'cybersecurity-consulting'
		],
		faqs: [
			faq(
				'Can you administer our tenant on an ongoing basis?',
				'Yes. Ongoing administration, or a periodic review with your internal administrator retaining daily control, are both workable arrangements.'
			),
			faq(
				'Should we move to Microsoft 365 instead?',
				'It depends on how your team works with files and which line-of-business applications you depend on. The comparison guide in our resources section covers the decision in detail.'
			),
			faq(
				'How disruptive is a Workspace migration?',
				'A well-planned migration is mostly invisible to users on cutover day. The disruption comes from unplanned ones — undiscovered senders, delegated mailboxes, and shared drive permissions.'
			)
		]
	},
	{
		slug: 'fortinet-consulting-ohio',
		kind: 'service',
		title: 'Fortinet Consulting in Ohio',
		seoTitle: 'Fortinet Consulting in Ohio | H2 Technologies LLC',
		meta: 'Ohio Fortinet consulting for FortiGate firewalls, VPN, policy review, segmentation, and security stack planning.',
		h1: 'Fortinet Consulting in Ohio',
		eyebrow: 'FortiGate and security stack',
		intro:
			'A FortiGate is only as good as the policy running on it. Most of the Fortinet work H2 Technologies does is not deployment — it is reviewing an appliance that has been in production for years and accumulating rules the whole time.',
		area: { name: 'Ohio', schemaType: 'State' },
		sections: [
			{
				heading: 'Configuration review',
				paragraphs: [
					'A review reads the running configuration rather than the vendor datasheet: policy order and shadowed rules, overly broad any-any entries, NAT and virtual IP exposure, which security profiles are actually applied to which policies, SSL inspection scope, logging destination and retention, administrative access exposure, and firmware support status.',
					'Each finding is reported with what it permits today, what changing it would affect, and the order in which changes should be made. Firewall changes are the class of work where an unplanned rollback is most expensive, so change sequencing is part of the deliverable.'
				],
				bullets: [
					'Shadowed, unused, and over-permissive policies identified with the traffic they cover.',
					'Segmentation between users, servers, guest wireless, cameras, and building systems.',
					'Administrative access, trusted hosts, and out-of-band recovery path.',
					'Licensing, firmware, and end-of-support dates mapped against the renewal calendar.'
				]
			},
			{
				heading: 'Sizing and replacement planning',
				paragraphs: [
					'Firewall sizing goes wrong when the appliance is chosen against raw throughput numbers rather than throughput with inspection enabled. Encrypted traffic inspection in particular changes the requirement substantially.',
					'Replacement planning starts from the features you intend to run, the circuit speeds you actually have, expected growth, and the support model — then selects hardware, rather than the reverse.'
				]
			},
			{
				heading: 'Remote access that people will use',
				paragraphs: [
					'VPN designs fail for human reasons as often as technical ones. If reconnecting is slow or authentication is confusing, users find ways around it. Designs account for the client that your managed devices can actually run, multi-factor authentication, split-tunnel decisions, DNS behavior, session timeouts, and a documented path for revoking access the day someone leaves.'
				]
			}
		],
		serviceSlugs: [
			'fortinet-firewall-consulting',
			'vpn-remote-access-solutions',
			'network-monitoring'
		],
		faqs: [
			faq(
				'Do you review a FortiGate you did not install?',
				'Yes. Reviewing inherited configurations is the most common Fortinet engagement, including devices installed by a previous provider.'
			),
			faq(
				'Can you help with FortiGate sizing before we buy?',
				'Yes. Sizing guidance based on the features you plan to enable and your real circuit speeds is a short, worthwhile engagement before a purchase.'
			),
			faq(
				'Will changing firewall rules cause an outage?',
				'It can, which is why changes are sequenced, scheduled, and paired with a rollback plan and a validation checklist rather than applied ad hoc.'
			)
		]
	},
	{
		slug: 'it-services-ashland-ohio',
		kind: 'place',
		title: 'IT Services in Ashland, Ohio',
		seoTitle: 'IT Services in Ashland, Ohio | H2 Technologies LLC',
		meta: 'IT support, network, and cybersecurity services for Ashland, Ohio businesses from a technology firm based in Ashland County.',
		h1: 'IT Services in Ashland, Ohio',
		eyebrow: 'Ashland County',
		intro:
			'H2 Technologies is based in Ashland. That is not a service-area claim attached to a map pin — it is where the work is run from, which matters when a switch needs replacing on a Friday afternoon or a firewall cutover needs somebody physically present.',
		area: {
			name: 'Ashland, Ohio',
			schemaType: 'City',
			containedIn: 'Ashland County, Ohio',
			nearby: ['Loudonville', 'Hayesville', 'Jeromesville', 'Savannah', 'Perrysville']
		},
		sections: [
			{
				heading: 'What local actually means here',
				paragraphs: [
					'Several firms running "Ashland IT support" pages are headquartered hundreds of miles away and dispatch to Ashland County only when a contract justifies the drive. That model can work, but it should be stated plainly rather than implied by a location page.',
					'H2 Technologies is an Ashland business. Ashland County work does not require a travel authorization or a regional dispatch queue, and onsite time can be scheduled in hours rather than around a route already planned for another county.'
				],
				bullets: [
					'Ashland County coverage including Loudonville, Hayesville, Jeromesville, Savannah, and Perrysville.',
					'Onsite work for firewall, switch, wireless, and cabling changes that cannot be done remotely.',
					'Remote delivery for identity, cloud, software, and monitoring work, which keeps travel off the invoice.'
				]
			},
			{
				heading: 'The mix of work in Ashland County',
				paragraphs: [
					'Ashland sits on the I-71 corridor between Cleveland and Columbus, and the local business base skews toward manufacturing and operations, professional services, and organizations connected to Ashland University. Those produce a recognizable set of technology problems.',
					'Manufacturing and operations environments raise segmentation questions early: production equipment, building systems, and office computers frequently share one flat network because that is how it was wired originally. Professional services firms tend to arrive with identity, email security, and document-handling questions instead. Both usually need backups verified before anything else is discussed.'
				]
			},
			{
				heading: 'Network engineering available locally',
				paragraphs: [
					'The unusual part of having H2 Technologies in Ashland is the depth of network work available without going to Cleveland or Columbus for it. H2 operates AS17290 and publishes its routing policy publicly, and the same engineer handles BGP, IPv6, and DNS engagements.',
					'For most Ashland County businesses that depth is irrelevant — they need reliable wireless and a firewall that is configured sensibly. But for the ones running their own address space, connecting to multiple providers, or planning public-facing infrastructure, it removes a long drive from the equation.'
				]
			}
		],
		serviceSlugs: ['managed-it-support', 'cybersecurity-consulting', 'enterprise-network-design'],
		faqs: [
			faq(
				'Is H2 Technologies actually located in Ashland?',
				'Yes. H2 Technologies LLC is based in Ashland, Ohio and has been since it was founded in 2023.'
			),
			faq(
				'Do you charge travel time within Ashland County?',
				'Travel expectations are set in writing when an engagement is scoped. Local work is one of the practical advantages of hiring a firm in the county rather than one dispatching into it.'
			),
			faq(
				'Do you work with businesses too small for a full IT contract?',
				'Yes. A one-time assessment, a firewall review, or help with a specific project is a normal engagement and does not require an ongoing agreement.'
			)
		]
	},
	{
		slug: 'it-services-mansfield-ohio',
		kind: 'place',
		title: 'IT Services in Mansfield and Richland County',
		seoTitle: 'IT Services in Mansfield, Ohio | H2 Technologies LLC',
		meta: 'IT support, network design, and cybersecurity consulting for Mansfield and Richland County businesses, delivered from nearby Ashland.',
		h1: 'IT Services in Mansfield and Richland County, Ohio',
		eyebrow: 'Richland County',
		intro:
			'Mansfield is the largest business market in north central Ohio and the most crowded one for IT providers. It is also about twenty miles from H2 Technologies’ base in Ashland, which makes onsite work in Richland County straightforward rather than exceptional.',
		area: {
			name: 'Mansfield, Ohio',
			schemaType: 'City',
			containedIn: 'Richland County, Ohio',
			nearby: ['Ontario', 'Shelby', 'Lexington', 'Bellville', 'Butler', 'Plymouth']
		},
		sections: [
			{
				heading: 'Choosing between the providers competing here',
				paragraphs: [
					'Mansfield has more managed service providers marketing to it than most cities its size, including several multi-state firms whose Richland County pages describe engineers based in other time zones. There is nothing wrong with remote delivery — most good technology work is remote — but it is worth knowing which you are buying.',
					'Three questions separate the options quickly. Who physically comes out when hardware fails, and how far do they travel? Does the same firm handle network engineering and security, or is one subcontracted? And can they show you their own technical work rather than describing it? H2 Technologies publishes its AS17290 routing policy for exactly that reason.'
				],
				bullets: [
					'Richland County coverage including Ontario, Shelby, Lexington, Bellville, Butler, and Plymouth.',
					'Network, firewall, cloud, and software work handled by one firm rather than coordinated across three.',
					'Roughly twenty miles from Ashland, so onsite visits are a normal part of the engagement.'
				]
			},
			{
				heading: 'Multi-site work along the I-71 and US-30 corridors',
				paragraphs: [
					'Mansfield sits near the junction of I-71 and US-30, and a large share of the businesses here operate more than one location — a plant and an office, a main site and a branch, or facilities spread between Richland, Ashland, and Wayne counties.',
					'Multi-site networks are where most of the avoidable cost sits. Connectivity between sites is often added rather than designed, routing between them is undocumented, failover has never been tested, and each location has slightly different firewall rules. Bringing those into one documented design is usually the highest-value network project available to a business this size.'
				]
			},
			{
				heading: 'Manufacturing, healthcare, and institutional environments',
				paragraphs: [
					'Richland County’s employment base includes substantial manufacturing, a regional healthcare presence, and higher education at the shared North Central State College and Ohio State Mansfield campus. Each brings constraints that generic IT support handles poorly.',
					'Production environments include equipment that cannot be patched on a normal schedule and vendors who require remote access. Healthcare-adjacent businesses face data-handling requirements that shape backup and access design. The right answer is usually segmentation and controlled access rather than blanket policies that operations will work around within a week.'
				]
			}
		],
		serviceSlugs: ['enterprise-network-design', 'cybersecurity-consulting', 'managed-it-support'],
		faqs: [
			faq(
				'Do you have an office in Mansfield?',
				'No. H2 Technologies is based in Ashland, roughly twenty miles away, and travels into Richland County for onsite work. We would rather state that plainly than imply a local office.'
			),
			faq(
				'Can you support multiple sites across Richland and Ashland counties?',
				'Yes. Multi-site connectivity, consistent firewall policy, and routing between locations are among the most common projects in this area.'
			),
			faq(
				'How do you handle equipment that cannot be patched?',
				'Through segmentation and controlled access rather than pretending it can be updated. Isolating what cannot be patched is usually more effective than a policy operations will bypass.'
			)
		]
	},
	{
		slug: 'it-services-wooster-ohio',
		kind: 'place',
		title: 'IT Services in Wooster and Wayne County',
		seoTitle: 'IT Services in Wooster, Ohio | H2 Technologies LLC',
		meta: 'IT support, network, and security consulting for Wooster and Wayne County, Ohio businesses from an Ashland-based technology firm.',
		h1: 'IT Services in Wooster and Wayne County, Ohio',
		eyebrow: 'Wayne County',
		intro:
			'Wooster is roughly twenty miles from Ashland along the US-250 corridor, which puts Wayne County comfortably inside the range where onsite work is practical rather than a special arrangement.',
		area: {
			name: 'Wooster, Ohio',
			schemaType: 'City',
			containedIn: 'Wayne County, Ohio',
			nearby: ['Orrville', 'Rittman', 'Doylestown', 'Smithville', 'Apple Creek', 'Dalton']
		},
		sections: [
			{
				heading: 'The Wayne County business mix',
				paragraphs: [
					'Wayne County’s economy leans toward food processing, agribusiness, and manufacturing, alongside the institutional presence of the College of Wooster and Ohio State’s agricultural research campus. That produces a heavier-than-average concentration of production facilities relative to pure office environments.',
					'Production sites change the technology conversation. Wireless coverage has to work across warehouse and plant space rather than a carpeted floor. Scales, sensors, and control systems sit on the network and frequently cannot be patched. Vendor remote access is a routine requirement rather than an exception. And an hour of downtime has a directly calculable cost, which usually makes the case for monitoring and tested recovery without much persuasion.'
				],
				bullets: [
					'Wayne County coverage including Orrville, Rittman, Doylestown, Smithville, Apple Creek, and Dalton.',
					'Segmentation for production equipment, vendor access, and office systems on one physical network.',
					'Wireless design for plant, warehouse, and mixed office environments.'
				]
			},
			{
				heading: 'Connecting Wayne County sites to the rest of the business',
				paragraphs: [
					'Many Wooster-area operations are one facility within a larger business, or a headquarters with plants elsewhere. Either arrangement raises the same questions: how the sites connect, whether that link has a tested failover, whether routing between them is documented, and whether firewall policy is consistent across locations.',
					'These are answerable with a current-state review and a design, and they are considerably cheaper to fix before a provider migration or a plant expansion than during one.'
				]
			},
			{
				heading: 'Working across the Ashland, Wayne, and Richland corridor',
				paragraphs: [
					'Ashland, Wooster, and Mansfield form a compact triangle, and businesses in this corridor often have facilities in more than one of the three counties. Being based in Ashland means all three are within a normal service radius rather than being split across two providers.',
					'For businesses with sites in several of these counties, that is usually the practical argument: one firm holding the documentation, one consistent firewall standard, and one number to call regardless of which building has the problem.'
				]
			}
		],
		serviceSlugs: ['managed-it-support', 'network-monitoring', 'cybersecurity-consulting'],
		faqs: [
			faq(
				'Do you travel to Wooster for onsite work?',
				'Yes. Wooster is roughly twenty miles from H2 Technologies’ base in Ashland, so Wayne County onsite work is routine rather than exceptional.'
			),
			faq(
				'Can you work with production equipment that vendors manage remotely?',
				'Yes. Vendor remote access is normal in this area. The work is to make it controlled and logged rather than open, without breaking the vendor’s support agreement.'
			),
			faq(
				'Do you handle wireless coverage in warehouse and plant space?',
				'Yes. Wireless design for production and warehouse environments is different from office coverage and is planned around the physical space and the devices actually in use.'
			)
		]
	}
];

export function getLocation(slug: string) {
	return locations.find((location) => location.slug === slug);
}

export const serviceAreaPages = locations.filter((location) => location.kind === 'service');
export const placePages = locations.filter((location) => location.kind === 'place');

/** Location pages that reference a given service, used for reverse internal linking. */
export function locationsForService(serviceSlug: string) {
	return locations.filter((location) => location.serviceSlugs.includes(serviceSlug));
}
