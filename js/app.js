import {
  FAMILIES, STATUS, CATEGORIES, FOODS, RECIPES, REINTRO, SYMPTOMS, BRISTOL,
} from './data.js';
import * as store from './store.js';

const $ = (sel, root = document) => root.querySelector(sel);
const main = $('#main');
const dialog = $('#dialog');

const h = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const HOUR = 3600e3;
const DAY = 24 * HOUR;
const MEAL_TYPES = ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation'];
const PHASES = {
  elimination: {
    label: 'Élimination',
    text: 'Pendant 2 à 6 semaines, on remplace les aliments riches en FODMAP par des alternatives pauvres. Le but n’est pas de tout supprimer à vie, mais de voir si les symptômes diminuent.',
  },
  reintroduction: {
    label: 'Réintroduction',
    text: 'On teste une famille de FODMAP à la fois, sur 3 jours avec une portion croissante, en gardant le reste de l’alimentation pauvre en FODMAP. On laisse 2 à 3 jours sans test entre deux familles.',
  },
  personnalisation: {
    label: 'Personnalisation',
    text: 'On réintègre tout ce qui est bien toléré et on ne limite que ce qui pose vraiment problème, dans les portions qui passent. L’objectif est l’alimentation la plus variée possible.',
  },
};
const REINTRO_STATUS = {
  '': 'Pas encore testé',
  encours: 'Test en cours',
  tolere: 'Bien toléré',
  partiel: 'Toléré en petite quantité',
  nontolere: 'Mal toléré',
};

// ---------- Aliments (référence + corrections personnelles) ----------

function allFoods() {
  const s = store.get();
  return [...FOODS, ...s.customFoods].map((f) => {
    const o = s.overrides[f.id];
    return o ? { ...f, ...o, edited: true } : f;
  });
}

function foodById(id) {
  return allFoods().find((f) => f.id === id);
}

// Tolérance personnelle déduite des réintroductions.
function personalHint(food) {
  const r = store.get().reintro;
  if (!food.families.length) return '';
  const results = food.families.map((f) => r[f]?.status).filter(Boolean);
  if (results.includes('nontolere')) return 'Une famille mal tolérée chez vous';
  if (results.length === food.families.length && results.every((x) => x === 'tolere')) {
    return 'Familles bien tolérées chez vous';
  }
  if (results.includes('partiel')) return 'Toléré chez vous en petite quantité';
  return '';
}

function statusBadge(status) {
  return `<span class="badge badge-${status}">${h(STATUS[status].short)}</span>`;
}

function familyChips(families) {
  return families.map((f) => `<span class="chip">${h(FAMILIES[f].label)}</span>`).join('');
}

// ---------- Routage ----------

const ui = {
  guide: { q: '', status: '', cat: '', fam: '' },
  recettes: { q: '', meal: '', fav: false },
  journalDay: dayKey(Date.now()),
  bilanDays: 14,
};

const VIEWS = { guide: renderGuide, recettes: renderRecipes, journal: renderJournal, bilan: renderBilan, phases: renderPhases };

function route() {
  const name = location.hash.slice(1) || 'guide';
  const view = VIEWS[name] ? name : 'guide';
  document.querySelectorAll('nav a').forEach((a) => {
    a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + view);
  });
  VIEWS[view]();
}

window.addEventListener('hashchange', () => { route(); main.scrollTop = 0; window.scrollTo(0, 0); });
store.subscribe(route);

// ---------- Guide ----------

function renderGuide() {
  const f = ui.guide;
  const q = f.q.trim().toLowerCase();
  const foods = allFoods().filter((x) => (
    (!q || x.name.toLowerCase().includes(q))
    && (!f.status || x.status === f.status)
    && (!f.cat || x.category === f.cat)
    && (!f.fam || x.families.includes(f.fam))
  ));

  const groups = CATEGORIES.concat('Mes aliments')
    .map((cat) => [cat, foods.filter((x) => (x.category || 'Mes aliments') === cat)])
    .filter(([, list]) => list.length);

  main.innerHTML = `
    <header class="view-head">
      <h1>Guide alimentaire</h1>
      <p class="muted">Indications générales, pas des mesures de laboratoire. Touchez un aliment pour l’adapter à votre propre tolérance.</p>
    </header>
    <div class="filters">
      <input type="search" id="g-q" placeholder="Rechercher un aliment…" value="${h(f.q)}" autocomplete="off">
      <div class="seg" role="group" aria-label="Statut">
        ${[['', 'Tous'], ['ok', 'OK'], ['limite', 'Portion'], ['eviter', 'Éviter']].map(([v, l]) => `
          <button type="button" data-status="${v}" class="${f.status === v ? 'on' : ''} ${v ? 'seg-' + v : ''}">${l}</button>`).join('')}
      </div>
      <div class="row">
        <select id="g-cat"><option value="">Toutes catégories</option>
          ${CATEGORIES.map((c) => `<option ${f.cat === c ? 'selected' : ''}>${h(c)}</option>`).join('')}
        </select>
        <select id="g-fam"><option value="">Toutes familles</option>
          ${Object.entries(FAMILIES).map(([k, v]) => `<option value="${k}" ${f.fam === k ? 'selected' : ''}>${h(v.label)}</option>`).join('')}
        </select>
      </div>
    </div>
    <p class="count muted">${foods.length} aliment${foods.length > 1 ? 's' : ''}</p>
    ${groups.map(([cat, list]) => `
      <section class="group">
        <h2>${h(cat)}</h2>
        <ul class="food-list">
          ${list.map((x) => {
            const hint = personalHint(x);
            return `<li><button type="button" class="food" data-food="${x.id}">
              <span class="dot dot-${x.status}" aria-hidden="true"></span>
              <span class="food-main">
                <span class="food-name">${h(x.name)}${x.edited ? ' <span class="edited" title="Fiche modifiée">✎</span>' : ''}</span>
                ${x.note ? `<span class="food-note">${h(x.note)}</span>` : ''}
                ${hint ? `<span class="food-hint">${h(hint)}</span>` : ''}
              </span>
              ${statusBadge(x.status)}
            </button></li>`;
          }).join('')}
        </ul>
      </section>`).join('') || '<p class="empty">Aucun aliment ne correspond.</p>'}
    <button type="button" class="btn btn-ghost wide" id="g-add">+ Ajouter un aliment</button>
  `;

  const qInput = $('#g-q');
  qInput.addEventListener('input', () => {
    f.q = qInput.value;
    const pos = qInput.selectionStart;
    renderGuide();
    const el = $('#g-q');
    el.focus();
    el.setSelectionRange(pos, pos);
  });
  main.querySelectorAll('[data-status]').forEach((b) => b.addEventListener('click', () => {
    f.status = b.dataset.status; renderGuide();
  }));
  $('#g-cat').addEventListener('change', (e) => { f.cat = e.target.value; renderGuide(); });
  $('#g-fam').addEventListener('change', (e) => { f.fam = e.target.value; renderGuide(); });
  main.querySelectorAll('[data-food]').forEach((b) => b.addEventListener('click', () => openFood(b.dataset.food)));
  $('#g-add').addEventListener('click', () => openFood(null));
}

