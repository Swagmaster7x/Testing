package com.personal.tilesurge.ui

import android.graphics.Canvas
import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Game
import com.personal.tilesurge.core.Puzzles
import com.personal.tilesurge.core.Stages
import kotlin.math.sin

/** The first screen: the name of the game and the way into everything. */
class TitleScene(app: App) : Scene(app) {

    private var clock = 0
    private var logoY = 0f
    private var tile = 0f

    internal val continueButton = Button("CONTINUE", ButtonStyle.SELECTED) { resumeSaved() }
    internal val stageButton = Button("STAGE CLEAR", ButtonStyle.PRIMARY) { app.go(StageSelectScene(app)) }
    internal val puzzleButton = Button("PUZZLE", ButtonStyle.PRIMARY) { app.go(StageSelectScene(app, puzzles = true)) }
    internal val infiniteButton = Button("INFINITE", ButtonStyle.PRIMARY) { app.go(InfiniteSetupScene(app)) }
    internal val timedButton = Button("SCORE ATTACK", ButtonStyle.PRIMARY) { app.go(InfiniteSetupScene(app, timed = true)) }
    internal val dailyButton = Button("DAILY CHALLENGE", ButtonStyle.PRIMARY) { app.go(PlayScene(app, Setup.Daily(Days.today()))) }
    internal val howButton = Button("HOW TO PLAY") { app.go(PlayScene(app, Setup.Lesson(1))) }
    internal val soundButton = Button("") { toggleSound() }
    internal val musicButton = Button("") { toggleMusic() }
    internal val buzzButton = Button("") { toggleBuzz() }

    init {
        buttons += listOf(continueButton, stageButton, puzzleButton, infiniteButton, timedButton, dailyButton, howButton,
            soundButton, musicButton, buzzButton)
        refresh()
    }

    /** The game that was put down part-way, if there is one that can still be picked up. */
    private fun saved(): Pair<Setup, Game>? {
        val setup = Setup.decode(app.prefs.savedSetup) ?: return null
        // yesterday's daily challenge is over
        if (setup is Setup.Daily && setup.day != Days.today()) return null
        val game = app.prefs.savedGame?.let { Game.restore(it) } ?: return null
        return setup to game
    }

    private fun resumeSaved() {
        val s = saved() ?: return
        app.go(PlayScene(app, s.first, resumed = s.second))
    }

    private fun refresh() {
        continueButton.visible = saved() != null
        continueButton.note = when (val s = saved()?.first) {
            is Setup.Stage -> "stage ${s.number}"
            is Setup.Infinite -> "Infinite, ${s.difficulty.label}"
            is Setup.Timed -> "Score Attack, ${s.difficulty.label}"
            is Setup.Daily -> "today's challenge"
            else -> null
        }
        val cleared = app.prefs.stagesCleared
        stageButton.note = when {
            cleared >= Stages.COUNT -> "all ${Stages.COUNT} cleared"
            cleared == 0 -> "${Stages.COUNT} stages"
            else -> "stage ${cleared + 1} is next"
        }
        val solved = app.prefs.puzzlesSolved
        puzzleButton.note = if (solved >= Puzzles.COUNT) "all ${Puzzles.COUNT} solved" else "$solved of ${Puzzles.COUNT} solved"
        val best = Difficulty.entries.maxOf { app.prefs.bestScore(it) }
        infiniteButton.note = if (best > 0) "best ${Format.number(best)}" else "no end"
        val timed = Difficulty.entries.maxOf { app.prefs.bestTimed(it) }
        timedButton.note = if (timed > 0) "best ${Format.number(timed)}" else "two minutes"
        val today = app.prefs.dailyBest(Days.today())
        val streak = app.prefs.dailyStreak(Days.today(), Days.yesterday())
        dailyButton.note = when {
            today > 0 && streak > 1 -> "today ${Format.number(today)} · $streak days running"
            today > 0 -> "today's best ${Format.number(today)}"
            streak > 0 -> "$streak days running: play today's to keep it going"
            else -> "the same board for everyone, new every day"
        }
        soundButton.icon = if (app.prefs.sound) Icon.SOUND_ON else Icon.SOUND_OFF
        musicButton.icon = if (app.prefs.music) Icon.MUSIC_ON else Icon.MUSIC_OFF
        buzzButton.icon = if (app.prefs.buzz) Icon.BUZZ_ON else Icon.BUZZ_OFF
    }

