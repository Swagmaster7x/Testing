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

/**
 * Settings defaults from before they were stored per person. Profile 1 is the first person on
 * the phone and keeps the version-1 key names. People added later have their training days
 * and chime written when they're created, so these defaults only matter for the first two.
 */
object Profiles {
    const val FIRST = 1L

    fun defaultTrainingDays(id: Long): Set<DayOfWeek> =
        if (id == 2L) {
            setOf(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY)
        } else {
            setOf(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY)
        }

    fun defaultChime(id: Long): Boolean = id == FIRST
}

/** Recipe filters that stay set until changed ("Not chicken" stays on until turned off). */
data class LibraryFilter(
    val protein: ProteinTag? = null,
    val cuisine: String? = null,
    val notChicken: Boolean = false,
)

/** One person's settings, plus the shared pantry list. */
data class AppSettings(
    val profileId: Long = Profiles.FIRST,
    val trainingWeekdays: Set<DayOfWeek> = Profiles.defaultTrainingDays(profileId),
    val showNutrition: Boolean = true,
    val showHalfPlateTip: Boolean = true,
    val weightUnit: WeightUnit = WeightUnit.LB,
    /** Items ticked as "always have"; left off the shopping list. Shared by both sides. */
    val pantryStaples: Set<String> = emptySet(),
    /** Sparkles and shimmer (the glam look). */
    val motion: Boolean = true,
    /** Sound when a timer ends. It always buzzes. */
    val chime: Boolean = Profiles.defaultChime(profileId),
    /** Daily creatine checkbox on Today (off by default). */
    val creatineReminder: Boolean = false,
    val filter: LibraryFilter = LibraryFilter(),
    /** Shopping list shows everyone's meals on this phone. */
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
 * Settings live in DataStore. Profile 1 keeps the key names from version 1 so nothing is
 * lost on upgrade; everyone else's keys carry a "p{id}_" prefix.
 */
class SettingsRepository(private val store: DataStore<Preferences>) {

    private object Shared {
        val pantryStaples = stringSetPreferencesKey("pantry_staples")
        val activeProfile = longPreferencesKey("active_profile")
        val adsRemoved = booleanPreferencesKey("ads_removed")
    }

    private fun name(base: String, profileId: Long) = if (profileId == Profiles.FIRST) base else "p${profileId}_$base"
    private fun bool(base: String, p: Long) = booleanPreferencesKey(name(base, p))
    private fun string(base: String, p: Long) = stringPreferencesKey(name(base, p))
    private fun stringSet(base: String, p: Long) = stringSetPreferencesKey(name(base, p))

    val sideState: Flow<SideState> = store.data.map { p ->
        p[Shared.activeProfile]?.let { SideState.Chosen(it) } ?: SideState.NotChosen
    }

    suspend fun setActiveProfile(profileId: Long) = store.edit { it[Shared.activeProfile] = profileId }

    /** Store edition: Remove ads was bought (kept here so ads don't flash in before Google Play answers). */
    val adsRemoved: Flow<Boolean> = store.data.map { it[Shared.adsRemoved] ?: false }

    suspend fun setAdsRemoved(removed: Boolean) = store.edit { it[Shared.adsRemoved] = removed }

    /** Shows the door chooser again on next composition. */
    suspend fun clearActiveProfile() = store.edit { it.remove(Shared.activeProfile) }

    /** Forgets one person's settings, so a new person given the same id starts fresh. */
    suspend fun forget(profileId: Long) = store.edit { p ->
        PER_PERSON.forEach { base ->
            p.remove(stringSetPreferencesKey(name(base, profileId)))
            p.remove(booleanPreferencesKey(name(base, profileId)))
            p.remove(stringPreferencesKey(name(base, profileId)))
        }
    }

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

    private companion object {
        val PER_PERSON = listOf(
            "training_weekdays", "show_nutrition", "show_half_plate_tip", "weight_unit", "motion", "chime",
            "creatine_reminder", "filter_protein", "filter_cuisine", "filter_not_chicken", "shopping_both",
        )
    }
}
