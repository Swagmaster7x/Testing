package com.personal.aide.data.db

import androidx.room.Room
import androidx.room.testing.MigrationTestHelper
import androidx.sqlite.db.SupportSQLiteDatabase
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.personal.aide.data.SeriesStore
import com.personal.aide.data.WinStore
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

/** A phone that has an earlier version of the app installed must keep its data when it updates. */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35])
class MigrationTest {
    @get:Rule
    val helper = MigrationTestHelper(InstrumentationRegistry.getInstrumentation(), AppDatabase::class.java)

    @Test
    fun `a version 1 database upgrades to version 2 and keeps its meetings and tasks`() {
        helper.createDatabase(NAME, 1).use { db ->
            db.execSQL(
                "INSERT INTO meetings (id, title, titleIsAuto, startedAt, source, status, attendees, meetingType, tldr, analysisJson, error, rating, wordCount, model) " +
                    "VALUES (1, 'Standup', 0, 1000, 'LIVE', 'READY', '[\"Dana\"]', 'standup', 'Short.', '', '', 1, 12, 'claude-opus-5-5')",
            )
            db.execSQL(
                "INSERT INTO tasks (id, title, details, owner, ownership, dueDay, priority, status, origin, meetingId, createdAt, evidence, edited) " +
                    "VALUES (7, 'Send the deck', '', '', 'MINE', 20777, 2, 'OPEN', 'AI', 1, 2000, 'Sam said so', 0)",
            )
        }

        val upgraded = helper.runMigrationsAndValidate(NAME, 2, true)

        upgraded.query("SELECT title, dueDay, priority, meetingId, suggestedTitle, kept FROM tasks WHERE id = 7").use { row ->
            assertTrue(row.moveToFirst())
            assertEquals("Send the deck", row.getString(0))
            assertEquals(20777L, row.getLong(1))
            assertEquals(2, row.getInt(2))
            assertEquals(1L, row.getLong(3))
            // The new columns start empty: nothing is known about how an old task came to be worded.
            assertEquals("", row.getString(4))
            assertEquals(0, row.getInt(5))
        }
        upgraded.query("SELECT title, rating FROM meetings WHERE id = 1").use { row ->
            assertTrue(row.moveToFirst())
            assertEquals("Standup", row.getString(0))
            assertEquals(1, row.getInt(1))
        }
        upgraded.close()
    }

    /** What a phone on version 2 holds: two meetings, two tasks that came out of the first, and a little of everything else. */
    private fun fillVersion2(db: SupportSQLiteDatabase) {
        db.execSQL(
            "INSERT INTO meetings (id, title, titleIsAuto, startedAt, endedAt, source, status, attendees, calendarEventId, meetingType, tldr, analysisJson, error, rating, wordCount, summarizedAt, model) " +
                "VALUES (1, 'Quoting standup', 0, 1000, 2000, 'LIVE', 'READY', '[\"Dana Whitfield\",\"Marcus Lee\"]', 77, 'standup', 'Rate feed is late.', '{\"decisions\":[\"Ship behind a flag\"]}', '', 1, 12, 3000, 'claude-opus-5-5')",
        )
        db.execSQL(
            "INSERT INTO meetings (id, title, titleIsAuto, startedAt, source, status, attendees, meetingType, tldr, analysisJson, error, rating, wordCount, model) " +
                "VALUES (2, 'Meeting, Wed 18 Nov', 1, 5000, 'IMPORT', 'TRANSCRIBED', '[]', '', '', '', '', 0, 40, '')",
        )
        db.execSQL("INSERT INTO segments (id, meetingId, offsetMs, kind, text) VALUES (1, 1, 0, 'SPEECH', 'good morning everyone')")
        db.execSQL(
            "INSERT INTO tasks (id, title, details, owner, ownership, dueDay, priority, status, origin, meetingId, createdAt, completedAt, plannedDay, evidence, edited, suggestedTitle, kept) " +
                "VALUES (7, 'Send the signed contract', 'v2', 'Dana Whitfield', 'OTHERS', 20777, 2, 'OPEN', 'AI', 1, 2000, NULL, 20776, 'Dana said so', 1, 'Send contract', 1)",
        )
        db.execSQL(
            "INSERT INTO tasks (id, title, details, owner, ownership, dueDay, priority, status, origin, meetingId, createdAt, completedAt, plannedDay, evidence, edited, suggestedTitle, kept) " +
                "VALUES (8, 'Book the venue', '', '', 'MINE', NULL, 1, 'DONE', 'MANUAL', NULL, 2500, 4000, NULL, '', 0, '', 0)",
        )
        db.execSQL(
            "INSERT INTO knowledge (id, type, title, `key`, content, sourceMeetingIds, origin, pinned, createdAt, updatedAt) " +
                "VALUES (3, 'PERSON', 'Dana Whitfield', 'dana whitfield', 'Engineering lead.', '[1]', 'MEETING', 1, 3000, 3000)",
        )
        db.execSQL("INSERT INTO insights (id, kind, periodStart, json, createdAt, rating) VALUES (4, 'WEEK_REVIEW', 20770, '{\"headline\":\"A steady week.\"}', 4000, 1)")
    }

