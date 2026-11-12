// Sound. Short effects are recorded samples played through Web Audio (several can overlap,
// with no delay); music is streamed with <audio> so long tracks never sit decoded in memory.
// A few sounds with no good recording (fanfares, roars, the crowd) are synthesised.
import { SFX_DATA } from './sfx-data.js';

const GROUPS = {};                         // 'hit' -> ['hit0', 'hit1', ...]
for (const k of Object.keys(SFX_DATA)) { const g = k.replace(/\d+$/, ''); (GROUPS[g] = GROUPS[g] || []).push(k); }
const MUSIC = { menu: 'audio/music_menu.mp3', battle: 'audio/music_battle.mp3', boss: 'audio/music_boss.mp3' };
const MUSIC_VOL = 0.32;

let ctx = null, out = null, unlocked = false, wantTrack = null, playing = null, hidden = false;
const buffers = {}, last = {}, players = {}, counts = {};
const opt = { music: true, sfx: true, mv: 1, sv: 1 };       // on/off, and volume 0..1 for each

function unlock() {
  if (unlocked) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    out = ctx.createGain(); out.gain.value = 0.9 * opt.sv; out.connect(ctx.destination);
    unlocked = true;
    for (const k of Object.keys(SFX_DATA)) {            // decode everything up front; it is only a few hundred KB
      const bin = atob(SFX_DATA[k]), buf = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      ctx.decodeAudioData(buf.buffer, (b) => { buffers[k] = b; }, () => {});
    }
    setMusic(wantTrack);
  } catch (e) { /* no audio on this device */ }
}
// Browsers only allow sound after the first touch.
window.addEventListener('pointerdown', unlock, { capture: true });
window.addEventListener('keydown', unlock, { capture: true });

/** Play a recorded effect by group name ('hit', 'click', ...). A random take is chosen each time. */
export function play(name, vol = 1, rate = 1) {
  if (!unlocked || !opt.sfx || hidden) return;
  const g = GROUPS[name]; if (!g) return;
  const now = ctx.currentTime;
  if (now - (last[name] || -1) < 0.045) return;          // the same sound twice in one instant only gets louder
  last[name] = now; counts[name] = (counts[name] || 0) + 1;
  const b = buffers[g[Math.floor(Math.random() * g.length)]]; if (!b) return;
  if (ctx.state === 'suspended') ctx.resume();
  const src = ctx.createBufferSource(), gain = ctx.createGain();
  src.buffer = b; src.playbackRate.value = rate * (0.94 + Math.random() * 0.12); gain.gain.value = vol;
  src.connect(gain).connect(out); src.start();
}

function tone(type, f0, f1, t0, dur, vol) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(out); o.start(t0); o.stop(t0 + dur + 0.03);
}
function noise(t0, dur, vol, freq, q, type = 'bandpass', sweep = 1) {
  const n = Math.floor(ctx.sampleRate * dur), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = b; f.type = type; f.frequency.setValueAtTime(freq, t0); f.frequency.exponentialRampToValueAtTime(freq * sweep, t0 + dur); f.Q.value = q;
  g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(vol, t0 + dur * 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(out); src.start(t0);
}
/** Synthesised sounds: 'win', 'lose', 'crowd', 'roar', 'cast', 'heal', 'fire', 'level'. */
export function synth(kind) {
  if (!unlocked || !opt.sfx || hidden) return;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime + 0.01, N = (semi) => 261.63 * Math.pow(2, semi / 12);
  if (kind === 'win') [0, 4, 7, 12, 16].forEach((s, i) => { tone('triangle', N(s), N(s), t + i * 0.11, i === 4 ? 0.7 : 0.2, 0.22); tone('sine', N(s + 12), N(s + 12), t + i * 0.11, 0.18, 0.08); });
  else if (kind === 'level') [7, 12, 16, 19].forEach((s, i) => tone('triangle', N(s), N(s), t + i * 0.08, 0.22, 0.2));
  else if (kind === 'lose') [0, -2, -5, -9].forEach((s, i) => tone('sawtooth', N(s - 12), N(s - 12.5), t + i * 0.22, i === 3 ? 0.9 : 0.3, 0.13));
  else if (kind === 'crowd') { noise(t, 1.8, 0.2, 900, 0.7, 'bandpass', 1.5); noise(t + 0.1, 1.6, 0.12, 1800, 1.2, 'bandpass', 0.8); }
  else if (kind === 'roar') { tone('sawtooth', 110, 55, t, 0.7, 0.22); noise(t, 0.7, 0.2, 300, 1.5, 'bandpass', 0.5); }
  else if (kind === 'cast') { tone('sine', 500, 1100, t, 0.25, 0.14); tone('triangle', 750, 1500, t + 0.05, 0.25, 0.08); }
  else if (kind === 'heal') [12, 16, 19].forEach((s, i) => tone('sine', N(s), N(s), t + i * 0.07, 0.35, 0.14));
  else if (kind === 'fire') noise(t, 0.6, 0.25, 500, 0.8, 'lowpass', 3);
}

function setMusic(track) {
  wantTrack = track;
  if (!unlocked) return;
  const want = opt.music && !hidden ? track : null;
  if (want === playing) return;
  const old = players[playing];
  if (old) { const a = old; let v = a.volume; const t = setInterval(() => { v -= 0.04; if (v <= 0) { a.pause(); clearInterval(t); } else a.volume = v; }, 40); }
  playing = want;
  if (!want) return;
  let a = players[want];
  if (!a) { a = players[want] = new Audio(MUSIC[want]); a.loop = true; a.preload = 'auto'; }
  a.volume = MUSIC_VOL * opt.mv; a.currentTime = 0;
  const p = a.play(); if (p && p.catch) p.catch(() => { playing = null; });
}
/** Switch the looping background track: 'menu', 'battle', 'boss', or null for silence. */
export const music = setMusic;
export function setAudio(o) {
  Object.assign(opt, o); opt.mv = Math.min(1, Math.max(0, opt.mv ?? 1)); opt.sv = Math.min(1, Math.max(0, opt.sv ?? 1));
  if (out) out.gain.value = 0.9 * opt.sv;
  if (playing && players[playing]) players[playing].volume = MUSIC_VOL * opt.mv;
  setMusic(wantTrack);
}
export const audioOn = () => ({ ...opt });
/** The app went to the background (or came back): stop making noise. */
export function pauseAudio(off) {
  hidden = off; const a = players[playing];
  if (off) { if (a) a.pause(); playing = null; if (ctx) ctx.suspend(); } else { if (ctx) ctx.resume(); setMusic(wantTrack); }
}
document.addEventListener('visibilitychange', () => pauseAudio(document.visibilityState !== 'visible'));
window.ccPause = pauseAudio;

/** For tests: what has been decoded and played so far. */
export const audioStats = () => ({ unlocked, decoded: Object.keys(buffers).length, total: Object.keys(SFX_DATA).length, counts: { ...counts }, playing, want: wantTrack, paused: playing && players[playing] ? players[playing].paused : null });
