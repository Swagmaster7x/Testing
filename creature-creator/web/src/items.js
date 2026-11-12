// Run rewards (weapons, relics, abilities), the draft that offers them, and the shop.
// Pure data and maths, no graphics.
//
// Every item adds numbers to a "mod bag" that battle.js reads. Tags say what an item plays
// well with; the draft leans toward tags you already hold, so builds come together.
const pct = (x) => Math.round(x * 100) + '%';
const n1 = (x) => (Math.round(x * 10) / 10).toString();

// [id, name, icon, tags, shop cost (0 = available from the start), requirement, mods(q), text(q), hands]
const W = (id, name, icon, tags, cost, mods, text, hands = 1, req) => ({ id, name, icon, tags, cost, mods, text, hands, req, cat: 'weapon' });
const R = (id, name, icon, tags, cost, mods, text, req, reqText) => ({ id, name, icon, tags, cost, mods, text, req, reqText, cat: 'relic' });
const A = (id, name, icon, tags, cost, cd, text, req, reqText) => ({ id, name, icon, tags, cost, cd, text, req, reqText, cat: 'ability' });

export const ITEMS = [
  // ---- weapons: one per hand
  W('club', 'Bone Club', '🦴', ['stun', 'fury'], 0, (q) => ({ atkF: 3.5 * q, stunC: 0.07 * q }), (q) => `+${n1(3.5 * q)} attack. ${pct(0.07 * q)} chance to stun.`),
  W('cleaver', 'Notched Cleaver', '🪓', ['bleed'], 0, (q) => ({ atkF: 3 * q, bleedC: 0.4 * q }), (q) => `+${n1(3 * q)} attack. ${pct(0.4 * q)} chance to cause bleeding.`),
  W('fang', 'Fang Dagger', '🗡️', ['poison', 'speed'], 0, (q) => ({ atkF: 2 * q, poisonC: 0.35 * q, spdP: 0.06 * q }), (q) => `+${n1(2 * q)} attack, +${pct(0.06 * q)} speed. ${pct(0.35 * q)} chance to poison.`),
  W('mace', 'Thorn Mace', '🌵', ['thorns'], 0, (q) => ({ atkF: 2 * q, thorns: 0.08 * q }), (q) => `+${n1(2 * q)} attack. Attackers take ${pct(0.08 * q)} of their damage back.`),
  W('buckler', 'Spiked Buckler', '🛡️', ['guard', 'thorns'], 0, (q) => ({ def: 0.05 * q, riposte: 0.4 * q, guardCdr: 0.5 }), (q) => `+${pct(0.05 * q)} armour. Guard recharges faster and a block hits back for ${pct(0.4 * q)} attack.`),
  W('sling', 'Stone Sling', '🪨', ['crit'], 0, (q) => ({ opener: 0.9 * q, crit: 0.06 * q }), (q) => `Opens each fight with a shot for ${pct(0.9 * q)} attack. +${pct(0.06 * q)} critical chance.`),
  W('brand', 'Ember Brand', '🔥', ['burn'], 250, (q) => ({ atkF: 2 * q, burnC: 0.3 * q }), (q) => `+${n1(2 * q)} attack. ${pct(0.3 * q)} chance to set the enemy on fire.`),
  W('pick', 'War Pick', '⛏️', ['crit'], 250, (q) => ({ atkF: 2.5 * q, pierce: 0.2 * q }), (q) => `+${n1(2.5 * q)} attack. Ignores ${pct(0.2 * q)} armour.`),
  W('hooks', 'Twin Hooks', '🪝', ['speed'], 300, (q) => ({ atkF: 2 * q, dbl: 0.15 * q }), (q) => `+${n1(2 * q)} attack. ${pct(0.15 * q)} chance to strike twice.`),
  W('whip', 'Leech Whip', '🩸', ['life'], 350, (q) => ({ atkF: 1.5 * q, lifesteal: 0.08 * q }), (q) => `+${n1(1.5 * q)} attack. Heals for ${pct(0.08 * q)} of damage dealt.`),
  W('maul', 'Great Maul', '🔨', ['stun', 'fury'], 400, (q) => ({ atkF: 7 * q, spdP: -0.1, stunC: 0.08 * q }), (q) => `Needs two hands. +${n1(7 * q)} attack, -10% speed. ${pct(0.08 * q)} chance to stun.`, 2),
  W('trident', 'Barbed Trident', '🔱', ['bleed', 'crit'], 450, (q) => ({ atkF: 3.5 * q, vsBleedP: 0.2 * q, critD: 0.3 * q, bleedC: 0.15 * q }), (q) => `+${n1(3.5 * q)} attack. ${pct(0.15 * q)} chance to cause bleeding, +${pct(0.2 * q)} damage to bleeding enemies, +${pct(0.3 * q)} critical damage.`),

  // ---- relics: passive, stack without limit
  R('hide', 'Thick Hide', '🐘', ['life'], 0, (q) => ({ hpP: 0.12 * q }), (q) => `+${pct(0.12 * q)} health.`),
  R('tooth', 'Whetted Tooth', '🦷', ['fury'], 0, (q) => ({ atkP: 0.12 * q }), (q) => `+${pct(0.12 * q)} attack.`),
  R('blood', 'Quick Blood', '💨', ['speed'], 0, (q) => ({ spdP: 0.1 * q }), (q) => `+${pct(0.1 * q)} speed.`),
  R('eye', "Hunter's Eye", '👁️', ['crit'], 0, (q) => ({ crit: 0.12 * q }), (q) => `+${pct(0.12 * q)} critical chance.`),
  R('edge', 'Cruel Edge', '✂️', ['crit'], 0, (q) => ({ critD: 0.5 * q, crit: 0.03 }), (q) => `+${pct(0.5 * q)} critical damage and +3% critical chance.`),
  R('slick', 'Slick Skin', '💧', ['speed'], 0, (q) => ({ dodge: 0.08 * q }), (q) => `+${pct(0.08 * q)} dodge.`),
  R('plate', 'Iron Scales', '🔩', ['guard'], 0, (q) => ({ def: 0.06 * q }), (q) => `+${pct(0.06 * q)} armour.`),
  R('jag', 'Jagged Claws', '🩸', ['bleed'], 0, (q) => ({ bleedC: 0.3 * q }), (q) => `${pct(0.3 * q)} chance on hit to cause bleeding.`),
  R('rot', 'Rot Gland', '☣️', ['poison'], 0, (q) => ({ poisonC: 0.3 * q, poisonD: 1.5 * q }), (q) => `${pct(0.3 * q)} chance on hit to poison. Poison is stronger.`),
  R('gut', 'Ember Gut', '🌋', ['burn'], 200, (q) => ({ burnC: 0.2 * q }), (q) => `${pct(0.2 * q)} chance on hit to set the enemy on fire.`),
  R('scent', 'Blood Scent', '🐺', ['bleed', 'fury'], 0, (q) => ({ vsBleedP: 0.3 * q, bleedC: 0.1 }), (q) => `+${pct(0.3 * q)} damage to bleeding enemies, and 10% chance to cause bleeding.`),
  R('torment', 'Tormentor', '😈', ['bleed', 'poison', 'burn'], 400, (q) => ({ perStatusDmg: 0.14 * q }), (q) => `+${pct(0.14 * q)} damage for each ailment on the enemy (bleed, poison, fire, stun).`),
  R('opp', 'Opportunist', '🎯', ['crit', 'bleed', 'poison', 'burn'], 300, (q) => ({ perStatusCrit: 0.12 * q }), (q) => `+${pct(0.12 * q)} critical chance for each ailment on the enemy.`),
  R('fester', 'Festering', '🦠', ['poison', 'burn', 'bleed'], 0, (q) => ({ festerP: 0.5 * q }), (q) => `Bleed, poison and fire deal ${pct(0.5 * q)} more.`),
  R('hemo', 'Hemophage', '🦇', ['bleed', 'life'], 350, (q) => ({ hemo: 1.2 * q }), (q) => `Heal ${n1(1.2 * q)} for each bleed stack on the enemy, every second.`),
  R('mist', 'Red Mist', '🌫️', ['crit', 'bleed'], 350, (q) => ({ critBleed: Math.max(1, Math.round(q)) }), (q) => `Critical hits add ${Math.max(1, Math.round(q))} bleed.`),
  R('rhythm', "Predator's Rhythm", '⏱️', ['crit', 'ability'], 0, (q) => ({ critCdr: 1.0 * q, crit: 0.05 }), (q) => `+5% critical chance. Critical hits cut ability cooldowns by ${n1(1.0 * q)}s.`),
  R('finish', 'Finisher', '💀', ['crit', 'fury'], 0, (q) => ({ execP: 0.4 * q }), (q) => `+${pct(0.4 * q)} damage to enemies below 30% health.`),
  R('flurry', 'Flurry', '🌀', ['speed'], 0, (q) => ({ dbl: 0.13 * q }), (q) => `${pct(0.13 * q)} chance to strike twice.`),
  R('moment', 'Momentum', '📈', ['speed', 'fury'], 0, (q) => ({ ramp: 0.025 * q }), (q) => `Each hit you land adds +${n1(2.5 * q)}% damage for the rest of the fight.`),
  R('riposte', 'Riposte', '🤺', ['guard'], 0, (q) => ({ riposte: 0.5 * q }), (q) => `A block hits back for ${pct(0.5 * q)} attack.`),
  R('bulwark', 'Bulwark', '🧱', ['guard', 'life'], 0, (q) => ({ blockHeal: 0.05 * q }), (q) => `A block heals ${pct(0.05 * q)} health.`),
  R('spite', 'Spite', '🦔', ['thorns'], 0, (q) => ({ thorns: 0.08 * q }), (q) => `Attackers take ${pct(0.08 * q)} of their damage back.`),
  R('barbs', 'Barbed Hide', '🪡', ['thorns', 'bleed'], 300, (q) => ({ thornsBleed: 1, thorns: 0.04 * q }), (q) => `Attackers take ${pct(0.04 * q)} back and start bleeding.`),
  R('leech', 'Leech', '🪱', ['life'], 0, (q) => ({ lifesteal: 0.06 * q }), (q) => `Heal for ${pct(0.06 * q)} of damage dealt.`),
  R('trophy', 'Trophy Hunter', '🏆', ['life'], 0, (q) => ({ killHp: 0.04 * q }), (q) => `Each kill adds +${pct(0.04 * q)} health for the rest of the gauntlet.`),
  R('feast', 'Feast', '🍖', ['life'], 0, (q) => ({ killHeal: 0.12 * q }), (q) => `Each kill heals an extra ${pct(0.12 * q)} health.`),
  R('wind', 'Second Wind', '🕊️', ['life'], 500, (q) => ({ secondWind: 0.15 * q }), (q) => `Once per fight, survive a killing blow and heal ${pct(0.15 * q)}.`),
  R('breath', 'Deep Breath', '🌿', ['life'], 0, (q) => ({ regen: 0.006 * q }), (q) => `Regain ${n1(0.6 * q)}% health every second.`),
  R('shellr', 'Carapace', '🥚', ['guard', 'life'], 0, (q) => ({ shieldP: 0.15 * q }), (q) => `Start each fight with a shield worth ${pct(0.15 * q)} health.`),
  R('corner', 'Cornered', '😡', ['fury'], 0, (q) => ({ lowP: 0.3 * q }), (q) => `+${pct(0.3 * q)} damage while below 40% health.`),
  R('ambush', 'Ambush', '🌑', ['crit'], 0, (q) => ({ firstX: q }), (q) => `Your first hit each fight deals +${pct(q)} damage.`),
  R('giant', 'Giant Slayer', '🪓', ['fury'], 250, (q) => ({ giantP: 0.2 * q }), (q) => `+${pct(0.2 * q)} damage to enemies with more health than you.`),
  // relics that depend on the body
  R('herd', 'Stampede', '🦬', ['fury'], 0, (q) => ({ perLegAtk: 0.03 * q }), (q) => `+${pct(0.03 * q)} attack for each leg.`, (b) => b.legs >= 4, 'four or more legs'),
  R('eyes', 'Many Eyes', '🕷️', ['crit'], 0, (q) => ({ perEyeCrit: 0.03 * q }), (q) => `+${n1(3 * q)}% critical chance for each eye.`, (b) => b.eyes >= 2, 'two or more eyes'),
  R('ambi', 'Ambidextrous', '🙌', ['speed', 'weapon'], 0, (q) => ({ perWeaponSpd: 0.06 * q }), (q) => `+${pct(0.06 * q)} speed for each weapon held.`, (b) => b.hands >= 2, 'two or more hands'),
  R('updraft', 'Updraft', '🪽', ['speed', 'crit'], 0, (q) => ({ dodge: 0.08 * q, dodgeCrit: 1 }), (q) => `+${pct(0.08 * q)} dodge. After a dodge, your next hit is critical.`, (b) => b.wings, 'wings'),
  R('heavy', 'Heavyweight', '🗿', ['guard', 'thorns'], 0, (q) => ({ def: 0.04 * q, thorns: 0.05 * q }), (q) => `+${pct(0.04 * q)} armour, and attackers take ${pct(0.05 * q)} back.`, (b) => b.big, 'a large body'),
  R('feather', 'Featherweight', '🪶', ['speed'], 0, (q) => ({ spdP: 0.08 * q, dodge: 0.04 * q }), (q) => `+${pct(0.08 * q)} speed and +${pct(0.04 * q)} dodge.`, (b) => b.small, 'a small body'),
  R('coil', 'Coiled', '➰', ['stun'], 0, (q) => ({ stunC: 0.06 * q, stunDur: 0.5 }), (q) => `${pct(0.06 * q)} chance to stun, and stuns last longer.`, (b) => b.serpent || b.tentacles >= 2, 'a serpent body or tentacles'),
  R('virulent', 'Virulent', '🧫', ['poison'], 0, (q) => ({ poisonD: 3 * q, poisonC: 0.15 }), (q) => `Your poison deals ${n1(3 * q)} more each second, and lands more often.`, (b) => b.venom, 'a stinger, mandibles or feelers'),

  // ---- abilities: buttons with cooldowns; picking one again levels it up
  A('pounce', 'Pounce', '🐾', ['stun', 'fury'], 0, 9, (L) => `Leap for ${pct(1.4 + 0.3 * L)} attack and stun briefly.`, (b) => b.legs >= 2, 'legs'),
  A('roar', 'Roar', '🦁', ['guard'], 0, 12, (L) => `Weaken the enemy's attacks by 30% for ${4 + L}s.`, (b) => b.mouth, 'a mouth'),
  A('lick', 'Lick Wounds', '💗', ['life'], 0, 14, (L) => `Heal ${pct(0.11 + 0.04 * L)} health.`),
  A('spit', 'Venom Spit', '🧪', ['poison'], 0, 10, (L) => `Poison the enemy for ${pct(0.22 + 0.08 * L)} of your attack every second, for 6s.`, (b) => b.venom, 'a stinger, mandibles or feelers'),
  A('dive', 'Dive', '🦅', ['crit', 'speed'], 0, 11, (L) => `Dodge everything for ${n1(1.5 + 0.5 * L)}s; your next hit is critical.`, (b) => b.wings, 'wings'),
  A('constrict', 'Constrict', '🐍', ['stun'], 0, 12, (L) => `Squeeze for ${pct(0.8 + 0.3 * L)} attack and stun for ${n1(1.3 + 0.3 * L)}s.`, (b) => b.serpent || b.tentacles >= 2, 'a serpent body or tentacles'),
  A('web', 'Web', '🕸️', ['speed', 'stun'], 0, 12, (L) => `Slow the enemy's attacks by half for ${4 + L}s.`, (b) => b.type === 'arachnid' || b.type === 'insectoid', 'an arachnid or insectoid body'),
  A('ink', 'Ink Cloud', '🌫️', ['speed'], 0, 12, (L) => `Blind the enemy for ${3 + L}s: most of its attacks miss.`, (b) => b.type === 'cephalopod' || b.type === 'aquatic', 'a cephalopod or aquatic body'),
  A('shellup', 'Shell Up', '🐢', ['guard', 'thorns'], 0, 13, (L) => `Take 70% less damage for ${3 + L}s and double what attackers take back.`, (b) => b.armoured, 'a shell, plates or tough hide'),
  A('sweep', 'Tail Sweep', '🦎', ['stun'], 0, 8, (L) => `Hit for ${pct(1 + 0.25 * L)} attack and knock the enemy's next attack back.`, (b) => b.tail, 'a tail'),
  A('gore', 'Gore', '🐂', ['bleed'], 0, 10, (L) => `Hit for ${pct(1.2 + 0.2 * L)} attack and add ${2 + L} bleed.`, (b) => b.horns, 'horns or tusks'),
  A('frenzy', 'Frenzy', '😤', ['speed', 'fury'], 300, 13, (L) => `Attack ${pct(0.5 + 0.2 * L)} faster for 4s.`),
  A('hurl', 'Hurl Weapon', '🏹', ['weapon', 'crit'], 300, 10, (L) => `Throw for ${pct(1.6 + 0.3 * L)} attack. Cannot miss.`, (b) => b.hands >= 1, 'a hand'),
  A('rend', 'Rend', '🐅', ['bleed'], 350, 9, (L) => `Tear for ${pct(0.6)} attack, plus ${pct(0.35 + 0.1 * L)} for each bleed on the enemy.`, (b) => b.claws, 'claws, talons or paws'),
  A('breath', 'Fire Breath', '🐲', ['burn'], 400, 11, (L) => `Burn for ${pct(0.8 + 0.2 * L)} attack and set the enemy alight for 5s.`, (b) => b.mouth, 'a mouth'),
];
export const ITEM = Object.fromEntries(ITEMS.map((i) => [i.id + (i.cat === 'ability' ? '!' : ''), i]));
export const item = (id, cat) => ITEM[id + (cat === 'ability' ? '!' : '')];
export const RARITY = ['Common', 'Rare', 'Epic'];

