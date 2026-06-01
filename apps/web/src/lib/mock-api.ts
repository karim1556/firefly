/* eslint-disable @typescript-eslint/no-unused-vars */
// Mock API helpers for development
import type { AuthUser, Role, DashboardOverview } from "@/lib/types";

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

const ROLE_NAMES: Record<Role, string> = {
  ADMIN: "Platform Admin",
  COUNSELLOR: "Rebecca Thompson",
  TEACHER: "Mr. David Chen",
  PARENT: "Sarah Thompson",
  STUDENT: "Alex Thompson",
  FIREFLY_REPRESENTATIVE: "Firefly Rep",
  FIREFLY_SPECIALIST: "Firefly Specialist",
  SYSTEM_ADMIN: "System Admin"
};

export function mockLogin(email: string, password: string): { accessToken: string; refreshToken: string; user: AuthUser } {
  const role = ROLE_BY_EMAIL[email] ?? ("ADMIN" as Role);
  return {
    accessToken: `mock_access_token_${role}`,
    refreshToken: `mock_refresh_token_${role}`,
    user: { id: `mock-user-${role}`, email, fullName: ROLE_NAMES[role], role }
  };
}

export function mockRefresh(refreshToken: string): { accessToken: string; refreshToken: string } {
  return {
    accessToken: "mock_access_token",
    refreshToken: "mock_refresh_token"
  };
}

