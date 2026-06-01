import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { dashboardRouter } from "../modules/dashboard/dashboard.routes";
import { studentsRouter } from "../modules/students/students.routes";
import { classroomsRouter } from "../modules/classrooms/classrooms.routes";
import { casesRouter } from "../modules/cases/cases.routes";
import { sessionsRouter } from "../modules/sessions/sessions.routes";
import { incidentsRouter } from "../modules/incidents/incidents.routes";
import { reportsRouter } from "../modules/reports/reports.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/students", studentsRouter);
apiRouter.use("/classrooms", classroomsRouter);
apiRouter.use("/cases", casesRouter);
apiRouter.use("/sessions", sessionsRouter);
apiRouter.use("/incidents", incidentsRouter);
apiRouter.use("/reports", reportsRouter);
