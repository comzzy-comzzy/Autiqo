import React, { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, FileCheck2, Mail, MapPin, RefreshCw, Search, ShieldCheck, UserRound, Wallet } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function formatSize(bytes) {
  if (!bytes) return '';
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

export default function AdminDashboard({ adminEmail }) {
  const [records, setRecords] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadRecords() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/staff-records');
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not load staff records.');
      setRecords(data.records || []);
    } catch (loadError) {
      setError(loadError.message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadRecords(); }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return records;
    return records.filter((record) => [record.name, record.email, record.profile?.work, record.wallet?.address]
      .some((value) => String(value || '').toLowerCase().includes(needle)));
  }, [query, records]);
  const selected = records.find((record) => record.email === selectedEmail) || filtered[0] || null;
  const proofCount = records.reduce((total, record) => total + (record.proofSubmissions?.length || 0), 0);
  const completeCount = records.filter((record) => record.name && record.profile?.phone && record.profile?.work && record.wallet?.address).length;

  return (
    <section className="admin-workforce-page">
      <header className="admin-workforce-header">
        <div>
          <p className="staff-eyebrow">Private employer workspace</p>
          <h1>Staff records</h1>
          <p>Profiles, payout addresses, and submitted work evidence in one place.</p>
        </div>
        <div className="admin-header-aside">
          <div className="admin-identity"><ShieldCheck size={18} /><span><strong>Administrator</strong><small>{adminEmail}</small></span></div>
          <div className="admin-people-image" aria-hidden="true"><img src="/african2.png" alt="" /></div>
        </div>
      </header>

      <div className="admin-stat-grid">
        <article><UserRound size={19} /><span><small>Total staff</small><strong>{records.length}</strong></span></article>
        <article><FileCheck2 size={19} /><span><small>Proof submissions</small><strong>{proofCount}</strong></span></article>
        <article><ShieldCheck size={19} /><span><small>Complete records</small><strong>{completeCount}</strong></span></article>
      </div>

      <div className="admin-record-toolbar">
        <label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, role, or wallet" /></label>
        <button type="button" onClick={loadRecords} disabled={loading}><RefreshCw size={16} className={loading ? 'is-spinning' : ''} /> Refresh</button>
      </div>
      {error && <p className="admin-data-warning">{error}</p>}

      <div className="admin-record-layout">
        <aside className="admin-record-list">
          {filtered.length === 0 ? <div className="admin-empty-records">No staff submissions found.</div> : filtered.map((record) => (
            <button type="button" key={record.email} className={selected?.email === record.email ? 'is-selected' : ''} onClick={() => setSelectedEmail(record.email)}>
              <span className="admin-record-avatar">{record.name?.charAt(0)?.toUpperCase() || '?'}</span>
              <span><strong>{record.name || 'Unnamed staff'}</strong><small>{record.profile?.work || record.email}</small></span>
              <i className={record.wallet?.address ? 'is-ready' : ''} />
            </button>
          ))}
        </aside>

        <section className="admin-record-detail">
          {!selected ? <div className="admin-empty-records">Select a staff member to view their record.</div> : (
            <>
              <div className="admin-detail-heading">
                <span className="admin-detail-avatar">{selected.name?.charAt(0)?.toUpperCase() || '?'}</span>
                <div><p className="staff-eyebrow">Staff profile</p><h2>{selected.name || 'Unnamed staff'}</h2><span>{selected.profile?.work || 'Job title not submitted'}</span></div>
              </div>
              <div className="admin-detail-grid">
                <div><Mail size={17} /><span><small>Email address</small><strong>{selected.email}</strong></span></div>
                <div><MapPin size={17} /><span><small>Country</small><strong>{selected.country || 'Not submitted'}</strong></span></div>
                <div><BriefcaseBusiness size={17} /><span><small>Phone number</small><strong>{selected.profile?.phone || 'Not submitted'}</strong></span></div>
                <div><Wallet size={17} /><span><small>Network</small><strong>{selected.wallet?.blockchain || 'Not connected'}</strong></span></div>
              </div>
              <section className="admin-detail-section">
                <p className="staff-eyebrow">Current work</p>
                <h3>{selected.profile?.work || 'No role submitted'}</h3>
                <p>{selected.profile?.currentTask || 'No current focus has been submitted.'}</p>
              </section>
              <section className="admin-detail-section">
                <p className="staff-eyebrow">Payout address</p>
                <code>{selected.wallet?.address || 'No wallet address submitted'}</code>
              </section>
              <section className="admin-detail-section">
                <div className="admin-section-title"><div><p className="staff-eyebrow">Evidence</p><h3>Proof of work</h3></div><span>{selected.proofSubmissions?.length || 0}</span></div>
                {!selected.proofSubmissions?.length ? <p>No proof of work submitted.</p> : (
                  <div className="admin-proof-list">{selected.proofSubmissions.map((submission) => (
                    <article key={submission.id}><FileCheck2 size={18} /><div><strong>{formatDate(submission.period)}</strong><small>Submitted {formatDate(submission.submittedAt)}</small></div><div>{submission.files?.map((file) => file.pathname ? <a key={file.id} href={`/api/staff-proof-download?pathname=${encodeURIComponent(file.pathname)}`} target="_blank" rel="noreferrer">{file.name} <small>{formatSize(file.size)}</small></a> : <span key={file.id}>{file.name} <small>{formatSize(file.size)}</small></span>) || submission.fileName}</div></article>
                  ))}</div>
                )}
              </section>
            </>
          )}
        </section>
      </div>
    </section>
  );
}
