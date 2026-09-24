# Embedding & Integration Guide

The `<CaptchaPage />` component is designed as a **self-contained, plug-and-play verification module**. This guide explains how to install, configure, and embed the module into any existing React application.

---

## 📦 Step-by-Step Integration

### 1. Copy Component Files
Copy the directory `src/components/CaptchaPage/` into your target project:

```
your-react-app/
└── src/
    └── components/
        └── CaptchaPage/
            ├── CaptchaPage.jsx
            ├── CaptchaPage.module.css
            ├── CaptchaHeader.jsx
            ├── ChallengeView.jsx
            ├── VerifyingView.jsx
            ├── RewardStatusIcon.jsx
            ├── ResultView.jsx
            ├── PreparingView.jsx
            ├── MockAdModal.jsx
            ├── index.js
            └── utils/
                ├── captchaGenerator.js
                └── audioEffects.js
```

### 2. Copy Static Assets
Copy the static graphics from `public/assets/` into your target project's `public/assets/` directory:

- `public/assets/background.webp` (Background texture)
- `public/assets/gem-gold.webp` (Gold reward gem)
- `public/assets/gem-purple.webp` (Purple verification gem)
- `public/assets/circle-green.svg` (Emerald checkmark background)
- `public/assets/circle-red.svg` (Crimson cross background)
- `public/assets/lock.png` (Orbital security lock)
- `public/assets/gear-icon.png` (Preparation gear spinner)

### 3. Install Peer Dependencies
Ensure the target project has the required runtime packages installed:

```bash
npm install lucide-react canvas-confetti
```

### 4. Link Google Fonts
Add the three typography links to your `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link 
  href="https://fonts.googleapis.com/css2?family=Gasoek+One&family=JetBrains+Mono:wght@500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap" 
  rel="stylesheet" 
/>
```

---

## 🔷 TypeScript Definitions

For TypeScript projects, create a definition file `CaptchaPage.d.ts`:

```typescript
export interface VerificationResult {
  /** True if user selected the correct CAPTCHA code */
  success: boolean;
  /** The option string selected by the user */
  selectedOption: string;
  /** The target CAPTCHA code that was being matched */
  correctCode: string;
}

export interface CaptchaPageProps {
  /**
   * Initial gem balance displayed in the header badge.
   * @default 125.50
   */
  initialGems?: number;

  /**
   * Invoked when verification check completes.
   */
  onComplete?: (result: VerificationResult) => void;

  /**
   * Invoked when user claims gems via MockAdModal.
   * Receives the newly updated total balance.
   */
  onGemsUpdate?: (newTotalGems: number) => void;
}

declare const CaptchaPage: React.FC<CaptchaPageProps>;
export default CaptchaPage;
```

---

## 💡 Usage Examples

### Example 1: Basic Embedded Verification View

```jsx
import React, { useState } from "react";
import CaptchaPage from "./components/CaptchaPage";

export default function EarnRewardsPage() {
  const [userGems, setUserGems] = useState(250.0);

  const handleVerificationComplete = (result) => {
    console.log("Verified:", result.success);
    console.log("Selected:", result.selectedOption);
  };

  const handleGemsUpdate = (newBalance) => {
    setUserGems(newBalance);
    // Optionally trigger an API call to sync user balance
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <CaptchaPage
        initialGems={userGems}
        onComplete={handleVerificationComplete}
        onGemsUpdate={handleGemsUpdate}
      />
    </div>
  );
}
```

---

### Example 2: Backend Sync with Auth & Telemetry

```jsx
import React, { useCallback } from "react";
import CaptchaPage from "./components/CaptchaPage";

export default function SecureRewardGate({ userToken, currentBalance }) {
  const handleComplete = useCallback(async ({ success, selectedOption, correctCode }) => {
    try {
      await fetch("/api/v1/captcha/verify-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          success,
          selectedOption,
          correctCode,
          timestamp: Date.now(),
        }),
      });
    } catch (err) {
      console.error("Telemetry report failed:", err);
    }
  }, [userToken]);

  const handleGemsUpdate = useCallback(async (newTotal) => {
    await fetch("/api/v1/wallet/credit-gems", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      },
      body: JSON.stringify({ newBalance: newTotal }),
    });
  }, [userToken]);

  return (
    <CaptchaPage
      initialGems={currentBalance}
      onComplete={handleComplete}
      onGemsUpdate={handleGemsUpdate}
    />
  );
}
```

---

### Example 3: Modal Verification Overlay

```jsx
import React, { useState } from "react";
import CaptchaPage from "./components/CaptchaPage";

export default function WithdrawalModal({ isOpen, onClose, onVerified }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full max-w-4xl h-[85vh] rounded-2xl overflow-hidden border border-purple-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white bg-white/10 px-3 py-1 rounded-full"
        >
          Close
        </button>
        <CaptchaPage
          initialGems={0}
          onComplete={(res) => {
            if (res.success) {
              onVerified();
              onClose();
            }
          }}
        />
      </div>
    </div>
  );
}
```

---

## 🛠️ Props Reference

| Prop Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `initialGems` | `number` | `125.5` | The baseline balance passed into `<CaptchaHeader />`. |
| `onComplete` | `(result: VerificationResult) => void` | `undefined` | Callback fired as soon as verification completes. |
| `onGemsUpdate` | `(newTotal: number) => void` | `undefined` | Callback fired when gem reward is claimed (+1.00 or +0.50). |
