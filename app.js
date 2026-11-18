'use strict';

/* =========================================================
   Salle — carnet d'entraînement (PWA, données locales)
   ========================================================= */

const APP = 'salle';

const MUSCLES = ['Pectoraux', 'Dos', 'Épaules', 'Bras', 'Jambes', 'Fessiers', 'Abdos', 'Cardio', 'Autre'];

const STARTER = {
  Pectoraux: ['Développé couché', 'Développé incliné haltères', 'Écarté poulie', 'Dips', 'Pompes'],
  Dos: ['Tractions', 'Tirage vertical', 'Rowing barre', 'Rowing haltère', 'Tirage horizontal', 'Soulevé de terre'],
  Épaules: ['Développé militaire', 'Élévations latérales', 'Oiseau', 'Face pull'],
  Bras: ['Curl biceps', 'Curl marteau', 'Extension triceps poulie', 'Barre au front'],
  Jambes: ['Squat', 'Presse à cuisses', 'Fentes', 'Leg curl', 'Leg extension', 'Mollets debout'],
  Fessiers: ['Hip thrust', 'Soulevé de terre roumain'],
  Abdos: ['Gainage', 'Crunch'],
};

/* Apparence (préférence de l'appareil, partagée par les comptes) */
const BTN_COLORS = [
  ['Bleu nuit', '#1e3a8a'], ['Bleu', '#2563eb'], ['Indigo', '#4338ca'], ['Violet', '#6d28d9'],
  ['Pétrole', '#0f766e'], ['Vert', '#166534'], ['Bordeaux', '#9f1239'], ['Orange', '#c2410c'],
];
const PREFS_KEY = 'salle:prefs';

const METRICS = {
  max: { label: 'Poids max', unit: 'kg' },
  orm: { label: '1RM est.', unit: 'kg' },
  vol: { label: 'Volume', unit: 'kg' },
  reps: { label: 'Reps max', unit: 'reps' },
};

const TABS = [
  { id: 'seance', label: 'Séance', icon: 'dumbbell' },
  { id: 'calendrier', label: 'Calendrier', icon: 'calendar' },
  { id: 'stats', label: 'Stats', icon: 'chart' },
  { id: 'modeles', label: 'Modèles', icon: 'list' },
];

const ICONS = {
  dumbbell: '<svg viewBox="0 0 24 24"><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M4 19.5h16M5.5 15.5l4.5-5 3.5 3L19 7"/></svg>',
  list: '<svg viewBox="0 0 24 24"><path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01"/></svg>',
  sliders: '<svg viewBox="0 0 24 24"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  chevL: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  chevR: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
  timer: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2.5 2M9.5 2.5h5"/></svg>',
  link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/></svg>',
  trend: '<svg viewBox="0 0 24 24"><path d="M4 16.5l6-6 4 4 6-6.5M15 8h5v5"/></svg>',
};

/* ---------- Utils ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// randomUUID n'existe qu'en HTTPS ; getRandomValues marche aussi en HTTP (sels aléatoires sûrs)
const uid = () => (crypto.randomUUID ? crypto.randomUUID()
  : [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join(''));
const num = (v) => { const n = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) ? n : 0; };
const fmtN = (n) => (Math.round(n * 10) / 10).toLocaleString('fr-FR');
const key = (s) => String(s || '').trim().toLowerCase();
const pad2 = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const today = () => iso(new Date());
const parseISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmtLong = (s) => cap(parseISO(s).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }));
const fmtShort = (s) => parseISO(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', '');
const fmtTime = (sec) => `${Math.floor(sec / 60)}:${pad2(sec % 60)}`;
const plural = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;
const e1rm = (w, r) => (r <= 1 ? w : w * (1 + r / 30)); // Epley

const Store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  del(k) { localStorage.removeItem(k); },
};

const prefs = () => Object.assign({ theme: 'auto', btn: '#1e3a8a' }, Store.get(PREFS_KEY, {}));
function setPref(k, v) { Store.set(PREFS_KEY, { ...prefs(), [k]: v }); applyPrefs(); }
function isLightColor(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 160;
}
function applyPrefs() {
  const p = prefs();
  const root = document.documentElement;
  if (p.theme === 'auto') root.removeAttribute('data-theme'); else root.dataset.theme = p.theme;
  root.style.setProperty('--btn', p.btn);
  root.style.setProperty('--btn-text', isLightColor(p.btn) ? '#111318' : '#ffffff');
  const bg = getComputedStyle(root).getPropertyValue('--bg').trim();
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', bg));
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyPrefs);

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ---------- State ---------- */
const state = {
  user: null,
  data: null,
  authMode: 'login',
  authError: '',
  authName: '',
  tab: 'seance',
  cal: null,
  statsEx: null,
  statsMetric: 'max',
  statsPt: null,
  tplEdit: null,
  libTab: 'tpl',
  libQ: '',
  pickQ: '',
  modal: null,
  timer: null,
};

const dataKey = () => `${APP}:data:${state.user.id}`;
function save() { Store.set(dataKey(), state.data); }
function loadData() {
  const d = Store.get(dataKey(), {});
  state.data = {
    templates: d.templates || [],
    sessions: d.sessions || [],
    draft: d.draft || null,
    settings: Object.assign({ rest: 90, inc: 2.5 }, d.settings),
    exercises: d.exercises || null,
  };
  if (!state.data.exercises) {
    // Première fois : bibliothèque de base + exercices déjà utilisés
    state.data.exercises = [];
    Object.entries(STARTER).forEach(([muscle, names]) => names.forEach((n) => addToLibrary(n, muscle)));
    state.data.sessions.forEach((s) => s.exercises.forEach((e) => addToLibrary(e.name)));
    state.data.templates.forEach((t) => t.exercises.forEach((e) => addToLibrary(e.name)));
    save();
  }
}

/* ---------- Bibliothèque d'exercices ---------- */
const findLib = (name) => state.data.exercises.find((x) => key(x.name) === key(name));
function addToLibrary(name, muscle = 'Autre') {
  const n = String(name || '').trim();
  if (!n) return null;
  const existing = findLib(n);
  if (existing) return existing;
  const ex = { id: uid(), name: n, muscle: MUSCLES.includes(muscle) ? muscle : 'Autre' };
  state.data.exercises.push(ex);
  return ex;
}
const muscleOf = (name) => findLib(name)?.muscle || 'Autre';

function libraryGrouped(q) {
  const k = key(q);
  const list = state.data.exercises
    .filter((x) => !k || key(x.name).includes(k) || key(x.muscle).includes(k))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  return MUSCLES.map((m) => [m, list.filter((x) => x.muscle === m)]).filter(([, l]) => l.length);
}
const muscleOptions = (sel) => MUSCLES.map((m) => `<option${m === sel ? ' selected' : ''}>${m}</option>`).join('');
const calInit = () => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth(), sel: today() }; };

/* ---------- Auth (locale, mot de passe hashé PBKDF2) ---------- */
const users = () => Store.get(`${APP}:users`, []);

const PBKDF2_ITERATIONS = 150000;

