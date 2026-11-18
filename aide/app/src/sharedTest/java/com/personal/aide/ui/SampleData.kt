package com.personal.aide.ui

import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.ActionItem
import com.personal.aide.data.AideJson
import com.personal.aide.data.DayPlan
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.PlanItem
import com.personal.aide.data.WeekDayPlan
import com.personal.aide.data.WeekPlan
import com.personal.aide.data.WeekReview
import com.personal.aide.data.WorkProfile
import com.personal.aide.data.db.ChatMessageEntity
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.SegmentEntity
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.domain.Days
import com.personal.aide.domain.knowledgeKey
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId

/** The sample week pinned to Wednesday 18 November 2026, so screenshots don't change from day to day. */
object SampleData : SampleSet(LocalDate.of(2026, 11, 18).toEpochDay())

/** A believable week in the life of a product manager, laid out around [today], mid-morning. */
open class SampleSet(val today: Long) {
    val zone: ZoneId = ZoneId.systemDefault()
    val now: Long = at(today, 10, 40)

    fun at(day: Long, hour: Int, minute: Int = 0): Long =
        LocalDateTime.of(LocalDate.ofEpochDay(day), java.time.LocalTime.of(hour, minute)).atZone(zone).toInstant().toEpochMilli()

    val profile = WorkProfile(
        name = "Sam Rivera",
        role = "Senior Product Manager",
        company = "Northwind Logistics",
        industry = "Freight and logistics software",
        department = "Product",
        team = "Shipper Experience, 7 people",
        manager = "Priya Nair",
        responsibilities = listOf("Roadmap for the shipper portal", "Quarterly planning with Engineering"),
        goals = listOf("Launch self-serve quoting by end of Q1", "Cut quote turnaround from 2 days to 2 hours"),
        projects = listOf("Self-serve quoting", "Carrier scorecards"),
        stakeholders = listOf("Priya Nair — VP Product", "Dana Whitfield — Eng lead", "Marcus Lee — Head of Sales"),
        tools = listOf("Jira", "Figma", "Looker"),
        recurringMeetings = listOf("Monday roadmap sync", "Thursday quoting standup"),
    )

    val analysis = MeetingAnalysis(
        title = "Q1 quoting launch: pricing review",
        meetingType = "review",
        tldr = "Sales and Product agreed to launch self-serve quoting with three fixed tiers instead of custom pricing. The pricing page copy and the carrier rate feed are the two things standing between the team and a February beta.",
        keyPoints = listOf(
            "Three fixed tiers (Starter, Growth, Enterprise) replace per-customer quotes for shipments under 10 pallets.",
            "The carrier rate feed still fails for about 4% of lanes; Dana's team has a fix in review.",
            "Sales wants a two-week overlap where reps can still override the self-serve price.",
        ),
        decisions = listOf(
            "Launch with three fixed tiers; revisit custom pricing after 90 days of data.",
            "Beta opens to 25 existing customers on 9 February.",
        ),
        actionItems = listOf(
            ActionItem("Send revised pricing page copy to Marcus", "", "", "mine", "2026-11-20", "high", "Marcus asked Sam for it by Friday"),
        ),
        openQuestions = listOf("Who signs off on the Enterprise tier floor price?", "Does the override window need Legal's review?"),
        risks = listOf("If the rate feed fix slips past December, beta customers will see wrong prices on some lanes."),
        attendees = listOf("Priya Nair", "Dana Whitfield", "Marcus Lee"),
        transcriptQuality = "good",
    )

    val meetings = listOf(
        MeetingEntity(
            id = 3, title = "Q1 quoting launch: pricing review", titleIsAuto = true,
            startedAt = at(today, 9, 0), endedAt = at(today, 9, 42), status = MeetingStatus.READY,
            attendees = listOf("Priya Nair", "Dana Whitfield", "Marcus Lee"), meetingType = "review",
            tldr = analysis.tldr, analysisJson = AideJson.encodeToString(MeetingAnalysis.serializer(), analysis), wordCount = 5210, rating = 1,
        ),
        MeetingEntity(
            id = 2, title = "Carrier scorecards kickoff", titleIsAuto = false,
            startedAt = at(today - 1, 14, 0), endedAt = at(today - 1, 14, 31), status = MeetingStatus.PROCESSING, wordCount = 3890,
        ),
        MeetingEntity(
            id = 1, title = "1:1 with Priya", titleIsAuto = false,
            startedAt = at(today - 2, 11, 0), endedAt = at(today - 2, 11, 27), status = MeetingStatus.READY, meetingType = "1:1",
            tldr = "Priya wants the Q1 roadmap narrowed to two bets. Sam is to bring a cut-down version on Monday, with the quoting launch as the anchor.",
            wordCount = 3104,
        ),
        MeetingEntity(
            id = 4, title = "Notes: vendor call with RateStream", titleIsAuto = false, source = MeetingSource.IMPORT,
            startedAt = at(today - 5, 16, 0), endedAt = at(today - 5, 16, 0), status = MeetingStatus.TRANSCRIBED, wordCount = 420,
        ),
    )

