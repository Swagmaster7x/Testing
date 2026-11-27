# Writing lessons, problems and drills

This is the template every game follows from milestone 3 on (PLAN.md 2.5 and 2.6). Chess is the
worked example.

## Lessons are data

A game's lessons live in `src/games/<game>/learn/` as TypeScript data (`Lesson` in
`src/teach/lesson.ts`) and are listed in `src/games/lessons.ts`, which loads them on demand.

- **Stages:** `stage-0` (what the game is), `stage-1` (rules), `stage-2` (first strategy),
  `stage-3` (core skills), `stage-4` (advanced) and `table` (Table-ready).
- **Steps:** `say`, `show` (scripted moves), `askMove`, `askChoice`, `askNumber`, `freePlay`
  (reach a goal against the engine) and `checkpoint` (a short quiz, one try per question).
- **Positions** are in the game's own notation (FEN for chess) and carry on from step to step;
  a step can set a new one.
- **Numbers are never typed.** Text uses `{placeholders}` that the game's lesson adapter
  computes from the rules module (`computed()` in `src/games/chess/learn/game.ts`): piece values,
  counts, rule limits, the number of moves of the piece on a square, attackers and defenders.
  Digits are allowed only inside notation (squares, moves, castling).
- **Claims on `askMove`:** `legal` (the move only has to be legal), `only` (the accepted moves are
  exactly the legal moves), `mate` (each accepted move mates), `best` (the engine must find the
  accepted moves clearly better than every other move).
- **Prose is original**, short, one idea a lesson, two to four minutes.

A game provides a `LessonGame` adapter (positions, moves in notation, legal moves, goals, computed
values) and, for the linter, a `LessonVerifier` (position legality, "best" claims, an engine that
plays both sides of free play).

## The lesson linter

`npm run lint:lessons` (the last step of `npm run check`) fails unless, for every lesson:

- every position parses and is legal (for chess: one king each, no pawns on the end ranks, the
  side not to move is not in check, castling rights match the pieces);
- every accepted answer, scripted move, tempting wrong answer and reply is legal;
- every placeholder is known and every number is a placeholder;
- `only` and `mate` claims hold by the rules, and `best` claims hold by Stockfish: the accepted
  moves are within 60 centipawns of the engine's top move and every other move is at least 150
  centipawns worse (1,000,000 nodes over every legal move);
- free-play goals are reached within the move limit by the engine against the engine's best
  defence;
- an auto-player finishes the lesson answering right, and again answering wrong first and asking
  to be shown;
- the "I already know this" check built for each stage passes too.

Engine searches use fixed node budgets, so they are cached in
`node_modules/.cache/kibitz/lesson-lint.json`; only changed lessons are searched again.

## Problems and drills

Practice for a game is listed in `src/games/practice.ts`:

- **Problem sets**: problems (`Problem` in `src/teach/problem.ts`: a position, the opponent's
  setup move, the solution line, a rating and themes) grouped by theme. The student plays every
  other move; the replies play themselves; at the end of a mating line any mate counts. Only a
  first, unhinted try moves the problem rating.
- **Drills**: generated exercises that run on the lesson runner (a generated one-step lesson), so
  they need no new screen. Chess has basic mates against the engine and counting material.

Chess problems come from the Lichess puzzle database (CC0), imported by
`npm run import:puzzles`, which replays every line through the rules.
