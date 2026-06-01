FROM node:22-alpine AS base

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @firefly/api prisma generate
RUN pnpm --filter @firefly/api build

EXPOSE 4000

CMD ["pnpm", "--filter", "@firefly/api", "start"]
