package com.personal.tilesurge.ui

import android.graphics.Canvas
import android.graphics.Paint

/** Tile sets and backdrops, bought with the coins missions pay. */
class ShopScene(app: App) : Scene(app) {

    internal val backButton = Button("") { app.go(TitleScene(app)) }.apply { icon = Icon.BACK }
    internal val themeButtons = TileArt.THEME_NAMES.indices.map { i -> Button(TileArt.THEME_NAMES[i]) { pickTheme(i) } }
    internal val backdropButtons = Palette.BACKDROP_NAMES.indices.map { i -> Button(Palette.BACKDROP_NAMES[i]) { pickBackdrop(i) } }
    private var titleY = 0f
    private var themesY = 0f
    private var backdropsY = 0f
    private var sorry = 0

    init {
        buttons += backButton
        buttons += themeButtons
        buttons += backdropButtons
        refresh()
    }

    private fun pickTheme(i: Int) {
        if (app.prefs.chooseTheme(i)) bought() else sorry = 90
        refresh()
    }

    private fun pickBackdrop(i: Int) {
        if (app.prefs.chooseBackdrop(i)) bought() else sorry = 90
        refresh()
    }

    private fun bought() {
        app.applyLooks()
        sorry = 0
    }

    private fun refresh() {
        for ((i, b) in themeButtons.withIndex()) {
            b.style = if (app.prefs.tileTheme == i) ButtonStyle.SELECTED else ButtonStyle.PLAIN
            b.note = when {
                app.prefs.tileTheme == i -> "in use"
                app.prefs.ownsTheme(i) -> "yours"
                else -> "${Missions.THEME_PRICES[i]} coins"
            }
        }
        for ((i, b) in backdropButtons.withIndex()) {
            b.style = if (app.prefs.backdrop == i) ButtonStyle.SELECTED else ButtonStyle.PLAIN
            b.note = when {
                app.prefs.backdrop == i -> "in use"
                app.prefs.ownsBackdrop(i) -> "yours"
                else -> "${Missions.BACKDROP_PRICES[i]} coins"
            }
        }
    }

    override fun layout() {
        val top = safe.top + 12f * u
        backButton.set(colLeft + 12f * u, top, colLeft + 60f * u, top + 48f * u)
        titleY = top + 24f * u
        val l = colLeft + 20f * u
        val r = colRight - 20f * u
        val gap = 10f * u
        val cols = 3
        val w = (r - l - gap * (cols - 1)) / cols
        val h = 58f * u
        themesY = safe.top + 86f * u
        for ((i, b) in themeButtons.withIndex()) {
            val x = l + (i % cols) * (w + gap)
            val y = themesY + 62f * u + (i / cols) * (h + gap)
            b.set(x, y, x + w, y + h)
            b.textUnits = 14f
        }
        backdropsY = themesY + 62f * u + 2 * (h + gap) + 26f * u
        for ((i, b) in backdropButtons.withIndex()) {
            val x = l + (i % cols) * (w + gap)
            val y = backdropsY + 20f * u + (i / cols) * (h + gap)
            b.set(x, y, x + w, y + h)
            b.textUnits = 14f
        }
    }

    override fun tick() {
        if (sorry > 0) sorry--
    }

    override fun onBack(): Boolean {
        app.go(TitleScene(app))
        return true
    }

    override fun draw(c: Canvas) {
        ui.background(c, width, height)
        val cx = safe.centerX()
        ui.text(c, "SHOP", cx, titleY, 26f * u, Palette.TEXT)
        ui.text(c, Format.number(app.prefs.coins) + " coins", colRight - 20f * u, titleY, 14f * u, Palette.ACCENT, Paint.Align.RIGHT)
        ui.text(c, "TILES", cx, themesY, 12f * u, Palette.TEXT_DIM, face = ui.semi)
        // the six tiles as they look now
        val size = 34f * u
        var x = cx - (size * 6 + 5 * 4f * u) / 2f
        for (k in 1..TileArt.KINDS) {
            app.art.paintTile(c, k, x, themesY + 14f * u, size)
            x += size + 4f * u
        }
        ui.text(c, "BACKDROPS", cx, backdropsY, 12f * u, Palette.TEXT_DIM, face = ui.semi)
        if (sorry > 0) {
            ui.text(c, "Not enough coins yet. Missions pay them.", cx, safe.bottom - 40f * u, 13f * u,
                Palette.withAlpha(Palette.DANGER, minOf(1f, sorry / 20f)), face = ui.semi)
        }
        drawButtons(c)
    }
}
