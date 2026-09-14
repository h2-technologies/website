import { JSON_CONTENT_TYPE, discoveryHeaders } from '$lib/agent-discovery';
import { agentSkills, digestFor, skillPath } from '$lib/server/agent-skills';
import { absoluteUrl } from '$lib/site';

export const prerender = false;

/**
 * `/.well-known/agent-skills/index.json`, the Agent Skills Discovery index.
 *
 * Every entry is `skill-md`: a single SKILL.md served at its own URL, with no archive to
 * unpack and nothing to execute. The digest is computed here from the same string the
 * SKILL.md route serves, so a client that verifies it is checking the bytes it actually
 * received against the bytes this publisher meant to send — which is the only reading of
 * the digest that is worth anything.
 */
const body = JSON.stringify(
	{
		$schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
		skills: agentSkills.map((skill) => ({
			name: skill.name,
			type: 'skill-md',
			description: skill.description,
			url: absoluteUrl(skillPath(skill.name)),
			digest: digestFor(skill.body)
		}))
	},
	null,
	'\t'
);

export function GET() {
	return new Response(body, { headers: discoveryHeaders(JSON_CONTENT_TYPE) });
}