async function hashPw(pw, salt) {
  // En HTTP (hors localhost), crypto.subtle n'existe pas : repli JS pur, résultat identique.
  if (!window.crypto?.subtle) {
    await new Promise((r) => setTimeout(r, 20)); // laisse l'interface afficher « Patiente… »
    return Pbkdf2.hex(pw, salt, PBKDF2_ITERATIONS);
  }
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' }, k, 256);
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function register(username, pw, pw2) {
  username = username.trim();
  if (username.length < 2) throw new Error("Nom d'utilisateur trop court");
  if (pw.length < 4) throw new Error('Mot de passe : 4 caractères minimum');
  if (pw !== pw2) throw new Error('Les mots de passe ne correspondent pas');
  const list = users();
  if (list.some((u) => key(u.username) === key(username))) throw new Error('Ce nom est déjà pris');
  const salt = uid();
  const user = { id: uid(), username, salt, hash: await hashPw(pw, salt), createdAt: Date.now() };
  list.push(user);
  Store.set(`${APP}:users`, list);
  Store.set(`${APP}:data:${user.id}`, { templates: seedTemplates(), sessions: [], draft: null, settings: { rest: 90 } });
  return user;
}

async function login(username, pw) {
  const u = users().find((x) => key(x.username) === key(username));
  if (!u || (await hashPw(pw, u.salt)) !== u.hash) throw new Error('Identifiants incorrects');
  return u;
}

function openSession(u) {
  Store.set(`${APP}:session`, u.id);
  state.user = u;
  loadData();
  state.tab = 'seance';
  state.cal = calInit();
  render();
}

function logout() {
  Store.del(`${APP}:session`);
  Object.assign(state, { user: null, data: null, modal: null, tplEdit: null, timer: null, authMode: 'login', authError: '' });
  render();
}

function seedTemplates() {
  const t = (name, ex) => ({ id: uid(), name, exercises: ex.map(([n, s, r]) => ({ name: n, sets: s, reps: r, weight: '' })) });
  return [
    t('Push', [['Développé couché', 4, '8'], ['Développé militaire', 3, '10'], ['Dips', 3, '10'], ['Élévations latérales', 3, '15'], ['Extension triceps poulie', 3, '12']]),
    t('Pull', [['Tractions', 4, '8'], ['Rowing barre', 4, '8'], ['Face pull', 3, '15'], ['Curl biceps', 3, '12']]),
    t('Legs', [['Squat', 4, '6'], ['Soulevé de terre roumain', 3, '10'], ['Presse à cuisses', 3, '12'], ['Mollets debout', 4, '15']]),
  ];
}

/* ---------- Domain helpers ---------- */
const doneSessions = () =>
  state.data.sessions.filter((s) => s.status === 'done')
    .sort((a, b) => a.date.localeCompare(b.date) || (a.createdAt || 0) - (b.createdAt || 0));

function lastPerf(name, excludeId) {
  const k = key(name);
  if (!k) return null;
  const list = doneSessions().filter((s) => s.id !== excludeId);
  let best = 0;
  let last = null;
  for (const s of list) {
    for (const e of s.exercises) {
      if (key(e.name) !== k || !e.sets.length) continue;
      last = { date: s.date, sets: e.sets };
      best = Math.max(best, ...e.sets.map((x) => x.weight || 0));
    }
  }
  return last ? { ...last, best } : null;
}

/* Supersets : `ss: true` sur un exercice = enchaîné avec le suivant */
function groupInfo(exs) {
  const out = new Array(exs.length);
  let i = 0;
  while (i < exs.length) {
    let j = i;
    while (j < exs.length - 1 && exs[j].ss) j++;
    for (let k = i; k <= j; k++) out[k] = { start: i, end: j, size: j - i + 1, pos: k - i };
    i = j + 1;
  }
  return out;
}
const groupLabel = (size) => (size > 2 ? 'Circuit' : 'Superset');

function renderExList(exs, scope, cardFn) {
  const g = groupInfo(exs);
  let html = '';
  exs.forEach((e, i) => {
    const gi = g[i];
    const grouped = gi.size > 1;
    if (grouped && gi.pos === 0) html += `<div class="group"><div class="group-label">${ICONS.link}${groupLabel(gi.size)} · ${gi.size} exercices enchaînés</div>`;
    html += cardFn(e, i);
    if (grouped && i === gi.end) html += '</div>';
    if (i < exs.length - 1) {
      html += e.ss
        ? `<div class="link-row on"><button data-action="link" data-scope="${scope}" data-ei="${i}">Délier</button></div>`
        : `<div class="link-row"><button data-action="link" data-scope="${scope}" data-ei="${i}">${ICONS.link}Superset avec le suivant</button></div>`;
    }
  });
  return html;
}

function summaryList(exs, rightFn) {
  const g = groupInfo(exs);
  return `<ul class="ex-summary">${exs.map((e, i) => {
    const gi = g[i];
    const cls = gi.size > 1 ? ` class="g${gi.pos === 0 ? ' g-start' : ''}${i === gi.end ? ' g-end' : ''}"` : '';
    return `<li${cls}><span>${gi.size > 1 && gi.pos === 0 ? `<em>${groupLabel(gi.size)}</em>` : ''}${esc(e.name)}</span><span>${esc(rightFn(e))}</span></li>`;
  }).join('')}</ul>`;
}

/* Progression : toutes les reps visées faites la dernière fois → +incrément */
function suggestProgress(ex, excludeId) {
  const lp = lastPerf(ex.name, excludeId);
  if (!lp) return null;
  const top = Math.max(0, ...lp.sets.map((s) => num(s.weight)));
  if (!top) return null;
  const work = lp.sets.filter((s) => num(s.weight) === top);
  const target = ex.sets.find((s) => s.target)?.target || work.find((s) => s.target)?.target || '';
  const nums = String(target).match(/\d+/g);
  if (!nums && work.length < 2) return null;
  const goal = nums ? Math.max(...nums.map(Number)) : Math.max(...work.map((s) => num(s.reps)));
  if (!goal || work.some((s) => num(s.reps) < goal)) return null;
  const inc = state.data.settings.inc || 2.5;
  return { from: top, to: top + inc, reps: goal, inc };
}

function suggHTML(ex, ei) {
  const sg = suggestProgress(ex, state.data.draft?.id);
  if (!sg) return '';
  const pending = ex.sets.filter((s) => !s.done);
  if (!pending.length || pending.every((s) => num(s.weight) >= sg.to)) return '';
  return `<div class="suggest">${ICONS.trend}
    <span>Toutes tes reps (${sg.reps}) à ${fmtN(sg.from)} kg la dernière fois. Passe à <b>${fmtN(sg.to)} kg</b></span>
    <button class="btn btn-sm btn-primary" data-action="apply-sugg" data-ei="${ei}">+${fmtN(sg.inc)} kg</button></div>`;
}

function setsSummary(sets) {
  if (!sets.length) return '';
  const r = (s) => s.reps || s.target || '?';
  const same = sets.every((s) => r(s) == r(sets[0]) && num(s.weight) === num(sets[0].weight));
  if (same) return `${sets.length} × ${r(sets[0])}${num(sets[0].weight) ? ` · ${fmtN(num(sets[0].weight))} kg` : ''}`;
  return sets.map((s) => (num(s.weight) ? `${fmtN(num(s.weight))}×${r(s)}` : `${r(s)}`)).join(', ');
}

function allExerciseNames() {
  const m = new Map();
  const add = (n) => { const k = key(n); if (k && !m.has(k)) m.set(k, n.trim()); };
  state.data.exercises.forEach((e) => add(e.name));
  state.data.sessions.forEach((s) => s.exercises.forEach((e) => add(e.name)));
  return [...m.values()].sort((a, b) => a.localeCompare(b, 'fr'));
}

function exercisesFromTemplate(t) {
  return t.exercises.map((e) => {
    const lp = lastPerf(e.name);
    const w = num(e.weight) || (lp ? lp.best : 0);
    const target = String(e.reps ?? '').trim();
    const reps = /^\d+$/.test(target) ? target : '';
    return {
      name: e.name,
      ss: !!e.ss,
      sets: Array.from({ length: Math.max(1, parseInt(e.sets, 10) || 3) }, () => ({ reps, weight: w ? String(w) : '', target })),
    };
  });
}

function makeDraft(base = {}) {
  return {
    id: base.id || uid(),
    name: base.name || '',
    date: base.date || today(),
    notes: base.notes || '',
    status: base.status || 'done',
    createdAt: base.createdAt || Date.now(),
    exercises: (base.exercises || []).map((e) => ({
      name: e.name,
      ss: !!e.ss,
      sets: e.sets.map((s) => ({ reps: s.reps ? String(s.reps) : '', weight: s.weight ? String(s.weight) : '', target: s.target || '', done: false })),
    })),
  };
}

function draftHasContent(d) {
  return d && (d.name || d.exercises.some((e) => e.name || e.sets.some((s) => s.reps || s.weight)));
}

function startDraft(draft) {
  const cur = state.data.draft;
  if (cur && cur.id !== draft.id && draftHasContent(cur) && !confirm('Une séance est déjà en cours. La remplacer ?')) return false;
  state.data.draft = draft;
  state.tab = 'seance';
  state.modal = null;
  save();
  render();
  window.scrollTo(0, 0);
  return true;
}

function autoName(exercises) {
  return exercises.slice(0, 2).map((e) => e.name).join(' + ') + (exercises.length > 2 ? '…' : '');
}

function finishDraft() {
  const d = state.data.draft;
  const planned = d.status === 'planned';
  const exercises = d.exercises
    .map((e) => ({
      name: e.name.trim(),
      ss: !!e.ss,
      sets: e.sets
        .map((s) => ({ reps: num(s.reps), weight: num(s.weight), ...(s.target ? { target: s.target } : {}) }))
        .filter((s) => planned || s.reps > 0 || s.weight > 0),
    }))
    .filter((e) => e.name && (planned || e.sets.length));
  if (exercises.length) exercises[exercises.length - 1].ss = false;

  if (!exercises.length) {
    if (confirm(planned ? 'Aucun exercice. Annuler la planification ?' : 'Aucune série saisie. Abandonner la séance ?')) {
      state.data.draft = null; save(); render();
    }
    return;
  }

  // Records battus
  const records = [];
  if (!planned) {
    for (const e of exercises) {
      const prev = lastPerf(e.name, d.id);
      const best = Math.max(...e.sets.map((s) => s.weight));
      if (prev && prev.best > 0 && best > prev.best) records.push(`${e.name} ${fmtN(best)} kg`);
    }
  }

  const session = {
    id: d.id, name: d.name.trim() || autoName(exercises), date: d.date, notes: d.notes.trim(),
    status: d.status, exercises, createdAt: d.createdAt, updatedAt: Date.now(),
  };
  const i = state.data.sessions.findIndex((s) => s.id === d.id);
  if (i >= 0) state.data.sessions[i] = session; else state.data.sessions.push(session);
  exercises.forEach((e) => addToLibrary(e.name));
  state.data.draft = null;
  state.timer = null;
  save();
  render();
  window.scrollTo(0, 0);
  toast(records.length ? `🏆 Nouveau record : ${records.join(', ')}` : planned ? 'Séance planifiée' : 'Séance enregistrée 💪');
}

/* ---------- Rest timer ---------- */
let timerInt = null;
function startTimer() {
  const sec = state.data.settings.rest;
  if (!sec) return;
  state.timer = { end: Date.now() + sec * 1000 };
  clearInterval(timerInt);
  timerInt = setInterval(tickTimer, 250);
}
function timerLeft() { return state.timer ? Math.max(0, Math.ceil((state.timer.end - Date.now()) / 1000)) : 0; }
function tickTimer() {
  if (!state.timer) { clearInterval(timerInt); return; }
  const left = timerLeft();
  const el = $('#timer-val');
  if (el) el.textContent = fmtTime(left);
  if (left === 0) {
    clearInterval(timerInt);
    state.timer = null;
    renderTimer();
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    toast('Repos terminé — série suivante !');
  }
}
function renderTimer() {
  const slot = $('#timer-slot');
  if (!slot) return;
  slot.innerHTML = state.timer
    ? `<div class="timer" role="timer">${ICONS.timer}<span id="timer-val">${fmtTime(timerLeft())}</span>
        <button data-action="timer-add">+30 s</button>
        <button data-action="timer-stop" aria-label="Arrêter le minuteur">${ICONS.x}</button></div>`
    : '';
}

/* =========================================================
   Views
   ========================================================= */
function render() {
  const root = $('#app');
  if (!state.user) { root.innerHTML = viewAuth(); return; }
  const d = state.data.draft;
  const titles = {
    seance: d ? (d.status === 'planned' ? 'Planifier' : 'Séance en cours') : "Aujourd'hui",
    calendrier: 'Calendrier',
    stats: 'Statistiques',
    modeles: state.tplEdit ? (state.tplEdit.isNew ? 'Nouveau modèle' : 'Modifier le modèle') : state.libTab === 'ex' ? 'Exercices' : 'Modèles',
  };
  const views = { seance: viewSeance, calendrier: viewCalendar, stats: viewStats, modeles: viewTemplates };
  root.innerHTML = `
    <header class="topbar">
      <h1>${titles[state.tab]}</h1>
      <button class="icon-btn" data-action="settings" aria-label="Réglages">${ICONS.sliders}</button>
    </header>
    <main class="content">${views[state.tab]()}</main>
    <div id="timer-slot"></div>
    <nav class="tabbar"><div class="tabbar-inner">
      ${TABS.map((t) => `<button class="tab${state.tab === t.id ? ' on' : ''}" data-action="tab" data-tab="${t.id}">
        ${ICONS[t.icon]}<span>${t.label}</span>${t.id === 'seance' && d && state.tab !== 'seance' ? '<i class="pip"></i>' : ''}
      </button>`).join('')}
    </div></nav>
    ${state.modal ? viewModal() : ''}`;
  renderTimer();
}

/* ---------- Auth ---------- */
function viewAuth() {
  const login = state.authMode === 'login';
  return `
  <div class="auth">
    <div class="auth-brand">
      <div class="logo">${ICONS.dumbbell}</div>
      <h1>Salle</h1>
      <p class="muted">Ton carnet d'entraînement</p>
    </div>
    <form id="auth-form" class="card auth-card">
      <div class="seg">
        <button type="button" data-action="auth-mode" data-mode="login" class="${login ? 'on' : ''}">Connexion</button>
        <button type="button" data-action="auth-mode" data-mode="register" class="${login ? '' : 'on'}">Inscription</button>
      </div>
      <label class="field"><span>Nom d'utilisateur</span>
        <input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" required value="${esc(state.authName)}"></label>
      <label class="field"><span>Mot de passe</span>
        <input name="password" type="password" autocomplete="${login ? 'current-password' : 'new-password'}" required></label>
      ${login ? '' : `<label class="field"><span>Confirmer le mot de passe</span>
        <input name="password2" type="password" autocomplete="new-password" required></label>`}
      ${state.authError ? `<p class="error">${esc(state.authError)}</p>` : ''}
      <button class="btn btn-primary btn-block btn-lg" type="submit">${login ? 'Se connecter' : 'Créer mon compte'}</button>
    </form>
    <p class="muted small center">Tes données restent sur cet appareil.</p>
  </div>`;
}

/* ---------- Séance ---------- */
function viewSeance() { return state.data.draft ? viewDraft() : viewHome(); }

function viewHome() {
  const t = today();
  const now = new Date();
  const monday = iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7)));
  const month = t.slice(0, 7);
  const done = doneSessions();
  const planned = state.data.sessions.filter((s) => s.status === 'planned' && s.date === t);
  const upcoming = state.data.sessions.filter((s) => s.status === 'planned' && s.date > t).sort((a, b) => a.date.localeCompare(b.date))[0];
  const tpls = state.data.templates;

  return `
    <p class="eyebrow">${fmtLong(t)}</p>
    <div class="kpis">
      <div class="kpi"><b>${done.filter((s) => s.date >= monday && s.date <= t).length}</b><span>cette semaine</span></div>
      <div class="kpi"><b>${done.filter((s) => s.date.startsWith(month)).length}</b><span>ce mois</span></div>
      <div class="kpi"><b>${done.length}</b><span>au total</span></div>
    </div>

    ${planned.map((p) => `
      <div class="card planned">
        <div><p class="eyebrow accent">Prévu aujourd'hui</p><h3>${esc(p.name)}</h3>
          <p class="muted small">${p.exercises.map((e) => esc(e.name)).join(' · ')}</p></div>
        <button class="btn btn-primary btn-sm" data-action="start-planned" data-id="${p.id}">${ICONS.play}Go</button>
      </div>`).join('')}

    <button class="btn btn-primary btn-block btn-lg" data-action="start-free">${ICONS.plus}Séance libre</button>

    <h2 class="section-title">Depuis un modèle</h2>
    ${tpls.length ? `<div class="choose-list">${tpls.map((tp) => `
      <button class="choice card" data-action="start-tpl" data-id="${tp.id}">
        <b>${esc(tp.name)}</b>
        <span class="muted small">${tp.exercises.map((e) => esc(e.name)).join(' · ') || 'Aucun exercice'}</span>
      </button>`).join('')}</div>`
      : `<p class="empty">Aucun modèle. <button class="link" data-action="tab" data-tab="modeles">Créer un modèle</button></p>`}

    ${upcoming ? `<h2 class="section-title">Prochaine séance prévue</h2>${sessionCard(upcoming)}` : ''}

    <h2 class="section-title">Dernières séances</h2>
    ${done.length ? done.slice(-3).reverse().map((s) => sessionCard(s)).join('') : '<p class="empty">Aucune séance pour l\'instant. Lance-toi !</p>'}`;
}

