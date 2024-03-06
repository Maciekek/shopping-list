FROM node:20-alpine
ENV NODE_ENV development

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /user/src/app
COPY package.json .
COPY pnpm-lock.yaml .

COPY . .
