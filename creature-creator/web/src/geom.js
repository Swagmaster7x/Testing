// Geometry helpers. Almost every creature piece is a "tube": a smooth skin
// stretched over a curved path with an elliptical cross-section.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const V3 = THREE.Vector3;
export const v = (x = 0, y = 0, z = 0) => new V3(x, y, z);
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
const X = v(1, 0, 0), Y = v(0, 1, 0), Z = v(0, 0, 1);

export function rng(seed) {
  let s = (seed | 0) + 0x6d2b79f5;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

function catmull(a, b, c, d, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3);
}
function sampleScalar(arr, u) {
  const n = arr.length;
  const f = clamp(u, 0, 1) * (n - 1);
  const i = Math.min(Math.floor(f), n - 2), t = f - i;
  const a = arr[Math.max(i - 1, 0)], b = arr[i], c = arr[i + 1], d = arr[Math.min(i + 2, n - 1)];
  // Clamp to the span's own range so thin joints never overshoot into bulges.
  return clamp(catmull(a, b, c, d, t), Math.min(b, c) * 0.9, Math.max(b, c) * 1.06);
}

/**
 * nodes: [{p:Vector3, rx, ry}]  (ry defaults to rx)
 * opts: radial, sub (samples per span), capStart / capEnd (0 = open, 1 = round),
 *       side (direction that rx is measured along), ridges (ring bumps), frames (keep lookup data)
 */
