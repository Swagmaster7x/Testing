package com.personal.mealgym.data.db

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import androidx.room.Update
import androidx.room.Upsert
import kotlinx.coroutines.flow.Flow

@Dao
interface ProfileDao {
    @Query("SELECT * FROM Profile ORDER BY id")
    fun observeAll(): Flow<List<Profile>>

    @Query("SELECT * FROM Profile ORDER BY id")
    suspend fun all(): List<Profile>

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAll(profiles: List<Profile>)

    @Upsert
    suspend fun upsert(profile: Profile)

    @Query("UPDATE Profile SET themeKey = :themeKey WHERE id = :id")
    suspend fun setLook(id: Long, themeKey: String)

    @Query("UPDATE Profile SET themeKey = :themeKey, customLook = :customLook WHERE id = :id")
    suspend fun setLook(id: Long, themeKey: String, customLook: String)

    @Query("UPDATE Profile SET planAnswers = :answers WHERE id = :id")
    suspend fun setPlanAnswers(id: Long, answers: String?)

    @Query("SELECT COALESCE(MAX(id), 0) FROM Profile")
    suspend fun maxId(): Long

    @Query("DELETE FROM Profile WHERE id = :id") suspend fun delete(id: Long)

    @Query("DELETE FROM Profile") suspend fun deleteAll()

    /** Everything that belongs to one person (recipes and pantry are shared and stay). */
    @Query("DELETE FROM MealPlanEntry WHERE profileId = :id") suspend fun deletePlan(id: Long)
    @Query("DELETE FROM WorkoutDay WHERE profileId = :id") suspend fun deleteWorkoutDays(id: Long)
    @Query("DELETE FROM WorkoutSession WHERE profileId = :id") suspend fun deleteSessions(id: Long)
    @Query("DELETE FROM SaunaLog WHERE profileId = :id") suspend fun deleteSauna(id: Long)
    @Query("DELETE FROM SupplementLog WHERE profileId = :id") suspend fun deleteSupplements(id: Long)
    @Query("DELETE FROM ShoppingCheck WHERE listKey = :listKey") suspend fun deleteShoppingChecks(listKey: String)
    @Query("UPDATE Recipe SET onlyForProfileId = NULL WHERE onlyForProfileId = :id") suspend fun releaseRecipes(id: Long)
}

@Dao
interface MetaDao {
    @Query("SELECT value FROM Meta WHERE `key` = :key")
    suspend fun get(key: String): String?

    @Upsert
    suspend fun put(meta: Meta)
}

@Dao
interface RecipeDao {
    @Query("SELECT * FROM Recipe ORDER BY name COLLATE NOCASE")
    fun observeAll(): Flow<List<Recipe>>

    @Transaction
    @Query("SELECT * FROM Recipe ORDER BY name COLLATE NOCASE")
    fun observeAllWithIngredients(): Flow<List<RecipeWithIngredients>>

    @Transaction
    @Query("SELECT * FROM Recipe WHERE id = :id")
    fun observeWithIngredients(id: Long): Flow<RecipeWithIngredients?>

    @Transaction
    @Query("SELECT * FROM Recipe WHERE id = :id")
    suspend fun getWithIngredients(id: Long): RecipeWithIngredients?

    @Query("SELECT * FROM Recipe WHERE seedKey = :key LIMIT 1")
    suspend fun bySeedKey(key: String): Recipe?

    @Query("SELECT * FROM Recipe WHERE name = :name COLLATE NOCASE LIMIT 1")
    suspend fun byName(name: String): Recipe?

    @Query("SELECT COUNT(*) FROM Recipe")
    suspend fun count(): Int

    @Query("SELECT DISTINCT name FROM Ingredient WHERE storeSection = 'PANTRY' OR isPantryStaple = 1")
    fun observePantryIngredientNames(): Flow<List<String>>

    @Insert
    suspend fun insert(recipe: Recipe): Long