function openFood(id) {
  const food = id ? foodById(id) : { name: '', category: 'Mes aliments', status: 'ok', families: [], note: '' };
  const isCustom = !id || id.startsWith('c');
  const original = FOODS.find((x) => x.id === id);

  openDialog(`
    <form method="dialog" class="form" id="food-form">
      <h2>${id ? h(food.name) : 'Nouvel aliment'}</h2>
      ${isCustom ? `<label>Nom<input name="name" required value="${h(food.name)}"></label>` : ''}
      ${!id ? '' : `<p>${statusBadge(food.status)} ${h(STATUS[food.status].label)}</p>
        ${food.families.length ? `<p>FODMAP concernés : ${familyChips(food.families)}</p>` : ''}
        ${personalHint(food) ? `<p class="food-hint">${h(personalHint(food))}</p>` : ''}`}
      <fieldset>
        <legend>${id ? 'Pour moi, cet aliment est' : 'Statut'}</legend>
        <div class="seg">
          ${Object.entries(STATUS).map(([k, v]) => `
            <label class="seg-opt seg-${k}"><input type="radio" name="status" value="${k}" ${food.status === k ? 'checked' : ''}><span>${h(v.short)}</span></label>`).join('')}
        </div>
      </fieldset>
      ${isCustom ? `<fieldset><legend>Familles de FODMAP</legend><div class="checks">
        ${Object.entries(FAMILIES).map(([k, v]) => `
          <label class="check"><input type="checkbox" name="fam" value="${k}" ${food.families.includes(k) ? 'checked' : ''}> ${h(v.label)}</label>`).join('')}
      </div></fieldset>` : ''}
      <label>Note (portion tolérée, marque…)<textarea name="note" rows="2">${h(food.note)}</textarea></label>
      <div class="actions">
        ${food.edited && original ? '<button type="button" class="btn btn-ghost" id="food-reset">Rétablir la fiche d’origine</button>' : ''}
        ${id && isCustom ? '<button type="button" class="btn btn-danger" id="food-del">Supprimer</button>' : ''}
        <button type="button" class="btn btn-ghost" data-close>Annuler</button>
        <button class="btn">Enregistrer</button>
      </div>
    </form>
  `);

  $('#food-form').addEventListener('submit', (e) => {
    const fd = new FormData(e.target);
    const patch = { status: fd.get('status'), note: fd.get('note').trim() };
    store.update((s) => {
      if (!id) {
        s.customFoods.push({ id: 'c' + store.uid(), name: fd.get('name').trim(), category: 'Mes aliments', families: fd.getAll('fam'), ...patch });
      } else if (isCustom) {
        const c = s.customFoods.find((x) => x.id === id);
        Object.assign(c, patch, { name: fd.get('name').trim(), families: fd.getAll('fam') });
      } else {
        s.overrides[id] = patch;
      }
    });
  });
  $('#food-reset')?.addEventListener('click', () => {
    store.update((s) => { delete s.overrides[id]; });
    dialog.close();
  });
  $('#food-del')?.addEventListener('click', () => {
    if (!confirm('Supprimer cet aliment ?')) return;
    store.update((s) => { s.customFoods = s.customFoods.filter((x) => x.id !== id); });
    dialog.close();
  });
}

// ---------- Recettes ----------