function sessionCard(s) {
  const planned = s.status === 'planned';
  return `
  <article class="card">
    <div class="session-head">
      <div><h3>${esc(s.name)}</h3><p class="muted small">${fmtLong(s.date)}</p></div>
      ${planned ? '<span class="badge">Prévue</span>' : ''}
    </div>
    ${summaryList(s.exercises, (e) => setsSummary(e.sets))}
    ${s.notes ? `<p class="notes">${esc(s.notes)}</p>` : ''}
    <div class="row-actions">
      ${planned ? `<button class="btn btn-primary btn-sm" data-action="start-planned" data-id="${s.id}">${ICONS.play}Démarrer</button>` : ''}
      <button class="btn btn-ghost btn-sm" data-action="edit-session" data-id="${s.id}">Modifier</button>
      ${planned ? '' : `<button class="btn btn-ghost btn-sm" data-action="repeat-session" data-id="${s.id}">Refaire</button>`}
      <button class="btn btn-ghost btn-sm danger" data-action="del-session" data-id="${s.id}">Supprimer</button>
    </div>
  </article>`;
}

function hintHTML(lp) {
  if (!lp) return '';
  return `Dernière fois (${fmtShort(lp.date)}) : <b>${esc(setsSummary(lp.sets))}</b>${lp.best ? ` · record ${fmtN(lp.best)} kg` : ''}`;
}

