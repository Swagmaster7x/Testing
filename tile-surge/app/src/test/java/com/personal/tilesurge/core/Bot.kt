package com.personal.tilesurge.core

/**
 * A simple stand-in for a player, used by the tests to play whole games through the same
 * grab / drag / raise calls the touch screen makes.
 *
 * It is no expert: every [thinkFrames] frames it looks for a tile it can slide to make a match,
 * and if there is none it tips the tallest column over into a lower neighbour. It holds the raise
 * button while the stack is low. It never plans chains.
 */
class Bot(
    private val game: Game,
    private val thinkFrames: Int,
    private val raiseBelow: Int = 6,
    private val hands: Hands = DirectHands(game),
) {

    /** How the bot touches the game: straight into the engine, or through the screen like a finger. */
    interface Hands {
        fun grab(row: Int, col: Int): Boolean
        fun dragTo(col: Int)
        fun release()
        fun raise(held: Boolean)
    }

    class DirectHands(private val game: Game) : Hands {
        override fun grab(row: Int, col: Int) = game.grab(row, col)
        override fun dragTo(col: Int) = game.dragTo(col)
        override fun release() = game.release()
        override fun raise(held: Boolean) {
            game.raiseHeld = held
        }
    }

    private class Move(val row: Int, val col: Int, val toCol: Int, val value: Int)

    private companion object {
        const val HANGING = -2
    }

    private var wait = thinkFrames
    private var carrying = false
    private var heldFor = 0
    private var targetCol = 0
    private var idleThinks = 0
    private var tapFrames = 0

    private val base = Array(Game.ROWS) { IntArray(Game.COLS) }
    private val k = Array(Game.ROWS) { IntArray(Game.COLS) }
    private val e = Array(Game.ROWS) { IntArray(Game.COLS) }

    /** Call once before every [Game.tick]. */
    fun act() {
        if (game.phase != Phase.PLAYING) {
            hands.raise(false)
            if (carrying) {
                hands.release()
                carrying = false
            }
            return
        }
        if (carrying) {
            val at = game.locate(game.grabbedId)
            heldFor++
            if (game.grabbedId == 0 || at < 0 || at % Game.COLS == targetCol || heldFor > 40) {
                hands.release()
                carrying = false
                wait = thinkFrames
            }
            return
        }

        val height = game.stackHeight()
        if (tapFrames > 0) tapFrames--
        hands.raise(height <= raiseBelow || tapFrames > 0)

        if (--wait > 0) return
        wait = thinkFrames
        val move = findMove()
        if (move == null) {
            // Nothing to do: ask for another row now and then, if there is room for one.
            if (++idleThinks >= 2 && height <= Game.ROWS - 3) {
                tapFrames = 2
                idleThinks = 0
            }
            return
        }
        idleThinks = 0
        if (hands.grab(move.row, move.col)) {
            targetCol = move.toCol
            hands.dragTo(move.toCol)
            carrying = true
            heldFor = 0
        }
    }

    private fun findMove(): Move? {
        for (r in 0 until Game.ROWS) for (c in 0 until Game.COLS) {
            val t = game.grid[r][c]
            base[r][c] = when {
                t.kind == 0 && t.state == TileState.NORMAL -> 0
                t.isResting -> t.kind
                t.state == TileState.HOVERING -> HANGING
                else -> -1 // busy: sliding, falling or popping
            }
        }
        var best: Move? = null
        for (r in 0 until Game.ROWS) for (c in 0 until Game.COLS) {
            if (base[r][c] <= 0) continue
            for (dir in intArrayOf(-1, 1)) {
                for (rr in 0 until Game.ROWS) base[rr].copyInto(k[rr])
                var cc = c
                for (step in 1 until Game.COLS) {
                    val nc = cc + dir
                    if (nc !in 0 until Game.COLS || k[r][nc] < 0) break
                    // The rules refuse a swap right under a hanging tile.
                    if (r + 1 < Game.ROWS && (base[r + 1][cc] == HANGING || base[r + 1][nc] == HANGING)) break
                    val tmp = k[r][nc]
                    k[r][nc] = k[r][cc]
                    k[r][cc] = tmp
                    cc = nc
                    val matched = matchesAfterSettling()
                    if (matched > 0) {
                        val value = matched * 100 - step
                        if (best == null || value > best.value) best = Move(r, c, cc, value)
                    }
                    // Over a gap the tile drops: it cannot be carried any further.
                    if (r > 0 && k[r - 1][cc] == 0) break
                }
            }
        }
        return best ?: levelling()
    }

    /** Lets everything in [k] fall, then counts the tiles that would be in a line of three or more. */
    private fun matchesAfterSettling(): Int {
        for (c in 0 until Game.COLS) {
            var write = 0
            for (r in 0 until Game.ROWS) {
                val v = k[r][c]
                e[r][c] = 0
                if (v < 0) {
                    e[r][c] = v
                    write = r + 1
                } else if (v > 0) {
                    e[write][c] = v
                    write++
                }
            }
        }
        var count = 0
        for (r in 0 until Game.ROWS) for (c in 0 until Game.COLS) {
            val v = e[r][c]
            if (v <= 0) continue
            val inRow = run(r, c, 0, 1, v) + run(r, c, 0, -1, v) + 1 >= 3
            val inCol = run(r, c, 1, 0, v) + run(r, c, -1, 0, v) + 1 >= 3
            if (inRow || inCol) count++
        }
        return count
    }

    private fun run(r: Int, c: Int, dr: Int, dc: Int, v: Int): Int {
        var n = 0
        var rr = r + dr
        var cc = c + dc
        while (rr in 0 until Game.ROWS && cc in 0 until Game.COLS && e[rr][cc] == v) {
            n++
            rr += dr
            cc += dc
        }
        return n
    }

    /** No match in sight: push the top tile of the tallest column onto a neighbour at least two rows lower. */
    private fun levelling(): Move? {
        var best: Move? = null
        for (c in 0 until Game.COLS) {
            val h = game.columnHeight(c)
            if (h == 0 || base[h - 1][c] <= 0) continue
            for (dir in intArrayOf(-1, 1)) {
                val n = c + dir
                if (n !in 0 until Game.COLS) continue
                val drop = h - game.columnHeight(n)
                if (drop < 2 || base[h - 1][n] != 0) continue
                val value = drop * 10 + h
                if (best == null || value > best.value) best = Move(h - 1, c, n, value)
            }
        }
        return best
    }
}
