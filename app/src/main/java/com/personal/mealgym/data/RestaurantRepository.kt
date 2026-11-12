package com.personal.mealgym.data

import android.content.Context
import com.personal.mealgym.domain.Avoid
import com.personal.mealgym.domain.Foods
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

/** What assets/restaurants.json holds: places people crave, the better choices there, and recipes here that taste like them. */
@Serializable
data class RestaurantFile(
    /** When the figures were gathered, for the note under them ("November 2026"). */
    val asOf: String = "",
    val restaurants: List<Restaurant> = emptyList(),
) {
    /** "Like the chili at Wendy's" lines for one recipe, for its own page. */
    fun inspirations(seedKey: String?): List<String> {
        if (seedKey == null) return emptyList()
        return restaurants.flatMap { place ->
            place.copycats.filter { it.recipe == seedKey }.map { "Like ${it.like} at ${place.name}" }
        }
    }
}

@Serializable
data class Restaurant(
    val key: String,
    val name: String,
    /** What the place is known for ("Burgers and breakfast"). */
    val kind: String = "",
    /** Words for the "Check current nutrition" web search. */
    val search: String = "",
    val picks: List<MenuPick> = emptyList(),
    val tips: List<String> = emptyList(),
    val copycats: List<Copycat> = emptyList(),
)

/** One of the better things to order. [about] is free text because published figures vary ("roughly 320 to 390 cal"). */
@Serializable
data class MenuPick(
    val name: String,
    val about: String? = null,
    val note: String? = null,
    /** [Avoid] names for the main ingredients we know about. */
    val has: List<String> = emptyList(),
) {
    /**
     * Main ingredients only, from our notes and the item's name. Never the restaurant's full
     * allergen list: the app says so wherever it uses this.
     */
    val contains: Set<Avoid> get() = Avoid.parse(has) + Foods.inName(name)
}

/** A recipe in the library (by seed key) and the menu item it is like ("the Egg McMuffin"). */
@Serializable
data class Copycat(val recipe: String, val like: String)

/** Bundled restaurant notes. Nothing is fetched: the app stays offline and the figures carry a date. */
class RestaurantRepository(private val context: Context) {

    val file: RestaurantFile by lazy {
        runCatching {
            parse(context.assets.open(ASSET).bufferedReader().use { it.readText() })
        }.getOrDefault(RestaurantFile())
    }

    val all: List<Restaurant> get() = file.restaurants

    fun byKey(key: String): Restaurant? = all.firstOrNull { it.key == key }

    companion object {
        const val ASSET = "restaurants.json"

        /** The tag on recipes written as home versions of restaurant food. */
        const val COPYCAT_TAG = "Copycat"

        private val json = Json { ignoreUnknownKeys = true }

        fun parse(text: String): RestaurantFile = json.decodeFromString(RestaurantFile.serializer(), text)

        /** A web search for the place's own nutrition information, opened in the phone's browser. */
        fun searchUrl(restaurant: Restaurant): String {
            val words = restaurant.search.ifBlank { "${restaurant.name} nutrition" }
            return "https://www.google.com/search?q=" + java.net.URLEncoder.encode("$words information", "UTF-8")
        }
    }
}
