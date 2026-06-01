import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../middlewares/error.middleware";

const listQuerySchema = z.object({
  schoolId: z.string().optional(),
  grade: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25)
});

const createBodySchema = z.object({
  schoolId: z.string(),
  name: z.string().min(1),
  grade: z.string(),
  section: z.string().optional()
});

const paramsSchema = z.object({
  classroomId: z.string().uuid()
});

const assignTeacherBody = z.object({
  teacherId: z.string().uuid(),
  isClassTeacher: z.boolean().optional()
});

export async function listClassrooms(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listQuerySchema.parse(req.query);

    const where: any = {};
    if (query.schoolId) where.schoolId = query.schoolId;
    if (query.grade) where.grade = query.grade;

    const skip = (query.page - 1) * query.pageSize;

    const [total, data] = await Promise.all([
      prisma.classroom.count({ where }),
      prisma.classroom.findMany({
        where,
        include: {
          students: {
            select: { id: true, firstName: true, lastName: true, admissionNumber: true }
          },
          teachers: {
            include: { teacher: { select: { id: true, fullName: true, role: true } } }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: query.pageSize
      })
    ]);

    return res.status(200).json({ data, pagination: { page: query.page, pageSize: query.pageSize, total } });
  } catch (error) {
    return next(error);
  }
}

export async function getClassroomById(req: Request, res: Response, next: NextFunction) {
  try {
    const { classroomId } = paramsSchema.parse(req.params);

    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      include: {
        students: true,
        teachers: { include: { teacher: { select: { id: true, fullName: true, email: true } } } },
        timetable: { orderBy: { dayOfWeek: "asc" } },
        selSessions: true
      }
    });

    if (!classroom) throw new ApiError(404, "Classroom not found");

    return res.status(200).json(classroom);
  } catch (error) {
    return next(error);
  }
}

export async function createClassroom(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Authentication required");

    const body = createBodySchema.parse(req.body);

    const created = await prisma.classroom.create({ data: { ...body } });

    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
}

export async function assignTeacherToClass(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Authentication required");

    const { classroomId } = paramsSchema.parse(req.params);
    const body = assignTeacherBody.parse(req.body);

    // ensure classroom exists
    const classroom = await prisma.classroom.findUnique({ where: { id: classroomId } });
    if (!classroom) throw new ApiError(404, "Classroom not found");

    const teacher = await prisma.user.findUnique({ where: { id: body.teacherId } });
    if (!teacher) throw new ApiError(404, "Teacher not found");

    const record = await prisma.classroomTeacher.upsert({
      where: { classroomId_teacherId: { classroomId, teacherId: body.teacherId } },
      create: { classroomId, teacherId: body.teacherId, isClassTeacher: body.isClassTeacher ?? false },
      update: { isClassTeacher: body.isClassTeacher ?? false }
    });

    return res.status(200).json(record);
  } catch (error) {
    return next(error);
  }
}

export async function listStudentsInClass(req: Request, res: Response, next: NextFunction) {
  try {
    const { classroomId } = paramsSchema.parse(req.params);

    const students = await prisma.student.findMany({ where: { classroom: classroomId } });

    return res.status(200).json(students);
  } catch (error) {
    return next(error);
  }
}

export async function createObservation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Authentication required");

    const body = z
      .object({ studentId: z.string().uuid(), category: z.string(), note: z.string().min(1), context: z.string().optional(), isFlag: z.boolean().optional() })
      .parse(req.body);

    const student = await prisma.student.findUnique({ where: { id: body.studentId } });
    if (!student) throw new ApiError(404, "Student not found");

    const obs = await prisma.observation.create({ data: { studentId: body.studentId, createdById: req.user.id, category: body.category, note: body.note, context: body.context, isFlag: body.isFlag ?? false } });

    return res.status(201).json(obs);
  } catch (error) {
    return next(error);
  }
}

export async function raiseFlag(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Authentication required");

    const body = z.object({ studentId: z.string().uuid(), category: z.string(), observationId: z.string().uuid().optional() }).parse(req.body);

    const student = await prisma.student.findUnique({ where: { id: body.studentId } });
    if (!student) throw new ApiError(404, "Student not found");

    const flag = await prisma.flag.create({ data: { studentId: body.studentId, raisedById: req.user.id, category: body.category, observationId: body.observationId } });

    return res.status(201).json(flag);
  } catch (error) {
    return next(error);
  }
}
