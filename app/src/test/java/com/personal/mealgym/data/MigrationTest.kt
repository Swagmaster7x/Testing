package com.personal.mealgym.data

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.MealSlot
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

/**
 * Swag's phone already has version 1 data; the upgrade must keep all of it as his side.
 * The version 1 database is built from the exported schema in app/schemas, and opening it
 * through Room afterwards makes Room check the migrated schema against version 2 exactly.
 */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35])
class MigrationTest {

    private val dbName = "migration-test.db"
    private val context = ApplicationProvider.getApplicationContext<Context>()

    /** Creates the database exactly as version 1 of the app did, from its exported schema. */
    private fun createVersion1() {
        val file = context.getDatabasePath(dbName).also { it.parentFile?.mkdirs(); it.delete() }
        val schema = Json.parseToJsonElement(File("schemas/com.personal.mealgym.data.db.AppDatabase/1.json").readText())
            .jsonObject.getValue("database").jsonObject
        SQLiteDatabase.openOrCreateDatabase(file, null).apply {
            for (entity in schema.getValue("entities").jsonArray) {
                val e = entity.jsonObject
                val table = e.getValue("tableName").jsonPrimitive.content
                execSQL(e.getValue("createSql").jsonPrimitive.content.replace("\${TABLE_NAME}", table))
                e["indices"]?.jsonArray?.forEach { index ->
                    execSQL(index.jsonObject.getValue("createSql").jsonPrimitive.content.replace("\${TABLE_NAME}", table))
                }
            }
            schema.getValue("setupQueries").jsonArray.forEach { execSQL(it.jsonPrimitive.content) }
            version = 1
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
            .addMigrations(AppDatabase.MIGRATION_1_2)
            .allowMainThreadQueries()
            .build()

    @Test
    fun migrationKeepsEveryRowAsSwagsSide() {
        createVersion1()
        val room = openWithRoom()
        // Opening runs the migration and then Room's schema check; it throws if anything differs.
        val db = room.openHelper.writableDatabase
        assertEquals(2, db.version)

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
    fun migratedDatabaseWorksThroughRoom() = runBlocking {
        createVersion1()
        val db = openWithRoom()

        val swagPlan = db.planDao().getRange(Profiles.SWAG, "2026-11-09", "2026-11-15")
        assertEquals(listOf(1L), swagPlan.map { it.recipeId })

        // Ashley can now plan the same slot on the same day without clashing with Swag's.
        db.planDao().put(MealPlanEntry(date = "2026-11-09", slot = MealSlot.LUNCH, recipeId = 1, profileId = Profiles.ASHLEY))
        assertEquals(1, db.planDao().getRange(Profiles.SWAG, "2026-11-09", "2026-11-09").size)
        assertEquals(1, db.planDao().getRange(Profiles.ASHLEY, "2026-11-09", "2026-11-09").size)

        assertEquals("Upper Body", db.workoutDao().getDays(Profiles.SWAG).single().name)
        assertEquals(0, db.workoutDao().getDays(Profiles.ASHLEY).size)
        assertEquals(135.0, db.workoutDao().observeLatestLogs(Profiles.SWAG).first().single().weight!!, 0.0)
        assertEquals(15, db.saunaDao().observeAll(Profiles.SWAG).first().single().minutes)
        db.close()
    }
}
