import React, { useState } from 'react';
import {
  Banknote,
  Bell,
  Building2,
  Globe,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Users,
  Wallet,
  Zap,
  ArrowRight,
  Check
} from 'lucide-react';
import NavigationDrawer from './components/NavigationDrawer';
import PayrollWizard from './components/PayrollWizard';
import StaffDashboard from './components/StaffDashboard';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';

function toStaffRecord(user) {
  return {
    ...user,
    proofSubmissions: (user.proofSubmissions || []).map(({ fileData, ...submission }) => submission)
  };
}

function PublicLanding({ onOpenAuth, isAdminRoute }) {
  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="public-hero-media" aria-hidden="true">
          <img src="/african3.png" alt="" />
        </div>
        <div className="public-hero-shade" aria-hidden="true" />
        <div className="public-hero-inner">
          <div className="public-hero-copy">
            <div className="public-badge">Workforce operations across Africa</div>
            <h1>One place to run payroll and support your people.</h1>
            <p>
              Autiqo brings employee records, payroll preparation, statutory deductions,
              and contractor payouts into a clear, controlled workflow.
            </p>
            <div className="public-hero-actions">
              <button className="public-primary-action" onClick={onOpenAuth}>
                {isAdminRoute ? 'Access employer portal' : 'Access your workspace'}
                <ArrowRight size={18} />
              </button>
              {!isAdminRoute && (
                <a className="public-secondary-action" href="/admin">
                  Employer sign in
                </a>
              )}
            </div>
            <div className="public-trust-row" aria-label="Autiqo product capabilities">
              <span><Check size={15} /> Employee records</span>
              <span><Check size={15} /> Payroll controls</span>
              <span><Check size={15} /> Payout tracking</span>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section public-problem">
        <div>
          <span className="section-kicker">Built for the work behind payday</span>
          <h2>Keep every payroll decision connected to the right record.</h2>
        </div>
        <p>
          From onboarding a new employee to reviewing a completed payment, Autiqo gives
          operators a consistent process and gives employees a dependable place to find
          the information that matters to them.
        </p>
      </section>

      <section className="public-feature-grid">
        <article className="public-feature-card">
          <Building2 size={22} />
          <span>01</span>
          <h3>Maintain a reliable workforce record</h3>
          <p>Keep employment details, compensation, documents, and payout information together.</p>
        </article>
        <article className="public-feature-card">
          <Banknote size={22} />
          <span>02</span>
          <h3>Prepare payroll with oversight</h3>
          <p>Review earnings and deductions before approving a payroll run for payment.</p>
        </article>
        <article className="public-feature-card">
          <ShieldCheck size={22} />
          <span>03</span>
          <h3>Give people a clearer experience</h3>
          <p>Employees can view pay information, manage their profile, and follow payout activity.</p>
        </article>
      </section>

      <section className="public-split-section">
        <div className="public-split-copy">
          <span className="section-kicker">Separate access, shared records</span>
          <h2>A focused workspace for every role.</h2>
          <p>
            Employer tools and employee information stay distinct, while the underlying
            records remain connected. Each person sees the work that belongs to them.
          </p>
          <button className="public-text-action" onClick={onOpenAuth}>
            Continue to secure sign in <ArrowRight size={17} />
          </button>
        </div>
        <div className="protected-list">
          <div>
            <LockKeyhole size={19} />
            <span><strong>Employer workspace</strong>People, payroll, deductions, and payment review</span>
          </div>
          <div>
            <Users size={19} />
            <span><strong>Employee workspace</strong>Pay details, personal records, and payout activity</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');
  const [activeTab, setActiveTab] = useState(isAdminRoute ? 'dashboard' : 'staff-overview');
  const [userRole, setUserRole] = useState(isAdminRoute ? 'admin' : 'staff');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', email: '', company: '', profile: {}, tasks: [] });

  const [workers, setWorkers] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [staffRecords, setStaffRecords] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('autiqo.staffRecords') || '[]'); } catch { return []; }
  });

  React.useEffect(() => {
    window.localStorage.setItem('autiqo.staffRecords', JSON.stringify(staffRecords));
  }, [staffRecords]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userPayload) => {
    setUserRole(userPayload.role);
    setCurrentUser({
      name: userPayload.name,
      email: userPayload.email,
      company: userPayload.company,
      wallet: userPayload.wallet,
      authProvider: userPayload.authProvider,
      usdcBalance: userPayload.usdcBalance
    });
    const savedProfile = window.localStorage.getItem(`autiqo.profile.${userPayload.email.toLowerCase()}`);
    if (savedProfile) {
      const saved = JSON.parse(savedProfile);
      setCurrentUser((previous) => ({
        ...previous,
        name: saved.name || previous.name,
        profile: saved.profile || {},
        proofSubmissions: saved.proofSubmissions || [],
        tasks: saved.tasks || []
      }));
    }
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setActiveTab(userPayload.role === 'admin' ? 'dashboard' : 'staff-overview');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsDrawerOpen(false);
    setShowProfileModal(false);
    setActiveTab('staff-overview');
  };

  const openAuth = () => setShowAuthModal(true);

  return (
    <>
      <div className={`splash-container ${!showSplash ? 'slide-out' : ''}`}>
        <img src="/logo-icon.png" alt="Autiqo Logo" className="splash-logo" />
        <h1 className="splash-title">Autiqo</h1>
        <p className="splash-subtitle">Payroll and workforce operations</p>
      </div>

      {showAuthModal && (
        <AuthModal
          onLogin={handleLogin}
          onClose={() => setShowAuthModal(false)}
          initialAccountType={isAdminRoute ? 'client' : 'contractor'}
          adminOnly={isAdminRoute}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          currentUser={currentUser}
          userRole={userRole}
          onClose={() => setShowProfileModal(false)}
          onUpdateUser={(updated) => {
            const nextUser = { ...currentUser, ...updated };
            setCurrentUser(nextUser);
            if (nextUser.email) {
              window.localStorage.setItem(`autiqo.profile.${nextUser.email.toLowerCase()}`, JSON.stringify(nextUser));
              setStaffRecords((records) => records.some((record) => record.email === nextUser.email)
                ? records.map((record) => record.email === nextUser.email ? toStaffRecord(nextUser) : record)
                : [...records, toStaffRecord(nextUser)]);
            }
          }}
        />
      )}

      <div className="app-container">
        <header className="top-nav">
          <div className="nav-left">
            {isAuthenticated && (
              <button className="menu-toggle" onClick={() => setIsDrawerOpen(true)} title="Open Navigation Menu">
                <Menu size={24} />
              </button>
            )}
            <div
              className="brand-logo-container"
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab(userRole === 'admin' ? 'dashboard' : 'staff-overview');
                }
              }}
            >
              <img src="/logo-icon.png" alt="Autiqo Logo" className="brand-logo-img" />
              <span className="brand-name">Autiqo</span>
            </div>
          </div>

          <div className="nav-right">
            {!isAuthenticated ? (
              <div className="public-nav-actions">
                {!isAdminRoute && <a href="/admin" className="nav-employer-link">For employers</a>}
                <button className="nav-cta" onClick={openAuth}>
                  Sign in <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <button
                  className="user-profile-btn"
                  onClick={() => setShowProfileModal(true)}
                  title="View Account Profile Settings"
                >
                  <div className="user-avatar">
                    {currentUser.name ? currentUser.name.split(' ').map((n) => n[0]).join('') : 'GU'}
                  </div>
                  <span className="user-name">{currentUser.name}</span>
                </button>

                <button
                  className="nav-icon-btn"
                  onClick={handleLogout}
                  title="Sign Out / Lock Workspace"
                >
                  <Bell size={18} />
                </button>
              </>
            )}
          </div>
        </header>

        {isAuthenticated && (
          <NavigationDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            workerCount={workers.length}
            userRole={userRole}
          />
        )}

        {isAuthenticated ? (
          <main className="main-wrapper">
            {userRole === 'staff' ? (
              <StaffDashboard
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                currentUser={currentUser}
                ledger={ledger}
                onUpdateUser={(updated) => {
                  const nextUser = { ...currentUser, ...updated };
                  setCurrentUser(nextUser);
                  if (nextUser.email) {
                    window.localStorage.setItem(`autiqo.profile.${nextUser.email.toLowerCase()}`, JSON.stringify(nextUser));
                    setStaffRecords((records) => records.some((record) => record.email === nextUser.email)
                      ? records.map((record) => record.email === nextUser.email ? toStaffRecord(nextUser) : record)
                      : [...records, toStaffRecord(nextUser)]);
                  }
                }}
              />
            ) : (
              <>
                <div className="hero-card employer-hero">
                  <div className="hero-text-side">
                    <div className="hero-welcome-badge">
                      <Zap size={16} color="#0284c7" /> Arc Testnet Web3 Autonomous Payroll Active
                    </div>
                    <h1 className="hero-heading">
                      Pay your African team in seconds. <span>Zero payment delay.</span>
                    </h1>
                    <p className="hero-subtext">
                      Automate salaries, statutory tax withholdings, and cross-border contractor payouts via <strong>Arc USDC</strong>.
                    </p>
                    <div className="hero-actions">
                      <button className="btn-primary" onClick={() => setActiveTab('payroll')}>
                        <Banknote size={18} /> Execute Payroll Run
                      </button>
                      <button className="btn-secondary" onClick={() => setActiveTab('arc-usdc')}>
                        <Wallet size={18} /> View Arc Disburser
                      </button>
                    </div>
                  </div>

                  <div className="hero-image-side">
                    <img src="/african1.png" alt="African Workforce Team 1" className="african-hero-img" />
                    <img src="/african2.png" alt="African Workforce Team 2" className="african-hero-img overlap" />
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><h3 className="card-title"><Users size={20} /> Staff submissions</h3></div>
                  {staffRecords.length === 0 ? <p className="muted-copy">No staff profiles or work proof have been submitted yet.</p> : staffRecords.map((record) => (
                    <div className="staff-record-row" key={record.email}>
                      <strong>{record.name || 'Unnamed staff'}</strong><span>{record.email}</span><span>{record.profile?.work || 'Profile incomplete'}</span><span>{record.profile?.currentTask || 'No current task'}</span><span>{record.proofSubmissions?.[0]?.period || 'No proof submitted'}</span><span>{record.wallet?.address || 'Wallet unavailable'}</span>
                    </div>
                  ))}
                </div>

                <div className="network-showcase">
                  <div className="network-copy">
                    <img src="/african3.png" alt="African Workforce Team 3" />
                    <div>
                      <div className="network-title">
                        Arc Testnet Web3 Disburser Active <span>Chain ID: 5042002</span>
                      </div>
                      <div className="network-desc">
                        Settling African workforce salaries via automated USDC smart contracts on Arc Testnet.
                      </div>
                    </div>
                  </div>
                  <span className="status-tag verified">
                    <ShieldCheck size={16} /> Arc Smart Contract Verified
                  </span>
                </div>

                <div className="quick-actions-grid">
                  <div className="quick-card" onClick={() => setActiveTab('payroll')}>
                    <div className="quick-icon-wrapper">
                      <Banknote size={24} />
                    </div>
                    <div>
                      <div className="quick-card-title">Run Monthly Payroll</div>
                      <div className="quick-card-desc">Execute batch Arc USDC payouts.</div>
                    </div>
                  </div>

                  <div className="quick-card" onClick={() => setActiveTab('people')}>
                    <div className="quick-icon-wrapper">
                      <Users size={24} />
                    </div>
                    <div>
                      <div className="quick-card-title">Worker Directory</div>
                      <div className="quick-card-desc">Add employees or contractors.</div>
                    </div>
                  </div>

                  <div className="quick-card" onClick={() => setActiveTab('arc-usdc')}>
                    <div className="quick-icon-wrapper arc">
                      <Wallet size={24} />
                    </div>
                    <div>
                      <div className="quick-card-title">Arc USDC Network Rail</div>
                      <div className="quick-card-desc">Circle wallet settlement rail.</div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div>
                    {activeTab === 'dashboard' || activeTab === 'payroll' || activeTab === 'people' ? (
                      <PayrollWizard workers={workers} setWorkers={setWorkers} ledger={ledger} setLedger={setLedger} />
                    ) : activeTab === 'arc-usdc' ? (
                      <div className="card arc-card">
                        <div className="card-header">
                          <h3 className="card-title">
                            <Wallet size={22} /> Arc USDC Web3 Rail
                          </h3>
                          <span className="arc-rail-badge">Arc Testnet Active</span>
                        </div>
                        <p>
                          Autiqo settles cross-border contractor salaries through user-controlled Circle wallets on <strong>Arc Testnet</strong>.
                        </p>
                        <div className="balance-display">
                          <div className="balance-item highlight">
                            <div className="currency-label">ARC WALLET STATUS</div>
                            <div className="balance-amount">Connected</div>
                          </div>
                          <div className="balance-item">
                            <div className="currency-label">NETWORK GAS FEE AVG</div>
                            <div className="balance-amount">&lt; $0.01</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="card">
                        <h3 className="card-title">View Selected</h3>
                        <p className="muted-copy">Module active.</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title sidebar-title">
                          <Globe size={18} color="#0284c7" /> Arc Testnet Web3 Rails
                        </h3>
                      </div>
                      <div className="balance-display">
                        <div className="balance-item highlight">
                          <div className="currency-label">ARC USDC DISBURSER</div>
                          <div className="balance-amount">Smart Contract</div>
                        </div>
                        <div className="balance-item">
                          <div className="currency-label">ARC CHAIN ID</div>
                          <div className="balance-amount">5042002</div>
                        </div>
                        <div className="balance-item">
                          <div className="currency-label">NETWORK GAS FEE</div>
                          <div className="balance-amount">0.00 USDC</div>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title sidebar-title">
                          <ShieldCheck size={18} color="#166534" /> Statutory Compliance
                        </h3>
                      </div>
                      <div className="compliance-list">
                        <div>
                          <span>Nigerian PAYE Tax Filing</span>
                          <span className="status-tag verified">Active</span>
                        </div>
                        <div>
                          <span>PenCom Pension Deduction</span>
                          <span className="status-tag verified">Active</span>
                        </div>
                        <div>
                          <span>Ghana SSNIT Deductions</span>
                          <span className="status-tag verified">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        ) : (
          <PublicLanding onOpenAuth={openAuth} isAdminRoute={isAdminRoute} />
        )}

        <footer className="app-footer">
          <p>© 2026 Autiqo. Payroll and workforce operations for African teams.</p>
        </footer>
      </div>
    </>
  );
}
