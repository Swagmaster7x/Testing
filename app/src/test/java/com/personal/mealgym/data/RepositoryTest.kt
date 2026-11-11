package com.personal.mealgym.data

import android.content.Context
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Feeling
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.SetLog
import com.personal.mealgym.data.seed.SeedRepository
import com.personal.mealgym.ui.label
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import java.io.File
import java.time.DayOfWeek
import java.time.LocalDate

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35])
class RepositoryTest {

    private val context: Context = ApplicationProvider.getApplicationContext()
    private val scopes = mutableListOf<CoroutineScope>()
    private val dbs = mutableListOf<AppDatabase>()

    private lateinit var db: AppDatabase
    private lateinit var settings: SettingsRepository
    private lateinit var meals: MealRepository
    private lateinit var gym: GymRepository
    private lateinit var recipes: Map<String, Recipe>

    // 2026-11-09 is a Monday.
    private val mon = LocalDate.of(2026, 11, 9)

    private fun newDb() = Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java)
        .allowMainThreadQueries()
        .build()
        .also { dbs += it }

    private fun newSettings(): SettingsRepository {
        val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO).also { scopes += it }
        val file = File(context.filesDir, "settings-${System.nanoTime()}.preferences_pb")
        return SettingsRepository(PreferenceDataStoreFactory.create(scope = scope) { file })
    }

    @Before
    fun setUp() = runBlocking {
        db = newDb()
        settings = newSettings()
        meals = MealRepository(db, settings)
        gym = GymRepository(db)
        SeedRepository(context).sync(db, settings, freshDatabase = true)
        recipes = db.recipeDao().allRecipes().associateBy { it.seedKey!! }
    }

    @After
    fun tearDown() {
        dbs.forEach { it.close() }
        scopes.forEach { it.cancel() }
    }

    @Test
    fun seedingLoadsRecipesWorkoutsAndStaples() = runBlocking {
        assertEquals(19 + 8, recipes.values.count { it.onlyForProfileId == null })
        assertEquals(9, recipes.values.count { it.onlyForProfileId == Profiles.ASHLEY })
        assertEquals(listOf("Glutes and hamstrings", "Upper body plus glutes", "Glutes and quads"), db.workoutDao().getDays(Profiles.ASHLEY).map { it.name })
        val days = db.workoutDao().getDays(Profiles.SWAG)
        assertEquals(listOf(1, 2, 3, 4), days.map { it.dayOrder }.sorted())
        assertEquals(31 + 16, db.workoutDao().allExercises().size)
        val s = settings.current(Profiles.SWAG)
        assertEquals(20 + 5, s.pantryStaples.size)
        assertEquals(setOf(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY), s.trainingWeekdays)

        val guisado = meals.getRecipe(recipes.getValue("L1").id)!!
        val thighs = guisado.ingredients.first { it.name == "chicken thighs" }
        assertEquals(2.0, thighs.quantity!!, 0.0)
        assertEquals("lb", thighs.unit)
        assertTrue(guisado.ingredients.first { it.name == "olive oil" }.isPantryStaple)
    }

    @Test
    fun mealPrepFillsFourLunchesAndIsBoughtOnce() = runBlocking {
        val guisado = recipes.getValue("L1")
        assertEquals(4, meals.fillBatch(Profiles.SWAG, mon, MealSlot.LUNCH, guisado))
        meals.setSlot(Profiles.SWAG, mon, MealSlot.DINNER, recipes.getValue("S1").id)

        val plan = meals.planForWeek(Profiles.SWAG, mon).first()
        assertEquals(
            listOf(mon, mon.plusDays(1), mon.plusDays(2), mon.plusDays(3)).map { it.toString() },
            plan.filter { it.slot == MealSlot.LUNCH }.map { it.date }.sorted(),
        )

        val week = meals.shoppingWeek(Profiles.SWAG, mon, both = false).first()
        val items = week.result.sections.flatMap { it.items }.associateBy { it.key }
        // Pollo guisado (2 lb, cooked once for 4 lunches) + sancocho (2 lb) = 4 lb.
        assertEquals("4 lb", items.getValue("chicken thigh").amountText)
        assertNull("olive oil is a pantry staple", items["olive oil"])
        assertTrue("olive oil" in week.result.skippedAlwaysHave)
        assertEquals(
            listOf("Protein", "Produce and Frozen", "Carbs", "Pantry"),
            week.result.sections.map { it.section.label },
        )
    }

    @Test
    fun fillBatchStopsAtTheEndOfTheWeekAndSkipsTakenSlots() = runBlocking {
        val guisado = recipes.getValue("L1")
        val saturday = mon.plusDays(5)
        assertEquals(2, meals.fillBatch(Profiles.SWAG, saturday, MealSlot.LUNCH, guisado))

        meals.setSlot(Profiles.SWAG, mon.plusDays(1), MealSlot.LUNCH, recipes.getValue("L4").id)
        assertEquals(4, meals.fillBatch(Profiles.SWAG, mon, MealSlot.LUNCH, guisado))
        val lunches = meals.planForWeek(Profiles.SWAG, mon).first().filter { it.slot == MealSlot.LUNCH }.associate { it.date to it.recipeId }
        assertEquals(recipes.getValue("L4").id, lunches[mon.plusDays(1).toString()])
        assertEquals(guisado.id, lunches[mon.plusDays(4).toString()])
    }

    @Test
    fun repeatLastWeekOnlyFillsEmptySlots() = runBlocking {
        val lastMon = mon.minusDays(7)
        meals.setSlot(Profiles.SWAG, lastMon, MealSlot.BREAKFAST, recipes.getValue("B1").id)
        meals.setSlot(Profiles.SWAG, lastMon, MealSlot.DINNER, recipes.getValue("D1").id)
        meals.setSlot(Profiles.SWAG, mon, MealSlot.DINNER, recipes.getValue("D2").id)

        assertEquals(1, meals.repeatLastWeek(Profiles.SWAG, mon))

        val plan = meals.planForWeek(Profiles.SWAG, mon).first().associate { it.slot to it.recipeId }
        assertEquals(recipes.getValue("B1").id, plan[MealSlot.BREAKFAST])
        assertEquals(recipes.getValue("D2").id, plan[MealSlot.DINNER])
    }

    @Test
    fun deletingARecipeClearsItsPlannedSlots() = runBlocking {
        val tacos = recipes.getValue("B1")
        meals.setSlot(Profiles.SWAG, mon, MealSlot.BREAKFAST, tacos.id)
        meals.deleteRecipe(tacos.id)
        assertTrue(meals.planForWeek(Profiles.SWAG, mon).first().isEmpty())
    }

    @Test
    fun lastTimeFollowsTheExerciseNameActuallyDone() = runBlocking {
        val day1 = db.workoutDao().getDays(Profiles.SWAG).first { it.dayOrder == 1 }
        val bench = db.workoutDao().allExercises().first { it.name == "Barbell bench press" }
        gym.saveSession(Profiles.SWAG, mon, day1, Feeling.FINE, null, listOf(SetLog(sessionId = 0, exerciseId = bench.id, exerciseNameUsed = "Barbell bench press", weight = 135.0, reps = 8)))
        gym.saveSession(Profiles.SWAG, mon.plusDays(7), day1, Feeling.GREAT, "Busy gym", listOf(SetLog(sessionId = 0, exerciseId = bench.id, exerciseNameUsed = "Smith machine bench", weight = 115.0, reps = 10)))

        val logs = gym.latestLogs(Profiles.SWAG).first()
        assertEquals(135.0, logs.getValue("barbell bench press").weight!!, 0.0)
        assertEquals(10, logs.getValue("smith machine bench").reps)
    }

    @Test
    fun exportThenImportRestoresEverything() = runBlocking {
        meals.fillBatch(Profiles.SWAG, mon, MealSlot.LUNCH, recipes.getValue("L2"))
        meals.setChecked("p1", mon, "chicken breast", true)
        val day2 = db.workoutDao().getDays(Profiles.SWAG).first { it.dayOrder == 2 }
        gym.saveSession(Profiles.SWAG, mon, day2, Feeling.ROUGH, "Short on sleep", emptyList())
        gym.logSauna(Profiles.SWAG, mon, 15)
        settings.setShowNutrition(Profiles.SWAG, false)
        settings.setTrainingWeekdays(Profiles.SWAG, setOf(DayOfWeek.WEDNESDAY))

        val backup = BackupManager(db, settings, context.contentResolver)
        val text = backup.encode(backup.snapshot())

        val otherDb = newDb()
        val otherSettings = newSettings()
        val restorer = BackupManager(otherDb, otherSettings, context.contentResolver)
        restorer.restore(restorer.decode(text))

        val before = backup.snapshot().copy(exportedAt = "")
        val after = restorer.snapshot().copy(exportedAt = "")
        assertEquals(before, after)
        assertEquals(setOf(DayOfWeek.WEDNESDAY), otherSettings.current(Profiles.SWAG).trainingWeekdays)
        assertEquals(false, otherSettings.current(Profiles.SWAG).showNutrition)
    }

    @Test(expected = IllegalArgumentException::class)
    fun importRejectsOtherFiles() {
        BackupManager(db, settings, context.contentResolver).decode(
            """{"app":"something.else","formatVersion":1,"exportedAt":"","settings":{"trainingWeekdays":[],"showNutrition":true,"showHalfPlateTip":true,"weightUnit":"LB","pantryStaples":[]},"recipes":[],"ingredients":[],"mealPlan":[],"shoppingChecks":[],"workoutDays":[],"exercises":[],"workoutSessions":[],"setLogs":[],"saunaLogs":[]}""",
        )
    }

    @Test
    fun upgradeAddsNewSeedButNotDeletedRecipes() = runBlocking {
        // A phone on the first release: Swag's content only, and he deleted the smash-burger bowl.
        val oldDb = newDb()
        val oldSettings = newSettings()
        val seedRepo = SeedRepository(context)
        val v1 = seedRepo.seed.copy(
            version = 1,
            recipes = seedRepo.seed.recipes.filter { it.since == 1 },
            workoutDays = seedRepo.seed.workoutDays.filter { it.since == 1 },
        )
        for (r in v1.recipes) {
            val id = oldDb.recipeDao().insert(com.personal.mealgym.data.seed.SeedParser.recipeOf(r).copy(protein = null))
            oldDb.recipeDao().insertIngredients(com.personal.mealgym.data.seed.SeedParser.ingredientsOf(r, id, emptySet()))
        }
        for (d in v1.workoutDays) {
            val dayId = oldDb.workoutDao().insertDay(com.personal.mealgym.data.seed.SeedParser.dayOf(d))
            oldDb.workoutDao().insertExercises(com.personal.mealgym.data.seed.SeedParser.exercisesOf(d, dayId))
        }
        oldDb.metaDao().put(com.personal.mealgym.data.db.Meta("seedLevel", "1"))
        oldDb.recipeDao().delete(oldDb.recipeDao().bySeedKey("D5")!!.id)

        seedRepo.sync(oldDb, oldSettings, freshDatabase = false)

        assertNull("deleted recipes stay deleted", oldDb.recipeDao().bySeedKey("D5"))
        assertEquals(4, oldDb.workoutDao().getDays(Profiles.SWAG).size)
        assertEquals(3, oldDb.workoutDao().getDays(Profiles.ASHLEY).size)
        assertTrue(oldDb.recipeDao().bySeedKey("SB1") != null)

        // Running again changes nothing.
        seedRepo.sync(oldDb, oldSettings, freshDatabase = false)
        assertEquals(3, oldDb.workoutDao().getDays(Profiles.ASHLEY).size)
    }

    @Test
    fun upgradeTagsOldRecipesWithProteinAndSwaps() = runBlocking {
        val oldDb = newDb()
        val seedRepo = SeedRepository(context)
        for (r in seedRepo.seed.recipes.filter { it.since == 1 }) {
            oldDb.recipeDao().insert(com.personal.mealgym.data.seed.SeedParser.recipeOf(r).copy(protein = null, proteinSwaps = emptyList()))
        }
        oldDb.metaDao().put(com.personal.mealgym.data.db.Meta("seedLevel", "1"))
        seedRepo.sync(oldDb, newSettings(), freshDatabase = false)
        val teriyaki = oldDb.recipeDao().bySeedKey("L2")!!
        assertEquals(com.personal.mealgym.data.db.ProteinTag.CHICKEN, teriyaki.protein)
        assertEquals(2, teriyaki.proteinSwaps.size)
        assertTrue(oldDb.recipeDao().bySeedKey("D10") != null)
    }

    @Test
    fun aProteinSwapChangesTheShoppingList() = runBlocking {
        val teriyaki = recipes.getValue("L2")
        meals.fillBatch(Profiles.SWAG, mon, MealSlot.LUNCH, teriyaki)
        meals.setActiveSwap(teriyaki.id, 0)
        val names = meals.shoppingWeek(Profiles.SWAG, mon, both = false).first().result.sections.flatMap { it.items }.map { it.name.lowercase() }
        assertTrue("flank steak, sliced thin" in names)
        assertTrue("chicken breast" !in names)
    }

    @Test
    fun recipePacksAddNewRecipesAndSkipDuplicates() = runBlocking {
        val packs = RecipePacks(db, context.contentResolver)
        val text = """{"version":1,"recipes":[
            {"key":"X1","name":"Shrimp tacos","mealType":"DINNER","cuisineTags":["Hispanic"],"servings":2,"servingSize":"3 tacos","protein":"FISH",
             "ingredients":[{"quantity":"1","unit":"lb","name":"shrimp","section":"PROTEIN"}],"steps":["Cook the shrimp.","Build tacos."]},
            {"key":"X2","name":"Beef and broccoli","mealType":"DINNER","cuisineTags":["Asian"],"servings":4,"servingSize":"1 bowl","steps":["x"]}
        ]}"""
        val result = packs.add(packs.decode(text))
        assertEquals(PackImportResult(added = 1, skipped = 1), result)
        val shrimp = db.recipeDao().byName("Shrimp tacos")!!
        assertTrue(shrimp.isUserCreated)
        assertNull(shrimp.seedKey)
        assertEquals(1.0, meals.getRecipe(shrimp.id)!!.ingredients.single().quantity!!, 0.0)

        // Exporting the phone's own recipes gives a pack that imports cleanly elsewhere.
        val exported = packs.encode(packs.ownRecipes())
        val otherDb = newDb()
        val again = RecipePacks(otherDb, context.contentResolver)
        assertEquals(1, again.add(again.decode(exported)).added)
        assertEquals(com.personal.mealgym.data.db.ProteinTag.FISH, otherDb.recipeDao().byName("Shrimp tacos")!!.protein)
    }
}
