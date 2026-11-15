package com.personal.mealgym.domain

import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

class MusclesTest {

    @Test
    fun specificNamesWinOverGeneralOnes() {
        assertEquals(MuscleGroup.CALVES, Muscles.groupOf("Leg-press calf raise"))
        assertEquals(MuscleGroup.CORE, Muscles.groupOf("Captain's chair leg raises"))
        assertEquals(MuscleGroup.BACK, Muscles.groupOf("Chest-supported row machine"))
        assertEquals(MuscleGroup.GLUTES_HAMS, Muscles.groupOf("Seated leg curl"))
        assertEquals(MuscleGroup.ARMS, Muscles.groupOf("Incline dumbbell curl"))
        assertEquals(MuscleGroup.SHOULDERS, Muscles.groupOf("Reverse pec-deck"))
        assertEquals(MuscleGroup.CHEST, Muscles.groupOf("Pec-deck"))
        assertEquals(MuscleGroup.SHOULDERS, Muscles.groupOf("Pike push-ups"))
        assertEquals(MuscleGroup.CHEST, Muscles.groupOf("Push-ups"))
        assertEquals(MuscleGroup.SHOULDERS, Muscles.groupOf("Seated dumbbell shoulder press"))
        assertEquals(MuscleGroup.CHEST, Muscles.groupOf("Incline dumbbell press"))
        assertEquals(MuscleGroup.QUADS, Muscles.groupOf("Bulgarian split squats"))
        assertEquals(MuscleGroup.GLUTES_HAMS, Muscles.groupOf("Dumbbell Romanian deadlift"))
        assertEquals(MuscleGroup.ARMS, Muscles.groupOf("Chair dips"))
        assertEquals(MuscleGroup.CHEST, Muscles.groupOf("Dips"))
        assertEquals(MuscleGroup.BACK, Muscles.groupOf("Rows"))
        assertEquals(MuscleGroup.OTHER, Muscles.groupOf("Jump rope"))
    }

    /** Every exercise and swap the app ships with, in either edition, and everything with form cues. */
    private fun shippedNames(): Set<String> {
        val names = LinkedHashSet<String>()
        fun walk(e: JsonElement) {
            when (e) {
                is JsonObject -> {
                    (e["exercises"] as? JsonArray)?.forEach { ex ->
                        val o = ex.jsonObject
                        o["name"]?.let { names += it.jsonPrimitive.content }
                        (o["swaps"] as? JsonArray)?.forEach { names += it.jsonPrimitive.content }
                    }
                    e.values.forEach(::walk)
                }
                is JsonArray -> e.forEach(::walk)
                else -> Unit
            }
        }
        walk(Json.parseToJsonElement(File("src/personal/assets/seed.json").readText()))
        walk(Json.parseToJsonElement(File("src/store/assets/seed.json").readText()))
        val demos = Json.parseToJsonElement(File("src/store/assets/demos/demos.json").readText()).jsonObject
        names += demos.getValue("cues").jsonObject.keys
        return names
    }

    @Test
    fun everyShippedExerciseHasAMuscleGroup() {
        val names = shippedNames()
        assertTrue("found ${names.size} names", names.size >= 100)
        val unsorted = names.filter { Muscles.groupOf(it) == MuscleGroup.OTHER }
        assertTrue("No muscle group for: $unsorted", unsorted.isEmpty())
        // Every group is used by something, so none of the rules is dead.
        assertEquals(MuscleGroup.entries.toSet() - MuscleGroup.OTHER, names.map(Muscles::groupOf).toSet())
    }
}
