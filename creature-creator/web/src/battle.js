// Fight rules. Pure maths, no graphics, so the same code runs the arena and the balance tests.
// A creature's stats come from how it is built: size gives health, teeth, claws and horns give
// attack, hide and plating give armour, legs and wings give speed.
export const ROUNDS = 10;
export const HEAL = 0.4;            // share of full health restored between fights

const WEAPON = {
  muzzle: (p) => 5 + 2.5 * (p.teeth ?? 1), beak: (p) => 6 + 1.5 * (p.hook ?? 0.5), mandibles: () => 7, maw: (p) => 4 + 2.5 * (p.teeth ?? 1),
  trunk: () => 3, feelers: () => 2, lips: () => 1, tusk: () => 5, horn_spike: () => 4, horn_curved: () => 5, horn_ram: () => 6, antler: () => 5,
  tentacle: () => 3, tail_club: () => 7, tail_stinger: () => 5, tail_thick: () => 3, spike: () => 2,
};
const END = { claw: 4, talon: 4, pincer: 6, paw: 2.5, hoof: 3, human: 3, point: 2.5, webbed: 2, stump: 2.5, mitt: 1.5, none: 0 };
const STACK = [1, 0.6, 0.4, 0.3, 0.2, 0.15];
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

export function statsOf(d) {
  let vol = 0;
  for (let i = 0; i < d.nodes.length - 1; i++) {
    const a = d.nodes[i], b = d.nodes[i + 1];
    vol += Math.hypot(a.y - b.y, a.z - b.z) * Math.PI * ((a.rx + b.rx) / 2) * ((a.ry + b.ry) / 2);
  }
  const m = Math.min(Math.cbrt(vol * d.bulk * d.bulk), 0.9);                 // rough "how big is it": about 0.3 small, 0.6 large
  const parts = d.parts.filter((p) => !p.sexOnly || p.sexOnly === d.sex);
  const paired = (p) => (p.mirror && Math.abs(Math.sin(p.a)) > 0.1 ? 1.25 : 1);
  const hits = [];
  let legs = 0, wings = 0, eyes = 0, thorns = 0, venom = 0, armour = 0, hpBonus = 0;
  let hands = 0, legCount = 0, tail = false, horns = false, mouth = false, claws = false, tentacles = 0;
  for (const p of parts) {
    const k = p.kind;
    if (WEAPON[k]) hits.push(WEAPON[k](p.p) * paired(p));
    if (p.p.endType !== undefined || k.startsWith('leg_') || k.startsWith('arm_')) hits.push((END[p.p.endType] ?? 2) * paired(p));
    const cnt = paired(p) > 1 ? 2 : 1;
    if (k.startsWith('leg_')) { legs++; legCount += cnt; }
    if (k.startsWith('arm_')) hands += cnt;
    if (k === 'tentacle') { hands += cnt; tentacles += cnt; }
    if (k.startsWith('tail_')) tail = true;
    if (k.startsWith('horn_') || k === 'antler' || k === 'tusk') horns = true;
    if (['muzzle', 'beak', 'mandibles', 'maw', 'trunk', 'feelers', 'lips'].includes(k)) mouth = true;
    if (['claw', 'talon', 'paw', 'pincer'].includes(p.p.endType)) claws = true;
    if (k === 'feelers') venom += 1;
    if (k.startsWith('wing_')) wings++;
    if (k.startsWith('eye_')) eyes += paired(p) > 1 ? 2 : 1;
    if (k === 'ridge_spikes') thorns += 0.12;
    if (k === 'spike') thorns += 0.04;
    if (k === 'tail_stinger') venom += 3;
    if (k === 'mandibles') venom += 1;
    if (k === 'shell') { armour += 0.15; hpBonus += 25; }
    if (k === 'ridge_plates') { armour += 0.08; hpBonus += 10; }
  }
  hits.sort((a, b) => b - a);
  let atk = 7;
  hits.forEach((x, i) => { atk += x * (STACK[i] ?? (i < 10 ? 0.06 : 0)); });
  hpBonus = Math.min(hpBonus, 60); venom = Math.min(venom, 6);
  atk *= 0.82 + 0.42 * m;
  armour += { scales: 0.08, chitin: 0.12, fur: 0.02 + 0.05 * d.look.furLen, slime: 0.02, skin: 0 }[d.look.cover] ?? 0;
  let spd = legs === 0 ? 0.9 : legs === 1 ? 1 : legs === 2 ? 1.08 : 1.14;
  if (wings) spd += 0.12;
  spd -= 0.3 * (m - 0.45);
  if (armour > 0.2) spd -= 0.06;
  spd = clamp(spd, 0.6, 1.5);
  return {
    hp: Math.round(80 + 210 * m + hpBonus * 1.5), atk: Math.round(atk * 10) / 10, def: clamp(armour, 0, 0.45), spd: Math.round(spd * 100) / 100,
    dodge: clamp(0.04 + (spd - 1) * 0.2 + (d.look.cover === 'slime' ? 0.05 : 0) + (wings ? 0.03 : 0), 0, 0.3),
    crit: clamp(0.04 + 0.02 * eyes, 0.04, 0.16), miss: eyes === 0 ? 0.25 : 0.04,
    thorns: clamp(thorns, 0, 0.3), venom, wings: wings > 0, eyes,
    // What the body can do with rewards: weapons need hands, many abilities and relics need the right parts.
    hands: Math.min(hands, 8), slots: Math.min(hands, 8) || 1, abilitySlots: d.type === 'humanoid' ? 3 : 2, legs: legCount, tail, horns, mouth, claws, tentacles,
    armoured: armour >= 0.12, big: m > 0.56, small: m < 0.42, serpent: d.type === 'serpent', type: d.type,
  };
}

