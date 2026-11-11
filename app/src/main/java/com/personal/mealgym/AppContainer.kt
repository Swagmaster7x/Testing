package com.personal.mealgym

import android.content.Context
import com.personal.mealgym.data.BackupManager
import com.personal.mealgym.data.GymRepository
import com.personal.mealgym.data.MealRepository
import com.personal.mealgym.data.SettingsRepository
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
    val workoutDraft = WorkoutDraftStore(File(appContext.filesDir, "workout-draft.json"), appScope)
    val restTimer = RestTimerController(appContext, appScope)

    private val _ready = MutableStateFlow(false)

    /** False until first-launch seeding has finished. */
    val ready: StateFlow<Boolean> = _ready.asStateFlow()

    /** Today's date, updated when the clock passes midnight. */
    val today: StateFlow<LocalDate> = flow {
        while (true) {
            emit(LocalDate.now())
            delay(30_000)
        }
    }.distinctUntilChanged().stateIn(appScope, SharingStarted.WhileSubscribed(5_000), LocalDate.now())

    fun start() {
        appScope.launch {
            // Opening the database runs Room's onCreate on first launch; that is when the seed data goes in.
            db.recipeDao().count()
            if (databaseIsNew.get()) runCatching { seed.install(db, settings) }
            _ready.value = true
        }
    }

    val freeVolumeFoods: List<String> get() = seed.seed.freeVolumeFoods
    val gymTips: List<String> get() = seed.seed.gymTips
}
