package com.personal.mealgym

import com.personal.mealgym.data.seed.SeedParser
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File
import java.time.DayOfWeek

/** The store edition's seed: shared recipes and starter plans, nothing personal. */
class StoreSeedTest {
    private val text = File("src/store/assets/seed.json").readText()
    private val seed = SeedParser.parse(text)

    @Test
    fun startsWithNobody() {
        assertTrue(seed.profiles.isEmpty())
        assertTrue(seed.workoutDays.isEmpty())
        assertTrue(seed.dailyGuide.isEmpty())
    }

    @Test
    fun hasNothingPersonal() {
        for (word in listOf("Ashley", "Swag", "Starbucks")) assertFalse(word, text.contains(word))
        assertTrue(seed.recipes.none { it.onlyFor != null })
        assertTrue(seed.recipes.size >= 30)
    }

    @Test
    fun everyStarterPlanIsComplete() {
        assertEquals(listOf("full-body-3", "upper-lower-4", "glute-3"), seed.workoutTemplates.map { it.key })
        for (t in seed.workoutTemplates) {
            assertTrue(t.name, t.days.isNotEmpty() && t.tips.isNotEmpty() && t.description.isNotBlank())
            assertEquals(t.name, t.days.map { it.order }, (1..t.days.size).toList())
            assertTrue(t.name, t.defaultDays.all { d -> DayOfWeek.entries.any { it.name == d } })
            assertTrue(t.name, t.days.all { d -> d.exercises.isNotEmpty() })
        }
    }

    @Test
    fun recipeKeysAreUnique() {
        assertEquals(seed.recipes.size, seed.recipes.map { it.key }.toSet().size)
    }
}
