# Autiqo AI 🚀
### Autonomous Web3 Workforce Payroll & Payout Orchestration Engine on Base Network

![Autiqo AI Banner](/public/african1.png)

Autiqo AI is an autonomous, AI agent-driven payroll and cross-border workforce payment orchestration platform built for African businesses and remote teams. It replaces manual spreadsheet calculations with automated statutory tax deductions (PAYE, PenCom, SSNIT), AI anomaly detection, and automated batch USDC disburser smart contracts on the **Base Network**.

---

## 🌟 Key Features

- **Base Network Web3 Smart Contract Payouts:** Automated batch USDC salary disburser executed on Base with near-instant finality and < $0.01 gas fees.
- **Multi-Agent Payroll Orchestration:** Specialized AI validation agents scan payroll batches for anomalies (e.g. salary spikes, duplicate wallets) before execution.
- **Human Approval-by-Exception:** Policy-driven workflow requiring 1-click founder authorization only when anomalies or policy breaches occur.
- **Dual Portal Architecture:**
  - **Employer Admin Portal:** Manage workforce queues, run payroll execution wizards, and review treasury metrics.
  - **Employee Staff Portal:** View take-home pay, download itemized tax/pension payslips, and configure Base EVM wallet addresses.
- **Deel-Inspired User Experience:** Sleek sky-blue design system, slide-out navigation drawer, and smooth loading splash animations.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 19 + Vite 6
- **Styling & Icons:** Custom Vanilla CSS Design System + Lucide React
- **Blockchain & Smart Contracts:** Base Network, Solidity (`AutiqoBasePayroll.sol`), Web3 / Ethers
- **Process Management:** PM2 Process Manager

---

## 📁 Repository Structure

```
Autiqo/
├── public/
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx        # Deel-style Authentication & Registration Gateway
│   │   ├── NavigationDrawer.jsx # Sliding Navigation Drawer
│   │   ├── PayrollWizard.jsx    # Base Web3 Smart Contract Payout Engine
│   │   ├── ProfileModal.jsx     # Account & Base Wallet Settings Modal
│   │   └── StaffDashboard.jsx   # Employee Income & Payslip Portal
│   ├── contracts/
│   │   └── AutiqoBasePayroll.sol # Solidity Smart Contract for Base Network
│   ├── App.jsx                  # Main Application Component
│   ├── index.css                # Global Design System & Utility Styles
│   └── main.jsx                 # React Entry Point
├── vite.config.js
└── package.json
```

---

## 🚀 Quickstart & Local Setup

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd Autiqo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📄 Smart Contract (`AutiqoBasePayroll.sol`)

The batch payroll smart contract is located at `src/contracts/AutiqoBasePayroll.sol`. It supports:
- Batch USDC payouts to worker EVM wallets.
- Event emission for `PayrollBatchExecuted` and `SinglePayoutDispatched`.

---

## 📜 License

MIT License. Built for Rampamble Hackathon 2026.
