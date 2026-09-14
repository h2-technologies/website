import { isPromoActive } from '$lib/promo';
import type { LayoutServerLoad } from './$types';

/**
 * Decides whether the promotional banner is rendered at all.
 *
 * The decision is made from the clock and nothing else, so every visitor receives byte-identical
 * HTML for a given page. That is what makes the page cacheable at the edge: Cloudflare serves it
 * without waiting on this server, and no visitor can be handed a response shaped by another
 * visitor's state.
 *
 * The expiration check stays here rather than in the component. A browser clock wound backwards
 * cannot revive the offer, because `isPromoActive()` runs on the server and an expired banner is
 * simply absent from the markup — which is also why this load function still exists.
 *
 * Dismissal is the half that had to move. It is per visitor, so it is decided in the browser by
 * the blocking script in `src/app.html`, before the banner is painted. Reading the dismissal
 * cookie here would force `Vary: Cookie` onto every page, and a cache that cannot honour it —
 * Cloudflare honours `Vary` only for `Accept-Encoding` — would serve one visitor's dismissed
 * banner to the next, or pin the banner back for someone who closed it.
 */
export const load: LayoutServerLoad = () => {
	return {
		showPromoBanner: isPromoActive()
	};
};
