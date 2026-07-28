import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Mail,
  ShieldCheck,
  UserCheck,
  X
} from 'lucide-react';

const circleAppId = import.meta.env.VITE_CIRCLE_APP_ID || '';

async function circleAction(action, params = {}) {
  const response = await fetch('/api/circle-wallet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...params })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw data;
  }
  return data;
}

function getDisplayName(email, accountType) {
  if (accountType === 'client') return 'Employer Admin';
  const prefix = email.split('@')[0]?.replace(/[._-]+/g, ' ') || 'Employee';
  return prefix.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AuthModal({ onLogin, onClose, initialAccountType = 'contractor', adminOnly = false }) {
  const sdkRef = useRef(null);
  const loginResultRef = useRef(null);

  const [accountType] = useState(initialAccountType);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('Nigeria');

  const [sdkReady, setSdkReady] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [wallet, setWallet] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Enter your email to recover or create your Arc wallet.');
  const [errorMessage, setErrorMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootCircleSdk() {
      try {
        const { W3SSdk } = await import('@circle-fin/w3s-pw-web-sdk');
        const sdk = new W3SSdk(
          {
            appSettings: { appId: circleAppId },
            loginConfigs: {}
          },
          (error, result) => {
            if (cancelled) return;

            if (error) {
              setErrorMessage(error.message || 'Circle email verification failed.');
              setStatusMessage('Email verification failed. Request a new code and try again.');
              return;
            }

            const verified = {
              userToken: result.userToken,
              encryptionKey: result.encryptionKey
            };
            loginResultRef.current = verified;
            setErrorMessage('');
            setStatusMessage('Email verified. Preparing your Arc wallet.');
            setIsBusy(true);
            void initializeOrLoadWallet(verified);
          }
        );

        sdkRef.current = sdk;
        const cachedDeviceId = window.localStorage.getItem('autiqo.circle.deviceId');
        const id = cachedDeviceId || await sdk.getDeviceId();
        window.localStorage.setItem('autiqo.circle.deviceId', id);

        if (!cancelled) {
          setDeviceId(id);
          setSdkReady(true);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage('Circle Wallet SDK is not ready. Check the package install and VITE_CIRCLE_APP_ID.');
          setStatusMessage(error.message || 'Could not initialize Circle Wallet SDK.');
        }
      }
    }

    void bootCircleSdk();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadWallets(userToken, source = 'loaded') {
    const walletData = await circleAction('listWallets', { userToken });
    const wallets = walletData.wallets || [];
    const primaryWallet = wallets.find((item) => item.blockchain === 'ARC-TESTNET') || wallets[0] || null;

    if (!primaryWallet) {
      const pendingWallet = {
        id: 'Circle wallet pending',
        address: 'Creating Arc wallet...',
        blockchain: 'ARC-TESTNET'
      };
      setWallet(pendingWallet);
      setStatusMessage('Email verified. Your Arc wallet dashboard is opening.');
      finishLogin(pendingWallet, '0');
      return pendingWallet;
    }

    setWallet(primaryWallet);

    try {
      const balanceData = await circleAction('getTokenBalance', {
        userToken,
        walletId: primaryWallet.id
      });
      const balances = balanceData.tokenBalances || [];
      const usdc = balances.find((item) => {
        const symbol = item.token?.symbol || '';
        const name = item.token?.name || '';
        return symbol.includes('USDC') || name.includes('USDC');
      });
    const balance = usdc?.amount || '0';
    setUsdcBalance(balance);
    } catch {
      setUsdcBalance(null);
    }

    setStatusMessage(source === 'created' ? 'Arc wallet created.' : 'Arc wallet recovered.');
    finishLogin(primaryWallet, balance);
    return primaryWallet;
  }

  async function initializeOrLoadWallet(credentials = loginResultRef.current) {
    if (!credentials?.userToken) {
      setErrorMessage('Verify your email before creating or recovering the wallet.');
      return;
    }

    setIsBusy(true);
    try {
      const result = await circleAction('initializeUser', { userToken: credentials.userToken });

      if (result.challengeId) {
        const sdk = sdkRef.current;
        sdk.setAuthentication({
          userToken: credentials.userToken,
          encryptionKey: credentials.encryptionKey
        });

        setStatusMessage('Approve the Circle wallet creation challenge.');
        sdk.execute(result.challengeId, async (error) => {
          if (error) {
            setErrorMessage(error.message || 'Wallet creation was not approved.');
            setIsBusy(false);
            return;
          }
          await loadWallets(credentials.userToken, 'created');
          setIsBusy(false);
        });
        return;
      }

      await loadWallets(credentials.userToken);
    } catch (error) {
      if (error.code === 155106 || String(error.message || '').includes('155106')) {
        await loadWallets(credentials.userToken);
      } else {
        const pendingWallet = {
          id: 'Circle wallet pending',
          address: 'Wallet recovery in progress',
          blockchain: 'ARC-TESTNET'
        };
        setWallet(pendingWallet);
        setStatusMessage('Email verified. Opening your dashboard while Circle finishes wallet recovery.');
        finishLogin(pendingWallet, '0');
      }
    } finally {
      setIsBusy(false);
    }
  }

  function finishLogin(primaryWallet = wallet, balance = usdcBalance) {
    onLogin({
      role: accountType === 'client' ? 'admin' : 'staff',
      email,
      name: fullName || getDisplayName(email, accountType),
      company: companyName || 'Autiqo Workspace',
      country,
      authProvider: 'circle-user-controlled-wallet',
      wallet: primaryWallet,
      usdcBalance: balance
    });
  }

  async function handleSendOtp(event) {
    event.preventDefault();
    setErrorMessage('');

    if (!circleAppId) {
      setErrorMessage('Missing VITE_CIRCLE_APP_ID. Add the Circle Wallet App ID before using wallet login.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    if (!sdkReady || !deviceId) {
      setErrorMessage('Circle Wallet SDK is still loading. Try again in a moment.');
      return;
    }

    setIsBusy(true);
    try {
      const session = await circleAction('requestEmailOtp', { deviceId, email, adminOnly });

      sdkRef.current.updateConfigs({
        appSettings: { appId: circleAppId },
        loginConfigs: {
          deviceToken: session.deviceToken,
          deviceEncryptionKey: session.deviceEncryptionKey,
          otpToken: session.otpToken,
          email: { email }
        }
      });

      setStatusMessage('Code sent. Enter the code in the Circle verification window.');
      window.setTimeout(() => {
        sdkRef.current?.verifyOtp();
      }, 250);
    } catch (error) {
      setErrorMessage(error.error || error.message || 'Could not send Circle email OTP.');
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-card">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="auth-brand">
          <img src="/logo-icon.png" alt="Autiqo Logo" />
          <h2>{adminOnly ? 'Admin Sign In / Sign Up' : 'Staff Sign In / Sign Up'}</h2>
          <p>Sign in or sign up with your email to access your dashboard and Arc Web3 wallet.</p>
        </div>

        {errorMessage && (
          <div className="auth-alert error">
            <AlertCircle size={16} /> {errorMessage}
          </div>
        )}

        <div className="auth-alert info">
          {wallet ? <CheckCircle size={16} /> : <ShieldCheck size={16} />}
          {statusMessage}
        </div>

        <form onSubmit={handleSendOtp} className="auth-wallet-form">
          <label>
            Email Address
            <span>
              <Mail size={17} />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your.email@company.com"
              />
            </span>
          </label>

          <div className="auth-action-grid single">
            <button type="submit" className="btn-primary" disabled={isBusy}>
              <Mail size={17} /> {isBusy ? 'Opening Verification...' : 'Send Verification Code'}
            </button>
          </div>
        </form>

        {wallet && (
          <div className="auth-wallet-summary">
            <div>
              <span>Arc wallet</span>
              <strong>{wallet.address}</strong>
            </div>
            <div>
              <span>Network</span>
              <strong>{wallet.blockchain || 'ARC-TESTNET'}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