function renderRecipes() {
  const f = ui.recettes;
  const s = store.get();
  const q = f.q.trim().toLowerCase();
  const list = RECIPES.filter((r) => (
    (!f.meal || r.meal === f.meal)
    && (!f.fav || s.favorites.includes(r.id))
    && (!q || r.title.toLowerCase().includes(q) || r.ingredients.some((i) => i.toLowerCase().includes(q)))
  ));

  main.innerHTML = `
    <header class="view-head">
      <h1>Recettes</h1>
      <p class="muted">Recettes pauvres en FODMAP en respectant les portions indiquées.</p>
    </header>
    <div class="filters">
      <input type="search" id="r-q" placeholder="Recette ou ingrédient…" value="${h(f.q)}" autocomplete="off">
      <div class="pills">
        <button type="button" data-meal="" class="${!f.meal && !f.fav ? 'on' : ''}">Toutes</button>
        <button type="button" data-fav class="${f.fav ? 'on' : ''}">★ Favoris</button>
        ${[...MEAL_TYPES, 'Dessert'].map((m) => `<button type="button" data-meal="${m}" class="${f.meal === m ? 'on' : ''}">${m}</button>`).join('')}
      </div>
    </div>
    <ul class="cards">
      ${list.map((r) => `<li><button type="button" class="card" data-recipe="${r.id}">
        <span class="card-meta">${h(r.meal)} · ${r.time} min · ${r.servings} pers.</span>
        <span class="card-title">${s.favorites.includes(r.id) ? '★ ' : ''}${h(r.title)}</span>
      </button></li>`).join('') || '<p class="empty">Aucune recette ne correspond.</p>'}
    </ul>
    <section class="group">
      <h2>Liste de courses ${s.shopping.length ? `<span class="muted">(${s.shopping.filter((x) => !x.done).length})</span>` : ''}</h2>
      ${s.shopping.length ? `<ul class="shopping">
        ${s.shopping.map((it, i) => `<li><label class="check"><input type="checkbox" data-shop="${i}" ${it.done ? 'checked' : ''}> <span>${h(it.text)}</span></label></li>`).join('')}
      </ul>
      <div class="actions"><button type="button" class="btn btn-ghost" id="shop-clear">Retirer les éléments cochés</button></div>`
      : '<p class="muted">Vide. Ouvrez une recette pour y ajouter ses ingrédients.</p>'}
      <form class="inline-add" id="shop-add"><input name="t" placeholder="Ajouter un article…"><button class="btn">Ajouter</button></form>
    </section>
  `;

  const qInput = $('#r-q');
  qInput.addEventListener('input', () => {
    f.q = qInput.value;
    const pos = qInput.selectionStart;
    renderRecipes();
    $('#r-q').focus();
    $('#r-q').setSelectionRange(pos, pos);
  });
  main.querySelectorAll('[data-meal]').forEach((b) => b.addEventListener('click', () => {
    f.meal = b.dataset.meal; f.fav = false; renderRecipes();
  }));
  $('[data-fav]').addEventListener('click', () => { f.fav = !f.fav; f.meal = ''; renderRecipes(); });
  main.querySelectorAll('[data-recipe]').forEach((b) => b.addEventListener('click', () => openRecipe(b.dataset.recipe)));
  main.querySelectorAll('[data-shop]').forEach((c) => c.addEventListener('change', () => {
    store.update((st) => { st.shopping[+c.dataset.shop].done = c.checked; });
  }));
  $('#shop-clear')?.addEventListener('click', () => store.update((st) => { st.shopping = st.shopping.filter((x) => !x.done); }));
  $('#shop-add').addEventListener('submit', (e) => {
    e.preventDefault();
    const t = e.target.t.value.trim();
    if (t) store.update((st) => { st.shopping.push({ text: t, done: false }); });
  });
}

function openRecipe(id) {
  const r = RECIPES.find((x) => x.id === id);
  const fav = store.get().favorites.includes(id);
  openDialog(`
    <article class="recipe">
      <p class="card-meta">${h(r.meal)} · ${r.time} min · ${r.servings} pers.</p>
      <h2>${h(r.title)}</h2>
      <h3>Ingrédients</h3>
      <ul class="checks-list">${r.ingredients.map((i, n) => `<li><label class="check"><input type="checkbox" name="ing" value="${n}" checked> ${h(i)}</label></li>`).join('')}</ul>
      <h3>Préparation</h3>
      <ol>${r.steps.map((st) => `<li>${h(st)}</li>`).join('')}</ol>
      <div class="actions">
        <button type="button" class="btn btn-ghost" id="rc-fav">${fav ? '★ Retirer des favoris' : '☆ Favori'}</button>
        <button type="button" class="btn btn-ghost" id="rc-shop">Ajouter les cochés aux courses</button>
        <button type="button" class="btn btn-ghost" id="rc-log">Noter dans le journal</button>
        <button type="button" class="btn" data-close>Fermer</button>
      </div>
    </article>
  `);
  $('#rc-fav').addEventListener('click', () => {
    store.update((s) => {
      s.favorites = fav ? s.favorites.filter((x) => x !== id) : [...s.favorites, id];
    });
    openRecipe(id);
  });
  $('#rc-shop').addEventListener('click', (e) => {
    const picked = [...dialog.querySelectorAll('input[name=ing]:checked')].map((c) => r.ingredients[+c.value]);
    store.update((s) => {
      picked.forEach((t) => { if (!s.shopping.some((x) => x.text === t && !x.done)) s.shopping.push({ text: t, done: false }); });
    });
    e.target.textContent = `✓ ${picked.length} ajouté${picked.length > 1 ? 's' : ''}`;
  });
  $('#rc-log').addEventListener('click', () => {
    dialog.close();
    openEntry('meal', null, { text: r.title, mealType: MEAL_TYPES.includes(r.meal) ? r.meal : 'Collation' });
  });
}