export function tube(nodes, o = {}) {
  const radial = o.radial ?? 14, sub = o.sub ?? 6, capRings = o.capRings ?? 4;
  const capS = o.capStart ?? 1, capE = o.capEnd ?? 1;
  const n = nodes.length;
  const curve = new THREE.CatmullRomCurve3(nodes.map((q) => q.p), false, 'centripetal');
  const rxa = nodes.map((q) => q.rx), rya = nodes.map((q) => q.ry ?? q.rx);
  const m = (n - 1) * sub + 1;
  const C = [], T = [], S = [], U = [], RX = [], RY = [];
  let side = null;
  for (let k = 0; k < m; k++) {
    const u = k / (m - 1);
    const c = curve.getPoint(u), t = curve.getTangent(u).normalize();
    if (!side) {
      side = (o.side ? o.side.clone() : (Math.abs(t.x) < 0.9 ? X.clone() : Y.clone()));
    }
    side = side.clone().addScaledVector(t, -side.dot(t));
    if (side.lengthSq() < 1e-8) side = Math.abs(t.y) < 0.9 ? Y.clone().cross(t) : X.clone().cross(t);
    side.normalize();
    C.push(c); T.push(t); S.push(side); U.push(t.clone().cross(side).normalize());
    let rx = sampleScalar(rxa, u), ry = sampleScalar(rya, u);
    if (o.ridges) { const w = 1 + o.ridgeAmp * Math.sin(u * o.ridges * Math.PI * 2); rx *= w; ry *= w; }
    RX.push(Math.max(rx, 1e-4)); RY.push(Math.max(ry, 1e-4));
  }
  // Rings, including rounded caps. uParam runs -1..0 over the start cap, 0..1 body, 1..2 end cap.
  const rings = [];
  const capLen = (i, k) => k * (RX[i] + RY[i]) * 0.5;
  if (capS > 0) for (let j = capRings; j >= 1; j--) {
    const phi = (j / capRings) * Math.PI / 2;
    rings.push({ c: C[0].clone().addScaledVector(T[0], -capLen(0, capS) * Math.sin(phi)), i: 0, s: Math.max(Math.cos(phi), 0.015), u: -j / capRings });
  }
  for (let k = 0; k < m; k++) rings.push({ c: C[k], i: k, s: 1, u: k / (m - 1) });
  if (capE > 0) for (let j = 1; j <= capRings; j++) {
    const phi = (j / capRings) * Math.PI / 2;
    rings.push({ c: C[m - 1].clone().addScaledVector(T[m - 1], capLen(m - 1, capE) * Math.sin(phi)), i: m - 1, s: Math.max(Math.cos(phi), 0.015), u: 1 + j / capRings });
  }
  const R = rings.length, W = radial + 1;
  const pos = new Float32Array(R * W * 3), nor = new Float32Array(R * W * 3), uv = new Float32Array(R * W * 2);
  const tmp = v();
  for (let r = 0; r < R; r++) {
    const g = rings[r], i = g.i;
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      tmp.copy(g.c).addScaledVector(S[i], RX[i] * g.s * Math.sin(a)).addScaledVector(U[i], RY[i] * g.s * Math.cos(a));
      const o3 = (r * W + j) * 3;
      pos[o3] = tmp.x; pos[o3 + 1] = tmp.y; pos[o3 + 2] = tmp.z;
      uv[(r * W + j) * 2] = g.u; uv[(r * W + j) * 2 + 1] = j / radial;
    }
  }
  const P = (r, j, out) => { const o3 = (r * W + j) * 3; return out.set(pos[o3], pos[o3 + 1], pos[o3 + 2]); };
  const a1 = v(), a2 = v(), b1 = v(), b2 = v(), nn = v();
  for (let r = 0; r < R; r++) for (let j = 0; j <= radial; j++) {
    const jj = j % radial;
    P(Math.min(r + 1, R - 1), jj, a1); P(Math.max(r - 1, 0), jj, a2);
    P(r, (jj + 1) % radial, b1); P(r, (jj - 1 + radial) % radial, b2);
    nn.copy(a1.sub(a2)).cross(b1.sub(b2));
    if (nn.lengthSq() < 1e-16) nn.copy(T[rings[r].i]).multiplyScalar(r < R / 2 ? -1 : 1);
    nn.normalize();
    const o3 = (r * W + j) * 3;
    nor[o3] = nn.x; nor[o3 + 1] = nn.y; nor[o3 + 2] = nn.z;
  }
  const idx = [];
  for (let r = 0; r < R - 1; r++) for (let j = 0; j < radial; j++) {
    const a = r * W + j, b = a + W;
    idx.push(a, b, a + 1, a + 1, b, b + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(idx);
  if (o.frames) geo.userData.frames = { C, T, S, U, RX, RY, capS, capE, m };
  geo.userData.end = { p: C[m - 1], t: T[m - 1], r: (RX[m - 1] + RY[m - 1]) / 2 };
  return geo;
}

/** Point + outward normal on a framed tube at (u, a). u<0 and u>1 walk onto the end caps. */
export function surfaceFrame(fr, u, a) {
  const uc = clamp(u, 0, 1), f = uc * (fr.m - 1);
  const i0 = Math.min(Math.floor(f), fr.m - 2), w = f - i0, i1 = i0 + 1;
  const c = fr.C[i0].clone().lerp(fr.C[i1], w);
  const side = fr.S[i0].clone().lerp(fr.S[i1], w).normalize();
  const t = fr.T[i0].clone().lerp(fr.T[i1], w).normalize();
  const up = t.clone().cross(side).normalize();
  const rx = lerp(fr.RX[i0], fr.RX[i1], w), ry = lerp(fr.RY[i0], fr.RY[i1], w);
  let scale = 1, phi = 0, sgn = 0;
  if (u < 0 || u > 1) {
    sgn = u < 0 ? -1 : 1;
    const frac = clamp(u < 0 ? -u : u - 1, 0, 1);
    phi = frac * Math.PI / 2;
    c.addScaledVector(t, sgn * (sgn < 0 ? fr.capS : fr.capE) * (rx + ry) * 0.5 * Math.sin(phi));
    scale = Math.max(Math.cos(phi), 0.015);
  }
  const sa = Math.sin(a), ca = Math.cos(a);
  const pos = c.clone().addScaledVector(side, rx * scale * sa).addScaledVector(up, ry * scale * ca);
  const nr = side.clone().multiplyScalar(sa / rx).addScaledVector(up, ca / ry).normalize();
  const normal = nr.multiplyScalar(Math.cos(phi)).addScaledVector(t, sgn * Math.sin(phi)).normalize();
  return { pos, normal, tangent: t, center: c, rx, ry, r: (rx + ry) / 2 };
}

/** Shorthand: T([[x,y,z,rx,ry?], ...], opts) */
export function T(spec, o) {
  return tube(spec.map((s) => ({ p: v(s[0], s[1], s[2]), rx: s[3], ry: s[4] ?? s[3] })), o);
}

export function ball(r, sx = 1, sy = 1, sz = 1, x = 0, y = 0, z = 0, seg = 14) {
  const g = new THREE.SphereGeometry(r, seg, Math.max(8, Math.round(seg * 0.7)));
  g.scale(sx, sy, sz); g.translate(x, y, z);
  return g;
}

/** Two rows of points joined into a double-sided sheet (wing membranes, sails). */
export function sheet(rowA, rowB) {
  const n = rowA.length, pos = [], idx = [], uv = [];
  for (let i = 0; i < n; i++) {
    pos.push(rowA[i].x, rowA[i].y, rowA[i].z, rowB[i].x, rowB[i].y, rowB[i].z);
    uv.push(i / (n - 1), 0, i / (n - 1), 1);
  }
  for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

export function xf(g, m) { g.applyMatrix4(m); return g; }
export function move(g, x, y, z) { g.translate(x, y, z); return g; }

/** Matrix whose columns are the given basis, positioned at origin o. */
export function basis(xa, ya, za, o) {
  return new THREE.Matrix4().makeBasis(xa, ya, za).setPosition(o || v());
}

export function flipWinding(g) {
  const ix = g.index.array;
  for (let i = 0; i < ix.length; i += 3) { const t = ix[i]; ix[i] = ix[i + 2]; ix[i + 2] = t; }
}

export function merge(list, keep = []) {
  if (list.length === 1) return list[0];
  const clean = list.map((g) => {
    const gg = g.index ? g : g.toNonIndexed();
    for (const k of Object.keys(gg.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv' && !keep.includes(k)) gg.deleteAttribute(k);
    return gg;
  });
  return mergeGeometries(clean, false);
}
export { X, Y, Z };
