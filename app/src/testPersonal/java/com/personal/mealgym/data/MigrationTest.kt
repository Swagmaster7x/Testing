package com.personal.mealgym.data

import com.personal.mealgym.TestPeople
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Profile
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

/**
 * Swag's phone already has version 1 data; the upgrades must keep all of it as his side, and
 * version 3 must give Swag and Ashley exactly the behaviour they had. Old databases are built
 * from the exported schemas in app/schemas, and opening them through Room afterwards makes
 * Room check the migrated schema against the current version exactly.
 */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35])
class MigrationTest {

    private val dbName = "migration-test.db"
    private val context = ApplicationProvider.getApplicationContext<Context>()

    /** Creates an empty database exactly as [version] of the app did, from its exported schema. */
    private fun createFromSchema(version: Int): SQLiteDatabase {
        val file = context.getDatabasePath(dbName).also { it.parentFile?.mkdirs(); it.delete() }
        val schema = Json.parseToJsonElement(File("schemas/com.personal.mealgym.data.db.AppDatabase/$version.json").readText())
            .jsonObject.getValue("database").jsonObject
        return SQLiteDatabase.openOrCreateDatabase(file, null).apply {
            for (entity in schema.getValue("entities").jsonArray) {
                val e = entity.jsonObject
                val table = e.getValue("tableName").jsonPrimitive.content
                execSQL(e.getValue("createSql").jsonPrimitive.content.replace("\${TABLE_NAME}", table))
                e["indices"]?.jsonArray?.forEach { index ->
                    execSQL(index.jsonObject.getValue("createSql").jsonPrimitive.content.replace("\${TABLE_NAME}", table))
                }
            }
            schema.getValue("setupQueries").jsonArray.forEach { execSQL(it.jsonPrimitive.content) }
            this.version = version
        }
    }

    /** Version 1 data on Swag's phone. */
    private fun createVersion1() {
        createFromSchema(1).apply {
            execSQL(
                "INSERT INTO Recipe (id, seedKey, name, mealType, cuisineTags, servings, servingSizeText, nutritionText, " +
                    "steps, volumeTip, isMealPrep, isUserCreated) VALUES " +
                    "(1, 'L1', 'Pollo guisado with rice and beans', 'LUNCH', '[\"Caribbean\"]', 4, '1 portion', '~620 cal', " +
                    "'[\"Brown the chicken.\"]', NULL, 1, 0)",
            )
            execSQL(
                "INSERT INTO Ingredient (id, recipeId, position, name, quantity, unit, note, storeSection, isPantryStaple) " +
                    "VALUES (1, 1, 0, 'chicken thighs', 2.0, 'lb', 'boneless skinless', 'PROTEIN', 0)",
            )
            execSQL("INSERT INTO MealPlanEntry (id, date, slot, recipeId) VALUES (1, '2026-11-09', 'LUNCH', 1)")
            execSQL("INSERT INTO ShoppingCheck (weekStartDate, ingredientKey, checked) VALUES ('2026-11-09', 'chicken thigh', 1)")
            execSQL("INSERT INTO WorkoutDay (id, dayOrder, name) VALUES (1, 1, 'Upper Body')")
            execSQL(
                "INSERT INTO Exercise (id, workoutDayId, position, name, setsText, repsText, groupLabel, alternatives, note) " +
                    "VALUES (1, 1, 0, 'Barbell bench press', '3', '6–10', 'A', '[\"Smith machine bench\"]', NULL)",
            )
            execSQL(
                "INSERT INTO WorkoutSession (id, date, workoutDayId, dayOrder, dayName, feeling, note) " +
                    "VALUES (1, '2026-11-09', 1, 1, 'Upper Body', 'GREAT', 'Felt strong')",
            )
            execSQL(
                "INSERT INTO SetLog (id, sessionId, exerciseId, exerciseNameUsed, weight, reps) " +
                    "VALUES (1, 1, 1, 'Barbell bench press', 135.0, 8)",
            )
            execSQL("INSERT INTO SaunaLog (id, date, minutes) VALUES (1, '2026-11-09', 15)")
            close()
        }
    }

