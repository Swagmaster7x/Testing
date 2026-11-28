/**
 * Mahjong learning (milestone 10): the numbers lessons quote, the lesson positions, the
 * verifier behind "best" claims, the drills and the rated discard problems, the table-ready
 * checklist and the auto-scoring switch. The lesson linter itself runs in `npm run check`.
 */
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { MAHJONG_LESSONS } from '../../src/games/mahjong/learn';
import { BASIC, lessonPosition, lessonState, mahjongComputed, mahjongLessonGame as g, othersPlay, after, RIICHI, stripMahjongNotation, winOnOffer } from '../../src/games/mahjong/learn/game';
import { YAKU_HAN } from '../../src/games/mahjong/styles/riichi';
import { efficiencyProblems, mahjongVerifier, positionProblems, safetyProblems } from '../../src/games/mahjong/learn/verify';
import { loadMahjongPractice, MAHJONG_DRILLS, provedDiscards } from '../../src/games/mahjong/practice';
import { engine, mahjong, STYLES, viewOf } from '../../src/games/mahjong/rules';
import { waitsOf } from '../../src/games/mahjong/core/shapes';
import { setsIn } from '../../src/games/mahjong/core/engine';
import { codeOf, countsOf, parseKind } from '../../src/games/mahjong/core/tiles';
import { basePoints, HK_DEFAULTS, HK_PATTERNS, hkFaan } from '../../src/games/mahjong/styles/hong-kong';
import { picture, safetyRanking } from '../../src/games/mahjong/strategy';
import { mahjongUi } from '../../src/games/mahjong/ui';
import { patternName } from '../../src/games/mahjong/ui/names';
import { inSet } from '../../src/games/practice';
import { readyItems } from '../../src/games/ready';
import type { LessonStep } from '../../src/teach/lesson';
import { STAGES, typedNumbers } from '../../src/teach/lesson';
import { lintLesson } from '../../src/teach/lint';

const random = (seed: string) => {
  const rng = createRng(seed);
  return () => rng.next();
};

describe('the numbers lessons quote', () => {
  const s = g.position(lessonPosition({ hand: '123m 456m 789p 345s 55s', drawn: '5s', options: BASIC, seed: 'unit' }));
  const c = mahjongComputed(s);

  it('come from the rules: the set, the hand, the faan table, points and payments', () => {
    expect(c['set:tiles']).toBe(144);
    expect(c['set:plain']).toBe(136);
    expect(c['set:kinds']).toBe(34);
    expect(c['hand:size']).toBe(13);
    expect(c['hand:sets']).toBe(4);
    expect(c['win:tiles']).toBe(14);
    expect(c['wall:stacks']).toBe(18);
    expect(c['wall:stacks:plain']).toBe(17);
    for (const id of HK_PATTERNS) expect(c[`faan:${id}`], id).toBe(hkFaan(id, HK_DEFAULTS));
    for (let f = 0; f <= 10; f++) expect(c[`points:${f}`]).toBe(basePoints(f, 'half-spicy'));
    expect(c['hk:min']).toBe(3);
    expect([c['pay:self'], c['pay:discarder'], c['pay:others'], c['pay:full']]).toEqual([2, 2, 1, 4]);
  });

  it('read the position with the coach’s calculators, and agree with the scorer on a win', () => {
    // A complete hand on offer: what it scores and collects is what the table would pay.
    const offer = winOnOffer(s);
    expect(offer?.selfDrawn).toBe(true);
    const won = mahjong.apply(s, { type: 'win' }).state;
    const result = won.results[0];
    expect(result?.wins[0]?.score.total).toBe(c['win:faan']);
    expect(result?.deltas[0]).toBe(c['win:total']);
    // Before a throw: every discard's tiles from ready and useful tiles.
    const t = g.position(lessonPosition({ hand: '123m 456m 789p 34s 99s W', drawn: 'W', options: BASIC, seed: 'unit' }));
    const v = mahjongComputed(t);
    expect(v['shanten:W']).toBe(0);
    expect(v['waits:W']).toBe(2);
    expect(v['waits:names:W']).toBe('2 bamboo or 5 bamboo');
  });

  it('treat tile names and codes as notation, never as typed numbers', () => {
    expect(typedNumbers('the 5 dots, 6-7-8 bamboo, the 3 and 4 bamboo, 5D, 3C, 7B, Orchid (flower 2), chow 6s', stripMahjongNotation)).toEqual([]);
    expect(typedNumbers('you need 3 faan and 2 more tiles', stripMahjongNotation)).toEqual(['3', '2']);
  });
});

