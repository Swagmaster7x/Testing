package com.personal.mealgym.ui

import com.personal.mealgym.data.db.Feeling
import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.SetLog
import com.personal.mealgym.data.db.StoreSection
import com.personal.mealgym.domain.Quantities

val MealSlot.label: String
    get() = when (this) {
        MealSlot.BREAKFAST -> "Breakfast"
        MealSlot.LUNCH -> "Lunch"
        MealSlot.DINNER -> "Dinner"
        MealSlot.SNACK -> "Snack"
    }

val MealType.label: String
    get() = when (this) {
        MealType.BREAKFAST -> "Breakfast"
        MealType.LUNCH -> "Lunch"
        MealType.DINNER -> "Dinner"
        MealType.SOUP -> "Soup"
        MealType.SNACK -> "Snack"
    }

val StoreSection.label: String
    get() = when (this) {
        StoreSection.PROTEIN -> "Protein"
        StoreSection.PRODUCE_FROZEN -> "Produce and Frozen"
        StoreSection.CARBS -> "Carbs"
        StoreSection.PANTRY -> "Pantry"
    }

val Feeling.label: String
    get() = when (this) {
        Feeling.GREAT -> "Great"
        Feeling.FINE -> "Fine"
        Feeling.ROUGH -> "Rough"
    }

/** Which recipe types can go in a slot. Soups fill lunch or dinner. */
fun MealSlot.accepts(type: MealType): Boolean = when (this) {
    MealSlot.BREAKFAST -> type == MealType.BREAKFAST
    MealSlot.LUNCH -> type == MealType.LUNCH || type == MealType.SOUP
    MealSlot.DINNER -> type == MealType.DINNER || type == MealType.SOUP
    MealSlot.SNACK -> type == MealType.SNACK
}

/** "2 lb chicken thighs, boneless skinless" */
fun Ingredient.displayLine(): String {
    val amount = listOfNotNull(quantity?.let { Quantities.format(it) }, unit?.takeIf { it.isNotBlank() })
        .joinToString(" ")
    val main = listOf(amount, name).filter { it.isNotBlank() }.joinToString(" ")
    return if (note.isNullOrBlank()) main else "$main, $note"
}

fun formatWeight(weight: Double): String =
    if (weight == Math.floor(weight)) weight.toLong().toString() else weight.toString()

/** "Last time: 135 x 8" */
fun SetLog.lastTimeText(): String? {
    val w = weight?.let { formatWeight(it) }
    val r = reps
    return when {
        w != null && r != null -> "Last time: $w x $r"
        w != null -> "Last time: $w"
        r != null -> "Last time: $r reps"
        else -> null
    }
}
