export type Role =
  | "ADMIN"
  | "COUNSELLOR"
  | "TEACHER"
  | "STUDENT"
  | "PARENT"
  | "FIREFLY_REPRESENTATIVE"
  | "FIREFLY_SPECIALIST"
  | "SYSTEM_ADMIN"
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN"
  | "PRINCIPAL"
  | "VICE_PRINCIPAL"
  | "CLASS_TEACHER"
  | "SWT_TEAM"
  | "SEL_TEAM"
  | "CLINICAL_SPECIALIST"
  | "CAREER_SPECIALIST"
  | "EXTERNAL_PARTNER";

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
  schoolWellbeingScore?: number;
  riskDistribution?: { low: number; medium: number; high: number; critical: number };
  counsellorWorkload?: number;
  referralSuccessRate?: number;
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
  age?: number;
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

export interface AlertItem {
  id: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
  timestamp: string;
  studentName?: string;
  category: string;
}

export interface AppointmentItem {
  id: string;
  title: string;
  date: string;
  time: string;
  studentName: string;
  type: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
}

export interface ReferralItem {
  id: string;
  studentName: string;
  referredBy: string;
  referredTo: string;
  reason: string;
  status: "pending" | "accepted" | "completed" | "declined";
  createdAt: string;
  priority: "low" | "medium" | "high" | "urgent";
}

export interface CrisisIncident {
  id: string;
  studentName: string;
  incidentType: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  description: string;
  actionTaken: string;
  status: "open" | "investigating" | "resolved" | "monitoring";
  reportedBy: string;
  createdAt: string;
}

export interface ComplianceRecord {
  id: string;
  guideline: string;
  status: "compliant" | "partial" | "non_compliant" | "not_applicable";
  lastReviewDate: string;
  nextReviewDate: string;
  notes: string;
}

