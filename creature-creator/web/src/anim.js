// Animation. Creatures have no skeleton, but every limb, wing and tail is its own piece
// with a joint at its root, and the whole body can lean, hop, twist and squash. A pose is a
// small set of numbers ("channels"); poses are blended and the joints follow.
import * as THREE from 'three';

export const CHANNELS = ['z', 'y', 'x', 'pitch', 'yaw', 'roll', 'sy', 'gait', 'legF', 'legH', 'legOut', 'armAll', 'arm', 'armOut', 'tent', 'wing', 'flap', 'tailYaw', 'tailUp', 'wag', 'kneeF', 'kneeH', 'elbow'];
export const zero = () => { const c = {}; for (const k of CHANNELS) c[k] = 0; c.sy = 1; c.wag = 1; return c; };
export const ease = (x) => x * x * (3 - 2 * x);
export const easeOut = (x) => 1 - (1 - x) * (1 - x) * (1 - x);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

/** Attack styles: where the body is at the top of the wind-up and at the moment of impact. */
export const STYLES = {
  lunge: { wind: { z: -0.3, pitch: -0.16, legF: 0.25, sy: 0.94, kneeF: 0.5, kneeH: 0.6 }, hit: { z: 0.9, pitch: 0.22, legF: -0.6, legH: 0.35, tailUp: 0.3, kneeF: 0.15 } },
  bite: { wind: { z: -0.3, pitch: -0.22, legF: 0.25, tailUp: 0.2, kneeF: 0.4, kneeH: 0.7 }, hit: { z: 0.95, pitch: 0.3, legF: -0.55, legH: 0.35, tailUp: 0.4, kneeF: 0.2 } },
  slash: { wind: { z: -0.12, pitch: -0.2, arm: -2.5, elbow: -1.5, yaw: -0.35, legF: 0.2, kneeF: 0.35, kneeH: 0.35 }, hit: { z: 0.7, pitch: 0.2, arm: -0.75, elbow: -0.15, yaw: 0.4, legH: 0.3, kneeF: 0.25 } },
  swipe: { wind: { pitch: -0.5, y: 0.12, legF: -1.3, kneeF: 1.1, z: -0.1, tailUp: -0.2, kneeH: 0.5 }, hit: { z: 0.65, pitch: 0.2, legF: -0.35, kneeF: 0.1, legH: 0.35 } },
  charge: { wind: { z: -0.65, pitch: 0.14, legF: 0.35, legH: -0.25, sy: 0.92, kneeF: 0.6, kneeH: 0.8 }, hit: { z: 1.2, pitch: 0.3, legF: -0.5, legH: 0.5, kneeF: 0.2 }, run: true },
  swoop: { wind: { y: 1.15, z: -0.35, pitch: -0.3, flap: 1, wing: 0.35, legF: -0.4, legH: -0.4 }, hit: { y: 0.05, z: 1.0, pitch: 0.45, wing: 0.6, legF: -0.9, legH: -0.5 } },
  lash: { wind: { z: -0.15, tent: 0.55, pitch: -0.12, sy: 1.06 }, hit: { z: 0.6, tent: -1.35, pitch: 0.14, sy: 0.95 } },
  tail: { wind: { yaw: -0.7, tailYaw: 0.6, z: -0.1, sy: 0.95 }, hit: { yaw: Math.PI * 2, tailYaw: -0.5, z: 0.55, tailUp: 0.25 }, spin: true },
  sting: { wind: { pitch: 0.12, tailUp: 0.5, z: -0.15, sy: 0.95 }, hit: { pitch: 0.3, tailUp: 1.5, z: 0.7 } },
  pounce: { wind: { z: -0.45, pitch: -0.32, sy: 0.82, legF: 0.3, legH: -0.3, kneeF: 0.9, kneeH: 1.1 }, hit: { z: 1.05, pitch: 0.32, legF: -0.9, legH: 0.6, kneeF: 0.1, kneeH: 0.1 }, arc: 0.95, slow: true },
  roar: { wind: { pitch: -0.4, wing: 0.7, armAll: -1.2, armOut: 0.6, elbow: -0.9, kneeH: 0.5, tailUp: 0.4, sy: 1.06 }, hit: { pitch: -0.2, wing: 0.9, armAll: -1.6, armOut: 0.9, z: 0.15, sy: 1.1 } },
};

