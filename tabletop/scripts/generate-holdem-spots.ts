/**
 * npm run generate:holdem-spots: rated problems for Hold'em practice (PLAN.md 2.6). Each is a
 * heads-up hand in a six-handed cash game where the other player moves all-in with every hand
 * face up ("cards up"): call or fold. The answer is proved the same way the lesson linter proves a
 * "best" claim (src/games/holdem/learn/verify.ts): exact equity, dealing every rest of the board,
 * and pot-odds arithmetic, with the right play better by at least MARGIN of the pot.
 *
 * Hands come from four lines (src/games/holdem/practice/spot.ts: you on the button against the
 * small blind, you in the big blind against a small-blind raise, a re-raised pot against the
 * cutoff, and a check-raise all-in), on the flop or the turn,
 * with the other player's stack set so the price ranges from cheap to dear. A deal is kept when
 * the decision is worth thinking about: you hold a draw or a pair, they hold something, and the
 * equity is not far from the price. Writes src/games/holdem/practice/spots.json.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRng } from '../src/core/rng';
import type { Rng } from '../src/core/rng';
import type { Card } from '../src/games/holdem/cards';
import { cardIndex, DECK } from '../src/games/holdem/cards';
import { holeOf } from '../src/games/holdem/learn/math';
import { MARGIN, prove } from '../src/games/holdem/learn/verify';
import type { Line } from '../src/games/holdem/practice/spot';
import { allInSpot, LINES } from '../src/games/holdem/practice/spot';
import { readHand } from '../src/games/holdem/reading';
import { holdem } from '../src/games/holdem/rules';

const OUT = join(import.meta.dirname, '..', 'src', 'games', 'holdem', 'practice', 'spots.json');
const WANT = Number(process.argv[2] ?? 160);
/** The all-in as a share of the pot it goes into. */
const RATIOS = [0.4, 0.55, 0.7, 0.85, 1, 1.2, 1.5, 2, 2.5];

interface Spot {
  id: string;
  position: string;
  setup: string;
  line: string[];
  rating: number;
  themes: string[];
  openHand: true;
  proof: { equity: number; need: number; gain: number };
}

function themesFor(you: Card[], them: Card[], board: Card[]): { themes: string[]; ahead: boolean; tier: number; draw: boolean } {
  const mine = readHand(holeOf({ hole: you }), board.map(cardIndex));
  const theirs = readHand(holeOf({ hole: them }), board.map(cardIndex));
  const flush = mine.draws.includes('flush-draw');
  const straight = mine.draws.includes('open-ended') || mine.draws.includes('gutshot');
  const themes: string[] = [];
  if (flush && straight) themes.push('poker-combo-draw');
  else if (flush) themes.push('poker-flush-draw');
  else if (straight) themes.push('poker-straight-draw');
  if (mine.draws.includes('overcards')) themes.push('poker-overcards');
  if (mine.category !== 'high-card') themes.push('poker-made-hand');
  if (flush || straight || mine.draws.includes('overcards')) themes.push('poker-draw');
  return { themes, ahead: mine.value > theirs.value, tier: mine.tier, draw: flush || straight };
}

function deal(rng: Rng): { you: Card[]; them: Card[]; board: Card[] } {
  const deck = rng.shuffle(DECK);
  return { you: deck.slice(0, 2), them: deck.slice(2, 4), board: deck.slice(4, 9) };
}

const problems: Spot[] = [];
const seen = new Set<string>();
let calls = 0;
let folds = 0;
for (let i = 0; problems.length < WANT && i < WANT * 3000; i++) {
  const rng = createRng(`holdem-spots/${i}`);
  const line = LINES[i % LINES.length] as Line;
  const street = rng.next() < 0.55 ? 'flop' : 'turn';
  const ratio = RATIOS[rng.int(RATIOS.length)] ?? 1;
  const cards = deal(rng);
  const shown = cards.board.slice(0, street === 'flop' ? 3 : 4);
  const t = themesFor(cards.you, cards.them, shown);
  const theirs = readHand(holeOf({ hole: cards.them }), shown.map(cardIndex));
  // You hold something to think about; they hold something worth moving all-in with.
  if (t.tier < 1 && !t.draw) continue;
  if (theirs.tier < 2) continue;
  const built = allInSpot(line, street, cards, ratio);
  if (!built) continue;
  const after = holdem.apply(built.before, holdem.codec.action.fromText(built.setup)).state;
  const proof = prove(after, true);
  if (proof.kind !== 'call') continue;
  if (Math.abs(proof.gain) < MARGIN * proof.stake) continue;
  const need = Math.min(after.players[0]?.stack ?? 0, after.currentBet - (after.players[0]?.bet ?? 0)) / proof.stake;
  const gap = proof.equity - need;
  // Not a foregone conclusion: equity within reach of the price, and some chance either way.
  if (Math.abs(gap) > 0.2 || proof.equity < 0.12 || proof.equity > 0.8) continue;
  // Keep calls and folds about even.
  if (proof.best === 'call' && calls > folds + 6) continue;
  if (proof.best === 'fold' && folds > calls + 6) continue;
  const key = holdem.codec.state.toText(built.before);
  if (seen.has(key)) continue;
  seen.add(key);
  if (proof.best === 'call') calls++;
  else folds++;
  // Harder: a close price, two cards to come, folding a pair, or calling without one.
  const closeness = 1 - Math.min(1, Math.abs(gap) / 0.2);
  const counter = (proof.best === 'fold' && t.themes.includes('poker-made-hand') ? 220 : 0) + (proof.best === 'call' && !t.themes.includes('poker-made-hand') && !t.ahead ? 180 : 0);
  const rating = Math.round(550 + 900 * closeness ** 1.5 + (street === 'flop' ? 150 : 0) + counter + (line.id === 'xr' || line.id === '3bet' ? 80 : 0));
  problems.push({
    id: `holdem-${String(problems.length + 1).padStart(3, '0')}`,
    position: key,
    setup: built.setup,
    line: [proof.best],
    rating,
    themes: [...t.themes, `poker-${street}`, 'poker-all-in'],
    openHand: true,
    proof: { equity: Math.round(proof.equity * 10000) / 10000, need: Math.round(need * 10000) / 10000, gain: Math.round(proof.gain * 100) / 100 },
  });
  if (problems.length % 20 === 0) console.log(`${problems.length} problems from ${i + 1} deals`);
}

problems.sort((a, b) => a.rating - b.rating);
writeFileSync(
  OUT,
  `${JSON.stringify({ source: 'generated by scripts/generate-holdem-spots.ts; every answer proved by exact equity with every hand known, and pot-odds arithmetic', margin: MARGIN, problems }, null, 1)}\n`,
);
console.log(`Wrote ${problems.length} problems (${calls} calls, ${folds} folds) to ${OUT}`);
