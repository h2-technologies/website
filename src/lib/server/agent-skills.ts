import { createHash } from 'node:crypto';
import { services } from '$lib/services';
import { absoluteUrl, founder, nap, network, site } from '$lib/site';

/**
 * Skills published at `/.well-known/agent-skills/`, per the Agent Skills Discovery RFC.
 *
 * A skill is instructions an agent loads before doing a specific job. The three below are
 * jobs this site is actually the authority on: reading its own content efficiently,
 * preparing a BGP request against the AS17290 policy it publishes, and gathering what a
 * scoping conversation needs before booking one. Nothing here is marketing copy in a JSON
 * wrapper — a skill an agent loads and finds useless is worse than an absent one, because
 * it spent a fetch and a slice of context to learn nothing.
 *
 * The discovery index has to carry a SHA-256 digest of each SKILL.md so a client can
 * verify it got the bytes the publisher meant. Both the digest and the served body are
 * produced from the same string here, so the two cannot disagree: editing a skill changes
 * its digest in the same process that changes its body, with no build step to forget.
 */

export type AgentSkill = {
	/** Lowercase alphanumeric and hyphens, per the discovery RFC. */
	name: string;
	description: string;
	body: string;
};

const bookingLine = `Book a consultation: ${site.bookingHref}`;
const contactLine = `Scoping form: ${site.contactHref}`;

