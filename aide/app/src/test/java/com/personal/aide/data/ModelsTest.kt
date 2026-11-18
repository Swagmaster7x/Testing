package com.personal.aide.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ModelsTest {
    private val sam = WorkProfile(
        name = "Sam Rivera",
        role = "Product Manager",
        company = "Northwind",
        goals = listOf("Launch self-serve quoting"),
        stakeholders = listOf("Priya Nair — VP Product"),
    )

    // -------------------------------------------------------------------------------------------
    // Merging what an interview turn learned

    @Test
    fun `an empty patch changes nothing`() {
        assertEquals(sam, sam.merge(ProfilePatch()))
        assertEquals(WorkProfile(), WorkProfile().merge(ProfilePatch()))
    }

    @Test
    fun `a value in the patch replaces what was there`() {
        val merged = sam.merge(ProfilePatch(role = "Senior Product Manager", manager = "Priya Nair"))
        assertEquals("Senior Product Manager", merged.role)
        assertEquals("Priya Nair", merged.manager)
        assertEquals("the rest is kept", sam.copy(role = "Senior Product Manager", manager = "Priya Nair"), merged)
    }

    @Test
    fun `a blank value means nothing new was said`() {
        val merged = sam.merge(ProfilePatch(name = "", role = "   ", company = "\n"))
        assertEquals(sam, merged)
    }

    @Test
    fun `values are trimmed`() {
        assertEquals("Logistics software", WorkProfile().merge(ProfilePatch(industry = "  Logistics software \n")).industry)
    }

    @Test
    fun `every single-value field can be set`() {
        val patch = ProfilePatch(
            name = "n", role = "r", company = "c", industry = "i", department = "d", team = "t",
            manager = "m", seniority = "s", workingHours = "h", workingStyle = "w",
        )
        assertEquals(
            WorkProfile(
                name = "n", role = "r", company = "c", industry = "i", department = "d", team = "t",
                manager = "m", seniority = "s", workingHours = "h", workingStyle = "w",
            ),
            WorkProfile().merge(patch),
        )
    }

    @Test
    fun `lists gain what is new and keep their order`() {
        val merged = sam.merge(ProfilePatch(goals = listOf("Cut quote turnaround", "Hire a designer")))
        assertEquals(listOf("Launch self-serve quoting", "Cut quote turnaround", "Hire a designer"), merged.goals)
        assertEquals(sam.stakeholders, merged.stakeholders)
    }

    @Test
    fun `something already on a list is not added again`() {
        val merged = sam.merge(
            ProfilePatch(goals = listOf("launch SELF-SERVE quoting", "  Launch self-serve quoting  ", "Cut quote turnaround", "cut quote turnaround")),
        )
        assertEquals(listOf("Launch self-serve quoting", "Cut quote turnaround"), merged.goals)
    }

    @Test
    fun `blank list items are ignored`() {
        val merged = sam.merge(ProfilePatch(tools = listOf("", "  ", "Jira", "\n")))
        assertEquals(listOf("Jira"), merged.tools)
    }

    @Test
    fun `every list field gains from the patch`() {
        val patch = ProfilePatch(
            responsibilities = listOf("a"), goals = listOf("b"), projects = listOf("c"), stakeholders = listOf("d"), tools = listOf("e"),
            recurringMeetings = listOf("f"), successMeasures = listOf("g"), challenges = listOf("h"), notes = listOf("i"),
        )
        assertEquals(
            WorkProfile(
                responsibilities = listOf("a"), goals = listOf("b"), projects = listOf("c"), stakeholders = listOf("d"), tools = listOf("e"),
                recurringMeetings = listOf("f"), successMeasures = listOf("g"), challenges = listOf("h"), notes = listOf("i"),
            ),
            WorkProfile().merge(patch),
        )
    }

    @Test
    fun `merging the same patch twice is the same as merging it once`() {
        val patch = ProfilePatch(role = "Senior PM", goals = listOf("Cut quote turnaround"), tools = listOf("Jira", "Figma"))
        assertEquals(sam.merge(patch), sam.merge(patch).merge(patch))
    }

    // -------------------------------------------------------------------------------------------
    // How much is known

    @Test
    fun `an untouched profile is empty`() {
        assertTrue(WorkProfile().isEmpty)
        assertEquals(0, WorkProfile().filledAreas())
        assertEquals(0f, WorkProfile().completeness(), 0f)
        assertFalse(sam.isEmpty)
        assertFalse(WorkProfile(notes = listOf("likes short emails")).isEmpty)
    }

    @Test
    fun `completeness counts the areas with something in them`() {
        assertEquals(5, sam.filledAreas())
        assertEquals(5f / WorkProfile.AREAS, sam.completeness(), 1e-6f)
        assertEquals("blank text is not an answer", 0, WorkProfile(name = "  ", role = "").filledAreas())
    }

    @Test
    fun `a profile with every interview area answered is complete`() {
        val full = WorkProfile(
            name = "n", role = "r", company = "c", industry = "i", department = "d", team = "t", manager = "m",
            workingHours = "h", workingStyle = "w",
            responsibilities = listOf("a"), goals = listOf("b"), projects = listOf("c"), stakeholders = listOf("d"), tools = listOf("e"),
            recurringMeetings = listOf("f"), successMeasures = listOf("g"), challenges = listOf("h"),
        )
        assertEquals(WorkProfile.AREAS, full.filledAreas())
        assertEquals(1f, full.completeness(), 0f)
    }

    // -------------------------------------------------------------------------------------------
    // Reading what Claude sends

    @Test
    fun `a profile patch reads the field names the schema uses`() {
        val patch = AideJson.decodeFromString(
            ProfilePatch.serializer(),
            """{"name":"Sam","working_hours":"9 to 5 Eastern","working_style":"brief","recurring_meetings":["Monday sync"],"success_measures":["Quote turnaround"]}""",
        )
        assertEquals("Sam", patch.name)
        assertEquals("9 to 5 Eastern", patch.workingHours)
        assertEquals("brief", patch.workingStyle)
        assertEquals(listOf("Monday sync"), patch.recurringMeetings)
        assertEquals(listOf("Quote turnaround"), patch.successMeasures)
    }

    @Test
    fun `a meeting analysis reads the field names the schema uses`() {
        val analysis = AideJson.decodeFromString(
            MeetingAnalysis.serializer(),
            """
            {"title":"Pricing review","meeting_type":"review","tldr":"Agreed tiers.","key_points":["Three tiers"],"decisions":["Ship in Q1"],
             "action_items":[{"title":"Send deck","details":"v3","owner":"Dana","ownership":"others","due_date":"2026-11-20","priority":"high","evidence":"Dana said so"}],
             "open_questions":["Who signs off?"],"risks":["Legal review"],"attendees":["Dana","Marcus"],
             "knowledge":[{"type":"person","title":"Dana","content":"Eng lead"}],
             "clarifying_questions":[{"question":"Who is Lee?","why":"came up twice","topic":"Lee","topic_type":"person"}],
             "transcript_quality":"good"}
            """.trimIndent(),
        )
        assertEquals("review", analysis.meetingType)
        assertEquals(listOf("Three tiers"), analysis.keyPoints)
        assertEquals(ActionItem("Send deck", "v3", "Dana", "others", "2026-11-20", "high", "Dana said so"), analysis.actionItems.single())
        assertEquals(listOf("Who signs off?"), analysis.openQuestions)
        assertEquals(KnowledgeNote("person", "Dana", "Eng lead"), analysis.knowledge.single())
        assertEquals(ClarifyingQuestion("Who is Lee?", "came up twice", "Lee", "person"), analysis.clarifyingQuestions.single())
        assertEquals("good", analysis.transcriptQuality)
    }

    @Test
    fun `plans and reviews read the field names the schema uses`() {
        val day = AideJson.decodeFromString(
            DayPlan.serializer(),
            """{"headline":"h","focus":[{"task_id":7,"why":"due"}],"if_time":[{"task_id":9,"why":"quick"}],"chase":["Dana"],"heads_up":["Busy afternoon"]}""",
        )
        assertEquals(listOf(PlanItem(7, "due")), day.focus)
        assertEquals(listOf(PlanItem(9, "quick")), day.ifTime)
        assertEquals(listOf("Busy afternoon"), day.headsUp)

        val week = AideJson.decodeFromString(
            WeekPlan.serializer(),
            """{"headline":"h","days":[{"day":"2026-11-19","task_ids":[1,2],"note":"n"}],"warnings":["w"]}""",
        )
        assertEquals(listOf(WeekDayPlan("2026-11-19", listOf(1L, 2L), "n")), week.days)

        val review = AideJson.decodeFromString(
            WeekReview.serializer(),
            """{"headline":"h","overall":"steady","summary":"s","wins":[],"slipped":[],"patterns":[],"suggestions":[],"next_focus":["x"],"status_update":"u"}""",
        )
        assertEquals(listOf("x"), review.nextFocus)
        assertEquals("u", review.statusUpdate)
    }

    @Test
    fun `stored JSON survives fields being added removed or nulled`() {
        val analysis = AideJson.decodeFromString(
            MeetingAnalysis.serializer(),
            """{"title":null,"tldr":"Short.","a_field_from_a_newer_version":{"x":1},"action_items":[{"title":"Send deck","due_date":null}]}""",
        )
        assertEquals("", analysis.title)
        assertEquals("Short.", analysis.tldr)
        assertEquals(emptyList<String>(), analysis.keyPoints)
        assertEquals("Send deck", analysis.actionItems.single().title)
        assertEquals("", analysis.actionItems.single().dueDate)
        assertEquals("unclear", analysis.actionItems.single().ownership)
    }

    @Test
    fun `what is written can be read back`() {
        val profile = sam.copy(workingHours = "9–5", notes = listOf("Says \"sync\" a lot"))
        assertEquals(profile, AideJson.decodeFromString(WorkProfile.serializer(), AideJson.encodeToString(WorkProfile.serializer(), profile)))
    }
}
