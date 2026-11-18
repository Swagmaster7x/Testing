package com.personal.aide.domain

import java.time.DayOfWeek
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import java.time.format.TextStyle
import java.util.Locale

/** Dates are stored as days since 1970-01-01 ("epoch days") in the phone's own time zone. */
object Days {
    fun today(zone: ZoneId = ZoneId.systemDefault(), now: Long = System.currentTimeMillis()): Long =
        Instant.ofEpochMilli(now).atZone(zone).toLocalDate().toEpochDay()

    fun ofMillis(millis: Long, zone: ZoneId = ZoneId.systemDefault()): Long =
        Instant.ofEpochMilli(millis).atZone(zone).toLocalDate().toEpochDay()

    fun startMillis(day: Long, zone: ZoneId = ZoneId.systemDefault()): Long =
        LocalDate.ofEpochDay(day).atStartOfDay(zone).toInstant().toEpochMilli()

    /** The Monday on or before [day]. */
    fun weekStart(day: Long): Long {
        val date = LocalDate.ofEpochDay(day)
        return day - (date.dayOfWeek.value - DayOfWeek.MONDAY.value)
    }

    fun iso(day: Long): String = LocalDate.ofEpochDay(day).toString()

    /** Reads an ISO date ("2026-11-20"); anything else, including blank, is no date. */
    fun parseIso(text: String): Long? = try {
        LocalDate.parse(text.trim().take(10)).toEpochDay()
    } catch (_: DateTimeParseException) {
        null
    }

    fun weekdayName(day: Long, locale: Locale = Locale.getDefault()): String =
        LocalDate.ofEpochDay(day).dayOfWeek.getDisplayName(TextStyle.FULL, locale)

    fun shortWeekday(day: Long, locale: Locale = Locale.getDefault()): String =
        LocalDate.ofEpochDay(day).dayOfWeek.getDisplayName(TextStyle.SHORT, locale)

    /** "Wednesday, 18 November 2026": the form dates take in prompts. */
    fun longDate(day: Long): String =
        LocalDate.ofEpochDay(day).format(DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy", Locale.ENGLISH))

    fun mediumDate(day: Long, locale: Locale = Locale.getDefault()): String =
        LocalDate.ofEpochDay(day).format(DateTimeFormatter.ofPattern("EEE d MMM", locale))

    /** How a due date reads next to a task: "Today", "Tomorrow", "Fri", "Mon 30 Nov", "3 days late". */
    fun dueLabel(day: Long, today: Long, locale: Locale = Locale.getDefault()): String {
        val delta = day - today
        return when {
            delta == 0L -> "Today"
            delta == 1L -> "Tomorrow"
            delta == -1L -> "Yesterday"
            delta < -1 -> "${-delta} days late"
            delta in 2..6 -> shortWeekday(day, locale)
            else -> mediumDate(day, locale)
        }
    }

    fun timeOfDay(millis: Long, zone: ZoneId = ZoneId.systemDefault(), locale: Locale = Locale.getDefault()): String =
        Instant.ofEpochMilli(millis).atZone(zone).format(DateTimeFormatter.ofPattern("h:mm a", locale))

    /** "Wed 18 Nov, 2:30 PM" */
    fun dateTime(millis: Long, zone: ZoneId = ZoneId.systemDefault(), locale: Locale = Locale.getDefault()): String =
        Instant.ofEpochMilli(millis).atZone(zone).format(DateTimeFormatter.ofPattern("EEE d MMM, h:mm a", locale))

    /** "1h 05m", "12 min", "45 sec" */
    fun duration(millis: Long): String {
        val totalSeconds = (millis / 1000).coerceAtLeast(0)
        val hours = totalSeconds / 3600
        val minutes = (totalSeconds % 3600) / 60
        return when {
            hours > 0 -> "${hours}h ${minutes.toString().padStart(2, '0')}m"
            minutes > 0 -> "$minutes min"
            else -> "$totalSeconds sec"
        }
    }

    /** "04:07" or "1:04:07": a running clock. */
    fun clock(millis: Long): String {
        val totalSeconds = (millis / 1000).coerceAtLeast(0)
        val hours = totalSeconds / 3600
        val minutes = (totalSeconds % 3600) / 60
        val seconds = totalSeconds % 60
        val mmss = "${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}"
        return if (hours > 0) "$hours:$mmss" else mmss
    }
}
