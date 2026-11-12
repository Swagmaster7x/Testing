// Creature Workshop: scene, touch controls and the editor UI.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { makeMaterials, applyLook } from './materials.js';
import { PARTS, CATS, defaultParams } from './parts.js';
import { TEMPLATES } from './templates.js';
import { createArena } from './arena.js';
import { ITEMS, BOOSTS, FREE_TYPES, TYPE_COST, PART_COST, newMeta, typeOpen, partOpen, itemOpen, describe, runsNow, addRun, clock, GOALS, goalDone, goalsReady, dailyGift, claimDaily, LEVELS, PRODUCTS, RUN_MS, runMax, weeklyFor, weekKey, weekEnds, VENUES, TEMPERS, WEEK_RULES } from './items.js';
import { showAd as rawAd } from './ads.js';
import { encode, decode, validCreature } from './share.js';
import { tr, setLang, getLang, guessLang, LANGS, seen as i18nSeen } from './i18n.js';
import { makeRig, applyRig, strikePose, zero, resetBones, STRIKE_LEN } from './anim.js';
import { statsOf } from './battle.js';
import { play, synth, music, setAudio, audioOn, audioStats } from './audio.js';
import { randomCreature } from './random.js';
import { newCreature, addPart, buildCreature, rebuildPart, rebuildShells, disposeTree, bounds, placement, clamp, setShellStep, applyShellStep } from './creature.js';

const $ = (id) => document.getElementById(id);
function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const [k, val] of Object.entries(props || {})) {
    if (k === 'class') e.className = val; else if (k === 'style') e.style.cssText = val;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), val); else if (k.startsWith('aria-')) e.setAttribute(k, val); else if (val !== false && val != null) e[k] = val;
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(typeof k === 'string' ? tr(k) : k);        // all visible text is translated here
  return e;
}
const native = () => window.Android || null;
// Pop-up questions are translated too.
{ const c = window.confirm.bind(window), p = window.prompt.bind(window); window.confirm = (m) => c(tr(m)); window.prompt = (m, d) => p(tr(m), d); }
const KEEP = ['cc.meta', 'cc.saved', 'cc.current', 'cc.run'];        // everything that makes up a player's progress
let mirrorT = 0;
const store = {
  get(k, d) { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch (e) { return d; } },
  set(k, val) {
    try { localStorage.setItem(k, JSON.stringify(val)); } catch (e) { return false; /* storage full or blocked */ }
    // Also hand a copy to the app itself. Android backs that file up to the player's Google account,
    // so progress comes back after a reinstall or on a new phone.
    if (KEEP.includes(k) && native() && native().saveState) { clearTimeout(mirrorT); mirrorT = setTimeout(() => { try { native().saveState(snapshotSave()); } catch (e) { /* not available */ } }, 1500); }
    return true;
  },
};
function snapshotSave() { const o = {}; for (const k of KEEP) { const s = localStorage.getItem(k); if (s) o[k] = s; } return JSON.stringify(o); }
function restoreSave(json) { const o = JSON.parse(json); let n = 0; for (const k of KEEP) if (typeof o[k] === 'string') { JSON.parse(o[k]); localStorage.setItem(k, o[k]); n++; } return n; }
// A fresh install with a backed-up save: bring it back before anything reads it.
try { if (!localStorage.getItem('cc.meta') && native() && native().loadState) { const s = native().loadState(); if (s) restoreSave(s); } } catch (e) { /* start fresh */ }
/** Analytics: a named event with a few details. Does nothing unless the app was built with Firebase. */
function track(name, params) { try { if (native() && native().track) native().track(name, JSON.stringify(params || {})); } catch (e) { /* ignore */ } }
window.addEventListener('error', (e) => track('js_error', { msg: String(e.message).slice(0, 90), at: (e.filename || '').split('/').pop() + ':' + e.lineno }));
function toast(msg) { const t = $('toast'); t.textContent = tr(msg); t.classList.remove('hidden'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add('hidden'), 2200); }

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
  if (preview) stopPreview();
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
// Thumbnails never change between launches, so they are kept on the device instead of being re-rendered.
const THUMB_VER = 'cc.thumbs.5';
const thumbCache = store.get(THUMB_VER, {});
let thumbDirty = false;
function keepThumb(key, url) { thumbCache[key] = url; if (!thumbDirty) { thumbDirty = true; setTimeout(() => { thumbDirty = false; store.set(THUMB_VER, thumbCache); }, 1500); } return url; }
for (const k of Object.keys(localStorage)) if (k.startsWith('cc.thumbs.') && k !== THUMB_VER) localStorage.removeItem(k);
const partThumbs = {};
const THUMB_LOOK = { base: '#9fb6b0', second: '#5c7a76', belly: '#c9d8d2', bellyAmt: 0.5, pattern: 0, patScale: 1, cover: 'skin', furLen: 0, furDroop: 0, accent: '#efe6cf', hair: '#d98a3a', membrane: '#d99a8a', eye: '#3f9f6a' };
function partThumb(kind) {
  if (partThumbs[kind]) return partThumbs[kind];
  if (thumbCache['p:' + kind]) return (partThumbs[kind] = thumbCache['p:' + kind]);
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
  const url = snapshot(112, 112, box, new THREE.Vector3(...dir), 'image/jpeg');
  scene.background = bg; pad.visible = shadow.visible = pv;
  stage.remove(tmp.group); disposeTree(tmp.group);
  if (keep) { keep.group.visible = true; applyLook(M, data.look, TEMPLATES[data.type].bellyDir); }
  return (partThumbs[kind] = keepThumb('p:' + kind, url));
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
  if (arena.active) { arena.update(dt, t / 1000); renderer.render(scene, camera); watchFrame(t); return; }
  if (!inEditor || !cr) return;
  controls.orbit.autoRotate = spin; controls.orbit.update(dt);
  if (preview) {
    if (preview.idle && (preview.skip = !preview.skip)) return;          // idling only needs half the frames
    playPreview(preview.idle ? dt * 2 : dt); renderer.render(scene, camera); if (!preview.idle) watchFrame(t); return;
  }
  // Left alone for a while, the creature comes to life: it breathes, looks about and stretches until touched.
  if (!meta.calm && (!navigator.webdriver || window.__ccIdle) && (meta.tut || 0) >= COACH.length && !pendingRebuild && down.id < 0 && performance.now() - lastTouch > IDLE_AFTER) startPreview(true);
  if (pendingRebuild) { pendingRebuild = false; rebuild(); }
  // Only draw when something changed (saves battery).
  if (!dirty && !spin) return;
  dirty = false;
  const dist = camera.position.distanceTo(controls.orbit.target);
  const s = dist * 0.0075 / camera.zoom;
  handles.children.forEach((m) => m.scale.setScalar(s * (m.userData.node === nodeSel ? 1.5 : 1.1)));
  marker.scale.setScalar(s * 1.7); marker.quaternion.copy(camera.quaternion);
  renderer.render(scene, camera);
  watchFrame(t);
}

