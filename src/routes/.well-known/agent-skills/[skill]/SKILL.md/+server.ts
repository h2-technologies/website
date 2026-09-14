import { error } from '@sveltejs/kit';
import { discoveryHeaders } from '$lib/agent-discovery';
import { findSkill } from '$lib/server/agent-skills';
import { MARKDOWN_CONTENT_TYPE } from '$lib/server/markdown-negotiation';
import type { RequestHandler } from './$types';

export const prerender = false;

/**
 * A published SKILL.md.
 *
 * The route is parameterised rather than written out once per skill so the index and the
 * documents it lists cannot come apart: a skill added to `agent-skills.ts` is indexed,
 * served, and digested in the same edit. An unknown name 404s instead of falling through
 * to something that looks like an empty skill.
 */
export const GET: RequestHandler = ({ params }) => {
	const skill = findSkill(params.skill);
	if (!skill) {
		error(404, 'No such skill');
	}

	return new Response(skill.body, { headers: discoveryHeaders(MARKDOWN_CONTENT_TYPE) });
};
