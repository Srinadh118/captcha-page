# Web Audio API Sound Synthesizer

This document outlines the architecture, waveform mathematics, frequency tables, and lifecycle policies powering the built-in **Web Audio API sound synthesis engine** located in `src/components/CaptchaPage/utils/audioEffects.js`.

---

## 🎧 Zero-Asset Audio Philosophy

Rather than bundling bulky `.mp3` or `.wav` audio files that introduce network latency, decoding overhead, and potential 404 failures, VELoop generates all sound effects **in real time using native browser oscillators**.

### Benefits:
- **0 KB Network Footprint**: No media assets downloaded over the wire.
- **Sub-millisecond Latency**: Sounds trigger instantly on user interaction without buffering delays.
- **Parametric Adaptability**: Frequencies, attack envelopes, and decay curves are dynamically adjustable in code.
- **Polyphonic Freedom**: Chords and arpeggios can be synthesized simultaneously without audio channel limits.

---

## 🎛️ AudioContext Architecture

The synthesizer implements a lazy-initialized singleton context with automatic suspended-state recovery:

```javascript
let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context if suspended by browser autoplay security policies
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}
```

### Autoplay Policy Handling
Modern web browsers (Chrome, Safari, Edge) block audio synthesis until the user first interacts with the document (click, tap, or keypress). When the user clicks their first CAPTCHA option or the mute toggle, `audioCtx.resume()` activates the audio pipeline without throwing uncaught promise errors.

---

## 🔊 Sound Effects Catalog & Waveform Profiles

The table below summarizes all 7 synthesized sound effects:

| Sound Type | Trigger Event | Oscillator Waveform | Frequency Range | Duration | Gain Envelope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`click`** | Option button click | `sine` | 800 Hz ➔ 1400 Hz (exponential) | 60 ms | 0.08 ➔ 0.001 |
| **`hover`** | Option button mouseenter | `sine` | 1400 Hz (fixed) | 25 ms | 0.025 ➔ 0.0001 |
| **`verify`** | Entry to `<VerifyingView />` | `triangle` | 320 Hz ➔ 540 Hz (linear) | 350 ms | 0.06 ➔ 0.001 |
| **`refresh`** | Click refresh button / 'R' key | `sine` | 480 Hz ➔ 1200 Hz (exponential) | 140 ms | 0.05 ➔ 0.0001 |
| **`success`** | Correct verification result | `sine` (3-voice arpeggio) | E5 (659Hz) ➔ B5 (988Hz) ➔ E6 (1319Hz) | 450 ms | 0.09 ➔ 0.0001 |
| **`fail`** | Incorrect verification result | `sawtooth` | 220 Hz ➔ 140 Hz (exponential) | 250 ms | 0.07 ➔ 0.001 |
| **`gem`** | Reward collected in ad modal | `triangle` (3-voice arpeggio) | B5 (988Hz) ➔ E6 (1319Hz) ➔ B6 (1976Hz) | 300 ms | 0.08 ➔ 0.0001 |

---

## 🎼 Acoustic Engineering Details

### 1. The High-Tech Digital Blip (`click`)
Produces a crisp, satisfying digital activation sound. The exponential ramp from 800Hz to 1400Hz gives the auditory illusion of an upward physical release:
```javascript
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(800, now);
osc.frequency.exponentialRampToValueAtTime(1400, now + 0.06);
gain.gain.setValueAtTime(0.08, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
```

### 2. The Crystal Victory Chord (`success`)
Synthesizes a major-triad arpeggio across three octaves using pure sine waves. Note onsets are staggered by 80ms intervals to create a bright, shimmering chime:
```javascript
[659.25, 987.77, 1318.51].forEach((freq, idx) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  const delay = idx * 0.08;
  osc.frequency.setValueAtTime(freq, now + delay);
  gain.gain.setValueAtTime(0.09, now + delay);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.45);
});
```

### 3. Non-Punitive Encouraging Alert (`fail`)
Per the VELoop specification, incorrect answers must never harshly punish the user. Instead of a loud error buzzer, `fail` produces a gentle, descending sawtooth buzz (220Hz ➔ 140Hz) with softened gain (0.07):
```javascript
osc.type = 'sawtooth';
osc.frequency.setValueAtTime(220, now);
osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
gain.gain.setValueAtTime(0.07, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
```

---

## 🔇 Global Mute Controls & Accessibility

- **State APIs**:
  - `setSoundMuted(boolean)`: Programmatically enable or disable synthesis.
  - `getSoundMuted()`: Query current mute state.
- **UI Integration**: Header audio button reflects current mute status with `<Volume2 />` and `<VolumeX />` icons.
- **Keyboard Shortcut**: Pressing **`M`** anywhere on the page instantly toggles the mute state.
- **Graceful Degradation**: If Web Audio API is unsupported or permissions are restricted, all `playSound()` calls fail silently without interrupting UI execution.