// ------------------------------------------------------------------ meta progress (the shop)
export const FREE_TYPES = ['humanoid', 'quadruped', 'avian'];
export const TYPE_COST = { insectoid: 400, arachnid: 500, cephalopod: 600, serpent: 300, aquatic: 300 };
export const PART_COST = { eye_glow: 100, eye_stalk: 100, eye_compound: 100, mandibles: 150, maw: 150, trunk: 150, tusk: 150, horn_ram: 200, antler: 200, antenna_feather: 80, ear_fin: 80,
  arm_pincer: 250, tentacle: 300, leg_insect: 150, wing_bat: 300, wing_insect: 200, tail_club: 250, tail_stinger: 300, ridge_sail: 150, ridge_plates: 200, shell: 300 };
export const BOOSTS = [
  { id: 'vital', name: 'Vitality', icon: '❤️', max: 5, cost: (l) => 150 + 100 * l, text: '+5% health for every creature, per level.' },
  { id: 'fero', name: 'Ferocity', icon: '💢', max: 5, cost: (l) => 150 + 100 * l, text: '+4% attack for every creature, per level.' },
  { id: 'recov', name: 'Recovery', icon: '⛺', max: 5, cost: (l) => 120 + 80 * l, text: '+4% more health restored between fights, per level.' },
  { id: 'reroll', name: 'Fickle Crowd', icon: '🎲', max: 3, cost: (l) => 250 + 150 * l, text: '+1 reroll of the rewards per gauntlet, per level.' },
  { id: 'stable', name: 'Bigger Stable', icon: '⚡', max: 2, cost: (l) => 600 + 400 * l, text: '+1 to the most runs you can hold, per level.' },
  { id: 'head', name: 'Head Start', icon: '🎁', max: 1, cost: () => 800, text: 'Choose a reward before the first fight.' },
  { id: 'revive', name: 'Revive', icon: '✨', max: 3, cost: () => 500, text: 'Brings a dead creature back once, mid-gauntlet, at half health. Used up when spent. Hold up to three.', consumable: true },
];
export const newMeta = () => ({ points: 0, champions: 0, fallen: 0, unlocked: {}, boosts: {}, revives: 0, runs: null, level: 0, levelSel: 0, stats: {}, seen: {}, typesWon: {}, goals: {}, hall: [], daily: null });

