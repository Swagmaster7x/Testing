package com.personal.skateescape.game

import kotlin.math.abs
import kotlin.math.exp
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

enum class Kind { CAR, MANHOLE, RAMP, COIN, POWER }
enum class Power(val label: String, val seconds: Float) {
    TURBO("TURBO!", 6f),
    SPRING("SUPER JUMP!", 10f),
    WINGS("FLYING!", 7f),
}
enum class Phase { TITLE, RUNNING, CAUGHT, OVER }
enum class Air { NONE, JUMP, RAMP, FALL }
enum class Swipe { LEFT, RIGHT, UP, DOWN }
enum class Event { COIN, JUMP, LAND, LANE, STUMBLE, CRASH, POWER, RAMP, TRICK, MISS, OVER }

class Entity(val kind: Kind, val lane: Int, var z: Float) {
    var y = 0f
    var vz = 0f
    var variant = 0
    var power = Power.TURBO
    var used = false
    var dead = false
}

class Popup(val text: String, val color: Int) {
    var age = 0f
}

/**
 * All the rules of the game, with no Android code in it. Distances are metres, times are seconds.
 * The road runs along z; the skater's z is [distance]. Lanes are 0 (left), 1, 2 (right).
 */
class World(seed: Long = System.nanoTime()) {
    companion object {
        const val LANE_W = 2.4f
        const val GRAVITY = 30f
        const val JUMP_V = 8.6f
        const val SPRING_V = 13.2f
        const val RAMP_V = 11f
        const val RAMP_G = 16f
        const val RAMP_LEN = 3f
        const val RAMP_H = 1f
        const val CAR_SPEED = 7f
        const val CAR_HALF_LEN = 2.1f
        const val CAR_H = 1.3f
        const val FLY_Y = 3.4f
        const val SAFE_GAP = 8f
        const val DANGER_GAP = 4.5f
        const val START_GAP = 2.6f
        const val STUMBLE_TIME = 0.9f
        const val SPAWN_AHEAD = 130f
        const val MAX_TRICKS_PER_AIR = 3
        const val SLOW_MO = 0.45f

        fun laneX(lane: Int): Float = (lane - 1) * LANE_W
    }

    private var rnd = Random(seed)

    var phase = Phase.TITLE; private set
    var paused = false
    var time = 0f; private set
    var distance = 0f; private set
    var speed = 0f; private set
    var coins = 0; private set
    var best = 0
    var newBest = false; private set
    val score: Int get() = distance.toInt() + coins * 10

    // The skater.
    var lane = 1; private set
    var x = 0f; private set
    var y = 0f; private set
    var vy = 0f; private set
    var onGround = true; private set
    var air = Air.NONE; private set
    var stumbleT = 0f; private set
    var graceT = 0f; private set
    private var prevLane = 1
    private var jumpBuffer = 0f
    private var fastDrop = false

    // Power-ups.
    var turboT = 0f; private set
    var springT = 0f; private set
    var wingsT = 0f; private set

    // The cyclist: how many metres behind the skater he is.
    var gap = START_GAP; private set
    var caughtT = 0f; private set

    // Tricks.
    var trickWindow = false; private set
    var featured = Shape.CIRCLE; private set
    var tricksThisAir = 0; private set
    var trickCombo = 0; private set
    var trickAnim: Shape? = null; private set
    var trickAnimT = 0f; private set
    var timeScale = 1f; private set

    val entities = ArrayList<Entity>()
    val popups = ArrayList<Popup>()
    val events = ArrayList<Event>()

    private var nextSlotZ = 0f
    private var nextCarAt = 0f
    private var nextRampZ = 0f
    private var nextPowerZ = 0f
    private var rampClearUntil = 0f
    private var nextManholeZ = 0f

    val difficulty: Float get() = min(1f, distance / 3000f)
    private val baseSpeed: Float get() = 11f + 15f * (1f - exp(-distance / 2600f))

    fun start() {
        phase = Phase.RUNNING
        paused = false
        time = 0f; distance = 0f; coins = 0; newBest = false
        lane = 1; prevLane = 1; x = 0f; y = 0f; vy = 0f; onGround = true; air = Air.NONE
        stumbleT = 0f; graceT = 0f; jumpBuffer = 0f; fastDrop = false
        turboT = 0f; springT = 0f; wingsT = 0f
        gap = START_GAP; caughtT = 0f
        trickWindow = false; tricksThisAir = 0; trickCombo = 0; trickAnim = null; timeScale = 1f
        entities.clear(); popups.clear(); events.clear()
        // The cyclist starts right behind; nothing to trip on until he has dropped back a little.
        nextSlotZ = 50f
        nextCarAt = 25f
        nextRampZ = 110f
        nextPowerZ = 150f
        rampClearUntil = 0f
        nextManholeZ = 0f
        speed = baseSpeed
    }

