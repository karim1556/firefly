import { Router } from "express";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";
import { getStudentById, listStudents } from "./students.controller";

export const studentsRouter = Router();

studentsRouter.get(
  "/",
  requireAuth,
  requireRoles(
    "ADMIN",
    "COUNSELLOR",
    "TEACHER",
    "SYSTEM_ADMIN",
    "FIREFLY_REPRESENTATIVE",
    "FIREFLY_SPECIALIST",
    "PARENT",
    "STUDENT"
  ),
  listStudents
);

studentsRouter.get(
  "/:studentId",
  requireAuth,
  requireRoles(
    "ADMIN",
    "COUNSELLOR",
    "TEACHER",
    "SYSTEM_ADMIN",
    "FIREFLY_REPRESENTATIVE",
    "FIREFLY_SPECIALIST",
    "PARENT",
    "STUDENT"
  ),
  getStudentById
);
