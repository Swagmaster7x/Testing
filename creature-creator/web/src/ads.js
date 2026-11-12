// Rewarded ads. In the Android app this asks the native side (AdMob) to show a rewarded video
// and waits for the result. In a plain browser there is no ad SDK, so a short placeholder
// stands in, which keeps every ad-gated feature usable while developing.
let waiting = null;
window.ccAdDone = (earned, why) => { const w = waiting; waiting = null; if (w) w({ ok: !!earned, why: why || '' }); };

/** Resolves { ok, why }. ok is true only if the viewer earned the reward. */
export function showAd() {
  if (waiting) return Promise.resolve({ ok: false, why: '' });
  return new Promise((resolve) => {
    waiting = resolve;
    if (window.Android && window.Android.showRewarded) {
      try { window.Android.showRewarded(); } catch (e) { window.ccAdDone(false, 'Ads are unavailable right now.'); return; }
      // Safety net: if the app never reports back, give up once the page has been visible again for a while.
      const mine = resolve; let seen = 0;
      const t = setInterval(() => {
        if (waiting !== mine) { clearInterval(t); return; }
        if (document.visibilityState === 'visible') seen++; else seen = 0;
        if (seen >= 20) { clearInterval(t); window.ccAdDone(false, 'The ad did not finish.'); }
      }, 1000);
      return;
    }
    if (window.__ccAdInstant) { window.ccAdDone(true); return; }
    const box = document.createElement('div');
    box.className = 'adph';
    let left = 3;
    const draw = () => { box.innerHTML = '<div><small>Ad placeholder</small><b>' + left + '</b><p>The Android app shows a real rewarded ad here.</p></div>'; };
    draw(); document.body.append(box);
    const t = setInterval(() => { left--; if (left <= 0) { clearInterval(t); box.remove(); window.ccAdDone(true); } else draw(); }, 1000);
  });
}
