package com.personal.tilesurge.ui

import android.content.Context
import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Speed
import com.personal.tilesurge.core.Stages

/** Everything the game remembers between runs: settings, best scores and stage progress. Kept on the phone only. */
class Prefs(context: Context) {
    private val sp = context.getSharedPreferences("tilesurge", Context.MODE_PRIVATE)

    var sound: Boolean
        get() = sp.getBoolean("sound", true)
        set(v) = sp.edit().putBoolean("sound", v).apply()

    var buzz: Boolean
        get() = sp.getBoolean("buzz", true)
        set(v) = sp.edit().putBoolean("buzz", v).apply()

    /** Set once the player has made their first swap, so the opening hint is not shown again. */
    var hintSeen: Boolean
        get() = sp.getBoolean("hint_seen", false)
        set(v) = sp.edit().putBoolean("hint_seen", v).apply()

    var music: Boolean
        get() = sp.getBoolean("music", true)
        set(v) = sp.edit().putBoolean("music", v).apply()

    /** Set once the lessons have been finished or skipped, so they do not open by themselves again. */
    var lessonsDone: Boolean
        get() = sp.getBoolean("lessons_done", false)
        set(v) = sp.edit().putBoolean("lessons_done", v).apply()

    // ------------------------------------------------------------ a game put down part-way

    /** What was being played (see Setup.encode) and the game itself, or null. */
    val savedSetup: String? get() = sp.getString("saved_setup", null)
    val savedGame: String? get() = sp.getString("saved_game", null)

    fun saveGame(setup: String, game: String) = sp.edit().putString("saved_setup", setup).putString("saved_game", game).apply()

    fun clearSavedGame() = sp.edit().remove("saved_setup").remove("saved_game").apply()

    // ------------------------------------------------------------ Score Attack and the daily challenge

    fun bestTimed(d: Difficulty): Int = sp.getInt("timed_${d.name}", 0)

    fun recordTimed(d: Difficulty, score: Int): Boolean {
        if (score <= bestTimed(d)) return false
        sp.edit().putInt("timed_${d.name}", score).apply()
        return true
    }

    /** The best score on the challenge for [day] (a date as 20261113), or 0. Only the latest day played is kept. */
    fun dailyBest(day: Int): Int = if (sp.getInt("daily_day", 0) == day) sp.getInt("daily_best", 0) else 0

    /** Days in a row the daily challenge has been played, counting [today] if it has been. */
    fun dailyStreak(today: Int, yesterday: Int): Int {
        val last = sp.getInt("daily_day", 0)
        return if (last == today || last == yesterday) sp.getInt("daily_streak", 0) else 0
    }

    /** Records a daily score. True if it is the best for [day]. */
    fun recordDaily(day: Int, yesterday: Int, score: Int): Boolean {
        val last = sp.getInt("daily_day", 0)
        val e = sp.edit()
        if (last != day) {
            e.putInt("daily_streak", if (last == yesterday) sp.getInt("daily_streak", 0) + 1 else 1)
            e.putInt("daily_day", day).putInt("daily_best", score).apply()
            return true
        }
        val better = score > sp.getInt("daily_best", 0)
        if (better) e.putInt("daily_best", score).apply()
        return better
    }

    // ------------------------------------------------------------ puzzles

    val puzzlesSolved: Int get() = sp.getInt("puzzles_solved", 0)

    fun isPuzzleOpen(n: Int): Boolean = n <= puzzlesSolved + 1

    fun recordPuzzle(n: Int) {
        if (n > puzzlesSolved) sp.edit().putInt("puzzles_solved", n).apply()
    }

    // ------------------------------------------------------------ Infinite

    /** The difficulty last chosen for Infinite mode. */
    var difficulty: Difficulty
        get() = Difficulty.entries.getOrElse(sp.getInt("difficulty", Difficulty.EASY.ordinal)) { Difficulty.EASY }
        set(v) = sp.edit().putInt("difficulty", v.ordinal).apply()

    fun startLevel(d: Difficulty): Int =
        sp.getInt("start_level_${d.name}", d.startLevel).coerceIn(1, MAX_START_LEVEL)

    fun setStartLevel(d: Difficulty, level: Int) =
        sp.edit().putInt("start_level_${d.name}", level.coerceIn(1, MAX_START_LEVEL)).apply()

    fun bestScore(d: Difficulty): Int = sp.getInt("best_${d.name}", 0)

    /** Records [score] if it beats the best for [d]. True if it did. */
    fun recordScore(d: Difficulty, score: Int): Boolean {
        if (score <= bestScore(d)) return false
        sp.edit().putInt("best_${d.name}", score).apply()
        return true
    }

    // ------------------------------------------------------------ Stage Clear

    /** The highest stage cleared so far; 0 before the first. Stages up to one past this can be played. */
    val stagesCleared: Int get() = sp.getInt("stages_cleared", 0).coerceIn(0, Stages.COUNT)

    fun isUnlocked(stage: Int): Boolean = stage <= stagesCleared + 1

    /** The fastest clear of [stage] in frames, or 0 if it has not been cleared. */
    fun bestStageFrames(stage: Int): Int = sp.getInt("stage_time_$stage", 0)

    /** Records a clear of [stage] in [frames]. True if that is a new best time. */
    fun recordStage(stage: Int, frames: Int): Boolean {
        val e = sp.edit()
        if (stage > stagesCleared) e.putInt("stages_cleared", stage)
        val old = bestStageFrames(stage)
        val better = old == 0 || frames < old
        if (better) e.putInt("stage_time_$stage", frames)
        e.apply()
        return better
    }

    companion object {
        /** The highest speed level Infinite mode can be started at. */
        const val MAX_START_LEVEL = 30

        init {
            check(MAX_START_LEVEL <= Speed.MAX_LEVEL)
        }
    }
}
