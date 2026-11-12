// Materials: one shared, patterned skin material (also used for fur shells),
// plus simple materials for horn, hair, membranes, teeth and eyes.
import * as THREE from 'three';

export const SHELLS = 18;
export const BONES = 24;            // how many separately moving pieces (limbs, wings, tails) fur can follow

const NOISE = /* glsl */`
float h31(vec3 p){ p = fract(p*0.3183099+vec3(.1,.2,.3)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vn(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ return 0.55*vn(p)+0.3*vn(p*2.1+3.1)+0.15*vn(p*4.3+7.7); }
vec3 vor(vec3 x){ vec3 n=floor(x), f=fract(x); float d1=8.0, d2=8.0, id=0.0;
  for(int k=-1;k<=1;k++) for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec3 g=vec3(float(i),float(j),float(k)); float hh=h31(n+g);
    vec3 o=vec3(hh, fract(hh*17.3), fract(hh*91.7));
    vec3 r=g+o-f; float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; id=hh; } else if(d<d2){ d2=d; } }
  return vec3(sqrt(d1), sqrt(d2), id); }
`;

const FRAG_PATTERN = /* glsl */`
{
  // Fur strands are cut out first, so discarded pixels skip the pattern maths.
  float furShade = 1.0;
  if (uShell > 0.0) {
    vec3 fp = vWPos * uFurDensity;
    vec3 cell = floor(fp);
    float rnd = h31(cell);
    float len = 0.45 + 0.55*rnd;
    vec3 jit = (vec3(fract(rnd*13.7), fract(rnd*57.3), fract(rnd*91.1)) - 0.5) * 0.5;
    float d = length(fract(fp) - 0.5 - jit);
    if (uShell > len || d > 0.6*(1.0 - 0.8*uShell/len)) discard;
    furShade = mix(0.55, 1.15, uShell) * (0.88 + 0.24*fract(rnd*7.0));
  }

  vec3 pp = vWPos * uPatScale; pp.x = abs(pp.x);
  float pat = 0.0;
  if (uPattern == 1) pat = smoothstep(0.15, 0.4, sin(pp.z*7.0 + (fbm(pp*1.3)-0.5)*7.0 + pp.y*1.5));
  else if (uPattern == 2) pat = 1.0 - smoothstep(0.26, 0.34, vor(pp*3.2).x);
  else if (uPattern == 3) pat = smoothstep(0.47, 0.53, fbm(pp*1.4+5.0));
  else if (uPattern == 4) { vec3 w = vor(pp*2.6); pat = smoothstep(0.05, 0.13, w.y-w.x); }
  else if (uPattern == 5) pat = smoothstep(0.35, 0.75, vWNrm.y + (fbm(pp*2.0)-0.5)*0.5);
  else if (uPattern == 6) pat = step(0.78, h31(floor(pp*14.0))) * (1.0 - smoothstep(0.2, 0.45, length(fract(pp*14.0)-0.5)));
  else if (uPattern == 7) pat = smoothstep(0.0, 0.25, sin(pp.z*5.0 + pp.y*5.0));
  vec3 col = mix(uBase, uSecond, pat);
  float bel = smoothstep(0.25, 0.8, dot(vWNrm, uBellyDir)) * uBelly;
  col = mix(col, uBellyCol, bel);
  if (uTex == 1) { vec3 w = vor(vWPos*uTexScale); float e = smoothstep(0.0, 0.16, w.y-w.x); col *= mix(0.6, 1.0, e) * (0.9 + 0.2*w.z); ccH = e * 0.012 + w.z * 0.004; }
  else if (uTex == 2) { float k = fbm(vWPos*30.0); col *= 0.92 + 0.16*k; ccH = k * 0.004; }
  else if (uShell == 0.0 && uFurLen == 0.0) { float k = fbm(vWPos*60.0); col *= 0.97 + 0.06*k; ccH = k * 0.0003 + vn(vWPos*220.0) * 0.00018; }
  if (uShell > 0.0) col *= furShade; else if (uFurLen > 0.0) col *= 0.75;
  diffuseColor.rgb = col;
}
`;

