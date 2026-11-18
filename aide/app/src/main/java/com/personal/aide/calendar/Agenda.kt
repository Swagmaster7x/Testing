package com.personal.aide.calendar

import android.Manifest
import android.content.ContentUris
import android.content.Context
import android.content.pm.PackageManager
import android.provider.CalendarContract
import androidx.core.content.ContextCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class CalendarEvent(
    val id: Long,
    val title: String,
    val start: Long,
    val end: Long,
    val allDay: Boolean = false,
    val location: String = "",
    val attendees: List<String> = emptyList(),
)

/** The user's calendar, as far as they have let the app see it. */
interface Agenda {
    /** Events that overlap the given stretch, earliest first. Empty when the calendar isn't connected. */
    suspend fun events(fromMillis: Long, toMillis: Long): List<CalendarEvent>
}

object NoAgenda : Agenda {
    override suspend fun events(fromMillis: Long, toMillis: Long): List<CalendarEvent> = emptyList()
}

/** Reads the calendars already on the phone. Nothing is written, and nothing is read without the permission. */
class DeviceAgenda(context: Context, private val enabled: suspend () -> Boolean) : Agenda {
    private val context = context.applicationContext

    fun hasPermission(): Boolean =
        ContextCompat.checkSelfPermission(context, Manifest.permission.READ_CALENDAR) == PackageManager.PERMISSION_GRANTED

    override suspend fun events(fromMillis: Long, toMillis: Long): List<CalendarEvent> {
        if (!enabled() || !hasPermission()) return emptyList()
        return withContext(Dispatchers.IO) {
            runCatching { query(fromMillis, toMillis) }.getOrDefault(emptyList())
        }
    }

    private fun query(fromMillis: Long, toMillis: Long): List<CalendarEvent> {
        val uri = CalendarContract.Instances.CONTENT_URI.buildUpon().also {
            ContentUris.appendId(it, fromMillis)
            ContentUris.appendId(it, toMillis)
        }.build()
        val projection = arrayOf(
            CalendarContract.Instances.EVENT_ID,
            CalendarContract.Instances.TITLE,
            CalendarContract.Instances.BEGIN,
            CalendarContract.Instances.END,
            CalendarContract.Instances.ALL_DAY,
            CalendarContract.Instances.EVENT_LOCATION,
            CalendarContract.Instances.SELF_ATTENDEE_STATUS,
        )
        val events = ArrayList<CalendarEvent>()
        context.contentResolver.query(uri, projection, null, null, CalendarContract.Instances.BEGIN + " ASC")?.use { cursor ->
            while (cursor.moveToNext()) {
                // An invitation the user turned down isn't on their day.
                if (cursor.getInt(6) == CalendarContract.Attendees.ATTENDEE_STATUS_DECLINED) continue
                val title = cursor.getString(1)?.trim().orEmpty()
                if (title.isEmpty()) continue
                events += CalendarEvent(
                    id = cursor.getLong(0),
                    title = title,
                    start = cursor.getLong(2),
                    end = cursor.getLong(3),
                    allDay = cursor.getInt(4) != 0,
                    location = cursor.getString(5)?.trim().orEmpty(),
                )
            }
        }
        return events.distinctBy { Triple(it.id, it.start, it.title) }.map { it.copy(attendees = attendees(it.id)) }
    }

    private fun attendees(eventId: Long): List<String> {
        val names = ArrayList<String>()
        context.contentResolver.query(
            CalendarContract.Attendees.CONTENT_URI,
            arrayOf(CalendarContract.Attendees.ATTENDEE_NAME, CalendarContract.Attendees.ATTENDEE_EMAIL),
            CalendarContract.Attendees.EVENT_ID + " = ?",
            arrayOf(eventId.toString()),
            null,
        )?.use { cursor ->
            while (cursor.moveToNext() && names.size < 25) {
                val name = cursor.getString(0)?.trim().orEmpty()
                val email = cursor.getString(1)?.trim().orEmpty()
                // A room or resource calendar isn't a person.
                if (email.endsWith("resource.calendar.google.com")) continue
                val label = name.ifEmpty { email.substringBefore('@').replace('.', ' ') }
                if (label.isNotEmpty()) names += label
            }
        }
        return names.distinct()
    }
}
