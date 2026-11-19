package com.personal.aide.ai

import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put

/**
 * The JSON shapes Claude must reply in (structured outputs). The API requires every object to
 * list all of its properties as required and to forbid extras, so "nothing to say" is an empty
 * string or an empty list, never a missing field. The descriptions are part of the prompt.
 */
object Schemas {
    private fun string(description: String): JsonObject = buildJsonObject {
        put("type", "string")
        put("description", description)
    }

    private fun choice(description: String, vararg values: String): JsonObject = buildJsonObject {
        put("type", "string")
        put("enum", JsonArray(values.map { JsonPrimitive(it) }))
        put("description", description)
    }

    private fun boolean(description: String): JsonObject = buildJsonObject {
        put("type", "boolean")
        put("description", description)
    }

    private fun integer(description: String): JsonObject = buildJsonObject {
        put("type", "integer")
        put("description", description)
    }

    private fun list(description: String, items: JsonElement): JsonObject = buildJsonObject {
        put("type", "array")
        put("description", description)
        put("items", items)
    }

    private fun strings(description: String): JsonObject = list(description, buildJsonObject { put("type", "string") })

    private fun shape(vararg properties: Pair<String, JsonElement>, description: String? = null): JsonObject =
        buildJsonObject {
            put("type", "object")
            description?.let { put("description", it) }
            put("properties", JsonObject(properties.toMap()))
            put("required", JsonArray(properties.map { JsonPrimitive(it.first) }))
            put("additionalProperties", false)
        }

    private const val KNOWLEDGE_TYPES =
        "person, project, term (jargon or an acronym), decision, process, org (a team, customer, vendor or company), or fact"

    private val knowledgeNote = shape(
        "type" to choice("What kind of thing this is: $KNOWLEDGE_TYPES.", "person", "project", "term", "decision", "process", "org", "fact"),
        "title" to string("The name to file it under, exactly as it should be spelled: a person's name, a project name, the acronym."),
        "content" to string(
            "What is worth remembering, as a few plain sentences or short lines. For an entry that already exists, " +
                "write the complete updated text: keep what is still true, fold in what is new, and correct what changed.",
        ),
    )

