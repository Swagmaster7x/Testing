package com.personal.tilesurge.ui

import android.graphics.Canvas
import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Speed
import java.util.Locale

/** Choosing a difficulty and a starting speed for Infinite mode. */
class InfiniteSetupScene(app: App) : Scene(app) {

    private var difficulty = app.prefs.difficulty
    private var level = app.prefs.startLevel(difficulty)

    internal val backButton = Button("") { app.go(TitleScene(app)) }.apply { icon = Icon.BACK }
    internal val choices = Difficulty.entries.map { d -> Button(d.label.uppercase()) { choose(d) } }
    internal val slower = Button("") { setLevel(level - 1) }.apply { icon = Icon.MINUS }
    internal val faster = Button("") { setLevel(level + 1) }.apply { icon = Icon.PLUS }
    internal val startButton = Button("START", ButtonStyle.PRIMARY) {
        app.go(PlayScene(app, Setup.Infinite(difficulty, level)))
    }

    private var titleY = 0f
    private var sectionY = 0f
    private var speedY = 0f
    private var bestY = 0f

    init {
        buttons += backButton
        buttons += choices
        buttons += listOf(slower, faster, startButton)
        refresh()
    }

    private fun choose(d: Difficulty) {
        difficulty = d
        app.prefs.difficulty = d
        level = app.prefs.startLevel(d)
        refresh()
    }

    private fun setLevel(n: Int) {
        level = n.coerceIn(1, Prefs.MAX_START_LEVEL)
        app.prefs.setStartLevel(difficulty, level)
        refresh()
    }

    private fun refresh() {
        for ((i, b) in choices.withIndex()) {
            b.style = if (Difficulty.entries[i] == difficulty) ButtonStyle.SELECTED else ButtonStyle.PLAIN
        }
        slower.enabled = level > 1
        faster.enabled = level < Prefs.MAX_START_LEVEL
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
            b.set(x, by, x + bw, by + 56f * u)
            b.textUnits = 17f
        }

        speedY = by + 56f * u + safe.height() * 0.13f
        val sy = speedY + 26f * u
        val s = 60f * u
        slower.set(l, sy, l + s, sy + s)
        faster.set(r - s, sy, r, sy + s)

        bestY = sy + s + safe.height() * 0.10f
        val startH = 68f * u
        val startTop = minOf(maxOf(bestY + 86f * u, safe.top + safe.height() * 0.76f), safe.bottom - 34f * u - startH)
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
        ui.text(c, "INFINITE", cx, titleY, 26f * u, Palette.TEXT)

        ui.text(c, "DIFFICULTY", cx, sectionY, 12f * u, Palette.TEXT_DIM, face = ui.semi)
        val about = when (difficulty) {
            Difficulty.EASY -> "Five tiles. Unhurried: long pauses after combos and chains."
            Difficulty.NORMAL -> "Five tiles. The standard pace."
            Difficulty.HARD -> "Six tiles. Everything happens faster, and the top is less forgiving."
        }
        ui.paragraph(c, about, cx, choices[0].rect.bottom + 22f * u, colRight - colLeft - 56f * u, 13f * u, Palette.TEXT_DIM)

        ui.text(c, "STARTING SPEED", cx, speedY, 12f * u, Palette.TEXT_DIM, face = ui.semi)
        val mid = slower.rect.centerY()
        ui.text(c, level.toString(), cx, mid - 5f * u, 40f * u, Palette.TEXT)
        val seconds = Speed.framesPerRow[level] / 60f
        ui.text(c, String.format(Locale.US, "a new row every %.1f s", seconds), cx, mid + 28f * u, 12f * u, Palette.TEXT_DIM, face = ui.semi)

        val best = app.prefs.bestScore(difficulty)
        ui.text(c, "BEST ON " + difficulty.label.uppercase(), cx, bestY, 12f * u, Palette.TEXT_DIM, face = ui.semi)
        if (best > 0) {
            ui.text(c, Format.number(best), cx, bestY + 28f * u, 30f * u, Palette.ACCENT)
        } else {
            ui.text(c, "no score yet", cx, bestY + 24f * u, 16f * u, Palette.TEXT_DIM, face = ui.semi)
        }

        drawButtons(c)
    }
}
