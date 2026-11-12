package com.personal.mealgym.data

import com.personal.mealgym.domain.Avoid
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/** The bundled "What are you craving?" list: complete, worded as approximate, and safe to show. */
class RestaurantFileTest {
    private val text = File("src/main/assets/restaurants.json").readText()
    private val file = RestaurantRepository.parse(text)
    private val places = file.restaurants

    @Test
    fun theListIsComplete() {
        assertEquals(12, places.size)
        assertEquals(places.size, places.map { it.key }.toSet().size)
        assertEquals(places.size, places.map { it.name }.toSet().size)
        assertTrue("the figures carry a date", file.asOf.isNotBlank())
        for (p in places) {
            assertTrue(p.name, p.key.matches(Regex("[a-z-]+")))
            assertTrue(p.name, p.kind.isNotBlank())
            assertTrue("${p.name} picks", p.picks.size >= 2)
            assertTrue("${p.name} tips", p.tips.size >= 2)
            assertTrue("${p.name} has something to cook at home", p.copycats.isNotEmpty())
        }
    }

    @Test
    fun pickNamesAreUniqueWithinAPlace() {
        // They are list keys on the page.
        for (p in places) assertEquals(p.name, p.picks.size, p.picks.map { it.name }.toSet().size)
        for (p in places) assertEquals(p.name, p.copycats.size, p.copycats.map { it.recipe }.toSet().size)
    }

    @Test
    fun figuresAreWordedAsApproximate() {
        for (p in places) for (pick in p.picks) {
            val about = pick.about ?: continue
            assertTrue("${p.name}: ${pick.name}: $about", about.startsWith("about ") || about.startsWith("roughly "))
            assertTrue("${p.name}: ${pick.name}: $about", about.contains(" cal"))
        }
        // Nothing promises a food is free of anything.
        for (word in listOf("allergen-free", "gluten-free", "dairy-free", "nut-free", "safe for")) {
            assertFalse(word, text.contains(word, ignoreCase = true))
        }
    }

    @Test
    fun flagsAreRealAvoidNames() {
        val names = Avoid.entries.map { it.name }.toSet()
        for (p in places) for (pick in p.picks) {
            assertTrue("${p.name}: ${pick.name}: ${pick.has}", names.containsAll(pick.has))
        }
    }

    @Test
    fun mainIngredientsAreFlagged() {
        fun pick(place: String, name: String) = places.single { it.key == place }.picks.single { it.name == name }
        assertEquals(setOf(Avoid.EGG, Avoid.DAIRY, Avoid.GLUTEN, Avoid.PORK), pick("mcdonalds", "Egg McMuffin").contains)
        assertEquals(setOf(Avoid.BEEF, Avoid.GLUTEN), pick("mcdonalds", "Hamburger").contains)
        // From the name alone, with nothing listed.
        assertTrue(Avoid.SOY in pick("chipotle", "Sofritas (braised tofu)").contains)
        assertTrue(Avoid.BEEF in pick("chipotle", "Steak").contains)
        assertTrue(pick("chipotle", "Black beans").contains.isEmpty())
        // Every meat or fish dish says so, so a vegetarian sees it.
        val meatWords = Regex("chicken|turkey|beef|burger|steak|bacon|sausage|nugget|tender|drumstick|chili", RegexOption.IGNORE_CASE)
        for (p in places) for (item in p.picks.filter { meatWords.containsMatchIn(it.name) }) {
            assertTrue("${p.name}: ${item.name}", item.contains.any { it in Avoid.vegetarian })
        }
    }

    @Test
    fun aRecipeSaysWhatItIsLike() {
        assertEquals(listOf("Like the chili at Wendy's"), file.inspirations("D16"))
        assertEquals(
            listOf("Like a cheeseburger at McDonald's", "Like a cheeseburger at Wendy's"),
            file.inspirations("D5"),
        )
        assertTrue(file.inspirations("B1").isEmpty())
        assertTrue(file.inspirations(null).isEmpty())
        for (p in places) for (c in p.copycats) {
            assertTrue("${p.name}: ${c.like}", c.like.matches(Regex("(the|a|an|crispy) .+")))
        }
    }

    @Test
    fun theWebSearchIsEncoded() {
        val url = RestaurantRepository.searchUrl(places.single { it.key == "mcdonalds" })
        assertEquals("https://www.google.com/search?q=McDonald%27s+nutrition+information", url)
        for (p in places) assertFalse(p.name, RestaurantRepository.searchUrl(p).contains(' '))
    }
}
