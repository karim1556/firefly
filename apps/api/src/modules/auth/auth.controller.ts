import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../middlewares/error.middleware";
import { verifyPassword } from "../../utils/password";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type TokenPayload
} from "../../utils/jwt";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(20)
});

function buildPayload(user: {
  id: string;
  email: string;
  fullName: string;
  role: TokenPayload["role"];
}): TokenPayload {
  return {
    sub: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  };
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const payload = buildPayload(user);
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const decodedRefresh = verifyRefreshToken(refreshToken);

    if (!decodedRefresh.exp) {
      throw new ApiError(500, "Unable to issue refresh token");
    }

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(decodedRefresh.exp * 1000)
      }
    });

    return res.status(200).json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    return next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const payload = verifyRefreshToken(refreshToken);

    const existingToken = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        tokenHash: hashToken(refreshToken),
        revokedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });

    if (!existingToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    await prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revokedAt: new Date() }
    });

    const nextPayload = buildPayload(existingToken.user);
    const nextAccessToken = signAccessToken(nextPayload);
    const nextRefreshToken = signRefreshToken(nextPayload);
    const decodedNextRefresh = verifyRefreshToken(nextRefreshToken);

    if (!decodedNextRefresh.exp) {
      throw new ApiError(500, "Unable to rotate refresh token");
    }

    await prisma.refreshToken.create({
      data: {
        userId: existingToken.user.id,
        tokenHash: hashToken(nextRefreshToken),
        expiresAt: new Date(decodedNextRefresh.exp * 1000)
      }
    });

    return res.status(200).json({
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken
    });
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired refresh token", error));
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        schoolId: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = refreshSchema.safeParse(req.body);

    if (parsed.success) {
      await prisma.refreshToken.updateMany({
        where: {
          tokenHash: hashToken(parsed.data.refreshToken),
          revokedAt: null
        },
        data: {
          revokedAt: new Date()
        }
      });
    }

    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    return next(error);
  }
}
