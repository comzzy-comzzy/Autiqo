import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle,
  Globe,
  Wallet,
  AlertCircle,
  KeyRound,
  ArrowLeft
} from 'lucide-react';

export default function AuthModal({ onLogin, onClose }) {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', or 'forgot'
  const [accountType, setAccountType] = useState('client'); // 'client' (Employer) or 'contractor' (Employee)
  
  // Registration Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('Nigeria');
  
  // Validation & Error Handling
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Simple password strength validator: minimum 8 characters, at least 1 number
  const validatePassword = (pass) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/\d/.test(pass)) {
      return "Password must contain at least one number.";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    if (authMode === 'register') {
      const passErr = validatePassword(password);
      if (passErr) {
        setErrorMessage(passErr);
        return;
      }
    }

    const userPayload = {
      role: accountType === 'client' ? 'admin' : 'staff',
      email: email,
      name: fullName || (accountType === 'client' ? 'Ezinne Comfort' : 'Kwame Osei'),
      company: companyName || 'Autiqo Global Corp',
      country: country
    };

    onLogin(userPayload);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage("Please enter your registered work email address.");
      return;
    }
    setErrorMessage('');
    setForgotSuccess(true);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        padding: '36px 32px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
        position: 'relative'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/logo-icon.png" alt="Autiqo Logo" style={{ width: '52px', height: '52px', margin: '0 auto 12px auto' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            {authMode === 'login' ? 'Welcome back to Autiqo' : authMode === 'register' ? 'Create your Autiqo account' : 'Reset your password'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            {authMode === 'login' 
              ? 'Sign in to access your secure workforce portal' 
              : authMode === 'register'
              ? 'Select your account role to get started'
              : 'Enter your work email to receive password reset instructions'}
          </p>
        </div>

        {/* Error / Validation Alert Box */}
        {errorMessage && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#991b1b',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} color="#dc2626" /> {errorMessage}
          </div>
        )}

        {/* Forgot Password Flow */}
        {authMode === 'forgot' ? (
          <div>
            {forgotSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                <CheckCircle size={36} color="#0284c7" style={{ marginBottom: '10px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0369a1' }}>Reset Link Sent!</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
                  We sent password reset instructions to <strong>{email}</strong>. Check your inbox to proceed.
                </p>
                <button 
                  className="btn-secondary" 
                  onClick={() => { setAuthMode('login'); setForgotSuccess(false); }}
                  style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Registered Work Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="email" 
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                    <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
                >
                  <KeyRound size={18} /> Send Reset Link
                </button>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('login')}
                    style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* Deel-Style Sign In vs Sign Up Tabs */}
            <div style={{
              display: 'flex',
              justify: 'center',
              gap: '24px',
              marginBottom: '20px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <button 
                type="button"
                onClick={() => setAuthMode('login')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: authMode === 'login' ? '3px solid #0284c7' : '3px solid transparent',
                  color: authMode === 'login' ? '#0284c7' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  paddingBottom: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setAuthMode('register')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: authMode === 'register' ? '3px solid #0284c7' : '3px solid transparent',
                  color: authMode === 'register' ? '#0284c7' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  paddingBottom: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Create Account
              </button>
            </div>

            {/* Account Type Selector (Deel Style Cards) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div 
                onClick={() => setAccountType('client')}
                style={{
                  padding: '14px 12px',
                  borderRadius: '12px',
                  border: `2px solid ${accountType === 'client' ? '#0284c7' : '#e2e8f0'}`,
                  background: accountType === 'client' ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <Building2 size={22} color={accountType === 'client' ? '#0284c7' : '#64748b'} style={{ marginBottom: '6px' }} />
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: accountType === 'client' ? '#0369a1' : '#0f172a' }}>
                  Employer Admin
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                  Hire & pay workforce
                </div>
              </div>

              <div 
                onClick={() => setAccountType('contractor')}
                style={{
                  padding: '14px 12px',
                  borderRadius: '12px',
                  border: `2px solid ${accountType === 'contractor' ? '#0284c7' : '#e2e8f0'}`,
                  background: accountType === 'contractor' ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <UserCheck size={22} color={accountType === 'contractor' ? '#0284c7' : '#64748b'} style={{ marginBottom: '6px' }} />
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: accountType === 'contractor' ? '#0369a1' : '#0f172a' }}>
                  Employee Staff
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                  Get paid & view payslips
                </div>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit}>
              {authMode === 'register' && (
                <>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Full Legal Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ezinne Comfort"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  {accountType === 'client' && (
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Company / Entity Name
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Autiqo Technologies Ltd"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Country of Residence / Incorporation
                    </label>
                    <select 
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    >
                      <option value="Nigeria">Nigeria 🇳🇬</option>
                      <option value="Ghana">Ghana 🇬🇭</option>
                      <option value="Kenya">Kenya 🇰🇪</option>
                      <option value="South Africa">South Africa 🇿🇦</option>
                      <option value="Rwanda">Rwanda 🇷🇼</option>
                      <option value="Egypt">Egypt 🇪🇬</option>
                    </select>
                  </div>
                </>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Work Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    required
                    placeholder={accountType === 'client' ? "admin@company.com" : "worker@company.com"}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                  <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="password" 
                    required
                    placeholder="Min. 8 characters + 1 number"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                  <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                </div>
              </div>

              {/* Forgot Password Link */}
              {authMode === 'login' && (
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                  <button 
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setErrorMessage(''); }}
                    style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: authMode === 'register' ? '14px' : '0' }}
              >
                {authMode === 'login' ? `Sign In as ${accountType === 'client' ? 'Employer Admin' : 'Employee'}` : 'Create Protected Account'} <ArrowRight size={18} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
