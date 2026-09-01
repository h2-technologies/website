# syntax=docker/dockerfile:1

ARG NODE_IMAGE=node:24.18.0-alpine@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd
ARG PNPM_VERSION=9.14.4

FROM ${NODE_IMAGE} AS build

ARG PNPM_VERSION

WORKDIR /usr/src/app

RUN npm install --global pnpm@${PNPM_VERSION} \
	&& test "$(pnpm --version)" = "${PNPM_VERSION}"

COPY package.json pnpm-lock.yaml svelte.config.js tsconfig.json vite.config.ts ./
COPY src/app.html ./src/app.html
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM ${NODE_IMAGE} AS runtime

WORKDIR /usr/src/app

ENV HOST=0.0.0.0 \
	NODE_ENV=production \
	ORIGIN=https://h2technologiesllc.com \
	PORT=3002

COPY --from=build --chown=node:node /usr/src/app/build ./build
COPY --chown=node:node server.js canonical-url.js ./

EXPOSE 3002

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD ["node", "-e", "fetch('http://127.0.0.1:3002/').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1));"]

CMD ["node", "./server.js"]
