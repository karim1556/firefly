import type {
  AuthUser, Role, DashboardOverview, StudentSummary,
  Teacher, TimetableSlot, SELSessionDetailed, SessionFeedback, StudentDemographics,
  IEP, IEPFeedback, IEPFeedbackProgress, IEPGoalStatus, ObservationEntry, ObservationType, FlagEntry, FlagCategory, FlagPriority, ClassroomActivityItem,
} from "@/lib/types";

export function isMockToken(token: string | null): boolean {
  return token !== null && token.startsWith("mock_");
}

const ROLE_BY_EMAIL: Record<string, Role> = {
  "admin@firefly.local": "ADMIN",
  "counsellor@firefly.local": "COUNSELLOR",
  "teacher@firefly.local": "TEACHER",
  "parent@firefly.local": "PARENT",
  "student@firefly.local": "STUDENT"
};

const ROLE_NAMES: Record<string, string> = {
  ADMIN: "Aarav Mehta", COUNSELLOR: "Priya Sharma", TEACHER: "Rajesh Kumar",
  PARENT: "Anita Desai", STUDENT: "Arjun Patel", FIREFLY_REPRESENTATIVE: "Vikram Singh",
  FIREFLY_SPECIALIST: "Dr. Sneha Reddy", SYSTEM_ADMIN: "Karan Joshi",
  SUPER_ADMIN: "Aarav Mehta", SCHOOL_ADMIN: "Neha Kapoor", PRINCIPAL: "Dr. Suresh Iyengar",
  VICE_PRINCIPAL: "Lakshmi Nair", CLASS_TEACHER: "Rajesh Kumar", SWT_TEAM: "Anita Verma",
  SEL_TEAM: "Deepa Menon", CLINICAL_SPECIALIST: "Dr. Sanjay Gupta",
  CAREER_SPECIALIST: "Meera Joshi", EXTERNAL_PARTNER: "Ravi Deshmukh"
};

export function mockLogin(email: string) {
  const role = ROLE_BY_EMAIL[email] ?? "ADMIN" as Role;
  return { accessToken: `mock_access_token_${role}`, refreshToken: `mock_refresh_token_${role}`, user: { id: `mock-user-${role}`, email, fullName: ROLE_NAMES[role], role } };
}
export function mockRefresh() { return { accessToken: "mock_access_token", refreshToken: "mock_refresh_token" }; }

const NOW = Date.now();
const H = 60*60*1000; const D = 24*H;

// ======================== STUDENTS (15 with INDIAN names) ========================
const STUDENTS = [
  { id:"s1", firstName:"Arjun", lastName:"Patel", grade:"8", classroom:"8A", age:13, tier:"TIER_3", status:"NEEDS_INTERVENTION", riskScore:84, admissionNumber:"FF-2024-001", _count:{cases:2,assessments:3} },
  { id:"s2", firstName:"Priya", lastName:"Sharma", grade:"10", classroom:"10B", age:15, tier:"TIER_2", status:"NEEDS_SUPPORT", riskScore:62, admissionNumber:"FF-2024-002", _count:{cases:1,assessments:2} },
  { id:"s3", firstName:"Rohan", lastName:"Verma", grade:"7", classroom:"7A", age:12, tier:"TIER_2", status:"NEEDS_SUPPORT", riskScore:55, admissionNumber:"FF-2024-003", _count:{cases:1,assessments:1} },
  { id:"s4", firstName:"Ananya", lastName:"Reddy", grade:"9", classroom:"9C", age:14, tier:"TIER_3", status:"NEEDS_INTERVENTION", riskScore:91, admissionNumber:"FF-2024-004", _count:{cases:2,assessments:2} },
  { id:"s5", firstName:"Vikram", lastName:"Singh", grade:"6", classroom:"6B", age:11, tier:"TIER_2", status:"NEEDS_SUPPORT", riskScore:48, admissionNumber:"FF-2024-005", _count:{cases:1,assessments:1} },
  { id:"s6", firstName:"Kavya", lastName:"Nair", grade:"5", classroom:"5A", age:10, tier:"TIER_1", status:"STABLE", riskScore:32, admissionNumber:"FF-2024-006", _count:{cases:0,assessments:1} },
  { id:"s7", firstName:"Aryan", lastName:"Joshi", grade:"8", classroom:"8B", age:13, tier:"TIER_3", status:"NEEDS_INTERVENTION", riskScore:76, admissionNumber:"FF-2024-007", _count:{cases:1,assessments:1} },
  { id:"s8", firstName:"Isha", lastName:"Kapoor", grade:"10", classroom:"10A", age:15, tier:"TIER_1", status:"STABLE", riskScore:18, admissionNumber:"FF-2024-008", _count:{cases:0,assessments:1} },
  { id:"s9", firstName:"Rahul", lastName:"Desai", grade:"7", classroom:"7C", age:12, tier:"TIER_2", status:"NEEDS_SUPPORT", riskScore:58, admissionNumber:"FF-2024-009", _count:{cases:1,assessments:1} },
  { id:"s10", firstName:"Neha", lastName:"Gupta", grade:"5", classroom:"5B", age:10, tier:"TIER_1", status:"STABLE", riskScore:25, admissionNumber:"FF-2024-010", _count:{cases:0,assessments:1} },
  { id:"s11", firstName:"Aditya", lastName:"Mishra", grade:"6", classroom:"6A", age:11, tier:"TIER_2", status:"NEEDS_SUPPORT", riskScore:45, admissionNumber:"FF-2024-011", _count:{cases:1,assessments:0} },
  { id:"s12", firstName:"Sanya", lastName:"Khanna", grade:"9", classroom:"9B", age:14, tier:"TIER_1", status:"STABLE", riskScore:22, admissionNumber:"FF-2024-012", _count:{cases:0,assessments:0} },
  { id:"s13", firstName:"Karan", lastName:"Mehta", grade:"8", classroom:"8A", age:13, tier:"TIER_3", status:"NEEDS_INTERVENTION", riskScore:72, admissionNumber:"FF-2024-013", _count:{cases:1,assessments:1} },
  { id:"s14", firstName:"Diya", lastName:"Rao", grade:"7", classroom:"7B", age:12, tier:"TIER_1", status:"STABLE", riskScore:15, admissionNumber:"FF-2024-014", _count:{cases:0,assessments:0} },
  { id:"s15", firstName:"Ravi", lastName:"Yadav", grade:"10", classroom:"10C", age:15, tier:"TIER_2", status:"NEEDS_SUPPORT", riskScore:52, admissionNumber:"FF-2024-015", _count:{cases:1,assessments:1} },
];

// ======================== CASES (8 with INDIAN names) ========================
const CASES = [
  { id:"c1", title:"Crisis intervention - Ananya Reddy", tier:"TIER_3", type:"CRISIS", riskLevel:"CRITICAL", status:"IN_PROGRESS", openedAt:new Date(NOW-3*D).toISOString(), closedAt:null, student:{id:"s4",firstName:"Ananya",lastName:"Reddy",grade:"9",classroom:"9C"}, _count:{sessions:2,timelineEvents:5} },
  { id:"c2", title:"Self-harm monitoring - Arjun Patel", tier:"TIER_3", type:"COUNSELLING", riskLevel:"HIGH", status:"IN_PROGRESS", openedAt:new Date(NOW-5*D).toISOString(), closedAt:null, student:{id:"s1",firstName:"Arjun",lastName:"Patel",grade:"8",classroom:"8A"}, _count:{sessions:3,timelineEvents:4} },
  { id:"c3", title:"Anxiety management - Priya Sharma", tier:"TIER_2", type:"COUNSELLING", riskLevel:"MEDIUM", status:"OPEN", openedAt:new Date(NOW-7*D).toISOString(), closedAt:null, student:{id:"s2",firstName:"Priya",lastName:"Sharma",grade:"10",classroom:"10B"}, _count:{sessions:2,timelineEvents:3} },
  { id:"c4", title:"Behavioural support - Aryan Joshi", tier:"TIER_3", type:"SEL", riskLevel:"HIGH", status:"OPEN", openedAt:new Date(NOW-4*D).toISOString(), closedAt:null, student:{id:"s7",firstName:"Aryan",lastName:"Joshi",grade:"8",classroom:"8B"}, _count:{sessions:1,timelineEvents:2} },
  { id:"c5", title:"Social skills - Rohan Verma", tier:"TIER_2", type:"SEL", riskLevel:"MEDIUM", status:"IN_PROGRESS", openedAt:new Date(NOW-6*D).toISOString(), closedAt:null, student:{id:"s3",firstName:"Rohan",lastName:"Verma",grade:"7",classroom:"7A"}, _count:{sessions:2,timelineEvents:3} },
  { id:"c6", title:"Academic anxiety - Rahul Desai", tier:"TIER_2", type:"COUNSELLING", riskLevel:"MEDIUM", status:"OPEN", openedAt:new Date(NOW-8*D).toISOString(), closedAt:null, student:{id:"s9",firstName:"Rahul",lastName:"Desai",grade:"7",classroom:"7C"}, _count:{sessions:1,timelineEvents:1} },
  { id:"c7", title:"Emotional regulation - Karan Mehta", tier:"TIER_3", type:"COUNSELLING", riskLevel:"HIGH", status:"OPEN", openedAt:new Date(NOW-10*D).toISOString(), closedAt:null, student:{id:"s13",firstName:"Karan",lastName:"Mehta",grade:"8",classroom:"8A"}, _count:{sessions:1,timelineEvents:2} },
  { id:"c8", title:"Anger management - Aditya Mishra", tier:"TIER_2", type:"SEL", riskLevel:"MEDIUM", status:"ON_HOLD", openedAt:new Date(NOW-12*D).toISOString(), closedAt:null, student:{id:"s11",firstName:"Aditya",lastName:"Mishra",grade:"6",classroom:"6A"}, _count:{sessions:2,timelineEvents:3} },
];

// ======================== SESSIONS ========================
const SESSIONS = [
  { id:"ses-1", title:"Crisis check-in - Ananya Reddy", status:"SCHEDULED", scheduledAt:new Date(NOW).toISOString(), notes:"Follow-up on crisis intervention progress", student:{firstName:"Ananya",lastName:"Reddy",grade:"9",classroom:"9C"}, counsellor:{fullName:"Priya Sharma"} },
  { id:"ses-2", title:"Anxiety management - Priya Sharma", status:"COMPLETED", scheduledAt:new Date(NOW-D).toISOString(), notes:"Introduced breathing techniques and PMR. Homework: daily mood tracking.", student:{firstName:"Priya",lastName:"Sharma",grade:"10",classroom:"10B"}, counsellor:{fullName:"Dr. Anil Kumar"} },
  { id:"ses-3", title:"Behaviour assessment - Aryan Joshi", status:"SCHEDULED", scheduledAt:new Date(NOW+2*D).toISOString(), notes:"Initial assessment for anger management", student:{firstName:"Aryan",lastName:"Joshi",grade:"8",classroom:"8B"}, counsellor:{fullName:"Priya Sharma"} },
  { id:"ses-4", title:"Follow-up - Vikram Singh", status:"COMPLETED", scheduledAt:new Date(NOW-2*D).toISOString(), notes:"Student showing improvement. Reduced outbursts.", student:{firstName:"Vikram",lastName:"Singh",grade:"6",classroom:"6B"}, counsellor:{fullName:"Dr. Anil Kumar"} },
  { id:"ses-5", title:"SEL group session - Grade 7", status:"SCHEDULED", scheduledAt:new Date(NOW+D).toISOString(), notes:"Social skills group activity planned", student:{firstName:"Rohan",lastName:"Verma",grade:"7",classroom:"7A"}, counsellor:{fullName:"Sneha Reddy"} },
  { id:"ses-6", title:"Parent consultation - Arjun P.", status:"COMPLETED", scheduledAt:new Date(NOW-3*D).toISOString(), notes:"Discussed safety plan and home support strategies with Anita Desai", student:{firstName:"Arjun",lastName:"Patel",grade:"8",classroom:"8A"}, counsellor:{fullName:"Priya Sharma"} },
];

