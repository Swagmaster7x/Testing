// Creature Workshop: scene, touch controls and the editor UI.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { makeMaterials, applyLook } from './materials.js';
import { PARTS, CATS, defaultParams } from './parts.js';
import { TEMPLATES } from './templates.js';
import { createArena } from './arena.js';
import { ITEMS, BOOSTS, FREE_TYPES, TYPE_COST, PART_COST, newMeta, typeOpen, partOpen, itemOpen, describe, runsNow, addRun, clock } from './items.js';
import { showAd } from './ads.js';
import { randomCreature } from './random.js';
import { newCreature, addPart, buildCreature, rebuildPart, rebuildShells, disposeTree, bounds, placement, clamp } from './creature.js';

const $ = (id) => document.getElementById(id);
function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const [k, val] of Object.entries(props || {})) {
    if (k === 'class') e.className = val; else if (k === 'style') e.style.cssText = val;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), val); else if (val !== false && val != null) e[k] = val;
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(k);
  return e;
}
const store = {
  get(k, d) { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch (e) { return d; } },
  set(k, val) { try { localStorage.setItem(k, JSON.stringify(val)); } catch (e) { /* storage full or blocked */ } },
};
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add('hidden'), 2200); }

// ------------------------------------------------------------------ scene
const canvas = $('view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
{
  const c = document.createElement('canvas'); c.width = 4; c.height = 256;
  const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#3d7f86'); gr.addColorStop(0.55, '#1c3a40'); gr.addColorStop(1, '#0c1719');
  g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; scene.background = t;
}
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;
const sun = new THREE.DirectionalLight(0xfff2dd, 2.2); sun.position.set(2.5, 5, 4); scene.add(sun); scene.add(sun.target);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.025; sun.shadow.radius = 3;
Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 0.5, far: 22 });
const rim = new THREE.DirectionalLight(0x9fd8ff, 0.9); rim.position.set(-3, 2.5, -4); scene.add(rim);
scene.add(new THREE.HemisphereLight(0xcfeaff, 0x3a2f28, 0.5));
const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 100);
const M = makeMaterials();

const stage = new THREE.Group(); scene.add(stage);
const pad = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.06, 0.06, 64), new THREE.MeshStandardMaterial({ color: 0x24484c, roughness: 0.85 }));
const shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 0.55 }));
{
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  shadow.material.map = new THREE.CanvasTexture(c); shadow.material.color.set(0x000000);
  shadow.rotation.x = -Math.PI / 2;
}
pad.receiveShadow = true; shadow.material.opacity = 0.3;
stage.add(pad, shadow);
const overlay = new THREE.Group(); scene.add(overlay);       // selection marker + spine handles
const marker = new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 8, 32), new THREE.MeshBasicMaterial({ color: 0xffb347, depthTest: false, transparent: true, opacity: 0.9 }));
marker.renderOrder = 10; overlay.add(marker);
const handleGeo = new THREE.SphereGeometry(1, 16, 12);
const handleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true, opacity: 0.9 });
const handleSel = new THREE.MeshBasicMaterial({ color: 0xffb347, depthTest: false, transparent: true });
const handles = new THREE.Group(); overlay.add(handles);
const spineLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true, opacity: 0.6 }));
spineLine.renderOrder = 9; overlay.add(spineLine);

const controls = { orbit: null };
let data = null, cr = null, sel = null, tab = 'body', nodeSel = -1, spin = false, inEditor = false;
let undo = [], redo = [];

// ------------------------------------------------------------------ build / refresh
function rebuild() {
  if (cr) { stage.remove(cr.group); disposeTree(cr.group); }
  applyLook(M, data.look, TEMPLATES[data.type].bellyDir);
  cr = buildCreature(data, M);
  stage.add(cr.group);
  ground();
  refreshOverlay();
}
function ground() {
  dirty = true;
  const b = bounds(cr), c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
  const r = Math.max(s.x, s.z) * 0.42 + 0.15;
  pad.position.set(c.x, b.min.y - 0.03, c.z); pad.scale.set(r, 1, r);
  sun.target.position.copy(c); sun.position.copy(c).add(new THREE.Vector3(2.5, 5, 4));
  shadow.position.set(c.x, b.min.y + 0.004, c.z); shadow.scale.set(Math.max(s.x, 0.3) * 0.75, Math.max(s.z, 0.3) * 0.62, 1);
  cr.box = b;
}
function fitCamera(dirv) {
  const b = cr.box, c = b.getCenter(new THREE.Vector3()), rad = b.getSize(new THREE.Vector3()).length() / 2;
  const d = rad / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 0.74;
  controls.orbit.target.copy(c);
  camera.position.copy(c).add((dirv || new THREE.Vector3(0.75, 0.28, 1)).normalize().multiplyScalar(d));
  controls.orbit.minDistance = rad * 0.5; controls.orbit.maxDistance = d * 2.5;
  controls.orbit.update();
}
function refreshOverlay() {
  dirty = true;
  const showSpine = inEditor && tab === 'body';
  handles.visible = spineLine.visible = showSpine;
  while (handles.children.length) handles.remove(handles.children[0]);
  if (showSpine) {
    const pts = [], sub = (cr.frames.m - 1) / (data.nodes.length - 1);
    data.nodes.forEach((n, i) => {
      const p = cr.frames.C[Math.round(i * sub)];
      const m = new THREE.Mesh(handleGeo, i === nodeSel ? handleSel : handleMat);
      m.position.copy(p); m.userData.node = i; m.renderOrder = 11; handles.add(m); pts.push(p);
    });
    spineLine.geometry.dispose(); spineLine.geometry = new THREE.BufferGeometry().setFromPoints(pts);
  }
  const g = sel && sel !== 'body' && cr.parts.get(sel);
  marker.visible = !!(inEditor && g && g.userData.anchor);
  if (marker.visible) marker.position.copy(g.userData.anchor);
}
function commit() {
  const s = JSON.stringify(data);
  if (undo[undo.length - 1] !== s) { undo.push(s); if (undo.length > 60) undo.shift(); redo = []; }
  store.set('cc.current', data);
  if (inEditor && document.activeElement?.tagName !== 'INPUT') renderTop();
}
function restore(s) { data = JSON.parse(s); if (sel && sel !== 'body' && !data.parts.find((p) => p.id === sel)) sel = null; rebuild(); renderUI(); store.set('cc.current', data); }
const partOf = (id) => data.parts.find((p) => p.id === id);