export function traits(s) {
  const t = [];
  if (s.venom) t.push('Venom');
  if (s.thorns > 0) t.push('Spiny');
  if (s.def >= 0.15) t.push('Armoured');
  if (s.wings) t.push('Winged');
  if (s.spd >= 1.12) t.push('Quick');
  if (s.eyes === 0) t.push('Blind');
  else if (s.crit >= 0.12) t.push('Keen-eyed');
  return t;
}

/** How much tougher than its natural stats the opponent in fight `round` (0-based) is. */
export function oppMul(round, tier = 0) {
  const boss = round === ROUNDS - 1 ? 1.3 : 1;          // the last fight is against the reigning champion
  // tier: the Colosseum's difficulty rank; each rank makes every opponent tougher.
  return { hp: (OPP.hp0 + OPP.hp1 * round) * boss * (1 + 0.1 * tier), atk: (OPP.atk0 + OPP.atk1 * round) * (boss > 1 ? 1.12 : 1) * (1 + 0.07 * tier) };
}
export const OPP = { hp0: 0.34, hp1: 0.093, atk0: 0.4, atk1: 0.086 };   // tuned with simulated gauntlets, rewards included

const MODS = ['hpP', 'atkP', 'atkF', 'spdP', 'crit', 'critD', 'dodge', 'def', 'pierce', 'lifesteal', 'thorns', 'regen', 'bleedC', 'poisonC', 'poisonD', 'burnC', 'stunC', 'stunDur', 'dbl', 'ramp', 'lowP', 'firstX',
  'giantP', 'vsBleedP', 'perStatusCrit', 'perStatusDmg', 'critBleed', 'critCdr', 'execP', 'riposte', 'blockHeal', 'killHeal', 'killHp', 'secondWind', 'hemo', 'festerP', 'shieldP', 'opener', 'guardCdr', 'perWeaponSpd',
  'perLegAtk', 'perEyeCrit', 'thornsBleed', 'dodgeCrit', 'weapons'];

/**
 * s: the body's stats. o.mods: summed item mods. o.mul: opponent scaling. o.abilities: [{id, lvl}].
 * o.bonusHp: extra health carried through the gauntlet. o.boost: { hp, atk } shop multipliers.
 */