// ======================== INCIDENTS ========================
const INCIDENTS = [
  { id:"inc-1", severity:"CRITICAL", incidentType:"Self-harm ideation - Ananya Reddy", description:"Student expressed suicidal thoughts during morning check-in questionnaire. Immediate crisis protocol activated per SC V guidelines.", actionTaken:"Crisis team notified within 5 minutes. Parents contacted. Safety plan initiated. Student escorted to counsellor's office. 24/7 helpline provided.", createdAt:new Date(NOW-H).toISOString(), student:{firstName:"Ananya",lastName:"Reddy"} },
  { id:"inc-2", severity:"HIGH", incidentType:"Self-harm concern - Arjun Patel", description:"Teacher reported concerning statements in student journal. Self-harm indicators detected in recent check-in responses.", actionTaken:"Counsellor assessment scheduled. Parent meeting arranged for tomorrow. Increased monitoring frequency.", createdAt:new Date(NOW-4*H).toISOString(), student:{firstName:"Arjun",lastName:"Patel"} },
  { id:"inc-3", severity:"HIGH", incidentType:"Physical altercation - Rohan Verma", description:"Fight during recess resulting in minor injuries. Multiple students involved.", actionTaken:"Mediation session scheduled. Parents of all involved notified. Disciplinary review pending.", createdAt:new Date(NOW-2*D).toISOString(), student:{firstName:"Rohan",lastName:"Verma"} },
  { id:"inc-4", severity:"CRITICAL", incidentType:"Substance concern - Vikram Singh", description:"Suspected substance possession reported by peer. Campus security involved.", actionTaken:"Student search conducted. Counsellor debrief completed. Disciplinary committee notified.", createdAt:new Date(NOW-7*D).toISOString(), student:{firstName:"Vikram",lastName:"Singh"} },
];

// ======================== OBSERVATIONS (in-memory) ========================
const OBSERVATIONS: Array<ObservationEntry> = [
  { id: "o-1", classroom: "8A", studentId: "s13", type: "BEHAVIOURAL", severity: "HIGH", notes: "Outburst during group activity", createdAt: new Date(NOW-3*H).toISOString(), createdBy: "Rajesh Kumar" },
  { id: "o-2", classroom: "9C", studentId: "s4", type: "EMOTIONAL", severity: "HIGH", notes: "Low mood reported in check-in", createdAt: new Date(NOW-5*H).toISOString(), createdBy: "Priya Sharma" },
];


// ======================== ACADEMIC & WELLBEING DATA ========================
const ACADEMIC_DATA: Record<string, { attendancePercent: number; assignmentCompletionPercent: number; recentPerformance: string }> = {
  s1:  { attendancePercent: 78, assignmentCompletionPercent: 65, recentPerformance: "Declining — Maths and Science dropped15%" },
  s2:  { attendancePercent: 92, assignmentCompletionPercent: 88, recentPerformance: "Consistent — Top10% of class" },
  s3:  { attendancePercent: 85, assignmentCompletionPercent: 72, recentPerformance: "Stable — Average performance" },
  s4:  { attendancePercent: 70, assignmentCompletionPercent: 58, recentPerformance: "Declining — Withdrawn from activities" },
  s5:  { attendancePercent: 95, assignmentCompletionPercent: 90, recentPerformance: "Excellent — All subjects above85%" },
  s6:  { attendancePercent: 98, assignmentCompletionPercent: 95, recentPerformance: "Outstanding — Consistent high achiever" },
  s7:  { attendancePercent: 72, assignmentCompletionPercent: 62, recentPerformance: "Declining — Behaviour affecting performance" },
  s8:  { attendancePercent: 96, assignmentCompletionPercent: 92, recentPerformance: "Excellent — Engaged and proactive" },
  s9:  { attendancePercent: 80, assignmentCompletionPercent: 75, recentPerformance: "Stable — Minor anxiety affecting exams" },
  s10: { attendancePercent: 99, assignmentCompletionPercent: 98, recentPerformance: "Outstanding — Top performer" },
  s11: { attendancePercent: 75, assignmentCompletionPercent: 68, recentPerformance: "Declining — Outbursts affecting focus" },
  s12: { attendancePercent: 94, assignmentCompletionPercent: 91, recentPerformance: "Good — Consistent and reliable" },
  s13: { attendancePercent: 68, assignmentCompletionPercent: 55, recentPerformance: "Declining — Aggressive behaviour noted" },
  s14: { attendancePercent: 97, assignmentCompletionPercent: 93, recentPerformance: "Excellent — Socially well-integrated" },
  s15: { attendancePercent: 88, assignmentCompletionPercent: 80, recentPerformance: "Good — Improving steadily" },
};

const WELLBEING_DATA: Record<string, { selParticipation: number; emotionalWellnessScore: number }> = {
  s1:  { selParticipation: 45, emotionalWellnessScore: 28 },
  s2:  { selParticipation: 78, emotionalWellnessScore: 62 },
  s3:  { selParticipation: 65, emotionalWellnessScore: 55 },
  s4:  { selParticipation: 30, emotionalWellnessScore: 22 },
  s5:  { selParticipation: 88, emotionalWellnessScore: 74 },
  s6:  { selParticipation: 95, emotionalWellnessScore: 88 },
  s7:  { selParticipation: 40, emotionalWellnessScore: 35 },
  s8:  { selParticipation: 92, emotionalWellnessScore: 85 },
  s9:  { selParticipation: 60, emotionalWellnessScore: 48 },
  s10: { selParticipation: 98, emotionalWellnessScore: 90 },
  s11: { selParticipation: 50, emotionalWellnessScore: 42 },
  s12: { selParticipation: 85, emotionalWellnessScore: 78 },
  s13: { selParticipation: 35, emotionalWellnessScore: 30 },
  s14: { selParticipation: 90, emotionalWellnessScore: 82 },
  s15: { selParticipation: 70, emotionalWellnessScore: 65 },
};

const SEL_PROGRESS: Record<string, { assigned: number; completed: number; pending: number }> = {
  s1:  { assigned: 8, completed: 4, pending: 2 },
  s2:  { assigned: 6, completed: 5, pending: 0 },
  s3:  { assigned: 7, completed: 4, pending: 1 },
  s4:  { assigned: 10, completed: 3, pending: 4 },
  s5:  { assigned: 5, completed: 5, pending: 0 },
  s6:  { assigned: 4, completed: 4, pending: 0 },
  s7:  { assigned: 9, completed: 3, pending: 3 },
  s8:  { assigned: 5, completed: 5, pending: 0 },
  s9:  { assigned: 6, completed: 3, pending: 1 },
  s10: { assigned: 3, completed: 3, pending: 0 },
  s11: { assigned: 7, completed: 3, pending: 2 },
  s12: { assigned: 4, completed: 3, pending: 0 },
  s13: { assigned: 8, completed: 2, pending: 3 },
  s14: { assigned: 4, completed: 4, pending: 0 },
  s15: { assigned: 6, completed: 4, pending: 1 },
};

// ======================== RICH OBSERVATIONS (20+) ========================
const OBSERVATIONS_RICH: Array<ObservationEntry> = [
  { id:"obs-1", studentId:"s13", classroom:"8A", type:"BEHAVIOURAL", severity:"HIGH", notes:"Outburst during group activity — pushed a chair at another student", createdAt:new Date(NOW-3*H).toISOString(), createdBy:"Rajesh Kumar" },
  { id:"obs-2", studentId:"s4", classroom:"9C", type:"EMOTIONAL", severity:"HIGH", notes:"Low mood reported in morning check-in. Withdrawn during break.", createdAt:new Date(NOW-5*H).toISOString(), createdBy:"Priya Sharma" },
  { id:"obs-3", studentId:"s1", classroom:"8A", type:"BEHAVIOURAL", severity:"MEDIUM", notes:"Aggressive response to peer feedback in Science class", createdAt:new Date(NOW-8*H).toISOString(), createdBy:"Rajesh Kumar" },
  { id:"obs-4", studentId:"s7", classroom:"8B", type:"BEHAVIOURAL", severity:"HIGH", notes:"Physical altercation during recess — punched a wall", createdAt:new Date(NOW-12*H).toISOString(), createdBy:"Lakshmi Iyer" },
  { id:"obs-5", studentId:"s11", classroom:"6A", type:"ACADEMIC", severity:"MEDIUM", notes:"Assignment submission dropped from 90% to 55% in past month", createdAt:new Date(NOW-1*D).toISOString(), createdBy:"Sunita O'Brien" },
  { id:"obs-6", studentId:"s9", classroom:"7C", type:"ATTENDANCE", severity:"MEDIUM", notes:"4 absences in the last2 weeks — family trip reported", createdAt:new Date(NOW-2*D).toISOString(), createdBy:"Ravi Patel" },
  { id:"obs-7", studentId:"s2", classroom:"10B", type:"SOCIAL", severity:"LOW", notes:"Noticed eating alone during lunch — usually social", createdAt:new Date(NOW-18*H).toISOString(), createdBy:"Anita Verma" },
  { id:"obs-8", studentId:"s6", classroom:"5A", type:"EMOTIONAL", severity:"LOW", notes:"Seemed anxious before the Math test — breathing exercises helped", createdAt:new Date(NOW-20*H).toISOString(), createdBy:"Meera Joshi" },
  { id:"obs-9", studentId:"s3", classroom:"7A", type:"ACADEMIC", severity:"MEDIUM", notes:"Struggling with reading comprehension — possible dyslexia screening needed", createdAt:new Date(NOW-1*D).toISOString(), createdBy:"Deepa Menon" },
  { id:"obs-10", studentId:"s15", classroom:"10C", type:"SOCIAL", severity:"LOW", notes:"Participated actively in group discussion — good improvement", createdAt:new Date(NOW-30*H).toISOString(), createdBy:"Sneha Reddy" },
  { id:"obs-11", studentId:"s5", classroom:"6B", type:"BEHAVIOURAL", severity:"LOW", notes:"Helped a younger student who fell during assembly — positive leadership", createdAt:new Date(NOW-4*H).toISOString(), createdBy:"Anita Verma" },
  { id:"obs-12", studentId:"s8", classroom:"10A", type:"EMOTIONAL", severity:"LOW", notes:"Reported feeling stressed about board exams — coping strategies discussed", createdAt:new Date(NOW-6*H).toISOString(), createdBy:"Dr. Anil Kumar" },
  { id:"obs-13", studentId:"s12", classroom:"9B", type:"ATTENDANCE", severity:"LOW", notes:"Late arrival3 times this week — alarm issue reported", createdAt:new Date(NOW-10*H).toISOString(), createdBy:"Sunita O'Brien" },
  { id:"obs-14", studentId:"s14", classroom:"7B", type:"SOCIAL", severity:"LOW", notes:"Facilitated peer study group — excellent social skills", createdAt:new Date(NOW-36*H).toISOString(), createdBy:"Deepa Menon" },
  { id:"obs-15", studentId:"s10", classroom:"5B", type:"ACADEMIC", severity:"LOW", notes:"Creative project submission — exceeded expectations", createdAt:new Date(NOW-48*H).toISOString(), createdBy:"Meera Joshi" },
  { id:"obs-16", studentId:"s13", classroom:"8A", type:"EMOTIONAL", severity:"HIGH", notes:"Expressed hopelessness about academic performance — immediate check-in needed", createdAt:new Date(NOW-6*H).toISOString(), createdBy:"Priya Sharma" },
  { id:"obs-17", studentId:"s4", classroom:"9C", type:"BEHAVIOURAL", severity:"CRITICAL", notes:"Self-harm ideation disclosed to class teacher", createdAt:new Date(NOW-1*H).toISOString(), createdBy:"Rajesh Kumar" },
  { id:"obs-18", studentId:"s7", classroom:"8B", type:"ACADEMIC", severity:"MEDIUM", notes:"Test anxiety causing incomplete papers — extra time granted", createdAt:new Date(NOW-2*D).toISOString(), createdBy:"Lakshmi Iyer" },
  { id:"obs-19", studentId:"s1", classroom:"8A", type:"ATTENDANCE", severity:"MEDIUM", notes:"Arrived late 5 times — pattern suggests avoidance of specific class", createdAt:new Date(NOW-3*D).toISOString(), createdBy:"Ravi Patel" },
  { id:"obs-20", studentId:"s11", classroom:"6A", type:"SOCIAL", severity:"MEDIUM", notes:"Excluded from peer group during lunch — possible social isolation", createdAt:new Date(NOW-5*D).toISOString(), createdBy:"Sunita O'Brien" },
  { id:"obs-21", studentId:"s2", classroom:"10B", type:"EMOTIONAL", severity:"MEDIUM", notes:"Mood swings noted — tearful after PTM results discussion", createdAt:new Date(NOW-7*D).toISOString(), createdBy:"Dr. Anil Kumar" },
  { id:"obs-22", studentId:"s9", classroom:"7C", type:"BEHAVIOURAL", severity:"LOW", notes:"Apologized unprompted after losing temper — good self-awareness", createdAt:new Date(NOW-9*D).toISOString(), createdBy:"Ravi Patel" },
];