// ------------------------------------------------------------------ animated preview in the workshop
// "Play" swaps the editable model for a rigged copy and loops it through standing, walking and attacking.
let preview = null, lastTouch = performance.now();
const IDLE_AFTER = 7000;
window.addEventListener('pointerdown', () => { lastTouch = performance.now(); if (preview && preview.idle) { stopPreview(); renderTop(); } }, true);
function startPreview(idle) {
  sel = null; refreshOverlay();
  applyLook(M, data.look, TEMPLATES[data.type].bellyDir);
  const view = buildCreature(data, M, { animated: true }), rig = makeRig(view), pose = new THREE.Group(), st = statsOf(data);
  rig.len = 0; rig.armSel = -1;
  const styles = [rig.arms ? 'slash' : st.claws && st.legs >= 4 ? 'swipe' : 'lunge', st.mouth ? 'bite' : 'lunge', st.wings ? 'swoop' : st.horns ? 'charge' : 'pounce'];
  pose.add(view.group); stage.add(pose);
  cr.group.visible = false; overlay.visible = false;
  preview = { view, rig, pose, styles, t: 0, wings: st.wings, idle: !!idle };
}
function stopPreview() {
  if (!preview) return;
  stage.remove(preview.pose); disposeTree(preview.view.group); resetBones(M);
  preview = null; cr.group.visible = true; overlay.visible = true; dirty = true; lastTouch = performance.now();
}
function playPreview(dt) {
  const p = preview; p.t += dt;
  const u = p.t % 10, T = zero();
  T.sy = 1 + Math.sin(p.t * 2) * 0.012; if (p.wings) T.flap = 0.05;
  if (p.idle) {                                                                                  // quiet life: look about, shift weight, stretch now and then
    const b = Math.max(0, Math.sin(((p.t % 9) - 6.5) / 2.5 * Math.PI)) * ((p.t % 9) > 6.5 ? 1 : 0), e = b * b * (3 - 2 * b);
    Object.assign(T, { yaw: Math.sin(p.t * 0.45) * 0.14, roll: Math.sin(p.t * 0.8) * 0.02, tailUp: Math.sin(p.t * 1.1) * 0.12 + 0.35 * e, tailYaw: Math.sin(p.t * 0.9) * 0.2,
      pitch: -0.16 * e, armAll: -0.9 * e, armOut: 0.4 * e, elbow: -0.5 * e, wing: 0.55 * e, tent: -0.3 * e + Math.sin(p.t * 0.7) * 0.08, kneeH: 0.25 * e, sy: T.sy + 0.04 * e });
    applyRig(p.rig, T, dt, p.pose); return;
  }
  if (u > 2 && u < 5) { T.gait = 1; T.y = Math.abs(Math.sin(p.rig.gaitPh)) * 0.03; }             // walk on the spot
  else if (u >= 5.5) {                                                                           // three attacks
    const k = Math.floor((u - 5.5) / 1.5), local = (u - 5.5) % 1.5, style = p.styles[Math.min(k, 2)];
    if (local < 0.5) Object.assign(T, strikePose(style, local / 0.5, -1, false));
    else if (local < 0.5 + STRIKE_LEN) Object.assign(T, strikePose(style, 1, local - 0.5, false));
    T.z = (T.z || 0) * 0.5;                                                                      // stay on the stand
  }
  applyRig(p.rig, T, dt, p.pose);
}