export function makeRig(cr) {
  const joints = [], S = new THREE.Matrix4().makeScale(-1, 1, 1);
  const C = cr.frames.C, midZ = (C[0].z + C[C.length - 1].z) / 2;
  let arms = 0;
  cr.group.traverse((o) => {
    const j = o.userData.joint;
    if (!j) return;
    o.matrixAutoUpdate = false;
    const lo = o.children.find((ch) => ch.userData.joint2);
    if (lo) lo.matrixAutoUpdate = false;
    joints.push({ node: o, ...j, front: j.pivot.z >= midZ - 0.02, ph: (joints.length * 2.399) % 6.283, idx: j.kind === 'arm' ? arms++ : 0, a: new THREE.Euler(), q: new THREE.Quaternion(), lo, j2: lo && lo.userData.joint2 });
  });
  const kinds = new Set(joints.map((j) => j.kind));
  return { cr, joints, S, kinds, arms, cur: zero(), t: 0, gaitPh: 0, flapPh: 0, tmp: new THREE.Matrix4(), tmp2: new THREE.Matrix4() };
}

/** Three-way blend: idle -> wind-up (w) -> impact and back. strikeT is seconds since impact, or -1. */
export function strikePose(style, w, strikeT, power) {
  const st = STYLES[style] || STYLES.lunge, out = {}, amp = power ? 1.3 : 1;
  const A = st.slow ? 0.2 : 0.11, total = 0.55;
  const keys = new Set([...Object.keys(st.wind), ...Object.keys(st.hit)]);
  for (const k of keys) {
    const base = k === 'sy' ? 1 : 0, wv = st.wind[k] ?? base, hv = st.hit[k] ?? base;
    let val;
    if (strikeT < 0) val = base + (wv - base) * ease(clamp01(w));
    else if (strikeT < A) val = wv + (hv - wv) * easeOut(strikeT / A);
    else { const r = ease(clamp01((strikeT - A) / (total - A))); val = hv + ((st.spin && k === 'yaw' ? hv : base) - hv) * r; }
    out[k] = base + (val - base) * (k === 'yaw' || k === 'arm' || k === 'sy' ? 1 : amp);
  }
  if (st.arc && strikeT >= 0 && strikeT < A) out.y = (out.y || 0) + Math.sin(strikeT / A * Math.PI) * st.arc;
  if (st.run && strikeT >= 0 && strikeT < A + 0.1) out.gait = 1.5;
  return out;
}
export const STRIKE_LEN = 0.55;

