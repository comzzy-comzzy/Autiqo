import React, { useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  BriefcaseBusiness,
  Check,
  CircleDollarSign,
  ClipboardList,
  Copy,
  FileCheck2,
  FileText,
  Inbox,
  ShieldCheck,
  Upload,
  UserRound,
  Wallet,
  X
} from 'lucide-react';

const MAX_PROOF_SIZE = 2 * 1024 * 1024;

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="staff-empty-state">
      <span className="staff-empty-icon"><Icon size={20} /></span>
      <strong>{title}</strong>
      <p>{children}</p>
    </div>
  );
}

export default function StaffDashboard({
  activeTab,
  setActiveTab,
  currentUser = {},
  ledger = [],
  onUpdateUser = () => {}
}) {
  const profile = currentUser.profile || {};
  const [name, setName] = useState(profile.name || currentUser.name || '');
  const [work, setWork] = useState(profile.work || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [currentTask, setCurrentTask] = useState(profile.currentTask || '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [walletAction, setWalletAction] = useState(null);

  const [proofPeriod, setProofPeriod] = useState('');
  const [proofNote, setProofNote] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofError, setProofError] = useState('');
  const [proofSaved, setProofSaved] = useState(false);

  const walletAddress = currentUser.wallet?.address || '';
  const walletReady = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
  const balanceAvailable = currentUser.usdcBalance !== null && currentUser.usdcBalance !== undefined;
  const proofSubmissions = currentUser.proofSubmissions || [];
  const tasks = currentUser.tasks || [];

  const profileComplete = Boolean(name.trim() && work.trim());
  const userTransactions = useMemo(() => (
    ledger.filter((entry) => {
      const actor = String(entry.actor || '').toLowerCase();
      const recipient = String(entry.wallet || entry.recipient || '').toLowerCase();
      return (
        (name && actor === name.toLowerCase()) ||
        (walletAddress && recipient === walletAddress.toLowerCase())
      );
    })
  ), [ledger, name, walletAddress]);

  function saveProfile(event) {
    event.preventDefault();
    onUpdateUser({
      name: name.trim(),
      profile: {
        ...profile,
        name: name.trim(),
        work: work.trim(),
        phone: phone.trim(),
        currentTask: currentTask.trim()
      }
    });
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 2200);
  }

  function chooseProofFile(event) {
    const file = event.target.files?.[0] || null;
    setProofError('');
    setProofSaved(false);

    if (file && file.size > MAX_PROOF_SIZE) {
      setProofFile(null);
      setProofError('Choose a file smaller than 2 MB.');
      event.target.value = '';
      return;
    }

    setProofFile(file);
  }

  function submitProof(event) {
    event.preventDefault();
    setProofError('');

    if (!proofPeriod || !proofFile) {
      setProofError('Add the reporting period and choose a file.');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setProofError('This file could not be read. Please choose it again.');
    reader.onload = () => {
      const submission = {
        id: `proof-${Date.now()}`,
        period: proofPeriod,
        note: proofNote.trim(),
        fileName: proofFile.name,
        fileType: proofFile.type,
        fileSize: proofFile.size,
        fileData: reader.result,
        submittedAt: new Date().toISOString()
      };

      onUpdateUser({
        proofSubmissions: [submission, ...proofSubmissions]
      });
      setProofPeriod('');
      setProofNote('');
      setProofFile(null);
      event.target.reset();
      setProofSaved(true);
      window.setTimeout(() => setProofSaved(false), 2600);
    };
    reader.readAsDataURL(proofFile);
  }

  async function copyWallet() {
    if (!walletReady) return;
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (activeTab === 'staff-profile') {
    return (
      <section className="staff-page staff-narrow-page">
        <header className="staff-page-header">
          <button className="staff-back-link" type="button" onClick={() => setActiveTab('staff-overview')}>
            Overview
          </button>
          <p className="staff-eyebrow">Account</p>
          <h1>Your profile</h1>
          <p>Keep your contact details and current role accurate. Work evidence is submitted separately.</p>
        </header>

        <form className="staff-form-card" onSubmit={saveProfile}>
          <div className="staff-form-section">
            <div>
              <h2>Personal details</h2>
              <p>Information your employer uses to identify and contact you.</p>
            </div>
            <div className="staff-form-fields">
              <label>
                Full name
                <input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
              </label>
              <label>
                Work email
                <input value={currentUser.email || ''} disabled />
                <small>Your sign-in email cannot be changed here.</small>
              </label>
              <label>
                Phone number
                <input value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="Add a phone number" />
              </label>
            </div>
          </div>

          <div className="staff-form-section">
            <div>
              <h2>Work details</h2>
              <p>Your role and the work currently on your desk.</p>
            </div>
            <div className="staff-form-fields">
              <label>
                Job title
                <input required value={work} onChange={(event) => setWork(event.target.value)} placeholder="Add your job title" />
              </label>
              <label>
                Current focus
                <textarea rows={4} value={currentTask} onChange={(event) => setCurrentTask(event.target.value)} placeholder="What are you working on right now?" />
              </label>
            </div>
          </div>

          <div className="staff-form-footer">
            {profileSaved && <span className="staff-inline-success"><Check size={16} /> Profile saved</span>}
            <button className="btn-primary" type="submit">Save changes</button>
          </div>
        </form>
      </section>
    );
  }

  if (activeTab === 'staff-work-proof') {
    return (
      <section className="staff-page staff-narrow-page">
        <header className="staff-page-header">
          <button className="staff-back-link" type="button" onClick={() => setActiveTab('staff-overview')}>
            Overview
          </button>
          <p className="staff-eyebrow">Work records</p>
          <h1>Proof of work</h1>
          <p>Submit a file for a completed reporting period. This does not change your profile.</p>
        </header>

        <form className="staff-form-card staff-proof-form" onSubmit={submitProof}>
          <div className="staff-form-section">
            <div>
              <h2>New submission</h2>
              <p>PDF, Word document, or image. Maximum file size is 2 MB.</p>
            </div>
            <div className="staff-form-fields">
              <label>
                Reporting period
                <input
                  required
                  value={proofPeriod}
                  onChange={(event) => setProofPeriod(event.target.value)}
                  placeholder="For example, 15–28 July 2026"
                />
              </label>
              <label>
                Note <span className="staff-optional">Optional</span>
                <textarea
                  rows={3}
                  value={proofNote}
                  onChange={(event) => setProofNote(event.target.value)}
                  placeholder="Add context for your reviewer"
                />
              </label>
              <label className="staff-file-picker">
                <Upload size={20} />
                <span>
                  <strong>{proofFile ? proofFile.name : 'Choose a file'}</strong>
                  <small>{proofFile ? `${Math.ceil(proofFile.size / 1024)} KB selected` : 'PDF, DOC, DOCX, PNG, or JPG'}</small>
                </span>
                <input type="file" accept="image/png,image/jpeg,.pdf,.doc,.docx" onChange={chooseProofFile} />
              </label>
              {proofError && <p className="staff-form-error">{proofError}</p>}
            </div>
          </div>
          <div className="staff-form-footer">
            {proofSaved && <span className="staff-inline-success"><Check size={16} /> Proof saved</span>}
            <button className="btn-primary" type="submit">Submit proof</button>
          </div>
        </form>

        <section className="staff-list-section">
          <div className="staff-section-heading">
            <div>
              <p className="staff-eyebrow">History</p>
              <h2>Previous submissions</h2>
            </div>
            <span>{proofSubmissions.length}</span>
          </div>
          {proofSubmissions.length === 0 ? (
            <EmptyState icon={FileText} title="No proof submitted">
              Your submitted files will appear here.
            </EmptyState>
          ) : (
            <div className="staff-proof-list">
              {proofSubmissions.map((submission) => (
                <article className="staff-proof-row" key={submission.id}>
                  <span className="staff-row-icon"><FileCheck2 size={19} /></span>
                  <div>
                    <strong>{submission.period}</strong>
                    <p>{submission.note || submission.fileName}</p>
                  </div>
                  <div className="staff-proof-meta">
                    <span>{formatDate(submission.submittedAt)}</span>
                    {submission.fileData ? (
                      <a href={submission.fileData} download={submission.fileName}>Download</a>
                    ) : (
                      <span>{submission.fileName}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    );
  }

  if (activeTab === 'staff-payout-details') {
    return (
      <section className="staff-page staff-narrow-page">
        <header className="staff-page-header">
          <button className="staff-back-link" type="button" onClick={() => setActiveTab('staff-overview')}>
            Overview
          </button>
          <p className="staff-eyebrow">Payouts</p>
          <h1>Your wallet</h1>
          <p>Use this address to receive Arc USDC. The balance shown comes from your connected Circle wallet.</p>
        </header>

        <div className="staff-wallet-shell">
          <section className="staff-wallet-balance-card">
            <div className="staff-wallet-topline">
              <span className="staff-wallet-mark"><Wallet size={19} /></span>
              <span>Arc USDC wallet</span>
              <span className={`staff-wallet-connection ${walletReady ? 'is-ready' : ''}`}>
                <i /> {walletReady ? 'Connected' : 'Not connected'}
              </span>
            </div>

            <div className="staff-wallet-balance">
              <span>Available balance</span>
              <strong>
                {balanceAvailable ? currentUser.usdcBalance : '—'}
                <small>USDC</small>
              </strong>
            </div>

            <div className="staff-wallet-actions">
              <button type="button" onClick={() => setWalletAction('deposit')}>
                <ArrowDownToLine size={18} />
                <span>
                  <strong>Deposit</strong>
                  <small>Receive USDC</small>
                </span>
              </button>
              <button type="button" onClick={() => setWalletAction('withdraw')}>
                <ArrowUpFromLine size={18} />
                <span>
                  <strong>Withdraw</strong>
                  <small>Send USDC</small>
                </span>
              </button>
            </div>
          </section>

          <section className="staff-wallet-details-card">
            <div className="staff-wallet-details-heading">
              <div>
                <p className="staff-eyebrow">Wallet details</p>
                <h2>Deposit address</h2>
              </div>
              <span>ARC-TESTNET</span>
            </div>
            <div className="staff-wallet-address">
              <code>{walletReady ? walletAddress : 'No wallet address is available for this account.'}</code>
              <button type="button" onClick={copyWallet} disabled={!walletReady}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="staff-wallet-facts">
              <div>
                <CircleDollarSign size={17} />
                <span><small>Asset</small><strong>USDC</strong></span>
              </div>
              <div>
                <ShieldCheck size={17} />
                <span><small>Wallet provider</small><strong>Circle</strong></span>
              </div>
            </div>
          </section>
        </div>

        <section className="staff-list-section">
          <div className="staff-section-heading">
            <div>
              <p className="staff-eyebrow">Activity</p>
              <h2>Payment history</h2>
            </div>
          </div>
          {userTransactions.length === 0 ? (
            <EmptyState icon={Inbox} title="No payments recorded">
              Payments linked to your name or wallet will appear here.
            </EmptyState>
          ) : (
            <div className="staff-transaction-list">
              {userTransactions.map((transaction) => (
                <article className="staff-transaction-row" key={transaction.id}>
                  <div>
                    <strong>{transaction.type}</strong>
                    <span>{transaction.date}</span>
                  </div>
                  <div>
                    <strong>{transaction.amount}</strong>
                    <span>{transaction.status}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {walletAction && (
          <div className="staff-wallet-modal-backdrop" role="presentation" onMouseDown={() => setWalletAction(null)}>
            <section
              className="staff-wallet-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="wallet-action-title"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button className="staff-wallet-modal-close" type="button" onClick={() => setWalletAction(null)} aria-label="Close">
                <X size={18} />
              </button>

              {walletAction === 'deposit' ? (
                <>
                  <span className="staff-wallet-modal-icon deposit"><ArrowDownToLine size={22} /></span>
                  <p className="staff-eyebrow">Receive funds</p>
                  <h2 id="wallet-action-title">Deposit USDC</h2>
                  <p>Send Arc USDC to the wallet address below. Other networks or unsupported assets may not arrive.</p>
                  <div className="staff-wallet-modal-address">
                    <span>ARC-TESTNET</span>
                    <code>{walletReady ? walletAddress : 'Wallet address unavailable'}</code>
                  </div>
                  <button className="staff-wallet-modal-primary" type="button" onClick={copyWallet} disabled={!walletReady}>
                    {copied ? <Check size={17} /> : <Copy size={17} />}
                    {copied ? 'Address copied' : 'Copy deposit address'}
                  </button>
                </>
              ) : (
                <>
                  <span className="staff-wallet-modal-icon withdraw"><ArrowUpFromLine size={22} /></span>
                  <p className="staff-eyebrow">Send funds</p>
                  <h2 id="wallet-action-title">Withdraw USDC</h2>
                  <p>
                    Withdrawal is not enabled yet. A real Circle transaction approval flow must be connected before funds can be sent safely.
                  </p>
                  <div className="staff-wallet-unavailable">
                    <ShieldCheck size={18} />
                    <span>
                      <strong>No transaction will be created</strong>
                      <small>Your balance and wallet remain unchanged.</small>
                    </span>
                  </div>
                  <button className="staff-wallet-modal-secondary" type="button" onClick={() => setWalletAction(null)}>
                    Back to wallet
                  </button>
                </>
              )}
            </section>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="staff-page">
      <header className="staff-dashboard-header">
        <div>
          <p className="staff-eyebrow">Staff workspace</p>
          <h1>{name ? `Welcome back, ${name.split(' ')[0]}` : 'Welcome to your workspace'}</h1>
          <p>Review what needs your attention and keep your work records up to date.</p>
        </div>
        <button className="staff-profile-link" type="button" onClick={() => setActiveTab('staff-profile')}>
          <span className="staff-avatar">{name ? name.charAt(0).toUpperCase() : <UserRound size={18} />}</span>
          <span>
            <strong>{name || 'Complete your profile'}</strong>
            <small>{work || currentUser.email || 'No role added'}</small>
          </span>
          <ArrowRight size={17} />
        </button>
      </header>

      <div className="staff-attention-grid">
        <button type="button" onClick={() => setActiveTab('staff-profile')}>
          <span className="staff-action-icon"><UserRound size={20} /></span>
          <span>
            <small>Profile</small>
            <strong>{profileComplete ? 'Details are up to date' : 'Complete your details'}</strong>
          </span>
          <span className={`staff-status ${profileComplete ? 'is-ready' : ''}`}>
            {profileComplete ? 'Complete' : 'Action needed'}
          </span>
        </button>
        <button type="button" onClick={() => setActiveTab('staff-work-proof')}>
          <span className="staff-action-icon"><FileCheck2 size={20} /></span>
          <span>
            <small>Proof of work</small>
            <strong>{proofSubmissions.length ? 'View your submissions' : 'Submit your first work record'}</strong>
          </span>
          <ArrowRight size={18} />
        </button>
        <button type="button" onClick={() => setActiveTab('staff-payout-details')}>
          <span className="staff-action-icon"><Wallet size={20} /></span>
          <span>
            <small>Payout wallet</small>
            <strong>{walletReady ? 'Wallet connected' : 'Wallet unavailable'}</strong>
          </span>
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="staff-overview-grid">
        <section className="staff-list-section">
          <div className="staff-section-heading">
            <div>
              <p className="staff-eyebrow">Work</p>
              <h2>Assigned tasks</h2>
            </div>
            <span>{tasks.length}</span>
          </div>
          {tasks.length === 0 ? (
            <EmptyState icon={ClipboardList} title="Nothing assigned">
              Tasks assigned by your employer will appear here.
            </EmptyState>
          ) : (
            <div className="staff-task-list">
              {tasks.map((task) => (
                <article className="staff-task-row" key={task.id || task.title}>
                  <span className="staff-row-icon"><BriefcaseBusiness size={18} /></span>
                  <div>
                    <strong>{task.title}</strong>
                    {task.description && <p>{task.description}</p>}
                  </div>
                  <span className="staff-status">{task.status || 'Open'}</span>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="staff-side-panel">
          <p className="staff-eyebrow">Latest record</p>
          <h2>Proof of work</h2>
          {proofSubmissions.length === 0 ? (
            <>
              <p>No work proof has been submitted from this account.</p>
              <button className="btn-secondary" type="button" onClick={() => setActiveTab('staff-work-proof')}>
                Add proof of work
              </button>
            </>
          ) : (
            <>
              <div className="staff-latest-proof">
                <FileCheck2 size={20} />
                <div>
                  <strong>{proofSubmissions[0].period}</strong>
                  <span>Submitted {formatDate(proofSubmissions[0].submittedAt)}</span>
                </div>
              </div>
              <button className="btn-secondary" type="button" onClick={() => setActiveTab('staff-work-proof')}>
                View submissions
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
