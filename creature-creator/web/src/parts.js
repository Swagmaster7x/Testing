// The parts catalogue. Every part is built procedurally from tubes, blades and balls.
//
// kind 'surface': built in a local frame (+Z out of the body, +Y "up", +X right) and
//                 scaled by part.size. ctx gives world directions in that local frame.
// kind 'world':   built directly in creature space for the +X side (limbs, wings, tails, ridges).
// Builders return [{ g: geometry, m: material name or material, fur: bool }].
import * as THREE from 'three';
import { tube, T, ball, sheet, v, V3, X, Y, Z, basis, xf, move, merge, clamp, lerp, surfaceFrame } from './geom.js';
import { eyeMaterial } from './materials.js';

const PI = Math.PI;
const rotX = (g, a) => { g.rotateX(a); return g; };
const cone = (a, b, r, o = {}) => tube([{ p: a, rx: r }, { p: a.clone().lerp(b, 0.5), rx: r * 0.62 }, { p: b, rx: r * 0.04 }], { radial: 8, sub: 3, capStart: 0, capEnd: 0, ...o });
const perp = (d, pref) => { const s = pref.clone().addScaledVector(d, -pref.dot(d)); return s.lengthSq() < 1e-6 ? (Math.abs(d.x) < 0.9 ? X : Y).clone().cross(d).normalize() : s.normalize(); };
/** Flat leaf-shaped blade along pts, widths per point, facing `face`. */
function blade(pts, widths, thick, face, o = {}) {
  const d = pts[pts.length - 1].clone().sub(pts[0]).normalize();
  const side = d.clone().cross(face);
  return tube(pts.map((p, i) => ({ p, rx: Math.max(widths[i], 0.004), ry: Math.max(thick * (widths[i] > 0.03 ? 1 : 0.4), 0.003) })),
    { radial: 8, sub: 4, side: side.lengthSq() < 1e-6 ? perp(d, X) : side.normalize(), capStart: 0.5, capEnd: 0.5, capRings: 2, ...o });
}

// ---------------------------------------------------------------- eyes
function eye(type) {
  return (p, c) => {
    const it = [], r = 0.5;
    const stalk = type === 'stalk';
    const zc = stalk ? 1.55 : (type === 'compound' ? 0.0 : type === 'beady' ? 0.05 : -0.1);
    const s = new THREE.SphereGeometry(r, 28, 18); s.rotateX(PI / 2);
    if (type === 'compound') s.scale(0.95, 1.2, 0.85);
    it.push({ g: move(s, 0, 0, zc), m: eyeMaterial(c.M, stalk ? 'round' : type, c.look.eye, p.iris ?? 0.75) });
    if (stalk) it.push({ g: T([[0, 0, -0.3, 0.3], [0, 0.05, 0.5, 0.2], [0, 0, 1.15, 0.19], [0, 0, 1.5, 0.4]], { capEnd: 0.6 }), m: 'skin' });
    if (type !== 'compound') {
      const ring = new THREE.TorusGeometry(r * 1.02, r * 0.17, 8, 28); ring.scale(1, 1, 1.3);
      if (!stalk) it.push({ g: move(ring, 0, 0, -0.03), m: 'skin' });
      const lid = p.lid ?? 0.3;
      if (lid > 0.02 && type !== 'beady') {
        const up = new THREE.SphereGeometry(r * 1.07, 22, 10, 0, PI * 2, 0, 0.55 + lid * 1.05);
        up.rotateX(0.55); up.rotateZ(p.brow ?? 0);
        it.push({ g: move(up, 0, 0, zc), m: 'skin' });
        const lo = new THREE.SphereGeometry(r * 1.06, 22, 8, 0, PI * 2, 0, 0.42 + lid * 0.4);
        lo.rotateX(PI - 0.3);
        it.push({ g: move(lo, 0, 0, zc), m: 'skin' });
        if (c.female && (p.lash ?? 1) > 0.05) {
          const th = 0.55 + lid * 1.05, gs = [];
          for (let i = 0; i < 7; i++) {
            const az = -1.05 + i * 0.35;
            const d = v(Math.sin(th) * Math.sin(az), Math.cos(th), Math.sin(th) * Math.cos(az)).applyAxisAngle(X, 0.55).applyAxisAngle(Z, p.brow ?? 0);
            const a = d.clone().multiplyScalar(r * 1.06).add(v(0, 0, zc));
            const b = a.clone().add(d.clone().add(v(0, 0.75, 0.55)).normalize().multiplyScalar(0.3 * p.lash * (1 - Math.abs(az) * 0.3)));
            gs.push(cone(a, b, 0.028, { radial: 5 }));
          }
          it.push({ g: merge(gs), m: 'lash' });
        }
      }
    }
    return it;
  };
}
const EYE_P = { iris: [0.4, 1.2, 0.75, 'Iris size'], lid: [0, 0.9, 0.3, 'Eyelid'], brow: [-0.7, 0.7, 0, 'Sad / angry'], lash: [0, 2, 1, 'Lashes (female)'] };

