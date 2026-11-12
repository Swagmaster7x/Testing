// The colosseum: scenery, the two fighters, the fight loop and its screens.
import * as THREE from 'three';
import { buildCreature, disposeTree, bounds } from './creature.js';
import { makeMaterials, applyLook } from './materials.js';
import { TEMPLATES } from './templates.js';
import { statsOf, traits, makeFighter, step, usePower, useGuard, ai, oppMul, championPoints, ROUNDS, HEAL } from './battle.js';
import { randomCreature } from './random.js';
import { rng } from './geom.js';

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const ease = (x) => x * x * (3 - 2 * x);

function canvasTex(w, hgt, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = hgt; draw(c.getContext('2d'), w, hgt);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function buildScenery() {
  const g = new THREE.Group(), R = 12;
  const sand = canvasTex(256, 256, (c, w, hh) => {
    c.fillStyle = '#d2a45c'; c.fillRect(0, 0, w, hh);
    for (let i = 0; i < 5000; i++) { c.fillStyle = `rgba(${Math.random() < 0.5 ? '90,60,30' : '255,235,190'},${Math.random() * 0.12})`; c.fillRect(Math.random() * w, Math.random() * hh, 1 + Math.random() * 3, 1 + Math.random() * 2); }
    const gr = c.createRadialGradient(w / 2, hh / 2, w * 0.1, w / 2, hh / 2, w / 2); gr.addColorStop(0, 'rgba(255,240,200,0.25)'); gr.addColorStop(1, 'rgba(60,35,15,0.45)');
    c.fillStyle = gr; c.fillRect(0, 0, w, hh);
  });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(R, 64), new THREE.MeshStandardMaterial({ map: sand, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; g.add(floor);
  const stone = new THREE.MeshStandardMaterial({ color: 0x8f775c, roughness: 0.95, side: THREE.DoubleSide });
  const dark = new THREE.MeshStandardMaterial({ color: 0x6d5d4c, roughness: 1, side: THREE.DoubleSide });
  // Wall and stepped seating, as one profile spun around the centre.
  const prof = [new THREE.Vector2(R, 0), new THREE.Vector2(R, 1.5)];
  for (let k = 0; k < 6; k++) prof.push(new THREE.Vector2(R + 0.5 + k * 1.15, 1.5 + k * 0.8), new THREE.Vector2(R + 0.5 + (k + 1) * 1.15, 1.5 + k * 0.8), new THREE.Vector2(R + 0.5 + (k + 1) * 1.15, 1.5 + (k + 1) * 0.8));
  prof.push(new THREE.Vector2(R + 8, 8.5));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 72), stone));
  const rimTop = new THREE.Mesh(new THREE.TorusGeometry(R, 0.14, 6, 72), dark); rimTop.rotation.x = Math.PI / 2; rimTop.position.y = 1.5; g.add(rimTop);
  // Crowd: a few hundred coloured blobs on the steps.
  const n = 900, crowd = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 6, 5), new THREE.MeshStandardMaterial({ roughness: 0.9 }), n);
  const m4 = new THREE.Matrix4(), col = new THREE.Color(), seats = [];
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * 6), a = Math.random() * Math.PI * 2, r = R + 1.05 + k * 1.15 + (Math.random() - 0.5) * 0.4;
    seats.push({ x: Math.cos(a) * r, y: 1.5 + k * 0.8 + 0.3, z: Math.sin(a) * r, ph: Math.random() * 6.28 });
    crowd.setColorAt(i, col.setHSL(Math.random(), 0.3 + Math.random() * 0.5, 0.25 + Math.random() * 0.35));
  }
  g.add(crowd);
  // Pillars, gates and banners.
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2, r = R + 7.7;
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 3.4, 10), stone); p.position.set(Math.cos(a) * r, 8.2, Math.sin(a) * r); g.add(p);
  }
  const lintel = new THREE.Mesh(new THREE.TorusGeometry(R + 7.7, 0.32, 6, 72), stone); lintel.rotation.x = Math.PI / 2; lintel.position.y = 10; g.add(lintel);
  const gateMat = new THREE.MeshStandardMaterial({ color: 0x2a1c12, roughness: 1 });
  for (const sx of [-1, 1]) { const gate = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.25), gateMat); gate.position.set(sx * (R - 0.02), 0.62, 0); gate.rotation.y = -sx * Math.PI / 2; g.add(gate); }
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.3;
    const b = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.0), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x9a1c1c : 0xd9a020, roughness: 0.8, side: THREE.DoubleSide }));
    b.position.set(Math.cos(a) * (R - 0.03), 0.9, Math.sin(a) * (R - 0.03)); b.lookAt(0, 0.9, 0); g.add(b);
  }
  const sky = canvasTex(4, 256, (c) => { const gr = c.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#2f5fa8'); gr.addColorStop(0.45, '#7fa6d0'); gr.addColorStop(1, '#e9c79a'); c.fillStyle = gr; c.fillRect(0, 0, 4, 256); });
  return { g, crowd, seats, m4, sky };
}

let audio = null;
function sfx(kind) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const t = audio.currentTime, o = audio.createOscillator(), gn = audio.createGain();
    const [f0, f1, dur, type, vol] = { hit: [150, 50, 0.14, 'triangle', 0.5], power: [220, 40, 0.3, 'sawtooth', 0.5], block: [700, 500, 0.09, 'square', 0.2], miss: [500, 800, 0.1, 'sine', 0.12], win: [440, 880, 0.6, 'triangle', 0.35], lose: [200, 60, 0.9, 'sawtooth', 0.3] }[kind];
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(gn).connect(audio.destination); o.start(t); o.stop(t + dur + 0.02);
  } catch (e) { /* no sound available */ }
}