    private fun openWithRoom(): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, dbName)
            .addMigrations(AppDatabase.MIGRATION_1_2, AppDatabase.MIGRATION_2_3, AppDatabase.MIGRATION_3_4, AppDatabase.MIGRATION_4_5)
            .allowMainThreadQueries()
            .build()

    @Test
    fun migrationKeepsEveryRowAsSwagsSide() {
        createVersion1()
        val room = openWithRoom()
        // Opening runs the migration and then Room's schema check; it throws if anything differs.
        val db = room.openHelper.writableDatabase
        assertEquals(5, db.version)

        fun single(sql: String): String = db.query(sql).use { c ->
            c.moveToFirst()
            c.getString(0)
        }

        assertEquals("1", single("SELECT profileId FROM MealPlanEntry WHERE id = 1"))
        assertEquals("1", single("SELECT profileId FROM WorkoutDay WHERE id = 1"))
        assertEquals("1", single("SELECT profileId FROM WorkoutSession WHERE id = 1"))
        assertEquals("1", single("SELECT profileId FROM SetLog WHERE id = 1"))
        assertEquals("1", single("SELECT profileId FROM SaunaLog WHERE id = 1"))
        assertEquals("p1", single("SELECT listKey FROM ShoppingCheck WHERE ingredientKey = 'chicken thigh'"))
        assertEquals("1", single("SELECT checked FROM ShoppingCheck"))
        assertEquals("Swag,Ashley", single("SELECT group_concat(name) FROM (SELECT name FROM Profile ORDER BY id)"))
        assertEquals("1", single("SELECT value FROM Meta WHERE `key` = 'seedLevel'"))
        assertEquals("[]", single("SELECT proteinSwaps FROM Recipe WHERE id = 1"))
        assertEquals("Felt strong", single("SELECT note FROM WorkoutSession WHERE id = 1"))
        room.close()
    }

    @Test
    fun version3GivesSwagAndAshleyTheirSettings() = runBlocking {
        // A phone on version 2: the two sides exist, with nothing per person stored yet.
        createFromSchema(2).apply {
            execSQL("INSERT INTO Profile (id, name, themeKey) VALUES (1, 'Swag', 'IRON'), (2, 'Ashley', 'GLAM')")
            execSQL("INSERT INTO Meta (`key`, value) VALUES ('seedLevel', '2')")
            close()
        }
        val db = openWithRoom()
        val (swag, ashley) = db.profileDao().all()
        assertEquals(Profile(1, "Swag", "IRON", templateKey = "upper-lower-4"), swag)
        assertEquals(
            Profile(2, "Ashley", "GLAM", snackSlot = true, portion = 0.75, tipsStyle = "EASIER", weekBadges = true, templateKey = "glute-3"),
            ashley,
        )
        db.close()
    }

    @Test
    fun version4KeepsEveryoneAndTheirLook() = runBlocking {
        // A phone on version 3: Swag, Ashley and someone with another look.
        createFromSchema(3).apply {
            execSQL(
                "INSERT INTO Profile (id, name, themeKey, snackSlot, portion, tipsStyle, weekBadges, templateKey) VALUES " +
                    "(1, 'Swag', 'IRON', 0, 1.0, 'FILL_UP', 0, 'upper-lower-4'), " +
                    "(2, 'Ashley', 'GLAM', 1, 0.75, 'EASIER', 1, 'glute-3')",
            )
            close()
        }
        val db = openWithRoom()
        val (swag, ashley) = db.profileDao().all()
        assertEquals(Profile(1, "Swag", "IRON", templateKey = "upper-lower-4"), swag)
        assertEquals("GLAM", ashley.themeKey)
        assertEquals(null, ashley.customLook)
        db.profileDao().upsert(ashley.copy(themeKey = "CUSTOM", customLook = "{\"primary\":4281545523}"))
        assertEquals("CUSTOM", db.profileDao().all()[1].themeKey)
        db.close()
    }

    @Test
    fun version5KeepsLooksAndAddsRoomForPlanAnswers() = runBlocking {
        // A phone on version 4: Ashley made her own look.
        createFromSchema(4).apply {
            execSQL(
                "INSERT INTO Profile (id, name, themeKey, snackSlot, portion, tipsStyle, weekBadges, templateKey, customLook) VALUES " +
                    "(1, 'Swag', 'ARCTIC', 0, 1.0, 'FILL_UP', 0, 'upper-lower-4', NULL), " +
                    "(2, 'Ashley', 'CUSTOM', 1, 0.75, 'EASIER', 1, 'glute-3', '{\"primary\":4285416649}')",
            )
            close()
        }
        val db = openWithRoom()
        val (swag, ashley) = db.profileDao().all()
        assertEquals("ARCTIC", swag.themeKey)
        assertEquals("{\"primary\":4285416649}", ashley.customLook)
        assertEquals(null, ashley.planAnswers)
        db.profileDao().setPlanAnswers(2, "{\"goal\":\"BUILD\"}")
        assertEquals("{\"goal\":\"BUILD\"}", db.profileDao().all()[1].planAnswers)
        assertTrue(db.profileDao().all()[1].snackSlot)
        db.close()
    }

    @Test
    fun version1PhonesGetTheSameSettingsAfterBothUpgrades() = runBlocking {
        createVersion1()
        val db = openWithRoom()
        val ashley = db.profileDao().all().single { it.id == TestPeople.ASHLEY }
        assertTrue(ashley.snackSlot && ashley.weekBadges && ashley.easierToFinish)
        assertEquals(0.75, ashley.portion, 0.0)
        assertFalse(db.profileDao().all().single { it.id == TestPeople.SWAG }.snackSlot)
        db.close()
    }

    @Test
    fun migratedDatabaseWorksThroughRoom() = runBlocking {
        createVersion1()
        val db = openWithRoom()

        val swagPlan = db.planDao().getRange(TestPeople.SWAG, "2026-11-09", "2026-11-15")
        assertEquals(listOf(1L), swagPlan.map { it.recipeId })

        // Ashley can now plan the same slot on the same day without clashing with Swag's.
        db.planDao().put(MealPlanEntry(date = "2026-11-09", slot = MealSlot.LUNCH, recipeId = 1, profileId = TestPeople.ASHLEY))
        assertEquals(1, db.planDao().getRange(TestPeople.SWAG, "2026-11-09", "2026-11-09").size)
        assertEquals(1, db.planDao().getRange(TestPeople.ASHLEY, "2026-11-09", "2026-11-09").size)

        assertEquals("Upper Body", db.workoutDao().getDays(TestPeople.SWAG).single().name)
        assertEquals(0, db.workoutDao().getDays(TestPeople.ASHLEY).size)
        assertEquals(135.0, db.workoutDao().observeLatestLogs(TestPeople.SWAG).first().single().weight!!, 0.0)
        assertEquals(15, db.saunaDao().observeAll(TestPeople.SWAG).first().single().minutes)
        db.close()
    }
}
