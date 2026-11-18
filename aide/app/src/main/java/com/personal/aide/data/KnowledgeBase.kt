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
            // Already said.
            existing.content.contains(cleanContent, ignoreCase = true) -> existing.content
            // The new text repeats everything that was there and adds to it.
            cleanContent.contains(existing.content.trim(), ignoreCase = true) -> cleanContent
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

    /**
     * Saves a batch of notes from the assistant. [mayReplace] says, for an entry's folded title,
     * whether the assistant had that entry's full text in front of it when it wrote the note. Only
     * then is its note the whole new text; a note about an entry it never saw is added to what is
     * there, so nothing the assistant didn't read can be lost.
     */
    suspend fun saveNotes(
        notes: List<KnowledgeNote>,
        origin: KnowledgeOrigin,
        meetingId: Long? = null,
        mayReplace: (key: String) -> Boolean = { false },
    ) {
        for (note in notes) {
            save(knowledgeTypeOf(note.type), note.title, note.content, origin, meetingId, replace = mayReplace(knowledgeKey(note.title)))
        }
    }
}
