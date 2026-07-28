import React, { useMemo, useState } from 'react';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  CheckCircle, 
  Copy, 
  CreditCard, 
  FileText, 
  FileUp, 
  History, 
  ListTodo, 
  PlusCircle, 
  Save, 
  ShieldCheck, 
  Upload, 
  User, 
  Wallet 
} from 'lucide-react';

export default function StaffDashboard({ activeTab, setActiveTab, currentUser = {}, onUpdateUser = () => {} }) {
  const [name, setName] = useState(currentUser.profile?.name || currentUser.name || '');
  const [work, setWork] = useState(currentUser.profile?.work || '');
  const [phone, setPhone] = useState(currentUser.profile?.phone || '');
  const [currentTask, setCurrentTask] = useState(currentUser.profile?.currentTask || '');
  const [proof, setProof] = useState(currentUser.profile?.proof || '');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState('');

  const walletAddress = currentUser.wallet?.address || '';
  const usdcBalance = currentUser.usdcBalance || '0.00';
  const tasks = currentUser.tasks || [];
  const profileComplete = useMemo(() => Boolean(name && work), [name, work]);

  // Mock transaction history for realistic financial dashboard UI
  const [history, setHistory] = useState([
    { id: 'tx-1', type: 'Deposit', amount: '+ 500.00 USDC', date: '2026-07-20', status: 'Completed' },
    { id: 'tx-2', type: 'Salary Payout', amount: '+ 1,250.00 USDC', date: '2026-07-15', status: 'Completed' }
  ]);

  function saveProfile(event) {
    event.preventDefault();
    onUpdateUser({ 
      name, 
      profile: { ...currentUser.profile, name, work, phone, currentTask, proof } 
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  function handleCopyWallet() {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleWithdrawSubmit(e) {
    e.preventDefault();
    if (!withdrawAddress || !withdrawAmount) return;
    setTransactionSuccess(`Withdrawal request of ${withdrawAmount} USDC submitted.`);
    setHistory((prev) => [
      { id: `tx-${Date.now()}`, type: 'Withdrawal', amount: `- ${withdrawAmount} USDC`, date: new Date().toISOString().split('T')[0], status: 'Processing' },
      ...prev
    ]);
    setWithdrawAddress('');
    setWithdrawAmount('');
    setShowWithdrawModal(false);
    window.setTimeout(() => setTransactionSuccess(''), 4000);
  }

  if (activeTab === 'staff-profile') {
    return (
      <section className="staff-clean-page">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <User size={24} color="#0284c7" />
            <h2 style={{ margin: 0 }}>My Staff Profile</h2>
          </div>
          <p className="muted-copy">Fill in your full name, work role, current tasks, and biweekly work proof for admin review.</p>
          
          <form className="staff-profile-form" onSubmit={saveProfile} style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <label>
                Full Name *
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ezinne Agwu" />
              </label>
              <label>
                Work / Job Title *
                <input required value={work} onChange={(e) => setWork(e.target.value)} placeholder="e.g. Frontend Developer / Designer" />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <label>
                Phone Number
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
              </label>
              <label>
                Account Email
                <input value={currentUser.email || ''} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
              </label>
            </div>

            <label>
              Current Task / Project Summary
              <textarea rows={3} value={currentTask} onChange={(e) => setCurrentTask(e.target.value)} placeholder="Describe what you are currently working on..." />
            </label>

            <label>
              Upload Biweekly Proof of Work (Image / Document)
              <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={(e) => setProof(e.target.files?.[0]?.name || '')} />
            </label>

            {proof && (
              <div className="file-note" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', background: '#e0f2fe', padding: '10px', borderRadius: '8px' }}>
                <FileUp size={16} /> Selected Proof: <strong>{proof}</strong>
              </div>
            )}

            {saved && (
              <div className="success-note" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', background: '#dcfce7', padding: '12px', borderRadius: '8px', fontWeight: 700 }}>
                <CheckCircle size={18} /> Profile and proof submitted to Admin!
              </div>
            )}

            <button className="btn-primary" type="submit" style={{ justifySelf: 'start', padding: '10px 24px' }}>
              <Save size={17} /> Save Profile Details
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="staff-clean-page" style={{ display: 'grid', gap: '24px' }}>
      {/* Header Banner */}
      <div className="staff-welcome" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', padding: '28px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, opacity: 0.9 }}>
            Staff Dashboard
          </span>
          <h1 style={{ margin: '4px 0 8px 0', fontSize: '1.8rem', color: '#ffffff' }}>
            Welcome{currentUser.name ? `, ${currentUser.name}` : ''}!
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
            Manage your Arc wallet, deposit/withdraw USDC, submit biweekly work proof, and view assigned tasks.
          </p>
        </div>

        {/* Action Buttons in Header */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => setShowDepositModal(true)} style={{ background: '#ffffff', color: '#0284c7', fontWeight: 700 }}>
            <ArrowDownRight size={18} /> Deposit
          </button>
          <button className="btn-primary" onClick={() => setShowWithdrawModal(true)} style={{ background: '#0f172a', borderColor: '#0f172a', color: '#ffffff', fontWeight: 700 }}>
            <ArrowUpRight size={18} /> Withdraw
          </button>
        </div>
      </div>

      {transactionSuccess && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '14px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> {transactionSuccess}
        </div>
      )}

      {/* Main Grid: Wallet & Balance Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Wallet & Balance Card */}
        <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wallet size={24} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Arc Web3 Wallet</h3>
            </div>
            <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
              ARC-TESTNET
            </span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
              USDC Balance
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              ${usdcBalance} <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>USDC</span>
            </div>
          </div>

          {/* Wallet Address Box */}
          <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Your Wallet Address</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', fontFamily: 'monospace', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {walletAddress || 'Generating Arc wallet...'}
              </div>
            </div>
            {walletAddress && (
              <button onClick={handleCopyWallet} style={{ background: copied ? '#dcfce7' : '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, color: copied ? '#166534' : '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          {/* Action Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
            <button className="btn-secondary" onClick={() => setShowDepositModal(true)} style={{ justifyContent: 'center' }}>
              <ArrowDownRight size={16} /> Deposit USDC
            </button>
            <button className="btn-primary" onClick={() => setShowWithdrawModal(true)} style={{ justifyContent: 'center' }}>
              <ArrowUpRight size={16} /> Withdraw
            </button>
          </div>
        </div>

        {/* Profile Completion Shortcut Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <User size={24} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Profile & Work Proof</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '16px' }}>
              {profileComplete 
                ? 'Your profile details are complete. Keep your biweekly work proof updated.' 
                : 'Please complete your profile details and upload your work proof so the admin can review.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Profile Status:</span>
                <strong style={{ color: profileComplete ? '#166534' : '#d97706' }}>
                  {profileComplete ? 'Complete' : 'Incomplete'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Work Proof:</span>
                <strong>{proof ? proof : 'No file uploaded yet'}</strong>
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={() => setActiveTab('staff-profile')} style={{ marginTop: '20px', justifyContent: 'center' }}>
            <FileUp size={16} /> Fill / Edit My Profile
          </button>
        </div>
      </div>

      {/* Transaction History & Assigned Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Transaction History */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <History size={20} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Transaction History</h3>
          </div>
          {history.length === 0 ? (
            <p className="muted-copy">No recent transactions recorded.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map((tx) => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a' }}>{tx.type}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.date}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ display: 'block', fontSize: '0.95rem', color: tx.amount.startsWith('+') ? '#166534' : '#0f172a' }}>{tx.amount}</strong>
                    <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Tasks */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <ListTodo size={20} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Assigned Tasks</h3>
          </div>
          {tasks.length === 0 ? (
            <p className="muted-copy">No tasks have been assigned by admin yet.</p>
          ) : (
            tasks.map((task) => (
              <div className="task-row" key={task.id || task.title} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <strong>{task.title}</strong>
                <span style={{ fontSize: '0.8rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>{task.status || 'Open'}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', maxWidth: '460px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Deposit USDC</h3>
              <button onClick={() => setShowDepositModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '16px' }}>
              Send Arc USDC to your dedicated wallet address below:
            </p>
            <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', marginBottom: '16px', fontWeight: 700 }}>
              {walletAddress || '0x20658b2bbc6abbea3bdb5912b2062a84695fbb85'}
            </div>
            <button className="btn-primary" onClick={handleCopyWallet} style={{ width: '100%', justifyContent: 'center' }}>
              <Copy size={16} /> {copied ? 'Copied Address' : 'Copy Deposit Address'}
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', maxWidth: '460px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Withdraw USDC</h3>
              <button onClick={() => setShowWithdrawModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleWithdrawSubmit} style={{ display: 'grid', gap: '14px' }}>
              <label>
                Destination Wallet Address
                <input required value={withdrawAddress} onChange={(e) => setWithdrawAddress(e.target.value)} placeholder="0x..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </label>
              <label>
                Amount (USDC)
                <input required type="number" step="any" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </label>
              <button className="btn-primary" type="submit" style={{ justifyContent: 'center', marginTop: '10px' }}>
                Confirm Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