    fun toTitle() {
        phase = Phase.TITLE
        entities.clear(); popups.clear()
    }

    // ---- Input ----

    fun swipe(dir: Swipe) {
        if (phase != Phase.RUNNING || paused) return
        when (dir) {
            Swipe.LEFT -> changeLane(-1)
            Swipe.RIGHT -> changeLane(1)
            Swipe.UP -> jump()
            Swipe.DOWN -> if (!onGround && wingsT <= 0f && air != Air.RAMP) {
                fastDrop = true
                vy = min(vy, -12f)
            }
        }
    }

    private fun changeLane(d: Int) {
        val to = lane + d
        if (to < 0 || to > 2) return
        prevLane = lane
        lane = to
        events += Event.LANE
    }

    private fun jump() {
        if (wingsT > 0f) return
        if (!onGround) {
            jumpBuffer = 0.15f
            return
        }
        vy = if (springT > 0f) SPRING_V else JUMP_V
        onGround = false
        air = Air.JUMP
        fastDrop = false
        events += Event.JUMP
    }

    /** A shape was traced. Returns true when it turned into a trick. */
    fun trick(shape: Shape?): Boolean {
        if (phase != Phase.RUNNING || !trickWindow) return false
        if (shape == null) {
            events += Event.MISS
            return false
        }
        if (tricksThisAir >= MAX_TRICKS_PER_AIR) return false
        tricksThisAir++
        trickCombo++
        val bonus = min(20, (trickCombo - 1) * 2)
        val reward = shape.coins * (if (shape == featured) 2 else 1) + bonus
        coins += reward
        trickAnim = shape
        trickAnimT = 0f
        popups += Popup("${shape.label}  +$reward", if (shape == featured) 0xFFFFE14D.toInt() else 0xFFFFFFFF.toInt())
        if (trickCombo > 1) popups += Popup("COMBO x$trickCombo", 0xFFFF7AD9.toInt())
        var next = featured
        while (next == featured) next = Shape.entries[rnd.nextInt(Shape.entries.size)]
        featured = next
        events += Event.TRICK
        return true
    }

    // ---- Simulation ----

    fun update(dtReal: Float) {
        val dt = min(dtReal, 0.1f)
        for (i in popups.indices.reversed()) {
            popups[i].age += dt
            if (popups[i].age > 1.3f) popups.removeAt(i)
        }
        if (paused) return
        if (phase == Phase.TITLE || phase == Phase.OVER) {
            time += dt
            if (phase == Phase.TITLE) distance += 7f * dt
            return
        }
        val target = if (trickWindow && phase == Phase.RUNNING) SLOW_MO else 1f
        timeScale += (target - timeScale) * min(1f, dt * 12f)
        var remaining = dt * timeScale
        while (remaining > 0f) {
            val step = min(remaining, 1f / 120f)
            if (phase == Phase.RUNNING) stepRunning(step) else if (phase == Phase.CAUGHT) stepCaught(step)
            remaining -= step
        }
    }

    private fun stepRunning(dt: Float) {
        time += dt
        var mul = 1f
        if (turboT > 0f) mul *= 1.45f
        if (stumbleT > 0f) mul *= 0.55f + 0.45f * (1f - stumbleT / STUMBLE_TIME)
        speed = baseSpeed * mul
        distance += speed * dt

        // Sideways.
        val dx = laneX(lane) - x
        val maxStep = 15f * dt
        x += dx.coerceIn(-maxStep, maxStep)

        // Up and down.
        if (wingsT > 0f) {
            wingsT -= dt
            y += (FLY_Y - y) * min(1f, 6f * dt)
            vy = 0f
            onGround = false
            if (wingsT <= 0f) {
                wingsT = 0f
                air = Air.FALL
                graceT = max(graceT, 1.4f)
            }
        } else if (!onGround) {
            var g = if (air == Air.RAMP) RAMP_G else GRAVITY
            if (fastDrop) g *= 2.5f
            vy -= g * dt
            y += vy * dt
            if (y <= 0f) land()
        }

        if (turboT > 0f) turboT = max(0f, turboT - dt)
        if (springT > 0f) springT = max(0f, springT - dt)
        if (stumbleT > 0f) stumbleT = max(0f, stumbleT - dt)
        if (graceT > 0f) graceT = max(0f, graceT - dt)
        if (jumpBuffer > 0f) jumpBuffer -= dt
        if (trickAnim != null) {
            trickAnimT += dt
            if (trickAnimT > 0.5f) trickAnim = null
        }
        if (gap < SAFE_GAP) gap = min(SAFE_GAP, gap + (if (turboT > 0f) 2f else 0.55f) * dt)

        for (e in entities) {
            e.z += e.vz * dt
            if (e.z < distance - 14f) e.dead = true
        }
        collide()
        var i = entities.size - 1
        while (i >= 0) {
            if (entities[i].dead) entities.removeAt(i)
            i--
        }
        spawn()
    }

