const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 860, height: 390 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  p.on('console', (m) => { if (!/GPU stall/.test(m.text())) console.log('[' + m.type() + ']', m.text().slice(0, 500)); });
  p.on('pageerror', (e) => console.log('[pageerror]', e.message, (e.stack || '').split('\n').slice(0, 5).join(' | ')));
  p.on('dialog', (d) => d.accept());
  await p.goto('file://' + require('path').resolve(__dirname, '../app/src/main/assets/www/index.html'));
  await p.waitForTimeout(1500);
  const meta = () => p.evaluate(() => JSON.stringify({ runs: window.__cc.meta.runs.n, points: window.__cc.meta.points, revives: window.__cc.meta.revives }));
  const run = (n) => p.evaluate((n) => { const A = window.__cc.arena; for (let i = 0; i < n; i++) A.update(0.05, A.t); return A.phase; }, n);
  console.log('pill:', await p.locator('#runpill').innerText(), await meta());
  await p.screenshot({ path: __dirname + '/out/e_start.png' });
  // recharge maths: 0 runs, 65 minutes later -> 2 runs, 25 minutes to the next
  console.log('recharge:', await p.evaluate(() => { const m = { boosts: {}, runs: { n: 0, t: 1000 } }; const mod = window.__cc; return JSON.stringify(mod.runsNow(m, 1000 + 65 * 60000)); }));
  await p.evaluate(() => { window.__ccPause = true; window.__ccAdInstant = true; const c = window.__cc; c.meta.runs = { n: 0, t: Date.now() }; c.saveMeta(); const d = c.newCreature('humanoid'); d.name = 'Ad Tester'; c.open(d); });
  await p.getByRole('button', { name: 'Battle' }).tap(); await p.waitForTimeout(400);
  console.log('gate:', await p.locator('#gruns').innerText(), '| enter disabled:', await p.locator('#ggo').isDisabled());
  await p.evaluate(() => { const c = window.__cc; c.renderer.render(c.scene, c.camera); }); await p.waitForTimeout(300);
  await p.screenshot({ path: __dirname + '/out/e_gate.png', timeout: 60000 }).catch(() => {});
  await p.locator('#gad').tap(); await p.waitForTimeout(300);
  console.log('after ad:', await p.locator('#gruns').innerText(), await meta());
  await p.locator('#ggo').tap();
  console.log('entered, runs now', await meta());
  // win fight one by force
  await run(60); await p.evaluate(() => { window.__cc.arena.F[1].hp = 1; });
  for (let i = 0; i < 200 && (await run(10)) !== 'won'; i++);
  console.log('before double', await meta());
  await p.evaluate(() => { const c = window.__cc; c.renderer.render(c.scene, c.camera); }); await p.waitForTimeout(300);
  await p.screenshot({ path: __dirname + '/out/e_reward.png', timeout: 60000 }).catch(() => {});
  await p.locator('.panel button.ad').tap(); await p.waitForTimeout(300);
  console.log('after double', await meta(), 'ad buttons left:', await p.locator('.panel button.ad').count());
  await p.locator('.reward').first().tap();
  // die by force
  await run(60); await p.evaluate(() => { window.__cc.arena.F[0].hp = 1; window.__cc.arena.F[0].wind = false; });
  for (let i = 0; i < 300 && (await run(10)) !== 'dead'; i++);
  console.log('dead panel:', (await p.locator('.panel').innerText()).replace(/\n+/g, ' | ').slice(0, 330));
  await p.evaluate(() => { const c = window.__cc; c.renderer.render(c.scene, c.camera); }); await p.waitForTimeout(300);
  await p.screenshot({ path: __dirname + '/out/e_dead.png', timeout: 60000 }).catch(() => {});
  await p.locator('.panel button.ad').tap(); await p.waitForTimeout(300);
  console.log('after ad revive:', await p.evaluate(() => { const A = window.__cc.arena; return JSON.stringify({ phase: A.phase, round: A.run.round, hp: Math.round(A.F[0].hp), max: A.F[0].max, adRevived: A.run.adRevived }); }));
  await run(60); await p.evaluate(() => { window.__cc.arena.F[0].hp = 1; });
  for (let i = 0; i < 300 && (await run(10)) !== 'dead'; i++);
  console.log('second death, ad buttons:', await p.locator('.panel button.ad').count(), '| buttons:', (await p.locator('.panel button').allInnerTexts()).join(' / '));
  await b.close();
})();