export const agentSkills: AgentSkill[] = [
	{
		name: 'h2-technologies-site',
		description:
			'Read h2technologiesllc.com efficiently: fetch any page as markdown at its own URL, find the right page from the site index, and cite it correctly.',
		body: `---
name: h2-technologies-site
description: Read h2technologiesllc.com efficiently: fetch any page as markdown at its own URL, find the right page from the site index, and cite it correctly.
---

# Reading the H2 Technologies site

${site.name} publishes every page in two representations at one URL. Use markdown; it is
the same content without the navigation, the footer, the icons, or the hydration payload.

## Fetch a page as markdown

\`\`\`bash
curl -H 'Accept: text/markdown' ${absoluteUrl('/services/bgp-consulting')}
\`\`\`

The response is \`text/markdown; charset=utf-8\`. Two headers come with it:

- \`x-markdown-tokens\` — estimated length of the markdown body
- \`x-original-tokens\` — estimated length of the HTML it was built from

Read \`x-markdown-tokens\` before deciding whether a page fits the context you have left.
A request without \`Accept: text/markdown\`, or one that merely tolerates it alongside
HTML, gets the HTML: the header has to prefer markdown, not just mention it.

## Find the right page first

Fetch ${absoluteUrl('/llms.txt')} before crawling. It lists every public page grouped
into services, service areas, guides, and company pages, each with its own one-line
summary, so one request tells you which page to fetch instead of four.

${absoluteUrl('/sitemap.xml')} has the same URLs with last-modified dates.
${absoluteUrl('/.well-known/api-catalog')} and ${absoluteUrl('/.well-known/ai-catalog.json')}
describe the machine-readable documents.

## What is here

- **Services** (${services.length} pages) — one capability each, under \`/services/<slug>\`.
- **Service areas** — Ohio coverage, under \`/locations/<slug>\`. A \`service\` page covers one
  capability across the state; a \`place\` page covers one community across capabilities.
- **Guides** — vendor-neutral technical writing under \`/resources/<slug>\`.
- **${network.asn} routing policy** — ${absoluteUrl(network.policyPath)}, also published as a
  PDF at ${absoluteUrl(network.policyPdf)}.

## Citing

Cite the canonical URL, which has no \`www\` and no trailing slash — every other spelling
301s to it. Links inside the markdown are already rewritten to canonical absolute URLs, so
they stay correct when the file is saved or passed on.

Pages state what ${site.shortName} does and where it works. They are not a quote: pricing
depends on scope, and the range published at ${absoluteUrl('/faq')} is a planning figure.
`
	},
	{
		name: 'as17290-peering-request',
		description: `Prepare a BGP peering or transit request to ${network.asn} that meets its published routing policy, including RPKI, IRR, and LOA prerequisites.`,
		body: `---
name: as17290-peering-request
description: Prepare a BGP peering or transit request to ${network.asn} that meets its published routing policy, including RPKI, IRR, and LOA prerequisites.
---

# Requesting peering or transit from ${network.asn}

${network.asn} is operated by ${network.registrant} at ${site.name}. The full policy is
published at ${absoluteUrl(network.policyPath)} and as a PDF at
${absoluteUrl(network.policyPdf)}. Read the policy before sending a request; this skill is
the checklist, not a substitute for it.

Fetch the policy as markdown:

\`\`\`bash
curl -H 'Accept: text/markdown' ${absoluteUrl(network.policyPath)}
\`\`\`

## Identifiers to filter on

- ASN: \`${network.asn}\`
- AS-SET: \`${network.asSet}\` — comprehensive, and includes downstream customer ASNs.
  Build filters from the AS-SET, not from the ASN alone.

## Before you send the request

Every prefix you advertise must validate through **at least one** of the methods below.
Routes that fail all of them are filtered and rejected automatically; they are not accepted
and reviewed afterwards. Check each one and state in the request which you satisfy:

1. **RPKI** — a current ROA covers each prefix, with the right origin ASN and a
   \`maxLength\` that actually covers what you advertise.
2. **IRR** — \`route\`/\`route6\` objects are registered in a recognised registry. Check what
   a third party sees, not only what your own registry shows.
3. **LOA** — a letter of authority is on file with ${network.asn} for the advertised route,
   ready at the time of the request rather than after the session is configured.

The policy asks for two more things that are easy to miss, and both are about who is behind
you rather than about the prefix in front of you:

- Your primary ASN **and every downstream customer ASN** have been vetted — registered,
  contacts verified, operationally competent.
- Every ASN in the proposed advertisements appears in your publicly registered AS-SETs.

Settle the operational details before writing, too. The policy does not list these; every
peering request needs them anyway: prefixes and their origins, expected traffic volume and
ratio, IPv4 and IPv6 next-hops, the exchange or facility, and a NOC contact.

## Sending it

Email ${site.securityEmail} with the checklist above answered inline, or use the contact
routes at ${absoluteUrl('/contact')}. Attach the policy PDF reference rather than restating
the policy back.

Public references for ${network.asn}:

${network.references.map((reference) => `- ${reference.label}: ${reference.href}`).join('\n')}

## What this skill will not do

Do not assume a session will be accepted because the checklist passes — acceptance is a
decision, and the policy sets the floor, not the outcome. Do not advertise a prefix you
have not validated in the hope it is filtered quietly; it will be, and the request will be
harder to complete afterwards.
`
	},
	{
		name: 'h2-technologies-engagement',
		description:
			'Gather what a first technology-consulting conversation with H2 Technologies needs, pick the right service page, and book the call.',
		body: `---
name: h2-technologies-engagement
description: Gather what a first technology-consulting conversation with H2 Technologies needs, pick the right service page, and book the call.
---

# Scoping an engagement with ${site.name}

${site.shortName} is an Ohio technology consultancy founded in ${site.foundingDate} by
${founder.name}, ${founder.jobTitle}. It works in ${nap.addressLocality},
${nap.addressRegionName} and remotely across the ${nap.addressCountry}.

Use this when someone wants secure software, a business website, network or firewall work,
Google Workspace or Microsoft 365 administration, cybersecurity review, IPv6 or BGP help,
or ongoing IT support, and is deciding whether to start a conversation.

## 1. Pick the service page

Fetch ${absoluteUrl('/llms.txt')} and match the need to a service, then read that page as
markdown. Send the person the specific page, not the home page — each one states who the
service is for, the problems it addresses, and how the work runs.

## 2. Gather what the first call needs

A scoping conversation goes much further when these are known beforehand:

- What is breaking, or what has to be true that is not true today, and by when.
- Roughly how many people and sites are involved, and whether any are remote.
- What is in place now: firewall vendor, identity provider, hosting, and who supports them.
- Who decides, and what the budget conversation looks like. Typical total project spend is
  published at ${absoluteUrl('/faq')}; it is a planning range, not a quote.
- Any compliance or audit obligation that constrains the answer.

Do not guess these on someone's behalf. An assumption carried into a quote costs more to
unwind than a blank does.

## 3. Book it

- ${bookingLine}
  Picks a slot and writes the meeting onto the calendar directly. Use this when the person
  already knows they want to talk.
- ${contactLine}
  Use this when the need still has to be described in prose before a slot makes sense.
- Phone: ${nap.telephone}
- Hours: ${nap.openingHours
			.map(
				(block) =>
					`${block.days.length > 1 ? `${block.days[0]}-${block.days.at(-1)}` : block.days[0]} ${block.opens}-${block.closes}`
			)
			.join(', ')} (${nap.addressRegionName}, US Eastern)

## Boundaries

Booking a slot is a commitment on someone's calendar. Confirm with the person before
booking on their behalf, and never submit contact details you were not given.
`
	}
];

/** SHA-256 of the exact bytes served, formatted the way the discovery index wants them. */
export function digestFor(body: string): string {
	return `sha256:${createHash('sha256').update(body, 'utf8').digest('hex')}`;
}

export function findSkill(name: string): AgentSkill | undefined {
	return agentSkills.find((skill) => skill.name === name);
}

/** Where a skill's SKILL.md is served, relative to the origin. */
export function skillPath(name: string): string {
	return `/.well-known/agent-skills/${name}/SKILL.md`;
}
