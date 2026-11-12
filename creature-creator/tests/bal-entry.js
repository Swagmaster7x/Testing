import { statsOf, makeFighter, step, ai, oppMul, OPP, ENDLESS, ROUNDS, HEAL } from '../web/src/battle.js';
import { draft, take, newLoad, loadMods, enemyLoad, newMeta, ITEMS, fits, fightPoints } from '../web/src/items.js';
import { randomCreature } from '../web/src/random.js';
import { newCreature, addPart, bodyGeometry } from '../web/src/creature.js';
import { TEMPLATES } from '../web/src/templates.js';
import { rng } from '../web/src/geom.js';
const all = newMeta(); for (const it of ITEMS) all.unlocked['item:' + it.cat + ':' + it.id] = true;
export function gauntlet(ps, seed, skillP, meta, start, tier = 0, FIGHTS = 10, endless = false, boost, slope = 1) {
  const rand = rng(seed); let hp = null, T = 0, bonus = 0, maxT = 0; const load = newLoad();
  if (start) take(load, start);
  for (let r = 0; r < (endless ? 999 : FIGHTS); r++) {
    const e = randomCreature(rng(seed * 31 + r * 7919)), es = statsOf(e);
    const F = [makeFighter(ps, { mods: loadMods(load, ps), abilities: load.abilities, bonusHp: bonus, boost }), makeFighter(es, { mul: oppMul(r * slope, tier, endless ? r % 10 === 9 : r === FIGHTS - 1, endless), mods: loadMods(enemyLoad(rng(seed + r), es, r), es) })];
    if (hp != null) F[0].hp = Math.min(F[0].max, hp);
    let w = -1, t = 0; const ev = [];
    while (w < 0 && t < 400) { ai(F, 0, 0.05, rand, skillP, ev); ai(F, 1, 0.05, rand, Math.min(0.6, 0.15 + 0.035 * r), ev); w = step(F, 0.05, rand, ev); t += 0.05; ev.length = 0; }
    T += t; if (t > maxT) maxT = t;
    if (w !== 0) return { won: r, T, maxT };
    bonus += F[0].m.killHp;
    hp = Math.max(1, F[0].hp) + F[0].max * (HEAL + F[0].m.killHeal);
    const offers = draft(rand, ps, load, meta, Math.min(r, 12));
    if (offers.length) take(load, offers.find((o) => o.syn) || offers[0]);
  }
  return { won: FIGHTS, T, maxT, champ: true };
}
const N = +process.env.N || 150;
const run = (s, start, tier) => { let c = 0, f = 0, T = 0, mx = 0, over60 = 0; for (let i = 0; i < N; i++) { const g = gauntlet(s, i + 1, 0.5, all, start, tier); if (g.won === ROUNDS) c++; f += g.won; T += g.T / (g.won + 1); if (g.maxT > 60) over60++; if (g.maxT > mx) mx = g.maxT; } return { champ: c / N * 100, won: f / N, perFight: T / N, mx, over60: over60 / N * 100 }; };
const mk = (type, extra = []) => { const d = newCreature(type); const fr = bodyGeometry(d, { sexless: true }).userData.frames; for (const k of extra) addPart(d, k, fr); return d; };
const bodies = { quad: mk('quadruped'), built: (() => { const d = mk('quadruped', ['horn_ram', 'tail_club', 'ridge_spikes', 'shell']); d.look.cover = 'scales'; return d; })(), human4: mk('humanoid', ['arm_claw', 'muzzle', 'horn_curved', 'tail_thick']), octo: mk('cephalopod', ['maw', 'horn_spike']), bird: mk('avian', ['tail_stinger', 'horn_spike']) };
if (process.env.MODE === 'types') {
  for (const t of Object.keys(TEMPLATES)) { const r = run(statsOf(newCreature(t))); console.log(t.padEnd(11), 'champ', r.champ.toFixed(0).padStart(3) + '%', 'won', r.won.toFixed(1), 'secs/fight', r.perFight.toFixed(1), 'longest', r.mx.toFixed(0), 'runs with a >60s fight', r.over60.toFixed(0) + '%'); }
  for (const [n, d] of Object.entries(bodies)) { const s = statsOf(d); const r = run(s); console.log(n.padEnd(11), 'hp', s.hp, 'atk', s.atk, 'champ', r.champ.toFixed(0).padStart(3) + '%', 'won', r.won.toFixed(1), 'secs/fight', r.perFight.toFixed(1), 'longest', r.mx.toFixed(0), '>60s', r.over60.toFixed(0) + '%'); }
  if (process.env.TIERS) for (const tier of [0, 1, 2, 3, 5, 8]) { const r = run(statsOf(bodies.built), null, tier); console.log('built tier', tier, 'champ', r.champ.toFixed(0) + '%', 'won', r.won.toFixed(1)); }
} else if (process.env.MODE !== 'levels') {
  const rows = [];
  for (const [bn, d] of Object.entries(bodies)) {
    const s = statsOf(d), base = run(s);
    for (const it of ITEMS) { if (!fits(it, s, newLoad())) continue; const r = run(s, { id: it.id, cat: it.cat, q: 1, rar: 0 }); rows.push({ body: bn, id: it.cat[0] + ':' + it.id, d: r.won - base.won, dc: r.champ - base.champ }); }
    console.log(bn, 'base won', base.won.toFixed(2), 'champ', base.champ.toFixed(0) + '%');
  }
  const by = {}; for (const r of rows) { (by[r.id] = by[r.id] || []).push(r.d); }
  const avg = Object.entries(by).map(([id, a]) => [id, a.reduce((x, y) => x + y, 0) / a.length, a.length]).sort((a, b) => b[1] - a[1]);
  console.log(avg.map(([id, d, n]) => id.padEnd(13) + (d >= 0 ? '+' : '') + d.toFixed(2) + ' (' + n + ')').join('\n'));
}

if (process.env.END) Object.assign(ENDLESS, JSON.parse(process.env.END));
if (process.env.MODE === 'levels') {
  const L = JSON.parse(process.env.LEVELS), bMax = { hp: 1.25, atk: 1.2 };
  for (const [bn, body, boost] of [['quad', bodies.quad], ['built', bodies.built], ['built+boosts', bodies.built, bMax], ['human4', bodies.human4]]) {
    const s = statsOf(body); let line = bn.padEnd(13);
    for (const [fights, tier, slope] of L) { let c = 0, w = 0; for (let i = 0; i < N; i++) { const g = gauntlet(s, i + 1, 0.5, all, null, tier, fights, false, boost, slope); if (g.champ) c++; w += g.won; } line += (fights + 'f/t' + tier + ' ' + (c / N * 100).toFixed(0) + '%').padEnd(13); }
    console.log(line);
  }
  for (const [bn, body, boost] of [['quad', bodies.quad], ['built', bodies.built], ['built+boosts', bodies.built, bMax]]) { const s = statsOf(body); const a = []; for (let i = 0; i < N; i++) a.push(gauntlet(s, i + 1, 0.5, all, null, 0, 10, true, boost, ENDLESS.slope).won); a.sort((x, y) => x - y); console.log('endless', bn.padEnd(13), 'median', a[N >> 1], 'p90', a[Math.floor(N * 0.9)], 'max', a[N - 1]); }
}