export function makeFighter(s, o = {}) {
  const m = {}; for (const k of MODS) m[k] = (o.mods && o.mods[k]) || 0;
  const mul = o.mul || { hp: 1, atk: 1 }, boost = o.boost || { hp: 1, atk: 1 };
  const max = Math.round(s.hp * (1 + m.hpP) * mul.hp * boost.hp * (1 + (o.bonusHp || 0)));
  const spd = clamp(s.spd * (1 + m.spdP + m.perWeaponSpd * m.weapons), 0.5, 2.4);
  return {
    s, m, max, hp: max, shield: Math.round(max * m.shieldP),
    atk: (s.atk + m.atkF) * (1 + m.atkP + m.perLegAtk * s.legs) * mul.atk * boost.atk,
    crit: s.crit + m.crit + m.perEyeCrit * s.eyes, dodge: clamp(s.dodge + m.dodge, 0, 0.45), def: clamp(s.def + m.def, 0, 0.6), thorns: s.thorns + m.thorns,
    poisonC: (s.venom ? 0.35 : 0) + m.poisonC, poisonD: Math.max(s.venom, m.poisonC > 0 ? 2 : 0) + m.poisonD,
    every: 1.75 / spd, t: 0.9 + 0.5 / spd, power: false, powerCd: 2, guard: 0, guardCd: 0, guardEvery: Math.max(2.5, 4.5 - m.guardCdr),
    st: { bleed: 0, bleedT: 0, bleedD: 1, poison: 0, poisonD: 0, burn: 0, burnD: 0, stun: 0, immune: 0, weak: 0, slow: 0, blind: 0 },
    buff: { evade: 0, shell: 0, frenzy: 0 }, tick: 0, fury: 0, first: true, wind: m.secondWind > 0, nextCrit: false, opened: !(m.opener > 0),
    abil: (o.abilities || []).map((a) => ({ id: a.id, lvl: Math.min(a.lvl, 5), cd: 3 })),
  };
}
export function usePower(f) { if (f.powerCd > 0 || f.hp <= 0) return false; f.power = true; f.powerCd = 7; return true; }
export function useGuard(f) { if (f.guardCd > 0 || f.hp <= 0) return false; f.guard = 0.9; f.guardCd = f.guardEvery; return true; }

function hurt(o, x) { if (o.shield > 0) { const a = Math.min(o.shield, x); o.shield -= a; x -= a; } o.hp -= x; }
function heal(f, x) { f.hp = Math.min(f.max, f.hp + x); }
function addBleed(o, n, by) { o.st.bleed = Math.min(12, o.st.bleed + n); o.st.bleedT = 5; o.st.bleedD = Math.max(1, by.atk * 0.08) * (1 + by.m.festerP); }
function stun(o, dur) { if (o.st.immune > 0) return false; o.st.stun = dur; o.st.immune = dur + 3; return true; }
/** Apply a timed ailment without weakening one that is already running. */
function afflict(st, key, dur, dps) { st[key + 'D'] = st[key] > 0 ? Math.max(st[key + 'D'], dps) : dps; st[key] = Math.max(st[key], dur); }
const ailments = (o) => (o.st.bleed > 0) + (o.st.poison > 0) + (o.st.burn > 0) + (o.st.stun > 0);

/** One blow from F[i] on the other fighter, with every on-hit effect. Returns the event. */
function blow(F, i, mult, rand, opt = {}) {
  const f = F[i], o = F[1 - i], m = f.m, om = o.m, ev = { type: 'hit', by: i, dmg: 0, power: !!opt.power, name: opt.name };
  if (!opt.sure && rand() < (f.s.miss + (f.st.blind > 0 ? 0.6 : 0)) * (opt.power ? 0.5 : 1)) { ev.miss = true; return ev; }
  if (!opt.sure && (o.buff.evade > 0 || rand() < o.dodge)) {
    if (om.dodgeCrit) o.nextCrit = true;          // Updraft: a real dodge sets up a critical hit
    ev.miss = true; return ev;
  }
  const ail = ailments(o);
  // Long fights turn frantic: after 40 seconds every blow lands harder, so nothing drags on.
  let dmg = f.atk * mult * (0.85 + 0.3 * rand()) * (1 + Math.max(0, (F.time || 0) - 40) * 0.05);
  let bonus = 1 + f.fury * m.ramp + (f.hp < f.max * 0.4 ? m.lowP : 0) + (o.st.bleed > 0 ? m.vsBleedP : 0) + ail * m.perStatusDmg + (o.max > f.max ? m.giantP : 0) + (o.hp < o.max * 0.3 ? m.execP : 0);
  if (f.first && opt.name !== 'Sling') { bonus += m.firstX; f.first = false; }
  dmg *= bonus * (f.st.weak > 0 ? 0.7 : 1) * (f.st.burn > 0 ? 0.9 : 1);
  if (f.nextCrit || rand() < f.crit + ail * m.perStatusCrit) {
    dmg *= 1.8 + m.critD; ev.crit = true; f.nextCrit = false;
    if (m.critBleed) addBleed(o, m.critBleed, f);
    if (m.critCdr) for (const a of f.abil) a.cd = Math.max(0, a.cd - m.critCdr);
  }
  dmg *= (1 - Math.max(0, o.def - m.pierce)) * (o.buff.shell > 0 ? 0.3 : 1);
  if (o.guard > 0) {
    dmg *= 0.2; ev.blocked = true; o.guard = 0; f.t += 0.6;
    if (om.riposte) { ev.riposte = Math.max(1, Math.round(o.atk * om.riposte)); hurt(f, ev.riposte); }
    if (om.blockHeal) heal(o, o.max * om.blockHeal);
  } else {
    if (o.thorns > 0 && !opt.ranged) { ev.thorns = Math.max(1, Math.round(dmg * o.thorns * (o.buff.shell > 0 ? 2 : 1))); hurt(f, ev.thorns); if (om.thornsBleed) addBleed(f, 1, o); }
    if (rand() < m.bleedC) { addBleed(o, 1, f); ev.bleed = true; }
    if (rand() < f.poisonC) { afflict(o.st, 'poison', 5, (f.poisonD + f.atk * 0.12) * (1 + m.festerP)); ev.venom = true; }
    if (rand() < m.burnC) { afflict(o.st, 'burn', 3, Math.max(1, dmg * 0.14) * (1 + m.festerP)); ev.burn = true; }
    if (rand() < m.stunC && stun(o, 0.7 * (1 + m.stunDur))) ev.stun = true;
    if (m.lifesteal) heal(f, dmg * m.lifesteal);
  }
  ev.dmg = Math.max(1, Math.round(dmg)); hurt(o, ev.dmg); f.fury++;
  return ev;
}

