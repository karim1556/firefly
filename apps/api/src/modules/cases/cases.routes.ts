import { Router } from "express";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";
import { addTimelineEvent, closeCase, createCase, getCaseById, listCases } from "./cases.controller";

export const casesRouter = Router();

casesRouter.get(
  "/",
  requireAuth,
  requireRoles("ADMIN", "COUNSELLOR", "TEACHER", "SYSTEM_ADMIN", "FIREFLY_SPECIALIST"),
  listCases
);

casesRouter.get(
  "/:caseId",
  requireAuth,
  requireRoles("ADMIN", "COUNSELLOR", "TEACHER", "SYSTEM_ADMIN", "FIREFLY_SPECIALIST"),
  getCaseById
);

casesRouter.post(
  "/",
  requireAuth,
  requireRoles("ADMIN", "COUNSELLOR", "TEACHER", "SYSTEM_ADMIN"),
  createCase
);

casesRouter.post(
  "/:caseId/timeline",
  requireAuth,
  requireRoles("ADMIN", "COUNSELLOR", "SYSTEM_ADMIN", "FIREFLY_SPECIALIST"),
  addTimelineEvent
);

casesRouter.post(
  "/:caseId/close",
  requireAuth,
  requireRoles("ADMIN", "COUNSELLOR", "SYSTEM_ADMIN"),
  closeCase
);