    @Update
    suspend fun update(recipe: Recipe)

    @Query("UPDATE Recipe SET isFavorite = :favorite WHERE id = :id")
    suspend fun setFavorite(id: Long, favorite: Boolean)

    @Query("UPDATE Recipe SET isHidden = :hidden WHERE id = :id")
    suspend fun setHidden(id: Long, hidden: Boolean)

    @Query("UPDATE Recipe SET activeSwap = :swap WHERE id = :id")
    suspend fun setActiveSwap(id: Long, swap: Int?)

    @Query("DELETE FROM Recipe WHERE id = :id")
    suspend fun delete(id: Long)

    @Insert
    suspend fun insertIngredients(ingredients: List<Ingredient>)

    @Query("DELETE FROM Ingredient WHERE recipeId = :recipeId")
    suspend fun deleteIngredientsFor(recipeId: Long)

    // Backup
    @Query("SELECT * FROM Recipe") suspend fun allRecipes(): List<Recipe>
    @Query("SELECT * FROM Ingredient") suspend fun allIngredients(): List<Ingredient>
    @Insert suspend fun insertRecipes(recipes: List<Recipe>)
    @Query("DELETE FROM Recipe") suspend fun deleteAllRecipes()
}

@Dao
interface PlanDao {
    @Query("SELECT * FROM MealPlanEntry WHERE profileId = :profileId AND date BETWEEN :start AND :end")
    fun observeRange(profileId: Long, start: String, end: String): Flow<List<MealPlanEntry>>

    /** Both sides at once, for the shared shopping list. */
    @Query("SELECT * FROM MealPlanEntry WHERE date BETWEEN :start AND :end")
    fun observeRangeAllProfiles(start: String, end: String): Flow<List<MealPlanEntry>>

    @Query("SELECT * FROM MealPlanEntry WHERE profileId = :profileId AND date BETWEEN :start AND :end")
    suspend fun getRange(profileId: Long, start: String, end: String): List<MealPlanEntry>

    @Query("SELECT * FROM MealPlanEntry WHERE profileId = :profileId AND date <= :end ORDER BY date DESC")
    fun observeUpTo(profileId: Long, end: String): Flow<List<MealPlanEntry>>

    /** Replaces whatever is already in that side's date and slot. */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun put(entry: MealPlanEntry)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun putAll(entries: List<MealPlanEntry>)

    @Query("DELETE FROM MealPlanEntry WHERE profileId = :profileId AND date = :date AND slot = :slot")
    suspend fun clear(profileId: Long, date: String, slot: MealSlot)

    // Backup
    @Query("SELECT * FROM MealPlanEntry") suspend fun all(): List<MealPlanEntry>
    @Query("DELETE FROM MealPlanEntry") suspend fun deleteAll()
}

@Dao
interface ShoppingDao {
    @Query("SELECT * FROM ShoppingCheck WHERE listKey = :listKey AND weekStartDate = :weekStart")
    fun observeWeek(listKey: String, weekStart: String): Flow<List<ShoppingCheck>>

    @Upsert
    suspend fun upsert(check: ShoppingCheck)

    @Query("DELETE FROM ShoppingCheck WHERE listKey = :listKey AND weekStartDate = :weekStart")
    suspend fun clearWeek(listKey: String, weekStart: String)

    // Backup
    @Query("SELECT * FROM ShoppingCheck") suspend fun all(): List<ShoppingCheck>
    @Insert suspend fun insertAll(checks: List<ShoppingCheck>)
    @Query("DELETE FROM ShoppingCheck") suspend fun deleteAll()
}

@Dao
interface WorkoutDao {
    @Query("SELECT * FROM WorkoutDay WHERE profileId = :profileId ORDER BY dayOrder")
    fun observeDays(profileId: Long): Flow<List<WorkoutDay>>

