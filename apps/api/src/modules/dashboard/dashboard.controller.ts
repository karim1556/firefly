import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma";
import type { TierValue } from "../../types/domain";

function getTierCount(rows: Array<{ tier: TierValue; _count: { tier: number } }>, tier: TierValue) {
  return rows.find((row) => row.tier === tier)?._count.tier ?? 0;
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDashboardOverview(_req: Request, res: Response, next: NextFunction) {
  try {
    const now = new Date();
    const trendWindowStart = new Date(now);
    trendWindowStart.setDate(trendWindowStart.getDate() - 56);

    const [
      totalStudents,
      activeCases,
      tier2Students,
      tier3Alerts,
      tierDistribution,
      recentIncidents,
      timelineEvents,
      latestSessions,
      recentTrendSessions
    ] = await Promise.all([
      prisma.student.count(),
      prisma.case.count({
        where: {
          status: {
            in: ["OPEN", "IN_PROGRESS", "ON_HOLD"]
          }
        }
      }),
      prisma.student.count({ where: { tier: "TIER_2" } }),
      prisma.case.count({
        where: {
          tier: "TIER_3",
          status: {
            not: "CLOSED"
          }
        }
      }),
      prisma.student.groupBy({
        by: ["tier"],
        _count: {
          tier: true
        }
      }),
      prisma.incident.findMany({
        where: {
          severity: {
            in: ["HIGH", "CRITICAL"]
          }
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5
      }),
      prisma.caseTimelineEvent.findMany({
        include: {
          case: {
            select: {
              title: true
            }
          },
          createdBy: {
            select: {
              fullName: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 10
      }),
      prisma.session.findMany({
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          scheduledAt: "desc"
        },
        take: 10
      }),
      prisma.session.findMany({
        where: {
          createdAt: {
            gte: trendWindowStart
          }
        },
        select: {
          createdAt: true
        }
      })
    ]);

    const weeklyBuckets = Array.from({ length: 8 }, (_, index) => {
      const weekStart = startOfWeek(new Date(now.getTime() - (7 - index) * 7 * 24 * 60 * 60 * 1000));
      return {
        label: weekStart.toISOString().slice(0, 10),
        count: 0
      };
    });

    for (const row of recentTrendSessions) {
      const rowWeek = startOfWeek(row.createdAt).toISOString().slice(0, 10);
      const bucket = weeklyBuckets.find((entry) => entry.label === rowWeek);
      if (bucket) {
        bucket.count += 1;
      }
    }

    const recentAlerts = recentIncidents.map((incident: any) => ({
      id: incident.id,
      severity: incident.severity,
      title: incident.incidentType,
      description: incident.description,
      actionTaken: incident.actionTaken,
      studentName: incident.student ? `${incident.student.firstName} ${incident.student.lastName}` : "Unassigned",
      createdAt: incident.createdAt
    }));

    const activityFeed = [
      ...timelineEvents.map((event: any) => ({
        id: `timeline-${event.id}`,
        createdAt: event.createdAt,
        type: event.eventType,
        title: event.title,
        subtitle: `${event.case.title} • ${event.createdBy.fullName}`
      })),
      ...latestSessions.map((session: any) => ({
        id: `session-${session.id}`,
        createdAt: session.scheduledAt,
        type: "session",
        title: session.title,
        subtitle: `${session.student.firstName} ${session.student.lastName} • ${session.status}`
      }))
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 12);

    return res.status(200).json({
      kpis: {
        totalStudents,
        activeCases,
        tier2Students,
        tier3Alerts
      },
      tierDistribution: [
        { tier: "Tier 1", value: getTierCount(tierDistribution, "TIER_1") },
        { tier: "Tier 2", value: getTierCount(tierDistribution, "TIER_2") },
        { tier: "Tier 3", value: getTierCount(tierDistribution, "TIER_3") }
      ],
      activityTrends: weeklyBuckets,
      recentAlerts,
      activityFeed
    });
  } catch (error) {
    return next(error);
  }
}
