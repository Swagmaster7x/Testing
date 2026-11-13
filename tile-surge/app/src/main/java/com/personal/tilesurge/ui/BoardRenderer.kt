package com.personal.tilesurge.ui

import android.graphics.Canvas
import android.graphics.ColorFilter
import com.personal.tilesurge.core.Game
import com.personal.tilesurge.core.Phase
import com.personal.tilesurge.core.Tile
import com.personal.tilesurge.core.TileState
import kotlin.math.PI
import kotlin.math.exp
import kotlin.math.floor
import kotlin.math.sin

/** Draws the well and its tiles, and converts between screen points and cells. */
class BoardRenderer(private val ui: Ui, private val art: TileArt) {

    /** Top-left corner of the well and the size of one cell, in pixels. Set by the screen's layout. */
    var left = 0f
    var top = 0f
    var cell = 1f

    /** How many rows of the well are shown. The how-to-play pictures show only the bottom few. */
    var rows = Game.ROWS

    val width: Float get() = cell * Game.COLS
    val height: Float get() = cell * rows
    val right: Float get() = left + width
    val bottom: Float get() = top + height

    fun place(left: Float, top: Float, cell: Float, rows: Int = Game.ROWS) {
        this.left = left
        this.top = top
        this.cell = cell
        this.rows = rows
        art.prepare(cell.toInt())
    }

    private fun lift(g: Game): Float = g.riseFraction * cell

    fun cellLeft(col: Int): Float = left + col * cell

    /** The top edge of [row] on screen, allowing for how far the stack has risen. */
    fun cellTop(g: Game, row: Int): Float = bottom - (row + 1) * cell - lift(g)

    fun colAt(x: Float): Int = floor((x - left) / cell).toInt()

    /** The row under screen height [y], as a fraction: 2.25 is a quarter of the way up row 2. */
    fun rowAt(g: Game, y: Float): Float = (bottom - lift(g) - y) / cell

    /**
     * @param clock a frame counter that drives the flashing and wobbling
     * @param greyRows how many rows, counted from the top, are drawn grey (the game-over sweep)
     * @param alarm 0..1, how red the frame is
     */
    fun draw(c: Canvas, g: Game, clock: Int, greyRows: Int = 0, alarm: Float = 0f) {
        val u = ui.unit
        val pad = 4f * u
        val radius = 10f * u
        ui.roundRect(c, left - pad, top - pad, right + pad, bottom + pad, radius, Palette.WELL)
        ui.line.color = Palette.WELL_LINE
        ui.line.strokeWidth = u
        ui.line.pathEffect = null
        for (col in 1 until Game.COLS) {
            val x = cellLeft(col)
            c.drawLine(x, top, x, bottom, ui.line)
        }

        c.save()
        c.clipRect(left, top, right, bottom)
        val lift = lift(g)

        // the row on its way up: dark, until it is fully in
        if (lift > 0.5f) {
            val y = bottom - lift
            for (col in 0 until Game.COLS) art.stamp(c, g.incoming[col], cellLeft(col), y, cell, cell, TileArt.DIM)
        }

        val playing = g.phase == Phase.PLAYING
        var heldRow = -1
        var heldCol = -1
        for (col in 0 until Game.COLS) {
            val tall = playing && g.columnHeight(col) >= Game.DANGER_HEIGHT
            for (r in 0 until minOf(rows + 1, Game.ROWS)) {
                val t = g.grid[r][col]
                if (t.kind == 0 || t.state == TileState.POPPED) continue
                if (t.id == g.grabbedId) {
                    heldRow = r
                    heldCol = col
                    continue
                }
                drawTile(c, g, t, r, col, clock, r >= Game.ROWS - greyRows, tall, false)
            }
        }

        if (g.lineRow != Game.NO_LINE) drawClearLine(c, g, clock)

        c.restore()

        val frame = Palette.mix(Palette.OUTLINE, Palette.DANGER, alarm)
        ui.roundRectLine(c, left - pad, top - pad, right + pad, bottom + pad, radius, frame, (2f + 1.5f * alarm) * u)

        // the tile under the finger goes on top of everything, standing a little proud of the well
        if (heldRow >= 0) {
            val t = g.grid[heldRow][heldCol]
            drawTile(c, g, t, heldRow, heldCol, clock, false, false, true)
        }
    }

