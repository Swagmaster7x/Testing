// Random creatures: a random body type, reshaped, recoloured and re-kitted. Used for the
// "Random creature" button and for every opponent in the colosseum.
import * as THREE from 'three';
import { PARTS, defaultParams } from './parts.js';
import { TEMPLATES } from './templates.js';
import { newCreature, addPart, bodyGeometry } from './creature.js';

const EYES = ['eye_round', 'eye_cat', 'eye_goat', 'eye_glow', 'eye_beady', 'eye_compound', 'eye_stalk'];
const MOUTHS = ['muzzle', 'beak', 'mandibles', 'maw', 'feelers', 'muzzle'];
const HORNS = ['horn_spike', 'horn_curved', 'horn_ram', 'antler', 'antenna', 'antenna_feather', 'crest'];
const TAILS = ['tail_thin', 'tail_thick', 'tail_fluffy', 'tail_tuft', 'tail_club', 'tail_stinger', 'tail_fan'];
const BACK = ['ridge_spikes', 'ridge_plates', 'ridge_sail', 'ridge_mane', 'shell'];
const EARS = ['ear_point', 'ear_round', 'ear_long', 'ear_floppy', 'ear_fin'];
const WINGS = ['wing_feather', 'wing_bat', 'wing_insect'];
const FEET = ['human', 'paw', 'hoof', 'talon', 'webbed', 'stump', 'point'];
const HANDS = ['human', 'claw', 'pincer', 'mitt'];
const COVERS = ['skin', 'fur', 'scales', 'chitin', 'slime'];
const A = ['Vor', 'Gra', 'Zul', 'Kra', 'Thu', 'Mog', 'Sha', 'Bru', 'Nyx', 'Ora', 'Ska', 'Dre', 'Hul', 'Fen', 'Ryz', 'Um', 'Qua', 'Ix', 'Bel', 'Tar'];
const B = ['gath', 'nak', 'tor', 'ra', 'lix', 'mok', 'thos', 'zar', 'dun', 'ska', 'bor', 'vex', 'gul', 'ris', 'nor', 'ix'];
const TITLES = ['the Cruel', 'the Hungry', 'Bonebreaker', 'the Unblinking', 'of the Pit', 'the Swift', 'Skullsplitter', 'the Patient', 'the Loud', 'Twice-Bitten', 'the Scarred', 'Sandstrider', 'the Vile', 'Crowd-Pleaser', 'the Last'];

export function randomName(rand, titled) {
  const pick = (a) => a[Math.floor(rand() * a.length)];
  return pick(A) + pick(B) + (titled ? ' ' + pick(TITLES) : '');
}

export function randomCreature(rand, o = {}) {
  const pick = (a) => a[Math.floor(rand() * a.length)];
  const R = (a, b) => a + (b - a) * rand();
  const col = (h, s, l) => '#' + new THREE.Color().setHSL(((h % 1) + 1) % 1, s, l).getHexString();
  const type = o.type || pick(Object.keys(TEMPLATES));
  const d = newCreature(type);
  d.name = randomName(rand, o.titled);
  d.sex = rand() < 0.5 ? 'm' : 'f'; d.bulk = R(0.82, 1.3); d.dimorph = R(0.4, 1.2);
  for (const n of d.nodes) { const k = n.role === 'neck' || n.role === 'waist' ? R(0.9, 1.15) : R(0.82, 1.28); n.rx *= k; n.ry *= k * R(0.92, 1.08); }

  const hue = rand(), L = d.look;
  Object.assign(L, {
    base: col(hue, R(0.25, 0.8), R(0.25, 0.62)), second: col(hue + R(-0.25, 0.25), R(0.35, 0.8), R(0.1, 0.4)), belly: col(hue + 0.04, R(0.15, 0.4), R(0.7, 0.88)),
    hair: col(hue + R(0, 0.5), 0.5, R(0.15, 0.5)), membrane: col(hue + R(-0.1, 0.1), 0.45, R(0.45, 0.7)), eye: col(rand(), 0.8, 0.47),
    accent: rand() < 0.7 ? col(0.11, 0.3, R(0.75, 0.9)) : col(hue, 0.2, 0.12),
    pattern: Math.floor(rand() * 8), patScale: R(0.7, 2), bellyAmt: R(0.3, 0.9),
  });
  if (rand() < 0.5) { L.cover = pick(COVERS); L.furLen = R(0.1, 0.55); L.furDroop = R(0.1, 0.7); }

  const swap = (p, kind) => { const was = PARTS[p.kind], now = PARTS[kind]; if (was.size && now.size) p.size *= now.size / was.size; p.kind = kind; p.p = defaultParams(kind); };
  const frames = bodyGeometry(d, { sexless: true }).userData.frames;
  const has = (cat) => d.parts.some((p) => PARTS[p.kind].cat === cat);
  const eyeKind = pick(EYES), mouthKind = pick(MOUTHS);
  for (const p of d.parts) {
    const def = PARTS[p.kind];
    if (def.cat === 'eyes' && rand() < 0.55) swap(p, eyeKind);
    else if (def.cat === 'mouth' && def.slot === 'mouth' && rand() < 0.55) swap(p, mouthKind);
    else if (def.cat === 'limbs' && p.p.endType !== undefined) {
      if (rand() < 0.4) p.p.endType = pick(p.kind.startsWith('arm') ? HANDS : FEET);
      p.p.thick *= R(0.85, 1.35); p.p.muscle = R(0.9, 1.35);
    }
  }
  if (!has('mouth')) addPart(d, mouthKind, frames);
  const maybe = (chance, list, cat) => { if (rand() < chance && !(cat && has(cat))) return addPart(d, pick(list), frames); };
  maybe(0.5, HORNS); maybe(0.45, TAILS, 'tails'); maybe(0.45, BACK, 'back'); maybe(0.2, WINGS, 'wings'); maybe(0.3, EARS, 'ears');
  if (rand() < 0.2) addPart(d, 'tusk', frames);
  if (rand() < 0.15) addPart(d, 'spike', frames);
  for (const p of d.parts) {
    const def = PARTS[p.kind];
    p.size *= R(0.88, 1.2);
    if (def.cat === 'limbs' || def.cat === 'eyes') continue;
    for (const [k, s] of Object.entries(def.P || {})) {       // nudge each slider a little toward a random setting
      if (['count', 'feathers', 'tines', 'lift', 'sweep', 'span'].includes(k)) continue;
      p.p[k] = p.p[k] + (R(s[0], s[1]) - p.p[k]) * 0.3;
    }
  }
  return d;
}
