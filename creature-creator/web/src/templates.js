// Body types. Each is a starting spine (tail end first, head last), a set of
// "slots" saying where a newly added part should land, and a few starter parts.
// Spine node: [y, z, halfWidth, halfDepth, role]. The creature faces +Z.
// Part position: u runs 0..1 along the spine (below 0 / above 1 = the rounded ends),
// a is the angle around the body (0 = spine side, PI = belly side).
const PI = Math.PI;
const look = (o) => ({ base: '#c9b08a', second: '#6b4a2e', belly: '#efe2c8', bellyAmt: 0.8, pattern: 0, patScale: 1, cover: 'skin', furLen: 0.3, furDroop: 0.3, accent: '#e8e0cc', hair: '#3b2a1e', cloth: '#6b4a2e', membrane: '#c98a8a', eye: '#3f8f4a', ...o });

export const TEMPLATES = {
  humanoid: {
    name: 'Humanoid', blurb: 'Upright, two arms, two legs', limbLen: 0.9, bellyDir: [0, -0.2, 1], dimorph: 'human',
    capS: 0.5,
    // [y, z, half width, half depth, role, front depth x, back depth x]
    nodes: [[0.9, -0.008, 0.142, 0.094, 'hips', 0.95, 1.12], [1.0, -0.006, 0.156, 0.104, 'hips', 0.98, 1.18], [1.1, 0, 0.14, 0.095, 'waist', 1.03, 1.0], [1.2, 0.006, 0.121, 0.085, 'waist', 1.0, 0.98], [1.31, 0.012, 0.139, 0.1, 'chest', 1.04, 1.0],
      [1.4, 0.015, 0.157, 0.107, 'chest', 1.1, 0.96], [1.475, 0.008, 0.172, 0.094, 'shoulders', 1.0, 1.0], [1.525, 0.002, 0.122, 0.076, 'shoulders', 0.95, 1.05], [1.562, 0.002, 0.063, 0.061, 'neck'], [1.62, 0.01, 0.056, 0.058, 'neck'],
      [1.69, 0.03, 0.08, 0.094, 'head', 1.16, 0.9], [1.752, 0.032, 0.112, 0.118, 'head', 1.07, 1.0], [1.82, 0.024, 0.124, 0.13, 'head', 1.0, 1.05], [1.878, 0.016, 0.102, 0.11, 'head']],
    slots: { eye: [0.882, 2.8], brow: [0.912, 2.8], mouth: [0.808, PI], nose: [0.848, PI], cheek: [0.83, 2.45], chin: [0.78, PI], ear: [1.35, 1.1], earSide: [0.86, 1.57], horn: [1.4, 2.1], top: [1.85, 0], leg: [-0.4, 1.57], arm: [0.452, 1.57], wing: [0.42, 0.45], tail: [0.03, 0], back: [0.3, 0], mane: [0.6, 0] },
    look: look({ base: '#c99573', second: '#8a5a3c', belly: '#d9a888', bellyAmt: 0.35, hair: '#2c1b12', eye: '#4a7fb5', cloth: '#5a3a24' }),
    parts: [['leg_human', 'leg', { size: 0.9, p: { end: 0.9 } }], ['arm_human', 'arm', { size: 0.72, p: { splay: 0.1, end: 0.82 } }], ['eye_round', 'eye', { size: 0.047, p: { lid: 0.22, iris: 0.9 } }], ['brow', 'brow', { size: 0.055 }], ['nose', 'nose', { size: 0.05, p: { len: 1.25, wide: 0.85 } }],
      ['lips', 'mouth', { size: 0.074, p: { full: 0.95, smile: 0.25 } }], ['ear_elf', 'earSide', { size: 0.075, p: { len: 0.25 } }], ['hair', 'top', { size: 0.3, p: { len: 0.55, count: 140 } }],
      ['wrap', [-0.36, 0], { size: 0.028, p: { span: 1.02 } }], ['wrap', [0.4, 0], { size: 0.02, sexOnly: 'f', p: { span: 0.1 } }]],
  },
  quadruped: {
    name: 'Quadruped', blurb: 'Four legs, tail, muzzle', limbLen: 0.85, bellyDir: [0, -1, 0], dimorph: 'std',
    nodes: [[0.95, -0.62, 0.15, 0.17, 'hips'], [0.98, -0.36, 0.2, 0.23, 'hips'], [0.96, 0, 0.195, 0.235, 'waist'], [0.99, 0.34, 0.21, 0.27, 'chest'], [1.06, 0.55, 0.17, 0.22, 'shoulders'], [1.25, 0.74, 0.115, 0.135, 'neck'], [1.39, 0.9, 0.125, 0.13, 'head'], [1.38, 1.03, 0.105, 0.105, 'head']],
    slots: { eye: [0.93, 0.95], mouth: [1.85, PI], nose: [1.9, 0], cheek: [1.35, 1.9], chin: [0.95, PI], ear: [0.85, 0.6], earSide: [0.86, 1.2], horn: [0.9, 0.3], top: [0.86, 0], leg: [0.3, 2.1], arm: [0.56, 1.5], wing: [0.5, 0.55], tail: [-0.8, 0.0], back: [0.35, 0], mane: [0.68, 0] },
    look: look({ base: '#b9773a', second: '#3a2616', belly: '#f3e6d0', cover: 'fur', furLen: 0.3, pattern: 5, hair: '#3a2616', eye: '#d9a020' }),
    parts: [['leg_beast', [0.12, 2.1], { size: 0.84 }], ['leg_beast', [0.53, 2.1], { size: 0.86, p: { bend: 0.45, thick: 0.9 } }], ['muzzle', 'mouth'], ['eye_cat', 'eye'], ['ear_point', 'ear'], ['tail_fluffy', 'tail', { p: { curl: -0.35 } }], ['whiskers', 'cheek']],
  },
  avian: {
    name: 'Avian', blurb: 'Wings, beak, talons', limbLen: 0.7, bellyDir: [0, -0.8, 0.6], dimorph: 'std',
    nodes: [[0.76, -0.32, 0.07, 0.07, 'hips'], [0.8, -0.1, 0.17, 0.17, 'hips'], [0.92, 0.1, 0.19, 0.2, 'chest'], [1.1, 0.22, 0.12, 0.125, 'neck'], [1.3, 0.26, 0.075, 0.075, 'neck'], [1.42, 0.3, 0.1, 0.1, 'head'], [1.44, 0.38, 0.085, 0.085, 'head']],
    slots: { eye: [0.9, 1.25], mouth: [1.85, PI], nose: [1.8, 0], cheek: [1.2, 1.9], chin: [0.85, PI], ear: [0.86, 0.6], earSide: [0.86, 1.2], horn: [0.92, 0.5], top: [0.9, 0], leg: [0.22, 2.35], arm: [0.36, 1.5], wing: [0.38, 0.85], tail: [-0.85, 0], back: [0.25, 0], mane: [0.55, 0] },
    look: look({ base: '#2f7fc2', second: '#f2c230', belly: '#f4f0e6', cover: 'fur', furLen: 0.12, pattern: 5, accent: '#e8a020', hair: '#1f4f9a', eye: '#e8a020' }),
    parts: [['leg_bird', 'leg', { size: 0.74 }], ['wing_feather', 'wing', { size: 0.95 }], ['beak', 'mouth'], ['eye_round', 'eye', { p: { lid: 0.15 } }], ['crest', 'top', { sexOnly: null }], ['tail_fan', 'tail', { size: 0.6 }]],
  },
  insectoid: {
    name: 'Insectoid', blurb: 'Six legs, antennae, chitin', limbLen: 0.72, bellyDir: [0, -1, 0], dimorph: 'reverse',
    nodes: [[0.5, -0.78, 0.1, 0.1, 'abdomen'], [0.56, -0.5, 0.26, 0.24, 'abdomen'], [0.53, -0.2, 0.2, 0.18, 'abdomen'], [0.5, -0.02, 0.07, 0.07, 'waist'], [0.55, 0.15, 0.16, 0.15, 'chest'], [0.56, 0.38, 0.15, 0.14, 'chest'], [0.56, 0.5, 0.06, 0.06, 'neck'], [0.58, 0.62, 0.14, 0.13, 'head'], [0.56, 0.74, 0.1, 0.1, 'head']],
    slots: { eye: [0.93, 1.1], mouth: [1.8, PI], nose: [1.8, 0], cheek: [1.2, 1.9], chin: [0.95, PI], ear: [0.9, 0.8], earSide: [0.9, 1.3], horn: [0.97, 0.45], top: [0.9, 0], leg: [0.56, 2.0], arm: [0.64, 1.7], wing: [0.56, 0.5], tail: [-0.9, 0], back: [0.15, 0], mane: [0.55, 0] },
    look: look({ base: '#2f6b3a', second: '#12281a', belly: '#9fb86a', bellyAmt: 0.5, cover: 'chitin', pattern: 7, accent: '#1c1a14', membrane: '#bfe8e0', eye: '#b03020' }),
    parts: [['leg_insect', [0.47, 2.0], { size: 0.72, p: { yaw: -0.7 } }], ['leg_insect', [0.56, 2.0], { size: 0.68, p: { yaw: 0 } }], ['leg_insect', [0.64, 2.0], { size: 0.7, p: { yaw: 0.75 } }], ['eye_compound', 'eye'], ['mandibles', 'mouth', { size: 0.13 }], ['antenna', 'horn'], ['wing_insect', 'wing', { size: 0.95 }]],
  },
  arachnid: {
    name: 'Arachnid', blurb: 'Eight legs, many eyes', limbLen: 1.0, bellyDir: [0, -1, 0], dimorph: 'reverse',
    nodes: [[0.62, -0.62, 0.14, 0.14, 'abdomen'], [0.7, -0.36, 0.32, 0.3, 'abdomen'], [0.6, -0.08, 0.2, 0.18, 'abdomen'], [0.5, 0.05, 0.08, 0.07, 'waist'], [0.5, 0.25, 0.22, 0.15, 'chest'], [0.5, 0.45, 0.17, 0.12, 'head'], [0.48, 0.55, 0.1, 0.08, 'head']],
    slots: { eye: [1.3, 0.6], mouth: [1.85, PI], nose: [1.8, 0], cheek: [1.2, 1.9], chin: [0.95, PI], ear: [0.9, 0.8], earSide: [0.9, 1.3], horn: [0.9, 0.45], top: [0.85, 0], leg: [0.7, 1.9], arm: [0.85, 1.7], wing: [0.66, 0.5], tail: [-0.9, 0], back: [0.18, 0], mane: [0.5, 0] },
    look: look({ base: '#3a2a22', second: '#c8501c', belly: '#5a463a', bellyAmt: 0.4, cover: 'fur', furLen: 0.1, pattern: 7, accent: '#14100e', eye: '#a01818' }),
    parts: [['leg_insect', [0.6, 1.9], { size: 1.0, p: { yaw: -1.0 } }], ['leg_insect', [0.66, 1.9], { size: 0.9, p: { yaw: -0.35 } }], ['leg_insect', [0.72, 1.9], { size: 0.9, p: { yaw: 0.3 } }], ['leg_insect', [0.78, 1.9], { size: 1.05, p: { yaw: 0.95 } }],
      ['eye_beady', [1.35, 0.5], { size: 0.045 }], ['eye_beady', [1.3, 1.15], { size: 0.03 }], ['eye_beady', [0.97, 0.5], { size: 0.032 }], ['eye_beady', [0.95, 1.0], { size: 0.026 }], ['mandibles', 'mouth', { size: 0.12 }]],
  },
  cephalopod: {
    name: 'Cephalopod', blurb: 'Soft mantle, eight tentacles', limbLen: 1.1, bellyDir: [0, -0.5, -0.8], dimorph: 'reverse',
    nodes: [[1.78, -0.52, 0.07, 0.07, 'abdomen'], [1.56, -0.38, 0.24, 0.22, 'abdomen'], [1.26, -0.2, 0.3, 0.28, 'abdomen'], [0.97, -0.05, 0.215, 0.215, 'waist'], [0.77, 0.02, 0.225, 0.215, 'head'], [0.62, 0.05, 0.19, 0.19, 'head']],
    slots: { eye: [0.86, 1.4], mouth: [2.0, 0], nose: [0.8, 0], cheek: [0.9, 0.8], chin: [1.2, 0], ear: [0.7, 1.2], earSide: [0.7, 1.5], horn: [0.72, 0.6], top: [0.3, PI], leg: [1.45, 1.57], arm: [1.45, 1.0], wing: [0.3, 1.57], tail: [-0.9, 0], back: [0.3, PI], mane: [0.4, PI] },
    look: look({ base: '#c4472e', second: '#f0b090', belly: '#f2d6c4', bellyAmt: 0.7, cover: 'slime', pattern: 2, patScale: 1.6, membrane: '#f2c4b0', eye: '#e0b030' }),
    parts: [['tentacle', [1.45, 0.38], { size: 1.15 }], ['tentacle', [1.45, 1.15], { size: 1.05 }], ['tentacle', [1.45, 1.95], { size: 1.05 }], ['tentacle', [1.45, 2.75], { size: 1.15 }], ['eye_goat', 'eye', { p: { lid: 0.2 } }]],
  },
  serpent: {
    name: 'Serpent', blurb: 'Long limbless body', limbLen: 0.5, bellyDir: [0, -1, 0], dimorph: 'std',
    nodes: [[0.05, -1.75, 0.025, 0.025, 'tail'], [0.09, -1.35, 0.07, 0.07, 'tail'], [0.11, -0.9, 0.1, 0.1, 'hips'], [0.12, -0.4, 0.115, 0.115, 'waist'], [0.13, 0.1, 0.12, 0.12, 'waist'], [0.22, 0.5, 0.115, 0.115, 'chest'], [0.56, 0.74, 0.105, 0.105, 'neck'], [0.9, 0.8, 0.095, 0.1, 'neck'], [1.09, 0.93, 0.125, 0.1, 'head'], [1.07, 1.1, 0.1, 0.075, 'head']],
    slots: { eye: [0.96, 0.95], mouth: [1.8, PI], nose: [1.8, 0], cheek: [1.2, 1.9], chin: [0.97, PI], ear: [0.92, 0.7], earSide: [0.92, 1.3], horn: [0.95, 0.45], top: [0.93, 0], leg: [0.45, 2.1], arm: [0.72, 1.7], wing: [0.68, 0.6], tail: [-0.9, 0], back: [0.5, 0], mane: [0.8, 0] },
    look: look({ base: '#4f8a3a', second: '#1f3a1c', belly: '#e6dfa0', cover: 'scales', pattern: 1, eye: '#e8c020' }),
    parts: [['muzzle', 'mouth', { size: 0.13, p: { len: 0.7, teeth: 1.8, open: 0.35 } }], ['eye_cat', 'eye', { size: 0.05 }], ['ridge_spikes', [0.6, 0], { size: 0.07, p: { count: 16, span: 0.7 } }]],
  },
  aquatic: {
    name: 'Aquatic', blurb: 'Fins, flippers, fish tail', limbLen: 0.5, bellyDir: [0, -1, 0], dimorph: 'reverse',
    nodes: [[1.0, -1.0, 0.03, 0.07, 'tail'], [1.0, -0.6, 0.08, 0.15, 'tail'], [1.0, -0.1, 0.17, 0.26, 'abdomen'], [1.02, 0.35, 0.19, 0.28, 'chest'], [1.0, 0.7, 0.15, 0.2, 'head'], [0.98, 0.95, 0.09, 0.11, 'head']],
    slots: { eye: [0.9, 1.15], mouth: [1.75, PI], nose: [1.8, 0], cheek: [1.2, 1.9], chin: [0.95, PI], ear: [0.85, 0.7], earSide: [0.85, 1.3], horn: [0.9, 0.45], top: [0.85, 0], leg: [0.4, 2.3], arm: [0.64, 2.0], wing: [0.5, 0.6], tail: [-0.8, 0], back: [0.52, 0], mane: [0.7, 0] },
    look: look({ base: '#3a7f9a', second: '#1c3f5a', belly: '#eef2f0', cover: 'scales', pattern: 5, membrane: '#7fc4d0', eye: '#e8e0a0' }),
    parts: [['muzzle', 'mouth', { size: 0.13, p: { len: 0.45, teeth: 1.6, open: 0.3 } }], ['eye_round', 'eye', { size: 0.06, p: { lid: 0 } }], ['fin_dorsal', 'back', { size: 0.32 }], ['fin_side', 'arm', { size: 0.3 }], ['tail_fish', 'tail', { size: 0.5, p: { tip: 1.3 } }]],
  },
};