// ---------------------------------------------------------------- mouths
function teethRow(n, fx, len, flip = 1) {
  const gs = [];
  for (let i = 0; i < n; i++) {
    const q = fx(i / (n - 1));
    gs.push(cone(q.p, q.p.clone().add(v(0, -flip * len * q.s, 0)), 0.035 * (0.7 + q.s * 0.5), { radial: 6 }));
  }
  return gs;
}
function muzzle(p) {
  const L = p.len, it = [], op = p.open;
  it.push({ g: T([[0, 0.06, -0.35, 0.52, 0.44], [0, 0.08, 0.2 * L, 0.44, 0.34], [0, 0.04, 0.62 * L, 0.34, 0.24], [0, 0, 0.9 * L, 0.27, 0.19]], { radial: 16 }), m: 'skin', fur: 0.3 });
  it.push({ g: ball(0.15, 1.25, 0.85, 0.9, 0, 0.1, 0.9 * L + 0.2), m: 'dark' });
  const jaw = T([[0, -0.1, -0.3, 0.44, 0.22], [0, -0.14, 0.3 * L, 0.34, 0.15], [0, -0.13, 0.82 * L, 0.21, 0.1]], { radial: 14 });
  const tl = p.teeth, lower = [jaw];
  const up = [], lo = [];
  for (const sx of [-1, 1]) {
    up.push(...teethRow(6, (t) => ({ p: v(sx * lerp(0.36, 0.17, t), -0.08, lerp(0.2, 0.95, t) * L), s: t > 0.75 && t < 0.95 ? 2.2 : 1 }), 0.13 * tl));
    lo.push(...teethRow(5, (t) => ({ p: v(sx * lerp(0.3, 0.14, t), -0.05, lerp(0.25, 0.82, t) * L), s: t > 0.7 ? 1.6 : 0.8 }), 0.1 * tl, -1));
  }
  const hinge = (g) => { g.translate(0, 0.1, 0.3); g.rotateX(op * 0.75); g.translate(0, -0.1, -0.3); return g; };
  it.push({ g: hinge(jaw), m: 'skin', fur: 0.3 });
  if (tl > 0.05) { it.push({ g: merge(up), m: 'teeth' }); it.push({ g: hinge(merge(lo)), m: 'teeth' }); }
  it.push({ g: ball(0.5, 0.62, 0.16 + op * 0.25, 0.9 * L, 0, -0.1 - op * 0.1, 0.4 * L), m: 'mouth' });
  if (op > 0.25) it.push({ g: hinge(ball(0.5, 0.36, 0.07, 0.7 * L, 0, -0.03, 0.42 * L)), m: 'tongue' });
  return it;
}
function beak(p) {
  const L = p.len, h = p.hook, it = [];
  it.push({ g: T([[0, 0.05, -0.3, 0.44, 0.38], [0, 0.07, 0.3 * L, 0.33, 0.27], [0, 0.03 - h * 0.05, 0.72 * L, 0.17, 0.15], [0, -h * 0.4, 1.0 * L, 0.015]], { radial: 12, capEnd: 0.3 }), m: 'accent' });
  const lo = T([[0, -0.16, -0.3, 0.38, 0.2], [0, -0.17, 0.35 * L, 0.24, 0.11], [0, -0.14, 0.8 * L, 0.02]], { radial: 12, capEnd: 0.3 });
  lo.translate(0, 0.1, 0.2); lo.rotateX(p.open * 0.6); lo.translate(0, -0.1, -0.2);
  it.push({ g: lo, m: 'accent' });
  it.push({ g: merge([ball(0.035, 1, 1, 1.6, 0.14, 0.2, 0.3 * L), ball(0.035, 1, 1, 1.6, -0.14, 0.2, 0.3 * L)]), m: 'dark' });
  if (p.open > 0.2) it.push({ g: ball(0.5, 0.4, 0.12, 0.6 * L, 0, -0.08, 0.3 * L), m: 'mouth' });
  return it;
}
function mandibles(p) {
  const gs = [], pal = [], o = p.open;
  for (const s of [-1, 1]) {
    gs.push(T([[s * 0.28, 0, -0.15, 0.17], [s * (0.5 + o * 0.25), -0.05, 0.4, 0.14], [s * (0.36 + o * 0.3), -0.1, 0.85 * p.len, 0.08], [s * (0.08 + o * 0.3), -0.12, 1.1 * p.len, 0.01]], { radial: 10, ridges: 0 }));
    pal.push(T([[s * 0.12, -0.2, -0.1, 0.07], [s * 0.15, -0.35, 0.3, 0.05], [s * 0.1, -0.5, 0.45, 0.02]], { radial: 8 }));
  }
  return [{ g: merge(gs), m: 'accent' }, { g: merge(pal), m: 'skin' }, { g: ball(0.3, 1, 0.8, 0.5, 0, -0.08, 0.02), m: 'mouth' }];
}
function maw(p) {
  const lip = new THREE.TorusGeometry(0.42, 0.15, 10, 28); lip.translate(0, 0, 0.05);
  const gs = [];
  const n = Math.round(p.count);
  for (let ring = 0; ring < 2; ring++) for (let i = 0; i < n; i++) {
    const a = (i + ring * 0.5) / n * PI * 2, R = 0.36 - ring * 0.1;
    const q = v(Math.cos(a) * R, Math.sin(a) * R, 0.1 - ring * 0.08);
    gs.push(cone(q, q.clone().add(v(-Math.cos(a) * 0.14, -Math.sin(a) * 0.14, 0.16).multiplyScalar(p.teeth)), 0.045, { radial: 6 }));
  }
  return [{ g: lip, m: 'skin' }, { g: ball(0.4, 1, 1, 0.35, 0, 0, -0.02), m: 'mouth' }, { g: merge(gs), m: 'teeth' }];
}
function lips(p) {
  const row = (y0, full, dir) => {
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const x = (i / 6 - 0.5), e = 1 - Math.abs(x) * 2;
      pts.push([x, y0 + p.smile * 0.22 * (x * x * 4) + dir * 0.03 * e, 0.04 - x * x * 0.45, 0.012 + 0.075 * full * Math.pow(e, 0.6), 0.012 + 0.06 * full * Math.pow(e, 0.6)]);
    }
    return T(pts, { radial: 10, sub: 3, side: v(0, 1, 0) });
  };
  const line = T([[-0.48, p.smile * 0.2, -0.06, 0.012], [0, 0, 0.065, 0.02], [0.48, p.smile * 0.2, -0.06, 0.012]], { radial: 6 });
  return [{ g: merge([row(0.045, p.full * 0.85, 1), row(-0.05, p.full, -1)]), m: 'lip' }, { g: line, m: 'mouth' }];
}
function trunk(p) {
  const c = p.curl;
  return [{ g: T([[0, 0, -0.3, 0.4], [0, -0.05, 0.45, 0.34], [0, -0.55, 0.95, 0.27], [0, -1.25 * p.len, 1.1, 0.21], [0, -1.9 * p.len, 1.0 + c * 0.2, 0.17], [0, -2.3 * p.len, 1.0 + c * 0.9, 0.14]], { radial: 14, sub: 8, ridges: 26, ridgeAmp: 0.04 }), m: 'skin' }];
}
function feelers(p, c) {
  const gs = [], n = Math.round(p.count);
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * (0.7 / n), w = 0.1 * Math.sin(i * 2.4);
    const d = c.down;
    const a = v(x, 0, -0.15), b = v(x * 1.2, 0, 0.3), e1 = b.clone().addScaledVector(d, 0.5 * p.len).add(v(0, 0, 0.1)), e2 = e1.clone().addScaledVector(d, 0.6 * p.len).add(v(x * 0.5 + w, 0, -0.1 + w));
    gs.push(tube([{ p: a, rx: 0.12 }, { p: b, rx: 0.1 }, { p: e1, rx: 0.07 }, { p: e2, rx: 0.02 }], { radial: 8 }));
  }
  return [{ g: merge(gs), m: 'skin' }, { g: ball(0.25, 1.2, 0.7, 0.4, 0, -0.05, 0), m: 'mouth' }];
}
function nose(p) {
  return [{ g: merge([T([[0, 0.5 * p.len, -0.1, 0.09, 0.08], [0, 0.2, 0.1 * p.len + 0.05, 0.12, 0.11], [0, -0.06, 0.3 * p.len, 0.17, 0.14]], { radial: 10 }),
    ball(0.12, 1, 0.8, 1, 0.15 * p.wide, -0.1, 0.1 * p.len), ball(0.12, 1, 0.8, 1, -0.15 * p.wide, -0.1, 0.1 * p.len)]), m: 'skin' }];
}

// ---------------------------------------------------------------- ears
function ear(shape) {
  return (p, c) => {
    const u = c.up, d = c.down;
    const S = {
      point: [[v(0, 0, -0.15), 0.34], [v(0, 0.04, 0.3), 0.37], [v(0, 0.07, 0.72), 0.22], [v(0, 0.09, 1.08), 0.02]],
      round: [[v(0, 0, -0.12), 0.3], [v(0, 0, 0.3), 0.5], [v(0, 0, 0.62), 0.44], [v(0, 0, 0.8), 0.2]],
      long: [[v(0, 0, -0.15), 0.2], [v(0, 0.03, 0.6), 0.27], [v(0, 0.04, 1.45), 0.24], [v(0, 0, 2.1), 0.03]],
      elf: [[v(0, 0, -0.12), 0.17], [v(0, 0, 0.2).addScaledVector(u, 0.12), 0.3], [v(0, 0, 0.42).addScaledVector(u, 0.45), 0.2], [v(0, 0, 0.62).addScaledVector(u, 0.95 * p.len), 0.02]],
      floppy: [[v(0, 0, -0.12), 0.3], [v(0, 0, 0.3), 0.38], [v(0, 0, 0.5).addScaledVector(d, 0.5 * p.len), 0.42], [v(0, 0, 0.46).addScaledVector(d, 1.1 * p.len), 0.32], [v(0, 0, 0.42).addScaledVector(d, 1.45 * p.len), 0.06]],
    }[shape];
    const sc = shape === 'floppy' || shape === 'elf' ? 1 : p.len;
    const pts = S.map((q) => v(q[0].x, q[0].y, q[0].z * (q[0].z > 0 ? sc : 1)));
    const w = S.map((q) => q[1] * p.wide);
    const face = shape === 'floppy' ? v(0, 0, 1) : c.fwd;
    const inner = blade(pts.map((q, i) => q.clone().addScaledVector(face, 0.045).multiplyScalar(i ? 0.9 : 1)), w.map((x) => x * 0.62), 0.03, face);
    return [{ g: blade(pts, w, 0.07, face, { radial: 10 }), m: 'skin', fur: 0.3 }, { g: inner, m: 'membrane' }];
  };
}
function finEar(p, c) {
  const tips = [], base = [], sp = [];
  for (let i = 0; i < 5; i++) {
    const a = -0.6 + i * 0.42;
    const dir = v(0, 0, 1).multiplyScalar(Math.cos(a)).addScaledVector(c.up, Math.sin(a));
    const tip = dir.clone().multiplyScalar(p.len * (0.8 + 0.35 * Math.sin((i + 0.5) / 5 * PI)));
    tips.push(tip); base.push(dir.clone().multiplyScalar(0.05));
    sp.push(cone(v(0, 0, -0.1), tip, 0.045, { radial: 6 }));
  }
  return [{ g: merge(sp), m: 'accent' }, { g: sheet(base, tips.map((t) => t.clone().multiplyScalar(0.93))), m: 'membrane' }];
}

