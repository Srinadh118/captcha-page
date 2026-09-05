// Generates challenging CAPTCHA tests adhering to the visual observation rule:
// 1. Correct code (e.g. A7K2P9)
// 2. Transposed / swapped characters (e.g. AJK29P)
// 3. Similar look-alike substitutions (e.g. A7L9P2)
// 4. Structural mix challenge (e.g. X4M8Q1)

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
  // Use character set with good visual distinction
  const charPool = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }

  const distractors = [];

  // Distractor 1: Transposition & slight substitution (like AJK29P for A7K2P9)
  const chars1 = code.split('');
  // swap index 1 and 2 or 3 and 4
  const t = chars1[3];
  chars1[3] = chars1[4];
  chars1[4] = t;
  // substitute one char with lookalike
  const subIdx1 = 1;
  const rep1 = CONFUSING_REPLACEMENTS[chars1[subIdx1]] || ['J', 'K', '7'];
  chars1[subIdx1] = rep1[Math.floor(Math.random() * rep1.length)];
  const d1 = chars1.join('');
  distractors.push(d1 !== code ? d1 : code.slice(0, 3) + '9P2');

  // Distractor 2: Subtle letter substitution in middle (like A7L9P2)
  const chars2 = code.split('');
  const subIdx2 = 2;
  const rep2 = CONFUSING_REPLACEMENTS[chars2[subIdx2]] || ['L', '9', 'X'];
  chars2[subIdx2] = rep2[Math.floor(Math.random() * rep2.length)];
  if (chars2.length >= 6) {
    chars2[5] = (chars2[5] === '2' ? '9' : '2');
  }
  const d2 = chars2.join('');
  distractors.push(d2 !== code && d2 !== d1 ? d2 : 'AJL9P2');

  // Distractor 3: High-similarity format with alternative alphanumeric rhythm (like X4M8Q1)
  let d3 = '';
  for (let i = 0; i < 6; i++) {
    const isNum = /\d/.test(code[i]);
    if (isNum) {
      d3 += '23456789'.charAt(Math.floor(Math.random() * 8));
    } else {
      d3 += 'ABCDEFGHJKLMNPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 24));
    }
  }
  if (d3 === code || d3 === d1 || d3 === d2) {
    d3 = 'X4M8Q1';
  }
  distractors.push(d3);

  // Combine and shuffle options
  const options = [code, ...distractors];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { code, options };
}
