package com.personal.aide.domain

import com.personal.aide.testing.Fixed
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.util.Locale

class DaysTest {
    private val newYork = ZoneId.of("America/New_York")
    private val london = ZoneId.of("Europe/London")

    private fun day(year: Int, month: Int, dayOfMonth: Int) = LocalDate.of(year, month, dayOfMonth).toEpochDay()

    // -------------------------------------------------------------------------------------------
    // Weeks

    @Test
    fun `week starts on the Monday on or before the day`() {
        val monday = day(2026, 11, 16)
        for (offset in 0..6) {
            assertEquals("Monday + $offset", monday, Days.weekStart(monday + offset))
        }
        assertEquals("the Sunday before belongs to the week before", monday - 7, Days.weekStart(monday - 1))
        assertEquals("the next Monday starts a new week", monday + 7, Days.weekStart(monday + 7))
    }

    @Test
    fun `week start crosses month and year boundaries`() {
        // 1 January 2027 is a Friday; its week began on Monday 28 December 2026.
        assertEquals(day(2026, 12, 28), Days.weekStart(day(2027, 1, 1)))
        // 1 March 2026 is a Sunday; its week began on Monday 23 February.
        assertEquals(day(2026, 2, 23), Days.weekStart(day(2026, 3, 1)))
    }

    @Test
    fun `week start works before 1970`() {
        // 1 January 1970 was a Thursday.
        assertEquals(-3L, Days.weekStart(0))
        assertEquals(day(1969, 12, 22), Days.weekStart(day(1969, 12, 28)))
        assertEquals(day(1969, 12, 29), Days.weekStart(day(1969, 12, 29)))
    }

    @Test
    fun `every day of a long stretch lands on a Monday within the previous six days`() {
        for (d in day(2024, 1, 1)..day(2028, 12, 31)) {
            val start = Days.weekStart(d)
            assertEquals(java.time.DayOfWeek.MONDAY, LocalDate.ofEpochDay(start).dayOfWeek)
            assertEquals(true, d - start in 0..6)
        }
    }

    // -------------------------------------------------------------------------------------------
    // Instants and time zones

    @Test
    fun `the same instant is a different day in different places`() {
        val instant = Instant.parse("2026-11-18T03:30:00Z").toEpochMilli()
        assertEquals(day(2026, 11, 17), Days.ofMillis(instant, newYork))
        assertEquals(day(2026, 11, 18), Days.ofMillis(instant, london))
        assertEquals(day(2026, 11, 18), Days.ofMillis(instant, ZoneId.of("Asia/Tokyo")))
        assertEquals(day(2026, 11, 17), Days.ofMillis(instant, ZoneId.of("Pacific/Honolulu")))

        val later = Instant.parse("2026-11-18T11:00:00Z").toEpochMilli()
        assertEquals(day(2026, 11, 19), Days.ofMillis(later, ZoneId.of("Pacific/Kiritimati")))
        assertEquals(day(2026, 11, 18), Days.ofMillis(later, ZoneId.of("Pacific/Honolulu")))
    }

    @Test
    fun `today follows the zone it is asked about`() {
        val instant = Instant.parse("2026-11-18T03:30:00Z").toEpochMilli()
        assertEquals(day(2026, 11, 17), Days.today(newYork, instant))
        assertEquals(day(2026, 11, 18), Days.today(london, instant))
    }

    @Test
    fun `a day starts at local midnight`() {
        assertEquals(Instant.parse("2026-11-18T05:00:00Z").toEpochMilli(), Days.startMillis(day(2026, 11, 18), newYork))
        assertEquals(Instant.parse("2026-07-18T04:00:00Z").toEpochMilli(), Days.startMillis(day(2026, 7, 18), newYork))
        assertEquals(Instant.parse("2026-11-18T00:00:00Z").toEpochMilli(), Days.startMillis(day(2026, 11, 18), london))
        assertEquals(Instant.parse("2026-11-17T15:00:00Z").toEpochMilli(), Days.startMillis(day(2026, 11, 18), ZoneId.of("Asia/Tokyo")))
    }

    @Test
    fun `days are 23 and 25 hours long when the clocks change`() {
        val hour = 3_600_000L
        // New York: clocks go forward on 8 March 2026 and back on 1 November 2026.
        assertEquals(23 * hour, Days.startMillis(day(2026, 3, 9), newYork) - Days.startMillis(day(2026, 3, 8), newYork))
        assertEquals(25 * hour, Days.startMillis(day(2026, 11, 2), newYork) - Days.startMillis(day(2026, 11, 1), newYork))
        // London: forward on 29 March 2026, back on 25 October 2026.
        assertEquals(23 * hour, Days.startMillis(day(2026, 3, 30), london) - Days.startMillis(day(2026, 3, 29), london))
        assertEquals(25 * hour, Days.startMillis(day(2026, 10, 26), london) - Days.startMillis(day(2026, 10, 25), london))
        assertEquals(24 * hour, Days.startMillis(day(2026, 11, 19), newYork) - Days.startMillis(day(2026, 11, 18), newYork))
    }

