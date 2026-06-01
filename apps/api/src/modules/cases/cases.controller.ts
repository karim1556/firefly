import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../middlewares/error.middleware";
import { CASE_STATUS_VALUES, CASE_TYPE_VALUES, RISK_LEVEL_VALUES, TIER_VALUES } from "../../types/domain";

const caseParamsSchema = z.object({
  caseId: z.string().uuid()
});

const listCasesQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(CASE_STATUS_VALUES).optional(),
  tier: z.enum(TIER_VALUES).optional(),
  riskLevel: z.enum(RISK_LEVEL_VALUES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10)
});

const createCaseBodySchema = z.object({
  studentId: z.string().uuid(),
  assignedCounsellorId: z.string().uuid().optional(),
  title: z.string().min(3).max(180),
  summary: z.string().max(2000).optional(),
  tier: z.enum(TIER_VALUES),
  type: z.enum(CASE_TYPE_VALUES),
  riskLevel: z.enum(RISK_LEVEL_VALUES)
});

const timelineBodySchema = z.object({
  eventType: z.string().min(2).max(40),
  title: z.string().min(3).max(120),
  description: z.string().min(3).max(2000),
  metadata: z.record(z.unknown()).optional()
});

export async function listCases(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listCasesQuerySchema.parse(req.query);

    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { student: { firstName: { contains: query.search, mode: "insensitive" } } },
        { student: { lastName: { contains: query.search, mode: "insensitive" } } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.tier) {
      where.tier = query.tier;
    }

    if (query.riskLevel) {
      where.riskLevel = query.riskLevel;
    }

    const skip = (query.page - 1) * query.pageSize;

    const [total, data] = await Promise.all([
      prisma.case.count({ where }),
      prisma.case.findMany({
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
          assignedCounsellor: {
            select: {
              id: true,
              fullName: true
            }
          },
          _count: {
            select: {
              sessions: true,
              timelineEvents: true
            }
          }
        },
        orderBy: {
          openedAt: "desc"
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

export async function getCaseById(req: Request, res: Response, next: NextFunction) {
  try {
    const { caseId } = caseParamsSchema.parse(req.params);

    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        student: true,
        assignedCounsellor: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        timelineEvents: {
          include: {
            createdBy: {
              select: {
                id: true,
                fullName: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: "asc"
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

    if (!caseRecord) {
      throw new ApiError(404, "Case not found");
    }

    return res.status(200).json(caseRecord);
  } catch (error) {
    return next(error);
  }
}

export async function createCase(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const body = createCaseBodySchema.parse(req.body);

    const student = await prisma.student.findUnique({
      where: {
        id: body.studentId
      }
    });

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    const createdCase = await prisma.case.create({
      data: {
        studentId: body.studentId,
        openedById: req.user.id,
        assignedCounsellorId: body.assignedCounsellorId,
        title: body.title,
        summary: body.summary,
        tier: body.tier,
        type: body.type,
        riskLevel: body.riskLevel,
        timelineEvents: {
          create: {
            createdById: req.user.id,
            eventType: "case_opened",
            title: "Case Opened",
            description: "Case created and queued for interventions."
          }
        }
      },
      include: {
        student: true,
        assignedCounsellor: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    return res.status(201).json(createdCase);
  } catch (error) {
    return next(error);
  }
}

export async function addTimelineEvent(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const { caseId } = caseParamsSchema.parse(req.params);
    const body = timelineBodySchema.parse(req.body);

    const existingCase = await prisma.case.findUnique({
      where: {
        id: caseId
      }
    });

    if (!existingCase) {
      throw new ApiError(404, "Case not found");
    }

    const timelineEvent = await prisma.caseTimelineEvent.create({
      data: {
        caseId,
        createdById: req.user.id,
        eventType: body.eventType,
        title: body.title,
        description: body.description,
        metadata: body.metadata as any
      }
    });

    return res.status(201).json(timelineEvent);
  } catch (error) {
    return next(error);
  }
}

export async function closeCase(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const { caseId } = caseParamsSchema.parse(req.params);

    const existingCase = await prisma.case.findUnique({
      where: {
        id: caseId
      }
    });

    if (!existingCase) {
      throw new ApiError(404, "Case not found");
    }

    if (existingCase.status === "CLOSED") {
      throw new ApiError(400, "Case is already closed");
    }

    const updatedCase = await prisma.case.update({
      where: {
        id: caseId
      },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
        timelineEvents: {
          create: {
            createdById: req.user.id,
            eventType: "case_closed",
            title: "Case Closed",
            description: "Case closure approved and interventions completed."
          }
        }
      }
    });

    return res.status(200).json(updatedCase);
  } catch (error) {
    return next(error);
  }
}
