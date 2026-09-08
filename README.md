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
- PostgreSQL, for the `/admin` area and the contact form only. The public pages need no database.

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

The development server prints its local URL. Every public page, `sitemap.xml`, `robots.txt`, and `llms.txt` work from a clean checkout with no `.env` file and no credentials.

Two features do need configuration, and only those two: the `/admin` area needs `DATABASE_URL`, and the contact form needs that plus a Cloudflare Turnstile key pair. Copy `.env.example` to `.env` and fill it in to work on them; see [Admin area and contact intake](#admin-area-and-contact-intake). Do not add Cloudflare, GitHub, analytics, or deployment credentials to this repository or to client-visible environment variables.

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

The test suite exercises the built adapter-node application, including primary routes, internal links and CTAs, responsive browser smoke checks, accessibility checks, metadata, `robots.txt`, `llms.txt`, `sitemap.xml`, and `security.txt`. It also covers the admin redirect and `noindex` behaviour and the contact endpoint's validation, honeypot, and fail-closed verification, all without a database. Run `pnpm run build` before invoking `pnpm test` by itself.

`pnpm run format` rewrites supported files with Prettier; it is not a read-only check. `pnpm run lint` performs the read-only formatting and ESLint checks used for release validation.

## Application architecture

- `src/routes` contains the SvelteKit pages and public metadata endpoints.
- `src/lib/services.ts`, `src/lib/locations.ts`, and `src/lib/posts.ts` provide the data for crawlable service, location, and resource routes.
- `src/lib/faqs.ts` holds the site-wide questions rendered at `/faq`; service- and location-specific questions stay with their own collection so each `FAQPage` block matches its page.
- `src/lib/routing-policy.ts` is the HTML source of record for the AS17290 routing policy published at `/routing`. Keep it in step with `static/bgp-routing-policy.pdf`, which is the same policy in downloadable form.
- `src/lib/site.ts` also carries the published name, address, and phone details (`nap`), the founder entity, and the `organizationProfiles` list used for `Organization.sameAs`. Empty values there are omitted from both the page and the schema graph rather than guessed, so anything published must match the Google Business Profile exactly.
- `src/lib/components/Seo.svelte` supplies canonical, Open Graph, social, and structured-data metadata, including the shared `Organization`/`ProfessionalService`, `Person`, and `WebSite` nodes that page-level schema references by `@id`.
- `src/hooks.server.ts` applies response security headers, resolves the signed-in administrator for `/admin` requests, redirects unauthenticated ones to `/admin/login`, and sets `X-Robots-Tag: noindex, nofollow` on everything under `/admin`. Keeping the whole check in one place means a new admin route is protected by existing rather than by remembering to guard it. The SvelteKit CSP is configured in `svelte.config.js`.
- `src/lib/server/` holds the code that never reaches the browser: `db.ts` (the Prisma client, created on first use), `auth.ts` (Argon2id password hashing and database-backed sessions), and `turnstile.ts` (server-side redemption of the Turnstile token).
- `prisma/schema.prisma` defines the `h2_website` database, and `prisma/migrations/` is its migration history. `prisma.config.ts` supplies the connection string to the Prisma CLI, which no longer reads it from the schema.
- `src/routes/admin/` is the signed-in area, and `src/routes/api/contact/+server.ts` is the public intake endpoint behind the contact form.
- `@sveltejs/adapter-node` produces the deployable `build/` directory.
- `server.js` wraps the generated handler with consistent static-asset security and cache headers.
- The multi-stage Docker build copies only the adapter output and `server.js` wrapper into the runtime image and runs it as the unprivileged `node` user.

The generated `.svelte-kit/` and `build/` directories are local artifacts and are not committed.

## SEO and public security endpoints

The canonical hostname has no `www` prefix, and public page URLs do not use trailing slashes.

- `/robots.txt` allows public crawling, excludes `/admin/`, and references the canonical sitemap. Answer-engine and LLM crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended, CCBot) are named in their own groups and allowed deliberately, because several honour only a group matching their own token. Bytespider is refused.
- `/llms.txt` is the plain-language index answer engines read, in the [llmstxt.org](https://llmstxt.org) format. Like the sitemap it is generated from the same `src/lib` collections that define the routes, so it cannot describe a page that does not exist or miss one that does.
- `/sitemap.xml` is generated from the static route list and the service, location, and resource data collections.
- `/.well-known/security.txt` is the RFC 9116 contact document. Renew its `Expires` value before it lapses and confirm that the listed mailbox is monitored.
- Page metadata and schema are generated through the shared SEO component and route data.

Location routes come in two kinds, and the distinction is what keeps them from competing for the same query. A `service` page covers one capability across Ohio; a `place` page covers one community across capabilities. Give every new page genuinely local detail rather than templated copy reused under a different town name.

When adding a service, location, or resource:

1. Add a complete, unique entry to the appropriate `src/lib/*.ts` collection.
2. Provide an accurate SEO title and meta description.
3. Add useful related-page links without keyword stuffing.
4. Confirm the canonical URL appears once in the generated sitemap.
5. Run `pnpm run verify` and review the page at mobile and desktop widths.

Do not create duplicate pages solely to target keyword variations. Redirect retired public URLs at the reverse-proxy or application layer and remove them from the sitemap.

## Admin area and contact intake

`/contact` posts to this origin and stores submissions in PostgreSQL, and `/admin` is where they are read. Neither is reachable without configuration, and the rest of the site does not depend on either.

### Database

The application uses its own database, `h2_website`, on the shared PostgreSQL server, with its own login role. It is deliberately not a schema inside another application's database: a separate database plus least-privilege credentials keeps a compromise of one application away from the other's data and lets each migrate on its own schedule.

Provision it once, as the server's admin role, from outside any application database:

```sql
CREATE DATABASE h2_website;
CREATE ROLE h2_website_app WITH LOGIN PASSWORD 'a generated secret, not this string';
GRANT ALL PRIVILEGES ON DATABASE h2_website TO h2_website_app;
```

Then set `DATABASE_URL` (see `.env.example`) and apply the migration history:

```bash
pnpm run db:migrate
```

`db:migrate` runs `prisma migrate deploy`, which applies committed migrations and creates nothing on its own. Use `pnpm exec prisma migrate dev --name <change>` while developing a schema change, and commit the generated SQL in `prisma/migrations/`.

### Administrator accounts

There is no self-service registration. Accounts are created with:

```bash
pnpm run create-admin admin@h2technologiesllc.com "a long unique password"
```

Passwords are hashed with Argon2id. Running the script again for an address that already exists replaces that password and revokes every session that account had, which is also how a forgotten password is reset.

Sessions are rows in the database rather than stateless tokens, so logging out revokes access immediately instead of waiting for a token to expire, and only the SHA-256 hash of a session token is stored, so the table cannot be read to obtain a working cookie. Sessions expire after twelve hours.

`/admin` is kept out of search indexes in three independent ways, because each fails differently: `Disallow: /admin/` in robots.txt is read before anything is fetched, the `X-Robots-Tag` response header covers redirects and JSON that carry no markup, and the `<meta name="robots">` tag in the admin layout covers a page fetched without its headers being honoured.

### Spam protection

The contact endpoint applies three independent controls before it writes a row:

1. **Cloudflare Turnstile**, redeemed server-side against the siteverify API. A token that is not redeemed is worthless, so this is the control that does the real work. A missing `TURNSTILE_SECRET_KEY` fails closed and rejects the submission.
2. **A honeypot field**, hidden from every visitor and left out of the tab order. A submission that fills it receives the same success response a real one does and is stored nowhere; saying "detected" would only teach whoever wrote the bot which field to skip.
3. **A rate limit** of five submissions per IP address per ten minutes, counted with a database query rather than an in-process map so it still holds if the site is ever run as more than one instance. The address comes from the `CF-Connecting-IP` header Cloudflare sets, falling back to the connecting socket. If the reverse proxy ever strips that header, every visitor shares one bucket and the limit becomes a site-wide cap rather than a per-visitor one, so preserve it in the proxy configuration.

The Turnstile widget must be registered for `h2technologiesllc.com` specifically. A sitekey is bound to its own hostname list, so a widget created for another property will not validate here. `challenges.cloudflare.com` is allowlisted in the CSP `script-src`, `frame-src`, and `connect-src` directives in `svelte.config.js`; if the widget ever renders unstyled, that is the `style-src` directive and not a Turnstile outage.

Two Cloudflare zone settings interact with the rest of this and are worth checking after any change: Bot Fight Mode and AI Crawl Control both act ahead of the origin, so either one can block the answer-engine crawlers that robots.txt just allowed, and an interstitial challenge can break the form's `fetch` call.

### Working on it locally

`pnpm run dev` with a `.env` file is enough. The test suite deliberately runs with `DATABASE_URL` and the Turnstile keys stripped from the server's environment, so it never touches a real database and always exercises the unconfigured, fail-closed path.

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

These are non-secret application settings baked into the image. The secrets are not: `DATABASE_URL`, `TURNSTILE_SECRET_KEY`, and `PUBLIC_TURNSTILE_SITE_KEY` are passed through from a `.env` file kept next to `compose.yaml` on the deployment host. That file is listed in `.gitignore` and in `.dockerignore`, so it is neither committed nor copied into the image. The container serves every public page normally when they are unset; only `/admin` and the contact form stop working.

Because the application now has a database layer, the runtime image also carries the production `node_modules` tree rather than the adapter output alone. `adapter-node` emits bare imports rather than bundling dependencies, and the generated Prisma client and the native `argon2` binding could not be bundled in any case. The build stage prunes development dependencies before the tree is copied across, so the Vite pipeline and the browser test dependencies stay out of the shipped image, but the image is meaningfully larger than it was before the database layer existed.

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
4. When the release changes `prisma/schema.prisma`, apply the migration to `h2_website` before the new container starts, and confirm the change is backward compatible with the currently running release.
5. Merge through the protected branch workflow; do not push directly to `master`.
6. Wait for both validation and deployment jobs to succeed.

After deployment, validate the external layer separately:

1. Confirm HTTP redirects to HTTPS and the apex canonical host is served with a valid certificate.
2. Confirm every supported alternate hostname, including `www`, has valid DNS and TLS and redirects path and query parameters to the apex host.
3. Confirm Cloudflare and the reverse proxy preserve the application's CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and clickjacking protections.
4. Confirm fingerprinted assets receive an immutable cache policy and HTML is not cached beyond the intended release behavior.
5. Fetch `/robots.txt`, `/llms.txt`, `/sitemap.xml`, and `/.well-known/security.txt` from the public origin and compare them with the new release.
6. Run critical navigation and contact CTA smoke tests against the public origin, with no browser console errors. Submit the contact form once and confirm the row lands in `contact_submissions`, then confirm `/admin/submissions` redirects to `/admin/login` from a browser with no session cookie and that both responses carry `X-Robots-Tag: noindex, nofollow`.
7. Submit or refresh the sitemap in Google Search Console and Bing Webmaster Tools when URLs change.

A successful repository build does not by itself prove that DNS, TLS, Cloudflare, the host proxy, or the currently running container has been updated.

## Rollback and recovery

The container itself holds no state and has no persistent Compose volume, so replacing it does not require a data migration. Contact submissions and admin accounts live in the external `h2_website` database, which outlives any container. Reverting application code is therefore safe; reverting past a migration is not, and needs a deliberate down migration written against that database.

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