    val tasks = listOf(
        TaskEntity(1, "Send revised pricing page copy to Marcus", dueDay = today + 2, priority = 2, origin = TaskOrigin.AI, meetingId = 3, createdAt = at(today, 9, 45), evidence = "Marcus asked Sam for it by Friday"),
        TaskEntity(2, "Cut the Q1 roadmap down to two bets for Priya", dueDay = today, priority = 2, origin = TaskOrigin.AI, meetingId = 1, createdAt = at(today - 2, 11, 30)),
        TaskEntity(3, "Reply to RateStream about the lane coverage gap", dueDay = today - 2, origin = TaskOrigin.MANUAL, createdAt = at(today - 6, 9)),
        TaskEntity(4, "Review Figma flows for the quote summary screen", dueDay = today + 1, origin = TaskOrigin.MANUAL, createdAt = at(today - 3, 15)),
        TaskEntity(5, "Draft beta invite list of 25 customers", dueDay = today + 6, origin = TaskOrigin.AI, meetingId = 3, createdAt = at(today, 9, 45)),
        TaskEntity(6, "Book the launch retro room", origin = TaskOrigin.MANUAL, createdAt = at(today - 1, 10), priority = 0),
        TaskEntity(7, "Fix the rate feed failures on 4% of lanes", owner = "Dana Whitfield", ownership = Ownership.OTHERS, dueDay = today + 9, origin = TaskOrigin.AI, meetingId = 3, createdAt = at(today, 9, 45)),
        TaskEntity(8, "Confirm the two-week override window with reps", owner = "Marcus Lee", ownership = Ownership.OTHERS, dueDay = today - 1, origin = TaskOrigin.AI, meetingId = 3, createdAt = at(today - 8, 9)),
        TaskEntity(9, "Get sign-off on the Enterprise floor price", ownership = Ownership.UNCLEAR, origin = TaskOrigin.AI, meetingId = 3, createdAt = at(today, 9, 45), evidence = "Someone said \"I'll chase finance\"; it wasn't clear who"),
        TaskEntity(10, "Share scorecard metrics draft with carriers team", status = TaskStatus.DONE, completedAt = at(today - 1, 16), dueDay = today - 1, origin = TaskOrigin.MANUAL, createdAt = at(today - 4, 9)),
        TaskEntity(11, "Update the Q4 roadmap page", status = TaskStatus.DONE, completedAt = at(today - 2, 12), dueDay = today - 3, origin = TaskOrigin.MANUAL, createdAt = at(today - 7, 9)),
        TaskEntity(12, "Send Priya the launch risks list", status = TaskStatus.DONE, completedAt = at(today, 8, 30), dueDay = today, origin = TaskOrigin.AI, meetingId = 1, createdAt = at(today - 2, 11, 30)),
    )

    val dayPlan = DayPlan(
        headline = "Two things decide today: the roadmap cut Priya is waiting for, and unblocking RateStream before it gets later.",
        focus = listOf(
            PlanItem(2, "Due today, and Monday's planning depends on it"),
            PlanItem(3, "Two days late; they can't size the fix without your answer"),
            PlanItem(1, "Friday deadline, but Marcus is presenting from it"),
        ),
        ifTime = listOf(PlanItem(4, "Due tomorrow; 20 minutes")),
        chase = listOf("Marcus Lee — the override window he was to confirm yesterday"),
        headsUp = listOf("The 2:00 standup leaves about three clear hours before it."),
    )

    val weekPlan = WeekPlan(
        headline = "A manageable week if the roadmap cut lands today. Friday is the only tight day.",
        days = listOf(
            WeekDayPlan(Days.iso(today), listOf(2, 3), "Clear the two overdue or due-today items"),
            WeekDayPlan(Days.iso(today + 1), listOf(4, 1), "Design review, then the pricing copy"),
            WeekDayPlan(Days.iso(today + 2), listOf(6), ""),
        ),
        warnings = listOf("The beta invite list is due Tuesday; start it Friday if the pricing copy goes out early."),
    )

