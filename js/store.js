// Persistance locale : tout reste sur l'appareil, rien n'est envoyé nulle part.

const KEY = 'ventre-tranquille:v1';

const EMPTY = {
  version: 1,
  phase: 'elimination',
  journal: [],
  overrides: {},
  customFoods: [],
  favorites: [],
  shopping: [],
  reintro: {},
};

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...structuredClone(EMPTY), ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Lecture impossible du stockage local', e);
  }
  return structuredClone(EMPTY);
}

export function get() {
  return state;
}

export function update(fn) {
  fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    alert('Enregistrement impossible : le stockage du navigateur est plein ou bloqué.');
  }
  listeners.forEach((l) => l());
}

export function subscribe(fn) {
  listeners.add(fn);
}

export function exportJSON() {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}

export function importJSON(text) {
  const data = JSON.parse(text);
  if (!data || data.version !== 1 || !Array.isArray(data.journal)) {
    throw new Error('Ce fichier n’est pas une sauvegarde de Ventre tranquille.');
  }
  delete data.exportedAt;
  update((s) => {
    Object.keys(s).forEach((k) => delete s[k]);
    Object.assign(s, structuredClone(EMPTY), data);
  });
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
