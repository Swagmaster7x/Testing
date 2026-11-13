package com.personal.tilesurge.core

import kotlin.math.max
import kotlin.math.min

enum class Phase { COUNTDOWN, PLAYING, GAME_OVER, STAGE_CLEAR, TIME_UP }

/**
 * The whole puzzle: a 6 x 12 well of tiles that rises from below.
 *
 * It knows nothing about the screen. Call [tick] 60 times a second, feed it the player's touches
 * with [grab], [dragTo], [release] and [raiseHeld], and read [grid] and [events] to draw and play sounds.
 *
 * The rules in brief:
 *  - Two side-by-side cells can be swapped (a tile with a tile, or a tile with a gap). Tiles never move up or down by hand.
 *  - A tile with nothing under it hangs for a moment, then drops a cell a frame. While it hangs it cannot be
 *    swapped, and nothing can be swapped into the cell right under it.
 *  - Three or more of the same tile in a line match. Everything matched in one frame is one combo: it flashes,
 *    pops tile by tile, and then the whole group disappears together.
 *  - Tiles that fall because a group under them disappeared are marked. If a marked tile is part of a match when
 *    it lands, the chain counter goes up.
 *  - The stack rises all the time, but waits while anything is hanging, falling or popping, and pauses after
 *    combos and chains. A tile that is only sliding sideways does not hold it: with a finger on the glass a
 *    tile can be kept sliding for as long as the player likes.
 *  - When a tile sits in the top row and the stack would rise, a short grace period runs out, and then the game is over.
 */
