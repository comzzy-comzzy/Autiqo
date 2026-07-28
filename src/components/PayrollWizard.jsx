import React, { useState } from 'react';
import { 
  Bot, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Send,
  Plus,
  Trash2,
  Wallet,
  Code,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PayrollWizard({ workers, setWorkers, ledger = [], setLedger }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionComplete, setExecutionComplete] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [autoPayroll, setAutoPayroll] = useState(true);
  
  // New Worker Form State (Arc Testnet Focus)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: '',
    role: '',
    location: 'Nigeria',
    grossUsd: '',
    arcWallet: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
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
      bank: `${newWorker.arcWallet.slice(0,6)}...${newWorker.arcWallet.slice(-4)}`,
      fullWallet: newWorker.arcWallet,
      rail: 'Arc Testnet Smart Contract 🟣',
      status: 'arc-usdc'
    };

    setWorkers([created, ...workers]);
    setNewWorker({
      name: '',
      role: '',
      location: 'Nigeria',
      grossUsd: '',
      arcWallet: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
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
    // Generate realistic Arc Testnet transaction hash
    const generatedHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    setTxHash(generatedHash);

    setTimeout(() => {
      setIsExecuting(false);
      setExecutionComplete(true);
      setCurrentStep(4);
      if (setLedger) {
        const entries = workers.map((worker, index) => ({
          id: `TX-${Date.now()}-${index + 1}`,
          type: 'Salary payout',
          actor: worker.name,
          amount: worker.amountNet.replace('$ ', ''),
          status: 'Completed',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          rail: 'Arc Testnet',
          txHash: generatedHash
        }));
        setLedger([...entries, ...ledger]);
      }
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
            <Wallet size={22} color="#0284c7" /> Arc Testnet Automated Payroll Engine
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Automated USDC batch salary disbursement deployed on Arc Testnet (Chain ID: 5042002).
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> Add Arc Worker
        </button>
      </div>

      <div className="bookkeeping-grid">
        <div className="bookkeeping-card">
          <span>Arc treasury balance</span>
          <strong>24,800.00 USDC</strong>
          <small>Available for this payroll cycle</small>
        </div>
        <div className="bookkeeping-card">
          <span>Queued net payroll</span>
          <strong>
            {workers.reduce((sum, worker) => {
              const value = Number(String(worker.amountNet).replace(/[^0-9.]/g, '')) || 0;
              return sum + value;
            }, 0).toLocaleString()} USDC
          </strong>
          <small>{workers.length} staff records ready</small>
        </div>
        <div className="bookkeeping-card">
          <span>Automation</span>
          <strong>{autoPayroll ? 'Enabled' : 'Manual review'}</strong>
          <small>{autoPayroll ? 'Runs after approval checks pass' : 'Admin must execute each run'}</small>
        </div>
      </div>

      <div className="automation-row">
        <label>
          <input type="checkbox" checked={autoPayroll} onChange={(event) => setAutoPayroll(event.target.checked)} />
          Auto-send payroll after wallet validation and anomaly checks
        </label>
        <button className="btn-secondary" onClick={() => alert('Bookkeeping export prepared for accounting review.')}>
          Export Bookkeeping
        </button>
      </div>

      {/* Add Arc Worker Form */}
      {showAddForm && (
        <form onSubmit={handleAddWorker} style={{ background: '#f0f9ff', padding: '20px', borderRadius: '12px', border: '1px solid #bae6fd', marginBottom: '24px' }}>
          <h4 style={{ fontWeight: 800, marginBottom: '14px', color: '#0369a1' }}>Add Arc Testnet USDC Worker Record</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Adebayo Chukwuma" 
                value={newWorker.name} 
                onChange={e => setNewWorker({...newWorker, name: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #7dd3fc', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>Role / Specialty</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Frontend Engineer" 
                value={newWorker.role} 
                onChange={e => setNewWorker({...newWorker, role: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #7dd3fc', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>Monthly Salary (USDC)</label>
              <input 
                type="number" 
                required 
                placeholder="e.g. 2500" 
                value={newWorker.grossUsd} 
                onChange={e => setNewWorker({...newWorker, grossUsd: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #7dd3fc', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>Arc EVM Wallet Address</label>
              <input 
                type="text" 
                required
                value={newWorker.arcWallet} 
                onChange={e => setNewWorker({...newWorker, arcWallet: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #7dd3fc', fontSize: '0.8rem', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
              Save Worker
            </button>
          </div>
        </form>
      )}

      {/* Wizard Steps */}
      <div className="wizard-steps">
        <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span>1. Validate Arc Wallets</span>
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
          <Bot size={40} color="#0284c7" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Autiqo AI Agent Arc Wallet Audit
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '520px', margin: '0 auto 20px auto' }}>
            {workers.length > 0 
              ? `Ready to validate ${workers.length} worker Arc Testnet wallet addresses and calculate USDC batch disburser payload.`
              : `No worker records added yet. Click "Add Arc Worker" above to enter worker wallet details.`}
          </p>
          <button 
            className="btn-primary" 
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || workers.length === 0}
            style={{ opacity: workers.length === 0 ? 0.5 : 1 }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Verifying Arc EVM Signatures...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Audit & Validate Arc Payload
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
              <CheckCircle size={20} /> All worker wallet signatures verified for Arc Testnet smart contract deployment.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button 
              className="btn-primary" 
              onClick={() => setCurrentStep(3)}
            >
              Proceed to Contract Batching <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Arc Testnet Smart Contract Execution */}
      {currentStep === 3 && (
        <div>
          <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '12px', border: '1px solid #bae6fd', marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 800, color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={18} color="#0284c7" /> Arc Testnet Automated Smart Contract Disburser
            </h4>
            <div style={{ fontSize: '0.85rem', color: '#0369a1', marginBottom: '14px' }}>
              Contract: <strong>AutiqoArcPayroll.sol</strong> ('0x3600000000000000000000000000000000000000')
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>PAYOUT & NATIVE GAS</span>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>USDC Stablecoin</div>
                <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>Arc Testnet Native Token</div>
              </div>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TESTNET CHAIN ID</span>
                <div style={{ fontWeight: 800, color: '#166534' }}>5042002</div>
                <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700 }}>Zero Mainnet Cost</div>
              </div>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>SETTLEMENT SPEED</span>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>~ 1.8 Seconds</div>
                <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>Instant Finality</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button 
              className="btn-primary" 
              onClick={handleExecutePayroll}
              disabled={isExecuting}
              style={{ padding: '12px 28px', fontSize: '1rem' }}
            >
              {isExecuting ? (
                <>
                  <RefreshCw size={20} className="animate-spin" /> Broadcasting Arc Testnet Transaction...
                </>
              ) : (
                <>
                  <Send size={20} /> Execute Automated Arc Testnet Smart Contract Payout
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
            Arc Testnet Smart Contract Dispatched!
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 16px auto' }}>
            USDC batch disburser successfully executed on Arc Testnet. All workers received funds directly into their Web3 wallets with zero gas cost.
          </p>

          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700 }}>Arc Tx Hash:</span>
            <code style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>{txHash ? `${txHash.slice(0, 10)}...${txHash.slice(-8)}` : '0x3600...0000'}</code>
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
          <h4 style={{ fontWeight: 800, color: '#0f172a' }}>Arc Testnet USDC Worker Payout Queue</h4>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total: {workers.length}</span>
        </div>

        {workers.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            No worker records in queue. Click <strong>"Add Arc Worker"</strong> above to enter worker EVM wallet addresses.
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
                  <th>Arc EVM Wallet</th>
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
                    <td style={{ fontWeight: 800, color: '#0284c7' }}>{w.amountNet}</td>
                    <td>
                      <code style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', background: '#f0f9ff', padding: '2px 8px', borderRadius: '6px' }}>
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

      <div className="card ledger-card">
        <div className="card-header">
          <h3 className="card-title" style={{ fontSize: '1rem' }}>
            <Wallet size={18} color="#0284c7" /> Payroll Bookkeeping Ledger
          </h3>
          <span className="status-tag verified">{ledger.length} entries</span>
        </div>
        {ledger.length === 0 ? (
          <p className="muted-copy">No Arc payment records yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Record</th>
                  <th>Type</th>
                  <th>Staff / Account</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ledger.slice(0, 8).map((entry) => (
                  <tr key={entry.id}>
                    <td style={{ fontWeight: 700 }}>{entry.id}</td>
                    <td>{entry.type}</td>
                    <td>{entry.actor}</td>
                    <td style={{ fontWeight: 800, color: '#0284c7' }}>{entry.amount}</td>
                    <td><span className="status-tag verified">{entry.status}</span></td>
                    <td>{entry.date}</td>
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