    private fun stepCaught(dt: Float) {
        time += dt
        caughtT += dt
        speed = max(0f, speed - 30f * dt)
        distance += speed * dt
        gap += (0.9f - gap) * min(1f, 5f * dt)
        if (!onGround) {
            vy -= GRAVITY * dt
            y += vy * dt
            if (y <= 0f) { y = 0f; vy = 0f; onGround = true }
        }
        for (e in entities) if (e.kind == Kind.CAR && !e.used) e.z += e.vz * dt
        if (caughtT > 1.5f) {
            phase = Phase.OVER
            if (score > best) {
                best = score
                newBest = true
            }
            events += Event.OVER
        }
    }

    private fun land() {
        y = 0f
        vy = 0f
        onGround = true
        fastDrop = false
        if (air == Air.RAMP) {
            trickWindow = false
            graceT = max(graceT, 0.7f)
            if (tricksThisAir == 0) trickCombo = 0
        }
        air = Air.NONE
        events += Event.LAND
        if (jumpBuffer > 0f) {
            jumpBuffer = 0f
            jump()
        }
    }

    private fun collide() {
        // By index: picking up wings adds a trail of coins to the list while we are walking it.
        var i = 0
        while (i < entities.size) {
            val e = entities[i++]
            if (e.dead || e.used) continue
            val dz = e.z - distance
            val dx = abs(x - laneX(e.lane))
            when (e.kind) {
                Kind.COIN -> if (abs(dz) < 1.1f && dx < 1.2f && abs(y + 0.8f - e.y) < 1.3f) {
                    e.dead = true
                    coins++
                    events += Event.COIN
                }
                Kind.POWER -> if (abs(dz) < 1.1f && dx < 1.2f && abs(y + 0.8f - e.y) < 1.5f) {
                    e.dead = true
                    grant(e.power)
                }
                Kind.MANHOLE -> if (abs(dz) < 0.6f && dx < 0.9f && onGround && graceT <= 0f) {
                    e.used = true
                    stumble()
                }
                Kind.RAMP -> if (onGround && wingsT <= 0f && dx < 1f && dz < -0.5f && dz > -RAMP_LEN) {
                    e.used = true
                    launch()
                }
                Kind.CAR -> if (abs(dz) < CAR_HALF_LEN + 0.35f && dx < 1.45f && y < CAR_H && graceT <= 0f) {
                    e.used = true
                    val swerving = abs(x - laneX(lane)) > 0.45f && e.lane == lane && prevLane != lane
                    if (swerving) {
                        // Clipped the side of a car while changing lanes: bounce back.
                        lane = prevLane
                        stumble()
                    } else {
                        events += Event.CRASH
                        caught()
                    }
                }
            }
            if (phase != Phase.RUNNING) return
        }
    }

    private fun grant(p: Power) {
        when (p) {
            Power.TURBO -> turboT = p.seconds
            Power.SPRING -> springT = p.seconds
            Power.WINGS -> {
                wingsT = p.seconds
                trickWindow = false
                air = Air.FALL
                onGround = false
                // A trail of coins up in the sky.
                var z = distance + 14f
                val end = distance + speed * (p.seconds - 1f)
                var l = lane
                var n = 0
                while (z < end) {
                    entities += Entity(Kind.COIN, l, z).also { it.y = FLY_Y + 0.8f }
                    z += 2.6f
                    if (++n % 7 == 0) l = (l + (if (rnd.nextBoolean()) 1 else 2)) % 3
                }
            }
        }
        popups += Popup(p.label, 0xFF7DF9FF.toInt())
        events += Event.POWER
    }