/** Fire ability slot k of fighter i. Returns true if it went off. */
export function useAbility(F, i, k, rand, events) {
  const f = F[i], o = F[1 - i], a = f.abil[k];
  if (!a || a.cd > 0 || f.hp <= 0 || o.hp <= 0 || f.st.stun > 0) return false;
  const L = a.lvl, say = (text) => events.push({ type: 'cast', by: i, name: text });
  const strike = (mult, name, opt) => { const ev = blow(F, i, mult, rand, { name, ...opt }); ev.ability = true; events.push(ev); return ev; };
  switch (a.id) {
    case 'pounce': { const ev = strike(1.4 + 0.3 * L, 'Pounce'); if (!ev.miss && !ev.blocked) stun(o, 0.8); break; }
    case 'roar': o.st.weak = 4 + L; say('Roar'); break;
    case 'lick': heal(f, f.max * (0.11 + 0.04 * L)); events.push({ type: 'heal', on: i, name: 'Lick Wounds' }); break;
    case 'spit': afflict(o.st, 'poison', 6, (f.atk * (0.22 + 0.08 * L) + f.m.poisonD) * (1 + f.m.festerP)); say('Venom Spit'); break;
    case 'dive': f.buff.evade = 1.5 + 0.5 * L; f.nextCrit = true; say('Dive'); break;
    case 'constrict': { const ev = strike(0.8 + 0.3 * L, 'Constrict', { sure: true }); if (!ev.blocked) stun(o, (1.3 + 0.3 * L) * (1 + f.m.stunDur)); break; }
    case 'web': o.st.slow = 4 + L; say('Web'); break;
    case 'ink': o.st.blind = 3 + L; say('Ink Cloud'); break;
    case 'shellup': f.buff.shell = 3 + L; say('Shell Up'); break;
    case 'sweep': { const ev = strike(1 + 0.25 * L, 'Tail Sweep'); if (!ev.miss) o.t += 1.2; break; }
    case 'gore': { const ev = strike(1.2 + 0.2 * L, 'Gore'); if (!ev.miss && !ev.blocked) addBleed(o, 2 + L, f); break; }
    case 'frenzy': f.buff.frenzy = 4; f.frenzyX = 1.5 + 0.2 * L; say('Frenzy'); break;
    case 'hurl': strike(1.6 + 0.3 * L, 'Hurl', { sure: true, ranged: true }); break;
    case 'rend': strike(0.6 + (0.35 + 0.1 * L) * o.st.bleed, 'Rend'); break;
    case 'breath': { const ev = strike(0.8 + 0.2 * L, 'Fire Breath', { sure: true, ranged: true }); afflict(o.st, 'burn', 5, Math.max(2, ev.dmg * 0.2) * (1 + f.m.festerP)); break; }
    default: return false;
  }
  a.cd = ABILITY_CD[a.id] || 10;
  return true;
}
export const ABILITY_CD = { pounce: 9, roar: 12, lick: 14, spit: 10, dive: 11, constrict: 12, web: 12, ink: 12, shellup: 13, sweep: 8, gore: 10, frenzy: 13, hurl: 10, rend: 9, breath: 11 };