// ======================== FLAG HISTORY ========================
const FLAGS_HISTORY: Array<FlagEntry> = [
  { id:"fh-1", studentId:"s13", classroom:"8A", category:"EMOTIONAL_DISTRESS", priority:"HIGH", notes:"Aggressive behaviour observed in class", status:"OPEN", createdAt:new Date(NOW-2*H).toISOString(), createdBy:"Rajesh Kumar", updatedAt:new Date(NOW-1*H).toISOString(), updatedBy:"Priya Sharma" },
  { id:"fh-2", studentId:"s11", classroom:"6A", category:"ATTENDANCE_ISSUES", priority:"MEDIUM", notes:"Attendance concerns and withdrawn behaviour", status:"OPEN", createdAt:new Date(NOW-1*D).toISOString(), createdBy:"Lakshmi Iyer" },
  { id:"fh-3", studentId:"s4", classroom:"9C", category:"EMOTIONAL_DISTRESS", priority:"CRITICAL", notes:"Self-harm ideation disclosed — crisis protocol activated", status:"OPEN", createdAt:new Date(NOW-H).toISOString(), createdBy:"Priya Sharma", updatedAt:new Date(NOW-30*60*1000).toISOString(), updatedBy:"Dr. Anil Kumar" },
  { id:"fh-4", studentId:"s7", classroom:"8B", category:"BULLYING", priority:"HIGH", notes:"Physical altercation — peer conflict escalation", status:"RESOLVED", createdAt:new Date(NOW-4*D).toISOString(), createdBy:"Lakshmi Iyer", resolvedAt:new Date(NOW-2*D).toISOString() },
  { id:"fh-5", studentId:"s1", classroom:"8A", category:"ACADEMIC_DECLINE", priority:"MEDIUM", notes:"Grades dropped 20% — maths and science affected", status:"RESOLVED", createdAt:new Date(NOW-10*D).toISOString(), createdBy:"Rajesh Kumar", updatedAt:new Date(NOW-7*D).toISOString(), updatedBy:"Rajesh Kumar", resolvedAt:new Date(NOW-5*D).toISOString() },
  { id:"fh-6", studentId:"s9", classroom:"7C", category:"SOCIAL_ISOLATION", priority:"LOW", notes:"Eating alone during lunch — possible exclusion", status:"RESOLVED", createdAt:new Date(NOW-7*D).toISOString(), createdBy:"Ravi Patel", resolvedAt:new Date(NOW-3*D).toISOString() },
  { id:"fh-7", studentId:"s3", classroom:"7A", category:"ACADEMIC_DECLINE", priority:"MEDIUM", notes:"Reading comprehension difficulties — screening needed", status:"OPEN", createdAt:new Date(NOW-1*D).toISOString(), createdBy:"Deepa Menon" },
  { id:"fh-8", studentId:"s2", classroom:"10B", category:"EMOTIONAL_DISTRESS", priority:"MEDIUM", notes:"Mood swings and tearfulness reported by PTM", status:"OPEN", createdAt:new Date(NOW-7*D).toISOString(), createdBy:"Dr. Anil Kumar" },
];

// ======================== NAME POOL FOR SYNTHETIC STUDENTS ========================
const FIRST_NAMES_M = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Reyansh","Sai","Aryan","Krishna","Ishaan","Shaurya","Atharv","Ayush","Aarush","Advait","Pranav","Adhrit","Riaan","Veer","Samarth","Devansh","Yash","Arnav","Kabir","Rudra","Ansh","Kian","Darsh","Aarush","Veer","Aaditya","Rohit","Saurav","Kunal","Manan","Yuvraj","Hriday","Tejas","Nirvan","Akshar"];
const FIRST_NAMES_F = ["Saanvi","Aanya","Aadhya","Aaradhya","Ananya","Pari","Anika","Isha","Anvi","Navya","Arya","Myra","Ira","Aahana","Anaya","Pihu","Riya","Aaradhya","Aarohi","Anvi","Prisha","Kavya","Khushi","Aarna","Ishita","Siya","Tara","Misha","Anvi","Kiara","Nitya","Sara","Mira","Aditi","Riya","Suhana","Trisha","Mahika","Pranavi","Ishani","Aahana"];
const LAST_NAMES = ["Sharma","Verma","Patel","Reddy","Iyer","Nair","Khan","Kapoor","Joshi","Rao","Mehta","Bose","Chatterjee","Banerjee","Mukherjee","Das","Gupta","Singh","Kumar","Mishra","Yadav","Pandey","Saxena","Srinivasan","Bhat","Pillai","Menon","Kaur","Dhillon","Chopra","Bajaj","Malhotra","Khanna","Sethi","Ahuja","Bhatt","Soni","Trivedi","Desai"];
const FATHER_NAMES = ["Rajesh","Suresh","Anil","Vijay","Prakash","Manoj","Arun","Dinesh","Ramesh","Sanjay","Mahesh","Ashok","Karthik","Ravi","Sunil","Naveen","Pradeep","Vinod","Ganesh","Rakesh","Subramaniam","Raghunathan","Harish","Pankaj","Mohan","Rajendra","Devendra","Yogesh","Naresh","Umesh"];
const MOTHER_NAMES = ["Sunita","Anita","Priya","Meena","Lakshmi","Sushma","Kavita","Rekha","Geeta","Asha","Pooja","Sapna","Seema","Neeta","Anjali","Nirmala","Mala","Reema","Vandana","Sarita","Indira","Radha","Sneha","Nandini","Lalitha","Saroj","Kiran","Manju","Suman","Urmila"];

const NAME_POOL: Array<{ firstName: string; lastName: string; gender: "Male" | "Female" }> = [];
(function buildNamePool() {
  FIRST_NAMES_M.forEach((fn) => LAST_NAMES.forEach((ln) => NAME_POOL.push({ firstName: fn, lastName: ln, gender: "Male" })));
  FIRST_NAMES_F.forEach((fn) => LAST_NAMES.forEach((ln) => NAME_POOL.push({ firstName: fn, lastName: ln, gender: "Female" })));
})();

const SEED_CLASSROOMS = Array.from(new Set(STUDENTS.map((s) => s.classroom))).sort();
const DETERMINISTIC_RNG = (() => {
  let seed = 0xC0FFEE;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xFFFFFFFF;
  };
})();

const PARENT_CONTACT_PREFIX = ["98","97","96","95","90","89","88","87","80","79"];

const SYNTHETIC_STUDENTS: Array<StudentSummary & { gender: string; isSynthetic: boolean }> = (() => {
  const out: Array<StudentSummary & { gender: string; isSynthetic: boolean }> = [];
  let poolIdx = 0;
  let idCounter = 100;
  SEED_CLASSROOMS.forEach((classroomName) => {
    const grade = classroomName.replace(/[A-Z]/g, "");
    const targetCount = 20 + Math.floor(DETERMINISTIC_RNG() * 5);
    for (let i = 0; i < targetCount; i++) {
      const n = NAME_POOL[poolIdx % NAME_POOL.length];
      poolIdx++;
      const riskScore = 15 + Math.floor(DETERMINISTIC_RNG() * 75);
      const tier = riskScore >= 70 ? "TIER_3" : riskScore >= 40 ? "TIER_2" : "TIER_1";
      const status = tier === "TIER_3" ? "NEEDS_INTERVENTION" : tier === "TIER_2" ? "NEEDS_SUPPORT" : "STABLE";
      const year = 2024;
      const seq = idCounter++;
      out.push({
        id: `gen-${seq}`,
        firstName: n.firstName,
        lastName: n.lastName,
        grade,
        classroom: classroomName,
        age: parseInt(grade) + 5,
        tier,
        status,
        riskScore,
        admissionNumber: `FF-${year}-${String(seq).padStart(3, "0")}`,
        _count: { cases: tier === "TIER_1" ? 0 : 1, assessments: tier === "TIER_1" ? 0 : 1 },
        gender: n.gender,
        isSynthetic: true,
      });
    }
  });
  return out;
})();

const ALL_STUDENTS = [...STUDENTS, ...SYNTHETIC_STUDENTS];

// ======================== STUDENT DEMOGRAPHICS ========================
const DEMOGRAPHICS: Record<string, StudentDemographics> = (() => {
  const out: Record<string, StudentDemographics> = {};
  ALL_STUDENTS.forEach((s, idx) => {
    const year = 2026 - (parseInt(s.grade) + 5);
    const month = 1 + (idx % 12);
    const day = 1 + (idx % 28);
    const dob = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const age = 2026 - year;
    const father = FATHER_NAMES[idx % FATHER_NAMES.length];
    const mother = MOTHER_NAMES[(idx * 7) % MOTHER_NAMES.length];
    const phone = `${PARENT_CONTACT_PREFIX[idx % PARENT_CONTACT_PREFIX.length]}${String(10000000 + (idx * 13579) % 90000000).padStart(8, "0")}`;
    const gender = (s as Record<string, unknown>).gender as string | undefined;
    out[s.id] = {
      dateOfBirth: dob,
      age,
      gender: (gender as "Male" | "Female" | "Other") ?? (idx % 2 === 0 ? "Male" : "Female"),
      fatherName: `${father} ${s.lastName}`,
      motherName: `${mother} ${s.lastName}`,
      parentContact: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
      admissionNumber: s.admissionNumber ?? `FF-${year}-${String(idx + 1).padStart(3, "0")}`,
      standard: `Grade ${s.grade}`,
      section: s.classroom.replace(/[0-9]/g, ""),
    };
  });
  return out;
})();

// ======================== TEACHERS ========================
const TEACHER_TEMPLATES: Array<{ fullName: string; subject: string }> = [
  { fullName: "Rajesh Kumar", subject: "Mathematics" },
  { fullName: "Sunita O'Brien", subject: "English" },
  { fullName: "Lakshmi Iyer", subject: "Science" },
  { fullName: "Ravi Patel", subject: "Social Studies" },
  { fullName: "Meera Joshi", subject: "Hindi" },
  { fullName: "Deepa Menon", subject: "Computer Science" },
  { fullName: "Anita Verma", subject: "Art" },
  { fullName: "Sneha Reddy", subject: "Physical Education" },
  { fullName: "Dr. Anil Kumar", subject: "Wellbeing" },
  { fullName: "Vikram Singh", subject: "Music" },
];

const TEACHERS_BY_CLASSROOM: Record<string, Array<Teacher>> = (() => {
  const out: Record<string, Array<Teacher>> = {};
  SEED_CLASSROOMS.forEach((classroomName, idx) => {
    const ct = TEACHER_TEMPLATES[idx % TEACHER_TEMPLATES.length];
    const subjectTeachers = [0, 1, 2, 3].map((j) => TEACHER_TEMPLATES[(idx + j + 1) % TEACHER_TEMPLATES.length]);
    const list: Array<Teacher> = [
      { id: `t-ct-${classroomName}`, fullName: ct.fullName, subject: ct.subject, isClassTeacher: true, initials: initialsOf(ct.fullName) },
      ...subjectTeachers.map((t, j) => ({ id: `t-sub-${classroomName}-${j}`, fullName: t.fullName, subject: t.subject, isClassTeacher: false, initials: initialsOf(t.fullName) })),
    ];
    out[classroomName] = list;
  });
  return out;
})();

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ======================== CLASSROOM TIMETABLES ========================
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const PERIOD_TIMES = ["09:00", "10:00", "11:15", "13:00", "14:00"] as const;
const SUBJECTS = ["Mathematics", "English", "Science", "Social Studies", "Hindi"];

