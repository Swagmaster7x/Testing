package com.personal.mealgym.data

import com.personal.mealgym.TestPeople
import android.content.Context
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.CookRating
import com.personal.mealgym.data.db.OffPlanKind
import com.personal.mealgym.data.db.OffPlanMeal
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
        assertEquals(19 + 8 + 31 + 107, recipes.values.count { it.onlyForProfileId == null })
        assertEquals(9 + 5 + 7, recipes.values.count { it.onlyForProfileId == TestPeople.ASHLEY })
        assertEquals(listOf("Glutes and hamstrings", "Upper body plus glutes", "Glutes and quads"), db.workoutDao().getDays(TestPeople.ASHLEY).map { it.name })
        val days = db.workoutDao().getDays(TestPeople.SWAG)
        assertEquals(listOf(1, 2, 3, 4), days.map { it.dayOrder }.sorted())
        assertEquals(31 + 16, db.workoutDao().allExercises().size)
        val s = settings.current(TestPeople.SWAG)
        assertEquals(20 + 5 + 6 + 6, s.pantryStaples.size)
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
        assertTrue(ashley.themeKey == "GLAM" && ashley.snackSlot && ashley.weekBadges && ashley.easierToFinish)
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
    fun aBackupKeepsEveryonesLookIncludingOnesMadeInTheCreator() = runBlocking {
        val mine = """{"primary":4285416649,"type":"TYPEWRITER","sparkles":true}"""
        val ashley = db.profileDao().all().single { it.id == TestPeople.ASHLEY }
        db.profileDao().upsert(ashley.copy(themeKey = "CUSTOM", customLook = mine))
        val swag = db.profileDao().all().single { it.id == TestPeople.SWAG }
        db.profileDao().upsert(swag.copy(themeKey = "ARCTIC"))

        val backup = BackupManager(db, settings, context.contentResolver, ::builtInPeople)
        val text = backup.encode(backup.snapshot())
        val otherDb = newDb()
        val restorer = BackupManager(otherDb, newSettings(), context.contentResolver, ::builtInPeople)
        restorer.restore(restorer.decode(text))

        val restored = otherDb.profileDao().all()
        assertEquals("ARCTIC", restored.single { it.id == TestPeople.SWAG }.themeKey)
        assertEquals("CUSTOM", restored.single { it.id == TestPeople.ASHLEY }.themeKey)
        assertEquals(mine, restored.single { it.id == TestPeople.ASHLEY }.customLook)
    }

    @Test
    fun aBackupFromBeforeLooksRestoresWithoutACustomLook() = runBlocking {
        val backup = BackupManager(db, settings, context.contentResolver, ::builtInPeople)
        // Written by the previous version: profiles have no customLook field at all.
        val text = backup.encode(backup.snapshot()).replace(Regex(",\\s*\"customLook\":\\s*null"), "")
        assertFalse(text.contains("customLook"))
        val otherDb = newDb()
        val restorer = BackupManager(otherDb, newSettings(), context.contentResolver, ::builtInPeople)
        restorer.restore(restorer.decode(text))
        assertEquals(db.profileDao().all(), otherDb.profileDao().all())
    }

    @Test
    fun changingALookTouchesNothingElse() = runBlocking {
        val people = ProfileRepository(db, settings)
        val made = """{"primary":4285416649}"""
        people.setCustomLook(TestPeople.ASHLEY, made)
        // A ready-made look straight after: the creation is kept, and so is everything else about Ashley.
        people.setLook(TestPeople.ASHLEY, "OCEAN")
        val ashley = db.profileDao().all().single { it.id == TestPeople.ASHLEY }
        assertEquals("OCEAN", ashley.themeKey)
        assertEquals(made, ashley.customLook)
        assertTrue(ashley.snackSlot && ashley.weekBadges && ashley.easierToFinish)
        assertEquals(0.75, ashley.portion, 0.0)
        people.setLook(TestPeople.ASHLEY, "CUSTOM")
        assertEquals("CUSTOM", db.profileDao().all().single { it.id == TestPeople.ASHLEY }.themeKey)
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

    private fun shopping() = runBlocking {
        meals.shoppingWeek(TestPeople.SWAG, mon, both = false).first().result.sections.flatMap { it.items }.associateBy { it.key }
    }

    private fun out(date: LocalDate, slot: MealSlot, kind: OffPlanKind, title: String? = null, calories: Int? = null) =
        OffPlanMeal(profileId = TestPeople.SWAG, date = date.toString(), slot = slot, kind = kind, title = title, calories = calories)

    @Test
    fun aSlotHoldsARecipeOrSomethingOffThePlanNeverBoth() = runBlocking {
        val guisado = recipes.getValue("L1")
        meals.setSlot(TestPeople.SWAG, mon, MealSlot.LUNCH, guisado.id)
        assertEquals("2 lb", shopping().getValue("chicken thigh").amountText)

        // Eating out instead: the recipe leaves the slot and the shopping list.
        meals.setOffPlan(out(mon, MealSlot.LUNCH, OffPlanKind.EATING_OUT, "  Chipotle: Chicken ", 180))
        assertTrue(meals.planForWeek(TestPeople.SWAG, mon).first().isEmpty())
        assertNull(shopping()["chicken thigh"])
        val planned = meals.offPlanForWeek(TestPeople.SWAG, mon).first().single()
        assertEquals("Chipotle: Chicken", planned.title)
        assertEquals(180, planned.calories)

        // Changing it replaces it; a blank title is no title.
        meals.setOffPlan(out(mon, MealSlot.LUNCH, OffPlanKind.LEFTOVERS, "  "))
        assertEquals(listOf(OffPlanKind.LEFTOVERS), meals.offPlanForWeek(TestPeople.SWAG, mon).first().map { it.kind })
        assertNull(meals.offPlanForWeek(TestPeople.SWAG, mon).first().single().title)

        // Picking a recipe again takes the slot back.
        meals.setSlot(TestPeople.SWAG, mon, MealSlot.LUNCH, guisado.id)
        assertTrue(meals.offPlanForWeek(TestPeople.SWAG, mon).first().isEmpty())
        // Clearing clears either kind.
        meals.setOffPlan(out(mon, MealSlot.DINNER, OffPlanKind.SKIP))
        meals.clearSlot(TestPeople.SWAG, mon, MealSlot.DINNER)
        meals.clearSlot(TestPeople.SWAG, mon, MealSlot.LUNCH)
        assertTrue(meals.offPlanForWeek(TestPeople.SWAG, mon).first().isEmpty())
        assertTrue(meals.planForWeek(TestPeople.SWAG, mon).first().isEmpty())
        // Ashley's same slot is her own.
        meals.setOffPlan(out(mon, MealSlot.LUNCH, OffPlanKind.SKIP).copy(profileId = TestPeople.ASHLEY))
        assertTrue(meals.offPlanForWeek(TestPeople.SWAG, mon).first().isEmpty())
    }

    @Test
    fun batchesAndLastWeeksCopiesLeaveOffPlanSlotsAlone() = runBlocking {
        val guisado = recipes.getValue("L1")
        meals.setOffPlan(out(mon.plusDays(1), MealSlot.LUNCH, OffPlanKind.EATING_OUT))
        // Tuesday is spoken for, so the four portions go Monday, Wednesday, Thursday, Friday.
        assertEquals(4, meals.fillBatch(TestPeople.SWAG, mon, MealSlot.LUNCH, guisado))
        assertEquals(
            listOf(mon, mon.plusDays(2), mon.plusDays(3), mon.plusDays(4)).map { it.toString() },
            meals.planForWeek(TestPeople.SWAG, mon).first().map { it.date }.sorted(),
        )
        assertEquals(1, meals.offPlanForWeek(TestPeople.SWAG, mon).first().size)

        // Last week's Saturday dinner doesn't overwrite this week's planned night out.
        meals.setSlot(TestPeople.SWAG, mon.minusDays(2), MealSlot.DINNER, recipes.getValue("D1").id)
        meals.setOffPlan(out(mon.plusDays(5), MealSlot.DINNER, OffPlanKind.EATING_OUT, "Birthday"))
        assertEquals(0, meals.repeatLastWeek(TestPeople.SWAG, mon))
        assertEquals("Birthday", meals.offPlanForWeek(TestPeople.SWAG, mon).first().single { it.slot == MealSlot.DINNER }.title)
    }

    @Test
    fun cookingForGuestsBuysForThemToo() = runBlocking {
        val guisado = recipes.getValue("L1") // serves 4, 2 lb chicken thighs
        meals.setSlot(TestPeople.SWAG, mon, MealSlot.DINNER, guisado.id)
        assertEquals("2 lb", shopping().getValue("chicken thigh").amountText)
        // One serving for Swag and three guests still fits one batch.
        meals.setExtraServings(TestPeople.SWAG, mon, MealSlot.DINNER, 3.0)
        assertEquals("2 lb", shopping().getValue("chicken thigh").amountText)
        // A fifth person means cooking it twice.
        meals.setExtraServings(TestPeople.SWAG, mon, MealSlot.DINNER, 4.0)
        assertEquals("4 lb", shopping().getValue("chicken thigh").amountText)
        assertEquals(4.0, meals.planForWeek(TestPeople.SWAG, mon).first().single().extraServings, 0.0)
        // Out of range is pulled back in, and copying a week doesn't copy the guests.
        meals.setExtraServings(TestPeople.SWAG, mon, MealSlot.DINNER, 99.0)
        assertEquals(MealRepository.MAX_EXTRA_SERVINGS, meals.planForWeek(TestPeople.SWAG, mon).first().single().extraServings, 0.0)
        meals.repeatLastWeek(TestPeople.SWAG, mon.plusDays(7))
        assertEquals(0.0, meals.planForWeek(TestPeople.SWAG, mon.plusDays(7)).first().single().extraServings, 0.0)
    }

    @Test
    fun theLatestRatingOfARecipeIsTheOneThatCounts() = runBlocking {
        val guisado = recipes.getValue("L1")
        val tacos = recipes.getValue("B1")
        meals.logCooked(TestPeople.SWAG, guisado.id, mon, CookRating.FINE)
        meals.logCooked(TestPeople.SWAG, guisado.id, mon.plusDays(3), CookRating.LOVED)
        // Cooked again with nothing said: the earlier opinion stands.
        meals.logCooked(TestPeople.SWAG, guisado.id, mon.plusDays(5), null)
        meals.logCooked(TestPeople.SWAG, tacos.id, mon, CookRating.NOT_AGAIN)
        meals.logCooked(TestPeople.ASHLEY, tacos.id, mon, CookRating.LOVED)
        assertEquals(mapOf(guisado.id to CookRating.LOVED, tacos.id to CookRating.NOT_AGAIN), meals.ratings(TestPeople.SWAG).first())
        assertEquals(mapOf(tacos.id to CookRating.LOVED), meals.ratings(TestPeople.ASHLEY).first())
        assertEquals(3, meals.cookLogs(TestPeople.SWAG).first().count { it.recipeId == guisado.id })
        // Saying it twice on one day is one cook; a second rating replaces the first, and none leaves it.
        meals.logCooked(TestPeople.SWAG, tacos.id, mon, CookRating.FINE)
        meals.logCooked(TestPeople.SWAG, tacos.id, mon, null)
        assertEquals(CookRating.FINE, meals.ratings(TestPeople.SWAG).first()[tacos.id])
        assertEquals(1, meals.cookLogs(TestPeople.SWAG).first().count { it.recipeId == tacos.id })
    }

    @Test
    fun aBackupCarriesOffPlanMealsCookLogsSetsAndTheNewSettings() = runBlocking {
        val guisado = recipes.getValue("L1")
        meals.setSlot(TestPeople.SWAG, mon, MealSlot.DINNER, guisado.id)
        meals.setExtraServings(TestPeople.SWAG, mon, MealSlot.DINNER, 2.0)
        meals.setOffPlan(out(mon, MealSlot.LUNCH, OffPlanKind.EATING_OUT, "Chipotle: Chicken", 180))
        meals.logCooked(TestPeople.SWAG, guisado.id, mon, CookRating.LOVED)
        val day1 = db.workoutDao().getDays(TestPeople.SWAG).first { it.dayOrder == 1 }
        gym.saveSession(
            TestPeople.SWAG, mon, day1, Feeling.GREAT, null,
            listOf(
                SetLog(sessionId = 0, exerciseId = null, exerciseNameUsed = "Barbell bench press", weight = 135.0, reps = 8, setIndex = 0),
                SetLog(sessionId = 0, exerciseId = null, exerciseNameUsed = "Barbell bench press", weight = 135.0, reps = 7, setIndex = 1),
            ),
        )
        settings.setSuggestLifts(TestPeople.SWAG, true)
        settings.setDayTotals(TestPeople.ASHLEY, true)
        settings.setInCupboard(listOf("chicken thigh", "rice"), have = true, today = 20_000)
        settings.setInCupboard("egg", have = true)
        settings.setCupboardAuto(true)

        val backup = BackupManager(db, settings, context.contentResolver, ::builtInPeople)
        val file = backup.decode(backup.encode(backup.snapshot()))
        assertEquals(4, file.formatVersion)

        val otherDb = newDb()
        val otherSettings = newSettings()
        BackupManager(otherDb, otherSettings, context.contentResolver, ::builtInPeople).restore(file)
        assertEquals(2.0, otherDb.planDao().all().single().extraServings, 0.0)
        assertEquals("Chipotle: Chicken", otherDb.planDao().allOffPlan().single().title)
        assertEquals(CookRating.LOVED, otherDb.planDao().allCookLogs().single().rating)
        assertEquals(listOf(0, 1), otherDb.workoutDao().allSetLogs().map { it.setIndex })
        assertTrue(otherSettings.current(TestPeople.SWAG).suggestLifts)
        assertTrue(otherSettings.current(TestPeople.ASHLEY).dayTotals)
        assertFalse("off in the personal edition unless switched on", otherSettings.current(TestPeople.SWAG).dayTotals)
        assertEquals(setOf("chicken thigh", "rice", "egg"), otherSettings.cupboard.first())
        assertEquals(mapOf("chicken thigh" to 20_000L, "rice" to 20_000L), otherSettings.cupboardSince.first())
        assertTrue(otherSettings.cupboardAuto.first())

        // A file from before any of this restores with none of it, and the edition's defaults.
        val older = file.copy(
            formatVersion = 3, offPlanMeals = emptyList(), cookLogs = emptyList(),
            settings = file.settings.copy(suggestLifts = null, dayTotals = null, cupboardSince = emptyMap(), cupboardAuto = null),
        )
        val thirdSettings = newSettings()
        val thirdDb = newDb()
        BackupManager(thirdDb, thirdSettings, context.contentResolver, ::builtInPeople).restore(older)
        assertTrue(thirdDb.planDao().allOffPlan().isEmpty())
        assertFalse(thirdSettings.current(TestPeople.SWAG).suggestLifts)
        assertFalse(thirdSettings.cupboardAuto.first())
        assertTrue(thirdSettings.cupboardSince.first().isEmpty())
    }

    @Test
    fun theCupboardRemembersWhenThingsWentIn() = runBlocking {
        settings.setInCupboard("egg", have = true) // no date: ticked the old way
        settings.setInCupboard(listOf("chicken thigh", "spinach"), have = true, today = 20_000)
        // Already there: ticking it again later keeps the earlier date.
        settings.setInCupboard("chicken thigh", have = true, today = 20_005)
        settings.setInCupboard("egg", have = true, today = 20_005)
        assertEquals(setOf("egg", "chicken thigh", "spinach"), settings.cupboard.first())
        assertEquals(mapOf("chicken thigh" to 20_000L, "spinach" to 20_000L), settings.cupboardSince.first())
        // Taking something out forgets its date; putting it back starts again.
        settings.setInCupboard("spinach", have = false)
        assertEquals(mapOf("chicken thigh" to 20_000L), settings.cupboardSince.first())
        settings.setInCupboard("spinach", have = true, today = 20_009)
        assertEquals(20_009L, settings.cupboardSince.first()["spinach"])
        // Clearing the cupboard clears the dates.
        settings.setCupboard(emptySet())
        assertTrue(settings.cupboardSince.first().isEmpty())
        // The personal edition leaves the cupboard to be ticked by hand unless switched on.
        assertFalse(settings.cupboardAuto.first())
        settings.setCupboardAuto(true)
        assertTrue(settings.cupboardAuto.first())
    }

    @Test
    fun deletingAPersonTakesTheirOffPlanMealsAndCookLogs() = runBlocking {
        meals.setOffPlan(out(mon, MealSlot.LUNCH, OffPlanKind.SKIP).copy(profileId = TestPeople.ASHLEY))
        meals.setOffPlan(out(mon, MealSlot.LUNCH, OffPlanKind.SKIP))
        meals.logCooked(TestPeople.ASHLEY, recipes.getValue("L1").id, mon, CookRating.FINE)
        ProfileRepository(db, settings).delete(TestPeople.ASHLEY)
        assertEquals(listOf(TestPeople.SWAG), db.planDao().allOffPlan().map { it.profileId })
        assertTrue(db.planDao().allCookLogs().isEmpty())
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
