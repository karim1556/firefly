# Firefly Web

Next.js 14 frontend for Firefly Health.

## Highlights

- Premium dark-first SaaS UI
- Role-adaptive sidebar and feature surfaces
- Dashboard with KPI cards, charts, alerts, and activity feed
- Student, case, session, report, and incident modules
- React Query data layer with API token refresh handling

## Environment

Create `apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

## Commands

```bash
pnpm dev
pnpm typecheck
pnpm build
```
