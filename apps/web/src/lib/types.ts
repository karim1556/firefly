export type Role =
  | "ADMIN"
  | "COUNSELLOR"
  | "TEACHER"
  | "STUDENT"
  | "PARENT"
  | "FIREFLY_REPRESENTATIVE"
  | "FIREFLY_SPECIALIST"
  | "SYSTEM_ADMIN";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

export interface DashboardOverview {
  kpis: {
    totalStudents: number;
    activeCases: number;
    tier2Students: number;
    tier3Alerts: number;
  };
  tierDistribution: Array<{ tier: string; value: number }>;
  activityTrends: Array<{ label: string; count: number }>;
  recentAlerts: Array<{
    id: string;
    severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
    title: string;
    description: string;
    actionTaken: string;
    studentName: string;
    createdAt: string;
  }>;
  activityFeed: Array<{
    id: string;
    createdAt: string;
    type: string;
    title: string;
    subtitle: string;
  }>;
}

export interface StudentSummary {
  id: string;
  admissionNumber: string | null;
  firstName: string;
  lastName: string;
  grade: string;
  classroom: string;
  tier: "TIER_1" | "TIER_2" | "TIER_3";
  status: "STABLE" | "NEEDS_SUPPORT" | "NEEDS_INTERVENTION";
  riskScore: number;
  _count: {
    cases: number;
    assessments: number;
  };
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface CaseSummary {
  id: string;
  title: string;
  tier: "TIER_1" | "TIER_2" | "TIER_3";
  type: "SEL" | "COUNSELLING" | "CRISIS" | "CAREER" | "NEURO_DEVELOPMENTAL";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "ON_HOLD" | "CLOSED";
  openedAt: string;
  closedAt: string | null;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    grade: string;
    classroom: string;
  };
  _count: {
    sessions: number;
    timelineEvents: number;
  };
}

export interface SessionSummary {
  id: string;
  title: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  scheduledAt: string;
  notes: string | null;
  student: {
    firstName: string;
    lastName: string;
    grade: string;
    classroom: string;
  };
  counsellor: {
    fullName: string;
  };
}
