package com.personal.mealgym.data.db

import androidx.room.Embedded
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import androidx.room.Relation
import kotlinx.serialization.Serializable

@Serializable
enum class MealType { BREAKFAST, LUNCH, DINNER, SOUP }

@Serializable
enum class MealSlot { BREAKFAST, LUNCH, DINNER }

@Serializable
enum class StoreSection { PROTEIN, PRODUCE_FROZEN, CARBS, PANTRY }

@Serializable
enum class Feeling { GREAT, FINE, ROUGH }

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
    indices = [Index(value = ["date", "slot"], unique = true), Index("recipeId")],
)
data class MealPlanEntry(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val slot: MealSlot,
    val recipeId: Long,
)

/** Remembers ticked shopping items for a week. */
@Serializable
@Entity(primaryKeys = ["weekStartDate", "ingredientKey"])
data class ShoppingCheck(
    val weekStartDate: String,
    val ingredientKey: String,
    val checked: Boolean,
)

@Serializable
@Entity
data class WorkoutDay(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    /** 1 to N, the position in the cycle. */
    val dayOrder: Int,
    val name: String,
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
@Entity(indices = [Index("date")])
data class WorkoutSession(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val workoutDayId: Long?,
    val dayOrder: Int,
    val dayName: String,
    val feeling: Feeling,
    val note: String? = null,
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
)

@Serializable
@Entity(indices = [Index("date")])
data class SaunaLog(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val minutes: Int,
)

data class RecipeWithIngredients(
    @Embedded val recipe: Recipe,
    @Relation(parentColumn = "id", entityColumn = "recipeId")
    val ingredients: List<Ingredient>,
)
