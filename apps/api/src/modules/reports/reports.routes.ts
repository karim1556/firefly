import { Router } from "express";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";
import { getComplianceReport, getWellbeingReport } from "./reports.controller";

export const reportsRouter = Router();

reportsRouter.get(
  "/wellbeing",
  requireAuth,
  requireRoles("ADMIN", "SYSTEM_ADMIN", "COUNSELLOR", "FIREFLY_REPRESENTATIVE"),
  getWellbeingReport
);

reportsRouter.get(
  "/compliance",
  requireAuth,
  requireRoles("ADMIN", "SYSTEM_ADMIN", "FIREFLY_REPRESENTATIVE"),
  getComplianceReport
);
