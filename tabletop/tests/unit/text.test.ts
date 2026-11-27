import { describe, expect, it } from 'vitest';
import { CATALOG, GROUPS, SHELF } from '../../src/games/catalog';
import { NOUGHTS_LEVELS } from '../../src/games/noughts/levels';
import { CHESS_LEVELS } from '../../src/games/chess/levels';
import { en } from '../../src/text/en';
import { gameName, hasText, t, tCount, tDynamic } from '../../src/text';

describe('message catalogue', () => {
  it('has every text the shelf and hubs build at run time', () => {
    for (const game of CATALOG) {
      for (const field of ['name', 'aka', 'launch', 'later', 'practice', 'cpu']) expect(hasText(`game.${game.id}.${field}`), `game.${game.id}.${field}`).toBe(true);
    }
    for (const group of GROUPS) expect(hasText(`group.${group}`)).toBe(true);
  });

  it('has words for every bot reason tag, result reason and CPU level', () => {
    for (const tag of ['wins', 'blocks', 'fork', 'centre', 'takes-p', 'takes-n', 'takes-b', 'takes-r', 'takes-q', 'castles', 'promotes', 'check', 'mate']) expect(hasText(`tag.${tag}`), tag).toBe(true);
    for (const reason of ['line', 'board-full', 'resigned', 'checkmate', 'stalemate', 'threefold', 'fifty-move', 'insufficient', 'timeout', 'timeout-draw', 'pgn']) expect(hasText(`reason.${reason}`), reason).toBe(true);
    for (const level of NOUGHTS_LEVELS) expect(hasText(`noughts.level.${level.level}`)).toBe(true);
    for (const level of CHESS_LEVELS) expect(hasText(`chess.level.${level.level}`)).toBe(true);
    for (const idea of ['mate', 'win-material', 'check', 'fork', 'save-piece', 'defend', 'castle', 'develop', 'centre', 'improve']) expect(hasText(`coach.idea.${idea}`), idea).toBe(true);
    for (const kind of ['checkmate', 'stalemate', 'threefold', 'fifty-move', 'insufficient']) expect(hasText(`chess.log.end.${kind}`), kind).toBe(true);
  });

  it('fills in placeholders and counted phrases', () => {
    expect(t('common.level', { n: 3 })).toBe('Level 3');
    expect(tCount('count.games', 1)).toBe('1 saved game');
    expect(tCount('count.games', 4)).toBe('4 saved games');
    expect(tDynamic('no.such.key')).toBe('no.such.key');
    expect(gameName('chinese-checkers')).toBe('Chinese Checkers');
  });

  it('keeps the eight launch games and Tute on the shelf, in three groups, with the test game off it', () => {
    expect(SHELF.map((g) => g.id).sort()).toEqual(['brisca', 'chess', 'chinese-checkers', 'dominoes', 'go', 'mahjong', 'poker', 'shogi', 'tute']);
    expect(SHELF.some((g) => g.id === 'noughts')).toBe(false);
  });

  it('never nags: no streaks, reminders or guilt in the interface text', () => {
    const all = Object.values(en).join('\n').toLowerCase();
    for (const word of ['streak', "you missed", "don't lose", 'come back', 'hurry']) expect(all.includes(word), word).toBe(false);
  });
});
