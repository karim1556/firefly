import bcrypt from "bcryptjs";

export async function hashPassword(rawPassword: string) {
  return bcrypt.hash(rawPassword, 12);
}

export async function verifyPassword(rawPassword: string, passwordHash: string) {
  return bcrypt.compare(rawPassword, passwordHash);
}