// ------------------------------------------------------------------ automatic quality
// Phones differ hugely. If frames come slowly, sharpness and fur density step down; if there is
// plenty of headroom they step back up. The level found is remembered for next time.
const GFX = [{ pr: 2, step: 1 }, { pr: 1.5, step: 1 }, { pr: 1.5, step: 2 }, { pr: 1.2, step: 2 }, { pr: 1, step: 3 }];
let gfx = 0, lastDraw = 0, slowN = 0, fastN = 0, gfxLock = 0, downLock = 0;
function setGfx(level, remember) {
  gfx = Math.max(0, Math.min(GFX.length - 1, level));
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, GFX[gfx].pr));
  setShellStep(GFX[gfx].step);
  if (cr) applyShellStep(cr, GFX[gfx].step);
  for (const v of arena.views) if (v) applyShellStep(v.cr, Math.max(2, GFX[gfx].step));
  layout();
  if (remember) { meta.gfx = gfx; saveMeta(); }
}
function watchFrame(t) {
  const ms = t - lastDraw; lastDraw = t;
  if (meta.gfxMode !== undefined && meta.gfxMode !== 'auto') return;      // quality fixed in settings
  if (ms > 600 || ms <= 0) return;                  // not back-to-back frames (idle, or a one-off hitch)
  slowN = ms > 25 ? slowN + 1 : Math.max(0, slowN - 2);
  fastN = ms < 13 ? fastN + 1 : 0;
  if (ms > 80) slowN += 4;                          // very slow frames count for more, so a struggling phone is helped quickly
  if (slowN > 45 && gfx < GFX.length - 1 && t > downLock) { slowN = 0; fastN = 0; downLock = t + 4000; gfxLock = t + 30000; setGfx(gfx + 1, true); }
  else if (fastN > 900 && gfx > 0 && t > gfxLock) { fastN = 0; gfxLock = t + 60000; setGfx(gfx - 1, true); }
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
  if (!inEditor || arena.active) return;
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
  if (!inEditor || arena.active || e.pointerId !== down.id) return;
  if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 9) down.moved = true;
  if (!down.mode || !down.moved) return;
  setRay(e);
  if (down.mode === 'node') {
    const hit = ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), new THREE.Vector3());
    if (hit) { const n = data.nodes[down.node]; n.y = clamp(hit.y, -1, 5); n.z = clamp(hit.z, -4, 4); pendingRebuild = true; }
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
  if (down.mode && down.moved) { commit(); coachEvent(down.mode === 'node' ? 'shape' : 'move'); }
  controls.orbit.enabled = true;
}
function pointerEnd(e) {
  if (!inEditor || arena.active) { down.count = 0; return; }
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
      const span = Math.max(...data.nodes.map((n) => Math.hypot(n.y - cy, n.z - cz)));
      if ((f > 1 && span > 2.6) || (f < 1 && span < 0.25)) { toast(f > 1 ? 'That is as long as a body can get.' : 'That is as short as a body can get.'); return; }
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
    if (partOpen(meta, kind)) grid.append(h('button', { class: 'tile', onclick: () => { if (tooMany()) return; const p = addPart(data, kind, cr.frames); rebuild(); commit(); play('place'); coachEvent('add'); select(p.id); } }, h('img', { src: partThumb(kind), alt: '' }), def.n));
    else grid.append(h('button', { class: 'tile locked', onclick: () => buy('part:' + kind, PART_COST[kind], def.n, renderLeft) }, h('img', { src: partThumb(kind), alt: '' }), def.n, h('small', null, 'Locked · ' + PART_COST[kind])));
  }
  el.append(grid);
}
const MAX_PARTS = 48;
const tooMany = () => { if (data.parts.length < MAX_PARTS) return false; toast('A creature can carry ' + MAX_PARTS + ' parts at most. Remove one first.'); return true; };
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
      h('button', { onclick: () => { if (tooMany()) return; const c = JSON.parse(JSON.stringify(part)); c.id = 'p' + Date.now().toString(36); c.u = clamp(c.u - 0.08, -0.9, 1.9); data.parts.push(c); rebuild(); commit(); select(c.id); } }, 'Copy'),
      h('button', { class: 'warn', onclick: () => { data.parts = data.parts.filter((p) => p.id !== part.id); play('drop'); sel = null; rebuild(); commit(); renderUI(); } }, 'Delete')),
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
    h('button', { class: preview && !preview.idle ? 'on' : '', onclick: () => { if (preview) stopPreview(); else startPreview(); renderTop(); } }, preview && !preview.idle ? '■ Stop' : '▶ Play'),
    h('button', { onclick: photo }, 'Photo'),
    h('button', { onclick: () => save() }, 'Save'),
    h('button', { class: 'battle', onclick: enterBattle }, '⚔️ Battle'));
}
function setSex(s) { data.sex = s; rebuild(); commit(); renderUI(); }
function renderUI() {
  if (preview) stopPreview();
  if (tab === 'skin') coachEvent('skin');
  renderTabs(); renderLeft(); renderRight(); renderTop(); layout(); refreshOverlay();
  $('hint').textContent = sel && sel !== 'body' ? '' : tr('Drag to spin. Pinch to zoom. Tap a part to select it.');
  renderCoach();
}

// ------------------------------------------------------------------ first-time guide
// A short walk through building a critter. Each step moves on when the player does the thing (or taps Next).
const COACH = [
  { id: 'shape', text: 'This is your critter. Drag one of the white dots to bend or stretch its body.' },
  { id: 'add', text: 'Now give it something. Open a tab on the left, such as Mouth or Head, and tap a part to add it.' },
  { id: 'move', text: 'Drag the new part across the body to move it. The sliders change its size and shape.' },
  { id: 'skin', text: 'Open the Skin tab to change colours, patterns and fur.' },
  { id: 'battle', text: 'Ready? Press Battle. In a fight, size is health, teeth and claws are attack, and arms hold weapons.' },
];
function coachEvent(id) {
  if (!meta || (meta.tut || 0) >= COACH.length || COACH[meta.tut || 0].id !== id) return;
  meta.tut = (meta.tut || 0) + 1; saveMeta(); track('tutorial', { step: id }); renderCoach();
}
function renderCoach() {
  const el = $('coach'), i = meta.tut || 0;
  const show = inEditor && !arena.active && i < COACH.length;
  el.classList.toggle('hidden', !show);
  document.querySelectorAll('.coach-glow').forEach((x) => x.classList.remove('coach-glow'));
  if (!show) return;
  const step = COACH[i];
  el.replaceChildren(h('small', null, 'Step ' + (i + 1) + ' of ' + COACH.length), h('p', null, step.text),
    h('div', { class: 'row' }, h('button', { onclick: () => { meta.tut = COACH.length; saveMeta(); track('tutorial', { step: 'skipped' }); renderCoach(); } }, 'Skip the guide'), h('button', { class: 'on', onclick: () => coachEvent(step.id) }, 'Next')));
  const glow = step.id === 'battle' ? document.querySelector('#topbar .battle') : step.id === 'add' || step.id === 'skin' ? $('tabs') : null;
  if (glow) glow.classList.add('coach-glow');
}

