# H2 Technologies LLC Website

SvelteKit website for H2 Technologies LLC.

## Development

```bash
pnpm install
pnpm run dev
```

## Checks

```bash
pnpm run format
pnpm run lint
pnpm run check
pnpm run build
```

## Docker

```bash
docker-compose up -d
```

## SEO and Content Strategy

The site uses data-driven SvelteKit pages so important service, location, and resource pages are crawlable, internally linked, and easy to extend.

- Service pages live in `src/lib/services.ts` and render through `src/routes/services/[slug]/+page.svelte`.
- Ohio location pages live in `src/lib/locations.ts` and render through `src/routes/locations/[slug]/+page.svelte`.
- Resource starter articles live in `src/lib/posts.ts` and render through `src/routes/resources/[slug]/+page.svelte`.
- Shared SEO metadata and Organization, LocalBusiness, WebSite, Service, FAQ, Article, and breadcrumb schema are handled by reusable components and route data.
- `src/routes/sitemap.xml/+server.ts` and `src/routes/robots.txt/+server.ts` expose crawl directives and all generated page URLs.

To add a future service or article, add a new object to the appropriate `src/lib/*.ts` file, include related internal links, write a unique SEO title and meta description, and ensure the page answers a clear search intent without keyword stuffing.
