package com.personal.tilesurge.core

/**
 * Looks one swap ahead for the player: is there a swap right now that would set off a chain?
 * It works on a still copy of the board, with no timing: swap, let everything fall and clear, and count
 * how many rounds of clearing follow.
 */
object Hint {
    private const val W = Game.COLS
    private const val H = Game.ROWS
    private val base = IntArray(W * H)
    private val work = IntArray(W * H)
    private val mark = BooleanArray(W * H)

    /** Movable tile kinds are 1..6; blockers and frozen tiles are copied as kind + 10 (they fall but do not slide). */
    private fun snapshot(g: Game): Boolean {
        for (r in 0 until H) for (c in 0 until W) {
            val t = g.grid[r][c]
            base[r * W + c] = when {
                t.kind == 0 -> if (t.state == TileState.NORMAL) 0 else return false
                !t.isResting -> return false
                t.isBlock -> 17
                t.frozen -> t.kind + 10
                else -> t.kind
            }
        }
        return true
    }

    private fun kindOf(v: Int): Int = if (v == 17) -1 else if (v > 10) v - 10 else v

    private fun settle(b: IntArray): Int {
        var rounds = 0
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
                val k = kindOf(b[r * W + c])
                if (k <= 0) continue
                if (c + 2 < W && kindOf(b[r * W + c + 1]) == k && kindOf(b[r * W + c + 2]) == k) {
                    mark[r * W + c] = true; mark[r * W + c + 1] = true; mark[r * W + c + 2] = true; any = true
                }
                if (r + 2 < H && kindOf(b[(r + 1) * W + c]) == k && kindOf(b[(r + 2) * W + c]) == k) {
                    mark[r * W + c] = true; mark[(r + 1) * W + c] = true; mark[(r + 2) * W + c] = true; any = true
                }
            }
            if (!any) return rounds
            for (i in b.indices) if (mark[i]) b[i] = 0
            rounds++
        }
    }

    /**
     * The swap that would start the longest chain (two steps or more), as `row * 6 + col` of its left
     * cell, or -1 if there is none or the board is not at rest.
     */
    fun chainSwap(g: Game): Int {
        if (!snapshot(g)) return -1
        var best = -1
        var bestRounds = 1
        for (r in 0 until H) for (c in 0 until W - 1) {
            val a = base[r * W + c]
            val b = base[r * W + c + 1]
            if (a == b || a > 10 || b > 10) continue
            base.copyInto(work)
            work[r * W + c] = b
            work[r * W + c + 1] = a
            val rounds = settle(work)
            if (rounds > bestRounds) {
                bestRounds = rounds
                best = r * W + c
            }
        }
        return best
    }
}
