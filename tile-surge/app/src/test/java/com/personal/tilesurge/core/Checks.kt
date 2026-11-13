package com.personal.tilesurge.core

import org.junit.Assert.fail

/** Things that must be true of the board after every frame, whatever the player did. */
object Checks {

    fun assertConsistent(g: Game, context: String = "") {
        val problems = problems(g)
        if (problems.isNotEmpty()) {
            fail("Board broke the rules $context (seed ${g.seed}, frame ${g.frames}):\n" +
                problems.joinToString("\n") + "\n" + describe(g))
        }
    }

    fun problems(g: Game): List<String> {
        val out = ArrayList<String>()
        val seenObjects = java.util.IdentityHashMap<Tile, Boolean>()
        val seenIds = HashSet<Int>()
        var anyChaining = false
        var anyActive = false
        var anySettling = false

        for (r in 0 until Game.ROWS) for (c in 0 until Game.COLS) {
            val t = g.grid[r][c]
            val at = "($r,$c)"
            if (seenObjects.put(t, true) != null) out += "$at shares its Tile object with another cell"
            if (t.kind == 0) {
                if (t.id != 0) out += "$at is empty but has id ${t.id}"
                if (t.state != TileState.NORMAL && t.state != TileState.SWAPPING) out += "$at is empty but ${t.state}"
                if (t.chaining) out += "$at is empty but marked as chaining"
            } else {
                if (t.kind !in 1..g.kinds) out += "$at has kind ${t.kind}"
                if (t.id == 0) out += "$at has a tile with no id"
                if (!seenIds.add(t.id)) out += "$at repeats id ${t.id}"
            }
            when (t.state) {
                TileState.NORMAL -> Unit
                TileState.FALLING -> if (t.timer != 0) out += "$at is FALLING with timer ${t.timer}"
                else -> if (t.timer <= 0) out += "$at is ${t.state} with timer ${t.timer}"
            }
            if (t.state == TileState.SWAPPING && t.timer > Game.SWAP_FRAMES) out += "$at swap timer ${t.timer}"
            if (t.isClearing && (t.comboIndex !in 1..t.comboSize)) out += "$at combo ${t.comboIndex}/${t.comboSize}"
            if (t.chaining) anyChaining = true
            if (t.state != TileState.NORMAL && t.state != TileState.LANDING) anyActive = true
            if (t.state == TileState.HOVERING || t.state == TileState.FALLING || t.isClearing) anySettling = true

            // A resting tile must stand on something solid, or on a cell a tile is still sliding through.
            if (t.isResting && r > 0) {
                val below = g.grid[r - 1][c]
                val supported = if (below.kind == 0) below.state == TileState.SWAPPING
                else below.state != TileState.HOVERING && below.state != TileState.FALLING
                if (!supported) out += "$at rests on nothing (below is kind ${below.kind}, ${below.state})"
            }
        }

        // No finished line of three may be left unmatched.
        for (r in 0 until Game.ROWS) for (c in 0 until Game.COLS) {
            val t = g.grid[r][c]
            if (!t.isResting) continue
            if (c + 2 < Game.COLS && same(t, g.grid[r][c + 1]) && same(t, g.grid[r][c + 2])) out += "unmatched row of three at ($r,$c)"
            if (r + 2 < Game.ROWS && same(t, g.grid[r + 1][c]) && same(t, g.grid[r + 2][c])) out += "unmatched column of three at ($r,$c)"
        }

        if (g.phase == Phase.PLAYING || g.phase == Phase.COUNTDOWN) {
            if (g.active != anyActive) out += "active flag is ${g.active} but should be $anyActive"
            if (g.settling != anySettling) out += "settling flag is ${g.settling} but should be $anySettling"
        }
        if (g.chain < 1) out += "chain is ${g.chain}"
        if (g.chain > 1 && !anyChaining) out += "chain is ${g.chain} but no tile carries the mark"
        if (g.riseOffset !in 0 until Game.ROW_UNITS) out += "riseOffset ${g.riseOffset}"
        if (g.riseOffset > 0) {
            for (c in 0 until Game.COLS) if (g.grid[Game.ROWS - 1][c].kind != 0) {
                out += "the stack is part-way up a row with a tile in the top row"
                break
            }
        }
        for (c in 0 until Game.COLS) {
            if (g.incoming[c] !in 1..g.kinds) out += "incoming[$c] = ${g.incoming[c]}"
            if (c > 0 && g.incoming[c] == g.incoming[c - 1]) out += "incoming row repeats a tile at $c"
        }
        if (g.grace !in 0..g.graceMax) out += "grace ${g.grace}"
        if (g.stopFrames < 0) out += "stopFrames ${g.stopFrames}"
        return out
    }

    private fun same(a: Tile, b: Tile) = b.isResting && a.kind == b.kind

    /** The board with each tile's state, for failure messages. */
    fun describe(g: Game): String {
        val sb = StringBuilder()
        for (r in Game.ROWS - 1 downTo 0) {
            sb.append(String.format("%2d ", r))
            for (c in 0 until Game.COLS) {
                val t = g.grid[r][c]
                val s = when (t.state) {
                    TileState.NORMAL -> ' '
                    TileState.SWAPPING -> 's'
                    TileState.HOVERING -> 'h'
                    TileState.FALLING -> 'f'
                    TileState.LANDING -> 'l'
                    TileState.MATCHED -> 'm'
                    TileState.POPPING -> 'p'
                    TileState.POPPED -> 'x'
                }
                sb.append(if (t.kind == 0) '.' else '0' + t.kind).append(s).append(if (t.chaining) '*' else ' ')
            }
            sb.append('\n')
        }
        sb.append("phase=${g.phase} chain=${g.chain} score=${g.score} level=${g.level} rise=${g.riseOffset} stop=${g.stopFrames} grace=${g.grace} line=${g.lineRow}")
        return sb.toString()
    }

    /** A game on Normal timing with the countdown skipped and the stack held still. */
    fun still(vararg rows: String, difficulty: Difficulty = Difficulty.NORMAL): Game {
        val g = Game.infinite(difficulty, 1, 1L)
        g.skipCountdown()
        g.autoRise = false
        g.setBoard(*rows)
        g.events.clear()
        return g
    }

    fun Game.run(frames: Int) {
        repeat(frames) {
            tick()
            assertConsistent(this)
        }
    }

    /** Ticks until [done] is true; fails if it takes more than [limit] frames. Returns the frames it took. */
    fun Game.runUntil(limit: Int = 2000, done: (Game) -> Boolean): Int {
        var n = 0
        while (!done(this)) {
            if (n >= limit) fail("Still waiting after $limit frames\n" + describe(this))
            tick()
            assertConsistent(this)
            n++
        }
        return n
    }

    fun Game.count(type: EventType): Int = events.count { it.type == type }
}