/** env: { scene, camera, M (the player's materials), h (DOM helper), store, onDone(result) } */
export function createArena(env) {
  const { scene, camera, h, store } = env;
  const S = buildScenery(); S.g.visible = false; scene.add(S.g);
  const ME = makeMaterials();                 // the opponent gets its own set so the two looks do not clash
  const blobTex = canvasTex(64, 64, (c) => { const gr = c.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, 'rgba(0,0,0,0.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(0, 0, 64, 64); });
  const el = document.getElementById('battle');
  const A = { active: false, phase: 'off', run: null, data: null, views: [null, null], F: null, t: 0, phaseT: 0, enemy: null, shake: 0, cheer: 0, rand: Math.random, confetti: null };
  let keepBg = null;

  function makeView(data, mats, side) {
    applyLook(mats, data.look, TEMPLATES[data.type].bellyDir);
    const cr = buildCreature(data, mats), box = bounds(cr), size = box.getSize(new THREE.Vector3());
    const s = clamp(1.9 / Math.max(size.y, size.z * 0.85, size.x * 0.55, 0.6), 0.5, 2.4) * (0.85 + 0.35 * clamp(Math.cbrt(statsOf(data).hp / 200), 0.6, 1.4));
    const hover = data.type === 'aquatic' ? 0.45 : 0;
    cr.group.scale.setScalar(s);
    cr.group.position.set(-(box.min.x + box.max.x) / 2 * s, -box.min.y * s + hover, -box.max.z * s);
    const pose = new THREE.Group(), holder = new THREE.Group();
    pose.add(cr.group); holder.add(pose);
    const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2; blob.position.set(0, 0.01, -size.z * s / 2); blob.scale.set(Math.max(size.x * s, 0.6) * 1.3, size.z * s * 1.2, 1); holder.add(blob);
    holder.position.x = side * 0.5; holder.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
    S.g.add(holder);
    return { cr, mats, pose, holder, side, baseY: cr.group.position.y, half: size.x * s / 2, head: new THREE.Vector3(0, size.y * s + hover + 0.15, -size.z * s * 0.3), mid: new THREE.Vector3(0, size.y * s * 0.55 + hover, -size.z * s * 0.2), strike: -1, recoil: 0, flash: 0, dead: -1, ph: Math.random() * 6 };
  }
  function dropView(i) { const v = A.views[i]; if (!v) return; S.g.remove(v.holder); disposeTree(v.cr.group); A.views[i] = null; }
  function screenPos(v, local) {
    const p = local.clone(); v.holder.localToWorld(p); p.project(camera);
    return [(p.x * 0.5 + 0.5) * innerWidth, (-p.y * 0.5 + 0.5) * innerHeight];
  }
  function floater(i, text, cls) {
    const v = A.views[i]; if (!v) return;
    const [x, y] = screenPos(v, v.head);
    const d = h('div', { class: 'float ' + (cls || ''), style: `left:${x + (Math.random() - 0.5) * 40}px;top:${y}px` }, text);
    el.querySelector('.floaters').append(d); setTimeout(() => d.remove(), 1100);
  }

  // ---------------------------------------------------------------- screens
  function hud() {
    const names = [A.data.name, A.enemy ? A.enemy.name : ''];
    el.replaceChildren(
      h('div', { class: 'hud' },
        h('div', { class: 'who l' }, h('b', null, names[0]), h('div', { class: 'hp' }, h('i', { id: 'hp0' })), h('small', { id: 'st0' })),
        h('div', { class: 'round' }, h('small', null, 'Fight'), h('b', null, (A.run.round + 1) + ' / ' + ROUNDS)),
        h('div', { class: 'who r' }, h('b', null, names[1]), h('div', { class: 'hp' }, h('i', { id: 'hp1' })), h('small', { id: 'st1' }))),
      h('div', { class: 'msg', id: 'bmsg' }),
      h('div', { class: 'floaters' }),
      h('div', { class: 'acts' },
        h('button', { id: 'bpow', onpointerdown: (e) => { e.preventDefault(); if (A.phase === 'fight' && usePower(A.F[0])) sfx('miss'); } }, h('i'), h('span', null, 'Power strike')),
        h('button', { id: 'bgrd', onpointerdown: (e) => { e.preventDefault(); if (A.phase === 'fight' && useGuard(A.F[0])) sfx('block'); } }, h('i'), h('span', null, 'Guard'))));
  }
  function panel(...kids) { const p = h('div', { class: 'panel' }, kids); el.append(p); return p; }
  function statGrid(s) {
    return h('div', { class: 'stats' },
      ...[['Health', s.hp], ['Attack', s.atk.toFixed(1)], ['Armour', Math.round(s.def * 100) + '%'], ['Speed', s.spd.toFixed(2)]].map(([k, val]) => h('div', null, h('small', null, k), h('b', null, String(val)))));
  }
  function gate() {
    A.phase = 'gate'; el.replaceChildren();
    const s = statsOf(A.data), tr = traits(s);
    panel(h('h2', null, 'The Colosseum'),
      h('p', null, h('b', null, A.data.name), ' faces ten fights in a row against creatures from the pits. Each one is tougher than the last, and the tenth is the reigning champion.'),
      statGrid(s),
      h('p', { class: 'dim' }, tr.length ? 'Traits: ' + tr.join(', ') + '. ' : '', 'Size gives health. Teeth, claws, horns and clubs give attack. Scales, shell and plates give armour. Legs and wings give speed. Eyes help it land hits.'),
      h('p', { class: 'warn' }, 'Fights are to the death. If ' + A.data.name + ' dies, it is gone for good.'),
      h('div', { class: 'row' }, h('button', { onclick: () => finish({ type: 'back' }) }, 'Back to the workshop'), h('button', { class: 'go', onclick: () => { sfx('block'); nextFight(); } }, 'Enter the arena')));
  }
  function nextFight() {
    dropView(1);
    const boss = A.run.round === ROUNDS - 1;
    A.enemy = randomCreature(rng(A.run.seed + A.run.round * 7919), { titled: true });
    if (boss) A.enemy.name = A.enemy.name.split(' ')[0] + ', Champion of the Sands';
    A.views[1] = makeView(A.enemy, ME, 1);
    if (boss) A.views[1].holder.scale.setScalar(1.18);
    A.F = [makeFighter(statsOf(A.data)), makeFighter(statsOf(A.enemy), oppMul(A.run.round))];
    if (A.run.hp != null) A.F[0].hp = Math.min(A.F[0].max, A.run.hp);
    A.rand = Math.random;
    hud(); bars();
    document.getElementById('st1').textContent = traits(A.F[1].s).join(' · ');
    document.getElementById('st0').textContent = traits(A.F[0].s).join(' · ');
    A.phase = 'intro'; A.phaseT = 0;
    message(boss ? 'Final fight' : 'Fight ' + (A.run.round + 1), 'vs ' + A.enemy.name);
  }
  function message(big, small) { const m = document.getElementById('bmsg'); if (m) m.replaceChildren(big ? h('b', null, big) : '', small ? h('span', null, small) : ''); }
  function bars() {
    for (let i = 0; i < 2; i++) {
      const f = A.F[i], b = document.getElementById('hp' + i); if (!b) continue;
      const k = clamp(f.hp / f.max, 0, 1);
      b.style.width = (k * 100) + '%'; b.style.background = f.poison > 0 ? '#8fd14f' : k > 0.5 ? '#3fd0a4' : k > 0.25 ? '#ffb347' : '#ff5a4a';
    }
    const cd = (id, left, total, on) => { const b = document.getElementById(id); if (!b) return; b.firstChild.style.height = (clamp(left / total, 0, 1) * 100) + '%'; b.classList.toggle('armed', !!on); };
    cd('bpow', A.F[0].powerCd, 7, A.F[0].power); cd('bgrd', A.F[0].guardCd, 4.5, A.F[0].guard > 0);
  }
  function wonFight() {
    const f = A.F[0];
    A.run.round++; A.run.hp = Math.min(f.max, Math.max(1, f.hp) + f.max * HEAL);
    if (A.run.round >= ROUNDS) { champion(); return; }
    store.set('cc.run', A.run);
    A.phase = 'won';
    el.querySelector('.acts').classList.add('hidden'); message('', '');
    panel(h('h2', null, A.enemy.name.split(',')[0] + ' is dead'),
      h('p', null, A.data.name + ' rests and recovers some strength: ', h('b', null, Math.round(A.run.hp) + ' / ' + f.max), ' health.'),
      h('p', { class: 'dim' }, (ROUNDS - A.run.round) + (ROUNDS - A.run.round === 1 ? ' fight' : ' fights') + ' to go.' + (A.run.round === ROUNDS - 1 ? ' Only the champion remains.' : '')),
      h('div', { class: 'row' }, h('button', { class: 'go', onclick: () => { el.querySelector('.panel').remove(); nextFight(); } }, A.run.round === ROUNDS - 1 ? 'Face the champion' : 'Next fight'))).classList.add('low');
  }
  function champion() {
    A.phase = 'champion'; store.set('cc.run', null); sfx('win'); A.cheer = 6;
    const pts = championPoints(A.F[0].hp, A.F[0].max);
    dropView(1); A.views[0].holder.position.x = 0; A.views[0].holder.rotation.y = 0.35;
    // Confetti.
    const n = 260, geo = new THREE.PlaneGeometry(0.09, 0.14), cm = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), n), c = new THREE.Color();
    A.confetti = { mesh: cm, bits: [] };
    for (let i = 0; i < n; i++) { A.confetti.bits.push({ x: (Math.random() - 0.5) * 9, y: 3 + Math.random() * 7, z: (Math.random() - 0.5) * 5, v: 0.8 + Math.random() * 1.2, r: Math.random() * 6, w: 1 + Math.random() * 4 }); cm.setColorAt(i, c.setHSL(Math.random(), 0.9, 0.6)); }
    S.g.add(cm);
    el.replaceChildren(h('div', { class: 'floaters' }));
    panel(h('h2', { class: 'gold' }, 'Champion!'),
      h('p', null, h('b', null, A.data.name), ' won all ten fights and rules the Colosseum.'),
      h('div', { class: 'stats' }, h('div', null, h('small', null, 'Title'), h('b', null, '1000')), h('div', null, h('small', null, 'Health left'), h('b', null, '+' + (pts - 1000))), h('div', null, h('small', null, 'Points won'), h('b', { class: 'gold' }, String(pts)))),
      h('div', { class: 'row' }, h('button', { class: 'go', onclick: () => finish({ type: 'champion', points: pts }) }, 'Take the crown'))).classList.add('low');
  }
  function died() {
    A.phase = 'dead'; store.set('cc.run', null); sfx('lose');
    el.querySelector('.acts').classList.add('hidden'); message('', '');
    panel(h('h2', { class: 'red' }, A.data.name + ' has fallen'),
      h('p', null, 'Killed by ' + A.enemy.name + ' in fight ' + (A.run.round + 1) + ' of ' + ROUNDS + ', after ' + A.run.round + (A.run.round === 1 ? ' win.' : ' wins.')),
      h('p', { class: 'dim' }, 'The dead do not return. Build a new creature and try again.'),
      h('div', { class: 'row' }, h('button', { class: 'go', onclick: () => finish({ type: 'dead', round: A.run.round, by: A.enemy.name }) }, 'Create a new creature'))).classList.add('low');
  }
  function finish(result) {
    dropView(0); dropView(1);
    if (A.confetti) { S.g.remove(A.confetti.mesh); A.confetti.mesh.geometry.dispose(); A.confetti = null; }
    A.active = false; A.phase = 'off'; S.g.visible = false; scene.background = keepBg;
    el.classList.add('hidden'); el.replaceChildren();
    env.onDone(result);
  }

  // ---------------------------------------------------------------- per-frame
  function animate(v, i, dt, t) {
    const f = A.F && A.F[i];
    let z = 0, rx = 0, rz = 0, y = 0;
    if (v.dead >= 0) {
      v.dead += dt; const k = ease(clamp(v.dead / 0.7, 0, 1));
      rz = k * Math.PI / 2 * (i ? -1 : 1); y = Math.sin(k * Math.PI / 2) * v.half * 0.9; z = -0.3 * k;
    } else {
      y = Math.sin(t * 2 + v.ph) * 0.015;
      if (f && A.phase === 'fight' && f.t < 0.4 && v.strike < 0) { const w = ease(1 - f.t / 0.4); z -= 0.22 * w; rx -= 0.1 * w * (f.power ? 1.8 : 1); }
      if (v.strike >= 0) { v.strike += dt; const k = v.strike / 0.42; if (k >= 1) v.strike = -1; else { const s = k < 0.25 ? k / 0.25 : 1 - (k - 0.25) / 0.75; z += 0.8 * ease(s); rx += 0.12 * s; } }
      if (v.recoil > 0) { v.recoil = Math.max(0, v.recoil - dt * 3.5); z -= 0.3 * v.recoil; rx -= 0.14 * v.recoil; }
      if (A.phase === 'champion') y += Math.abs(Math.sin(t * 5)) * 0.18;
    }
    v.pose.position.set(0, y, z); v.pose.rotation.set(rx, 0, rz);
    v.flash = Math.max(0, v.flash - dt * 5);
    const guard = f && f.guard > 0 ? 0.25 : 0;
    for (const m of [v.mats.skin, ...v.mats.shells]) m.emissive.setRGB(v.flash * 0.9 + guard * 0.2, guard * 0.6, guard);
    v.holder.updateMatrixWorld(true);
    v.mats.U.uInv.value.copy(v.cr.group.matrixWorld).invert();
  }
  function onEvent(ev) {
    if (ev.type === 'poison') { floater(ev.on, '-' + ev.dmg, 'venom'); return; }
    const a = A.views[ev.by], d = A.views[1 - ev.by];
    a.strike = 0;
    if (ev.miss) { floater(1 - ev.by, 'Miss', 'dim'); sfx('miss'); return; }
    d.recoil = ev.blocked ? 0.3 : ev.power || ev.crit ? 1 : 0.6; if (!ev.blocked) d.flash = 1;
    A.shake = ev.blocked ? 0.05 : ev.power ? 0.3 : ev.crit ? 0.2 : 0.1; A.cheer = Math.max(A.cheer, ev.power || ev.crit ? 1 : 0.4);
    floater(1 - ev.by, (ev.blocked ? 'Blocked ' : '') + '-' + ev.dmg + (ev.crit ? '!' : ''), ev.blocked ? 'dim' : ev.power || ev.crit ? 'big' : '');
    if (ev.thorns) floater(ev.by, '-' + ev.thorns, 'dim');
    if (ev.venom) floater(1 - ev.by, 'Poisoned', 'venom');
    sfx(ev.blocked ? 'block' : ev.power ? 'power' : 'hit');
  }
  A.update = (dt, t) => {
    A.t += dt; A.phaseT += dt;
    if (A.phase === 'intro' && A.phaseT > 1.7) { A.phase = 'fight'; A.phaseT = 0; message('Fight!', ''); setTimeout(() => A.phase === 'fight' && message('', ''), 700); }
    if (A.phase === 'fight') {
      const evs = [], skill = 0.15 + 0.035 * A.run.round;
      let w = -1;
      for (let k = 0; k < 2 && w < 0; k++) { ai(A.F[1], A.F[0], dt / 2, A.rand, skill); w = step(A.F, dt / 2, A.rand, evs); }
      evs.forEach(onEvent); bars();
      if (w >= 0) { A.phase = 'ending'; A.phaseT = 0; A.winner = w; A.views[1 - w].dead = 0; A.cheer = 3; if (w === 0) sfx('win'); }
    }
    if (A.phase === 'ending' && A.phaseT > 1.6) { if (A.winner === 0) wonFight(); else died(); }
    for (let i = 0; i < 2; i++) if (A.views[i]) animate(A.views[i], i, dt, t);
    // Crowd bounce, camera sway and shake.
    A.cheer = Math.max(0, A.cheer - dt * 0.8);
    const amp = 0.03 + 0.14 * Math.min(A.cheer, 1);
    S.seats.forEach((s, i) => { S.m4.makeTranslation(s.x, s.y + Math.abs(Math.sin(t * 6 * (1 + (i % 5) * 0.2) + s.ph)) * amp, s.z); S.crowd.setMatrixAt(i, S.m4); });
    S.crowd.instanceMatrix.needsUpdate = true;
    if (A.confetti) {
      A.confetti.bits.forEach((b, i) => { b.y -= b.v * dt; if (b.y < 0) b.y = 8; S.m4.makeRotationFromEuler(new THREE.Euler(b.r + A.t * b.w, b.r * 2 + A.t * b.w * 0.7, 0)).setPosition(b.x + Math.sin(A.t + b.r) * 0.3, b.y, b.z); A.confetti.mesh.setMatrixAt(i, S.m4); });
      A.confetti.mesh.instanceMatrix.needsUpdate = true;
    }
    A.shake = Math.max(0, A.shake - dt * 1.2);
    const narrow = clamp(1.9 / camera.aspect, 1, 1.6);
    const win = A.phase === 'champion';
    camera.position.set(Math.sin(A.t * 0.25) * 0.8 + (Math.random() - 0.5) * A.shake, (win ? 1.7 : 2.1) + (Math.random() - 0.5) * A.shake, (win ? 6.2 : 8.2) * narrow);
    camera.lookAt(0, win ? 1.5 : 0.95, 0);
  };
  /** Start (or resume) a gauntlet with this creature. */
  A.start = (data, run) => {
    A.data = data; A.active = true; A.t = 0; A.enemy = null; A.F = null;
    A.run = run || { id: data.id, round: 0, hp: null, seed: Math.floor(Math.random() * 1e9) };
    keepBg = scene.background; scene.background = S.sky; S.g.visible = true;
    el.classList.remove('hidden');
    A.views[0] = makeView(data, env.M, -1);
    if (A.run.round > 0) {
      A.phase = 'won'; el.replaceChildren();
      panel(h('h2', null, 'Back to the sands'), h('p', null, A.data.name + ' has won ' + A.run.round + ' of ' + ROUNDS + ' fights and has ' + Math.round(A.run.hp) + ' health.'),
        h('div', { class: 'row' }, h('button', { class: 'go', onclick: () => nextFight() }, 'Next fight')));
    } else gate();
  };
  A.back = () => { if (A.phase === 'gate') finish({ type: 'back' }); return true; };
  return A;
}