    @Test
    fun `the first and last millisecond of a day belong to it across a year of clock changes`() {
        val zones = listOf(
            newYork, london, ZoneId.of("Asia/Tokyo"), ZoneId.of("Australia/Sydney"), ZoneId.of("Asia/Kolkata"),
            ZoneId.of("Pacific/Auckland"), ZoneId.of("America/St_Johns"), ZoneId.of("UTC"),
        )
        for (zone in zones) {
            for (d in day(2026, 1, 1)..day(2026, 12, 31)) {
                val start = Days.startMillis(d, zone)
                val nextStart = Days.startMillis(d + 1, zone)
                assertEquals("$zone start of ${Days.iso(d)}", d, Days.ofMillis(start, zone))
                assertEquals("$zone end of ${Days.iso(d)}", d, Days.ofMillis(nextStart - 1, zone))
                assertEquals("$zone just before ${Days.iso(d)}", d - 1, Days.ofMillis(start - 1, zone))
            }
        }
    }

    @Test
    fun `a day whose midnight does not exist still starts and ends in the right place`() {
        // São Paulo skipped from 00:00 straight to 01:00 on 4 November 2018.
        val zone = ZoneId.of("America/Sao_Paulo")
        val d = day(2018, 11, 4)
        val start = Days.startMillis(d, zone)
        assertEquals(Instant.parse("2018-11-04T03:00:00Z").toEpochMilli(), start)
        assertEquals(d, Days.ofMillis(start, zone))
        assertEquals(d - 1, Days.ofMillis(start - 1, zone))
        assertEquals(23 * 3_600_000L, Days.startMillis(d + 1, zone) - start)
    }

    // -------------------------------------------------------------------------------------------
    // ISO dates

    @Test
    fun `iso writes and reads back the same day`() {
        assertEquals("2026-11-18", Days.iso(day(2026, 11, 18)))
        assertEquals("1970-01-01", Days.iso(0))
        assertEquals("2024-02-29", Days.iso(day(2024, 2, 29)))
        for (d in listOf(-400L, 0L, 1L, day(2024, 2, 29), day(2026, 12, 31), day(2100, 1, 1))) {
            assertEquals(d, Days.parseIso(Days.iso(d)))
        }
    }

    @Test
    fun `parseIso accepts a date with space around it or a time after it`() {
        val expected = day(2026, 11, 20)
        assertEquals(expected, Days.parseIso("2026-11-20"))
        assertEquals(expected, Days.parseIso("  2026-11-20\n"))
        assertEquals(expected, Days.parseIso("2026-11-20T09:00:00Z"))
        assertEquals(expected, Days.parseIso("2026-11-20 (Friday)"))
    }

    @Test
    fun `parseIso reads anything else as no date`() {
        for (text in listOf("", "   ", "tomorrow", "Friday", "next week", "20/11/2026", "11-20-2026", "2026-11", "2026-1-5", "20261120", "null", "TBD")) {
            assertNull("'$text'", Days.parseIso(text))
        }
    }

    @Test
    fun `parseIso rejects dates that do not exist`() {
        assertNull(Days.parseIso("2026-02-30"))
        assertNull(Days.parseIso("2026-13-01"))
        assertNull(Days.parseIso("2026-00-10"))
        assertNull(Days.parseIso("2025-02-29"))
        assertEquals(day(2024, 2, 29), Days.parseIso("2024-02-29"))
    }

    // -------------------------------------------------------------------------------------------
    // Labels

    @Test
    fun `weekday names`() {
        assertEquals("Wednesday", Days.weekdayName(Fixed.today, Locale.ENGLISH))
        assertEquals("Wed", Days.shortWeekday(Fixed.today, Locale.ENGLISH))
        assertEquals("Monday", Days.weekdayName(Fixed.monday, Locale.ENGLISH))
        assertEquals("Sunday", Days.weekdayName(Fixed.sunday, Locale.ENGLISH))
    }

