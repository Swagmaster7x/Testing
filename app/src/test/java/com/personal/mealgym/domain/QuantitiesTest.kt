package com.personal.mealgym.domain

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class QuantitiesTest {

    @Test
    fun parsesWholeDecimalAndFractions() {
        assertEquals(2.0, Quantities.parse("2")!!, 1e-9)
        assertEquals(1.5, Quantities.parse("1.5")!!, 1e-9)
        assertEquals(0.5, Quantities.parse("1/2")!!, 1e-9)
        assertEquals(1.0 / 3, Quantities.parse("1/3")!!, 1e-9)
        assertEquals(1.75, Quantities.parse("1 3/4")!!, 1e-9)
        assertEquals(2.5, Quantities.parse("2,5")!!, 1e-9)
    }

    @Test
    fun unreadableTextIsNull() {
        assertNull(Quantities.parse(null))
        assertNull(Quantities.parse(""))
        assertNull(Quantities.parse("a few"))
        assertNull(Quantities.parse("1/0"))
    }

    @Test
    fun formatsAsKitchenFractions() {
        assertEquals("1/2", Quantities.format(0.5))
        assertEquals("1 1/2", Quantities.format(1.5))
        assertEquals("1/3", Quantities.format(1.0 / 3))
        assertEquals("2/3", Quantities.format(2.0 / 3))
        assertEquals("3/4", Quantities.format(0.75))
        assertEquals("1/8", Quantities.format(0.125))
        assertEquals("4", Quantities.format(4.0))
        assertEquals("1", Quantities.format(0.999))
        assertEquals("1.2", Quantities.format(1.2))
    }

    @Test
    fun roundTrips() {
        listOf("1/4", "1/2", "3/4", "1 1/2", "2", "1/3", "2 2/3").forEach { text ->
            assertEquals(text, Quantities.format(Quantities.parse(text)!!))
        }
    }
}