const CLASSROOM_TIMETABLES: Record<string, Array<TimetableSlot>> = (() => {
  const out: Record<string, Array<TimetableSlot>> = {};
  SEED_CLASSROOMS.forEach((classroomName, classIdx) => {
    const slots: Array<TimetableSlot> = [];
    const teachers = TEACHERS_BY_CLASSROOM[classroomName];
    DAYS.forEach((day, dayIdx) => {
      PERIOD_TIMES.forEach((time, period) => {
        if (period === 2 && dayIdx === 2) {
          slots.push({ day, period: period + 1, time, subject: "SEL: Building Empathy", teacherName: "Dr. Anil Kumar", type: "SEL" });
          return;
        }
        if (period === 4 && dayIdx === 0) {
          slots.push({ day, period: period + 1, time, subject: "SEL: Self-awareness", teacherName: "Dr. Anil Kumar", type: "SEL" });
          return;
        }
        if (period === 1 && dayIdx === 4) {
          slots.push({ day, period: period + 1, time, subject: "Free Period — Request SEL", teacherName: null, type: "FREE" });
          return;
        }
        const subjectIdx = (classIdx + dayIdx + period) % SUBJECTS.length;
        const subject = SUBJECTS[subjectIdx];
        const teacher = teachers.find((t) => t.subject === subject) ?? teachers[0];
        slots.push({ day, period: period + 1, time, subject, teacherName: teacher.fullName, type: "ACADEMIC" });
      });
    });
    out[classroomName] = slots;
  });
  return out;
})();

// ======================== SEL SESSIONS (detailed) ========================
const SEL_SESSIONS: Record<string, Array<SELSessionDetailed>> = (() => {
  const out: Record<string, Array<SELSessionDetailed>> = {};
  const topics = ["Managing Emotions", "Building Empathy", "Self-Awareness", "Conflict Resolution", "Mindfulness & Focus", "Stress Management", "Anger Management", "Social Skills"];
  const facilitators = [
    { id: "f-1", name: "Priya Sharma" },
    { id: "f-2", name: "Dr. Anil Kumar" },
    { id: "f-3", name: "Sneha Reddy" },
  ];
  SEED_CLASSROOMS.forEach((classroomName, idx) => {
    const sessionCount = 3 + (idx % 3);
    const arr: Array<SELSessionDetailed> = [];
    for (let i = 0; i < sessionCount; i++) {
      const topic = topics[(idx + i) % topics.length];
      const f = facilitators[(idx + i) % facilitators.length];
      const isCompleted = i < 2;
      const isNoShow = i === 2 && idx % 2 === 0;
      const daysOffset = i * 7 - 3;
      arr.push({
        id: `sess-${classroomName}-${i}`,
        classroomId: `class-${classroomName}`,
        topic,
        scheduledAt: new Date(NOW + daysOffset * D).toISOString(),
        durationMins: 45,
        facilitatorId: f.id,
        facilitatorName: f.name,
        status: isCompleted ? "COMPLETED" : isNoShow ? "NO_SHOW" : "SCHEDULED",
        feedback: isCompleted ? {
          studentEngagement: "High",
          learningUnderstanding: "Strong",
          emotionalClimate: "Open & Receptive",
          followUpNeed: "No Concerns",
          planCompletion: "Yes",
          activityCompletion: "Yes",
          activityQuality: "Good",
          notes: "Excellent participation from the cohort. Students engaged with the role-play scenario.",
          submittedAt: new Date(NOW + daysOffset * D + 45 * 60 * 1000).toISOString(),
          submittedBy: f.name,
        } : null,
      });
    }
    out[classroomName] = arr;
  });
  return out;
})();

// ======================== IEPS (sample for select students) ========================
const IEPS: Record<string, IEP> = (() => {
  const out: Record<string, IEP> = {};
  const targets = [
    { id: "s4", title: "IEP — Tier 3 Care Plan (Ananya Reddy)" },
    { id: "s7", title: "IEP — Behavioural Support (Aryan Joshi)" },
    { id: "s1", title: "IEP — Academic & Emotional Support (Arjun Patel)" },
    { id: "s11", title: "IEP — Social Skills (Aditya Mishra)" },
  ];
  targets.forEach((t) => {
    out[t.id] = {
      id: `iep-${t.id}`,
      studentId: t.id,
      title: t.title,
      uploadedBy: "Priya Sharma",
      consentLogged: true,
      createdAt: new Date(NOW - 30 * D).toISOString(),
      goals: [
        { id: `g-${t.id}-1`, title: "Manage emotional responses in classroom", description: "Use grounding technique when triggered; check in with CT after episode.", status: "IN_PROGRESS", accommodation: "5-minute cool-off pass; alternative workspace" },
        { id: `g-${t.id}-2`, title: "Improve peer relationships", description: "Participate in at least one structured group activity per week.", status: "NOT_STARTED", accommodation: "Paired with peer mentor" },
        { id: `g-${t.id}-3`, title: "Academic catch-up", description: "Close 60% of the gap in core subjects by term end.", status: "ACHIEVED", accommodation: "Extended time on tests" },
      ],
      feedback: [],
    };
  });
  return out;
})();

// ======================== CLASSROOM ACTIVITY FEED ========================
const CLASSROOM_ACTIVITY: Record<string, Array<ClassroomActivityItem>> = {
  "8A": [
    { id:"ca-1", type:"OBSERVATION_ADDED", studentId:"s13", studentName:"Karan Mehta", description:"Outburst during group activity", createdAt:new Date(NOW-3*H).toISOString(), createdBy:"Rajesh Kumar" },
    { id:"ca-2", type:"FLAG_RAISED", studentId:"s13", studentName:"Karan Mehta", description:"Aggressive behaviour — Emotional Distress", createdAt:new Date(NOW-2*H).toISOString(), createdBy:"Rajesh Kumar" },
    { id:"ca-3", type:"SEL_SESSION_COMPLETED", studentId:"s13", studentName:"Karan Mehta", description:"Completed 'Managing Emotions' session", createdAt:new Date(NOW-1*D).toISOString(), createdBy:"Priya Sharma" },
    { id:"ca-4", type:"OBSERVATION_ADDED", studentId:"s1", studentName:"Arjun Patel", description:"Aggressive response to peer feedback", createdAt:new Date(NOW-8*H).toISOString(), createdBy:"Rajesh Kumar" },
    { id:"ca-5", type:"WORKSHOP_ATTENDED", studentId:"s1", studentName:"Arjun Patel", description:"Attended 'Stress Management' workshop", createdAt:new Date(NOW-2*D).toISOString(), createdBy:"Sneha Reddy" },
  ],
  "9C": [
    { id:"cb-1", type:"FLAG_RAISED", studentId:"s4", studentName:"Ananya Reddy", description:"Self-harm ideation — CRITICAL", createdAt:new Date(NOW-H).toISOString(), createdBy:"Priya Sharma" },
    { id:"cb-2", type:"OBSERVATION_ADDED", studentId:"s4", studentName:"Ananya Reddy", description:"Low mood in morning check-in", createdAt:new Date(NOW-5*H).toISOString(), createdBy:"Priya Sharma" },
    { id:"cb-3", type:"SEL_SESSION_COMPLETED", studentId:"s4", studentName:"Ananya Reddy", description:"Completed crisis intervention session", createdAt:new Date(NOW-2*H).toISOString(), createdBy:"Priya Sharma" },
  ],
  "6A": [
    { id:"cc-1", type:"FLAG_RAISED", studentId:"s11", studentName:"Aditya Mishra", description:"Attendance concerns and withdrawn behaviour", createdAt:new Date(NOW-1*D).toISOString(), createdBy:"Lakshmi Iyer" },
    { id:"cc-2", type:"OBSERVATION_ADDED", studentId:"s11", studentName:"Aditya Mishra", description:"Assignment submission dropped", createdAt:new Date(NOW-1*D).toISOString(), createdBy:"Sunita O'Brien" },
    { id:"cc-3", type:"WORKSHOP_ATTENDED", studentId:"s11", studentName:"Aditya Mishra", description:"Attended 'Anger Management' SEL session", createdAt:new Date(NOW-3*D).toISOString(), createdBy:"Sneha Reddy" },
  ],
  "8B": [
    { id:"cd-1", type:"FLAG_RESOLVED", studentId:"s7", studentName:"Aryan Joshi", description:"Bullying concern resolved after mediation", createdAt:new Date(NOW-2*D).toISOString(), createdBy:"Lakshmi Iyer" },
    { id:"cd-2", type:"OBSERVATION_ADDED", studentId:"s7", studentName:"Aryan Joshi", description:"Physical altercation during recess", createdAt:new Date(NOW-12*H).toISOString(), createdBy:"Lakshmi Iyer" },
  ],
  "7A": [{ id:"ce-1", type:"OBSERVATION_ADDED", studentId:"s3", studentName:"Rohan Verma", description:"Reading comprehension difficulties noted", createdAt:new Date(NOW-1*D).toISOString(), createdBy:"Deepa Menon" }],
  "7C": [{ id:"cf-1", type:"OBSERVATION_ADDED", studentId:"s9", studentName:"Rahul Desai", description:"4 absences in two weeks", createdAt:new Date(NOW-2*D).toISOString(), createdBy:"Ravi Patel" }],
  "10B": [{ id:"cg-1", type:"OBSERVATION_ADDED", studentId:"s2", studentName:"Priya Sharma", description:"Mood swings and tearfulness", createdAt:new Date(NOW-7*D).toISOString(), createdBy:"Dr. Anil Kumar" }],
  "5A": [{ id:"ch-1", type:"OBSERVATION_ADDED", studentId:"s6", studentName:"Kavya Nair", description:"Test anxiety — breathing exercises helped", createdAt:new Date(NOW-20*H).toISOString(), createdBy:"Meera Joshi" }],
  "6B": [{ id:"ci-1", type:"OBSERVATION_ADDED", studentId:"s5", studentName:"Vikram Singh", description:"Helped younger student — positive leadership", createdAt:new Date(NOW-4*H).toISOString(), createdBy:"Anita Verma" }],
  "10A": [{ id:"cj-1", type:"OBSERVATION_ADDED", studentId:"s8", studentName:"Isha Kapoor", description:"Exam stress reported", createdAt:new Date(NOW-6*H).toISOString(), createdBy:"Dr. Anil Kumar" }],
  "9B": [{ id:"ck-1", type:"OBSERVATION_ADDED", studentId:"s12", studentName:"Sanya Khanna", description:"Late arrivals 3 times this week", createdAt:new Date(NOW-10*H).toISOString(), createdBy:"Sunita O'Brien" }],
  "7B": [{ id:"cl-1", type:"OBSERVATION_ADDED", studentId:"s14", studentName:"Diya Rao", description:"Facilitated peer study group", createdAt:new Date(NOW-36*H).toISOString(), createdBy:"Deepa Menon" }],
  "5B": [{ id:"cm-1", type:"OBSERVATION_ADDED", studentId:"s10", studentName:"Neha Gupta", description:"Creative project exceeded expectations", createdAt:new Date(NOW-48*H).toISOString(), createdBy:"Meera Joshi" }],
  "10C": [{ id:"cn-1", type:"OBSERVATION_ADDED", studentId:"s15", studentName:"Ravi Yadav", description:"Active participation in group discussion", createdAt:new Date(NOW-30*H).toISOString(), createdBy:"Sneha Reddy" }],
};

// ======================== WELLBEING REPORT ========================
const WELLBEING_REPORT = {
  studentStatus:[{status:"STABLE",_count:{status:532}},{status:"NEEDS_SUPPORT",_count:{status:215}},{status:"NEEDS_INTERVENTION",_count:{status:100}}],
  studentTier:[{tier:"TIER_1",_count:{tier:670}},{tier:"TIER_2",_count:{tier:124}},{tier:"TIER_3",_count:{tier:53}}],
  casesByStatus:[{status:"OPEN",_count:{status:45}},{status:"IN_PROGRESS",_count:{status:38}},{status:"ON_HOLD",_count:{status:12}},{status:"CLOSED",_count:{status:29}}],
  casesByType:[{type:"SEL",_count:{type:18}},{type:"COUNSELLING",_count:{type:42}},{type:"CRISIS",_count:{type:8}},{type:"CAREER",_count:{type:12}},{type:"NEURO_DEVELOPMENTAL",_count:{type:6}}],
  incidentsBySeverity:[{severity:"LOW",_count:{severity:5}},{severity:"MODERATE",_count:{severity:8}},{severity:"HIGH",_count:{severity:12}},{severity:"CRITICAL",_count:{severity:4}}],
};