    @Test
    fun `long date is the same in every locale because it goes into prompts`() {
        val before = Locale.getDefault()
        try {
            for (locale in listOf(Locale.GERMANY, Locale.JAPAN, Locale.forLanguageTag("ar-SA"), Locale.US)) {
                Locale.setDefault(locale)
                assertEquals("Wednesday, 18 November 2026", Days.longDate(Fixed.today))
                assertEquals("Sunday, 1 March 2026", Days.longDate(day(2026, 3, 1)))
            }
        } finally {
            Locale.setDefault(before)
        }
    }

    @Test
    fun `medium date`() {
        assertEquals("Wed 18 Nov", Days.mediumDate(Fixed.today, Locale.ENGLISH))
        assertEquals("Mon 30 Nov", Days.mediumDate(day(2026, 11, 30), Locale.ENGLISH))
        assertEquals("Fri 1 Jan", Days.mediumDate(day(2027, 1, 1), Locale.ENGLISH))
    }

    @Test
    fun `due label reads naturally around today`() {
        val today = Fixed.today
        assertEquals("Today", Days.dueLabel(today, today, Locale.ENGLISH))
        assertEquals("Tomorrow", Days.dueLabel(today + 1, today, Locale.ENGLISH))
        assertEquals("Yesterday", Days.dueLabel(today - 1, today, Locale.ENGLISH))
        assertEquals("2 days late", Days.dueLabel(today - 2, today, Locale.ENGLISH))
        assertEquals("3 days late", Days.dueLabel(today - 3, today, Locale.ENGLISH))
        assertEquals("40 days late", Days.dueLabel(today - 40, today, Locale.ENGLISH))
    }

    @Test
    fun `due label names the weekday within a week and the date beyond`() {
        val today = Fixed.today // a Wednesday
        assertEquals("Fri", Days.dueLabel(today + 2, today, Locale.ENGLISH))
        assertEquals("Sat", Days.dueLabel(today + 3, today, Locale.ENGLISH))
        assertEquals("Tue", Days.dueLabel(today + 6, today, Locale.ENGLISH))
        // A week out, the bare weekday would be ambiguous with today's.
        assertEquals("Wed 25 Nov", Days.dueLabel(today + 7, today, Locale.ENGLISH))
        assertEquals("Mon 30 Nov", Days.dueLabel(today + 12, today, Locale.ENGLISH))
        assertEquals("Fri 1 Jan", Days.dueLabel(day(2027, 1, 1), today, Locale.ENGLISH))
    }

    @Test
    fun `time of day and date-time follow the zone`() {
        assertEquals("2:30 PM", Days.timeOfDay(Fixed.now, newYork, Locale.US))
        assertEquals("7:30 PM", Days.timeOfDay(Fixed.now, london, Locale.US))
        assertEquals("Wed 18 Nov, 2:30 PM", Days.dateTime(Fixed.now, newYork, Locale.US))
        assertEquals("Thu 19 Nov, 4:30 AM", Days.dateTime(Fixed.now, ZoneId.of("Asia/Tokyo"), Locale.US))
        assertEquals("12:00 AM", Days.timeOfDay(Days.startMillis(Fixed.today, newYork), newYork, Locale.US))
        assertEquals("12:05 PM", Days.timeOfDay(Fixed.at(Fixed.today, 12, 5), newYork, Locale.US))
    }

    @Test
    fun `duration`() {
        assertEquals("1h 05m", Days.duration(65 * 60_000L))
        assertEquals("12 min", Days.duration(12 * 60_000L))
        assertEquals("12 min", Days.duration(12 * 60_000L + 59_000))
        assertEquals("45 sec", Days.duration(45_000))
        assertEquals("45 sec", Days.duration(45_999))
        assertEquals("0 sec", Days.duration(0))
        assertEquals("0 sec", Days.duration(-5_000))
        assertEquals("1 min", Days.duration(60_000))
        assertEquals("59 min", Days.duration(3_599_000))
        assertEquals("1h 00m", Days.duration(3_600_000))
        assertEquals("4h 00m", Days.duration(4 * 3_600_000L))
        assertEquals("26h 30m", Days.duration(26 * 3_600_000L + 30 * 60_000L))
    }

    @Test
    fun `clock`() {
        assertEquals("00:00", Days.clock(0))
        assertEquals("00:00", Days.clock(-1))
        assertEquals("00:00", Days.clock(999))
        assertEquals("00:01", Days.clock(1_000))
        assertEquals("04:07", Days.clock((4 * 60 + 7) * 1000L))
        assertEquals("59:59", Days.clock(3_599_000))
        assertEquals("1:00:00", Days.clock(3_600_000))
        assertEquals("1:04:07", Days.clock((3600 + 4 * 60 + 7) * 1000L))
        assertEquals("12:00:09", Days.clock((12 * 3600 + 9) * 1000L))
    }
}
