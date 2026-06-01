import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../middlewares/error.middleware";
import { TIER_VALUES } from "../../types/domain";

const listStudentsQuerySchema = z.object({
  search: z.string().optional(),
  tier: z.enum(TIER_VALUES).optional(),
  grade: z.string().optional(),
  classroom: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10)
});

const studentParamsSchema = z.object({
  studentId: z.string().uuid()
});

export async function listStudents(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listStudentsQuerySchema.parse(req.query);

    const where: any = {};

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
        { admissionNumber: { contains: query.search, mode: "insensitive" } }
      ];
    }

    if (query.tier) {
      where.tier = query.tier;
    }

    if (query.grade) {
      where.grade = query.grade;
    }

    if (query.classroom) {
      where.classroom = query.classroom;
    }

    const skip = (query.page - 1) * query.pageSize;

    const [total, data] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        include: {
          counsellor: {
            select: {
              id: true,
              fullName: true
            }
          },
          _count: {
            select: {
              cases: true,
              assessments: true
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

export async function getStudentById(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = studentParamsSchema.parse(req.params);

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        counsellor: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        assessments: {
          orderBy: {
            createdAt: "desc"
          }
        },
        cases: {
          include: {
            assignedCounsellor: {
              select: {
                id: true,
                fullName: true
              }
            },
            timelineEvents: {
              orderBy: {
                createdAt: "desc"
              },
              take: 3
            }
          },
          orderBy: {
            openedAt: "desc"
          }
        },
        sessions: {
          include: {
            counsellor: {
              select: {
                id: true,
                fullName: true
              }
            }
          },
          orderBy: {
            scheduledAt: "desc"
          }
        },
        incidents: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    const assessmentTrend = [...student.assessments]
      .reverse()
      .map((assessment) => ({
        id: assessment.id,
        score: assessment.score,
        riskLevel: assessment.riskLevel,
        createdAt: assessment.createdAt
      }));

    return res.status(200).json({
      ...student,
      assessmentTrend
    });
  } catch (error) {
    return next(error);
  }
}