    private fun toggleSound() {
        app.prefs.sound = !app.prefs.sound
        refresh()
        app.sound.play(Sfx.TAP)
    }

    private fun toggleMusic() {
        app.prefs.music = !app.prefs.music
        refresh()
        app.sound.syncMusic()
    }

    private fun toggleBuzz() {
        app.prefs.buzz = !app.prefs.buzz
        refresh()
        app.buzz()
    }

    override fun layout() {
        val l = colLeft + 24f * u
        val r = colRight - 24f * u
        val mid = (l + r) / 2f
        val gap = 9f * u
        tile = (36f * u).toInt().toFloat()
        app.art.prepare(tile.toInt())
        logoY = safe.top + 34f * u

        val s = 46f * u
        val togglesTop = safe.bottom - 18f * u - s
        val cx = safe.centerX()
        soundButton.set(cx - s * 1.5f - 10f * u, togglesTop, cx - s * 0.5f - 10f * u, togglesTop + s)
        musicButton.set(cx - s * 0.5f, togglesTop, cx + s * 0.5f, togglesTop + s)
        buzzButton.set(cx + s * 0.5f + 10f * u, togglesTop, cx + s * 1.5f + 10f * u, togglesTop + s)

        // the buttons share whatever height is left between the name and the switches
        val top = logoY + tile + 122f * u
        val rows = if (continueButton.visible) 5 else 4
        val room = togglesTop - 16f * u - top
        val h = minOf(64f * u, (room - gap * (rows - 1)) / rows)
        var y = top + maxOf(0f, (room - (h * rows + gap * (rows - 1))) * 0.4f)
        if (continueButton.visible) {
            continueButton.set(l, y, r, y + h)
            y += h + gap
        }
        stageButton.set(l, y, mid - gap / 2f, y + h)
        puzzleButton.set(mid + gap / 2f, y, r, y + h)
        y += h + gap
        infiniteButton.set(l, y, mid - gap / 2f, y + h)
        timedButton.set(mid + gap / 2f, y, r, y + h)
        y += h + gap
        dailyButton.set(l, y, r, y + h)
        y += h + gap
        howButton.set(l, y, r, y + h)
        for (b in listOf(continueButton, stageButton, puzzleButton, infiniteButton, timedButton, dailyButton)) b.textUnits = 17f
        howButton.textUnits = 16f
    }

    override fun tick() {
        clock++
    }

    override fun draw(c: Canvas) {
        ui.background(c, width, height)
        val cx = safe.centerX()

        // the six tiles, bobbing in a row like a wave moving through the stack
        val gap = 4f * u
        val total = TileArt.KINDS * tile + (TileArt.KINDS - 1) * gap
        var x = cx - total / 2f
        for (kind in 1..TileArt.KINDS) {
            val bob = sin(clock * 0.06f + kind * 0.8f) * 6f * u
            app.art.stamp(c, kind, x, logoY + bob, tile, tile, null)
            x += tile + gap
        }

        val nameY = logoY + tile + 50f * u
        ui.outlinedText(c, "TILE SURGE", cx, nameY, ui.fitSize("TILE SURGE", 48f * u, colRight - colLeft - 48f * u), Palette.TEXT, Palette.PANEL_DARK, 9f * u)
        // an amber underline with an arrowhead: the stack only ever goes one way
        val lineY = nameY + 35f * u
        ui.roundRect(c, cx - 64f * u, lineY, cx + 64f * u, lineY + 5f * u, 2.5f * u, Palette.ACCENT)
        ui.icon(c, Icon.UP, cx, lineY - 9f * u, 24f * u, Palette.ACCENT)
        ui.text(c, "slide · match · chain", cx, lineY + 22f * u, 14f * u, Palette.TEXT_DIM, face = ui.semi)

        drawButtons(c)
    }
}
