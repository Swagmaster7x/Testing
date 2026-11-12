const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 860, height: 390 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const errs = {};
  p.on('console', (m) => { if (m.type() === 'error' && !/GPU stall/.test(m.text())) { const k = m.text().slice(0, 260); errs[k] = (errs[k] || 0) + 1; } });
  p.on('pageerror', (e) => { const k = e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 4).join(' | ').slice(0, 300); errs[k] = (errs[k] || 0) + 1; });
  p.on('dialog', (d) => d.accept());
  await p.goto('file://' + require('path').resolve(__dirname, '../app/src/main/assets/www/index.html'));
  await p.waitForTimeout(1500);
  await p.evaluate(() => { window.__ccPause = true; window.__ccAdInstant = true; const c = window.__cc; c.meta.points = 1e6; c.saveMeta(); });
  for (const type of ['humanoid', 'quadruped', 'cephalopod', 'serpent', 'arachnid']) {
    const res = await p.evaluate(async (type) => {
      const c = window.__cc; let seed = type.length * 7919; const R = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      c.open(c.newCreature(type));
      const log = [];
      for (let i = 0; i < 500; i++) {
        const roll = R();
        try {
          if (roll < 0.45) {                                  // press a random button in the panels
            const bs = [...document.querySelectorAll('#tabs button, #left button, #right button, #topbar .seg button')].filter((x) => !x.disabled && x.offsetParent);
            const b = bs[Math.floor(R() * bs.length)]; if (b) { log.push(b.textContent.slice(0, 18)); b.click(); }
          } else if (roll < 0.65) {                           // move a random slider
            const ss = [...document.querySelectorAll('#left input[type=range], #right input[type=range]')];
            const s = ss[Math.floor(R() * ss.length)]; if (s) { s.value = +s.min + R() * (s.max - s.min); s.dispatchEvent(new Event('input')); s.dispatchEvent(new Event('change')); }
          } else if (roll < 0.8) { const ps = c.data.parts; c.select(ps.length ? ps[Math.floor(R() * ps.length)].id : null); }
          else if (roll < 0.86) { const b = [...document.querySelectorAll('#topbar button')].find((x) => /Undo|Redo/.test(x.textContent) && !x.disabled && R() < 0.7); if (b) b.click(); }
          else if (roll < 0.9) { const ps = c.data.parts; if (ps.length) { const q = ps[Math.floor(R() * ps.length)]; q.u = -1 + R() * 3; q.a = R() * 6.28; } c.rebuild(); }
          else if (roll < 0.93) { const n = c.data.nodes[Math.floor(R() * c.data.nodes.length)]; n.y += (R() - 0.5) * 0.4; n.z += (R() - 0.5) * 0.4; c.rebuild(); }
          else c.rebuild();
          if (i % 25 === 0) { c.rebuild(); c.renderer.render(c.scene, c.camera); }
        } catch (e) { return { fail: e.message + ' :: ' + (e.stack || '').split('\n').slice(1, 4).join(' | '), last: log.slice(-6), i }; }
      }
      let nan = 0; c.cr.group.traverse((o) => { if (o.isMesh) { const a = o.geometry.attributes.position.array; for (let k = 0; k < a.length; k += 97) if (!isFinite(a[k])) { nan++; break; } } });
      // now take whatever monster this is into the arena for one fight
      let fight = 'ok';
      try {
        [...document.querySelectorAll('#topbar button')].find((x) => /Battle/.test(x.textContent)).click();
        const go = document.getElementById('ggo'); if (!go) fight = 'no gate'; else { go.click(); const A = c.arena; A.auto = true; for (let k = 0; k < 4000 && !['won', 'dead', 'champion'].includes(A.phase); k++) A.update(0.05, A.t); c.renderer.render(c.scene, c.camera); fight = A.phase; A.back(); }
      } catch (e) { fight = 'THROW ' + e.message + ' :: ' + (e.stack || '').split('\n').slice(1, 4).join(' | '); }
      return { parts: c.data.parts.length, nodes: c.data.nodes.length, nanMeshes: nan, fight };
    }, type);
    console.log(type, JSON.stringify(res));
    await p.goto('file://' + require('path').resolve(__dirname, '../app/src/main/assets/www/index.html')); await p.waitForTimeout(1200);
    await p.evaluate(() => { window.__ccPause = true; window.__ccAdInstant = true; localStorage.removeItem('cc.run'); const c = window.__cc; c.meta.points = 1e6; c.meta.runs = { n: 5, t: Date.now() }; c.saveMeta(); });
  }
  console.log('errors:', JSON.stringify(errs, null, 1).slice(0, 3000));
  await b.close();
})();