// ------------------------------------------------------------------ thumbnails
const rt = new THREE.WebGLRenderTarget(256, 256, { samples: 4 });
const thumbCam = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
function snapshot(w, hgt, box, dirv, mime) {
  const c = box.getCenter(new THREE.Vector3()), rad = Math.max(box.getSize(new THREE.Vector3()).length() / 2, 0.01);
  thumbCam.aspect = w / hgt; thumbCam.updateProjectionMatrix();
  thumbCam.position.copy(c).add(dirv.clone().normalize().multiplyScalar(rad / Math.sin(THREE.MathUtils.degToRad(15)) * (w > hgt ? 0.92 : 1.02)));
  thumbCam.lookAt(c);
  rt.setSize(w, hgt);
  const ov = overlay.visible; overlay.visible = false;
  const tm = renderer.toneMapping; renderer.toneMapping = THREE.NoToneMapping;
  renderer.setRenderTarget(rt); renderer.render(scene, thumbCam); renderer.setRenderTarget(null);
  renderer.toneMapping = tm; overlay.visible = ov;
  const px = new Uint8Array(w * hgt * 4); renderer.readRenderTargetPixels(rt, 0, 0, w, hgt, px);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = hgt;
  const g = cv.getContext('2d'), img = g.createImageData(w, hgt), lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) lut[i] = Math.round(255 * Math.pow(Math.min(i / 255 * 1.1, 1), 1 / 2.2));
  for (let y = 0; y < hgt; y++) for (let x = 0; x < w; x++) {
    const s = ((hgt - 1 - y) * w + x) * 4, d = (y * w + x) * 4;
    img.data[d] = lut[px[s]]; img.data[d + 1] = lut[px[s + 1]]; img.data[d + 2] = lut[px[s + 2]]; img.data[d + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return cv.toDataURL(mime || 'image/jpeg', 0.85);
}
function creatureThumb(d) {
  const keep = cr, keepVis = pad.visible;
  if (keep) keep.group.visible = false;
  applyLook(M, d.look, TEMPLATES[d.type].bellyDir);
  const tmp = buildCreature(d, M); stage.add(tmp.group);
  pad.visible = shadow.visible = false;
  const url = snapshot(240, 192, bounds(tmp), new THREE.Vector3(0.8, 0.25, 1));
  stage.remove(tmp.group); disposeTree(tmp.group);
  pad.visible = shadow.visible = keepVis;
  if (keep) { keep.group.visible = true; applyLook(M, data.look, TEMPLATES[data.type].bellyDir); }
  return url;
}
const partThumbs = {};
const THUMB_LOOK = { base: '#9fb6b0', second: '#5c7a76', belly: '#c9d8d2', bellyAmt: 0.5, pattern: 0, patScale: 1, cover: 'skin', furLen: 0, furDroop: 0, accent: '#efe6cf', hair: '#d98a3a', membrane: '#d99a8a', eye: '#3f9f6a' };
function partThumb(kind) {
  if (partThumbs[kind]) return partThumbs[kind];
  const def = PARTS[kind];
  const d = { type: 'quadruped', sex: 'f', dimorph: 0, bulk: 1, stretch: 1, look: THUMB_LOOK, parts: [], nodes: [{ y: 0, z: -0.25, rx: 0.3, ry: 0.3 }, { y: 0, z: 0.25, rx: 0.3, ry: 0.3 }] };
  const where = { limbs: [0.5, 1.9], wings: [0.5, 0.9], tails: [-0.9, 0], back: [0.5, 0], mouth: [1.9, Math.PI], eyes: [1.3, 1.0] }[def.cat] || [0.6, 0.6];
  const keep = cr; if (keep) keep.group.visible = false;
  applyLook(M, d.look, [0, -1, 0]);
  const tmp = buildCreature(d, M);
  const part = addPart(d, kind, tmp.frames, where, { mirror: false, size: def.kind === 'surface' ? 0.3 : (def.ridge ? 0.18 : 0.7) });
  const g = rebuildPart(tmp, part);
  tmp.body.visible = def.ridge || kind === 'shell';
  stage.add(tmp.group);
  const pv = pad.visible; pad.visible = shadow.visible = false;
  const bg = scene.background; scene.background = new THREE.Color(0x16282b);
  const box = new THREE.Box3().setFromObject(def.ridge ? tmp.group : g);
  const dir = { mouth: [1, 0.3, 0.8], eyes: [0.6, 0.2, 1], tails: [1, 0.3, -0.3], limbs: [1, 0.15, 0.7] }[def.cat] || [1, 0.4, 0.8];
  const url = snapshot(112, 112, box, new THREE.Vector3(...dir), 'image/png');
  scene.background = bg; pad.visible = shadow.visible = pv;
  stage.remove(tmp.group); disposeTree(tmp.group);
  if (keep) { keep.group.visible = true; applyLook(M, data.look, TEMPLATES[data.type].bellyDir); }
  return (partThumbs[kind] = url);
}

// ------------------------------------------------------------------ layout + render loop
let freeRect = { x: 0, y: 0, w: 1, h: 1 };
function layout() {
  const W = window.innerWidth, H = window.innerHeight;
  renderer.setSize(W, H, false);
  if (arena.active) { camera.clearViewOffset(); camera.aspect = W / H; camera.zoom = 1; camera.updateProjectionMatrix(); return; }
  let L = 0, R = 0, T = 0;
  if (inEditor) {
    L = $('left').getBoundingClientRect().right; T = $('topbar').getBoundingClientRect().bottom;
    R = $('right').classList.contains('hidden') ? 0 : W - $('right').getBoundingClientRect().left;
  }
  freeRect = { x: L, y: T, w: Math.max(W - L - R, 50), h: Math.max(H - T, 50) };
  camera.aspect = W / H;
  const cx = L + freeRect.w / 2, cy = T + freeRect.h / 2;
  camera.setViewOffset(W, H, W / 2 - cx, H / 2 - cy, W, H);
  // Keep the creature the same apparent size in the free area as it would have full screen.
  camera.zoom = Math.min(freeRect.w, freeRect.h * 1.15) * 0.82 / H;
  camera.updateProjectionMatrix(); dirty = true;
}
window.addEventListener('resize', () => { if (inEditor && !arena.active) renderUI(); else layout(); });
let last = performance.now();
function frame(t) {
  requestAnimationFrame(frame);
  const dt = Math.min((t - last) / 1000, 0.1); last = t;
  if (window.__ccPause) return;               // test hook: lets a script drive frames by hand
  if (arena.active) { arena.update(dt, t / 1000); renderer.render(scene, camera); return; }
  if (!inEditor || !cr) return;
  controls.orbit.autoRotate = spin; controls.orbit.update(dt);
  if (pendingRebuild) { pendingRebuild = false; rebuild(); }
  // Only draw when something changed (saves battery).
  if (!dirty && !spin) return;
  dirty = false;
  const dist = camera.position.distanceTo(controls.orbit.target);
  const s = dist * 0.0075 / camera.zoom;
  handles.children.forEach((m) => m.scale.setScalar(s * (m.userData.node === nodeSel ? 1.5 : 1.1)));
  marker.scale.setScalar(s * 1.7); marker.quaternion.copy(camera.quaternion);
  renderer.render(scene, camera);
}
let pendingRebuild = false, dirty = true;
const touch = () => { dirty = true; };

// ------------------------------------------------------------------ touch: orbit, select, drag parts, drag spine
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
const down = { id: -1, x: 0, y: 0, t: 0, mode: null, moved: false, node: -1, count: 0 };
function setRay(e) { ptr.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera); }
function pickPart() {
  const hits = ray.intersectObject(cr.group, true);
  for (const hit of hits) { let o = hit.object; while (o && !o.userData.partId) o = o.parent; if (o) return o.userData.partId; }
  return null;
}
canvas.addEventListener('pointerdown', (e) => {
  if (!inEditor) return;
  down.count++;
  if (down.count > 1) { if (down.mode) endDrag(); down.mode = null; controls.orbit.enabled = true; return; }
  Object.assign(down, { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), mode: null, moved: false });
  setRay(e);
  if (tab === 'body') {
    const hs = ray.intersectObjects(handles.children);
    let best = -1, bd = 20;
    handles.children.forEach((m) => { const p = m.position.clone().project(camera); const dx = (p.x * 0.5 + 0.5) * innerWidth - e.clientX, dy = (-p.y * 0.5 + 0.5) * innerHeight - e.clientY; const d = Math.hypot(dx, dy); if (d < bd) { bd = d; best = m.userData.node; } });
    if (hs.length) best = hs[0].object.userData.node;
    if (best >= 0) { down.mode = 'node'; down.node = best; nodeSel = best; controls.orbit.enabled = false; refreshOverlay(); renderLeft(); return; }
  }
  if (sel && sel !== 'body' && pickPart() === sel) { down.mode = 'part'; controls.orbit.enabled = false; rebuildShells(cr, sel); }
}, true);
canvas.addEventListener('pointermove', (e) => {
  if (!inEditor || e.pointerId !== down.id) return;
  if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 9) down.moved = true;
  if (!down.mode || !down.moved) return;
  setRay(e);
  if (down.mode === 'node') {
    const hit = ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), new THREE.Vector3());
    if (hit) { const n = data.nodes[down.node]; n.y = hit.y; n.z = hit.z; pendingRebuild = true; }
  } else if (down.mode === 'part') {
    const hit = ray.intersectObject(cr.body, false)[0];
    if (hit && hit.uv) {
      const part = partOf(sel); part.u = hit.uv.x; part.a = hit.uv.y * Math.PI * 2;
      if (part.mirror) part.a = placement(part).a;
      rebuildPart(cr, part); refreshOverlay();
    }
  }
});
function endDrag() {
  if (down.mode === 'part') { rebuildShells(cr); ground(); }
  if (down.mode && down.moved) commit();
  controls.orbit.enabled = true;
}
function pointerEnd(e) {
  if (!inEditor) return;
  down.count = Math.max(0, down.count - 1);
  if (e.pointerId !== down.id) return;
  down.id = -1;
  const tap = !down.moved && performance.now() - down.t < 450;
  endDrag();
  if (tap && down.mode !== 'node') {
    setRay(e);
    const id = pickPart();
    select(id);
  }
  down.mode = null;
}
canvas.addEventListener('pointerup', pointerEnd); canvas.addEventListener('pointercancel', pointerEnd);
function select(id) {
  sel = id;
  if (id && id !== 'body') { const c = PARTS[partOf(id).kind].cat; if (tab !== c) { tab = c; } }
  if (id === 'body') { tab = 'body'; }
  renderUI();
}

