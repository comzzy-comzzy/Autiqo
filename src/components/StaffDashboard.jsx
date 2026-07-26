import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Wallet, 
  ShieldCheck, 
  ArrowUpRight, 
  Building2, 
  Calendar, 
  DollarSign, 
  Zap,
  Globe
} from 'lucide-react';

export default function StaffDashboard({ activeTab, setActiveTab }) {
  const [payoutRail, setPayoutRail] = useState('base-usdc');
  const [bankAccount, setBankAccount] = useState('GTBank •••• 4712');
  const [baseWallet, setBaseWallet] = useState('0x89A2...c4F2');
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const payslips = [
    {
      id: "PAY-2026-07",
      period: "July 2026",
      date: "25 Jul 2026",
      gross: "₦ 1,850,000",
      payeTax: "₦ 148,000",
      pension: "₦ 92,500",
      netPay: "₦ 1,609,500",
      usdEquiv: "$ 1,073.00",
      status: "Paid",
      rail: "Base USDC Network 🔵",
      txHash: "0x4f82a9c310b882e...7d11"
    },
    {
      id: "PAY-2026-06",
      period: "June 2026",
      date: "25 Jun 2026",
      gross: "₦ 1,850,000",
      payeTax: "₦ 148,000",
      pension: "₦ 92,500",
      netPay: "₦ 1,609,500",
      usdEquiv: "$ 1,073.00",
      status: "Paid",
      rail: "NIP Instant Bank Settlement",
      txHash: "NIP-992014820"
    },
    {
      id: "PAY-2026-05",
      period: "May 2026",
      date: "25 May 2026",
      gross: "₦ 1,850,000",
      payeTax: "₦ 148,000",
      pension: "₦ 92,500",
      netPay: "₦ 1,609,500",
      usdEquiv: "$ 1,073.00",
      status: "Paid",
      rail: "NIP Instant Bank Settlement",
      txHash: "NIP-881940129"
    }
  ];

  return (
    <div>
      {/* Staff Hero Banner featuring African Workforce Visual */}
      <div className="hero-card">
        <div className="hero-text-side">
          <div className="hero-welcome-badge" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#7dd3fc' }}>
            <CheckCircle size={16} /> Employee Income Portal
          </div>
          <h1 className="hero-heading">
            Welcome, Kwame Osei
          </h1>
          <p className="hero-subtext">
            Lead Product Designer at Autiqo Engineering. View salary income, download tax compliance payslips, and configure Base USDC Web3 settlement.
          </p>
          <div className="hero-actions">
            <button 
              className="btn-primary"
              onClick={() => setActiveTab("staff-payslips")}
            >
              <FileText size={18} /> View July Payslip
            </button>
            <button 
              className="btn-secondary"
              onClick={() => setActiveTab("staff-payout-details")}
            >
              <Wallet size={18} /> Payout Destination
            </button>
          </div>
        </div>

        <div className="hero-image-side" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center bottom, rgba(56, 189, 248, 0.25) 0%, rgba(255, 255, 255, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <img 
            src="/african3.png" 
            alt="African Staff Professional" 
            style={{ 
              height: '240px', 
              objectFit: 'contain',
              position: 'relative',
              zIndex: 2,
              filter: 'drop-shadow(0 14px 20px rgba(2, 132, 199, 0.15))' 
            }}
          />
        </div>
      </div>

      {/* Staff Overview Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Recent Pay & Payslip Breakdown */}
        <div>
          {/* Income Summary Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><CreditCard size={20} color="#0284c7" /> July 2026 Salary Disbursed</h3>
              <span className="status-tag verified"><CheckCircle size={14} /> Settlement Confirmed</span>
            </div>

            <div className="balance-display">
              <div className="balance-item highlight">
                <div className="currency-label">NET TAKE-HOME PAY</div>
                <div className="balance-amount">₦ 1,609,500</div>
                <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, marginTop: '4px' }}>≈ $1,073.00 USD</div>
              </div>
              <div className="balance-item">
                <div className="currency-label">PAYE TAX WITHHELD</div>
                <div className="balance-amount" style={{ color: '#dc2626' }}>₦ 148,000</div>
              </div>
              <div className="balance-item">
                <div className="currency-label">PENCOM PENSION</div>
                <div className="balance-amount" style={{ color: '#0369a1' }}>₦ 92,500</div>
              </div>
            </div>
          </div>

          {/* Payslips Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><FileText size={20} /> Itemized Pay Records & Payslips</h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pay Period</th>
                    <th>Gross Income</th>
                    <th>Deductions</th>
                    <th>Net Payout</th>
                    <th>Payment Rail</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.period}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.date}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.gross}</td>
                      <td style={{ fontSize: '0.8rem', color: '#dc2626' }}>
                        {p.payeTax} Tax
                      </td>
                      <td style={{ fontWeight: 800, color: '#0369a1' }}>{p.netPay}</td>
                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: p.rail.includes('Base') ? '#0052ff' : '#475569' }}>
                          {p.rail}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => setSelectedPayslip(p)}
                        >
                          <Download size={12} /> Payslip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Payout Destination & Tax Compliance */}
        <div>
          {/* Payout Rail Destination Setup */}
          <div className="card" style={{ borderLeft: '4px solid #0052ff' }}>
            <div className="card-header">
              <h3 className="card-title" style={{ fontSize: '1rem', color: '#0052ff' }}>
                <Wallet size={18} /> Payout Destination
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div 
                onClick={() => setPayoutRail('base-usdc')}
                style={{ 
                  padding: '14px', 
                  borderRadius: '10px', 
                  border: `2px solid ${payoutRail === 'base-usdc' ? '#0052ff' : '#e2e8f0'}`,
                  background: payoutRail === 'base-usdc' ? '#f0f5ff' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#0052ff', fontSize: '0.9rem' }}>Base Network USDC Wallet 🔵</span>
                  {payoutRail === 'base-usdc' && <CheckCircle size={16} color="#0052ff" />}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Direct Web3 USDC settlement to {baseWallet}
                </div>
              </div>

              <div 
                onClick={() => setPayoutRail('bank')}
                style={{ 
                  padding: '14px', 
                  borderRadius: '10px', 
                  border: `2px solid ${payoutRail === 'bank' ? '#0284c7' : '#e2e8f0'}`,
                  background: payoutRail === 'bank' ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>NIP Local Bank Account</span>
                  {payoutRail === 'bank' && <CheckCircle size={16} color="#0284c7" />}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Direct Naira deposit to {bankAccount}
                </div>
              </div>
            </div>
          </div>

          {/* Tax Compliance Verification */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ fontSize: '1rem' }}>
                <ShieldCheck size={18} color="#166534" /> Statutory Tax Status
              </h3>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax Identification (TIN)</span>
                <span style={{ fontWeight: 700 }}>24910482-001</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>PenCom Pension PIN</span>
                <span style={{ fontWeight: 700 }}>PEN1092840192</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span>Compliance Certificate</span>
                <span className="status-tag verified">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Payslip Modal */}
      {selectedPayslip && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '540px',
            width: '100%',
            padding: '28px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo-icon.png" alt="Autiqo Logo" style={{ width: '32px', height: '32px' }} />
                <div>
                  <h3 style={{ fontWeight: 800, color: '#0369a1', fontSize: '1.2rem', margin: 0 }}>Autiqo Official Payslip</h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedPayslip.id} • {selectedPayslip.period}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPayslip(null)}
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                Close
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>EMPLOYEE</div>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>Kwame Osei</div>
                <div style={{ color: '#64748b' }}>Lead Product Designer</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>EMPLOYER</div>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>Autiqo Inc.</div>
                <div style={{ color: '#64748b' }}>Lagos & San Francisco</div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span>Gross Monthly Earnings</span>
                <span style={{ fontWeight: 700 }}>{selectedPayslip.gross}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#dc2626' }}>
                <span>PAYE Income Tax Withheld</span>
                <span>-{selectedPayslip.payeTax}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem', color: '#0369a1' }}>
                <span>PenCom Statutory Pension</span>
                <span>-{selectedPayslip.pension}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                <span>Net Disbursement</span>
                <span style={{ color: '#0284c7' }}>{selectedPayslip.netPay}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '20px' }}>
              <div><strong>Settlement Rail:</strong> {selectedPayslip.rail}</div>
              <div><strong>Transaction Ref:</strong> {selectedPayslip.txHash}</div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                alert(`Payslip ${selectedPayslip.id} downloaded successfully as compliant PDF.`);
                setSelectedPayslip(null);
              }}
            >
              <Download size={18} /> Download Verified PDF Payslip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
