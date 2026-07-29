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

const MAX_PROOF_SIZE = 100 * 1024 * 1024;
const PROOF_DATABASE = 'autiqo-proof-files';
const PROOF_STORE = 'files';

function openProofDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(PROOF_DATABASE, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(PROOF_STORE)) {
        request.result.createObjectStore(PROOF_STORE, { keyPath: 'id' });
      }
    };
  });
}

async function storeProofFiles(files) {
  const database = await openProofDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(PROOF_STORE, 'readwrite');
    const store = transaction.objectStore(PROOF_STORE);
    files.forEach((file) => store.put(file));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  database.close();
}

async function getProofFile(id) {
  const database = await openProofDatabase();
  const record = await new Promise((resolve, reject) => {
    const request = database.transaction(PROOF_STORE, 'readonly').objectStore(PROOF_STORE).get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return record;
}

function formatDate(value) {
  if (!value) return '';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.ceil(bytes / 1024))} KB`;
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

  const [proofDate, setProofDate] = useState('');
  const [proofFiles, setProofFiles] = useState([]);
  const [proofError, setProofError] = useState('');
  const [proofSaved, setProofSaved] = useState(false);
  const [proofSubmitting, setProofSubmitting] = useState(false);

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

  function chooseProofFiles(event) {
    const files = Array.from(event.target.files || []);
    setProofError('');
    setProofSaved(false);

    const oversizedFile = files.find((file) => file.size > MAX_PROOF_SIZE);
    if (oversizedFile) {
      setProofFiles([]);
      setProofError(`${oversizedFile.name} is larger than 100 MB.`);
      event.target.value = '';
      return;
    }

    setProofFiles(files);
  }

  async function submitProof(event) {
    event.preventDefault();
    setProofError('');

    if (!proofDate || proofFiles.length === 0) {
      setProofError('Select a work date and choose at least one file.');
      return;
    }

    setProofSubmitting(true);
    try {
      const submissionId = `proof-${Date.now()}`;
      const storedFiles = proofFiles.map((file, index) => ({
        id: `${submissionId}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        blob: file
      }));
      await storeProofFiles(storedFiles);

      const submission = {
        id: submissionId,
        period: proofDate,
        fileName: proofFiles.length === 1 ? proofFiles[0].name : `${proofFiles.length} files`,
        files: storedFiles.map(({ blob, ...file }) => file),
        submittedAt: new Date().toISOString()
      };

      onUpdateUser({
        proofSubmissions: [submission, ...proofSubmissions]
      });
      setProofDate('');
      setProofFiles([]);
      event.target.reset();
      setProofSaved(true);
      window.setTimeout(() => setProofSaved(false), 2600);
    } catch {
      setProofError('The selected files could not be saved. Check browser storage and try again.');
    } finally {
      setProofSubmitting(false);
    }
  }

  async function downloadProofFile(file) {
    try {
      const record = await getProofFile(file.id);
      if (!record?.blob) throw new Error('File not found');
      const url = URL.createObjectURL(record.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setProofError(`${file.name} is not available in this browser.`);
    }
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
          <p>Submit one or more files for a selected work date. This does not change your profile.</p>
        </header>

        <form className="staff-form-card staff-proof-form" onSubmit={submitProof}>
          <div className="staff-form-section">
            <div>
              <h2>New submission</h2>
              <p>PDF, Word document, or image. Maximum file size is 100 MB.</p>
            </div>
            <div className="staff-form-fields">
              <label>
                Work date
                <input
                  type="date"
                  required
                  value={proofDate}
                  onChange={(event) => setProofDate(event.target.value)}
                />
              </label>
              <label className="staff-file-picker">
                <Upload size={20} />
                <span>
                  <strong>{proofFiles.length ? `${proofFiles.length} file${proofFiles.length === 1 ? '' : 's'} selected` : 'Choose files'}</strong>
                  <small>{proofFiles.length ? `${formatFileSize(proofFiles.reduce((total, file) => total + file.size, 0))} total` : 'PDF, DOC, DOCX, PNG, or JPG'}</small>
                </span>
                <input type="file" multiple accept="image/png,image/jpeg,.pdf,.doc,.docx" onChange={chooseProofFiles} />
              </label>
              {proofFiles.length > 0 && (
                <div className="staff-selected-files">
                  {proofFiles.map((file) => (
                    <span key={`${file.name}-${file.lastModified}`}>
                      <FileText size={15} />
                      <strong>{file.name}</strong>
                      <small>{formatFileSize(file.size)}</small>
                    </span>
                  ))}
                </div>
              )}
              {proofError && <p className="staff-form-error">{proofError}</p>}
            </div>
          </div>
          <div className="staff-form-footer">
            {proofSaved && <span className="staff-inline-success"><Check size={16} /> Proof saved</span>}
            <button className="btn-primary" type="submit" disabled={proofSubmitting}>
              {proofSubmitting ? 'Saving files...' : 'Submit proof'}
            </button>
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
                    <strong>{formatDate(submission.period)}</strong>
                    <p>{submission.files?.length ? `${submission.files.length} file${submission.files.length === 1 ? '' : 's'}` : submission.note || submission.fileName}</p>
                  </div>
                  <div className="staff-proof-meta">
                    <span>{formatDate(submission.submittedAt)}</span>
                    {submission.files?.length ? (
                      <div className="staff-proof-downloads">
                        {submission.files.map((file) => (
                          <button type="button" key={file.id} onClick={() => downloadProofFile(file)}>
                            Download {file.name}
                          </button>
                        ))}
                      </div>
                    ) : submission.fileData ? (
                      <a href={submission.fileData} download={submission.fileName}>Download {submission.fileName}</a>
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
          <span className="staff-avatar">
            {currentUser.profilePhoto ? (
              <img src={currentUser.profilePhoto} alt="" />
            ) : name ? name.charAt(0).toUpperCase() : <UserRound size={18} />}
          </span>
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
                  <strong>{formatDate(proofSubmissions[0].period)}</strong>
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
