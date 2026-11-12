import { statsOf, makeFighter, step, ai, oppMul, ROUNDS, HEAL, ABILITY_CD } from '../web/src/battle.js';
import { draft, take, newLoad, loadMods, enemyLoad, newMeta, ITEMS, fits, handsUsed, item, describe, runsNow, spendRun, addRun, VENUES, TEMPERS, weeklyFor, weekKey, weekEnds } from '../web/src/items.js';
import { randomCreature } from '../web/src/random.js';
import { newCreature } from '../web/src/creature.js';
import { TEMPLATES } from '../web/src/templates.js';
import { rng } from '../web/src/geom.js';
const all = newMeta(); for (const it of ITEMS) all.unlocked['item:' + it.cat + ':' + it.id] = true;
const bad = {}; const note = (k, d) => { bad[k] = bad[k] || { n: 0, ex: d }; bad[k].n++; };
const finite = (o, path, seen = 0) => { for (const k in o) { const x = o[k]; if (typeof x === 'number' && !Number.isFinite(x)) note('nonfinite ' + path + '.' + k, x); else if (x && typeof x === 'object' && seen < 3) finite(x, path + '.' + k, seen + 1); } };
// 1. item table sanity
for (const it of ITEMS) { try { if (it.cat !== 'ability') { finite(it.mods(1), 'mods:' + it.id); if (/NaN|undefined/.test(it.text(1.37))) note('text ' + it.id, it.text(1.37)); } else { if (/NaN|undefined/.test(it.text(3))) note('text ' + it.id, it.text(3)); if (ABILITY_CD[it.id] !== it.cd) note('cd mismatch ' + it.id, [it.cd, ABILITY_CD[it.id]]); } } catch (e) { note('item throws ' + it.id, e.message); } }
// 2. random creatures, stripped creatures, drafts, fights
let fights = 0, longest = 0, total = 0, draws = 0;
for (let seed = 1; seed <= (+process.env.N || 1500); seed++) {
  const r = rng(seed);
  let d; try { d = randomCreature(rng(seed * 7)); } catch (e) { note('randomCreature throws', e.stack.split('\n').slice(0, 3).join(' | ')); continue; }
  if (seed % 5 === 0) d.parts = [];                                   // a bare body
  if (seed % 7 === 0) d.parts = d.parts.filter((p) => !p.kind.startsWith('eye') && !p.kind.startsWith('leg'));
  if (seed % 11 === 0) for (let i = 0; i < 40; i++) d.parts.push({ ...d.parts[i % Math.max(1, d.parts.length)] || { kind: 'arm_claw', a: 1.5, mirror: true, p: {} } });
  if (seed % 13 === 0) { d.bulk = 0.5; for (const n of d.nodes) { n.rx = 0.02; n.ry = 0.02; } }
  let s; try { s = statsOf(d); finite(s, 'stats'); } catch (e) { note('statsOf throws', e.stack.split('\n').slice(0, 3).join(' | ')); continue; }
  if (s.slots < 1 || s.slots > 8) note('slots range', s.slots);
  const load = newLoad();
  try {
    for (let k = 0; k < 14; k++) {
      const offers = draft(r, s, load, all, k % 10);
      for (const o of offers) { const it = item(o.id, o.cat); if (!it) note('offer unknown', o); else if (!fits(it, s, load)) note('offer does not fit ' + o.cat + ':' + o.id, s.slots); describe(o); }
      if (offers.length) take(load, offers[Math.floor(r() * offers.length)]);
      if (handsUsed(load) > s.slots) note('hands over', [handsUsed(load), s.slots]);
      if (load.abilities.length > s.abilitySlots) note('abilities over', load.abilities.length);
    }
  } catch (e) { note('draft throws', e.stack.split('\n').slice(0, 3).join(' | ')); }
  for (let round = 0; round < 10; round += 3) {
    try {
      const e = randomCreature(rng(seed * 31 + round)), es = statsOf(e), el = enemyLoad(rng(seed + round), es, round);
      const F = [makeFighter(s, { mods: loadMods(load), abilities: load.abilities, bonusHp: 0.2 }), makeFighter(es, { mul: oppMul(round, 0, round === 9), mods: loadMods(el, es) })];
      F.field = VENUES[Math.floor(Math.random() * VENUES.length)].field || null; F[1].temper = TEMPERS[Math.floor(Math.random() * TEMPERS.length)].id; F[0].temper = TEMPERS[Math.floor(Math.random() * TEMPERS.length)].id;
      finite(F[0], 'F0'); finite(F[1], 'F1');
      let w = -1, t = 0; const ev = [];
      while (w < 0 && t < 600) { ai(F, 0, 0.05, r, 0.5, ev); ai(F, 1, 0.05, r, 0.3, ev); w = step(F, 0.05, r, ev); t += 0.05; for (const x of ev) if (x.dmg !== undefined && !Number.isFinite(x.dmg)) note('event dmg nonfinite ' + x.type + ' ' + (x.name || ''), x); ev.length = 0; if (!Number.isFinite(F[0].hp) || !Number.isFinite(F[1].hp)) { note('hp nonfinite', [F[0].hp, F[1].hp]); break; } }
      fights++; total += t; if (t > longest) longest = t; if (w < 0) { draws++; note('fight never ends', { t, hp: [F[0].hp, F[1].hp], atk: [F[0].atk, F[1].atk], def: [F[0].def, F[1].def], regen: [F[0].m.regen, F[1].m.regen] }); }
    } catch (e) { note('fight throws', e.stack.split('\n').slice(0, 4).join(' | ')); }
  }
}
// 3. energy timer edge cases
{ const m = newMeta(); const t0 = 1e12; let r = runsNow(m, t0); if (r.n !== 5 || r.next !== 0) note('runs init', r);
  for (let i = 0; i < 5; i++) if (!spendRun(m, t0 + i)) note('spend failed', i); if (spendRun(m, t0 + 10)) note('spent a 6th run', 1);
  r = runsNow(m, t0 + 30 * 60000); if (r.n !== 1) note('one run after 30 min', r);
  r = runsNow(m, t0 + 10 * 3600000); if (r.n !== 5 || r.next !== 0) note('full after 10h', r);
  spendRun(m, t0 + 10 * 3600000); r = runsNow(m, t0 - 5000); if (r.n !== 4) note('clock back', r); r = runsNow(m, t0 - 5000 + 30 * 60000); if (r.n !== 5) note('after clock back wait', r);
  addRun(m, t0); addRun(m, t0); r = runsNow(m, t0); if (r.n > 7) note('addRun over', r); console.log('runs after 2 addRun at full:', JSON.stringify(r)); }
console.log('fights', fights, 'avg secs', (total / fights).toFixed(1), 'longest', longest.toFixed(0), 'unfinished', draws);
console.log(Object.keys(bad).length ? JSON.stringify(bad, null, 1).slice(0, 3500) : 'NO PROBLEMS FOUND');

// weekly challenge: keys are stable through a week and change on Monday (UTC)
{ const mon = Date.UTC(2026, 10, 9), k = weekKey(mon); let bad = 0; if (weekKey(mon - 1) !== k - 1 || weekKey(mon + 7 * 864e5 - 1) !== k || weekEnds(k) !== mon + 7 * 864e5) bad++; const w = weeklyFor(k); if (!w.rule || !w.venue || w.venue.id === 'sands') bad++; console.log(bad ? 'WEEKLY KEY PROBLEM' : 'weekly keys ok', new Date(weekEnds(weekKey())).toUTCString()); }
