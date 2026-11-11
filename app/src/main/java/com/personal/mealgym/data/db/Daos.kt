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

    @Query("SELECT COUNT(*) FROM Recipe")
    suspend fun count(): Int

    @Query("SELECT DISTINCT name FROM Ingredient WHERE storeSection = 'PANTRY' OR isPantryStaple = 1")
    fun observePantryIngredientNames(): Flow<List<String>>

    @Insert
    suspend fun insert(recipe: Recipe): Long

    @Update
    suspend fun update(recipe: Recipe)

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
    @Query("SELECT * FROM MealPlanEntry WHERE date BETWEEN :start AND :end")
    fun observeRange(start: String, end: String): Flow<List<MealPlanEntry>>

    @Query("SELECT * FROM MealPlanEntry WHERE date BETWEEN :start AND :end")
    suspend fun getRange(start: String, end: String): List<MealPlanEntry>

    @Query("SELECT * FROM MealPlanEntry WHERE date <= :end ORDER BY date DESC")
    fun observeUpTo(end: String): Flow<List<MealPlanEntry>>

    /** Replaces whatever is already in that date and slot. */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun put(entry: MealPlanEntry)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun putAll(entries: List<MealPlanEntry>)

    @Query("DELETE FROM MealPlanEntry WHERE date = :date AND slot = :slot")
    suspend fun clear(date: String, slot: MealSlot)

    // Backup
    @Query("SELECT * FROM MealPlanEntry") suspend fun all(): List<MealPlanEntry>
    @Query("DELETE FROM MealPlanEntry") suspend fun deleteAll()
}

@Dao
interface ShoppingDao {
    @Query("SELECT * FROM ShoppingCheck WHERE weekStartDate = :weekStart")
    fun observeWeek(weekStart: String): Flow<List<ShoppingCheck>>

    @Upsert
    suspend fun upsert(check: ShoppingCheck)

    @Query("DELETE FROM ShoppingCheck WHERE weekStartDate = :weekStart")
    suspend fun clearWeek(weekStart: String)

    // Backup
    @Query("SELECT * FROM ShoppingCheck") suspend fun all(): List<ShoppingCheck>
    @Insert suspend fun insertAll(checks: List<ShoppingCheck>)
    @Query("DELETE FROM ShoppingCheck") suspend fun deleteAll()
}

@Dao
interface WorkoutDao {
    @Query("SELECT * FROM WorkoutDay ORDER BY dayOrder")
    fun observeDays(): Flow<List<WorkoutDay>>

    @Query("SELECT * FROM WorkoutDay ORDER BY dayOrder")
    suspend fun getDays(): List<WorkoutDay>

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

    @Query("SELECT * FROM WorkoutSession ORDER BY date DESC, id DESC")
    fun observeSessions(): Flow<List<WorkoutSession>>

    @Insert suspend fun insertSession(session: WorkoutSession): Long
    @Insert suspend fun insertSetLogs(logs: List<SetLog>)

    /** The latest note per exercise name, for "Last time: 135 x 8". */
    @Query(
        "SELECT * FROM SetLog WHERE id IN (" +
            "SELECT MAX(id) FROM SetLog WHERE weight IS NOT NULL OR reps IS NOT NULL GROUP BY exerciseNameUsed)",
    )
    fun observeLatestLogs(): Flow<List<SetLog>>

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
    @Query("SELECT * FROM SaunaLog ORDER BY date DESC, id DESC")
    fun observeAll(): Flow<List<SaunaLog>>

    @Insert suspend fun insert(log: SaunaLog): Long

    // Backup
    @Query("SELECT * FROM SaunaLog") suspend fun all(): List<SaunaLog>
    @Insert suspend fun insertAll(logs: List<SaunaLog>)
    @Query("DELETE FROM SaunaLog") suspend fun deleteAll()
}
