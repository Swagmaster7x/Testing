const { chromium } = require('playwright');
const URL = 'file://' + require('path').resolve(__dirname, '../app/src/main/assets/www/index.html');
let fails = 0; const check = (name, ok, extra) => { if (!ok) fails++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra !== undefined ? '  ' + JSON.stringify(extra).slice(0, 220) : '')); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const mk = async (state) => { const ctx = await b.newContext({ viewport: { width: 860, height: 390 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
    const p = await ctx.newPage(); await p.addInitScript((state) => { window.__saved = state || ''; window.Android = { shareText: (t) => { window.__shared = t; }, saveState: (s) => { window.__saved = s; }, loadState: () => window.__saved, track: (n, j) => { (window.__ev = window.__ev || []).push(n); }, buy: (id) => { window.__buy = id; } }; }, state);
    return p; };
  const p = await mk(''); const errs = []; let answer = '';
  p.on('pageerror', (e) => errs.push(e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | '))); p.on('console', (m) => { if (m.type() === 'error' && !/GPU stall/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  p.on('dialog', (d) => (d.type() === 'prompt' ? d.accept(answer) : d.accept()));
  await p.goto(URL); await p.waitForTimeout(1300);
  await p.evaluate(() => { window.__ccAdInstant = true; });
  // guide
  await p.locator('.card', { hasText: 'Quadruped' }).tap(); await p.waitForTimeout(500);
  check('guide shows step 1 on first open', /step 1 of 5/i.test(await p.locator('#coach').innerText()));
  await p.locator('#coach button.on').tap(); await p.waitForTimeout(150);
  check('Next advances the guide', /step 2 of 5/i.test(await p.locator('#coach').innerText()));
  await p.locator('#tabs button', { hasText: 'Head' }).tap(); await p.waitForTimeout(400); await p.locator('.tile', { hasText: 'Curved horn' }).tap(); await p.waitForTimeout(400);
  check('adding a part advances the guide', /step 3 of 5/i.test(await p.locator('#coach').innerText()));
  await p.locator('#coach button', { hasText: 'Skip' }).tap(); await p.waitForTimeout(150);
  check('guide can be skipped', await p.locator('#coach').isHidden());
  // save, share, import
  await p.evaluate(() => { window.__cc.data.name = 'Sharey'; }); await p.getByRole('button', { name: 'Save' }).tap(); await p.waitForTimeout(600);
  await p.getByRole('button', { name: 'Home' }).tap(); await p.waitForTimeout(400);
  await p.locator('.card .shr').first().tap(); await p.waitForTimeout(500);
  const code = await p.evaluate(() => window.__shared);
  check('share produces a short code', /^CAc[01]\.[A-Za-z0-9_-]+$/.test(code || '') && code.length < 3000, { len: (code || '').length });
  answer = code; await p.locator('.settings button', { hasText: 'Import' }).tap(); await p.waitForTimeout(900);
  const saved = await p.evaluate(() => JSON.parse(localStorage.getItem('cc.saved')).map((c) => [c.name, c.data.parts.length, !!c.thumb]));
  check('import adds the shared critter', saved.length === 2 && saved[0][0] === 'Sharey' && saved[0][1] === saved[1][1] && saved[0][2], saved);
  answer = 'garbage'; await p.locator('.settings button', { hasText: 'Import' }).tap(); await p.waitForTimeout(400);
  check('a bad code is refused', (await p.evaluate(() => JSON.parse(localStorage.getItem('cc.saved')).length)) === 2);
  // mirror to the app for cloud backup
  await p.waitForTimeout(1800);
  const mirror = await p.evaluate(() => window.__saved);
  check('progress is mirrored to the app for backup', /cc\.meta/.test(mirror) && /cc\.saved/.test(mirror), { bytes: mirror.length });
  // purchases
  await p.evaluate(() => { window.ccProducts([{ id: 'patron', price: '$4.99' }, { id: 'points_small', price: '$1.99' }]); });
  await p.locator('.shopbtn').tap(); await p.waitForTimeout(200); await p.locator('.chips button', { hasText: 'Premium' }).tap(); await p.waitForTimeout(300);
  check('premium tab shows store prices', /\$4\.99/.test(await p.locator('.shop').innerText()));
  await p.locator('.shoprow', { hasText: 'Purse of points' }).locator('button').tap();
  check('buy asks the store', await p.evaluate(() => window.__buy) === 'points_small');
  const p0 = await p.evaluate(() => window.__cc.meta.points);
  await p.evaluate(() => { window.ccPurchased('points_small', 'tok1'); window.ccPurchased('points_small', 'tok1'); window.ccPurchased('patron', 'tok2'); });
  const m = await p.evaluate(() => ({ pts: window.__cc.meta.points, patron: window.__cc.meta.patron }));
  check('a purchase is granted exactly once', m.pts === p0 + 2500 && m.patron === true, m);
  await p.screenshot({ path: __dirname + '/out/f_premium.png' });
  await p.locator('.shopbtn').first().tap(); await p.waitForTimeout(300);
  // duel
  await p.evaluate(() => { window.__ccPause = true; const c = window.__cc; c.meta.runs = { n: 0, t: Date.now() }; c.saveMeta(); });
  await p.locator('.card', { hasText: 'Sharey' }).first().tap(); await p.waitForTimeout(400);
  await p.getByRole('button', { name: /Battle/ }).tap(); await p.waitForTimeout(300);
  check('patron gate shows unlimited runs', /unlimited/i.test(await p.locator('#gruns').innerText()) && !(await p.locator('#ggo').isDisabled()));
  answer = code; await p.locator('.ranks .chips button', { hasText: 'Duel' }).tap(); await p.waitForTimeout(600);
  const ph = await p.evaluate(() => { const A = window.__cc.arena; A.auto = true; for (let i = 0; i < 6000 && A.phase !== 'won'; i++) A.update(0.05, A.t); return [A.phase, A.enemy.name, !!A.run.duel]; });
  const txt = await p.locator('.panel').innerText();
  check('duel is one fight with nothing at stake', ph[0] === 'won' && ph[1] === 'Sharey' && /wins the duel/.test(txt) && (await p.evaluate(() => localStorage.getItem('cc.run'))) in { null: 1, 'null': 1 }, ph);
  await p.locator('.panel button.go').tap(); await p.waitForTimeout(300);
  check('back in the workshop after the duel', await p.locator('#editor').isVisible());
  // backup code and restore-from-app on a fresh install
  await p.getByRole('button', { name: 'Home' }).tap(); await p.waitForTimeout(300);
  await p.evaluate(() => { window.__ccPause = false; }); await p.waitForTimeout(1800);
  const state = await p.evaluate(() => window.__saved);
  const p2 = await mk(state); await p2.goto(URL); await p2.waitForTimeout(1300);
  const r = await p2.evaluate(() => ({ pts: window.__cc.meta.points, patron: window.__cc.meta.patron, saved: JSON.parse(localStorage.getItem('cc.saved') || '[]').length }));
  check('a fresh install restores the backed-up save', r.pts === m.pts && r.patron && r.saved === 2, r);
  check('analytics events were sent', (await p.evaluate(() => (window.__ev || []).join(','))).includes('tutorial'), await p.evaluate(() => [...new Set(window.__ev || [])]));
  check('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fails ? fails + ' CHECKS FAILED' : 'ALL CHECKS PASSED');
  await b.close();
})();