    private fun drawTile(c: Canvas, g: Game, t: Tile, r: Int, col: Int, clock: Int, grey: Boolean, tall: Boolean, held: Boolean) {
        var x = cellLeft(col)
        var y = cellTop(g, r)
        var w = cell
        var h = cell
        var filter: ColorFilter? = null
        when (t.state) {
            TileState.SWAPPING -> x -= t.swapDir * cell * (t.timer.toFloat() / Game.SWAP_FRAMES)
            TileState.LANDING -> {
                // a quick squash and rebound
                val p = 1f - t.timer.toFloat() / Game.LAND_FRAMES
                val squash = 0.24f * exp(-3.2f * p) * sin(p * PI.toFloat() * 2.2f)
                h = cell * (1f - squash)
                w = cell * (1f + squash * 0.5f)
                x -= (w - cell) / 2f
                y += cell - h
            }
            TileState.MATCHED -> {
                filter = if (t.timer > g.difficulty.faceFrames) {
                    if ((clock / 2) % 2 == 0) TileArt.FLASH else null
                } else {
                    TileArt.LIT
                }
            }
            TileState.POPPING -> {
                filter = TileArt.LIT
                val s = 1f + 0.05f * sin(clock * 0.55f + t.comboIndex)
                w = cell * s
                h = cell * s
                x -= (w - cell) / 2f
                y -= (h - cell) / 2f
            }
            else -> if (tall && !held) {
                // columns near the top shiver
                val s = 1f - 0.05f * (0.5f + 0.5f * sin(clock * 0.42f + r * 0.9f))
                w = cell * s
                h = cell * s
                x += (cell - w) / 2f
                y += cell - h
            }
        }
        if (grey) filter = TileArt.GREY
        if (held) {
            val grow = cell * 0.05f
            art.stamp(c, t.kind, x - grow, y - grow, w + 2 * grow, h + 2 * grow, filter)
            val glow = 0.75f + 0.25f * sin(clock * 0.3f)
            ui.roundRectLine(c, x - grow, y - grow, x + w + grow, y + h + grow, cell * 0.23f,
                Palette.withAlpha(0xFFFFFFFF.toInt(), glow), cell * 0.06f)
        } else {
            art.stamp(c, t.kind, x, y, w, h, filter)
        }
    }

    /** Stage Clear: the line everything has to be cleared above. */
    private fun drawClearLine(c: Canvas, g: Game, clock: Int) {
        val u = ui.unit
        val y = bottom - g.lineRow * cell - lift(g)
        if (y < top - 4f * u || y > bottom + 4f * u) return
        val pulse = 0.6f + 0.4f * sin(clock * 0.12f)
        // everything below the line is done with: shade it a little
        ui.fill.shader = null
        ui.fill.color = 0x2A050412
        c.drawRect(left, y, right, bottom, ui.fill)
        ui.line.pathEffect = null
        ui.line.color = Palette.withAlpha(Palette.ACCENT, 0.30f * pulse)
        ui.line.strokeWidth = 9f * u
        c.drawLine(left, y, right, y, ui.line)
        ui.line.color = Palette.ACCENT_LIGHT
        ui.line.strokeWidth = 3f * u
        c.drawLine(left, y, right, y, ui.line)
        // little arrows along the line, pointing at what has to go
        ui.fill.color = Palette.ACCENT_LIGHT
        val step = cell
        var x = left + step / 2f
        while (x < right) {
            ui.path.rewind()
            ui.path.moveTo(x - 5f * u, y - 3f * u)
            ui.path.lineTo(x, y - 10f * u)
            ui.path.lineTo(x + 5f * u, y - 3f * u)
            ui.path.close()
            c.drawPath(ui.path, ui.fill)
            x += step
        }
    }
}
