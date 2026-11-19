package com.personal.aide.ai

import android.app.Application
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.data.WinStore
import com.personal.aide.testing.prompt
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

/** The wins log is part of what Ask can answer from. */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class AssistantWinsInAskTest : AssistantTestBase() {

    @Test
    fun `a question is sent with the wins log, newest first, each with its goal`(): Unit = runBlocking {
        settings.setProfile(sam)
        val wins = WinStore(db.wins()) { now }
        wins.add("Ran eight shipper interviews", day = today - 30)
        wins.add("Got pricing agreed at three tiers", day = today - 1, goal = sam.goals[0])
        llm.reply("Two things stand out.")

        assistant.ask(assistant.newAskThread(), "What have I achieved this quarter?") {}

        val sent = llm.last.prompt
        val log = sent.substringAfter("<wins_log>\n").substringBefore("</wins_log>")
        assertTrue(sent, sent.contains("<wins_log>"))
        assertTrue(log, log.contains("Got pricing agreed at three tiers [goal: ${sam.goals[0]}]"))
        assertTrue(log, log.contains("Ran eight shipper interviews"))
        assertFalse("a win filed under no goal carries no goal tag", log.lines().first { it.contains("interviews") }.contains("[goal"))
        assertTrue("newest first", log.indexOf("pricing agreed") < log.indexOf("shipper interviews"))
    }

    @Test
    fun `with nothing logged the block is left out`(): Unit = runBlocking {
        settings.setProfile(sam)
        llm.reply("Nothing on record yet.")

        assistant.ask(assistant.newAskThread(), "What have I achieved this quarter?") {}

        assertFalse(llm.last.prompt.contains("wins_log"))
    }

    @Test
    fun `only the newest wins go along`(): Unit = runBlocking {
        settings.setProfile(sam)
        val wins = WinStore(db.wins()) { now }
        for (index in 1..Assistant.MAX_WINS_IN_CONTEXT + 5) wins.add("Win number $index", day = today - 100 + index)
        llm.reply("Plenty.")

        assistant.ask(assistant.newAskThread(), "What have I achieved?") {}

        val log = llm.last.prompt.substringAfter("<wins_log>\n").substringBefore("</wins_log>")
        assertTrue(log.trim().lines().size == Assistant.MAX_WINS_IN_CONTEXT)
        assertTrue(log, log.contains("Win number ${Assistant.MAX_WINS_IN_CONTEXT + 5}"))
        assertFalse(log, log.contains("Win number 5\n"))
    }
}
