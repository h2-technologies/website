import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// `/admin` itself has no content of its own; the hook has already established that the visitor
// is signed in by the time this runs.
export const load: PageServerLoad = async () => {
	redirect(303, '/admin/submissions');
};
