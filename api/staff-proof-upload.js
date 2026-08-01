import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: 'Shared workforce storage is not configured.' });
  const userToken = req.headers['x-user-token'];
  if (!userToken || !process.env.CIRCLE_API_KEY) return res.status(401).json({ error: 'Circle sign-in is required.' });
  const circleResponse = await fetch(`${process.env.CIRCLE_API_URL || 'https://api.circle.com'}/v1/w3s/wallets`, {
    headers: { Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`, 'X-User-Token': userToken }
  });
  if (!circleResponse.ok) return res.status(401).json({ error: 'Circle sign-in could not be verified.' });
  const jsonResponse = await handleUpload({
    request: req,
    body: req.body,
    onBeforeGenerateToken: async (pathname, clientPayload) => {
      if (!String(pathname || '').startsWith('autiqo/proof/')) throw new Error('Invalid upload path.');
      const parsed = JSON.parse(clientPayload || '{}');
      if (!parsed.submissionId) throw new Error('Missing submission id.');
      return {
        allowedContentTypes: ['image/png', 'image/jpeg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        maximumSizeInBytes: 100 * 1024 * 1024,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ submissionId: parsed.submissionId })
      };
    },
    onUploadCompleted: async () => {}
  });
  return res.status(200).json(jsonResponse);
}
