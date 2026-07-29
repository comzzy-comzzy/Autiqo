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
  FileCheck2,
  LayoutDashboard,
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
        { id: "staff-overview", label: "Overview", icon: LayoutDashboard },
        { id: "staff-profile", label: "My Profile", icon: UserCheck },
        { id: "staff-work-proof", label: "Proof of Work", icon: FileCheck2 },
        { id: "staff-payout-details", label: "Payout Wallet", icon: Wallet },
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
          <div className="drawer-brand">
            <img src="/logo-icon.png" alt="Autiqo Logo" />
            <div>
              <div className="drawer-brand-name">Autiqo</div>
              <div className="drawer-brand-role">
                {userRole === 'admin' ? 'Employer Portal' : 'Employee Portal'}
              </div>
            </div>
          </div>
          <button 
            className="drawer-close"
            onClick={onClose} 
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <div className="drawer-section-title">{userRole === 'staff' ? 'Your workspace' : section.title}</div>
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
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.badge && <span className="drawer-badge">{item.badge}</span>}
                  </div>
                );
              })}
            </div>
          ))}

          {userRole === 'staff' && (
            <div className="drawer-staff-note">
              <strong>Need to submit work?</strong>
              <p>Proof of work has its own page, separate from your personal details.</p>
              <button onClick={() => { setActiveTab('staff-work-proof'); onClose(); }}>
                Open proof of work <ArrowUpRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
