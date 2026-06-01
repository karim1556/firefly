import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../middlewares/error.middleware";
import { INCIDENT_SEVERITY_VALUES } from "../../types/domain";

const listIncidentsQuerySchema = z.object({
  severity: z.enum(INCIDENT_SEVERITY_VALUES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10)
});

const createIncidentBodySchema = z.object({
  studentId: z.string().uuid().optional(),
  caseId: z.string().uuid().optional(),
  severity: z.enum(INCIDENT_SEVERITY_VALUES),
  incidentType: z.string().min(3).max(120),
  description: z.string().min(3).max(2000),
  actionTaken: z.string().min(3).max(2000)
});

export async function listIncidents(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listIncidentsQuerySchema.parse(req.query);
    const skip = (query.page - 1) * query.pageSize;

    const where = {
      severity: query.severity
    };

    const [total, data] = await Promise.all([
      prisma.incident.count({ where }),
      prisma.incident.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              grade: true,
              classroom: true
            }
          },
          case: {
            select: {
              id: true,
              title: true,
              tier: true,
              riskLevel: true
            }
          },
          reportedBy: {
            select: {
              id: true,
              fullName: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: query.pageSize
      })
    ]);

    return res.status(200).json({
      data,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize)
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function createIncident(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const body = createIncidentBodySchema.parse(req.body);

    const incident = await prisma.incident.create({
      data: {
        studentId: body.studentId,
        caseId: body.caseId,
        severity: body.severity,
        incidentType: body.incidentType,
        description: body.description,
        actionTaken: body.actionTaken,
        reportedById: req.user.id
      }
    });

    return res.status(201).json(incident);
  } catch (error) {
    return next(error);
  }
}
