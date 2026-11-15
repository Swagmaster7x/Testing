package com.personal.mealgym.cook

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.TestScope
import kotlinx.coroutines.test.advanceTimeBy
import kotlinx.coroutines.test.runCurrent
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

@OptIn(ExperimentalCoroutinesApi::class)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35])
class CookTimerControllerTest {
    private val context: Context = ApplicationProvider.getApplicationContext()

    @Test
    fun severalTimersRunAtOnceAndFinishInTheirOwnTime() {
        val scope = TestScope()
        val timers = CookTimerController(context, scope)
        val rice = timers.start("Step 2 · Rice bowls", 900, chime = false, now = 1_000)
        val garlic = timers.start("Step 3 · Rice bowls", 30, chime = true, now = 1_000)
        assertEquals(listOf(901_000L, 31_000L), timers.timers.value.map { it.endAtMillis })
        assertTrue(timers.timers.value.none { it.done })

        scope.advanceTimeBy(30_000)
        scope.runCurrent()
        // The short one is done and stays listed until it's cleared; the long one is still going.
        assertEquals(mapOf(rice to false, garlic to true), timers.timers.value.associate { it.id to it.done })
        timers.dismiss(garlic)
        assertEquals(listOf(rice), timers.timers.value.map { it.id })

        scope.advanceTimeBy(870_000)
        scope.runCurrent()
        assertTrue(timers.timers.value.single().done)
        timers.dismiss(rice)
        assertTrue(timers.timers.value.isEmpty())
    }

    @Test
    fun stoppingARunningTimerMeansItNeverGoesOff() {
        val scope = TestScope()
        val timers = CookTimerController(context, scope)
        val id = timers.start("Step 4 · Stew", 60, chime = false)
        timers.dismiss(id)
        scope.advanceTimeBy(120_000)
        scope.runCurrent()
        assertTrue(timers.timers.value.isEmpty())
        // Ids aren't reused, so a new timer can't be mistaken for the stopped one.
        assertTrue(timers.start("Step 5 · Stew", 60, chime = false) != id)
    }
}
