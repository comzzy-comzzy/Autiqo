import crypto from 'node:crypto';

const COOKIE_NAME = 'autiqo_admin_session';
const MAX_AGE = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_DASHBOARD_KEY || '';
}

function signature(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

export function createAdminCookie(email) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + MAX_AGE * 1000 })).toString('base64url');
  return `${COOKIE_NAME}=${payload}.${signature(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export function clearAdminCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function readAdminSession(req) {
  if (!secret()) return null;
  const cookies = Object.fromEntries(String(req.headers.cookie || '').split(';').map((part) => {
    const [key, ...value] = part.trim().split('=');
    return [key, value.join('=')];
  }));
  const [payload, suppliedSignature] = String(cookies[COOKIE_NAME] || '').split('.');
  if (!payload || !suppliedSignature) return null;
  const expected = signature(payload);
  if (expected.length !== suppliedSignature.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(suppliedSignature))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function isAdminEmail(email) {
  return (process.env.ADMIN_EMAILS || '').split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
    .includes(String(email || '').trim().toLowerCase());
}