// ------------------------------------------------------------------ UI pieces
function slider(label, min, max, val, oninput, onchange, step) {
  const out = h('span', null, '');
  const fill = () => inp.style.setProperty('--p', ((inp.value - min) / (max - min) * 100) + '%');
  const inp = h('input', { type: 'range', min, max, step: step || (max - min) / 200, value: val,
    oninput: () => { fill(); oninput(parseFloat(inp.value)); }, onchange: () => { (onchange || commit)(parseFloat(inp.value)); } });
  fill();
  return h('div', { class: 'sl' }, h('label', null, label, out), inp);
}
function chips(options, current, onpick) {
  return h('div', { class: 'chips' }, options.map(([val, label]) => h('button', { class: val === current ? 'on' : '', onclick: () => onpick(val) }, label)));
}
const SWATCHES = ['#f4f0e6', '#d9d2c2', '#a8a29a', '#6b6660', '#3a3632', '#14100e', '#f3e6d0', '#e8c9a0', '#c99573', '#a06a45', '#6b4a2e', '#3a2616',
  '#f2c230', '#e8a020', '#d9702a', '#c8501c', '#a8301c', '#701818', '#f2a0b0', '#e06a8a', '#c4472e', '#b03080', '#7a3aa0', '#4a2a7a',
  '#bfe8e0', '#7fc4d0', '#3a9fc2', '#2f7fc2', '#1f4f9a', '#1c2f5a', '#c8e6a0', '#9fb86a', '#4faa4a', '#2f6b3a', '#1f4a3a', '#12281a',
  '#e6dfa0', '#b8b060', '#7a8a3a', '#8fb0ab'];
