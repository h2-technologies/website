import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const submissions = await prisma.contactSubmission.findMany({
		orderBy: { createdAt: 'desc' },
		take: 100
	});

	return { submissions };
};

function submissionId(form: FormData): string | null {
	const id = form.get('id');
	return typeof id === 'string' && id.length > 0 ? id : null;
}

export const actions: Actions = {
	markRead: async ({ request, locals }) => {
		const id = submissionId(await request.formData());
		if (!id) return fail(400, { error: 'Missing submission id.' });

		await prisma.contactSubmission.update({
			where: { id },
			data: { status: 'read', readAt: new Date(), viewedBy: locals.user?.email }
		});
	},

	archive: async ({ request }) => {
		const id = submissionId(await request.formData());
		if (!id) return fail(400, { error: 'Missing submission id.' });

		await prisma.contactSubmission.update({
			where: { id },
			data: { status: 'archived' }
		});
	}
};