// ---------- Journal ----------

function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dayStart(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
}

function fmtDay(key) {
  const today = dayKey(Date.now());
  const yesterday = dayKey(Date.now() - DAY);
  if (key === today) return 'Aujourd’hui';
  if (key === yesterday) return 'Hier';
  return new Date(dayStart(key)).toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });
}

function toLocalInput(ts) {
  const d = new Date(ts);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function maxSymptom(e) {
  return Math.max(0, ...Object.values(e.scores || {}));
}

function entrySummary(e) {
  switch (e.type) {
    case 'meal': {
      const foods = (e.foods || []).map(foodById).filter(Boolean);
      return `<strong>${h(e.mealType)}</strong>
        ${e.text ? `<span>${h(e.text)}</span>` : ''}
        ${foods.length ? `<span class="food-tags">${foods.map((f) => `<span class="tag tag-${f.status}">${h(f.name)}</span>`).join('')}</span>` : ''}`;
    }
    case 'symptom': {
      const list = SYMPTOMS.filter((s) => e.scores?.[s.id] > 0);
      return `<strong>Symptômes</strong>
        <span>${list.length ? list.map((s) => `${h(s.label)} ${e.scores[s.id]}/10`).join(' · ') : 'Aucun symptôme'}</span>
        ${e.note ? `<span class="muted">${h(e.note)}</span>` : ''}`;
    }
    case 'stool':
      return `<strong>Selles</strong><span>Type ${e.bristol} — ${h(BRISTOL[e.bristol - 1].label)}</span>${e.note ? `<span class="muted">${h(e.note)}</span>` : ''}`;
    case 'context':
      return `<strong>Bien-être</strong><span>${[
        e.stress != null ? `Stress ${e.stress}/10` : '',
        e.sleep ? `Sommeil ${e.sleep} h` : '',
      ].filter(Boolean).join(' · ')}</span>${e.note ? `<span class="muted">${h(e.note)}</span>` : ''}`;
    default: return '';
  }
}

const ENTRY_ICON = { meal: '🍽', symptom: '⚡', stool: '🚽', context: '🌙' };

function renderJournal() {
  const key = ui.journalDay;
  const start = dayStart(key);
  const entries = store.get().journal
    .filter((e) => e.ts >= start && e.ts < start + DAY)
    .sort((a, b) => a.ts - b.ts);
  const isToday = key === dayKey(Date.now());

  main.innerHTML = `
    <header class="view-head">
      <h1>Journal</h1>
    </header>
    <div class="daynav">
      <button type="button" class="btn btn-ghost" id="j-prev" aria-label="Jour précédent">‹</button>
      <label class="daynav-label"><span>${h(fmtDay(key))}</span><input type="date" id="j-date" value="${key}" max="${dayKey(Date.now())}"></label>
      <button type="button" class="btn btn-ghost" id="j-next" aria-label="Jour suivant" ${isToday ? 'disabled' : ''}>›</button>
    </div>
    <div class="quick">
      <button type="button" data-new="meal"><span>${ENTRY_ICON.meal}</span>Repas</button>
      <button type="button" data-new="symptom"><span>${ENTRY_ICON.symptom}</span>Symptômes</button>
      <button type="button" data-new="stool"><span>${ENTRY_ICON.stool}</span>Selles</button>
      <button type="button" data-new="context"><span>${ENTRY_ICON.context}</span>Stress, sommeil</button>
    </div>
    ${entries.length ? `<ol class="timeline">
      ${entries.map((e) => `<li><button type="button" class="entry entry-${e.type}" data-entry="${e.id}">
        <time>${fmtTime(e.ts)}</time>
        <span class="entry-icon" aria-hidden="true">${ENTRY_ICON[e.type]}</span>
        <span class="entry-body">${entrySummary(e)}</span>
        ${e.type === 'symptom' ? `<span class="score score-${scoreLevel(maxSymptom(e))}">${maxSymptom(e)}</span>` : ''}
      </button></li>`).join('')}
    </ol>` : '<p class="empty">Rien de noté ce jour-là.</p>'}
  `;

  $('#j-prev').addEventListener('click', () => { ui.journalDay = dayKey(start - DAY / 2); renderJournal(); });
  $('#j-next').addEventListener('click', () => { ui.journalDay = dayKey(start + DAY * 1.5); renderJournal(); });
  $('#j-date').addEventListener('change', (e) => { if (e.target.value) { ui.journalDay = e.target.value; renderJournal(); } });
  main.querySelectorAll('[data-new]').forEach((b) => b.addEventListener('click', () => openEntry(b.dataset.new)));
  main.querySelectorAll('[data-entry]').forEach((b) => b.addEventListener('click', () => {
    const e = store.get().journal.find((x) => x.id === b.dataset.entry);
    openEntry(e.type, e);
  }));
}

function scoreLevel(n) {
  return n >= 7 ? 'high' : n >= 4 ? 'mid' : n > 0 ? 'low' : 'none';
}

function defaultTs() {
  const now = Date.now();
  const start = dayStart(ui.journalDay);
  if (now >= start && now < start + DAY) return now;
  return start + 12 * HOUR;
}

function guessMealType(ts) {
  const hr = new Date(ts).getHours();
  if (hr < 10) return 'Petit-déjeuner';
  if (hr < 15) return 'Déjeuner';
  if (hr >= 18) return 'Dîner';
  return 'Collation';
}

function openEntry(type, entry = null, preset = {}) {
  const e = entry || { type, ts: defaultTs(), ...preset };
  const titles = { meal: 'Repas', symptom: 'Symptômes', stool: 'Selles', context: 'Stress et sommeil' };
  let selected = new Set(e.foods || []);

  let body = '';
  if (type === 'meal') {
    const mt = e.mealType || guessMealType(e.ts);
    body = `
      <div class="pills">${MEAL_TYPES.map((m) => `<label class="pill"><input type="radio" name="mealType" value="${m}" ${mt === m ? 'checked' : ''}><span>${m}</span></label>`).join('')}</div>
      <label>Description<textarea name="text" rows="2" placeholder="Ex. : riz, poulet, courgettes">${h(e.text)}</textarea></label>
      <fieldset><legend>Aliments du guide (pour l’analyse)</legend>
        <div class="food-tags" id="sel-foods"></div>
        <input type="search" id="food-search" placeholder="Ajouter un aliment…" autocomplete="off">
        <ul class="suggest" id="food-suggest"></ul>
      </fieldset>`;
  } else if (type === 'symptom') {
    body = SYMPTOMS.map((s) => {
      const v = e.scores?.[s.id] ?? 0;
      return `<label class="range"><span>${h(s.label)} <output>${v}</output>/10</span>
        <input type="range" min="0" max="10" step="1" name="s-${s.id}" value="${v}"></label>`;
    }).join('') + `<label>Note<textarea name="note" rows="2">${h(e.note)}</textarea></label>`;
  } else if (type === 'stool') {
    body = `<fieldset><legend>Échelle de Bristol</legend><div class="bristol">
      ${BRISTOL.map((b) => `<label class="bristol-opt"><input type="radio" name="bristol" value="${b.n}" ${(e.bristol || 4) === b.n ? 'checked' : ''} required>
        <span><strong>${b.n}</strong> ${h(b.label)}</span></label>`).join('')}
    </div></fieldset>
    <label>Note<textarea name="note" rows="2">${h(e.note)}</textarea></label>`;
  } else {
    const st = e.stress ?? 3;
    body = `<label class="range"><span>Stress <output>${st}</output>/10</span><input type="range" min="0" max="10" name="stress" value="${st}"></label>
      <label>Heures de sommeil<input type="number" name="sleep" min="0" max="16" step="0.5" value="${h(e.sleep ?? '')}"></label>
      <label>Note (activité, règles, médicaments…)<textarea name="note" rows="2">${h(e.note)}</textarea></label>`;
  }

  openDialog(`
    <form method="dialog" class="form" id="entry-form">
      <h2>${titles[type]}</h2>
      <label>Date et heure<input type="datetime-local" name="ts" value="${toLocalInput(e.ts)}" required></label>
      ${body}
      <div class="actions">
        ${entry ? '<button type="button" class="btn btn-danger" id="entry-del">Supprimer</button>' : ''}
        <button type="button" class="btn btn-ghost" data-close>Annuler</button>
        <button class="btn">Enregistrer</button>
      </div>
    </form>
  `);

  const form = $('#entry-form');
  form.querySelectorAll('input[type=range]').forEach((r) => r.addEventListener('input', () => {
    r.closest('label').querySelector('output').textContent = r.value;
  }));

  if (type === 'meal') {
    const box = $('#sel-foods');
    const search = $('#food-search');
    const sug = $('#food-suggest');
    const drawSelected = () => {
      box.innerHTML = [...selected].map(foodById).filter(Boolean).map((f) => `
        <button type="button" class="tag tag-${f.status}" data-rm="${f.id}" aria-label="Retirer ${h(f.name)}">${h(f.name)} ✕</button>`).join('');
      box.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', () => { selected.delete(b.dataset.rm); drawSelected(); }));
    };
    const drawSuggest = () => {
      const q = search.value.trim().toLowerCase();
      if (!q) { sug.innerHTML = ''; return; }
      const rankOf = (n) => (n === q ? 0 : n.startsWith(q) ? 1 : 2);
      sug.innerHTML = allFoods().filter((f) => f.name.toLowerCase().includes(q) && !selected.has(f.id))
        .sort((a, b) => rankOf(a.name.toLowerCase()) - rankOf(b.name.toLowerCase()) || a.name.length - b.name.length)
        .slice(0, 6)
        .map((f) => `<li><button type="button" data-add="${f.id}"><span class="dot dot-${f.status}"></span>${h(f.name)}</button></li>`).join('');
      sug.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', () => {
        selected.add(b.dataset.add); search.value = ''; drawSuggest(); drawSelected(); search.focus();
      }));
    };
    search.addEventListener('input', drawSuggest);
    search.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') { ev.preventDefault(); sug.querySelector('button')?.click(); }
    });
    drawSelected();
  }

  form.addEventListener('submit', () => {
    const fd = new FormData(form);
    const ts = new Date(fd.get('ts')).getTime();
    const rec = { id: entry?.id || store.uid(), type, ts };
    if (type === 'meal') Object.assign(rec, { mealType: fd.get('mealType'), text: fd.get('text').trim(), foods: [...selected] });
    if (type === 'symptom') {
      rec.scores = Object.fromEntries(SYMPTOMS.map((s) => [s.id, +fd.get('s-' + s.id)]));
      rec.note = fd.get('note').trim();
    }
    if (type === 'stool') Object.assign(rec, { bristol: +fd.get('bristol'), note: fd.get('note').trim() });
    if (type === 'context') {
      Object.assign(rec, { stress: +fd.get('stress'), sleep: fd.get('sleep') ? +fd.get('sleep') : null, note: fd.get('note').trim() });
    }
    ui.journalDay = dayKey(ts);
    store.update((s) => {
      s.journal = s.journal.filter((x) => x.id !== rec.id);
      s.journal.push(rec);
    });
    if (location.hash !== '#journal') location.hash = '#journal';
  });
  $('#entry-del')?.addEventListener('click', () => {
    if (!confirm('Supprimer cette entrée ?')) return;
    store.update((s) => { s.journal = s.journal.filter((x) => x.id !== entry.id); });
    dialog.close();
  });
}