// ---------------------------------------------------------------- horns, antennae, hair
function horn(shape) {
  return (p) => {
    const L = p.len, cu = p.curve ?? 1, o = { radial: 12, sub: 7, ridges: shape === 'spike' ? 0 : 9 * L, ridgeAmp: 0.05, capEnd: 0.3 };
    if (shape === 'spike') return [{ g: T([[0, 0, -0.15, 0.3], [0, 0.02 * cu, 0.5 * L, 0.2], [0, 0.1 * cu, 1.25 * L, 0.01]], o), m: 'accent' }];
    if (shape === 'curved') return [{ g: T([[0, 0, -0.15, 0.3], [0, 0.05 * cu, 0.42 * L, 0.26], [0, 0.32 * cu, 0.88 * L, 0.18], [0, 0.78 * cu, 1.12 * L, 0.09], [0, 1.2 * cu, 1.05 * L, 0.01]], o), m: 'accent' }];
    if (shape === 'ram') {
      const pts = [];
      for (let i = 0; i <= 12; i++) {
        const s = i / 12, a = s * PI * 1.75 * cu, R = 0.62 * L * (1 - s * 0.45);
        pts.push([0.12 + s * 0.75, R * Math.sin(a) * 0.9, -0.15 + R * (1 - Math.cos(a)), 0.32 * (1 - s * 0.95) + 0.01]);
      }
      return [{ g: T(pts, { ...o, sub: 4, ridges: 22 }), m: 'accent' }];
    }
    if (shape === 'tusk') return [{ g: T([[0, 0, -0.25, 0.2], [0, -0.3 * cu, 0.3 * L, 0.17], [0, -0.38 * cu, 0.8 * L, 0.12], [0, -0.05, 1.3 * L, 0.01]], { ...o, ridges: 0 }), m: 'teeth' }];
    // antler
    const beam = [[0, 0, -0.15, 0.14], [0.05, 0.2, 0.6, 0.115], [0.12, 0.5, 1.2, 0.095], [0.15, 0.62, 1.9, 0.065], [0.1, 0.5, 2.5, 0.012]].map((q) => [q[0], q[1] * cu, q[2] * L, q[3]]);
    const gs = [T(beam, { radial: 8, sub: 5 })];
    const tines = Math.round(p.tines ?? 3);
    for (let i = 0; i < tines; i++) {
      const s = (i + 0.6) / (tines + 0.4), f = s * 4, k = Math.min(Math.floor(f), 3), w = f - k;
      const b = v(lerp(beam[k][0], beam[k + 1][0], w), lerp(beam[k][1], beam[k + 1][1], w), lerp(beam[k][2], beam[k + 1][2], w));
      const sx = i % 2 ? 1 : -1, len = 0.7 * (1 - s * 0.4);
      gs.push(tube([{ p: b, rx: 0.08 }, { p: b.clone().add(v(sx * 0.2 * len, -0.35 * len, 0.3 * len)), rx: 0.065 }, { p: b.clone().add(v(sx * 0.3 * len, -0.5 * len, 0.9 * len)), rx: 0.012 }], { radial: 7, sub: 4, capStart: 0 }));
    }
    return [{ g: merge(gs), m: 'accent' }];
  };
}
function antenna(feathery) {
  return (p) => {
    const L = p.len, cu = p.curve;
    const spec = [[0, 0, -0.08, 0.055], [0, 0.1 * cu, 0.6 * L, 0.045], [0, 0.5 * cu, 1.2 * L, 0.035], [0, 1.05 * cu, 1.5 * L, 0.028]];
    const gs = [T(spec, { radial: 7, sub: 6 })];
    if (!feathery) return [{ g: gs[0], m: 'accent' }, { g: ball(0.09, 1, 1, 1, 0, 1.05 * cu, 1.5 * L), m: 'accent' }];
    const crv = new THREE.CatmullRomCurve3(spec.map((s) => v(s[0], s[1], s[2])));
    for (let i = 2; i < 16; i++) {
      const q = crv.getPoint(i / 16), l = 0.3 * Math.sin((i / 16) * PI) + 0.05;
      for (const s of [-1, 1]) gs.push(cone(q, q.clone().add(v(s * l, 0.05, l * 0.3)), 0.016, { radial: 4 }));
    }
    return [{ g: merge(gs), m: 'hair' }];
  };
}
/** Bunch of blades spraying out of a patch of surface: hair, beards, crests, tufts. */
function cluster(o) {
  return (p, c) => {
    const gs = [], n = Math.round((p.count ?? o.count)), dr = p.droop ?? o.droop, L = p.len ?? 1, sp = p.spread ?? o.spread;
    const capR = o.capR ?? 0.5, centre = v(0, 0, -capR - 0.02);
    for (let i = 0; i < n; i++) {
      const th = sp * Math.sqrt((i + 0.5) / n), az = i * 2.39996 + c.rnd() * 0.3;
      const dir = v(Math.sin(th) * Math.cos(az), Math.sin(th) * Math.sin(az), Math.cos(th));
      const l = L * (0.75 + 0.5 * c.rnd()), w = o.width * (0.8 + 0.4 * c.rnd()), seg = l / 4;
      const pts = [centre.clone().addScaledVector(dir, capR)], d = dir.clone();
      let q = pts[0].clone();
      for (let k = 1; k <= 4; k++) {
        d.multiplyScalar(1 - dr * 0.5).addScaledVector(c.down, dr * 0.3 * k).normalize();
        q = q.clone().addScaledVector(d, seg);
        const rel = q.clone().sub(centre);            // keep strands outside the scalp
        if (o.hug && rel.length() < capR * 1.05) q = centre.clone().add(rel.setLength(capR * 1.05));
        pts.push(q);
      }
      const face = o.hug ? pts[2].clone().sub(centre).normalize() : perp(dir, c.fwd.clone().add(v(c.rnd() - 0.5, c.rnd() - 0.5, 0)));
      gs.push(blade(pts, [w * 0.75, w, w * 0.95, w * 0.65, 0.012], w * 0.2, face, { radial: 6, sub: 3 }));
    }
    return [{ g: merge(gs), m: o.mat ?? 'hair' }];
  };
}
function whiskers(p, c) {
  const gs = [];
  for (let i = 0; i < 4; i++) {
    const a = -0.45 + i * 0.3;
    const d = v(0, 0, 1).multiplyScalar(0.35).addScaledVector(c.up, Math.sin(a) * 0.6).addScaledVector(c.fwd, -0.15).add(v(0, 0, 0.6)).normalize();
    const b = d.clone().multiplyScalar(p.len * 1.6);
    gs.push(tube([{ p: v(0, (i - 1.5) * 0.1, 0), rx: 0.016 }, { p: b.clone().multiplyScalar(0.5).addScaledVector(c.down, -0.05), rx: 0.012 }, { p: b.addScaledVector(c.down, 0.12 * p.len), rx: 0.004 }], { radial: 4, sub: 4 }));
  }
  return [{ g: merge(gs), m: 'teeth' }];
}
function shell(p) {
  const rim = new THREE.TorusGeometry(0.5, 0.06, 6, 28); rim.scale(1, p.long, 1);
  const gs = [];
  for (let i = 0; i < 7; i++) { const a = i / 6 * PI * 2, r = i === 6 ? 0 : 0.27; gs.push(ball(0.17, 1, 1, 0.35, Math.cos(a) * r, Math.sin(a) * r * p.long, 0.5 * p.dome * (i === 6 ? 0.98 : 0.8))); }
  return [{ g: merge([ball(0.5, 1, p.long, p.dome, 0, 0, 0, 22), rim]), m: 'accent' }, { g: merge(gs), m: 'skin' }];
}
function dorsalFin(p, c) {
  const b = c.fwd.clone().multiplyScalar(-1), o = v(0, 0, 1);
  const pt = (s, k) => o.clone().multiplyScalar(s).addScaledVector(b, k);
  return [{ g: blade([pt(-0.12, 0), pt(0.4 * p.len, 0.15 * p.sweep), pt(0.8 * p.len, 0.5 * p.sweep), pt(1.1 * p.len, 0.95 * p.sweep)], [0.5, 0.42, 0.25, 0.02], 0.06, perp(o, b.clone().cross(o)), { radial: 10 }), m: 'skin' }];
}
function sideFin(p, c) {
  const b = c.fwd.clone().multiplyScalar(-1), o = v(0, 0, 1), d = c.down;
  const pt = (s, k, g) => o.clone().multiplyScalar(s).addScaledVector(b, k).addScaledVector(d, g);
  return [{ g: blade([pt(-0.12, 0, 0), pt(0.4 * p.len, 0.15 * p.sweep, 0.08), pt(0.9 * p.len, 0.5 * p.sweep, 0.2), pt(1.25 * p.len, 0.95 * p.sweep, 0.3)], [0.3, 0.38, 0.27, 0.02], 0.05, c.up, { radial: 10 }), m: 'skin' }];
}

