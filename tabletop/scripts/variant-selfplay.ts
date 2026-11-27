/** Times the variant bots playing each other, and checks every move is legal. Run: npx tsx scripts/variant-selfplay.ts */
import type { BotChoice } from '../src/ai/bot';
import { createRng } from '../src/core/rng';
import { holdemBots } from '../src/games/holdem/bots';
import type { HoldemAction, HoldemConfig } from '../src/games/holdem/rules';
import { holdem, PRESETS, viewOf } from '../src/games/holdem/rules';

const names = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ['pot-limit-omaha', 'omaha-high-low', 'five-card-draw', 'seven-card-stud'];
for (const name of names) {
  const config = { ...(PRESETS[name] as HoldemConfig), hands: Number(process.env.HANDS ?? 20) };
  let s = holdem.setup(config, createRng(`self-${name}${process.env.SEED ?? ""}`));
  const rng = createRng(name + (process.env.SEED ?? ""));
  const levels = (process.env.LEVELS ?? '4').split(',').map(Number);
  let moves = 0;
  let worst = 0;
  const t0 = Date.now();
  const tags = new Map<string, number>();
  while (!s.over && moves < 5000) {
    const seat = s.toAct;
    if (seat === null) throw new Error('nobody to act');
    const t = Date.now();
    const choice = holdemBots.choose({ view: viewOf(s, seat), seat, level: levels[seat % levels.length], rng, budgetMs: 1000 } as never) as BotChoice<HoldemAction>;
    worst = Math.max(worst, Date.now() - t);
    for (const tag of choice.tags) tags.set(tag, (tags.get(tag) ?? 0) + 1);
    const text = holdem.codec.action.toText(choice.action);
    if (!holdem.legal(s, seat).some((a) => holdem.codec.action.toText(a) === text)) throw new Error(`illegal ${text}`);
    s = holdem.apply(s, choice.action).state;
    moves++;
  }
  const ms = Date.now() - t0;
  console.log(`${name}: ${moves} moves, ${(ms / moves).toFixed(1)} ms avg, worst ${worst} ms, hands ${s.handNo ?? '?'}, stacks ${s.players.map((p) => p.stack).join(' ')}`);
  if (levels.length > 1) {
    const by = new Map<number, number>();
    (holdem.outcome(s)?.results ?? []).forEach((r) => by.set(levels[r.seat % levels.length] as number, (by.get(levels[r.seat % levels.length] as number) ?? 0) + r.score));
    console.log('   net by level', [...by.entries()].map(([l, n]) => `L${l}:${n}`).join(' '));
  }
  console.log('  ', [...tags.entries()].map(([k, v]) => `${k}:${v}`).join(' '));
}
