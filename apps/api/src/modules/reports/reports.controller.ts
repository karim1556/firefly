import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma";

export async function getWellbeingReport(_req: Request, res: Response, next: NextFunction) {
  try {
    const [studentStatus, studentTier, casesByStatus, casesByType, incidentsBySeverity] = await Promise.all([
      prisma.student.groupBy({
        by: ["status"],
        _count: {
          status: true
        }
      }),
      prisma.student.groupBy({
        by: ["tier"],
        _count: {
          tier: true
        }
      }),
      prisma.case.groupBy({
        by: ["status"],
        _count: {
          status: true
        }
      }),
      prisma.case.groupBy({
        by: ["type"],
        _count: {
          type: true
        }
      }),
      prisma.incident.groupBy({
        by: ["severity"],
        _count: {
          severity: true
        }
      })
    ]);

    return res.status(200).json({
      studentStatus,
      studentTier,
      casesByStatus,
      casesByType,
      incidentsBySeverity,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    return next(error);
  }
}

export async function getComplianceReport(_req: Request, res: Response, next: NextFunction) {
  try {
    const [activeCases, incidentCount, sessionsCount] = await Promise.all([
      prisma.case.count({
        where: {
          status: {
            in: ["OPEN", "IN_PROGRESS", "ON_HOLD"]
          }
        }
      }),
      prisma.incident.count(),
      prisma.session.count()
    ]);

    return res.status(200).json({
      supremeCourtGuidelines: [
        { code: "SC III", title: "SEL and counselling systems", status: "in_progress" },
        { code: "SC IV", title: "School wellbeing workflows", status: "in_progress" },
        { code: "SC V", title: "Crisis escalation protocols", status: "active" },
        { code: "SC VIII", title: "Case management and referrals", status: "active" },
        { code: "SC IX", title: "Safety and monitoring practices", status: "active" },
        { code: "SC X", title: "Supportive policy infrastructure", status: "in_progress" },
        { code: "SC XII", title: "Audit and documentation", status: "active" },
        { code: "SC XIV", title: "Implementation accountability", status: "in_progress" }
      ],
      metrics: {
        activeCases,
        incidentCount,
        sessionsCount
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    return next(error);
  }
}
