# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Firefly Health Platform — production-style full-stack SaaS for school mental wellbeing operations using a multi-tier care model (Tier 1, Tier 2, Tier 3). See `README.md` for the public summary and `PROJECT_REQUIREMENTS_AND_DELIVERY.md` for the SRS traceability baseline (which modules are Implemented / Partial / Not Started — useful for prioritizing work).

## Common commands

All commands run from the repo root. Node 22 (pinned via `.nvmrc`), pnpm 9.15.4.

```bash
# install
pnpm install

# local env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# postgres (Docker is the easy path)
docker compose up -d

# prisma — generate client, push schema, seed
pnpm db:generate
pnpm db:push
pnpm db:seed

# dev (runs api + web concurrently, prefixed logs)
pnpm dev
# web: http://localhost:3000  •  api: http://localhost:4000  •  /api/v1/* proxied through Next.js
pnpm dev:api          # api only
pnpm dev:web          # web only

# typecheck + build (production)
pnpm typecheck
pnpm build
```

There is no test runner configured in this repo. `pnpm lint` runs each app's lint script; the API's lint is a no-op (`echo "No lint configured for API yet"`), and the web uses `next lint`.

Containerized production: `docker compose -f docker-compose.prod.yml up --build -d` — note this compose uses the root `apps/api/Dockerfile` and `apps/web/Dockerfile`, both based on `node:22-alpine` with `corepack enable` and `pnpm install --frozen-lockfile`.

## Architecture (the big picture)

pnpm workspace, two apps under `apps/`. They share nothing at build time — separate `tsconfig`, separate `package.json`, no shared package.

### `apps/api` — Express + Prisma

Entry: `src/index.ts` → `app.ts` (helmet, cors with credentials, morgan, json 2mb, cookieParser, `/health`, then `/api/v1` router). The Express `app` is exported separately from the listen call so it can be tested.

- `src/routes/index.ts` is the only place that mounts all module routers. To add a new module: create `src/modules/<name>/<name>.controller.ts` and `<name>.routes.ts`, then wire the router in `src/routes/index.ts`.
- Module pattern: each module folder has a `controller.ts` (Express handlers, zod-validated inputs) and a `routes.ts` (router + `requireAuth` / `requireRoles` chains). Controllers throw `ApiError` from `src/middlewares/error.middleware.ts` for non-2xx; the global `errorHandler` translates `ZodError` and `ApiError` to JSON responses.
- Auth: JWT access (short) + refresh (long) tokens, both hashed at rest in `RefreshToken` table. See `src/modules/auth/auth.controller.ts` for the rotation flow and `src/middlewares/auth.middleware.ts` for `requireAuth` / `requireRoles(...AppRole[])`. `req.user` and `req.accessToken` are augmented via `src/types/express.d.ts`.
- Roles are the union of two lists: `Role` enum in `prisma/schema.prisma` (DB) and `ROLE_VALUES` in `src/types/domain.ts` (TS). The TS list is broader (adds `SUPER_ADMIN`, `SCHOOL_ADMIN`, `PRINCIPAL`, `VICE_PRINCIPAL`, `CLASS_TEACHER`, `SWT_TEAM`, `SEL_TEAM`, `CLINICAL_SPECIALIST`, `CAREER_SPECIALIST`, `EXTERNAL_PARTNER`) — when adding a role, update both.
- Prisma client is a global singleton in `src/config/prisma.ts`. Import as `import { prisma } from "../../config/prisma"`.
- Env is validated by zod in `src/config/env.ts` at startup — missing or weak secrets fail fast.

### `apps/web` — Next.js 14 App Router

Entry: `src/app/layout.tsx` → `AppProviders` (Query + Auth + Sonner toaster) → children. All authenticated routes live under `src/app/(platform)/` which has a layout that gates on `useAuth()` and renders the role-aware `AppShell`.

- **API access**: by default, `NEXT_PUBLIC_API_BASE_URL` is `/api/v1` and `next.config.mjs` rewrites `/api/v1/:path*` (and `/health`) to `API_PROXY_TARGET` (default `http://localhost:4000`). The browser therefore talks to the same origin. To call the API directly (bypassing the proxy), change `NEXT_PUBLIC_API_BASE_URL` to `http://localhost:4000/api/v1`.
- **Mock mode** (`NEXT_PUBLIC_ALLOW_NO_DB`, default `true`): `useAuth` → `authFetch` falls back to `lib/mock-api.ts` when the DB is unreachable or the access token starts with `mock_`. This is what lets the UI render end-to-end without Postgres / API. `loginAsRole(role)` is the demo helper that signs in as a seeded role.
- **Auth state** persists in `localStorage` under `firefly.session.v1` (user, accessToken, refreshToken). Token refresh is handled inside `authFetch` on 401.
- **Role-aware nav**: `src/components/layout/sidebar.tsx` declares `navItems` with a `roles: Role[]` allowlist. `Role` lives in `src/lib/types.ts` (the wider list, 18 values) — distinct from the API's `AppRole`.
- **Types parity**: the API has `src/types/domain.ts`; the web has a much larger `src/lib/types.ts` covering SEL, referrals, crisis, compliance, IEPs, etc. — many web types anticipate modules that the API hasn't implemented yet (see `PROJECT_REQUIREMENTS_AND_DELIVERY.md` §3.5–3.13). Don't add web types speculatively; match them to what the API actually returns.
- **Module components** live in `src/components/modules/{cases,classrooms,common,dashboard,students}` and are consumed by pages under `src/app/(platform)/<module>/page.tsx`. UI primitives in `src/components/ui/` (button, card, modal, etc.).

## Conventions

- All inputs validated with zod schemas at the controller boundary.
- All async handlers use `try/catch` → `next(error)`; the global `errorHandler` formats the response.
- IDs are UUIDs (Prisma `String @id @default(uuid())`).
- The web app uses a "dark premium" Tailwind theme — see `src/styles/theme.css` and `tailwind.config.ts`. Sidebar uses `framer-motion` for the collapse animation.
- pnpm filters use the package name, not the directory: `--filter @firefly/api`, `--filter @firefly/web`.

## Demo credentials

Seeded by `pnpm db:seed` (`apps/api/prisma/seed.ts`). Password for all is `Firefly@123`.

- `admin@firefly.local` (ADMIN)
- `counsellor@firefly.local` (COUNSELLOR)
- `teacher@firefly.local` (TEACHER)
- `parent@firefly.local` (PARENT)
- `student@firefly.local` (STUDENT)

## Files you'll touch most

- `apps/api/src/routes/index.ts` — register new module routers
- `apps/api/src/middlewares/{auth,error}.middleware.ts` — auth gates and error contract
- `apps/api/prisma/schema.prisma` — data model
- `apps/api/prisma/seed.ts` — demo data
- `apps/web/src/providers/auth-provider.tsx` — session, login, `authFetch` (incl. mock fallback)
- `apps/web/src/lib/mock-api.ts` — frontend-only fixtures consumed when the API/DB is unavailable
- `apps/web/src/components/layout/sidebar.tsx` — role-aware nav config
- `apps/web/src/lib/types.ts` — frontend domain types
