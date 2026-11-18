package com.personal.aide.domain

import kotlin.math.ln

/**
 * Finds what the assistant already has that bears on a question or a transcript. Plain keyword
 * ranking (BM25 with a boost for words in the title): a personal knowledge base is small enough
 * that this runs over everything in memory, and nothing leaves the phone to do it.
 */
object Retrieval {
    private val stopwords = setOf(
        "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "can", "could", "did", "do", "does", "for",
        "from", "had", "has", "have", "he", "her", "him", "his", "how", "i", "if", "in", "into", "is", "it", "its",
        "just", "me", "my", "no", "not", "of", "on", "or", "our", "she", "so", "some", "than", "that", "the", "their",
        "them", "then", "there", "these", "they", "this", "to", "up", "us", "was", "we", "were", "what", "when",
        "where", "which", "who", "why", "will", "with", "would", "you", "your", "about", "any", "all", "also", "am",
        "get", "got", "going", "know", "like", "need", "one", "out", "over", "really", "right", "say", "said", "see",
        "think", "want", "well", "yeah", "yes", "okay", "ok", "um", "uh",
    )

    fun tokens(text: String): List<String> =
        text.lowercase().split(Regex("[^\\p{L}\\p{N}]+")).filter { it.length > 1 && it !in stopwords }

    data class Doc<T>(val item: T, val title: String, val body: String)

    data class Hit<T>(val item: T, val score: Double)

    /** The documents that share words with [query], best first. Documents sharing none are left out. */
    fun <T> rank(query: String, docs: List<Doc<T>>, limit: Int = Int.MAX_VALUE): List<Hit<T>> {
        val queryTerms = tokens(query).distinct()
        if (queryTerms.isEmpty() || docs.isEmpty()) return emptyList()

        val bodies = docs.map { tokens(it.title + " " + it.body) }
        val titles = docs.map { tokens(it.title).toSet() }
        val averageLength = bodies.sumOf { it.size }.toDouble().coerceAtLeast(1.0) / docs.size
        val documentFrequency = HashMap<String, Int>()
        for (body in bodies) for (term in body.toSet()) documentFrequency.merge(term, 1, Int::plus)

        val k1 = 1.4
        val b = 0.6
        return docs.indices.mapNotNull { index ->
            val body = bodies[index]
            if (body.isEmpty()) return@mapNotNull null
            val counts = body.groupingBy { it }.eachCount()
            var score = 0.0
            for (term in queryTerms) {
                val frequency = counts[term] ?: continue
                val df = documentFrequency[term] ?: continue
                val idf = ln(1.0 + (docs.size - df + 0.5) / (df + 0.5))
                val saturation = frequency * (k1 + 1) / (frequency + k1 * (1 - b + b * body.size / averageLength))
                score += idf * saturation * (if (term in titles[index]) 2.5 else 1.0)
            }
            if (score > 0) Hit(docs[index].item, score) else null
        }.sortedByDescending { it.score }.take(limit)
    }

    /**
     * For a long text such as a transcript: which of [docs] does it mention by name? A document
     * counts when every word of its title appears in the text. Returns them most-mentioned first.
     */
    fun <T> mentionedIn(text: String, docs: List<Doc<T>>): List<T> {
        val counts = tokens(text).groupingBy { it }.eachCount()
        if (counts.isEmpty()) return emptyList()
        return docs.mapNotNull { doc ->
            val titleTerms = tokens(doc.title).distinct()
            if (titleTerms.isEmpty()) return@mapNotNull null
            val hits = titleTerms.map { counts[it] ?: 0 }
            if (hits.any { it == 0 }) null else doc.item to hits.min()
        }.sortedByDescending { it.second }.map { it.first }
    }
}