const COLORS = [['base', 'Main'], ['second', 'Pattern'], ['belly', 'Belly'], ['eye', 'Eyes'], ['accent', 'Horn, claw'], ['hair', 'Hair, feather'], ['membrane', 'Wing skin'], ['cloth', 'Cloth']];
let colorSlot = 'base';
const needsRebuild = (k) => k === 'eye';
function setLook(k, val, final) {
  data.look[k] = val;
  if (needsRebuild(k) || k === 'cover') { if (final || k === 'cover') rebuild(); else pendingRebuild = true; } else applyLook(M, data.look, TEMPLATES[data.type].bellyDir);
  dirty = true;
  if (final) commit();
}

const ICONS = {
  body: '<path d="M7 5c5-3 11 1 10 7s-6 9-10 7-4-11 0-14z"/>', eyes: '<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  mouth: '<path d="M3 9c3 2 15 2 18 0-1 7-5 9-9 9s-8-2-9-9z"/><path d="M8 10l1 3 1.5-3M13.5 10l1.5 3 1-3"/>', ears: '<path d="M5 20C3 12 6 4 9 3c2 4 3 8 2 13M19 20c2-8-1-16-4-17-2 4-3 8-2 13"/>',
  horns: '<path d="M7 20c-4-5-4-12 0-17 0 6 2 9 5 11M17 20c4-5 4-12 0-17 0 6-2 9-5 11"/>', limbs: '<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6.5" r="2"/><circle cx="17" cy="9" r="2"/><path d="M7 17c0-3 2-5 5-5s5 2 5 5-2 3-5 3-5 0-5-3z"/>',
  wings: '<path d="M3 6c7-2 14 1 18 8-4-1-6 0-8 2-1-3-4-4-6-3 0-3-2-5-4-7z"/>', tails: '<path d="M4 18c6 2 12-2 12-7s-5-6-7-3 1 5 4 4"/>',
  back: '<path d="M2 18c4-6 16-6 20 0M7 13l1-5 2 4M12 12l1-6 1.5 6M16 13l2-4 0 5"/>', skin: '<path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z"/>',
};
const icon = (id) => { const s = document.createElement('span'); s.innerHTML = '<svg class="ic" viewBox="0 0 24 24">' + ICONS[id] + '</svg>'; return s.firstChild; };
function renderTabs() {
  const el = $('tabs'); el.replaceChildren();
  for (const [id, label] of [['body', 'Body'], ...CATS, ['skin', 'Skin']]) {
    el.append(h('button', { class: tab === id ? 'on' : '', onclick: () => { tab = id; sel = null; renderUI(); } }, icon(id), label));
  }
}
const compact = () => window.innerWidth < 1000;
function renderLeft() {
  const el = $('left'); el.replaceChildren(); el.scrollTop = 0;
  if (compact() && sel && sel !== 'body' && partOf(sel)) { inspector(el, partOf(sel)); return; }
  if (tab === 'body') {
    el.append(h('h3', null, 'Body shape'),
      h('p', { class: 'note' }, 'Drag the white dots to bend and stretch the spine. Tap a dot to change how thick the body is there.'));
    if (nodeSel >= 0 && data.nodes[nodeSel]) {
      const n = data.nodes[nodeSel];
      el.append(h('h4', null, 'Selected section'),
        slider('Width', 0.02, 0.6, n.rx, (x) => { n.rx = x; pendingRebuild = true; }),
        slider('Depth', 0.02, 0.6, n.ry, (x) => { n.ry = x; pendingRebuild = true; }),
        h('div', { class: 'row' },
          h('button', { onclick: () => {
            const i = Math.min(nodeSel, data.nodes.length - 2), a = data.nodes[i], b = data.nodes[i + 1];
            const old = data.nodes.length - 1;
            data.nodes.splice(i + 1, 0, { y: (a.y + b.y) / 2, z: (a.z + b.z) / 2, rx: (a.rx + b.rx) / 2, ry: (a.ry + b.ry) / 2, role: b.role });
            for (const p of data.parts) if (p.u >= 0 && p.u <= 1) { const k = p.u * old; p.u = (k > i ? (k < i + 1 ? i + (k - i) * 2 : k + 1) : k) / (old + 1); }
            nodeSel = i + 1; rebuild(); commit(); renderLeft();
          } }, 'Add section'),
          h('button', { class: 'warn', disabled: data.nodes.length <= 3, onclick: () => {
            const old = data.nodes.length - 1, i = nodeSel;
            data.nodes.splice(i, 1);
            for (const p of data.parts) if (p.u >= 0 && p.u <= 1) { const k = p.u * old; p.u = clamp((k > i ? k - 1 : k) / (old - 1), 0, 1); }
            nodeSel = -1; rebuild(); commit(); renderLeft();
          } }, 'Remove')));
    }
    const scaleSpine = (f) => {
      const cy = data.nodes.reduce((s, n) => s + n.y, 0) / data.nodes.length, cz = data.nodes.reduce((s, n) => s + n.z, 0) / data.nodes.length;
      for (const n of data.nodes) { n.y = cy + (n.y - cy) * f; n.z = cz + (n.z - cz) * f; }
      rebuild(); commit();
    };
    el.append(h('h4', null, 'Whole body'),
      h('div', { class: 'row' }, h('button', { onclick: () => scaleSpine(1.08) }, 'Longer'), h('button', { onclick: () => scaleSpine(1 / 1.08) }, 'Shorter')),
      slider('Bulk', 0.5, 1.8, data.bulk, (x) => { data.bulk = x; pendingRebuild = true; }),
      h('h4', null, 'Male / female'),
      h('p', { class: 'note' }, 'How different the two sexes look: build, limb thickness, and the size of horns, crests and manes.'),
      slider('Difference', 0, 1.6, data.dimorph, (x) => { data.dimorph = x; pendingRebuild = true; }));
    return;
  }
  if (tab === 'skin') {
    const L = data.look;
    el.append(h('h3', null, 'Skin and colour'), h('h4', null, 'Covering'),
      chips([['skin', 'Smooth'], ['fur', 'Fur'], ['scales', 'Scales'], ['chitin', 'Shell'], ['slime', 'Slick']], L.cover, (x) => { setLook('cover', x, true); renderLeft(); }));
    if (L.cover === 'fur') el.append(
      slider('Fur length', 0, 1, L.furLen, (x) => setLook('furLen', x)),
      slider('Shagginess', 0, 1, L.furDroop, (x) => setLook('furDroop', x)));
    el.append(h('h4', null, 'Colours'),
      h('div', { class: 'cols' }, COLORS.map(([k, label]) => h('button', { class: 'colbtn' + (colorSlot === k ? ' on' : ''), onclick: () => { colorSlot = k; renderLeft(); } }, h('i', { style: 'background:' + L[k] }), label))),
      h('div', { class: 'sw' }, SWATCHES.map((c) => h('button', { style: 'background:' + c, onclick: () => { setLook(colorSlot, c, true); renderLeft(); } }))));
    const hsl = {}; new THREE.Color(L[colorSlot]).getHSL(hsl);
    const upd = (final) => { setLook(colorSlot, '#' + new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l).getHexString(), final); if (final) renderLeft(); };
    el.append(slider('Hue', 0, 1, hsl.h, (x) => { hsl.h = x; upd(); }, () => upd(true)),
      slider('Richness', 0, 1, hsl.s, (x) => { hsl.s = x; upd(); }, () => upd(true)),
      slider('Lightness', 0.03, 0.97, hsl.l, (x) => { hsl.l = x; upd(); }, () => upd(true)),
      h('h4', null, 'Pattern'),
      chips([[0, 'Plain'], [1, 'Stripes'], [2, 'Spots'], [3, 'Patches'], [4, 'Mosaic'], [5, 'Saddle'], [6, 'Speckle'], [7, 'Bands']], L.pattern, (x) => { setLook('pattern', x, true); renderLeft(); }),
      slider('Pattern size', 0.3, 3.5, 3.8 - L.patScale, (x) => setLook('patScale', 3.8 - x)),
      slider('Belly colour', 0, 1, L.bellyAmt, (x) => setLook('bellyAmt', x)),
      h('div', { class: 'row' }, h('button', { onclick: () => {
        const hue = Math.random(), c = (hh, s, l) => '#' + new THREE.Color().setHSL((hh + 1) % 1, s, l).getHexString();
        Object.assign(L, { base: c(hue, 0.3 + Math.random() * 0.5, 0.3 + Math.random() * 0.35), second: c(hue + (Math.random() - 0.5) * 0.5, 0.4 + Math.random() * 0.4, 0.12 + Math.random() * 0.3), belly: c(hue + 0.05, 0.25, 0.8),
          hair: c(hue + 0.5 * Math.random(), 0.5, 0.25 + Math.random() * 0.3), membrane: c(hue + 0.08, 0.45, 0.6), eye: c(Math.random(), 0.75, 0.45), pattern: Math.floor(Math.random() * 8) });
        rebuild(); commit(); renderLeft();
      } }, 'Surprise me')));
    return;
  }
  el.append(h('h3', null, CATS.find((c) => c[0] === tab)[1]), h('p', { class: 'note' }, 'Tap to add. Then tap the part on your creature and drag it where you want it.'));
  const grid = h('div', { class: 'grid' });
  for (const [kind, def] of Object.entries(PARTS)) if (def.cat === tab) {
    if (partOpen(meta, kind)) grid.append(h('button', { class: 'tile', onclick: () => { const p = addPart(data, kind, cr.frames); rebuild(); commit(); select(p.id); } }, h('img', { src: partThumb(kind), alt: '' }), def.n));
    else grid.append(h('button', { class: 'tile locked', onclick: () => buy('part:' + kind, PART_COST[kind], def.n, renderLeft) }, h('img', { src: partThumb(kind), alt: '' }), def.n, h('small', null, 'Locked · ' + PART_COST[kind])));
  }
  el.append(grid);
}
const END_NAMES = { human: 'Toes', paw: 'Paw', hoof: 'Hoof', talon: 'Talons', webbed: 'Webbed', stump: 'Stump', point: 'Spike', none: 'None', claw: 'Claws', pincer: 'Pincer', mitt: 'Mitt' };
function renderRight() {
  const el = $('right'), part = sel && sel !== 'body' ? partOf(sel) : null;
  el.classList.toggle('hidden', !part || compact());
  el.replaceChildren();
  if (part && !compact()) inspector(el, part);
}
function inspector(el, part) {
  const def = PARTS[part.kind];
  const renderRight = () => { el.replaceChildren(); inspector(el, part); };
  const live = () => { rebuildPart(cr, part); refreshOverlay(); };
  const done = () => { rebuildShells(cr); ground(); commit(); };
  const base = part.size;
  el.append(h('h3', null, def.n), h('p', { class: 'note' }, def.ridge ? 'Drag it along the body to move the row.' : 'Drag it on the creature to move it.'),
    slider(def.cat === 'limbs' ? 'Length' : 'Size', -2, 2, 0, (x) => { part.size = base * Math.pow(2, x); live(); }, done));
  for (const [k, s] of Object.entries(def.P || {})) {
    if (k === 'suckers') { el.append(chips([[1, 'Suckers'], [0, 'Smooth']], part.p[k], (x) => { part.p[k] = x; live(); done(); renderRight(); })); continue; }
    el.append(slider(s[3], s[0], s[1], part.p[k] ?? s[2], (x) => { part.p[k] = x; live(); }, done, ['count', 'feathers', 'tines'].includes(k) ? 1 : 0));
  }
  if (def.C) for (const [k, opts] of Object.entries(def.C)) {
    el.append(h('h4', null, opts.includes('paw') ? 'Foot' : 'Hand'), chips(opts.map((o) => [o, END_NAMES[o]]), part.p[k], (x) => { part.p[k] = x; live(); done(); renderRight(); }));
  }
  if (def.kind === 'surface') el.append(h('h4', null, 'Angle'),
    slider('Twist', -3.14, 3.14, part.rot, (x) => { part.rot = x; live(); }, done),
    slider('Tilt', -1.5, 1.5, part.tilt, (x) => { part.tilt = x; live(); }, done));
  el.append(h('h4', null, 'Pair'), chips([[true, 'Mirrored pair'], [false, 'Single']], part.mirror, (x) => { part.mirror = x; live(); done(); renderRight(); }));
  el.append(h('h4', null, 'Shown on'), chips([[null, 'Both'], ['f', 'Female only'], ['m', 'Male only']], part.sexOnly, (x) => { part.sexOnly = x; live(); done(); renderRight(); }),
    h('div', { class: 'row', style: 'margin-top:10px' },
      h('button', { onclick: () => { const c = JSON.parse(JSON.stringify(part)); c.id = 'p' + Date.now().toString(36); c.u = clamp(c.u - 0.08, -0.9, 1.9); data.parts.push(c); rebuild(); commit(); select(c.id); } }, 'Copy'),
      h('button', { class: 'warn', onclick: () => { data.parts = data.parts.filter((p) => p.id !== part.id); sel = null; rebuild(); commit(); renderUI(); } }, 'Delete')),
    h('div', { class: 'row' }, h('button', { onclick: () => select(null) }, 'Done')));
}
function renderTop() {
  const el = $('topbar'); el.replaceChildren(
    h('button', { onclick: goHome }, 'Home'),
    h('input', { value: data.name, maxLength: 30, onchange: (e) => { data.name = e.target.value || 'Creature'; commit(); } }),
    h('div', { class: 'seg' },
      h('button', { class: data.sex === 'f' ? 'on' : '', onclick: () => setSex('f') }, 'Female'),
      h('button', { class: data.sex === 'm' ? 'on' : '', onclick: () => setSex('m') }, 'Male')),
    h('button', { disabled: undo.length < 2, onclick: () => { if (undo.length > 1) { redo.push(undo.pop()); restore(undo[undo.length - 1]); } } }, 'Undo'),
    h('button', { disabled: !redo.length, onclick: () => { if (redo.length) { const s = redo.pop(); undo.push(s); restore(s); } } }, 'Redo'),
    h('button', { class: spin ? 'on' : '', onclick: () => { spin = !spin; renderTop(); } }, 'Spin'),
    h('button', { onclick: photo }, 'Photo'),
    h('button', { onclick: () => save() }, 'Save'),
    h('button', { class: 'battle', onclick: enterBattle }, '⚔️ Battle'));
}
function setSex(s) { data.sex = s; rebuild(); commit(); renderUI(); }
function renderUI() {
  renderTabs(); renderLeft(); renderRight(); renderTop(); layout(); refreshOverlay();
  $('hint').textContent = sel && sel !== 'body' ? '' : 'Drag to spin. Pinch to zoom. Tap a part to select it.';
}

