import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const siteUrl = 'https://h2technologiesllc.com';

export const staticPaths = [
	'/',
	'/about',
	'/services',
	'/locations',
	'/resources',
	'/faq',
	'/contact',
	'/routing'
];

export const servicePaths = [
	'/services/custom-software-development',
	'/services/business-website-development',
	'/services/enterprise-network-design',
	'/services/bgp-consulting',
	'/services/ipv6-consulting',
	'/services/fortinet-firewall-consulting',
	'/services/google-workspace-administration',
	'/services/microsoft-365-migration',
	'/services/cybersecurity-consulting',
	'/services/vpn-remote-access-solutions',
	'/services/network-monitoring',
	'/services/business-automation',
	'/services/disaster-recovery-planning',
	'/services/cloud-infrastructure-consulting',
	'/services/managed-it-support'
];

export const locationPaths = [
	'/locations/it-services-ohio',
	'/locations/network-consulting-ohio',
	'/locations/cybersecurity-consulting-ohio',
	'/locations/software-development-ohio',
	'/locations/website-development-ohio',
	'/locations/google-workspace-consulting-ohio',
	'/locations/fortinet-consulting-ohio',
	'/locations/it-services-ashland-ohio',
	'/locations/it-services-mansfield-ohio',
	'/locations/it-services-wooster-ohio'
];

export const resourcePaths = [
	'/resources/choose-firewall-small-business',
	'/resources/google-workspace-vs-microsoft-365-small-business',
	'/resources/what-is-bgp',
	'/resources/why-ipv6-matters',
	'/resources/secure-remote-workers',
	'/resources/website-redesign-checklist-small-business',
	'/resources/disaster-recovery-plan',
	'/resources/managed-it-vs-break-fix'
];

export const publicHtmlPaths = [
	...staticPaths,
	...servicePaths,
	...locationPaths,
	...resourcePaths
];

export const expectedSitemapUrls = publicHtmlPaths.map((path) => `${siteUrl}${path}`);

// Files served straight from disk by the adapter's static handler, which never reaches the
// SvelteKit router. The routing PDF in particular is linked publicly and is indexable, so it
// needs the same one-URL-per-resource guarantee the pages get.
export const publicAssetPaths = [
	'/favicon.png',
	'/squareLogo.png',
	'/wideLogo.png',
	'/herobackground.jpg',
	'/clients/bandit-machine.png',
	'/analytics.js',
	'/site.webmanifest',
	'/bgp-routing-policy.pdf'
];

// Everything a crawler or an agent can request and expect a 200 from.
export const publicEndpointPaths = [
	'/sitemap.xml',
	'/robots.txt',
	'/llms.txt',
	'/.well-known/security.txt',
	'/.well-known/api-catalog',
	'/.well-known/ai-catalog.json',
	'/.well-known/agent-skills/index.json',
	'/openapi.json',
	'/auth.md',
	'/health'
];

// Skills are served one document per skill, and the index is what says which exist. The
// names are repeated here rather than read from the index so a skill silently dropped from
// the index fails a test instead of shrinking the thing the test checks.
export const agentSkillNames = [
	'h2-technologies-site',
	'as17290-peering-request',
	'h2-technologies-engagement'
];

export const agentSkillPaths = agentSkillNames.map(
	(name) => `/.well-known/agent-skills/${name}/SKILL.md`
);

/** Documents that must be readable by a browser-based agent from any origin. */
export const corsDiscoveryPaths = [
	'/.well-known/api-catalog',
	'/.well-known/ai-catalog.json',
	'/.well-known/agent-skills/index.json',
	'/openapi.json',
	'/auth.md',
	'/health',
	...agentSkillPaths
];

export const crawlablePaths = [
	...publicHtmlPaths,
	...publicEndpointPaths,
	...agentSkillPaths,
	...publicAssetPaths
];

/**
 * Parses an RFC 8288 `Link` field into `{ target, rel, type }` entries.
 *
 * However many header lines the field arrived on, a client reads it as one
 * comma-separated list, and that is what this returns. Every target the site sends is a
 * URL with no comma in it, so the angle brackets are enough to find the boundaries.
 */
export function parseLinkHeader(value) {
	return [...(value ?? '').matchAll(/<([^>]*)>((?:\s*;\s*[^,]+)*)/g)].map(
		([, target, rawParameters]) => {
			const parameters = [...rawParameters.matchAll(/;\s*([^=;\s]+)\s*=\s*"?([^";]*)"?/g)].map(
				([, name, parameterValue]) => [name.toLowerCase(), parameterValue.trim()]
			);
			return { target, ...Object.fromEntries(parameters) };
		}
	);
}

async function findOpenPort() {
	return await new Promise((resolve, reject) => {
		const listener = createServer();
		listener.once('error', reject);
		listener.listen(0, '127.0.0.1', () => {
			const address = listener.address();
			assert.ok(address && typeof address === 'object');
			listener.close(() => resolve(address.port));
		});
	});
}

async function waitForServer(baseUrl, processError) {
	const deadline = Date.now() + 15_000;
	let lastError;

	while (Date.now() < deadline) {
		if (processError()) {
			throw processError();
		}

		try {
			const response = await fetch(baseUrl, { redirect: 'manual' });
			if (response.status === 200) {
				return;
			}
		} catch (error) {
			lastError = error;
		}

		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	throw lastError ?? new Error(`Production server did not become ready at ${baseUrl}`);
}

export async function startProductionServer() {
	assert.ok(
		existsSync(new URL('../build/index.js', import.meta.url)),
		'Run `pnpm run build` before the production regression tests'
	);
	assert.ok(
		existsSync(new URL('../server.js', import.meta.url)),
		'Production server entry is missing'
	);

	const port = await findOpenPort();
	const baseUrl = `http://127.0.0.1:${port}`;
	const stderr = [];
	let processError;
	const child = spawn(process.execPath, ['server.js'], {
		cwd: root,
		env: {
			...process.env,
			HOST: '127.0.0.1',
			PORT: String(port),
			NODE_ENV: 'production'
		},
		stdio: ['ignore', 'ignore', 'pipe']
	});

	child.stderr.setEncoding('utf8');
	child.stderr.on('data', (chunk) => stderr.push(chunk));
	child.once('error', (error) => {
		processError = error;
	});
	child.once('exit', (code, signal) => {
		if (code !== null && code !== 0) {
			processError = new Error(
				`Production server exited with code ${code}: ${stderr.join('').trim()}`
			);
		} else if (signal && signal !== 'SIGTERM') {
			processError = new Error(`Production server exited from signal ${signal}`);
		}
	});

	try {
		await waitForServer(baseUrl, () => processError);
	} catch (error) {
		child.kill();
		throw error;
	}

	return {
		baseUrl,
		async close() {
			if (child.exitCode !== null || child.signalCode !== null) {
				return;
			}

			await new Promise((resolve) => {
				const fallback = setTimeout(resolve, 2_000);
				child.once('exit', () => {
					clearTimeout(fallback);
					resolve();
				});
				child.kill();
			});
		}
	};
}

export async function fetchWithoutRedirect(baseUrl, path) {
	return await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
}
