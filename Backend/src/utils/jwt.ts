import jwt from 'jsonwebtoken';

const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES_DAYS = 7;

function getAccessSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not set');
  return s;
}

export type AccessPayload = { sub: string; email: string };

export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign(payload, getAccessSecret(), { expiresIn: ACCESS_EXPIRES });
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, getAccessSecret()) as AccessPayload;
}

export function refreshExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_EXPIRES_DAYS);
  return d;
}
