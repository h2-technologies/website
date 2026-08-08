<script lang="ts">
	import { absoluteUrl, site } from '$lib/site';

	export let title: string;
	export let description: string;
	export let path = '/';
	export let schema: Record<string, unknown>[] = [];
	export let type: 'website' | 'article' = 'website';
	export let publishedTime: string | undefined = undefined;
	export let modifiedTime: string | undefined = undefined;

	$: canonical = absoluteUrl(path);
	$: socialImage = absoluteUrl(site.socialImage);
	$: schemaGraph = [
		{
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Organization',
					'@id': `${site.url}/#organization`,
					name: site.name,
					url: site.url,
					foundingDate: '2023',
					logo: {
						'@type': 'ImageObject',
						url: absoluteUrl(site.logo),
						width: 161,
						height: 161
					},
					image: socialImage,
					areaServed: site.areaServed,
					address: {
						'@type': 'PostalAddress',
						addressLocality: 'Ashland',
						addressRegion: 'OH',
						addressCountry: 'US'
					}
				},
				{
					'@type': 'WebSite',
					'@id': `${site.url}/#website`,
					name: site.name,
					url: site.url,
					publisher: { '@id': `${site.url}/#organization` }
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