// ------------------------------------------------------------------ save, photo, start screen
function save(quiet) {
  if (!data.id) data.id = 'c' + Date.now().toString(36);
  const list = store.get('cc.saved', []).filter((c) => c.id !== data.id);
  list.unshift({ id: data.id, name: data.name, thumb: creatureThumb(data), data: JSON.parse(JSON.stringify(data)) });
  store.set('cc.saved', list); store.set('cc.current', data);
  if (!quiet) toast('Saved "' + data.name + '"');
}

// ------------------------------------------------------------------ colosseum
// Meta progress: points, unlocks, boosts and revives. Kept across creatures.
let meta = store.get('cc.meta', null);
if (!meta) {
  meta = Object.assign(newMeta(), store.get('cc.record', {}));
  // Anything already built before the shop existed stays usable.
  for (const c of [...store.get('cc.saved', []).map((x) => x.data), store.get('cc.current', null)]) if (c && !FREE_TYPES.includes(c.type)) meta.unlocked['type:' + c.type] = true;
}
meta = Object.assign(newMeta(), meta);
const saveMeta = () => store.set('cc.meta', meta);
function buy(key, cost, label, then) {
  if (meta.points < cost) { toast('Not enough points: ' + label + ' costs ' + cost + ', you have ' + meta.points + '.'); return; }
  if (!confirm('Unlock ' + label + ' for ' + cost + ' points?')) return;
  meta.points -= cost; meta.unlocked[key] = true; saveMeta(); toast('Unlocked ' + label); then && then();
}
const arena = createArena({ scene, camera, M, h, store, sun, showAd, toast, onDone: battleDone, meta: () => meta, saveMeta });
function enterBattle(run) {
  save(true);
  sel = null; controls.orbit.enabled = false;
  $('editor').classList.add('hidden'); $('start').classList.add('hidden');
  stage.visible = overlay.visible = false;
  applyLook(M, data.look, TEMPLATES[data.type].bellyDir);
  arena.start(data, run && run.id === data.id ? run : null);
  layout();
}
function battleDone(res) {
  stage.visible = overlay.visible = true; controls.orbit.enabled = true;
  for (const m of [M.skin, ...M.shells]) m.emissive.setRGB(0, 0, 0);
  const rec = meta;
  if (res.type === 'dead') {
    rec.fallen++; saveMeta();
    store.set('cc.saved', store.get('cc.saved', []).filter((c) => c.id !== data.id));
    store.set('cc.current', null);
    if (cr) { stage.remove(cr.group); disposeTree(cr.group); cr = null; }
    data = null; inEditor = false;
    $('start').classList.remove('hidden'); renderStart(); layout();
    return;
  }
  if (res.type === 'champion') {
    rec.points += res.points; rec.champions++; saveMeta();
    data.champion = (data.champion || 0) + 1;
  }
  inEditor = true; $('editor').classList.remove('hidden');
  rebuild(); if (res.type === 'champion') save(true);
  renderUI(); fitCamera();
  if (res.type === 'champion') toast(data.name + ' is champion! +' + res.points + ' points');
}
function photo() {
  const W = 1920, H = 1080, pr = renderer.getPixelRatio();
  const keepZoom = camera.zoom; overlay.visible = false;
  renderer.setPixelRatio(1); renderer.setSize(W, H, false);
  camera.clearViewOffset(); camera.aspect = W / H; camera.zoom = keepZoom; camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  const url = canvas.toDataURL('image/png');
  overlay.visible = true; renderer.setPixelRatio(pr); camera.zoom = keepZoom; layout(); renderer.render(scene, camera);
  const name = (data.name || 'creature').replace(/[^\w-]+/g, '_') + '_' + Date.now().toString(36) + '.png';
  if (window.Android && window.Android.savePng) window.Android.savePng(url.split(',')[1], name);
  else { h('a', { href: url, download: name }).click(); toast('Photo downloaded'); }
}
window.ccToast = toast;
// Android back button: close the part panel, then leave the editor, then let the app close.
window.ccBack = () => { if (arena.active) return arena.back(); if (!inEditor && shopTab) { shopTab = null; renderStart(); return true; } if (!inEditor) return false; if (sel) select(null); else goHome(); return true; };
function open(d) {
  const run = store.get('cc.run', null);
  if (run && d.id && run.id === d.id) { store.set('cc.run', null); toast('Gauntlet abandoned. It starts again from fight one.'); }
  data = d; sel = null; nodeSel = -1; tab = 'body'; undo = []; redo = []; inEditor = true;
  if (data.sex === undefined) data.sex = 'f';
  if (!data.look.cloth) data.look.cloth = '#6b4a2e';
  $('start').classList.add('hidden'); $('editor').classList.remove('hidden');
  rebuild(); commit(); renderUI(); fitCamera();
}
function goHome() {
  store.set('cc.current', data);
  inEditor = false; $('editor').classList.add('hidden'); $('start').classList.remove('hidden');
  renderStart();
}
const typeThumbs = {};
function tickRunPill() {
  const el = $('runpill'); if (!el) return;
  const r = runsNow(meta);
  el.textContent = '⚡ ' + r.n + '/' + r.max + (r.next ? ' · ' + clock(r.next) + ' · 📺 +1' : '');
}
setInterval(tickRunPill, 1000);
let shopTab = null;
function renderShop() {
  const el = $('start');
  const row = (icon, name, text, cost, owned, onbuy, extra) => h('div', { class: 'shoprow' + (owned ? ' owned' : '') }, h('div', { class: 'ico' }, icon), h('div', { class: 'what' }, h('b', null, name), extra && h('small', { class: 'req' }, extra), h('small', null, text)),
    owned ? h('span', { class: 'have' }, typeof owned === 'string' ? owned : 'Owned') : h('button', { class: meta.points >= cost ? 'go' : '', onclick: onbuy }, cost + ' pts'));
  const itemRows = (cat) => ITEMS.filter((it) => it.cat === cat).sort((a, b) => a.cost - b.cost).map((it) =>
    row(it.icon, it.name, describe({ id: it.id, cat, q: 1, rar: 0, lvl: 1 }), it.cost, itemOpen(meta, it) && (it.cost ? 'Owned' : 'Free'), () => buy('item:' + cat + ':' + it.id, it.cost, it.name, renderStart), it.reqText ? 'Needs ' + it.reqText : (it.hands === 2 ? 'Needs two free hands' : '')));
  const tabs = {
    Bodies: () => Object.entries(TEMPLATES).map(([id, t]) => row('🧬', t.name, t.blurb, TYPE_COST[id], typeOpen(meta, id) && (TYPE_COST[id] ? 'Owned' : 'Free'), () => buy('type:' + id, TYPE_COST[id], 'the ' + t.name + ' body', renderStart))),
    Parts: () => Object.entries(PART_COST).map(([k, cost]) => row(h('img', { src: partThumb(k), alt: '' }), PARTS[k].n, 'Body part for the workshop (' + CATS.find((c) => c[0] === PARTS[k].cat)[1] + ').', cost, partOpen(meta, k), () => buy('part:' + k, cost, PARTS[k].n, renderStart))),
    Weapons: () => itemRows('weapon'), Abilities: () => itemRows('ability'), Relics: () => itemRows('relic'),
    Boosts: () => BOOSTS.map((b) => {
      const lvl = b.consumable ? meta.revives : (meta.boosts[b.id] || 0), full = lvl >= b.max, cost = b.cost(lvl);
      return row(b.icon, b.name + (b.consumable ? ' (holding ' + lvl + ')' : b.max > 1 ? ' (level ' + lvl + ' of ' + b.max + ')' : ''), b.text, cost, full && (b.consumable ? 'Full' : 'Maxed'), () => {
        if (meta.points < cost) { toast('Not enough points: ' + b.name + ' costs ' + cost + ', you have ' + meta.points + '.'); return; }
        meta.points -= cost; if (b.consumable) meta.revives++; else meta.boosts[b.id] = lvl + 1; saveMeta(); renderStart();
      });
    }),
  };
  const notes = { Weapons: 'Weapons you own can turn up as rewards after a fight. A creature holds one per hand.', Abilities: 'Abilities you own can turn up as rewards, if the creature has the right body for them.', Relics: 'Relics are passive rewards that stack. Many only work, or work better, with the right body.', Parts: 'Extra parts for building creatures. Starter creatures may already carry some of these.', Bodies: 'New body types to start from.', Boosts: 'Permanent upgrades, and revives.' };
  el.replaceChildren(h('h1', null, 'The ', h('span', null, 'Shop'), h('small', { class: 'record' }, h('b', null, meta.points + ' points'), ' ', h('button', { class: 'shopbtn', onclick: () => { shopTab = null; renderStart(); } }, 'Back'))),
    h('div', { class: 'chips', style: 'margin-top:10px' }, Object.keys(tabs).map((t) => h('button', { class: t === shopTab ? 'on' : '', onclick: () => { shopTab = t; renderStart(); } }, t))),
    h('p', { class: 'note' }, notes[shopTab] + ' Points come from every fight won (more for later fights) and a big bonus for the title.'),
    h('div', { class: 'shop' }, tabs[shopTab]()));
  el.scrollTop = 0;
}
function renderStart() {
  const el = $('start'), saved = store.get('cc.saved', []), cur = store.get('cc.current', null);
  if (shopTab) { renderShop(); return; }
  const rec = meta, run = store.get('cc.run', null);
  const runOk = run && cur && cur.id === run.id;
  el.replaceChildren(...[h('h1', null, 'Creature ', h('span', null, 'Workshop'),
      h('small', { class: 'record' }, h('span', { class: 'runpill', id: 'runpill', onclick: async () => { const r = runsNow(meta); if (r.n >= r.max) return; const a = await showAd(); if (a.ok) { addRun(meta); saveMeta(); tickRunPill(); toast('+1 run'); } else if (a.why) toast(a.why); } }), h('button', { class: 'shopbtn', onclick: () => { shopTab = 'Bodies'; renderStart(); } }, 'Shop'), ' ', h('b', null, rec.points + ' points'), ' · ' + rec.champions + (rec.champions === 1 ? ' champion' : ' champions') + ' · ' + rec.fallen + ' fallen')),
    runOk && h('div', { class: 'card resume', onclick: () => { data = cur; enterBattle(run); } }, h('b', null, 'Gauntlet in progress'), h('small', null, cur.name + ' is waiting for fight ' + (run.round + 1) + ' of 10. Tap to return to the Colosseum.')),
    h('h2', null, 'Start from a body type'),
    h('div', { class: 'cards' }, h('div', { class: 'card', onclick: () => { const open_ = Object.keys(TEMPLATES).filter((t) => typeOpen(meta, t)); open(randomCreature(Math.random, { type: open_[Math.floor(Math.random() * open_.length)] })); } }, h('div', { class: 'dice' }, '?'), h('b', null, 'Random'), h('small', null, 'Roll a surprise creature')),
      Object.entries(TEMPLATES).map(([id, t]) =>
      typeOpen(meta, id)
        ? h('div', { class: 'card', onclick: () => open(newCreature(id)) }, h('img', { src: typeThumbs[id] || (typeThumbs[id] = creatureThumb(newCreature(id))), alt: '' }), h('b', null, t.name), h('small', null, t.blurb))
        : h('div', { class: 'card locked', onclick: () => buy('type:' + id, TYPE_COST[id], 'the ' + t.name + ' body', renderStart) }, h('img', { src: typeThumbs[id] || (typeThumbs[id] = creatureThumb(newCreature(id))), alt: '' }), h('b', null, t.name), h('small', null, 'Locked · ' + TYPE_COST[id] + ' points'))))].filter(Boolean));
  tickRunPill();
  if (cur || saved.length) el.append(h('h2', null, 'Your creatures'),
    h('div', { class: 'cards' },
      cur && h('div', { class: 'card', onclick: () => open(cur) }, h('img', { src: creatureThumb(cur), alt: '' }), h('b', null, 'Continue'), h('small', null, cur.name)),
      saved.map((c) => h('div', { class: 'card', onclick: () => open(JSON.parse(JSON.stringify(c.data))) }, h('img', { src: c.thumb, alt: '' }), h('b', null, c.name), h('small', null, TEMPLATES[c.data.type].name + (c.data.champion ? ' · Champion' + (c.data.champion > 1 ? ' x' + c.data.champion : '') : '')),
        h('button', { class: 'del warn', onclick: (e) => { e.stopPropagation(); if (confirm('Delete "' + c.name + '"?')) { store.set('cc.saved', store.get('cc.saved', []).filter((x) => x.id !== c.id)); renderStart(); } } }, '×')))));
}

controls.orbit = new OrbitControls(camera, canvas);
Object.assign(controls.orbit, { enableDamping: true, dampingFactor: 0.12, enablePan: false, autoRotateSpeed: 2.2, rotateSpeed: 0.9, maxPolarAngle: Math.PI * 0.62, minPolarAngle: 0.15 });
controls.orbit.addEventListener('change', touch);
layout();
renderStart();
requestAnimationFrame(frame);
window.__cc = { get data() { return data; }, get cr() { return cr; }, open, newCreature, select, PARTS, TEMPLATES, setTab: (t) => { tab = t; renderUI(); }, camera, controls, fitCamera, rebuild, renderer, scene, arena, get meta() { return meta; }, saveMeta, renderStart, runsNow, enterBattle, randomCreature, addPartTest: (k) => addPart(data, k, cr.frames), pickAt: (x, y) => { setRay({ clientX: x, clientY: y }); return pickPart(); }, state: () => ({ sel, tab, down: { ...down } }) };
