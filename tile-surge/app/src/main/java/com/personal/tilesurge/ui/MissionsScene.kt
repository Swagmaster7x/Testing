package com.personal.tilesurge.ui

import android.graphics.Canvas
import android.graphics.Paint
import com.personal.tilesurge.core.Puzzles
import com.personal.tilesurge.core.Stages

/** Today's three missions, the coins they pay, and the lifetime figures. */
class MissionsScene(app: App) : Scene(app) {

    private val day = Days.today()
    private val missions = Missions.forDay(day)
    internal val backButton = Button("") { app.go(TitleScene(app)) }.apply { icon = Icon.BACK }
    internal val claimButtons = (0 until 3).map { i -> Button("CLAIM", ButtonStyle.PRIMARY) { claim(i) } }
    private var titleY = 0f
    private var cardTop = 0f
    private var cardH = 0f
    private var statsY = 0f

    init {
        buttons += backButton
        buttons += claimButtons
        refresh()
    }

    private fun claim(i: Int) {
        if (app.prefs.claimMission(day, i) > 0) app.sound.play(Sfx.LEVEL)
        refresh()
    }

    private fun refresh() {
        for (i in 0 until 3) {
            val done = app.prefs.missionProgress(day, i) >= missions[i].target
            claimButtons[i].visible = done && !app.prefs.missionClaimed(day, i)
        }
    }

    override fun layout() {
        val top = safe.top + 12f * u
        backButton.set(colLeft + 12f * u, top, colLeft + 60f * u, top + 48f * u)
        titleY = top + 24f * u
        cardTop = safe.top + 92f * u
        cardH = 86f * u
        val r = colRight - 20f * u
        for (i in 0 until 3) {
            val t = cardTop + i * (cardH + 10f * u)
            claimButtons[i].set(r - 92f * u, t + 38f * u, r - 12f * u, t + 76f * u)
            claimButtons[i].textUnits = 13f
        }
        statsY = cardTop + 3 * (cardH + 10f * u) + 26f * u
    }

    override fun onBack(): Boolean {
        app.go(TitleScene(app))
        return true
    }

    override fun draw(c: Canvas) {
        ui.background(c, width, height)
        val cx = safe.centerX()
        val l = colLeft + 20f * u
        val r = colRight - 20f * u
        ui.text(c, "MISSIONS", cx, titleY, 26f * u, Palette.TEXT)
        ui.text(c, Format.number(app.prefs.coins) + " coins", r, titleY, 14f * u, Palette.ACCENT, Paint.Align.RIGHT)
        ui.text(c, "Three new ones every day.", cx, safe.top + 70f * u, 13f * u, Palette.TEXT_DIM, face = ui.semi)
        for (i in 0 until 3) {
            val m = missions[i]
            val t = cardTop + i * (cardH + 10f * u)
            ui.card(c, l, t, r, t + cardH, 14f * u)
            val p = app.prefs.missionProgress(day, i)
            val claimed = app.prefs.missionClaimed(day, i)
            ui.text(c, m.text, l + 14f * u, t + 20f * u, 15f * u, Palette.TEXT, Paint.Align.LEFT)
            ui.text(c, "+" + m.reward, r - 14f * u, t + 20f * u, 15f * u, Palette.ACCENT, Paint.Align.RIGHT)
            // how far along
            val barL = l + 14f * u
            val barR = if (claimButtons[i].visible) r - 104f * u else r - 14f * u
            val y = t + 54f * u
            ui.roundRect(c, barL, y, barR, y + 8f * u, 4f * u, Palette.PANEL_DARK)
            val f = p.toFloat() / m.target
            if (f > 0f) ui.roundRect(c, barL, y, barL + (barR - barL) * f, y + 8f * u, 4f * u, if (f >= 1f) Palette.GOOD else Palette.TEAL)
            val status = if (claimed) "done" else Format.number(p) + " of " + Format.number(m.target)
            ui.text(c, status, barL, t + 72f * u, 11f * u, Palette.TEXT_DIM, Paint.Align.LEFT, ui.semi)
        }
        // the lifetime figures
        ui.text(c, "SO FAR", cx, statsY, 12f * u, Palette.TEXT_DIM, face = ui.semi)
        val labels = arrayOf("GAMES", "TILES", "BLOCKERS", "BEST CHAIN", "BEST COMBO")
        val values = arrayOf(
            Format.number(app.prefs.stat("games")), Format.number(app.prefs.stat("tiles")), Format.number(app.prefs.stat("blocks")),
            "×" + maxOf(1, app.prefs.stat("best_chain")), app.prefs.stat("best_combo").toString(),
        )
        val w = (r - l) / labels.size
        for (i in labels.indices) {
            val x = l + w * (i + 0.5f)
            ui.text(c, values[i], x, statsY + 28f * u, ui.fitSize(values[i], 18f * u, w - 6f * u), Palette.TEXT)
            ui.text(c, labels[i], x, statsY + 48f * u, ui.fitSize(labels[i], 9f * u, w - 4f * u, ui.semi), Palette.TEXT_DIM, face = ui.semi)
        }
        // badges: things done once and kept
        val badgesY = statsY + 84f * u
        if (badgesY + 3 * 30f * u < safe.bottom) {
            ui.text(c, "BADGES", cx, badgesY, 12f * u, Palette.TEXT_DIM, face = ui.semi)
            val p = app.prefs
            val names = arrayOf("First chain", "×4 chain", "×6 chain", "1,000 tiles", "10,000 tiles", "50 blockers",
                "Beat the CPU", "All stages", "All puzzles")
            val earned = booleanArrayOf(
                p.stat("best_chain") >= 2, p.stat("best_chain") >= 4, p.stat("best_chain") >= 6,
                p.stat("tiles") >= 1000, p.stat("tiles") >= 10000, p.stat("blocks") >= 50,
                p.stat("wins") >= 1, p.stagesCleared >= Stages.COUNT, p.puzzlesSolved >= Puzzles.COUNT,
            )
            val gap = 6f * u
            val bw = (r - l - gap * 2) / 3f
            val bh = 24f * u
            for (i in names.indices) {
                val x = l + (i % 3) * (bw + gap)
                val y = badgesY + 16f * u + (i / 3) * (bh + gap)
                if (earned[i]) {
                    ui.roundRect(c, x, y, x + bw, y + bh, bh / 2f, Palette.ACCENT)
                } else {
                    ui.roundRectLine(c, x, y, x + bw, y + bh, bh / 2f, Palette.OUTLINE, 1.2f * u)
                }
                ui.text(c, names[i], x + bw / 2f, y + bh / 2f, ui.fitSize(names[i], 11f * u, bw - 12f * u, ui.semi),
                    if (earned[i]) Palette.TEXT_DARK else Palette.TEXT_DIM, face = ui.semi)
            }
        }
        drawButtons(c)
    }
}