// ---------------------------------------------------------------- feet and hands
// Local frame for feet: x right, y up, z forward, origin at the ankle, unit = ankle radius.
const FEET = {
  human() {
    const toes = [];
    for (let i = 0; i < 5; i++) toes.push(ball(0.3 - i * 0.03, 1, 0.8, 1.3, -0.62 + i * 0.33, -0.95, 2.55 - i * 0.14));
    return [{ g: merge([ball(0.95, 0.95, 0.85, 1.05, 0, -0.45, -0.25), T([[0, -0.4, -0.2, 0.8, 0.6], [0, -0.65, 1.1, 0.9, 0.5], [0, -0.85, 2.3, 0.95, 0.3]], { radial: 10 }), ...toes]), m: 'skin' }];
  },
  paw() {
    const gs = [ball(1, 1.15, 0.8, 1.35, 0, -0.55, 0.45)], cl = [];
    for (let i = 0; i < 4; i++) {
      const x = -0.75 + i * 0.5, z = 1.55 - Math.abs(i - 1.5) * 0.18;
      gs.push(ball(0.42, 1, 0.9, 1.3, x, -0.75, z));
      cl.push(cone(v(x, -0.6, z + 0.35), v(x * 1.08, -1.05, z + 0.95), 0.14, { radial: 6 }));
    }
    return [{ g: merge(gs), m: 'skin', fur: 0.35 }, { g: merge(cl), m: 'accent' }];
  },
  hoof() { return [{ g: T([[0, 0.1, 0, 0.95], [0, -0.6, 0.15, 1.2, 1.25], [0, -1.15, 0.3, 1.4, 1.5]], { radial: 12, capEnd: 0.12, capStart: 0 }), m: 'accent' }]; },
  talon(web) {
    const gs = [], cl = [];
    for (const [x, z, l] of [[-1.25, 1.7, 1], [0, 2.3, 1.1], [1.25, 1.7, 1], [0, -1.4, 0.7]]) {
      gs.push(T([[0, -0.1, 0, 0.55], [x * 0.5, -0.75, z * 0.5, 0.45], [x, -1.0, z, 0.32]], { radial: 8, ridges: 5, ridgeAmp: 0.08 }));
      const d = v(x, 0, z).normalize();
      cl.push(cone(v(x, -0.95, z), v(x, -1.25, z).addScaledVector(d, 0.75 * l), 0.26, { radial: 6 }));
    }
    const it = [{ g: merge(gs), m: 'skin' }, { g: merge(cl), m: 'accent' }];
    if (web) it.push({ g: sheet([v(0, -0.6, 0.2), v(0, -0.6, 0.2), v(0, -0.6, 0.2), v(0, -0.6, 0.2), v(0, -0.6, 0.2)], [v(-1.45, -1.05, 1.95), v(-0.75, -1.05, 1.8), v(0, -1.05, 2.6), v(0.75, -1.05, 1.8), v(1.45, -1.05, 1.95)]), m: 'membrane' });
    return it;
  },
  webbed() { return FEET.talon(true); },
  stump() {
    const nails = [];
    for (let i = 0; i < 4; i++) { const a = -0.9 + i * 0.6; nails.push(ball(0.3, 1, 0.8, 0.6, Math.sin(a) * 1.3, -0.95, Math.cos(a) * 1.3 + 0.1)); }
    return [{ g: T([[0, 0.2, 0, 1.0], [0, -0.6, 0.05, 1.2], [0, -1.15, 0.1, 1.38]], { radial: 12, capEnd: 0.1, capStart: 0 }), m: 'skin' }, { g: merge(nails), m: 'accent' }];
  },
  point() { return [{ g: cone(v(0, 0.2, 0), v(0.3, -1.9, 0.2), 0.95, { capStart: 0 }), m: 'accent' }]; },
  none() { return []; },
};
// Hands: +Y runs along the limb (away from the body), +Z is the palm's forward side.
const HANDS = {
  human() {
    const gs = [ball(1, 1.2, 1.3, 0.6, 0, 1.0, 0)];
    [-0.82, -0.28, 0.27, 0.8].forEach((x, i) => {
      const l = [0.85, 1, 1.05, 0.95][i];
      gs.push(T([[x, 1.8, 0, 0.3], [x * 1.1, 1.8 + 1.1 * l, 0.1, 0.27], [x * 1.15, 1.8 + 1.9 * l, 0.4, 0.24], [x * 1.15, 1.8 + 2.4 * l, 0.8, 0.2]], { radial: 7, sub: 4, ridges: 3, ridgeAmp: 0.06 }));
    });
    gs.push(T([[0.7, 0.6, 0.2, 0.36], [1.5, 1.3, 0.5, 0.3], [1.9, 2.1, 0.75, 0.24]], { radial: 7, sub: 4 }));
    return [{ g: merge(gs), m: 'skin' }];
  },
  claw() {
    const gs = [ball(1, 1.2, 1.2, 0.75, 0, 0.9, 0)], cl = [];
    for (const x of [-0.85, 0, 0.85]) {
      gs.push(T([[x, 1.5, 0, 0.42], [x * 1.3, 2.6, 0.2, 0.38], [x * 1.4, 3.3, 0.7, 0.3]], { radial: 7, sub: 4, ridges: 2, ridgeAmp: 0.08 }));
      cl.push(cone(v(x * 1.4, 3.25, 0.65), v(x * 1.45, 3.9, 1.6), 0.27, { radial: 6 }));
    }
    gs.push(T([[0.9, 0.5, 0.2, 0.4], [1.7, 1.2, 0.6, 0.3]], { radial: 7 }));
    cl.push(cone(v(1.7, 1.2, 0.6), v(2.0, 1.7, 1.3), 0.26, { radial: 6 }));
    return [{ g: merge(gs), m: 'skin' }, { g: merge(cl), m: 'accent' }];
  },
  pincer() {
    return [{ g: merge([ball(1, 1.7, 2.1, 1.25, 0, 1.6, 0),
      T([[-0.7, 3.0, 0, 0.8, 0.6], [-1.1, 4.4, 0, 0.6, 0.45], [-0.75, 5.5, 0, 0.3], [-0.1, 6.1, 0, 0.03]], { radial: 9, capStart: 0 }),
      T([[0.8, 2.9, 0, 0.6, 0.5], [1.1, 4.1, 0, 0.42], [0.75, 5.1, 0, 0.22], [0.2, 5.7, 0, 0.03]], { radial: 9, capStart: 0 })]), m: 'skin' }];
  },
  mitt() { return [{ g: ball(1, 1.25, 1.5, 0.9, 0, 1.1, 0), m: 'skin', fur: true }]; },
  none() { return []; },
};

