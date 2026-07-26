import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Wallet, 
  Globe, 
  CheckCircle, 
  X, 
  Save, 
  Key, 
  CreditCard,
  Building
} from 'lucide-react';

export default function ProfileModal({ currentUser, userRole, onClose, onUpdateUser }) {
  const [name, setName] = useState(currentUser.name || 'Ezinne Comfort');
  const [email, setEmail] = useState(currentUser.email || 'ezinne@autiqo.com');
  const [company, setCompany] = useState(currentUser.company || 'Autiqo Global Corp');
  const [tin, setTin] = useState('24910482-001');
  const [pensionPin, setPensionPin] = useState('PEN1092840192');
  const [baseWallet, setBaseWallet] = useState('0x89A2...c4F2');
  const [bankAccount, setBankAccount] = useState('GTBank 0123984712');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      company
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
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
        borderRadius: '20px',
        maxWidth: '560px',
        width: '100%',
        padding: '28px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo-icon.png" alt="Autiqo Logo" style={{ width: '36px', height: '36px' }} />
            <div>
              <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem', margin: 0 }}>
                {userRole === 'admin' ? 'Employer Organization Settings' : 'Employee Profile & Payout Info'}
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Account Settings • {userRole === 'admin' ? 'Company Admin' : 'Worker'}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {savedSuccess && (
          <div style={{ padding: '12px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', fontWeight: 700, fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} /> Profile settings updated successfully.
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Full Name
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Work Email
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          {userRole === 'admin' ? (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Company Name
                </label>
                <input 
                  type="text" 
                  value={company} 
                  onChange={e => setCompany(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#0284c7" /> Statutory Compliance & Tax Verification
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Corporate TIN</label>
                    <input 
                      type="text" 
                      value={tin} 
                      onChange={e => setTin(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Default Settlement Currency</label>
                    <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                      <option>NGN (Nigerian Naira)</option>
                      <option>GHS (Ghana Cedi)</option>
                      <option>KES (Kenyan Shilling)</option>
                      <option>USD (US Dollar)</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ background: '#f0f5ff', padding: '16px', borderRadius: '12px', border: '1px solid #c7d2fe', marginBottom: '20px' }}>
              <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#3730a3', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={16} color="#4338ca" /> Base USDC Web3 Wallet Setup
              </h4>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#4338ca', fontWeight: 700 }}>Base Address (EVM Compatible)</label>
                <input 
                  type="text" 
                  value={baseWallet} 
                  onChange={e => setBaseWallet(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #a5b4fc', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#4338ca', fontWeight: 700 }}>Fallback Local Bank Account</label>
                <input 
                  type="text" 
                  value={bankAccount} 
                  onChange={e => setBankAccount(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #a5b4fc', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ gap: '6px' }}>
              <Save size={16} /> Save Profile Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
