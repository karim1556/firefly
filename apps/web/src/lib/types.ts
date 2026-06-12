// =============== Module 4: SEL & Workshop Management ===============

export type LessonStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
export type WorkshopStatus = "DRAFT" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
export type SelCategory = "SELF_AWARENESS" | "EMOTIONAL_REGULATION" | "EMPATHY" | "COMMUNICATION" | "LEADERSHIP" | "CONFLICT_RESOLUTION" | "RESILIENCE";
export type WorkshopCategory = "BULLYING_PREVENTION" | "CAREER_GUIDANCE" | "MENTAL_HEALTH_AWARENESS" | "DIGITAL_SAFETY" | "STRESS_MANAGEMENT" | "PARENT_AWARENESS" | "TEACHER_WELLNESS";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "EXCUSED";

export const SEL_CATEGORIES: SelCategory[] = [
  "SELF_AWARENESS", "EMOTIONAL_REGULATION", "EMPATHY", "COMMUNICATION",
  "LEADERSHIP", "CONFLICT_RESOLUTION", "RESILIENCE"
];

export const WORKSHOP_CATEGORIES: WorkshopCategory[] = [
  "BULLYING_PREVENTION", "CAREER_GUIDANCE", "MENTAL_HEALTH_AWARENESS",
  "DIGITAL_SAFETY", "STRESS_MANAGEMENT", "PARENT_AWARENESS", "TEACHER_WELLNESS"
];

