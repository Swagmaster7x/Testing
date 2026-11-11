package com.personal.mealgym.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.MutablePreferences
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.personal.mealgym.data.db.ProteinTag
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.serialization.Serializable
import java.time.DayOfWeek

@Serializable
enum class WeightUnit(val label: String) { LB("lb"), KG("kg") }

/** The two sides of the app. Profile ids match the Profile table. */
object Profiles {
    const val SWAG = 1L
    const val ASHLEY = 2L

    fun other(id: Long): Long = if (id == SWAG) ASHLEY else SWAG

    fun name(id: Long): String = if (id == ASHLEY) "Ashley" else "Swag"

    fun sideName(id: Long): String = "${name(id)}'s Side"

    fun defaultTrainingDays(id: Long): Set<DayOfWeek> =
        if (id == ASHLEY) {
            setOf(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY)
        } else {
            setOf(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY)
        }
}

/** Recipe filters that stay set until changed ("Not chicken" stays on until turned off). */
data class LibraryFilter(
    val protein: ProteinTag? = null,
    val cuisine: String? = null,
    val notChicken: Boolean = false,
)

/** One side's settings, plus the shared pantry list. */
data class AppSettings(
    val profileId: Long = Profiles.SWAG,
    val trainingWeekdays: Set<DayOfWeek> = Profiles.defaultTrainingDays(profileId),
    val showNutrition: Boolean = true,
    val showHalfPlateTip: Boolean = true,
    val weightUnit: WeightUnit = WeightUnit.LB,
    /** Items ticked as "always have"; left off the shopping list. Shared by both sides. */
    val pantryStaples: Set<String> = emptySet(),
    /** Sparkles and shimmer (Ashley's Side). */
    val motion: Boolean = true,
    /** Sound when a timer ends. On by default for Swag (as before), off for Ashley. */
    val chime: Boolean = profileId == Profiles.SWAG,
    /** Daily creatine checkbox on Today (Ashley's Side, off by default). */
    val creatineReminder: Boolean = false,
    val filter: LibraryFilter = LibraryFilter(),
    /** Shopping list shows both sides' meals. */
    val shoppingBoth: Boolean = false,
)

/** Which side this phone opens to. */
sealed interface SideState {
    data object Loading : SideState
    data object NotChosen : SideState
    data class Chosen(val profileId: Long) : SideState
}

val Context.settingsDataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

/**
 * Settings live in DataStore. Swag's side keeps the key names from version 1 so nothing is
 * lost on upgrade; Ashley's keys carry a "p2_" prefix.
 */
class SettingsRepository(private val store: DataStore<Preferences>) {

    private object Shared {
        val pantryStaples = stringSetPreferencesKey("pantry_staples")
        val activeProfile = longPreferencesKey("active_profile")
    }

    private fun name(base: String, profileId: Long) = if (profileId == Profiles.SWAG) base else "p${profileId}_$base"
    private fun bool(base: String, p: Long) = booleanPreferencesKey(name(base, p))
    private fun string(base: String, p: Long) = stringPreferencesKey(name(base, p))
    private fun stringSet(base: String, p: Long) = stringSetPreferencesKey(name(base, p))

    val sideState: Flow<SideState> = store.data.map { p ->
        p[Shared.activeProfile]?.let { SideState.Chosen(it) } ?: SideState.NotChosen
    }

    suspend fun setActiveProfile(profileId: Long) = store.edit { it[Shared.activeProfile] = profileId }

    /** Shows the door chooser again on next composition. */
    suspend fun clearActiveProfile() = store.edit { it.remove(Shared.activeProfile) }

    fun settings(profileId: Long): Flow<AppSettings> = store.data.map { read(it, profileId) }

    suspend fun current(profileId: Long): AppSettings = settings(profileId).first()

