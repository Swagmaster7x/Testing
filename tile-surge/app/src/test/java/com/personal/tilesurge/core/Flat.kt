package com.personal.tilesurge.core

/**
 * A quick stand-in for the real game, for searching puzzles: a swap, then everything falls and
 * everything that lines up clears, over and over until nothing more happens. No timing at all.
 * (The puzzle tests replay every answer in the real game as well.)
 */
object Flat {
    const val W = Game.COLS
    const val H = Game.ROWS

    fun parse(rows: List<String>): IntArray {
        val b = IntArray(W * H)
        for ((i, line) in rows.withIndex()) {
            val r = rows.size - 1 - i
            for (c in 0 until W) if (line[c] != '.') b[r * W + c] = line[c] - '0'
        }
        return b
    }

    fun rows(b: IntArray): List<String> {
        var top = 0
        for (i in b.indices) if (b[i] != 0) top = maxOf(top, i / W)
        return (top downTo 0).map { r -> (0 until W).joinToString("") { c -> if (b[r * W + c] == 0) "." else b[r * W + c].toString() } }
    }

    fun count(b: IntArray): Int = b.count { it != 0 }

    /** Swaps (r, c) with the cell to its right. False if both are empty. */
    fun swap(b: IntArray, r: Int, c: Int): Boolean {
        val i = r * W + c
        if (b[i] == 0 && b[i + 1] == 0) return false
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
                val v = b[r * W + c]
                if (v == 0) continue
                if (c + 2 < W && b[r * W + c + 1] == v && b[r * W + c + 2] == v) {
                    mark[r * W + c] = true; mark[r * W + c + 1] = true; mark[r * W + c + 2] = true; any = true
                }
                if (r + 2 < H && b[(r + 1) * W + c] == v && b[(r + 2) * W + c] == v) {
                    mark[r * W + c] = true; mark[(r + 1) * W + c] = true; mark[(r + 2) * W + c] = true; any = true
                }
            }
            if (!any) return rounds
            for (i in b.indices) if (mark[i]) b[i] = 0
            rounds++
        }
    }

    private fun dead(b: IntArray): Boolean {
        val n = IntArray(8)
        for (v in b) n[v]++
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
            swap(next, r, c)
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
