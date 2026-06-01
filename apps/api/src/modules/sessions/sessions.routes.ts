import { Router } from "express";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";
import { createSession, listSessions } from "./sessions.controller";

export const sessionsRouter = Router();

sessionsRouter.get(
  "/",
  requireAuth,
  requireRoles("ADMIN", "COUNSELLOR", "SYSTEM_ADMIN", "FIREFLY_REPRESENTATIVE"),
  listSessions
);

sessionsRouter.post(
  "/",
  requireAuth,
  requireRoles("ADMIN", "COUNSELLOR", "SYSTEM_ADMIN"),
  createSession
);
