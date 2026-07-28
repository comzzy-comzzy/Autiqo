import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Banknote, 
  ShieldCheck, 
  Bot, 
  HelpCircle, 
  X, 
  Wallet, 
  Globe, 
  ArrowUpRight,
  FileText,
  CreditCard,
  UserCheck
} from 'lucide-react';

export default function NavigationDrawer({ isOpen, onClose, activeTab, setActiveTab, workerCount, userRole }) {
  const adminSections = [
    {
      title: "Employer Operations",
      items: [
        { id: "dashboard", label: "Overview", icon: Building2 },
        { id: "people", label: "People & Workforce", icon: Users, badge: workerCount > 0 ? String(workerCount) : null },
        { id: "payroll", label: "Payroll Execution", icon: Banknote },
      ]
    },
    {
      title: "Financial Orchestration",
      items: [
        { id: "payouts", label: "Cross-Border Payouts", icon: Globe },
        { id: "arc-usdc", label: "Arc USDC Rail", icon: Wallet, badge: "Arc" },
        { id: "compliance", label: "Compliance & Audit", icon: ShieldCheck },
      ]
    },
    {
      title: "Intelligence",
      items: [
        { id: "agent", label: "Autiqo AI Co-Pilot", icon: Bot },
        { id: "knowledge", label: "Help Center", icon: HelpCircle },
      ]
    }
  ];

  const staffSections = [
    {
      title: "Staff Workspace",
      items: [
        { id: "staff-profile", label: "My Profile & Task", icon: UserCheck },
        { id: "staff-payout-details", label: "Wallet Address", icon: Wallet },
      ]
    }
  ];

  const menuSections = userRole === 'admin' ? adminSections : staffSections;

  return (
    <>
      <div 
        className={`nav-drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
      />
      <div className={`nav-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo-icon.png" alt="Autiqo Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0369a1', lineHeight: 1.1 }}>Autiqo AI</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>
                {userRole === 'admin' ? 'Employer Portal' : 'Employee Portal'}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <div className="drawer-section-title">{section.title}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <div
                    key={item.id}
                    className={`drawer-link ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                  >
                    <Icon size={18} color={isActive ? '#0284c7' : '#64748b'} />
                    <span>{item.label}</span>
                    {item.badge && <span className="drawer-badge">{item.badge}</span>}
                  </div>
                );
              })}
            </div>
          ))}

          {userRole === 'staff' && (
            <div style={{ marginTop: '24px', padding: '16px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>
                Arc USDC Wallet Active
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '12px' }}>
                Receive and withdraw salary through the Arc wallet tied to your email login.
              </div>
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', justifyContent: 'center' }}
                onClick={() => { setActiveTab('staff-payout-details'); onClose(); }}
              >
                Manage Payout Destination <ArrowUpRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