// ---------- Bilan ----------

// Pour chaque repas, on retient le symptôme le plus fort noté entre 2 h et 24 h après.
// C'est une corrélation brute : elle oriente la réflexion, elle ne prouve rien.
function analyse(journal) {
  const meals = journal.filter((e) => e.type === 'meal' && e.foods?.length);
  const symptoms = journal.filter((e) => e.type === 'symptom');
  if (!meals.length || !symptoms.length) return null;

  const scored = meals.map((m) => ({
    meal: m,
    score: Math.max(0, ...symptoms.filter((s) => s.ts >= m.ts + 2 * HOUR && s.ts <= m.ts + DAY).map(maxSymptom)),
  }));
  const baseline = scored.reduce((a, x) => a + x.score, 0) / scored.length;

  const byFood = new Map();
  const byFamily = new Map();
  scored.forEach(({ meal, score }) => {
    const fams = new Set();
    meal.foods.forEach((id) => {
      const f = foodById(id);
      if (!f) return;
      const cur = byFood.get(id) || { food: f, n: 0, sum: 0 };
      cur.n += 1; cur.sum += score;
      byFood.set(id, cur);
      f.families.forEach((x) => fams.add(x));
    });
    fams.forEach((x) => {
      const cur = byFamily.get(x) || { n: 0, sum: 0 };
      cur.n += 1; cur.sum += score;
      byFamily.set(x, cur);
    });
  });

  const rank = (m) => [...m.entries()].map(([k, v]) => ({ key: k, ...v, avg: v.sum / v.n }))
    .filter((x) => x.n >= 3)
    .sort((a, b) => b.avg - a.avg);

  return { baseline, meals: scored.length, foods: rank(byFood), families: rank(byFamily) };
}

