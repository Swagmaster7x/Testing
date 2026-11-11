package com.personal.mealgym.data

import com.personal.mealgym.data.seed.SeedParser
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/** The bundled demos cover every exercise and swap in both plans. */
class DemoFileTest {
    private val assets = File("src/main/assets")
    private val demos = DemoRepository.parse(File(assets, "demos/demos.json").readText())
    private val seed = SeedParser.parse(File(assets, "seed.json").readText())

    private val allNames = seed.workoutDays.flatMap { day -> day.exercises.flatMap { listOf(it.name) + it.swaps } }.map { it.lowercase() }.toSet()

    @Test
    fun everyExerciseAndSwapHasPhotosOrCues() {
        val photos = demos.exercises.keys.map { it.lowercase() }.toSet()
        val cues = demos.cues.keys.map { it.lowercase() }.toSet()
        val missing = allNames - photos - cues
        assertTrue("No demo for: $missing", missing.isEmpty())
        assertEquals(setOf("dead hangs", "banded side steps", "cable side kick"), cues)
        assertTrue(demos.cues.values.all { it.size == 3 })
    }

    @Test
    fun everyBundledPhotoExistsAndIsSmall() {
        val ids = demos.exercises.values.map { it.id }.toSet()
        for (id in ids) for (frame in listOf("0.webp", "1.webp")) {
            val f = File(assets, "demos/$id/$frame")
            assertTrue("missing $f", f.exists())
            assertTrue("$f is ${f.length()} bytes", f.length() in 1..80_000)
            assertEquals("RIFF", String(f.readBytes().copyOfRange(0, 4)))
        }
        assertTrue(demos.exercises.values.all { it.instructions.isNotEmpty() })
        assertTrue(demos.source.contains("public domain"))
    }

    @Test
    fun aSwapGetsItsOwnDemo() {
        assertEquals("Barbell Hip Thrust", demos.exercises.getValue("Hip thrust").name)
        assertEquals("Thigh Abductor", demos.exercises.getValue("Hip abduction machine").name)
        assertEquals("Smith Machine Bench Press", demos.exercises.getValue("Smith machine bench").name)
    }
}
