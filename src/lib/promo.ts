import { nap, site } from '$lib/site';

/**
 * Limited-time promotional offer rendered site-wide by
 * `src/lib/components/PromoBanner.svelte`.
 *
 * The banner retires itself. `PROMO_EXPIRATION` below is the single source of truth for when
 * the offer ends, `src/routes/+layout.server.ts` evaluates it on the server for every request,
 * and nothing about that requires a code change, a content edit, or a redeploy on October 1.
 * Removing the component afterwards is optional cleanup, not a removal step.
 *
 * The check is deliberately server-side. A visitor who winds their machine's clock back cannot
 * bring an expired offer back, because the browser never decides whether the banner is live.
 */

/**
 * End of the offer: 11:59:59 PM US Eastern on September 30, 2026.
 *
 * The `-04:00` offset is Eastern Daylight Time, which is the offset actually in effect on that
 * date (US daylight saving time does not end until November 1, 2026). Writing the offset into
 * the literal keeps the deadline anchored to Eastern regardless of the server's own time zone.
 */
export const PROMO_EXPIRATION = new Date('2026-09-30T23:59:59-04:00');

/**
 * Cookie that records a visitor dismissing the banner. It is read on the server so a dismissed
 * banner is never sent to the browser in the first place, which avoids the flash-then-collapse
 * that a purely client-side dismissal produces.
 */
export const PROMO_DISMISS_COOKIE = 'h2_promo_inventory_2026';
export const PROMO_DISMISS_VALUE = 'dismissed';

/** Copy and destinations for the offer, kept beside the date so one file governs the banner. */
export const promo = {
	eyebrow: 'Limited-time offer',
	headline: '$12,000 inventory management software — save $3,000 off our standard $15,000 price.',
	subtext:
		'Offer requires signed contract and payment by September 30, 2026, with a go-live date before October 31, 2026.',
	/** Primary call to action. */
	emailLabel: 'Email Sales',
	emailHref: `mailto:${site.salesEmail}?subject=Inventory%20Management%20Software%20Offer`,
	/**
	 * Secondary call to action. Rendered only when `nap.telephone` is published, because the
	 * site never invents name, address, or phone data that has to match the Google Business
	 * Profile character for character. Fill in `nap.telephone` in `src/lib/site.ts` and the
	 * banner picks the number up with no other change.
	 */
	get phoneHref() {
		return nap.telephone ? `tel:${nap.telephone.replace(/[^+\d]/g, '')}` : '';
	},
	get phoneLabel() {
		return nap.telephone ? `Call ${nap.telephone}` : '';
	},
	/** Secondary call to action. */
	contactLabel: 'Use the contact form',
	contactHref: '/contact'
};

/**
 * Whether the offer is still running. `now` is injectable so the behaviour is testable without
 * moving a machine's clock; production callers pass nothing and get the real current time.
 */
export function isPromoActive(now: Date = new Date()) {
	return now < PROMO_EXPIRATION;
}