function renderBilan() {
  const s = store.get();
  const days = ui.bilanDays;
  const end = dayStart(dayKey(Date.now())) + DAY;
  const start = end - days * DAY;
  const inRange = s.journal.filter((e) => e.ts >= start && e.ts < end);

  const daily = Array.from({ length: days }, (_, i) => {
    const d0 = start + i * DAY;
    const sy = inRange.filter((e) => e.type === 'symptom' && e.ts >= d0 && e.ts < d0 + DAY);
    return { d0, max: sy.length ? Math.max(...sy.map(maxSymptom)) : null };
  });
  const logged = daily.filter((d) => d.max !== null);
  const avg = logged.length ? logged.reduce((a, d) => a + d.max, 0) / logged.length : null;
  const calm = logged.filter((d) => d.max <= 3).length;

  const stools = inRange.filter((e) => e.type === 'stool');
  const bristolCounts = BRISTOL.map((b) => stools.filter((x) => x.bristol === b.n).length);
  const bristolMax = Math.max(1, ...bristolCounts);

  const ctx = inRange.filter((e) => e.type === 'context');
  const avgStress = ctx.length ? ctx.reduce((a, e) => a + (e.stress ?? 0), 0) / ctx.length : null;
  const sleeps = ctx.filter((e) => e.sleep);
  const avgSleep = sleeps.length ? sleeps.reduce((a, e) => a + e.sleep, 0) / sleeps.length : null;

  const an = analyse(s.journal.filter((e) => e.ts >= end - 90 * DAY));
  const fmt = (n) => n.toLocaleString('fr-BE', { maximumFractionDigits: 1 });

  const W = 320; const H = 120; const bw = W / days;
  const chart = `<svg viewBox="0 0 ${W} ${H + 18}" class="chart" role="img" aria-label="Intensité maximale des symptômes par jour">
    ${[0, 5, 10].map((v) => `<line x1="0" x2="${W}" y1="${H - v * H / 10}" y2="${H - v * H / 10}" class="grid"/>`).join('')}
    ${daily.map((d, i) => {
      if (d.max === null) return `<circle cx="${i * bw + bw / 2}" cy="${H - 2}" r="1.5" class="nodata"/>`;
      const bh = Math.max(2, d.max * H / 10);
      return `<rect x="${i * bw + bw * 0.15}" y="${H - bh}" width="${bw * 0.7}" height="${bh}" rx="2" class="bar bar-${scoreLevel(d.max)}"><title>${new Date(d.d0).toLocaleDateString('fr-BE')} : ${d.max}/10</title></rect>`;
    }).join('')}
    ${daily.map((d, i) => (i % Math.ceil(days / 7) === 0 ? `<text x="${i * bw + bw / 2}" y="${H + 14}" class="axis">${new Date(d.d0).getDate()}/${new Date(d.d0).getMonth() + 1}</text>` : '')).join('')}
  </svg>`;

  main.innerHTML = `
    <header class="view-head">
      <h1>Bilan</h1>
    </header>
    <div class="seg" role="group" aria-label="Période">
      ${[7, 14, 30].map((n) => `<button type="button" data-days="${n}" class="${days === n ? 'on' : ''}">${n} jours</button>`).join('')}
    </div>
    <div class="stats">
      <div class="stat"><span class="stat-n">${avg === null ? '—' : fmt(avg)}</span><span class="stat-l">intensité moyenne /10</span></div>
      <div class="stat"><span class="stat-n">${logged.length ? `${calm}/${logged.length}` : '—'}</span><span class="stat-l">jours calmes (≤ 3)</span></div>
      <div class="stat"><span class="stat-n">${avgStress === null ? '—' : fmt(avgStress)}</span><span class="stat-l">stress moyen /10</span></div>
      <div class="stat"><span class="stat-n">${avgSleep === null ? '—' : fmt(avgSleep) + ' h'}</span><span class="stat-l">sommeil moyen</span></div>
    </div>
    <section class="group">
      <h2>Symptômes, pic du jour</h2>
      ${logged.length ? chart : '<p class="muted">Notez vos symptômes dans le journal pour voir la courbe.</p>'}
    </section>
    <section class="group">
      <h2>Selles (Bristol)</h2>
      ${stools.length ? `<ul class="hbars">${BRISTOL.map((b, i) => `<li>
        <span class="hbar-l">${b.n}</span>
        <span class="hbar"><span class="hbar-fill ${b.n >= 3 && b.n <= 5 ? 'hbar-ok' : 'hbar-warn'}" style="width:${bristolCounts[i] / bristolMax * 100}%"></span></span>
        <span class="hbar-n">${bristolCounts[i]}</span></li>`).join('')}</ul>
        <p class="muted small">Les types 3 à 5 sont considérés comme normaux.</p>`
      : '<p class="muted">Aucune selle notée sur la période.</p>'}
    </section>
    <section class="group">
      <h2>Pistes à explorer</h2>
      ${!an ? '<p class="muted">Il faut des repas avec des aliments du guide et des symptômes notés pour faire apparaître des pistes.</p>' : `
        <p class="muted small">Sur ${an.meals} repas des 90 derniers jours, le symptôme le plus fort noté 2 à 24 h après un repas est en moyenne de <strong>${fmt(an.baseline)}/10</strong>. Les éléments ci-dessous font plus ou moins que cette moyenne (au moins 3 repas). Il s’agit de corrélations : à confirmer par une réintroduction contrôlée.</p>
        ${an.families.length ? `<h3>Par famille de FODMAP</h3><ul class="rank">${an.families.map((x) => rankRow(FAMILIES[x.key].label, x, an.baseline, fmt)).join('')}</ul>` : ''}
        ${an.foods.length ? `<h3>Par aliment</h3><ul class="rank">${an.foods.slice(0, 12).map((x) => rankRow(x.food.name, x, an.baseline, fmt)).join('')}</ul>`
          : '<p class="muted">Pas encore assez de répétitions par aliment.</p>'}`}
    </section>
    <section class="group">
      <h2>Mes données</h2>
      <p class="muted small">Tout est enregistré uniquement sur cet appareil. Exportez régulièrement une sauvegarde, par exemple pour la montrer à votre diététicien ou changer de téléphone.</p>
      <div class="actions">
        <button type="button" class="btn btn-ghost" id="exp-json">Sauvegarder (JSON)</button>
        <button type="button" class="btn btn-ghost" id="exp-csv">Exporter le journal (CSV)</button>
        <label class="btn btn-ghost">Restaurer une sauvegarde<input type="file" id="imp-json" accept="application/json,.json" hidden></label>
      </div>
    </section>
  `;

  main.querySelectorAll('[data-days]').forEach((b) => b.addEventListener('click', () => { ui.bilanDays = +b.dataset.days; renderBilan(); }));
  $('#exp-json').addEventListener('click', () => download(`ventre-tranquille-${dayKey(Date.now())}.json`, store.exportJSON(), 'application/json'));
  $('#exp-csv').addEventListener('click', () => download(`journal-${dayKey(Date.now())}.csv`, journalCSV(), 'text/csv'));
  $('#imp-json').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!confirm('Remplacer toutes les données actuelles par cette sauvegarde ?')) return;
    try {
      store.importJSON(await file.text());
      alert('Sauvegarde restaurée.');
    } catch (err) {
      alert(err.message);
    }
  });
}

