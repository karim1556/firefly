import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { apiRouter } from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

export const app = express();

const devLogFormat = "[api] :method :url :status :res[content-length] - :response-time ms";

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);

app.use(helmet());
app.use(
  morgan(env.NODE_ENV === "development" ? devLogFormat : "combined", {
    skip: (req) => env.NODE_ENV === "development" && req.path === "/health"
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
