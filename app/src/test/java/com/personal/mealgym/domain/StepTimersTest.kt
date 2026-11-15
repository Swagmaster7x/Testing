package com.personal.mealgym.domain

import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

class StepTimersTest {

    private fun times(step: String) = StepTimers.find(step).map { it.seconds to it.upToSeconds }

    @Test
    fun findsTheTimesAStepMentions() {
        assertEquals(listOf(1800 to null), times("Cover and simmer 30 minutes."))
        assertEquals(listOf(900 to null), times("Toss the potatoes with 1 tbsp oil and salt on a sheet pan. Roast for 15 minutes."))
        // A range runs for the shorter time, which is when to start checking.
        assertEquals(listOf(1200 to 1500), times("Roast for 20 to 25 minutes until the chicken reaches 165°F."))
        assertEquals(listOf(180 to 240), times("Cook for 3–4 minutes a side."))
        assertEquals(listOf(3600 to null), times("Bake, covered, for 1 hour, until the filling is 160°F."))
        assertEquals(listOf(30 to null), times("Add the garlic for 30 seconds."))
        assertEquals(listOf(30 to 45), times("Reheat for 30 to 45 seconds in the microwave."))
        // Two different times in one step are two timers; the same time twice is one.
        assertEquals(
            listOf(480 to 600, 60 to null),
            times("Cook the onions for 8 to 10 minutes until soft and golden. Add the garlic and the ginger for 1 minute."),
        )
        assertEquals(listOf(300 to null), times("Simmer for 5 minutes. Rest for 5 minutes."))
        assertEquals(listOf(120 to 180), times("Fry for 2 to 3 minutes until the whites are set (a minute longer for firm yolks)."))
    }

    @Test
    fun leavesOutWhatIsNotATimer() {
        // Amounts next to a time, temperatures, and storage.
        assertEquals(listOf(900 to null), times("Simmer the quinoa in 1 1/2 cups of water, covered, for 15 minutes."))
        assertEquals(emptyList<Pair<Int, Int?>>(), times("Heat the oven to 425°F."))
        assertEquals(emptyList<Pair<Int, Int?>>(), times("Keeps 4 days in the fridge."))
        assertEquals(emptyList<Pair<Int, Int?>>(), times("Refrigerate overnight."))
        // Too short to bother with, and too long to be a kitchen timer.
        assertEquals(emptyList<Pair<Int, Int?>>(), times("Warm the tortillas for 15 seconds a side."))
        assertEquals(emptyList<Pair<Int, Int?>>(), times("Cook on low for 8 hours."))
        assertEquals(listOf(7200 to null), times("Refrigerate for at least 2 hours."))
        // A marinade's lower end is fine; "1 to 24 hours" starts at an hour.
        assertEquals(listOf(3600 to null), times("Marinate for 1 to 24 hours.").map { it.first to null })
    }

    @Test
    fun labelsReadLikeAKitchenTimer() {
        assertEquals("15 min", StepTime(900).label)
        assertEquals("30 sec", StepTime(30).label)
        assertEquals("1 hr", StepTime(3600).label)
        assertEquals("1 hr 30 min", StepTime(5400).label)
        assertEquals("15 min timer", StepTime(900).buttonText)
        assertEquals("20 min timer (up to 25 min)", StepTime(1200, 1500).buttonText)
        assertEquals("30 sec timer (up to 45 sec)", StepTime(30, 45).buttonText)
        // A range that crosses into the next unit still reads right.
        assertEquals("1 hr timer (up to 1 hr 15 min)", StepTimers.find("Simmer for 60 to 75 minutes.").single().buttonText)
        assertEquals("45 sec timer (up to 1 min 30 sec)", StepTimers.find("Warm for 45 to 90 seconds.").single().buttonText)
    }

    @Test
    fun timesWrittenOtherWaysAreReadWhole() {
        // Hours and minutes together are one time, not two.
        assertEquals(listOf(5400 to null), times("Bake for 1 hour 30 minutes."))
        assertEquals(listOf(4500 to null), times("Roast for 1 hour and 15 minutes."))
        // Fractions and decimals aren't read as their last digit.
        assertEquals(listOf(5400 to null), times("Simmer for 1 1/2 hours."))
        assertEquals(listOf(1800 to null), times("Rest for 1/2 hour."))
        assertEquals(listOf(150 to null), times("Cook 2.5 minutes a side."))
        assertEquals("2 min 30 sec", StepTime(150).label)
        // A fraction that belongs to an amount, not the time.
        assertEquals(listOf(300 to null), times("Add 1/2 cup of stock and cook 5 minutes."))
    }

    @Test
    fun aRecipeScalesToWholeServings() {
        assertEquals(listOf(0.5 to 2, 1.0 to 4, 1.5 to 6, 2.0 to 8, 3.0 to 12), StepTimers.scaleChoices(4))
        assertEquals(listOf(1.0 to 1, 2.0 to 2, 3.0 to 3, 4.0 to 4), StepTimers.scaleChoices(1))
        assertEquals(listOf(0.5 to 1, 1.0 to 2, 1.5 to 3, 2.0 to 4, 3.0 to 6), StepTimers.scaleChoices(2))
        assertEquals(listOf(1.0 to 3, 2.0 to 6, 3.0 to 9, 4.0 to 12), StepTimers.scaleChoices(3))
        assertEquals(listOf(0.5 to 3, 1.0 to 6, 1.5 to 9, 2.0 to 12, 3.0 to 18), StepTimers.scaleChoices(6))
        // Scaled amounts still read as kitchen fractions.
        assertEquals("3/4", Quantities.format(1.5 * 0.5))
        assertEquals("3", Quantities.format(1.5 * 2))
        assertEquals("1 1/2", Quantities.format(0.5 * 3))
    }

    @Test
    fun mostCookedRecipesInTheLibraryGetATimerSomewhere() {
        val seed = Json.parseToJsonElement(File("src/store/assets/seed.json").readText()).jsonObject
        val cooked = seed.getValue("recipes").jsonArray.map { it.jsonObject }.filter { it.getValue("mealType").jsonPrimitive.content != "SNACK" }
        val withTimer = cooked.count { r -> r.getValue("steps").jsonArray.any { StepTimers.find(it.jsonPrimitive.content).isNotEmpty() } }
        assertTrue("$withTimer of ${cooked.size}", withTimer > cooked.size * 0.85)
        // And no step offers a silly one.
        for (r in cooked) for (step in r.getValue("steps").jsonArray) {
            for (t in StepTimers.find(step.jsonPrimitive.content)) assertTrue(step.jsonPrimitive.content, t.seconds in 30..7200)
        }
    }
}