// ---------------------------------------------------------------- limbs (world space)
const LIMB = {
  plant: { pts: [[0, 0, 0], [0.03, -0.24, 0.035], [0.05, -0.5, 0.075], [0.04, -0.74, 0.005], [0.03, -0.97, -0.03]], r: [1.0, 1.08, 0.72, 0.84, 0.48], bulge: [1, 3] },
  digi: { pts: [[0, 0, 0], [0.03, -0.2, 0.1], [0.05, -0.42, 0.16], [0.04, -0.62, -0.02], [0.03, -0.8, -0.12], [0.03, -0.97, -0.03]], r: [1.1, 1.2, 0.8, 0.62, 0.42, 0.4], bulge: [1] },
  pillar: { pts: [[0, 0, 0], [0.01, -0.3, 0.01], [0.02, -0.6, 0.02], [0.02, -0.9, 0]], r: [1.15, 1.1, 0.95, 0.95], bulge: [1] },
  arm: { pts: [[0, 0, 0], [0.05, -0.22, -0.01], [0.08, -0.46, -0.03], [0.09, -0.7, 0.04], [0.09, -0.93, 0.11]], r: [0.95, 1.02, 0.7, 0.74, 0.5], bulge: [1, 3] },
  insect: { pts: [[0, 0, 0], [0.28, 0.2, 0], [0.5, 0.32, 0], [0.72, -0.15, 0.02], [0.88, -0.65, 0.03], [0.93, -0.95, 0.03]], r: [0.75, 0.62, 0.5, 0.42, 0.3, 0.16], bulge: [] },
};
function limb(style, ends, defEnd) {
  return (p, c) => {
    const L = c.size, sp = LIMB[style], th = L * 0.105 * p.thick * c.limbMul;
    const cs = Math.cos(p.splay), sn = Math.sin(p.splay), cw = Math.cos(p.swing), sw = Math.sin(p.swing);
    const pts = sp.pts.map(([x, y, z]) => {
      z *= p.bend; if (style === 'insect') y = y > 0 ? y * p.bend : y;
      const x1 = x * cs - y * sn, y1 = x * sn + y * cs;
      const y2 = y1 * cw + z * sw, z2 = -y1 * sw + z * cw;
      return c.root.clone().addScaledVector(c.out, x1 * L).addScaledVector(Y, y2 * L).addScaledVector(c.fwd, z2 * L);
    });
    const nodes = pts.map((q, i) => ({ p: q, rx: sp.r[i] * th * (sp.bulge.includes(i) ? p.muscle : 1) }));
    const insect = style === 'insect';
    const g = tube(nodes, { radial: 12, sub: 6, ridges: insect ? 5 : 0, ridgeAmp: 0.1 });
    const it = [{ g, m: 'skin', fur: insect ? 0.5 : 0.75 }];
    const end = g.userData.end, es = end.r * p.end, kind = p.endType ?? defEnd;
    if (c.anchors && ends === HANDS) c.anchors.push({ p: end.p.clone(), t: end.t.clone(), r: end.r * p.end });   // where a held weapon goes
    let mtx;
    if (ends === FEET) mtx = basis(c.out.clone().multiplyScalar(es), Y.clone().multiplyScalar(es), c.fwd.clone().multiplyScalar(es), end.p);
    else {
      const y = end.t.clone(), z = perp(y, c.fwd), x = y.clone().cross(z);
      mtx = basis(x.multiplyScalar(es), y.multiplyScalar(es), z.multiplyScalar(es), end.p.clone().addScaledVector(end.t, -end.r * 0.4));
    }
    for (const q of ends[kind]()) it.push({ g: xf(q.g, mtx), m: q.m, fur: q.fur || 0 });
    return it;
  };
}
function tentacle(p, c) {
  const L = c.size, nodes = [], cu = p.curl, r0 = L * 0.085 * p.thick * c.limbMul;
  for (let i = 0; i <= 9; i++) {
    const s = i / 9;
    const x = 0.5 * Math.pow(s, 0.8) + cu * 0.16 * Math.sin(s * 5 + c.seed) * s, y = -0.8 * Math.pow(s, 1.25) + cu * 0.22 * s * s * Math.sin(s * 6.5), z = 0.14 * Math.sin(s * 7 + c.seed * 2) * s * cu;
    const cs = Math.cos(p.splay), sn = Math.sin(p.splay);
    nodes.push({ p: c.root.clone().addScaledVector(c.out, (x * cs - y * sn) * L).addScaledVector(Y, (x * sn + y * cs) * L).addScaledVector(c.fwd, z * L), rx: r0 * (Math.pow(1 - s, 0.75) * 0.94 + 0.06) });
  }
  const g = tube(nodes, { radial: 12, sub: 5 });
  const it = [{ g, m: 'skin' }];
  if (c.anchors) c.anchors.push({ p: g.userData.end.p.clone(), t: g.userData.end.t.clone(), r: r0 * 0.5 });
  if (p.suckers > 0.5) {
    const crv = new THREE.CatmullRomCurve3(nodes.map((n) => n.p)), gs = [];
    for (let i = 3; i < 22; i++) {
      const s = i / 22, q = crv.getPoint(s), t = crv.getTangent(s), r = r0 * (Math.pow(1 - s, 0.75) * 0.94 + 0.06);
      const inw = perp(t, c.out.clone().multiplyScalar(-1).add(v(0, -0.6, 0)));
      const b = ball(r * 0.36, 1, 1, 1, 0, 0, 0, 8); b.translate(q.x + inw.x * r * 0.85, q.y + inw.y * r * 0.85, q.z + inw.z * r * 0.85);
      gs.push(b);
    }
    it.push({ g: merge(gs), m: 'membrane' });
  }
  return it;
}

// ---------------------------------------------------------------- wings (world space)
function wing(type) {
  return (p, c) => {
    const S = c.size, cl = Math.cos(p.lift), sl = Math.sin(p.lift), cw = Math.cos(p.sweep), sw = Math.sin(p.sweep);
    const W = (x, y, z) => {
      const x1 = x * cl - y * sl, y1 = x * sl + y * cl;
      const x2 = x1 * cw + z * sw, z2 = -x1 * sw + z * cw;
      return c.root.clone().addScaledVector(c.out, x2 * S).addScaledVector(Y, y1 * S).addScaledVector(c.fwd, z2 * S);
    };
    const it = [];
    if (type === 'bat') {
      const root = W(0, 0, 0), elbow = W(0.33, 0.22, 0), wrist = W(0.6, 0.45, 0.06);
      const tips = [W(1.45, 0.5, -0.1), W(1.25, -0.02, -0.38), W(0.92, -0.36, -0.52), W(0.55, -0.45, -0.55), W(0.02, -0.3, -0.3)];
      const bones = [tube([{ p: root, rx: S * 0.05 }, { p: elbow, rx: S * 0.036 }, { p: wrist, rx: S * 0.028 }], { radial: 8 })];
      const mem = [];
      tips.forEach((t, i) => {
        if (i < 4) bones.push(tube([{ p: wrist, rx: S * 0.018 }, { p: wrist.clone().lerp(t, 0.5).addScaledVector(Y, S * 0.03), rx: S * 0.013 }, { p: t, rx: S * 0.004 }], { radial: 6, capStart: 0 }));
        if (i > 0) {
          const a = [], b = [], piv = i < 4 ? wrist : elbow;
          for (let k = 0; k <= 8; k++) {
            const s = k / 8, e = tips[i - 1].clone().lerp(t, s);
            e.lerp(piv, 0.2 * Math.sin(s * PI));
            a.push(piv); b.push(e);
          }
          mem.push(sheet(a, b));
        }
      });
      mem.push(sheet([root, root, root], [elbow, tips[4].clone().lerp(elbow, 0.5), tips[4]]));
      mem.push(sheet([wrist, wrist], [elbow, tips[4]]));
      bones.push(cone(wrist, W(0.62, 0.62, 0.16), S * 0.02, { radial: 5 }));
      it.push({ g: merge(bones), m: 'skin' }, { g: merge(mem), m: 'membrane' });
    } else if (type === 'feather') {
      const pts = [W(0, 0, 0), W(0.3, 0.16, 0.02), W(0.62, 0.26, 0.06), W(0.9, 0.2, 0.02)];
      it.push({ g: tube(pts.map((q, i) => ({ p: q, rx: S * [0.07, 0.06, 0.045, 0.03][i] })), { radial: 8 }), m: 'skin', fur: true });
      const crv = new THREE.CatmullRomCurve3(pts), face = W(0, 0, 1).sub(W(0, 0, 0)).normalize();
      const prim = [], cov = [];
      const feather = (s, ang, len, w, arr, off) => {
        const b = crv.getPoint(s).addScaledVector(face, off * S);
        const d = W(Math.sin(ang), -Math.cos(ang), -0.18).sub(W(0, 0, 0)).normalize();
        const tip = b.clone().addScaledVector(d, len * S);
        arr.push(blade([b, b.clone().lerp(tip, 0.4), b.clone().lerp(tip, 0.8), tip], [w * S * 0.6, w * S, w * S * 0.9, w * S * 0.15], S * 0.006, face, { radial: 6, sub: 3 }));
      };
      const n = Math.round(p.feathers);
      for (let i = 0; i < n; i++) {
        const s = i / (n - 1);
        feather(0.08 + s * 0.92, lerp(-0.15, 1.45, Math.pow(s, 1.6)), lerp(0.5, 0.95, Math.sin(s * PI * 0.62)), 0.062, prim, -0.004 * (i % 2));
        feather(0.05 + s * 0.9, lerp(-0.1, 1.2, Math.pow(s, 1.6)), lerp(0.28, 0.4, s), 0.07, cov, 0.012);
      }
      it.push({ g: merge(prim), m: 'hair' }, { g: merge(cov), m: 'skin' });
    } else {
      const gs = [];
      for (const [ang, len, w] of [[0.2, 1.0, 0.17], [0.85, 0.72, 0.2]]) {
        const d = (s) => W(Math.cos(ang) * s * len, 0.04 * s, -Math.sin(ang) * s * len);
        gs.push(blade([d(0), d(0.35), d(0.75), d(1)], [0.03 * S, w * S * 0.8, w * S, 0.02 * S], S * 0.004, Y, { radial: 6, sub: 4 }));
      }
      it.push({ g: merge(gs), m: 'glass' });
    }
    return it;
  };
}