function viewDraft() {
  const d = state.data.draft;
  const plan = d.status === 'planned';
  return `
    <div class="card">
      <input class="title-input" data-bind="draft.name" placeholder="${plan ? 'Nom de la séance prévue' : 'Nom de la séance'}" value="${esc(d.name)}">
      <div class="draft-meta">
        <input type="date" data-bind="draft.date" value="${d.date}" aria-label="Date">
        ${plan ? '<span class="badge">Planification</span>' : ''}
      </div>
    </div>
    ${renderExList(d.exercises, 'draft', (e, ei) => exerciseCard(e, ei, plan, d.exercises.length))}
    <button class="btn btn-dashed btn-block btn-lg" data-action="pick-open" data-scope="draft">${ICONS.plus}Ajouter un exercice</button>
    <label class="field"><span>Notes</span>
      <textarea data-bind="draft.notes" rows="2" placeholder="Ressenti, fatigue, douleurs…">${esc(d.notes)}</textarea></label>
    <div class="draft-actions">
      <button class="btn btn-primary btn-block btn-lg" data-action="finish">${ICONS.check}${plan ? 'Enregistrer le plan' : 'Terminer la séance'}</button>
      <div class="row">
        <button class="btn btn-ghost" data-action="save-as-tpl">Sauver en modèle</button>
        <button class="btn btn-ghost danger" data-action="discard">${plan ? 'Annuler' : 'Abandonner'}</button>
      </div>
    </div>
    <datalist id="ex-list">${allExerciseNames().map((n) => `<option value="${esc(n)}">`).join('')}</datalist>`;
}

function exerciseCard(e, ei, plan, total) {
  const lp = lastPerf(e.name, state.data.draft.id);
  return `
  <section class="card">
    <div class="ex-head">
      <input class="ex-name" list="ex-list" data-bind="ex.name" data-ei="${ei}" value="${esc(e.name)}" placeholder="Exercice" autocomplete="off">
      <div class="ex-tools">
        ${ei > 0 ? `<button class="icon-btn sm" data-action="ex-move" data-ei="${ei}" data-dir="-1" aria-label="Monter">${ICONS.up}</button>` : ''}
        ${ei < total - 1 ? `<button class="icon-btn sm" data-action="ex-move" data-ei="${ei}" data-dir="1" aria-label="Descendre">${ICONS.down}</button>` : ''}
        <button class="icon-btn sm" data-action="del-ex" data-ei="${ei}" aria-label="Supprimer l'exercice">${ICONS.trash}</button>
      </div>
    </div>
    <p class="hint" id="hint-${ei}">${hintHTML(lp)}</p>
    <div id="sugg-${ei}">${suggHTML(e, ei)}</div>
    <div class="sets">
      <div class="set-row set-head${plan ? ' plan' : ''}"><span>#</span><span>kg</span><span>reps</span>${plan ? '' : '<span></span>'}<span></span></div>
      ${e.sets.map((s, si) => {
        const prev = lp && lp.sets[si];
        return `
        <div class="set-row${s.done ? ' done' : ''}${plan ? ' plan' : ''}">
          <span class="set-n">${si + 1}</span>
          <input inputmode="decimal" data-bind="set.weight" data-ei="${ei}" data-si="${si}" value="${esc(s.weight)}" placeholder="${prev ? fmtN(prev.weight) : '–'}" aria-label="Poids série ${si + 1}">
          <input inputmode="numeric" data-bind="set.reps" data-ei="${ei}" data-si="${si}" value="${esc(s.reps)}" placeholder="${esc(s.target || (prev ? prev.reps : '–'))}" aria-label="Répétitions série ${si + 1}">
          ${plan ? '' : `<button class="check${s.done ? ' on' : ''}" data-action="toggle-set" data-ei="${ei}" data-si="${si}" aria-label="Série faite">${ICONS.check}</button>`}
          <button class="icon-btn sm" data-action="del-set" data-ei="${ei}" data-si="${si}" aria-label="Supprimer la série">${ICONS.x}</button>
        </div>`;
      }).join('')}
    </div>
    <button class="btn btn-ghost btn-sm" data-action="add-set" data-ei="${ei}">${ICONS.plus}Série</button>
  </section>`;
}

