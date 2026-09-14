import { LLMS_PATH } from '$lib/agent-discovery';
import { nap, site } from '$lib/site';

/**
 * WebMCP: the tools this site offers to an agent driving the browser.
 *
 * The same four things an agent wants from this site over HTTP — the page inventory, a
 * search across it, a page's text, and how to get in touch — are offered here as callable
 * tools, so an agent already inside the page does not have to re-derive them by scraping
 * the DOM. `navigator.modelContext` is only present where the user agent implements
 * WebMCP; everywhere else these functions do nothing at all, which is why registration is
 * a feature test and never a polyfill.
 *
 * The tool set is deliberately small and almost entirely read-only. Every tool here does
 * something the site already does for any visitor: it reads a public page, or it moves to
 * one. None of them submits a form, sends a message, or books anything on a person's
 * behalf — an agent can take someone to the booking page, and a person decides what
 * happens there.
 *
 * The page inventory comes from `/llms.txt` at call time rather than from a copy compiled
 * into this bundle. That file is generated from the route data, so an agent asking the
 * browser gets the same answer as an agent asking the origin, and neither drifts as pages
 * are added. It also keeps the service, location, and post collections — about 100 KB of
 * prose — out of every page load, which is the cost of the obvious alternative.
 */

type ToolResult = { content: { type: 'text'; text: string }[] };

const text = (value: string): ToolResult => ({ content: [{ type: 'text', text: value }] });

/** One page, as `/llms.txt` lists it. */
type IndexEntry = { section: string; title: string; url: string; summary: string };

/**
 * Reads a string argument out of a tool call.
 *
 * Tool input arrives from a model, so it is untrusted and may be any shape at all,
 * including a missing key or a number where a string was asked for. Everything here goes
 * through this rather than trusting the declared `inputSchema` to have been enforced.
 */
function stringArgument(input: Record<string, unknown>, name: string): string {
	const value = input?.[name];
	return typeof value === 'string' ? value.trim() : '';
}

function parseIndex(body: string): IndexEntry[] {
	const entries: IndexEntry[] = [];
	let section = '';

	for (const line of body.split('\n')) {
		const heading = line.match(/^##\s+(.+)$/);
		if (heading) {
			section = heading[1].trim();
			continue;
		}

		const entry = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\):\s*(.*)$/);
		if (entry) {
			entries.push({
				section,
				title: entry[1].trim(),
				url: entry[2].trim(),
				summary: entry[3].trim()
			});
		}
	}

	return entries;
}

let indexRequest: Promise<IndexEntry[]> | null = null;

/** The site inventory, fetched once per page and re-fetched if that fetch failed. */
async function siteIndex(): Promise<IndexEntry[]> {
	indexRequest ??= (async () => {
		const response = await fetch(LLMS_PATH, { headers: { accept: 'text/plain' } });
		if (!response.ok) {
			throw new Error(`${LLMS_PATH} returned ${response.status}`);
		}
		return parseIndex(await response.text());
	})().catch((error) => {
		// A failed fetch must not be cached as the answer: the next call should try again
		// rather than keep reporting a network blip as an empty site.
		indexRequest = null;
		throw error;
	});

	return indexRequest;
}

const formatEntries = (entries: IndexEntry[]) =>
	entries.map((entry) => `- ${entry.title} — ${entry.url}\n  ${entry.summary}`).join('\n');

/**
 * Resolves a tool's path argument against this origin.
 *
 * A model can pass any string here, including a URL somewhere else entirely. Resolving
 * and then checking the origin means `read_page` stays a tool for reading *this* site
 * rather than a general-purpose fetcher that happens to live on it.
 */
function sameOriginUrl(value: string): URL | null {
	try {
		const url = new URL(value, window.location.origin);
		return url.origin === window.location.origin ? url : null;
	} catch {
		return null;
	}
}

