import { PROMO_DISMISS_COOKIE, PROMO_DISMISS_VALUE, isPromoActive } from '$lib/promo';
import type { LayoutServerLoad } from './$types';

/**
 * Decides on the server whether the promotional banner is rendered at all.
 *
 * Every page is server-rendered by `adapter-node` with no prerendering and no ISR window, so
 * this runs on each request and the banner stops appearing the moment `PROMO_EXPIRATION`
 * passes — no redeploy, no content edit. Keeping the decision here rather than in the
 * component also means a browser clock cannot be used to resurrect an expired offer: the
 * markup simply is not in the response.
 */
export const load: LayoutServerLoad = ({ cookies, setHeaders }) => {
	// The response body differs for a visitor who dismissed the banner, so say so. HTML is not
	// given a cache-control header by this application, but an upstream cache must not collapse
	// the dismissed and undismissed variants onto one entry.
	setHeaders({ vary: 'Cookie' });

	return {
		showPromoBanner: isPromoActive() && cookies.get(PROMO_DISMISS_COOKIE) !== PROMO_DISMISS_VALUE
	};
};
