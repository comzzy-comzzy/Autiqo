# Autiqo AI

> **Autonomous Web3 Workforce Payroll & Payout Orchestration Engine on Arc Testnet**

Autiqo AI is a Web3 payroll orchestration platform built for African businesses, distributed teams, and international contractors. It replaces manual spreadsheet operations with automated statutory tax calculations (PAYE, PenCom, SSNIT), AI anomaly detection, and automated batch USDC disburser smart contracts on **Arc Testnet (Circle Layer 1, Chain ID: 5042002)**.

---

## Key Capabilities

- **Arc Testnet Web3 Smart Contract Payouts:** 100% Web3 crypto settlement rail using batch USDC salary disburser smart contracts deployed on Arc Testnet (~1.8s settlement, native USDC gas token).
- **Multi-Agent Payroll Orchestration:** Specialized AI validation agents scan payroll batches for anomalies (salary spikes, invalid wallet signatures, duplicate recipients) prior to on-chain execution.
- **Policy-Driven Approval-by-Exception:** Human intervention is required only when an anomaly or policy threshold breach occurs.
- **Dual Employer & Employee Portals:**
  - **Employer Admin Portal:** Manage worker EVM wallet queues, execute batch disburser smart contract runs, and review Arc USDC treasury metrics.
  - **Employee Staff Portal:** Track net income, download itemized tax/pension payslips, and configure Arc EVM wallet destinations.

## Portal Access

- Staff sign in from `/` using their existing email or a new staff email.
- Admins sign in from `/admin`.
- Set `ADMIN_EMAILS` to a comma-separated list of approved administrator emails before deploying.
- **Deel-Inspired User Architecture:** Sky-blue design system, slide-out navigation drawer, role switcher, and responsive layouts.

---

## Technical Architecture

```
Autiqo/
├── public/                  # Assets (Transparent PNGs, Logo Mark)
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx        # Circle email OTP and Arc wallet auth
│   │   ├── NavigationDrawer.jsx # Sliding Navigation Drawer
│   │   ├── PayrollWizard.jsx    # Arc Web3 Smart Contract Payout Engine
│   │   ├── ProfileModal.jsx     # Account & Arc Wallet Settings Modal
│   │   └── StaffDashboard.jsx   # Employee Income & Payslip Portal
│   ├── contracts/
│   │   └── AutiqoArcPayroll.sol # Solidity Smart Contract for Arc Testnet
│   ├── App.jsx                  # Main React Application Container
│   ├── index.css                # Design Tokens & Layout Styles
│   └── main.jsx                 # Entry Point
├── vite.config.js
└── package.json
```

---

## Technology Stack

- **Frontend:** React 19, Vite 6
- **Styling:** Custom Vanilla CSS Design System + Lucide React
- **Blockchain:** Arc Testnet, Circle user-controlled wallets, Solidity (`AutiqoArcPayroll.sol`), Web3/EVM
- **Hosting:** Vercel / PM2 Process Manager

---

## Smart Contract Overview

The batch disburser smart contract is located at `src/contracts/AutiqoArcPayroll.sol`. Key functions include:
- `executeBatchPayroll(bytes32 batchId, PayrollItem[] calldata items)`: Dispatches batch USDC payouts to worker EVM wallets.
- `PayrollBatchExecuted` & `SinglePayoutDispatched`: Emits on-chain events for full audit traceability.

---

## Quickstart

```bash
# Clone repository
git clone https://github.com/comzzy-comzzy/Autiqo.git
cd Autiqo

# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```

---

## License

MIT License. Built for Rampamble Hackathon 2026.
