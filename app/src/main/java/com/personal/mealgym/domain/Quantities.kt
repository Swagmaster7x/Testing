package com.personal.mealgym.domain

import kotlin.math.abs
import kotlin.math.floor
import kotlin.math.roundToLong

/** Parses and formats recipe quantities such as "1/2", "1 1/2" and "1.5". */
object Quantities {

    private val fractions = listOf(
        0.0 to "",
        1.0 / 8 to "1/8",
        1.0 / 4 to "1/4",
        1.0 / 3 to "1/3",
        3.0 / 8 to "3/8",
        1.0 / 2 to "1/2",
        5.0 / 8 to "5/8",
        2.0 / 3 to "2/3",
        3.0 / 4 to "3/4",
        7.0 / 8 to "7/8",
        1.0 to "",
    )

    /** Returns null for blank or unreadable text. */
    fun parse(text: String?): Double? {
        val t = text?.trim()?.replace(',', '.') ?: return null
        if (t.isEmpty()) return null
        val parts = t.split(Regex("\\s+"))
        var total = 0.0
        for (part in parts) {
            total += parsePart(part) ?: return null
        }
        return total
    }

    private fun parsePart(part: String): Double? {
        val slash = part.indexOf('/')
        if (slash >= 0) {
            val num = part.substring(0, slash).toDoubleOrNull() ?: return null
            val den = part.substring(slash + 1).toDoubleOrNull() ?: return null
            if (den == 0.0) return null
            return num / den
        }
        return part.toDoubleOrNull()
    }

    /** 0.5 -> "1/2", 1.5 -> "1 1/2", 2.0 -> "2", 1.2 -> "1.2". */
    fun format(value: Double): String {
        if (value <= 0.0) return "0"
        val whole = floor(value)
        val rest = value - whole
        val match = fractions.firstOrNull { abs(it.first - rest) < 0.01 }
        if (match != null) {
            val wholePart = if (match.first == 1.0) whole + 1 else whole
            val wholeText = if (wholePart > 0) wholePart.toLong().toString() else ""
            return listOf(wholeText, match.second).filter { it.isNotEmpty() }.joinToString(" ")
        }
        val rounded = (value * 100).roundToLong() / 100.0
        return if (rounded == floor(rounded)) rounded.toLong().toString() else rounded.toString()
    }
}
