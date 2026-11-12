package com.personal.skateescape.game

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class WorldTest {
    private val frame = 1f / 60f

    private fun World.run(seconds: Float, each: (World) -> Unit = {}) {
        var t = 0f
        while (t < seconds) {
            each(this)
            update(frame)
            t += frame
        }
    }

    /** Skates along an empty road, so a test can then set up exactly the hazards it wants. */
    private fun World.quiet(seconds: Float) {
        var t = 0f
        while (t < seconds) {
            entities.clear()
            update(frame)
            t += frame
        }
        entities.clear()
    }

    private fun started(): World = World(1).also { it.start(); it.quiet(6f) }

    /** A careful player: steers into the lane whose next car is furthest off, and hops manholes. */
    private fun autopilot(w: World) {
        if (w.phase != Phase.RUNNING) return
        if (w.trickWindow && w.tricksThisAir == 0 && w.y > 1f) w.trick(w.featured)
        val closing = w.speed + World.CAR_SPEED
        val clear = FloatArray(3) { 99f }
        for (e in w.entities) {
            if (e.kind != Kind.CAR) continue
            val behind = e.z + World.CAR_HALF_LEN + 0.6f < w.distance
            if (behind) continue
            val t = ((e.z - World.CAR_HALF_LEN - 0.6f - w.distance) / closing).coerceAtLeast(0f)
            if (t < clear[e.lane]) clear[e.lane] = t
        }
        if (clear[w.lane] < 1.3f) {
            // Head for the clearest lane, one step at a time, as long as the next step is not into a car.
            val best = (0..2).maxByOrNull { clear[it] - 0.01f * kotlin.math.abs(it - w.lane) }!!
            if (best != w.lane && clear[best] > clear[w.lane]) {
                val step = if (best < w.lane) w.lane - 1 else w.lane + 1
                if (clear[step] > 0.35f) w.swipe(if (step < w.lane) Swipe.LEFT else Swipe.RIGHT)
            }
        }
        if (w.onGround) {
            for (e in w.entities) {
                if (e.kind == Kind.MANHOLE && e.lane == w.lane) {
                    val dz = e.z - w.distance
                    if (dz > 0.4f && dz < w.speed * 0.2f + 0.9f) w.swipe(Swipe.UP)
                }
            }
        }
    }

    @Test
    fun aCarefulPlayerCanAlwaysGetThrough() {
        for (seed in 1L..8L) {
            val w = World(seed)
            w.start()
            var stumbles = 0
            w.run(240f) {
                autopilot(it)
                stumbles += it.events.count { e -> e == Event.STUMBLE }
                it.events.clear()
            }
            assertEquals("seed $seed stumbled", 0, stumbles)
            assertEquals("seed $seed ended at ${w.distance.toInt()} m", Phase.RUNNING, w.phase)
            assertTrue("seed $seed only reached ${w.distance.toInt()} m", w.distance > 3500f)
            assertTrue("seed $seed collected nothing", w.coins > 50)
        }
    }

    @Test
    fun doingNothingGetsYouCaught() {
        val w = World(3)
        w.start()
        w.run(120f)
        assertEquals(Phase.OVER, w.phase)
        assertTrue(w.best > 0)
        assertTrue(w.events.contains(Event.OVER))
    }

    @Test
    fun aManholeTripsYouAndASecondOneGetsYouCaught() {
        val w = started()
        w.entities += Entity(Kind.MANHOLE, 1, w.distance + 5f)
        w.run(1f)
        assertEquals(Phase.RUNNING, w.phase)
        assertTrue("the cyclist should be right behind", w.gap < World.DANGER_GAP)
        w.quiet(1.2f)
        w.entities += Entity(Kind.MANHOLE, 1, w.distance + 5f)
        w.run(1f)
        assertTrue(w.phase == Phase.CAUGHT || w.phase == Phase.OVER)
    }

    @Test
    fun theCyclistDropsBackIfYouStayOnYourBoard() {
        val w = started()
        w.entities += Entity(Kind.MANHOLE, 1, w.distance + 5f)
        w.run(1f)
        w.quiet(8f)
        assertTrue(w.gap >= World.DANGER_GAP)
        w.entities += Entity(Kind.MANHOLE, 1, w.distance + 5f)
        w.run(1f)
        assertEquals(Phase.RUNNING, w.phase)
    }

    @Test
    fun jumpingClearsAManholeButNotACar() {
        val w = started()
        w.entities += Entity(Kind.MANHOLE, 1, w.distance + 4f)
        w.swipe(Swipe.UP)
        w.run(0.5f)
        assertEquals(0f, w.stumbleT, 0f)
        assertTrue(w.gap > World.DANGER_GAP)

        w.quiet(1f)
        w.entities += Entity(Kind.CAR, 1, w.distance + 6f).also { it.vz = -World.CAR_SPEED }
        w.swipe(Swipe.UP)
        w.run(0.6f)
        assertEquals(Phase.CAUGHT, w.phase)
    }

    @Test
    fun aRampOpensTheTrickWindowAndTricksPayCoins() {
        val w = started()
        w.entities += Entity(Kind.RAMP, 1, w.distance + 3f)
        w.run(0.6f)
        assertTrue(w.trickWindow)
        assertEquals(Air.RAMP, w.air)
        assertTrue("time slows down in the air", w.timeScale < 0.6f)
        val before = w.coins
        val featured = w.featured
        assertTrue(w.trick(featured))
        assertEquals(before + featured.coins * 2, w.coins)
        assertFalse("an unrecognised scribble is not a trick", w.trick(null))
        var t = 0f
        while (t < 5f && !w.onGround) { w.entities.clear(); w.update(frame); t += frame }
        assertTrue(w.onGround)
        assertFalse(w.trickWindow)
        assertFalse(w.trick(Shape.CIRCLE))
    }

    @Test
    fun powerUpsDoWhatTheySay() {
        val w = started()
        fun give(p: Power) {
            w.entities.clear()
            w.entities += Entity(Kind.POWER, 1, w.distance + 2f).also { it.y = 1f; it.power = p }
            w.run(0.4f)
        }
        val normal = w.speed
        give(Power.TURBO)
        assertTrue(w.turboT > 0f)
        assertTrue(w.speed > normal * 1.3f)

        // Super jump clears a car.
        give(Power.SPRING)
        w.entities.clear()
        w.entities += Entity(Kind.CAR, 1, w.distance + 9f).also { it.vz = -World.CAR_SPEED }
        w.swipe(Swipe.UP)
        w.run(1.2f)
        assertEquals(Phase.RUNNING, w.phase)

        // Wings fly over everything.
        give(Power.WINGS)
        assertTrue(w.wingsT > 0f)
        w.run(1f)
        w.entities.removeAll { it.kind != Kind.COIN }
        for (lane in 0..2) w.entities += Entity(Kind.CAR, lane, w.distance + 12f).also { it.vz = -World.CAR_SPEED }
        w.run(1.5f)
        assertEquals(Phase.RUNNING, w.phase)
        assertTrue(w.y > 3f)
    }

    @Test
    fun clippingACarWhileChangingLanesIsOnlyAStumble() {
        val w = started()
        w.entities += Entity(Kind.CAR, 2, w.distance + 1.5f).also { it.vz = -World.CAR_SPEED }
        w.swipe(Swipe.RIGHT)
        w.run(0.3f)
        assertEquals(Phase.RUNNING, w.phase)
        assertEquals(1, w.lane)
        assertTrue(w.stumbleT > 0f)
    }
}
