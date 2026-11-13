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
