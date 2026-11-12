package com.personal.mealgym.domain

import java.text.Normalizer

/** Matching for the search boxes: case and accents don't matter, so "golabki" finds "Gołąbki". */
object Search {
    private val marks = Regex("\\p{Mn}+")

    /** Letters that don't break down into a plain letter and an accent. */
    private val plain = mapOf('ł' to "l", 'ø' to "o", 'ı' to "i", 'ß' to "ss", 'æ' to "ae", 'œ' to "oe", 'đ' to "d", 'ð' to "d", 'þ' to "th")

    fun fold(text: String): String {
        val base = Normalizer.normalize(text.lowercase(), Normalizer.Form.NFD).replace(marks, "")
        return buildString(base.length) { for (ch in base) append(plain[ch] ?: ch) }
    }

    /** True when [query] is blank or appears in [text]. */
    fun matches(text: String, query: String): Boolean {
        val q = fold(query.trim())
        return q.isEmpty() || fold(text).contains(q)
    }
}
