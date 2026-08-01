import { get, list, put } from '@vercel/blob';
import { readAdminSession } from './_admin-session.js';

const PREFIX = 'autiqo/staff/';

function safeRecord(record = {}) {
  return {
    name: String(record.name || '').slice(0, 160),
    email: String(record.email || '').trim().toLowerCase().slice(0, 320),
    country: String(record.country || '').slice(0, 100),
    company: String(record.company || '').slice(0, 160),
    profilePhoto: String(record.profilePhoto || '').startsWith('data:') ? '' : String(record.profilePhoto || ''),
    profile: {
      name: String(record.profile?.name || '').slice(0, 160),
      phone: String(record.profile?.phone || '').slice(0, 40),
      work: String(record.profile?.work || '').slice(0, 160),
      currentTask: String(record.profile?.currentTask || '').slice(0, 2000)
    },
    wallet: record.wallet ? {
      id: String(record.wallet.id || ''),
      address: String(record.wallet.address || ''),
      blockchain: String(record.wallet.blockchain || '')
    } : null,
    proofSubmissions: Array.isArray(record.proofSubmissions) ? record.proofSubmissions.slice(0, 100).map((submission) => ({
      id: String(submission.id || ''),
      period: String(submission.period || ''),
      fileName: String(submission.fileName || ''),
      submittedAt: String(submission.submittedAt || ''),
      files: Array.isArray(submission.files) ? submission.files.map((file) => ({
        id: String(file.id || ''), name: String(file.name || ''), type: String(file.type || ''), size: Number(file.size || 0),
        pathname: String(file.pathname || ''), url: String(file.url || ''), downloadUrl: String(file.downloadUrl || '')
      })) : []
    })) : [],
    updatedAt: new Date().toISOString()
  };
}

async function validateCircleUser(userToken, expectedWallet) {
  if (!userToken || !process.env.CIRCLE_API_KEY) return false;
  const response = await fetch(`${process.env.CIRCLE_API_URL || 'https://api.circle.com'}/v1/w3s/wallets`, {
    headers: { Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`, 'X-User-Token': userToken }
  });
  if (!response.ok) return false;
  const payload = await response.json().catch(() => ({}));
  const wallets = payload.data?.wallets || payload.wallets || [];
  return wallets.some((wallet) => wallet.address?.toLowerCase() === String(expectedWallet || '').toLowerCase());
}

export default async function handler(req, res) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: 'Shared workforce storage is not configured.' });

  if (req.method === 'GET') {
    if (!readAdminSession(req)) return res.status(401).json({ error: 'Administrator session required.' });
    const records = [];
    let cursor;
    do {
      const page = await list({ prefix: PREFIX, cursor, limit: 100 });
      for (const blob of page.blobs.filter((item) => item.pathname.endsWith('.json'))) {
        const result = await get(blob.pathname, { access: 'private', useCache: false });
        if (result?.statusCode === 200) records.push(await new Response(result.stream).json());
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return res.status(200).json({ records: records.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))) });
  }

  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  const { record, userToken } = req.body || {};
  const cleaned = safeRecord(record);
  if (!cleaned.email || !cleaned.wallet?.address) return res.status(400).json({ error: 'Email and Circle wallet are required.' });
  if (!await validateCircleUser(userToken, cleaned.wallet.address)) return res.status(401).json({ error: 'Circle user verification failed.' });
  const key = Buffer.from(cleaned.email).toString('base64url');
  await put(`${PREFIX}${key}.json`, JSON.stringify(cleaned), {
    access: 'private', allowOverwrite: true, contentType: 'application/json', addRandomSuffix: false
  });
  return res.status(200).json({ record: cleaned });
}
