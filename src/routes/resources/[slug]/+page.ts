import { error } from '@sveltejs/kit';
import { getPost, posts } from '$lib/posts';

export function entries() {
	return posts.map((post) => ({ slug: post.slug }));
}

export function load({ params }) {
	const post = getPost(params.slug);

	if (!post) {
		error(404, 'Resource not found');
	}

	return { post };
}