const COMPLIANCE_REPORT = {
  supremeCourtGuidelines:[
    {code:"SC III",title:"SEL and Counselling Systems",status:"active"},
    {code:"SC IV",title:"School Wellbeing Workflows",status:"in_progress"},
    {code:"SC V",title:"Crisis Escalation Protocols",status:"active"},
    {code:"SC VIII",title:"Case Management & Referrals",status:"active"},
    {code:"SC IX",title:"Safety & Monitoring Practices",status:"active"},
    {code:"SC X",title:"Supportive Policy Infrastructure",status:"in_progress"},
    {code:"SC XII",title:"Audit & Documentation",status:"active"},
    {code:"SC XIV",title:"Implementation Accountability",status:"in_progress"}
  ],
  metrics:{activeCases:124,incidentCount:29,sessionsCount:86}
};

// ======================== DASHBOARDS ========================
const DASHBOARDS: Record<string, DashboardOverview> = {
  ADMIN: {
    kpis:{totalStudents:847,activeCases:124,tier2Students:58,tier3Alerts:19},
    schoolWellbeingScore:74,counsellorWorkload:85,referralSuccessRate:72,
    tierDistribution:[{tier:"Tier 1",value:670},{tier:"Tier 2",value:124},{tier:"Tier 3",value:53}],
    activityTrends:[{label:"Mon",count:12},{label:"Tue",count:18},{label:"Wed",count:25},{label:"Thu",count:15},{label:"Fri",count:30},{label:"Sat",count:8},{label:"Sun",count:5}],
    recentAlerts:[{id:"al-1",severity:"CRITICAL",title:"Self-harm indicator detected",description:"Arjun Patel's check-in indicates self-harm ideation",actionTaken:"Crisis team activated",studentName:"Arjun Patel",createdAt:new Date(NOW-30*60*1000).toISOString()},{id:"al-2",severity:"HIGH",title:"Missed session (3rd occurrence)",description:"Priya Sharma missed 3rd consecutive session",actionTaken:"Guardian contacted",studentName:"Priya Sharma",createdAt:new Date(NOW-2*H).toISOString()},{id:"al-3",severity:"HIGH",title:"Peer conflict escalation",description:"Bullying reports involving Rohan Verma",actionTaken:"Mediation scheduled",studentName:"Rohan Verma",createdAt:new Date(NOW-4*H).toISOString()}],
    activityFeed:[{id:"af-1",createdAt:new Date(NOW-15*60*1000).toISOString(),type:"SESSION_COMPLETED",title:"Counselling session completed",subtitle:"Ananya Reddy completed Tier 3 session"},{id:"af-2",createdAt:new Date(NOW-45*60*1000).toISOString(),type:"CASE_UPDATED",title:"Risk level escalated",subtitle:"Arjun Patel escalated to CRITICAL"},{id:"af-3",createdAt:new Date(NOW-90*60*1000).toISOString(),type:"ASSESSMENT_SUBMITTED",title:"Wellbeing assessment submitted",subtitle:"Rohan Verma scored 55/100"},{id:"af-4",createdAt:new Date(NOW-3*H).toISOString(),type:"REPORT_GENERATED",title:"Compliance report generated",subtitle:"SC V audit completed"},{id:"af-5",createdAt:new Date(NOW-5*H).toISOString(),type:"REFERRAL_CREATED",title:"New referral from teacher",subtitle:"Aditya Mishra referred for anxiety"}]
  },
  COUNSELLOR: {
    kpis:{totalStudents:847,activeCases:38,tier2Students:22,tier3Alerts:12},
    schoolWellbeingScore:74,counsellorWorkload:38,referralSuccessRate:78,
    tierDistribution:[{tier:"Active Cases",value:38},{tier:"Scheduled Today",value:14},{tier:"Overdue Follow-up",value:6}],
    activityTrends:[{label:"Mon",count:8},{label:"Tue",count:12},{label:"Wed",count:15},{label:"Thu",count:10},{label:"Fri",count:18},{label:"Sat",count:3},{label:"Sun",count:0}],
    recentAlerts:[{id:"ca-1",severity:"CRITICAL",title:"Crisis: Ananya Reddy",description:"Suicidal ideation detected - crisis protocol activated",actionTaken:"Crisis team notified, parents contacted",studentName:"Ananya Reddy",createdAt:new Date(NOW-20*60*1000).toISOString()},{id:"ca-2",severity:"HIGH",title:"No-show: Vikram Singh",description:"Missed Tier 2 intervention session",actionTaken:"Rescheduled with parent confirmation",studentName:"Vikram Singh",createdAt:new Date(NOW-H).toISOString()},{id:"ca-3",severity:"HIGH",title:"Notes overdue (4)",description:"Session notes pending from yesterday",actionTaken:"Complete before supervision",studentName:"Multiple students",createdAt:new Date(NOW-3*H).toISOString()}],
    activityFeed:[{id:"cf-1",createdAt:new Date(NOW-10*60*1000).toISOString(),type:"GROUP_SESSION",title:"Group session completed",subtitle:"6 students attended social skills group"},{id:"cf-2",createdAt:new Date(NOW-35*60*1000).toISOString(),type:"INTERVENTION_CREATED",title:"New intervention plan",subtitle:"Behavioural plan for Karan Mehta"},{id:"cf-3",createdAt:new Date(NOW-2*H).toISOString(),type:"ASSESSMENT_COMPLETED",title:"SDQ completed",subtitle:"Isha Kapoor scored 18/100"},{id:"cf-4",createdAt:new Date(NOW-4*H).toISOString(),type:"REFERRAL_RECEIVED",title:"Referral received",subtitle:"Rahul Desai referred by Lakshmi Iyer"}]
  },
  TEACHER: {
    kpis:{totalStudents:32,activeCases:5,tier2Students:3,tier3Alerts:2},
    tierDistribution:[{tier:"Stable",value:24},{tier:"Needs Support",value:5},{tier:"Needs Intervention",value:3}],
    activityTrends:[{label:"Mon",count:3},{label:"Tue",count:5},{label:"Wed",count:7},{label:"Thu",count:4},{label:"Fri",count:6},{label:"Sat",count:1},{label:"Sun",count:0}],
    recentAlerts:[{id:"ta-1",severity:"HIGH",title:"Behaviour concern: Aryan Joshi",description:"3 aggression incidents this week",actionTaken:"Referred to counselling",studentName:"Aryan Joshi",createdAt:new Date(NOW-H).toISOString()},{id:"ta-2",severity:"MODERATE",title:"Academic decline: Kavya Nair",description:"Grades dropped 20% with wellbeing decline",actionTaken:"PTM scheduled Thursday",studentName:"Kavya Nair",createdAt:new Date(NOW-3*H).toISOString()},{id:"ta-3",severity:"LOW",title:"Attendance: Diya Rao",description:"4 days missed this month",actionTaken:"Attendance review initiated",studentName:"Diya Rao",createdAt:new Date(NOW-5*H).toISOString()}],
    activityFeed:[{id:"tf-1",createdAt:new Date(NOW-30*60*1000).toISOString(),type:"CHECK_IN",title:"Check-in: 28/32 completed",subtitle:"4 pending - send reminder"},{id:"tf-2",createdAt:new Date(NOW-2*H).toISOString(),type:"FLAG",title:"Flags raised for 2 students",subtitle:"Neha Gupta and Aditya Mishra"},{id:"tf-3",createdAt:new Date(NOW-4*H).toISOString(),type:"REPORT",title:"Classroom snapshot ready",subtitle:"8A monthly report available"},{id:"tf-4",createdAt:new Date(NOW-6*H).toISOString(),type:"REFERRAL",title:"Referral approved",subtitle:"Sanya Khanna - SEL group approved"}]
  },
  PARENT: {
    kpis:{totalStudents:2,activeCases:1,tier2Students:1,tier3Alerts:0},
    tierDistribution:[{tier:"Wellbeing Score",value:78},{tier:"Attendance",value:92},{tier:"Engagement",value:65}],
    activityTrends:[{label:"Mon",count:4},{label:"Tue",count:3},{label:"Wed",count:5},{label:"Thu",count:2},{label:"Fri",count:4},{label:"Sat",count:1},{label:"Sun",count:0}],
    recentAlerts:[{id:"pa-1",severity:"MODERATE",title:"Wellbeing score decreased",description:"Arjun's scores dropped from 82 to 65",actionTaken:"Counsellor monitoring increased",studentName:"Arjun Patel",createdAt:new Date(NOW-90*60*1000).toISOString()},{id:"pa-2",severity:"LOW",title:"PTM scheduled",description:"Thursday 3 PM wellbeing check-in",actionTaken:"Confirm via parent portal",studentName:"Arjun Patel",createdAt:new Date(NOW-4*H).toISOString()}],
    activityFeed:[{id:"pf-1",createdAt:new Date(NOW-H).toISOString(),type:"REPORT_SHARED",title:"Weekly report shared",subtitle:"Arjun's summary available"},{id:"pf-2",createdAt:new Date(NOW-3*H).toISOString(),type:"CHECK_IN",title:"Check-in completed",subtitle:"Arjun feeling 'okay' today"},{id:"pf-3",createdAt:new Date(NOW-5*H).toISOString(),type:"SESSION",title:"Session scheduled Friday",subtitle:"3 PM with Priya Sharma"},{id:"pf-4",createdAt:new Date(NOW-8*H).toISOString(),type:"RESOURCE",title:"New parent resource",subtitle:"Supporting child's mental health at home"}]
  },
  STUDENT: {
    kpis:{totalStudents:1,activeCases:1,tier2Students:0,tier3Alerts:0},
    tierDistribution:[{tier:"Check-in Streak",value:12},{tier:"Sessions",value:4},{tier:"Goals",value:3}],
    activityTrends:[{label:"Mon",count:7},{label:"Tue",count:6},{label:"Wed",count:8},{label:"Thu",count:5},{label:"Fri",count:7},{label:"Sat",count:3},{label:"Sun",count:2}],
    recentAlerts:[{id:"sa-1",severity:"LOW",title:"Check-in reminder",description:"You haven't checked in today!",actionTaken:"",studentName:"You",createdAt:new Date(NOW-H).toISOString()},{id:"sa-2",severity:"LOW",title:"Session tomorrow",description:"2:30 PM with Priya Sharma in Room 204",actionTaken:"",studentName:"You",createdAt:new Date(NOW-4*H).toISOString()}],
    activityFeed:[{id:"sf-1",createdAt:new Date(NOW-30*60*1000).toISOString(),type:"RESOURCE",title:"Viewed 'Managing exam stress'",subtitle:"45 students found this helpful"},{id:"sf-2",createdAt:new Date(NOW-2*H).toISOString(),type:"GOAL",title:"Mindfulness goal achieved!",subtitle:"7 days of exercises completed"},{id:"sf-3",createdAt:new Date(NOW-4*H).toISOString(),type:"SESSION",title:"Session completed",subtitle:"Building healthy routines"},{id:"sf-4",createdAt:new Date(NOW-8*H).toISOString(),type:"MILESTONE",title:"12-day streak!",subtitle:"Keep it up!"}]
  }
};

// ======================== MAIN HANDLER ========================
function parseBody(init: RequestInit | undefined): Record<string, unknown> {
  if (!init?.body) return {};
  const raw = typeof init.body === "string" ? init.body : String(init.body);
  try { return JSON.parse(raw); } catch { return {}; }
}

function isPost(init: RequestInit | undefined): boolean {
  return init?.method === "POST";
}

