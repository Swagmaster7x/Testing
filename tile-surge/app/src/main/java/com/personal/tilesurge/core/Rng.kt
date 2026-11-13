package com.personal.tilesurge.core

/**
 * A small deterministic random generator (SplitMix64).
 * The same seed always gives the same game, which is what lets the tests replay one.
 */
class Rng(seed: Long) {
    private var state = seed

    fun nextLong(): Long {
        state += 0x9E3779B97F4A7C15UL.toLong()
        var z = state
        z = (z xor (z ushr 30)) * 0xBF58476D1CE4E5B9UL.toLong()
        z = (z xor (z ushr 27)) * 0x94D049BB133111EBUL.toLong()
        return z xor (z ushr 31)
    }

    /** A value from 0 until [bound]. */
    fun nextInt(bound: Int): Int {
        require(bound > 0)
        return ((nextLong() ushr 33) % bound).toInt()
    }
}
