# Firefly Health - SRS Review and Implementation Traceability

Source SRS: Firefly Health - School Wellbeing Platform

Source version: 1.0

Source date: January 2025

Source owner: Firefly Health Product Team

Review date: 19 April 2026

Review purpose: Rebuild this document directly from the provided SRS and show exact current build status, gap status, and delivery plan.

## 1. How We Understood the SRS
We interpreted the SRS as a full product contract, not only a UI checklist. To avoid ambiguity, we translated each SRS block into implementable capabilities and mapped them to the running codebase.

Method used:
- Read each functional requirement group from FR-3.1 to FR-3.13
- Read each non-functional block from NFR-4.1 to NFR-4.7
- Cross-check implementation evidence in current frontend and backend modules
- Mark each requirement as Implemented, Partial, or Not Started
- Identify concrete work needed to reach SRS-complete state

Status legend:
- Implemented: Requirement behavior is present end-to-end in current build
- Partial: Core behavior exists but required scope, depth, or compliance is incomplete
- Not Started: Requirement not materially implemented yet

## 2. Current Platform Baseline (What We Have Built)

### 2.1 Architecture
- Monorepo with web and API services
- Web: Next.js 14, TypeScript, Tailwind, React Query, Recharts, Framer Motion
- API: Express, TypeScript, Prisma
- Data layer: PostgreSQL via Prisma schema

### 2.2 Security and Access Foundation
- JWT access token + refresh token rotation
- Role-based route protection in API middleware
- Role-aware navigation in frontend shell
- Session persistence in browser storage

### 2.3 Delivered Product Modules
- Landing page and login experience
- Dashboard with KPIs, trends, tier distribution, alerts, and activity feed
- Students list and student detail views
- Cases list and case detail with timeline/session actions
- Sessions list and calendar grouping views
- Incidents logging and monitoring
- Reports wellbeing and compliance snapshot

## 3. Functional Requirements Traceability (SRS Section 3)

### 3.1 Roadmap Co-design Module (FR-3.1.1 to FR-3.1.6)
Status: Not Started

Implemented now:
- No dedicated roadmap co-design workflows, baseline onboarding capture, milestone tracker, or export flows

Gap to close:
- Guided onboarding for partner schools
- Baseline wellbeing assessment generation from screening
- Collaborative roadmap builder with milestones/resources/metrics
- PDF roadmap export
- Progress tracking and milestone completion indicators

### 3.2 School-Facing Dashboard (FR-3.2.1 to FR-3.2.9)
Status: Partial

Implemented now:
- Unified dashboard with KPIs, trends, alerts, activity feed, tier visuals
- Case creation and management flow with notes, sessions, timeline, risk, and closure
- Aggregate trends and Supreme Court compliance snapshot in reports module

Gap to close:
- AI-assisted SEL session planning and recommendations
- Counsellor to-do list with reminders and follow-up prompts
- Dedicated recent notes workspace across active cases
- Audit-ready PDF and Excel exports
- Firefly campus team assignments and contact carding

### 3.3 Student Support Tools (FR-3.3.1 to FR-3.3.5)
Status: Not Started

Implemented now:
- Student role exists in auth model
- Student role has limited visibility in current role framework

Gap to close:
- Self-check-in tools
- Age-appropriate psychoeducational content
- Appointment request workflow for students
- Confidential student reporting channels
- Career guidance assessments/resources/reporting

### 3.4 Parent Support Tools (FR-3.4.1 to FR-3.4.4)
Status: Not Started

Implemented now:
- Parent role exists in auth and role model

Gap to close:
- Dedicated parent portal UX
- Parent-counsellor communication tools
- Parent sensitization content delivery
- Meeting/update/resource notifications
- Career guidance report sharing to parents

### 3.5 SEL Curriculum Management (FR-3.5.1 to FR-3.5.4)
Status: Partial

Implemented now:
- Session scheduling and session status tracking exist

Gap to close:
- Evidence-based SEL curriculum library by grade/competency/duration/format
- Attendance tracking for SEL sessions
- Academic calendar alignment and progress tracking
- Session feedback capture loop

### 3.6 Screening and Risk Identification (FR-3.6.1 to FR-3.6.4)
Status: Partial

Implemented now:
- Student assessment records and risk-level data model
- Tier and risk indicators visible in dashboards and student/case context
- Alerts surfaced via incident and dashboard flows

