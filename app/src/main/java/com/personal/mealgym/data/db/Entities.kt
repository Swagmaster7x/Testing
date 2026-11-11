package com.personal.mealgym.data.db

import androidx.room.ColumnInfo
import androidx.room.Embedded
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import androidx.room.Relation
import kotlinx.serialization.Serializable

@Serializable
enum class MealType { BREAKFAST, LUNCH, DINNER, SOUP, SNACK }

/** SNACK is only used on Ashley's Side. */
@Serializable
enum class MealSlot { BREAKFAST, LUNCH, DINNER, SNACK }

/** The main protein of a recipe, for filtering and "Not chicken". */
@Serializable
enum class ProteinTag { BEEF, PORK, CHICKEN, TURKEY, FISH, EGG, VEGETARIAN }

@Serializable
enum class StoreSection { PROTEIN, PRODUCE_FROZEN, CARBS, PANTRY }

@Serializable
enum class Feeling { GREAT, FINE, ROUGH }

/** One person's side of the app: its own theme, plans, schedule and history. */
@Serializable
@Entity
data class Profile(
    @PrimaryKey val id: Long,
    val name: String,
    /** "IRON" (Swag's dark fantasy) or "GLAM" (Ashley's Y2K glam). */
    val themeKey: String,
)

/** Small key/value facts about the database itself, such as which seed level is installed. */
@Entity
data class Meta(
    @PrimaryKey val key: String,
    val value: String,
)

/** "Make it with..." an alternative main protein. */
@Serializable
data class ProteinSwap(
    val label: String,
    val protein: ProteinTag,
    /** Ingredient name to replace, e.g. "chicken breast". */
    val replace: String? = null,
    /** What goes in instead, e.g. "flank steak, sliced thin". */
    val with: String? = null,
    /** Cooking change, e.g. "Roast 10–12 minutes." */
    val note: String? = null,
    /** Instead of swapping, point to another recipe (seed key), e.g. Carne guisada. */
    val useRecipeKey: String? = null,
)

/**
 * A recipe. [nutritionText] is display-only reference text: it is never parsed or added up.
 */
@Serializable
@Entity
data class Recipe(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    /** Seed id such as "L1"; null for recipes made on the phone. */
    val seedKey: String? = null,
    val name: String,
    val mealType: MealType,
    val cuisineTags: List<String> = emptyList(),
    val servings: Int = 1,
    val servingSizeText: String = "",
    val nutritionText: String? = null,
    val steps: List<String> = emptyList(),
    val volumeTip: String? = null,
    val isMealPrep: Boolean = false,
    val isUserCreated: Boolean = false,
    val protein: ProteinTag? = null,
    @ColumnInfo(defaultValue = "0") val isFavorite: Boolean = false,
    /** "Hide for now": rested, not deleted. */
    @ColumnInfo(defaultValue = "0") val isHidden: Boolean = false,
    @ColumnInfo(defaultValue = "[]") val proteinSwaps: List<ProteinSwap> = emptyList(),
    /** Index into [proteinSwaps] currently in use, or null for the original. */
    val activeSwap: Int? = null,
    /** Shown only on this side's pickers (e.g. Ashley's coffee-shop breakfasts); null = both sides. */
    val onlyForProfileId: Long? = null,
) {
    /** How many meal slots one cook fills ("makes 4"). Single-serving prep recipes are made as a batch of 4. */
    val slotsPerCook: Int get() = if (servings > 1) servings else 4
}

/** [quantity] is for the whole recipe, not per serving. */
@Serializable
@Entity(
    foreignKeys = [
        ForeignKey(entity = Recipe::class, parentColumns = ["id"], childColumns = ["recipeId"], onDelete = ForeignKey.CASCADE),
    ],
    indices = [Index("recipeId")],
)
data class Ingredient(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val recipeId: Long,
    val position: Int,
    val name: String,
    val quantity: Double? = null,
    val unit: String? = null,
    val note: String? = null,
    val storeSection: StoreSection,
    val isPantryStaple: Boolean = false,
)

