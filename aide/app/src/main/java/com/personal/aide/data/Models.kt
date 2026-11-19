package com.personal.aide.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

/** Tolerant JSON: what Claude returns is schema-constrained, but stored copies must survive app updates. */
val AideJson: Json = Json {
    ignoreUnknownKeys = true
    isLenient = true
    encodeDefaults = true
    coerceInputValues = true
}

/** What the assistant knows about the person it works for. Everything is optional. */
@Serializable
data class WorkProfile(
    val name: String = "",
    val role: String = "",
    val company: String = "",
    val industry: String = "",
    val department: String = "",
    val team: String = "",
    val manager: String = "",
    val seniority: String = "",
    val workingHours: String = "",
    val workingStyle: String = "",
    val responsibilities: List<String> = emptyList(),
    val goals: List<String> = emptyList(),
    val projects: List<String> = emptyList(),
    val stakeholders: List<String> = emptyList(),
    val tools: List<String> = emptyList(),
    val recurringMeetings: List<String> = emptyList(),
    val successMeasures: List<String> = emptyList(),
    val challenges: List<String> = emptyList(),
    val notes: List<String> = emptyList(),
) {
    val isEmpty: Boolean get() = this == WorkProfile()

    /** How many of the areas the interview covers have something in them, out of [AREAS]. */
    fun filledAreas(): Int = listOf(
        name, role, company, industry, department, team, manager, workingHours, workingStyle,
    ).count { it.isNotBlank() } + listOf(
        responsibilities, goals, projects, stakeholders, tools, recurringMeetings, successMeasures, challenges,
    ).count { it.isNotEmpty() }

    fun completeness(): Float = filledAreas().toFloat() / AREAS

    /** Applies what an interview turn learned: a non-blank value replaces, lists gain what is new. */
    fun merge(patch: ProfilePatch): WorkProfile = copy(
        name = patch.name.orKeep(name),
        role = patch.role.orKeep(role),
        company = patch.company.orKeep(company),
        industry = patch.industry.orKeep(industry),
        department = patch.department.orKeep(department),
        team = patch.team.orKeep(team),
        manager = patch.manager.orKeep(manager),
        seniority = patch.seniority.orKeep(seniority),
        workingHours = patch.workingHours.orKeep(workingHours),
        workingStyle = patch.workingStyle.orKeep(workingStyle),
        responsibilities = responsibilities.plusNew(patch.responsibilities),
        goals = goals.plusNew(patch.goals),
        projects = projects.plusNew(patch.projects),
        stakeholders = stakeholders.plusNew(patch.stakeholders),
        tools = tools.plusNew(patch.tools),
        recurringMeetings = recurringMeetings.plusNew(patch.recurringMeetings),
        successMeasures = successMeasures.plusNew(patch.successMeasures),
        challenges = challenges.plusNew(patch.challenges),
        notes = notes.plusNew(patch.notes),
    )

    companion object {
        const val AREAS = 17
    }
}

private fun String.orKeep(current: String): String = trim().ifBlank { current }

private fun List<String>.plusNew(added: List<String>): List<String> {
    val seen = map { it.trim().lowercase() }.toMutableSet()
    val result = toMutableList()
    for (item in added) {
        val clean = item.trim()
        if (clean.isNotEmpty() && seen.add(clean.lowercase())) result += clean
    }
    return result
}

/** The part of an interview turn that updates the profile. Blank means "nothing new". */
@Serializable
data class ProfilePatch(
    val name: String = "",
    val role: String = "",
    val company: String = "",
    val industry: String = "",
    val department: String = "",
    val team: String = "",
    val manager: String = "",
    val seniority: String = "",
    @SerialName("working_hours") val workingHours: String = "",
    @SerialName("working_style") val workingStyle: String = "",
    val responsibilities: List<String> = emptyList(),
    val goals: List<String> = emptyList(),
    val projects: List<String> = emptyList(),
    val stakeholders: List<String> = emptyList(),
    val tools: List<String> = emptyList(),
    @SerialName("recurring_meetings") val recurringMeetings: List<String> = emptyList(),
    @SerialName("success_measures") val successMeasures: List<String> = emptyList(),
    val challenges: List<String> = emptyList(),
    val notes: List<String> = emptyList(),
)

@Serializable
data class KnowledgeNote(
    val type: String = "fact",
    val title: String = "",
    val content: String = "",
)

@Serializable
data class InterviewTurn(
    val reply: String = "",
    val profile: ProfilePatch = ProfilePatch(),
    val knowledge: List<KnowledgeNote> = emptyList(),
    val done: Boolean = false,
)

@Serializable
data class ActionItem(
    val title: String = "",
    val details: String = "",
    val owner: String = "",
    /** "mine", "others" or "unclear". */
    val ownership: String = "unclear",
    /** ISO date, or blank. */
    @SerialName("due_date") val dueDate: String = "",
    /** "high", "normal" or "low". */
    val priority: String = "normal",
    val evidence: String = "",
)