/* ---------- Calendrier ---------- */
function viewCalendar() {
  const { y, m, sel } = state.cal;
  const t = today();
  const byDate = {};
  state.data.sessions.forEach((s) => (byDate[s.date] ||= []).push(s));
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const monthKey = `${y}-${pad2(m + 1)}`;
  const monthCount = state.data.sessions.filter((s) => s.status === 'done' && s.date.startsWith(monthKey)).length;

  let cells = '<span></span>'.repeat(offset);
  for (let d = 1; d <= days; d++) {
    const ds = `${monthKey}-${pad2(d)}`;
    const list = byDate[ds] || [];
    const cls = ['day', ds === sel && 'sel', ds === t && 'today', ds < t && 'past'].filter(Boolean).join(' ');
    cells += `<button class="${cls}" data-action="cal-day" data-date="${ds}">
      <span>${d}</span>
      <i class="dots">${list.some((s) => s.status === 'done') ? '<b class="dot done"></b>' : ''}${list.some((s) => s.status === 'planned') ? '<b class="dot plan"></b>' : ''}</i>
    </button>`;
  }
  const dayList = (byDate[sel] || []).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  const title = new Date(y, m, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return `
    <div class="card">
      <div class="cal-head">
        <button class="icon-btn" data-action="cal-nav" data-dir="-1" aria-label="Mois précédent">${ICONS.chevL}</button>
        <div class="cal-title"><b>${title}</b><span class="muted small">${plural(monthCount, 'séance')}</span></div>
        <button class="icon-btn" data-action="cal-nav" data-dir="1" aria-label="Mois suivant">${ICONS.chevR}</button>
      </div>
      <div class="cal-grid wk">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((x) => `<span>${x}</span>`).join('')}</div>
      <div class="cal-grid">${cells}</div>
      <div class="legend">
        <span><b class="dot done"></b>Réalisée</span>
        <span><b class="dot plan"></b>Prévue</span>
        <button class="link" data-action="cal-today">Aujourd'hui</button>
      </div>
    </div>
    <h2 class="section-title">${fmtLong(sel)}</h2>
    <div class="row">
      ${sel >= t ? `<button class="btn btn-primary btn-sm" data-action="choose-open" data-mode="plan">${ICONS.plus}Planifier</button>` : ''}
      ${sel <= t ? `<button class="btn btn-ghost btn-sm" data-action="choose-open" data-mode="log">${ICONS.plus}Saisir une séance</button>` : ''}
    </div>
    ${dayList.length ? dayList.map(sessionCard).join('') : '<p class="empty">Rien ce jour-là.</p>'}`;
}

/* ---------- Stats ---------- */
function exerciseIndex() {
  const map = new Map();
  for (const s of doneSessions()) {
    for (const e of s.exercises) {
      const k = key(e.name);
      if (!k) continue;
      if (!map.has(k)) map.set(k, { key: k, name: e.name, entries: [] });
      const o = map.get(k);
      o.name = e.name;
      o.entries.push({ date: s.date, sets: e.sets });
    }
  }
  return map;
}

function metricValue(sets, m) {
  switch (m) {
    case 'max': return Math.max(0, ...sets.map((s) => s.weight));
    case 'orm': return Math.max(0, ...sets.map((s) => e1rm(s.weight, s.reps)));
    case 'vol': return sets.reduce((a, s) => a + s.weight * s.reps, 0);
    case 'reps': return Math.max(0, ...sets.map((s) => s.reps));
    default: return 0;
  }
}

function seriesFor(ex, metric) {
  const byDate = new Map();
  ex.entries.forEach((en) => { if (!byDate.has(en.date)) byDate.set(en.date, []); byDate.get(en.date).push(...en.sets); });
  return [...byDate].sort(([a], [b]) => a.localeCompare(b)).map(([date, sets]) => ({ date, sets, v: metricValue(sets, metric) }));
}

function niceTicks(lo, hi, count) {
  const raw = (hi - lo) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((f) => f * mag).find((s) => s >= raw) || 10 * mag;
  const ticks = [];
  for (let v = Math.floor(lo / step) * step; v <= Math.ceil(hi / step) * step + step / 2; v += step) ticks.push(+v.toFixed(6));
  return ticks;
}

function chartSVG(pts, sel) {
  const W = Math.round(Math.max(280, Math.min(560, window.innerWidth) - 66));
  const H = 220, L = 40, R = 10, T = 12, B = 26;
  const vals = pts.map((p) => p.v);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (lo === hi) { const pad = Math.max(1, Math.abs(lo) * 0.1); lo -= pad; hi += pad; }
  else { const pad = (hi - lo) * 0.12; lo -= pad; hi += pad; }
  lo = Math.max(0, lo);
  const ticks = niceTicks(lo, hi, 4);
  lo = ticks[0]; hi = ticks[ticks.length - 1];

  const t0 = parseISO(pts[0].date).getTime();
  const t1 = parseISO(pts[pts.length - 1].date).getTime();
  const x = (p) => (pts.length === 1 || t1 === t0 ? (L + W - R) / 2 : L + ((parseISO(p.date).getTime() - t0) / (t1 - t0)) * (W - L - R));
  const y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p).toFixed(1)},${y(p.v).toFixed(1)}`).join('');
  const area = `${line}L${x(pts[pts.length - 1]).toFixed(1)},${H - B}L${x(pts[0]).toFixed(1)},${H - B}Z`;

  const n = pts.length;
  const labelIdx = n <= 4 ? pts.map((_, i) => i) : [...new Set([0, Math.round((n - 1) / 3), Math.round((2 * (n - 1)) / 3), n - 1])];
  const fmtTick = (v) => (v >= 10000 ? `${fmtN(v / 1000)}k` : fmtN(v));

  return `
  <svg class="chart" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Graphique d'évolution">
    <defs><linearGradient id="g-area" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" style="stop-color:var(--accent);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--accent);stop-opacity:0"/>
    </linearGradient></defs>
    ${ticks.map((v) => `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/>
      <text class="axis" x="${L - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${fmtTick(v)}</text>`).join('')}
    ${labelIdx.map((i) => {
      const anchor = n === 1 ? 'middle' : i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle';
      return `<text class="axis" x="${x(pts[i]).toFixed(1)}" y="${H - 6}" text-anchor="${anchor}">${fmtShort(pts[i].date)}</text>`;
    }).join('')}
    ${n > 1 ? `<path d="${area}" fill="url(#g-area)"/><path class="line" d="${line}"/>` : ''}
    <line class="cursor" x1="${x(pts[sel]).toFixed(1)}" x2="${x(pts[sel]).toFixed(1)}" y1="${T}" y2="${H - B}"/>
    ${pts.map((p, i) => `<circle class="pt${i === sel ? ' sel' : ''}" cx="${x(p).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="${i === sel ? 5.5 : n > 30 ? 2.5 : 3.5}"/>`).join('')}
    ${pts.map((p, i) => `<circle class="hit" data-action="pt" data-i="${i}" cx="${x(p).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="16"/>`).join('')}
  </svg>`;
}

function viewStats() {
  const idx = exerciseIndex();
  if (!idx.size) {
    return `<div class="empty-state">${ICONS.chart}<h3>Pas encore de données</h3>
      <p class="small">Termine une séance pour voir l'évolution de tes exercices.</p></div>`;
  }
  let k = state.statsEx;
  if (!k || !idx.has(k)) {
    const last = doneSessions().at(-1);
    k = key(last.exercises[0].name);
    state.statsEx = k;
    state.statsPt = null;
  }
  const ex = idx.get(k);
  const metric = state.statsMetric;
  const unit = METRICS[metric].unit;
  const series = seriesFor(ex, metric);
  const sel = state.statsPt != null && state.statsPt < series.length ? state.statsPt : series.length - 1;
  const p = series[sel];
  const delta = p.v - series[0].v;

  const allSets = ex.entries.flatMap((e) => e.sets);
  const best = Math.max(0, ...allSets.map((s) => s.weight));
  const bestOrm = Math.max(0, ...allSets.map((s) => e1rm(s.weight, s.reps)));
  const bestReps = Math.max(0, ...allSets.filter((s) => s.weight === best).map((s) => s.reps));
  const totalVol = allSets.reduce((a, s) => a + s.weight * s.reps, 0);

  let runningBest = 0;
  const hist = seriesFor(ex, 'max').map((r) => {
    const isPr = r.v > runningBest && runningBest > 0;
    runningBest = Math.max(runningBest, r.v);
    return { ...r, isPr };
  }).reverse();

  return `
    <div class="card">
      <label class="field"><span>Exercice</span>
        <select data-change="stats-ex">
          ${[...idx.values()].sort((a, b) => a.name.localeCompare(b.name, 'fr')).map((o) =>
            `<option value="${esc(o.key)}"${o.key === k ? ' selected' : ''}>${esc(o.name)} · ${plural(new Set(o.entries.map((e) => e.date)).size, 'séance')}</option>`).join('')}
        </select>
      </label>
    </div>

    <div class="kpis two">
      <div class="kpi"><b>${fmtN(best)}<small>kg</small></b><span>Record${bestReps ? ` (× ${bestReps})` : ''}</span></div>
      <div class="kpi"><b>${fmtN(bestOrm)}<small>kg</small></b><span>1RM estimé</span></div>
      <div class="kpi"><b>${new Set(ex.entries.map((e) => e.date)).size}</b><span>Séances</span></div>
      <div class="kpi"><b>${totalVol >= 10000 ? fmtN(totalVol / 1000) + '<small>t</small>' : fmtN(totalVol) + '<small>kg</small>'}</b><span>Volume total</span></div>
    </div>

    <div class="card chart-card">
      <div class="seg sm">${Object.entries(METRICS).map(([id, m]) =>
        `<button data-action="metric" data-m="${id}" class="${id === metric ? 'on' : ''}">${m.label}</button>`).join('')}</div>
      <div class="readout">
        <b>${fmtN(p.v)} <small class="muted">${unit}</small></b>
        <span class="muted small">${fmtLong(p.date)}</span>
        ${series.length > 1 && sel > 0 ? `<span class="delta ${delta >= 0 ? 'up' : 'down'}">${delta >= 0 ? '+' : ''}${fmtN(delta)} ${unit} depuis le début</span>` : ''}
      </div>
      ${chartSVG(series, sel)}
    </div>

    <h2 class="section-title">Historique</h2>
    <div class="card hist">
      ${hist.map((r) => `<div class="hist-row">
        <span class="muted">${fmtShort(r.date)}</span>
        <span>${esc(setsSummary(r.sets))}</span>
        <span>${fmtN(r.v)} kg${r.isPr ? '<span class="pr">PR</span>' : ''}</span>
      </div>`).join('')}
    </div>`;
}

/* ---------- Modèles ---------- */
function libListHTML() {
  const groups = libraryGrouped(state.libQ);
  if (!groups.length) return '<p class="empty">Aucun exercice trouvé.</p>';
  return groups.map(([m, list]) => `
    <h2 class="section-title">${m} · ${list.length}</h2>
    <div class="card lib-card">${list.map((x) => `
      <div class="lib-row">
        <span>${esc(x.name)}</span>
        <select class="mini" data-change="ex-muscle" data-id="${x.id}" aria-label="Groupe musculaire">${muscleOptions(x.muscle)}</select>
        <button class="icon-btn sm" data-action="ex-rename" data-id="${x.id}" aria-label="Renommer">${ICONS.edit}</button>
        <button class="icon-btn sm" data-action="ex-delete" data-id="${x.id}" aria-label="Supprimer">${ICONS.trash}</button>
      </div>`).join('')}
    </div>`).join('');
}

function viewLibrary() {
  return `
    <div class="card stack">
      <h3>Nouvel exercice</h3>
      <input id="new-ex-name" placeholder="Nom (ex. Pull-over, Rameur…)" autocomplete="off">
      <div class="row">
        <select id="new-ex-muscle" aria-label="Groupe musculaire" style="flex:1">${muscleOptions('Autre')}</select>
        <button class="btn btn-primary" data-action="ex-create" style="flex:none">${ICONS.plus}Ajouter</button>
      </div>
    </div>
    <input type="search" data-bind="lib.q" value="${esc(state.libQ)}" placeholder="Rechercher un exercice…" aria-label="Rechercher">
    <div id="lib-list" class="stack">${libListHTML()}</div>`;
}

function pickListHTML() {
  const q = state.pickQ.trim();
  const groups = libraryGrouped(q);
  const exact = q && findLib(q);
  return `
    ${q && !exact ? `<div class="create-row">
      <button class="btn btn-primary btn-sm" data-action="pick-create">${ICONS.plus}Créer « ${esc(q)} »</button>
      <select id="pick-muscle" aria-label="Groupe musculaire">${muscleOptions('Autre')}</select>
    </div>` : ''}
    ${groups.map(([m, list]) => `<h4>${m}</h4>${list.map((x) => {
      const lp = lastPerf(x.name);
      return `<button class="pick-item" data-action="pick" data-name="${esc(x.name)}"><span>${esc(x.name)}</span>${lp ? `<small>${fmtShort(lp.date)}</small>` : ''}</button>`;
    }).join('')}`).join('')}
    ${!groups.length && !q ? '<p class="empty">Bibliothèque vide.</p>' : ''}`;
}