export async function mockRequest<T>(url: string, _init?: RequestInit, user?: AuthUser | null): Promise<T> {
  await new Promise(r => setTimeout(r, 200 + Math.random() * 180));
  const role = user?.role ?? "ADMIN";

  // Parse URL - strip leading /api/v1 if present
  let path = url;
  if (path.startsWith("/api/v1")) path = path.replace("/api/v1", "");

  // Get query params
  const qIndex = path.indexOf("?");
  const queryStr = qIndex >= 0 ? path.slice(qIndex + 1) : "";
  const basePath = qIndex >= 0 ? path.slice(0, qIndex) : path;
  const params = new URLSearchParams(queryStr);

  // =========== STUDENTS ===========
  if (basePath === "/students" || basePath.startsWith("/students/")) {
    if (basePath === "/students") {
      const search = params.get("search")?.toLowerCase() || "";
      const tier = params.get("tier") || "";
      const grade = params.get("grade") || "";
      const page = parseInt(params.get("page") || "1");
      const pageSize = parseInt(params.get("pageSize") || "8");
      let filtered = STUDENTS;
      if (search) filtered = filtered.filter(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(search) || (s.admissionNumber||"").toLowerCase().includes(search));
      if (tier) filtered = filtered.filter(s => s.tier === tier);
      if (grade) filtered = filtered.filter(s => s.grade === grade);
      const start = (page-1)*pageSize;
      return { data: filtered.slice(start, start+pageSize), pagination: { page, pageSize, total: filtered.length, totalPages: Math.ceil(filtered.length/pageSize) } } as T;
    }
    const sid = basePath.replace("/students/", "");

    // POST IEP feedback: /students/{id}/iep-feedback
    if (basePath.endsWith("/iep-feedback") && isPost(_init)) {
      const body = parseBody(_init);
      const iep = IEPS[sid];
      if (!iep) throw new Error("No IEP found for this student");
      const fb: IEPFeedback = {
        id: `fb-${Date.now()}`,
        iepId: iep.id,
        goalId: body.goalId as string,
        progress: body.progress as IEPFeedbackProgress,
        comment: (body.comment as string) || "",
        submittedAt: new Date().toISOString(),
        submittedBy: user?.fullName || ROLE_NAMES.COUNSELLOR,
      };
      iep.feedback.unshift(fb);
      const goal = iep.goals.find((g) => g.id === body.goalId);
      if (goal) goal.status = body.progress as IEPGoalStatus;
      return fb as T;
    }

    const s = ALL_STUDENTS.find(x => x.id === sid);
    if (s) return {
      ...s,
      academic: ACADEMIC_DATA[s.id] ?? {
        attendancePercent: 70 + (parseInt(s.id.replace(/\D/g, "") || "0") % 30),
        assignmentCompletionPercent: 60 + (parseInt(s.id.replace(/\D/g, "") || "0") % 35),
        recentPerformance: "Stable — average performance",
      },
      wellbeing: WELLBEING_DATA[s.id] ?? { selParticipation: 70, emotionalWellnessScore: 65 },
      selProgress: SEL_PROGRESS[s.id] ?? { assigned: 5, completed: 3, pending: 1 },
      counsellor: { id:"couns-1", fullName:"Priya Sharma", email:"counsellor@firefly.local" },
      demographics: DEMOGRAPHICS[s.id] ?? null,
      iep: IEPS[s.id] ?? null,
      iepFeedback: IEPS[s.id]?.feedback ?? [],
      assessments: [],
      assessmentTrend: [{ id:"as-1", score: s.riskScore, riskLevel: s.riskScore>=70?"HIGH":s.riskScore>=40?"MEDIUM":"LOW", createdAt: new Date(NOW-D).toISOString() }],
      cases: CASES.filter(c => c.student.id === sid),
      sessions: SESSIONS.filter(x => x.student.firstName === s.firstName),
      incidents: INCIDENTS.filter(x => x.student?.firstName === s.firstName),
      recentActivity: {
        observations: OBSERVATIONS_RICH.filter(o => o.studentId === sid).slice(0, 5),
        flags: FLAGS_HISTORY.filter(f => f.studentId === sid),
        workshops: ["Stress Management", "Building Empathy", "Mindfulness & Focus"].slice(0, 2),
      },
    } as T;
    throw new Error("Student not found");
  }

  // =========== CASES ===========
  if (basePath === "/cases" || basePath.startsWith("/cases/")) {
    if (basePath === "/cases") {
      const search = params.get("search")?.toLowerCase() || "";
      const status = params.get("status") || "";
      const riskLevel = params.get("riskLevel") || "";
      const page = parseInt(params.get("page") || "1");
      const pageSize = parseInt(params.get("pageSize") || "8");
      let filtered = [...CASES];
      if (search) filtered = filtered.filter(c => c.title.toLowerCase().includes(search) || `${c.student.firstName} ${c.student.lastName}`.toLowerCase().includes(search));
      if (status) filtered = filtered.filter(c => c.status === status);
      if (riskLevel) filtered = filtered.filter(c => c.riskLevel === riskLevel);
      const start = (page-1)*pageSize;
      return { data: filtered.slice(start, start+pageSize), pagination: { page, pageSize, total: filtered.length, totalPages: Math.ceil(filtered.length/pageSize) } } as T;
    }
    const cid = basePath.replace("/cases/", "");
    const c = CASES.find(x => x.id === cid);
    if (c) return {
      ...c,
      summary: "Case being actively managed with counselling sessions and risk monitoring",
      timelineEvents: [
        { id:"te-1", eventType:"case_opened", title:"Case Opened", description:"Case initiated after screening", createdAt:new Date(NOW-3*D).toISOString(), createdBy:{fullName:"Priya Sharma",role:"COUNSELLOR"} },
        { id:"te-2", eventType:"assessment", title:"Assessment", description:"Risk assessment completed", createdAt:new Date(NOW-2*D).toISOString(), createdBy:{fullName:"Priya Sharma",role:"COUNSELLOR"} },
        { id:"te-3", eventType:"session", title:"First session", description:"Counselling session completed", createdAt:new Date(NOW-D).toISOString(), createdBy:{fullName:"Priya Sharma",role:"COUNSELLOR"} },
      ],
      sessions: SESSIONS.filter(x => c.student.firstName.includes(x.student.firstName.split(" ")[0])).slice(0,3),
      incidents: INCIDENTS.filter(x => x.student?.firstName === c.student.firstName)
    } as T;
    throw new Error("Case not found");
  }

  // =========== SESSIONS ===========
  if (basePath === "/sessions") {
    const page = parseInt(params.get("page") || "1");
    const pageSize = parseInt(params.get("pageSize") || "12");
    const start = (page-1)*pageSize;
    return { data: SESSIONS.slice(start, start+pageSize), pagination: { page, pageSize, total: SESSIONS.length, totalPages: Math.ceil(SESSIONS.length/pageSize) } } as T;
  }

  // =========== INCIDENTS ===========
  if (basePath === "/incidents") {
    const sev = params.get("severity");
    let filtered = [...INCIDENTS];
    if (sev) filtered = filtered.filter(i => i.severity === sev);
    return { data: filtered } as T;
  }

  // =========== REPORTS ===========
  if (basePath === "/reports/wellbeing") return WELLBEING_REPORT as T;
  if (basePath === "/reports/compliance") return COMPLIANCE_REPORT as T;

  // =========== DASHBOARD ===========
  if (basePath === "/dashboard/overview") return (DASHBOARDS[role] ?? DASHBOARDS.ADMIN) as T;

  // =========== OTHER MODULES ===========
  if (basePath === "/analytics/overview") return {
    studentStatus:[{name:"Stable",value:532},{name:"Needs Support",value:215},{name:"Needs Intervention",value:100}],
    casesByType:[{name:"SEL",value:45},{name:"Counselling",value:82},{name:"Crisis",value:18},{name:"Career",value:24},{name:"Neurodevelopmental",value:12}],
    riskHeatmap:[{grade:"5",low:85,medium:22,high:8,critical:2},{grade:"6",low:92,medium:18,high:12,critical:3},{grade:"7",low:78,medium:28,high:15,critical:5},{grade:"8",low:88,medium:15,high:10,critical:4},{grade:"9",low:72,medium:25,high:18,critical:6},{grade:"10",low:90,medium:16,high:8,critical:2}],
    counsellorWorkload:[{name:"Priya Sharma",cases:18},{name:"Dr. Anil Kumar",cases:22},{name:"Sneha Reddy",cases:15},{name:"Mohammed Iqbal",cases:20}],
    interventionEffectiveness:[{month:"Aug",success:12,ongoing:8,declined:3},{month:"Sep",success:15,ongoing:10,declined:2},{month:"Oct",success:18,ongoing:11,declined:4},{month:"Nov",success:14,ongoing:9,declined:3},{month:"Dec",success:20,ongoing:7,declined:1}],
    sessionAttendance:[{month:"Aug",attended:82,missed:12,cancelled:6},{month:"Sep",attended:88,missed:8,cancelled:4},{month:"Oct",attended:78,missed:15,cancelled:7},{month:"Nov",attended:85,missed:10,cancelled:5},{month:"Dec",attended:92,missed:5,cancelled:3}],
    schoolComparison:[{school:"Firefly Public",score:74,change:5},{school:"Green Valley",score:68,change:2},{school:"St. Mary's",score:82,change:-3},{school:"Delhi Public",score:71,change:4},{school:"National High",score:65,change:1}]
  } as T;

  if (basePath === "/sel/sessions") return [
    { id:"sel-1", title:"Understanding Emotions", description:"Identify and manage emotions through exercises", grade:"5-6", date:new Date(NOW+2*D).toISOString(), status:"planned", completedBy:0, totalStudents:60, competencies:["Self-awareness","Self-management"] },
    { id:"sel-2", title:"Building Empathy", description:"Kindness challenges and community building", grade:"7-8", date:new Date(NOW+3*D).toISOString(), status:"planned", completedBy:0, totalStudents:55, competencies:["Social awareness","Relationship skills"] },
    { id:"sel-3", title:"Mindfulness & Focus", description:"Guided meditation and attention training", grade:"9-10", date:new Date(NOW-D).toISOString(), status:"completed", completedBy:48, totalStudents:50, competencies:["Self-management","Decision-making"] },
    { id:"sel-4", title:"Conflict Resolution", description:"Peer mediation and communication strategies", grade:"6-7", date:new Date(NOW-2*D).toISOString(), status:"completed", completedBy:42, totalStudents:45, competencies:["Relationship skills","Social awareness"] },
    { id:"sel-5", title:"Goal Setting Workshop", description:"SMART goals for academic and personal growth", grade:"8-9", date:new Date(NOW+5*D).toISOString(), status:"in_progress", completedBy:22, totalStudents:50, competencies:["Decision-making","Self-awareness"] },
    { id:"sel-6", title:"Stress Management", description:"Identifying triggers and coping mechanisms", grade:"10", date:new Date(NOW+7*D).toISOString(), status:"planned", completedBy:0, totalStudents:40, competencies:["Self-management","Self-awareness"] },
  ] as T;

  // =========== CLASSROOMS ==========
  if (basePath === "/classrooms") {
    const unique = Array.from(new Set(ALL_STUDENTS.map(s => s.classroom))).sort();
    const data = unique.map(name => {
      const students = ALL_STUDENTS.filter(s => s.classroom === name);
      const tierCounts: Record<string, number> = {};
      students.forEach(s => { tierCounts[s.tier] = (tierCounts[s.tier] || 0) + 1; });
      const ct = TEACHERS_BY_CLASSROOM[name]?.find(t => t.isClassTeacher);
      return {
        id: `class-${name}`,
        name,
        grade: students[0]?.grade ?? "",
        teacher: ct ? { id: ct.id, fullName: ct.fullName } : { id: `t-${name}`, fullName: ROLE_NAMES.CLASS_TEACHER ?? ROLE_NAMES.TEACHER },
        studentsCount: students.length,
        tierDistribution: Object.entries(tierCounts).map(([tier,count])=>({ tier, count }))
      };
    });
    return { data, pagination: { page: 1, pageSize: data.length, total: data.length, totalPages: 1 } } as T;
  }

  if (basePath.startsWith("/classrooms/")) {
    const tail = basePath.replace("/classrooms/", "");
    // students list endpoint
    if (tail.endsWith("/students")) {
      const id = tail.replace("/students", "").replace(/^\//, "");
      const classroomName = id.startsWith("class-") ? id.replace("class-", "") : id;
      const students = ALL_STUDENTS.filter(s => s.classroom === classroomName);
      return { data: students } as T;
    }

    // flags for a classroom or create flag
    if (tail.endsWith("/flags") && !tail.includes("/resolve")) {
      const id = tail.replace("/flags", "").replace(/^\//, "");
      const classroomName = id.startsWith("class-") ? id.replace("class-", "") : id;
      if (isPost(_init)) {
        try {
          const body = parseBody(_init);
          const newFlag: FlagEntry = {
            id: `f-${Date.now()}`,
            classroom: classroomName,
            studentId: body.studentId as string,
            category: body.category as FlagCategory,
            priority: body.priority as FlagPriority,
            notes: (body.reason as string) || (body.notes as string) || "",
            status: "OPEN",
            createdBy: (body.raisedBy as string) || ROLE_NAMES.TEACHER,
            createdAt: new Date().toISOString(),
          };
          FLAGS_HISTORY.unshift(newFlag);
          return newFlag as T;
        } catch {
          throw new Error("Invalid flag payload");
        }
      }
      // Surface full flag history (5 active / 3 resolved demo data)
      return { data: FLAGS_HISTORY.filter(f => f.classroom === classroomName) } as T;
    }

    // resolve flag
    if (tail.includes("/flags/") && tail.endsWith("/resolve")) {
      const flagId = tail.split("/flags/")[1].split("/")[0];
      if (isPost(_init)) {
        const body = parseBody(_init);
        const flag = FLAGS_HISTORY.find(f => f.id === flagId);
        if (!flag) throw new Error("Flag not found");
        flag.status = "RESOLVED";
        flag.resolvedAt = new Date().toISOString();
        flag.resolutionNote = (body?.resolutionNote as string) || "";
        return flag as T;
      }
      throw new Error("Method not allowed");
    }

    // observations for a classroom or create observation
    if (tail.endsWith("/observations")) {
      const id = tail.replace("/observations", "").replace(/^\//, "");
      const classroomName = id.startsWith("class-") ? id.replace("class-", "") : id;
      if (isPost(_init)) {
        try {
          const body = parseBody(_init);
          const newObs: ObservationEntry = {
            id: `o-${Date.now()}`,
            classroom: classroomName,
            studentId: body.studentId as string,
            type: (body.type as ObservationType) || "BEHAVIOURAL",
            severity: (body.severity as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL") || "MEDIUM",
            notes: (body.notes as string) || "",
            createdAt: new Date().toISOString(),
            createdBy: (body.observedBy as string) || ROLE_NAMES.TEACHER,
          };
          OBSERVATIONS.unshift(newObs);
          OBSERVATIONS_RICH.unshift(newObs);
          return newObs as T;
        } catch {
          throw new Error("Invalid observation payload");
        }
      }
      // Use rich observations so timeline has all entries
      return { data: OBSERVATIONS_RICH.filter(o => o.classroom === classroomName) } as T;
    }

    // teachers list
    if (tail.endsWith("/teachers")) {
      const id = tail.replace("/teachers", "").replace(/^\//, "");
      const classroomName = id.startsWith("class-") ? id.replace("class-", "") : id;
      return { data: TEACHERS_BY_CLASSROOM[classroomName] ?? [] } as T;
    }

    // timetable
    if (tail.endsWith("/timetable")) {
      const id = tail.replace("/timetable", "").replace(/^\//, "");
      const classroomName = id.startsWith("class-") ? id.replace("class-", "") : id;
      return { data: CLASSROOM_TIMETABLES[classroomName] ?? [] } as T;
    }

    // SEL request (from timetable free period)
    if (tail.endsWith("/sel-request")) {
      if (isPost(_init)) {
        const body = parseBody(_init);
        return { id: `sel-req-${Date.now()}`, status: "PENDING", day: body?.day, period: body?.period, requestedBy: user?.fullName || ROLE_NAMES.TEACHER, createdAt: new Date().toISOString() } as T;
      }
      throw new Error("Method not allowed");
    }

    // SEL sessions
    if (tail.endsWith("/sessions") && !tail.includes("/feedback")) {
      const id = tail.replace("/sessions", "").replace(/^\//, "");
      const classroomName = id.startsWith("class-") ? id.replace("class-", "") : id;
      return { data: SEL_SESSIONS[classroomName] ?? [] } as T;
    }

    // session feedback
    if (tail.includes("/sessions/") && tail.endsWith("/feedback")) {
      const id = tail.replace("/sessions/", "").split("/")[0].replace(/^\//, "");
      const classroomName = id.startsWith("class-") ? id.replace("class-", "") : id;
      const sessionId = tail.split("/sessions/")[1].split("/")[0];
      if (isPost(_init)) {
        const body = parseBody(_init);
        const session = (SEL_SESSIONS[classroomName] ?? []).find((s) => s.id === sessionId);
        if (!session) throw new Error("Session not found");
        session.status = "COMPLETED";
        session.feedback = {
          studentEngagement: body.studentEngagement as SessionFeedback["studentEngagement"],
          learningUnderstanding: body.learningUnderstanding as SessionFeedback["learningUnderstanding"],
          emotionalClimate: body.emotionalClimate as SessionFeedback["emotionalClimate"],
          followUpNeed: body.followUpNeed as SessionFeedback["followUpNeed"],
          planCompletion: body.planCompletion as SessionFeedback["planCompletion"],
          activityCompletion: body.activityCompletion as SessionFeedback["activityCompletion"],
          activityQuality: body.activityQuality as SessionFeedback["activityQuality"],
          notes: body.notes as string | undefined,
          submittedAt: new Date().toISOString(),
          submittedBy: user?.fullName || ROLE_NAMES.COUNSELLOR,
        };
        return session as T;
      }
      throw new Error("Method not allowed");
    }

    // class analytics
    if (tail.endsWith("/analytics")) {
      const id = tail.replace("/analytics", "").replace(/^\//, "");
      const classroomName = id.startsWith("class-") ? id.replace("class-", "") : id;
      const classroomStudents = ALL_STUDENTS.filter(st => st.classroom === classroomName);
      const tierCounts: Record<string, number> = {};
      classroomStudents.forEach(st => { tierCounts[st.tier] = (tierCounts[st.tier] || 0) + 1; });
      const flags = FLAGS_HISTORY.filter(f => f.classroom === classroomName);
      const obs = OBSERVATIONS_RICH.filter(o => o.classroom === classroomName);
      let assigned = 0, completed = 0;
      classroomStudents.forEach(st => {
        const p = SEL_PROGRESS[st.id] ?? { assigned: 5, completed: 3, pending: 1 };
        assigned += p.assigned; completed += p.completed;
      });
      const trend = [
        { day: "Mon", count: 2 + (classroomStudents.length % 4) },
        { day: "Tue", count: 1 + (classroomStudents.length % 5) },
        { day: "Wed", count: 3 + (classroomStudents.length % 3) },
        { day: "Thu", count: 0 + (classroomStudents.length % 2) },
        { day: "Fri", count: 2 + (classroomStudents.length % 4) },
      ];
      return {
        classroomId: `class-${classroomName}`,
        totalStudents: classroomStudents.length,
        tierDistribution: Object.entries(tierCounts).map(([tier, count]) => ({ tier, count })),
        flagCount: { open: flags.filter(f => f.status === "OPEN").length, resolved: flags.filter(f => f.status === "RESOLVED").length },
        selCompletionRate: assigned > 0 ? Math.round((completed / assigned) * 100) : 0,
        observationCount: obs.length,
        trend,
      } as T;
    }

    // classroom detail
    const id = tail.replace(/^\//, "");
    const classroomName = id.startsWith("class-") ? id.replace("class-", "") : id;
    const students = ALL_STUDENTS.filter(s => s.classroom === classroomName);
    if (students.length === 0) throw new Error("Classroom not found");
    const ct = TEACHERS_BY_CLASSROOM[classroomName]?.find(t => t.isClassTeacher);
    return {
      id: `class-${classroomName}`,
      name: classroomName,
      grade: students[0].grade,
      section: classroomName.replace(/[0-9]/g, ""),
      teacher: ct ? { id: ct.id, fullName: ct.fullName } : { id:`t-${classroomName}`, fullName: ROLE_NAMES.CLASS_TEACHER ?? ROLE_NAMES.TEACHER },
      students,
      teachers: TEACHERS_BY_CLASSROOM[classroomName] ?? [],
      timetable: CLASSROOM_TIMETABLES[classroomName] ?? [],
      sessions: SEL_SESSIONS[classroomName] ?? [],
      flags: FLAGS_HISTORY.filter(f => f.classroom === classroomName),
      observations: OBSERVATIONS_RICH.filter(o => o.classroom === classroomName),
    } as T;
  }

  // =========== STUDENT FULL PROFILE ===========
  if (basePath.startsWith("/students/") && basePath.endsWith("/full")) {
    const sid = basePath.replace("/students/", "").replace("/full", "");
    const s = STUDENTS.find(x => x.id === sid);
    if (!s) throw new Error("Student not found");
    return {
      ...s,
      academic: ACADEMIC_DATA[s.id] ?? { attendancePercent: 85, assignmentCompletionPercent: 80, recentPerformance: "Average" },
      wellbeing: WELLBEING_DATA[s.id] ?? { selParticipation: 70, emotionalWellnessScore: 65 },
      selProgress: SEL_PROGRESS[s.id] ?? { assigned: 5, completed: 3, pending: 1 },
      recentActivity: {
        observations: OBSERVATIONS_RICH.filter(o => o.studentId === sid).slice(0, 5),
        flags: FLAGS_HISTORY.filter(f => f.studentId === sid),
        workshops: ["Stress Management", "Building Empathy", "Mindfulness & Focus"].slice(0, Math.floor(Math.random() * 3)),
      },
    } as T;
  }

  // =========== STUDENT SEL PROGRESS ===========
  if (basePath.startsWith("/students/") && basePath.endsWith("/sel-progress")) {
    const sid = basePath.replace("/students/", "").replace("/sel-progress", "");
    return (SEL_PROGRESS[sid] ?? { assigned: 5, completed: 3, pending: 1 }) as T;
  }

  // =========== CLASSROOM SEL PROGRESS ===========
  if (basePath.startsWith("/classrooms/") && basePath.endsWith("/sel-progress")) {
    const tail = basePath.replace("/classrooms/", "").replace("/sel-progress", "");
    const classroomName = tail.startsWith("class-") ? tail.replace("class-", "") : tail;
    const classroomStudents = STUDENTS.filter(st => st.classroom === classroomName);
    let assigned = 0, completed = 0, pending = 0, participationSum = 0;
    classroomStudents.forEach(st => {
      const p = SEL_PROGRESS[st.id] ?? { assigned: 5, completed: 3, pending: 1 };
      assigned += p.assigned; completed += p.completed; pending += p.pending;
      participationSum += WELLBEING_DATA[st.id]?.selParticipation ?? 70;
    });
    const total = classroomStudents.length;
    return {
      classroomId: `class-${classroomName}`,
      totalStudents: total,
      assigned, completed, pending,
      completionRate: assigned > 0 ? Math.round((completed / assigned) * 100) : 0,
      participationRate: total > 0 ? Math.round(participationSum / total) : 0,
    } as T;
  }

  // =========== CLASSROOM ACTIVITY FEED ===========
  if (basePath.startsWith("/classrooms/") && basePath.endsWith("/activity")) {
    const tail = basePath.replace("/classrooms/", "").replace("/activity", "");
    const classroomName = tail.startsWith("class-") ? tail.replace("class-", "") : tail;
    return { data: CLASSROOM_ACTIVITY[classroomName] ?? [] } as T;
  }

  // =========== FLAG/OBSERVATION HISTORY FOR STUDENT ===========
  if (basePath.startsWith("/students/") && basePath.endsWith("/history")) {
    const sid = basePath.replace("/students/", "").replace("/history", "");
    return {
      observations: OBSERVATIONS_RICH.filter(o => o.studentId === sid),
      flags: FLAGS_HISTORY.filter(f => f.studentId === sid),
    } as T;
  }

  if (basePath === "/referrals") return [
    { id:"ref-1", studentName:"Aryan Joshi", referredBy:"Rajesh Kumar", referredTo:"Priya Sharma", reason:"Aggressive behaviour - 3 incidents", status:"accepted", createdAt:new Date(NOW-2*D).toISOString(), priority:"high" },
    { id:"ref-2", studentName:"Kavya Nair", referredBy:"Lakshmi Iyer", referredTo:"Dr. Anil Kumar", reason:"Anxiety affecting grades", status:"pending", createdAt:new Date(NOW-D).toISOString(), priority:"medium" },
    { id:"ref-3", studentName:"Rahul Desai", referredBy:"Ravi Patel", referredTo:"Sneha Reddy", reason:"Social withdrawal concerns", status:"completed", createdAt:new Date(NOW-5*D).toISOString(), priority:"medium" },
    { id:"ref-4", studentName:"Aditya Mishra", referredBy:"Sunita O'Brien", referredTo:"Mohammed Iqbal", reason:"Emotional outbursts in class", status:"pending", createdAt:new Date(NOW-12*H).toISOString(), priority:"urgent" },
    { id:"ref-5", studentName:"Neha Gupta", referredBy:"Rajesh Kumar", referredTo:"Priya Sharma", reason:"Declining check-in scores", status:"accepted", createdAt:new Date(NOW-3*D).toISOString(), priority:"high" },
    { id:"ref-6", studentName:"Rohan Verma", referredBy:"Lakshmi Iyer", referredTo:"Dr. Anil Kumar", reason:"Bullying concerns", status:"pending", createdAt:new Date(NOW-6*H).toISOString(), priority:"urgent" },
  ] as T;

  if (basePath === "/crisis/incidents") return INCIDENTS as T;
  if (basePath === "/compliance/records") return [
    { id:"comp-1", guideline:"SC III: SEL and Counselling Systems", status:"compliant", lastReviewDate:new Date(NOW-15*D).toISOString(), nextReviewDate:new Date(NOW+15*D).toISOString(), notes:"All SEL modules implemented across grades 5-10." },
    { id:"comp-2", guideline:"SC IV: School Wellbeing Workflows", status:"partial", lastReviewDate:new Date(NOW-20*D).toISOString(), nextReviewDate:new Date(NOW+10*D).toISOString(), notes:"Need to finalize escalation matrix." },
    { id:"comp-3", guideline:"SC V: Crisis Escalation Protocols", status:"compliant", lastReviewDate:new Date(NOW-10*D).toISOString(), nextReviewDate:new Date(NOW+20*D).toISOString(), notes:"24/7 crisis team operational. Response under 15 min." },
    { id:"comp-4", guideline:"SC VIII: Case Management & Referrals", status:"compliant", lastReviewDate:new Date(NOW-5*D).toISOString(), nextReviewDate:new Date(NOW+25*D).toISOString(), notes:"All 124 cases have assigned counsellors." },
    { id:"comp-5", guideline:"SC IX: Safety & Monitoring Practices", status:"partial", lastReviewDate:new Date(NOW-25*D).toISOString(), nextReviewDate:new Date(NOW+5*D).toISOString(), notes:"Weekly monitoring reports pending." },
    { id:"comp-6", guideline:"SC X: Supportive Policy Infrastructure", status:"compliant", lastReviewDate:new Date(NOW-12*D).toISOString(), nextReviewDate:new Date(NOW+18*D).toISOString(), notes:"All policies in place and reviewed." },
    { id:"comp-7", guideline:"SC XII: Audit & Documentation", status:"non_compliant", lastReviewDate:new Date(NOW-30*D).toISOString(), nextReviewDate:new Date(NOW).toISOString(), notes:"Quarterly audit overdue - requires immediate attention." },
    { id:"comp-8", guideline:"SC XIV: Implementation Accountability", status:"partial", lastReviewDate:new Date(NOW-18*D).toISOString(), nextReviewDate:new Date(NOW+12*D).toISOString(), notes:"Need to assign accountability leads." },
  ] as T;

  if (basePath === "/notifications") return [
    { id:"n-1", type:"alert", title:"Critical: Ananya Reddy", message:"Self-harm ideation detected. Crisis protocol activated.", read:false, createdAt:new Date(NOW-20*60*1000).toISOString(), priority:"high" },
    { id:"n-2", type:"reminder", title:"Session notes pending (4)", message:"Complete notes from yesterday's sessions.", read:false, createdAt:new Date(NOW-H).toISOString(), priority:"medium" },
    { id:"n-3", type:"update", title:"Referral accepted", message:"Rahul Desai accepted by Sneha Reddy.", read:false, createdAt:new Date(NOW-2*H).toISOString(), priority:"low" },
    { id:"n-4", type:"alert", title:"Follow-up overdue", message:"Vikram Singh's session was due yesterday.", read:true, createdAt:new Date(NOW-D).toISOString(), priority:"medium" },
    { id:"n-5", type:"milestone", title:"5 students reached 30-day streak!", message:"Certificates ready for Grade 8.", read:true, createdAt:new Date(NOW-2*D).toISOString(), priority:"low" },
    { id:"n-6", type:"reminder", title:"SEL session at 2 PM", message:"Mindfulness & Focus for Grade 9-10.", read:false, createdAt:new Date(NOW-3*H).toISOString(), priority:"medium" },
    { id:"n-7", type:"update", title:"Compliance deadline approaching", message:"SC XII audit due in 5 days.", read:false, createdAt:new Date(NOW-4*H).toISOString(), priority:"high" },
    { id:"n-8", type:"milestone", title:"New guide available", message:"Supporting LGBTQ+ Students in Indian Schools.", read:true, createdAt:new Date(NOW-3*D).toISOString(), priority:"low" },
  ] as T;

  if (basePath === "/appointments") return [
    { id:"apt-1", title:"Crisis check-in: Ananya Reddy", date:new Date(NOW).toISOString(), time:"2:00 PM", studentName:"Ananya Reddy", type:"individual", status:"confirmed" },
    { id:"apt-2", title:"Tier 2 follow-up: Vikram Singh", date:new Date(NOW).toISOString(), time:"3:30 PM", studentName:"Vikram Singh", type:"individual", status:"confirmed" },
    { id:"apt-3", title:"Intervention review: Karan Mehta", date:new Date(NOW+D).toISOString(), time:"10:00 AM", studentName:"Karan Mehta", type:"individual", status:"confirmed" },
    { id:"apt-4", title:"Group SEL: Grade 7", date:new Date(NOW+D).toISOString(), time:"1:00 PM", studentName:"Grade 7 Group", type:"group", status:"confirmed" },
    { id:"apt-5", title:"Parent consultation: Aryan J.", date:new Date(NOW+2*D).toISOString(), time:"11:00 AM", studentName:"Mrs. Anita Joshi", type:"consultation", status:"pending" },
    { id:"apt-6", title:"Assessment: Isha Kapoor", date:new Date(NOW+2*D).toISOString(), time:"2:30 PM", studentName:"Isha Kapoor", type:"assessment", status:"confirmed" },
    { id:"apt-7", title:"Follow-up: Rahul Desai", date:new Date(NOW-D).toISOString(), time:"9:30 AM", studentName:"Rahul Desai", type:"individual", status:"completed" },
    { id:"apt-8", title:"Group therapy", date:new Date(NOW-D).toISOString(), time:"1:00 PM", studentName:"Social Skills Group", type:"group", status:"completed" },
    { id:"apt-9", title:"Career guidance: Ravi Yadav", date:new Date(NOW+3*D).toISOString(), time:"4:00 PM", studentName:"Ravi Yadav", type:"career", status:"confirmed" },
    { id:"apt-10", title:"SEL planning meeting", date:new Date(NOW+4*D).toISOString(), time:"10:30 AM", studentName:"Grade 5-6 Teachers", type:"meeting", status:"confirmed" },
  ] as T;

  if (basePath === "/screenings") return [
    { id:"scr-1", studentName:"Arjun Patel", grade:"8", type:"SDQ (Strengths & Difficulties)", status:"completed", score:84, riskLevel:"HIGH", date:new Date(NOW-D).toISOString(), completedBy:"Priya Sharma" },
    { id:"scr-2", studentName:"Priya Sharma", grade:"10", type:"Wellbeing Check-in", status:"in_progress", date:new Date().toISOString() },
    { id:"scr-3", studentName:"Ananya Reddy", grade:"9", type:"Crisis Assessment", status:"flagged", score:91, riskLevel:"CRITICAL", date:new Date(NOW-H).toISOString(), completedBy:"Priya Sharma" },
    { id:"scr-4", studentName:"Rohan Verma", grade:"7", type:"SDQ", status:"pending", date:new Date(NOW+D).toISOString() },
    { id:"scr-5", studentName:"Vikram Singh", grade:"6", type:"Behaviour Screen", status:"completed", score:48, riskLevel:"MEDIUM", date:new Date(NOW-2*D).toISOString(), completedBy:"Dr. Anil Kumar" },
    { id:"scr-6", studentName:"Kavya Nair", grade:"5", type:"Wellbeing Check-in", status:"pending", date:new Date(NOW+2*D).toISOString() },
    { id:"scr-7", studentName:"Rahul Desai", grade:"7", type:"Anxiety Screen (SCARED)", status:"completed", score:58, riskLevel:"MEDIUM", date:new Date(NOW-3*D).toISOString(), completedBy:"Sneha Reddy" },
    { id:"scr-8", studentName:"Aditya Mishra", grade:"6", type:"Behaviour Screen", status:"in_progress", date:new Date().toISOString() },
    { id:"scr-9", studentName:"Aryan Joshi", grade:"8", type:"Anger Assessment", status:"completed", score:76, riskLevel:"HIGH", date:new Date(NOW-4*D).toISOString(), completedBy:"Mohammed Iqbal" },
    { id:"scr-10", studentName:"Neha Gupta", grade:"5", type:"Wellbeing Check-in", status:"completed", score:25, riskLevel:"LOW", date:new Date(NOW-D).toISOString(), completedBy:"Priya Sharma" },
  ] as T;

  if (basePath === "/audit-logs") return [
    { id:"a-1", action:"Case Created", actor:"Priya Sharma", target:"Case #124 - Ananya Reddy", category:"case", severity:"info", details:"Crisis case opened for Ananya Reddy", timestamp:Date.now()-900000, ipAddress:"192.168.1.100" },
    { id:"a-2", action:"Risk Level Updated", actor:"AI Risk Engine", target:"Arjun Patel", category:"student", severity:"warning", details:"Score auto-escalated 62→84", timestamp:Date.now()-1800000, ipAddress:"internal" },
    { id:"a-3", action:"User Login", actor:"admin@firefly.local", target:"Admin Console", category:"auth", severity:"info", details:"Login from new device", timestamp:Date.now()-2700000, ipAddress:"203.0.113.42" },
    { id:"a-4", action:"Permission Modified", actor:"Karan Joshi", target:"RBAC: Counsellor Role", category:"config", severity:"warning", details:"Added crisis.escalate permission", timestamp:Date.now()-7200000, ipAddress:"192.168.1.1" },
    { id:"a-5", action:"Crisis Activated", actor:"Priya Sharma", target:"Crisis: Ananya Reddy", category:"crisis", severity:"critical", details:"SC V protocol activated", timestamp:Date.now()-3600000, ipAddress:"192.168.1.100" },
    { id:"a-6", action:"Consent Granted", actor:"Anita Desai", target:"Consent - Arjun Patel", category:"config", severity:"info", details:"Tier 3 consent signed", timestamp:Date.now()-10800000, ipAddress:"10.0.0.15" },
    { id:"a-7", action:"Referral Created", actor:"Rajesh Kumar", target:"Aditya Mishra", category:"case", severity:"info", details:"Referred for anxiety concerns", timestamp:Date.now()-14400000, ipAddress:"192.168.1.50" },
    { id:"a-8", action:"Data Export", actor:"Aarav Mehta", target:"Q4 Analytics", category:"config", severity:"warning", details:"Exported 124 case records", timestamp:Date.now()-86400000, ipAddress:"203.0.113.100" },
  ] as T;

  throw new Error(`No mock data for: ${url}`);
}