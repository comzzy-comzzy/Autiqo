import crypto from 'node:crypto';
import { clearAdminCookie, createAdminCookie, isAdminEmail, readAdminSession } from './_admin-session.js';

function matches(left, right) {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = readAdminSession(req);
    return session ? res.status(200).json({ authenticated: true, email: session.email }) : res.status(401).json({ authenticated: false });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearAdminCookie());
    return res.status(200).json({ authenticated: false });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, accessKey } = req.body || {};
  if (!process.env.ADMIN_DASHBOARD_KEY || !process.env.ADMIN_SESSION_SECRET) {
    return res.status(503).json({ error: 'Admin security environment variables are not configured.' });
  }
  if (!isAdminEmail(email) || !matches(accessKey, process.env.ADMIN_DASHBOARD_KEY)) {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }
  res.setHeader('Set-Cookie', createAdminCookie(String(email).trim().toLowerCase()));
  return res.status(200).json({ authenticated: true, email: String(email).trim().toLowerCase() });
}
