package com.personal.aide.data

import com.personal.aide.data.db.KnowledgeDao
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.domain.knowledgeKey
import com.personal.aide.domain.knowledgeTypeOf

/** Writes to the knowledge base so that one thing has one entry, however it was learned. */
class KnowledgeBase(private val dao: KnowledgeDao, private val now: () -> Long = System::currentTimeMillis) {

    /**
     * Saves what was learned about [title]. An existing entry with the same folded title is
     * updated, whatever type it was filed under, so "Dana" learned as a person in one meeting and
     * mentioned as a fact in another stays one entry.
     *
     * [replace] true means [content] is the full new text (the assistant rewrote the entry with the
     * old text in front of it); false appends, for answers and notes that only add.
     */
    suspend fun save(
        type: KnowledgeType,
        title: String,
        content: String,
        origin: KnowledgeOrigin,
        meetingId: Long? = null,
        replace: Boolean = true,
    ): Long? {
        val cleanTitle = title.trim()
        val cleanContent = content.trim()
        val key = knowledgeKey(cleanTitle)
        if (key.isEmpty() || cleanContent.isEmpty()) return null

        val existing = dao.find(type, key) ?: dao.findByKey(key)
        val time = now()
        if (existing == null) {
            return dao.insert(
                KnowledgeEntity(
                    type = type,
                    title = cleanTitle,
                    key = key,
                    content = cleanContent,
                    sourceMeetingIds = listOfNotNull(meetingId),
                    origin = origin,
                    createdAt = time,
                    updatedAt = time,
                ),
            )
        }
        val merged = when {
            replace -> cleanContent
            existing.content.contains(cleanContent, ignoreCase = true) -> existing.content
            else -> existing.content.trimEnd() + "\n" + cleanContent
        }
        dao.update(
            existing.copy(
                content = merged,
                sourceMeetingIds = (existing.sourceMeetingIds + listOfNotNull(meetingId)).distinct(),
                updatedAt = time,
            ),
        )
        return existing.id
    }

    suspend fun saveNotes(notes: List<KnowledgeNote>, origin: KnowledgeOrigin, meetingId: Long? = null) {
        for (note in notes) save(knowledgeTypeOf(note.type), note.title, note.content, origin, meetingId)
    }
}
