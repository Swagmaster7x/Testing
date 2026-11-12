package com.personal.mealgym.data

import com.personal.mealgym.TestPeople
import android.content.Context
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Feeling
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Profile
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
import org.junit.Assert.assertFalse
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

    private fun builtInPeople() = SeedRepository(context).seed.defaultProfiles

    @After
    fun tearDown() {
        dbs.forEach { it.close() }
        scopes.forEach { it.cancel() }
    }

    @Test
    fun seedingLoadsRecipesWorkoutsAndStaples() = runBlocking {
        assertEquals(19 + 8, recipes.values.count { it.onlyForProfileId == null })
        assertEquals(9, recipes.values.count { it.onlyForProfileId == TestPeople.ASHLEY })
        assertEquals(listOf("Glutes and hamstrings", "Upper body plus glutes", "Glutes and quads"), db.workoutDao().getDays(TestPeople.ASHLEY).map { it.name })
        val days = db.workoutDao().getDays(TestPeople.SWAG)
        assertEquals(listOf(1, 2, 3, 4), days.map { it.dayOrder }.sorted())
        assertEquals(31 + 16, db.workoutDao().allExercises().size)
        val s = settings.current(TestPeople.SWAG)
        assertEquals(20 + 5, s.pantryStaples.size)
        assertEquals(setOf(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY), s.trainingWeekdays)

        val guisado = meals.getRecipe(recipes.getValue("L1").id)!!
        val thighs = guisado.ingredients.first { it.name == "chicken thighs" }
        assertEquals(2.0, thighs.quantity!!, 0.0)
        assertEquals("lb", thighs.unit)
        assertTrue(guisado.ingredients.first { it.name == "olive oil" }.isPantryStaple)

        // The two people, with what used to be hard-wired for each.
        val (swag, ashley) = db.profileDao().all()
        assertEquals("Swag", swag.name)
        assertFalse(swag.snackSlot || swag.weekBadges || swag.easierToFinish)
        assertEquals(1.0, swag.portion, 0.0)
        assertEquals("Ashley", ashley.name)
        assertTrue(ashley.isGlam && ashley.snackSlot && ashley.weekBadges && ashley.easierToFinish)
        assertEquals(0.75, ashley.portion, 0.0)
        assertEquals(
            setOf(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY),
            settings.current(TestPeople.ASHLEY).trainingWeekdays,
        )
        assertFalse(settings.current(TestPeople.ASHLEY).chime)
        assertTrue(settings.current(TestPeople.SWAG).chime)
    }

    @Test
    fun aVersion2BackupKeepsAshleysSettings() = runBlocking {
        val backup = BackupManager(db, settings, context.contentResolver, ::builtInPeople)
        val v2 = backup.snapshot().copy(
            formatVersion = 2,
            profiles = listOf(Profile(1, "Swag", "IRON"), Profile(2, "Ashley", "GLAM")),
        )
        val otherDb = newDb()
        val restorer = BackupManager(otherDb, newSettings(), context.contentResolver, ::builtInPeople)
        // Written with the version 2 shape: no per-person fields on the profiles.
        val text = backup.encode(v2).replace(Regex(",\\s*\"(snackSlot|portion|tipsStyle|weekBadges|templateKey)\":\\s*[^,}\\n]+"), "")
        assertFalse(text.contains("snackSlot"))
        restorer.restore(restorer.decode(text))
        assertEquals(db.profileDao().all(), otherDb.profileDao().all())
    }

    @Test
    fun addingAndRemovingAPerson() = runBlocking {
        val people = ProfileRepository(db, settings)
        val template = com.personal.mealgym.data.seed.WorkoutTemplate(
            key = "t", name = "Test plan",
            days = SeedRepository(context).seed.workoutDays.filter { it.profile == "ashley" },
        )
        val id = people.create(Profile(0, "  Sam ", "GLAM", snackSlot = true), template, setOf(DayOfWeek.SATURDAY))
        assertEquals(3L, id)
        val sam = db.profileDao().all().single { it.id == id }
        assertEquals("Sam", sam.name)
        assertEquals("t", sam.templateKey)
        assertEquals(3, db.workoutDao().getDays(id).size)
        assertEquals(setOf(DayOfWeek.SATURDAY), settings.current(id).trainingWeekdays)

        meals.setSlot(id, mon, MealSlot.SNACK, recipes.getValue("SN1").id)
        gym.saveSession(id, mon, db.workoutDao().getDays(id).first(), Feeling.GREAT, null, emptyList())
        gym.logSauna(id, mon, 10)
        meals.setChecked("p$id", mon, "chicken breast", true)

        people.delete(id)
        assertTrue(db.profileDao().all().none { it.id == id })
        assertTrue(meals.planForWeek(id, mon).first().isEmpty())
        assertTrue(db.workoutDao().getDays(id).isEmpty())
        assertTrue(gym.sessions(id).first().isEmpty())
        assertTrue(gym.saunaLogs(id).first().isEmpty())
        assertTrue(db.shoppingDao().all().none { it.listKey == "p$id" })
        // Swag and Ashley are untouched, and the next person starts clean.
        assertEquals(4, db.workoutDao().getDays(TestPeople.SWAG).size)
        val next = people.create(Profile(0, "Alex", "IRON"), null, setOf(DayOfWeek.MONDAY))
        assertEquals(3L, next)
        assertTrue(db.workoutDao().getDays(next).isEmpty())
    }

    @Test
    fun mealPrepFillsFourLunchesAndIsBoughtOnce() = runBlocking {
        val guisado = recipes.getValue("L1")
        assertEquals(4, meals.fillBatch(TestPeople.SWAG, mon, MealSlot.LUNCH, guisado))
        meals.setSlot(TestPeople.SWAG, mon, MealSlot.DINNER, recipes.getValue("S1").id)

        val plan = meals.planForWeek(TestPeople.SWAG, mon).first()
        assertEquals(
            listOf(mon, mon.plusDays(1), mon.plusDays(2), mon.plusDays(3)).map { it.toString() },
            plan.filter { it.slot == MealSlot.LUNCH }.map { it.date }.sorted(),
        )

        val week = meals.shoppingWeek(TestPeople.SWAG, mon, both = false).first()
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
        assertEquals(2, meals.fillBatch(TestPeople.SWAG, saturday, MealSlot.LUNCH, guisado))

        meals.setSlot(TestPeople.SWAG, mon.plusDays(1), MealSlot.LUNCH, recipes.getValue("L4").id)
        assertEquals(4, meals.fillBatch(TestPeople.SWAG, mon, MealSlot.LUNCH, guisado))
        val lunches = meals.planForWeek(TestPeople.SWAG, mon).first().filter { it.slot == MealSlot.LUNCH }.associate { it.date to it.recipeId }
        assertEquals(recipes.getValue("L4").id, lunches[mon.plusDays(1).toString()])
        assertEquals(guisado.id, lunches[mon.plusDays(4).toString()])
    }

    @Test
    fun repeatLastWeekOnlyFillsEmptySlots() = runBlocking {
        val lastMon = mon.minusDays(7)
        meals.setSlot(TestPeople.SWAG, lastMon, MealSlot.BREAKFAST, recipes.getValue("B1").id)
        meals.setSlot(TestPeople.SWAG, lastMon, MealSlot.DINNER, recipes.getValue("D1").id)
        meals.setSlot(TestPeople.SWAG, mon, MealSlot.DINNER, recipes.getValue("D2").id)

        assertEquals(1, meals.repeatLastWeek(TestPeople.SWAG, mon))

        val plan = meals.planForWeek(TestPeople.SWAG, mon).first().associate { it.slot to it.recipeId }
        assertEquals(recipes.getValue("B1").id, plan[MealSlot.BREAKFAST])
        assertEquals(recipes.getValue("D2").id, plan[MealSlot.DINNER])
    }

    @Test
    fun deletingARecipeClearsItsPlannedSlots() = runBlocking {
        val tacos = recipes.getValue("B1")
        meals.setSlot(TestPeople.SWAG, mon, MealSlot.BREAKFAST, tacos.id)
        meals.deleteRecipe(tacos.id)
        assertTrue(meals.planForWeek(TestPeople.SWAG, mon).first().isEmpty())
    }

    @Test
    fun lastTimeFollowsTheExerciseNameActuallyDone() = runBlocking {
        val day1 = db.workoutDao().getDays(TestPeople.SWAG).first { it.dayOrder == 1 }
        val bench = db.workoutDao().allExercises().first { it.name == "Barbell bench press" }
        gym.saveSession(TestPeople.SWAG, mon, day1, Feeling.FINE, null, listOf(SetLog(sessionId = 0, exerciseId = bench.id, exerciseNameUsed = "Barbell bench press", weight = 135.0, reps = 8)))
        gym.saveSession(TestPeople.SWAG, mon.plusDays(7), day1, Feeling.GREAT, "Busy gym", listOf(SetLog(sessionId = 0, exerciseId = bench.id, exerciseNameUsed = "Smith machine bench", weight = 115.0, reps = 10)))

        val logs = gym.latestLogs(TestPeople.SWAG).first()
        assertEquals(135.0, logs.getValue("barbell bench press").weight!!, 0.0)
        assertEquals(10, logs.getValue("smith machine bench").reps)
    }

    @Test
    fun exportThenImportRestoresEverything() = runBlocking {
        meals.fillBatch(TestPeople.SWAG, mon, MealSlot.LUNCH, recipes.getValue("L2"))
        meals.setChecked("p1", mon, "chicken breast", true)
        val day2 = db.workoutDao().getDays(TestPeople.SWAG).first { it.dayOrder == 2 }
        gym.saveSession(TestPeople.SWAG, mon, day2, Feeling.ROUGH, "Short on sleep", emptyList())
        gym.logSauna(TestPeople.SWAG, mon, 15)
        settings.setShowNutrition(TestPeople.SWAG, false)
        settings.setTrainingWeekdays(TestPeople.SWAG, setOf(DayOfWeek.WEDNESDAY))

        val backup = BackupManager(db, settings, context.contentResolver, ::builtInPeople)
        val text = backup.encode(backup.snapshot())

        val otherDb = newDb()
        val otherSettings = newSettings()
        val restorer = BackupManager(otherDb, otherSettings, context.contentResolver, ::builtInPeople)
        restorer.restore(restorer.decode(text))

        val before = backup.snapshot().copy(exportedAt = "")
        val after = restorer.snapshot().copy(exportedAt = "")
        assertEquals(before, after)
        assertEquals(setOf(DayOfWeek.WEDNESDAY), otherSettings.current(TestPeople.SWAG).trainingWeekdays)
        assertEquals(false, otherSettings.current(TestPeople.SWAG).showNutrition)
    }

    @Test(expected = IllegalArgumentException::class)
    fun importRejectsOtherFiles() {
        BackupManager(db, settings, context.contentResolver, ::builtInPeople).decode(
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
            val dayId = oldDb.workoutDao().insertDay(com.personal.mealgym.data.seed.SeedParser.dayOf(d, v1.profileId(d.profile)!!))
            oldDb.workoutDao().insertExercises(com.personal.mealgym.data.seed.SeedParser.exercisesOf(d, dayId))
        }
        oldDb.metaDao().put(com.personal.mealgym.data.db.Meta("seedLevel", "1"))
        oldDb.recipeDao().delete(oldDb.recipeDao().bySeedKey("D5")!!.id)

        seedRepo.sync(oldDb, oldSettings, freshDatabase = false)

        assertNull("deleted recipes stay deleted", oldDb.recipeDao().bySeedKey("D5"))
        assertEquals(4, oldDb.workoutDao().getDays(TestPeople.SWAG).size)
        assertEquals(3, oldDb.workoutDao().getDays(TestPeople.ASHLEY).size)
        assertTrue(oldDb.recipeDao().bySeedKey("SB1") != null)

        // Running again changes nothing.
        seedRepo.sync(oldDb, oldSettings, freshDatabase = false)
        assertEquals(3, oldDb.workoutDao().getDays(TestPeople.ASHLEY).size)
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
        meals.fillBatch(TestPeople.SWAG, mon, MealSlot.LUNCH, teriyaki)
        meals.setActiveSwap(teriyaki.id, 0)
        val names = meals.shoppingWeek(TestPeople.SWAG, mon, both = false).first().result.sections.flatMap { it.items }.map { it.name.lowercase() }
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

    @Test
    fun bothOfUsRollsUpBothPlansWithAshleysPortions() = runBlocking {
        val guisado = recipes.getValue("L1") // serves 4, 2 lb chicken thighs
        meals.fillBatch(TestPeople.SWAG, mon, MealSlot.LUNCH, guisado) // 4 servings
        meals.fillBatch(TestPeople.ASHLEY, mon, MealSlot.LUNCH, guisado) // 4 x 3/4 = 3 servings

        fun thighs(week: ShoppingWeek) = week.result.sections.flatMap { it.items }.single { it.key == "chicken thigh" }.amountText

        assertEquals("2 lb", thighs(meals.shoppingWeek(TestPeople.SWAG, mon, both = false).first()))
        assertEquals("2 lb", thighs(meals.shoppingWeek(TestPeople.ASHLEY, mon, both = false).first()))
        // 7 servings in all: two batches of the recipe.
        val both = meals.shoppingWeek(TestPeople.SWAG, mon, both = true).first()
        assertEquals("4 lb", thighs(both))
        assertEquals("both", both.listKey)
    }

    @Test
    fun aMealPlanMovesToTheOtherPhoneOnTheSameSide() = runBlocking {
        // Swag's phone: a seed lunch and a recipe of his own.
        val packs = RecipePacks(db, context.contentResolver)
        packs.add(
            packs.decode(
                """{"recipes":[{"key":"X","name":"Steak salad","mealType":"DINNER","cuisineTags":["American"],"servings":1,
                "servingSize":"1 bowl","protein":"BEEF","ingredients":[{"quantity":"8","unit":"oz","name":"sirloin","section":"PROTEIN"}],"steps":["Grill.","Slice."]}]}""",
            ),
        )
        meals.fillBatch(TestPeople.SWAG, mon, MealSlot.LUNCH, recipes.getValue("L1"))
        meals.setSlot(TestPeople.SWAG, mon, MealSlot.DINNER, db.recipeDao().byName("Steak salad")!!.id)
        val transfer = PlanTransfer(db, packs, context.contentResolver)
        val text = transfer.encode(transfer.snapshot(TestPeople.SWAG, mon))

        // Ashley's phone: same seed, no steak salad.
        val herDb = newDb()
        SeedRepository(context).sync(herDb, newSettings(), freshDatabase = true)
        val herTransfer = PlanTransfer(herDb, RecipePacks(herDb, context.contentResolver), context.contentResolver)
        val result = herTransfer.apply(herTransfer.decode(text), fallbackProfileId = TestPeople.ASHLEY)

        assertEquals(PlanImportResult(TestPeople.SWAG, meals = 5, newRecipes = 1), result)
        val swagsPlanThere = herDb.planDao().getRange(TestPeople.SWAG, mon.toString(), mon.plusDays(6).toString())
        assertEquals(5, swagsPlanThere.size)
        assertEquals(herDb.recipeDao().bySeedKey("L1")!!.id, swagsPlanThere.first { it.slot == MealSlot.LUNCH }.recipeId)
        assertTrue(herDb.planDao().getRange(TestPeople.ASHLEY, mon.toString(), mon.plusDays(6).toString()).isEmpty())
        val salad = herDb.recipeDao().byName("Steak salad")!!
        assertEquals(1, herDb.recipeDao().getWithIngredients(salad.id)!!.ingredients.size)
    }
}