function viewTemplates() {
  if (state.tplEdit) return viewTplEdit();
  const seg = `<div class="seg">
    <button data-action="lib-tab" data-v="tpl" class="${state.libTab === 'tpl' ? 'on' : ''}">Modèles</button>
    <button data-action="lib-tab" data-v="ex" class="${state.libTab === 'ex' ? 'on' : ''}">Exercices</button></div>`;
  if (state.libTab === 'ex') return seg + viewLibrary();
  const tpls = state.data.templates;
  return `${seg}
    <button class="btn btn-primary btn-block btn-lg" data-action="tpl-new">${ICONS.plus}Nouveau modèle</button>
    ${tpls.length ? '' : `<div class="empty-state">${ICONS.list}<h3>Aucun modèle</h3><p class="small">Crée tes séances types (Push, Pull, Legs…) pour démarrer en un tap.</p></div>`}
    ${tpls.map((t) => `
      <article class="card">
        <div class="tpl-head">
          <div><h3>${esc(t.name)}</h3><p class="muted small">${plural(t.exercises.length, 'exercice')}</p></div>
          <button class="btn btn-primary btn-sm" data-action="start-tpl" data-id="${t.id}">${ICONS.play}Démarrer</button>
        </div>
        ${summaryList(t.exercises, (e) => `${e.sets} × ${e.reps || '?'}${num(e.weight) ? ` · ${fmtN(num(e.weight))} kg` : ''}`)}
        <div class="row-actions">
          <button class="btn btn-ghost btn-sm" data-action="tpl-edit" data-id="${t.id}">Modifier</button>
          <button class="btn btn-ghost btn-sm" data-action="tpl-dup" data-id="${t.id}">Dupliquer</button>
          <button class="btn btn-ghost btn-sm danger" data-action="tpl-del" data-id="${t.id}">Supprimer</button>
        </div>
      </article>`).join('')}`;
}

function viewTplEdit() {
  const t = state.tplEdit;
  const n = t.exercises.length;
  return `
    <div class="card"><label class="field"><span>Nom du modèle</span>
      <input data-bind="tpl.name" value="${esc(t.name)}" placeholder="Ex. Push, Haut du corps…"></label></div>
    ${renderExList(t.exercises, 'tpl', (e, i) => `
      <section class="card">
        <div class="ex-head">
          <input class="ex-name" list="ex-list" data-bind="tpl.ex" data-f="name" data-ei="${i}" value="${esc(e.name)}" placeholder="Exercice" autocomplete="off">
          <div class="ex-tools">
            ${i > 0 ? `<button class="icon-btn sm" data-action="tpl-move" data-ei="${i}" data-dir="-1" aria-label="Monter">${ICONS.up}</button>` : ''}
            ${i < n - 1 ? `<button class="icon-btn sm" data-action="tpl-move" data-ei="${i}" data-dir="1" aria-label="Descendre">${ICONS.down}</button>` : ''}
            <button class="icon-btn sm" data-action="tpl-del-ex" data-ei="${i}" aria-label="Supprimer">${ICONS.trash}</button>
          </div>
        </div>
        <div class="tpl-grid">
          <label class="field sm"><span>Séries</span><input inputmode="numeric" data-bind="tpl.ex" data-f="sets" data-ei="${i}" value="${esc(e.sets)}"></label>
          <label class="field sm"><span>Reps</span><input data-bind="tpl.ex" data-f="reps" data-ei="${i}" value="${esc(e.reps)}" placeholder="8-12"></label>
          <label class="field sm"><span>Poids (kg)</span><input inputmode="decimal" data-bind="tpl.ex" data-f="weight" data-ei="${i}" value="${esc(e.weight)}" placeholder="auto"></label>
        </div>
      </section>`)}
    <button class="btn btn-dashed btn-block btn-lg" data-action="pick-open" data-scope="tpl">${ICONS.plus}Ajouter un exercice</button>
    <p class="muted small">Poids vide = reprend automatiquement ton meilleur poids sur l'exercice.</p>
    <div class="draft-actions">
      <button class="btn btn-primary btn-block btn-lg" data-action="tpl-save">Enregistrer le modèle</button>
      <button class="btn btn-ghost btn-block" data-action="tpl-cancel">Annuler</button>
    </div>
    <datalist id="ex-list">${allExerciseNames().map((x) => `<option value="${esc(x)}">`).join('')}</datalist>`;
}

/* ---------- Modals ---------- */
function viewModal() {
  const m = state.modal;
  let body = '';
  if (m.type === 'choose') {
    body = `
      <h2>${m.mode === 'plan' ? 'Planifier' : 'Saisir une séance'} · ${fmtShort(m.date)}</h2>
      <p class="muted small" style="margin-top:-8px">Choisis un modèle ou pars de zéro.</p>
      <div class="choose-list">
        ${state.data.templates.map((t) => `<button class="choice" data-action="choose" data-id="${t.id}">
          <b>${esc(t.name)}</b><span class="muted small">${t.exercises.map((e) => esc(e.name)).join(' · ')}</span></button>`).join('')}
        <button class="choice" data-action="choose" data-id=""><b>Séance vide</b><span class="muted small">Ajoute les exercices toi-même</span></button>
      </div>
      <button class="btn btn-ghost btn-block" data-action="close-modal">Annuler</button>`;
  } else if (m.type === 'pick') {
    body = `
      <h2>Ajouter un exercice</h2>
      <input type="search" data-bind="pick.q" value="${esc(state.pickQ)}" placeholder="Rechercher ou créer…" aria-label="Rechercher un exercice" autocomplete="off">
      <div class="pick-list" id="pick-list">${pickListHTML()}</div>
      <button class="btn btn-ghost btn-block" data-action="close-modal">Fermer</button>`;
    return `<div class="overlay" data-action="close-modal"><div class="sheet tall" role="dialog" aria-modal="true">${body}</div></div>`;
  } else if (m.type === 'settings') {
    const rest = state.data.settings.rest;
    const p = prefs();
    const custom = !BTN_COLORS.some(([, c]) => c === p.btn);
    body = `
      <h2>Réglages</h2>
      <p class="muted small" style="margin-top:-8px">Connecté en tant que <b>${esc(state.user.username)}</b></p>
      <div class="settings-group">
        <div class="field"><span>Thème</span>
          <div class="seg">${[['auto', 'Auto'], ['light', 'Jour'], ['dark', 'Nuit']].map(([v, l]) =>
            `<button data-action="theme" data-v="${v}" class="${p.theme === v ? 'on' : ''}">${l}</button>`).join('')}</div></div>
        <div class="field"><span>Couleur des boutons</span>
          <div class="swatches">
            ${BTN_COLORS.map(([n, c]) => `<button class="swatch${c === p.btn ? ' on' : ''}" style="background:${c}" data-action="btn-color" data-c="${c}" title="${n}" aria-label="${n}"></button>`).join('')}
            <label class="swatch custom${custom ? ' on' : ''}" title="Couleur personnalisée"><input type="color" value="${p.btn}" data-change="btn-color" aria-label="Couleur personnalisée"></label>
          </div></div>
        <button class="btn btn-primary btn-block" tabindex="-1" style="pointer-events:none">Aperçu du bouton</button>
      </div>
      <label class="field"><span>Minuteur de repos (après chaque série validée)</span>
        <select data-change="rest">${[0, 45, 60, 90, 120, 150, 180, 240, 300].map((s) =>
          `<option value="${s}"${s === rest ? ' selected' : ''}>${s ? fmtTime(s) : 'Désactivé'}</option>`).join('')}</select></label>
      <label class="field"><span>Incrément de progression suggéré</span>
        <select data-change="inc">${[1, 1.25, 2, 2.5, 5].map((v) =>
          `<option value="${v}"${v === state.data.settings.inc ? ' selected' : ''}>+${fmtN(v)} kg</option>`).join('')}</select></label>
      <div class="stack">
        <button class="btn btn-ghost btn-block" data-action="export">Exporter mes données</button>
        <label class="btn btn-ghost btn-block">Importer une sauvegarde<input type="file" accept="application/json,.json" data-change="import" hidden></label>
        <button class="btn btn-ghost btn-block" data-action="logout">Se déconnecter</button>
        <button class="btn btn-ghost btn-block danger" data-action="delete-account">Supprimer mon compte</button>
      </div>
      <button class="btn btn-primary btn-block" data-action="close-modal">Fermer</button>`;
  }
  return `<div class="overlay" data-action="close-modal"><div class="sheet" role="dialog" aria-modal="true">${body}</div></div>`;
}

/* =========================================================
   Actions
   ========================================================= */