    @Test
    fun `a version 2 database upgrades to version 3 keeping its rows, with the new columns at their defaults`() {
        helper.createDatabase(NAME, 2).use { fillVersion2(it) }

        val upgraded = helper.runMigrationsAndValidate(NAME, 3, true)

        upgraded.query("SELECT id, title, calendarEventId, tldr, rating, seriesId FROM meetings ORDER BY id").use { row ->
            assertEquals(2, row.count)
            assertTrue(row.moveToFirst())
            assertEquals("Quoting standup", row.getString(1))
            assertEquals(77L, row.getLong(2))
            assertEquals("Rate feed is late.", row.getString(3))
            assertEquals(1, row.getInt(4))
            // No meeting belongs to a recurring meeting until the user, the calendar or the assistant says so.
            assertTrue(row.isNull(5))
            assertTrue(row.moveToNext())
            assertEquals("Meeting, Wed 18 Nov", row.getString(1))
            assertTrue(row.isNull(5))
        }
        upgraded.query("SELECT title, owner, dueDay, plannedDay, edited, suggestedTitle, kept, nudgedAt, meetingId FROM tasks ORDER BY id").use { row ->
            assertEquals(2, row.count)
            assertTrue(row.moveToFirst())
            assertEquals("Send the signed contract", row.getString(0))
            assertEquals("Dana Whitfield", row.getString(1))
            assertEquals(20777L, row.getLong(2))
            assertEquals(20776L, row.getLong(3))
            assertEquals(1, row.getInt(4))
            assertEquals("what version 2 added is kept", "Send contract", row.getString(5))
            assertEquals(1, row.getInt(6))
            // Nobody has been reminded about anything yet.
            assertEquals(0L, row.getLong(7))
            assertEquals(1L, row.getLong(8))
            assertTrue(row.moveToNext())
            assertEquals("Book the venue", row.getString(0))
            assertEquals(0L, row.getLong(7))
        }
        for (table in listOf("segments", "knowledge", "insights")) {
            upgraded.query("SELECT COUNT(*) FROM $table").use { row ->
                assertTrue(row.moveToFirst())
                assertEquals("$table kept its row", 1, row.getInt(0))
            }
        }
        for (table in listOf("series", "wins")) {
            upgraded.query("SELECT COUNT(*) FROM $table").use { row ->
                assertTrue(row.moveToFirst())
                assertEquals("$table starts empty", 0, row.getInt(0))
            }
        }
        upgraded.close()
    }

    @Test
    fun `a version 1 database upgrades all the way to version 3`() {
        helper.createDatabase(NAME, 1).use { db ->
            db.execSQL(
                "INSERT INTO meetings (id, title, titleIsAuto, startedAt, source, status, attendees, meetingType, tldr, analysisJson, error, rating, wordCount, model) " +
                    "VALUES (1, 'Standup', 0, 1000, 'LIVE', 'READY', '[\"Dana\"]', 'standup', 'Short.', '', '', 1, 12, 'claude-opus-5-5')",
            )
            db.execSQL(
                "INSERT INTO tasks (id, title, details, owner, ownership, dueDay, priority, status, origin, meetingId, createdAt, evidence, edited) " +
                    "VALUES (7, 'Send the deck', '', '', 'MINE', 20777, 2, 'OPEN', 'AI', 1, 2000, 'Sam said so', 0)",
            )
        }

        val upgraded = helper.runMigrationsAndValidate(NAME, 3, true)

        upgraded.query("SELECT title, suggestedTitle, kept, nudgedAt FROM tasks WHERE id = 7").use { row ->
            assertTrue(row.moveToFirst())
            assertEquals("Send the deck", row.getString(0))
            assertEquals("", row.getString(1))
            assertEquals(0, row.getInt(2))
            assertEquals(0L, row.getLong(3))
        }
        upgraded.query("SELECT title, seriesId FROM meetings WHERE id = 1").use { row ->
            assertTrue(row.moveToFirst())
            assertEquals("Standup", row.getString(0))
            assertTrue(row.isNull(1))
        }
        upgraded.close()
    }

    @Test
    fun `the app opens a version 2 database, reads it as it was, and can use what version 3 added`(): Unit = runBlocking {
        helper.createDatabase(NAME, 2).use { fillVersion2(it) }

        // The way the app itself opens it: the upgrade runs on first use.
        val db = Room.databaseBuilder(InstrumentationRegistry.getInstrumentation().targetContext, AppDatabase::class.java, NAME)
            .allowMainThreadQueries()
            .build()
        helper.closeWhenFinished(db)

        val standup = db.meetings().get(1)!!
        assertEquals("Quoting standup", standup.title)
        assertEquals(listOf("Dana Whitfield", "Marcus Lee"), standup.attendees)
        assertEquals(MeetingStatus.READY, standup.status)
        assertEquals(77L, standup.calendarEventId)
        assertNull(standup.seriesId)
        assertEquals(2, db.meetings().all().size)

        val contract = db.tasks().get(7)!!
        assertEquals("Send the signed contract", contract.title)
        assertEquals(Ownership.OTHERS, contract.ownership)
        assertEquals("Send contract", contract.suggestedTitle)
        assertTrue(contract.kept)
        assertEquals(0L, contract.nudgedAt)
        assertEquals(TaskStatus.DONE, db.tasks().get(8)!!.status)
        assertEquals(listOf("Dana Whitfield"), db.knowledge().all().map { it.title })
        assertEquals(InsightKind.WEEK_REVIEW, db.insights().all().single().kind)
        assertTrue(db.series().all().isEmpty())
        assertTrue(db.wins().all().isEmpty())

        // And the new tables and columns work on the upgraded file.
        val series = SeriesStore(db.series(), db.meetings()) { 9_000L }
        val id = series.assignByName(1, "Quoting standup")
        assertNotNull(id)
        assertEquals(id, db.meetings().get(1)!!.seriesId)
        assertNotNull(WinStore(db.wins()) { 9_000L }.add("Booked the venue", day = 20_777, taskId = 8))
        db.tasks().markNudged(listOf(7), 9_000)
        assertEquals(9_000L, db.tasks().get(7)!!.nudgedAt)
    }

    private companion object {
        const val NAME = "migration-test.db"
    }
}
