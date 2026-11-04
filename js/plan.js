// Calendrier du régime : élimination, puis réintroduction famille par famille.
// Les dates sont des clés « AAAA-MM-JJ » en heure locale.

import { FAMILIES, REINTRO } from './data.js';

export const ELIM_DAYS = 28;
export const TEST_DAYS = 3;
export const PAUSE_DAYS = 3;
// Ordre courant : les familles les plus simples à interpréter d'abord, les fructanes en dernier.
export const ORDER = ['lactose', 'fructose', 'sorbitol', 'mannitol', 'gos', 'fructanes'];

export function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

export function diffDays(a, b) {
  const [y1, m1, d1] = a.split('-').map(Number);
  const [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 864e5);
}

export function schedule(plan) {
  const elimDays = plan.elimDays || ELIM_DAYS;
  const elimEnd = addDays(plan.start, elimDays - 1);
  let cursor = addDays(plan.start, elimDays);
  const tests = ORDER.map((fam) => {
    const pause = PAUSE_DAYS + (plan.extra?.[fam] || 0);
    const t = {
      fam,
      label: FAMILIES[fam].label,
      food: REINTRO[fam].food,
      doses: REINTRO[fam].doses,
      start: cursor,
      testEnd: addDays(cursor, TEST_DAYS - 1),
      pauseEnd: addDays(cursor, TEST_DAYS + pause - 1),
    };
    cursor = addDays(t.pauseEnd, 1);
    return t;
  });
  return { start: plan.start, elimDays, elimEnd, tests, persoStart: cursor };
}

// Où en est-on à une date donnée ?
export function dayInfo(plan, key) {
  const sc = schedule(plan);
  if (key < sc.start) return { phase: 'avant', daysLeft: diffDays(key, sc.start), sc };
  if (key <= sc.elimEnd) {
    return { phase: 'elimination', day: diffDays(sc.start, key) + 1, total: sc.elimDays, sc };
  }
  const test = sc.tests.find((t) => key >= t.start && key <= t.pauseEnd);
  if (test) {
    const n = diffDays(test.start, key);
    return n < TEST_DAYS
      ? { phase: 'reintroduction', test, testDay: n + 1, sc }
      : { phase: 'reintroduction', test, pauseDay: n - TEST_DAYS + 1, lastPauseDay: key === test.pauseEnd, sc };
  }
  return { phase: 'personnalisation', sc };
}

// Fichier .ics : étapes du programme et rappel quotidien pour remplir le journal.
export function toICS(plan) {
  const sc = schedule(plan);
  const esc = (t) => t.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
  const d = (key) => key.replace(/-/g, '');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  let n = 0;
  const allDay = (key, title, desc = '') => [
    'BEGIN:VEVENT', `UID:vt-${d(plan.start)}-${n++}@ventre-tranquille`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${d(key)}`, `DTEND;VALUE=DATE:${d(addDays(key, 1))}`,
    `SUMMARY:${esc(title)}`, desc ? `DESCRIPTION:${esc(desc)}` : '', 'END:VEVENT',
  ].filter(Boolean);

  const totalDays = diffDays(sc.start, sc.persoStart) + 1;
  const events = [
    [
      'BEGIN:VEVENT', `UID:vt-${d(plan.start)}-rappel@ventre-tranquille`, `DTSTAMP:${stamp}`,
      `DTSTART:${d(sc.start)}T200000`, `DTEND:${d(sc.start)}T201000`, `RRULE:FREQ=DAILY;COUNT=${totalDays}`,
      'SUMMARY:Ventre tranquille : remplir le journal',
      'DESCRIPTION:Repas\\, symptômes\\, selles\\, stress et sommeil.',
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Remplir le journal', 'TRIGGER:PT0M', 'END:VALARM',
      'END:VEVENT',
    ],
    allDay(sc.start, 'Début du régime : élimination', 'Pendant 4 semaines, uniquement des aliments à favoriser.'),
    allDay(addDays(sc.start, 13), 'Régime : point à mi-parcours', 'Comparer les symptômes des semaines 1 et 2.'),
    allDay(sc.elimEnd, 'Fin de l’élimination : faire le bilan', 'Les symptômes ont-ils diminué ? En parler au médecin avant la réintroduction.'),
    ...sc.tests.flatMap((t) => [
      ...t.doses.map((dose, i) => allDay(addDays(t.start, i), `Test ${t.label} ${i + 1}/3 : ${t.food}, ${dose}`,
        'Le reste des repas reste pauvre en FODMAP. Arrêter le test si les symptômes sont nets.')),
      allDay(t.pauseEnd, `Fin de pause : noter le résultat du test ${t.label}`),
    ]),
    allDay(sc.persoStart, 'Réintroduction terminée : personnalisation'),
  ];
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ventre tranquille//FR', 'CALSCALE:GREGORIAN',
    ...events.flat(), 'END:VCALENDAR'].join('\r\n');
}
