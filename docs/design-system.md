# Cyberpunk Design System & Styling

This document outlines the visual identity, design tokens, typography, 3D physics, motion choreography, and responsive architecture of the **VELoop Rewards CAPTCHA Module**.

---

## 🎨 Visual Identity: Cyberpunk Meets Fintech

The design balances two core objectives:
1. **Cyberpunk Security Aesthetic**: Evoking cutting-edge quantum encryption with dark purple gradients, laser scanlines, 3D perspective cards, and terminal-style matrix decoders.
2. **Trustworthy Fintech Experience**: Avoiding garish casino/gambling visuals in favor of clean information hierarchy, crisp reward badges, elegant orbital rings, and professional typography.

---

## 🌈 Color Palette & Design Tokens

```
Canvas & Surfaces
  ├── Background Canvas:      #07040c (Deep Obsidian Purple)
  ├── Card Body Gradient:     linear-gradient(135deg, #0C0013 0%, #632B76 100%)
  ├── Button Base Gradient:   linear-gradient(135deg, #050207 0%, #261333 100%)
  └── Modal Backdrop:         rgba(7, 4, 12, 0.85) (with backdrop-filter blur 16px)

Cyber Neons & Accents
  ├── Primary Purple Neon:    #9A59DA
  ├── Deep Border Violet:     #210141
  ├── Particle Amethyst:      #c084fc
  ├── Ambient Radial Spot:    rgba(121, 40, 202, 0.14)

Reward & Status Colors
  ├── Gold Reward Accent:     #facc15 (Golden Gem)
  ├── Success Emerald:        #34C759 (Green Verified Checkmark)
  └── Non-Punitive Crimson:   #FF383C (Red Attempt Cross)
```

---

## 🔤 Typography System

Three Google Fonts provide typographic hierarchy:

| Font Family | Weights | Usage / Elements |
| :--- | :--- | :--- |
| **`Gasoek One`** | 400 (Heavy) | Giant vertical rotated background watermark (`CAPTCHA`). |
| **`Poppins`** | 400, 500, 600, 700, 800 | Primary interface font, headings, descriptions, buttons, badges. |
| **`JetBrains Mono`** | 500, 600, 700 | 6-character CAPTCHA display, security tags (`AES-256 VERIFY`), keyboard hints. |

### Gasoek One Watermark
```css
.captchaWatermark {
  position: absolute;
  left: 15%;
  top: 110%;
  transform: rotate(-90deg);
  transform-origin: top left;
  font-family: "Gasoek One", sans-serif;
  font-size: clamp(140px, 24vh, 200px);
  background: linear-gradient(to bottom left, #0503076b 0%, #190e2149 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  user-select: none;
  pointer-events: none;
  animation: watermarkBreath 10s infinite ease-in-out;
}
```

---

## 🕹️ 3D Perspective Tilt Physics

`<ChallengeView />` responds dynamically to cursor movements across the CAPTCHA card, creating an authentic physical 3D card tilt:

### Coordinate Math
```javascript
const rect = cardRef.current.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
const centerX = rect.width / 2;
const centerY = rect.height / 2;

// Limit tilt range to [-8deg, +8deg] for sleek, non-distracting feel
const rotateX = ((y - centerY) / centerY) * -8;
const rotateY = ((x - centerX) / centerX) * 8;

setCardTilt({ x: rotateX, y: rotateY });
setMousePos({
  x: (x / rect.width) * 100,
  y: (y / rect.height) * 100,
});
```

### Specular Light Shine
The cursor's relative percentage coordinates are injected into CSS custom properties (`--shine-x`, `--shine-y`), casting a soft, moving radial reflection across the glass surface:
```css
.specularShine {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--shine-x, 50%) var(--shine-y, 50%),
    rgba(255, 255, 255, 0.12) 0%,
    transparent 60%
  );
  pointer-events: none;
}
```

---

## 🎬 Symmetrical Motion Choreography

The entrance and exit of the challenge interface follow a **mirrored lateral slide system**:

```
[Screen Left]                                         [Screen Right]
  ◄────── CAPTCHA Card (Slides In/Out Left)
                                Header & Texts (Slides In/Out Right) ──────►
                                Option 1 (100ms stagger)             ──────►
                                Option 2 (160ms stagger)             ──────►
                                Option 3 (220ms stagger)             ──────►
                                Option 4 (280ms stagger)             ──────►
  ▲
  │ Bottom Reward Pill (Slides In/Out Bottom)
```

### Animation Keyframes
- **Card Enter**: `translateX(-100px) ➔ translateX(0)` with `opacity: 0 ➔ 1`.
- **Card Exit**: `translateX(0) ➔ translateX(-100px)` with `opacity: 1 ➔ 0`.
- **Options Enter**: Staggered `translateX(80px) ➔ translateX(0)`.
- **Options Exit**: Staggered `translateX(0) ➔ translateX(80px)`.

---

## 🌌 Ambient Atmosphere: Cyber Dust Particles

Drifting luminous dust particles float through the background, adding ambient depth without obstructing foreground elements:

```css
@keyframes floatDust {
  0% {
    transform: translate(0, 0) scale(0.6);
    opacity: 0;
  }
  50% {
    transform: translate(24px, -30px) scale(1.1);
    opacity: 0.9;
  }
  100% {
    transform: translate(45px, -60px) scale(0.6);
    opacity: 0;
  }
}
```

---

## 📱 Responsive Layout & Breakpoint System

The module is engineered to provide an optimal touch experience across all device formats:

```
┌─────────────────────────────────────────────────────────────┐
│ Desktop (>1024px)                                           │
│  [ CAPTCHA Card 3D ]   |   [ Header & 2x2 Option Grid ]     │
├─────────────────────────────────────────────────────────────┤
│ Tablet (768px - 1024px)                                     │
│  [ CAPTCHA Card 3D ]   |   [ Scaled 2x2 Option Grid ]       │
├─────────────────────────────────────────────────────────────┤
│ Mobile (<768px)                                             │
│  [ Header Text ]                                            │
│  [ Centered CAPTCHA Card ]                                  │
│  [ 2x2 Touch Buttons (Min Height 54px) ]                    │
│  [ Bottom Reward Pill ]                                     │
├─────────────────────────────────────────────────────────────┤
│ Compact Mobile (<425px)                                     │
│  Single-column optimized padding, font-clamp scaling        │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Touch Guidelines
- Option buttons maintain a minimum tap target height of **52px**.
- Generous gap spacing (`12px` to `16px`) prevents accidental adjacent taps.
- 3D mouse tilt gracefully defaults to flat state on touch devices (`ontouchstart` / zero mouse coordinates).
- Zero horizontal overflow (`overflow-x: hidden`).
