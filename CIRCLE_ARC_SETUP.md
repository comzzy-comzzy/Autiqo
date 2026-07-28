# Circle Arc Wallet Setup for Autiqo

This file explains what you need to add to make Autiqo sign-in and account creation work with Circle user-controlled wallets on Arc.

## What You Need

You need two required values from Circle:

```env
CIRCLE_API_KEY=your_circle_api_key
VITE_CIRCLE_APP_ID=your_circle_wallet_app_id
```

This optional value is already set by default in the code:

```env
CIRCLE_API_URL=https://api.circle.com
```

## Step 1: Create or Open Your Circle Developer Account

Go to:

https://console.circle.com/

Sign up or log in.

## Step 2: Create Your Circle API Key

In the Circle Console:

1. Open **API & Client Keys** or **Keys** from the sidebar.
2. Click **Create a key**.
3. Choose **API Key**.
4. Choose **Standard Key**.
5. Copy the generated key.

That copied value is:

```env
CIRCLE_API_KEY
```

Keep this private. Do not put it inside frontend code or public files.

Circle docs:

https://developers.circle.com/contracts/create-api-key

## Step 3: Configure Email OTP Wallet Login

In the Circle Console:

1. Go to **Wallets**.
2. Click **User Controlled**.
3. Open **Configurator**.
4. Go to **Authentication Methods**.
5. Choose **Email**.
6. Add SMTP settings so Circle can send OTP codes to user emails.

For testing, Circle suggests Mailtrap:

https://mailtrap.io/

From Mailtrap, copy these SMTP values:

```txt
Host
Port
Username
Password
```

Paste them into Circle's Email authentication settings.

## Step 4: Copy Your Circle App ID

Still inside Circle:

**Wallets -> User Controlled -> Configurator**

Copy the **App ID**.

That copied value is:

```env
VITE_CIRCLE_APP_ID
```

Circle wallet docs:

https://developers.circle.com/wallets/user-controlled/build-a-wallet-app

## Step 5: Add The Values To Vercel

In the project terminal, run:

```bash
vercel env add CIRCLE_API_KEY production
```

Paste your Circle API key when Vercel asks.

Then run:

```bash
vercel env add VITE_CIRCLE_APP_ID production
```

Paste your Circle App ID when Vercel asks.

Optional:

```bash
vercel env add CIRCLE_API_URL production
```

Paste:

```txt
https://api.circle.com
```

## Step 6: Redeploy The Site

After adding the Vercel environment variables, redeploy:

```bash
vercel deploy --prod
```

Then open:

https://autiqo.vercel.app

## Expected User Flow

1. User clicks **Sign In** or **Create Account**.
2. User enters their email.
3. User clicks **Send Email Code**.
4. Circle sends an OTP code to the email.
5. User verifies the OTP in Circle's hosted verification screen.
6. Circle creates or recovers the same user-controlled Arc wallet for that email.
7. Autiqo opens the employer or employee portal.

## Important Notes

- `CIRCLE_API_KEY` is private and must only be stored in Vercel environment variables.
- `VITE_CIRCLE_APP_ID` is safe for the frontend because Circle's Web SDK needs it.
- Users control their wallets. Autiqo does not hold private keys.
- Salary withdrawal should use the same email login so the user recovers the same Circle wallet.
- The current Vercel project had no Circle environment variables when checked, so OTP will not work until you add them.