// ---------------------------------------------------------------- tails (world space)
function tail(style) {
  return (p, c) => {
    const L = c.size, cu = p.curl, n = c.normal, it = [];
    const up = perp(n, Y);
    const P = (s) => style === 'stinger'
      ? c.root.clone().addScaledVector(n, L * 0.42 * Math.sin(s * 2.7 * Math.abs(cu || 1))).addScaledVector(up, L * 0.4 * (1 - Math.cos(s * 2.7 * Math.abs(cu || 1))) * Math.sign(cu || 1))
      : c.root.clone().addScaledVector(n, L * s * (1 - 0.3 * Math.abs(cu) * s)).addScaledVector(up, L * cu * 0.65 * s * s);
    const base = Math.min(c.r * 0.8, L * 0.22) * p.thick;
    const prof = {
      thin: (s) => L * 0.035 * p.thick * (1 - s * 0.7), thick: (s) => base * Math.pow(1 - s, 0.9) + L * 0.006,
      fluffy: (s) => L * 0.1 * p.thick * (0.35 + 1.0 * Math.sin(Math.min(s * 1.25, 1) * PI * 0.8)) * (s > 0.95 ? 0.5 : 1),
      club: (s) => L * 0.05 * p.thick * (1 - s * 0.4), stinger: (s) => L * 0.075 * p.thick * (1 - s * 0.45),
      fluke: (s) => base * Math.pow(1 - s, 0.7) * 0.9 + L * 0.02, fishfin: (s) => base * Math.pow(1 - s, 0.7) * 0.9 + L * 0.02,
      fan: (s) => L * 0.05 * (1 - s * 0.5), tuft: (s) => L * 0.03 * p.thick * (1 - s * 0.5),
    }[style];
    const short = style === 'fan' ? 0.3 : (style === 'fluke' || style === 'fishfin') ? 0.75 : 1;
    const nodes = [];
    for (let i = 0; i <= 7; i++) { const s = i / 7; nodes.push({ p: P(s * short), rx: Math.max(prof(s), 0.003), ry: Math.max(prof(s) * (style === 'fishfin' ? 1.25 : 1), 0.003) }); }
    const g = tube(nodes, { radial: 12, sub: 5, ridges: style === 'stinger' ? 7 : 0, ridgeAmp: 0.12 });
    it.push({ g, m: 'skin', fur: style === 'fluffy' ? 1.6 : (style !== 'stinger' && style !== 'fishfin' && style !== 'fluke') });
    const e = g.userData.end, t = e.t;
    if (style === 'club') {
      const gs = [];
      for (let i = 0; i < 12; i++) { const d = v(Math.sin(i * 2.4) * Math.sqrt(1 - ((i / 11) * 2 - 1) ** 2), (i / 11) * 2 - 1, Math.cos(i * 2.4) * Math.sqrt(1 - ((i / 11) * 2 - 1) ** 2)); gs.push(cone(e.p.clone().addScaledVector(d, L * 0.07), e.p.clone().addScaledVector(d, L * 0.17 * p.tip), L * 0.03, { radial: 6 })); }
      it.push({ g: merge([move(ball(L * 0.1 * p.tip, 1, 1, 1), e.p.x, e.p.y, e.p.z), ...gs]), m: 'accent' });
    } else if (style === 'stinger') {
      const b = e.p.clone().addScaledVector(t, L * 0.06);
      it.push({ g: move(ball(L * 0.075 * p.tip, 1, 1, 1), b.x, b.y, b.z), m: 'skin' });
      it.push({ g: cone(b.clone().addScaledVector(t, L * 0.04), b.clone().addScaledVector(t, L * 0.2 * p.tip).addScaledVector(up, -L * 0.1 * p.tip * Math.sign(cu || 1)), L * 0.035 * p.tip), m: 'accent' });
    } else if (style === 'fluke' || style === 'fishfin') {
      const sd = style === 'fluke' ? c.out : up, face = style === 'fluke' ? up : c.out, gs = [];
      for (const s of [-1, 1]) {
        const a = e.p.clone().addScaledVector(t, -L * 0.08), tip = e.p.clone().addScaledVector(t, L * 0.3 * p.tip).addScaledVector(sd, s * L * 0.36 * p.tip);
        gs.push(blade([a, a.clone().lerp(tip, 0.45).addScaledVector(t, L * 0.05), a.clone().lerp(tip, 0.8), tip], [L * 0.03, L * 0.11 * p.tip, L * 0.08 * p.tip, L * 0.01], L * 0.012, face, { radial: 8 }));
      }
      it.push({ g: merge(gs), m: style === 'fluke' ? 'skin' : 'membrane' });
    } else if (style === 'fan') {
      const gs = [], cnt = Math.round(p.count);
      for (let i = 0; i < cnt; i++) {
        const a = (i / (cnt - 1) - 0.5) * p.spread * 2;
        const d = t.clone().multiplyScalar(Math.cos(a)).addScaledVector(c.out, Math.sin(a)).addScaledVector(up, cu * 0.2).normalize();
        const tip = e.p.clone().addScaledVector(d, L * (0.8 + 0.2 * Math.cos(a * 1.5)));
        gs.push(blade([e.p.clone().addScaledVector(t, -L * 0.1), e.p.clone().lerp(tip, 0.4), e.p.clone().lerp(tip, 0.82), tip], [L * 0.02, L * 0.055, L * 0.07, L * 0.02], L * 0.005, up, { radial: 6, sub: 3 }));
      }
      it.push({ g: merge(gs), m: 'hair' });
    } else if (style === 'tuft') {
      const gs = [];
      for (let i = 0; i < 14; i++) {
        const d = t.clone().add(v(Math.sin(i * 2.4), Math.cos(i * 1.7), Math.sin(i * 0.9)).multiplyScalar(0.55)).normalize();
        const tip = e.p.clone().addScaledVector(d, L * 0.24 * p.tip);
        gs.push(blade([e.p.clone(), e.p.clone().lerp(tip, 0.5), tip], [L * 0.02, L * 0.035 * p.tip, L * 0.004], L * 0.012, perp(d, Y), { radial: 6, sub: 3 }));
      }
      it.push({ g: merge(gs), m: 'hair' });
    }
    return it;
  };
}

// ---------------------------------------------------------------- ridges along the back (world space)
function ridge(style) {
  return (p, c) => {
    const n = Math.round(p.count), acc = [], mem = [], tips = [], bases = [];
    for (let i = 0; i < n; i++) {
      const s = n === 1 ? 0.5 : i / (n - 1);
      const u = clamp(c.part.u + (s - 0.5) * p.span, -0.6, 1.6);
      const f = surfaceFrame(c.frames, u, c.a);
      const h = c.size * Math.pow(Math.sin((s * 0.84 + 0.08) * PI), 0.7), o = f.normal, back = f.tangent.clone().multiplyScalar(-1);
      const base = f.pos.clone().addScaledVector(o, -h * 0.12);
      if (style === 'spikes') acc.push(cone(base, f.pos.clone().addScaledVector(o, h).addScaledVector(back, h * p.lean), h * 0.2, { radial: 7 }));
      else if (style === 'plates') {
        const tip = f.pos.clone().addScaledVector(o, h).addScaledVector(back, h * p.lean);
        acc.push(blade([base, base.clone().lerp(tip, 0.45), base.clone().lerp(tip, 0.8), tip], [h * 0.3, h * 0.42, h * 0.3, h * 0.03], h * 0.05, perp(o, f.tangent.clone().cross(o)), { radial: 8 }));
      } else if (style === 'mane') {
        for (let k = 0; k < 3; k++) {
          const sd = perp(o, X).multiplyScalar((k - 1) * 0.7 + (c.rnd() - 0.5) * 0.4);
          const d = o.clone().add(sd).addScaledVector(back, p.lean).normalize();
          const m1 = base.clone().addScaledVector(d, h * 0.45), tip = m1.clone().addScaledVector(d, h * 0.3).addScaledVector(Y, -h * 0.45 * p.droop).addScaledVector(sd, h * 0.3);
          mem.push(blade([base, m1, tip], [h * 0.09, h * 0.11, h * 0.01], h * 0.025, perp(d, back), { radial: 6, sub: 3 }));
        }
      } else {
        const tip = f.pos.clone().addScaledVector(o, h).addScaledVector(back, h * p.lean);
        acc.push(cone(base, tip, h * 0.035, { radial: 5 }));
        tips.push(base.clone().lerp(tip, 0.94)); bases.push(base);
      }
    }
    const it = [];
    if (acc.length) it.push({ g: merge(acc), m: 'accent' });
    if (style === 'mane') it.push({ g: merge(mem), m: 'hair' });
    if (tips.length > 1) {
      // Fill extra rows between spines so the sail follows the curve of the back.
      const A = [], B = [];
      for (let i = 0; i < tips.length - 1; i++) for (let k = 0; k < 4; k++) {
        const s = k / 4, uu = clamp(c.part.u + ((i + s) / (n - 1) - 0.5) * p.span, -0.6, 1.6);
        A.push(surfaceFrame(c.frames, uu, c.a).pos);
        B.push(tips[i].clone().lerp(tips[i + 1], s).lerp(A[A.length - 1], 0.12 * Math.sin(s * PI)));
      }
      A.push(bases[n - 1]); B.push(tips[n - 1]);
      it.push({ g: sheet(A, B), m: 'membrane' });
    }
    return it;
  };
}