Gap to close:
- Configurable universal, targeted, and crisis screening workflows
- Automatic flagging escalation from screening results to Tier 2 and Tier 3
- Dedicated risk stratification surfaces such as heatmaps
- Automatic counsellor alerting from screening triggers

### 3.7 Case Management and Care Coordination (FR-3.7.1 to FR-3.7.5)
Status: Partial

Implemented now:
- End-to-end case lifecycle foundation (create, document, timeline, progress visibility, close)
- Tier/type/risk categorization in data and UI
- Intervention history via timeline events and session history

Gap to close:
- IEP creation and tracking for Tier 3 cases
- Structured care coordination sharing with Firefly specialist teams
- Expanded intervention templates and outcome-linked plans

### 3.8 Referral System (FR-3.8.1 to FR-3.8.4)
Status: Not Started

Implemented now:
- No dedicated referral entity/workflow in current schema and modules

Gap to close:
- Referral network directory
- Referral status lifecycle and tracking
- Referral outcomes and reintegration planning records
- Secure external professional contact registry

### 3.9 Crisis Management (FR-3.9.1 to FR-3.9.5)
Status: Partial

Implemented now:
- Incident logging includes severity, type, description, action taken, timestamp
- Crisis incident monitoring UI and high-severity visibility in dashboard/reports

Gap to close:
- Formal escalation protocol engine
- Internal committee configurable workflows
- Defined report-to-closure SLA timelines per crisis pathway
- Safety audit infrastructure checklist module

### 3.10 Dynamic Monitoring and Insights (FR-3.10.1 to FR-3.10.5)
Status: Partial

Implemented now:
- Dashboard and report visualizations for wellbeing and operational metrics
- Trend and distribution charts

Gap to close:
- Full period controls (weekly/monthly/quarterly/annual/year-over-year)
- Automated anomaly and overdue follow-up alerts
- Intervention effectiveness outcome tracking model
- Fully customizable filtered reports by grade/case/counsellor/tier/date

### 3.11 Staff Training and Capacity Building (FR-3.11.1 to FR-3.11.3)
Status: Not Started

Implemented now:
- No dedicated training content or workshop modules

Gap to close:
- Staff training content libraries
- Completion tracking per staff member
- Workshop scheduling and attendance tracking

### 3.12 Compliance and Documentation (FR-3.12.1 to FR-3.12.4)
Status: Partial

Implemented now:
- Compliance snapshot endpoint and report surface for Supreme Court guideline indicators
- Timestamped records across core entities

Gap to close:
- Full compliance dashboard with controls and drill-down
- Mental health policy document storage/retrieval
- Automated audit-ready documentation export packs
- Version-controlled record history across data updates

### 3.13 Firefly Hub Integration (FR-3.13.1 to FR-3.13.4)
Status: Not Started

Implemented now:
- Firefly roles exist in auth/permissions model

Gap to close:
- Consultation request workflows with status tracking
- Dedicated representative contact and campus update surfaces
- Leadership-facing campus team updates

## 4. Non-Functional Requirements Traceability (SRS Section 4)

### 4.1 Security and Privacy
Status: Partial

Implemented now:
- JWT auth and refresh rotation
- Role-based API authorization
- HTTP hardening middleware and CORS/credentials controls

Gap to close:
- At-rest encryption controls and key management definition
- Formal data protection compliance controls and evidence
- Student-record audit logs for all access/modification events
- 15-minute inactivity session timeout implementation

### 4.2 Performance
Status: Not Started

Implemented now:
- No formal SLA monitoring or benchmark enforcement in repository

Gap to close:
- Dashboard under 3s target validation
- 500 concurrent users per school load testing
- Report generation performance target testing

### 4.3 Availability
Status: Not Started

Implemented now:
- Health endpoint exists

Gap to close:
- 99.5 percent uptime objective tracking and incident reporting
- Maintenance process with 48-hour notice workflow

### 4.4 Scalability
Status: Partial

Implemented now:
- Service separation and API architecture support scale-out direction

Gap to close:
- Horizontal scaling strategy verification for 500+ schools
- Capacity testing and documented scaling runbooks

### 4.5 Usability
Status: Partial

Implemented now:
- Web-first UX with mobile-responsive improvements
- Primary modules available through role-aware navigation

Gap to close:
- Strict 3-click navigation verification for all primary functions
- Contextual help/tooltips across key workflows
- Full responsive hardening for dense data surfaces

