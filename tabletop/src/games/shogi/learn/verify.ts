/**
 * The engine checks behind the shogi lesson linter: legal positions, "best move" claims by an
 * engine margin (the built-in engine, every move scored at a fixed node budget), and moves for
 * both sides of free play (a mate search first when the goal is mate).
 */
import { isMateScore } from '../../../ai/pvs';
import type { LessonVerifier } from '../../../teach/lint';
import { searchState } from '../bots';
import { parseSfen, positionProblems } from '../core';
import { MateSolver } from '../mate';
import { canonicalOf } from '../notation';
import type { ShogiState } from '../rules';
import { shogiLessonGame } from './game';

/** Search size for a "best move" claim, spread over every legal move. */
export const CLAIM_NODES = 1_500_000;
/** Search size for each move of free play. */
export const FREE_PLAY_NODES = 300_000;
/** A "best" move must beat every other move by this much (engine units; a pawn is about 90). */
export const BEST_MARGIN = 150;
/** Accepted moves may trail the top move by this much and still count as equal. */
export const EQUAL_MARGIN = 60;

/** Remembers claim checks between runs (the lint script keeps it in node_modules/.cache). */
export interface ClaimCache {
  get(key: string): readonly string[] | undefined;
  set(key: string, problems: readonly string[]): void;
}

function show(score: number): string {
  if (isMateScore(score)) return score > 0 ? 'mates' : 'is mated';
  return `${score >= 0 ? '+' : ''}${score}`;
}

export function shogiVerifier(cache?: ClaimCache): LessonVerifier<ShogiState> {
  return {
    positionProblems: (state) => positionProblems(parseSfen(state.sfen)),

    async checkBest(state, accept) {
      const accepted = accept.map((m) => shogiLessonGame.canonical(state, m) ?? m);
      const key = `${state.sfen}|${accepted.join(',')}|${CLAIM_NODES}`;
      const hit = cache?.get(key);
      if (hit) return [...hit];
      const { result, p } = searchState(state, { nodes: CLAIM_NODES, exact: true, maxDepth: 8 });
      const scores = new Map(result.scored.map((s) => [canonicalOf(p.geo, s.move), s.score]));
      const problems: string[] = [];
      const top = result.scored[0];
      if (!top) return ['claim "best": the engine found no moves'];
      const topMove = canonicalOf(p.geo, top.move);
      for (const m of accepted) {
        const v = scores.get(m);
        if (v === undefined) problems.push(`claim "best": ${m} is not a legal move`);
        else if (v < top.score - EQUAL_MARGIN && !(isMateScore(v) && isMateScore(top.score) && v > 0)) problems.push(`claim "best": ${m} (${show(v)}) is worse than ${topMove} (${show(top.score)}) at depth ${result.depth}`);
      }
      const worst = Math.min(...accepted.map((m) => scores.get(m) ?? -Infinity));
      const rival = result.scored.find((s) => !accepted.includes(canonicalOf(p.geo, s.move)));
      if (rival && worst - rival.score < BEST_MARGIN && !(isMateScore(worst) && worst > 0 && !(isMateScore(rival.score) && rival.score > 0))) {
        problems.push(`claim "best": ${canonicalOf(p.geo, rival.move)} (${show(rival.score)}) is nearly as good as ${accepted.join('/')} (${show(worst)}) at depth ${result.depth}`);
      }
      await Promise.resolve();
      cache?.set(key, problems);
      return problems;
    },

    async freePlayMove(state, role, step) {
      if (role === 'student' && step.goal === 'mate') {
        const p = parseSfen(state.sfen);
        const solver = new MateSolver(p, 2_000_000);
        try {
          const plies = solver.shortest(7);
          if (plies !== null) {
            const line = solver.mainLine(plies);
            const first = line?.line[0];
            if (first !== undefined) return canonicalOf(p.geo, first);
          }
        } catch {
          // Fall back to the engine.
        }
      }
      await Promise.resolve();
      const { result, p } = searchState(state, { nodes: FREE_PLAY_NODES });
      return canonicalOf(p.geo, result.best);
    },
  };
}
