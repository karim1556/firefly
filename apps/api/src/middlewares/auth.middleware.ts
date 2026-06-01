import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import type { AppRole } from "../types/domain";
import { ApiError } from "./error.middleware";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing bearer token"));
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role
    };
    req.accessToken = token;

    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired access token"));
  }
}

export function requireRoles(...roles: AppRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to access this resource"));
    }

    return next();
  };
}