class Game private constructor(
    val mode: GameMode,
    /** Timings: hover, flash, pop, grace. */
    val difficulty: Difficulty,
    /** How many different tiles appear. */
    val kinds: Int,
    startLevel: Int,
    val stage: StageDef?,
    startRows: Int,
    val seed: Long,
    /** Score Attack: frames of play allowed. 0 = no clock. */
    val timeLimit: Int = 0,
    /** Puzzles: swaps allowed. 0 = as many as you like. */
    val moveLimit: Int = 0,
    /** Puzzles and lessons: the board to start from, top row first. */
    private val fixedRows: List<String>? = null,
    /** Whether the raise button does anything. */
    val raiseAllowed: Boolean = true,
) {
    companion object {
        const val COLS = 6
        const val ROWS = 12

        /** [riseOffset] counts in these; one row is this many. */
        const val ROW_UNITS = 1 shl 16
        const val SWAP_FRAMES = 4
        const val LAND_FRAMES = 12

        /** Holding the raise button brings up a row in this many frames. */
        const val MANUAL_FRAMES_PER_ROW = 15
        const val COUNTDOWN_FRAMES = 70

        /** A column this tall (or taller) is close to the top. */
        const val DANGER_HEIGHT = ROWS - 2
        const val NO_LINE = Int.MIN_VALUE

        fun infinite(difficulty: Difficulty, startLevel: Int, seed: Long): Game =
            Game(GameMode.INFINITE, difficulty, difficulty.kinds, startLevel, null, 6, seed)

        private const val SAVE_VERSION = 1

        /** The game [saved] by [save], or null if the text is not one this version can read. */
        fun restore(saved: String): Game? = try {
            val v = saved.split(',').iterator()
            if (v.next().toInt() != SAVE_VERSION) {
                null
            } else {
                val mode = GameMode.entries[v.next().toInt()]
                val difficulty = Difficulty.entries[v.next().toInt()]
                val kinds = v.next().toInt()
                val stageNumber = v.next().toInt()
                val seed = v.next().toLong()
                val timeLimit = v.next().toInt()
                val g = when (mode) {
                    GameMode.STAGE -> stage(Stages.get(stageNumber), seed)
                    GameMode.TIMED -> Game(mode, difficulty, kinds, 1, null, 6, seed, timeLimit = timeLimit)
                    GameMode.INFINITE -> Game(mode, difficulty, kinds, 1, null, 6, seed)
                    GameMode.PUZZLE -> null
                }
                g?.load(v)
                g
            }
        } catch (e: Exception) {
            null
        }

        fun stage(def: StageDef, seed: Long): Game =
            Game(GameMode.STAGE, def.timing, def.kinds, def.speedLevel, def, def.startRows, seed)

        /** Score Attack: like Infinite, but it ends when the clock does. */
        fun timed(difficulty: Difficulty, startLevel: Int, seed: Long, frames: Int = TIMED_FRAMES): Game =
            Game(GameMode.TIMED, difficulty, difficulty.kinds, startLevel, null, 6, seed, timeLimit = frames)

        /** A puzzle: the board does not rise, and every tile has to go within the moves allowed. */
        fun puzzle(def: PuzzleDef): Game = fixed(def.rows, def.moves, raise = false, seed = def.number.toLong())

        /**
         * A board that stays as it is given: for puzzles ([moves] > 0) and for lessons (0 = no limit).
         * It rises only if [raise] is allowed and the player raises it.
         */
        fun fixed(rows: List<String>, moves: Int, raise: Boolean, seed: Long): Game {
            val kinds = maxOf(Difficulty.NORMAL.kinds, rows.maxOf { line -> line.maxOf { if (it == '.') 0 else it - '0' } })
            return Game(GameMode.PUZZLE, Difficulty.NORMAL, kinds, 1, null, 1, seed,
                moveLimit = moves, fixedRows = rows, raiseAllowed = raise)
        }

        /** Two minutes. */
        const val TIMED_FRAMES = 120 * 60
    }

    private val rng = Rng(seed)
    private var nextId = 1

    /** The well, `grid[row][col]`, row 0 at the bottom. */
    val grid: Array<Array<Tile>> = Array(ROWS) { Array(COLS) { Tile() } }

    /** The kinds in the row that is coming up from below. It cannot be touched until it is fully in. */
    val incoming = IntArray(COLS)

    var phase = Phase.COUNTDOWN
        private set
    var countdown = COUNTDOWN_FRAMES
        private set

    /** Frames of play so far (the countdown is not counted). */
    var frames = 0
        private set

    /** How far the incoming row has risen, 0 until [ROW_UNITS]. */
    var riseOffset = 0
        private set

    /** Speed level, 1..[Speed.MAX_LEVEL]. */
    var level = startLevel.coerceIn(1, Speed.MAX_LEVEL)
        private set

    /** Tiles cleared at this level (Infinite mode). */
    var levelProgress = 0
        private set
    var score = 0
        private set

    /** The current chain step; 1 when no chain is running. */
    var chain = 1
        private set
    var maxChain = 1
        private set
    var maxCombo = 0
        private set
    var tilesCleared = 0
        private set
    var rowsRisen = 0
        private set

    /** Frames the stack will stay still, earned by combos and chains. */
    var stopFrames = 0
        private set
    val graceMax: Int = difficulty.graceFrames

    /** Frames left before the game ends, once the stack is against the top. */
    var grace = graceMax
        private set

    /**
     * Stage Clear: the clear line runs along the bottom edge of this row. It starts below the well
     * (negative) and comes up with the stack. [NO_LINE] in Infinite mode.
     */
    var lineRow = if (stage != null) -stage.lines else NO_LINE
        private set

    /** Set while the player holds the raise button. */
    var raiseHeld = false

    /** Whether the stack comes up by itself. Off for puzzles and lessons; tests switch it off too. */
    var autoRise = mode != GameMode.PUZZLE

    /** Puzzles: swaps still allowed. */
    var movesLeft = moveLimit
        private set

    /** Score Attack: frames left on the clock. */
    val timeLeft: Int get() = max(0, timeLimit - frames)

    /** How many tiles are on the board. */
    fun tileCount(): Int {
        var n = 0
        for (r in 0 until ROWS) for (c in 0 until COLS) if (grid[r][c].kind != 0) n++
        return n
    }

    /** Something is sliding, hanging, falling or popping: the board is not at rest. */
    var active = false
        private set

    /**
     * Something is hanging, falling or popping. While this is true the stack does not rise and the
     * countdown at the top does not run. Sliding alone does not count (see the class comment).
     */
    var settling = false
        private set

    /** A match is flashing or popping. */
    var clearing = false
        private set

    /** A tile is in the top row. */
    var topOccupied = false
        private set

    /** The tile under the player's finger, or 0. */
    var grabbedId = 0
        private set
    private var dragCol = 0
    private var manualRaise = false

    /** What happened, oldest first. The caller reads these and clears the list. */
    val events = ArrayList<GameEvent>()

    private val marks = Array(ROWS) { BooleanArray(COLS) }

    init {
        if (fixedRows != null) {
            setBoard(*fixedRows.toTypedArray())
            // nothing to get ready for: a puzzle waits for the player
            countdown = 0
            phase = Phase.PLAYING
        } else {
            fillStart(startRows)
        }
        refreshFlags()
    }

    // ---------------------------------------------------------------- reading the state

    /** How far the incoming row has risen, 0f until 1f. */
    val riseFraction: Float get() = riseOffset.toFloat() / ROW_UNITS

    /** How much of the grace period is left, 1f = all of it. */
    val graceFraction: Float get() = grace.toFloat() / graceMax

    val seconds: Int get() = frames / 60

    /** Number of rows up to and including the highest tile in column [col]. */
    fun columnHeight(col: Int): Int {
        for (r in ROWS - 1 downTo 0) if (grid[r][col].kind != 0) return r + 1
        return 0
    }

    fun stackHeight(): Int {
        var h = 0
        for (c in 0 until COLS) h = max(h, columnHeight(c))
        return h
    }

    /** Rows still to rise before the clear line comes into view (Stage Clear). */
    val linesToGo: Int get() = if (lineRow == NO_LINE) 0 else max(0, -lineRow)

    /** Where the tile with this id is, as `row * COLS + col`, or -1 if it is gone. */
    fun locate(id: Int): Int {
        if (id == 0) return -1
        for (r in 0 until ROWS) for (c in 0 until COLS) if (grid[r][c].id == id) return r * COLS + c
        return -1
    }

    // ---------------------------------------------------------------- the player's hand

    /** Take hold of the tile at [row], [col]. False if there is nothing there to hold. */
    fun grab(row: Int, col: Int): Boolean {
        if (phase != Phase.PLAYING || row !in 0 until ROWS || col !in 0 until COLS) return false
        val t = grid[row][col]
        if (t.kind == 0) return false
        if (t.state != TileState.NORMAL && t.state != TileState.LANDING && t.state != TileState.SWAPPING) return false
        grabbedId = t.id
        dragCol = col
        return true
    }

    /** The finger is now over column [col]: the held tile follows it, a cell at a time. */
    fun dragTo(col: Int) {
        dragCol = col.coerceIn(0, COLS - 1)
    }

    fun release() {
        grabbedId = 0
    }

    /** Swap the cell at [row], [col] with the one to its right. False if the rules do not allow it right now. */
    fun trySwap(row: Int, col: Int): Boolean {
        if (phase != Phase.PLAYING || row !in 0 until ROWS || col !in 0 until COLS - 1) return false
        val a = grid[row][col]
        val b = grid[row][col + 1]
        if (a.kind == 0 && b.kind == 0) return false
        if (!canSwap(a) || !canSwap(b)) return false
        if (moveLimit > 0 && movesLeft == 0) return false
        // Nothing may be slid in right under a tile that is hanging: it has to fall first.
        // (Otherwise one tile shuffled between two columns could hold them both up for ever.)
        if (row + 1 < ROWS &&
            (grid[row + 1][col].state == TileState.HOVERING || grid[row + 1][col + 1].state == TileState.HOVERING)
        ) return false
        // Two tiles standing one on the other cannot both be slid into the same gap at once: the one
        // above has lost its footing and must be left to fall.
        if ((a.kind == 0 || b.kind == 0) && (gapSwapUnderWay(row + 1, col) || gapSwapUnderWay(row - 1, col))) return false
        grid[row][col] = b
        grid[row][col + 1] = a
        a.state = TileState.SWAPPING
        a.timer = SWAP_FRAMES
        a.swapDir = 1
        b.state = TileState.SWAPPING
        b.timer = SWAP_FRAMES
        b.swapDir = -1
        if (moveLimit > 0) movesLeft--
        active = true
        emit(EventType.SWAP, row, col)
        return true
    }

    /** True if the cells at [row], [col] and [col]+1 are a tile and a gap that are trading places right now. */
    private fun gapSwapUnderWay(row: Int, col: Int): Boolean {
        if (row !in 0 until ROWS) return false
        val p = grid[row][col]
        val q = grid[row][col + 1]
        return p.state == TileState.SWAPPING && q.state == TileState.SWAPPING && (p.kind == 0) != (q.kind == 0)
    }

    /** Tiles at rest and plain gaps can be swapped. Anything sliding, hanging, falling or popping cannot. */
    private fun canSwap(t: Tile): Boolean = t.state == TileState.NORMAL || t.state == TileState.LANDING

    // ---------------------------------------------------------------- one frame

    /** One frame of play. */
    fun tick() {
        when (phase) {
            Phase.COUNTDOWN -> {
                countdown--
                if (countdown <= 0) {
                    phase = Phase.PLAYING
                    emit(EventType.GO)
                }
            }
            Phase.PLAYING -> step()
            Phase.GAME_OVER, Phase.STAGE_CLEAR, Phase.TIME_UP -> Unit
        }
    }

    private fun step() {
        frames++
        rise()
        if (phase != Phase.PLAYING) return
        updateTiles()
        // Gravity before the player's hand: a tile that has just been slid over a gap is already
        // hanging by the time the drag is looked at, so it cannot be carried across.
        applyGravity()
        applyDrag()
        checkMatches()
        settleChains()
        refreshFlags()
        if (stopFrames > 0 && !clearing) stopFrames--
        checkStageClear()
        checkPuzzle()
        if (timeLimit > 0 && frames >= timeLimit && phase == Phase.PLAYING) {
            phase = Phase.TIME_UP
            grabbedId = 0
            emit(EventType.TIME_UP)
        }
    }

    /** A puzzle is solved when the board is empty and still, and lost when the moves are gone and it is not. */
    private fun checkPuzzle() {
        if (mode != GameMode.PUZZLE || moveLimit == 0 || phase != Phase.PLAYING || active) return
        if (tileCount() == 0) {
            phase = Phase.STAGE_CLEAR
            grabbedId = 0
            emit(EventType.STAGE_CLEAR)
        } else if (movesLeft == 0) {
            endGame()
        }
    }

    // ---------------------------------------------------------------- rising

    private fun rise() {
        val canRise = !settling && !topOccupied
        if (raiseHeld && canRise && raiseAllowed) manualRaise = true
        if (manualRaise && canRise) {
            // Raising by hand gives up whatever pause the player had earned.
            stopFrames = 0
            advance(perFrame(MANUAL_FRAMES_PER_ROW), manual = true)
        } else {
            // Let go while blocked: forget the rest of the row.
            if (manualRaise && !raiseHeld) manualRaise = false
            if (autoRise && !settling && stopFrames == 0) {
                if (topOccupied) {
                    grace--
                    if (grace <= 0) {
                        endGame()
                        return
                    }
                } else {
                    advance(perFrame(Speed.framesPerRow[level]), manual = false)
                }
            }
        }
        if (!topOccupied) grace = graceMax
    }

    private fun perFrame(framesPerRow: Int): Int = (ROW_UNITS + framesPerRow - 1) / framesPerRow

    private fun advance(units: Int, manual: Boolean) {
        riseOffset += units
        if (riseOffset < ROW_UNITS) return
        riseOffset = if (manual) 0 else riseOffset - ROW_UNITS
        pushRow(manual)
        if (manual) {
            score += Scoring.PER_RAISED_ROW
            // A tap brings up exactly one row; holding carries on with the next.
            manualRaise = raiseHeld
        }
        topOccupied = isTopOccupied()
        if (topOccupied) riseOffset = 0
    }

    /** The incoming row becomes the bottom row and everything else moves up one. Only called when the top row is empty. */
    private fun pushRow(manual: Boolean) {
        val recycled = grid[ROWS - 1]
        for (r in ROWS - 1 downTo 1) grid[r] = grid[r - 1]
        grid[0] = recycled
        for (c in 0 until COLS) {
            val t = recycled[c]
            t.clear()
            t.kind = incoming[c]
            t.id = nextId++
        }
        generateIncoming()
        rowsRisen++
        emit(EventType.ROW, a = if (manual) 1 else 0)
        if (lineRow != NO_LINE) {
            lineRow++
            if (lineRow == 0) emit(EventType.LINE_SHOWN)
        }
    }

    // ---------------------------------------------------------------- tiles in motion

    /** Runs every tile's timer. Bottom row first, so a falling column moves down together. */
    private fun updateTiles() {
        for (r in 0 until ROWS) {
            for (c in 0 until COLS) {
                val t = grid[r][c]
                when (t.state) {
                    TileState.NORMAL -> Unit
                    TileState.SWAPPING -> if (--t.timer <= 0) {
                        t.state = TileState.NORMAL
                        t.swapDir = 0
                    }
                    TileState.LANDING -> if (--t.timer <= 0) t.state = TileState.NORMAL
                    TileState.HOVERING -> if (--t.timer <= 0) drop(r, c, t, fromHover = true)
                    TileState.FALLING -> drop(r, c, t, fromHover = false)
                    TileState.MATCHED -> if (--t.timer <= 0) {
                        t.state = TileState.POPPING
                        t.timer = t.comboIndex * difficulty.popFrames
                    }
                    TileState.POPPING -> if (--t.timer <= 0) pop(r, c, t)
                    TileState.POPPED -> if (--t.timer <= 0) remove(r, c)
                }
            }
        }
    }

    /** A tile whose hover has run out, or one already falling: move down a cell, wait, or land. */
    private fun drop(r: Int, c: Int, t: Tile, fromHover: Boolean) {
        if (r == 0) {
            land(r, c, t)
            return
        }
        val below = grid[r - 1][c]
        when {
            below.kind == 0 -> {
                if (below.state == TileState.SWAPPING) {
                    // A tile is still sliding through the cell below: wait for it.
                    if (fromHover) t.timer = 1
                } else {
                    t.state = TileState.FALLING
                    t.timer = 0
                    grid[r][c] = below
                    grid[r - 1][c] = t
                }
            }
            // Came down onto something that is itself about to fall: fall with it.
            below.state == TileState.HOVERING -> {
                t.state = TileState.HOVERING
                t.timer = max(1, below.timer)
            }
            // The tile below is falling but held up this frame: stay right behind it.
            below.state == TileState.FALLING -> {
                t.state = TileState.FALLING
                t.timer = 0
            }
            else -> land(r, c, t)
        }
    }

    private fun land(r: Int, c: Int, t: Tile) {
        t.state = TileState.LANDING
        t.timer = LAND_FRAMES
        emit(EventType.LAND, r, c, kind = t.kind)
    }

    private fun pop(r: Int, c: Int, t: Tile) {
        score += Scoring.PER_TILE
        emit(EventType.POP, r, c, t.comboIndex, t.chainIndex, t.kind)
        if (t.comboIndex >= t.comboSize) {
            // The last of its group: it and all the others (whose waits end this same frame) now disappear.
            remove(r, c)
        } else {
            t.state = TileState.POPPED
            t.timer = (t.comboSize - t.comboIndex) * difficulty.popFrames
        }
    }

    private fun remove(r: Int, c: Int) {
        grid[r][c].clear()
        tilesCleared++
        if ((mode == GameMode.INFINITE || mode == GameMode.TIMED) && level < Speed.MAX_LEVEL) {
            levelProgress++
            if (levelProgress >= Speed.tilesToNextLevel(level)) {
                levelProgress = 0
                level++
                emit(EventType.LEVEL_UP, a = level)
            }
        }
        // Whatever was resting on this tile now hangs for a moment and then falls.
        // Those tiles are marked: if one completes a match when it lands, that is a chain.
        var rr = r + 1
        // One extra frame, because each tile's own timer still runs later in this same pass.
        var hover = difficulty.hoverFrames + 1
        while (rr < ROWS) {
            val u = grid[rr][c]
            if (u.kind == 0) break
            when (u.state) {
                TileState.NORMAL, TileState.LANDING -> {
                    u.state = TileState.HOVERING
                    u.timer = hover
                    u.chaining = true
                }
                // A tile the player is still sliding into place finishes its slide and gets no mark:
                // it was not resting here. What rests on it hangs that much longer, so it all drops together.
                TileState.SWAPPING -> hover += u.timer - 1
                TileState.HOVERING -> u.chaining = true
                else -> break
            }
            rr++
        }
    }

    // ---------------------------------------------------------------- the player's swaps

    private fun applyDrag() {
        if (grabbedId == 0) return
        val at = locate(grabbedId)
        if (at < 0) {
            grabbedId = 0
            return
        }
        val r = at / COLS
        val c = at % COLS
        when (grid[r][c].state) {
            TileState.SWAPPING -> Unit // one cell at a time: wait for the slide to finish
            TileState.NORMAL, TileState.LANDING -> {
                if (dragCol > c) trySwap(r, c) else if (dragCol < c) trySwap(r, c - 1)
            }
            // It dropped out of the player's hand, or got matched.
            else -> grabbedId = 0
        }
    }

    // ---------------------------------------------------------------- gravity

    /** Any resting tile with nothing solid under it starts to hang. */
    private fun applyGravity() {
        for (c in 0 until COLS) {
            for (r in 1 until ROWS) {
                val t = grid[r][c]
                if (!t.isResting) continue
                val below = grid[r - 1][c]
                when {
                    below.kind == 0 -> {
                        // If a tile is mid-slide through the cell below, wait until the slide is over.
                        if (below.state != TileState.SWAPPING) {
                            t.state = TileState.HOVERING
                            t.timer = difficulty.hoverFrames
                        }
                    }
                    below.state == TileState.HOVERING -> {
                        t.state = TileState.HOVERING
                        t.timer = max(1, below.timer)
                    }
                    below.state == TileState.FALLING -> {
                        t.state = TileState.HOVERING
                        t.timer = difficulty.hoverFrames
                    }
                }
            }
        }
    }

    // ---------------------------------------------------------------- matches, combos, chains

    private fun checkMatches() {
        for (r in 0 until ROWS) marks[r].fill(false)
        for (r in 0 until ROWS) {
            var c = 0
            while (c < COLS) {
                val t = grid[r][c]
                if (!t.isResting) {
                    c++
                    continue
                }
                var end = c + 1
                while (end < COLS && grid[r][end].isResting && grid[r][end].kind == t.kind) end++
                if (end - c >= 3) for (i in c until end) marks[r][i] = true
                c = end
            }
        }
        for (c in 0 until COLS) {
            var r = 0
            while (r < ROWS) {
                val t = grid[r][c]
                if (!t.isResting) {
                    r++
                    continue
                }
                var end = r + 1
                while (end < ROWS && grid[end][c].isResting && grid[end][c].kind == t.kind) end++
                if (end - r >= 3) for (i in r until end) marks[i][c] = true
                r = end
            }
        }

        var count = 0
        var isChain = false
        for (r in 0 until ROWS) for (c in 0 until COLS) {
            if (marks[r][c]) {
                count++
                if (grid[r][c].chaining) isChain = true
            }
        }
        if (count == 0) return

        if (isChain) chain++
        val step = if (isChain) chain else 1
        var index = 0
        var firstRow = 0
        var firstCol = 0
        // Pop order: top row first, left to right.
        for (r in ROWS - 1 downTo 0) for (c in 0 until COLS) {
            if (!marks[r][c]) continue
            val t = grid[r][c]
            index++
            if (index == 1) {
                firstRow = r
                firstCol = c
            }
            t.state = TileState.MATCHED
            t.timer = difficulty.flashFrames + difficulty.faceFrames
            t.comboIndex = index
            t.comboSize = count
            t.chainIndex = step
            // A chain stays alive for as long as any tile carries this mark.
            t.chaining = isChain
        }
        score += Scoring.comboBonus(count)
        if (isChain) score += Scoring.chainBonus(chain)
        maxCombo = max(maxCombo, count)
        maxChain = max(maxChain, chain)
        if (count >= 4 || isChain) stopFrames = max(stopFrames, stopFor(count, step))
        emit(EventType.MATCH, firstRow, firstCol, count, step)
    }

    /** How long the stack holds still after a combo of [combo] tiles at chain step [step]. */
    private fun stopFor(combo: Int, step: Int): Int {
        var f = 0
        if (combo >= 4) f = 60 + 15 * min(combo - 3, 12)
        if (step >= 2) f = max(f, 90 + 45 * min(step - 1, 8))
        f = f * difficulty.stopPercent / 100
        // A longer breather when the stack is close to the top.
        if (stackHeight() >= DANGER_HEIGHT) f *= 2
        return f
    }

    /**
     * A marked tile that has come to rest without matching loses its mark, unless the cell right under it
     * is still mid-slide (it may be about to drop again, or a match may be about to complete beneath it).
     * When no marked tile is left anywhere, the chain is over.
     */
    private fun settleChains() {
        var any = false
        for (r in 0 until ROWS) for (c in 0 until COLS) {
            val t = grid[r][c]
            if (!t.chaining) continue
            if (t.isResting && (r == 0 || grid[r - 1][c].state != TileState.SWAPPING)) {
                t.chaining = false
            } else {
                any = true
            }
        }
        if (!any && chain > 1) {
            emit(EventType.CHAIN_END, a = chain)
            chain = 1
        }
    }

    // ---------------------------------------------------------------- end of frame

    private fun refreshFlags() {
        var act = false
        var set = false
        var clr = false
        for (r in 0 until ROWS) for (c in 0 until COLS) {
            when (grid[r][c].state) {
                TileState.SWAPPING -> act = true
                TileState.HOVERING, TileState.FALLING -> {
                    act = true
                    set = true
                }
                TileState.MATCHED, TileState.POPPING, TileState.POPPED -> {
                    act = true
                    set = true
                    clr = true
                }
                TileState.NORMAL, TileState.LANDING -> Unit
            }
        }
        active = act
        settling = set
        clearing = clr
        topOccupied = isTopOccupied()
    }

    private fun isTopOccupied(): Boolean {
        for (c in 0 until COLS) if (grid[ROWS - 1][c].kind != 0) return true
        return false
    }

    private fun checkStageClear() {
        if (mode != GameMode.STAGE || lineRow < 0) return
        // Let anything still hanging, falling or popping under the line finish first, so the board is not
        // frozen mid-pop. Nothing can come back above the line meanwhile: the stack does not rise.
        if (settling) return
        for (r in lineRow until ROWS) for (c in 0 until COLS) if (grid[r][c].kind != 0) return
        phase = Phase.STAGE_CLEAR
        grabbedId = 0
        emit(EventType.STAGE_CLEAR)
    }

    private fun endGame() {
        phase = Phase.GAME_OVER
        grabbedId = 0
        emit(EventType.GAME_OVER)
    }

    private fun emit(type: EventType, row: Int = 0, col: Int = 0, a: Int = 0, b: Int = 0, kind: Int = 0) {
        events.add(GameEvent(type, row, col, a, b, kind))
    }

    // ---------------------------------------------------------------- setting up

    /** The opening stack: uneven columns with no two equal tiles touching, so nothing matches by itself. */
    private fun fillStart(startRows: Int) {
        val heights = IntArray(COLS) { (startRows - 1 + rng.nextInt(3)).coerceIn(1, ROWS - 4) }
        for (r in 0 until ROWS) for (c in 0 until COLS) {
            if (r >= heights[c]) continue
            val left = if (c > 0) grid[r][c - 1].kind else 0
            val below = if (r > 0) grid[r - 1][c].kind else 0
            val t = grid[r][c]
            t.kind = pickKind(left, below)
            t.id = nextId++
        }
        generateIncoming()
    }

    /** The next row: no tile equal to its left neighbour or to the tile that will sit right above it. */
    private fun generateIncoming() {
        for (c in 0 until COLS) {
            val left = if (c > 0) incoming[c - 1] else 0
            incoming[c] = pickKind(left, grid[0][c].kind)
        }
    }

    private fun pickKind(notA: Int, notB: Int): Int {
        while (true) {
            val k = 1 + rng.nextInt(kinds)
            if (k != notA && k != notB) return k
        }
    }

    // ---------------------------------------------------------------- saving a game in progress

    /**
     * Everything needed to carry this game on later, as one line of text.
     * (Not for puzzles and lessons, which are quicker to start again.)
     */
    fun save(): String {
        val out = ArrayList<Any>()
        out += SAVE_VERSION
        out += mode.ordinal; out += difficulty.ordinal; out += kinds; out += (stage?.number ?: 0); out += seed; out += timeLimit
        out += rng.state; out += nextId
        out += phase.ordinal; out += countdown; out += frames; out += riseOffset; out += level; out += levelProgress
        out += score; out += chain; out += maxChain; out += maxCombo; out += tilesCleared; out += rowsRisen
        out += stopFrames; out += grace; out += lineRow; out += (if (manualRaise) 1 else 0)
        for (c in 0 until COLS) out += incoming[c]
        for (r in 0 until ROWS) for (c in 0 until COLS) {
            val t = grid[r][c]
            out += t.id; out += t.kind; out += t.state.ordinal; out += t.timer; out += (if (t.chaining) 1 else 0)
            out += t.comboIndex; out += t.comboSize; out += t.chainIndex; out += t.swapDir
        }
        return out.joinToString(",")
    }

    private fun load(v: Iterator<String>) {
        fun int() = v.next().toInt()
        rng.state = v.next().toLong()
        nextId = int()
        phase = Phase.entries[int()]; countdown = int(); frames = int(); riseOffset = int(); level = int(); levelProgress = int()
        score = int(); chain = int(); maxChain = int(); maxCombo = int(); tilesCleared = int(); rowsRisen = int()
        stopFrames = int(); grace = int(); lineRow = int(); manualRaise = int() == 1
        for (c in 0 until COLS) incoming[c] = int()
        for (r in 0 until ROWS) for (c in 0 until COLS) {
            val t = grid[r][c]
            t.id = int(); t.kind = int(); t.state = TileState.entries[int()]; t.timer = int(); t.chaining = int() == 1
            t.comboIndex = int(); t.comboSize = int(); t.chainIndex = int(); t.swapDir = int()
        }
        grabbedId = 0
        raiseHeld = false
        events.clear()
        refreshFlags()
    }

    // ---------------------------------------------------------------- for tests and the how-to-play pictures

    /** Ends the countdown at once. */
    fun skipCountdown() {
        if (phase == Phase.COUNTDOWN) {
            countdown = 0
            phase = Phase.PLAYING
        }
    }

    /**
     * Replaces the board. Rows are given top first; each character is a tile kind `1`..`6` or `.` for a gap.
     * Rows not given are left empty.
     */
    fun setBoard(vararg rows: String) {
        for (r in 0 until ROWS) for (c in 0 until COLS) grid[r][c].clear()
        for ((i, line) in rows.withIndex()) {
            val r = rows.size - 1 - i
            require(r < ROWS && line.length == COLS) { "bad row \"$line\"" }
            for (c in 0 until COLS) {
                val ch = line[c]
                if (ch == '.') continue
                val t = grid[r][c]
                t.kind = ch - '0'
                require(t.kind in 1..6) { "bad tile '$ch'" }
                t.id = nextId++
            }
        }
        chain = 1
        stopFrames = 0
        grabbedId = 0
        riseOffset = 0
        manualRaise = false
        grace = graceMax
        generateIncoming()
        refreshFlags()
    }

    /** The board as text, top row first, in the same form [setBoard] takes. */
    fun boardString(): String {
        val sb = StringBuilder()
        for (r in ROWS - 1 downTo 0) {
            for (c in 0 until COLS) {
                val k = grid[r][c].kind
                sb.append(if (k == 0) '.' else '0' + k)
            }
            if (r > 0) sb.append('\n')
        }
        return sb.toString()
    }
}
