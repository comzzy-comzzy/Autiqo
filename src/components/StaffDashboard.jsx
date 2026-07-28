import React, { useMemo, useState } from 'react';
import { CheckCircle, FileUp, ListTodo, Save, Upload, Wallet } from 'lucide-react';

export default function StaffDashboard({ activeTab, setActiveTab, currentUser = {}, onUpdateUser = () => {} }) {
  const [name, setName] = useState(currentUser.profile?.name || currentUser.name || '');
  const [work, setWork] = useState(currentUser.profile?.work || '');
  const [phone, setPhone] = useState(currentUser.profile?.phone || '');
  const [currentTask, setCurrentTask] = useState(currentUser.profile?.currentTask || '');
  const [proof, setProof] = useState(currentUser.profile?.proof || '');
  const [saved, setSaved] = useState(false);
  const walletAddress = currentUser.wallet?.address || '';
  const tasks = currentUser.tasks || [];
  const profileComplete = useMemo(() => Boolean(name && work), [name, work]);

  function saveProfile(event) {
    event.preventDefault();
    onUpdateUser({ name, profile: { ...currentUser.profile, name, work, phone, currentTask, proof } });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  if (activeTab === 'staff-profile') {
    return <section className="staff-clean-page"><div className="card"><h2>My profile</h2><p className="muted-copy">Keep your staff details and work records up to date.</p>
      <form className="staff-profile-form" onSubmit={saveProfile}>
        <label>Full name<input required value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>Work / role<input required value={work} onChange={(e) => setWork(e.target.value)} placeholder="e.g. Product designer" /></label>
        <label>Phone number<input value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
        <label>Current task<textarea value={currentTask} onChange={(e) => setCurrentTask(e.target.value)} placeholder="What are you currently working on?" /></label>
        <label>Proof of work<input type="file" accept="image/*,.pdf,.doc,.docx" onChange={(e) => setProof(e.target.files?.[0]?.name || '')} /></label>
        {proof && <div className="file-note"><FileUp size={16} /> {proof}</div>}
        {saved && <div className="success-note"><CheckCircle size={16} /> Profile submitted to admin.</div>}
        <button className="btn-primary" type="submit"><Save size={17} /> Save profile</button>
      </form>
    </div></section>;
  }

  if (activeTab === 'staff-payout-details') {
    return <section className="staff-clean-page"><div className="card"><h2>Wallet address</h2><p className="muted-copy">This is the wallet recovered through your sign-in email.</p><div className="wallet-address-panel"><Wallet size={22} /><strong>{walletAddress || 'Wallet address is not available yet.'}</strong></div><small>{currentUser.wallet?.blockchain || 'ARC-TESTNET'}</small></div></section>;
  }

  if (activeTab === 'staff-payslips') {
    return <section className="staff-clean-page"><div className="card"><h2>Work proof</h2><p className="muted-copy">Upload proof of your work every two weeks from My profile.</p><button className="btn-primary" onClick={() => setActiveTab('staff-profile')}><Upload size={17} /> Upload proof</button></div></section>;
  }

  return <section className="staff-clean-page">
    <div className="staff-welcome"><div><span className="section-kicker">Staff dashboard</span><h1>Welcome{currentUser.name ? `, ${currentUser.name}` : ''}</h1><p>Complete your profile, submit biweekly work proof, and view tasks assigned by admin.</p></div><div className="staff-wallet-mini"><Wallet size={20} /><span>{walletAddress || 'Wallet pending'}</span></div></div>
    <div className="staff-summary-grid"><button className="card staff-summary-card" onClick={() => setActiveTab('staff-profile')}><FileUp size={22} /><strong>{profileComplete ? 'Profile complete' : 'Complete your profile'}</strong><span>{profileComplete ? 'Update your details anytime.' : 'Add your name and work.'}</span></button><button className="card staff-summary-card" onClick={() => setActiveTab('staff-profile')}><Upload size={22} /><strong>{proof ? 'Proof submitted' : 'Submit biweekly proof'}</strong><span>{proof || 'Upload your latest work evidence.'}</span></button><button className="card staff-summary-card" onClick={() => setActiveTab('staff-payout-details')}><Wallet size={22} /><strong>Wallet address</strong><span>{walletAddress || 'Not available yet'}</span></button></div>
    <div className="card"><h2><ListTodo size={20} /> Assigned tasks</h2>{tasks.length === 0 ? <p className="muted-copy">No tasks have been assigned yet.</p> : tasks.map((task) => <div className="task-row" key={task.id || task.title}><strong>{task.title}</strong><span>{task.status || 'Open'}</span></div>)}</div>
  </section>;
}