/** Simple brain for whoever is not being played. skill 0..1 is how often it blocks in time. */
export function ai(F, i, dt, rand, skill, events) {
  const f = F[i], o = F[1 - i];
  if (f.powerCd <= 0 && rand() < dt * 0.6) usePower(f);
  if (f.guardCd <= 0 && o.t < 0.3 && rand() < dt * 8 * skill) useGuard(f);
  for (let k = 0; k < f.abil.length; k++) if (f.abil[k].cd <= 0 && rand() < dt * 1.2 && !(f.abil[k].id === 'lick' && f.hp > f.max * 0.75) && !(f.abil[k].id === 'rend' && o.st.bleed < 2)) useAbility(F, i, k, rand, events);
}

/** Advance the fight. Pushes what happened into `events`; returns the winner's index, or -1. */
export function step(F, dt, rand, events) {
  F.time = (F.time || 0) + dt;
  for (let i = 0; i < 2; i++) {
    const f = F[i], o = F[1 - i], st = f.st;
    if (f.hp <= 0 || o.hp <= 0) continue;
    if (!f.opened) { f.opened = true; const ev = blow(F, i, f.m.opener, rand, { sure: true, ranged: true, name: 'Sling' }); ev.ability = true; events.push(ev); }
    f.powerCd = Math.max(0, f.powerCd - dt); f.guardCd = Math.max(0, f.guardCd - dt); f.guard = Math.max(0, f.guard - dt);
    for (const a of f.abil) a.cd = Math.max(0, a.cd - dt);
    for (const k of ['stun', 'immune', 'weak', 'slow', 'blind', 'poison', 'burn']) st[k] = Math.max(0, st[k] - dt);
    for (const k of ['evade', 'shell', 'frenzy']) f.buff[k] = Math.max(0, f.buff[k] - dt);
    if (st.bleed > 0) { st.bleedT -= dt; if (st.bleedT <= 0) st.bleed = 0; }
    if (f.m.regen) heal(f, f.max * f.m.regen * dt);
    f.tick += dt;
    if (f.tick >= 1) {
      f.tick -= 1;
      let d = 0;
      if (st.bleed > 0) { d += st.bleed * st.bleedD; if (o.m.hemo) heal(o, o.m.hemo * st.bleed); }
      if (st.poison > 0) d += st.poisonD;
      if (st.burn > 0) d += st.burnD;
      if (d > 0) { d = Math.max(1, Math.round(d)); f.hp -= d; events.push({ type: 'dot', on: i, dmg: d, kind: st.burn > 0 ? 'burn' : st.poison > 0 ? 'venom' : 'bleed' }); }
    }
    if (st.stun > 0) continue;
    f.t -= dt * (f.buff.frenzy > 0 ? f.frenzyX : 1) * (st.slow > 0 ? 0.5 : 1);
    if (f.t > 0 || f.hp <= 0) continue;
    f.t = f.every * (0.9 + 0.2 * rand());
    const power = f.power; f.power = false;
    events.push(blow(F, i, power ? 2.1 : 1, rand, { power }));
    if (o.hp > 0 && f.hp > 0 && rand() < f.m.dbl) { const ev = blow(F, i, 0.7, rand, {}); ev.extra = true; events.push(ev); }
  }
  for (let i = 0; i < 2; i++) {                       // Second Wind: cheat death once per fight
    const f = F[i];
    if (f.hp <= 0 && f.wind) { f.wind = false; f.hp = Math.max(1, Math.round(f.max * f.m.secondWind)); events.push({ type: 'heal', on: i, name: 'Second Wind' }); }
  }
  if (F[0].hp <= 0 && F[1].hp <= 0) F[0].hp = 1;       // a double knock-out goes to the challenger
  return F[1].hp <= 0 ? 0 : F[0].hp <= 0 ? 1 : -1;
}

export function championPoints(hp, max) { return 1000 + Math.round(500 * clamp(hp / max, 0, 1)); }
