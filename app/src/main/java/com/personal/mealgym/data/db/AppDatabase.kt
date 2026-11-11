package com.personal.mealgym.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteDatabase

/** There is deliberately no table for body weight, calorie totals or goals. */
@Database(
    entities = [
        Recipe::class,
        Ingredient::class,
        MealPlanEntry::class,
        ShoppingCheck::class,
        WorkoutDay::class,
        Exercise::class,
        WorkoutSession::class,
        SetLog::class,
        SaunaLog::class,
    ],
    version = 1,
    exportSchema = true,
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun recipeDao(): RecipeDao
    abstract fun planDao(): PlanDao
    abstract fun shoppingDao(): ShoppingDao
    abstract fun workoutDao(): WorkoutDao
    abstract fun saunaDao(): SaunaDao

    companion object {
        /** [onCreated] runs once, when the database file is first created (first launch). */
        fun build(context: Context, onCreated: () -> Unit = {}): AppDatabase =
            Room.databaseBuilder(context.applicationContext, AppDatabase::class.java, "mealgym.db")
                .addCallback(
                    object : Callback() {
                        override fun onCreate(db: SupportSQLiteDatabase) = onCreated()
                    },
                )
                .build()
    }
}
