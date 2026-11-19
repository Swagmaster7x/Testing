package com.personal.aide.data

import com.personal.aide.data.db.MeetingDao
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.SeriesDao
import com.personal.aide.data.db.SeriesEntity
import com.personal.aide.data.db.WinDao
import com.personal.aide.data.db.WinEntity
import com.personal.aide.data.db.WinSource
import com.personal.aide.domain.knowledgeKey

/** Recurring meetings: which meeting belongs to which, and what came before. */
class SeriesStore(
    private val series: SeriesDao,
    private val meetings: MeetingDao,
    private val now: () -> Long = System::currentTimeMillis,
) {
    /** The series called [name], created if there isn't one. Null for a blank name. */
    suspend fun findOrCreate(name: String, calendarEventId: Long? = null): Long? {
        val clean = name.trim()
        val key = knowledgeKey(clean)
        if (key.isEmpty()) return null
        val existing = series.findByKey(key)
        if (existing != null) {
            if (existing.calendarEventId == null && calendarEventId != null) series.update(existing.copy(calendarEventId = calendarEventId))
            return existing.id
        }
        return series.insert(SeriesEntity(name = clean, key = key, calendarEventId = calendarEventId, createdAt = now()))
    }

    /** Puts a meeting in a series, or with null takes it out of the one it is in. */
    suspend fun assign(meetingId: Long, seriesId: Long?) = meetings.setSeries(meetingId, seriesId)

    suspend fun assignByName(meetingId: Long, name: String): Long? =
        findOrCreate(name)?.also { meetings.setSeries(meetingId, it) }

    /**
     * Recordings started from the same repeating calendar event are one series. Called when a
     * recording is saved: the second recording of an event creates the series, named after the
     * event, and later ones join it. A meeting already in a series is left where it is.
     */
    suspend fun linkByCalendar(meetingId: Long) {
        val meeting = meetings.get(meetingId) ?: return
        val eventId = meeting.calendarEventId ?: return
        if (meeting.seriesId != null) return
        val known = series.findByCalendarEvent(eventId)
        if (known != null) {
            meetings.setSeries(meetingId, known.id)
            return
        }
        val others = meetings.forCalendarEvent(eventId).filter { it.id != meetingId }
        if (others.isEmpty()) return
        // Once is a meeting; twice is a habit. The earliest one's name is the one the calendar gave it.
        val name = others.lastOrNull { !it.titleIsAuto }?.title ?: meeting.title
        val id = others.firstNotNullOfOrNull { it.seriesId } ?: findOrCreate(name, eventId) ?: return
        for (other in others) if (other.seriesId == null) meetings.setSeries(other.id, id)
        meetings.setSeries(meetingId, id)
    }

    suspend fun rename(seriesId: Long, name: String) {
        val clean = name.trim()
        val key = knowledgeKey(clean)
        if (key.isEmpty()) return
        val current = series.get(seriesId) ?: return
        val clash = series.findByKey(key)
        if (clash != null && clash.id != seriesId) {
            // Renamed to match another series: they are the same meeting, so fold this one into it.
            for (meeting in meetings.inSeries(seriesId)) meetings.setSeries(meeting.id, clash.id)
            series.delete(current)
        } else {
            series.update(current.copy(name = clean, key = key))
        }
    }

    /** Forgets the series; its meetings stay, on their own. */
    suspend fun delete(seriesId: Long) {
        meetings.clearSeries(seriesId)
        series.get(seriesId)?.let { series.delete(it) }
    }

    /** The meeting before [meeting] in its series that has notes, if any. */
    suspend fun previous(meeting: MeetingEntity): MeetingEntity? {
        val id = meeting.seriesId ?: return null
        return meetings.inSeries(id).firstOrNull { it.id != meeting.id && it.startedAt < meeting.startedAt && it.status == MeetingStatus.READY }
    }
}

/** The wins log. */
class WinStore(private val dao: WinDao, private val now: () -> Long = System::currentTimeMillis) {

    /** Adds a win unless one with the same wording is already there. Returns its id, or null if it was a duplicate or blank. */
    suspend fun add(
        title: String,
        day: Long,
        detail: String = "",
        goal: String = "",
        source: WinSource = WinSource.MANUAL,
        taskId: Long? = null,
        meetingId: Long? = null,
    ): Long? {
        val clean = title.trim()
        val key = knowledgeKey(clean)
        if (key.isEmpty()) return null
        val existing = dao.all()
        if (existing.any { it.key == key }) return null
        // The same finished task is one win, however the assistant words it the second time.
        if (taskId != null && existing.any { it.taskId == taskId }) return null
        return dao.insert(
            WinEntity(
                title = clean, key = key, detail = detail.trim(), goal = goal.trim(), day = day,
                source = source, taskId = taskId, meetingId = meetingId, createdAt = now(),
            ),
        )
    }

    suspend fun save(win: WinEntity) {
        val clean = win.title.trim()
        if (clean.isEmpty()) return
        val tidy = win.copy(title = clean, key = knowledgeKey(clean), detail = win.detail.trim(), goal = win.goal.trim())
        if (win.id == 0L) dao.insert(tidy.copy(createdAt = now())) else dao.update(tidy)
    }

    suspend fun delete(winId: Long) {
        dao.get(winId)?.let { dao.delete(it) }
    }

    /** A goal was reworded or removed: wins filed under the old wording follow it (or become unfiled). */
    suspend fun goalChanged(from: String, to: String) {
        if (from.isNotBlank() && from != to) dao.moveGoal(from, to)
    }
}