export interface SelLessonTemplate {
  id: string;
  title: string;
  grade: string;
  category: SelCategory;
  durationMins: number;
  learningObjectives: string[];
  activities: string[];
  reflectionQuestions: string[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelLesson {
  id: string;
  templateId?: string | null;
  title: string;
  grade: string;
  topic: string;
  category: SelCategory;
  learningObjectives: string[];
  activities: string[];
  reflectionQuestions: string[];
  durationMins: number;
  status: LessonStatus;
  approvedById?: string | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkshopTemplate {
  id: string;
  title: string;
  description: string;
  category: WorkshopCategory;
  audience: string;
  durationMins: number;
  materials: string[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workshop {
  id: string;
  templateId?: string | null;
  title: string;
  description: string;
  category: WorkshopCategory;
  audience: string;
  venue: string;
  date: string;
  durationMins: number;
  facilitatorId: string;
  materials: string[];
  status: WorkshopStatus;
  feedbackScore?: number | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Facilitator {
  id: string;
  userId?: string | null;
  fullName: string;
  email: string;
  expertise: string[];
  type: "SCHOOL_COUNSELLOR" | "TEACHER" | "PRINCIPAL" | "EXTERNAL_EXPERT";
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SelSessionAttendance {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  createdAt: string;
}

export interface WorkshopAttendance {
  id: string;
  workshopId: string;
  studentId?: string | null;
  attendeeName?: string | null;
  status: AttendanceStatus;
  createdAt: string;
}

export interface SelSessionFeedback {
  id: string;
  sessionId: string;
  respondentName?: string | null;
  usefulnessScore: number;
  learnedNew: boolean;
  wouldRecommend: boolean;
  rating: number;
  comments?: string | null;
  submittedAt: string;
}

export interface WorkshopFeedback {
  id: string;
  workshopId: string;
  respondentName?: string | null;
  usefulnessScore: number;
  learnedNew: boolean;
  wouldRecommend: boolean;
  rating: number;
  comments?: string | null;
  submittedAt: string;
}

export interface SelDashboardStats {
  totalPrograms: number;
  activeSessions: number;
  completionRate: number;
  upcomingSessions: number;
  studentParticipation: number;
  workshopAttendance: number;
  highestCompletionGrade: string;
  studentsRequiringIntervention: number;
  upcomingWorkshopsThisWeek: number;
  recentFeedback: Array<{ sessionTitle: string; rating: number; facilitatorName: string; date: string }>;
}

export interface WorkshopDashboardStats {
  totalWorkshops: number;
  upcomingWorkshops: number;
  completedWorkshops: number;
  averageAttendance: number;
  feedbackScore: number;
}

export interface WellbeingAnalytics {
  totalSessionsConducted: number;
  workshopAttendanceRate: number;
  studentEngagementRate: number;
  selCompletionRate: number;
  flaggedStudentTrends: Array<{ month: string; count: number }>;
  monthlyParticipation: Array<{ month: string; attended: number; total: number }>;
  gradeWiseCompletion: Array<{ grade: string; completed: number; total: number }>;
  workshopAttendanceTrend: Array<{ month: string; attended: number; missed: number }>;
}

export interface CalendarEvent {
  id: string;
  type: "SEL_SESSION" | "WORKSHOP" | "AWARENESS_CAMPAIGN" | "PARENT_SESSION";
  title: string;
  date: string;
  time: string;
  venue?: string;
  facilitatorName?: string;
  grade?: string;
  classroom?: string;
}

export interface SelProgress {
  grade: string;
  classroom: string;
  assigned: number;
  completed: number;
  pending: number;
  completionRate: number;
  participationRate: number;
}

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

// =============== Module 7: Referral Network & Care Coordination ===============

export type ReferralStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type MilestoneStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export type FollowUpStatus = "SCHEDULED" | "COMPLETED" | "MISSED" | "RESCHEDULED" | "CANCELLED";

export const CONCERN_CATEGORIES = [
  "Anxiety",
  "Behavioral Concerns",
  "Academic Stress",
  "Emotional Regulation",
  "Social Challenges",
  "Family Issues"
] as const;

export const SPECIALTIES = [
  "Child Psychology",
  "Clinical Psychology",
  "Psychiatry",
  "Family Therapy",
  "Behavioral Therapy",
  "Learning Disabilities",
  "ADHD Support",
  "Anxiety & Stress Support"
] as const;

export const CONSULTATION_MODES = ["In-Person", "Online", "Hybrid"] as const;

export interface Practitioner {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  clinicAddress?: string | null;
  city: string;
  qualifications: string[];
  specializations: string[];
  languages: string[];
  consultationModes: string[];
  yearsOfExperience: number;
  rating?: number | null;
  bio?: string | null;
  isAvailable: boolean;
  feeRange?: string | null;
  contactUnlocked: boolean;
}

export interface PractitionerReview {
  id: string;
  practitionerId: string;
  studentName?: string | null;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface ReferralSummary {
  id: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    grade: string;
    classroom: string;
  };
  practitioner: {
    id: string;
    fullName: string;
    city: string;
    specializations: string[];
  };
  referredBy: {
    id: string;
    fullName: string;
    role: string;
  };
  status: ReferralStatus;
  priority: Priority;
  concernCategory: string;
  reason: string;
  parentApprovalStatus: ApprovalStatus;
  createdAt: string;
  _count: {
    timelineEvents: number;
    milestones: number;
    communicationLogs: number;
  };
}

export interface ReferralTimelineEvent {
  id: string;
  eventType: string;
  title: string;
  description: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  createdBy: {
    id: string;
    fullName: string;
    role: string;
  };
}

export interface ReferralMilestone {
  id: string;
  milestoneType: string;
  status: MilestoneStatus;
  dueDate?: string | null;
  completedAt?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface CommunicationLogEntry {
  id: string;
  authorName: string;
  authorRole: string;
  message: string;
  attachmentUrl?: string | null;
  createdAt: string;
}

export interface FollowUpEntry {
  id: string;
  scheduledAt: string;
  status: FollowUpStatus;
  notes?: string | null;
  completedAt?: string | null;
  createdAt: string;
}

export interface ReferralDetail extends ReferralSummary {
  notes?: string | null;
  parentApprovedAt?: string | null;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    grade: string;
    classroom: string;
    tier: string;
    riskScore: number;
  };
  practitioner: Practitioner;
  timelineEvents: ReferralTimelineEvent[];
  milestones: ReferralMilestone[];
  communicationLogs: CommunicationLogEntry[];
  followUps: FollowUpEntry[];
}

export interface ReferralDashboardStats {
  totalReferrals: number;
  activeReferrals: number;
  completedReferrals: number;
  pendingApproval: number;
  highPriorityCases: number;
  averageResolutionDays: number;
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

// =============== Module 5: Case Management & Student Journey ===============

export type CaseStatus = "OPEN" | "ASSESSMENT_IN_PROGRESS" | "INTERVENTION_ACTIVE" | "MONITORING" | "ESCALATED" | "RESOLVED" | "CLOSED";
export type CaseType = "EMOTIONAL_WELLBEING" | "ACADEMIC_STRESS" | "BULLYING" | "ATTENDANCE_ISSUES" | "FAMILY_CONCERNS" | "BEHAVIORAL_CHALLENGES" | "SOCIAL_ISOLATION" | "SEL" | "COUNSELLING" | "CRISIS" | "CAREER" | "NEURO_DEVELOPMENTAL";
export type CasePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RiskLevel = "LOW_RISK" | "MODERATE_RISK" | "HIGH_RISK" | "CRITICAL_RISK";
export type NoteType = "COUNSELLOR_NOTE" | "TEACHER_NOTE" | "PARENT_NOTE" | "ADMINISTRATIVE_NOTE";
export type InterventionType = "COUNSELLING_SESSION" | "PARENT_MEETING" | "TEACHER_SUPPORT" | "PEER_SUPPORT" | "ACADEMIC_ASSISTANCE" | "EXTERNAL_REFERRAL";
export type EscalationLevel = "COUNSELLOR" | "COORDINATOR" | "PRINCIPAL" | "EXTERNAL_SUPPORT";
export type OutcomeIndicator = "ACADEMIC_IMPROVEMENT" | "ATTENDANCE_IMPROVEMENT" | "BEHAVIORAL_IMPROVEMENT" | "EMOTIONAL_WELLBEING_IMPROVEMENT";
export type ParentInteractionType = "PARENT_MEETING" | "PHONE_CALL" | "EMAIL" | "CONSENT_REQUEST";

export const CASE_STATUSES: CaseStatus[] = [
  "OPEN", "ASSESSMENT_IN_PROGRESS", "INTERVENTION_ACTIVE", "MONITORING", "ESCALATED", "RESOLVED", "CLOSED"
];

export const CASE_TYPES: CaseType[] = [
  "EMOTIONAL_WELLBEING", "ACADEMIC_STRESS", "BULLYING", "ATTENDANCE_ISSUES",
  "FAMILY_CONCERNS", "BEHAVIORAL_CHALLENGES", "SOCIAL_ISOLATION"
];

export const CASE_PRIORITIES: CasePriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export interface CaseDashboardStats {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  highRiskCases: number;
  casesAwaitingAction: number;
  upcomingFollowUps: number;
  casesByStatus: Array<{ status: string; count: number }>;
  casesByPriority: Array<{ priority: string; count: number }>;
  casesByCategory: Array<{ category: string; count: number }>;
  monthlyTrends: Array<{ month: string; opened: number; closed: number }>;
}

export interface CaseNote {
  id: string;
  caseId: string;
  noteType: NoteType;
  title: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    fullName: string;
    role: string;
  };
}

export interface CaseFollowUp {
  id: string;
  caseId: string;
  scheduledAt: string;
  status: FollowUpStatus;
  notes?: string | null;
  completedAt?: string | null;
  createdAt: string;
  createdBy: {
    id: string;
    fullName: string;
  };
}

export interface CaseIntervention {
  id: string;
  caseId: string;
  interventionType: InterventionType;
  name: string;
  objective: string;
  owner: {
    id: string;
    fullName: string;
  };
  dueDate: string;
  successCriteria: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
  createdAt: string;
}

export interface ParentInteraction {
  id: string;
  caseId: string;
  interactionType: ParentInteractionType;
  date: string;
  outcome: string;
  nextActions?: string | null;
  createdBy: {
    id: string;
    fullName: string;
  };
  createdAt: string;
}

export interface RiskFactor {
  factor: string;
  currentValue: string;
  previousValue: string;
  trend: "improving" | "stable" | "declining";
}

export interface RiskAssessment {
  id: string;
  caseId: string;
  riskLevel: RiskLevel;
  riskScore: number;
  riskFactors: RiskFactor[];
  assessedAt: string;
  assessedBy: {
    id: string;
    fullName: string;
  };
}

export interface EscalationEvent {
  id: string;
  caseId: string;
  escalatedTo: EscalationLevel;
  reason: string;
  escalatedAt: string;
  escalatedBy: {
    id: string;
    fullName: string;
  };
  status: "PENDING" | "ACKNOWLEDGED" | "RESOLVED";
}

export interface StudentJourneyEvent {
  id: string;
  studentId: string;
  eventType: "OBSERVATION_ADDED" | "CONCERN_RAISED" | "CASE_OPENED" | "COUNSELLING_SESSION" | "INTERVENTION_ADDED" | "PARENT_MEETING" | "REFERRAL_CREATED" | "CASE_CLOSED" | "FLAG_RAISED" | "FLAG_RESOLVED" | "RISK_ASSESSMENT" | "ESCALATION";
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  createdBy?: {
    id: string;
    fullName: string;
  };
}

export interface CaseAnalytics {
  casesByCategory: Array<{ name: string; value: number }>;
  casesByGrade: Array<{ grade: string; count: number }>;
  casesByPriority: Array<{ name: string; value: number }>;
  resolutionRate: number;
  averageClosureDays: number;
  escalationRate: number;
  monthlyTrends: Array<{ month: string; cases: number }>;
  interventionSuccessRates: Array<{ type: string; successRate: number }>;
}

export interface OutcomeMeasurement {
  caseId: string;
  academicImprovement: number;
  attendanceImprovement: number;
  behavioralImprovement: number;
  emotionalWellbeingImprovement: number;
  overallProgressScore: number;
  trend: "improving" | "stable" | "declining";
  lastUpdated: string;
}

export interface CaseDetailEnhanced extends Omit<CaseSummary, "riskLevel" | "status" | "type" | "tier"> {
  summary: string;
  description: string;
  concernCategory: CaseType;
  priority: CasePriority;
  riskLevel: RiskLevel;
  status: CaseStatus;
  type: CaseType;
  tier: string;
  assignedCounsellor: {
    id: string;
    fullName: string;
    email: string;
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    grade: string;
    classroom: string;
    tier: string;
    riskScore: number;
  };
  timelineEvents: Array<{
    id: string;
    eventType: string;
    title: string;
    description: string;
    createdAt: string;
    createdBy: {
      id: string;
      fullName: string;
      role: string;
    };
  }>;
  sessions: Array<{
    id: string;
    title: string;
    status: string;
    scheduledAt: string;
    durationMins: number;
    notes: string | null;
    counsellor: {
      fullName: string;
    };
  }>;
  interventions: CaseIntervention[];
  followUps: CaseFollowUp[];
  notes: CaseNote[];
  parentInteractions: ParentInteraction[];
  riskAssessment: RiskAssessment | null;
  escalationEvents: EscalationEvent[];
  outcomeMeasurement: OutcomeMeasurement | null;
}

export interface HighRiskCase {
  id: string;
  title: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    grade: string;
    classroom: string;
  };
  riskLevel: RiskLevel;
  priority: CasePriority;
  status: CaseStatus;
  assignedCounsellor: {
    fullName: string;
  };
  lastUpdated: string;
  overdueFollowUps: number;
  daysOpen: number;
}

// =============== Module 6: Hub & Spoke Assistance Requests ===============

export type AssistanceStatus = "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED" | "CLOSED";
export type AssistancePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ConcernCategory = "EMOTIONAL_WELLBEING" | "BEHAVIORAL_CHALLENGES" | "ATTENDANCE_ISSUES" | "ACADEMIC_CONCERNS" | "PARENT_ENGAGEMENT" | "CRISIS_RISK" | "LEARNING_DIFFICULTIES";
export type ExpertType = "CLINICAL_PSYCHOLOGIST" | "SCHOOL_COUNSELLOR" | "BEHAVIORAL_SPECIALIST" | "LEARNING_SUPPORT_EXPERT" | "FAMILY_COUNSELLOR" | "SENIOR_SPECIALIST" | "LEADERSHIP";
export type RecommendationType = "SUGGESTED_INTERVENTION" | "COUNSELLING_PLAN" | "PARENT_ENGAGEMENT_STRATEGY" | "CLASSROOM_SUPPORT_PLAN" | "MONITORING_PLAN" | "EXTERNAL_REFERRAL_RECOMMENDATION";
export type ActionItemStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
export type EscalationStatus = "PENDING" | "ACKNOWLEDGED" | "RESOLVED";

export const ASSISTANCE_STATUSES: AssistanceStatus[] = [
  "OPEN", "ASSIGNED", "IN_PROGRESS", "ESCALATED", "RESOLVED", "CLOSED"
];

export const ASSISTANCE_CONCERN_CATEGORIES: ConcernCategory[] = [
  "EMOTIONAL_WELLBEING", "BEHAVIORAL_CHALLENGES", "ATTENDANCE_ISSUES",
  "ACADEMIC_CONCERNS", "PARENT_ENGAGEMENT", "CRISIS_RISK", "LEARNING_DIFFICULTIES"
];

export interface Expert {
  id: string;
  fullName: string;
  email: string;
  expertType: ExpertType;
  specializations: string[];
  yearsOfExperience: number;
  isAvailable: boolean;
  rating: number;
  requestsHandled: number;
  avgResponseTime: string;
}

export interface AssistanceRequest {
  id: string;
  requestId: string;
  studentName: string;
  studentGrade: string;
  studentClassroom: string;
  schoolName: string;
  concernCategory: ConcernCategory;
  priority: AssistancePriority;
  status: AssistanceStatus;
  summary: string;
  supportingNotes: string;
  assignedExpert?: {
    id: string;
    fullName: string;
    expertType: ExpertType;
  } | null;
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    recommendations: number;
    actionItems: number;
    timelineEvents: number;
  };
}

export interface AssistanceDashboardStats {
  totalRequests: number;
  openRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
  highPriorityRequests: number;
  avgResponseTime: string;
  requestsByStatus: Array<{ status: string; count: number }>;
  requestsByPriority: Array<{ priority: string; count: number }>;
  requestsByCategory: Array<{ category: string; count: number }>;
  monthlyTrends: Array<{ month: string; submitted: number; resolved: number }>;
}

export interface ExpertRecommendation {
  id: string;
  requestId: string;
  recommendationType: RecommendationType;
  title: string;
  description: string;
  priority: AssistancePriority;
  dueDate?: string;
  status: "PENDING" | "ACCEPTED" | "IMPLEMENTED" | "REJECTED";
  createdAt: string;
  createdBy: {
    id: string;
    fullName: string;
    expertType: ExpertType;
  };
}

export interface ActionItem {
  id: string;
  requestId: string;
  taskName: string;
  description: string;
  assignedTo: {
    id: string;
    fullName: string;
    role: string;
  };
  dueDate: string;
  status: ActionItemStatus;
  completedAt?: string;
  createdAt: string;
  createdBy: {
    id: string;
    fullName: string;
  };
}

export interface AssistanceDiscussion {
  id: string;
  requestId: string;
  authorName: string;
  authorRole: string;
  authorType: "SCHOOL_COUNSELLOR" | "COORDINATOR" | "PRINCIPAL" | "HUB_EXPERT" | "SPECIALIST";
  message: string;
  attachmentUrl?: string;
  mentions?: string[];
  createdAt: string;
}

export interface AssistanceTimelineEvent {
  id: string;
  requestId: string;
  eventType: "REQUEST_SUBMITTED" | "EXPERT_ASSIGNED" | "RECOMMENDATION_ADDED" | "ACTION_COMPLETED" | "ESCALATED" | "RESOLVED" | "STATUS_UPDATED";
  title: string;
  description: string;
  createdAt: string;
  createdBy?: {
    id: string;
    fullName: string;
    role: string;
  };
}

export interface AssistanceEscalation {
  id: string;
  requestId: string;
  escalatedTo: ExpertType;
  reason: string;
  escalatedAt: string;
  escalatedBy: {
    id: string;
    fullName: string;
  };
  status: EscalationStatus;
  resolvedAt?: string;
}

export interface AssistanceDetail extends AssistanceRequest {
  studentContext: {
    age: number;
    tier: string;
    riskScore: number;
    existingCases: number;
    previousInterventions: string[];
  };
  recommendations: ExpertRecommendation[];
  actionItems: ActionItem[];
  discussions: AssistanceDiscussion[];
  timelineEvents: AssistanceTimelineEvent[];
  escalations: AssistanceEscalation[];
  resolution?: {
    outcome: "SUCCESSFULLY_RESOLVED" | "MONITORING_REQUIRED" | "EXTERNAL_REFERRAL_RECOMMENDED";
    notes: string;
    closedAt: string;
    closedBy: string;
  };
}

export interface ExpertPerformance {
  expertId: string;
  expertName: string;
  expertType: ExpertType;
  requestsHandled: number;
  activeRequests: number;
  avgResponseTime: string;
  resolutionRate: number;
  satisfactionScore: number;
}

export interface AssistanceAnalytics {
  requestsByCategory: Array<{ name: string; value: number }>;
  requestsBySchool: Array<{ name: string; value: number }>;
  escalationTrends: Array<{ month: string; escalations: number }>;
  resolutionTimes: Array<{ month: string; avgDays: number }>;
  expertUtilization: Array<{ expertName: string; requests: number }>;
}

// =============== Module 8: Crisis Reporting & Escalations ===============

export type CrisisStatus = "REPORTED" | "ACKNOWLEDGED" | "INVESTIGATING" | "ESCALATED" | "MONITORING" | "RESOLVED" | "CLOSED";
export type CrisisSeverity = "HIGH" | "CRITICAL" | "EMERGENCY";
export type IncidentCategory = "SELF_HARM_RISK" | "SUICIDE_IDEATION" | "ABUSE_CONCERNS" | "BULLYING_ESCALATION" | "VIOLENCE_THREAT" | "SEVERE_EMOTIONAL_DISTREESS" | "MISSING_STUDENT" | "SAFETY_CONCERN" | "SUBSTANCE_CONCERN";
export type CrisisActionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
export type CrisisActionType = "CONTACT_PARENT" | "SCHEDULE_ASSESSMENT" | "CONDUCT_SAFETY_CHECK" | "ARRANGE_COUNSELLING" | "NOTIFY_LEADERSHIP" | "ESCALATE_EXTERNALLY" | "DOCUMENTATION" | "FOLLOW_UP";
export type CrisisEscalationLevel = "TEACHER" | "COUNSELLOR" | "COORDINATOR" | "PRINCIPAL" | "SAFEGUARDING_TEAM" | "EXTERNAL_AUTHORITIES";
export type CommunicationType = "PHONE_CALL" | "EMAIL" | "MEETING" | "NOTIFICATION" | "SMS";
export type InvestigationStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";

export const CRISIS_STATUSES: CrisisStatus[] = [
  "REPORTED", "ACKNOWLEDGED", "INVESTIGATING", "ESCALATED", "MONITORING", "RESOLVED", "CLOSED"
];

export const CRISIS_SEVERITIES: CrisisSeverity[] = ["HIGH", "CRITICAL", "EMERGENCY"];

export const INCIDENT_CATEGORIES: IncidentCategory[] = [
  "SELF_HARM_RISK", "SUICIDE_IDEATION", "ABUSE_CONCERNS", "BULLYING_ESCALATION",
  "VIOLENCE_THREAT", "SEVERE_EMOTIONAL_DISTREESS", "MISSING_STUDENT", "SAFETY_CONCERN", "SUBSTANCE_CONCERN"
];

export const CRISIS_ESCALATION_LEVELS: CrisisEscalationLevel[] = [
  "TEACHER", "COUNSELLOR", "COORDINATOR", "PRINCIPAL", "SAFEGUARDING_TEAM", "EXTERNAL_AUTHORITIES"
];

export interface CrisisTeamMember {
  id: string;
  fullName: string;
  role: string;
  roleType: "OWNER" | "SUPPORTING" | "OBSERVER";
  isAvailable: boolean;
  addedAt: string;
}

export interface CrisisAction {
  id: string;
  incidentId: string;
  actionType: CrisisActionType;
  taskName: string;
  description: string;
  assignedTo: {
    id: string;
    fullName: string;
    role: string;
  };
  dueTime: string;
  status: CrisisActionStatus;
  completedAt?: string;
  createdAt: string;
  createdBy: {
    id: string;
    fullName: string;
  };
}

export interface CrisisCommunication {
  id: string;
  incidentId: string;
  communicationType: CommunicationType;
  contactPerson: string;
  relationship: string;
  dateTime: string;
  outcome: string;
  notes?: string;
  createdAt: string;
  createdBy: {
    id: string;
    fullName: string;
  };
}

export interface CrisisTimelineEvent {
  id: string;
  incidentId: string;
  eventType: "INCIDENT_REPORTED" | "ESCALATION_TRIGGERED" | "TEAM_ASSIGNED" | "PARENT_CONTACTED" | "ASSESSMENT_COMPLETED" | "INTERVENTION_STARTED" | "FOLLOW_UP_CONDUCTED" | "INCIDENT_CLOSED" | "STATUS_UPDATED" | "NOTE_ADDED" | "ACTION_COMPLETED";
  title: string;
  description: string;
  createdAt: string;
  createdBy?: {
    id: string;
    fullName: string;
    role: string;
  };
}

export interface CrisisEscalation {
  id: string;
  incidentId: string;
  escalatedTo: CrisisEscalationLevel;
  reason: string;
  triggeredBy: CrisisSeverity | "STUDENT_SAFETY_RISK" | "REPEATED_INCIDENT" | "LEGAL_REQUIREMENT";
  escalatedAt: string;
  escalatedBy: {
    id: string;
    fullName: string;
    role: string;
  };
  status: "PENDING" | "ACKNOWLEDGED" | "RESOLVED";
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface CrisisIncidentSummary {
  id: string;
  incidentId: string;
  studentName: string;
  studentGrade: string;
  studentClassroom: string;
  schoolName: string;
  incidentCategory: IncidentCategory;
  severity: CrisisSeverity;
  status: CrisisStatus;
  description: string;
  location: string;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    actions: number;
    communications: number;
    timelineEvents: number;
    escalations: number;
  };
}

export interface CrisisIncidentRecord extends CrisisIncidentSummary {
  studentInfo: {
    age: number;
    tier: string;
    riskScore: number;
    existingCases: number;
    previousIncidents: number;
  };
  responseTeam: CrisisTeamMember[];
  actions: CrisisAction[];
  communications: CrisisCommunication[];
  timelineEvents: CrisisTimelineEvent[];
  escalations: CrisisEscalation[];
  investigation?: {
    status: InvestigationStatus;
    findings?: string;
    concludedAt?: string;
  };
  resolution?: {
    outcome: "SAFE_RETURN" | "CONTINUED_MONITORING" | "EXTERNAL_REFERRAL" | "NO_FURTHER_ACTION";
    summary: string;
    closedAt: string;
    closedBy: string;
  };
}

export interface CrisisDashboardStats {
  activeCrisisCases: number;
  criticalIncidents: number;
  escalatedCases: number;
  openInvestigations: number;
  avgResponseTime: string;
  resolvedIncidents: number;
  highRiskStudents: number;
  pendingActions: number;
  incidentsByStatus: Array<{ status: string; count: number }>;
  incidentsBySeverity: Array<{ severity: string; count: number }>;
  incidentsByCategory: Array<{ category: string; count: number }>;
  monthlyTrends: Array<{ month: string; incidents: number; resolved: number }>;
  responseTimeTrend: Array<{ month: string; avgHours: number }>;
}

export interface CrisisAnalytics {
  incidentsByCategory: Array<{ name: string; value: number }>;
  incidentsByGrade: Array<{ name: string; value: number }>;
  responseTimeDistribution: Array<{ range: string; count: number }>;
  escalationTrends: Array<{ month: string; escalations: number }>;
  resolutionRates: Array<{ month: string; rate: number }>;
  repeatIncidents: Array<{ studentName: string; count: number; lastIncident: string }>;
  topEscalationReasons: Array<{ reason: string; count: number }>;
}

export interface HighRiskStudent {
  studentId: string;
  studentName: string;
  studentGrade: string;
  riskScore: number;
  openIncidents: number;
  lastIncident: string;
  monitoringStatus: "ACTIVE" | "PENDING_REVIEW" | "STABLE";
}

// =============== Module 10: Policy & Documentation Hub ===============

export type PolicyStatus = "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED" | "EXPIRED";
export type PolicyCategory = "STUDENT_WELLBEING" | "SAFEGUARDING" | "CRISIS_MANAGEMENT" | "REFERRAL_GUIDELINES" | "PARENT_COMMUNICATION" | "SEL_FRAMEWORKS" | "SCHOOL_PROCEDURES" | "STAFF_HANDBOOK";
export type AccessLevel = "PUBLIC" | "STAFF_ONLY" | "COUNSELLORS_ONLY" | "LEADERSHIP_ONLY" | "RESTRICTED";
export type AcknowledgementStatus = "NOT_VIEWED" | "VIEWED" | "ACKNOWLEDGED" | "OVERDUE";
export type DocumentType = "POLICY" | "SOP" | "GUIDELINE" | "TEMPLATE" | "FORM" | "TRAINING_MATERIAL" | "RESEARCH_ARTICLE";
export type SopCategory = "CRISIS_RESPONSE" | "REFERRAL_MANAGEMENT" | "STUDENT_ESCALATION" | "PARENT_COMMUNICATION" | "COUNSELLING_PROCEDURES" | "SAFEGUARDING_PROCEDURES";
export type KnowledgeCategory = "MENTAL_HEALTH_RESOURCES" | "SEL_RESOURCES" | "PARENT_ENGAGEMENT_GUIDES" | "TEACHER_SUPPORT" | "RESEARCH_ARTICLES" | "TRAINING_MATERIALS";
export type AuditAction = "POLICY_CREATED" | "POLICY_EDITED" | "POLICY_APPROVED" | "POLICY_PUBLISHED" | "POLICY_ACKNOWLEDGED" | "DOCUMENT_ACCESSED" | "SOP_VIEWED" | "TRAINING_COMPLETED";
export type TrainingStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "CERTIFIED" | "EXPIRED";

export const POLICY_STATUSES: PolicyStatus[] = ["DRAFT", "UNDER_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED", "EXPIRED"];
export const POLICY_CATEGORIES: PolicyCategory[] = ["STUDENT_WELLBEING", "SAFEGUARDING", "CRISIS_MANAGEMENT", "REFERRAL_GUIDELINES", "PARENT_COMMUNICATION", "SEL_FRAMEWORKS", "SCHOOL_PROCEDURES", "STAFF_HANDBOOK"];
export const SOP_CATEGORIES: SopCategory[] = ["CRISIS_RESPONSE", "REFERRAL_MANAGEMENT", "STUDENT_ESCALATION", "PARENT_COMMUNICATION", "COUNSELLING_PROCEDURES", "SAFEGUARDING_PROCEDURES"];
export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = ["MENTAL_HEALTH_RESOURCES", "SEL_RESOURCES", "PARENT_ENGAGEMENT_GUIDES", "TEACHER_SUPPORT", "RESEARCH_ARTICLES", "TRAINING_MATERIALS"];

export interface PolicyVersion {
  version: string;
  publishedAt: string;
  publishedBy: { id: string; fullName: string };
  changes: string;
  isCurrent: boolean;
}

export interface Policy {
  id: string;
  policyId: string;
  title: string;
  description: string;
  category: PolicyCategory;
  status: PolicyStatus;
  version: string;
  accessLevel: AccessLevel;
  effectiveDate: string;
  reviewDate: string;
  author: { id: string; fullName: string; role: string };
  approvedBy?: { id: string; fullName: string; role: string };
  approvedAt?: string;
  publishedAt?: string;
  fileUrl?: string;
  _count: {
    acknowledgements: number;
    versions: number;
    views: number;
  };
}

export interface PolicyDetail extends Policy {
  content: string;
  attachments: Array<{ id: string; name: string; url: string; size: string; uploadedAt: string }>;
  versions: PolicyVersion[];
  acknowledgements: AcknowledgementRecord[];
}

export interface AcknowledgementRecord {
  id: string;
  policyId: string;
  userId: string;
  userName: string;
  userRole: string;
  status: AcknowledgementStatus;
  acknowledgedAt?: string;
  dueDate: string;
  createdAt: string;
}

export interface Sop {
  id: string;
  sopId: string;
  title: string;
  description: string;
  category: SopCategory;
  steps: Array<{ step: number; title: string; description: string; duration?: string }>;
  responsibleRole: string;
  version: string;
  lastUpdated: string;
  isActive: boolean;
  _count: {
    views: number;
    downloads: number;
  };
}

export interface KnowledgeBaseArticle {
  id: string;
  articleId: string;
  title: string;
  summary: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  author: { id: string; fullName: string };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    views: number;
    bookmarks: number;
  };
}

export interface ComplianceRecord {
  id: string;
  guideline: string;
  status: "compliant" | "partial" | "non_compliant" | "not_applicable";
  lastReviewDate: string;
  nextReviewDate: string;
  notes: string;
}

export interface AuditEvent {
  id: string;
  action: AuditAction;
  userId: string;
  userName: string;
  userRole: string;
  resourceType: "POLICY" | "SOP" | "KNOWLEDGE_BASE" | "COMPLIANCE";
  resourceId: string;
  resourceName: string;
  details?: string;
  timestamp: string;
}

export interface TrainingRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  trainingName: string;
  status: TrainingStatus;
  progressPercent: number;
  completedAt?: string;
  expiresAt?: string;
  score?: number;
  certificateUrl?: string;
}

export interface PolicyDashboardStats {
  totalPolicies: number;
  activePolicies: number;
  underReview: number;
  expiringPolicies: number;
  complianceRate: number;
  pendingAcknowledgements: number;
  totalAcknowledged: number;
  totalOverdue: number;
  policiesByStatus: Array<{ status: string; count: number }>;
  policiesByCategory: Array<{ category: string; count: number }>;
  recentPolicies: Policy[];
  upcomingReviews: Array<{ id: string; title: string; reviewDate: string }>;
}

export interface ComplianceStats {
  overallCompliance: number;
  policyAdoptionRate: number;
  staffAcknowledgementRate: number;
  overdueReviews: number;
  totalDocuments: number;
  activePolicies: number;
  departmentCompliance: Array<{ department: string; complianceRate: number }>;
  monthlyTrends: Array<{ month: string; complianceScore: number }>;
  policyEngagement: Array<{ month: string; views: number; downloads: number }>;
}

export interface GovernanceAnalytics {
  policyUsage: Array<{ policyTitle: string; views: number; acknowledgements: number }>;
  mostAccessedDocuments: Array<{ title: string; type: string; accessCount: number }>;
  complianceTrends: Array<{ month: string; score: number }>;
  reviewPerformance: Array<{ month: string; reviewsCompleted: number; overdueCount: number }>;
  trainingAdoption: Array<{ trainingName: string; completionRate: number }>;
}

// =============== Module 1: Home Dashboard & Command Center ===============

export type HealthScoreCategory = "EXCELLENT" | "HEALTHY" | "NEEDS_ATTENTION" | "CRITICAL";
export type RiskLevelChip = "MODERATE" | "HIGH" | "CRITICAL";
export type TrendRange = "7d" | "30d" | "Q" | "Y";
export type FollowUpBucket = "DUE_TODAY" | "DUE_THIS_WEEK" | "OVERDUE";
export type TeamRole = "COUNSELLOR" | "COORDINATOR" | "LEADERSHIP";

export interface Module1Greeting {
  firstName: string;
  schoolName: string;
  role: string;
  date: string; // ISO
  healthScoreCategory: HealthScoreCategory;
}

export interface SchoolHealthScore {
  score: number; // 0-100
  category: HealthScoreCategory;
  delta: number; // change vs last period
}

export interface Module1Kpis {
  students: { total: number; active: number; newEnrollments: number };
  wellbeing: { activeCases: number; openReferrals: number; crisisIncidents: number; studentsAtRisk: number; pendingAssistance: number; completedCases: number };
  sel: { activePrograms: number; completionRate: number; sessionsConducted: number; participationRate: number };
  compliance: { policyCompliance: number; staffAcknowledgementRate: number; trainingCompletion: number; reviewsDue: number };
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface Module1Trends {
  range: TrendRange;
  flags: TrendPoint[];
  cases: TrendPoint[];
  referrals: TrendPoint[];
  crisis: TrendPoint[];
}

export interface ActiveCaseRow {
  id: string;
  studentName: string;
  studentGrade: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  counsellor: string;
  status: "OPEN" | "IN_PROGRESS" | "ON_HOLD" | "CLOSED";
  openedAt: string;
  tier: "TIER_1" | "TIER_2" | "TIER_3";
}

export interface CrisisAlertRow {
  id: string;
  type: "SELF_HARM_RISK" | "SUICIDE_IDEATION" | "ABUSE" | "BULLYING" | "VIOLENCE" | "EMOTIONAL_DISTRESS" | "MISSING" | "SAFETY";
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
  studentName: string;
  actionTaken: string;
  createdAt: string;
}

export interface SelCategoryProgress {
  category: string;
  completion: number; // 0-100
  target: number; // 0-100
}

export interface SelPerformance {
  activePrograms: number;
  sessionsConducted: number;
  participationRate: number;
  completionRate: number;
  byCategory: SelCategoryProgress[];
  donut: TrendPoint[];
}

export interface ReferralSummaryCard {
  active: number;
  pending: number;
  assistance: number;
  resolved: number;
}

export interface Module1HighRiskStudent {
  id: string;
  name: string;
  grade: string;
  classroom: string;
  riskLevel: RiskLevelChip;
  openCases: number;
  lastActivity: string;
}

export interface FollowUpItem {
  id: string;
  studentName: string;
  caseId: string;
  scheduledAt: string;
  bucket: FollowUpBucket;
  notes?: string | null;
}

export interface TeamMemberPerf {
  id: string;
  name: string;
  role: TeamRole;
  metric: string; // e.g. "Cases managed", "Programs led", "Resolution rate"
  value: number;
  target: number;
}

export interface ComplianceSnapshot {
  policyCompliance: number;
  trainingCompletion: number;
  acknowledgementsPending: number;
  reviewsDue: number;
  byCategory: Array<{ category: string; rate: number }>;
}

export interface HeatmapRow {
  grade: string;
  classroom?: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface AIInsight {
  id: string;
  severity: "INFO" | "WARNING" | "ALERT";
  insight: string;
  description: string;
  suggestedActions: string[];
}

export interface ExecutiveAnalytics {
  resolutionRate: number;
  referralOutcomes: number;
  crisisResponseTime: string; // e.g. "12 min"
  selEffectiveness: number;
  trendPoints: TrendPoint[];
}

export interface Module1Overview {
  greeting: Module1Greeting;
  schoolHealthScore: SchoolHealthScore;
  kpis: Module1Kpis;
  trends: Record<TrendRange, Module1Trends>;
  activeCases: ActiveCaseRow[];
  crisisAlerts: CrisisAlertRow[];
  sel: SelPerformance;
  referrals: ReferralSummaryCard;
  calendar: CalendarEvent[];
  recentActivity: Array<{ id: string; type: string; title: string; subtitle: string; createdAt: string }>;
  highRiskStudents: Module1HighRiskStudent[];
  followUps: { dueToday: FollowUpItem[]; dueThisWeek: FollowUpItem[]; overdue: FollowUpItem[] };
  teamPerformance: { counsellors: TeamMemberPerf[]; coordinators: TeamMemberPerf[]; leadership: TeamMemberPerf[] };
  compliance: ComplianceSnapshot;
  heatmap: HeatmapRow[];
  aiInsights: AIInsight[];
  executiveAnalytics: ExecutiveAnalytics;
}
