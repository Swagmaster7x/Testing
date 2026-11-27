/**
 * SGF (Smart Game Format, FF[4]) in and out for Go records. Only the main line is read; setup
 * stones are allowed in the first node only. Free handicap stones are written the standard way,
 * as AB in the first node with HA. The tests check this reader and writer against @sabaki/sgf.
 */
import type { Outcome } from '../../core/contract';
import type { Json } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import { handicapPoints, sgfName, sgfToXY } from './coords';
import type { GoConfig, GoPresetId, GoState } from './rules';
import { countState, go, makeConfig, parsePosition, positionText, PRESETS, presetRules } from './rules';

export type SgfNode = Record<string, string[]>;

interface SgfTree {
  readonly nodes: SgfNode[];
  readonly children: SgfTree[];
}

/** Parses SGF text into the nodes of its main line (the first variation at every branch). */
export function parseSgfMainLine(text: string): SgfNode[] {
  let i = 0;
  const n = text.length;
  const skipSpace = () => {
    while (i < n && /\s/.test(text[i] as string)) i++;
  };
  const parseNode = (): SgfNode => {
    i++; // the ';'
    const node: SgfNode = {};
    for (;;) {
      skipSpace();
      const m = /^[A-Za-z]+/.exec(text.slice(i, i + 32));
      if (!m) return node;
      // FF[3] allowed lower-case letters inside names ("AddBlack"); only the capitals count.
      const ident = m[0].replace(/[a-z]/g, '');
      i += m[0].length;
      const values: string[] = [];
      for (;;) {
        skipSpace();
        if (text[i] !== '[') break;
        i++;
        let value = '';
        while (i < n && text[i] !== ']') {
          if (text[i] === '\\' && i + 1 < n) {
            i++;
            // An escaped line break is a soft break: the lines join.
            if (text[i] === '\n') {
              i++;
              continue;
            }
          }
          value += text[i];
          i++;
        }
        if (i >= n) throw new Error('An SGF value is not closed with "]"');
        i++;
        values.push(value);
      }
      if (values.length === 0) throw new Error(`SGF property ${m[0]} has no value`);
      if (ident) node[ident] = [...(node[ident] ?? []), ...values];
    }
  };
  const parseTree = (): SgfTree => {
    i++; // the '('
    const nodes: SgfNode[] = [];
    const children: SgfTree[] = [];
    for (;;) {
      skipSpace();
      const ch = text[i];
      if (ch === ';') nodes.push(parseNode());
      else if (ch === '(') children.push(parseTree());
      else if (ch === ')') {
        i++;
        return { nodes, children };
      } else throw new Error(i >= n ? 'The SGF file ends before its last ")"' : `Unexpected "${ch ?? ''}" in the SGF file`);
    }
  };
  i = text.indexOf('(');
  if (i < 0) throw new Error('This is not an SGF file: no "(" found');
  let tree: SgfTree | undefined = parseTree();
  const line: SgfNode[] = [];
  while (tree) {
    line.push(...tree.nodes);
    tree = tree.children[0];
  }
  if (line.length === 0) throw new Error('The SGF file has no nodes');
  return line;
}

function escape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/]/g, '\\]');
}

/** Expands "aa:cc" rectangles (FF[4] compressed point lists) into single points. */
function expandPoints(values: readonly string[]): string[] {
  const out: string[] = [];
  for (const v of values) {
    const [a, b] = v.split(':');
    const from = a ? sgfToXY(a) : null;
    const to = b ? sgfToXY(b) : null;
    if (!from) throw new Error(`"${v}" is not an SGF point`);
    if (!to) {
      out.push(a as string);
      continue;
    }
    for (let y = Math.min(from.y, to.y); y <= Math.max(from.y, to.y); y++) {
      for (let x = Math.min(from.x, to.x); x <= Math.max(from.x, to.x); x++) out.push(`${String.fromCharCode(97 + x)}${String.fromCharCode(97 + y)}`);
    }
  }
  return out;
}

const RU_NAMES: Readonly<Record<GoPresetId, string>> = {
  chinese: 'Chinese',
  japanese: 'Japanese',
  aga: 'AGA',
  'new-zealand': 'NZ',
  'tromp-taylor': 'Tromp-Taylor',
  capture: 'Capture-Go',
};

