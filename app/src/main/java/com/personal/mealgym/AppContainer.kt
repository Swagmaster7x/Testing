package com.personal.mealgym

import android.content.Context
import com.personal.mealgym.data.BackupManager
import com.personal.mealgym.data.GymRepository
import com.personal.mealgym.data.MealRepository
import com.personal.mealgym.data.Profiles
import com.personal.mealgym.data.RecipePacks
import com.personal.mealgym.data.SettingsRepository
import com.personal.mealgym.data.SideState
import com.personal.mealgym.data.db.AppDatabase
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
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flow
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
    val backup = BackupManager(db, settings, appContext.contentResolver)
    val packs = RecipePacks(db, appContext.contentResolver)
    val workoutDraft = WorkoutDraftStore(File(appContext.filesDir, "workout-draft.json"), appScope)
    val restTimer = RestTimerController(appContext, appScope)

    private val _ready = MutableStateFlow(false)

    /** False until the seed data is in place. */
    val ready: StateFlow<Boolean> = _ready.asStateFlow()

    /** Which side this phone shows, or that it still needs choosing. */
    val sideState: StateFlow<SideState> =
        settings.sideState.stateIn(appScope, SharingStarted.Eagerly, SideState.Loading)

    /** The side currently open. Screens are rebuilt when it changes, so they read it once. */
    fun currentProfileId(): Long = (sideState.value as? SideState.Chosen)?.profileId ?: Profiles.SWAG

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

    fun gymTips(profileId: Long): List<String> =
        if (profileId == Profiles.ASHLEY && seed.seed.gymTipsAshley.isNotEmpty()) seed.seed.gymTipsAshley else seed.seed.gymTips
}