    @Query("SELECT * FROM WorkoutDay WHERE profileId = :profileId ORDER BY dayOrder")
    suspend fun getDays(profileId: Long): List<WorkoutDay>

    @Query("SELECT * FROM Exercise ORDER BY workoutDayId, groupLabel, position")
    fun observeExercises(): Flow<List<Exercise>>

    @Insert suspend fun insertDay(day: WorkoutDay): Long
    @Update suspend fun updateDay(day: WorkoutDay)
    @Update suspend fun updateDays(days: List<WorkoutDay>)
    @Query("DELETE FROM WorkoutDay WHERE id = :id") suspend fun deleteDay(id: Long)

    @Insert suspend fun insertExercise(exercise: Exercise): Long
    @Insert suspend fun insertExercises(exercises: List<Exercise>)
    @Update suspend fun updateExercise(exercise: Exercise)
    @Delete suspend fun deleteExercise(exercise: Exercise)

    @Query("SELECT COALESCE(MAX(position), 0) FROM Exercise WHERE workoutDayId = :dayId")
    suspend fun maxPosition(dayId: Long): Int

    @Query("SELECT * FROM WorkoutSession WHERE profileId = :profileId ORDER BY date DESC, id DESC")
    fun observeSessions(profileId: Long): Flow<List<WorkoutSession>>

    @Insert suspend fun insertSession(session: WorkoutSession): Long
    @Insert suspend fun insertSetLogs(logs: List<SetLog>)

    /** The latest note per exercise name on one side, for "Last time: 135 x 8". */
    @Query(
        "SELECT * FROM SetLog WHERE id IN (" +
            "SELECT MAX(id) FROM SetLog WHERE profileId = :profileId AND (weight IS NOT NULL OR reps IS NOT NULL) " +
            "GROUP BY exerciseNameUsed)",
    )
    fun observeLatestLogs(profileId: Long): Flow<List<SetLog>>

    // Backup
    @Query("SELECT * FROM WorkoutDay") suspend fun allDays(): List<WorkoutDay>
    @Query("SELECT * FROM Exercise") suspend fun allExercises(): List<Exercise>
    @Query("SELECT * FROM WorkoutSession") suspend fun allSessions(): List<WorkoutSession>
    @Query("SELECT * FROM SetLog") suspend fun allSetLogs(): List<SetLog>
    @Insert suspend fun insertDays(days: List<WorkoutDay>)
    @Insert suspend fun insertSessions(sessions: List<WorkoutSession>)
    @Query("DELETE FROM WorkoutDay") suspend fun deleteAllDays()
    @Query("DELETE FROM WorkoutSession") suspend fun deleteAllSessions()
}

@Dao
interface SaunaDao {
    @Query("SELECT * FROM SaunaLog WHERE profileId = :profileId ORDER BY date DESC, id DESC")
    fun observeAll(profileId: Long): Flow<List<SaunaLog>>

    @Insert suspend fun insert(log: SaunaLog): Long

    // Backup
    @Query("SELECT * FROM SaunaLog") suspend fun all(): List<SaunaLog>
    @Insert suspend fun insertAll(logs: List<SaunaLog>)
    @Query("DELETE FROM SaunaLog") suspend fun deleteAll()
}

@Dao
interface SupplementDao {
    @Query("SELECT * FROM SupplementLog WHERE profileId = :profileId AND date = :date")
    fun observeDay(profileId: Long, date: String): Flow<List<SupplementLog>>

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insert(log: SupplementLog)

    @Query("DELETE FROM SupplementLog WHERE profileId = :profileId AND date = :date AND item = :item")
    suspend fun delete(profileId: Long, date: String, item: String)

    // Backup
    @Query("SELECT * FROM SupplementLog") suspend fun all(): List<SupplementLog>
    @Insert suspend fun insertAll(logs: List<SupplementLog>)
    @Query("DELETE FROM SupplementLog") suspend fun deleteAll()
}