function presetFromRu(ru: string | undefined): GoPresetId {
  const r = (ru ?? '').trim().toLowerCase();
  if (r.startsWith('jap') || r === 'jp' || r.startsWith('kor')) return 'japanese';
  if (r === 'aga' || r.startsWith('american') || r.startsWith('bga')) return 'aga';
  if (r === 'nz' || r.startsWith('new zealand')) return 'new-zealand';
  if (r.startsWith('tromp')) return 'tromp-taylor';
  if (r.startsWith('capture')) return 'capture';
  return 'chinese';
}

function readOutcome(re: string | undefined): Outcome | null {
  const r = (re ?? '').trim();
  const m = /^([BW])\+(.*)$/i.exec(r);
  if (m) {
    const winner = (m[1] as string).toUpperCase() === 'B' ? 0 : 1;
    const margin = Number(m[2]);
    const score = Number.isFinite(margin) && (m[2] ?? '') !== '' ? margin : 1;
    return { reason: 'go-sgf', results: [{ seat: winner, place: 1, score }, { seat: winner === 0 ? 1 : 0, place: 2, score: 0 }] };
  }
  if (r === '0' || /^draw$/i.test(r) || /^jigo$/i.test(r)) return { reason: 'go-sgf', results: [{ seat: 0, place: 1, score: 0 }, { seat: 1, place: 1, score: 0 }] };
  return null;
}

/** Reads an SGF file into a record's config and actions (main line only). */
export function readSgf(text: string): { config: GoConfig; actions: readonly Json[]; outcome: Outcome | null; names: readonly string[] } {
  const nodes = parseSgfMainLine(text);
  const root = nodes[0] as SgfNode;
  const gm = root.GM?.[0];
  if (gm !== undefined && gm.trim() !== '1') throw new Error('This SGF file is not a game of Go');
  const sz = (root.SZ?.[0] ?? '19').trim();
  if (!/^\d+$/.test(sz)) throw new Error('Only square boards are supported');
  const size = Number(sz);
  if (size < 2 || size > 25) throw new Error(`A ${size}×${size} board is not supported`);
  const preset = presetFromRu(root.RU?.[0]);
  const handicap = Math.max(0, Number(root.HA?.[0] ?? 0) || 0);
  const komiText = root.KM?.[0];
  const komi = komiText !== undefined && Number.isFinite(Number(komiText)) ? Math.round(Number(komiText) * 2) / 2 : null;
  const base = presetRules(preset, handicap >= 2 ? handicap : 0);
  const rules = komi === null ? base : { ...base, komi };
  for (const node of nodes.slice(1)) if (node.AB || node.AW || node.AE) throw new Error('The file sets up stones in the middle of the game');

  const black = expandPoints(root.AB ?? []);
  const white = expandPoints(root.AW ?? []);
  const moves: { color: 'B' | 'W'; at: string }[] = [];
  for (const node of nodes) {
    for (const color of ['B', 'W'] as const) {
      const v = node[color]?.[0];
      if (v === undefined) continue;
      const pass = v === '' || (v === 'tt' && size <= 19);
      moves.push({ color, at: pass ? 'pass' : v });
    }
  }

  const fixed = black.length >= 2 && white.length === 0 && handicap === black.length && handicap <= 9 && handicapPoints(size, handicap).map((p) => sgfName(p, size)).sort().join() === [...black].sort().join();
  const firstColor = moves[0]?.color;
  let config: GoConfig;
  if (fixed && (firstColor === undefined || firstColor === 'W')) {
    config = makeConfig(size, preset, handicap, { ...rules, handicapPlacement: 'fixed' });
  } else if (black.length === 0 && white.length === 0 && firstColor !== 'W') {
    config = makeConfig(size, preset, 0, rules);
  } else {
    // Any other set-up: start from the position itself.
    const board = Array.from({ length: size * size }, () => '.');
    for (const at of black) {
      const xy = sgfToXY(at);
      if (!xy || xy.x >= size || xy.y >= size) throw new Error(`"${at}" is off the board`);
      board[xy.y * size + xy.x] = 'X';
    }
    for (const at of white) {
      const xy = sgfToXY(at);
      if (!xy || xy.x >= size || xy.y >= size) throw new Error(`"${at}" is off the board`);
      board[xy.y * size + xy.x] = 'O';
    }
    const rows: string[] = [];
    for (let y = 0; y < size; y++) rows.push(board.slice(y * size, (y + 1) * size).join(''));
    const pl = root.PL?.[0]?.toUpperCase();
    const side = firstColor ?? (pl === 'W' || (handicap >= 2 && pl !== 'B') ? 'W' : 'B');
    const start: GoState = parsePosition(`${rows.join('/')} ${side === 'W' ? 'w' : 'b'}`);
    const withRules: GoState = { ...start, preset, rules, handicap: handicap >= 2 ? Math.min(handicap, 9) : 0 };
    const position = positionText(withRules);
    config = { size, preset, rules, handicap: withRules.handicap, position };
  }

  // Strict alternation: where a file has the same colour twice in a row, the other side passed.
  const actions: Json[] = [];
  let expected: 'B' | 'W' | null = null;
  for (const m of moves) {
    if (expected !== null && m.color !== expected) actions.push('pass');
    actions.push(m.at);
    expected = m.color === 'B' ? 'W' : 'B';
  }
  const names = [root.PB?.[0] ?? '', root.PW?.[0] ?? ''];
  return { config, actions, outcome: readOutcome(root.RE?.[0]), names };
}