// Role-specific mock dashboards
const MOCK_DASHBOARDS: Record<string, DashboardOverview> = {
  ADMIN: {
    kpis: {
      totalStudents: 847,
      activeCases: 124,
      tier2Students: 58,
      tier3Alerts: 19
    },
    tierDistribution: [
      { tier: "Tier 1", value: 670 },
      { tier: "Tier 2", value: 124 },
      { tier: "Tier 3", value: 53 }
    ],
    activityTrends: [
      { label: "Mon", count: 12 },
      { label: "Tue", count: 18 },
      { label: "Wed", count: 25 },
      { label: "Thu", count: 15 },
      { label: "Fri", count: 30 },
      { label: "Sat", count: 8 },
      { label: "Sun", count: 5 }
    ],
    recentAlerts: [
      {
        id: "alert-1",
        severity: "CRITICAL",
        title: "Self-harm indicator detected",
        description: "Student Jane Doe's recent check-in response indicates self-harm ideation.",
        actionTaken: "Immediate intervention initiated.",
        studentName: "Jane Doe",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: "alert-2",
        severity: "HIGH",
        title: "Missed counselling session (3rd occurrence)",
        description: "Student Alex Smith missed their third consecutive weekly session.",
        actionTaken: "Reaching out to guardians.",
        studentName: "Alex Smith",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      },
      {
        id: "alert-3",
        severity: "MODERATE",
        title: "Peer conflict escalation",
        description: "Multiple reports of bullying involving student Sam Wilson.",
        actionTaken: "Mediation session scheduled.",
        studentName: "Sam Wilson",
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
      }
    ],
    activityFeed: [
      {
        id: "feed-1",
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        type: "SESSION_COMPLETED",
        title: "Counselling session completed",
        subtitle: "Jane Doe completed a Tier 3 intervention session."
      },
      {
        id: "feed-2",
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        type: "CASE_UPDATED",
        title: "Case risk level updated",
        subtitle: "Alex Smith's case escalated from MEDIUM to HIGH."
      },
      {
        id: "feed-3",
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        type: "ASSESSMENT_SUBMITTED",
        title: "Wellbeing assessment submitted",
        subtitle: "Sam Wilson completed a Tier 2 wellbeing check-in."
      },
      {
        id: "feed-4",
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        type: "REPORT_GENERATED",
        title: "Weekly report generated",
        subtitle: "Classroom 5B weekly wellbeing report is ready for review."
      }
    ]
  },

  COUNSELLOR: {
    kpis: {
      totalStudents: 847,
      activeCases: 38,
      tier2Students: 22,
      tier3Alerts: 12
    },
    tierDistribution: [
      { tier: "Active Cases", value: 38 },
      { tier: "Scheduled Today", value: 14 },
      { tier: "Overdue Follow-up", value: 6 }
    ],
    activityTrends: [
      { label: "Mon", count: 8 },
      { label: "Tue", count: 12 },
      { label: "Wed", count: 15 },
      { label: "Thu", count: 10 },
      { label: "Fri", count: 18 },
      { label: "Sat", count: 3 },
      { label: "Sun", count: 0 }
    ],
    recentAlerts: [
      {
        id: "c-alert-1",
        severity: "CRITICAL",
        title: "Crisis intervention required",
        description: "Student Emily Clarke expressed suicidal ideation during check-in.",
        actionTaken: "Crisis team notified, parent contacted.",
        studentName: "Emily Clarke",
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
      },
      {
        id: "c-alert-2",
        severity: "HIGH",
        title: "No-show for intervention session",
        description: "Student Michael Brown missed scheduled Tier 2 intervention.",
        actionTaken: "Rescheduled for tomorrow.",
        studentName: "Michael Brown",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: "c-alert-3",
        severity: "HIGH",
        title: "Counselling notes overdue",
        description: "You have 4 session notes pending review from yesterday.",
        actionTaken: "Please complete before next supervision.",
        studentName: "Multiple students",
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
      }
    ],
    activityFeed: [
      {
        id: "c-feed-1",
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        type: "SESSION_COMPLETED",
        title: "Tier 2 group session completed",
        subtitle: "Social skills group — 6 students attended, 2 absent."
      },
      {
        id: "c-feed-2",
        createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        type: "INTERVENTION_CREATED",
        title: "New intervention plan created",
        subtitle: "Behavioural support plan initiated for Lucas Green."
      },
      {
        id: "c-feed-3",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        type: "ASSESSMENT_COMPLETED",
        title: "SDQ assessment completed",
        subtitle: "Student Sophia Lee completed Strengths and Difficulties Questionnaire."
      },
      {
        id: "c-feed-4",
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        type: "REFERRAL_RECEIVED",
        title: "New teacher referral received",
        subtitle: "Student Oliver Wang referred for anxiety-related concerns."
      }
    ]
  },

  TEACHER: {
    kpis: {
      totalStudents: 32,
      activeCases: 5,
      tier2Students: 3,
      tier3Alerts: 2
    },
    tierDistribution: [
      { tier: "Stable", value: 24 },
      { tier: "Needs Support", value: 5 },
      { tier: "Needs Intervention", value: 3 }
    ],
    activityTrends: [
      { label: "Mon", count: 3 },
      { label: "Tue", count: 5 },
      { label: "Wed", count: 7 },
      { label: "Thu", count: 4 },
      { label: "Fri", count: 6 },
      { label: "Sat", count: 1 },
      { label: "Sun", count: 0 }
    ],
    recentAlerts: [
      {
        id: "t-alert-1",
        severity: "HIGH",
        title: "Classroom behaviour concern",
        description: "Student Jake Martinez showing aggression during group activities — 3 incidents this week.",
        actionTaken: "Referred to counselling team.",
        studentName: "Jake Martinez",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: "t-alert-2",
        severity: "MODERATE",
        title: "Academic decline correlated to wellbeing",
        description: "Student Lily Chen's grades dropped 20% alongside decreased check-in scores.",
        actionTaken: "Discuss in parent-teacher meeting.",
        studentName: "Lily Chen",
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
      },
      {
        id: "t-alert-3",
        severity: "LOW",
        title: "Attendance concern",
        description: "Student Ryan Park has missed 4 days this month, pattern emerging.",
        actionTaken: "Flagged for attendance review.",
        studentName: "Ryan Park",
        createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString()
      }
    ],
    activityFeed: [
      {
        id: "t-feed-1",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        type: "CHECK_IN_COMPLETED",
        title: "Weekly check-in completed by 28/32 students",
        subtitle: "4 students pending — send reminder in class."
      },
      {
        id: "t-feed-2",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        type: "FLAG_RAISED",
        title: "Wellbeing flag raised for 2 students",
        subtitle: "Emma Wilson and Noah Garcia flagged for declining scores."
      },
      {
        id: "t-feed-3",
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        type: "REPORT_READY",
        title: "Classroom wellbeing snapshot generated",
        subtitle: "Your homeroom (5B) monthly report is ready to review."
      },
      {
        id: "t-feed-4",
        createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        type: "REFERRAL_APPROVED",
        title: "Referral approved — Tier 2 support",
        subtitle: "Ava Johnson's referral for SEL group intervention was approved."
      }
    ]
  },

  PARENT: {
    kpis: {
      totalStudents: 2,
      activeCases: 1,
      tier2Students: 1,
      tier3Alerts: 0
    },
    tierDistribution: [
      { tier: "Wellbeing Score", value: 78 },
      { tier: "Attendance", value: 92 },
      { tier: "Engagement", value: 65 }
    ],
    activityTrends: [
      { label: "Mon", count: 4 },
      { label: "Tue", count: 3 },
      { label: "Wed", count: 5 },
      { label: "Thu", count: 2 },
      { label: "Fri", count: 4 },
      { label: "Sat", count: 1 },
      { label: "Sun", count: 0 }
    ],
    recentAlerts: [
      {
        id: "p-alert-1",
        severity: "MODERATE",
        title: "Your child's wellbeing score decreased",
        description: "Alex's check-in scores dropped from 82 to 65 this week. A counsellor may reach out.",
        actionTaken: "No action needed — monitoring in progress.",
        studentName: "Alex Thompson",
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
      },
      {
        id: "p-alert-2",
        severity: "LOW",
        title: "Upcoming parent-teacher conference",
        description: "A wellbeing check-in meeting is scheduled for next Thursday.",
        actionTaken: "Please confirm your availability.",
        studentName: "Alex Thompson",
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
      }
    ],
    activityFeed: [
      {
        id: "p-feed-1",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        type: "REPORT_SHARED",
        title: "Weekly wellbeing report shared",
        subtitle: "Alex's weekly wellbeing summary is now available in Reports."
      },
      {
        id: "p-feed-2",
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        type: "CHECK_IN_COMPLETED",
        title: "Daily check-in completed",
        subtitle: "Alex completed their morning check-in — feeling 'okay' today."
      },
      {
        id: "p-feed-3",
        createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        type: "SESSION_SCHEDULED",
        title: "Counselling session scheduled",
        subtitle: "A check-in session has been scheduled for Friday at 3 PM."
      },
      {
        id: "p-feed-4",
        createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
        type: "RESOURCE_SHARED",
        title: "New resource available",
        subtitle: "Guide: 'Supporting your child's mental health at home' added to resources."
      }
    ]
  },

  STUDENT: {
    kpis: {
      totalStudents: 1,
      activeCases: 1,
      tier2Students: 0,
      tier3Alerts: 0
    },
    tierDistribution: [
      { tier: "Check-in Streak", value: 12 },
      { tier: "Sessions This Month", value: 4 },
      { tier: "Goals Met", value: 3 }
    ],
    activityTrends: [
      { label: "Mon", count: 7 },
      { label: "Tue", count: 6 },
      { label: "Wed", count: 8 },
      { label: "Thu", count: 5 },
      { label: "Fri", count: 7 },
      { label: "Sat", count: 3 },
      { label: "Sun", count: 2 }
    ],
    recentAlerts: [
      {
        id: "s-alert-1",
        severity: "LOW",
        title: "Check-in reminder",
        description: "You haven't completed your daily check-in yet. It only takes 2 minutes!",
        actionTaken: "",
        studentName: "You",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: "s-alert-2",
        severity: "LOW",
        title: "Upcoming session tomorrow",
        description: "You have a check-in with Ms. Rebecca Thompson at 2:30 PM tomorrow.",
        actionTaken: "",
        studentName: "You",
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
      }
    ],
    activityFeed: [
      {
        id: "s-feed-1",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        type: "RESOURCE_VIEWED",
        title: "You viewed 'Managing exam stress'",
        subtitle: "This resource has helped 45 other students this month."
      },
      {
        id: "s-feed-2",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        type: "GOAL_ACHIEVED",
        title: "Goal achieved!",
        subtitle: "You completed your mindfulness goal for this week — great work!"
      },
      {
        id: "s-feed-3",
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        type: "SESSION_COMPLETED",
        title: "Counselling session completed",
        subtitle: "Your last session was about building healthy routines."
      },
      {
        id: "s-feed-4",
        createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
        type: "MILESTONE",
        title: "12-day check-in streak!",
        subtitle: "You've checked in every day for 12 days — keep it up!"
      }
    ]
  }
};

export async function mockRequest<T>(url: string, init?: RequestInit, user?: AuthUser | null): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (url === "/dashboard/overview") {
    const role = user?.role ?? "ADMIN";
    const data = MOCK_DASHBOARDS[role] ?? MOCK_DASHBOARDS.ADMIN;
    return data as T;
  }

  throw new Error(`No mock data for: ${url}`);
}