describe('the Riichi numbers lessons quote', () => {
  it('come from the Riichi rules file: the set, the sticks, the yaku, the fu and the payment table', () => {
    const c = mahjongComputed(g.position(lessonPosition({ hand: '234m 567m 345p 77s 88s', style: 'riichi', options: RIICHI, dealer: 3, indicators: 'N', offer: { seat: 3, tile: '8s' }, avoid: '7s 8s', seed: 'unit-ron' })));
    expect([c['riichi:tiles'], c['riichi:start'], c['riichi:stake'], c['riichi:honba'], c['riichi:dead-wall']]).toEqual([136, 25000, 1000, 300, 14]);
    for (const [id, [closed, open]] of Object.entries(YAKU_HAN)) expect([c[`han:${id}`], c[`han:open:${id}`]], id).toEqual([closed, open]);
    expect([c['ron:1:30'], c['ron:2:30'], c['ron:3:30'], c['ron:4:30'], c['ron:dealer:4:30']]).toEqual([1000, 2000, 3900, 7700, 11600]);
    expect([c['band:mangan:han'], c['band:mangan:ron'], c['band:haneman:han'], c['band:baiman:han'], c['band:sanbaiman:han'], c['band:kazoe:ron']]).toEqual([5, 8000, 6, 8, 11, 32000]);
    expect([c['pay:ron'], c['pay:ron:dealer'], c['pay:tsumo:dealer-pays'], c['pay:tsumo:others-pay'], c['pay:tsumo:dealer']]).toEqual([4, 6, 2, 1, 2]);
    // The win on offer: tanyao, a pung completed by the throw: one han, forty fu, as the table pays.
    expect([c['win:han'], c['win:fu'], c['win:total']]).toEqual([1, 40, 1300]);
    expect(c['dora:names']).toBe('East wind');
  });

  it('agree with the table: a won Riichi hand pays what the lesson said, riichi stick included', () => {
    const start = lessonState({ hand: '234m 678m 345p 56s 99s W', drawn: 'W', style: 'riichi', options: RIICHI, dealer: 3, indicators: 'N', under: '5s', front: 'Gd 1p E 7s', avoid: '4s 7s', seed: 'unit-declare' });
    const declared = after(g.notation(start), 'riichi W');
    const ready = g.position(after(declared, othersPlay(declared)));
    const c = mahjongComputed(ready);
    expect(ready.ready[0]).not.toBeNull();
    const won = mahjong.apply(ready, { type: 'win' }).state;
    const result = won.results[0];
    expect(result?.wins[0]?.score.total).toBe(c['win:han']);
    expect(result?.deltas[0]).toBe(c['win:total']);
    // Riichi, ippatsu, menzen tsumo, pinfu and one ura dora: a mangan, plus the stick back.
    expect(result?.wins[0]?.score.lines.map((l) => l.id)).toEqual(['riichi', 'ippatsu', 'menzen-tsumo', 'pinfu', 'ura-dora']);
    expect(c['win:total']).toBe(8000 + 1000);
  });
});

