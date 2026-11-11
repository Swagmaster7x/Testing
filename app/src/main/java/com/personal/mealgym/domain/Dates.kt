package com.personal.mealgym.domain

import java.time.DayOfWeek
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.TextStyle
import java.time.temporal.TemporalAdjusters
import java.util.Locale

/** Dates are stored as ISO-8601 text (yyyy-MM-dd) so they sort and read naturally. */
object Dates {
    fun iso(date: LocalDate): String = date.toString()
    fun parse(text: String): LocalDate = LocalDate.parse(text)

    /** Weeks run Monday to Sunday. */
    fun weekStart(date: LocalDate): LocalDate = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
    fun weekDays(weekStart: LocalDate): List<LocalDate> = (0L until 7L).map { weekStart.plusDays(it) }

    // Built per call so a locale change while the app is open is picked up.
    private fun pattern(p: String) = DateTimeFormatter.ofPattern(p, Locale.getDefault())

    fun longLabel(date: LocalDate): String = date.format(pattern("EEEE, MMM d"))
    fun shortLabel(date: LocalDate): String = date.format(pattern("EEE, MMM d"))
    fun monthDay(date: LocalDate): String = date.format(pattern("MMM d"))

    fun weekLabel(weekStart: LocalDate): String {
        val end = weekStart.plusDays(6)
        return if (weekStart.month == end.month) {
            "${monthDay(weekStart)} – ${end.dayOfMonth}"
        } else {
            "${monthDay(weekStart)} – ${monthDay(end)}"
        }
    }

    fun shortDayName(day: DayOfWeek): String = day.getDisplayName(TextStyle.SHORT, Locale.getDefault())
}
