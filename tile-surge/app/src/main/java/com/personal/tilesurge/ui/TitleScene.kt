package com.personal.tilesurge.ui

import android.graphics.Canvas
import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Stages
import kotlin.math.sin

/** The first screen: the name of the game and the way into its two modes. */
class TitleScene(app: App) : Scene(app) {

    private var clock = 0
    private var logoY = 0f
    private var tile = 0f

    internal val stageButton = Button("STAGE CLEAR", ButtonStyle.PRIMARY) { app.go(StageSelectScene(app)) }
    internal val infiniteButton = Button("INFINITE", ButtonStyle.PRIMARY) { app.go(InfiniteSetupScene(app)) }
    internal val howButton = Button("HOW TO PLAY") { app.go(HowToScene(app)) }
    internal val soundButton = Button("") { toggleSound() }
    internal val buzzButton = Button("") { toggleBuzz() }

    init {
        buttons += listOf(stageButton, infiniteButton, howButton, soundButton, buzzButton)
        refresh()
    }

    private fun refresh() {
        val cleared = app.prefs.stagesCleared
        stageButton.note = when {
            cleared >= Stages.COUNT -> "all ${Stages.COUNT} stages cleared"
            cleared == 0 -> "${Stages.COUNT} stages: clear everything above the line"
            else -> "stage ${cleared + 1} of ${Stages.COUNT} is next"
        }
        val best = Difficulty.entries.maxOf { app.prefs.bestScore(it) }
        infiniteButton.note = if (best > 0) "best ${Format.number(best)}" else "play for as long as you can"
        soundButton.icon = if (app.prefs.sound) Icon.SOUND_ON else Icon.SOUND_OFF
        buzzButton.icon = if (app.prefs.buzz) Icon.BUZZ_ON else Icon.BUZZ_OFF
    }

    private fun toggleSound() {
        app.prefs.sound = !app.prefs.sound
        refresh()
        app.sound.play(Sfx.TAP)
    }

    private fun toggleBuzz() {
        app.prefs.buzz = !app.prefs.buzz
        refresh()
        app.buzz()
    }

    override fun layout() {
        val l = colLeft + 36f * u
        val r = colRight - 36f * u
        val h = safe.height()
        tile = 44f * u
        logoY = safe.top + h * 0.13f
        val bigH = 70f * u
        var y = safe.top + h * 0.47f
        stageButton.set(l, y, r, y + bigH)
        stageButton.textUnits = 23f
        y += bigH + 16f * u
        infiniteButton.set(l, y, r, y + bigH)
        infiniteButton.textUnits = 23f
        y += bigH + 16f * u
        howButton.set(l, y, r, y + 52f * u)
        val s = 48f * u
        val by = safe.bottom - 22f * u - s
        soundButton.set(safe.centerX() - s - 8f * u, by, safe.centerX() - 8f * u, by + s)
        buzzButton.set(safe.centerX() + 8f * u, by, safe.centerX() + 8f * u + s, by + s)
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
            val bob = sin(clock * 0.06f + kind * 0.8f) * 7f * u
            app.art.paintTile(c, kind, x, logoY + bob, tile)
            x += tile + gap
        }

        val nameY = logoY + tile + 62f * u
        ui.outlinedText(c, "TILE SURGE", cx, nameY, ui.fitSize("TILE SURGE", 54f * u, colRight - colLeft - 40f * u), Palette.TEXT, Palette.PANEL_DARK, 10f * u)
        // an amber underline with an arrowhead: the stack only ever goes one way
        val lineY = nameY + 40f * u
        ui.roundRect(c, cx - 70f * u, lineY, cx + 70f * u, lineY + 5f * u, 2.5f * u, Palette.ACCENT)
        ui.icon(c, Icon.UP, cx, lineY - 9f * u, 26f * u, Palette.ACCENT)
        ui.text(c, "slide · match · chain", cx, lineY + 26f * u, 15f * u, Palette.TEXT_DIM, face = ui.semi)

        drawButtons(c)
    }
}