describe('lesson positions', () => {
  it('put every tile in one place, the other hands far from winning, and leave a throw on offer to you alone', () => {
    const p = lessonState({ hand: '234m 678m 3p 5p 99p 2s RdRd', options: BASIC, offer: { seat: 2, tile: 'Rd' }, avoid: 'Rd', seed: 'unit-offer' });
    expect(p.phase).toBe('claim');
    expect(p.turn).toBe(0);
    expect(engine.legal(p, 0).map((a) => a.type)).toEqual(['pung', 'pass']);
    expect(engine.apply(p, { type: 'pass' }).state.phase).toBe('act');
    expect(positionProblems(p)).toEqual([]);
    // The others play on: each passes and throws what it draws.
    const q = lessonPosition({ hand: '234m 678m 3p 5p 99p 2s 4s W N', drawn: 'N', options: BASIC, seed: 'unit-turn', front: 'Wd S Gd 3s' });
    expect(othersPlay(after(q, 'N'))).toBe('Wd, S, Gd');
  });

  it('flag a hand of the wrong size', () => {
    const p = lessonState({ hand: '123m 456m 789p 345s 55s', drawn: '5s', options: BASIC, seed: 'unit' });
    const hands = p.hands.map((h, i) => (i === 0 ? h.slice(1) : h));
    expect(positionProblems({ ...p, hands, wall: [...p.wall, p.hands[0]?.[0] ?? ''] })[0]).toMatch(/seat 0 holds 13 tiles/);
  });
});

describe('the verifier', () => {
  const COUNT = lessonState({ hand: '234m 678s 13p 45s 79m EE', drawn: 'E', options: BASIC, seed: 'count', discards: ['N W', '2p S', '9s 2p', '1m Gd'] });

  it('proves an efficiency claim, refuses a worse throw, and refuses a near tie', async () => {
    expect(await mahjongVerifier.checkBest(COUNT, ['1p', '3p'])).toEqual([]);
    expect((await mahjongVerifier.checkBest(COUNT, ['7m', '9m']))[0]).toMatch(/best discards are 1p 3p/);
    expect((await mahjongVerifier.checkBest(COUNT, ['1p']))[0]).toMatch(/best discards are 1p 3p/);
    // Without the two 2 dots on the table, the gaps are equal and nothing is clearly best.
    const even = lessonState({ hand: '234m 678s 13p 45s 79m EE', drawn: 'E', options: BASIC, seed: 'count', discards: ['N W', '1s S', '9s 1s', '1m Gd'] });
    expect(efficiencyProblems(even, ['1p', '3p', '7m', '9m'])).toEqual([]);
    expect(efficiencyProblems(even, ['1p', '3p']).length).toBeGreaterThan(0);
  });

  it('proves a safety claim on a position marked for it', async () => {
    const danger = lessonState({
      hand: '234m 456p 78p 55s 6s N 9m 6m',
      drawn: '9m',
      options: BASIC,
      seed: 'safety-a',
      melds: [[], [], [{ type: 'pung', tiles: 'RdRdRd', from: 1 }, { type: 'chow', tiles: '345s', from: 1 }, { type: 'pung', tiles: '777s', from: 3 }], []],
      discards: ['E W', '1m 9p S', 'N 9m 2p Wd 1p', 'W 8m E'],
    });
    expect(await mahjongVerifier.checkBest(danger, ['9m'])).toEqual([]);
    expect((await mahjongVerifier.checkBest(danger, ['N']))[0]).toMatch(/safest tiles are 9m/);
    expect(safetyProblems(danger, ['5s']).length).toBeGreaterThan(0);
  });

  it('only judges discards on your turn', () => {
    const claim = lessonState({ hand: '234m 678m 3p 5p 99p 78s W', options: BASIC, offer: { seat: 3, tile: '6s' }, avoid: '6s', seed: 'unit-chow' });
    expect(efficiencyProblems(claim, ['chow 6s'])[0]).toMatch(/about a discard/);
  });
});

