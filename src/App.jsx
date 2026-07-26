import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  Users, 
  Banknote, 
  ShieldCheck, 
  Wallet, 
  Plus, 
  Globe, 
  Bot,
  Zap
} from 'lucide-react';
import NavigationDrawer from './components/NavigationDrawer';
import PayrollWizard from './components/PayrollWizard';
import StaffDashboard from './components/StaffDashboard';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userRole, setUserRole] = useState("admin"); // 'admin' or 'staff'
  
  // Auth & User Profile State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // NO automatic popup!
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Guest User',
    email: '',
    company: ''
  });

  // Dynamic user-managed workforce array
  const [workers, setWorkers] = useState([]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userPayload) => {
    setUserRole(userPayload.role);
    setCurrentUser({
      name: userPayload.name,
      email: userPayload.email,
      company: userPayload.company
    });
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setActiveTab(userPayload.role === 'admin' ? 'dashboard' : 'staff-overview');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAuthModal(true);
  };

  return (
    <>
      {/* Deel-Style Intro Splash Screen */}
      <div className={`splash-container ${!showSplash ? 'slide-out' : ''}`}>
        <img src="/logo-icon.png" alt="Autiqo Logo" className="splash-logo" />
        <h1 className="splash-title">Autiqo AI</h1>
        <p className="splash-subtitle">Autonomous Workforce Finance & Cross-Border Payouts</p>
      </div>

      {/* Auth Gateway Modal */}
      {showAuthModal && (
        <AuthModal 
          onLogin={handleLogin}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <ProfileModal 
          currentUser={currentUser}
          userRole={userRole}
          onClose={() => setShowProfileModal(false)}
          onUpdateUser={(updated) => setCurrentUser({...currentUser, ...updated})}
        />
      )}

      <div className="app-container">
        {/* Top Header Navigation */}
        <header className="top-nav">
          <div className="nav-left">
            <button className="menu-toggle" onClick={() => setIsDrawerOpen(true)} title="Open Navigation Menu">
              <Menu size={24} />
            </button>
            <div className="brand-logo-container" onClick={() => setActiveTab(userRole === 'admin' ? "dashboard" : "staff-overview")}>
              <img src="/logo-icon.png" alt="Autiqo Logo" className="brand-logo-img" />
              <span className="brand-name">Autiqo</span>
            </div>
          </div>

          <div className="nav-right">
            {!isAuthenticated ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  className="btn-secondary"
                  onClick={() => setShowAuthModal(true)}
                  style={{ padding: '7px 16px', fontSize: '0.85rem' }}
                >
                  Sign In
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAuthModal(true)}
                  style={{ padding: '7px 16px', fontSize: '0.85rem' }}
                >
                  Create Account
                </button>
              </div>
            ) : (
              <>
                {/* Interactive Role Switcher */}
                <div style={{
                  background: '#f1f5f9',
                  padding: '3px',
                  borderRadius: '20px',
                  display: 'flex',
                  border: '1px solid #e2e8f0'
                }}>
                  <button 
                    onClick={() => {
                      setUserRole('admin');
                      setCurrentUser(prev => ({ ...prev, name: 'Ezinne Comfort' }));
                      setActiveTab('dashboard');
                    }}
                    style={{
                      background: userRole === 'admin' ? '#ffffff' : 'transparent',
                      color: userRole === 'admin' ? '#0284c7' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      boxShadow: userRole === 'admin' ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Employer Admin
                  </button>
                  <button 
                    onClick={() => {
                      setUserRole('staff');
                      setCurrentUser(prev => ({ ...prev, name: 'Kwame Osei' }));
                      setActiveTab('staff-overview');
                    }}
                    style={{
                      background: userRole === 'staff' ? '#ffffff' : 'transparent',
                      color: userRole === 'staff' ? '#0284c7' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      boxShadow: userRole === 'staff' ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Employee Staff
                  </button>
                </div>

                <button 
                  className="user-profile-btn"
                  onClick={() => setShowProfileModal(true)}
                  title="View Account Profile Settings"
                >
                  <div className="user-avatar">{currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'EC'}</div>
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

        {/* Sliding Navigation Drawer */}
        <NavigationDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          workerCount={workers.length}
          userRole={userRole}
        />

        {/* Main Content Body */}
        <main className="main-wrapper">
          {userRole === 'staff' ? (
            <StaffDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
          ) : (
            <>
              {/* Base Network Web3 Rebranded Hero Welcome Banner */}
          <div className="hero-card" style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #e0f2fe 100%)',
            border: '1px solid #bae6fd',
            boxShadow: '0 8px 32px -4px rgba(2, 132, 199, 0.12)'
          }}>
            <div className="hero-text-side">
              <div className="hero-welcome-badge" style={{ background: '#e0f2fe', color: '#0284c7', borderColor: '#7dd3fc' }}>
                <Zap size={16} color="#0284c7" /> Base Network Web3 Autonomous Payroll Active
              </div>
              <h1 className="hero-heading" style={{ 
                fontSize: '2.55rem', 
                fontWeight: 800, 
                lineHeight: 1.15,
                letterSpacing: '-0.03em', 
                color: '#0f172a',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>
                Pay your African team in seconds.{' '}
                <span style={{ 
                  color: '#0284c7'
                }}>
                  Zero payment delay.
                </span>
              </h1>
              <p className="hero-subtext" style={{ fontSize: '1.05rem', lineHeight: 1.5, color: '#475569', margin: '16px 0 24px 0', fontWeight: 500 }}>
                Automate salaries, statutory tax withholdings, and cross-border contractor payouts automatically on Base.
              </p>
              <div className="hero-actions">
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab("payroll")}
                  style={{ background: '#0284c7', borderColor: '#0284c7', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
                >
                  <Banknote size={18} /> Execute Payroll Run
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => setActiveTab("base-usdc")}
                  style={{ borderColor: '#7dd3fc', color: '#0284c7' }}
                >
                  <Wallet size={18} /> View Base Disburser
                </button>
              </div>
            </div>

            {/* Seamless blended image stage */}
            <div className="hero-image-side" style={{ 
              display: 'flex', 
              gap: '0', 
              alignItems: 'flex-end',
              position: 'relative',
              paddingRight: '10px'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center bottom, rgba(2, 132, 199, 0.18) 0%, rgba(255, 255, 255, 0) 70%)',
                pointerEvents: 'none',
                zIndex: 0
              }} />
              <img 
                src="/african1.png" 
                alt="African Workforce Team 1" 
                className="african-hero-img" 
                style={{ 
                  height: '250px', 
                  position: 'relative',
                  zIndex: 2,
                  filter: 'drop-shadow(0 14px 22px rgba(2, 132, 199, 0.18))' 
                }}
              />
              <img 
                src="/african2.png" 
                alt="African Workforce Team 2" 
                className="african-hero-img" 
                style={{ 
                  height: '230px', 
                  marginLeft: '-40px',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 10px 16px rgba(2, 132, 199, 0.14))' 
                }}
              />
            </div>
          </div>

          {/* Base Web3 Rebranded Showcase Bar */}
          <div style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)', 
            border: '1px solid #bae6fd', 
            borderRadius: 'var(--radius-lg)', 
            padding: '16px 24px', 
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                position: 'relative',
                background: 'radial-gradient(circle, rgba(186, 230, 253, 0.5) 0%, rgba(255,255,255,0) 70%)',
                padding: '6px 12px',
                borderRadius: '16px'
              }}>
                <img 
                  src="/african3.png" 
                  alt="African Workforce Team 3" 
                  style={{ 
                    height: '100px', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 14px rgba(2, 132, 199, 0.15))'
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Base Network Web3 Disburser Active <span style={{ background: '#0284c7', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px' }}>Base Mainnet</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                  Settling African workforce salaries via automated USDC smart contracts with sub-cent gas fees.
                </div>
              </div>
            </div>
            <span className="status-tag verified" style={{ fontSize: '0.85rem', padding: '8px 16px', background: '#e0f2fe', color: '#0284c7' }}>
              <ShieldCheck size={16} /> Web3 Smart Contract Verified
            </span>
          </div>

          {/* Quick Action Cards */}
          <div className="quick-actions-grid">
            <div className="quick-card" onClick={() => setActiveTab("payroll")}>
              <div className="quick-icon-wrapper">
                <Banknote size={24} />
              </div>
              <div>
                <div className="quick-card-title">Run Monthly Payroll</div>
                <div className="quick-card-desc">Execute batch USDC payouts on Base.</div>
              </div>
            </div>

            <div className="quick-card" onClick={() => setActiveTab("people")}>
              <div className="quick-icon-wrapper" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                <Users size={24} />
              </div>
              <div>
                <div className="quick-card-title">Worker Directory</div>
                <div className="quick-card-desc">Add employees or contractors.</div>
              </div>
            </div>

            <div className="quick-card" onClick={() => setActiveTab("base-usdc")}>
              <div className="quick-icon-wrapper" style={{ background: '#e0e7ff', color: '#4338ca' }}>
                <Wallet size={24} />
              </div>
              <div>
                <div className="quick-card-title">Base USDC Network Rail</div>
                <div className="quick-card-desc">Low-cost Web3 settlement rail.</div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Workspace Grid */}
          <div className="dashboard-grid">
            {/* Left Main View */}
            <div>
              {activeTab === "dashboard" || activeTab === "payroll" || activeTab === "people" ? (
                <PayrollWizard workers={workers} setWorkers={setWorkers} />
              ) : activeTab === "base-usdc" ? (
                <div className="card" style={{ borderLeft: '4px solid #0052ff' }}>
                  <div className="card-header">
                    <h3 className="card-title" style={{ color: '#0052ff' }}>
                      <Wallet size={22} /> Base Network USDC Web3 Rail
                    </h3>
                    <span className="base-rail-badge">Base Network Active</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Autiqo AI settles cross-border contractor salaries on the <strong>Base Network</strong> with near-instant finality and minimal gas costs.
                  </p>
                  <div className="balance-display">
                    <div className="balance-item highlight">
                      <div className="currency-label">BASE NETWORK STATUS</div>
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
                  <p style={{ color: '#64748b' }}>Module active.</p>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div>
              {/* Treasury Card */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title" style={{ fontSize: '1rem' }}>
                    <Globe size={18} color="#0284c7" /> Base Network Web3 Rails
                  </h3>
                </div>
                <div className="balance-display">
                  <div className="balance-item highlight">
                    <div className="currency-label">BASE USDC DISBURSER</div>
                    <div className="balance-amount">Smart Contract</div>
                  </div>
                  <div className="balance-item">
                    <div className="currency-label">AVERAGE FINALITY</div>
                    <div className="balance-amount">~ 2.5 Sec</div>
                  </div>
                  <div className="balance-item">
                    <div className="currency-label">NETWORK GAS FEE</div>
                    <div className="balance-amount">&lt; $0.01</div>
                  </div>
                </div>
              </div>

              {/* Compliance & Verification Card */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title" style={{ fontSize: '1rem' }}>
                    <ShieldCheck size={18} color="#166534" /> Statutory Compliance
                  </h3>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Nigerian PAYE Tax Filing</span>
                    <span className="status-tag verified">Active</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>PenCom Pension Deduction</span>
                    <span className="status-tag verified">Active</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

        <footer className="app-footer">
          <p>© 2026 Autiqo AI Inc. • Autonomous Workforce Finance & Cross-Border Payout Platform</p>
        </footer>
      </div>
    </>
  );
}