// ------------------------------------------------------------------ runs (energy): a few gauntlets, recharging in real time
export const RUN_MAX = 5, RUN_MS = 30 * 60 * 1000;          // one run comes back every 30 minutes
export const runMax = (meta) => RUN_MAX + (meta.boosts.stable || 0);
/** Bring the run counter up to date with the clock. Returns { n, max, next } where next is ms until the next run (0 when full). */
export function runsNow(meta, now = Date.now()) {
  const max = runMax(meta);
  if (meta.patron) return { n: max, max, next: 0, free: true };            // patrons are never out of runs
  if (!meta.runs) meta.runs = { n: max, t: now };
  const r = meta.runs;
  if (r.t > now) r.t = now;                                 // clock moved backwards: start the wait again
  while (r.n < max && now - r.t >= RUN_MS) { r.n++; r.t += RUN_MS; }
  if (r.n >= max) r.t = now;
  return { n: r.n, max, next: r.n >= max ? 0 : RUN_MS - (now - r.t) };
}
export function spendRun(meta, now = Date.now()) { if (meta.patron) return true; const s = runsNow(meta, now); if (s.n <= 0) return false; if (s.n >= s.max) meta.runs.t = now; meta.runs.n--; return true; }
export function addRun(meta, now = Date.now()) { if (meta.patron) return; const r = runsNow(meta, now); if (r.n < r.max) meta.runs.n++; }
export const clock = (ms) => { const s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
export const owns = (meta, key) => !!meta.unlocked[key];
export const typeOpen = (meta, t) => FREE_TYPES.includes(t) || owns(meta, 'type:' + t);
export const partOpen = (meta, k) => !PART_COST[k] || owns(meta, 'part:' + k);
export const itemOpen = (meta, it) => !it.cost || owns(meta, 'item:' + it.cat + ':' + it.id);
export const fightPoints = (round, pay = 1, elite = false) => Math.round((15 * Math.min(round + 1, 10) + 5 * Math.max(0, round - 9)) * pay * (elite ? 1.5 : 1));          // round is 0-based

// ------------------------------------------------------------------ loadouts and drafting
export const newLoad = () => ({ weapons: [], relics: [], abilities: [] });
export const handsUsed = (load) => load.weapons.reduce((s, w) => s + item(w.id, 'weapon').hands, 0);
/** body is optional: a creature with no hands carries its one weapon in its jaws, at reduced effect. */
export const JAW = 0.65;
export function loadMods(load, body) {
  const m = {}, jaw = body && body.hands === 0 ? JAW : 1;
  for (const e of [...load.weapons, ...load.relics]) {
    const o = item(e.id, e.cat || 'x').mods(e.q);
    for (const k in o) m[k] = (m[k] || 0) + o[k] * (e.cat === 'weapon' && o[k] > 0 ? jaw : 1);
  }
  m.weapons = load.weapons.length;
  return m;
}
function tagCount(load) {
  const t = {};
  for (const e of [...load.weapons, ...load.relics, ...load.abilities]) for (const g of item(e.id, e.cat).tags) t[g] = (t[g] || 0) + 1;
  return t;
}
/** Does this item fit this body and loadout right now? */
export function fits(it, body, load) {
  if (it.req && !it.req(body)) return false;
  if (it.cat === 'weapon') return body.slots - handsUsed(load) >= it.hands;
  if (it.cat === 'ability') return load.abilities.some((a) => a.id === it.id) || load.abilities.length < body.abilitySlots;
  return true;
}
/** Three (n) random offers. Items sharing tags with what you hold are more likely. */
export function draft(rand, body, load, meta, round, n = 3) {
  const tags = tagCount(load), offers = [], used = new Set();
  const pool = ITEMS.filter((it) => (!meta || itemOpen(meta, it)) && fits(it, body, load));
  const free = body.slots - handsUsed(load);
  const catW = { weapon: free >= 2 ? 0.45 : 0.32, relic: 0.42, ability: 0.26 };
  for (let k = 0; k < n; k++) {
    const cand = pool.filter((it) => !used.has(it.cat + it.id));
    if (!cand.length) break;
    const w = cand.map((it) => {
      let syn = 0; for (const g of it.tags) syn += Math.min(tags[g] || 0, 3);
      const owned = it.cat === 'ability' && load.abilities.some((a) => a.id === it.id);
      return catW[it.cat] / Math.max(1, cand.filter((c) => c.cat === it.cat).length) * (1 + 0.9 * Math.min(syn, 5)) * (owned ? 1.5 : 1);
    });
    let r = rand() * w.reduce((a, b) => a + b, 0), i = 0;
    while (i < w.length - 1 && (r -= w[i]) > 0) i++;
    const it = cand[i]; used.add(it.cat + it.id);
    const roll = rand(), rar = roll < 0.05 + 0.015 * round ? 2 : roll < 0.28 + 0.035 * round ? 1 : 0;
    offers.push({ id: it.id, cat: it.cat, rar, q: Math.round([1, 1.5, 2.2][rar] * (0.9 + 0.2 * rand()) * 100) / 100, syn: it.tags.some((g) => tags[g]) });
  }
  return offers;
}
export const MAX_LVL = 5;          // ability levels stop here, so timed effects never become permanent
export function take(load, o) {
  if (o.cat === 'weapon') load.weapons.push({ id: o.id, cat: 'weapon', q: o.q, rar: o.rar });
  else if (o.cat === 'relic') load.relics.push({ id: o.id, cat: 'relic', q: o.q, rar: o.rar });
  else { const a = load.abilities.find((x) => x.id === o.id); if (a) a.lvl = Math.min(MAX_LVL, a.lvl + 1 + (o.rar > 0 ? 1 : 0)); else load.abilities.push({ id: o.id, cat: 'ability', lvl: 1 + o.rar }); }
}
export function describe(o) {
  const it = item(o.id, o.cat);
  if (o.cat !== 'ability') return it.text(o.q);
  return it.text(o.lvl ?? 1 + o.rar) + ` Recharges in ${it.cd}s.`;
}
/** What an opponent carries: more as the gauntlet goes on. */
export function enemyLoad(rand, body, round) {
  const load = newLoad(), q = 0.75 + 0.04 * round;
  const relics = ITEMS.filter((it) => it.cat === 'relic' && fits(it, body, load)), weapons = ITEMS.filter((it) => it.cat === 'weapon');
  for (let i = 0; i < Math.floor(round * 0.75); i++) load.relics.push({ id: relics[Math.floor(rand() * relics.length)].id, cat: 'relic', q, rar: 0 });
  for (let i = 0; i < Math.min(body.slots, Math.floor((round + 1) / 3)); i++) {
    const w = weapons[Math.floor(rand() * weapons.length)];
    if (body.slots - handsUsed(load) >= w.hands) load.weapons.push({ id: w.id, cat: 'weapon', q, rar: 0 });
  }
  return load;
}

// ------------------------------------------------------------------ reasons to come back: ranks, daily gift, goals, elites
/**
 * Difficulty levels. Harder ones are longer as well as tougher: fights is the length of the gauntlet,
 * tier strengthens every opponent, slope is how fast opponents grow from one fight to the next
 * (flatter for long gauntlets, or rewards could never keep up), and pay multiplies all points.
 * Each is unlocked by winning the title on the one before.
 */
export const LEVELS = [
  { name: 'Novice', fights: 6, tier: 0, slope: 1, pay: 0.8 }, { name: 'Bronze', fights: 8, tier: 0, slope: 1, pay: 1 }, { name: 'Silver', fights: 10, tier: 0, slope: 1, pay: 1.25 },
  { name: 'Gold', fights: 12, tier: 0, slope: 0.9, pay: 1.6 }, { name: 'Platinum', fights: 14, tier: 0, slope: 0.84, pay: 2 }, { name: 'Diamond', fights: 16, tier: 1, slope: 0.78, pay: 2.5 },
  { name: 'Master', fights: 18, tier: 1, slope: 0.74, pay: 3.2 }, { name: 'Legend', fights: 20, tier: 2, slope: 0.7, pay: 4 },
];
export const titlePoints = (level, hpFrac) => Math.round((100 * LEVELS[level].fights + 500 * Math.min(1, Math.max(0, hpFrac))) * LEVELS[level].pay);
/** Elite opponents: a nasty twist on one fight, worth half as many points again. */
export const ELITES = [
  { id: 'enraged', name: 'Enraged', mods: { atkP: 0.25 } }, { id: 'armoured', name: 'Iron-hided', mods: { def: 0.15 } }, { id: 'swift', name: 'Swift', mods: { spdP: 0.2, dodge: 0.05 } },
  { id: 'giant', name: 'Giant', mods: { hpP: 0.35 } }, { id: 'venomous', name: 'Venomous', mods: { poisonC: 0.4, poisonD: 2 } }, { id: 'thorny', name: 'Thorned', mods: { thorns: 0.15 } },
];
export function eliteFor(rand, round, boss) { return round >= 2 && !boss && rand() < Math.min(0.5, 0.28 + 0.01 * Math.max(0, round - 9)) ? ELITES[Math.floor(rand() * ELITES.length)] : null; }

const dayKey = (now) => { const d = new Date(now); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
/** The daily gift: what is on offer today, or null if it was already claimed. */
export function dailyGift(meta, now = Date.now()) {
  const today = dayKey(now), d = meta.daily || { day: '', streak: 0 };
  if (d.day === today) return null;
  const streak = d.day === dayKey(now - 86400000) ? d.streak + 1 : 1;
  return { today, streak, points: 40 + 20 * Math.min(streak - 1, 6), revive: streak % 7 === 0 };
}
export function claimDaily(meta, now = Date.now()) {
  const g = dailyGift(meta, now); if (!g) return null;
  meta.points += g.points; if (g.revive) meta.revives = Math.min(3, (meta.revives || 0) + 1);
  meta.daily = { day: g.today, streak: g.streak };
  return g;
}

const st = (m, k) => (m.stats && m.stats[k]) || 0, count = (o) => Object.keys(o || {}).length;
/** Goals: one-off targets that pay points. prog(meta) -> [have, need]. */
export const GOALS = [
  { id: 'first', name: 'First blood', text: 'Win a fight.', pts: 50, prog: (m) => [st(m, 'fightsWon'), 1] },
  { id: 'glad', name: 'Gladiator', text: 'Win 25 fights.', pts: 150, prog: (m) => [st(m, 'fightsWon'), 25] },
  { id: 'vet', name: 'Veteran', text: 'Win 100 fights.', pts: 400, prog: (m) => [st(m, 'fightsWon'), 100] },
  { id: 'legend', name: 'Legend of the sands', text: 'Win 500 fights.', pts: 1500, prog: (m) => [st(m, 'fightsWon'), 500] },
  { id: 'half', name: 'Crowd favourite', text: 'Reach the sixth fight of a gauntlet.', pts: 100, prog: (m) => [st(m, 'bestFight'), 6] },
  { id: 'champ', name: 'Champion', text: 'Win the title.', pts: 300, prog: (m) => [m.champions || 0, 1] },
  { id: 'champ3', name: 'Dynasty', text: 'Win the title three times.', pts: 600, prog: (m) => [m.champions || 0, 3] },
  { id: 'types3', name: 'Many shapes', text: 'Win the title with three different body types.', pts: 600, prog: (m) => [count(m.typesWon), 3] },
  { id: 'types8', name: 'Master breeder', text: 'Win the title with all eight body types.', pts: 2000, prog: (m) => [count(m.typesWon), 8] },
  { id: 'silver', name: 'Rising star', text: 'Win the title on Silver.', pts: 400, prog: (m) => [st(m, 'bestLevelWon'), 3] },
  { id: 'plat', name: 'Terror of the pits', text: 'Win the title on Platinum.', pts: 1000, prog: (m) => [st(m, 'bestLevelWon'), 5] },
  { id: 'legend2', name: 'Undying', text: 'Win the title on Legend.', pts: 3000, prog: (m) => [st(m, 'bestLevelWon'), 8] },
  { id: 'end10', name: 'Into the pit', text: 'Win 10 fights in one Endless run.', pts: 250, prog: (m) => [st(m, 'bestEndless'), 10] },
  { id: 'end15', name: 'Pit dweller', text: 'Win 15 fights in one Endless run.', pts: 600, prog: (m) => [st(m, 'bestEndless'), 15] },
  { id: 'end20', name: 'Bottomless', text: 'Win 20 fights in one Endless run.', pts: 1500, prog: (m) => [st(m, 'bestEndless'), 20] },
  { id: 'dmg', name: 'Heavy hitter', text: 'Land a single hit for 100 damage or more.', pts: 200, prog: (m) => [st(m, 'biggestHit'), 100] },
  { id: 'elite', name: 'Giant killer', text: 'Defeat 10 elite opponents.', pts: 250, prog: (m) => [st(m, 'elites'), 10] },
  { id: 'armed', name: 'Armed to the teeth', text: 'Hold four weapons at once.', pts: 200, prog: (m) => [st(m, 'mostWeapons'), 4] },
  { id: 'seen20', name: 'Collector', text: 'Pick 20 different rewards.', pts: 150, prog: (m) => [count(m.seen), 20] },
  { id: 'seen45', name: 'Curator', text: 'Pick 45 different rewards.', pts: 500, prog: (m) => [count(m.seen), 45] },
  { id: 'flawless', name: 'Untouchable', text: 'Win a fight without losing any health.', pts: 100, prog: (m) => [st(m, 'flawless'), 1] },
  { id: 'close', name: 'By a whisker', text: 'Win a fight with less than a tenth of your health left.', pts: 100, prog: (m) => [st(m, 'closeCalls'), 1] },
  { id: 'mourn', name: 'Graveyard', text: 'Lose five creatures. It happens.', pts: 100, prog: (m) => [m.fallen || 0, 5] },
  { id: 'streak7', name: 'Regular', text: 'Collect the daily gift seven days running.', pts: 300, prog: (m) => [(m.daily && m.daily.streak) || 0, 7] },
  { id: 'shop10', name: 'Big spender', text: 'Unlock ten things in the shop.', pts: 150, prog: (m) => [count(m.unlocked), 10] },
];
export const goalDone = (meta, g) => { const [a, b] = g.prog(meta); return a >= b; };
export const goalsReady = (meta) => GOALS.filter((g) => goalDone(meta, g) && !(meta.goals && meta.goals[g.id])).length;

// ------------------------------------------------------------------ things sold for real money (Google Play Billing)
// The ids must match the in-app products created in the Play Console. Prices shown come from Play.
export const PRODUCTS = [
  { id: 'patron', icon: '👑', name: 'Arena Patron', text: 'Unlimited runs, and every ad reward (extra run, revive, doubled points) without watching the ad. One purchase, kept forever.', once: true },
  { id: 'points_small', icon: '💰', name: 'Purse of points', text: '2,500 points to spend in the shop.', points: 2500 },
  { id: 'points_big', icon: '🏦', name: 'Chest of points', text: '8,000 points to spend in the shop.', points: 8000 },
  { id: 'revives_3', icon: '✨', name: 'Three revives', text: 'Three revives, even if you are already holding the usual limit.', revives: 3 },
];
