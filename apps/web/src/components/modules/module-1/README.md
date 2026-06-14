# Module 1 — Home Dashboard & Command Center

## Overview

The Command Center is the primary landing page for all authenticated users. It provides a unified, executive-level view of school-wide student wellbeing — covering active cases, crisis alerts, SEL programs, referrals, compliance, team performance, and AI-powered insights.

**Demo reference:** [m1.md](../../../m1.md) — full feature specification.

**Tech stack:** Next.js 14 App Router · React Query · Recharts · Framer Motion · Tailwind CSS · Lucide Icons

---

## File Structure

```
apps/web/src/components/modules/module-1/
├── README.md                         # This file
├── page.tsx                          # Route page (/module-1)
├── welcome-header.tsx                # §1 Personalized greeting + health score
├── health-score-gauge.tsx            # §2 Animated SVG health score gauge
├── executive-kpi-grid.tsx            # §3 Student / Wellbeing / SEL / Compliance KPIs
├── school-health-overview.tsx        # §4 5-tile operational snapshot
├── wellbeing-trends.tsx              # §5 Multi-series trend chart (7d/30d/Q/Y)
├── active-cases-widget.tsx           # §6 Active intervention cases
├── crisis-alert-center.tsx           # §7 Crisis alerts with severity indicators
├── sel-performance.tsx               # §8 SEL programs + donut chart
├── referral-assistance-summary.tsx   # §9 Referral & assistance counts
├── upcoming-calendar.tsx             # §10 Upcoming events (7-day view)
├── activity-feed.tsx                 # §11 Real-time activity timeline
├── high-risk-monitor.tsx             # §12 High-risk student tracker
├── follow-up-tracker.tsx             # §13 Follow-up buckets (today/week/overdue)
├── team-performance-widget.tsx       # §14 Counsellor / Coordinator / Leadership metrics
├── compliance-snapshot-widget.tsx    # §15 Compliance rates by category
├── wellbeing-heatmap.tsx             # §16 Grade-level risk heatmap
├── ai-insights-panel.tsx             # §17 AI-powered recommendations
└── executive-analytics.tsx           # §18 Strategic analytics + monthly trend
```

---

## Feature Map (m1.md §)

| # | Feature | Component |
|---|---------|-----------|
| 1 | Welcome Dashboard | `welcome-header.tsx` |
| 2 | School Wellbeing Health Score | `health-score-gauge.tsx` |
| 3 | Executive KPI Cards | `executive-kpi-grid.tsx` |
| 4 | School Health Overview | `school-health-overview.tsx` |
| 5 | Student Wellbeing Trends | `wellbeing-trends.tsx` |
| 6 | Active Cases Widget | `active-cases-widget.tsx` |
| 7 | Crisis Alert Center | `crisis-alert-center.tsx` |
| 8 | SEL Program Performance | `sel-performance.tsx` |
| 9 | Referral & Assistance Summary | `referral-assistance-summary.tsx` |
| 10 | Upcoming Activities & Calendar | `upcoming-calendar.tsx` |
| 11 | Recent Activity Feed | `activity-feed.tsx` |
| 12 | High-Risk Student Monitor | `high-risk-monitor.tsx` |
| 13 | Follow-Up Tracker | `follow-up-tracker.tsx` |
| 14 | Team Performance Dashboard | `team-performance-widget.tsx` |
| 15 | Compliance Snapshot | `compliance-snapshot-widget.tsx` |
| 16 | School Wellbeing Heatmap | `wellbeing-heatmap.tsx` |
| 17 | AI Insights Panel | `ai-insights-panel.tsx` |
| 18 | Executive Analytics Dashboard | `executive-analytics.tsx` |

---

## Data Flow

```
Page (/module-1/page.tsx)
  └── useQuery(["module-1", "overview"])
        └── authFetch("/module-1/overview")
              ├── Real API (if backend available)
              └── mockRequest() fallback in lib/mock-api.ts
                    └── buildModule1Overview(role)
                          └── Returns full Module1Overview object
```

The page fetches `Module1Overview` from `/module-1/overview`. When the backend API is unavailable (or the access token starts with `mock_`), the request falls back to `mock-api.ts` which returns a fully populated `buildModule1Overview(role)` response.

**Type definition:** `apps/web/src/lib/types.ts` → `Module1Overview` (line ~1739)

---

## Mock Data

All mock data lives in `apps/web/src/lib/mock-api.ts` under the `// MODULE 1` section:

| Data | Constant |
|------|----------|
| High-risk students | `M1_HIGH_RISK_STUDENTS` |
| Follow-up buckets | `M1_FOLLOWUPS` |
| Team performance | `M1_TEAM_PERF` |
| AI insights | `M1_AI_INSIGHTS` |
| Calendar events | `M1_CALENDAR_NEXT` |
| Trend data (all ranges) | `M1_TRENDS` |
| Wellbeing heatmap | `M1_HEATMAP` |

`buildModule1Overview(role)` assembles the full response, filtering leadership-only sections based on role.

---

## Adding a New Widget

1. **Define the type** in `apps/web/src/lib/types.ts` (add to `Module1Overview` or create a new interface).
2. **Add mock data** in `apps/web/src/lib/mock-api.ts` (add to `buildModule1Overview`).
3. **Create the component** in `apps/web/src/components/modules/module-1/`, e.g. `my-widget.tsx`.
4. **Import and add** to `page.tsx`.
5. Run `pnpm typecheck` to verify types.

---

## Backend Connection (Future)

The frontend is fully wired to mock data. To connect to the real API:

1. Create `apps/api/src/modules/module-1/module-1.controller.ts`
2. Create `apps/api/src/modules/module-1/module-1.routes.ts`
3. Register in `apps/api/src/routes/index.ts`:
   ```ts
   apiRouter.use("/module-1", module1Router);
   ```
4. Implement Prisma queries to replace mock data calculations.

The frontend `authFetch("/module-1/overview")` call will automatically use the real API once the route is registered — no changes needed on the web side.

---

## Running Locally

```bash
# Install dependencies (once)
pnpm install

# Start web app (mock API active by default)
pnpm dev:web
# → http://localhost:3000/module-1

# Login with demo credentials:
# admin@firefly.local / Firefly@123
# counsellor@firefly.local / Firefly@123
# teacher@firefly.local / Firefly@123
```

To bypass the API entirely, ensure `NEXT_PUBLIC_ALLOW_NO_DB=true` in `apps/web/.env.local` (default).

---

## Design Patterns

- **Animation:** Framer Motion for entrance animations (`initial/animate/transition`)
- **Charts:** Recharts (`LineChart`, `ResponsiveContainer`) with custom tooltip styles
- **Colors:** Risk severity drives color — `red` (critical), `orange` (high), `amber` (medium), `emerald` (low)
- **Typography:** Tailwind `text-xs` for labels/metadata, `text-sm` for body, `text-base` for card titles, `text-xl`/`text-2xl` for KPI values
- **Spacing:** `space-y-8` page rhythm, `space-y-4` inside cards, `gap-4` / `gap-6` grids
- **Icons:** Lucide React, 16–20px, matching severity/accent color