    private fun read(p: Preferences, id: Long): AppSettings {
        val defaults = AppSettings(profileId = id)
        return AppSettings(
            profileId = id,
            trainingWeekdays = p[stringSet("training_weekdays", id)]
                ?.mapNotNull { runCatching { DayOfWeek.valueOf(it) }.getOrNull() }
                ?.toSet()
                ?: defaults.trainingWeekdays,
            showNutrition = p[bool("show_nutrition", id)] ?: defaults.showNutrition,
            showHalfPlateTip = p[bool("show_half_plate_tip", id)] ?: defaults.showHalfPlateTip,
            weightUnit = p[string("weight_unit", id)]?.let { runCatching { WeightUnit.valueOf(it) }.getOrNull() }
                ?: defaults.weightUnit,
            pantryStaples = p[Shared.pantryStaples] ?: emptySet(),
            motion = p[bool("motion", id)] ?: defaults.motion,
            chime = p[bool("chime", id)] ?: defaults.chime,
            creatineReminder = p[bool("creatine_reminder", id)] ?: defaults.creatineReminder,
            filter = LibraryFilter(
                protein = p[string("filter_protein", id)]?.let { runCatching { ProteinTag.valueOf(it) }.getOrNull() },
                cuisine = p[string("filter_cuisine", id)],
                notChicken = p[bool("filter_not_chicken", id)] ?: false,
            ),
            shoppingBoth = p[bool("shopping_both", id)] ?: false,
        )
    }

    suspend fun setTrainingWeekdays(profileId: Long, days: Set<DayOfWeek>) =
        store.edit { it[stringSet("training_weekdays", profileId)] = days.map { d -> d.name }.toSet() }

    suspend fun setShowNutrition(profileId: Long, show: Boolean) = store.edit { it[bool("show_nutrition", profileId)] = show }

    suspend fun setShowHalfPlateTip(profileId: Long, show: Boolean) =
        store.edit { it[bool("show_half_plate_tip", profileId)] = show }

    suspend fun setWeightUnit(profileId: Long, unit: WeightUnit) = store.edit { it[string("weight_unit", profileId)] = unit.name }

    suspend fun setMotion(profileId: Long, on: Boolean) = store.edit { it[bool("motion", profileId)] = on }

    suspend fun setChime(profileId: Long, on: Boolean) = store.edit { it[bool("chime", profileId)] = on }

    suspend fun setCreatineReminder(profileId: Long, on: Boolean) = store.edit { it[bool("creatine_reminder", profileId)] = on }

    suspend fun setShoppingBoth(profileId: Long, both: Boolean) = store.edit { it[bool("shopping_both", profileId)] = both }

    suspend fun setFilter(profileId: Long, filter: LibraryFilter) = store.edit { p ->
        p.setOrRemove(string("filter_protein", profileId), filter.protein?.name)
        p.setOrRemove(string("filter_cuisine", profileId), filter.cuisine)
        p[bool("filter_not_chicken", profileId)] = filter.notChicken
    }

    suspend fun setPantryStaples(items: Set<String>) = store.edit { it[Shared.pantryStaples] = items }

    suspend fun addPantryStaples(items: Collection<String>) = store.edit { p ->
        p[Shared.pantryStaples] = (p[Shared.pantryStaples] ?: emptySet()) + items
    }

    suspend fun setPantryStaple(item: String, alwaysHave: Boolean) = store.edit { p ->
        val current = p[Shared.pantryStaples] ?: emptySet()
        p[Shared.pantryStaples] = if (alwaysHave) current + item.trim() else current - item
    }

    /** Restores one side's settings from a backup (and the shared pantry list when given). */
    suspend fun replace(settings: AppSettings, includePantry: Boolean) = store.edit { p ->
        val id = settings.profileId
        p[stringSet("training_weekdays", id)] = settings.trainingWeekdays.map { it.name }.toSet()
        p[bool("show_nutrition", id)] = settings.showNutrition
        p[bool("show_half_plate_tip", id)] = settings.showHalfPlateTip
        p[string("weight_unit", id)] = settings.weightUnit.name
        p[bool("motion", id)] = settings.motion
        p[bool("chime", id)] = settings.chime
        p[bool("creatine_reminder", id)] = settings.creatineReminder
        p[bool("shopping_both", id)] = settings.shoppingBoth
        p.setOrRemove(string("filter_protein", id), settings.filter.protein?.name)
        p.setOrRemove(string("filter_cuisine", id), settings.filter.cuisine)
        p[bool("filter_not_chicken", id)] = settings.filter.notChicken
        if (includePantry) p[Shared.pantryStaples] = settings.pantryStaples
    }

    private fun <T> MutablePreferences.setOrRemove(key: Preferences.Key<T>, value: T?) {
        if (value == null) remove(key) else this[key] = value
    }
}
