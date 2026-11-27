/**
 * Dominoes practice: endgame problems proved by exact search with every hand face up (generated
 * by scripts/generate-dominoes-endgames.ts), and three generated drills on the lesson runner:
 * what a player cannot have after passing, the pips you cannot see, and how many of a number are
 * still out. Drill positions come from hands played by level-3 bots, so they are real positions.
 */
import { createRng } from '../../../core/rng';
import type { Lesson } from '../../../teach/lesson';
import type { Problem } from '../../../teach/problem';
import type { DrillDef, PracticePack } from '../../practice';
import { chooseAction } from '../bots';
import { dominoesLessonGame } from '../learn/game';
import type { DominoesState } from '../rules';
import { cantHave, dominoes, endsOf, PUERTO_RICO_500, viewOf } from '../rules';

interface EndgameFile {
  readonly problems: readonly { id: string; position: string; setup: null; line: string[]; rating: number; themes: string[] }[];
}

const WORDS = ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'] as const;
const ONE = ['a blank', 'a one', 'a two', 'a three', 'a four', 'a five', 'a six'] as const;
const word = (n: number): string => WORDS[n] ?? String(n);
const WHO = ['you', 'the player on your right', 'your partner', 'the player on your left'] as const;

function lesson(id: string, title: string, start: string, steps: Lesson['steps']): Lesson {
  return { id: `dominoes.drill.${id}`, gameId: 'dominoes', stage: 'table', title, minutes: 1, start, steps };
}

/** A position from a hand played by level-3 bots, at your turn, that passes `want`. */
function playedPosition(random: () => number, want: (s: DominoesState) => boolean): DominoesState {
  for (let tries = 0; ; tries++) {
    const rng = createRng(`drill/${Math.floor(random() * 1e9)}`);
    let s: DominoesState = { ...dominoes.setup({ ...PUERTO_RICO_500, target: 0 }, rng.fork('deal')), handNo: 5 };
    const stopAfter = 6 + Math.floor(random() * 14);
    let fallback: DominoesState | null = null;
    while (!s.over && s.results.length === 0) {
      if (s.turn === 0 && s.chain.length >= stopAfter && dominoes.legal(s, 0).some((a) => a.type === 'play')) {
        if (want(s)) return s;
        fallback ??= tries > 30 ? s : null;
      }
      s = dominoes.apply(s, chooseAction(viewOf(s, s.turn), 3, rng.fork(`m${s.moves.length}`))).state;
    }
    if (fallback) return fallback;
  }
}

/** What a player who passed cannot hold. */
function cantHaveDrill(random: () => number): Lesson {
  const s = playedPosition(random, (st) => [1, 2, 3].some((seat) => cantHave(viewOf(st, 0), seat).size > 0));
  const view = viewOf(s, 0);
  const seat = [1, 2, 3].find((x) => cantHave(view, x).size > 0) ?? 1;
  const lacks = [...cantHave(view, seat)].sort();
  const right = `No ${lacks.map(word).join(' and no ')}`;
  // Wrong answers: other numbers, one of them on an end now when possible.
  const others = [0, 1, 2, 3, 4, 5, 6].filter((n) => !lacks.includes(n as 0));
  const pick = () => others.splice(Math.floor(random() * others.length), 1)[0] ?? 0;
  const wrongA = `No ${[pick(), ...(lacks.length > 1 ? [pick()] : [])].sort().map(word).join(' and no ')}`;
  const wrongB = 'Nothing: a pass tells you nothing';
  const options = [
    { text: right, correct: true, why: `Yes. They passed when the ends showed ${lacks.map(word).join(' and ')}, so they hold none.` },
    { text: wrongA, why: `Look at the ends when they passed: they showed ${lacks.map(word).join(' and ')}.` },
    { text: wrongB, why: 'A pass always tells you something: the player holds no tile with either number on the ends.' },
  ].sort(() => random() - 0.5);
  return lesson('cant-have', 'What a pass tells you', dominoes.codec.state.toText(s), [{ kind: 'askChoice', text: `Look at the moves: ${WHO[seat]} passed. What can they not hold?`, options }]);
}

/** The pips in the hands you cannot see: the set less the line and your hand. */
function pipsDrill(random: () => number): Lesson {
  const s = playedPosition(random, () => true);
  return lesson('pips', 'Pips you cannot see', dominoes.codec.state.toText(s), [
    { kind: 'askNumber', text: 'The set holds {set:pips} pips. Take away the line ({line:pips}) and your hand. How many pips are in the hands you cannot see?', answer: 'unseen:pips', success: 'Yes, {unseen:pips}.' },
  ]);
}

/** How many tiles of an end number are still unseen. */
function suitDrill(random: () => number): Lesson {
  const s = playedPosition(random, (st) => endsOf(st.chain) !== null);
  const ends = endsOf(s.chain) ?? [0, 0];
  const n = ends[Math.floor(random() * 2)] ?? ends[0];
  return lesson('suit', 'Count a number', dominoes.codec.state.toText(s), [
    { kind: 'askNumber', text: `An end shows ${ONE[n] ?? ''}. Counting the line and your hand, how many of the ${word(n)} have you not seen?`, answer: `unseen:${n}`, success: `Right: {unseen:${n}} of them are still out.` },
  ]);
}

export async function loadDominoesPractice(): Promise<PracticePack> {
  const file = (await import('./endgames.json')).default as unknown as EndgameFile;
  const problems: Problem[] = file.problems.map((p) => ({ id: p.id, position: p.position, setup: p.setup, line: p.line, rating: p.rating, themes: [...p.themes, 'endgame'], openHand: true }));
  const drills: DrillDef[] = [
    { id: 'drill-cant-have', make: cantHaveDrill },
    { id: 'drill-pips', make: pipsDrill },
    { id: 'drill-suit', make: suitDrill },
  ];
  return {
    problems,
    sets: [{ id: 'endgames', themes: ['endgame'], chips: ['one-move', 'long', 'blocks', 'double'] }],
    drills,
    attribution: null,
    game: dominoesLessonGame,
    themeOrder: ['blocks', 'makes-pass', 'plays-to-partner', 'double', 'heavy', 'one-move', 'long', 'endgame'],
  };
}
