import { Router } from "express";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";
import { getDashboardOverview } from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/overview",
  requireAuth,
  requireRoles("ADMIN", "COUNSELLOR", "SYSTEM_ADMIN", "FIREFLY_REPRESENTATIVE"),
  getDashboardOverview
);
