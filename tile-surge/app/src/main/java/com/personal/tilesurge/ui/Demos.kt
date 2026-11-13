package com.personal.tilesurge.ui

import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.EventType
import com.personal.tilesurge.core.Game
import com.personal.tilesurge.core.GameEvent
import com.personal.tilesurge.core.Stages

/**
 * A small board that plays a short scripted scene on a loop, for the how-to-play pages.
 * It runs the real game, with the same grab, drag and raise calls a finger makes.
 * (No Android code in this file, so the plain unit tests can run every scene.)
 *
 * @param rows how many rows of the well the page shows
 * @param length frames before the scene starts over
 * @param build sets up the board
 * @param act called every frame, before the game's own tick, with the frame number
 */
class Demo(
    val rows: Int,
    val length: Int,
    val showsRaise: Boolean = false,
    private val build: () -> Game,
    private val act: (Int, Game) -> Unit,
) {
    var game: Game = build()
        private set
    var frame = 0
        private set

    /** A short message to show over the board ("×2 CHAIN"), and how many frames ago it appeared. */
    var caption = ""
        private set
    var captionAge = CAPTION_FRAMES
        private set

    /** What happened in the frame just played. */
    val lastEvents = ArrayList<GameEvent>()

    fun restart() {
        game = build()
        frame = 0
        captionAge = CAPTION_FRAMES
    }

    fun tick() {
        if (frame >= length) restart()
        act(frame, game)
        game.tick()
        lastEvents.clear()
        lastEvents.addAll(game.events)
        for (e in game.events) {
            when {
                e.type == EventType.MATCH && e.b >= 2 -> say("×${e.b} CHAIN")
                e.type == EventType.MATCH && e.a >= 4 -> say("${e.a} COMBO")
                e.type == EventType.STAGE_CLEAR -> say("STAGE CLEAR!")
                else -> Unit
            }
        }
        game.events.clear()
        if (captionAge < CAPTION_FRAMES) captionAge++
        frame++
    }

    private fun say(text: String) {
        caption = text
        captionAge = 0
    }

    companion object {
        const val CAPTION_FRAMES = 80
    }
}

object Demos {

    private fun still(vararg rows: String): Game = Game.infinite(Difficulty.NORMAL, 1, 2026L).apply {
        skipCountdown()
        autoRise = false
        setBoard(*rows)
        events.clear()
    }

    /** Sliding: a tile goes right, comes back, and then a tile from the top is pushed off the edge and drops. */
    fun slide() = Demo(
        rows = 4, length = 300,
        build = {
            still(
                "..3...",
                ".2514.",
                "514232",
            )
        },
        act = { f, g ->
            when (f) {
                40 -> if (g.grab(0, 1)) g.dragTo(3)
                80 -> g.release()
                110 -> if (g.grab(0, 3)) g.dragTo(1)
                150 -> g.release()
                185 -> if (g.grab(2, 2)) g.dragTo(5)
                235 -> g.release()
            }
        },
    )

    /** Matching: one slide lines up three, they clear, and the tiles on top of them drop. */
    fun match() = Demo(
        rows = 4, length = 250,
        build = {
            still(
                ".253..",
                "311412",
            )
        },
        act = { f, g ->
            when (f) {
                45 -> if (g.grab(0, 4)) g.dragTo(3)
                70 -> g.release()
            }
        },
    )

    /** A chain: the first match clears, and the tiles that drop make a second one by themselves. */
    fun chain() = Demo(
        rows = 4, length = 340,
        build = {
            still(
                ".33.4.",
                "113125",
            )
        },
        act = { f, g ->
            when (f) {
                45 -> if (g.grab(0, 3)) g.dragTo(2)
                70 -> g.release()
            }
        },
    )

    /** Rising: the raise button is held for three rows. */
    fun rise() = Demo(
        rows = 5, length = 250, showsRaise = true,
        build = {
            still(
                "2..41.",
                "135243",
            )
        },
        act = { f, g ->
            when (f) {
                50 -> g.raiseHeld = true
                50 + Game.MANUAL_FRAMES_PER_ROW * 3 - 4 -> g.raiseHeld = false
            }
        },
    )

    /** Stage Clear: the line is in view, and one match clears everything above it. */
    fun line() = Demo(
        rows = 4, length = 300,
        build = {
            val def = Stages.get(1)
            Game.stage(def, 2026L).apply {
                skipCountdown()
                autoRise = false
                setBoard("123123")
                // bring the clear line up to one row above the floor
                raiseHeld = true
                var guard = 0
                while (rowsRisen < def.lines + 1 && guard++ < 2000) tick()
                raiseHeld = false
                setBoard(
                    ".22.2.",
                    "314531",
                )
                events.clear()
            }
        },
        act = { f, g ->
            when (f) {
                50 -> if (g.grab(1, 4)) g.dragTo(3)
                75 -> g.release()
            }
        },
    )

    fun all(): List<Demo> = listOf(slide(), match(), chain(), rise(), line())
}
