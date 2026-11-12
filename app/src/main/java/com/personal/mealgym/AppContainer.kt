package com.personal.mealgym

import android.content.Context
import com.personal.mealgym.data.BackupManager
import com.personal.mealgym.data.DemoRepository
import com.personal.mealgym.data.GymRepository
import com.personal.mealgym.data.MealRepository
import com.personal.mealgym.data.PlanTransfer
import com.personal.mealgym.data.ProfileRepository
import com.personal.mealgym.data.Profiles
import com.personal.mealgym.data.RecipePacks
import com.personal.mealgym.data.SettingsRepository
import com.personal.mealgym.data.SideState
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.seed.SeedRepository
import com.personal.mealgym.data.settingsDataStore
import com.personal.mealgym.gym.RestTimerController
import com.personal.mealgym.gym.WorkoutDraftStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.mapNotNull
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.io.File
import java.time.LocalDate
import java.util.concurrent.atomic.AtomicBoolean

/** Hand-wired dependencies; small enough that no DI framework is needed. */
class AppContainer(context: Context) {
    private val appContext = context.applicationContext
    val appScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    private val databaseIsNew = AtomicBoolean(false)
    val db: AppDatabase = AppDatabase.build(appContext) { databaseIsNew.set(true) }
    val settings = SettingsRepository(appContext.settingsDataStore)
    val seed = SeedRepository(appContext)
    val meals = MealRepository(db, settings)
    val gym = GymRepository(db)
    val people = ProfileRepository(db, settings)
    val backup = BackupManager(db, settings, appContext.contentResolver) { seed.seed.defaultProfiles }
    val packs = RecipePacks(db, appContext.contentResolver)
    val planTransfer = PlanTransfer(db, packs, appContext.contentResolver)
    val demos = DemoRepository(appContext)
    val workoutDraft = WorkoutDraftStore(File(appContext.filesDir, "workout-draft.json"), appScope)
    val restTimer = RestTimerController(appContext, appScope)

    private val _ready = MutableStateFlow(false)

    /** False until the seed data is in place. */
    val ready: StateFlow<Boolean> = _ready.asStateFlow()

    /** Everyone on this phone. */
    val profiles: StateFlow<List<Profile>> = people.all.stateIn(appScope, SharingStarted.Eagerly, emptyList())

    /** What the app opens to: setup, a choice of person, or one person's screens. */
    val opening: StateFlow<Opening> = combine(_ready, settings.sideState, people.all) { ready, side, everyone ->
        val chosen = (side as? SideState.Chosen)?.profileId?.let { id -> everyone.firstOrNull { it.id == id } }
        when {
            !ready || side == SideState.Loading -> Opening.Loading
            chosen != null -> Opening.Open(chosen)
            everyone.isEmpty() -> Opening.FirstPerson
            everyone.size == 1 -> Opening.Open(everyone.first())
            else -> Opening.Choose(everyone)
        }
    }.distinctUntilChanged().stateIn(appScope, SharingStarted.Eagerly, Opening.Loading)

    /** The person whose screens are open. Screens are rebuilt when it changes. */
    fun currentProfile(): Profile = (opening.value as? Opening.Open)?.profile ?: Profile(Profiles.FIRST, "", Profile.THEME_IRON)

    fun currentProfileId(): Long = currentProfile().id

    /** One person, kept up to date when they're edited in Settings. */
    fun profile(id: Long): Flow<Profile> = profiles.mapNotNull { list -> list.firstOrNull { it.id == id } }.distinctUntilChanged()

    fun chooseSide(profileId: Long) {
        appScope.launch { settings.setActiveProfile(profileId) }
    }

    /** Today's date, updated when the clock passes midnight. */
    val today: StateFlow<LocalDate> = flow {
        while (true) {
            emit(LocalDate.now())
            delay(30_000)
        }
    }.distinctUntilChanged().stateIn(appScope, SharingStarted.WhileSubscribed(5_000), LocalDate.now())

    fun start() {
        appScope.launch {
            // Opening the database runs Room's onCreate (first launch) or the upgrade migration.
            db.recipeDao().count()
            runCatching { seed.sync(db, settings, freshDatabase = databaseIsNew.get()) }
            _ready.value = true
        }
    }

    val freeVolumeFoods: List<String> get() = seed.seed.freeVolumeFoods

    /** The person's starter plan's tips, or the general ones. */
    fun gymTips(profile: Profile): List<String> =
        seed.seed.template(profile.templateKey)?.tips?.takeIf { it.isNotEmpty() } ?: seed.seed.gymTips
}

sealed interface Opening {
    data object Loading : Opening

    /** Store edition, first launch: nobody has been set up yet. */
    data object FirstPerson : Opening

    data class Choose(val people: List<Profile>) : Opening

    data class Open(val profile: Profile) : Opening
}
