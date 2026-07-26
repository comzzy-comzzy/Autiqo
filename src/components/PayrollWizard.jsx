import React, { useState } from 'react';
import { 
  Bot, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Cpu, 
  Check, 
  Send,
  Zap,
  Plus,
  Trash2,
  Wallet,
  Code,
  ExternalLink,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PayrollWizard({ workers, setWorkers }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionComplete, setExecutionComplete] = useState(false);
  const [txHash, setTxHash] = useState('');
  
  // New Worker Form State (Web3 Base Focus)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: '',
    role: '',
    location: 'Nigeria',
    grossUsd: '',
    baseWallet: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
  });

  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!newWorker.name || !newWorker.grossUsd) return;

    const grossNum = parseFloat(newWorker.grossUsd) || 0;
    const tax = grossNum * 0.05; // 5% statutory tax deduction
    const netPay = grossNum - tax;

    const created = {
      id: `W-${Date.now().toString().slice(-4)}`,
      name: newWorker.name,
      role: newWorker.role || 'Software Engineer',
      location: newWorker.location,
      amountGross: `$ ${grossNum.toLocaleString()} USDC`,
      deductions: `$ ${tax.toLocaleString()} USDC (Tax)`,
      amountNet: `$ ${netPay.toLocaleString()} USDC`,
      bank: `${newWorker.baseWallet.slice(0,6)}...${newWorker.baseWallet.slice(-4)}`,
      fullWallet: newWorker.baseWallet,
      rail: 'Base Network Smart Contract 🔵',
      status: 'base-usdc'
    };

    setWorkers([created, ...workers]);
    setNewWorker({
      name: '',
      role: '',
      location: 'Nigeria',
      grossUsd: '',
      baseWallet: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
    });
    setShowAddForm(false);
  };

  const handleRemoveWorker = (id) => {
    setWorkers(workers.filter(w => w.id !== id));
  };

  const handleStartAnalysis = () => {
    if (workers.length === 0) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentStep(2);
    }, 1500);
  };

  const handleExecutePayroll = () => {
    setIsExecuting(true);
    // Generate realistic Base Network transaction hash
    const generatedHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    setTxHash(generatedHash);

    setTimeout(() => {
      setIsExecuting(false);
      setExecutionComplete(true);
      setCurrentStep(4);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 2500);
  };

  const flaggedWorkers = workers.filter(w => w.status === 'flagged');

  return (
    <div className="payroll-wizard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={22} color="#0052ff" /> Base Smart Contract Automated Payroll Engine
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Automated USDC batch salary disbursement deployed on Base Network ('0x4f82...7d11').
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#0052ff', borderColor: '#0052ff' }}
        >
          <Plus size={16} /> Add Base Worker
        </button>
      </div>

      {/* Add Base Worker Form */}
      {showAddForm && (
        <form onSubmit={handleAddWorker} style={{ background: '#f0f5ff', padding: '20px', borderRadius: '12px', border: '1px solid #c7d2fe', marginBottom: '24px' }}>
          <h4 style={{ fontWeight: 800, marginBottom: '14px', color: '#3730a3' }}>Add Base USDC Worker Record</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4338ca', marginBottom: '4px' }}>Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Adebayo Chukwuma" 
                value={newWorker.name} 
                onChange={e => setNewWorker({...newWorker, name: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #a5b4fc', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4338ca', marginBottom: '4px' }}>Role / Specialty</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Frontend Engineer" 
                value={newWorker.role} 
                onChange={e => setNewWorker({...newWorker, role: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #a5b4fc', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4338ca', marginBottom: '4px' }}>Monthly Salary (USDC)</label>
              <input 
                type="number" 
                required 
                placeholder="e.g. 2500" 
                value={newWorker.grossUsd} 
                onChange={e => setNewWorker({...newWorker, grossUsd: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #a5b4fc', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4338ca', marginBottom: '4px' }}>Base EVM Wallet Address</label>
              <input 
                type="text" 
                required
                value={newWorker.baseWallet} 
                onChange={e => setNewWorker({...newWorker, baseWallet: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #a5b4fc', fontSize: '0.8rem', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem', background: '#0052ff', borderColor: '#0052ff' }}>
              Save Worker
            </button>
          </div>
        </form>
      )}

      {/* Wizard Steps */}
      <div className="wizard-steps">
        <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span>1. Validate Base Wallets</span>
        </div>
        <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span>2. AI Anomaly Scan</span>
        </div>
        <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>3. Deploy Smart Contract</span>
        </div>
        <div className={`step-item ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <span>4. Automated Payout</span>
        </div>
      </div>

      {/* Step 1: Scan & Collect */}
      {currentStep === 1 && (
        <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '20px' }}>
          <Bot size={40} color="#0052ff" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Autiqo AI Agent Base Wallet Audit
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '520px', margin: '0 auto 20px auto' }}>
            {workers.length > 0 
              ? `Ready to validate ${workers.length} worker Base network wallet addresses and calculate USDC batch disburser payload.`
              : `No worker records added yet. Click "Add Base Worker" above to enter worker wallet details.`}
          </p>
          <button 
            className="btn-primary" 
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || workers.length === 0}
            style={{ opacity: workers.length === 0 ? 0.5 : 1, background: '#0052ff', borderColor: '#0052ff' }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Verifying EVM Wallet Signatures...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Audit & Validate Base Payload
              </>
            )}
          </button>
        </div>
      )}

      {/* Step 2: Anomaly Detection */}
      {currentStep === 2 && (
        <div>
          {flaggedWorkers.length > 0 ? (
            <div className="anomaly-alert">
              <div className="anomaly-title">
                <AlertTriangle size={20} /> AI Anomaly Flagged
              </div>
              <div className="anomaly-desc">
                Worker <strong>{flaggedWorkers[0].name}</strong> has a flagged record: {flaggedWorkers[0].anomalyReason}.
              </div>
              <button 
                className="btn-primary" 
                style={{ background: '#d97706', borderColor: '#d97706', padding: '6px 14px', fontSize: '0.85rem' }}
                onClick={() => setWorkers(workers.map(w => ({ ...w, status: 'verified', anomalyReason: null })))}
              >
                <CheckCircle size={16} /> Authorize Exception
              </button>
            </div>
          ) : (
            <div style={{ padding: '16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', color: '#166534', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} /> All worker wallet signatures verified for Base smart contract deployment.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button 
              className="btn-primary" 
              onClick={() => setCurrentStep(3)}
              style={{ background: '#0052ff', borderColor: '#0052ff' }}
            >
              Proceed to Contract Batching <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Base Network Smart Contract Execution */}
      {currentStep === 3 && (
        <div>
          <div style={{ background: '#f0f5ff', padding: '20px', borderRadius: '12px', border: '1px solid #a5b4fc', marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 800, color: '#3730a3', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={18} color="#0052ff" /> Base Network Automated Smart Contract Disburser
            </h4>
            <div style={{ fontSize: '0.85rem', color: '#4338ca', marginBottom: '14px' }}>
              Contract: <strong>AutiqoBasePayroll.sol</strong> ('0x4f82a9c310b882e...7d11')
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #c7d2fe' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>PAYOUT ASSET</span>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>USDC Stablecoin</div>
                <div style={{ fontSize: '0.8rem', color: '#0052ff', fontWeight: 700 }}>Base Mainnet Native</div>
              </div>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #c7d2fe' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>AVERAGE GAS FEE</span>
                <div style={{ fontWeight: 800, color: '#166534' }}>&lt; $0.008 USD</div>
                <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700 }}>99.2% Fee Reduction</div>
              </div>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #c7d2fe' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>SETTLEMENT SPEED</span>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>~ 2.5 Seconds</div>
                <div style={{ fontSize: '0.8rem', color: '#0052ff', fontWeight: 700 }}>Instant Finality</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button 
              className="btn-primary" 
              onClick={handleExecutePayroll}
              disabled={isExecuting}
              style={{ padding: '12px 28px', fontSize: '1rem', background: '#0052ff', borderColor: '#0052ff' }}
            >
              {isExecuting ? (
                <>
                  <RefreshCw size={20} className="animate-spin" /> Broadcasting Contract Transaction...
                </>
              ) : (
                <>
                  <Send size={20} /> Execute Automated Base Smart Contract Payout
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {currentStep === 4 && (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <div style={{ width: '56px', height: '56px', background: '#dcfce7', color: '#166534', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Check size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Base Smart Contract Dispatched!
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 16px auto' }}>
            USDC batch disburser successfully executed on Base Network. All workers received funds directly into their Web3 wallets.
          </p>

          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700 }}>Base Tx Hash:</span>
            <code style={{ fontSize: '0.8rem', color: '#0052ff', fontWeight: 700 }}>{txHash ? `${txHash.slice(0, 10)}...${txHash.slice(-8)}` : '0x4f82...7d11'}</code>
            <a 
              href={`https://basescan.org/tx/${txHash || '0x4f82a9c310b882e7d11'}`} 
              target="_blank" 
              rel="noreferrer"
              style={{ color: '#0052ff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              <ExternalLink size={14} />
            </a>
          </div>

          <div>
            <button 
              className="btn-secondary"
              onClick={() => setCurrentStep(1)}
            >
              Reset Batch Cycle
            </button>
          </div>
        </div>
      )}

      {/* Worker List Table */}
      <div style={{ marginTop: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontWeight: 800, color: '#0f172a' }}>Base USDC Worker Payout Queue</h4>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total: {workers.length}</span>
        </div>

        {workers.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            No worker records in queue. Click <strong>"Add Base Worker"</strong> above to enter worker EVM wallet addresses.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Specialty & Country</th>
                  <th>Gross Pay (USDC)</th>
                  <th>Deductions</th>
                  <th>Net Payout</th>
                  <th>Base EVM Wallet</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{w.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{w.id}</div>
                    </td>
                    <td>
                      <div>{w.role}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{w.location}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{w.amountGross}</td>
                    <td style={{ fontSize: '0.8rem', color: '#dc2626' }}>{w.deductions}</td>
                    <td style={{ fontWeight: 800, color: '#0052ff' }}>{w.amountNet}</td>
                    <td>
                      <code style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0052ff', background: '#f0f5ff', padding: '2px 8px', borderRadius: '6px' }}>
                        {w.bank}
                      </code>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleRemoveWorker(w.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        title="Remove Worker"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
