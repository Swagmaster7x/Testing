package com.personal.tilesurge.ui

import android.graphics.Canvas
import com.personal.tilesurge.core.Game

/** How to play, a page at a time. Each page has a small board that plays the idea out. */
class HowToScene(app: App) : Scene(app) {

    private class Page(val title: String, val text: String, val demo: Demo)

    private val pages = listOf(
        Page(
            "SLIDE",
            "Put a finger on a tile and slide it left or right. It trades places with its neighbour, one cell at a time.\n" +
                "Tiles only move sideways. Push one over a drop and it falls.",
            Demos.slide(),
        ),
        Page(
            "MATCH THREE",
            "Line up three or more of the same tile, across or down, and they clear.\n" +
                "Whatever was resting on them drops into the gap.",
            Demos.match(),
        ),
        Page(
            "COMBOS AND CHAINS",
            "Four or more at once is a combo. When tiles drop into a new match, that is a chain, and a chain can keep going.\n" +
                "Both score extra and hold the stack still for a moment.",
            Demos.chain(),
        ),
        Page(
            "THE STACK RISES",
            "New rows keep pushing up from below. Hold RAISE to bring them faster; a quick tap brings exactly one row.\n" +
                "If the stack reaches the top and stays there, the game is over.",
            Demos.rise(),
        ),
        Page(
            "TWO WAYS TO PLAY",
            "STAGE CLEAR: a line comes up from below. Clear every tile above it to win the stage.\n" +
                "INFINITE: no line and no end. The stack speeds up as you clear.",
            Demos.line(),
        ),
    )

    private var index = 0
    private var clock = 0
    private val board = BoardRenderer(ui, app.art)

    internal val backButton = Button("") { app.go(TitleScene(app)) }.apply { icon = Icon.BACK }
    internal val prevButton = Button("BACK") { turn(-1) }
    internal val nextButton = Button("NEXT", ButtonStyle.PRIMARY) { turn(1) }

    private var titleY = 0f
    private var textTop = 0f
    private var dotsY = 0f

    init {
        buttons += listOf(backButton, prevButton, nextButton)
        refresh()
    }

    private val page: Page get() = pages[index]

    private fun turn(by: Int) {
        if (index + by >= pages.size) {
            app.go(TitleScene(app))
            return
        }
        index = (index + by).coerceIn(0, pages.size - 1)
        page.demo.restart()
        refresh()
        if (width > 0f) layout()
    }

    private fun refresh() {
        prevButton.enabled = index > 0
        nextButton.label = if (index == pages.size - 1) "GOT IT" else "NEXT"
    }

    override fun layout() {
        val top = safe.top + 12f * u
        backButton.set(colLeft + 12f * u, top, colLeft + 60f * u, top + 48f * u)
        titleY = top + 24f * u

        val bh = 56f * u
        val by = safe.bottom - 26f * u - bh
        val l = colLeft + 24f * u
        val r = colRight - 24f * u
        val mid = (l + r) / 2f
        prevButton.set(l, by, mid - 6f * u, by + bh)
        nextButton.set(mid + 6f * u, by, r, by + bh)
        dotsY = by - 20f * u

        val rows = page.demo.rows
        val areaTop = safe.top + 96f * u
        val areaBottom = dotsY - 22f * u
        val textRoom = 170f * u
        val raiseRoom = if (page.demo.showsRaise) 52f * u else 0f
        val cell = minOf(50f * u, (areaBottom - areaTop - textRoom - raiseRoom) / rows, (colRight - colLeft - 48f * u) / Game.COLS)
            .toInt().toFloat()
        val block = cell * rows + raiseRoom + textRoom
        val boardTop = areaTop + maxOf(0f, (areaBottom - areaTop - block) * 0.4f)
        board.place(safe.centerX() - cell * Game.COLS / 2f, boardTop, cell, rows)
        textTop = board.bottom + raiseRoom + 40f * u
    }

    override fun onBack(): Boolean {
        if (index > 0) turn(-1) else app.go(TitleScene(app))
        return true
    }

    override fun tick() {
        clock++
        page.demo.tick()
    }

    override fun draw(c: Canvas) {
        ui.background(c, width, height)
        val cx = safe.centerX()
        ui.text(c, "HOW TO PLAY", cx, titleY, 22f * u, Palette.TEXT)
        ui.text(c, page.title, cx, safe.top + 68f * u, 15f * u, Palette.ACCENT)

        val demo = page.demo
        val g = demo.game
        board.draw(c, g, clock)

        // the pretend raise button under the board
        if (demo.showsRaise) {
            val t = board.bottom + 14f * u
            val held = g.raiseHeld
            val lip = 4f * u
            val down = if (held) lip else 0f
            ui.roundRect(c, board.left, t + lip, board.right, t + 38f * u, 12f * u, Palette.ACCENT_DARK)
            ui.roundRect(c, board.left, t + down, board.right, t + 38f * u - lip + down, 12f * u, if (held) Palette.ACCENT_LIGHT else Palette.ACCENT)
            ui.text(c, "RAISE", cx, t + down + 17f * u, 15f * u, Palette.TEXT_DARK)
            if (held) fingertip(c, cx + 46f * u, t + 22f * u)
        }

        // a fingertip on the tile being moved
        val at = g.locate(g.grabbedId)
        if (at >= 0) {
            val row = at / Game.COLS
            val col = at % Game.COLS
            val t = g.grid[row][col]
            val slide = -t.swapDir * board.cell * (t.timer.toFloat() / Game.SWAP_FRAMES)
            fingertip(c, board.cellLeft(col) + board.cell * 0.62f + slide, board.cellTop(g, row) + board.cell * 0.66f)
        }

        if (demo.captionAge < Demo.CAPTION_FRAMES) {
            val t = demo.captionAge.toFloat() / Demo.CAPTION_FRAMES
            val a = if (t > 0.75f) (1f - t) / 0.25f else 1f
            val y = board.top + board.height * 0.3f - 16f * u * t
            val size = 17f * u
            val w = ui.textWidth(demo.caption, size) + 26f * u
            ui.roundRect(c, cx - w / 2f, y - 16f * u, cx + w / 2f, y + 16f * u, 16f * u, Palette.withAlpha(Palette.TEAL, a))
            ui.text(c, demo.caption, cx, y, size, Palette.withAlpha(0xFF06272A.toInt(), a))
        }

        ui.paragraph(c, page.text, cx, textTop, colRight - colLeft - 48f * u, 15f * u, Palette.TEXT)

        // which page this is
        val gap = 14f * u
        var x = cx - gap * (pages.size - 1) / 2f
        for (i in pages.indices) {
            ui.fill.shader = null
            ui.fill.color = if (i == index) Palette.ACCENT else Palette.PANEL_LIGHT
            c.drawCircle(x, dotsY, if (i == index) 4.5f * u else 3.5f * u, ui.fill)
            x += gap
        }
        drawButtons(c)
    }

    private fun fingertip(c: Canvas, x: Float, y: Float) {
        ui.fill.shader = null
        ui.fill.color = 0x66FFFFFF
        c.drawCircle(x, y, 13f * u, ui.fill)
        ui.line.pathEffect = null
        ui.line.color = 0xE6FFFFFF.toInt()
        ui.line.strokeWidth = 2.2f * u
        c.drawCircle(x, y, 13f * u, ui.line)
    }
}
