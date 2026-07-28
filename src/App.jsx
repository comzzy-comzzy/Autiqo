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
  Zap
} from 'lucide-react';
import NavigationDrawer from './components/NavigationDrawer';
import PayrollWizard from './components/PayrollWizard';
import StaffDashboard from './components/StaffDashboard';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';

function PublicLanding() {
  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="public-hero-copy">
          <div className="public-badge">
            <Zap size={16} /> Workforce finance for African teams
          </div>
          <h1>Payroll and payouts for African teams, handled from one secure workspace.</h1>
          <p>
            Manage employee records, prepare payroll, track statutory deductions,
            and settle cross-border contractor payments with fast USDC rails.
          </p>
          <div className="public-trust-row" aria-label="Autiqo coverage highlights">
            <span>Nigeria PAYE</span>
            <span>Ghana SSNIT</span>
            <span>Arc USDC payouts</span>
          </div>
        </div>

        <div className="public-hero-visual" aria-hidden="true">
          <div className="public-slideshow">
            <img src="/african1.png" alt="" className="public-slide" />
            <img src="/african2.png" alt="" className="public-slide" />
            <img src="/african3.png" alt="" className="public-slide" />
          </div>
          <div className="public-payroll-panel">
            <div>
              <span>Next payroll</span>
              <strong>$42,800</strong>
            </div>
            <div>
              <span>Workers ready</span>
              <strong>128</strong>
            </div>
            <div>
              <span>Settlement rail</span>
              <strong>Arc USDC</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section public-problem">
        <div>
          <span className="section-kicker">For employers</span>
          <h2>Run payroll with the right records in place.</h2>
        </div>
        <p>
          Autiqo is built for companies managing staff and contractors across African
          markets. Keep salary, tax, pension, and payout data organized before each run.
        </p>
      </section>

      <section className="public-feature-grid">
        <article className="public-feature-card">
          <Building2 size={22} />
          <h3>Employer command center</h3>
          <p>Register a workforce, prepare payroll, and track country-specific deductions.</p>
        </article>
        <article className="public-feature-card">
          <Banknote size={22} />
          <h3>Cross-border payout runs</h3>
          <p>Move from payroll approval to fast contractor settlement through Web3 rails.</p>
        </article>
        <article className="public-feature-card">
          <ShieldCheck size={22} />
          <h3>Compliance records</h3>
          <p>Keep salary, tax, pension, and audit data organized in the protected portal.</p>
        </article>
      </section>

      <section className="public-split-section">
        <div>
          <span className="section-kicker">Private portal</span>
          <h2>Operational screens stay behind sign-in.</h2>
          <p>
            Employers see payroll execution, worker directories, treasury rails, and
            compliance controls after sign-in. Employees see their pay, payslips,
            payout destination, and profile details after sign-in.
          </p>
        </div>
        <div className="protected-list">
          <div><LockKeyhole size={18} /> Payroll execution</div>
          <div><LockKeyhole size={18} /> Worker directory</div>
          <div><LockKeyhole size={18} /> Employee payslips</div>
          <div><LockKeyhole size={18} /> Profile settings</div>
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
    if (savedProfile) setCurrentUser((previous) => ({ ...previous, ...JSON.parse(savedProfile) }));
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
        <h1 className="splash-title">Autiqo AI</h1>
        <p className="splash-subtitle">Autonomous Workforce Finance & Cross-Border Payouts</p>
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
                ? records.map((record) => record.email === nextUser.email ? nextUser : record)
                : [...records, nextUser]);
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
                <button className="btn-secondary nav-cta" onClick={openAuth}>
                  Sign In / Sign Up
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
                      ? records.map((record) => record.email === nextUser.email ? nextUser : record)
                      : [...records, nextUser]);
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
                      <strong>{record.name || 'Unnamed staff'}</strong><span>{record.email}</span><span>{record.profile?.work || 'Profile incomplete'}</span><span>{record.profile?.currentTask || 'No current task'}</span><span>{record.profile?.proof || 'No proof submitted'}</span><span>{record.wallet?.address || 'Wallet unavailable'}</span>
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
          <PublicLanding />
        )}

        <footer className="app-footer">
          <p>© 2026 Autiqo AI Inc. • Autonomous Workforce Finance & Cross-Border Payout Platform</p>
        </footer>
      </div>
    </>
  );
}
