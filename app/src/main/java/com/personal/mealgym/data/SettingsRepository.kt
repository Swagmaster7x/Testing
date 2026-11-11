package com.personal.mealgym.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.personal.mealgym.domain.WorkoutCycle
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.serialization.Serializable
import java.time.DayOfWeek

@Serializable
enum class WeightUnit(val label: String) { LB("lb"), KG("kg") }

data class AppSettings(
    val trainingWeekdays: Set<DayOfWeek> = WorkoutCycle.defaultTrainingDays,
    val showNutrition: Boolean = true,
    val showHalfPlateTip: Boolean = true,
    val weightUnit: WeightUnit = WeightUnit.LB,
    /** Items ticked as "always have"; left off the shopping list. */
    val pantryStaples: Set<String> = emptySet(),
)

val Context.settingsDataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

class SettingsRepository(private val store: DataStore<Preferences>) {

    private object Keys {
        val trainingWeekdays = stringSetPreferencesKey("training_weekdays")
        val showNutrition = booleanPreferencesKey("show_nutrition")
        val showHalfPlateTip = booleanPreferencesKey("show_half_plate_tip")
        val weightUnit = stringPreferencesKey("weight_unit")
        val pantryStaples = stringSetPreferencesKey("pantry_staples")
    }

    val settings: Flow<AppSettings> = store.data.map { p ->
        AppSettings(
            trainingWeekdays = p[Keys.trainingWeekdays]
                ?.mapNotNull { runCatching { DayOfWeek.valueOf(it) }.getOrNull() }
                ?.toSet()
                ?: WorkoutCycle.defaultTrainingDays,
            showNutrition = p[Keys.showNutrition] ?: true,
            showHalfPlateTip = p[Keys.showHalfPlateTip] ?: true,
            weightUnit = p[Keys.weightUnit]?.let { runCatching { WeightUnit.valueOf(it) }.getOrNull() } ?: WeightUnit.LB,
            pantryStaples = p[Keys.pantryStaples] ?: emptySet(),
        )
    }

    suspend fun current(): AppSettings = settings.first()

    suspend fun setTrainingWeekdays(days: Set<DayOfWeek>) =
        store.edit { it[Keys.trainingWeekdays] = days.map { d -> d.name }.toSet() }

    suspend fun setShowNutrition(show: Boolean) = store.edit { it[Keys.showNutrition] = show }

    suspend fun setShowHalfPlateTip(show: Boolean) = store.edit { it[Keys.showHalfPlateTip] = show }

    suspend fun setWeightUnit(unit: WeightUnit) = store.edit { it[Keys.weightUnit] = unit.name }

    suspend fun setPantryStaples(items: Set<String>) = store.edit { it[Keys.pantryStaples] = items }

    suspend fun setPantryStaple(item: String, alwaysHave: Boolean) = store.edit { p ->
        val current = p[Keys.pantryStaples] ?: emptySet()
        p[Keys.pantryStaples] = if (alwaysHave) current + item.trim() else current - item
    }

    suspend fun replaceAll(settings: AppSettings) = store.edit { p ->
        p[Keys.trainingWeekdays] = settings.trainingWeekdays.map { it.name }.toSet()
        p[Keys.showNutrition] = settings.showNutrition
        p[Keys.showHalfPlateTip] = settings.showHalfPlateTip
        p[Keys.weightUnit] = settings.weightUnit.name
        p[Keys.pantryStaples] = settings.pantryStaples
    }
}
