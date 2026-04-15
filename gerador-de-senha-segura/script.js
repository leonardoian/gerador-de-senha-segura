'use strict';

const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?/',
};

const SIMILAR = /[0Ol1I]/g;

// DOM refs
const passwordOutput = document.getElementById('password-output');
const copyBtn = document.getElementById('copy-btn');
const generateBtn = document.getElementById('generate-btn');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const strengthBar = document.getElementById('strength-bar');
const strengthLabel = document.getElementById('strength-label');
const toast = document.getElementById('toast');

const checkboxes = {
  uppercase: document.getElementById('uppercase'),
  lowercase: document.getElementById('lowercase'),
  numbers: document.getElementById('numbers'),
  symbols: document.getElementById('symbols'),
  excludeSimilar: document.getElementById('exclude-similar'),
};

// Sync slider label
lengthInput.addEventListener('input', () => {
  lengthValue.textContent = lengthInput.value;
});

// Generate password using crypto.getRandomValues for security
function generatePassword() {
  const length = parseInt(lengthInput.value, 10);
  const excludeSimilar = checkboxes.excludeSimilar.checked;

  // Build character pool ensuring at least one category is selected
  let pool = '';
  const required = [];

  const categories = ['uppercase', 'lowercase', 'numbers', 'symbols'];
  for (const cat of categories) {
    if (checkboxes[cat].checked) {
      let chars = CHARS[cat];
      if (excludeSimilar) chars = chars.replace(SIMILAR, '');
      if (chars.length === 0) continue;
      pool += chars;
      // Pick one guaranteed character from this category
      required.push(randomChar(chars));
    }
  }

  if (pool.length === 0) {
    passwordOutput.textContent = 'Selecione ao menos uma opção';
    updateStrength(null);
    return;
  }

  // Fill remaining slots randomly from the full pool
  const remaining = length - required.length;
  const passwordChars = [...required];
  for (let i = 0; i < Math.max(remaining, 0); i++) {
    passwordChars.push(randomChar(pool));
  }

  // Cryptographically shuffle (Fisher-Yates with crypto)
  shuffle(passwordChars);

  const password = passwordChars.join('');
  passwordOutput.textContent = password;
  updateStrength(password);
}

// Cryptographically secure random index
function randomIndex(max) {
  const array = new Uint32Array(1);
  let result;
  // Rejection sampling to avoid modulo bias
  const limit = Math.floor(0xffffffff / max) * max;
  do {
    crypto.getRandomValues(array);
    result = array[0];
  } while (result >= limit);
  return result % max;
}

function randomChar(str) {
  return str[randomIndex(str.length)];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Shannon entropy-based strength score
function calcEntropy(password) {
  const pool = getPoolSize();
  if (pool === 0) return 0;
  return password.length * Math.log2(pool);
}

function getPoolSize() {
  let size = 0;
  if (checkboxes.uppercase.checked) size += CHARS.uppercase.length;
  if (checkboxes.lowercase.checked) size += CHARS.lowercase.length;
  if (checkboxes.numbers.checked) size += CHARS.numbers.length;
  if (checkboxes.symbols.checked) size += CHARS.symbols.length;
  return size;
}

const STRENGTH_LEVELS = [
  { min: 0,   max: 35,  label: 'Muito Fraca', color: '#ef4444', pct: 15 },
  { min: 36,  max: 59,  label: 'Fraca',       color: '#f97316', pct: 35 },
  { min: 60,  max: 79,  label: 'Razoável',    color: '#eab308', pct: 55 },
  { min: 80,  max: 99,  label: 'Forte',       color: '#22c55e', pct: 78 },
  { min: 100, max: Infinity, label: 'Muito Forte', color: '#6366f1', pct: 100 },
];

function updateStrength(password) {
  if (!password) {
    strengthBar.style.width = '0%';
    strengthLabel.textContent = '';
    return;
  }
  const entropy = calcEntropy(password);
  const level = STRENGTH_LEVELS.find(l => entropy >= l.min && entropy <= l.max)
    || STRENGTH_LEVELS[0];

  strengthBar.style.width = level.pct + '%';
  strengthBar.style.background = level.color;
  strengthLabel.style.color = level.color;
  strengthLabel.textContent = `${level.label} — ${Math.round(entropy)} bits de entropia`;
}

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
  const text = passwordOutput.textContent;
  if (!text || text === 'Clique em Gerar' || text === 'Selecione ao menos uma opção') return;

  try {
    await navigator.clipboard.writeText(text);
    showToast();
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast();
  }
});

let toastTimer;
function showToast() {
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

// Generate on button click
generateBtn.addEventListener('click', generatePassword);

// Also generate when options change
Object.values(checkboxes).forEach(el => el.addEventListener('change', generatePassword));
lengthInput.addEventListener('input', generatePassword);

// Auto-generate on load
generatePassword();
