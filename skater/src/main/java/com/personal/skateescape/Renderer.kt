package com.personal.skateescape

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Path
import android.graphics.RectF
import android.graphics.Shader
import android.graphics.Typeface
import com.personal.skateescape.game.Air
import com.personal.skateescape.game.Entity
import com.personal.skateescape.game.Kind
import com.personal.skateescape.game.Phase
import com.personal.skateescape.game.Power
import com.personal.skateescape.game.Shape
import com.personal.skateescape.game.World
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.floor
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sin

/**
 * Draws the whole game with plain Canvas calls: a simple perspective camera behind the skater,
 * and every object built from a few flat-shaded shapes. There are no image files.
 */
class Renderer {
    private val p = Paint(Paint.ANTI_ALIAS_FLAG)
    private val text = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        typeface = Typeface.create(Typeface.DEFAULT_BOLD, Typeface.BOLD_ITALIC)
        textAlign = Paint.Align.CENTER
    }
    private val path = Path()
    private val rect = RectF()
    private var sky: Shader? = null
    private var shade: Shader? = null

    private var w = 1f
    private var h = 1f
    private var u = 1f          // 1% of the screen width
    private var f = 1f          // focal length in pixels
    private var hz = 1f         // screen y of the horizon
    private var camX = 0f
    private var camY = 0f
    private var camZ = 0f

    // Result of the last project() call.
    private var px = 0f
    private var py = 0f
    private var ps = 0f

    /** Top-right button: pause while playing, sound on/off on the title screen. */
    val cornerButton = RectF()
    var soundOn = true

    private val byDepth = Comparator<Entity> { a, b -> b.z.compareTo(a.z) }

    fun resize(width: Int, height: Int) {
        w = width.toFloat(); h = height.toFloat()
        u = w / 100f
        f = w * 0.85f
        hz = h * 0.36f
        sky = LinearGradient(0f, 0f, 0f, hz, intArrayOf(SKY_TOP, SKY_MID, SKY_LOW), floatArrayOf(0f, 0.6f, 1f), Shader.TileMode.CLAMP)
        shade = LinearGradient(0f, 0f, 0f, h, intArrayOf(0xCC101428.toInt(), 0x33101428, 0xDD101428.toInt()), floatArrayOf(0f, 0.45f, 1f), Shader.TileMode.CLAMP)
        val b = u * 13f
        cornerButton.set(w - b - u * 3f, u * 9f, w - u * 3f, u * 9f + b)
    }

    private fun project(x: Float, y: Float, z: Float) {
        val d = max(z - camZ, NEAR)
        ps = f / d
        px = w / 2f + (x - camX) * ps
        py = hz + (camY - y) * ps
    }

    // ---- Frame ----

    fun draw(c: Canvas, g: World, stroke: FloatArray, strokeCount: Int) {
        camX = g.x * 0.55f
        camY = 4.6f + g.y * 0.5f
        camZ = g.distance - CAM_BACK

        drawSky(c, g)
        drawGround(c)
        drawScenery(c)

        g.entities.sortWith(byDepth)
        var playerDrawn = false
        for (e in g.entities) {
            if (!playerDrawn && e.z < g.distance) {
                drawSkaterInWorld(c, g)
                playerDrawn = true
            }
            // Skip anything whose near edge has reached the camera, or that is too far to matter.
            val nearEdge = when (e.kind) {
                Kind.CAR -> e.z - World.CAR_HALF_LEN
                Kind.MANHOLE -> e.z - 0.7f
                else -> e.z
            }
            if (nearEdge - camZ < 0.7f || e.z - camZ > 190f) continue
            when (e.kind) {
                Kind.CAR -> drawCar(c, e)
                Kind.MANHOLE -> drawManhole(c, e)
                Kind.RAMP -> drawRamp(c, e)
                Kind.COIN -> drawCoin(c, e, g.time)
                Kind.POWER -> drawPower(c, e, g.time)
            }
        }
        if (!playerDrawn) drawSkaterInWorld(c, g)
        if (g.phase != Phase.TITLE) drawCyclistInWorld(c, g)

        if (g.turboT > 0f && g.phase == Phase.RUNNING) drawSpeedLines(c, g.time)
        if (g.phase == Phase.RUNNING && g.gap < World.DANGER_GAP) drawDanger(c, g)

        when (g.phase) {
            Phase.TITLE -> drawTitle(c, g)
            Phase.RUNNING, Phase.CAUGHT -> {
                drawHud(c, g)
                if (g.trickWindow) drawTrickPrompt(c, g)
                drawStroke(c, stroke, strokeCount)
                drawPopups(c, g)
                if (g.paused) drawPaused(c)
            }
            Phase.OVER -> drawGameOver(c, g)
        }
    }

    // ---- World ----

    private fun drawSky(c: Canvas, g: World) {
        p.style = Paint.Style.FILL
        p.shader = sky
        c.drawRect(0f, 0f, w, hz + 2f, p)
        p.shader = null
        // Sun.
        p.color = 0x55FFF3B0
        c.drawCircle(w * 0.78f, hz * 0.34f, u * 13f, p)
        p.color = 0xFFFFF6C8.toInt()
        c.drawCircle(w * 0.78f, hz * 0.34f, u * 8f, p)
        // Clouds drift slowly.
        p.color = 0xE6FFFFFF.toInt()
        for (i in 0 until 4) {
            val span = w + u * 60f
            val cx = ((i * 37f * u + g.time * u * (0.6f + i * 0.2f)) % span) - u * 30f
            val cy = hz * (0.2f + 0.16f * ((i * 7) % 4))
            val s = u * (5f + (i % 3) * 1.5f)
            c.drawCircle(cx, cy, s, p)
            c.drawCircle(cx + s * 1.1f, cy + s * 0.2f, s * 0.8f, p)
            c.drawCircle(cx - s * 1.1f, cy + s * 0.25f, s * 0.7f, p)
            rect.set(cx - s * 1.8f, cy + s * 0.1f, cx + s * 1.9f, cy + s * 0.95f)
            c.drawRoundRect(rect, s * 0.5f, s * 0.5f, p)
        }
        // Far hills, which shift a little as the skater changes lanes.
        val shift = -camX * u * 0.8f
        p.color = HILL_FAR
        path.reset()
        path.moveTo(0f, hz + 2f)
        var xx = 0f
        while (xx <= w + u * 4f) {
            val a = (xx + shift) / w
            path.lineTo(xx, hz - u * (5f + 3.2f * sin(a * 5.1f + 1f) + 1.8f * sin(a * 11.3f)))
            xx += u * 4f
        }
        path.lineTo(w, hz + 2f)
        path.close()
        c.drawPath(path, p)
        p.color = HILL_NEAR
        path.reset()
        path.moveTo(0f, hz + 2f)
        xx = 0f
        while (xx <= w + u * 3f) {
            val a = (xx + shift * 1.6f) / w
            path.lineTo(xx, hz - u * (2.2f + 1.3f * sin(a * 9.7f + 2f) + 0.9f * sin(a * 23f)))
            xx += u * 3f
        }
        path.lineTo(w, hz + 2f)
        path.close()
        c.drawPath(path, p)
    }

    private fun drawGround(c: Canvas) {
        p.style = Paint.Style.FILL
        p.color = LAWN
        c.drawRect(0f, hz, w, h, p)
        val far = camZ + 1500f
        val near = camZ + NEAR
        // Mown stripes on the lawns give a sense of speed.
        var k = floor(camZ / 12f).toInt()
        val kEnd = k + 22
        while (k <= kEnd) {
            if (k % 2 == 0) ground(c, LAWN_DARK, -90f, 90f, k * 12f, k * 12f + 12f)
            k++
        }
        ground(c, SIDEWALK, -5.7f, 5.7f, near, far)
        ground(c, KERB, -3.9f, 3.9f, near, far)
        ground(c, ROAD, -ROAD_HALF, ROAD_HALF, near, far)
        // Paving joints.
        k = floor(camZ / 3.5f).toInt()
        val jEnd = k + 22
        while (k <= jEnd) {
            val z = k * 3.5f
            ground(c, SIDEWALK_JOINT, -5.7f, -3.9f, z, z + 0.09f)
            ground(c, SIDEWALK_JOINT, 3.9f, 5.7f, z, z + 0.09f)
            k++
        }
        // Lane markings.
        k = floor(camZ / 7f).toInt()
        val dEnd = k + 30
        while (k <= dEnd) {
            val z = k * 7f
            ground(c, LANE_MARK, -1.27f, -1.13f, z, z + 3f)
            ground(c, LANE_MARK, 1.13f, 1.27f, z, z + 3f)
            k++
        }
        // Haze where the road meets the sky.
        p.color = 0x66DFF1FF
        c.drawRect(0f, hz - u * 0.3f, w, hz + u * 1.4f, p)
    }

    private fun drawScenery(c: Canvas) {
        val first = floor((camZ + 2f) / LOT).toInt()
        var k = first + 13
        while (k >= first) {
            drawLot(c, k, -1f)
            drawLot(c, k, 1f)
            k--
        }
    }

    private fun drawLot(c: Canvas, k: Int, s: Float) {
        val z = k * LOT
        val seed = hash(k, if (s < 0) 1 else 2)
        val xi = 9.5f * s
        val xo = 17.5f * s
        if (seed % 10 < 7) {
            val z0 = z + 3f
            val z1 = z + 13f
            val wallH = 3.2f + (seed / 16 % 3) * 0.35f
            val wall = WALLS[seed / 7 % WALLS.size]
            val roof = ROOFS[seed / 11 % ROOFS.size]
            val xm = (xi + xo) / 2f
            val peak = wallH + 2.3f
            // Driveway and front path.
            ground(c, DRIVE, min(5.7f * s, xi), max(5.7f * s, xi), z0 + 0.5f, z0 + 3.7f)
            ground(c, PATHWAY, min(5.7f * s, xi), max(5.7f * s, xi), z0 + 6.4f, z0 + 7.6f)
            // Wall facing the camera, with its gable.
            quad(c, darken(wall, 0.82f), xi, 0f, z0, xo, 0f, z0, xo, wallH, z0, xi, wallH, z0)
            tri(c, darken(wall, 0.82f), xi, wallH, z0, xo, wallH, z0, xm, peak, z0)
            quad(c, WINDOW, xm - 1.2f, 1.2f, z0, xm + 1.2f, 1.2f, z0, xm + 1.2f, 2.4f, z0, xm - 1.2f, 2.4f, z0)
            // Wall facing the street.
            quad(c, wall, xi, 0f, z0, xi, 0f, z1, xi, wallH, z1, xi, wallH, z0)
            quad(c, GARAGE, xi, 0f, z0 + 0.5f, xi, 0f, z0 + 3.7f, xi, 2.4f, z0 + 3.7f, xi, 2.4f, z0 + 0.5f)
            quad(c, DOORS[seed / 5 % DOORS.size], xi, 0f, z0 + 6.4f, xi, 0f, z0 + 7.6f, xi, 2.2f, z0 + 7.6f, xi, 2.2f, z0 + 6.4f)
            quad(c, Color.WHITE, xi, 1.05f, z0 + 4.25f, xi, 1.05f, z0 + 5.75f, xi, 2.35f, z0 + 5.75f, xi, 2.35f, z0 + 4.25f)
            quad(c, WINDOW, xi, 1.15f, z0 + 4.35f, xi, 1.15f, z0 + 5.65f, xi, 2.25f, z0 + 5.65f, xi, 2.25f, z0 + 4.35f)
            quad(c, Color.WHITE, xi, 1.05f, z0 + 8.15f, xi, 1.05f, z0 + 9.65f, xi, 2.35f, z0 + 9.65f, xi, 2.35f, z0 + 8.15f)
            quad(c, WINDOW, xi, 1.15f, z0 + 8.25f, xi, 1.15f, z0 + 9.55f, xi, 2.25f, z0 + 9.55f, xi, 2.25f, z0 + 8.25f)
            // Roof slope facing the street.
            val eave = xi - 0.5f * s
            quad(c, roof, eave, wallH - 0.15f, z0 - 0.4f, xm, peak, z0 - 0.4f, xm, peak, z1 + 0.4f, eave, wallH - 0.15f, z1 + 0.4f)
            // Mailbox.
            project(6.2f * s, 0f, z + 9.6f)
            if (ps < f / 1.5f) {
                p.color = 0xFF6B4A2B.toInt()
                c.drawRect(px - 0.05f * ps, py - 1.0f * ps, px + 0.05f * ps, py, p)
                p.color = if (seed % 2 == 0) 0xFFD94B3D.toInt() else 0xFF3D6FD9.toInt()
                rect.set(px - 0.22f * ps, py - 1.3f * ps, px + 0.22f * ps, py - 0.95f * ps)
                c.drawRoundRect(rect, 0.08f * ps, 0.08f * ps, p)
            }
        } else {
            // A little park lot: hedge and extra trees.
            val a = min(xi, xo); val b = max(xi, xo)
            box(c, a, b, 0f, 1.1f, z + 4f, z + 5f, HEDGE_TOP, HEDGE, darken(HEDGE, 0.85f))
            tree(c, 12f * s, z + 9f, 1.5f, seed)
            tree(c, 15.5f * s, z + 12f, 1.25f, seed / 3)
        }
        tree(c, 7.4f * s, z + 14.6f, 1f + (seed / 13 % 3) * 0.12f, seed / 2)
        if (k % 3 == 0) lamp(c, 4.35f * s, z + 1f, s)
    }

    private fun tree(c: Canvas, x: Float, z: Float, scale: Float, seed: Int) {
        project(x, 0f, z)
        if (z - camZ < 1.5f) return
        val s = ps * scale
        p.color = TRUNK
        c.drawRect(px - 0.18f * s, py - 2.1f * s, px + 0.18f * s, py, p)
        val leaf = LEAVES[abs(seed) % LEAVES.size]
        p.color = darken(leaf, 0.82f)
        c.drawCircle(px - 0.75f * s, py - 2.7f * s, 1.15f * s, p)
        c.drawCircle(px + 0.8f * s, py - 2.8f * s, 1.2f * s, p)
        p.color = leaf
        c.drawCircle(px, py - 3.5f * s, 1.45f * s, p)
        p.color = lighten(leaf, 0.18f)
        c.drawCircle(px - 0.35f * s, py - 3.9f * s, 0.75f * s, p)
    }

    private fun lamp(c: Canvas, x: Float, z: Float, s: Float) {
        if (z - camZ < 1.5f) return
        project(x, 0f, z)
        p.color = 0xFF4A5560.toInt()
        c.drawRect(px - 0.07f * ps, py - 5.2f * ps, px + 0.07f * ps, py, p)
        c.drawRect(min(px, px - s * 1.3f * ps), py - 5.3f * ps, max(px, px - s * 1.3f * ps), py - 5.15f * ps, p)
        p.color = 0xFFFFF2B8.toInt()
        rect.set(px - s * 1.3f * ps - 0.3f * ps, py - 5.2f * ps, px - s * 1.3f * ps + 0.3f * ps, py - 4.95f * ps)
        c.drawRoundRect(rect, 0.1f * ps, 0.1f * ps, p)
    }

    private fun drawCar(c: Canvas, e: Entity) {
        val cx = World.laneX(e.lane)
        val zf = e.z - World.CAR_HALF_LEN
        val zb = e.z + World.CAR_HALF_LEN
        val base = CARS[e.variant % CARS.size]
        val van = e.variant % 3 == 2
        ground(c, SHADOW, cx - 1.08f, cx + 1.08f, zf - 0.25f, zb + 0.1f)
        // Wheels.
        quad(c, TYRE, cx - 0.98f, 0f, zf + 0.3f, cx - 0.62f, 0f, zf + 0.3f, cx - 0.62f, 0.5f, zf + 0.3f, cx - 0.98f, 0.5f, zf + 0.3f)
        quad(c, TYRE, cx + 0.62f, 0f, zf + 0.3f, cx + 0.98f, 0f, zf + 0.3f, cx + 0.98f, 0.5f, zf + 0.3f, cx + 0.62f, 0.5f, zf + 0.3f)
        box(c, cx - 0.93f, cx + 0.93f, 0.22f, 0.92f, zf, zb, lighten(base, 0.12f), base, darken(base, 0.72f))
        val cabTop = if (van) 1.8f else 1.45f
        val cz0 = zf + (if (van) 0.9f else 1.3f)
        val cz1 = zb - (if (van) 0.1f else 0.5f)
        box(c, cx - 0.8f, cx + 0.8f, 0.92f, cabTop, cz0, cz1, lighten(base, 0.2f), GLASS, darken(base, 0.6f))
        // Front details.
        quad(c, 0xFF2B2F36.toInt(), cx - 0.93f, 0.22f, zf, cx + 0.93f, 0.22f, zf, cx + 0.93f, 0.38f, zf, cx - 0.93f, 0.38f, zf)
        quad(c, 0xFF1C1F24.toInt(), cx - 0.42f, 0.46f, zf, cx + 0.42f, 0.46f, zf, cx + 0.42f, 0.7f, zf, cx - 0.42f, 0.7f, zf)
        quad(c, HEADLIGHT, cx - 0.86f, 0.52f, zf, cx - 0.52f, 0.52f, zf, cx - 0.52f, 0.76f, zf, cx - 0.86f, 0.76f, zf)
        quad(c, HEADLIGHT, cx + 0.52f, 0.52f, zf, cx + 0.86f, 0.52f, zf, cx + 0.86f, 0.76f, zf, cx + 0.52f, 0.76f, zf)
        // Shine on the windscreen.
        quad(c, 0x55FFFFFF, cx - 0.7f, 1f, cz0, cx - 0.25f, 1f, cz0, cx - 0.05f, cabTop - 0.08f, cz0, cx - 0.5f, cabTop - 0.08f, cz0)
    }

    private fun drawManhole(c: Canvas, e: Entity) {
        val cx = World.laneX(e.lane)
        project(cx, 0f, e.z - 0.62f)
        val yNear = py
        project(cx, 0f, e.z + 0.62f)
        val yFar = py
        project(cx, 0f, e.z)
        val rx = 0.62f * ps
        val ry = (yNear - yFar) / 2f
        val cy = (yNear + yFar) / 2f
        p.style = Paint.Style.FILL
        p.color = 0xFFFFB020.toInt()
        c.drawOval(px - rx * 1.5f, cy - ry * 1.5f, px + rx * 1.5f, cy + ry * 1.5f, p)
        p.color = ROAD
        c.drawOval(px - rx * 1.28f, cy - ry * 1.28f, px + rx * 1.28f, cy + ry * 1.28f, p)
        p.color = 0xFF8D949C.toInt()
        c.drawOval(px - rx * 1.12f, cy - ry * 1.12f, px + rx * 1.12f, cy + ry * 1.12f, p)
        p.color = 0xFF3A3F47.toInt()
        c.drawOval(px - rx, cy - ry, px + rx, cy + ry, p)
        p.color = 0xFF07080A.toInt()
        c.drawOval(px - rx * 0.94f, cy - ry * 0.55f, px + rx * 0.94f, cy + ry, p)
    }

    private fun drawRamp(c: Canvas, e: Entity) {
        val cx = World.laneX(e.lane)
        val z0 = e.z
        val z1 = e.z + World.RAMP_LEN
        val top = World.RAMP_H
        val side = if (camX > cx) cx + 1f else cx - 1f
        tri(c, 0xFF8A4B1E.toInt(), side, 0f, z0, side, 0f, z1, side, top, z1)
        quad(c, 0xFFE8923A.toInt(), cx - 1f, 0f, z0, cx + 1f, 0f, z0, cx + 1f, top, z1, cx - 1f, top, z1)
        quad(c, 0xFFFFD23F.toInt(), cx - 1f, 0f, z0, cx + 1f, 0f, z0, cx + 1f, top * 0.07f, z0 + 0.21f, cx - 1f, top * 0.07f, z0 + 0.21f)
        // Arrows pointing up the slope.
        p.style = Paint.Style.STROKE
        p.strokeCap = Paint.Cap.ROUND
        p.strokeJoin = Paint.Join.ROUND
        p.color = Color.WHITE
        for (i in 0 until 2) {
            val t0 = 0.22f + i * 0.34f
            val t1 = t0 + 0.2f
            path.reset()
            project(cx - 0.6f, top * t0, z0 + World.RAMP_LEN * t0); path.moveTo(px, py)
            project(cx, top * t1, z0 + World.RAMP_LEN * t1); path.lineTo(px, py)
            p.strokeWidth = 0.14f * ps
            project(cx + 0.6f, top * t0, z0 + World.RAMP_LEN * t0); path.lineTo(px, py)
            c.drawPath(path, p)
        }
        p.style = Paint.Style.FILL
    }

    private fun drawCoin(c: Canvas, e: Entity, time: Float) {
        project(World.laneX(e.lane), e.y, e.z)
        val r = 0.36f * ps
        val squash = max(0.18f, abs(cos(time * 5f + e.z * 0.4f)))
        p.style = Paint.Style.FILL
        p.color = 0xFFC98A00.toInt()
        c.drawOval(px - r * squash, py - r, px + r * squash, py + r, p)
        p.color = 0xFFFFD21F.toInt()
        c.drawOval(px - r * squash * 0.82f, py - r * 0.82f, px + r * squash * 0.82f, py + r * 0.82f, p)
        p.color = 0xFFFFF3A6.toInt()
        c.drawOval(px - r * squash * 0.45f, py - r * 0.6f, px - r * squash * 0.05f, py - r * 0.1f, p)
    }

    private fun drawPower(c: Canvas, e: Entity, time: Float) {
        project(World.laneX(e.lane), e.y + 0.15f * sin(time * 4f), e.z)
        drawPowerBadge(c, e.power, px, py, 0.6f * ps, time)
    }

    private fun drawPowerBadge(c: Canvas, power: Power, x: Float, y: Float, r: Float, time: Float) {
        val color = powerColor(power)
        p.style = Paint.Style.FILL
        p.color = (color and 0x00FFFFFF) or 0x55000000
        c.drawCircle(x, y, r * (1.45f + 0.12f * sin(time * 6f)), p)
        p.color = Color.WHITE
        c.drawCircle(x, y, r * 1.08f, p)
        p.color = color
        c.drawCircle(x, y, r * 0.94f, p)
        p.color = Color.WHITE
        path.reset()
        when (power) {
            Power.TURBO -> {
                path.moveTo(x + r * 0.15f, y - r * 0.65f); path.lineTo(x - r * 0.4f, y + r * 0.1f)
                path.lineTo(x - r * 0.02f, y + r * 0.1f); path.lineTo(x - r * 0.18f, y + r * 0.68f)
                path.lineTo(x + r * 0.42f, y - r * 0.12f); path.lineTo(x + r * 0.04f, y - r * 0.12f)
                path.close()
                c.drawPath(path, p)
            }
            Power.SPRING -> {
                p.style = Paint.Style.STROKE
                p.strokeWidth = r * 0.16f
                p.strokeJoin = Paint.Join.ROUND
                p.strokeCap = Paint.Cap.ROUND
                path.moveTo(x - r * 0.4f, y + r * 0.55f)
                path.lineTo(x + r * 0.4f, y + r * 0.3f)
                path.lineTo(x - r * 0.4f, y + r * 0.05f)
                path.lineTo(x + r * 0.4f, y - r * 0.2f)
                path.lineTo(x - r * 0.4f, y - r * 0.45f)
                path.lineTo(x + r * 0.4f, y - r * 0.6f)
                c.drawPath(path, p)
                p.style = Paint.Style.FILL
            }
            Power.WINGS -> {
                for (side in intArrayOf(-1, 1)) {
                    path.reset()
                    path.moveTo(x + side * r * 0.06f, y + r * 0.25f)
                    path.quadTo(x + side * r * 0.3f, y - r * 0.75f, x + side * r * 0.82f, y - r * 0.5f)
                    path.quadTo(x + side * r * 0.72f, y + r * 0.05f, x + side * r * 0.06f, y + r * 0.25f)
                    path.close()
                    c.drawPath(path, p)
                }
            }
        }
    }

    private fun powerColor(power: Power): Int = when (power) {
        Power.TURBO -> 0xFFFF7A1A.toInt()
        Power.SPRING -> 0xFF2FBF5B.toInt()
        Power.WINGS -> 0xFF3D8BFF.toInt()
    }

    // ---- Characters ----

    private fun drawSkaterInWorld(c: Canvas, g: World) {
        // Shadow on the road.
        project(g.x, 0f, g.distance)
        val shrink = 1f / (1f + g.y * 0.35f)
        p.style = Paint.Style.FILL
        p.color = SHADOW
        c.drawOval(px - 0.5f * ps * shrink, py - 0.2f * ps * shrink, px + 0.5f * ps * shrink, py + 0.16f * ps * shrink, p)
        project(g.x, g.y, g.distance)
        val flicker = g.phase == Phase.RUNNING && g.graceT > 0f && g.wingsT <= 0f && (g.time * 16f).toInt() % 2 == 0
        if (flicker) c.saveLayerAlpha(px - 1.2f * ps, py - 2.2f * ps, px + 1.2f * ps, py + 0.6f * ps, 110) else c.save()
        c.translate(px, py)
        c.scale(ps, ps)
        drawSkater(c, g)
        c.restore()
    }

    /** The skater, drawn in metres around her board's centre, y up being negative. */
    private fun drawSkater(c: Canvas, g: World) {
        val t = g.time
        val lean = (World.laneX(g.lane) - g.x) * 9f
        val airborne = !g.onGround
        val tuck = if (g.wingsT > 0f) 0.3f else if (airborne) 0.65f else 0.12f + 0.06f * sin(t * 7f)
        val trick = g.trickAnim
        val tp = if (trick != null) (g.trickAnimT / 0.5f).coerceIn(0f, 1f) else 0f
        val spin = (2.0 * PI * tp).toFloat()

        if (g.phase == Phase.CAUGHT || g.phase == Phase.OVER) {
            c.rotate(min(1f, g.caughtT * 3f) * 82f)
        } else {
            c.rotate(lean + if (g.stumbleT > 0f) 16f * sin(g.stumbleT * 22f) else 0f)
        }
        if (trick == Shape.CIRCLE) c.scale(cos(spin), 1f)
        if (trick == Shape.ZED) c.rotate(24f * sin(spin * 2f))

        // Power-up effects behind her.
        if (g.turboT > 0f) {
            p.style = Paint.Style.FILL
            for (i in 0 until 3) {
                val len = 0.5f + 0.25f * sin(t * 30f + i * 2f)
                p.color = if (i == 1) 0xFFFFE066.toInt() else 0xFFFF7A1A.toInt()
                path.reset()
                path.moveTo(-0.14f + i * 0.14f - 0.07f, 0.18f)
                path.lineTo(-0.14f + i * 0.14f + 0.07f, 0.18f)
                path.lineTo(-0.14f + i * 0.14f, 0.18f + len)
                path.close()
                c.drawPath(path, p)
            }
        }
        if (g.wingsT > 0f) {
            val flap = 0.25f * sin(t * 14f)
            // The wings blink when they are about to run out.
            val on = g.wingsT > 1.5f || (t * 10f).toInt() % 2 == 0
            p.style = Paint.Style.FILL
            p.color = if (on) Color.WHITE else 0x88FFFFFF.toInt()
            for (side in intArrayOf(-1, 1)) {
                path.reset()
                path.moveTo(side * 0.1f, -1.15f)
                path.quadTo(side * 0.6f, -1.9f - flap, side * 1.25f, -1.45f - flap * 2f)
                path.quadTo(side * 0.95f, -1.2f, side * 0.85f, -0.95f - flap)
                path.quadTo(side * 0.5f, -0.95f, side * 0.1f, -0.9f)
                path.close()
                c.drawPath(path, p)
            }
        }

        // Board.
        c.save()
        c.translate(0f, -0.12f)
        if (trick == Shape.VEE || trick == Shape.TRIANGLE) {
            c.translate(0f, 0.12f * sin(spin / 2f))
            c.scale(cos(spin), 1f)
        }
        if (trick == Shape.CARET || trick == Shape.TRIANGLE) c.rotate(360f * tp)
        if (trick == Shape.ZED) c.rotate(35f * sin(spin * 2f))
        p.style = Paint.Style.FILL
        p.color = 0xFFF4EBD0.toInt()
        c.drawRect(-0.2f, -0.26f, -0.12f, -0.14f, p); c.drawRect(0.12f, -0.26f, 0.2f, -0.14f, p)
        c.drawRect(-0.2f, 0.14f, -0.12f, 0.26f, p); c.drawRect(0.12f, 0.14f, 0.2f, 0.26f, p)
        p.color = 0xFF7B2FF7.toInt()
        rect.set(-0.16f, -0.4f, 0.16f, 0.4f)
        c.drawRoundRect(rect, 0.14f, 0.14f, p)
        p.color = 0xFFFF4FA3.toInt()
        c.drawRect(-0.16f, -0.08f, 0.16f, 0.04f, p)
        if (g.springT > 0f) {
            // Springs under the board.
            p.style = Paint.Style.STROKE
            p.strokeWidth = 0.05f
            p.color = 0xFF2FBF5B.toInt()
            val stretch = if (airborne) 0.3f else 0.12f
            for (side in intArrayOf(-1, 1)) {
                path.reset()
                path.moveTo(side * 0.2f, 0.3f)
                path.lineTo(side * 0.32f, 0.3f + stretch * 0.33f)
                path.lineTo(side * 0.2f, 0.3f + stretch * 0.66f)
                path.lineTo(side * 0.32f, 0.3f + stretch)
                c.drawPath(path, p)
            }
            p.style = Paint.Style.FILL
        }
        c.restore()

        // Legs: back foot low on the board, front foot further up it.
        val hipY = -0.84f + tuck * 0.22f
        limb(c, -0.1f, 0.08f, -0.2f - tuck * 0.08f, (hipY + 0.08f) / 2f, -0.08f, hipY, 0.13f, SKIN)
        limb(c, 0.1f, -0.3f, 0.2f + tuck * 0.08f, (hipY - 0.34f) / 2f, 0.08f, hipY, 0.13f, SKIN)
        // Socks and shoes.
        line(c, -0.1f, 0.03f, -0.12f, -0.1f, 0.12f, Color.WHITE)
        line(c, 0.1f, -0.33f, 0.12f, -0.44f, 0.12f, Color.WHITE)
        line(c, -0.16f, 0.1f, -0.04f, 0.06f, 0.13f, 0xFF20232B.toInt())
        line(c, 0.04f, -0.3f, 0.16f, -0.26f, 0.13f, 0xFF20232B.toInt())
        // Knee pads.
        p.style = Paint.Style.FILL
        p.color = 0xFF20232B.toInt()
        c.drawCircle(-0.2f - tuck * 0.08f, (hipY + 0.08f) / 2f, 0.085f, p)
        c.drawCircle(0.2f + tuck * 0.08f, (hipY - 0.34f) / 2f, 0.085f, p)
        // Shorts.
        p.color = 0xFF2B3A67.toInt()
        rect.set(-0.2f, hipY - 0.1f, 0.2f, hipY + 0.2f)
        c.drawRoundRect(rect, 0.08f, 0.08f, p)

        // Hoodie.
        val shoulderY = hipY - 0.52f
        p.color = HOODIE
        rect.set(-0.21f, shoulderY - 0.04f, 0.21f, hipY + 0.02f)
        c.drawRoundRect(rect, 0.1f, 0.1f, p)
        p.color = darken(HOODIE, 0.8f)
        rect.set(-0.13f, shoulderY - 0.02f, 0.13f, shoulderY + 0.2f)
        c.drawRoundRect(rect, 0.09f, 0.09f, p)   // the hood hanging down her back
        // Arms out for balance.
        val wave = if (g.wingsT > 0f) -0.35f else if (airborne) -0.28f else 0.05f * sin(t * 7f)
        limb(c, -0.19f, shoulderY + 0.04f, -0.4f, shoulderY + 0.2f + wave * 0.5f, -0.5f, shoulderY + 0.42f + wave, 0.11f, HOODIE)
        limb(c, 0.19f, shoulderY + 0.04f, 0.4f, shoulderY + 0.16f + wave * 0.5f, 0.52f, shoulderY + 0.36f + wave, 0.11f, HOODIE)
        p.color = SKIN
        c.drawCircle(-0.5f, shoulderY + 0.44f + wave, 0.06f, p)
        c.drawCircle(0.52f, shoulderY + 0.38f + wave, 0.06f, p)

        // Head, helmet and ponytail.
        val headY = shoulderY - 0.17f
        p.color = SKIN
        c.drawRect(-0.05f, headY, 0.05f, shoulderY, p)
        c.drawCircle(0f, headY, 0.13f, p)
        val sway = 0.1f * sin(t * 9f) - lean * 0.012f
        p.style = Paint.Style.STROKE
        p.strokeCap = Paint.Cap.ROUND
        p.strokeWidth = 0.1f
        p.color = HAIR
        path.reset()
        path.moveTo(0f, headY + 0.02f)
        path.quadTo(sway * 0.5f, headY + 0.22f, sway * 1.6f, headY + 0.42f - (if (airborne) 0.12f else 0f))
        c.drawPath(path, p)
        p.style = Paint.Style.FILL
        c.drawCircle(0f, headY + 0.05f, 0.1f, p)
        p.color = HELMET
        rect.set(-0.15f, headY - 0.16f, 0.15f, headY + 0.14f)
        c.drawArc(rect, 180f, 180f, true, p)
        c.drawRect(-0.15f, headY - 0.02f, 0.15f, headY + 0.02f, p)
        p.color = lighten(HELMET, 0.35f)
        c.drawRect(-0.02f, headY - 0.15f, 0.02f, headY - 0.02f, p)
    }

    private fun drawCyclistInWorld(c: Canvas, g: World) {
        val z = g.distance - g.gap
        if (z - camZ < 1.05f) return
        val side = if (g.lane == 2) -1f else 1f
        val caught = g.phase != Phase.RUNNING
        val x = g.x + side * (if (caught) 1.1f else 0.85f)
        project(x, 0f, z)
        p.style = Paint.Style.FILL
        p.color = SHADOW
        c.drawOval(px - 0.35f * ps, py - 0.14f * ps, px + 0.35f * ps, py + 0.1f * ps, p)
        c.save()
        c.translate(px, py)
        c.scale(ps, ps)
        drawCyclist(c, g.time, if (caught) 0f else 1f, true)
        c.restore()
        // What he is yelling.
        if (g.phase == Phase.RUNNING && g.gap < 3.4f) {
            val shout = SHOUTS[(g.time / 1.6f).toInt() % SHOUTS.size]
            val by = py - 2.15f * ps
            if (by > hz) bubble(c, shout, (px + side * 0.2f * ps).coerceIn(u * 24f, w - u * 24f), min(by, h - u * 30f))
        }
    }

    /** The cyclist seen from behind, in metres, wheel touching the ground at the origin. */
    private fun drawCyclist(c: Canvas, t: Float, pedalling: Float, fist: Boolean) {
        val ph = t * 11f * pedalling
        c.rotate(3f * sin(ph))
        // Rear wheel and frame.
        p.style = Paint.Style.FILL
        p.color = 0xFF15171B.toInt()
        rect.set(-0.035f, -0.7f, 0.035f, 0f)
        c.drawRoundRect(rect, 0.035f, 0.035f, p)
        line(c, 0f, -0.36f, 0f, -0.95f, 0.045f, 0xFFD7263D.toInt())
        line(c, -0.11f, -0.36f, 0.11f, -0.36f, 0.05f, 0xFF9AA3AD.toInt())
        // Handlebar ends peeking out either side.
        line(c, -0.24f, -1.02f, 0.24f, -1.02f, 0.045f, 0xFF15171B.toInt())
        // Legs, pumping up and down.
        for (side in intArrayOf(-1, 1)) {
            val up = 0.16f * sin(ph + if (side < 0) 0f else PI.toFloat())
            val footY = -0.28f + up
            val kneeY = -0.62f + up * 0.7f
            limb(c, side * 0.1f, -0.98f, side * 0.2f, kneeY, side * 0.14f, footY, 0.13f, SKIN)
            line(c, side * 0.1f, -0.98f, side * 0.185f, kneeY - 0.06f, 0.15f, LYCRA)
            line(c, side * 0.145f, footY - 0.2f, side * 0.14f, footY - 0.04f, 0.1f, 0xFFE8FF3A.toInt())
            line(c, side * 0.1f, footY, side * 0.2f, footY, 0.1f, Color.WHITE)
        }
        // Saddle and the seat of his bib shorts.
        p.color = LYCRA
        rect.set(-0.19f, -1.12f, 0.19f, -0.86f)
        c.drawRoundRect(rect, 0.1f, 0.1f, p)
        // Jersey: his back, leaning over the bars.
        p.color = JERSEY
        path.reset()
        path.moveTo(-0.18f, -1.0f); path.lineTo(0.18f, -1.0f)
        path.lineTo(0.24f, -1.44f); path.quadTo(0f, -1.56f, -0.24f, -1.44f)
        path.close()
        c.drawPath(path, p)
        p.color = LYCRA
        path.reset()
        path.moveTo(-0.18f, -1.0f); path.lineTo(-0.1f, -1.0f); path.lineTo(-0.16f, -1.47f); path.lineTo(-0.24f, -1.44f)
        path.close()
        c.drawPath(path, p)
        path.reset()
        path.moveTo(0.18f, -1.0f); path.lineTo(0.1f, -1.0f); path.lineTo(0.16f, -1.47f); path.lineTo(0.24f, -1.44f)
        path.close()
        c.drawPath(path, p)
        // Back pockets and race number.
        line(c, -0.1f, -1.12f, 0.1f, -1.12f, 0.02f, darken(JERSEY, 0.7f))
        line(c, -0.035f, -1.12f, -0.035f, -1.02f, 0.015f, darken(JERSEY, 0.7f))
        line(c, 0.035f, -1.12f, 0.035f, -1.02f, 0.015f, darken(JERSEY, 0.7f))
        p.color = Color.WHITE
        c.drawRect(-0.08f, -1.36f, 0.08f, -1.2f, p)
        text.textSize = 0.14f
        text.color = 0xFF15171B.toInt()
        text.style = Paint.Style.FILL
        c.drawText("13", 0f, -1.23f, text)
        // Arms: one on the bars, one shaking a fist.
        limb(c, -0.22f, -1.42f, -0.3f, -1.22f, -0.24f, -1.04f, 0.1f, SKIN)
        line(c, -0.22f, -1.42f, -0.28f, -1.28f, 0.11f, JERSEY)
        if (fist) {
            val shake = 0.06f * sin(t * 18f)
            limb(c, 0.22f, -1.42f, 0.4f, -1.5f, 0.42f + shake, -1.78f, 0.1f, SKIN)
            line(c, 0.22f, -1.42f, 0.36f, -1.48f, 0.11f, JERSEY)
            p.color = 0xFF15171B.toInt()
            c.drawCircle(0.42f + shake, -1.82f, 0.075f, p)   // glove
        } else {
            limb(c, 0.22f, -1.42f, 0.3f, -1.22f, 0.24f, -1.04f, 0.1f, SKIN)
            line(c, 0.22f, -1.42f, 0.28f, -1.28f, 0.11f, JERSEY)
        }
        // Head: neck, aero helmet with vents, sunglasses strap.
        p.color = SKIN
        c.drawRect(-0.05f, -1.56f, 0.05f, -1.46f, p)
        c.drawCircle(0f, -1.6f, 0.11f, p)
        p.color = Color.WHITE
        rect.set(-0.15f, -1.8f, 0.15f, -1.56f)
        c.drawOval(rect, p)
        p.color = 0xFFD7263D.toInt()
        rect.set(-0.035f, -1.8f, 0.035f, -1.56f)
        c.drawRoundRect(rect, 0.03f, 0.03f, p)
        p.color = 0xFF15171B.toInt()
        for (side in intArrayOf(-1, 1)) {
            rect.set(side * 0.085f - 0.02f, -1.75f, side * 0.085f + 0.02f, -1.62f)
            c.drawRoundRect(rect, 0.02f, 0.02f, p)
        }
        line(c, -0.12f, -1.57f, 0.12f, -1.57f, 0.025f, 0xFF15171B.toInt())
        // He is furious.
        p.style = Paint.Style.STROKE
        p.strokeWidth = 0.03f
        p.color = 0xFFFF2D2D.toInt()
        val ax = -0.3f
        val ay = -1.86f + 0.02f * sin(t * 12f)
        c.drawLine(ax - 0.07f, ay - 0.02f, ax - 0.02f, ay - 0.02f, p); c.drawLine(ax - 0.02f, ay - 0.02f, ax - 0.02f, ay - 0.07f, p)
        c.drawLine(ax + 0.07f, ay - 0.02f, ax + 0.02f, ay - 0.02f, p); c.drawLine(ax + 0.02f, ay - 0.02f, ax + 0.02f, ay - 0.07f, p)
        c.drawLine(ax - 0.07f, ay + 0.03f, ax - 0.02f, ay + 0.03f, p); c.drawLine(ax - 0.02f, ay + 0.03f, ax - 0.02f, ay + 0.08f, p)
        c.drawLine(ax + 0.07f, ay + 0.03f, ax + 0.02f, ay + 0.03f, p); c.drawLine(ax + 0.02f, ay + 0.03f, ax + 0.02f, ay + 0.08f, p)
        p.style = Paint.Style.FILL
    }

    private fun bubble(c: Canvas, words: String, x: Float, y: Float) {
        text.textSize = u * 4.2f
        val tw = text.measureText(words)
        p.style = Paint.Style.FILL
        p.color = Color.WHITE
        rect.set(x - tw / 2f - u * 3f, y - u * 4.2f, x + tw / 2f + u * 3f, y + u * 3.2f)
        c.drawRoundRect(rect, u * 3f, u * 3f, p)
        path.reset()
        path.moveTo(x - u * 2f, y + u * 3f); path.lineTo(x + u * 2f, y + u * 3f); path.lineTo(x, y + u * 6f)
        path.close()
        c.drawPath(path, p)
        text.style = Paint.Style.FILL
        text.color = 0xFFD7263D.toInt()
        c.drawText(words, x, y + u * 1f, text)
    }

    // ---- Effects and interface ----

    private fun drawSpeedLines(c: Canvas, time: Float) {
        p.style = Paint.Style.STROKE
        p.strokeCap = Paint.Cap.ROUND
        p.strokeWidth = u * 0.6f
        p.color = 0x99FFFFFF.toInt()
        for (i in 0 until 14) {
            val a = (i * 0.449f + 0.2f) * 2f * PI.toFloat()
            val phase = (time * 2.5f + i * 0.37f) % 1f
            val r0 = w * (0.45f + 0.6f * phase)
            val r1 = r0 + w * 0.16f
            val cy = hz + (h - hz) * 0.35f
            c.drawLine(w / 2f + cos(a) * r0, cy + sin(a) * r0 * 1.3f, w / 2f + cos(a) * r1, cy + sin(a) * r1 * 1.3f, p)
        }
        p.style = Paint.Style.FILL
    }

    private fun drawDanger(c: Canvas, g: World) {
        val pulse = 0.5f + 0.5f * sin(g.time * 9f)
        val alpha = (70 + 70 * pulse).toInt()
        p.style = Paint.Style.STROKE
        p.strokeWidth = u * 3f
        p.color = (alpha shl 24) or 0xFF2D2D
        c.drawRect(u * 1.5f, u * 1.5f, w - u * 1.5f, h - u * 1.5f, p)
        p.style = Paint.Style.FILL
    }

    private fun drawHud(c: Canvas, g: World) {
        text.textAlign = Paint.Align.LEFT
        label(c, g.score.toString(), u * 5f, u * 16f, u * 9f, Color.WHITE)
        // Coins.
        p.style = Paint.Style.FILL
        p.color = 0xFFC98A00.toInt()
        c.drawCircle(u * 8f, u * 22.4f, u * 2.9f, p)
        p.color = 0xFFFFD21F.toInt()
        c.drawCircle(u * 8f, u * 22.4f, u * 2.3f, p)
        label(c, g.coins.toString(), u * 12.5f, u * 24.4f, u * 5.6f, 0xFFFFE14D.toInt())
        text.textAlign = Paint.Align.CENTER

        // Pause button.
        p.color = 0x66101428
        c.drawOval(cornerButton, p)
        p.color = Color.WHITE
        val bx = cornerButton.centerX(); val by = cornerButton.centerY(); val bs = cornerButton.width()
        c.drawRect(bx - bs * 0.17f, by - bs * 0.2f, bx - bs * 0.06f, by + bs * 0.2f, p)
        c.drawRect(bx + bs * 0.06f, by - bs * 0.2f, bx + bs * 0.17f, by + bs * 0.2f, p)

        // Active power-ups, each with a bar that runs down.
        var row = 0
        row = powerBar(c, g, Power.TURBO, g.turboT, row)
        row = powerBar(c, g, Power.SPRING, g.springT, row)
        powerBar(c, g, Power.WINGS, g.wingsT, row)
    }

    private fun powerBar(c: Canvas, g: World, power: Power, left: Float, row: Int): Int {
        if (left <= 0f) return row
        val y = u * 32f + row * u * 9f
        drawPowerBadge(c, power, u * 8f, y, u * 3f, g.time)
        p.style = Paint.Style.FILL
        p.color = 0x66101428
        rect.set(u * 13f, y - u * 1.3f, u * 41f, y + u * 1.3f)
        c.drawRoundRect(rect, u * 1.3f, u * 1.3f, p)
        p.color = powerColor(power)
        rect.set(u * 13f, y - u * 1.3f, u * 13f + u * 28f * (left / power.seconds).coerceIn(0f, 1f), y + u * 1.3f)
        c.drawRoundRect(rect, u * 1.3f, u * 1.3f, p)
        return row + 1
    }

    private fun drawTrickPrompt(c: Canvas, g: World) {
        val pulse = 1f + 0.04f * sin(g.time * 12f)
        label(c, "TRACE A SHAPE!", w / 2f, h * 0.19f, u * 7.5f * pulse, Color.WHITE)
        // The featured shape pays double.
        val cy = h * 0.29f
        val r = u * 9f
        p.style = Paint.Style.FILL
        p.color = 0xAA101428.toInt()
        c.drawCircle(w / 2f, cy, r * 1.25f, p)
        shapePath(g.featured, w / 2f, cy, r * 1.3f)
        strokePath(c, u * 1.6f, 0xFFFFE14D.toInt())
        label(c, "x2", w / 2f + r * 1.5f, cy - r * 0.7f, u * 5.5f, 0xFFFFE14D.toInt())
        label(c, g.featured.label, w / 2f, cy + r * 1.25f + u * 6f, u * 4.6f, 0xFFFFE14D.toInt())

        // Every shape, along the bottom.
        val n = Shape.entries.size
        val cell = w / n
        val by = h * 0.9f
        p.style = Paint.Style.FILL
        p.color = 0x88101428.toInt()
        rect.set(u * 2f, by - u * 8f, w - u * 2f, by + u * 9f)
        c.drawRoundRect(rect, u * 3f, u * 3f, p)
        for ((i, s) in Shape.entries.withIndex()) {
            val x = cell * (i + 0.5f)
            shapePath(s, x, by - u * 2f, u * 6.5f)
            strokePath(c, u * 0.9f, if (s == g.featured) 0xFFFFE14D.toInt() else Color.WHITE)
            text.textSize = u * 2.3f
            text.style = Paint.Style.FILL
            text.color = Color.WHITE
            c.drawText(s.label, x, by + u * 6.4f, text)
        }
    }

    private fun shapePath(s: Shape, cx: Float, cy: Float, size: Float) {
        path.reset()
        val o = s.outline
        for (i in 0 until o.size / 2) {
            val x = cx + (o[i * 2] - 0.5f) * size
            val y = cy + (o[i * 2 + 1] - 0.5f) * size
            if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
        }
    }

    private fun strokePath(c: Canvas, width: Float, color: Int) {
        p.style = Paint.Style.STROKE
        p.strokeCap = Paint.Cap.ROUND
        p.strokeJoin = Paint.Join.ROUND
        p.strokeWidth = width
        p.color = color
        c.drawPath(path, p)
        p.style = Paint.Style.FILL
    }

    private fun drawStroke(c: Canvas, pts: FloatArray, count: Int) {
        if (count < 2) return
        path.reset()
        path.moveTo(pts[0], pts[1])
        for (i in 1 until count) path.lineTo(pts[i * 2], pts[i * 2 + 1])
        strokePath(c, u * 3.4f, 0x55FF4FA3)
        strokePath(c, u * 1.5f, 0xFFFFFFFF.toInt())
    }

    private fun drawPopups(c: Canvas, g: World) {
        for ((i, pop) in g.popups.withIndex()) {
            val a = (1f - pop.age / 1.3f).coerceIn(0f, 1f)
            val grow = min(1f, pop.age * 8f)
            val y = h * 0.43f + i * u * 8.5f - min(pop.age, 0.3f) * u * 10f
            val alpha = (255 * min(1f, a * 2.5f)).toInt()
            label(c, pop.text, w / 2f, y, u * 6.5f * (0.6f + 0.4f * grow), (pop.color and 0x00FFFFFF) or (alpha shl 24))
        }
    }

    private fun dim(c: Canvas) {
        p.style = Paint.Style.FILL
        p.shader = shade
        c.drawRect(0f, 0f, w, h, p)
        p.shader = null
    }

    private fun drawPaused(c: Canvas) {
        dim(c)
        label(c, "PAUSED", w / 2f, h * 0.42f, u * 13f, Color.WHITE)
        label(c, "TAP TO KEEP SKATING", w / 2f, h * 0.5f, u * 5f, 0xFFFFE14D.toInt())
    }

    private fun drawTitle(c: Canvas, g: World) {
        dim(c)
        label(c, "SKATE", w / 2f, h * 0.15f, u * 21f, 0xFFFF4FA3.toInt())
        label(c, "ESCAPE", w / 2f, h * 0.15f + u * 18f, u * 21f, 0xFFFFE14D.toInt())
        label(c, "Outrun the angry cyclist!", w / 2f, h * 0.15f + u * 27f, u * 5f, Color.WHITE)
        if ((g.time * 2f).toInt() % 2 == 0) label(c, "TAP TO START", w / 2f, h * 0.8f, u * 8.5f, Color.WHITE)
        val y0 = h * 0.845f
        hint(c, "SWIPE  ← →   change lane", y0)
        hint(c, "SWIPE  ↑   jump manholes", y0 + u * 5.6f)
        hint(c, "HIT A RAMP, then trace a shape for a trick", y0 + u * 11.2f)
        if (g.best > 0) label(c, "BEST  ${g.best}", w / 2f, h * 0.15f + u * 36f, u * 5.5f, 0xFF7DF9FF.toInt())

        // Sound on/off.
        p.style = Paint.Style.FILL
        p.color = 0x66101428
        c.drawOval(cornerButton, p)
        val bx = cornerButton.centerX(); val by = cornerButton.centerY(); val bs = cornerButton.width()
        p.color = Color.WHITE
        path.reset()
        path.moveTo(bx - bs * 0.24f, by - bs * 0.08f); path.lineTo(bx - bs * 0.1f, by - bs * 0.08f)
        path.lineTo(bx + bs * 0.06f, by - bs * 0.22f); path.lineTo(bx + bs * 0.06f, by + bs * 0.22f)
        path.lineTo(bx - bs * 0.1f, by + bs * 0.08f); path.lineTo(bx - bs * 0.24f, by + bs * 0.08f)
        path.close()
        c.drawPath(path, p)
        p.style = Paint.Style.STROKE
        p.strokeWidth = bs * 0.05f
        p.strokeCap = Paint.Cap.ROUND
        if (soundOn) {
            rect.set(bx - bs * 0.02f, by - bs * 0.14f, bx + bs * 0.2f, by + bs * 0.14f)
            c.drawArc(rect, -50f, 100f, false, p)
        } else {
            c.drawLine(bx + bs * 0.12f, by - bs * 0.09f, bx + bs * 0.26f, by + bs * 0.09f, p)
            c.drawLine(bx + bs * 0.26f, by - bs * 0.09f, bx + bs * 0.12f, by + bs * 0.09f, p)
        }
        p.style = Paint.Style.FILL
    }

    private fun hint(c: Canvas, words: String, y: Float) {
        text.textSize = u * 3.7f
        text.style = Paint.Style.FILL
        text.color = 0xFFE8ECFF.toInt()
        c.drawText(words, w / 2f, y + u * 5f, text)
    }

    private fun drawGameOver(c: Canvas, g: World) {
        dim(c)
        label(c, "BUSTED!", w / 2f, h * 0.2f, u * 17f, 0xFFFF5A4D.toInt())
        label(c, "The cyclist caught you", w / 2f, h * 0.2f + u * 8f, u * 5f, Color.WHITE)
        p.style = Paint.Style.FILL
        p.color = 0xCC101428.toInt()
        rect.set(u * 14f, h * 0.31f, w - u * 14f, h * 0.31f + u * 44f)
        c.drawRoundRect(rect, u * 5f, u * 5f, p)
        label(c, "SCORE", w / 2f, h * 0.31f + u * 8f, u * 4.5f, 0xFF7DF9FF.toInt())
        label(c, g.score.toString(), w / 2f, h * 0.31f + u * 20f, u * 13f, Color.WHITE)
        label(c, "${g.distance.toInt()} m    ${g.coins} coins", w / 2f, h * 0.31f + u * 28f, u * 4.6f, 0xFFFFE14D.toInt())
        label(c, if (g.newBest) "NEW BEST!" else "BEST  ${g.best}", w / 2f, h * 0.31f + u * 38f, u * 5.5f,
            if (g.newBest) 0xFFFF4FA3.toInt() else 0xFFE8ECFF.toInt())
        if ((g.time * 2f).toInt() % 2 == 0) label(c, "TAP TO TRY AGAIN", w / 2f, h * 0.84f, u * 7.5f, Color.WHITE)
    }

    /** Bold text with a dark outline so it reads over anything. */
    private fun label(c: Canvas, words: String, x: Float, y: Float, size: Float, color: Int) {
        text.textSize = size
        text.style = Paint.Style.STROKE
        text.strokeWidth = size * 0.16f
        text.strokeJoin = Paint.Join.ROUND
        text.color = ((color ushr 24) shl 24) or 0x101428
        c.drawText(words, x, y, text)
        text.style = Paint.Style.FILL
        text.color = color
        c.drawText(words, x, y, text)
    }

    // ---- Drawing helpers ----

    private fun ground(c: Canvas, color: Int, x0: Float, x1: Float, z0: Float, z1: Float) {
        if (z1 - camZ <= NEAR) return
        quad(c, color, x0, 0f, z0, x1, 0f, z0, x1, 0f, z1, x0, 0f, z1)
    }

    private fun quad(
        c: Canvas, color: Int,
        x1: Float, y1: Float, z1: Float, x2: Float, y2: Float, z2: Float,
        x3: Float, y3: Float, z3: Float, x4: Float, y4: Float, z4: Float,
    ) {
        path.reset()
        project(x1, y1, z1); path.moveTo(px, py)
        project(x2, y2, z2); path.lineTo(px, py)
        project(x3, y3, z3); path.lineTo(px, py)
        project(x4, y4, z4); path.lineTo(px, py)
        path.close()
        p.style = Paint.Style.FILL
        p.color = color
        c.drawPath(path, p)
    }

    private fun tri(
        c: Canvas, color: Int,
        x1: Float, y1: Float, z1: Float, x2: Float, y2: Float, z2: Float, x3: Float, y3: Float, z3: Float,
    ) {
        path.reset()
        project(x1, y1, z1); path.moveTo(px, py)
        project(x2, y2, z2); path.lineTo(px, py)
        project(x3, y3, z3); path.lineTo(px, py)
        path.close()
        p.style = Paint.Style.FILL
        p.color = color
        c.drawPath(path, p)
    }

    /** A box, drawing only the faces the camera can see. */
    private fun box(c: Canvas, x0: Float, x1: Float, y0: Float, y1: Float, z0: Float, z1: Float, top: Int, front: Int, side: Int) {
        if (z0 - camZ < NEAR) return
        if (camX < x0) quad(c, side, x0, y0, z0, x0, y0, z1, x0, y1, z1, x0, y1, z0)
        if (camX > x1) quad(c, side, x1, y0, z0, x1, y0, z1, x1, y1, z1, x1, y1, z0)
        if (camY > y1) quad(c, top, x0, y1, z0, x1, y1, z0, x1, y1, z1, x0, y1, z1)
        quad(c, front, x0, y0, z0, x1, y0, z0, x1, y1, z0, x0, y1, z0)
    }

    private fun line(c: Canvas, x1: Float, y1: Float, x2: Float, y2: Float, width: Float, color: Int) {
        p.style = Paint.Style.STROKE
        p.strokeCap = Paint.Cap.ROUND
        p.strokeWidth = width
        p.color = color
        c.drawLine(x1, y1, x2, y2, p)
        p.style = Paint.Style.FILL
    }

    /** A two-part limb (shoulder-elbow-hand or hip-knee-foot). */
    private fun limb(c: Canvas, x1: Float, y1: Float, x2: Float, y2: Float, x3: Float, y3: Float, width: Float, color: Int) {
        p.style = Paint.Style.STROKE
        p.strokeCap = Paint.Cap.ROUND
        p.strokeJoin = Paint.Join.ROUND
        p.strokeWidth = width
        p.color = color
        path.reset()
        path.moveTo(x1, y1); path.lineTo(x2, y2); path.lineTo(x3, y3)
        c.drawPath(path, p)
        p.style = Paint.Style.FILL
    }

    private fun darken(color: Int, k: Float): Int = Color.rgb(
        (Color.red(color) * k).toInt(), (Color.green(color) * k).toInt(), (Color.blue(color) * k).toInt(),
    )

    private fun lighten(color: Int, k: Float): Int = Color.rgb(
        (Color.red(color) + (255 - Color.red(color)) * k).toInt(),
        (Color.green(color) + (255 - Color.green(color)) * k).toInt(),
        (Color.blue(color) + (255 - Color.blue(color)) * k).toInt(),
    )

    private fun hash(k: Int, salt: Int): Int {
        var v = k * 374761393 + salt * 668265263
        v = (v xor (v ushr 13)) * 1274126177
        return (v xor (v ushr 16)) and 0x7FFFFFFF
    }

    private companion object {
        const val NEAR = 0.5f
        const val CAM_BACK = 6.2f
        const val ROAD_HALF = 3.6f
        const val LOT = 16f

        val SKY_TOP = 0xFF3FA0F5.toInt()
        val SKY_MID = 0xFF8CCBFA.toInt()
        val SKY_LOW = 0xFFD9F0FF.toInt()
        val HILL_FAR = 0xFF8FC6B4.toInt()
        val HILL_NEAR = 0xFF5FA873.toInt()
        val LAWN = 0xFF6CC24A.toInt()
        val LAWN_DARK = 0xFF62B542.toInt()
        val SIDEWALK = 0xFFD8D4C8.toInt()
        val SIDEWALK_JOINT = 0xFFB9B4A6.toInt()
        val KERB = 0xFFF1EEE4.toInt()
        val ROAD = 0xFF4A4E57.toInt()
        val LANE_MARK = 0xFFF4F1E6.toInt()
        val DRIVE = 0xFFBDB8AB.toInt()
        val PATHWAY = 0xFFE3D2B0.toInt()
        val GARAGE = 0xFFF2F2EE.toInt()
        val WINDOW = 0xFF9FD8F2.toInt()
        val GLASS = 0xFFBFE6F7.toInt()
        val TYRE = 0xFF17191D.toInt()
        val HEADLIGHT = 0xFFFFF7C2.toInt()
        val TRUNK = 0xFF7A5230.toInt()
        val HEDGE = 0xFF3F8F3A.toInt()
        val HEDGE_TOP = 0xFF4FA548.toInt()
        const val SHADOW = 0x55000000

        val WALLS = intArrayOf(0xFFF6E3C5.toInt(), 0xFFF2B5A0.toInt(), 0xFFB9DDF0.toInt(), 0xFFFFF1A8.toInt(), 0xFFCFE8C0.toInt(), 0xFFE7C6EA.toInt())
        val ROOFS = intArrayOf(0xFFB5523B.toInt(), 0xFF5B6C7D.toInt(), 0xFF7A4E3A.toInt(), 0xFF3F6B5A.toInt())
        val DOORS = intArrayOf(0xFFB23A48.toInt(), 0xFF2F5D8A.toInt(), 0xFF3F7D4E.toInt(), 0xFF6B4A2B.toInt())
        val LEAVES = intArrayOf(0xFF3E9B4F.toInt(), 0xFF4FAE46.toInt(), 0xFF2F8A5A.toInt(), 0xFFE08A3C.toInt())
        val CARS = intArrayOf(0xFFE23D3D.toInt(), 0xFF2F7DE1.toInt(), 0xFFF2F2F2.toInt(), 0xFFF2B81F.toInt(), 0xFF2FB58A.toInt(), 0xFF8A5BD6.toInt())

        val SKIN = 0xFFF2C29B.toInt()
        val HAIR = 0xFFB5462B.toInt()
        val HOODIE = 0xFF19C2B4.toInt()
        val HELMET = 0xFFFF4FA3.toInt()
        val JERSEY = 0xFFD8FF2A.toInt()
        val LYCRA = 0xFF17191D.toInt()

        val SHOUTS = arrayOf("HEY!!", "GET OFF THE ROAD!", "ON YOUR LEFT!!", "ROADS ARE FOR BIKES!", "COME BACK HERE!")
    }
}
