import crypto from "crypto";

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export function generateResetToken(): string {
  return crypto.randomBytes(RESET_TOKEN_BYTES).toString("hex");
}

export function generateResetTokenExpiry(): Date {
  return new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
}