function rankRow(label, x, baseline, fmt) {
  const diff = x.avg - baseline;
  const cls = diff >= 1.5 ? 'up' : diff <= -1.5 ? 'down' : 'flat';
  return `<li class="rank-${cls}"><span>${h(label)}</span><span class="muted">${x.n} repas</span>
    <span class="rank-v">${fmt(x.avg)}<small>${diff >= 0 ? '+' : ''}${fmt(diff)}</small></span></li>`;
}

function journalCSV() {
  const cols = ['date', 'heure', 'type', 'repas', 'description', 'aliments', ...SYMPTOMS.map((s) => s.label), 'bristol', 'stress', 'sommeil', 'note'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [...store.get().journal].sort((a, b) => a.ts - b.ts).map((e) => [
    dayKey(e.ts), fmtTime(e.ts), e.type, e.mealType, e.text,
    (e.foods || []).map((id) => foodById(id)?.name).filter(Boolean).join(' / '),
    ...SYMPTOMS.map((s) => e.scores?.[s.id] ?? ''), e.bristol, e.stress, e.sleep, e.note,
  ]);
  return '﻿' + [cols, ...rows].map((r) => r.map(esc).join(';')).join('\n');
}

function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------- Phases ----------

function renderPhases() {
  const s = store.get();
  main.innerHTML = `
    <header class="view-head">
      <h1>Mon parcours</h1>
      <p class="muted">Le régime pauvre en FODMAP se fait en trois temps, idéalement accompagné par un diététicien.</p>
    </header>
    <ol class="phases">
      ${Object.entries(PHASES).map(([k, p], i) => `<li class="${s.phase === k ? 'current' : ''}">
        <button type="button" data-phase="${k}"><span class="phase-n">${i + 1}</span><span><strong>${p.label}</strong>
        ${s.phase === k ? '<span class="chip">En cours</span>' : ''}</span></button>
        ${s.phase === k ? `<p>${h(p.text)}</p>` : ''}
      </li>`).join('')}
    </ol>
    <section class="group">
      <h2>Réintroduction par famille</h2>
      <p class="muted small">Jour 1, 2, 3 : portion croissante de l’aliment-test. Si les symptômes sont nets, arrêtez le test. Notez tout dans le journal.</p>
      <ul class="reintro">
        ${Object.entries(FAMILIES).map(([k, fam]) => {
          const r = s.reintro[k] || {};
          const t = REINTRO[k];
          return `<li class="ri ri-${r.status || 'none'}"><button type="button" data-fam="${k}">
            <span class="ri-head"><strong>${h(fam.label)}</strong><span class="ri-status">${h(REINTRO_STATUS[r.status || ''])}</span></span>
            <span class="muted small">Test : ${h(t.food)} — ${t.doses.map(h).join(', ')}</span>
            ${r.note ? `<span class="small">${h(r.note)}</span>` : ''}
          </button></li>`;
        }).join('')}
      </ul>
    </section>
    <section class="group disclaimer">
      <h2>À savoir</h2>
      <p class="small">Cette application est un outil d’organisation personnel. Les informations sur les aliments sont indicatives et ne remplacent pas l’avis d’un médecin ou d’un diététicien. Consultez rapidement en cas de sang dans les selles, de perte de poids inexpliquée, de fièvre, de symptômes nocturnes ou d’anémie.</p>
    </section>
  `;
  main.querySelectorAll('[data-phase]').forEach((b) => b.addEventListener('click', () => {
    store.update((st) => { st.phase = b.dataset.phase; });
  }));
  main.querySelectorAll('[data-fam]').forEach((b) => b.addEventListener('click', () => openReintro(b.dataset.fam)));
}

function openReintro(fam) {
  const r = store.get().reintro[fam] || {};
  const t = REINTRO[fam];
  openDialog(`
    <form method="dialog" class="form" id="ri-form">
      <h2>${h(FAMILIES[fam].label)}</h2>
      <p class="muted small">Présent dans : ${h(FAMILIES[fam].hint)}.</p>
      <ol class="doses">${t.doses.map((d, i) => `<li>Jour ${i + 1} : ${h(t.food)}, ${h(d)}</li>`).join('')}</ol>
      <label>Début du test<input type="date" name="start" value="${h(r.start || '')}"></label>
      <label>Résultat<select name="status">
        ${Object.entries(REINTRO_STATUS).map(([k, v]) => `<option value="${k}" ${(r.status || '') === k ? 'selected' : ''}>${h(v)}</option>`).join('')}
      </select></label>
      <label>Notes (portion tolérée, symptômes…)<textarea name="note" rows="3">${h(r.note)}</textarea></label>
      <div class="actions">
        ${r.start ? '<button type="button" class="btn btn-ghost" id="ri-journal">Voir dans le journal</button>' : ''}
        <button type="button" class="btn btn-ghost" data-close>Annuler</button>
        <button class="btn">Enregistrer</button>
      </div>
    </form>
  `);
  $('#ri-form').addEventListener('submit', (e) => {
    const fd = new FormData(e.target);
    store.update((s) => { s.reintro[fam] = { start: fd.get('start'), status: fd.get('status'), note: fd.get('note').trim() }; });
  });
  $('#ri-journal')?.addEventListener('click', () => {
    ui.journalDay = r.start;
    dialog.close();
    location.hash = '#journal';
    route();
  });
}

// ---------- Fenêtre modale ----------

function openDialog(html) {
  $('#dialog-body').innerHTML = html;
  dialog.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));
  if (!dialog.open) dialog.showModal();
}

dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

// ---------- Démarrage ----------

route();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