    val meetingAnalysis: JsonObject = shape(
        "title" to string("A short, specific name for this meeting, under 60 characters, e.g. \"Q4 pricing review with Sales\"."),
        "meeting_type" to string("One or two words: standup, 1:1, planning, client call, interview, review, brainstorm, all-hands, or similar."),
        "tldr" to string("Two or three sentences: what this meeting was about and what came out of it. If the transcript is too thin or garbled to tell, say that instead."),
        "key_points" to strings("The points worth remembering, one sentence each, most important first. Substance only: no \"the team discussed\"."),
        "decisions" to strings("Things that were actually decided, each as one sentence saying what was decided and, if stated, by whom. Empty if nothing was."),
        "action_items" to list(
            "Every commitment someone made to do something after the meeting. Only real commitments, not ideas that were floated.",
            shape(
                "title" to string("The task as a short imperative, e.g. \"Send revised pricing deck to Dana\"."),
                "details" to string("Any specifics needed to do it: numbers, constraints, who to coordinate with. Empty if the title says it all."),
                "owner" to string("The name of whoever took it on, when it is someone other than the user. Empty when it is the user's or unknown."),
                "ownership" to choice(
                    "\"mine\" when the user took this on, \"others\" when a named colleague did, \"unclear\" when the transcript doesn't settle it. " +
                        "There are no speaker labels, so an unattributed \"I'll do it\" is unclear unless context makes the speaker plain.",
                    "mine", "others", "unclear",
                ),
                "due_date" to string("The deadline as an ISO date (YYYY-MM-DD) when one was stated or clearly implied, resolved against the meeting's date. Empty otherwise."),
                "priority" to choice("How much it matters, judged from the discussion.", "high", "normal", "low"),
                "evidence" to string("A few words on where this came from in the meeting, so the user can recognise it."),
            ),
        ),
        "open_questions" to strings("Questions raised and left unanswered."),
        "risks" to strings("Risks, blockers or concerns that were raised."),
        "attendees" to strings("People who took part, by name, as far as the transcript, notes or invitation show. Empty if unknown."),
        "knowledge" to list(
            "Durable things worth keeping in the user's knowledge base beyond this meeting: who people are and what they own, " +
                "what a project is and where it stands, what an acronym means, a decision and its reason, how a process works. " +
                "Skip anything trivial or only relevant today.",
            knowledgeNote,
        ),
        "clarifying_questions" to list(
            "Questions for the user whose answers would make you noticeably better at their next meeting: an unfamiliar name, " +
                "an unexplained acronym, whose task something is. Never ask what the work profile or knowledge base already answers.",
            shape(
                "question" to string("The question, phrased for a quick answer."),
                "why" to string("One short clause on why you are asking, e.g. \"came up five times and I couldn't tell who it is\"."),
                "topic" to string("The knowledge base title the answer should be filed under, e.g. the person's name or the acronym."),
                "topic_type" to choice("The kind of entry that is.", "person", "project", "term", "decision", "process", "org", "fact"),
            ),
        ),
        "transcript_quality" to choice("How usable the transcript was.", "good", "fair", "poor"),
        "series" to shape(
            "existing_id" to integer("The id of the recurring meeting this is an occurrence of, from the list you were given. 0 when it is none of them."),
            "new_name" to string(
                "Only when existing_id is 0 and this is plainly a regular fixture (a standup, a weekly sync, a 1:1 with someone): " +
                    "the name the user would call it by, such as \"1:1 with Priya\" or \"Quoting standup\". Empty otherwise, and always empty for a one-off.",
            ),
            description = "Which recurring meeting, if any, this meeting is one occurrence of.",
        ),
        "since_last_time" to strings(
            "When this meeting is an occurrence of a recurring meeting whose earlier notes you were given: what has moved since then, " +
                "one line each (what got done, what changed, what is still stuck). Empty when there is nothing earlier to compare with.",
        ),
        "earlier_items" to list(
            "For each action item listed from that recurring meeting's earlier occurrences: what this meeting said about it. Empty when none were listed.",
            shape(
                "task_id" to integer("The id of the earlier action item, from the list."),
                "status" to choice(
                    "\"done\" when someone said it has been done, \"still_open\" when it was discussed and isn't finished, " +
                        "\"dropped\" when it was called off, \"not_mentioned\" when it didn't come up.",
                    "done", "still_open", "dropped", "not_mentioned",
                ),
                "note" to string("A few words on what was said about it. Empty when it wasn't mentioned."),
            ),
        ),
    )

    val interviewTurn: JsonObject = shape(
        "reply" to string(
            "What you say to the user next: a brief, warm acknowledgement of what they told you (one short sentence at most), " +
                "then your next question. One question at a time. When done is true, a short closing instead.",
        ),
        "profile" to shape(
            "name" to string("The user's name, if they just gave or corrected it."),
            "role" to string("Their job title or role."),
            "company" to string("Where they work."),
            "industry" to string("The industry."),
            "department" to string("Their department or function."),
            "team" to string("Their immediate team: its name, size, or what it does."),
            "manager" to string("Who they report to."),
            "seniority" to string("Their level and whether they manage people, e.g. \"senior IC\" or \"manages 6\"."),
            "working_hours" to string("Their working hours and time zone, if mentioned."),
            "working_style" to string("How they like to work and be communicated with: brief or detailed, formal or casual."),
            "responsibilities" to strings("What they are responsible for."),
            "goals" to strings("Their current goals or OKRs."),
            "projects" to strings("Projects they are working on, each with a few words of context."),
            "stakeholders" to strings("People they work with regularly, each as \"Name — role or relationship\"."),
            "tools" to strings("Tools and systems they use."),
            "recurring_meetings" to strings("Their regular meetings."),
            "success_measures" to strings("How their performance is judged."),
            "challenges" to strings("What they find hard or want help with."),
            "notes" to strings("Anything else worth remembering that fits nowhere above."),
            description = "Only what the user's latest message added or corrected. Leave a field empty when it said nothing new about it.",
        ),
        "knowledge" to list(
            "Knowledge base entries for specific people, projects, terms or organisations the user just described in enough detail to be worth an entry.",
            knowledgeNote,
        ),
        "done" to boolean("True once you know enough to be useful, or the user wants to stop. Then reply with a closing, not another question."),
    )