/** Move the rig toward target channels T (smoothed), then set every joint. pose is the Object3D carrying the whole body. */
export function applyRig(rig, T, dt, pose, snap) {
  const c = rig.cur, k = snap ? 1 : Math.min(1, dt * 26);
  for (const key of CHANNELS) c[key] += ((T[key] ?? (key === 'sy' || key === 'wag' ? 1 : 0)) - c[key]) * (key === 'yaw' && Math.abs((T.yaw || 0) - c.yaw) > 3 ? 1 : k);
  rig.t += dt; rig.gaitPh += dt * (7 + 5 * Math.min(c.gait, 1.5)); rig.flapPh += dt * (5 + 16 * Math.min(Math.abs(c.flap), 1));
  // The body turns about its middle; lift it as it tips so the low end stays out of the ground.
  const tip = Math.abs(Math.sin(c.pitch)) * (rig.len || 0) * 0.42;
  pose.position.set(c.x, c.y + tip, c.z - (rig.len || 0) / 2); pose.rotation.set(c.pitch, c.yaw, c.roll); pose.scale.set(1 + (1 - c.sy) * 0.5, c.sy, 1 + (1 - c.sy) * 0.5);
  const t = rig.t, PM = rig.cr.M.U.uPM.value;
  for (const j of rig.joints) {
    let ax = 0, ay = 0, az = 0, bend = 0;
    const sidePh = j.side > 0 ? 0 : Math.PI;
    if (j.kind === 'leg') {
      const ph = rig.gaitPh + sidePh + (j.front ? 0 : Math.PI);
      // The knee folds as the leg swings forward, and the thigh leans the other way so the foot stays under the body.
      bend = (j.front ? c.kneeF : c.kneeH) + c.gait * 0.75 * Math.max(0, Math.sin(ph + 1.1));
      ax = c.gait * 0.55 * Math.sin(ph) + (j.front ? c.legF : c.legH) - bend * 0.5; az = c.legOut;
    }
    else if (j.kind === 'arm') { bend = (j.idx === rig.armSel || rig.armSel < 0 ? c.elbow : c.elbow * 0.3) - 0.18 - 0.06 * Math.sin(t * 1.6 + j.ph) - c.gait * 0.4 * Math.max(0, Math.sin(rig.gaitPh + sidePh)); ax = c.armAll + (j.idx === rig.armSel || rig.armSel < 0 ? c.arm : c.arm * 0.25) + 0.07 * Math.sin(t * 1.6 + j.ph) - c.gait * 0.4 * Math.sin(rig.gaitPh + sidePh); az = c.armOut + 0.03 * Math.sin(t * 1.3 + j.ph); }
    else if (j.kind === 'tentacle') { ax = c.tent * (0.55 + 0.45 * Math.sin(j.ph * 3)) + 0.13 * Math.sin(t * 1.7 + j.ph) + c.gait * 0.3 * Math.sin(rig.gaitPh + j.ph); az = 0.1 * Math.sin(t * 1.3 + j.ph * 2) + c.legOut * 0.6; }
    else if (j.kind === 'wing') { az = c.wing + (0.07 + 0.6 * c.flap) * Math.sin(rig.flapPh) ; ax = 0.04 * Math.sin(t * 1.1); }
    else { ay = c.tailYaw + 0.2 * c.wag * Math.sin(t * 2.4 + j.ph); ax = c.tailUp + 0.05 * Math.sin(t * 1.9); }
    j.a.set(ax, ay, az);
    j.q.setFromEuler(j.a);
    const p = j.pivot;
    j.node.matrix.makeRotationFromQuaternion(j.q);
    const e = j.node.matrix.elements, x = p.x, y = p.y, z = p.z;       // T(p) R T(-p)
    e[12] = x - (e[0] * x + e[4] * y + e[8] * z); e[13] = y - (e[1] * x + e[5] * y + e[9] * z); e[14] = z - (e[2] * x + e[6] * y + e[10] * z);
    j.node.matrixWorldNeedsUpdate = true;
    if (j.bone) { if (j.side > 0) PM[j.bone].copy(j.node.matrix); else PM[j.bone].copy(rig.S).multiply(j.node.matrix).multiply(rig.S); }
    if (j.lo) {                                   // the knee or elbow: turn the lower piece about its own pivot
      const m = j.lo.matrix.makeRotationAxis(j.j2.axis, bend), k = m.elements, q = j.j2.pivot;
      k[12] = q.x - (k[0] * q.x + k[4] * q.y + k[8] * q.z); k[13] = q.y - (k[1] * q.x + k[5] * q.y + k[9] * q.z); k[14] = q.z - (k[2] * q.x + k[6] * q.y + k[10] * q.z);
      j.lo.matrixWorldNeedsUpdate = true;
      if (j.j2.bone) { const B = PM[j.j2.bone].multiplyMatrices(j.node.matrix, m); if (j.side < 0) B.premultiply(rig.S).multiply(rig.S); }
    }
  }
}
export function resetBones(M) { for (const m of M.U.uPM.value) m.identity(); }
