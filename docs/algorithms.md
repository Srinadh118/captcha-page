# Challenge Generation & Distractor Logic

This document details the algorithmic logic, cryptographic character filtering, confusion substitution matrices, and animation mechanics that govern the **VELoop Rewards CAPTCHA Generator**.

---

## 🎯 Visual Observation Philosophy

Traditional web CAPTCHAs rely on OCR degradation (wavy lines, background noise, distorted glyphs) that frustrates legitimate users while often remaining vulnerable to automated neural vision models.

VELoop replaces this with an **interactive visual observation challenge**:
1. A pristine, high-contrast alphanumeric string is presented inside a cyberpunk security card.
2. The user is presented with exactly **4 options**.
3. Three options share structural, typographical, and phonetic similarities with the target, while only one is correct.
4. One option is structurally distinct to test attention to detail.

This creates genuine cognitive engagement that feels like a micro-game rather than a penalty.

---

## 🎲 Generation Pipeline

The generation pipeline is located in `src/components/CaptchaPage/utils/captchaGenerator.js` within the function `generateCaptchaChallenge()`.

```mermaid
flowchart TD
    Start([Start Generation]) --> CharPool[Filter Character Pool]
    CharPool --> GenTarget[Sample 6 Chars: Target Code]
    
    GenTarget --> Distractor1[Distractor 1: Transposition & Lookalike]
    GenTarget --> Distractor2[Distractor 2: Subtle Middle Substitution]
    GenTarget --> Distractor3[Distractor 3: Structural Rhythm Mirror]
    
    Distractor1 --> Deduplicate{Duplicate Check}
    Distractor2 --> Deduplicate
    Distractor3 --> Deduplicate
    
    Deduplicate --> Combine[Array: Correct + 3 Distractors]
    Combine --> FisherYates[Fisher-Yates Shuffle]
    FisherYates --> Output([Return { code, options }])
```

---

## 🔤 Character Pool & Sanitization

The primary character pool consists of **32 alphanumeric characters**:

```javascript
const charPool = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
```

- **Excluded by default**: Characters with extreme visual ambiguity in standalone monospace rendering (such as `0` vs `O`, and `1` vs `I`) are omitted from the random generation pool to avoid unintentional confusion.
- **Intentional Lookalikes**: Ambiguous characters are selectively reintroduced during distractor generation to test deliberate human visual observation.

---

## 🧠 The 4-Option Rule & Distractor Taxonomy

In strict compliance with **Section 5 of the VELoop Specification**, every challenge produces exactly 4 options with the following distribution:

| Option Category | Generation Strategy | Example (Target: `A7K2P9`) | Cognitive Focus |
| :--- | :--- | :--- | :--- |
| **1. Target Code** | Exact match | **`A7K2P9`** | Ground truth |
| **2. Transposed & Swapped** | Transposes index 3 & 4 + substitutes index 1 with lookalike | **`AJK29P`** | Tests character order & position |
| **3. Subtle Substitution** | Substitutes middle index 2 with lookalike + alters tail character | **`A7L9P2`** | Tests typographical glyph inspection |
| **4. Structural Twin** | Mirrors the letter/digit rhythm with completely random characters | **`X4M8Q1`** | Tests global shape and format |

---

## 🧬 Confusing Replacement Dictionary

When synthesizing distractors, characters are swapped using a curated phonetic and visual similarity dictionary:

```javascript
const CONFUSING_REPLACEMENTS = {
  'A': ['4', 'R', 'H'],
  '7': ['J', '1', 'T', 'Z'],
  'K': ['X', 'R', 'H'],
  '2': ['Z', '7', 'S'],
  'P': ['R', 'B', 'D'],
  '9': ['8', '6', 'P', 'Q'],
  '8': ['B', '9', '3'],
  'B': ['8', 'P', '3'],
  'J': ['7', 'L', 'I'],
  'L': ['1', 'J', 'I'],
  'X': ['K', 'Y', 'Z'],
  'M': ['N', 'W'],
  'Q': ['O', '0', '9'],
};
```

### Distractor 1 Logic (Transposition)
```javascript
const chars1 = code.split('');
// Swap adjacent characters at index 3 and index 4
const t = chars1[3];
chars1[3] = chars1[4];
chars1[4] = t;

// Substitute index 1 with a look-alike from dictionary
const subIdx1 = 1;
const rep1 = CONFUSING_REPLACEMENTS[chars1[subIdx1]] || ['J', 'K', '7'];
chars1[subIdx1] = rep1[Math.floor(Math.random() * rep1.length)];
```

### Distractor 2 Logic (Middle Substitution)
```javascript
const chars2 = code.split('');
// Substitute index 2 with a confusing glyph
const subIdx2 = 2;
const rep2 = CONFUSING_REPLACEMENTS[chars2[subIdx2]] || ['L', '9', 'X'];
chars2[subIdx2] = rep2[Math.floor(Math.random() * rep2.length)];

// Alter terminal digit
if (chars2.length >= 6) {
  chars2[5] = (chars2[5] === '2' ? '9' : '2');
}
```

### Distractor 3 Logic (Rhythm Twin)
Mirrors the exact vowel/consonant and letter/digit cadence of the target code, ensuring uniform visual length and rhythm without sharing identical letters:
```javascript
let d3 = '';
for (let i = 0; i < 6; i++) {
  const isNum = /\d/.test(code[i]);
  if (isNum) {
    d3 += '23456789'.charAt(Math.floor(Math.random() * 8));
  } else {
    d3 += 'ABCDEFGHJKLMNPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 24));
  }
}
```

---

## 🔀 Uniform Option Shuffling (Fisher-Yates)

To guarantee that the correct option does not bias toward any particular button position, options are shuffled using the unbiased **Fisher-Yates (Knuth) algorithm**:

```javascript
const options = [code, ...distractors];
for (let i = options.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [options[i], options[j]] = [options[j], options[i]];
}
```

Every position (`1`, `2`, `3`, `4`) has an exact **25.0% probability** of housing the correct answer.

---

## 💻 Matrix Decode Scrambler Animation

Whenever a new challenge is generated or refreshed, `<ChallengeView />` executes a progressive cyberpunk matrix decrypt animation over **10 frames** (approx. 280ms):

```javascript
const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
let frame = 0;
const maxFrames = 10;

const interval = setInterval(() => {
  frame++;
  const progress = frame / maxFrames;
  const scrambled = targetCode
    .split("")
    .map((char, i) => {
      // Lock settled characters from left to right as progress increases
      if (i / targetCode.length < progress) {
        return char;
      }
      return charset[Math.floor(Math.random() * charset.length)];
    })
    .join("");

  setDisplayCode(scrambled);

  if (frame >= maxFrames) {
    clearInterval(interval);
    setDisplayCode(targetCode);
  }
}, 28);
```

This creates a high-tech "terminal decryption" visual cue that immediately notifies the user that a fresh security code has been provisioned.