// ---------------------------------------------------------------- catalogue
const LIMB_P = { thick: [0.4, 2.2, 1, 'Thickness'], muscle: [0.7, 1.6, 1, 'Muscle'], splay: [-0.3, 1.3, 0.05, 'Spread'], swing: [-1.4, 1.4, 0, 'Swing'], yaw: [-1.6, 1.6, 0, 'Turn'], bend: [-0.5, 2.5, 1, 'Bend'], end: [0.5, 2.2, 1, 'Foot size'] };
const ARM_P = { ...LIMB_P, end: [0.5, 2.2, 1, 'Hand size'] };
const FEET_C = ['human', 'paw', 'hoof', 'talon', 'webbed', 'stump', 'point', 'none'];
const HAND_C = ['human', 'claw', 'pincer', 'mitt', 'none'];
const TAIL_P = { thick: [0.3, 2.5, 1, 'Thickness'], curl: [-1.2, 1.2, 0.2, 'Curl'] };
const leg = (n, style, end, extra = {}) => ({ n, cat: 'limbs', kind: 'world', slot: 'leg', rel: 1, mirror: true, P: LIMB_P, C: { endType: FEET_C }, D: { endType: end, ...extra }, build: limb(style, FEET, end) });
const arm = (n, end, extra = {}) => ({ n, cat: 'limbs', kind: 'world', slot: 'arm', rel: 0.85, mirror: true, P: ARM_P, C: { endType: HAND_C }, D: { endType: end, ...extra }, build: limb('arm', HANDS, end) });
const eyeDef = (n, type, extra = {}) => ({ n, cat: 'eyes', kind: 'surface', slot: 'eye', size: 0.55, mirror: true, P: type === 'compound' || type === 'beady' ? {} : EYE_P, build: eye(type), ...extra });
const hornP = { len: [0.4, 2.5, 1, 'Length'], curve: [-1.5, 2, 1, 'Curve'] };

