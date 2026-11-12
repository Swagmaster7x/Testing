// Settings, arenas and their hazards, opponent temperaments, the weekly challenge, idle motion in the workshop.
const { chromium } = require('playwright');
const URL = 'file://' + require('path').resolve(__dirname, '../app/src/main/assets/www/index.html');
let fails = 0; const check = (name, ok, extra) => { if (!ok) fails++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra !== undefined ? '  ' + JSON.stringify(extra) : '')); };
(async () => {
  require('fs').mkdirSync(__dirname + '/out', { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 800, height: 360 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = [], calls = [];
  p.on('pageerror', (e) => errs.push(e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | '))); p.on('dialog', (d) => d.accept());
  await p.exposeFunction('__native', (n) => { calls.push(n); });
  await p.addInitScript(() => { window.Android = { askNotify() { window.__native('askNotify'); }, cancelReminders() { window.__native('cancel'); }, restorePurchases() { window.__native('restore'); }, privacyOptions() { window.__native('privacy'); }, showInterstitial() { window.__native('interstitial'); }, saveState() {}, loadState() { return ''; }, remind() {} }; });
  await p.goto(URL); await p.waitForTimeout(1200);
  await p.evaluate(() => { const c = window.__cc; c.meta.seenIntro = 1; c.meta.tut = 9; c.meta.tutFight = 1; c.saveMeta(); c.renderStart(); });
  // ---- settings
  await p.locator('.gear').tap(); await p.waitForTimeout(200);
  await p.locator('#vol-mv').evaluate((e) => { e.value = 30; e.dispatchEvent(new Event('input')); });
  await p.locator('#vol-sv').evaluate((e) => { e.value = 0; e.dispatchEvent(new Event('input')); });
  check('volume sliders are stored', await p.evaluate(() => { const a = window.__cc.meta.audio; return a.mv === 0.3 && a.sv === 0 && a.sfx === false && a.music === true; }), await p.evaluate(() => window.__cc.meta.audio));
  await p.locator('.setrow button', { hasText: 'Deutsch' }).tap(); await p.waitForTimeout(200);
  check('language switch applies at once', (await p.locator('#start h1 span').innerText()) === 'Einstellungen');
  await p.screenshot({ path: __dirname + '/out/settings_de.png' });
  await p.locator('#start').evaluate((e) => { e.scrollTop = 9999; }); await p.screenshot({ path: __dirname + '/out/settings_de2.png' });
  check('no setting row overflows sideways', await p.evaluate(() => [...document.querySelectorAll('.setrow')].every((r) => r.scrollWidth <= r.clientWidth + 1)));
  await p.locator('.setrow button', { hasText: 'English' }).tap(); await p.waitForTimeout(150);
  await p.locator('.setrow button', { hasText: 'Largest' }).tap(); await p.locator('.setrow button', { hasText: 'Low' }).tap();
  const rows = p.locator('.setrow');
  await rows.filter({ hasText: 'Colour-blind' }).locator('button', { hasText: 'On' }).tap(); await rows.filter({ hasText: 'Reduce motion' }).locator('button', { hasText: 'On' }).tap();
  check('display choices are stored and applied', await p.evaluate(() => { const m = window.__cc.meta, c = document.documentElement.classList; return m.textSize === 2 && m.gfxMode === 4 && m.cb && m.calm && c.contains('ts2') && c.contains('cb') && c.contains('calm') && window.__cc.gfx === 4; }));
  await rows.filter({ hasText: 'Reminders' }).locator('button', { hasText: 'On' }).tap(); await rows.filter({ hasText: 'Purchases' }).locator('button').tap(); await rows.filter({ hasText: 'Privacy' }).locator('button').tap(); await p.waitForTimeout(200);
  check('native settings reach the app', ['askNotify', 'restore', 'privacy'].every((x) => calls.includes(x)), calls);
  await p.reload(); await p.waitForTimeout(1200);
  check('settings survive a restart', await p.evaluate(() => { const c = document.documentElement.classList; return c.contains('ts2') && c.contains('calm') && window.__cc.gfx === 4 && window.__cc.meta.audio.mv === 0.3; }));
  await p.evaluate(() => { const c = window.__cc; Object.assign(c.meta, { textSize: 0, calm: false, cb: false, gfxMode: 'auto' }); c.saveMeta(); });
  await p.reload(); await p.waitForTimeout(1200);
  // ---- idle motion in the workshop
  await p.evaluate(() => { window.__ccIdle = true; const c = window.__cc; c.open(c.newCreature('quadruped')); });
  await p.waitForTimeout(500);
  check('creature is still while being edited', await p.evaluate(() => !window.__cc.preview));
  await p.evaluate(() => window.__cc.idleNow()); await p.waitForTimeout(1500);
  check('left alone, it starts to idle', await p.evaluate(() => !!(window.__cc.preview && window.__cc.preview.idle)));
  check('the Play button does not claim to be playing', !(await p.locator('#topbar').innerText()).includes('Stop'));
  await p.screenshot({ path: __dirname + '/out/idle.png', timeout: 60000 }).catch(() => {});
  await p.touchscreen.tap(500, 200); await p.waitForTimeout(400);
  check('a touch ends the idle at once', await p.evaluate(() => !window.__cc.preview));
  await p.evaluate(() => { window.__ccIdle = false; window.__ccPause = true; });
  // ---- arenas and temperaments
  await p.evaluate(() => { [...document.querySelectorAll('#topbar button')].pop().click(); }); await p.waitForTimeout(200);
  await p.evaluate(() => document.getElementById('ggo').click());
  const haz = await p.evaluate(() => {
    const c = window.__cc, A = c.arena, out = {}; A.auto = true;
    for (let k = 0; k < 150 && A.phase !== 'fight'; k++) A.update(0.05, A.t);
    out.first = [A.venue.id, A.temper.id];
    for (const v of ['mire', 'forge', 'storm', 'frost', 'moon']) {
      A.setVenue(v); A.F[0].hp = A.F[0].max = 100000; A.F[1].hp = A.F[1].max = 100000; A.F.time = 0; const h0 = A.F[0].hp + A.F[1].hp;
      for (let k = 0; k < 500; k++) A.update(0.05, A.t);
      out[v] = { lost: Math.round(h0 - A.F[0].hp - A.F[1].hp), air: A.venue.id === v && c.scene.background !== null };
    }
    return out;
  });
  check('the first fight is plain sand against a brawler', haz.first[0] === 'sands' && haz.first[1] === 'brawler', haz.first);
  check('hazard arenas hurt both fighters more than sand does not', haz.mire.lost > haz.frost.lost && haz.forge.lost > haz.frost.lost && haz.storm.lost > haz.frost.lost, haz);
  // ---- weekly challenge, win then loss
  const weekly = async (lose) => {
    await p.evaluate(() => { window.__ccPause = false; const c = window.__cc; c.open(c.newCreature('quadruped')); window.__ccPause = true; [...document.querySelectorAll('#topbar button')].pop().click(); });
    await p.waitForTimeout(250);
    await p.evaluate(() => [...document.querySelectorAll('.panel .chips button')].find((x) => /Weekly/.test(x.textContent)).click());
    const gate = await p.locator('.panel').innerText();
    await p.evaluate(() => document.getElementById('ggo').click());
    const r = await p.evaluate((lose) => { const c = window.__cc, A = c.arena; A.auto = true; const seen = new Set(), seeds = [A.run.seed];
      for (let n = 0; n < 12; n++) {
        for (let k = 0; k < 200 && A.phase !== 'fight'; k++) A.update(0.05, A.t);
        seen.add(A.venue.id);
        if (lose) A.F[0].hp = 1; else { A.F[1].hp = 1; A.F[0].hp = A.F[0].max; }
        for (let k = 0; k < 3000 && !['won', 'champion', 'dead'].includes(A.phase); k++) A.update(0.05, A.t);
        if (A.phase !== 'won') break;
        const rw = document.querySelector('.panel .reward'); if (rw) rw.click(); const nx = [...document.querySelectorAll('.panel button')].find((x) => /Next fight/.test(x.textContent)); if (nx) nx.click();
      }
      const out = { phase: A.phase, round: A.run.round, seed: A.run.seed, venues: [...seen], h2: document.querySelector('.panel h2').innerText, weekly: c.meta.weekly, pts: c.meta.points, alive: !!c.data, run: localStorage.getItem('cc.run') };
      [...document.querySelectorAll('.panel button')].pop().click(); return out; }, lose);
    return { gate, ...r };
  };
  const p0 = await p.evaluate(() => window.__cc.meta.points);
  const w1 = await weekly(false);
  check('weekly gate explains the rule and the prize', /first win this week pays 400/.test(w1.gate) && /Your best this week: 0 \/ 8/.test(w1.gate), w1.gate.slice(0, 160));
  check('weekly: eight fights in one arena, then the prize', w1.phase === 'champion' && w1.round === 8 && w1.venues.length === 1 && w1.venues[0] !== 'sands' && w1.weekly.done === 1 && w1.weekly.best === 8 && w1.pts >= p0 + 400, { ...w1, gate: undefined });
  const w2 = await weekly(true);
  check('weekly repeat: same seed, smaller prize on offer, a loss costs nothing', w2.seed === w1.seed && /repeat win pays 80/.test(w2.gate) && w2.phase === 'dead' && /carried out/.test(w2.h2) && w2.alive, { ...w2, gate: undefined });
  await p.waitForTimeout(300);
  check('back in the workshop with the creature', await p.evaluate(() => !document.getElementById('editor').classList.contains('hidden') && !!window.__cc.data && !localStorage.getItem('cc.run')) || await p.evaluate(() => localStorage.getItem('cc.run') === 'null'));
  check('no page errors', errs.length === 0, errs.slice(0, 4));
  console.log(fails ? fails + ' CHECKS FAILED' : 'ALL CHECKS PASSED');
  await b.close(); process.exit(fails ? 1 : 0);
})();
