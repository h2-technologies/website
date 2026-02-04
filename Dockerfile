# syntax=docker/dockerfile:1

ARG NODE_VERSION=25.2.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i -g pnpm

RUN pnpm i

ENV PORT=3002

RUN pnpx prisma@6.3.1 generate

RUN pnpm build

USER node

EXPOSE 3002

CMD node ./build/index.js