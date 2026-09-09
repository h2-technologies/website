<script lang="ts">
	import {
		absoluteUrl,
		founder,
		nap,
		organizationProfiles,
		postalAddressSchema,
		site
	} from '$lib/site';

	export let title: string;
	export let description: string;
	export let path = '/';
	export let schema: Record<string, unknown>[] = [];
	export let type: 'website' | 'article' = 'website';
	export let publishedTime: string | undefined = undefined;
	export let modifiedTime: string | undefined = undefined;

	const organizationId = `${site.url}/#organization`;
	const founderId = `${site.url}/#founder`;

	const openingHoursSchema = nap.openingHours.map((entry) => ({
		'@type': 'OpeningHoursSpecification',
		dayOfWeek: entry.days,
		opens: entry.opens,
		closes: entry.closes
	}));

	// `ProfessionalService` is a `LocalBusiness` subtype, and Google's LocalBusiness
	// guidance is built around a business a customer can locate and contact: it asks for a
	// complete address, and recommends a telephone and opening hours for the result to be
	// worth showing. Claiming the type while `streetAddress`, `postalCode`, and `telephone`
	// are still blank advertises a local business that cannot be found — which validators
	// flag and Google has no reason to trust.
	//
	// So the claim is made only when the data behind it exists. Until then the entity is a
	// plain `Organization`, which carries no such expectations and is accurate. Filling in
	// `nap` in `site.ts` upgrades the type automatically; the `@id` never changes, so every
	// `provider: { '@id': ... }` reference elsewhere in the graph stays valid either way.
	const isLocatable = Boolean(nap.streetAddress && nap.postalCode && nap.telephone);
	const organizationType = isLocatable ? ['Organization', 'ProfessionalService'] : 'Organization';

	$: canonical = absoluteUrl(path);
	$: socialImage = absoluteUrl(site.socialImage);
	$: schemaGraph = [
		{
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': organizationType,
					'@id': organizationId,
					name: site.name,
					legalName: nap.legalName,
					url: site.url,
					foundingDate: site.foundingDate,
					description: site.description,
					logo: {
						'@type': 'ImageObject',
						// Addressable so pages can point `primaryImageOfPage` at it instead of
						// repeating the same ImageObject in every page-level node.
						'@id': `${site.url}/#logo`,
						url: absoluteUrl(site.logo),
						width: 161,
						height: 161
					},
					image: socialImage,
					areaServed: site.areaServed,
					address: postalAddressSchema(),
					founder: { '@id': founderId },
					...(nap.telephone ? { telephone: nap.telephone } : {}),
					...(nap.email ? { email: nap.email } : {}),
					...(nap.mapUrl ? { hasMap: nap.mapUrl } : {}),
					...(openingHoursSchema.length ? { openingHoursSpecification: openingHoursSchema } : {}),
					...(organizationProfiles.length ? { sameAs: organizationProfiles } : {})
				},
				{
					'@type': 'Person',
					'@id': founderId,
					name: founder.name,
					jobTitle: founder.jobTitle,
					description: founder.shortBio,
					knowsAbout: founder.knowsAbout,
					url: absoluteUrl('/about'),
					worksFor: { '@id': organizationId },
					...(founder.profiles.length ? { sameAs: founder.profiles } : {})
				},
				{
					'@type': 'WebSite',
					'@id': `${site.url}/#website`,
					name: site.name,
					url: site.url,
					inLanguage: 'en-US',
					publisher: { '@id': organizationId }
				},
				...schema
			]
		}
	];
	$: schemaMarkup =
		'<scr' +
		`ipt type="application/ld+json">${JSON.stringify(schemaGraph).replaceAll('<', '\\u003c')}` +
		'</scr' +
		'ipt>';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="index,follow,max-image-preview:large" />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content={type} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={socialImage} />
	<meta property="og:image:width" content="4288" />
	<meta property="og:image:height" content="2848" />
	<meta property="og:image:alt" content={site.socialImageAlt} />
	{#if type === 'article' && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	{#if type === 'article' && modifiedTime}
		<meta property="article:modified_time" content={modifiedTime} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={socialImage} />
	<meta name="twitter:image:alt" content={site.socialImageAlt} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html schemaMarkup}
</svelte:head>