const findSession = (id) => state.data.sessions.find((s) => s.id === id);
const findTpl = (id) => state.data.templates.find((t) => t.id === id);
// Déplacer un exercice casse les liens de superset autour de lui (évite des groupes inattendus)
const swap = (arr, i, j) => {
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  [Math.min(i, j) - 1, i, j].forEach((k) => { if (arr[k]) arr[k].ss = false; });
};
const removeEx = (arr, i) => {
  if (arr[i - 1]) arr[i - 1].ss = arr[i - 1].ss && !!arr[i].ss;
  arr.splice(i, 1);
};
const focusLast = (sel) => requestAnimationFrame(() => { const all = document.querySelectorAll(sel); all[all.length - 1]?.focus(); });

function openPicker(scope) {
  state.pickQ = '';
  state.modal = { type: 'pick', scope };
  render();
}

function addPicked(name) {
  const scope = state.modal?.scope || 'draft';
  state.modal = null;
  if (scope === 'tpl') {
    const ex = state.tplEdit.exercises;
    const last = ex[ex.length - 1];
    ex.push({ name, sets: last?.sets || '3', reps: last?.reps || '10', weight: '' });
  } else {
    // Pré-remplit avec la dernière performance sur cet exercice
    const lp = lastPerf(name, state.data.draft.id);
    const sets = lp
      ? lp.sets.map((s) => ({ reps: s.reps ? String(s.reps) : '', weight: s.weight ? String(s.weight) : '', target: s.target || '', done: false }))
      : [{ reps: '', weight: '', target: '', done: false }];
    state.data.draft.exercises.push({ name, ss: false, sets });
    save();
  }
  render();
  requestAnimationFrame(() => {
    const cards = document.querySelectorAll('.ex-name');
    cards[cards.length - 1]?.closest('.card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

const actions = {
  'auth-mode': (el) => { state.authMode = el.dataset.mode; state.authError = ''; render(); },
  tab: (el) => { state.tab = el.dataset.tab; state.modal = null; render(); window.scrollTo(0, 0); },
  settings: () => { state.modal = { type: 'settings' }; render(); },
  'close-modal': () => { state.modal = null; render(); },

  // Démarrage
  'start-free': () => { if (startDraft(makeDraft({ exercises: [] }))) openPicker('draft'); },
  'pick-open': (el) => openPicker(el.dataset.scope),
  pick: (el) => addPicked(el.dataset.name),
  'pick-create': () => {
    const name = state.pickQ.trim();
    if (!name) return;
    addToLibrary(name, $('#pick-muscle')?.value);
    save();
    addPicked(name);
    toast(`« ${name} » ajouté à ta bibliothèque`);
  },
  theme: (el) => { setPref('theme', el.dataset.v); render(); },
  'btn-color': (el) => { setPref('btn', el.dataset.c); render(); },
  'lib-tab': (el) => { state.libTab = el.dataset.v; render(); },
  'ex-create': () => {
    const input = $('#new-ex-name');
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    if (findLib(name)) { toast('Cet exercice existe déjà'); return; }
    addToLibrary(name, $('#new-ex-muscle').value);
    save(); render(); toast(`« ${name} » ajouté`);
    requestAnimationFrame(() => $('#new-ex-name')?.focus());
  },
  'ex-rename': (el) => {
    const ex = state.data.exercises.find((x) => x.id === el.dataset.id);
    const name = prompt("Nouveau nom de l'exercice", ex.name)?.trim();
    if (!name || name === ex.name) return;
    const other = findLib(name);
    if (other && other.id !== ex.id) { toast('Ce nom existe déjà'); return; }
    // Renomme aussi dans l'historique, les modèles et la séance en cours (garde les stats)
    const old = key(ex.name);
    const fix = (e) => { if (key(e.name) === old) e.name = name; };
    state.data.sessions.forEach((s) => s.exercises.forEach(fix));
    state.data.templates.forEach((t) => t.exercises.forEach(fix));
    state.data.draft?.exercises.forEach(fix);
    if (state.statsEx === old) state.statsEx = key(name);
    ex.name = name;
    save(); render(); toast('Exercice renommé');
  },
  'ex-delete': (el) => {
    const ex = state.data.exercises.find((x) => x.id === el.dataset.id);
    if (!confirm(`Retirer « ${ex.name} » de ta bibliothèque ? (l'historique est conservé)`)) return;
    state.data.exercises = state.data.exercises.filter((x) => x.id !== ex.id);
    save(); render();
  },
  'start-tpl': (el) => { const t = findTpl(el.dataset.id); if (t) startDraft(makeDraft({ name: t.name, exercises: exercisesFromTemplate(t) })); },
  'start-planned': (el) => { const s = findSession(el.dataset.id); if (s) startDraft(makeDraft({ ...s, date: today(), status: 'done' })); },
  'edit-session': (el) => { const s = findSession(el.dataset.id); if (s) startDraft(makeDraft(s)); },
  'repeat-session': (el) => {
    const s = findSession(el.dataset.id);
    if (s) startDraft(makeDraft({ name: s.name, exercises: s.exercises }));
  },
  'del-session': (el) => {
    const s = findSession(el.dataset.id);
    if (!s || !confirm(`Supprimer « ${s.name} » du ${fmtShort(s.date)} ?`)) return;
    state.data.sessions = state.data.sessions.filter((x) => x.id !== s.id);
    save(); render(); toast('Séance supprimée');
  },

  // Éditeur de séance
  'add-ex': () => { state.data.draft.exercises.push({ name: '', sets: [{ reps: '', weight: '', target: '', done: false }] }); save(); render(); focusLast('.ex-name'); },
  'del-ex': (el) => {
    const ex = state.data.draft.exercises;
    const e = ex[+el.dataset.ei];
    if (e.name && !confirm(`Retirer « ${e.name} » ?`)) return;
    removeEx(ex, +el.dataset.ei); save(); render();
  },
  link: (el) => {
    const arr = el.dataset.scope === 'tpl' ? state.tplEdit.exercises : state.data.draft.exercises;
    const e = arr[+el.dataset.ei];
    e.ss = !e.ss;
    if (el.dataset.scope !== 'tpl') save();
    render();
  },
  'apply-sugg': (el) => {
    const e = state.data.draft.exercises[+el.dataset.ei];
    const sg = suggestProgress(e, state.data.draft.id);
    if (!sg) return;
    e.sets.forEach((s) => { if (!s.done) s.weight = String(sg.to); });
    save(); render(); toast(`${e.name} : ${fmtN(sg.to)} kg 💪`);
  },
  'ex-move': (el) => { swap(state.data.draft.exercises, +el.dataset.ei, +el.dataset.ei + +el.dataset.dir); save(); render(); },
  'add-set': (el) => {
    const sets = state.data.draft.exercises[+el.dataset.ei].sets;
    const last = sets[sets.length - 1];
    sets.push({ reps: last?.reps || '', weight: last?.weight || '', target: last?.target || '', done: false });
    save(); render();
  },
  'del-set': (el) => { state.data.draft.exercises[+el.dataset.ei].sets.splice(+el.dataset.si, 1); save(); render(); },
  'toggle-set': (el) => {
    const exs = state.data.draft.exercises;
    const ei = +el.dataset.ei;
    const s = exs[ei].sets[+el.dataset.si];
    s.done = !s.done;
    if (s.done) {
      // Dans un superset/circuit : pas de repos avant le dernier exercice du groupe
      const next = exs[ei + 1];
      if (exs[ei].ss && next) toast(`Enchaîne → ${next.name || 'exercice suivant'}`);
      else startTimer();
    }
    save(); render();
  },
  finish: () => finishDraft(),
  discard: () => {
    const d = state.data.draft;
    if (draftHasContent(d) && !confirm(d.status === 'planned' ? 'Annuler cette planification ?' : 'Abandonner la séance ? Les saisies non enregistrées seront perdues.')) return;
    state.data.draft = null; state.timer = null; save(); render();
  },
  'save-as-tpl': () => {
    const d = state.data.draft;
    const exercises = d.exercises.filter((e) => e.name.trim()).map((e) => ({
      name: e.name.trim(), ss: !!e.ss, sets: e.sets.length || 3, reps: e.sets[0]?.target || e.sets[0]?.reps || '', weight: '',
    }));
    if (exercises.length) exercises[exercises.length - 1].ss = false;
    if (!exercises.length) { toast('Ajoute au moins un exercice'); return; }
    const name = prompt('Nom du modèle', d.name || autoName(exercises));
    if (!name) return;
    state.data.templates.push({ id: uid(), name: name.trim(), exercises });
    save(); toast('Modèle enregistré');
  },

  // Minuteur
  'timer-add': () => { if (state.timer) { state.timer.end += 30000; tickTimer(); } },
  'timer-stop': () => { state.timer = null; clearInterval(timerInt); renderTimer(); },

  // Calendrier
  'cal-nav': (el) => {
    const c = state.cal;
    const d = new Date(c.y, c.m + +el.dataset.dir, 1);
    c.y = d.getFullYear(); c.m = d.getMonth();
    render();
  },
  'cal-day': (el) => { state.cal.sel = el.dataset.date; render(); },
  'cal-today': () => { state.cal = calInit(); render(); },
  'choose-open': (el) => { state.modal = { type: 'choose', mode: el.dataset.mode, date: state.cal.sel }; render(); },
  choose: (el) => {
    const m = state.modal;
    const t = findTpl(el.dataset.id);
    const exercises = t ? exercisesFromTemplate(t) : [{ name: '', sets: [{ reps: '', weight: '' }] }];
    if (m.mode === 'plan' && t) {
      state.data.sessions.push({
        id: uid(), name: t.name, date: m.date, status: 'planned', notes: '', createdAt: Date.now(),
        exercises: exercises.map((e) => ({ name: e.name, ss: e.ss, sets:e.sets.map((s) => ({ reps: num(s.reps), weight: num(s.weight), target: s.target })) })),
      });
      state.modal = null; save(); render(); toast('Séance planifiée');
      return;
    }
    startDraft(makeDraft({ name: t?.name || '', date: m.date, status: m.mode === 'plan' ? 'planned' : 'done', exercises }));
  },

  // Stats
  metric: (el) => { state.statsMetric = el.dataset.m; render(); },
  pt: (el) => { state.statsPt = +el.dataset.i; render(); },

  // Modèles
  'tpl-new': () => { state.tplEdit = { id: uid(), isNew: true, name: '', exercises: [{ name: '', sets: '3', reps: '10', weight: '' }] }; render(); window.scrollTo(0, 0); },
  'tpl-edit': (el) => {
    const t = findTpl(el.dataset.id);
    state.tplEdit = { ...JSON.parse(JSON.stringify(t)), isNew: false };
    render(); window.scrollTo(0, 0);
  },
  'tpl-dup': (el) => {
    const t = findTpl(el.dataset.id);
    const copy = { ...JSON.parse(JSON.stringify(t)), id: uid(), name: `${t.name} (copie)` };
    state.data.templates.splice(state.data.templates.indexOf(t) + 1, 0, copy);
    save(); render();
  },
  'tpl-del': (el) => {
    const t = findTpl(el.dataset.id);
    if (!confirm(`Supprimer le modèle « ${t.name} » ?`)) return;
    state.data.templates = state.data.templates.filter((x) => x.id !== t.id);
    save(); render();
  },
  'tpl-add-ex': () => {
    const ex = state.tplEdit.exercises;
    const last = ex[ex.length - 1];
    ex.push({ name: '', sets: last?.sets || '3', reps: last?.reps || '10', weight: '' });
    render(); focusLast('.ex-name');
  },
  'tpl-del-ex': (el) => { removeEx(state.tplEdit.exercises, +el.dataset.ei); render(); },
  'tpl-move': (el) => { swap(state.tplEdit.exercises, +el.dataset.ei, +el.dataset.ei + +el.dataset.dir); render(); },
  'tpl-save': () => {
    const t = state.tplEdit;
    const name = t.name.trim();
    if (!name) { toast('Donne un nom au modèle'); return; }
    const exercises = t.exercises.filter((e) => e.name.trim()).map((e) => ({
      name: e.name.trim(), ss: !!e.ss, sets: Math.max(1, parseInt(e.sets, 10) || 3), reps: String(e.reps || '').trim(), weight: num(e.weight) || '',
    }));
    if (!exercises.length) { toast('Ajoute au moins un exercice'); return; }
    exercises[exercises.length - 1].ss = false;
    const tpl = { id: t.id, name, exercises };
    const i = state.data.templates.findIndex((x) => x.id === t.id);
    if (i >= 0) state.data.templates[i] = tpl; else state.data.templates.push(tpl);
    exercises.forEach((e) => addToLibrary(e.name));
    state.tplEdit = null; save(); render(); toast('Modèle enregistré');
  },
  'tpl-cancel': () => { state.tplEdit = null; render(); },

  // Compte
  logout: () => logout(),
  export: () => {
    const { templates, sessions, exercises } = state.data;
    const blob = new Blob([JSON.stringify({ app: APP, version: 1, exportedAt: new Date().toISOString(), templates, sessions, exercises }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `salle-${today()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  'delete-account': () => {
    if (!confirm('Supprimer ton compte et toutes tes données de cet appareil ? Action irréversible.')) return;
    Store.set(`${APP}:users`, users().filter((u) => u.id !== state.user.id));
    Store.del(dataKey());
    logout();
  },
};

/* ---------- Event wiring ---------- */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  if (el.classList.contains('overlay') && e.target !== el) return; // clic dans la feuille
  const fn = actions[el.dataset.action];
  if (fn) { e.preventDefault(); fn(el, e); }
});

document.addEventListener('input', (e) => {
  const el = e.target;
  const b = el.dataset.bind;
  if (!b) return;
  const ei = +el.dataset.ei;
  const si = +el.dataset.si;
  if (b === 'pick.q') { state.pickQ = el.value; $('#pick-list').innerHTML = pickListHTML(); return; }
  if (b === 'lib.q') { state.libQ = el.value; $('#lib-list').innerHTML = libListHTML(); return; }
  if (b.startsWith('tpl.')) {
    if (b === 'tpl.name') state.tplEdit.name = el.value;
    else state.tplEdit.exercises[ei][el.dataset.f] = el.value;
    return;
  }
  const d = state.data.draft;
  switch (b) {
    case 'draft.name': d.name = el.value; break;
    case 'draft.date': d.date = el.value || today(); break;
    case 'draft.notes': d.notes = el.value; break;
    case 'ex.name': {
      d.exercises[ei].name = el.value;
      const h = $(`#hint-${ei}`);
      if (h) h.innerHTML = hintHTML(lastPerf(el.value, d.id));
      const sg = $(`#sugg-${ei}`);
      if (sg) sg.innerHTML = suggHTML(d.exercises[ei], ei);
      break;
    }
    case 'set.weight': d.exercises[ei].sets[si].weight = el.value; break;
    case 'set.reps': d.exercises[ei].sets[si].reps = el.value; break;
    default: return;
  }
  save();
});

document.addEventListener('change', async (e) => {
  const el = e.target;
  const c = el.dataset.change;
  if (!c) return;
  if (c === 'stats-ex') { state.statsEx = el.value; state.statsPt = null; render(); }
  else if (c === 'rest') { state.data.settings.rest = +el.value; save(); toast(+el.value ? `Repos : ${fmtTime(+el.value)}` : 'Minuteur désactivé'); }
  else if (c === 'btn-color') { setPref('btn', el.value); render(); }
  else if (c === 'ex-muscle') {
    const ex = state.data.exercises.find((x) => x.id === el.dataset.id);
    if (ex) { ex.muscle = el.value; save(); render(); }
  }
  else if (c === 'inc') { state.data.settings.inc = +el.value; save(); toast(`Progression : +${fmtN(+el.value)} kg`); }
  else if (c === 'import') {
    const f = el.files[0];
    if (!f) return;
    try {
      const j = JSON.parse(await f.text());
      if (!Array.isArray(j.sessions) || !Array.isArray(j.templates)) throw new Error();
      if (!confirm(`Remplacer tes données par cette sauvegarde (${plural(j.sessions.length, 'séance')}, ${plural(j.templates.length, 'modèle')}) ?`)) return;
      state.data.sessions = j.sessions;
      state.data.templates = j.templates;
      if (Array.isArray(j.exercises)) state.data.exercises = j.exercises;
      else j.sessions.forEach((x) => x.exercises.forEach((e) => addToLibrary(e.name)));
      state.modal = null;
      save(); render(); toast('Données importées');
    } catch { toast('Fichier invalide'); }
  }
});

document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'auth-form') return;
  e.preventDefault();
  const f = new FormData(e.target);
  const name = String(f.get('username') || '');
  state.authName = name;
  const btn = e.target.querySelector('[type="submit"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Patiente…'; }
  try {
    const pw = String(f.get('password') || '');
    const user = state.authMode === 'register' ? await register(name, pw, String(f.get('password2') || '')) : await login(name, pw);
    state.authError = '';
    openSession(user);
  } catch (err) {
    state.authError = err.message;
    render();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  if (e.target.id === 'new-ex-name') { e.preventDefault(); actions['ex-create'](); }
  else if (e.target.dataset.bind === 'pick.q') {
    e.preventDefault();
    const first = $('#pick-list [data-action]');
    if (first) first.click();
  }
});

let resizeT;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => { if (state.user && state.tab === 'stats') render(); }, 150);
});

/* ---------- Boot ---------- */
(function init() {
  applyPrefs();
  const sid = Store.get(`${APP}:session`, null);
  const u = users().find((x) => x.id === sid);
  if (u) { state.user = u; loadData(); state.cal = calInit(); }
  render();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
