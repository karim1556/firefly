import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../middlewares/error.middleware";
import { SESSION_STATUS_VALUES } from "../../types/domain";

const listSessionsQuerySchema = z.object({
  status: z.enum(SESSION_STATUS_VALUES).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  studentId: z.string().uuid().optional(),
  counsellorId: z.string().uuid().optional(),
  view: z.enum(["list", "calendar"]).default("list"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10)
});

const createSessionBodySchema = z.object({
  caseId: z.string().uuid().optional(),
  studentId: z.string().uuid(),
  counsellorId: z.string().uuid(),
  title: z.string().min(3).max(120),
  notes: z.string().max(2000).optional(),
  scheduledAt: z.string().datetime(),
  durationMins: z.coerce.number().int().min(15).max(180).default(45),
  status: z.enum(SESSION_STATUS_VALUES).default("SCHEDULED")
});

export async function listSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listSessionsQuerySchema.parse(req.query);

    const where: any = {
      status: query.status,
      studentId: query.studentId,
      counsellorId: query.counsellorId,
      scheduledAt: {
        gte: query.from ? new Date(query.from) : undefined,
        lte: query.to ? new Date(query.to) : undefined
      }
    };

    const skip = (query.page - 1) * query.pageSize;

    const [total, data] = await Promise.all([
      prisma.session.count({ where }),
      prisma.session.findMany({
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
          counsellor: {
            select: {
              id: true,
              fullName: true
            }
          },
          case: {
            select: {
              id: true,
              title: true,
              riskLevel: true,
              tier: true
            }
          }
        },
        orderBy: {
          scheduledAt: "asc"
        },
        skip,
        take: query.pageSize
      })
    ]);

    if (query.view === "calendar") {
      const groupedByDate: Record<string, typeof data> = {};

      for (const session of data) {
        const key = session.scheduledAt.toISOString().slice(0, 10);

        if (!groupedByDate[key]) {
          groupedByDate[key] = [];
        }

        groupedByDate[key].push(session);
      }

      return res.status(200).json({
        data: groupedByDate,
        pagination: {
          page: query.page,
          pageSize: query.pageSize,
          total,
          totalPages: Math.ceil(total / query.pageSize)
        }
      });
    }

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

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createSessionBodySchema.parse(req.body);

    const [student, counsellor] = await Promise.all([
      prisma.student.findUnique({ where: { id: body.studentId } }),
      prisma.user.findUnique({ where: { id: body.counsellorId } })
    ]);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    if (!counsellor) {
      throw new ApiError(404, "Counsellor not found");
    }

    const session = await prisma.session.create({
      data: {
        caseId: body.caseId,
        studentId: body.studentId,
        counsellorId: body.counsellorId,
        title: body.title,
        notes: body.notes,
        scheduledAt: new Date(body.scheduledAt),
        durationMins: body.durationMins,
        status: body.status
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        counsellor: {
          select: {
            fullName: true
          }
        }
      }
    });

    return res.status(201).json(session);
  } catch (error) {
    return next(error);
  }
}
