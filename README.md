# H2 Technologies LLC Website

Production website for H2 Technologies LLC, built with SvelteKit, Svelte 5, Tailwind CSS, and the SvelteKit Node adapter.

The canonical public origin is `https://h2technologiesllc.com`. This repository builds a Node service; it is not a Cloudflare Pages or Workers project. In production, Cloudflare fronts the host, the host's HTTPS reverse proxy (currently Caddy) forwards traffic to the loopback-only Compose port, and the SvelteKit service listens inside the container.

```text
Browser -> Cloudflare -> host HTTPS reverse proxy -> 127.0.0.1:3002 -> website container
```

Cloudflare DNS, TLS, cache rules, and the host reverse-proxy configuration are operational infrastructure outside this repository.

## Requirements

- Node.js `24.18.0` (the supported range is `>=24.18.0 <25`)
- pnpm `9.14.4`
- Chromium installed through Playwright for the browser and accessibility tests
- Docker Engine with the Compose plugin for container builds and deployment

The pinned versions are recorded in `package.json`, the `volta` block, the `packageManager` field, the Docker build arguments, and the GitHub Actions workflow.

## Clean-checkout development

From a new clone:

```bash
git clone https://github.com/h2-technologies/website.git
cd website
npm install --global pnpm@9.14.4
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run dev
```

The development server prints its local URL. No `.env` file, application credentials, or developer-machine configuration is required. Do not add Cloudflare, GitHub, analytics, or deployment credentials to this repository or to client-visible environment variables.

## Verification

Run the same release gate used by CI:

```bash
pnpm run verify
```

`verify` runs the checks sequentially so the production build exists before the server and browser tests start:

```bash
pnpm run check
pnpm run lint
pnpm run build
pnpm test
pnpm audit --audit-level high
```

The test suite exercises the built adapter-node application, including primary routes, internal links and CTAs, responsive browser smoke checks, accessibility checks, metadata, `robots.txt`, `sitemap.xml`, and `security.txt`. Run `pnpm run build` before invoking `pnpm test` by itself.

`pnpm run format` rewrites supported files with Prettier; it is not a read-only check. `pnpm run lint` performs the read-only formatting and ESLint checks used for release validation.

## Application architecture

- `src/routes` contains the SvelteKit pages and public metadata endpoints.
- `src/lib/services.ts`, `src/lib/locations.ts`, and `src/lib/posts.ts` provide the data for crawlable service, location, and resource routes.
- `src/lib/components/Seo.svelte` supplies canonical, Open Graph, social, and structured-data metadata.
- `src/hooks.server.ts` applies response security headers. The SvelteKit CSP is configured in `svelte.config.js`.
- `@sveltejs/adapter-node` produces the deployable `build/` directory.
- `server.js` wraps the generated handler with consistent static-asset security and cache headers.
- The multi-stage Docker build copies only the adapter output and `server.js` wrapper into the runtime image and runs it as the unprivileged `node` user.

The generated `.svelte-kit/` and `build/` directories are local artifacts and are not committed.

## SEO and public security endpoints

The canonical hostname has no `www` prefix, and public page URLs do not use trailing slashes.

- `/robots.txt` allows public crawling and references the canonical sitemap.
- `/sitemap.xml` is generated from the static route list and the service, location, and resource data collections.
- `/.well-known/security.txt` is the RFC 9116 contact document. Renew its `Expires` value before it lapses and confirm that the listed mailbox is monitored.
- Page metadata and schema are generated through the shared SEO component and route data.

When adding a service, location, or resource:

1. Add a complete, unique entry to the appropriate `src/lib/*.ts` collection.
2. Provide an accurate SEO title and meta description.
3. Add useful related-page links without keyword stuffing.
4. Confirm the canonical URL appears once in the generated sitemap.
5. Run `pnpm run verify` and review the page at mobile and desktop widths.

Do not create duplicate pages solely to target keyword variations. Redirect retired public URLs at the reverse-proxy or application layer and remove them from the sitemap.

