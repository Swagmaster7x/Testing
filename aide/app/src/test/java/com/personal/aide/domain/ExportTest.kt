package com.personal.aide.domain

import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.testing.Fixed
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ExportTest {
    private val meeting = MeetingEntity(
        id = 1, title = "1:1 with Priya", titleIsAuto = false, startedAt = Fixed.at(Fixed.today, 11), endedAt = Fixed.at(Fixed.today, 11, 30),
        status = MeetingStatus.READY, attendees = listOf("Priya Nair"), tldr = "Two bets for Q1.",
    )

    @Test
    fun `shared notes of a recurring meeting open with what has moved since last time`() {
        val analysis = MeetingAnalysis(
            keyPoints = listOf("Priya will defend two bets."),
            sinceLastTime = listOf("The interview notes were read.", "The second designer is still undecided."),
        )

        val text = meetingNotesText(meeting, analysis, emptyList(), Fixed.zone)

        assertTrue(text, text.contains("## Since last time\n- The interview notes were read.\n- The second designer is still undecided.\n"))
        assertTrue("it comes before the key points", text.indexOf("## Since last time") < text.indexOf("## Key points"))
    }

    @Test
    fun `a meeting with nothing carried over has no such section`() {
        val text = meetingNotesText(meeting, MeetingAnalysis(keyPoints = listOf("Priya will defend two bets.")), emptyList(), Fixed.zone)

        assertFalse(text, text.contains("Since last time"))
        assertTrue(text, text.contains("## Key points"))
    }
}