// ------------------------------------------------------------------ save, photo, start screen
function save(quiet) {
  if (!data.id) data.id = 'c' + Date.now().toString(36);
  const list = store.get('cc.saved', []).filter((c) => c.id !== data.id);
  list.unshift({ id: data.id, name: data.name, thumb: creatureThumb(data), data: JSON.parse(JSON.stringify(data)) });
  const ok = store.set('cc.saved', list); store.set('cc.current', data);
  if (!ok) toast('Could not save: the phone is out of storage for this app. Delete a creature or two.');
  else if (!quiet) toast('Saved "' + data.name + '"');
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
for (const k of ['stats', 'seen', 'typesWon', 'goals', 'unlocked', 'boosts']) if (!meta[k]) meta[k] = {};
if (!Array.isArray(meta.hall)) meta.hall = [];
if (meta.rank !== undefined) {          // older saves used numbered ranks; map them onto the named difficulty levels
  meta.level = Math.max(meta.level || 0, meta.rank > 0 ? Math.min(LEVELS.length - 1, meta.rank + 3) : meta.champions > 0 ? 3 : 0);
  meta.levelSel = meta.level; delete meta.rank; delete meta.rankSel;
}
const saveMeta = () => store.set('cc.meta', meta);
function buy(key, cost, label, then) {
  if (meta.points < cost) { play('error'); toast('Not enough points: ' + label + ' costs ' + cost + ', you have ' + meta.points + '.'); return; }
  if (!confirm('Unlock ' + label + ' for ' + cost + ' points?')) return;
  meta.points -= cost; meta.unlocked[key] = true; saveMeta(); track('unlock', { item: key }); play('latch'); play('confirm'); toast('Unlocked ' + label); then && then();
}
/** Counters behind the goals: add to one, or (best = true) keep the highest value seen. */
function stat(k, val = 1, best) { meta.stats[k] = best ? Math.max(meta.stats[k] || 0, val) : (meta.stats[k] || 0) + val; saveMeta(); }
/** A title has been won: bank the prize and record it straight away. */
function crown(pts, run) {
  const level = run.level ?? 2;
  meta.points += pts; meta.champions++;
  meta.typesWon[data.type] = 1; meta.stats.bestLevelWon = Math.max(meta.stats.bestLevelWon || 0, level + 1);
  if (level >= meta.level && meta.level < LEVELS.length - 1) { meta.level = level + 1; meta.levelSel = meta.level; }
  meta.hall.unshift({ name: data.name, type: data.type, level, when: Date.now() }); meta.hall.length = Math.min(meta.hall.length, 30);
  data.champion = (data.champion || 0) + 1;
  saveMeta(); store.set('cc.current', data);
  const list = store.get('cc.saved', []), e = list.find((c) => c.id === data.id);
  if (e) { e.data = JSON.parse(JSON.stringify(data)); e.name = data.name; store.set('cc.saved', list); }
}
let lastReward = 0;
/**
 * A full-screen ad between runs. Kept rare so it does not drive players away: never for patrons, never in the
 * first three runs, at most one every four minutes, and not right after the player chose to watch a rewarded ad.
 */
function maybeInterstitial() {
  const now = Date.now(), n = native();
  if (meta.patron || !n || !n.showInterstitial || (meta.stats.runs || 0) < 3 || now - (meta.adAt || 0) < 240000 || now - lastReward < 120000) return;
  meta.adAt = now; saveMeta(); track('interstitial');
  try { n.showInterstitial(); } catch (e) { /* not available */ }
}
/** Rewarded ad, or for patrons simply the reward. */
async function showAd(where) {
  if (meta.patron) return { ok: true };
  const r = await rawAd(); track('ad', { ok: r.ok ? 1 : 0 }); if (r.ok) lastReward = Date.now(); return r;
}
const arena = createArena({ scene, camera, M, h, store, sun, showAd, toast, track, tr, decode, valid: (d) => validCreature(d, TEMPLATES, PARTS), gfx: () => GFX[gfx], stat, crown, bonus: (pts) => { meta.points += pts; saveMeta(); }, onDone: battleDone, meta: () => meta, saveMeta });
function enterBattle(run) {
  coachEvent('battle');
  const other = store.get('cc.run', null);
  if (other && other.id !== data.id && !(run && run.id === data.id) && !confirm('Another creature is still in the middle of a gauntlet. Starting this one abandons that run. Go ahead?')) return;
  save(true);
  sel = null; controls.orbit.enabled = false;
  $('editor').classList.add('hidden'); $('start').classList.add('hidden');
  stage.visible = overlay.visible = false;
  applyLook(M, data.look, TEMPLATES[data.type].bellyDir);
  arena.start(data, run && run.id === data.id ? run : null);
  layout();
}
/**
 * Ask for a store rating at a happy moment (a title, a long pit run). Google's own card decides whether
 * to actually appear; on our side: at most three asks, at least three weeks apart, never in the first session.
 */
function askForReview() {
  const r = meta.review || { n: 0, at: 0 }, now = Date.now();
  if (r.n >= 3 || now - r.at < 21 * 86400000 || (meta.stats.runs || 0) < 3) return;
  meta.review = { n: r.n + 1, at: now }; saveMeta();
  if (window.Android && window.Android.requestReview) setTimeout(() => { try { window.Android.requestReview(); } catch (e) { /* not available */ } }, 1500);
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
    data = null; inEditor = false; music('menu');
    $('start').classList.remove('hidden'); renderStart(); layout(); maybeInterstitial();
    return;
  }
  down.count = 0;
  if (res.type === 'retired') stat('bestEndless', res.wins, true);
  lastTouch = performance.now();
  inEditor = true; $('editor').classList.remove('hidden');
  scheduleReminders();
  rebuild(); if (res.type === 'champion') save(true);
  renderUI(); fitCamera();
  music('menu');
  if (res.type === 'champion') { toast(data.name + ' is champion! +' + res.points + ' points'); askForReview(); }
  if (res.type === 'retired') { toast(data.name + ' won ' + res.wins + ' fights in the pit'); if (res.wins >= 10) askForReview(); }
  if (res.type === 'retired') maybeInterstitial();
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
  lastTouch = performance.now();
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
// ------------------------------------------------------------------ sharing, backup codes, reminders, purchases
function sendText(text, what) {
  if (native() && native().shareText) { native().shareText(text, what); return; }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast(what + ' copied. Paste it anywhere to share it.'), () => prompt(what + ':', text));
  else prompt(what + ':', text);
}
async function shareCreature(d) {
  const c = JSON.parse(JSON.stringify(d)); delete c.id; delete c.champion;        // a shared critter starts a new life
  sendText(await encode('c', c), 'Critter code for ' + d.name); track('share', { type: d.type });
}
async function backupCode() {
  const o = {}; for (const k of KEEP) { const v = store.get(k, null); if (v) o[k] = k === 'cc.saved' ? v.map((c) => ({ ...c, thumb: '' })) : v; }
  sendText(await encode('s', o), 'Critter Arena backup code');
}
async function importCode() {
  const text = prompt('Paste a critter code, or a backup code:'); if (!text) return;
  const got = await decode(text);
  if (got && got.kind === 'c' && validCreature(got.data, TEMPLATES, PARTS)) {
    const d = got.data; d.id = 'c' + Date.now().toString(36); delete d.champion;
    const list = store.get('cc.saved', []); list.unshift({ id: d.id, name: d.name, thumb: creatureThumb(d), data: d }); store.set('cc.saved', list);
    shopTab = null; play('confirm'); toast('Added "' + d.name + '" to your creatures'); track('import', { type: d.type }); renderStart(); return;
  }
  if (got && got.kind === 's' && got.data['cc.meta'] && confirm('Replace everything on this device with the save in this code?')) {
    for (const k of KEEP) if (got.data[k]) store.set(k, got.data[k]); else localStorage.removeItem(k);
    location.reload(); return;
  }
  play('error'); toast('That code could not be read.');
}
/** Ask the phone to remind the player when runs are back and when the daily gift is ready. */
function scheduleReminders() {
  const A = native(); if (!A || !A.remind || !meta.remind) return;
  try {
    A.cancelReminders();
    const r = runsNow(meta);
    if (!meta.patron && r.n < r.max) A.remind(1, Date.now() + r.next + (r.max - r.n - 1) * RUN_MS, tr('Your runs are back'), tr('All ' + runMax(meta) + ' runs are ready. The Colosseum is waiting.'));
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(10, 0, 0, 0);
    A.remind(2, tomorrow.getTime(), tr('Your daily gift is ready'), tr('Collect your points and keep your streak going.'));
  } catch (e) { /* reminders are optional */ }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState !== 'visible') scheduleReminders(); });
