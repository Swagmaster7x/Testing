package com.personal.tilesurge.ui

import android.graphics.Canvas
import com.personal.tilesurge.core.Stages

/** The thirty stages of Stage Clear. A stage opens when the one before it has been cleared. */
class StageSelectScene(app: App) : Scene(app) {

    internal val backButton = Button("") { app.go(TitleScene(app)) }.apply { icon = Icon.BACK }
    internal val stageButtons = (1..Stages.COUNT).map { n -> Button("") { app.go(PlayScene(app, Setup.Stage(n))) } }
    private var titleY = 0f

    init {
        buttons += backButton
        buttons += stageButtons
        val cleared = app.prefs.stagesCleared
        for ((i, b) in stageButtons.withIndex()) {
            val n = i + 1
            when {
                !app.prefs.isUnlocked(n) -> {
                    b.icon = Icon.LOCK
                    b.enabled = false
                }
                n <= cleared -> {
                    b.label = n.toString()
                    b.note = Format.clock(app.prefs.bestStageFrames(n))
                }
                else -> {
                    b.label = n.toString()
                    b.note = "next"
                    b.style = ButtonStyle.PRIMARY
                }
            }
        }
    }

    override fun layout() {
        val top = safe.top + 12f * u
        backButton.set(colLeft + 12f * u, top, colLeft + 60f * u, top + 48f * u)
        titleY = top + 24f * u

        val cols = 5
        val rows = Stages.COUNT / cols
        val l = colLeft + 18f * u
        val r = colRight - 18f * u
        val gridTop = safe.top + 122f * u
        val gridBottom = safe.bottom - 24f * u
        val gap = 8f * u
        val w = (r - l - gap * (cols - 1)) / cols
        val h = minOf(78f * u, (gridBottom - gridTop - gap * (rows - 1)) / rows)
        for ((i, b) in stageButtons.withIndex()) {
            val x = l + (i % cols) * (w + gap)
            val y = gridTop + (i / cols) * (h + gap)
            b.set(x, y, x + w, y + h)
            b.textUnits = 19f
        }
    }

    override fun onBack(): Boolean {
        app.go(TitleScene(app))
        return true
    }

    override fun draw(c: Canvas) {
        ui.background(c, width, height)
        val cx = safe.centerX()
        ui.text(c, "STAGE CLEAR", cx, titleY, 26f * u, Palette.TEXT)
        ui.paragraph(c, "Bring the clear line up into the well,\nthen clear every tile above it.", cx, safe.top + 78f * u,
            colRight - colLeft - 48f * u, 13f * u, Palette.TEXT_DIM)
        drawButtons(c)
    }
}
