const { chromium } = require('playwright');
const URL = 'file://' + require('path').resolve(__dirname, '../app/src/main/assets/www/index.html');
let fails = 0; const check = (name, ok, extra) => { if (!ok) fails++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra !== undefined ? '  ' + JSON.stringify(extra) : '')); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 860, height: 390 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error' && !/GPU stall/.test(m.text())) errs.push(m.text().slice(0, 300)); });
  p.on('pageerror', (e) => errs.push(e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 4).join(' | ').slice(0, 300)));
  p.on('dialog', (d) => d.accept());
  const load = async () => { await p.goto(URL); await p.waitForTimeout(1300); await p.evaluate(() => { window.__ccPause = true; window.__ccAdInstant = true; }); };
  const run = (n) => p.evaluate((n) => { const A = window.__cc.arena; for (let i = 0; i < n; i++) A.update(0.05, A.t); return A.phase; }, n);
  const until = async (phases, kill) => { for (let i = 0; i < 400; i++) { const ph = await run(10); if (kill !== undefined && ph === 'fight') await p.evaluate((k) => { const A = window.__cc.arena; A.F[k].hp = 1; A.F[k].wind = false; A.F[k].shield = 0; }, kill); if (phases.includes(ph)) return ph; } return 'timeout'; };
  const meta = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__cc.meta)));
  const ls = (k) => p.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), k);
  await load();
  // daily gift
  const m0 = await meta();
  check('daily gift card shown', await p.locator('.card.gift').count() === 1);
  await p.locator('.card.gift').tap(); await p.waitForTimeout(200);
  const m1 = await meta(); check('daily gift pays 40 and is gone', m1.points === m0.points + 40 && await p.locator('.card.gift').count() === 0, m1.daily);
  // start a run
  await p.evaluate(() => { const c = window.__cc; const d = c.newCreature('quadruped'); d.name = 'QA Beast'; c.open(d); });
  await p.getByRole('button', { name: /Battle/ }).tap(); await p.waitForTimeout(200);
  await p.locator('#ggo').tap();
  const r1 = await ls('cc.run'); check('run charged and saved at once', (await meta()).runs.n === 4 && r1 && r1.paid && r1.fighting, r1 && { paid: r1.paid, fighting: r1.fighting });
  // editor touches during a fight must not edit the creature
  const before = await p.evaluate(() => JSON.stringify(window.__cc.data.nodes));
  await run(50);
  for (const [x, y] of [[430, 200], [500, 230], [380, 180]]) { await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(x + 60, y - 70, { steps: 4 }); await p.mouse.up(); }
  check('swipes in a fight do not edit the body', before === await p.evaluate(() => JSON.stringify(window.__cc.data.nodes)));
  // quit mid-fight: forgiven once
  await load();
  check('resume card after mid-fight quit', await p.locator('.card.resume:not(.gift):not(.intro)').count() === 1);
  await p.locator('.card.resume:not(.gift):not(.intro)').tap(); await p.waitForTimeout(200);
  check('first walk-out is forgiven with a warning', /forgiven once/.test(await p.locator('.panel').innerText()) && (await meta()).runs.n === 4);
  await p.locator('.panel button.go').tap(); await run(50);
  await load(); await p.locator('.card.resume:not(.gift):not(.intro)').tap(); await p.waitForTimeout(200);
  check('second walk-out counts as a death', /has fallen/.test(await p.locator('.panel').innerText()), (await p.locator('.panel button').allInnerTexts()).join(' / '));
  // closing on the death screen does not undo it
  await load(); await p.locator('.card.resume:not(.gift):not(.intro)').tap(); await p.waitForTimeout(200);
  check('death survives a restart', /has fallen/.test(await p.locator('.panel').innerText()));
  await p.locator('.panel button.ad').tap(); await p.waitForTimeout(300);
  check('ad revive works from the restored death screen', ['intro', 'fight'].includes(await run(1)), await p.evaluate(() => Math.round(window.__cc.arena.F[0].hp)));
  // win fights; look for an elite and check points
  let elite = false, pts0 = (await meta()).points;
  for (let i = 0; i < 4; i++) { const ph = await until(['won', 'dead', 'champion'], 1); if (ph !== 'won') break; elite = elite || await p.evaluate(() => !!window.__cc.arena.elite); await p.locator('.reward').first().tap(); }
  const mm = await meta(); check('fights pay points and count towards goals', mm.points > pts0 && mm.stats.fightsWon >= 4 && Object.keys(mm.seen).length >= 1, { pts: mm.points - pts0, won: mm.stats.fightsWon, seen: Object.keys(mm.seen).length, eliteSeen: elite });
  // champion: bank on arrival
  await p.evaluate(() => { const A = window.__cc.arena; A.run.round = 9; });
  await p.evaluate(() => { const A = window.__cc.arena; A.F[1].hp = 1; A.run.round = 9; });
  const ph = await until(['champion', 'won', 'dead'], 1);
  const pBefore = mm.points, m2 = await meta();
  check('title banked on the champion screen; next level opens', ph === 'champion' && m2.champions === 1 && m2.level === 1 && m2.hall.length === 1 && m2.points >= pBefore + 400, { ph, pts: m2.points - pBefore, level: m2.level });
  check('champion screen shows the run summary', /Damage dealt/i.test(await p.locator('.panel').innerText()) && /Novice Champion/.test(await p.locator('.panel').innerText()));
  await load();
  const m3 = await meta(); check('closing on the champion screen keeps the prize; no stale run', m3.champions === 1 && (await ls('cc.run')) === null && (await ls('cc.saved'))[0].data.champion === 1);
  // goals
  await p.locator('.goalbtn').tap(); await p.waitForTimeout(300);
  const claimable = await p.locator('.shoprow button.go').count(); const pG = (await meta()).points;
  await p.locator('.shoprow button.go').first().tap(); await p.waitForTimeout(200);
  check('goals can be claimed once', claimable >= 2 && (await meta()).points > pG && await p.locator('.shoprow button.go').count() === claimable - 1, { claimable });
  await p.screenshot({ path: __dirname + '/out/q_goals.png' });
  await p.locator('.chips button', { hasText: 'Records' }).tap(); await p.waitForTimeout(300);
  check('records list the champion', /QA Beast/.test(await p.locator('.shop').innerText()));
  await p.screenshot({ path: __dirname + '/out/q_records.png' });
  await p.locator('.shopbtn').first().tap(); await p.waitForTimeout(300);
  // rank chips on the gate
  await p.locator('.card', { hasText: 'QA Beast' }).last().tap(); await p.waitForTimeout(400);
  await p.getByRole('button', { name: /Battle/ }).tap(); await p.waitForTimeout(300);
  check('difficulty choice shown at the gate', await p.locator('.ranks .chips button').count() === 5 && await p.locator('.ranks .chips button', { hasText: 'Silver' }).isDisabled(), await p.locator('.ranks .chips button').allInnerTexts());
  await p.locator('.ranks .chips button', { hasText: 'Bronze' }).tap(); await p.waitForTimeout(150);
  check('picking Bronze sets an 8-fight gauntlet', /faces 8 fights/.test(await p.locator('.panel').innerText()));
  await p.evaluate(() => { const c = window.__cc; c.renderer.render(c.scene, c.camera); }); await p.waitForTimeout(300);
  await p.screenshot({ path: __dirname + '/out/q_gate.png', timeout: 60000 }).catch(() => {});
  // head start gift only once per gauntlet
  await p.evaluate(() => { const c = window.__cc; c.meta.boosts.head = 1; c.saveMeta(); });
  await p.locator('#ggo').tap(); await p.waitForTimeout(200);
  check('head start gift offered', await p.locator('.reward').count() === 3);
  await p.locator('.reward').first().tap(); await run(40);
  await load(); await p.locator('.card.resume:not(.gift):not(.intro)').tap(); await p.waitForTimeout(200); await p.locator('.panel button.go').tap(); await p.waitForTimeout(200);
  check('head start gift is not offered again after a restart', await p.locator('.reward').count() === 0 && ['intro', 'fight'].includes(await run(1)), await p.evaluate(() => window.__cc.arena.run.load.weapons.length + window.__cc.arena.run.load.relics.length + window.__cc.arena.run.load.abilities.length));
  // ---- endless pit: never costs the creature; review prompt after a happy moment
  await load();
  await p.evaluate(() => { localStorage.removeItem('cc.run'); const c = window.__cc; c.meta.stats.runs = 5; c.meta.runs = { n: 5, t: Date.now() }; c.meta.boosts.head = 0; c.saveMeta(); window.Android = { requestReview: () => { window.__rev = (window.__rev || 0) + 1; } }; c.renderStart(); });
  await p.locator('.card', { hasText: 'QA Beast' }).last().tap(); await p.waitForTimeout(400);
  await p.getByRole('button', { name: /Battle/ }).tap(); await p.waitForTimeout(300);
  await p.locator('.ranks .chips button', { hasText: 'Endless' }).tap(); await p.waitForTimeout(150);
  check('endless gate', /Endless Pit/.test(await p.locator('.panel h2').innerText()));
  await p.locator('#ggo').tap();
  let wins = 0;
  for (let i = 0; i < 11; i++) { const ph2 = await until(['won', 'dead'], 1); if (ph2 !== 'won') break; wins++; await p.locator('.reward').first().tap(); }
  check('endless goes past ten fights with a champion every tenth', wins === 11 && await p.evaluate(() => window.__cc.arena.run.round) === 11, { wins });
  const fallen0 = (await meta()).fallen;
  await until(['dead'], 0);
  const txt = await p.locator('.panel').innerText();
  check('falling in the pit shows a summary and does not kill', /carried from the pit/.test(txt) && /Biggest hit/i.test(txt), (await p.locator('.panel button').allInnerTexts()).join(' / '));
  await p.locator('.panel button.go').tap(); await p.evaluate(() => { window.__ccPause = false; }); await p.waitForTimeout(2200);
  const m9 = await meta();
  check('creature survives the pit; best run recorded', m9.fallen === fallen0 && m9.stats.bestEndless === 11 && (await ls('cc.saved')).some((c) => c.name === 'QA Beast') && (await ls('cc.run')) === null, { best: m9.stats.bestEndless });
  check('review prompt requested once after a long pit run', await p.evaluate(() => window.__rev) === 1 && m9.review && m9.review.n === 1, m9.review);
  check('no page errors', errs.length === 0, errs.slice(0, 4));
  console.log(fails ? fails + ' CHECKS FAILED' : 'ALL CHECKS PASSED');
  await b.close();
})();
