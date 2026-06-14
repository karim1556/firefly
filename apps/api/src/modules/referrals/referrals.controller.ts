import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../middlewares/error.middleware";
import {
  REFERRAL_STATUS_VALUES,
  PRIORITY_VALUES,
  APPROVAL_STATUS_VALUES,
  MILESTONE_STATUS_VALUES,
  FOLLOWUP_STATUS_VALUES
} from "../../types/domain";

const referralParamsSchema = z.object({
  referralId: z.string().uuid()
});

const practitionerParamsSchema = z.object({
  practitionerId: z.string().uuid()
});

const milestoneParamsSchema = z.object({
  referralId: z.string().uuid(),
  milestoneId: z.string().uuid()
});

const followUpParamsSchema = z.object({
  referralId: z.string().uuid(),
  followUpId: z.string().uuid()
});

const listReferralsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(REFERRAL_STATUS_VALUES).optional(),
  priority: z.enum(PRIORITY_VALUES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10)
});

const listPractitionersQuerySchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  specialty: z.string().optional(),
  experience: z.string().optional(),
  consultationMode: z.string().optional(),
  language: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12)
});

const createReferralBodySchema = z.object({
  studentId: z.string().uuid(),
  practitionerId: z.string().uuid(),
  priority: z.enum(PRIORITY_VALUES).default("MEDIUM"),
  concernCategory: z.string().min(2).max(100),
  reason: z.string().min(3).max(2000),
  notes: z.string().max(2000).optional()
});

const updateStatusBodySchema = z.object({
  status: z.enum(REFERRAL_STATUS_VALUES)
});

const parentApprovalBodySchema = z.object({
  approved: z.boolean(),
  notes: z.string().max(500).optional()
});

const timelineBodySchema = z.object({
  eventType: z.string().min(2).max(40),
  title: z.string().min(3).max(120),
  description: z.string().min(3).max(2000),
  metadata: z.record(z.unknown()).optional()
});

const communicationBodySchema = z.object({
  authorName: z.string().min(2).max(100),
  authorRole: z.string().min(2).max(50),
  message: z.string().min(3).max(2000),
  attachmentUrl: z.string().url().optional().or(z.literal(""))
});

const milestoneBodySchema = z.object({
  milestoneType: z.string().min(2).max(100),
  dueDate: z.string().datetime().optional(),
  notes: z.string().max(500).optional()
});

const updateMilestoneBodySchema = z.object({
  status: z.enum(MILESTONE_STATUS_VALUES),
  notes: z.string().max(500).optional(),
  completedAt: z.string().datetime().optional()
});

const followUpBodySchema = z.object({
  scheduledAt: z.string().datetime(),
  notes: z.string().max(500).optional()
});

const updateFollowUpBodySchema = z.object({
  status: z.enum(FOLLOWUP_STATUS_VALUES),
  notes: z.string().max(500).optional(),
  completedAt: z.string().datetime().optional()
});

// Dashboard stats
export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const [
      totalReferrals,
      activeReferrals,
      completedReferrals,
      pendingApproval,
      highPriorityCases
    ] = await Promise.all([
      prisma.referral.count(),
      prisma.referral.count({ where: { status: "ACTIVE" } }),
      prisma.referral.count({ where: { status: "COMPLETED" } }),
      prisma.referral.count({ where: { parentApprovalStatus: "PENDING" } }),
      prisma.referral.count({ where: { priority: { in: ["HIGH", "CRITICAL"] }, status: { not: "COMPLETED" } } })
    ]);

    // Calculate average resolution time for completed referrals
    const completedWithTimes = await prisma.referral.findMany({
      where: { status: "COMPLETED", parentApprovedAt: { not: null } },
      select: { createdAt: true, parentApprovedAt: true }
    });

    let avgResolutionDays = 0;
    if (completedWithTimes.length > 0) {
      const totalDays = completedWithTimes.reduce((sum: number, r: { createdAt: Date; parentApprovedAt: Date | null }) => {
        if (!r.parentApprovedAt) return sum;
        const days = Math.ceil((r.parentApprovedAt.getTime() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
      avgResolutionDays = Math.round(totalDays / completedWithTimes.length);
    }

    return res.status(200).json({
      totalReferrals,
      activeReferrals,
      completedReferrals,
      pendingApproval,
      highPriorityCases,
      averageResolutionDays: avgResolutionDays
    });
  } catch (error) {
    return next(error);
  }
}

// Practitioner directory
export async function listPractitioners(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listPractitionersQuerySchema.parse(req.query);

    const where: any = {};

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: "insensitive" } },
        { city: { contains: query.search, mode: "insensitive" } },
        { specializations: { has: query.search } }
      ];
    }

    if (query.city) {
      where.city = { contains: query.city, mode: "insensitive" };
    }

    if (query.specialty) {
      where.specializations = { has: query.specialty };
    }

    if (query.consultationMode) {
      where.consultationModes = { has: query.consultationMode };
    }

    if (query.language) {
      where.languages = { has: query.language };
    }

    if (query.experience) {
      const years = parseInt(query.experience);
      if (!isNaN(years)) {
        where.yearsOfExperience = { gte: years };
      }
    }

    const skip = (query.page - 1) * query.pageSize;

    const [total, data] = await Promise.all([
      prisma.practitioner.count({ where }),
      prisma.practitioner.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          city: true,
          qualifications: true,
          specializations: true,
          languages: true,
          consultationModes: true,
          yearsOfExperience: true,
          rating: true,
          isAvailable: true,
          feeRange: true,
          contactUnlocked: true
        },
        orderBy: { fullName: "asc" },
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

export async function getPractitionerById(req: Request, res: Response, next: NextFunction) {
  try {
    const { practitionerId } = practitionerParamsSchema.parse(req.params);

    const practitioner = await prisma.practitioner.findUnique({
      where: { id: practitionerId },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10
        },
        _count: {
          select: { referrals: true }
        }
      }
    });

    if (!practitioner) {
      throw new ApiError(404, "Practitioner not found");
    }

    return res.status(200).json(practitioner);
  } catch (error) {
    return next(error);
  }
}

