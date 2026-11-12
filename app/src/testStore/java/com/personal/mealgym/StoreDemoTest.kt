package com.personal.mealgym

import com.personal.mealgym.data.DemoRepository
import com.personal.mealgym.data.seed.SeedParser
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/** The store edition has no exercise photos: every move in its starter plans has written cues. */
class StoreDemoTest {
    private val assets = File("src/store/assets")
    private val demos = DemoRepository.parse(File(assets, "demos/demos.json").readText())
    private val seed = SeedParser.parse(File(assets, "seed.json").readText())

    @Test
    fun everyExerciseAndSwapHasThreeCues() {
        val names = seed.workoutTemplates.flatMap { t -> t.days.flatMap { d -> d.exercises.flatMap { listOf(it.name) + it.swaps } } }
        val cues = demos.cues.keys.map { it.lowercase() }.toSet()
        val missing = names.filter { it.lowercase() !in cues }
        assertTrue("No cues for: $missing", missing.isEmpty())
        assertTrue(demos.cues.values.all { lines -> lines.size == 3 && lines.all { it.endsWith(".") } })
    }

    @Test
    fun noPhotosAreBundled() {
        assertTrue(demos.exercises.isEmpty())
        val files = File(assets, "demos").listFiles().orEmpty().map { it.name }
        assertEquals(listOf("demos.json"), files)
    }
}
