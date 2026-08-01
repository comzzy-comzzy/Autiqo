import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
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
  const [statusMessage, setStatusMessage] = useState('We will email you a one-time code. No password required.');
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
      setWallet(null);
      setStatusMessage('Circle is still preparing your wallet. Please try again.');
      throw new Error('No Circle wallet is available for this account yet.');
    }

    setWallet(primaryWallet);
    let balance = null;

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
      balance = usdc?.amount || '0';
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
        setWallet(null);
        setErrorMessage(error.message || error.error || 'Circle could not prepare your wallet.');
        setStatusMessage('Wallet setup did not finish. Please try again.');
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
      usdcBalance: balance,
      circleUserToken: loginResultRef.current?.userToken || ''
    });
    onClose();
  }

  async function handleSendOtp(event) {
    event.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    if (!circleAppId || !sdkReady || !deviceId || !sdkRef.current) {
      setErrorMessage('Circle wallet sign-in is not configured yet.');
      setStatusMessage('Ask the workspace administrator to finish the Circle setup.');
      return;
    }

    setIsBusy(true);
    try {
      const otp = await circleAction('requestEmailOtp', {
        deviceId,
        email: email.trim(),
        adminOnly
      });
      sdkRef.current.updateConfigs({
        appSettings: { appId: circleAppId },
        loginConfigs: {
          deviceToken: otp.deviceToken,
          deviceEncryptionKey: otp.deviceEncryptionKey,
          otpToken: otp.otpToken
        }
      });
      setStatusMessage('Check your email and enter the code in the Circle verification window.');
      sdkRef.current.verifyOtp();
    } catch (error) {
      setErrorMessage(error.error || error.message || 'Circle could not send a verification code.');
      setStatusMessage('Email verification could not be started.');
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="auth-modal-card">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="auth-brand">
          <img src="/logo-icon.png" alt="Autiqo Logo" />
          <span>{adminOnly ? 'Employer workspace' : 'Employee workspace'}</span>
          <h2 id="auth-title">Sign in or create an account</h2>
          <p>Use your work email to continue. Circle signs you in if your account exists, or creates one if you are new.</p>
        </div>

        {errorMessage && (
          <div className="auth-alert error">
            <AlertCircle size={16} /> {errorMessage}
          </div>
        )}

        <div className="auth-alert info" aria-live="polite">
          {wallet ? <CheckCircle size={16} /> : <ShieldCheck size={16} />}
          {statusMessage}
        </div>

        <form onSubmit={handleSendOtp} className="auth-wallet-form">
          <label>
            Work email
            <span>
              <Mail size={17} />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
              />
            </span>
          </label>

          <div className="auth-action-grid single">
            <button type="submit" className="btn-primary" disabled={isBusy}>
              {isBusy ? 'Sending code...' : 'Sign in or create account'} <ArrowRight size={17} />
            </button>
          </div>
        </form>
        <p className="auth-privacy-note">
          By continuing, you agree to use Autiqo for authorized workplace access.
        </p>
      </div>
    </div>
  );
}