const tools: ModelContextTool[] = [
	{
		name: 'list_pages',
		description: `List the public pages of ${site.name}, optionally narrowed to one section: services, service areas, guides, company, or machine-readable documents.`,
		inputSchema: {
			type: 'object',
			properties: {
				section: {
					type: 'string',
					description:
						'Section name as it appears in the site index, for example "Services" or "Guides". Omit for every page.'
				}
			},
			additionalProperties: false
		},
		annotations: { readOnlyHint: true },
		async execute(input) {
			const section = stringArgument(input, 'section').toLowerCase();
			const entries = await siteIndex();
			const matches = section
				? entries.filter((entry) => entry.section.toLowerCase().includes(section))
				: entries;

			if (matches.length === 0) {
				const sections = [...new Set(entries.map((entry) => entry.section))].join(', ');
				return text(`No section matching "${section}". Sections: ${sections}.`);
			}

			return text(formatEntries(matches));
		}
	},
	{
		name: 'search_pages',
		description: `Find pages on ${site.name} whose title or summary matches a query, such as "firewall", "IPv6", or "Ashland".`,
		inputSchema: {
			type: 'object',
			properties: {
				query: { type: 'string', description: 'Words to look for.' }
			},
			required: ['query'],
			additionalProperties: false
		},
		annotations: { readOnlyHint: true },
		async execute(input) {
			const query = stringArgument(input, 'query').toLowerCase();
			if (!query) {
				return text('Give a query to search for.');
			}

			const entries = await siteIndex();
			const matches = entries.filter((entry) =>
				`${entry.title} ${entry.summary}`.toLowerCase().includes(query)
			);

			return matches.length === 0
				? text(`Nothing on this site matches "${query}". Use list_pages to see what is here.`)
				: text(formatEntries(matches));
		}
	},
	{
		name: 'read_page',
		description: `Read any page of ${site.name} as markdown — its text without the navigation, footer, or layout.`,
		inputSchema: {
			type: 'object',
			properties: {
				path: {
					type: 'string',
					description:
						'Path or full URL on this site, for example "/services/bgp-consulting". Pages elsewhere are refused.'
				}
			},
			required: ['path'],
			additionalProperties: false
		},
		annotations: { readOnlyHint: true },
		async execute(input) {
			const requested = stringArgument(input, 'path');
			const url = sameOriginUrl(requested);
			if (!url) {
				return text(`read_page only reads pages on ${window.location.origin}.`);
			}

			const response = await fetch(url, { headers: { accept: 'text/markdown' } });
			if (!response.ok) {
				return text(`${url.pathname} returned ${response.status}.`);
			}

			return text(await response.text());
		}
	},
	{
		name: 'get_contact_details',
		description: `Get how to reach ${site.name}: phone, address, business hours, and the two ways to start a conversation.`,
		inputSchema: { type: 'object', properties: {}, additionalProperties: false },
		annotations: { readOnlyHint: true },
		async execute() {
			const hours = nap.openingHours
				.map((block) => `${block.days.join(', ')}: ${block.opens}-${block.closes}`)
				.join('\n');

			return text(
				[
					`${nap.legalName}`,
					`${nap.streetAddress}, ${nap.addressLocality}, ${nap.addressRegion} ${nap.postalCode}`,
					`Phone: ${nap.telephone}`,
					'',
					'Hours (US Eastern):',
					hours,
					'',
					`Book a consultation: ${site.bookingHref}`,
					`Describe a project first: ${site.contactHref}`,
					`Security reports: ${site.securityEmail}`
				].join('\n')
			);
		}
	},
	{
		name: 'open_booking_page',
		description: `Open the ${site.shortName} contact page, where a visitor can pick a consultation slot or describe a project. Opens the page; it does not book anything.`,
		inputSchema: { type: 'object', properties: {}, additionalProperties: false },
		// Not read-only: it takes the person somewhere. It is still not consequential — no
		// slot is reserved, no message is sent, and nothing reaches H2 Technologies until the
		// person on the page decides it should.
		annotations: { readOnlyHint: false },
		async execute() {
			window.location.assign('/contact');
			return text('Opened the contact page. Pick a time there, or describe the project first.');
		}
	}
];

/**
 * Offers the tools above to the user agent, if it implements WebMCP.
 *
 * Two shapes of the API are in circulation: `provideContext`, which declares a page's
 * whole tool set at once, and `registerTool`, which adds them one at a time. Both are
 * handled because the specification is still moving and a site that picks one is invisible
 * to the browsers that shipped the other.
 *
 * Returns a teardown function so the caller can withdraw the tools; a page that is gone
 * should not still be advertising things it can do.
 */
export function provideSiteTools(): () => void {
	const context = navigator.modelContext ?? document.modelContext;
	if (!context) {
		return () => {};
	}

	if (typeof context.provideContext === 'function') {
		void context.provideContext({ tools });
		return () => void context.provideContext?.({ tools: [] });
	}

	if (typeof context.registerTool === 'function') {
		const controller = new AbortController();
		for (const tool of tools) {
			void context.registerTool(tool, { signal: controller.signal });
		}
		return () => controller.abort();
	}

	return () => {};
}