function resultFor(record: GameRecord, final: GoState): string | null {
  if (record.ending?.kind === 'resigned') return record.ending.seat === 0 ? 'W+R' : 'B+R';
  if (record.ending?.kind === 'timeout') return record.ending.seat === 0 ? 'W+T' : 'B+T';
  const r = final.result;
  if (!r) return null;
  if (r.kind === 'no-result') return 'Void';
  if (r.kind === 'capture') return r.winner === 0 ? 'B+' : 'W+';
  if (r.black === r.white) return '0';
  return r.black > r.white ? `B+${r.black - r.white}` : `W+${r.white - r.black}`;
}

/** Writes a record as SGF. Marking, agreeing and playing on are not moves, so they are left out. */
export function writeSgf(record: GameRecord, names: readonly string[], date = new Date(record.createdAt)): string {
  const start = startState(go, record);
  const { steps, state: final } = replay(go, record);
  const props: string[] = ['GM[1]', 'FF[4]', 'CA[UTF-8]', 'AP[Kibitz]', `SZ[${start.size}]`, `KM[${start.rules.komi}]`, `RU[${escape(RU_NAMES[start.preset])}]`];
  if (start.handicap > 0) props.push(`HA[${start.handicap}]`);
  props.push(`PB[${escape(names[0] ?? '')}]`, `PW[${escape(names[1] ?? '')}]`, `DT[${date.toISOString().slice(0, 10)}]`);
  const result = resultFor(record, final);
  if (result) props.push(`RE[${result}]`);
  const black: string[] = [];
  const white: string[] = [];
  for (let p = 0; p < start.board.length; p++) {
    if (start.board[p] === 'X') black.push(sgfName(p, start.size));
    else if (start.board[p] === 'O') white.push(sgfName(p, start.size));
  }
  const moves: string[] = [];
  for (const step of steps) {
    const a = step.action;
    if (step.before.phase === 'handicap' && a.type === 'play') {
      black.push(a.at);
      continue;
    }
    const color = step.seat === 0 ? 'B' : 'W';
    if (a.type === 'play') moves.push(`;${color}[${a.at}]`);
    else if (a.type === 'pass') moves.push(`;${color}[]`);
  }
  if (black.length > 0) props.push(`AB${black.map((b) => `[${b}]`).join('')}`);
  if (white.length > 0) props.push(`AW${white.map((w) => `[${w}]`).join('')}`);
  if (start.toMove === 1 && start.handicap === 0 && (moves.length === 0 || black.length + white.length > 0)) props.push('PL[W]');
  let territory = '';
  if (final.result?.kind === 'score' && final.rules.captureTarget === 0) {
    const count = countState(final);
    const tb: string[] = [];
    const tw: string[] = [];
    for (let p = 0; p < count.owner.length; p++) {
      const empty = final.board[p] === '.' || final.dead.includes(p);
      if (!empty) continue;
      if (count.owner[p] === 1) tb.push(sgfName(p, final.size));
      else if (count.owner[p] === 2) tw.push(sgfName(p, final.size));
    }
    if (tb.length > 0) territory += `TB${tb.map((x) => `[${x}]`).join('')}`;
    if (tw.length > 0) territory += `TW${tw.map((x) => `[${x}]`).join('')}`;
  }
  const last = moves.length > 0 ? moves.pop() + territory : territory ? `;${territory}` : '';
  return `(;${props.join('')}\n${[...moves, last].filter(Boolean).join('')})\n`;
}

export { PRESETS };
