package com.personal.aide.notify

import android.Manifest
import android.app.Application
import android.app.Notification
import android.app.NotificationManager
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.MainActivity
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
    fun `the three channels exist, and the recording one is quiet`() {
        val channels = manager.notificationChannels.associateBy { it.id }
        assertEquals(setOf(Notifications.CHANNEL_RECORDING, Notifications.CHANNEL_UPDATES, Notifications.CHANNEL_BRIEF), channels.keys)
        assertEquals(NotificationManager.IMPORTANCE_LOW, channels.getValue(Notifications.CHANNEL_RECORDING).importance)
        assertEquals(NotificationManager.IMPORTANCE_DEFAULT, channels.getValue(Notifications.CHANNEL_UPDATES).importance)
        assertEquals(NotificationManager.IMPORTANCE_DEFAULT, channels.getValue(Notifications.CHANNEL_BRIEF).importance)
    }

    @Test
    fun `creating the channels again changes nothing`() {
        Notifications.createChannels(context)
        assertEquals(3, manager.notificationChannels.size)
    }

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
