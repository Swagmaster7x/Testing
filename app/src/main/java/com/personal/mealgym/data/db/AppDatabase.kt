package com.personal.mealgym.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.room.migration.Migration
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
        Profile::class,
        Meta::class,
        SupplementLog::class,
    ],
    version = 5,
    exportSchema = true,
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun recipeDao(): RecipeDao
    abstract fun planDao(): PlanDao
    abstract fun shoppingDao(): ShoppingDao
    abstract fun workoutDao(): WorkoutDao
    abstract fun saunaDao(): SaunaDao
    abstract fun profileDao(): ProfileDao
    abstract fun metaDao(): MetaDao
    abstract fun supplementDao(): SupplementDao

    companion object {
        /** [onCreated] runs once, when the database file is first created (first launch). */
        fun build(context: Context, onCreated: () -> Unit = {}): AppDatabase =
            Room.databaseBuilder(context.applicationContext, AppDatabase::class.java, "mealgym.db")
                .addMigrations(MIGRATION_1_2, MIGRATION_2_3, MIGRATION_3_4, MIGRATION_4_5)
                .addCallback(
                    object : Callback() {
                        override fun onCreate(db: SupportSQLiteDatabase) = onCreated()
                    },
                )
                .build()

        /**
         * Version 2 adds the two sides. Everything already on the phone becomes Swag's
         * (profile 1); nothing is dropped.
         */
        val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(db: SupportSQLiteDatabase) {
                // Recipe library fields.
                db.execSQL("ALTER TABLE `Recipe` ADD COLUMN `protein` TEXT")
                db.execSQL("ALTER TABLE `Recipe` ADD COLUMN `isFavorite` INTEGER NOT NULL DEFAULT 0")
                db.execSQL("ALTER TABLE `Recipe` ADD COLUMN `isHidden` INTEGER NOT NULL DEFAULT 0")
                db.execSQL("ALTER TABLE `Recipe` ADD COLUMN `proteinSwaps` TEXT NOT NULL DEFAULT '[]'")
                db.execSQL("ALTER TABLE `Recipe` ADD COLUMN `activeSwap` INTEGER")
                db.execSQL("ALTER TABLE `Recipe` ADD COLUMN `onlyForProfileId` INTEGER")

                // Meal plan: one plan per side.
                db.execSQL("ALTER TABLE `MealPlanEntry` ADD COLUMN `profileId` INTEGER NOT NULL DEFAULT 1")
                db.execSQL("DROP INDEX IF EXISTS `index_MealPlanEntry_date_slot`")
                db.execSQL(
                    "CREATE UNIQUE INDEX IF NOT EXISTS `index_MealPlanEntry_profileId_date_slot` " +
                        "ON `MealPlanEntry` (`profileId`, `date`, `slot`)",
                )

                // Shopping ticks: the key gains which list they belong to.
                db.execSQL(
                    "CREATE TABLE IF NOT EXISTS `ShoppingCheck_new` (`weekStartDate` TEXT NOT NULL, " +
                        "`ingredientKey` TEXT NOT NULL, `checked` INTEGER NOT NULL, " +
                        "`listKey` TEXT NOT NULL DEFAULT 'p1', PRIMARY KEY(`listKey`, `weekStartDate`, `ingredientKey`))",
                )
                db.execSQL(
                    "INSERT INTO `ShoppingCheck_new` (`weekStartDate`, `ingredientKey`, `checked`, `listKey`) " +
                        "SELECT `weekStartDate`, `ingredientKey`, `checked`, 'p1' FROM `ShoppingCheck`",
                )
                db.execSQL("DROP TABLE `ShoppingCheck`")
                db.execSQL("ALTER TABLE `ShoppingCheck_new` RENAME TO `ShoppingCheck`")

                // Gym and sauna: per side.
                db.execSQL("ALTER TABLE `WorkoutDay` ADD COLUMN `profileId` INTEGER NOT NULL DEFAULT 1")
                db.execSQL("ALTER TABLE `WorkoutDay` ADD COLUMN `shortName` TEXT")
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_WorkoutDay_profileId` ON `WorkoutDay` (`profileId`)")
                db.execSQL("ALTER TABLE `WorkoutSession` ADD COLUMN `profileId` INTEGER NOT NULL DEFAULT 1")
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_WorkoutSession_profileId` ON `WorkoutSession` (`profileId`)")
                db.execSQL("ALTER TABLE `SetLog` ADD COLUMN `profileId` INTEGER NOT NULL DEFAULT 1")
                db.execSQL("ALTER TABLE `SaunaLog` ADD COLUMN `profileId` INTEGER NOT NULL DEFAULT 1")

                // New tables.
                db.execSQL(
                    "CREATE TABLE IF NOT EXISTS `Profile` (`id` INTEGER NOT NULL, `name` TEXT NOT NULL, " +
                        "`themeKey` TEXT NOT NULL, PRIMARY KEY(`id`))",
                )
                db.execSQL("CREATE TABLE IF NOT EXISTS `Meta` (`key` TEXT NOT NULL, `value` TEXT NOT NULL, PRIMARY KEY(`key`))")
                db.execSQL(
                    "CREATE TABLE IF NOT EXISTS `SupplementLog` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, " +
                        "`profileId` INTEGER NOT NULL, `date` TEXT NOT NULL, `item` TEXT NOT NULL)",
                )
                db.execSQL(
                    "CREATE UNIQUE INDEX IF NOT EXISTS `index_SupplementLog_profileId_date_item` " +
                        "ON `SupplementLog` (`profileId`, `date`, `item`)",
                )

                db.execSQL("INSERT OR IGNORE INTO `Profile` (`id`, `name`, `themeKey`) VALUES (1, 'Swag', 'IRON'), (2, 'Ashley', 'GLAM')")
                // The version 1 seed is installed; the app adds the version 2 seed on next start.
                db.execSQL("INSERT OR REPLACE INTO `Meta` (`key`, `value`) VALUES ('seedLevel', '1')")
            }
        }

        /**
         * Version 3 moves what was hard-wired per side onto the profile, so anyone can have it.
         * Swag and Ashley get exactly the behaviour they had.
         */
        val MIGRATION_2_3 = object : Migration(2, 3) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL("ALTER TABLE `Profile` ADD COLUMN `snackSlot` INTEGER NOT NULL DEFAULT 0")
                db.execSQL("ALTER TABLE `Profile` ADD COLUMN `portion` REAL NOT NULL DEFAULT 1.0")
                db.execSQL("ALTER TABLE `Profile` ADD COLUMN `tipsStyle` TEXT NOT NULL DEFAULT 'FILL_UP'")
                db.execSQL("ALTER TABLE `Profile` ADD COLUMN `weekBadges` INTEGER NOT NULL DEFAULT 0")
                db.execSQL("ALTER TABLE `Profile` ADD COLUMN `templateKey` TEXT")
                db.execSQL("UPDATE `Profile` SET `templateKey` = 'upper-lower-4' WHERE `id` = 1")
                db.execSQL(
                    "UPDATE `Profile` SET `snackSlot` = 1, `portion` = 0.75, `tipsStyle` = 'EASIER', " +
                        "`weekBadges` = 1, `templateKey` = 'glute-3' WHERE `id` = 2",
                )
            }
        }

        /** Version 4 adds a look of your own, made in the look creator. Nothing else changes. */
        val MIGRATION_3_4 = object : Migration(3, 4) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL("ALTER TABLE `Profile` ADD COLUMN `customLook` TEXT")
            }
        }

        /** Version 5 adds the answers to the setup questions. Nothing else changes. */
        val MIGRATION_4_5 = object : Migration(4, 5) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL("ALTER TABLE `Profile` ADD COLUMN `planAnswers` TEXT")
            }
        }
    }
}
