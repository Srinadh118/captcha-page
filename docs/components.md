# Component Hierarchy & UI Specifications

This catalog provides an exhaustive breakdown of every component in the **VELoop Rewards CAPTCHA Module**, detailing their responsibilities, props, internal state, keyboard bindings, and lifecycle hooks.

---

## 🧩 Component Tree

```
src/components/CaptchaPage/
│
├── CaptchaPage.jsx          # Root orchestrator, background atmospheric effects, FSM
├── CaptchaHeader.jsx        # Branding logo, audio mute control, reactive gem badge
├── ChallengeView.jsx        # 3D tilt card, matrix scrambler, 2x2 option grid, reward pill
├── VerifyingView.jsx        # 0.5s Verifying -> Checking screen with orbital lock & progress
├── RewardStatusIcon.jsx     # Rotating orbital rings with checkmark (success) or cross (fail)
├── ResultView.jsx           # Outcome screen (+1 / +0.5 Gem) with Claim & No Thanks actions
├── PreparingView.jsx        # Intermediate preparation loader with rotating gear spinner
├── MockAdModal.jsx          # Sponsored partner modal with 3s skip countdown & confetti burst
└── index.js                 # Barrel export
```

---

## 1. `<CaptchaPage />`

**Location**: `src/components/CaptchaPage/CaptchaPage.jsx`  
**Role**: Top-level container and Finite State Machine orchestrator.

### Responsibilities
- Houses and drives the 5-state lifecycle (`challenge` ➔ `verifying` ➔ `result` ➔ `preparing` ➔ `mock_ad`).
- Manages the ambient cursor spotlight with hardware-accelerated `requestAnimationFrame`.
- Renders the vertical **Gasoek One** `"CAPTCHA"` watermark and drifting cyber dust particles.
- Coordinates gem balance updates and invalidates expired challenges.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `initialGems` | `number` | `125.5` | Starting gem balance displayed in `<CaptchaHeader />`. |
| `onComplete` | `(result: { success: boolean, selectedOption: string, correctCode: string }) => void` | `undefined` | Callback fired when verification resolution concludes. |
| `onGemsUpdate` | `(newTotal: number) => void` | `undefined` | Callback fired when user collects rewards in `<MockAdModal />`. |

### Internal State
- `gems`: Current numerical gem balance.
- `flowState`: Active view string (`"challenge" | "verifying" | "result" | "preparing" | "mock_ad"`).
- `challenge`: Active challenge object containing `{ code, options }`.
- `selectedOption`: String of the user's selected choice or `null`.
- `isSuccess`: Boolean flag indicating if `selectedOption === challenge.code`.

---

## 2. `<CaptchaHeader />`

**Location**: `src/components/CaptchaPage/CaptchaHeader.jsx`  
**Role**: Persistent navigation and utility bar.

### Responsibilities
- Displays the **VELoop REWARDS** brand typography with purple gradient styling.
- Houses the sound toggle button with synchronized icon states (`Volume2` vs `VolumeX`).
- Features a reactive gem badge with an automatic CSS scale-bump animation whenever the gem balance updates.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `gems` | `number` | `125.5` | The live gem balance to format (e.g. `125.50`). |

### Keyboard Shortcuts
- Press **`M`** or **`m`**: Toggles sound synthesizer mute state globally.

---

## 3. `<ChallengeView />`

**Location**: `src/components/CaptchaPage/ChallengeView.jsx`  
**Role**: Primary interactive observation challenge interface.

### Responsibilities
- Renders the interactive CAPTCHA card with:
  - **3D perspective tilt** responding to cursor movement (`rotateX` / `rotateY`).
  - **Matrix code decode scrambler**: Upon challenge generation, characters randomly decode over 10 frames before locking into the target code.
  - **Dynamic mouse specular shine**: Concentrated light reflection based on cursor proximity.
  - **Animated laser scanline**: Periodic vertical sweep across the card face.
  - **Quick refresh button**: Rotates 360° on click or when **`R`** is pressed.
- Presents the **2x2 Answer Grid**:
  - Four distinct interactive buttons with keyboard indicators (`1`, `2`, `3`, `4`).
  - Plays tactile audio tick on hover and blip on click.
- Features **symmetrical slide animations**:
  - *Entry*: Card enters from left; header, description, and 4 options stagger in from right; bottom pill slides in from below.
  - *Exit*: Card slides out to the left; options stagger out to the right (450ms).
- Bottom incentive pill: Displays "+1 Gem" with glowing gold gem graphic.

### Props

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `challenge` | `object` | Yes | Object containing `{ code: string, options: string[] }`. |
| `onSelect` | `(option: string) => void` | Yes | Callback invoked when user selects an answer. |
| `onRefresh` | `() => void` | Yes | Callback invoked when user clicks the refresh icon. |

