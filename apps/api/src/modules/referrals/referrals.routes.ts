import { Router } from "express";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";
import {
  listReferrals,
  getReferralById,
  createReferral,
  updateReferralStatus,
  parentApproval,
  addTimelineEvent,
  addCommunicationLog,
  addMilestone,
  updateMilestone,
  scheduleFollowUp,
  updateFollowUp,
  listPractitioners,
  getPractitionerById,
  requestContactAccess,
  getDashboardStats
} from "./referrals.controller";

export const referralsRouter = Router();

// Dashboard
referralsRouter.get("/dashboard/stats", requireAuth, getDashboardStats);

// Practitioner directory
referralsRouter.get("/practitioners", requireAuth, listPractitioners);
referralsRouter.get("/practitioners/:practitionerId", requireAuth, getPractitionerById);
referralsRouter.post("/practitioners/:practitionerId/request-access", requireAuth, requestContactAccess);

// Referrals CRUD
referralsRouter.get("/", requireAuth, requireRoles("ADMIN", "COUNSELLOR", "SYSTEM_ADMIN", "SUPER_ADMIN", "SCHOOL_ADMIN", "SWT_TEAM", "CLINICAL_SPECIALIST"), listReferrals);
referralsRouter.get("/:referralId", requireAuth, getReferralById);
referralsRouter.post("/", requireAuth, requireRoles("ADMIN", "COUNSELLOR", "SYSTEM_ADMIN", "SUPER_ADMIN", "SCHOOL_ADMIN", "SWT_TEAM", "CLINICAL_SPECIALIST"), createReferral);
referralsRouter.patch("/:referralId/status", requireAuth, requireRoles("ADMIN", "COUNSELLOR", "SYSTEM_ADMIN", "SUPER_ADMIN", "SCHOOL_ADMIN", "SWT_TEAM", "CLINICAL_SPECIALIST"), updateReferralStatus);
referralsRouter.post("/:referralId/parent-approval", requireAuth, parentApproval);

// Timeline & Communication
referralsRouter.post("/:referralId/timeline", requireAuth, addTimelineEvent);
referralsRouter.post("/:referralId/communication", requireAuth, addCommunicationLog);

// Milestones
referralsRouter.post("/:referralId/milestones", requireAuth, addMilestone);
referralsRouter.patch("/:referralId/milestones/:milestoneId", requireAuth, updateMilestone);

// Follow-ups
referralsRouter.post("/:referralId/follow-ups", requireAuth, scheduleFollowUp);
referralsRouter.patch("/:referralId/follow-ups/:followUpId", requireAuth, updateFollowUp);