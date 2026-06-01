import { Router } from "express";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";
import {
  listClassrooms,
  getClassroomById,
  createClassroom,
  assignTeacherToClass,
  listStudentsInClass,
  createObservation,
  raiseFlag
} from "./classrooms.controller";

export const classroomsRouter = Router();

classroomsRouter.get("/", requireAuth, listClassrooms);
classroomsRouter.post("/", requireAuth, requireRoles("ADMIN", "SYSTEM_ADMIN", "COUNSELLOR"), createClassroom);
classroomsRouter.get("/:classroomId", requireAuth, getClassroomById);
classroomsRouter.post("/:classroomId/assign-teacher", requireAuth, requireRoles("ADMIN", "SYSTEM_ADMIN", "COUNSELLOR"), assignTeacherToClass);
classroomsRouter.get("/:classroomId/students", requireAuth, requireRoles("ADMIN", "SYSTEM_ADMIN", "COUNSELLOR", "TEACHER", "PARENT", "FIREFLY_REPRESENTATIVE", "FIREFLY_SPECIALIST", "STUDENT"), listStudentsInClass);

// teacher input endpoints
classroomsRouter.post("/observations", requireAuth, requireRoles("TEACHER", "COUNSELLOR", "ADMIN", "SYSTEM_ADMIN"), createObservation);
classroomsRouter.post("/flags", requireAuth, requireRoles("TEACHER", "COUNSELLOR", "ADMIN", "SYSTEM_ADMIN"), raiseFlag);
