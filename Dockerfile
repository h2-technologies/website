# syntax=docker/dockerfile:1

ARG NODE_IMAGE=node:24.18.0-alpine@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd
ARG PNPM_VERSION=9.14.4

FROM ${NODE_IMAGE} AS build

ARG PNPM_VERSION

WORKDIR /usr/src/app

# `argon2` is a native module. It currently ships a musl prebuild, but the C toolchain is kept
# available so that a release without one falls back to compiling rather than failing the deploy.
# It stays in this stage and never reaches the runtime image.
RUN apk add --no-cache python3 make g++ \
	&& npm install --global pnpm@${PNPM_VERSION} \
	&& test "$(pnpm --version)" = "${PNPM_VERSION}"

# The `prepare` script runs during install and needs both the Svelte config and the Prisma
# schema, so those are copied before dependencies are installed.
COPY package.json pnpm-lock.yaml svelte.config.js tsconfig.json vite.config.ts prisma.config.ts ./
COPY prisma ./prisma
COPY src/app.html ./src/app.html
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# `adapter-node` leaves dependencies as bare imports rather than bundling them, and the Prisma
# client is generated into `node_modules`, so the runtime image needs the production dependency
# tree rather than the adapter output alone. Pruning here keeps the Vite pipeline and the browser
# test dependencies out of the shipped image; `--ignore-scripts` is required because the
# `prepare` script depends on packages the prune has just removed.
RUN pnpm prune --prod --ignore-scripts

FROM ${NODE_IMAGE} AS runtime

WORKDIR /usr/src/app

ENV HOST=0.0.0.0 \
	NODE_ENV=production \
	ORIGIN=https://h2technologiesllc.com \
	PORT=3002

COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/build ./build
COPY --chown=node:node package.json server.js canonical-url.js ./

EXPOSE 3002

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD ["node", "-e", "fetch('http://127.0.0.1:3002/').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1));"]

CMD ["node", "./server.js"]
