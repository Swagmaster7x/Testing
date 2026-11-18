package com.personal.aide.domain

import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.SegmentEntity
import com.personal.aide.data.db.SegmentKind
import java.text.Normalizer

/** Folds a title for matching: "Q4 Launch — Phase 2" and "q4 launch phase 2" are one entry. */
fun knowledgeKey(title: String): String =
    Normalizer.normalize(title, Normalizer.Form.NFD)
        .replace(Regex("\\p{M}+"), "")
        .lowercase()
        .replace(Regex("[^\\p{L}\\p{N}]+"), " ")
        .trim()

fun knowledgeTypeOf(word: String): KnowledgeType = when (word.trim().lowercase()) {
    "person", "people" -> KnowledgeType.PERSON
    "project", "initiative", "product" -> KnowledgeType.PROJECT
    "term", "acronym", "jargon" -> KnowledgeType.TERM
    "decision" -> KnowledgeType.DECISION
    "process", "procedure" -> KnowledgeType.PROCESS
    "org", "organization", "organisation", "team", "customer", "client", "vendor", "company" -> KnowledgeType.ORG
    else -> KnowledgeType.FACT
}

fun KnowledgeType.word(): String = name.lowercase()

fun KnowledgeType.label(): String = when (this) {
    KnowledgeType.PERSON -> "Person"
    KnowledgeType.PROJECT -> "Project"
    KnowledgeType.TERM -> "Term"
    KnowledgeType.DECISION -> "Decision"
    KnowledgeType.PROCESS -> "Process"
    KnowledgeType.ORG -> "Team or company"
    KnowledgeType.FACT -> "Fact"
}

fun KnowledgeType.plural(): String = when (this) {
    KnowledgeType.PERSON -> "People"
    KnowledgeType.PROJECT -> "Projects"
    KnowledgeType.TERM -> "Terms"
    KnowledgeType.DECISION -> "Decisions"
    KnowledgeType.PROCESS -> "Processes"
    KnowledgeType.ORG -> "Teams & companies"
    KnowledgeType.FACT -> "Facts"
}

fun wordCount(text: String): Int = text.trim().split(Regex("\\s+")).count { it.isNotEmpty() }

/**
 * The transcript as the assistant reads it: one line per segment with a clock, typed notes and
 * flagged moments marked so they can be trusted over recognized speech.
 */
fun transcriptText(segments: List<SegmentEntity>): String = buildString {
    for (segment in segments) {
        val text = segment.text.trim()
        if (text.isEmpty() && segment.kind != SegmentKind.FLAG) continue
        append('[').append(Days.clock(segment.offsetMs)).append("] ")
        when (segment.kind) {
            SegmentKind.SPEECH -> append(text)
            SegmentKind.NOTE -> append("[NOTE] ").append(text)
            SegmentKind.FLAG -> append("[FLAG] ").append(text.ifEmpty { "The user marked this moment as important." })
        }
        append('\n')
    }
}.trimEnd()

/** Splits pasted text into segments, a paragraph or line at a time, so it reads like a transcript. */
fun splitImportedText(text: String): List<String> =
    text.replace("\r\n", "\n")
        .split(Regex("\n+"))
        .map { it.trim() }
        .filter { it.isNotEmpty() }

/** Trims to [max] characters on a word boundary, with an ellipsis. */
fun String.ellipsize(max: Int): String {
    if (length <= max) return this
    val cut = take(max)
    val space = cut.lastIndexOf(' ')
    return (if (space > max * 0.6) cut.take(space) else cut).trimEnd(',', '.', ';', ':', ' ') + "…"
}