export const PARTS = {
  eye_round: eyeDef('Round eye', 'round'),
  eye_cat: eyeDef('Slit eye', 'cat'),
  eye_goat: eyeDef('Bar-pupil eye', 'goat'),
  eye_glow: eyeDef('Glowing eye', 'glow'),
  eye_beady: eyeDef('Beady eye', 'beady', { size: 0.3 }),
  eye_compound: eyeDef('Compound eye', 'compound', { size: 0.8 }),
  eye_stalk: eyeDef('Stalk eye', 'stalk', { size: 0.45 }),

  muzzle: { n: 'Muzzle', cat: 'mouth', kind: 'surface', slot: 'mouth', size: 1.25, P: { len: [0.3, 2.5, 1, 'Length'], open: [0, 1, 0.15, 'Open'], teeth: [0, 3, 1, 'Teeth'] }, build: muzzle },
  beak: { n: 'Beak', cat: 'mouth', kind: 'surface', slot: 'mouth', size: 1.2, P: { len: [0.4, 3.5, 1, 'Length'], hook: [0, 1.5, 0.5, 'Hook'], open: [0, 1, 0.1, 'Open'] }, build: beak },
  mandibles: { n: 'Mandibles', cat: 'mouth', kind: 'surface', slot: 'mouth', size: 1.2, P: { len: [0.5, 2, 1, 'Length'], open: [0, 1, 0.3, 'Open'] }, build: mandibles },
  maw: { n: 'Round maw', cat: 'mouth', kind: 'surface', slot: 'mouth', size: 1.1, P: { teeth: [0.3, 2.5, 1, 'Teeth'], count: [5, 18, 11, 'Tooth count'] }, build: maw },
  lips: { n: 'Lips', cat: 'mouth', kind: 'surface', slot: 'mouth', size: 0.85, P: { full: [0.3, 2, 1, 'Fullness'], smile: [-1, 1, 0.25, 'Frown / smile'] }, build: lips },
  trunk: { n: 'Trunk', cat: 'mouth', kind: 'surface', slot: 'mouth', size: 0.9, P: { len: [0.4, 2, 1, 'Length'], curl: [-1, 1.5, 0.4, 'Curl'] }, build: trunk },
  feelers: { n: 'Face feelers', cat: 'mouth', kind: 'surface', slot: 'mouth', size: 1.1, P: { len: [0.4, 2.5, 1, 'Length'], count: [2, 8, 4, 'Count'] }, build: feelers },
  nose: { n: 'Nose', cat: 'mouth', kind: 'surface', slot: 'nose', size: 0.55, P: { len: [0.4, 2.2, 1, 'Length'], wide: [0.5, 1.8, 1, 'Width'] }, build: nose },
  whiskers: { n: 'Whiskers', cat: 'mouth', kind: 'surface', slot: 'cheek', size: 0.9, mirror: true, P: { len: [0.4, 2, 1, 'Length'] }, build: whiskers },
  tusk: { n: 'Tusk', cat: 'mouth', kind: 'surface', slot: 'cheek', size: 0.7, mirror: true, orn: true, P: hornP, build: horn('tusk') },
  beard: { n: 'Beard', cat: 'mouth', kind: 'surface', slot: 'chin', size: 0.9, P: { len: [0.3, 3, 1, 'Length'], count: [6, 60, 26, 'Thickness'] }, build: cluster({ count: 26, spread: 0.7, droop: 1, width: 0.11, capR: 0.6 }) },

  ear_point: { n: 'Pointed ear', cat: 'ears', kind: 'surface', slot: 'ear', size: 1.0, mirror: true, P: { len: [0.4, 2.5, 1, 'Length'], wide: [0.4, 2, 1, 'Width'] }, build: ear('point') },
  ear_round: { n: 'Round ear', cat: 'ears', kind: 'surface', slot: 'ear', size: 0.9, mirror: true, P: { len: [0.4, 2.5, 1, 'Length'], wide: [0.4, 2, 1, 'Width'] }, build: ear('round') },
  ear_long: { n: 'Long ear', cat: 'ears', kind: 'surface', slot: 'ear', size: 1.0, mirror: true, P: { len: [0.4, 2.5, 1, 'Length'], wide: [0.4, 2, 1, 'Width'] }, build: ear('long') },
  ear_floppy: { n: 'Floppy ear', cat: 'ears', kind: 'surface', slot: 'ear', size: 1.0, mirror: true, P: { len: [0.4, 2.5, 1, 'Length'], wide: [0.4, 2, 1, 'Width'] }, build: ear('floppy') },
  ear_elf: { n: 'Swept ear', cat: 'ears', kind: 'surface', slot: 'earSide', size: 0.75, mirror: true, P: { len: [0.2, 2.5, 0.6, 'Length'], wide: [0.4, 2, 1, 'Width'] }, build: ear('elf') },
  ear_fin: { n: 'Fin ear', cat: 'ears', kind: 'surface', slot: 'earSide', size: 1.0, mirror: true, P: { len: [0.4, 2.5, 1, 'Length'] }, build: finEar },

  horn_spike: { n: 'Spike horn', cat: 'horns', kind: 'surface', slot: 'horn', size: 0.7, mirror: true, orn: true, P: hornP, build: horn('spike') },
  horn_curved: { n: 'Curved horn', cat: 'horns', kind: 'surface', slot: 'horn', size: 0.75, mirror: true, orn: true, P: hornP, build: horn('curved') },
  horn_ram: { n: 'Ram horn', cat: 'horns', kind: 'surface', slot: 'horn', size: 0.8, mirror: true, orn: true, P: hornP, build: horn('ram') },
  antler: { n: 'Antler', cat: 'horns', kind: 'surface', slot: 'horn', size: 0.7, mirror: true, orn: true, P: { ...hornP, tines: [1, 6, 3, 'Tines'] }, build: horn('antler') },
  antenna: { n: 'Antenna', cat: 'horns', kind: 'surface', slot: 'horn', size: 1.2, mirror: true, P: hornP, build: antenna(false) },
  antenna_feather: { n: 'Feathery antenna', cat: 'horns', kind: 'surface', slot: 'horn', size: 1.2, mirror: true, orn: true, P: hornP, build: antenna(true) },
  crest: { n: 'Feather crest', cat: 'horns', kind: 'surface', slot: 'top', size: 1.3, orn: true, P: { len: [0.3, 3, 1, 'Length'], count: [3, 30, 9, 'Feathers'], spread: [0.1, 1.4, 0.45, 'Spread'], droop: [0, 1, 0.1, 'Droop'] }, build: cluster({ count: 9, spread: 0.45, droop: 0.1, width: 0.12, capR: 0.3 }) },
  hair: { n: 'Hair', cat: 'horns', kind: 'surface', slot: 'top', size: 2.3, P: { len: [0.15, 2.5, 0.7, 'Length'], count: [20, 200, 110, 'Thickness'], spread: [0.5, 1.9, 1.45, 'Coverage'], droop: [0, 1, 0.85, 'Droop'] }, build: cluster({ count: 110, spread: 1.45, droop: 0.85, width: 0.085, capR: 0.5, hug: true }) },

  leg_human: leg('Walker leg', 'plant', 'human'),
  leg_beast: leg('Beast leg', 'digi', 'paw'),
  leg_hoof: leg('Hoofed leg', 'digi', 'hoof', { thick: 0.8 }),
  leg_bird: leg('Taloned leg', 'digi', 'talon', { thick: 0.6, end: 1.3 }),
  leg_frog: leg('Webbed leg', 'plant', 'webbed', { bend: 2, end: 1.3 }),
  leg_pillar: leg('Pillar leg', 'pillar', 'stump', { thick: 1.5 }),
  leg_insect: { n: 'Jointed leg', cat: 'limbs', kind: 'world', slot: 'leg', rel: 1.25, mirror: true, radial: true, P: { ...LIMB_P, thick: [0.3, 2.2, 0.55, 'Thickness'] }, C: { endType: FEET_C }, D: { endType: 'point', thick: 0.55, splay: 0 }, build: limb('insect', FEET, 'point') },
  arm_human: arm('Arm with hand', 'human'),
  arm_claw: arm('Clawed arm', 'claw'),
  arm_pincer: arm('Pincer arm', 'pincer', { splay: 0.5, swing: 0.9 }),
  tentacle: { n: 'Tentacle', cat: 'limbs', kind: 'world', slot: 'arm', rel: 1.3, mirror: true, radial: true, P: { thick: [0.4, 2.2, 1, 'Thickness'], curl: [0, 2, 1, 'Wiggle'], splay: [-0.6, 1.4, 0.1, 'Spread'], yaw: [-1.6, 1.6, 0, 'Turn'], suckers: [0, 1, 1, 'Suckers'] }, build: tentacle },

  wing_feather: { n: 'Feathered wing', cat: 'wings', kind: 'world', slot: 'wing', rel: 1.3, mirror: true, P: { lift: [-1.2, 1.3, 0.25, 'Lift'], sweep: [-0.6, 1.4, 0.3, 'Sweep'], feathers: [5, 16, 11, 'Feathers'] }, build: wing('feather') },
  wing_bat: { n: 'Skin wing', cat: 'wings', kind: 'world', slot: 'wing', rel: 1.3, mirror: true, P: { lift: [-1.2, 1.3, 0.3, 'Lift'], sweep: [-0.6, 1.4, 0.25, 'Sweep'] }, build: wing('bat') },
  wing_insect: { n: 'Glass wing', cat: 'wings', kind: 'world', slot: 'wing', rel: 1.2, mirror: true, P: { lift: [-1.2, 1.3, 0.35, 'Lift'], sweep: [-0.6, 1.4, 0.2, 'Sweep'] }, build: wing('insect') },
  fin_dorsal: { n: 'Back fin', cat: 'wings', kind: 'surface', slot: 'back', size: 1.3, P: { len: [0.4, 2.5, 1, 'Height'], sweep: [-0.5, 2, 1, 'Sweep'] }, build: dorsalFin },
  fin_side: { n: 'Flipper', cat: 'wings', kind: 'surface', slot: 'arm', size: 1.5, mirror: true, P: { len: [0.4, 2.5, 1, 'Length'], sweep: [-0.5, 2, 1, 'Sweep'] }, build: sideFin },

  tail_thin: { n: 'Whip tail', cat: 'tails', kind: 'world', slot: 'tail', rel: 1.0, P: TAIL_P, build: tail('thin') },
  tail_thick: { n: 'Heavy tail', cat: 'tails', kind: 'world', slot: 'tail', rel: 1.2, P: TAIL_P, build: tail('thick') },
  tail_fluffy: { n: 'Bushy tail', cat: 'tails', kind: 'world', slot: 'tail', rel: 0.9, P: TAIL_P, build: tail('fluffy') },
  tail_tuft: { n: 'Tufted tail', cat: 'tails', kind: 'world', slot: 'tail', rel: 1.0, P: { ...TAIL_P, tip: [0.4, 2.5, 1, 'Tuft size'] }, build: tail('tuft') },
  tail_club: { n: 'Club tail', cat: 'tails', kind: 'world', slot: 'tail', rel: 1.0, P: { ...TAIL_P, tip: [0.4, 2.5, 1, 'Club size'] }, build: tail('club') },
  tail_stinger: { n: 'Stinger tail', cat: 'tails', kind: 'world', slot: 'tail', rel: 1.3, P: { thick: [0.3, 2.5, 1, 'Thickness'], curl: [-1.2, 1.2, 1, 'Curl'], tip: [0.4, 2.5, 1, 'Stinger size'] }, build: tail('stinger') },
  tail_fluke: { n: 'Fluke tail', cat: 'tails', kind: 'world', slot: 'tail', rel: 0.9, P: { ...TAIL_P, tip: [0.4, 2.5, 1, 'Fluke size'] }, D: { curl: 0 }, build: tail('fluke') },
  tail_fish: { n: 'Fish tail', cat: 'tails', kind: 'world', slot: 'tail', rel: 0.8, P: { ...TAIL_P, tip: [0.4, 2.5, 1, 'Fin size'] }, D: { curl: 0 }, build: tail('fishfin') },
  tail_fan: { n: 'Feather fan', cat: 'tails', kind: 'world', slot: 'tail', rel: 0.8, orn: true, P: { curl: [-1.2, 1.5, 0.3, 'Lift'], count: [3, 21, 9, 'Feathers'], spread: [0.1, 1.5, 0.6, 'Spread'] }, build: tail('fan') },

  ridge_spikes: { n: 'Spike row', cat: 'back', kind: 'world', slot: 'back', rel: 0.22, ridge: true, P: { count: [1, 24, 9, 'Count'], span: [0.05, 1.6, 0.6, 'Row length'], lean: [-1, 1.5, 0.3, 'Lean'] }, build: ridge('spikes') },
  ridge_plates: { n: 'Plate row', cat: 'back', kind: 'world', slot: 'back', rel: 0.3, ridge: true, P: { count: [1, 20, 8, 'Count'], span: [0.05, 1.6, 0.6, 'Row length'], lean: [-1, 1.5, 0.1, 'Lean'] }, build: ridge('plates') },
  ridge_sail: { n: 'Sail', cat: 'back', kind: 'world', slot: 'back', rel: 0.45, ridge: true, P: { count: [3, 20, 9, 'Spines'], span: [0.05, 1.6, 0.55, 'Row length'], lean: [-1, 1.5, 0.2, 'Lean'] }, build: ridge('sail') },
  ridge_mane: { n: 'Mane', cat: 'back', kind: 'world', slot: 'mane', rel: 0.4, ridge: true, orn: true, P: { count: [3, 30, 14, 'Thickness'], span: [0.05, 1.6, 0.3, 'Row length'], lean: [-1, 1.5, 0.5, 'Sweep'], droop: [0, 2, 1, 'Droop'] }, build: ridge('mane') },
  spike: { n: 'Single spike', cat: 'back', kind: 'surface', slot: 'back', size: 0.5, P: hornP, build: horn('spike') },
  shell: { n: 'Shell', cat: 'back', kind: 'surface', slot: 'back', size: 2.4, P: { dome: [0.2, 1.5, 0.55, 'Dome'], long: [0.6, 2.2, 1.35, 'Length'] }, build: shell },
};

export const CATS = [
  ['eyes', 'Eyes'], ['mouth', 'Mouth'], ['ears', 'Ears'], ['horns', 'Head'], ['limbs', 'Limbs'], ['wings', 'Wings'], ['tails', 'Tails'], ['back', 'Back'],
];

export function defaultParams(kind) {
  const d = PARTS[kind], p = {};
  for (const [k, s] of Object.entries(d.P || {})) p[k] = s[2];
  return Object.assign(p, d.D || {});
}