@Serializable
data class ClarifyingQuestion(
    val question: String = "",
    val why: String = "",
    val topic: String = "",
    @SerialName("topic_type") val topicType: String = "fact",
)

/** Everything the assistant takes away from one meeting. */
@Serializable
data class MeetingAnalysis(
    val title: String = "",
    @SerialName("meeting_type") val meetingType: String = "",
    val tldr: String = "",
    @SerialName("key_points") val keyPoints: List<String> = emptyList(),
    val decisions: List<String> = emptyList(),
    @SerialName("action_items") val actionItems: List<ActionItem> = emptyList(),
    @SerialName("open_questions") val openQuestions: List<String> = emptyList(),
    val risks: List<String> = emptyList(),
    val attendees: List<String> = emptyList(),
    val knowledge: List<KnowledgeNote> = emptyList(),
    @SerialName("clarifying_questions") val clarifyingQuestions: List<ClarifyingQuestion> = emptyList(),
    /** "good", "fair" or "poor": how much of the recording was usable. */
    @SerialName("transcript_quality") val transcriptQuality: String = "",
    /** Which recurring meeting this is an occurrence of, in the assistant's judgement. */
    val series: SeriesGuess = SeriesGuess(),
    /** What has moved since the previous meeting in the series, a line each. */
    @SerialName("since_last_time") val sinceLastTime: List<String> = emptyList(),
    /** What this meeting said about action items from earlier meetings in the series. */
    @SerialName("earlier_items") val earlierItems: List<EarlierItem> = emptyList(),
)

@Serializable
data class SeriesGuess(
    /** The id of one of the series the assistant was shown, or 0. */
    @SerialName("existing_id") val existingId: Long = 0,
    /** A name for a new series, when the meeting is plainly a regular one that isn't listed yet. */
    @SerialName("new_name") val newName: String = "",
)

@Serializable
data class EarlierItem(
    @SerialName("task_id") val taskId: Long = 0,
    /** "done", "still_open", "dropped" or "not_mentioned". */
    val status: String = "not_mentioned",
    val note: String = "",
)

@Serializable
data class LoggedWin(
    val title: String = "",
    val detail: String = "",
    /** One of the user's goals, word for word, or blank. */
    val goal: String = "",
    /** ISO date. */
    val day: String = "",
    @SerialName("task_id") val taskId: Long = 0,
    @SerialName("meeting_id") val meetingId: Long = 0,
)

@Serializable
data class GoalRead(
    val goal: String = "",
    /** "on_track", "at_risk", "stalled" or "no_evidence". */
    val status: String = "no_evidence",
    val note: String = "",
    @SerialName("next_step") val nextStep: String = "",
)

/** What one pass over recent work adds to the record: new wins, and where each goal stands. */
@Serializable
data class ProgressUpdate(
    val wins: List<LoggedWin> = emptyList(),
    val goals: List<GoalRead> = emptyList(),
)

@Serializable
data class AgendaItem(
    val topic: String = "",
    val why: String = "",
)

@Serializable
data class PersonAgenda(
    val headline: String = "",
    val items: List<AgendaItem> = emptyList(),
    @SerialName("to_ask") val toAsk: List<String> = emptyList(),
    @SerialName("to_tell") val toTell: List<String> = emptyList(),
)

/** A drafted self-review and the days it covers, as stored. */
@Serializable
data class SelfReview(
    val fromDay: Long = 0,
    val toDay: Long = 0,
    val text: String = "",
)

@Serializable
data class PlanItem(
    @SerialName("task_id") val taskId: Long = 0,
    val why: String = "",
)

@Serializable
data class DayPlan(
    val headline: String = "",
    val focus: List<PlanItem> = emptyList(),
    @SerialName("if_time") val ifTime: List<PlanItem> = emptyList(),
    val chase: List<String> = emptyList(),
    @SerialName("heads_up") val headsUp: List<String> = emptyList(),
)

@Serializable
data class WeekDayPlan(
    /** ISO date. */
    val day: String = "",
    @SerialName("task_ids") val taskIds: List<Long> = emptyList(),
    val note: String = "",
)

@Serializable
data class WeekPlan(
    val headline: String = "",
    val days: List<WeekDayPlan> = emptyList(),
    val warnings: List<String> = emptyList(),
)

@Serializable
data class WeekReview(
    val headline: String = "",
    /** "strong", "steady", "mixed" or "at_risk". */
    val overall: String = "",
    val summary: String = "",
    val wins: List<String> = emptyList(),
    val slipped: List<String> = emptyList(),
    val patterns: List<String> = emptyList(),
    val suggestions: List<String> = emptyList(),
    @SerialName("next_focus") val nextFocus: List<String> = emptyList(),
    @SerialName("status_update") val statusUpdate: String = "",
)
