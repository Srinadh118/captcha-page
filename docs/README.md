# VELoop Rewards — CAPTCHA Earn Module Documentation Hub

> **A modern, cyber-gamified CAPTCHA verification frontend built for the VELoop Rewards ecosystem.**  
> Built with **React 19**, **Vite 8**, scoped **CSS Modules**, and **Web Audio API** sound synthesis.

---

## 📌 Executive Overview

The **VELoop Rewards CAPTCHA Earn Module** re-imagines traditional web security verifications as an engaging, rewarded micro-experience. Rather than confronting users with frustrating and distorted OCR challenges, VELoop uses a **visual observation challenge** with high-fidelity cyberpunk aesthetics, 3D card tilt physics, zero-asset audio synthesis, and a complete fintech-style reward lifecycle.

```
       [ CAPTCHA CHALLENGE ]
                 │
                 │ (User selects 1 of 4 options)
                 ▼
       [ SELECTION ANIMATION ] (0.5s transition)
                 │
                 ▼
          [ CHECKING STATE ] (Concentric orbital lock)
                 │
                 ▼
           [ RESULT VIEW ]
         ┌───────┴────────┐
         ▼                ▼
   [ CLAIM +1 GEM ]   [ NO THANKS ]
         │                │
         ▼                │
    [ PREPARING ]         │
         │                │
         ▼                │
    [ MOCK AD MODAL ]     │
         │                │
         └────────┬───────┘
                  ▼
         [ FRESH NEW CAPTCHA ] (Single-use invariant)
```

---

## 📚 Documentation Architecture

This documentation suite is organized according to modular documentation guidelines. Each file focuses on a distinct architectural layer:

| Document | Description | Target Audience |
| :--- | :--- | :--- |
| [**Architecture & State Machine**](./architecture.md) | Finite State Machine (FSM), state transitions, unidirectional data flow, and anti-reuse invariant | Software Architects, Senior Developers |
| [**Component Hierarchy & Catalog**](./components.md) | Component-by-component breakdown, props, local state, DOM structure, and UI behavior | Frontend Developers, UI Engineers |
| [**Challenge & Distractor Algorithms**](./algorithms.md) | Mathematical observation challenge logic, look-alike substitution tables, and matrix decode scrambler | Security Engineers, Algorithm Specialists |
| [**Web Audio API Engine**](./audio-engine.md) | Zero-external-file audio synthesis engine, waveform frequency envelopes, and mute persistence | Audio Designers, Frontend Developers |
| [**Cyberpunk Design System**](./design-system.md) | Design tokens, typography scales, 3D card tilt physics, laser scanlines, and responsive breakpoints | UI/UX Designers, CSS Engineers |
| [**Integration & SDK Guide**](./integration.md) | Step-by-step guide to embedding `<CaptchaPage />` into external React applications with TypeScript types | Integration Engineers, App Developers |
| [**Acceptance Criteria Audit**](./acceptance-criteria.md) | 32-point specification compliance audit verified against the original task specification | QA Engineers, Product Managers |
| [**Development & Operations**](./development.md) | Local environment setup, Vite scripts, directory inventory, build optimization, and deployment | DevOps, Full-Stack Engineers |

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm` (v9+) or `pnpm` (v8+)

### 2. Installation & Run
```bash
# 1. Clone repository
git clone https://github.com/Srinadh118/captcha-page.git
cd captcha-page

# 2. Install dependencies
npm install

# 3. Launch Vite development server
npm run dev
```

Visit [`http://localhost:5173`](http://localhost:5173) in your modern browser.

---

## 🎮 Interactive Features At A Glance

- **Visual Observation Challenge**: 6-character alphanumeric code rendered inside a high-tech card with dynamic laser scanlines and interactive 3D perspective tilt.
- **Matrix Scrambler Effect**: Code decrypts upon loading or refreshing with random character cycling before locking into the target code.
- **Intelligent Distractor Generator**: Generates 1 correct option, 2 look-alike / transposed options, and 1 structurally distinct distractor.
- **Dual-Phase Verification**: 0.5s selection feedback seamlessly morphs into an animated orbital checking screen.
- **Fintech Reward Flow**: Correct answers award **+1.00 Gem**; incorrect attempts still award **+0.50 Gem** (encouraging retention without penalization).
- **Zero-Asset Web Audio Synthesizer**: Digital blips, hum scans, crystal victory chimes, coin pickup chimes, and hover ticks synthesized entirely in real-time via the browser's `AudioContext`.
- **Keyboard Navigation**:
  - `1`, `2`, `3`, `4` or `A`, `B`, `C`, `D`: Select answer option.
  - `R`: Refresh challenge with new code and options.
  - `M`: Toggle global audio mute.
- **Celebratory Particles & Counter**: Canvas-confetti burst upon collecting rewards, updating the reactive gem counter badge in the header.

---

## 📂 Source Code Layout

```
captcha-page/
├── docs/                               # Complete project documentation suite
│   ├── README.md                       # Documentation hub (this file)
│   ├── architecture.md                 # State machine & lifecycle
│   ├── components.md                   # Component catalog & prop specifications
│   ├── algorithms.md                   # Captcha generation & distractor math
│   ├── audio-engine.md                 # Web Audio API synthesizer
│   ├── design-system.md                # Design tokens, motion & responsive rules
│   ├── integration.md                  # Embedding guide & TypeScript interfaces
│   ├── acceptance-criteria.md          # 32-point specification audit
│   └── development.md                  # Setup, scripts, builds, and troubleshooting
├── public/
│   └── assets/                         # Static icons, gems, and background textures
├── src/
│   ├── components/
│   │   └── CaptchaPage/                # Modular, self-contained CAPTCHA module
│   │       ├── CaptchaPage.jsx         # Root orchestrator & state machine
│   │       ├── CaptchaHeader.jsx       # Branding, mute button, live gem counter
│   │       ├── ChallengeView.jsx       # 3D tilt card, 2x2 option grid, reward pill
│   │       ├── VerifyingView.jsx       # Dual-phase checking loader with orbital lock
│   │       ├── RewardStatusIcon.jsx    # Concentric orbital rings with check/cross
│   │       ├── ResultView.jsx          # Outcome screen with Claim / No Thanks
│   │       ├── PreparingView.jsx       # Intermediate ad-preparation screen
│   │       ├── MockAdModal.jsx         # Sponsored ad placeholder with countdown
│   │       ├── index.js                # Clean barrel export
│   │       └── utils/
│   │           ├── captchaGenerator.js # Random code & distractor generation
│   │           └── audioEffects.js     # Web Audio API sound synthesizer
│   ├── App.jsx                         # App root with React Router navigation
│   ├── index.css                       # Global reset & baseline styles
│   └── main.jsx                        # React 19 entry point
├── package.json                        # Dependencies and script definitions
└── vite.config.js                      # Vite configuration
```

---

## 🛡️ License & Credits

Built for the **VELoop Rewards** platform ecosystem.  
Typography courtesy of **Google Fonts** (*Gasoek One*, *Poppins*, *JetBrains Mono*). Icons powered by **Lucide React**.