describe('lessons', () => {
  it('cover stages 0 to 2, the Hong Kong and Riichi tracks and Table-ready, in order, with real checklist items', () => {
    const count = (stage: string) => MAHJONG_LESSONS.filter((l) => l.stage === stage).length;
    expect(count('stage-0')).toBeGreaterThanOrEqual(2);
    for (const stage of ['stage-1', 'stage-2', 'stage-3', 'stage-4', 'table']) expect(count(stage), stage).toBeGreaterThanOrEqual(6);
    // Stage 4 holds the later styles' tracks, each on its own tables: a lesson named for a style (mahjong.4.sichuan-...) plays it, the rest are Riichi.
    for (const l of MAHJONG_LESSONS.filter((x) => x.stage === 'stage-4')) expect(g.position(l.start).config.style, l.id).toBe(Object.keys(STYLES).find((id) => l.id.startsWith(`mahjong.4.${id}`)) ?? 'riichi');
    const stages = MAHJONG_LESSONS.map((l) => l.stage);
    expect(stages).toEqual([...stages].sort((a, b) => STAGES.indexOf(a) - STAGES.indexOf(b)));
    const ids = new Set(MAHJONG_LESSONS.map((l) => l.id));
    expect(ids.size).toBe(MAHJONG_LESSONS.length);
    for (const item of readyItems('mahjong')) for (const id of item.lessons ?? []) expect(ids.has(id), id).toBe(true);
    const drill = readyItems('mahjong').find((item) => item.drill)?.drill?.id;
    expect(MAHJONG_DRILLS.some((d) => d.id === drill)).toBe(true);
  });

  it('ask for a move only where it is your turn, and every lesson passes the linter', async () => {
    for (const lesson of MAHJONG_LESSONS) {
      let position = lesson.start;
      const check = (step: LessonStep, at: string, where: string) => {
        if (step.kind === 'askMove') expect(g.toMove(g.position(at)), `${lesson.id} ${where}`).toBe(0);
      };
      lesson.steps.forEach((step, i) => {
        if (step.position) position = step.position;
        if (step.kind === 'checkpoint') {
          let qp = position;
          for (const q of step.questions) {
            if (q.position) qp = q.position;
            check(q, qp, `step ${i + 1}`);
          }
          return;
        }
        check(step, position, `step ${i + 1}`);
        if (step.kind === 'show') position = after(position, step.moves.join(', '));
        if (step.kind === 'askMove') position = after(position, [step.accept[0], step.reply].filter(Boolean).join(', '));
      });
      expect(await lintLesson(lesson, g, mahjongVerifier), lesson.id).toEqual([]);
    }
  });
});

