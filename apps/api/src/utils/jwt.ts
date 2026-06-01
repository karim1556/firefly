import { createHash } from "node:crypto";
import {
  JsonWebTokenError,
  type JwtPayload,
  type Secret,
  type SignOptions,
  sign,
  verify
} from "jsonwebtoken";
import { env } from "../config/env";
import type { AppRole } from "../types/domain";

export type TokenPayload = {
  sub: string;
  email: string;
  fullName: string;
  role: AppRole;
};

type VerifiedTokenPayload = JwtPayload & TokenPayload;

const accessSecret: Secret = env.JWT_ACCESS_SECRET;
const refreshSecret: Secret = env.JWT_REFRESH_SECRET;

const accessSignOptions: SignOptions = {
  expiresIn: env.ACCESS_TOKEN_TTL as SignOptions["expiresIn"]
};

const refreshSignOptions: SignOptions = {
  expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`
};

function ensureObjectPayload(decoded: string | JwtPayload): VerifiedTokenPayload {
  if (typeof decoded === "string") {
    throw new JsonWebTokenError("Expected token payload object");
  }

  return decoded as VerifiedTokenPayload;
}

export function signAccessToken(payload: TokenPayload) {
  return sign(payload, accessSecret, accessSignOptions);
}

export function signRefreshToken(payload: TokenPayload) {
  return sign(payload, refreshSecret, refreshSignOptions);
}

export function verifyAccessToken(token: string) {
  return ensureObjectPayload(verify(token, accessSecret));
}

export function verifyRefreshToken(token: string) {
  return ensureObjectPayload(verify(token, refreshSecret));
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
