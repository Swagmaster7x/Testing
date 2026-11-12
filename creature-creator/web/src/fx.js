// Particles and other short-lived effects for the arena.
import * as THREE from 'three';

function system(blending, cap) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(cap * 3), col = new Float32Array(cap * 4), size = new Float32Array(cap);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('col', new THREE.BufferAttribute(col, 4)); geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending,
    uniforms: { uScale: { value: 400 } },
    vertexShader: 'attribute vec4 col; attribute float size; varying vec4 vCol; uniform float uScale;\nvoid main(){ vCol = col; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * uScale / -mv.z; gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec4 vCol;\nvoid main(){ float d = length(gl_PointCoord - 0.5) * 2.0; float a = smoothstep(1.0, 0.35, d) * vCol.a; if (a < 0.01) discard; gl_FragColor = vec4(vCol.rgb, a); }',
  });
  const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; pts.renderOrder = 5;
  return { pts, pos, col, size, cap, parts: [], geo, mat };
}

export function makeFx(parent) {
  const add = system(THREE.AdditiveBlending, 500), norm = system(THREE.NormalBlending, 400);
  parent.add(add.pts, norm.pts);
  const rings = [];
  const ringGeo = new THREE.RingGeometry(0.85, 1, 40);
  const c = new THREE.Color();
  const fx = {
    /** kind presets: spark, dust, blood, venom, fire, heal, star, magic, ink, web */
    burst(kind, at, n, o = {}) {
      const P = PRESET[kind] || PRESET.spark, sys = P.add ? add : norm;
      for (let i = 0; i < n; i++) {
        if (sys.parts.length >= sys.cap) sys.parts.shift();
        const a = Math.random() * 6.283, up = Math.random(), sp = P.speed * (0.4 + Math.random() * 0.8) * (o.speed || 1);
        const dir = o.dir || null;
        c.set(P.colors[Math.floor(Math.random() * P.colors.length)]);
        sys.parts.push({
          x: at.x + (Math.random() - 0.5) * (o.spread ?? P.spread), y: at.y + (Math.random() - 0.5) * (o.spread ?? P.spread), z: at.z + (Math.random() - 0.5) * (o.spread ?? P.spread),
          vx: Math.cos(a) * sp * (1 - up * 0.5) + (dir ? dir.x * sp * 1.5 : 0), vy: (up * P.up + (Math.random() - 0.3) * 0.5) * sp + (dir ? dir.y * sp : 0), vz: Math.sin(a) * sp * (1 - up * 0.5) + (dir ? dir.z * sp * 1.5 : 0),
          g: P.grav, drag: P.drag, life: 0, max: P.life * (0.6 + Math.random() * 0.7), s: P.size * (0.6 + Math.random() * 0.8) * (o.size || 1), grow: P.grow || 0, r: c.r, gr: c.g, b: c.b, a: P.alpha ?? 1,
        });
      }
    },
    ring(at, color, size = 1.6, flat = true) {
      const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
      m.position.copy(at); if (flat) m.rotation.x = -Math.PI / 2;
      m.userData = { t: 0, size }; parent.add(m); rings.push(m);
    },
    update(dt) {
      for (const sys of [add, norm]) {
        const ps = sys.parts; let n = 0;
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i]; p.life += dt;
          if (p.life >= p.max) continue;
          p.vy -= p.g * dt; const d = Math.max(0, 1 - p.drag * dt); p.vx *= d; p.vy *= d; p.vz *= d;
          p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
          if (p.y < 0.02 && p.g > 0) { p.y = 0.02; p.vy *= -0.3; p.vx *= 0.6; p.vz *= 0.6; }
          const k = p.life / p.max;
          sys.pos[n * 3] = p.x; sys.pos[n * 3 + 1] = p.y; sys.pos[n * 3 + 2] = p.z;
          sys.col[n * 4] = p.r; sys.col[n * 4 + 1] = p.gr; sys.col[n * 4 + 2] = p.b; sys.col[n * 4 + 3] = p.a * (1 - k * k);
          sys.size[n] = p.s * (1 + p.grow * k);
          ps[n++] = p;
        }
        ps.length = n;
        sys.geo.setDrawRange(0, n);
        sys.geo.attributes.position.needsUpdate = sys.geo.attributes.col.needsUpdate = sys.geo.attributes.size.needsUpdate = true;
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const m = rings[i]; m.userData.t += dt; const k = m.userData.t / 0.45;
        if (k >= 1) { parent.remove(m); m.material.dispose(); rings.splice(i, 1); continue; }
        m.scale.setScalar(0.2 + m.userData.size * (1 - (1 - k) * (1 - k))); m.material.opacity = (1 - k) * 0.8;
      }
    },
    resize(h) { add.mat.uniforms.uScale.value = norm.mat.uniforms.uScale.value = h * 0.9; },
    clear() { add.parts.length = norm.parts.length = 0; for (const m of rings) { parent.remove(m); m.material.dispose(); } rings.length = 0; },
  };
  return fx;
}
const PRESET = {
  spark: { add: true, colors: ['#fff2a0', '#ffd060', '#ffffff'], speed: 4.5, up: 0.8, grav: 9, drag: 1.5, life: 0.45, size: 0.09, spread: 0.1 },
  dust: { colors: ['#d9bb84', '#c9a56a', '#e9d2a4'], speed: 1.3, up: 0.6, grav: -0.3, drag: 2.5, life: 0.9, size: 0.3, spread: 0.3, grow: 1.6, alpha: 0.5 },
  blood: { colors: ['#b01818', '#d83030', '#7a0c0c'], speed: 2.6, up: 0.9, grav: 9, drag: 0.6, life: 0.7, size: 0.085, spread: 0.12 },
  venom: { colors: ['#8fe04a', '#5ab82a', '#c8ff7a'], speed: 0.9, up: 1.4, grav: -1.2, drag: 1.5, life: 0.9, size: 0.1, spread: 0.5, alpha: 0.85 },
  fire: { add: true, colors: ['#ff8a20', '#ffc040', '#ff4a10'], speed: 0.8, up: 2, grav: -3, drag: 1.2, life: 0.55, size: 0.2, spread: 0.5, grow: -0.6 },
  heal: { add: true, colors: ['#7affb0', '#c8ffd8', '#40e090'], speed: 0.6, up: 2.2, grav: -2, drag: 1, life: 0.9, size: 0.11, spread: 0.8 },
  star: { add: true, colors: ['#fff07a', '#ffffff'], speed: 1.6, up: 0.5, grav: 0, drag: 2, life: 0.6, size: 0.12, spread: 0.3 },
  magic: { add: true, colors: ['#c89aff', '#8a5aff', '#ffffff'], speed: 2.2, up: 0.8, grav: 0, drag: 2.5, life: 0.6, size: 0.13, spread: 0.3 },
  ink: { colors: ['#14101c', '#2a2438', '#0a0810'], speed: 1.4, up: 0.5, grav: -0.2, drag: 2, life: 1.5, size: 0.5, spread: 0.6, grow: 1.2, alpha: 0.75 },
  web: { colors: ['#ffffff', '#e8eef2'], speed: 2.4, up: 0.3, grav: 1, drag: 3, life: 1.1, size: 0.07, spread: 0.7 },
  shield: { add: true, colors: ['#7fd0ff', '#ffffff', '#4aa0ff'], speed: 2.5, up: 0.4, grav: 0, drag: 3, life: 0.35, size: 0.12, spread: 0.5 },
};
