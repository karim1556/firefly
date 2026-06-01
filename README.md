# Firefly Health Platform

Production-style full-stack SaaS foundation for school mental wellbeing operations using a multi-tier care model (Tier 1, Tier 2, Tier 3).

## Stack

- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn-style UI components, React Query, Recharts, Framer Motion
- Backend: Node.js, Express, TypeScript, Prisma ORM
- Database: PostgreSQL
- Auth: JWT access and refresh tokens

## Workspace Layout

- `apps/web`: SaaS frontend (role-aware dashboard and modules)
- `apps/api`: Express API with RBAC, workflows, and analytics

## Implemented Modules

- Authentication + RBAC
- Dashboard (KPIs, tier pie chart, trend chart, alerts, activity feed)
- Students (list, filters, details, assessment trend)
- Cases (list, detail, timeline, notes, add session, close case)
- Sessions (list and calendar views)
- Incidents (severity-focused crisis UI + required actionTaken)
- Reports (wellbeing and compliance summaries)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment files

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### 3. Start PostgreSQL

Use your local PostgreSQL instance. If Docker is available, use:

```bash
docker compose up -d
```

### 4. Initialize database

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 5. Run both apps

```bash
pnpm dev
```

- Browser app: `http://localhost:3000`
- API is proxied through Next.js at `/api/v1/*` (same origin from browser)
- Backend service still runs on `http://localhost:4000` internally

## Production Build

```bash
pnpm typecheck
pnpm build
```

## Deployment (Containerized)

Use the production compose stack:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Then initialize DB schema and seed data from the API container:

```bash
docker compose -f docker-compose.prod.yml exec api pnpm --filter @firefly/api prisma db push
docker compose -f docker-compose.prod.yml exec api pnpm --filter @firefly/api seed
```

## Demo Credentials

- `admin@firefly.local` / `Firefly@123`
- `counsellor@firefly.local` / `Firefly@123`
- `teacher@firefly.local` / `Firefly@123`
- `parent@firefly.local` / `Firefly@123`
- `student@firefly.local` / `Firefly@123`

## Notes

- `.nvmrc` is pinned to Node 22 for stable Next.js runtime behavior.
- Frontend defaults to a dark premium UI with role-adaptive navigation.
- API routes are available under `/api/v1`.
