# VELoop Rewards - CAPTCHA Verification Page

A modular, cyber-gamified **CAPTCHA Verification Page** built for the **VELoop Rewards** platform. Designed with high-fidelity cyberpunk aesthetics, organic micro-interactions, Web Audio API sound synthesizers, and complete device responsiveness.

---

## ✨ Features

- **Interactive Visual Observation Challenge**: Generates dynamic 6-character alphanumeric CAPTCHAs alongside challenging, non-trivial distractor options (character transpositions, look-alike substitutions, and structural twins) to create genuine visual engagement.
- **Complete Verification Lifecycle**:
  ```
  CAPTCHA Challenge
         │
         │ (Select option)
         ▼
     VERIFYING
         │
         │ (500ms transition)
         ▼
     CHECKING
         │
         │ (Resolve answer)
         ▼
       RESULT
   ┌─────┴────────┐
   ▼              ▼
  CLAIM        NO THANKS
   │              │
   ▼              │
  PREPARING         │
   │              │
   ▼              │
  MOCK AD           │
   │              │
   └──────┬───────┘
          ▼
     NEW CAPTCHA
  ```
- **Symmetrical Fade-In & Fade-Out Motion**:
  - **Entry (Fade-In)**: The CAPTCHA card slides in from the left, header text and the 4 options slide in staggered from the right, and the bottom reward pill slides in from below.
  - **Exit (Fade-Out)**: On option selection, the card slides out to the left while options stagger out to the right.
- **Rich Cyber Visuals**:
  - Top-right to bottom-left dark purple gradients (`#0C0013` to `#632B76` on card; `#050207` to `#261333` on buttons).
  - Linear gradient borders (`#9A59DA` to `#210141`) on active/hovered states with clean bottom shadows.
  - Animated organic gooey backdrop (`gooy.svg`) across Verification, Reward, and Mock Ad screens.
  - Concentric rotating orbital circles for green checkmark and red cross status icons.
  - Giant vertical **"CAPTCHA"** watermark in **Gasoek One** font with linear gradient overlay.
- **Audio Synthesizer (No External Audio Files)**:
  - Built-in Web Audio API synth producing crisp digital blips, scanning hums, success victory chords, and gem pickup tones. Includes a mute toggle in the top bar.
- **Confetti Celebration & Live Counter**:
  - Celebratory particle burst and reactive animated Gem counter badge updating upon claiming rewards (+1.00 Gem or +0.50 Gem).
- **Strict CSS Modules**:
  - 100% scoped `.module.css` implementation across all components.

---

## 📁 Project Structure

```
src/
├── components/
│   └── CaptchaPage/                # Self-contained modular package
│       ├── CaptchaPage.jsx         # Main state machine orchestrator
│       ├── CaptchaPage.module.css  # Layout, background, & Gasoek One watermark
│       ├── CaptchaHeader.jsx       # Header with VELoop brand & live gem badge
│       ├── CaptchaHeader.module.css
│       ├── ChallengeView.jsx       # Captcha card + 2x2 options + reward pill
│       ├── ChallengeView.module.css
│       ├── VerifyingView.jsx       # Verifying/Checking state with orbital lock
│       ├── VerifyingView.module.css
│       ├── RewardStatusIcon.jsx    # Rotating circular orbital rings with check/cross
│       ├── RewardStatusIcon.module.css
│       ├── ResultView.jsx          # Verification Complete / Unsuccessful screens
│       ├── ResultView.module.css
│       ├── PreparingView.jsx       # Intermediate reward preparation screen
│       ├── PreparingView.module.css
│       ├── MockAdModal.jsx         # Interactive sponsor ad with countdown & claim
│       ├── MockAdModal.module.css
│       ├── index.js                # Clean barrel export for instant copy-pasting
│       └── utils/
│           ├── captchaGenerator.js # Realistic code & distractor generation algorithm
│           └── audioEffects.js     # Web Audio API sound synthesizer
├── App.jsx                         # Parent container configuring React Router
├── App.module.css                  # Container layout styles
├── index.css                       # Minimal reset & base styles
└── main.jsx                        # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository and navigate into the folder
cd captcha-page

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser to view the application.

### Production Build

```bash
npm run build
```

Builds the optimized production assets into the `dist/` directory.

---

## 📦 Using `CaptchaPage` in Another Project

The `CaptchaPage` component is fully modular and self-contained. To integrate it into any existing React project:

1. Copy the `src/components/CaptchaPage/` directory into your project.
2. Copy the public assets in `/public/assets/` into your project's `/public/assets/` directory.
3. Import and use `<CaptchaPage />`:

```jsx
import CaptchaPage from "./components/CaptchaPage";

function VerificationScreen() {
  const handleComplete = (result) => {
    console.log("Verification status:", result.success);
    console.log("Selected option:", result.selectedOption);
  };

  const handleGemsUpdate = (newTotalGems) => {
    console.log("Updated gems:", newTotalGems);
  };

  return (
    <CaptchaPage
      initialGems={125.5}
      onComplete={handleComplete}
      onGemsUpdate={handleGemsUpdate}
    />
  );
}
```

### Available Props

| Prop           | Type                                                                                  | Default     | Description                                                 |
| :------------- | :------------------------------------------------------------------------------------ | :---------- | :---------------------------------------------------------- |
| `initialGems`  | `number`                                                                              | `125.50`    | Initial gem balance displayed in the header badge.          |
| `onComplete`   | `(result: { success: boolean, selectedOption: string, correctCode: string }) => void` | `undefined` | Callback invoked when verification check resolves.          |
| `onGemsUpdate` | `(newTotal: number) => void`                                                          | `undefined` | Callback invoked when gems are claimed and balance updates. |

---

## 🛠️ Technology Stack

- **Framework**: React 19
- **Bundler**: Vite 8
- **Routing**: React Router 7
- **Styling**: Vanilla CSS Modules (`*.module.css`)
- **Icons**: Lucide React
- **Effects**: Canvas Confetti & Web Audio API
- **Fonts**: Poppins, JetBrains Mono, Gasoek One (via Google Fonts)
