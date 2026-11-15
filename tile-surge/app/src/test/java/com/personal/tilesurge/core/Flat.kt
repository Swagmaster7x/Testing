package com.personal.tilesurge.core

/**
 * A quick stand-in for the real game, for searching puzzles: a swap, then everything falls and
 * everything that lines up clears, over and over until nothing more happens. No timing at all.
 * (The puzzle tests replay every answer in the real game as well.)
 */
object Flat {
    const val W = Game.COLS
    const val H = Game.ROWS

    /** A cell is its kind (1..6) plus these: frozen tiles cannot be swapped, surge tiles take their row with them. */
    const val FROZEN = 16
    const val SURGE = 32
    private fun kind(v: Int) = v and 15

    private fun cell(ch: Char): Int = Tile.kindOf(ch) + (if (ch in 'a'..'f') FROZEN else 0) + (if (ch in 'p'..'u') SURGE else 0)

    private fun char(v: Int): Char = when {
        v == 0 -> '.'
        v and FROZEN != 0 -> 'a' + (kind(v) - 1)
        v and SURGE != 0 -> 'p' + (kind(v) - 1)
        else -> '0' + v
    }

    fun parse(rows: List<String>): IntArray {
        val b = IntArray(W * H)
        for ((i, line) in rows.withIndex()) {
            val r = rows.size - 1 - i
            for (c in 0 until W) b[r * W + c] = cell(line[c])
        }
        return b
    }

    fun rows(b: IntArray): List<String> {
        var top = 0
        for (i in b.indices) if (b[i] != 0) top = maxOf(top, i / W)
        return (top downTo 0).map { r -> (0 until W).joinToString("") { c -> char(b[r * W + c]).toString() } }
    }

    fun count(b: IntArray): Int = b.count { it != 0 }

    /** Swaps (r, c) with the cell to its right. False if both are empty or either is frozen. */
    fun swap(b: IntArray, r: Int, c: Int): Boolean {
        val i = r * W + c
        if (b[i] == 0 && b[i + 1] == 0) return false
        if ((b[i] or b[i + 1]) and FROZEN != 0) return false
        val t = b[i]; b[i] = b[i + 1]; b[i + 1] = t
        return true
    }

    /** Lets everything fall and clear until the board is still. Returns how many rounds of clearing there were. */
    fun settle(b: IntArray): Int {
        var rounds = 0
        val mark = BooleanArray(W * H)
        while (true) {
            for (c in 0 until W) {
                var w = 0
                for (r in 0 until H) {
                    val v = b[r * W + c]
                    if (v != 0) {
                        b[r * W + c] = 0
                        b[w * W + c] = v
                        w++
                    }
                }
            }
            mark.fill(false)
            var any = false
            for (r in 0 until H) for (c in 0 until W) {
                val v = kind(b[r * W + c])
                if (v == 0) continue
                if (c + 2 < W && kind(b[r * W + c + 1]) == v && kind(b[r * W + c + 2]) == v) {
                    mark[r * W + c] = true; mark[r * W + c + 1] = true; mark[r * W + c + 2] = true; any = true
                }
                if (r + 2 < H && kind(b[(r + 1) * W + c]) == v && kind(b[(r + 2) * W + c]) == v) {
                    mark[r * W + c] = true; mark[(r + 1) * W + c] = true; mark[(r + 2) * W + c] = true; any = true
                }
            }
            if (!any) return rounds
            // a surge tile takes its row, and any surge tile caught up in that takes its own
            var spread = true
            while (spread) {
                spread = false
                for (i in b.indices) if (mark[i] && b[i] and SURGE != 0) {
                    b[i] = b[i] and SURGE.inv()
                    val r = i / W
                    for (c in 0 until W) if (b[r * W + c] != 0 && !mark[r * W + c]) {
                        mark[r * W + c] = true
                        spread = true
                    }
                }
            }
            // whatever is frozen next to a clearing tile thaws
            for (i in b.indices) if (mark[i]) {
                val r = i / W
                val c = i % W
                if (r > 0) b[i - W] = b[i - W] and FROZEN.inv()
                if (r < H - 1) b[i + W] = b[i + W] and FROZEN.inv()
                if (c > 0) b[i - 1] = b[i - 1] and FROZEN.inv()
                if (c < W - 1) b[i + 1] = b[i + 1] and FROZEN.inv()
            }
            for (i in b.indices) if (mark[i]) b[i] = 0
            rounds++
        }
    }

    private fun dead(b: IntArray): Boolean {
        val n = IntArray(8)
        // a surge tile can take odd tiles with it, so nothing is hopeless while one is left
        for (v in b) {
            if (v and SURGE != 0) return false
            n[kind(v)]++
        }
        for (k in 1..7) if (n[k] == 1 || n[k] == 2) return true
        return false
    }

    /** Every way of clearing the board in exactly [depth] more swaps, as lists of row * W + col. Stops at [limit]. */
    fun solutions(b: IntArray, depth: Int, limit: Int = 50, path: ArrayList<Int> = ArrayList(), out: ArrayList<List<Int>> = ArrayList()): List<List<Int>> {
        if (out.size >= limit) return out
        if (count(b) == 0) {
            if (depth == 0) out += ArrayList(path)
            return out
        }
        if (depth == 0 || dead(b)) return out
        var top = 0
        for (i in b.indices) if (b[i] != 0) top = maxOf(top, i / W)
        for (r in 0..top) for (c in 0 until W - 1) {
            if (b[r * W + c] == b[r * W + c + 1]) continue
            val next = b.copyOf()
            if (!swap(next, r, c)) continue
            settle(next)
            path += r * W + c
            solutions(next, depth - 1, limit, path, out)
            path.removeAt(path.size - 1)
        }
        return out
    }

    /** The fewest swaps that clear the board, up to [max], or -1. */
    fun fewest(b: IntArray, max: Int): Int {
        for (d in 1..max) if (solutions(b.copyOf(), d, 1).isNotEmpty()) return d
        return -1
    }

    /** Plays [moves] in the real game, waiting for the board to come to rest after each. True if the board ends up empty. */
    fun realGameClears(def: PuzzleDef, moves: List<Int>): Boolean {
        val g = Game.puzzle(def)
        for (m in moves) {
            if (!g.trySwap(m / W, m % W)) return false
            var n = 0
            while (g.active && n++ < 5000) g.tick()
            g.tick()
        }
        return g.phase == Phase.STAGE_CLEAR && g.tileCount() == 0
    }
}