    val review = WeekReview(
        headline = "Good follow-through on Priya's asks; the vendor thread is the one thing slipping.",
        overall = "steady",
        summary = "You closed three tasks, two of them on time, and the pricing review produced clear decisions. The RateStream reply has now been open six days and is holding up Dana's estimate.",
        wins = listOf("Sent Priya the launch risks list the morning after she asked.", "The pricing review ended with two firm decisions and named owners."),
        slipped = listOf("Reply to RateStream about the lane coverage gap: two days late.", "The Q4 roadmap page went out a day after its due date."),
        patterns = listOf("Tasks from your 1:1s get done fast; tasks you set yourself wait."),
        suggestions = listOf("Answer RateStream before the standup on Thursday.", "Give self-set tasks a due date when you add them."),
        nextFocus = listOf("The two-bet roadmap for Monday"),
        statusUpdate = "This week: pricing for self-serve quoting agreed (three fixed tiers), beta set for 9 Feb with 25 customers. In progress: pricing page copy, beta invite list. Blocked: rate feed fix for 4% of lanes, in review with Engineering.",
    )

    val knowledge = listOf(
        entry(1, KnowledgeType.PERSON, "Dana Whitfield", "Engineering lead for Shipper Experience. Owns the carrier rate feed. Prefers written specs before meetings.", listOf(3L, 2L), pinned = true),
        entry(2, KnowledgeType.PROJECT, "Self-serve quoting", "Lets shippers price shipments under 10 pallets without a sales rep. Three fixed tiers. Beta opens 9 February 2027 to 25 existing customers.", listOf(3L, 1L)),
        entry(3, KnowledgeType.TERM, "LTL", "Less-than-truckload: shipments that don't fill a trailer. Most self-serve quotes are LTL.", emptyList(), KnowledgeOrigin.ANSWER),
        entry(4, KnowledgeType.DECISION, "Fixed tiers for launch", "Decided 18 Nov 2026: launch with Starter, Growth and Enterprise tiers; revisit custom pricing after 90 days of data.", listOf(3L)),
        entry(5, KnowledgeType.ORG, "RateStream", "Vendor supplying carrier rates. Coverage gap on some lanes under discussion.", listOf(4L)),
        entry(6, KnowledgeType.PERSON, "Marcus Lee", "Head of Sales. Wants reps to keep a price override during the first two weeks of beta.", listOf(3L)),
    )

    private fun entry(id: Long, type: KnowledgeType, title: String, content: String, sources: List<Long>, origin: KnowledgeOrigin = KnowledgeOrigin.MEETING, pinned: Boolean = false) =
        KnowledgeEntity(id, type, title, knowledgeKey(title), content, sources, origin, pinned, at(today - 3, 9), at(today, 9, 50))

    val segments = listOf(
        SegmentEntity(1, 3, 4_000, SegmentKind.SPEECH, "Okay, so the main thing today is whether we launch quoting with fixed tiers or keep custom pricing for everyone."),
        SegmentEntity(2, 3, 19_000, SegmentKind.SPEECH, "From the sales side fixed tiers are fine under ten pallets, but I want reps to be able to override for the first couple of weeks."),
        SegmentEntity(3, 3, 41_000, SegmentKind.NOTE, "Marcus wants a 2-week override window"),
        SegmentEntity(4, 3, 58_000, SegmentKind.SPEECH, "The rate feed is still failing on about four percent of lanes. We have a fix in review, I'd say two weeks."),
        SegmentEntity(5, 3, 77_000, SegmentKind.FLAG, ""),
        SegmentEntity(6, 3, 80_000, SegmentKind.SPEECH, "Then let's say beta on the ninth of February, twenty-five existing customers. Sam, can you get Marcus the pricing page copy by Friday?"),
    )

    val questions = listOf(
        QuestionEntity(1, 3, "Who is \"Tomas\"? He was mentioned as approving the floor price.", "came up three times and isn't in your knowledge base", "Tomas", KnowledgeType.PERSON, createdAt = now),
        QuestionEntity(2, 3, "What does \"PRO number\" mean on your team?", "used as if everyone knows it", "PRO number", KnowledgeType.TERM, createdAt = now),
    )

    val events = listOf(
        CalendarEvent(1, "Quoting standup", at(today, 14, 0), at(today, 14, 30), attendees = listOf("Dana Whitfield", "Marcus Lee", "Jo Park")),
        CalendarEvent(2, "Design review: quote summary", at(today, 16, 0), at(today, 17, 0), attendees = listOf("Ana Costa")),
    )

    val chat = listOf(
        ChatMessageEntity(1, 1, "user", "What did I commit to this week?", now),
        ChatMessageEntity(
            2, 1, "assistant",
            "Three things, all from meetings this week:\n\n- **Pricing page copy to Marcus** by Friday (Q1 quoting launch: pricing review, 18 Nov)\n- **A two-bet Q1 roadmap for Priya**, due today (1:1 with Priya, 16 Nov)\n- **A beta invite list of 25 customers** by next Tuesday\n\nOne more is waiting on an owner: sign-off on the Enterprise floor price.",
            now, rating = 1,
        ),
    )
}