// Google Play purchases. The app tells the page what is for sale and what has been bought.
const products = {};
window.ccProducts = (list) => { for (const p of list) products[p.id] = p; if (shopTab === 'Premium') renderStart(); };
window.ccPurchased = (id, token) => {
  const pr = PRODUCTS.find((x) => x.id === id); if (!pr) return;
  meta.tokens = meta.tokens || {};
  if (!pr.once && token && meta.tokens[token]) return;              // already granted
  if (token) meta.tokens[token] = 1;
  if (pr.once) { if (meta.patron) return; meta.patron = true; }
  if (pr.points) meta.points += pr.points;
  if (pr.revives) meta.revives = (meta.revives || 0) + pr.revives;
  saveMeta(); play('coins'); synth('win'); toast('Thank you! ' + pr.name + ' added.'); track('purchase', { item: id });
  if (!inEditor && !arena.active) renderStart();
};
const typeThumbs = {};
// Body-type pictures are pre-rendered files (assets/www/thumbs), so the first launch does not have to draw them.
const typeThumb = (id) => 'thumbs/' + id + '.jpg';
function tickRunPill() {
  const el = $('runpill'); if (!el) return;
  const r = runsNow(meta);
  el.textContent = '⚡ ' + r.n + '/' + r.max + (r.next ? ' · ' + clock(r.next) + ' · 📺 +1' : '');
}
setInterval(tickRunPill, 1000);
let shopTab = null;
function renderShop() {
  const el = $('start');
  const row = (icon, name, text, cost, owned, onbuy, extra, money) => h('div', { class: 'shoprow' + (owned ? ' owned' : '') }, h('div', { class: 'ico' }, icon), h('div', { class: 'what' }, h('b', null, name), extra && h('small', { class: 'req' }, extra), h('small', null, text)),
    owned ? h('span', { class: 'have' }, typeof owned === 'string' ? owned : 'Owned') : h('button', { class: money || meta.points >= cost ? 'go' : '', onclick: onbuy }, money ? String(cost) : cost + ' pts'));
  const itemRows = (cat) => ITEMS.filter((it) => it.cat === cat).sort((a, b) => a.cost - b.cost).map((it) =>
    row(it.icon, it.name, describe({ id: it.id, cat, q: 1, rar: 0, lvl: 1 }), it.cost, itemOpen(meta, it) && (it.cost ? 'Owned' : 'Free'), () => buy('item:' + cat + ':' + it.id, it.cost, it.name, renderStart), it.reqText ? 'Needs ' + it.reqText : (it.hands === 2 ? 'Needs two free hands' : '')));
  const goalRow = (g) => {
    const [have, need] = g.prog(meta), done = have >= need, claimed = !!meta.goals[g.id];
    return h('div', { class: 'shoprow' + (claimed ? ' owned' : '') }, h('div', { class: 'ico' }, claimed ? '✅' : done ? '🏅' : '🎯'),
      h('div', { class: 'what' }, h('b', null, g.name), h('small', null, g.text), h('div', { class: 'bar' }, h('i', { style: 'width:' + Math.min(100, have / need * 100) + '%' })), h('small', null, Math.min(have, need) + ' / ' + need)),
      claimed ? h('span', { class: 'have' }, 'Claimed') : h('button', { class: done ? 'go' : '', disabled: !done, onclick: () => { meta.goals[g.id] = 1; meta.points += g.pts; saveMeta(); play('coins'); synth('level'); toast(g.name + ': +' + g.pts + ' points'); renderStart(); } }, (done ? 'Claim ' : '') + g.pts + ' pts'));
  };
  const rec = (k, val) => h('div', { class: 'shoprow' }, h('div', { class: 'what' }, h('small', null, k), h('b', null, String(val))));
  const tabs = {
    Goals: () => [...GOALS].sort((a, b) => (meta.goals[a.id] ? 2 : goalDone(meta, a) ? 0 : 1) - (meta.goals[b.id] ? 2 : goalDone(meta, b) ? 0 : 1)).map(goalRow),
    Records: () => [rec('Fights won', meta.stats.fightsWon || 0), rec('Titles won', meta.champions), rec('Creatures lost', meta.fallen), rec('Hardest level open', LEVELS[meta.level].name), rec('Hardest title won', meta.stats.bestLevelWon ? LEVELS[meta.stats.bestLevelWon - 1].name : 'None yet'), rec('Best Endless run', (meta.stats.bestEndless || 0) + ' wins'), rec('Weekly challenges won', meta.stats.weeklies || 0), rec('Arenas won in', Object.keys(meta.venues || {}).length + ' of 6'), rec('Gauntlets finished', meta.stats.runs || 0), rec('Total damage dealt', (meta.stats.damage || 0).toLocaleString()), rec('Biggest single hit', meta.stats.biggestHit || 0),
      rec('Elite opponents beaten', meta.stats.elites || 0), rec('Different rewards picked', Object.keys(meta.seen).length + ' of ' + ITEMS.length), rec('Body types crowned', Object.keys(meta.typesWon).length + ' of 8'),
      ...meta.hall.map((c) => h('div', { class: 'shoprow' }, h('div', { class: 'ico' }, '👑'), h('div', { class: 'what' }, h('b', null, c.name), h('small', null, TEMPLATES[c.type].name + ' · ' + (c.level !== undefined ? LEVELS[c.level].name : 'Rank ' + c.rank) + ' · ' + new Date(c.when).toLocaleDateString()))))],
    Bodies: () => Object.entries(TEMPLATES).map(([id, t]) => row('🧬', t.name, t.blurb, TYPE_COST[id], typeOpen(meta, id) && (TYPE_COST[id] ? 'Owned' : 'Free'), () => buy('type:' + id, TYPE_COST[id], 'the ' + t.name + ' body', renderStart))),
    Parts: () => Object.entries(PART_COST).map(([k, cost]) => row(h('img', { src: partThumb(k), alt: '' }), PARTS[k].n, tr('Body part for the workshop.') + ' ' + tr(CATS.find((c) => c[0] === PARTS[k].cat)[1]), cost, partOpen(meta, k), () => buy('part:' + k, cost, PARTS[k].n, renderStart))),
    Weapons: () => itemRows('weapon'), Abilities: () => itemRows('ability'), Relics: () => itemRows('relic'),
    Premium: () => PRODUCTS.map((pr) => {
      const live = products[pr.id], owned = pr.once && meta.patron;
      return row(pr.icon, pr.name, pr.text, live ? live.price : 'Soon', owned && 'Owned', () => {
        if (!live) { toast('Purchases are available in the Google Play version.'); return; }
        track('buy_tap', { item: pr.id }); native().buy(pr.id);
      }, null, true);
    }),
    Boosts: () => BOOSTS.map((b) => {
      const lvl = b.consumable ? meta.revives : (meta.boosts[b.id] || 0), full = lvl >= b.max, cost = b.cost(lvl);
      return row(b.icon, b.name + (b.consumable ? ' (holding ' + lvl + ')' : b.max > 1 ? ' (level ' + lvl + ' of ' + b.max + ')' : ''), b.text, cost, full && (b.consumable ? 'Full' : 'Maxed'), () => {
        if (meta.points < cost) { toast('Not enough points: ' + b.name + ' costs ' + cost + ', you have ' + meta.points + '.'); return; }
        meta.points -= cost; if (b.consumable) meta.revives++; else meta.boosts[b.id] = lvl + 1; saveMeta(); renderStart();
      });
    }),
  };
  const notes = { Premium: 'Optional purchases through Google Play. Everything in the game can also be earned by playing.', Goals: 'Targets that pay points when you claim them.', Records: 'Your history in the Colosseum, and the hall of champions.', Weapons: 'Weapons you own can turn up as rewards after a fight. A creature holds one per hand.', Abilities: 'Abilities you own can turn up as rewards, if the creature has the right body for them.', Relics: 'Relics are passive rewards that stack. Many only work, or work better, with the right body.', Parts: 'Extra parts for building creatures. Starter creatures may already carry some of these.', Bodies: 'New body types to start from.', Boosts: 'Permanent upgrades, and revives.' };
  el.replaceChildren(h('h1', null, h('span', null, shopTab === 'Goals' ? 'Goals' : shopTab === 'Records' ? 'Records' : 'Shop'), h('small', { class: 'record' }, h('b', null, meta.points + ' points'), ' ', h('button', { class: 'shopbtn', onclick: () => { shopTab = null; renderStart(); } }, 'Back'))),
    h('div', { class: 'chips', style: 'margin-top:10px' }, Object.keys(tabs).map((t) => h('button', { class: t === shopTab ? 'on' : '', onclick: () => { shopTab = t; renderStart(); } }, t))),
    h('p', { class: 'note' }, notes[shopTab] + (shopTab === 'Goals' || shopTab === 'Records' || shopTab === 'Premium' ? '' : ' Points come from every fight won (more for later fights) and a big bonus for the title.')),
    h('div', { class: 'shop' }, tabs[shopTab]()));
  el.scrollTop = 0;
}
function renderStart() {
  const el = $('start'), saved = store.get('cc.saved', []), cur = store.get('cc.current', null);
  if (shopTab === 'Settings') { renderSettings(); return; }
  if (shopTab) { renderShop(); return; }
  const rec = meta, run = store.get('cc.run', null);
  // The creature in the gauntlet may no longer be the one last opened, so look in the saved list too.
  const runData = run && (cur && cur.id === run.id ? cur : (saved.find((c) => c.id === run.id) || {}).data), runOk = !!runData;
  if (run && !runOk) store.set('cc.run', null);
  const gift = dailyGift(meta), ready = goalsReady(meta);
  const WK = weeklyFor(weekKey()), wrec = meta.weekly && meta.weekly.key === WK.key ? meta.weekly : { best: 0, done: 0 };
  el.replaceChildren(...[h('h1', null, 'Critter ', h('span', null, 'Arena'),
      h('small', { class: 'record' }, h('span', { class: 'runpill', id: 'runpill', onclick: async () => { const r = runsNow(meta); if (r.n >= r.max) return; const a = await showAd(); if (a.ok) { addRun(meta); saveMeta(); tickRunPill(); toast('+1 run'); } else if (a.why) toast(a.why); } }), h('button', { class: 'goalbtn' + (ready ? ' ready' : ''), onclick: () => { shopTab = 'Goals'; renderStart(); } }, 'Goals' + (ready ? ' (' + ready + ')' : '')), h('button', { class: 'shopbtn', onclick: () => { shopTab = 'Bodies'; renderStart(); } }, 'Shop'), h('button', { class: 'gear', 'aria-label': 'Settings', onclick: () => { shopTab = 'Settings'; renderStart(); } }, '⚙️'), ' ', h('b', null, rec.points + ' points'), ' · ' + rec.champions + (rec.champions === 1 ? ' champion' : ' champions') + ' · ' + rec.fallen + ' fallen')),
    runOk && h('div', { class: 'card resume', onclick: () => { data = JSON.parse(JSON.stringify(runData)); enterBattle(run); } }, h('b', null, 'Gauntlet in progress'), h('small', null, runData.name + ' is waiting for fight ' + (run.round + 1) + (run.endless ? ' in the Endless Pit' : ' of ' + LEVELS[run.level ?? 2].fights + ' (' + LEVELS[run.level ?? 2].name + ')') + '. Tap to return.')),
    !meta.seenIntro && h('div', { class: 'card resume intro' }, h('b', null, 'Welcome to Critter Arena'),
      h('small', null, '1. Pick a body below and build a critter: drag the dots to shape it, add parts, colour it.'), h('small', null, '2. Hit Battle to enter the Colosseum: ten fights to the death, with a reward to choose after each win.'),
      h('small', null, '3. How you build it matters: size is health, teeth and claws are attack, arms hold weapons. Spend the points you earn in the Shop.'),
      h('button', { onclick: (e) => { e.stopPropagation(); meta.seenIntro = 1; saveMeta(); renderStart(); } }, 'Got it')),
    gift && h('div', { class: 'card resume gift', onclick: () => { const g = claimDaily(meta); saveMeta(); play('coins'); if (g) toast('Daily gift: +' + g.points + ' points' + (g.revive ? ' and a revive' : '')); renderStart(); } }, h('b', null, '🎁 Daily gift: +' + gift.points + ' points' + (gift.revive ? ' and a revive' : '')), h('small', null, 'Day ' + gift.streak + ' in a row. Come back tomorrow for more; every seventh day adds a revive. Tap to collect.')),
    h('div', { class: 'card resume weekly', onclick: () => toast('Open a creature, press Battle, then choose Weekly.') }, h('b', null, '📅 ', 'Weekly challenge', ': ', WK.rule.name, ' · ', WK.venue.icon + ' ', WK.venue.name, wrec.done ? ' ✓' : ''),
      h('small', null, WK.rule.text, ' ', wrec.done ? 'Won this week.' : 'Your best this week: ' + wrec.best + ' / ' + WK.fights + '.', ' ', 'New challenge in ' + Math.max(1, Math.ceil((weekEnds(WK.key) - Date.now()) / 3600000)) + ' hours.')),
    h('h2', null, 'Start from a body type'),
    h('div', { class: 'cards' }, h('div', { class: 'card', onclick: () => { const open_ = Object.keys(TEMPLATES).filter((t) => typeOpen(meta, t)); open(randomCreature(Math.random, { type: open_[Math.floor(Math.random() * open_.length)] })); } }, h('div', { class: 'dice' }, '?'), h('b', null, 'Random'), h('small', null, 'Roll a surprise creature')),
      Object.entries(TEMPLATES).map(([id, t]) =>
      typeOpen(meta, id)
        ? h('div', { class: 'card', onclick: () => open(newCreature(id)) }, h('img', { src: typeThumb(id), alt: '' }), h('b', null, t.name), h('small', null, t.blurb))
        : h('div', { class: 'card locked', onclick: () => buy('type:' + id, TYPE_COST[id], 'the ' + t.name + ' body', renderStart) }, h('img', { src: typeThumb(id), alt: '' }), h('b', null, t.name), h('small', null, 'Locked · ' + TYPE_COST[id] + ' points'))))].filter(Boolean));
  tickRunPill();
  if (cur || saved.length) el.append(h('h2', null, 'Your creatures'),
    h('div', { class: 'cards' },
      cur && h('div', { class: 'card', onclick: () => open(cur) }, h('img', { src: creatureThumb(cur), alt: '' }), h('b', null, 'Continue'), h('small', null, cur.name)),
      saved.map((c) => h('div', { class: 'card', onclick: () => open(JSON.parse(JSON.stringify(c.data))) }, h('img', { src: c.thumb, alt: '' }), h('b', null, c.name), h('small', null, TEMPLATES[c.data.type].name + (c.data.champion ? ' · Champion' + (c.data.champion > 1 ? ' x' + c.data.champion : '') : '')),
        h('button', { class: 'shr', onclick: (e) => { e.stopPropagation(); shareCreature(c.data); } }, '↗'),
        h('button', { class: 'del warn', onclick: (e) => { e.stopPropagation(); if (confirm('Delete "' + c.name + '"?')) { store.set('cc.saved', store.get('cc.saved', []).filter((x) => x.id !== c.id)); renderStart(); } } }, '×')))));
  el.append(h('div', { class: 'settings' }, h('button', { onclick: importCode }, '📥 Import a code')));
}
/** Text size and colour choices live on <html> so the stylesheet can follow them. */
function applyAccess() {
  const c = document.documentElement.classList;
  c.toggle('ts1', meta.textSize === 1); c.toggle('ts2', meta.textSize === 2); c.toggle('cb', !!meta.cb); c.toggle('calm', !!meta.calm);
}
function renderSettings() {
  const el = $('start'), n = native(), au = audioOn();
  const again = () => { saveMeta(); renderStart(); };
  const row = (name, text, ...ctl) => h('div', { class: 'shoprow setrow' }, h('div', { class: 'what' }, h('b', null, name), text && h('small', null, text)), h('div', { class: 'ctl' }, ctl));
  const pick = (opts, cur, set) => h('div', { class: 'chips' }, opts.map(([val, label]) => h('button', { class: val === cur ? 'on' : '', onclick: () => { set(val); again(); } }, label)));
  const onoff = (cur, set) => pick([[true, 'On'], [false, 'Off']], !!cur, set);
  const vol = (key) => h('input', { type: 'range', min: 0, max: 100, step: 5, value: Math.round((au[key] ?? 1) * 100), 'aria-label': key === 'mv' ? tr('Music') : tr('Sound effects'), id: 'vol-' + key, oninput: (e) => {
    const v = +e.target.value / 100; meta.audio = { ...audioOn(), [key]: v, [key === 'mv' ? 'music' : 'sfx']: v > 0 }; setAudio(meta.audio); saveMeta(); if (key === 'sv') play('click', 0.6);
  } });
  const gmode = meta.gfxMode === undefined ? 'auto' : meta.gfxMode;
  el.replaceChildren(h('h1', null, h('span', null, 'Settings'), h('small', { class: 'record' }, h('button', { class: 'shopbtn', onclick: () => { shopTab = null; renderStart(); } }, 'Back'))),
    h('div', { class: 'shop set' },
      h('h2', null, 'Sound'),
      row('Music', null, vol('mv')), row('Sound effects', null, vol('sv')),
      h('h2', null, 'Display'),
      row('Language', null, pick(Object.entries(LANGS), getLang(), (v) => { meta.lang = v; setLang(v); })),
      row('Graphics quality', 'Automatic lowers the detail if the game runs slowly, and raises it again when it can.', pick([['auto', 'Automatic'], [0, 'High'], [2, 'Medium'], [4, 'Low']], gmode, (v) => { meta.gfxMode = v; if (v !== 'auto') setGfx(v, true); })),
      row('Text size', 'Makes menus and fight panels larger.', pick([[0, 'Normal'], [1, 'Large'], [2, 'Largest']], meta.textSize || 0, (v) => { meta.textSize = v; applyAccess(); })),
      row('Colour-blind friendly', 'Health bars use blue, yellow and orange instead of green and red.', onoff(meta.cb, (v) => { meta.cb = v; applyAccess(); })),
      row('Reduce motion', 'No screen shake, flashes, slow motion or weather, and creatures stand still in the workshop.', onoff(meta.calm, (v) => { meta.calm = v; applyAccess(); })),
      h('h2', null, 'Game'),
      n && n.askNotify && row('Reminders', 'A notification when your runs have refilled and when the daily gift is ready.', onoff(meta.remind, (v) => { meta.remind = v; if (v) n.askNotify(); else n.cancelReminders(); })),
      row('Workshop guide', 'Show the five building tips again.', h('button', { onclick: () => { meta.tut = 0; meta.tutFight = 0; again(); toast('The guide will show next time you build.'); } }, 'Replay')),
      row('Backup code', 'Copy your whole save as text, to keep somewhere safe or move to another phone.', h('button', { onclick: backupCode }, 'Copy'), h('button', { onclick: importCode }, 'Import a code')),
      n && n.restorePurchases && row('Purchases', 'Bought something on another phone or before reinstalling?', h('button', { onclick: () => { n.restorePurchases(); toast('Checking with Google Play…'); } }, 'Restore')),
      n && n.privacyOptions && row('Privacy', 'Change your choice about personalised ads.', h('button', { onclick: () => n.privacyOptions() }, 'Ad choices'))));
  el.scrollTop = 0;
}

