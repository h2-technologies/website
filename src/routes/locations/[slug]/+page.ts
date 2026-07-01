import { error } from '@sveltejs/kit';
import { getLocation, locations } from '$lib/locations';

export function entries() {
	return locations.map((location) => ({ slug: location.slug }));
}

export function load({ params }) {
	const location = getLocation(params.slug);

	if (!location) {
		error(404, 'Location page not found');
	}

	return { location };
}
