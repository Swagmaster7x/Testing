package com.personal.mealgym.domain

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class SearchTest {
    @Test
    fun accentsAndCaseDoNotMatter() {
        assertEquals("golabki: cabbage rolls", Search.fold("Gołąbki: cabbage rolls"))
        assertEquals("cilbir", Search.fold("Çılbır"))
        assertEquals("smorrebrod", Search.fold("Smørrebrød"))
        assertEquals("bauernfruhstuck", Search.fold("Bauernfrühstück"))
        assertEquals("jalapeno", Search.fold("jalapeño"))
        assertTrue(Search.matches("Gołąbki: cabbage rolls with beef and rice (Polish)", "golabki"))
        assertTrue(Search.matches("Tortilla española", "ESPANOLA"))
        assertTrue(Search.matches("Beef köfte with bulgur pilaf", "kofte"))
        assertTrue(Search.matches("Mangú with eggs", "mangu"))
        assertTrue(Search.matches("Mangu with eggs", "mangú"))
        assertTrue(Search.matches("anything", "  "))
        assertFalse(Search.matches("Chicken adobo", "pork"))
    }
}
