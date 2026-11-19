package com.personal.aide.notify

import android.Manifest
import android.app.Application
import android.app.Notification
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.MainActivity
import com.personal.aide.calendar.CalendarEvent
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Shadows.shadowOf
import org.robolectric.annotation.Config

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class NotificationsTest {
    private val context: Context = ApplicationProvider.getApplicationContext()
    private val manager: NotificationManager get() = Notifications.manager(context)

    @Before
    fun setUp() {
        Notifications.createChannels(context)
        shadowOf(context as Application).grantPermissions(Manifest.permission.POST_NOTIFICATIONS)
    }

    private fun posted(): List<Notification> = shadowOf(manager).allNotifications

    private fun Notification.title(): String = extras.getCharSequence(Notification.EXTRA_TITLE).toString()

    private fun Notification.text(): String = extras.getCharSequence(Notification.EXTRA_TEXT).toString()

    @Test
    fun `the five channels exist, and the recording one is quiet`() {
        val channels = manager.notificationChannels.associateBy { it.id }
        assertEquals(
            setOf(Notifications.CHANNEL_RECORDING, Notifications.CHANNEL_UPDATES, Notifications.CHANNEL_BRIEF, Notifications.CHANNEL_PREP, Notifications.CHANNEL_NUDGES),
            channels.keys,
        )
        assertEquals(NotificationManager.IMPORTANCE_LOW, channels.getValue(Notifications.CHANNEL_RECORDING).importance)
        assertEquals(NotificationManager.IMPORTANCE_DEFAULT, channels.getValue(Notifications.CHANNEL_UPDATES).importance)
        assertEquals(NotificationManager.IMPORTANCE_DEFAULT, channels.getValue(Notifications.CHANNEL_BRIEF).importance)
        // Briefs before meetings and the afternoon reminders can each be silenced in the phone's settings without losing the rest.
        assertEquals(NotificationManager.IMPORTANCE_DEFAULT, channels.getValue(Notifications.CHANNEL_PREP).importance)
        assertEquals(NotificationManager.IMPORTANCE_DEFAULT, channels.getValue(Notifications.CHANNEL_NUDGES).importance)
    }

    @Test
    fun `creating the channels again changes nothing`() {
        Notifications.createChannels(context)
        assertEquals(5, manager.notificationChannels.size)
    }

    // -------------------------------------------------------------------------------------------
    // The brief before a meeting

    private val start = 1_795_032_000_000L
    private val standup = CalendarEvent(id = 7, title = "Quoting standup", start = start, end = start + 30 * 60_000, attendees = listOf("Dana Whitfield", "Marcus Lee"))
    private val review = CalendarEvent(id = 8, title = "Pricing review", start = start + 60 * 60_000, end = start + 90 * 60_000)

    private fun Notification.opens(): Intent = shadowOf(contentIntent).savedIntent

    @Test
    fun `a meeting's brief says how soon it starts and what is on record for it`() {
        Notifications.prep(context, standup, "Last time (Wed 11 Nov): Rate feed is late. You still owe: Send the deck.", minutesAway = 10)

        val notification = posted().single()
        assertEquals("Quoting standup in 10 min", notification.title())
        assertEquals("Last time (Wed 11 Nov): Rate feed is late. You still owe: Send the deck.", notification.text())
        assertEquals("the whole brief can be read by pulling it down", notification.text(), notification.extras.getCharSequence(Notification.EXTRA_BIG_TEXT).toString())
        assertEquals(Notifications.CHANNEL_PREP, notification.channelId)
        assertTrue("tapping it dismisses it", notification.flags and Notification.FLAG_AUTO_CANCEL != 0)
    }

    @Test
    fun `a brief for a meeting that is about to begin says it is starting`() {
        Notifications.prep(context, standup, "Nothing on record for this one yet.", minutesAway = 1)
        assertEquals("Quoting standup is starting", posted().single().title())

        Notifications.prep(context, standup, "Nothing on record for this one yet.", minutesAway = 0)
        assertEquals("Quoting standup is starting", posted().single().title())

        Notifications.prep(context, standup, "Nothing on record for this one yet.", minutesAway = 2)
        assertEquals("Quoting standup in 2 min", posted().single().title())
    }

    @Test
    fun `tapping a brief opens that meeting's prep, and its Record button starts recording it`() {
        Notifications.prep(context, standup, "Nothing on record for this one yet.", minutesAway = 10)
        val notification = posted().single()

        val open = notification.opens()
        assertEquals(MainActivity::class.java.name, open.component!!.className)
        assertEquals(MainActivity.ACTION_OPEN_PREP, open.action)
        assertTrue(open.filterEquals(MainActivity.prepIntent(context, standup, record = false)))
        assertFalse(open.filterEquals(MainActivity.prepIntent(context, standup, record = true)))
        assertTrue("the meeting travels with the intent", open.extras!!.keySet().any { open.extras!!.getString(it) == "Quoting standup" })

        val record = notification.actions.single()
        assertEquals("Record", record.title.toString())
        val recordIntent = shadowOf(record.actionIntent).savedIntent
        assertTrue(recordIntent.filterEquals(MainActivity.prepIntent(context, standup, record = true)))
        assertNotEquals("opening and recording are different things to do", notification.contentIntent, record.actionIntent)
    }

    @Test
    fun `two meetings get two briefs, each opening its own meeting`() {
        Notifications.prep(context, standup, "About the standup.", minutesAway = 10)
        Notifications.prep(context, review, "About the review.", minutesAway = 70)

        assertEquals(2, posted().size)
        val byTitle = posted().associateBy { it.title() }
        assertTrue(byTitle.getValue("Quoting standup in 10 min").opens().filterEquals(MainActivity.prepIntent(context, standup, record = false)))
        assertTrue(byTitle.getValue("Pricing review in 70 min").opens().filterEquals(MainActivity.prepIntent(context, review, record = false)))
        assertNotEquals(posted()[0].contentIntent, posted()[1].contentIntent)
        assertNotEquals(posted()[0].actions.single().actionIntent, posted()[1].actions.single().actionIntent)
    }

    @Test
    fun `tomorrow's occurrence of the same meeting gets a brief of its own`() {
        val tomorrow = standup.copy(start = start + 24 * 60 * 60_000L, end = start + 24 * 60 * 60_000L + 30 * 60_000)
        Notifications.prep(context, standup, "Today's.", minutesAway = 10)
        Notifications.prep(context, tomorrow, "Tomorrow's.", minutesAway = 10)

        assertEquals(2, posted().size)
        assertNotEquals(posted()[0].contentIntent, posted()[1].contentIntent)
    }

    @Test
    fun `a second brief for the same meeting replaces the first`() {
        Notifications.prep(context, standup, "First version.", minutesAway = 10)
        Notifications.prep(context, standup, "Second version.", minutesAway = 4)

        val notification = posted().single()
        assertEquals("Quoting standup in 4 min", notification.title())
        assertEquals("Second version.", notification.text())
    }

    // -------------------------------------------------------------------------------------------
    // The afternoon reminders

    @Test
    fun `the two afternoon reminders each have a slot of their own and open the task lists`() {
        Notifications.dueToday(context, "2 still due today", "• Send the deck\n• Reply to legal")
        Notifications.waitingOn(context, "Dana still owes you something", "• Dana: Send contract (6 days)")
        Notifications.dueToday(context, "Still due today", "• Reply to legal")

        assertEquals("a newer reminder replaces the one before it", 2, posted().size)
        val due = shadowOf(manager).getNotification(Notifications.DUE_ID)
        val waiting = shadowOf(manager).getNotification(Notifications.WAITING_ID)
        assertEquals("Still due today", due.title())
        assertEquals("• Reply to legal", due.text())
        assertEquals("Dana still owes you something", waiting.title())
        assertEquals("• Dana: Send contract (6 days)", waiting.text())
        for (reminder in listOf(due, waiting)) {
            assertEquals(Notifications.CHANNEL_NUDGES, reminder.channelId)
            assertEquals(MainActivity::class.java.name, reminder.opens().component!!.className)
            assertEquals(MainActivity.ACTION_OPEN_TASKS, reminder.opens().action)
            assertTrue(reminder.flags and Notification.FLAG_AUTO_CANCEL != 0)
        }
    }

    @Test
    fun `a reminder listing several things shows the first line until it is pulled down`() {
        val body = "• Send the deck\n• Reply to legal\n• Book the venue\n…and 2 more"
        Notifications.dueToday(context, "5 still due today", body)

        val notification = posted().single()
        assertEquals("• Send the deck", notification.text())
        assertEquals(body, notification.extras.getCharSequence(Notification.EXTRA_BIG_TEXT).toString())
    }

    @Test
    fun `the reminders and briefs do not disturb the other notifications`() {
        Notifications.brief(context, "2 to do today", "First up: Send pricing deck.")
        Notifications.summaryReady(context, 7, "Pricing review", "Agreed three tiers.")
        Notifications.dueToday(context, "Still due today", "• Send the deck")
        Notifications.waitingOn(context, "Dana still owes you something", "• Dana: Send contract (6 days)")
        Notifications.prep(context, standup, "About the standup.", minutesAway = 10)

        assertEquals(5, posted().size)
        assertEquals("2 to do today", shadowOf(manager).getNotification(Notifications.BRIEF_ID).title())
    }

    // -------------------------------------------------------------------------------------------
    // Summaries and the morning brief

    @Test
    fun `a finished summary is announced with the meeting's name and gist`() {
        Notifications.summaryReady(context, 7, "Pricing review", "Agreed three tiers.")

        val notification = posted().single()
        assertEquals("Notes ready: Pricing review", notification.title())
        assertEquals("Agreed three tiers.", notification.text())
        assertEquals(Notifications.CHANNEL_UPDATES, notification.channelId)
        assertTrue("tapping it dismisses it", notification.flags and Notification.FLAG_AUTO_CANCEL != 0)
    }

    @Test
    fun `tapping a summary notification opens that meeting`() {
        Notifications.summaryReady(context, 7, "Pricing review", "Agreed three tiers.")

        val intent = shadowOf(posted().single().contentIntent).savedIntent
        assertEquals(MainActivity::class.java.name, intent.component!!.className)
        assertEquals(MainActivity.ACTION_OPEN_MEETING, intent.action)
        assertEquals(7L, intent.getLongExtra(MainActivity.EXTRA_MEETING_ID, -1))
    }

    @Test
    fun `each meeting gets its own notification that opens its own meeting`() {
        Notifications.summaryReady(context, 7, "Pricing review", "Agreed three tiers.")
        Notifications.summaryReady(context, 8, "Roadmap sync", "Q1 is full.")

        assertEquals(2, posted().size)
        val opened = posted().map { shadowOf(it.contentIntent).savedIntent.getLongExtra(MainActivity.EXTRA_MEETING_ID, -1) }.toSet()
        assertEquals(setOf(7L, 8L), opened)
        assertNotEquals(posted()[0].contentIntent, posted()[1].contentIntent)
    }

    @Test
    fun `a failed summary is announced with the reason, replacing any earlier note about that meeting`() {
        Notifications.summaryReady(context, 7, "Pricing review", "Agreed three tiers.")
        Notifications.summaryFailed(context, 7, "Pricing review", "Claude is busy right now. Try again in a moment.")

        val notification = posted().single()
        assertEquals("Couldn't summarize: Pricing review", notification.title())
        assertEquals("Claude is busy right now. Try again in a moment.", notification.text())
    }

    @Test
    fun `the morning brief has its own slot and opens the app`() {
        Notifications.brief(context, "2 to do today", "First up: Send pricing deck.")
        Notifications.brief(context, "3 to do today", "First up: Reply to legal.")
        Notifications.summaryReady(context, 7, "Pricing review", "Agreed three tiers.")

        assertEquals("a new brief replaces yesterday's", 2, posted().size)
        val brief = shadowOf(manager).getNotification(Notifications.BRIEF_ID)
        assertNotNull(brief)
        assertEquals("3 to do today", brief.title())
        assertEquals("First up: Reply to legal.", brief.text())
        assertEquals(Notifications.CHANNEL_BRIEF, brief.channelId)
        assertEquals(MainActivity::class.java.name, shadowOf(brief.contentIntent).savedIntent.component!!.className)
    }

    @Test
    fun `nothing is posted when the user has not allowed notifications`() {
        shadowOf(context as Application).denyPermissions(Manifest.permission.POST_NOTIFICATIONS)

        assertFalse(Notifications.canPost(context))
        Notifications.summaryReady(context, 7, "Pricing review", "Agreed three tiers.")
        Notifications.summaryFailed(context, 8, "Roadmap sync", "Claude is busy.")
        Notifications.brief(context, "Your day", "Aide has a question for you.")
        Notifications.prep(context, standup, "Nothing on record for this one yet.", minutesAway = 10)
        Notifications.dueToday(context, "Still due today", "• Send the deck")
        Notifications.waitingOn(context, "Dana still owes you something", "• Dana: Send contract (6 days)")

        assertTrue(posted().isEmpty())
    }

    @Test
    @Config(sdk = [30])
    fun `before Android 13 no permission is needed to post`() {
        shadowOf(context as Application).denyPermissions(Manifest.permission.POST_NOTIFICATIONS)

        assertTrue(Notifications.canPost(context))
        Notifications.summaryReady(context, 7, "Pricing review", "Agreed three tiers.")
        assertEquals(1, posted().size)
    }

    @Test
    fun `very large meeting ids still get distinct notifications from small ones nearby`() {
        Notifications.summaryReady(context, 1, "First", "a")
        Notifications.summaryReady(context, 2, "Second", "b")
        Notifications.summaryReady(context, 99_999, "Late", "c")
        assertEquals(3, posted().size)
    }
}
