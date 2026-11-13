package com.personal.tilesurge.core

import org.junit.Assume
import org.junit.Test

/**
 * Not a test: the tool that made the puzzles in Puzzles.kt. It tries random boards, keeps the ones whose
 * shortest answer is the length wanted, and prints them. Run it with MAKE_PUZZLES=1 in the environment.
 */
class PuzzleMaker {
    @Test
    fun make() {
        Assume.assumeTrue(System.getenv("MAKE_PUZZLES") == "1")
        val rng = Rng(20261113)
        // (moves, how many, kinds, tiles) from gentle to hard
        val plan = listOf(
            intArrayOf(1, 3, 2, 6), intArrayOf(2, 4, 2, 9), intArrayOf(2, 4, 3, 9),
            intArrayOf(3, 5, 3, 9), intArrayOf(3, 5, 3, 12), intArrayOf(3, 3, 4, 12),
            intArrayOf(4, 3, 3, 12), intArrayOf(4, 3, 4, 15),
        )
        var number = 1
        val seen = HashSet<String>()
        for ((moves, want, kinds, tiles) in plan.map { it.toList() }) {
            var made = 0
            var tries = 0
            while (made < want && tries++ < 400000) {
                val b = random(rng, kinds, tiles) ?: continue
                val start = b.copyOf()
                if (Flat.settle(b.copyOf()) != 0) continue
                if (Flat.fewest(start, moves - 1) != -1) continue
                val sols = Flat.solutions(start.copyOf(), moves, 40)
                if (sols.isEmpty()) continue
                // few ways in: the first move has to be thought about
                if (moves > 1 && sols.map { it[0] }.distinct().size > 2) continue
                val rows = Flat.rows(start)
                if (!seen.add(rows.joinToString("/"))) continue
                val def = PuzzleDef(number, moves, rows)
                if (!Flat.realGameClears(def, sols[0])) continue
                println("        PuzzleDef($number, $moves, listOf(${rows.joinToString(", ") { "\"$it\"" }})),  // ${sols[0].joinToString(" ") { "r${it / 6}c${it % 6}" }}")
                number++
                made++
            }
            println("// moves=$moves kinds=$kinds tiles=$tiles made=$made tries=$tries")
        }
    }

    /** [tiles] tiles of [kinds] kinds (at least three of each), dropped into random columns. */
    private fun random(rng: Rng, kinds: Int, tiles: Int): IntArray? {
        val bag = ArrayList<Int>()
        for (k in 1..kinds) repeat(3) { bag += k }
        while (bag.size < tiles) {
            val k = 1 + rng.nextInt(kinds)
            repeat(3) { bag += k }
        }
        if (bag.size != tiles) return null
        val b = IntArray(Flat.W * Flat.H)
        val h = IntArray(Flat.W)
        // keep it compact: three or four columns side by side
        val width = 3 + rng.nextInt(3)
        val left = rng.nextInt(Flat.W - width + 1)
        while (bag.isNotEmpty()) {
            val k = bag.removeAt(rng.nextInt(bag.size))
            val c = left + rng.nextInt(width)
            if (h[c] >= 5) return null
            b[h[c] * Flat.W + c] = k
            h[c]++
        }
        return b
    }
}