    private val planItem = shape(
        "task_id" to integer("The id of a task from the list you were given."),
        "why" to string("One short clause on why it earns its place."),
    )

    val dayPlan: JsonObject = shape(
        "headline" to string("One sentence on the shape of the day: what matters most and why."),
        "focus" to list("The few tasks to get done today, in the order to do them. Three is typical; never more than five.", planItem),
        "if_time" to list("Tasks worth doing today if the focus list gets finished.", planItem),
        "chase" to strings("People to nudge today about something the user is waiting on, each as \"Name — what for\". Empty if none."),
        "heads_up" to strings("Things to be aware of: a deadline about to slip, a clash with a meeting, an overloaded day. Empty if none."),
    )

    val weekPlan: JsonObject = shape(
        "headline" to string("One or two sentences on how the week looks."),
        "days" to list(
            "One entry for each remaining working day of the week that has tasks on it, in date order.",
            shape(
                "day" to string("The ISO date (YYYY-MM-DD)."),
                "task_ids" to list("Ids of the tasks to do that day, in order.", buildJsonObject { put("type", "integer") }),
                "note" to string("A few words on the day's theme or constraint. Empty if nothing to add."),
            ),
        ),
        "warnings" to strings("Where the week doesn't fit: more than can be done, deadlines that collide, things that should be renegotiated."),
    )

    val progressUpdate: JsonObject = shape(
        "wins" to list(
            "Accomplishments from the material that are worth keeping for a performance review and aren't logged already. " +
                "Things the user did or drove, with a result. Not routine upkeep, and not things other people did.",
            shape(
                "title" to string("What was achieved, as a short past-tense statement, e.g. \"Got Sales and Product to agree on three fixed pricing tiers\"."),
                "detail" to string("Why it mattered or what it led to, in a sentence. Use numbers and names from the material; empty if there is nothing to add."),
                "goal" to string("The goal it counts towards, copied word for word from the user's goals. Empty when it serves none of them."),
                "day" to string("The day it happened, as an ISO date (YYYY-MM-DD)."),
                "task_id" to integer("The id of the completed task it comes from, or 0."),
                "meeting_id" to integer("The id of the meeting it comes from, or 0."),
            ),
        ),
        "goals" to list(
            "One entry for each of the user's goals, in the order given.",
            shape(
                "goal" to string("The goal, copied word for word."),
                "status" to choice(
                    "Where it stands on the evidence: \"on_track\", \"at_risk\", \"stalled\" (nothing has moved lately), or \"no_evidence\" when the material says nothing about it.",
                    "on_track", "at_risk", "stalled", "no_evidence",
                ),
                "note" to string("One or two sentences on why, pointing at what was done or not done."),
                "next_step" to string("The single most useful next thing to do for this goal. Empty when you can't tell."),
            ),
        ),
    )

    val personAgenda: JsonObject = shape(
        "headline" to string("One sentence on what this conversation most needs to settle."),
        "items" to list(
            "The topics to cover, most important first. Four to six at most.",
            shape(
                "topic" to string("The topic, as a short line."),
                "why" to string("One clause on why now: a deadline, something overdue, a decision that is waiting."),
            ),
        ),
        "to_ask" to strings("Specific things to ask them for or about, each a question or request the user could say out loud. Empty if none."),
        "to_tell" to strings("Things the user owes them an update on. Empty if none."),
    )

    val weekReview: JsonObject = shape(
        "headline" to string("One sentence that sums up the week."),
        "overall" to choice("Your overall read of how the week went.", "strong", "steady", "mixed", "at_risk"),
        "summary" to string("Three or four sentences of honest assessment, written to the user."),
        "wins" to strings("What went well, each tied to something specific."),
        "slipped" to strings("What didn't get done or went late, each specific. Empty if nothing did."),
        "patterns" to strings("Patterns worth noticing across the week or against earlier weeks."),
        "suggestions" to strings("Two to four concrete things to do differently next week."),
        "next_focus" to strings("What deserves attention first next week."),
        "status_update" to string(
            "A short status update the user could send their manager: what got done, what's in progress, what's blocked. " +
                "Plain text, first person, no greeting or sign-off.",
        ),
    )
}