export async function requestContactAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const { practitionerId } = practitionerParamsSchema.parse(req.params);

    const practitioner = await prisma.practitioner.findUnique({
      where: { id: practitionerId }
    });

    if (!practitioner) {
      throw new ApiError(404, "Practitioner not found");
    }

    const updated = await prisma.practitioner.update({
      where: { id: practitionerId },
      data: { contactUnlocked: true },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        clinicAddress: true,
        contactUnlocked: true
      }
    });

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
}

// Referrals
export async function listReferrals(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listReferralsQuerySchema.parse(req.query);

    const where: any = {};

    if (query.search) {
      where.OR = [
        { student: { firstName: { contains: query.search, mode: "insensitive" } } },
        { student: { lastName: { contains: query.search, mode: "insensitive" } } },
        { practitioner: { fullName: { contains: query.search, mode: "insensitive" } } },
        { reason: { contains: query.search, mode: "insensitive" } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    const skip = (query.page - 1) * query.pageSize;

    const [total, data] = await Promise.all([
      prisma.referral.count({ where }),
      prisma.referral.findMany({
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
          practitioner: {
            select: {
              id: true,
              fullName: true,
              city: true,
              specializations: true
            }
          },
          referredBy: {
            select: {
              id: true,
              fullName: true,
              role: true
            }
          },
          _count: {
            select: {
              timelineEvents: true,
              milestones: true,
              communicationLogs: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
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

export async function getReferralById(req: Request, res: Response, next: NextFunction) {
  try {
    const { referralId } = referralParamsSchema.parse(req.params);

    const referral = await prisma.referral.findUnique({
      where: { id: referralId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            grade: true,
            classroom: true,
            tier: true,
            riskScore: true
          }
        },
        practitioner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            clinicAddress: true,
            city: true,
            qualifications: true,
            specializations: true,
            languages: true,
            consultationModes: true,
            yearsOfExperience: true,
            rating: true,
            isAvailable: true,
            feeRange: true,
            contactUnlocked: true
          }
        },
        referredBy: {
          select: {
            id: true,
            fullName: true,
            role: true
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
          orderBy: { createdAt: "asc" }
        },
        milestones: {
          orderBy: { createdAt: "asc" }
        },
        communicationLogs: {
          orderBy: { createdAt: "desc" }
        },
        followUps: {
          orderBy: { scheduledAt: "asc" }
        }
      }
    });

    if (!referral) {
      throw new ApiError(404, "Referral not found");
    }

    return res.status(200).json(referral);
  } catch (error) {
    return next(error);
  }
}

export async function createReferral(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const body = createReferralBodySchema.parse(req.body);

    const [student, practitioner] = await Promise.all([
      prisma.student.findUnique({ where: { id: body.studentId } }),
      prisma.practitioner.findUnique({ where: { id: body.practitionerId } })
    ]);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    if (!practitioner) {
      throw new ApiError(404, "Practitioner not found");
    }

    const referral = await prisma.referral.create({
      data: {
        studentId: body.studentId,
        practitionerId: body.practitionerId,
        referredById: req.user.id,
        priority: body.priority,
        concernCategory: body.concernCategory,
        reason: body.reason,
        notes: body.notes,
        status: "DRAFT",
        parentApprovalStatus: "PENDING",
        timelineEvents: {
          create: {
            createdById: req.user.id,
            eventType: "referral_created",
            title: "Referral Created",
            description: `Referral created for ${student.firstName} ${student.lastName} to ${practitioner.fullName}`
          }
        }
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        practitioner: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    return res.status(201).json(referral);
  } catch (error) {
    return next(error);
  }
}

export async function updateReferralStatus(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const { referralId } = referralParamsSchema.parse(req.params);
    const body = updateStatusBodySchema.parse(req.body);

    const existing = await prisma.referral.findUnique({
      where: { id: referralId }
    });

    if (!existing) {
      throw new ApiError(404, "Referral not found");
    }

    const statusTitles: Record<string, string> = {
      PENDING_APPROVAL: "Submitted for Parent Approval",
      APPROVED: "Approved",
      REJECTED: "Rejected",
      ACTIVE: "Activated",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled"
    };

    const updated = await prisma.referral.update({
      where: { id: referralId },
      data: {
        status: body.status,
        timelineEvents: {
          create: {
            createdById: req.user.id,
            eventType: "status_changed",
            title: statusTitles[body.status] || "Status Updated",
            description: `Referral status changed to ${body.status}`
          }
        }
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
}

export async function parentApproval(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const { referralId } = referralParamsSchema.parse(req.params);
    const body = parentApprovalBodySchema.parse(req.body);

    const existing = await prisma.referral.findUnique({
      where: { id: referralId }
    });

    if (!existing) {
      throw new ApiError(404, "Referral not found");
    }

    const updated = await prisma.referral.update({
      where: { id: referralId },
      data: {
        parentApprovalStatus: body.approved ? "APPROVED" : "REJECTED",
        parentApprovedAt: body.approved ? new Date() : null,
        status: body.approved ? "ACTIVE" : "REJECTED",
        timelineEvents: {
          create: {
            createdById: req.user.id,
            eventType: body.approved ? "parent_approved" : "parent_rejected",
            title: body.approved ? "Parent Approved" : "Parent Rejected",
            description: body.approved
              ? "Parent has approved the referral"
              : `Parent has rejected the referral${body.notes ? `: ${body.notes}` : ""}`
          }
        }
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
}

export async function addTimelineEvent(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const { referralId } = referralParamsSchema.parse(req.params);
    const body = timelineBodySchema.parse(req.body);

    const existing = await prisma.referral.findUnique({
      where: { id: referralId }
    });

    if (!existing) {
      throw new ApiError(404, "Referral not found");
    }

    const event = await prisma.referralTimelineEvent.create({
      data: {
        referralId,
        createdById: req.user.id,
        eventType: body.eventType,
        title: body.title,
        description: body.description,
        metadata: body.metadata as any
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    });

    return res.status(201).json(event);
  } catch (error) {
    return next(error);
  }
}

export async function addCommunicationLog(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const { referralId } = referralParamsSchema.parse(req.params);
    const body = communicationBodySchema.parse(req.body);

    const existing = await prisma.referral.findUnique({
      where: { id: referralId }
    });

    if (!existing) {
      throw new ApiError(404, "Referral not found");
    }

    const log = await prisma.communicationLog.create({
      data: {
        referralId,
        authorName: body.authorName,
        authorRole: body.authorRole,
        message: body.message,
        attachmentUrl: body.attachmentUrl || null
      }
    });

    return res.status(201).json(log);
  } catch (error) {
    return next(error);
  }
}

export async function addMilestone(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const { referralId } = referralParamsSchema.parse(req.params);
    const body = milestoneBodySchema.parse(req.body);

    const existing = await prisma.referral.findUnique({
      where: { id: referralId }
    });

    if (!existing) {
      throw new ApiError(404, "Referral not found");
    }

    const milestone = await prisma.referralMilestone.create({
      data: {
        referralId,
        milestoneType: body.milestoneType,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        notes: body.notes
      }
    });

    return res.status(201).json(milestone);
  } catch (error) {
    return next(error);
  }
}

export async function updateMilestone(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const { referralId, milestoneId } = milestoneParamsSchema.parse(req.params);
    const body = updateMilestoneBodySchema.parse(req.body);

    const existing = await prisma.referralMilestone.findUnique({
      where: { id: milestoneId, referralId }
    });

    if (!existing) {
      throw new ApiError(404, "Milestone not found");
    }

    const updated = await prisma.referralMilestone.update({
      where: { id: milestoneId },
      data: {
        status: body.status,
        notes: body.notes,
        completedAt: body.completedAt ? new Date(body.completedAt) : body.status === "COMPLETED" ? new Date() : null
      }
    });

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
}

export async function scheduleFollowUp(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const { referralId } = referralParamsSchema.parse(req.params);
    const body = followUpBodySchema.parse(req.body);

    const existing = await prisma.referral.findUnique({
      where: { id: referralId }
    });

    if (!existing) {
      throw new ApiError(404, "Referral not found");
    }

    const followUp = await prisma.followUp.create({
      data: {
        referralId,
        scheduledAt: new Date(body.scheduledAt),
        notes: body.notes
      }
    });

    return res.status(201).json(followUp);
  } catch (error) {
    return next(error);
  }
}

export async function updateFollowUp(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const { referralId, followUpId } = followUpParamsSchema.parse(req.params);
    const body = updateFollowUpBodySchema.parse(req.body);

    const existing = await prisma.followUp.findUnique({
      where: { id: followUpId, referralId }
    });

    if (!existing) {
      throw new ApiError(404, "Follow-up not found");
    }

    const updated = await prisma.followUp.update({
      where: { id: followUpId },
      data: {
        status: body.status,
        notes: body.notes,
        completedAt: body.completedAt ? new Date(body.completedAt) : body.status === "COMPLETED" ? new Date() : null
      }
    });

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
}