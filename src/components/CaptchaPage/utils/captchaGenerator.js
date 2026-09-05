// Generates realistic CAPTCHA challenges with smart distractors

const CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // omit easily confused 0/O and 1/I

const CONFUSING_PAIRS = {
  'A': ['4', 'R', 'H'],
  '7': ['1', 'T', 'Z', 'J'],
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

export const PRESET_CHALLENGES = [
  {
    code: 'A7K2P9',
    options: ['A7K2P9', 'AJK29P', 'AJL9P2', 'X4M8Q1']
  },
  {
    code: '9B7R4K',
    options: ['9B7R4K', '8B7R4K', '98TR4K', 'Z7K2P9']
  },
  {
    code: 'X8M3Q7',
    options: ['X8M3Q7', 'K8M3Q7', 'XBM8Q7', 'A7L9P2']
  },
  {
    code: 'V5N8T2',
    options: ['V5N8T2', 'U5N8T2', 'V6M8T2', 'W5N3T7']
  }
];

export function generateCaptchaChallenge() {
  // Generate random 6 char code
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }

  // Generate 3 clever distractors
  const distractors = new Set();
  
  // Distractor 1: Swap 2 adjacent characters
  if (code.length >= 4) {
    const chars = code.split('');
    const temp = chars[1];
    chars[1] = chars[2];
    chars[2] = temp;
    distractors.add(chars.join(''));
  }

  // Distractor 2: Substitute 1 or 2 characters with similar glyphs
  const chars2 = code.split('');
  const idxToChange = Math.floor(Math.random() * code.length);
  const origChar = chars2[idxToChange];
  const alternatives = CONFUSING_PAIRS[origChar] || CHARACTERS.split('');
  chars2[idxToChange] = alternatives[Math.floor(Math.random() * alternatives.length)];
  if (chars2.join('') !== code) {
    distractors.add(chars2.join(''));
  }

  // Distractor 3: Random high-entropy code
  while (distractors.size < 3) {
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }
    if (rand !== code) {
      distractors.add(rand);
    }
  }

  // Assemble and shuffle options
  const options = [code, ...Array.from(distractors).slice(0, 3)];
  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { code, options };
}