export interface NotificationItem {
  id: string;
  type: "alert" | "reminder" | "update" | "milestone";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

export interface AnalyticsData {
  studentStatus: Array<{ name: string; value: number }>;
  casesByType: Array<{ name: string; value: number }>;
  riskHeatmap: Array<{ grade: string; low: number; medium: number; high: number; critical: number }>;
  counsellorWorkload: Array<{ name: string; cases: number }>;
  interventionEffectiveness: Array<{ month: string; success: number; ongoing: number; declined: number }>;
  sessionAttendance: Array<{ month: string; attended: number; missed: number; cancelled: number }>;
  schoolComparison: Array<{ school: string; score: number; change: number }>;
}

export interface SELSession {
  id: string;
  title: string;
  description: string;
  grade: string;
  date: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  completedBy: number;
  totalStudents: number;
  competencies: string[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  schoolId?: string;
  schoolName?: string;
  phone?: string;
  specialization?: string;
  createdAt: string;
}

export interface Classroom {
  id: string;
  schoolId: string;
  name: string;
  grade: string;
  section?: string | null;
  createdAt: string;
  updatedAt: string;
  students?: StudentSummary[];
}

export interface ClassroomTeacher {
  id: string;
  classroomId: string;
  teacherId: string;
  isClassTeacher: boolean;
  assignedAt: string;
  teacher?: UserProfile;
}

export interface Observation {
  id: string;
  studentId: string;
  createdById: string;
  category: string;
  note: string;
  context?: string | null;
  isFlag: boolean;
  createdAt: string;
}

export interface Flag {
  id: string;
  observationId?: string | null;
  studentId: string;
  raisedById: string;
  category: string;
  status: string;
  resolutionNote?: string | null;
  raisedAt: string;
  resolvedAt?: string | null;
}

export interface SelSessionSummary {
  id: string;
  classroomId: string;
  topic: string;
  scheduledAt: string;
  durationMins: number;
  counsellorId: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
}

// Module 3 — Classroom Profiles& Rosters
export type ObservationType = "BEHAVIOURAL" | "ACADEMIC" | "SOCIAL" | "EMOTIONAL" | "ATTENDANCE";
export type FlagCategory = "EMOTIONAL_DISTRESS" | "BULLYING" | "ATTENDANCE_ISSUES" | "ACADEMIC_DECLINE" | "SOCIAL_ISOLATION";
export type FlagPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ObservationEntry {
  id: string;
  studentId: string;
  classroom: string;
  type: ObservationType;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  notes: string;
  createdAt: string;
  createdBy: string;
}

export interface FlagEntry {
  id: string;
  studentId: string;
  classroom: string;
  category: FlagCategory;
  priority: FlagPriority;
  notes: string;
  status: "OPEN" | "RESOLVED";
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface AcademicSnapshot {
  attendancePercent: number;
  assignmentCompletionPercent: number;
  recentPerformance: string;
}

export interface SELProgress {
  assigned: number;
  completed: number;
  pending: number;
}

export interface StudentFullProfile extends StudentSummary {
  academic: AcademicSnapshot;
  wellbeing: {
    selParticipation: number;
    emotionalWellnessScore: number;
    riskLevel: string;
  };
  recentActivity: {
    observations: ObservationEntry[];
    flags: FlagEntry[];
    workshops: string[];
  };
  selProgress: SELProgress;
}

export interface ClassroomActivityItem {
  id: string;
  type: "OBSERVATION_ADDED" | "FLAG_RAISED" | "SEL_SESSION_COMPLETED" | "WORKSHOP_ATTENDED" | "FLAG_RESOLVED";
  studentId: string;
  studentName: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

export interface ClassroomSELProgress {
  classroomId: string;
  totalStudents: number;
  assigned: number;
  completed: number;
  pending: number;
  completionRate: number;
  participationRate: number;
}

// =============== Module 3: Timetable, Teachers, IEP, Analytics ===============

export interface Teacher {
  id: string;
  fullName: string;
  subject?: string | null;
  isClassTeacher: boolean;
  initials: string;
}

export type TimetableSlotType = "ACADEMIC" | "SEL" | "FREE" | "BREAK";

export interface TimetableSlot {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  period: number;
  time: string;
  subject: string;
  teacherName?: string | null;
  type: TimetableSlotType;
}

export type SessionFeedbackOption = string;

export interface SessionFeedback {
  studentEngagement: "High" | "Moderate" | "Minimal" | "Resistant" | "Mixed";
  learningUnderstanding: "Strong" | "Basic" | "Partial" | "Poor" | "Needs Reinforcement";
  emotionalClimate: "Open & Receptive" | "Mixed / Neutral" | "Resistant / Disengaged" | "Anxious / Restless" | "Low Mood" | "Emotionally Reactive";
  followUpNeed: "No Concerns" | "Monitoring Needed" | "Immediate Follow-Up Recommended";
  planCompletion: "Yes" | "Rushed / Partial" | "No";
  activityCompletion: "Yes" | "Rushed / Partial" | "No";
  activityQuality: "Good" | "Average / Can Improve" | "Low";
  notes?: string;
  submittedAt: string;
  submittedBy: string;
}

export interface SELSessionDetailed {
  id: string;
  classroomId: string;
  topic: string;
  scheduledAt: string;
  durationMins: number;
  facilitatorId: string;
  facilitatorName: string;
  status: "SCHEDULED" | "COMPLETED" | "NO_SHOW" | "CANCELLED";
  feedback?: SessionFeedback | null;
}

export interface StudentDemographics {
  dateOfBirth: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  fatherName: string;
  motherName: string;
  parentContact: string;
  admissionNumber: string;
  standard: string;
  section: string;
}

export type IEPGoalStatus = "NOT_STARTED" | "IN_PROGRESS" | "ACHIEVED";
export type IEPFeedbackProgress = IEPGoalStatus;

export interface IEPGoal {
  id: string;
  title: string;
  description: string;
  status: IEPGoalStatus;
  accommodation?: string;
}

export interface IEPFeedback {
  id: string;
  iepId: string;
  goalId: string;
  progress: IEPFeedbackProgress;
  comment: string;
  submittedAt: string;
  submittedBy: string;
}

export interface IEP {
  id: string;
  studentId: string;
  title: string;
  uploadedBy: string;
  consentLogged: boolean;
  createdAt: string;
  goals: IEPGoal[];
  feedback: IEPFeedback[];
}

export interface ClassAnalyticsTrendPoint {
  day: string;
  count: number;
}

export interface ClassAnalytics {
  classroomId: string;
  totalStudents: number;
  tierDistribution: { tier: string; count: number }[];
  flagCount: { open: number; resolved: number };
  selCompletionRate: number;
  observationCount: number;
  trend: ClassAnalyticsTrendPoint[];
}
