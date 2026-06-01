# Firefly API

Express + TypeScript + Prisma backend for Firefly Health.

## Features

- JWT auth with access + refresh token rotation
- Role-based access control (RBAC)
- Student management with tier/status filters
- Case management with timeline and closure workflows
- Sessions list/calendar endpoints
- Incident logging with severity and mandatory action tracking
- Dashboard and reporting analytics

## Quick Start

1. Copy env file:

```bash
cp .env.example .env
```

2. Ensure PostgreSQL is running and `DATABASE_URL` is valid.

3. Generate Prisma client and push schema:

```bash
pnpm prisma generate
pnpm prisma db push
```

4. Seed demo data:

```bash
pnpm seed
```

5. Start API:

```bash
pnpm dev
```

API base URL: `http://localhost:4000/api/v1`

## Seeded Login Accounts

- `admin@firefly.local` / `Firefly@123`
- `counsellor@firefly.local` / `Firefly@123`
- `teacher@firefly.local` / `Firefly@123`
- `parent@firefly.local` / `Firefly@123`
- `student@firefly.local` / `Firefly@123`
