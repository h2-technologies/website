/**
 * HTML source of record for the AS17290 BGP routing policy.
 *
 * The same policy is also published as a PDF at `static/bgp-routing-policy.pdf`
 * for operators who want a document to attach to a peering request. The PDF is
 * not crawlable text, so this collection exists to keep the policy indexable and
 * linkable. Keep the two in sync whenever the policy changes.
 */

export type PolicyRequirement = {
	name: string;
	description: string;
};

export type PolicySection = {
	id: string;
	number: string;
	heading: string;
	paragraphs: string[];
	bullets?: string[];
	orderedItems?: { term: string; description: string }[];
	requirements?: PolicyRequirement[];
};

export const policyIntro =
	'This document sets out the BGP operational and peering requirements for AS17290. It applies to all inbound and outbound traffic and exists so that peers, transit providers, and prospective customers can evaluate route hygiene, security, and validation expectations before opening a request.';

export const policySections: PolicySection[] = [
	{
		id: 'core-identification-and-scope',
		number: '1',
		heading: 'Core identification and scope',
		paragraphs: [
			'The AS-SET is comprehensive and must include all immediate and downstream customer ASNs. It defines the permissible AS-Paths for routes associated with the AS17290 network structure, and it is the object peers should reference when building their filters.'
		],
		orderedItems: [
			{ term: 'Autonomous System Number', description: 'AS-17290' },
			{ term: 'Organizational name', description: 'Austin Hadley' },
			{ term: 'Official AS-SET identifier', description: 'AS-17290:AS-AUSTIN-HADLEY' }
		]
	},
	{
		id: 'inbound-route-acceptance',
		number: '2',
		heading: 'Inbound route acceptance criteria',
		paragraphs: [
			'AS17290 accepts routes only from established peers or transit providers that strictly meet the prefix validation requirements below.',
			'Every advertised IP prefix must be verifiable through at least one of the following methods. Routes that fail all validation checks are filtered and rejected automatically rather than being accepted and reviewed later.'
		],
		requirements: [
			{
				name: 'RPKI valid',
				description:
					'The prefix origin is verifiably covered by a valid Resource Public Key Infrastructure (RPKI) Route Origin Authorization (ROA).'
			},
			{
				name: 'IRR valid',
				description:
					'The prefix and its originating ASN are registered and verifiable within a recognized Internet Routing Registry (IRR) database.'
			},
			{
				name: 'LOA associated',
				description:
					'A valid Letter of Authority (LOA) is on file with AS17290 specifically authorizing the advertised route.'
			}
		]
	},
	{
		id: 'peering-and-transit-onboarding',
		number: '3',
		heading: 'Peering and transit onboarding requirements',
		paragraphs: [
			'AS17290 welcomes requests for both mutual peering, which is settlement-free, and transit peering, which is a paid service. Both are subject to the mandatory conditions below, which exist to protect the stability of the routing table and of the wider internet.',
			'The requesting network must ensure that its primary ASN, along with all of its downstream customer ASNs, has been properly validated and vetted — including registration, contact verification, and operational competence — and that every ASN involved in the proposed advertisements is correctly documented within the requesting network’s publicly registered AS-SETs.',
			'Prefixes announced by the requesting network must meet the same standard of validation required for inbound routes: RPKI or IRR valid, an associated LOA, or verification by other mutually agreed means such as trusted regional Internet Registry documentation or contractual verification.'
		],
		bullets: [
			'ASN and downstream vetting completed for the primary ASN and every customer ASN behind it.',
			'AS-SET accuracy confirmed for all ASNs in the proposed route advertisements.',
			'Prefix validation satisfied through RPKI, IRR, an LOA, or mutually agreed verification.'
		]
	},
	{
		id: 'outbound-route-announcement',
		number: '4',
		heading: 'Outbound route announcement policy',
		paragraphs: [
			'AS17290 announces only prefixes that it directly originates and those belonging to its validated customers. No third-party prefix is announced without the validation described above.',
			'All announced prefixes are maintained with accurate IRR registrations in the form of route objects, and with valid, current RPKI ROAs. Peers are encouraged to filter on those objects rather than trusting announcements on receipt.'
		]
	}
];
