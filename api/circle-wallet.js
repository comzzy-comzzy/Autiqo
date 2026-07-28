const CIRCLE_API_URL = process.env.CIRCLE_API_URL || 'https://api.circle.com';

async function circleRequest(path, { method = 'GET', userToken, body } = {}) {
  if (!process.env.CIRCLE_API_KEY) {
    return {
      status: 500,
      data: { error: 'Missing CIRCLE_API_KEY on the server.' }
    };
  }

  const response = await fetch(`${CIRCLE_API_URL}${path}`, {
    method,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      ...(userToken ? { 'X-User-Token': userToken } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, ...params } = req.body || {};

    if (!action) {
      return res.status(400).json({ error: 'Missing action' });
    }

    if (action === 'requestEmailOtp') {
      const { deviceId, email, adminOnly } = params;
      if (!deviceId || !email) {
        return res.status(400).json({ error: 'Missing deviceId or email' });
      }

      if (adminOnly) {
        const adminEmails = (process.env.ADMIN_EMAILS || '')
          .split(',')
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean);
        if (!adminEmails.includes(email.trim().toLowerCase())) {
          return res.status(403).json({ error: 'This email is not authorized for the admin portal.' });
        }
      }

      const result = await circleRequest('/v1/w3s/users/email/token', {
        method: 'POST',
        body: {
          idempotencyKey: crypto.randomUUID(),
          deviceId,
          email
        }
      });

      return res.status(result.status).json(result.data?.data || result.data);
    }

    if (action === 'initializeUser') {
      const { userToken } = params;
      if (!userToken) {
        return res.status(400).json({ error: 'Missing userToken' });
      }

      const result = await circleRequest('/v1/w3s/user/initialize', {
        method: 'POST',
        userToken,
        body: {
          idempotencyKey: crypto.randomUUID(),
          accountType: 'SCA',
          blockchains: ['ARC-TESTNET']
        }
      });

      return res.status(result.status).json(result.data?.data || result.data);
    }

    if (action === 'listWallets') {
      const { userToken } = params;
      if (!userToken) {
        return res.status(400).json({ error: 'Missing userToken' });
      }

      const result = await circleRequest('/v1/w3s/wallets', { userToken });
      return res.status(result.status).json(result.data?.data || result.data);
    }

    if (action === 'getTokenBalance') {
      const { userToken, walletId } = params;
      if (!userToken || !walletId) {
        return res.status(400).json({ error: 'Missing userToken or walletId' });
      }

      const result = await circleRequest(`/v1/w3s/wallets/${walletId}/balances`, { userToken });
      return res.status(result.status).json(result.data?.data || result.data);
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Circle wallet request failed' });
  }
}