// Every button makes a small sound; a few kinds get their own.
document.addEventListener('click', (e) => {
  const b = e.target.closest('button, .card'); if (!b || b.disabled || b.closest('#battle .acts')) return;
  if (b.closest('#tabs') || b.closest('.chips')) play('switch', 0.6);
  else if (b.classList.contains('card') || b.classList.contains('tile')) play('select', 0.7);
  else if (b.classList.contains('warn')) play('back', 0.7);
  else play('click', 0.6);
}, true);
controls.orbit = new OrbitControls(camera, canvas);
Object.assign(controls.orbit, { enableDamping: true, dampingFactor: 0.12, enablePan: false, autoRotateSpeed: 2.2, rotateSpeed: 0.9, maxPolarAngle: Math.PI * 0.62, minPolarAngle: 0.15 });
controls.orbit.addEventListener('change', touch);
setLang(meta.lang || guessLang());
applyAccess();
if (meta.gfx) setGfx(meta.gfx);
if (meta.audio && meta.audio.mv === undefined) meta.audio = { ...meta.audio, mv: meta.audio.music === false ? 0 : 1, sv: meta.audio.sfx === false ? 0 : 1, music: true, sfx: true };
if (meta.audio) setAudio(meta.audio);
music('menu');
layout();
renderStart();
requestAnimationFrame(frame);
window.__cc = { VENUES, TEMPERS, WEEK_RULES, get preview() { return preview; }, idleNow: () => { lastTouch = -1e9; }, get data() { return data; }, get cr() { return cr; }, open, newCreature, select, PARTS, TEMPLATES, setTab: (t) => { tab = t; renderUI(); }, camera, controls, fitCamera, rebuild, renderer, scene, arena, tr, i18nSeen, setLang, ITEMS, describe, GOALS, BOOSTS, LEVELS, PRODUCTS, COACH, CATS, previewStep: (to) => { preview.t = 0; preview.rig.gaitPh = 0; for (let t = 0; t < to; t += 1 / 60) playPreview(1 / 60); }, setGfx, get gfx() { return gfx; }, get meta() { return meta; }, saveMeta, renderStart, runsNow, audioStats, enterBattle, randomCreature, addPartTest: (k) => addPart(data, k, cr.frames), pickAt: (x, y) => { setRay({ clientX: x, clientY: y }); return pickPart(); }, state: () => ({ sel, tab, down: { ...down } }) };
