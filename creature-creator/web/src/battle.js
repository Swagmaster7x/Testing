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
const END = { claw: 4, talon: 4, pincer: 6, paw: 2.5, hoof: 3, human: 1.5, point: 2.5, webbed: 2, stump: 2.5, mitt: 1.5, none: 0 };
const STACK = [1, 0.6, 0.4, 0.3, 0.2, 0.15];
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

export function statsOf(d) {
  let vol = 0;
  for (let i = 0; i < d.nodes.length - 1; i++) {
    const a = d.nodes[i], b = d.nodes[i + 1];
    vol += Math.hypot(a.y - b.y, a.z - b.z) * Math.PI * ((a.rx + b.rx) / 2) * ((a.ry + b.ry) / 2);
  }
  const m = Math.cbrt(vol * d.bulk * d.bulk);                 // rough "how big is it": about 0.3 small, 0.6 large
  const parts = d.parts.filter((p) => !p.sexOnly || p.sexOnly === d.sex);
  const paired = (p) => (p.mirror && Math.abs(Math.sin(p.a)) > 0.1 ? 1.25 : 1);
  const hits = [];
  let legs = 0, wings = 0, eyes = 0, thorns = 0, venom = 0, armour = 0, hpBonus = 0;
  for (const p of parts) {
    const k = p.kind;
    if (WEAPON[k]) hits.push(WEAPON[k](p.p) * paired(p));
    if (p.p.endType !== undefined || k.startsWith('leg_') || k.startsWith('arm_')) hits.push((END[p.p.endType] ?? 2) * paired(p));
    if (k.startsWith('leg_')) legs++;
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
  hits.forEach((x, i) => { atk += x * (STACK[i] ?? 0.1); });
  atk *= 0.75 + 0.6 * m;
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
export function oppMul(round) {
  const boss = round === ROUNDS - 1 ? 1.3 : 1;          // the last fight is against the reigning champion
  return { hp: (0.42 + 0.06 * round) * boss, atk: (0.5 + 0.055 * round) * (boss > 1 ? 1.12 : 1) };
}

export function makeFighter(s, mul = { hp: 1, atk: 1 }) {
  const max = Math.round(s.hp * mul.hp);
  return { s, max, hp: max, atk: s.atk * mul.atk, every: 1.75 / s.spd, t: 0.9 + 0.5 / s.spd, power: false, powerCd: 2, guard: 0, guardCd: 0, poison: 0, poisonDps: 0, tick: 0 };
}
export function usePower(f) { if (f.powerCd > 0 || f.hp <= 0) return false; f.power = true; f.powerCd = 7; return true; }
export function useGuard(f) { if (f.guardCd > 0 || f.hp <= 0) return false; f.guard = 0.9; f.guardCd = 4.5; return true; }

/** Simple opponent brain. skill 0..1 is how often it blocks in time. */
export function ai(f, o, dt, rand, skill) {
  if (f.powerCd <= 0 && rand() < dt * 0.6) usePower(f);
  if (f.guardCd <= 0 && o.t < 0.3 && rand() < dt * 8 * skill) useGuard(f);
}

/** Advance the fight. Pushes what happened into `events`; returns the winner's index, or -1. */
export function step(F, dt, rand, events) {
  for (let i = 0; i < 2; i++) {
    const f = F[i], o = F[1 - i];
    if (f.hp <= 0 || o.hp <= 0) continue;
    f.powerCd = Math.max(0, f.powerCd - dt); f.guardCd = Math.max(0, f.guardCd - dt); f.guard = Math.max(0, f.guard - dt);
    if (f.poison > 0) {
      f.poison -= dt; f.tick += dt;
      if (f.tick >= 1) { f.tick -= 1; f.hp -= f.poisonDps; events.push({ type: 'poison', on: i, dmg: f.poisonDps }); }
    }
    f.t -= dt;
    if (f.t > 0 || f.hp <= 0) continue;
    f.t = f.every * (0.9 + 0.2 * rand());
    const ev = { type: 'hit', by: i, power: f.power, dmg: 0 };
    if (rand() < (f.s.miss + o.s.dodge) * (f.power ? 0.5 : 1)) ev.miss = true;
    else {
      let dmg = f.atk * (0.85 + 0.3 * rand()) * (1 - o.s.def);
      if (f.power) dmg *= 2.1;
      if (rand() < f.s.crit) { dmg *= 1.6; ev.crit = true; }
      if (o.guard > 0) { dmg *= 0.2; ev.blocked = true; o.guard = 0; f.t += 0.6; }
      else {
        if (o.s.thorns) { ev.thorns = Math.max(1, Math.round(dmg * o.s.thorns)); f.hp -= ev.thorns; }
        if (f.s.venom && rand() < 0.35) { o.poison = 4; o.poisonDps = f.s.venom; ev.venom = true; }
      }
      ev.dmg = Math.max(1, Math.round(dmg)); o.hp -= ev.dmg;
    }
    f.power = false;
    events.push(ev);
  }
  if (F[0].hp <= 0 && F[1].hp <= 0) F[0].hp = 1;       // a double knock-out goes to the challenger
  return F[1].hp <= 0 ? 0 : F[0].hp <= 0 ? 1 : -1;
}

export function championPoints(hp, max) { return 1000 + Math.round(500 * clamp(hp / max, 0, 1)); }
