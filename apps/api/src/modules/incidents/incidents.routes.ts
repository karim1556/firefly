import { Router } from "express";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";
import { createIncident, listIncidents } from "./incidents.controller";

export const incidentsRouter = Router();

incidentsRouter.get(
  "/",
  requireAuth,
  requireRoles("ADMIN", "COUNSELLOR", "TEACHER", "SYSTEM_ADMIN", "FIREFLY_SPECIALIST"),
  listIncidents
);

incidentsRouter.post(
  "/",
  requireAuth,
  requireRoles("ADMIN", "COUNSELLOR", "TEACHER", "SYSTEM_ADMIN"),
  createIncident
);
