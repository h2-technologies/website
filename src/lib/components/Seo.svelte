<script lang="ts">
	import { absoluteUrl, site } from '$lib/site';

	export let title: string;
	export let description: string;
	export let path = '/';
	export let schema: Record<string, unknown>[] = [];

	$: canonical = absoluteUrl(path);
	$: schemaGraph = [
		{
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Organization',
					'@id': `${site.url}/#organization`,
					name: site.name,
					url: site.url,
					logo: absoluteUrl(site.logo),
					areaServed: site.areaServed
				},
				{
					'@type': 'LocalBusiness',
					'@id': `${site.url}/#localbusiness`,
					name: site.name,
					url: site.url,
					image: absoluteUrl(site.image),
					areaServed: site.areaServed,
					address: {
						'@type': 'PostalAddress',
						addressRegion: 'OH',
						addressCountry: 'US'
					}
				},
				{
					'@type': 'WebSite',
					'@id': `${site.url}/#website`,
					name: site.name,
					url: site.url,
					publisher: { '@id': `${site.url}/#organization` },
					potentialAction: {
						'@type': 'SearchAction',
						target: `${site.url}/resources/?q={search_term_string}`,
						'query-input': 'required name=search_term_string'
					}
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
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={absoluteUrl(site.image)} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={absoluteUrl(site.image)} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html schemaMarkup}
</svelte:head>
