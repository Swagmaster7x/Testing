// Turns creature data (plain JSON) into a three.js group.
import * as THREE from 'three';
import { tube, surfaceFrame, v, X, Y, Z, merge, flipWinding, rng, clamp } from './geom.js';
import { PARTS, defaultParams } from './parts.js';
import { TEMPLATES } from './templates.js';
import { SHELLS } from './materials.js';

let nextId = 1;
const uid = () => 'p' + (nextId++) + Math.random().toString(36).slice(2, 6);

const SEX = {
  std: {
    m: { roles: { shoulders: [0.16, 0.08], chest: [0.1, 0.05], neck: [0.2, 0.16], waist: [0.04, 0.02], head: [0.03, 0.03] }, limb: 0.15, orn: 0.3, all: 0.03 },
    f: { roles: { shoulders: [-0.1, -0.05], chest: [-0.04, 0.07], waist: [-0.14, -0.08], hips: [0.13, 0.07], neck: [-0.13, -0.1] }, limb: -0.1, orn: -0.4, all: -0.02 },
  },
  reverse: {
    m: { roles: { abdomen: [-0.12, -0.12], head: [0.05, 0.05] }, limb: -0.05, orn: 0.35, all: -0.05 },
    f: { roles: { abdomen: [0.2, 0.18] }, limb: 0.05, orn: -0.3, all: 0.04 },
  },
};

export function sexMods(data) {
  const s = SEX[TEMPLATES[data.type].dimorph][data.sex], k = data.dimorph;
  return { roles: s.roles, k, limb: 1 + s.limb * k, orn: 1 + s.orn * k, all: 1 + s.all * k };
}

export function newCreature(type) {
  const t = TEMPLATES[type];
  const data = {
    v: 1, name: 'New ' + t.name, type, sex: 'f', dimorph: 0.7, bulk: 1, stretch: 1,
    nodes: t.nodes.map((n) => ({ y: n[0], z: n[1], rx: n[2], ry: n[3], role: n[4] })),
    look: { ...t.look }, parts: [],
  };
  const fr = bodyGeometry(data, { sexless: true }).userData.frames;
  for (const [kind, where, o] of t.parts) addPart(data, kind, fr, typeof where === 'string' ? t.slots[where] : where, o);
  return data;
}

/** Add a part at its slot for this body type (or at an explicit [u, a]). */
export function addPart(data, kind, frames, where, o = {}) {
  const def = PARTS[kind], t = TEMPLATES[data.type];
  let [u, a] = where || t.slots[def.slot] || t.slots.back;
  while (!where && data.parts.some((q) => Math.abs(q.u - u) < 0.02 && Math.abs(q.a - a) < 0.05 && PARTS[q.kind].cat === def.cat)) u -= 0.07;
  const f = surfaceFrame(frames, u, a);
  const part = {
    id: uid(), kind, u, a, mirror: !!def.mirror, rot: 0, tilt: 0, sexOnly: null,
    size: def.kind === 'surface' ? def.size * f.r : def.rel * (def.ridge ? Math.max(f.r, 0.08) * 4.5 : t.limbLen),
    p: defaultParams(kind),
  };
  if (o.p) Object.assign(part.p, o.p);
  for (const k of ['size', 'rot', 'tilt', 'sexOnly', 'mirror']) if (o[k] !== undefined) part[k] = o[k];
  data.parts.push(part);
  return part;
}

export function bodyGeometry(data, o = {}) {
  const sm = sexMods(data);
  const cy = data.nodes.reduce((s, n) => s + n.y, 0) / data.nodes.length, cz = data.nodes.reduce((s, n) => s + n.z, 0) / data.nodes.length;
  const nodes = data.nodes.map((n) => {
    const r = (!o.sexless && sm.roles[n.role]) || [0, 0];
    return {
      p: v(0, cy + (n.y - cy) * data.stretch, cz + (n.z - cz) * data.stretch),
      rx: n.rx * data.bulk * (o.sexless ? 1 : sm.all) * (1 + r[0] * sm.k), ry: n.ry * data.bulk * (o.sexless ? 1 : sm.all) * (1 + r[1] * sm.k),
    };
  });
  return tube(nodes, { radial: 40, sub: 9, capRings: 7, side: X.clone(), frames: true, capStart: TEMPLATES[data.type].capS ?? 1 });
}

function toMeshes(items, M, partId) {
  const groups = new Map();
  for (const it of items) {
    if (!it || !it.g) continue;
    const mat = typeof it.m === 'string' ? M[it.m] : it.m;
    const key = mat.uuid + (it.fur || 0);
    if (!groups.has(key)) groups.set(key, { mat, fur: it.fur, gs: [] });
    groups.get(key).gs.push(it.g);
  }
  const out = [];
  for (const g of groups.values()) {
    const mesh = new THREE.Mesh(merge(g.gs), g.mat);
    mesh.userData.fur = g.mat === M.skin ? (g.fur === true ? 1 : g.fur || 0) : 0;
    out.push(mesh);
  }
  return out;
}

