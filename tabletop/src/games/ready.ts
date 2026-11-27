/**
 * The table-ready checklist (PLAN.md 1.1, point 3), per game. Each item is ticked by doing:
 * finishing lessons, passing a drill a number of times, or beating a CPU level without helps.
 */
export type ReadyId = 'setup' | 'terms' | 'score' | 'etiquette' | 'beat';

export const READY_IDS: readonly ReadyId[] = ['setup', 'terms', 'score', 'etiquette', 'beat'];

export interface ReadyItem {
  readonly id: ReadyId;
  readonly lessons?: readonly string[];
  readonly drill?: { readonly id: string; readonly times: number };
  readonly beatLevel?: number;
}

const READY: Readonly<Record<string, readonly ReadyItem[]>> = {
  brisca: [
    { id: 'setup', lessons: ['brisca.table.deal'] },
    { id: 'terms', lessons: ['brisca.1.pack', 'brisca.1.trumps', 'brisca.1.swap'] },
    { id: 'score', drill: { id: 'drill-pile', times: 5 } },
    { id: 'etiquette', lessons: ['brisca.table.manners', 'brisca.table.ask'] },
    { id: 'beat', beatLevel: 3 },
  ],
  dominoes: [
    { id: 'setup', lessons: ['dominoes.table.wash'] },
    { id: 'terms', lessons: ['dominoes.1.pass', 'dominoes.1.out', 'dominoes.1.bonus'] },
    { id: 'score', drill: { id: 'drill-pips', times: 5 } },
    { id: 'etiquette', lessons: ['dominoes.table.talk', 'dominoes.table.ask'] },
    { id: 'beat', beatLevel: 3 },
  ],
  chess: [
    { id: 'setup', lessons: ['chess.table.setup'] },
    { id: 'terms', lessons: ['chess.table.notation', 'chess.table.touch'] },
    { id: 'score', drill: { id: 'drill-count', times: 5 } },
    { id: 'etiquette', lessons: ['chess.table.draws', 'chess.table.clock'] },
    { id: 'beat', beatLevel: 3 },
  ],
  shogi: [
    { id: 'setup', lessons: ['shogi.table.setup'] },
    { id: 'terms', lessons: ['shogi.table.names', 'shogi.table.notation'] },
    { id: 'score', drill: { id: 'drill-shogi-points', times: 5 } },
    { id: 'etiquette', lessons: ['shogi.table.etiquette', 'shogi.table.clock'] },
    { id: 'beat', beatLevel: 3 },
  ],
  'chinese-checkers': [
    { id: 'setup', lessons: ['chinese-checkers.table.setup'] },
    { id: 'terms', lessons: ['chinese-checkers.1.hop', 'chinese-checkers.1.chain', 'chinese-checkers.1.blocked'] },
    { id: 'score', drill: { id: 'drill-cc-rows', times: 5 } },
    { id: 'etiquette', lessons: ['chinese-checkers.table.manners', 'chinese-checkers.table.ask'] },
    { id: 'beat', beatLevel: 3 },
  ],
  go: [
    { id: 'setup', lessons: ['go.table.nigiri', 'go.table.handicap'] },
    { id: 'terms', lessons: ['go.1.atari', 'go.1.ko', 'go.table.etiquette'] },
    { id: 'score', drill: { id: 'drill-go-count', times: 5 } },
    { id: 'etiquette', lessons: ['go.table.etiquette', 'go.table.clock'] },
    { id: 'beat', beatLevel: 3 },
  ],
};

export function readyItems(gameId: string): readonly ReadyItem[] {
  return READY[gameId] ?? [];
}

export interface ReadyFacts {
  readonly lessonsDone: ReadonlySet<string>;
  /** Right-first-time finishes of each drill. */
  readonly drillsPassed: ReadonlyMap<string, number>;
  /** The highest CPU level beaten in a game without helps, or 0. */
  readonly bestWin: number;
}

export function readyDone(item: ReadyItem, facts: ReadyFacts): boolean {
  if (item.lessons && !item.lessons.every((id) => facts.lessonsDone.has(id))) return false;
  if (item.drill && (facts.drillsPassed.get(item.drill.id) ?? 0) < item.drill.times) return false;
  if (item.beatLevel !== undefined && facts.bestWin < item.beatLevel) return false;
  return true;
}