### Keyboard Shortcuts
- **`1`**, **`2`**, **`3`**, **`4`** or **`A`**, **`B`**, **`C`**, **`D`**: Immediately selects option 1 through 4.
- **`R`** or **`r`**: Generates and scrambles a new CAPTCHA code.

---

## 4. `<VerifyingView />`

**Location**: `src/components/CaptchaPage/VerifyingView.jsx`  
**Role**: Dual-phase security verification screen.

### Responsibilities
- Enforces the strict **0.5-second verification transition**:
  - Displays `"Verifying..."` for the first 500ms.
  - Smoothly morphs status text to `"Checking..."` for the remaining ~750ms.
- Features a cyberpunk orbital spinner with an orbiting light node and security lock icon.
- Renders an automated linear progress bar (0% ➔ 100%).
- Displays fintech trust badges (`Encrypted`, `Protected`, `Verified`).
- Synthesizes an ambient frequency sweep scan sound (`verify`).

### Props

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `onComplete` | `() => void` | Yes | Callback triggered after ~1250ms when the checking phase concludes. |

---

## 5. `<RewardStatusIcon />`

**Location**: `src/components/CaptchaPage/RewardStatusIcon.jsx`  
**Role**: Rotating orbital outcome indicator.

### Responsibilities
- Renders concentric rotating rings:
  - Outer ring: Rotates clockwise with dual orbiting dot particles.
  - Inner ring: Counter-rotates counter-clockwise.
- Center status icon:
  - **Success (`true`)**: Emerald green glow (`#34C759`) with SVG tick path.
  - **Failure (`false`)**: Crimson alert glow (`#FF383C`) with SVG cross path.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `success` | `boolean` | `true` | Determines whether the icon displays a green tick or red cross. |

---

## 6. `<ResultView />`

**Location**: `src/components/CaptchaPage/ResultView.jsx`  
**Role**: Clear outcome and reward disposition screen.

### Responsibilities
- Communicates outcome clearly and positively:
  - **Success**: Header displays `"Verification complete!"`, reward displays `"+1 Gem"`, subtitle `"Full reward earned"`. Plays victory chord.
  - **Incorrect Attempt**: Header displays `"Verification unsuccessful!"`, reward displays `"+0.5 Gem"`, subtitle `"Keep going. Your reward is still yours."`. Plays low alert tone.
- Visual hierarchy of action buttons:
  - **`Claim`** (Primary): Prominent purple gradient with glow. Advances to `<PreparingView />`.
  - **`No Thanks`** (Secondary): Subtle outlined button with hover transition. Discards challenge and regenerates a new one immediately.
- Displays secure session footer pill (`Secure Reward Transfer` / `Safe & Encrypted Session`).

### Props

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `success` | `boolean` | Yes | Whether the selected option matched the challenge code. |
| `onClaim` | `() => void` | Yes | Callback invoked when user clicks "Claim". |
| `onNoThanks` | `() => void` | Yes | Callback invoked when user clicks "No Thanks". |

---

## 7. `<PreparingView />`

**Location**: `src/components/CaptchaPage/PreparingView.jsx`  
**Role**: Intermediate transition state preceding the rewarded ad.

### Responsibilities
- Provides a smooth 1.1s bridge between clicking "Claim" and launching the ad modal.
- Features a rotating mechanical gear icon inside dual concentric rings.
- Animates a quick loading progress bar to 100%.
- Displays `"Please wait while we prepare your reward."` alongside security badges.

### Props

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `onReady` | `() => void` | Yes | Callback invoked when preparation timer finishes (1100ms). |

---

## 8. `<MockAdModal />`

**Location**: `src/components/CaptchaPage/MockAdModal.jsx`  
**Role**: Premium rewarded partner placeholder.

### Responsibilities
- Simulates a rewarded sponsor placement ("VELoop Nitro Pass").
- Implements an automated **3-second skip countdown**:
  - Button displays `"Skip in 3s"` ➔ `"Skip in 2s"` ➔ `"Skip in 1s"` with disabled cursor.
  - After 3 seconds, unlocks into an active `"Skip Reward"` button.
- Primary **"Collect Reward & Continue"** action:
  - Triggers a celebratory particle burst via **`canvas-confetti`** (`#a855f7`, `#facc15`, `#38bdf8`).
  - Plays the sparkling `gem` chime.
  - Dispatches `onClaimReward()` to increment gem count and loop to a fresh CAPTCHA.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `rewardAmount` | `number` | `1` | Gem increment amount (`1.0` or `0.5`). |
| `onClaimReward` | `() => void` | Yes | Callback to credit gems and advance flow. |
| `onSkip` | `() => void` | Yes | Callback to skip ad and generate a new challenge. |