/** Canonical angle: mirrored parts live on the +X half; near the centre line they become single. */
export function placement(part) {
  let a = ((part.a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  if (!part.mirror) return { a, mirrored: false };
  if (a > Math.PI) a = 2 * Math.PI - a;
  if (a < 0.1) return { a: 0, mirrored: false };
  if (a > Math.PI - 0.1) return { a: Math.PI, mirrored: false };
  return { a, mirrored: true };
}

export function buildPartGroup(data, part, frames, M) {
  const def = PARTS[part.kind], sm = sexMods(data), group = new THREE.Group();
  group.userData.partId = part.id;
  if (part.sexOnly && part.sexOnly !== data.sex) return group;
  const { a, mirrored } = placement(part);
  const f = surfaceFrame(frames, part.u, a);
  const seed = [...part.id].reduce((s, c) => s * 31 + c.charCodeAt(0) | 0, 7);
  const ctx = { M, look: data.look, female: data.sex === 'f', k: sm.k, limbMul: sm.limb, rnd: rng(seed), seed: (seed % 100) / 16, part, frames, a, r: f.r, normal: f.normal };
  const orn = def.orn ? sm.orn : 1;
  const inner = new THREE.Group();
  group.userData.anchor = f.pos.clone();
  if (def.kind === 'surface') {
    const N = f.normal;
    const ref = Math.abs(N.y) < 0.9 ? Y.clone() : (N.y > 0 ? Z.clone().multiplyScalar(-1) : Z.clone());
    const yl = ref.addScaledVector(N, -ref.dot(N)).normalize(), xl = yl.clone().cross(N);
    const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xl, yl, N));
    q.multiply(new THREE.Quaternion().setFromAxisAngle(Z, part.rot)).multiply(new THREE.Quaternion().setFromAxisAngle(X, -part.tilt));
    const qi = q.clone().invert();
    ctx.down = v(0, -1, 0).applyQuaternion(qi); ctx.up = v(0, 1, 0).applyQuaternion(qi); ctx.fwd = v(0, 0, 1).applyQuaternion(qi);
    for (const m of toMeshes(def.build(part.p, ctx), M)) inner.add(m);
    inner.quaternion.copy(q); inner.position.copy(f.pos); inner.scale.setScalar(part.size * orn);
  } else {
    ctx.size = part.size * orn;
    const yaw = part.p.yaw || 0;
    let out = X.clone();
    if (def.radial) { out = v(f.normal.x, 0, f.normal.z); if (out.lengthSq() < 0.01) out = X.clone(); out.normalize(); }
    out.applyAxisAngle(Y, -yaw);
    ctx.out = out; ctx.fwd = out.clone().cross(Y).normalize();
    ctx.root = def.ridge ? f.pos : f.pos.clone().addScaledVector(f.normal, -f.r * (def.cat === 'limbs' ? 0.4 : 0.25));
    for (const m of toMeshes(def.build(part.p, ctx), M)) inner.add(m);
  }
  group.add(inner);
  if (mirrored) {
    const mir = new THREE.Group(); mir.scale.x = -1;
    mir.add(inner.clone());
    group.add(mir);
  }
  return group;
}

export function buildCreature(data, M) {
  const group = new THREE.Group();
  const bodyGeo = bodyGeometry(data), frames = bodyGeo.userData.frames;
  const body = new THREE.Mesh(bodyGeo, M.skin);
  body.userData.fur = 1; body.userData.partId = 'body';
  group.add(body);
  const cr = { group, body, frames, parts: new Map(), shells: new THREE.Group(), data, M };
  for (const part of data.parts) {
    let g;
    try { g = buildPartGroup(data, part, frames, M); } catch (e) { console.error('part failed', part.kind, e); g = new THREE.Group(); g.userData.partId = part.id; }
    cr.parts.set(part.id, g); group.add(g);
  }
  group.add(cr.shells);
  rebuildShells(cr);
  return cr;
}

export function rebuildPart(cr, part) {
  const old = cr.parts.get(part.id);
  if (old) { cr.group.remove(old); disposeTree(old); }
  const g = buildPartGroup(cr.data, part, cr.frames, cr.M);
  cr.parts.set(part.id, g); cr.group.add(g);
  return g;
}

export function rebuildShells(cr, skipId) {
  for (const c of [...cr.shells.children]) cr.shells.remove(c);
  if (cr.shellGeo) { cr.shellGeo.dispose(); cr.shellGeo = null; }
  if (cr.data.look.cover !== 'fur') return;
  cr.group.updateMatrixWorld(true);
  const gs = [];
  cr.group.traverse((o) => {
    if (!o.isMesh || !o.userData.fur) return;
    let p = o, skip = false;
    while (p) { if (skipId && p.userData.partId === skipId) skip = true; p = p.parent; }
    if (skip) return;
    const g = o.geometry.clone().applyMatrix4(o.matrixWorld);
    if (o.matrixWorld.determinant() < 0) flipWinding(g);
    g.setAttribute('fur', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count).fill(o.userData.fur), 1));
    gs.push(g);
  });
  if (!gs.length) return;
  cr.shellGeo = merge(gs, ['fur']);
  gs.forEach((g) => g !== cr.shellGeo && g.dispose());
  for (let i = 0; i < SHELLS; i++) {
    const m = new THREE.Mesh(cr.shellGeo, cr.M.shells[i]);
    m.raycast = () => {};
    cr.shells.add(m);
  }
}

export function disposeTree(o) {
  o.traverse((c) => { if (c.isMesh) c.geometry.dispose(); });
}

export function bounds(cr) {
  const box = new THREE.Box3();
  cr.group.updateMatrixWorld(true);
  cr.group.traverse((o) => { if (o.isMesh && o.parent !== cr.shells) { o.geometry.computeBoundingBox(); box.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld)); } });
  return box;
}
export { clamp };
