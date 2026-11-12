# Tests

These are the scripts used to check the game during development. They need Node, and the browser
ones need Playwright with Chromium (`npm i playwright && npx playwright install chromium`). Build
the web bundle first (`cd ../web && npm run build`). Screenshots go to `tests/out/`.

| Script | What it checks | Run |
| --- | --- | --- |
| `qa.js` | The main flows: daily gift, paying for a run, quitting mid-fight, deaths surviving a restart, revives, the title, goals, records, difficulty levels, the Endless Pit, the review prompt | `node qa.js` |
| `feat.js` | The guide, share and import codes, the backup mirror and restore, purchases, the friendly duel, analytics events | `node feat.js` |
| `monkey.js` | 2,500 random editor actions across five body types, then a fight with whatever came out | `node monkey.js` |
| `energy.js` | The run timer, ad refill, doubled points, the ad revive | `node energy.js` |
| `audiotest.js` | Sounds decode and play; music starts, switches and pauses | `node audiotest.js` |
| `fuzz-entry.js` | 6,000 random fights, drafts and item checks, with no browser | `npx esbuild fuzz-entry.js --bundle --platform=node --outfile=out/fuzz.cjs && node out/fuzz.cjs` |
| `bal-entry.js` | Balance: win rates by body type (`MODE=types`), by difficulty level (`MODE=levels LEVELS='[[6,0,1],[8,0,1]]'`), and each reward's effect (default) | bundle the same way, then `MODE=types node out/bal.cjs` |
| `depth.js` | Settings (volume, language, text size, colour-blind, reduced motion), idle motion in the workshop, arena hazards, the weekly challenge won and lost | `node depth.js` |
| `check_lang.py` | Every translation file has every string, with its placeholders and emoji intact | `python3 check_lang.py es pt fr de` |

The browser scripts drive the game's clock by hand (`window.__ccPause`) because a software renderer is
too slow to play fights in real time. They do not replace testing on a real phone.