    private fun launch() {
        vy = RAMP_V
        onGround = false
        air = Air.RAMP
        fastDrop = false
        trickWindow = true
        tricksThisAir = 0
        featured = Shape.entries[rnd.nextInt(Shape.entries.size)]
        events += Event.RAMP
    }

    private fun stumble() {
        events += Event.STUMBLE
        if (gap < DANGER_GAP) {
            caught()
            return
        }
        gap = 2f
        stumbleT = STUMBLE_TIME
        graceT = max(graceT, 0.9f)
        trickCombo = 0
        popups += Popup("OUCH!", 0xFFFF5A4D.toInt())
    }

    private fun caught() {
        phase = Phase.CAUGHT
        caughtT = 0f
        trickWindow = false
        turboT = 0f; springT = 0f; wingsT = 0f
    }

    // ---- Level generation ----

    private fun spawn() {
        while (nextSlotZ < distance + SPAWN_AHEAD) {
            fillSlot(nextSlotZ)
            nextSlotZ += 14f + rnd.nextFloat() * 8f
        }
        if (distance >= nextCarAt) {
            spawnCars()
            // Cars all drive at one speed, so waves spawned this far apart in the skater's travel
            // also reach the skater this many seconds apart.
            val seconds = 2.3f - 1.25f * difficulty
            nextCarAt = distance + baseSpeed * seconds * (0.85f + rnd.nextFloat() * 0.4f)
        }
    }

    private fun spawnCars() {
        val two = rnd.nextFloat() < 0.25f + 0.4f * difficulty
        val first = rnd.nextInt(3)
        addCar(first)
        if (two) addCar((first + 1 + rnd.nextInt(2)) % 3)
    }

    private fun addCar(lane: Int) {
        entities += Entity(Kind.CAR, lane, distance + SPAWN_AHEAD).also {
            it.vz = -CAR_SPEED
            it.variant = rnd.nextInt(6)
        }
    }

    private fun fillSlot(z: Float) {
        val v = baseSpeed
        if (z < rampClearUntil) return
        if (z >= nextPowerZ) {
            entities += Entity(Kind.POWER, rnd.nextInt(3), z).also {
                it.y = 1f
                it.power = Power.entries[rnd.nextInt(Power.entries.size)]
            }
            nextPowerZ = z + 240f + rnd.nextFloat() * 160f
            return
        }
        val r = rnd.nextFloat()
        if (z >= nextRampZ && r < 0.55f) {
            val l = rnd.nextInt(3)
            entities += Entity(Kind.RAMP, l, z)
            // Coins along the flight path.
            val airTime = 2f * RAMP_V / RAMP_G
            for (i in 1..7) {
                val t = airTime * i / 8f
                entities += Entity(Kind.COIN, l, z + 0.6f + v * t).also {
                    it.y = 0.9f + RAMP_V * t - 0.5f * RAMP_G * t * t
                }
            }
            nextRampZ = z + 110f + rnd.nextFloat() * 90f
            rampClearUntil = z + v * 1.45f * airTime + 10f
            return
        }
        when {
            r < 0.36f && z >= nextManholeZ -> {
                // Leave room to land from one jump before the next has to start, even at turbo speed.
                nextManholeZ = z + v * 1.45f * (2f * JUMP_V / GRAVITY) + 8f
                val count = when {
                    difficulty > 0.15f && rnd.nextFloat() < 0.2f -> 3
                    rnd.nextFloat() < 0.4f -> 2
                    else -> 1
                }
                val first = rnd.nextInt(3)
                for (k in 0 until count) entities += Entity(Kind.MANHOLE, (first + k) % 3, z)
                if (rnd.nextFloat() < 0.6f) {
                    // An arc of coins that a well-timed jump collects.
                    val airTime = 2f * JUMP_V / GRAVITY
                    for (i in 0 until 5) {
                        val t = airTime * (i + 0.5f) / 5f
                        entities += Entity(Kind.COIN, first, z + v * (t - airTime / 2f)).also {
                            it.y = 0.8f + JUMP_V * t - 0.5f * GRAVITY * t * t
                        }
                    }
                }
            }
            r < 0.8f -> {
                val l = rnd.nextInt(3)
                val n = 5 + rnd.nextInt(4)
                for (i in 0 until n) entities += Entity(Kind.COIN, l, z + i * 2.2f).also { it.y = 0.8f }
            }
        }
    }
}