## Container build and local production run

Build and start the same container used by production:

```bash
docker compose build --pull
docker compose up --detach --wait --remove-orphans
docker compose ps
```

Compose publishes the service as `127.0.0.1:3002:3002`; it is intentionally not exposed on every host interface. A host reverse proxy is required for public traffic.

Verify application readiness from inside the container, without relying on public DNS, TLS, Cloudflare, or the reverse proxy:

```bash
docker compose exec -T website node -e "fetch('http://127.0.0.1:3002/').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1));"
```

The image also defines an equivalent Docker health check. Useful diagnostics are:

```bash
docker compose ps
docker compose logs --tail=200 website
docker inspect --format '{{json .State.Health}}' website-website-1
```

The exact generated container name can vary by Compose project, so obtain it from `docker compose ps` before using `docker inspect`.

The runtime image sets:

- `HOST=0.0.0.0`
- `PORT=3002`
- `NODE_ENV=production`
- `ORIGIN=https://h2technologiesllc.com`

These are non-secret application settings. The current site requires no runtime application secrets and Compose does not load a developer `.env` file.

## CI and deployment

`.github/workflows/build.yml` is the deployment source of truth.

- Pull requests targeting `dev` or `master` run the validation job.
- Pushes to `dev` and `master` run the validation job.
- Manual dispatch runs validation only.
- Deployment runs only after validation succeeds for a push to `master`.
- The deployment job uses the self-hosted runner assigned to the `Production` GitHub environment.
- Deployment rebuilds with current base images, starts Compose with `--wait`, removes orphaned containers, and performs a container-local readiness request.

The repository does not contain production credentials. GitHub runner registration, repository access, Cloudflare configuration, TLS certificates, and reverse-proxy administration remain host or platform responsibilities.

## Release checklist

Before merging a production release:

1. Confirm `pnpm install --frozen-lockfile` and `pnpm run verify` succeed from a clean checkout.
2. Review the pull-request checks and required approvals.
3. Confirm the production runner has Docker and the Compose plugin and that TCP port `127.0.0.1:3002` is available.
4. Merge through the protected branch workflow; do not push directly to `master`.
5. Wait for both validation and deployment jobs to succeed.

After deployment, validate the external layer separately:

1. Confirm HTTP redirects to HTTPS and the apex canonical host is served with a valid certificate.
2. Confirm every supported alternate hostname, including `www`, has valid DNS and TLS and redirects path and query parameters to the apex host.
3. Confirm Cloudflare and the reverse proxy preserve the application's CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and clickjacking protections.
4. Confirm fingerprinted assets receive an immutable cache policy and HTML is not cached beyond the intended release behavior.
5. Fetch `/robots.txt`, `/sitemap.xml`, and `/.well-known/security.txt` from the public origin and compare them with the new release.
6. Run critical navigation and contact CTA smoke tests against the public origin, with no browser console errors.
7. Submit or refresh the sitemap in Google Search Console and Bing Webmaster Tools when URLs change.

A successful repository build does not by itself prove that DNS, TLS, Cloudflare, the host proxy, or the currently running container has been updated.

## Rollback and recovery

The application has no database or persistent Compose volume, so replacing its container does not require a data migration.

For a bad release:

1. Re-run the last known-good successful `master` workflow run to redeploy that commit immediately.
2. Open a pull request that reverts the faulty change so `master` again represents the deployed state.
3. After the revert merges, let the normal `master` deployment complete and repeat the external release checks.

For a container that fails readiness, inspect `docker compose ps` and `docker compose logs --tail=200 website` before changing infrastructure. Once the cause is corrected, rebuild and force a fresh container:

```bash
docker compose build --pull
docker compose up --detach --wait --force-recreate --remove-orphans
```

Do not treat a successful public request as a substitute for container-local readiness, and do not treat a healthy container as proof that the Cloudflare or reverse-proxy layer is correct.
