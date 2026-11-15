package com.personal.tilesurge.ui

import android.graphics.Canvas
import com.personal.tilesurge.core.Difficulty

/** Choosing how good the computer is before a game against it. */
class VersusSetupScene(app: App) : Scene(app) {

    private var difficulty = app.prefs.versusDifficulty

    internal val backButton = Button("") { app.go(TitleScene(app)) }.apply { icon = Icon.BACK }
    internal val choices = Difficulty.entries.map { d -> Button(d.label.uppercase()) { choose(d) } }
    internal val startButton = Button("START", ButtonStyle.PRIMARY) { app.go(PlayScene(app, Setup.Versus(difficulty))) }

    private var titleY = 0f
    private var sectionY = 0f
    private var rulesY = 0f

    init {
        buttons += backButton
        buttons += choices
        buttons += startButton
        refresh()
    }

    private fun choose(d: Difficulty) {
        difficulty = d
        app.prefs.versusDifficulty = d
        refresh()
    }

    private fun refresh() {
        for ((i, b) in choices.withIndex()) {
            val d = Difficulty.entries[i]
            b.style = if (d == difficulty) ButtonStyle.SELECTED else ButtonStyle.PLAIN
            val wins = app.prefs.versusWins(d)
            b.note = if (wins == 1) "1 win" else "$wins wins"
        }
    }

    override fun layout() {
        val l = colLeft + 24f * u
        val r = colRight - 24f * u
        val top = safe.top + 12f * u
        backButton.set(colLeft + 12f * u, top, colLeft + 60f * u, top + 48f * u)
        titleY = top + 24f * u
        sectionY = safe.top + safe.height() * 0.17f
        val gap = 10f * u
        val bw = (r - l - gap * 2) / 3f
        val by = sectionY + 26f * u
        for ((i, b) in choices.withIndex()) {
            val x = l + i * (bw + gap)
            b.set(x, by, x + bw, by + 62f * u)
            b.textUnits = 16f
        }
        rulesY = by + 62f * u + 30f * u
        val startH = 68f * u
        val startTop = minOf(safe.top + safe.height() * 0.76f, safe.bottom - 34f * u - startH)
        startButton.set(l, startTop, r, startTop + startH)
        startButton.textUnits = 26f
    }

    override fun onBack(): Boolean {
        app.go(TitleScene(app))
        return true
    }

    override fun draw(c: Canvas) {
        ui.background(c, width, height)
        val cx = safe.centerX()
        ui.text(c, "VERSUS", cx, titleY, 26f * u, Palette.TEXT)
        ui.text(c, "THE COMPUTER PLAYS ON", cx, sectionY, 12f * u, Palette.TEXT_DIM, face = ui.semi)
        val about = when (difficulty) {
            Difficulty.EASY -> "It takes its time over every move."
            Difficulty.NORMAL -> "It keeps up a steady pace."
            Difficulty.HARD -> "It hardly stops to think."
        }
        var y = ui.paragraph(c, about, cx, rulesY, colRight - colLeft - 56f * u, 13f * u, Palette.TEXT_DIM)
        y += 22f * u
        ui.paragraph(c,
            "You each have a well. Clear four or more at once, or make a chain, and blockers drop into the other one.\n" +
                "Blockers on their way to you are cancelled by your own clears first.\n" +
                "Whoever's stack reaches the top loses.",
            cx, y, colRight - colLeft - 56f * u, 13.5f * u, Palette.TEXT)
        drawButtons(c)
    }
}