/** One row per filled slot. [date] is ISO yyyy-MM-dd. */
@Serializable
@Entity(
    foreignKeys = [
        ForeignKey(entity = Recipe::class, parentColumns = ["id"], childColumns = ["recipeId"], onDelete = ForeignKey.CASCADE),
    ],
    indices = [Index(value = ["profileId", "date", "slot"], unique = true), Index("recipeId")],
)
data class MealPlanEntry(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val slot: MealSlot,
    val recipeId: Long,
    @ColumnInfo(defaultValue = "1") val profileId: Long = 1,
)

/**
 * Remembers ticked shopping items for a week. [listKey] says which list: "p1" or "p2" for one
 * side's own list, "both" for the shared one.
 */
@Serializable
@Entity(primaryKeys = ["listKey", "weekStartDate", "ingredientKey"])
data class ShoppingCheck(
    val weekStartDate: String,
    val ingredientKey: String,
    val checked: Boolean,
    @ColumnInfo(defaultValue = "p1") val listKey: String = "p1",
)

@Serializable
@Entity(indices = [Index("profileId")])
data class WorkoutDay(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    /** 1 to N, the position in the cycle. */
    val dayOrder: Int,
    val name: String,
    @ColumnInfo(defaultValue = "1") val profileId: Long = 1,
    /** Badge text for the week view, e.g. "Glutes + hams". */
    val shortName: String? = null,
)

/** Exercises sharing a [groupLabel] (A, B, C...) are a superset. The first alternative is the default swap. */
@Serializable
@Entity(
    foreignKeys = [
        ForeignKey(entity = WorkoutDay::class, parentColumns = ["id"], childColumns = ["workoutDayId"], onDelete = ForeignKey.CASCADE),
    ],
    indices = [Index("workoutDayId")],
)
data class Exercise(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val workoutDayId: Long,
    val position: Int,
    val name: String,
    val setsText: String,
    val repsText: String,
    val groupLabel: String,
    val alternatives: List<String> = emptyList(),
    val note: String? = null,
) {
    /** Number of tick boxes to show; falls back to 3 if [setsText] isn't a plain number. */
    val setCount: Int get() = setsText.trim().toIntOrNull()?.coerceIn(1, 10) ?: 3
}

/**
 * Written at check-in. The day's order and name are copied in so history and the cycle
 * still read correctly if the workout day is later edited or removed.
 */
@Serializable
@Entity(indices = [Index("date"), Index("profileId")])
data class WorkoutSession(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val workoutDayId: Long?,
    val dayOrder: Int,
    val dayName: String,
    val feeling: Feeling,
    val note: String? = null,
    @ColumnInfo(defaultValue = "1") val profileId: Long = 1,
)

/** Optional per-exercise lifting note; drives "Last time: 135 x 8". Weight on the bar only. */
@Serializable
@Entity(
    foreignKeys = [
        ForeignKey(entity = WorkoutSession::class, parentColumns = ["id"], childColumns = ["sessionId"], onDelete = ForeignKey.CASCADE),
    ],
    indices = [Index("sessionId"), Index("exerciseNameUsed")],
)
data class SetLog(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val sessionId: Long,
    val exerciseId: Long?,
    val exerciseNameUsed: String,
    val weight: Double? = null,
    val reps: Int? = null,
    @ColumnInfo(defaultValue = "1") val profileId: Long = 1,
)

@Serializable
@Entity(indices = [Index("date")])
data class SaunaLog(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val minutes: Int,
    @ColumnInfo(defaultValue = "1") val profileId: Long = 1,
)

/** A ticked daily supplement checkbox (Ashley's optional creatine reminder). */
@Serializable
@Entity(indices = [Index(value = ["profileId", "date", "item"], unique = true)])
data class SupplementLog(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val profileId: Long,
    val date: String,
    val item: String,
)

data class RecipeWithIngredients(
    @Embedded val recipe: Recipe,
    @Relation(parentColumn = "id", entityColumn = "recipeId")
    val ingredients: List<Ingredient>,
)