### 4.6 Data Retention
Status: Not Started

Implemented now:
- No retention policy enforcement in current code

Gap to close:
- Student retention policy (enrolment plus 7 years)
- Partnership termination export workflow

### 4.7 Integration
Status: Not Started

Implemented now:
- API architecture can host integration endpoints

Gap to close:
- School management system roster sync APIs
- Calendar integrations (Google Calendar and Outlook)

## 5. Roles and Permissions Alignment (SRS Section 5)

Current role model present in code:
- ADMIN
- COUNSELLOR
- TEACHER
- STUDENT
- PARENT
- FIREFLY_REPRESENTATIVE
- FIREFLY_SPECIALIST
- SYSTEM_ADMIN

Alignment summary:
- Counsellor: Partial alignment, strong case/session/incident core, missing SRS advanced assistant and workflow automation
- School Administrator: Partial alignment, has analytics/compliance snapshot, missing full compliance and export suite
- Teacher: Partial alignment, can access relevant modules but limited dedicated teacher workflow tooling
- Parent: Partial alignment at role level, dedicated portal and communication flows not implemented
- Student: Partial alignment at role level, self-check-in and appointment workflows not implemented
- Firefly Representative: Partial alignment, role exists and analytics access exists, roadmap/consultation tooling missing
- Firefly Specialist Team: Partial alignment, role exists and selected access exists, collaboration workflows not fully implemented
- System Administrator: Partial alignment, technical role present, platform-level admin controls not fully surfaced

## 6. System Interfaces and Data Requirements (SRS Sections 6 and 7)

### 6.1 User Interfaces
Implemented now:
- Web app with responsive shell and module views
- Notification primitives in frontend

Pending:
- Dedicated communication channels and broader notification orchestration

### 6.2 External Interfaces
Implemented now:
- Internal web-to-API integration through Next.js rewrite proxy

Pending:
- School information system synchronization
- Calendar integrations
- Standardized PDF/Excel document export flows

### 7.1 Core Data Entities
Implemented in schema:
- Student profiles
- Case records
- Session logs
- Assessment results
- Intervention history via timeline
- Staff records via user roles

Missing from schema or workflow depth:
- Referral records as first-class entity
- Parent-specific records and portal domain model
- SEL curriculum content library model
- Compliance document repository model

### 7.2 Reporting Data
Implemented now:
- Wellbeing distribution metrics
- Session and incident metrics
- Case and type distributions

Pending:
- Deeper trend analysis and filtered leadership reporting across full SRS dimensions

## 7. What We Will Deliver Next (Committed Feature Plan)

### Phase A - SRS Critical Foundations
Target outcomes:
- Roadmap co-design module with onboarding and milestones
- Referral system full lifecycle
- Student self-check-in and appointment request
- Parent portal baseline with communication and resource delivery

### Phase B - Clinical and Operational Depth
Target outcomes:
- SEL curriculum library and session feedback loops
- Configurable screenings and auto-escalation logic
- IEP workflow for Tier 3 care plans
- Consultation requests and Firefly hub integration

### Phase C - Compliance and Reporting Hardening
Target outcomes:
- Full Supreme Court compliance cockpit
- Audit-ready export packs (PDF and Excel)
- Data retention and audit logging controls
- Outcome tracking and effectiveness analytics

### Phase D - NFR Compliance and Scale
Target outcomes:
- Performance/load validation against SRS targets
- Uptime and observability instrumentation
- Horizontal scale readiness and runbooks
- Integration connectors for roster and calendar systems

## 8. Acceptance Criteria Recheck (SRS Section 9)

Current status against SRS acceptance criteria:
- All functional requirements implemented and tested: No
- Non-functional thresholds met: No
- Pilot-school UAT completed: Not evidenced in repository
- Security audit passed: Not evidenced in repository
- Documentation and training materials delivered: Partial
- Data migration completed where applicable: Not started in current scope

## 9. Final Summary
This document has been redone directly from your provided SRS and now serves as an implementation traceability baseline.

What is clear today:
- The platform has a strong operational core in auth, dashboard, student/case/session/incident/report modules
- Large SRS areas remain pending, especially roadmap co-design, referral network, student/parent dedicated tooling, training, integrations, and compliance automation
- The next delivery phases above define exactly what features we will give next to close SRS gaps in a structured order

This file should be treated as the current source of truth for planning, sprint scoping, QA traceability, and stakeholder progress reporting.