export function makeMaterials() {
  const U = {
    uBase: { value: new THREE.Color() }, uSecond: { value: new THREE.Color() }, uBellyCol: { value: new THREE.Color() },
    uBellyDir: { value: new THREE.Vector3(0, -1, 0) }, uBelly: { value: 0.8 },
    uPattern: { value: 0 }, uPatScale: { value: 1 }, uTex: { value: 0 }, uTexScale: { value: 22 },
    uPM: { value: Array.from({ length: BONES }, () => new THREE.Matrix4()) }, uBump: { value: 1 }, uFurLen: { value: 0 }, uFurDensity: { value: 90 }, uDroop: { value: 0.3 },
  };
  const skinMat = (shell) => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0 });
    if (shell > 0) m.defines = { FUR_SHELL: 1 };
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U, { uShell: { value: shell } });
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float fur; attribute float bone; attribute vec3 rp; attribute vec3 rn;\nuniform float uShell; uniform float uFurLen; uniform float uDroop; uniform mat4 uPM[' + BONES + '];\nvarying vec3 vWPos; varying vec3 vWNrm;')
        .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\n#ifdef FUR_SHELL\nobjectNormal = mat3(uPM[int(bone + 0.5)]) * objectNormal;\n#endif')
        .replace('#include <begin_vertex>', `vec3 transformed = vec3(position);
          // Patterns and fur are worked out at the creature's rest pose (rp, rn), so they stay put when limbs move.
          vWPos = rp;
          vWNrm = normalize(rn);
          #ifdef FUR_SHELL
          // Fur shells are one merged mesh; each vertex follows the limb ("bone") it grew from.
          mat4 pm = uPM[int(bone + 0.5)];
          float fl = uShell * uFurLen * fur;
          transformed = (pm * vec4(transformed, 1.0)).xyz + (mat3(pm) * normal) * fl;
          transformed += vec3(0.0, -1.0, -0.6) * (uShell * fl * uDroop);
          #endif`);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          uniform vec3 uBase, uSecond, uBellyCol, uBellyDir; uniform float uBelly, uPatScale, uTexScale, uShell, uFurLen, uFurDensity, uBump;
          uniform int uPattern, uTex; varying vec3 vWPos; varying vec3 vWNrm; float ccH = 0.0;` + NOISE)
        .replace('#include <color_fragment>', '#include <color_fragment>\n' + FRAG_PATTERN)
        // Surface relief from the height worked out with the colour (pores, raised scales), then a soft rim light.
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
          #ifndef FUR_SHELL
          { vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
            vec3 r1 = cross(sy, normal), r2 = cross(normal, sx); float det = dot(sx, r1);
            vec3 grad = sign(det) * (dFdx(ccH) * r1 + dFdy(ccH) * r2);
            normal = normalize(abs(det) * normal - grad * uBump); }
          #endif`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          totalEmissiveRadiance += diffuseColor.rgb * pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0) * 0.4;`);
    };
    return m;
  };
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const M = {
    U,
    skin: skinMat(0),
    shells: Array.from({ length: SHELLS }, (_, i) => skinMat((i + 1) / SHELLS)),
    accent: std({ roughness: 0.35 }),
    hair: std({ roughness: 0.55 }),
    membrane: std({ roughness: 0.6, side: THREE.DoubleSide }),
    glass: std({ roughness: 0.15, transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false }),
    teeth: std({ color: 0xf4efdc, roughness: 0.3 }),
    mouth: std({ color: 0x3a0d14, roughness: 0.5 }),
    tongue: std({ color: 0xd96a7c, roughness: 0.4 }),
    dark: std({ color: 0x1b1718, roughness: 0.25 }),
    lip: std({ roughness: 0.35 }),
    cloth: std({ roughness: 0.9, side: THREE.DoubleSide }),
    glint: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    lash: std({ color: 0x151012, roughness: 0.6 }),
    eyeCache: new Map(),
  };
  return M;
}

const TEX = { skin: 0, scales: 1, chitin: 2, slime: 0, fur: 0 };
const ROUGH = { skin: 0.72, scales: 0.45, chitin: 0.22, slime: 0.1, fur: 0.9 };

export function applyLook(M, look, bellyDir) {
  const U = M.U;
  U.uBase.value.set(look.base); U.uSecond.value.set(look.second); U.uBellyCol.value.set(look.belly);
  U.uBelly.value = look.bellyAmt; U.uPattern.value = look.pattern; U.uPatScale.value = look.patScale;
  U.uBellyDir.value.set(...bellyDir).normalize();
  U.uTex.value = TEX[look.cover] ?? 0;
  U.uBump.value = look.cover === 'slime' ? 0.35 : 1;
  const fur = look.cover === 'fur';
  U.uFurLen.value = fur ? 0.012 + look.furLen * 0.13 : 0;
  U.uDroop.value = look.furDroop * 1.2;
  U.uFurDensity.value = 330 - look.furLen * 170;
  for (const m of [M.skin, ...M.shells]) {
    m.roughness = ROUGH[look.cover] ?? 0.7;
    m.metalness = look.cover === 'chitin' ? 0.25 : 0;
  }
  M.accent.color.set(look.accent);
  M.hair.color.set(look.hair);
  M.membrane.color.set(look.membrane);
  M.glass.color.set(look.membrane);
  M.cloth.color.set(look.cloth || '#6b4a2e');
  M.lip.color.set(look.base).lerp(new THREE.Color(0xb8405e), 0.6);
}

/**
 * Eye texture in polar layout: canvas top row is the point of the eye facing outward,
 * each column is one direction around it. Circles become bands, so any pupil shape
 * is just a per-column height.
 */
export function eyeMaterial(M, type, irisCol, irisSize) {
  const key = type + irisCol + irisSize.toFixed(2);
  if (M.eyeCache.has(key)) return M.eyeCache.get(key);
  const W = 256, H = 128, cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const col = new THREE.Color(irisCol), hsl = {};
  col.getHSL(hsl);
  const css = (h, s, l) => `hsl(${(h * 360).toFixed(0)},${(s * 100).toFixed(0)}%,${(clamp01(l) * 100).toFixed(0)}%)`;
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.06, metalness: 0 });
  if (type === 'compound') {
    g.fillStyle = css(hsl.h, hsl.s, hsl.l * 0.8); g.fillRect(0, 0, W, H);
    for (let y = 0; y < 22; y++) for (let x = 0; x < 44; x++) {
      const cx = (x + (y % 2) * 0.5) * (W / 44), cy = y * (H / 22) + 3;
      const gr = g.createRadialGradient(cx - 1, cy - 1, 0, cx, cy, 3.4);
      gr.addColorStop(0, css(hsl.h + 0.05, hsl.s, hsl.l * 1.5 + 0.1)); gr.addColorStop(1, css(hsl.h, hsl.s, hsl.l * 0.35));
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, 3.4, 0, 7); g.fill();
    }
    mat.roughness = 0.18; mat.metalness = 0.3;
  } else if (type === 'beady') {
    g.fillStyle = '#0b0a0d'; g.fillRect(0, 0, W, H);
    g.fillStyle = css(hsl.h, hsl.s, 0.12); g.fillRect(0, 0, W, H * 0.3);
  } else {
    const sg = g.createLinearGradient(0, 0, 0, H);
    sg.addColorStop(0, '#f7f4ee'); sg.addColorStop(0.45, '#efe6df'); sg.addColorStop(0.7, '#d9a9a4');
    g.fillStyle = sg; g.fillRect(0, 0, W, H);
    const yi = (irisSize * 0.95 / Math.PI) * H;
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let x = 0; x < W; x++) {
      const psi = (x / W) * Math.PI * 2 + Math.PI;
      const streak = 0.75 + rnd() * 0.5;
      const ig = g.createLinearGradient(0, 0, 0, yi);
      ig.addColorStop(0, css(hsl.h + 0.03, hsl.s, hsl.l * 1.5 * streak + 0.08));
      ig.addColorStop(0.75, css(hsl.h, hsl.s, hsl.l * streak));
      ig.addColorStop(0.93, css(hsl.h, hsl.s, hsl.l * 0.3));
      ig.addColorStop(1, '#20140f');
      g.fillStyle = ig; g.fillRect(x, 0, 1, yi);
      if (type !== 'glow') {
        let a = 0.5, b = 0.5; // pupil half-axes as a fraction of the iris
        if (type === 'cat') { a = 0.13; b = 0.9; } else if (type === 'goat') { a = 0.85; b = 0.22; }
        const pr = (a * b) / Math.sqrt((b * Math.cos(psi)) ** 2 + (a * Math.sin(psi)) ** 2);
        g.fillStyle = '#050406'; g.fillRect(x, 0, 1, yi * pr);
      }
    }
    if (type === 'glow') {
      mat.emissive = col.clone(); mat.emissiveIntensity = 1.3;
      const em = document.createElement('canvas'); em.width = 4; em.height = H;
      const eg = em.getContext('2d'); eg.fillStyle = '#000'; eg.fillRect(0, 0, 4, H);
      const gg = eg.createLinearGradient(0, 0, 0, yi); gg.addColorStop(0, '#fff'); gg.addColorStop(1, '#333');
      eg.fillStyle = gg; eg.fillRect(0, 0, 4, yi);
      mat.emissiveMap = new THREE.CanvasTexture(em);
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = THREE.RepeatWrapping; tex.anisotropy = 4;
  mat.map = tex;
  M.eyeCache.set(key, mat);
  if (M.eyeCache.size > 24) {                    // keep the cache small: dragging the eye-colour slider makes many
    const [k, old] = M.eyeCache.entries().next().value;
    M.eyeCache.delete(k); old.map.dispose(); if (old.emissiveMap) old.emissiveMap.dispose(); old.dispose();
  }
  return mat;
}
const clamp01 = (x) => Math.min(1, Math.max(0, x));
