import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';

export default function AdminAccessGate({ email, onUnlocked }) {
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function unlock(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, accessKey }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Access was denied.');
      onUnlocked(data.email || email);
    } catch (unlockError) {
      setError(unlockError.message);
    } finally {
      setBusy(false);
    }
  }

  return <section className="admin-access-page"><form onSubmit={unlock} className="admin-access-card"><span className="admin-access-icon"><LockKeyhole size={24} /></span><p className="staff-eyebrow">Additional protection</p><h1>Unlock the admin dashboard</h1><p>Signed in as <strong>{email}</strong>. Enter your private dashboard key to view staff records.</p><label>Dashboard key<input type="password" required value={accessKey} onChange={(event) => setAccessKey(event.target.value)} autoComplete="current-password" /></label>{error && <p className="staff-form-error">{error}</p>}<button className="btn-primary" type="submit" disabled={busy}><ShieldCheck size={17} /> {busy ? 'Checking…' : 'Open dashboard'}</button></form></section>;
}
