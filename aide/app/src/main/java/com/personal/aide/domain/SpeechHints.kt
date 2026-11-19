package com.personal.aide.domain

import com.personal.aide.data.WorkProfile
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeType

/**
 * The names and terms a speech recognizer should listen out for in this user's meetings: who is
 * in the room, the people and projects in their profile, and what the knowledge base calls
 * things. A recognizer left to itself hears "Priya" as "prior" and "RateStream" as "rate stream".
 *
 * The people in the meeting come first, then the profile, then the knowledge base in the order
 * given (callers pass it most recently touched first); at most [limit] in all.
 */
fun speechHints(
    attendees: List<String>,
    profile: WorkProfile,
    entries: List<KnowledgeEntity>,
    limit: Int = 100,
): List<String> {
    val seen = HashSet<String>()
    val hints = ArrayList<String>()

    fun add(text: String) {
        // "Priya Nair — VP Product" is a name with a note attached; the name is the part worth hearing.
        val clean = text.substringBefore('—').substringBefore('–').substringBefore(" - ").substringBefore('(').substringBefore(',').substringBefore(':').trim()
        if (clean.length !in 2..40 || clean.none { it.isLetter() }) return
        if (seen.add(clean.lowercase())) hints += clean
    }

    attendees.forEach(::add)
    add(profile.name)
    add(profile.manager)
    add(profile.company)
    profile.stakeholders.forEach(::add)
    profile.projects.forEach(::add)
    profile.tools.forEach(::add)
    val spoken = setOf(KnowledgeType.PERSON, KnowledgeType.PROJECT, KnowledgeType.TERM, KnowledgeType.ORG)
    entries.filter { it.type in spoken }.forEach { add(it.title) }
    return hints.take(limit)
}
