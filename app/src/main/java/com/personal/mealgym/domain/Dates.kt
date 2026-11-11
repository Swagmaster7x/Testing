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

    private val longDay = DateTimeFormatter.ofPattern("EEEE, MMM d", Locale.getDefault())
    private val shortDay = DateTimeFormatter.ofPattern("EEE, MMM d", Locale.getDefault())
    private val monthDay = DateTimeFormatter.ofPattern("MMM d", Locale.getDefault())

    fun longLabel(date: LocalDate): String = date.format(longDay)
    fun shortLabel(date: LocalDate): String = date.format(shortDay)
    fun monthDay(date: LocalDate): String = date.format(monthDay)

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