describe('drills', () => {
  it('make sound exercises that the lesson linter passes', async () => {
    for (const drill of MAHJONG_DRILLS) {
      const next = random(`unit/${drill.id}`);
      for (let i = 0; i < 6; i++) {
        const lesson = drill.make(next);
        expect(await lintLesson(lesson, g, mahjongVerifier), `${drill.id} #${i}`).toEqual([]);
      }
    }
  });

  it('ask what the calculators and the scorer say', () => {
    const make = (id: string, seed: string) => {
      const d = MAHJONG_DRILLS.find((x) => x.id === id);
      if (!d) throw new Error(id);
      return d.make(random(seed));
    };
    for (let i = 0; i < 8; i++) {
      // What would you discard: exactly the proved best throws.
      const discard = make('drill-mahjong-discard', `unit/discard/${i}`);
      const ds = g.position(discard.start);
      const step = discard.steps[0];
      if (step?.kind !== 'askMove') throw new Error('not a move');
      expect([...step.accept].sort()).toEqual((provedDiscards(ds) ?? []).map(codeOf).sort());

      // Waits: the count is the shape's waits after the stray tile goes.
      const waits = make('drill-mahjong-waits', `unit/waits/${i}`);
      const ws = g.position(waits.start);
      const first = waits.steps[0];
      if (first?.kind !== 'askNumber') throw new Error('not a number');
      const stray = parseKind(first.answer.replace('waits:', '')) ?? -1;
      const counts = countsOf(ws.hands[0] ?? []);
      counts[stray] = (counts[stray] ?? 0) - 1;
      const r = engine.rules(ws.config);
      expect(mahjongComputed(ws)[first.answer]).toBe(waitsOf(counts, 0, r.shapes, setsIn(r)).length);

      // Score the hand: the faan and the total are what the table pays once you win.
      const score = make('drill-mahjong-score', `unit/score/${i}`);
      const ss = g.position(score.start);
      const won = g.play(ss, 'win');
      const res = won?.results[won.results.length - 1];
      expect(res?.wins[0]?.score.total).toBe(mahjongComputed(ss)['win:faan']);
      expect(res?.deltas[0]).toBe(mahjongComputed(ss)['win:total']);

      // Name the pattern: the right answer is on the sheet, the others are not.
      const patterns = make('drill-mahjong-patterns', `unit/patterns/${i}`);
      const ps = g.position(patterns.start);
      const lines = winOnOffer(ps)?.score.lines.map((l) => l.id) ?? [];
      const ask = patterns.steps[0];
      if (ask?.kind !== 'askChoice') throw new Error('not a choice');
      const named = (text: string) => HK_PATTERNS.find((id) => text === patternName(id));
      for (const o of ask.options) expect(lines.includes(named(o.text) ?? '?'), o.text).toBe(o.correct === true);

      // Riichi han and fu: what the scorer says, and what the table pays once you win.
      const hanFu = make('drill-mahjong-han-fu', `unit/han-fu/${i}`);
      const hs = g.position(hanFu.start);
      const hw = g.play(hs, 'win');
      const hr = hw?.results[hw.results.length - 1];
      expect(hs.config.style).toBe('riichi');
      expect([hr?.wins[0]?.score.total, hr?.wins[0]?.score.fu, hr?.deltas[0]]).toEqual([mahjongComputed(hs)['win:han'], mahjongComputed(hs)['win:fu'], mahjongComputed(hs)['win:total']]);

      // Name the yaku: the right answer is on the sheet, the others are not.
      const yaku = make('drill-mahjong-yaku', `unit/yaku/${i}`);
      const ys = g.position(yaku.start);
      const yLines = winOnOffer(ys)?.score.lines.map((l) => l.id) ?? [];
      const yAsk = yaku.steps[0];
      if (yAsk?.kind !== 'askChoice') throw new Error('not a choice');
      const yNamed = (text: string) => Object.keys(YAKU_HAN).find((id) => text === patternName(id));
      for (const o of yAsk.options) expect(yLines.includes(yNamed(o.text) ?? '?'), o.text).toBe(o.correct === true);

      // Safe tile against a riichi: the safest by the coach's ranking, against a declared seat.
      const rsafe = make('drill-mahjong-riichi-safe', `unit/riichi-safe/${i}`);
      const rs = g.position(rsafe.start);
      const rmove = rsafe.steps[0];
      if (rmove?.kind !== 'askMove') throw new Error('not a move');
      expect(rs.ready.some(Boolean)).toBe(true);
      expect(rmove.accept).toEqual([codeOf(safetyRanking(picture(viewOf(rs, 0)))[0]?.kind ?? -1)]);

      // Safe tile: the safest by the coach's ranking.
      const safe = make('drill-mahjong-safe', `unit/safe/${i}`);
      const sf = g.position(safe.start);
      const move = safe.steps[0];
      if (move?.kind !== 'askMove') throw new Error('not a move');
      expect(move.accept).toEqual([codeOf(safetyRanking(picture(viewOf(sf, 0)))[0]?.kind ?? -1)]);
    }
  });
});

describe('practice', () => {
  it('ships more than a hundred discard problems, each answer proved from the rebuilt position', async () => {
    const pack = await loadMahjongPractice();
    const set = pack.sets[0];
    if (!set) throw new Error('no problem set');
    expect(pack.problems.filter((p) => inSet(p, set)).length).toBeGreaterThanOrEqual(100);
    expect(new Set(pack.problems.map((p) => p.id)).size).toBe(pack.problems.length);
    for (const p of pack.problems) {
      const s = g.position(p.position);
      expect(g.toMove(s), p.id).toBe(0);
      expect(positionProblems(s), p.id).toEqual([]);
      const best = [p.line[0] ?? '', ...(p.alsoFirst ?? [])];
      expect(efficiencyProblems(s, best), p.id).toEqual([]);
      expect(g.play(s, p.line[0] ?? ''), p.id).not.toBeNull();
    }
    const ratings = pack.problems.map((p) => p.rating);
    expect(Math.max(...ratings) - Math.min(...ratings)).toBeGreaterThan(400);
  });
});

describe('the auto-scoring switch', () => {
  it('is a coach switch, on by default, and turning it off is not training', () => {
    const help = mahjongUi.coach?.helps.find((h) => h.id === 'autoScore');
    expect(help).toMatchObject({ on: true, training: false });
  });
});
