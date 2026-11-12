// Rewarded ads. In the Android app this asks the native side (AdMob) to show a rewarded video
// and waits for the result. In a plain browser there is no ad SDK, so a short placeholder
// stands in, which keeps every ad-gated feature usable while developing.
let waiting = null;
window.ccAdDone = (earned, why) => { const w = waiting; waiting = null; if (w) w({ ok: !!earned, why: why || '' }); };

/** Resolves { ok, why }. ok is true only if the viewer earned the reward. */
export function showAd() {
  if (waiting) return Promise.resolve({ ok: false, why: 'busy' });
  return new Promise((resolve) => {
    waiting = resolve;
    if (window.Android && window.Android.showRewarded) { window.Android.showRewarded(); return; }
    if (window.__ccAdInstant) { window.ccAdDone(true); return; }
    const box = document.createElement('div');
    box.className = 'adph';
    let left = 3;
    const draw = () => { box.innerHTML = '<div><small>Ad placeholder</small><b>' + left + '</b><p>The Android app shows a real rewarded ad here.</p></div>'; };
    draw(); document.body.append(box);
    const t = setInterval(() => { left--; if (left <= 0) { clearInterval(t); box.remove(); window.ccAdDone(true); } else draw(); }, 1000);
  });
}
