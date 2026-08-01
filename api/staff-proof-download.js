import { issueSignedToken, presignUrl } from '@vercel/blob';
import { readAdminSession } from './_admin-session.js';

export default async function handler(req, res) {
  if (!readAdminSession(req)) return res.status(401).json({ error: 'Administrator session required.' });
  const pathname = String(req.query?.pathname || '');
  if (!pathname.startsWith('autiqo/proof/')) return res.status(400).json({ error: 'Invalid proof file.' });
  const validUntil = Date.now() + 5 * 60 * 1000;
  const signedToken = await issueSignedToken({ pathname, operations: ['get'], validUntil });
  const { presignedUrl } = await presignUrl(signedToken, {
    access: 'private', operation: 'get', pathname, validUntil, useCache: false
  });
  return res.redirect(302, presignedUrl);
}
