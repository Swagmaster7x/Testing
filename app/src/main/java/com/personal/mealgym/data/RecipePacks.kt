package com.personal.mealgym.data

import android.content.ContentResolver
import android.net.Uri
import androidx.room.withTransaction
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.seed.SeedIngredient
import com.personal.mealgym.data.seed.SeedParser
import com.personal.mealgym.data.seed.SeedRecipe
import com.personal.mealgym.domain.Quantities
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

/** A recipe pack: the same shape as the app's seed.json, but only the "recipes" part is needed. */
@Serializable
data class RecipePack(
    val version: Int = 1,
    val recipes: List<SeedRecipe>,
)

data class PackImportResult(val added: Int, val skipped: Int)

/** Imports and exports recipe packs, so new recipes can be loaded on either phone without a rebuild. */
class RecipePacks(private val db: AppDatabase, private val contentResolver: ContentResolver) {
    private val json = Json {
        ignoreUnknownKeys = true
        prettyPrint = true
        encodeDefaults = false
    }

    fun decode(text: String): RecipePack {
        val pack = json.decodeFromString(RecipePack.serializer(), text)
        require(pack.recipes.isNotEmpty()) { "That file has no recipes in it." }
        return pack
    }

    fun encode(pack: RecipePack): String = json.encodeToString(RecipePack.serializer(), pack)

    /** Adds the pack's recipes, skipping any whose name is already in the library. */
    suspend fun add(pack: RecipePack): PackImportResult {
        val dao = db.recipeDao()
        var added = 0
        var skipped = 0
        db.withTransaction {
            for (r in pack.recipes) {
                if (r.name.isBlank() || dao.byName(r.name.trim()) != null) {
                    skipped++
                    continue
                }
                // Packs are the household's own recipes: no seed key, so app updates never touch them.
                val id = dao.insert(SeedParser.recipeOf(r).copy(seedKey = null, name = r.name.trim(), isUserCreated = true))
                dao.insertIngredients(SeedParser.ingredientsOf(r, id, emptySet()))
                added++
            }
        }
        return PackImportResult(added, skipped)
    }

    /** The recipes made on this phone (added by hand or from packs), as a pack. */
    suspend fun ownRecipes(): RecipePack {
        val dao = db.recipeDao()
        val profiles: Map<Long, Profile> = db.profileDao().all().associateBy { it.id }
        val recipes = dao.allRecipes().filter { it.isUserCreated }.sortedBy { it.name.lowercase() }
        return RecipePack(
            recipes = recipes.map { r ->
                val ingredients = dao.getWithIngredients(r.id)?.ingredients.orEmpty().sortedBy { it.position }
                SeedRecipe(
                    key = "U${r.id}",
                    name = r.name,
                    mealType = r.mealType,
                    cuisineTags = r.cuisineTags,
                    servings = r.servings,
                    servingSize = r.servingSizeText,
                    nutrition = r.nutritionText,
                    mealPrep = r.isMealPrep,
                    ingredients = ingredients.map { i ->
                        SeedIngredient(
                            quantity = i.quantity?.let(Quantities::format),
                            unit = i.unit,
                            name = i.name,
                            note = i.note,
                            section = i.storeSection,
                        )
                    },
                    steps = r.steps,
                    volumeTip = r.volumeTip,
                    protein = r.protein,
                    swaps = r.proteinSwaps.filter { it.useRecipeKey == null },
                    onlyFor = r.onlyForProfileId?.let { profiles[it]?.name?.lowercase() },
                )
            },
        )
    }

    suspend fun importFrom(uri: Uri): PackImportResult = withContext(Dispatchers.IO) {
        val stream = contentResolver.openInputStream(uri) ?: error("Couldn't open the file.")
        add(decode(stream.bufferedReader().use { it.readText() }))
    }

    suspend fun exportTo(uri: Uri): Int = withContext(Dispatchers.IO) {
        val pack = ownRecipes()
        require(pack.recipes.isNotEmpty()) { "There are no recipes of your own to export yet." }
        val stream = contentResolver.openOutputStream(uri, "wt") ?: error("Couldn't open the file for writing.")
        stream.bufferedWriter().use { it.write(encode(pack)) }
        pack.recipes.size
    }
}
