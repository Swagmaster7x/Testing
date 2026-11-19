package com.personal.aide.ui.progress

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.LlmException
import com.personal.aide.data.AideJson
import com.personal.aide.data.GoalRead
import com.personal.aide.data.ProgressUpdate
import com.personal.aide.data.SelfReview
import com.personal.aide.data.db.InsightKind
import com.personal.aide.data.db.WinEntity
import com.personal.aide.domain.Days
import com.personal.aide.domain.knowledgeKey
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.time.LocalDate

/** One of the user's goals, with the assistant's latest read of it and how many wins count towards it. */
data class GoalCard(val goal: String, val read: GoalRead?, val wins: Int)

/** A self-review being written, or the one last written. */
data class ReviewDraft(
    val fromDay: Long,
    val toDay: Long,
    val text: String = "",
    val working: Boolean = false,
    val error: String? = null,
)

data class ProgressState(
    val loaded: Boolean = false,
    val goals: List<GoalCard> = emptyList(),
    /** Newest first. */
    val wins: List<WinEntity> = emptyList(),
    /** When the assistant last went over the record; null if it never has. */
    val updatedAt: Long? = null,
    val working: Boolean = false,
    val message: String? = null,
    val error: String? = null,
    val hasKey: Boolean = true,
    val today: Long = Days.today(),
    /** The self-review on screen, if the sheet is open. */
    val review: ReviewDraft? = null,
    /** The last self-review drafted, kept so it needn't be paid for again. */
    val lastReview: SelfReview? = null,
    val lastReviewAt: Long? = null,
)

class ProgressViewModel(private val container: AppContainer) : ViewModel() {
    private data class Busy(val working: Boolean = false, val message: String? = null, val error: String? = null)

    private val busy = MutableStateFlow(Busy())
    private val review = MutableStateFlow<ReviewDraft?>(null)
    private var drafting: Job? = null

    val state: StateFlow<ProgressState> = combine(
        container.settings.profile,
        container.db.wins().observeAll(),
        container.db.insights().observeAll(),
        container.secrets.hasKey,
        combine(busy, review) { busy, review -> busy to review },
    ) { profile, wins, insights, hasKey, (busy, review) ->
        val pass = insights.firstOrNull { it.kind == InsightKind.GOALS }
        val reads = pass?.let { runCatching { AideJson.decodeFromString(ProgressUpdate.serializer(), it.json) }.getOrNull() }?.goals.orEmpty()
            .associateBy { knowledgeKey(it.goal) }
        val stored = insights.filter { it.kind == InsightKind.SELF_REVIEW }.maxByOrNull { it.createdAt }
        ProgressState(
            loaded = true,
            goals = profile.goals.map { goal -> GoalCard(goal, reads[knowledgeKey(goal)], wins.count { it.goal == goal }) },
            wins = wins,
            updatedAt = pass?.createdAt,
            working = busy.working,
            message = busy.message,
            error = busy.error,
            hasKey = hasKey,
            today = Days.today(),
            review = review,
            lastReview = stored?.let { runCatching { AideJson.decodeFromString(SelfReview.serializer(), it.json) }.getOrNull() }?.takeIf { it.text.isNotBlank() },
            lastReviewAt = stored?.createdAt,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), ProgressState())

    /** Has the assistant read what has happened since last time, log the wins and say where each goal stands. */
    fun bringUpToDate() {
        if (busy.value.working) return
        busy.value = Busy(working = true)
        viewModelScope.launch {
            busy.value = try {
                val update = container.assistant.updateProgress()
                Busy(
                    message = when (update.wins.size) {
                        0 -> "Up to date. Nothing new to log since last time."
                        1 -> "Up to date. 1 win added to the log."
                        else -> "Up to date. ${update.wins.size} wins added to the log."
                    },
                )
            } catch (e: LlmException) {
                Busy(error = e.message)
            }
        }
    }

    fun dismissMessage() {
        busy.update { it.copy(message = null, error = null) }
    }

    fun saveWin(win: WinEntity) {
        viewModelScope.launch { container.wins.save(win) }
    }

    fun deleteWin(win: WinEntity) {
        viewModelScope.launch { container.wins.delete(win.id) }
    }

    /**
     * Adds a goal ([old] null), rewords one, or with a blank [new] removes it. Wins filed under the
     * old wording follow it, and so does the assistant's read of it.
     */
    fun saveGoal(old: String?, new: String) {
        val clean = new.trim()
        viewModelScope.launch {
            val profile = container.settings.currentProfile()
            val goals = profile.goals.toMutableList()
            if (old == null) {
                if (clean.isEmpty() || goals.any { knowledgeKey(it) == knowledgeKey(clean) }) return@launch
                goals += clean
            } else {
                val index = goals.indexOf(old)
                if (index < 0 || clean == old) return@launch
                // Reworded into one that is already there: the two become one.
                val merged = clean.isNotEmpty() && goals.any { it != old && knowledgeKey(it) == knowledgeKey(clean) }
                val target = if (merged) goals.first { it != old && knowledgeKey(it) == knowledgeKey(clean) } else clean
                if (clean.isEmpty() || merged) goals.removeAt(index) else goals[index] = clean
                container.wins.goalChanged(old, target)
                moveRead(old, target.takeIf { !merged }.orEmpty())
            }
            container.settings.setProfile(profile.copy(goals = goals))
        }
    }

    private suspend fun moveRead(from: String, to: String) {
        val dao = container.db.insights()
        val stored = dao.get(InsightKind.GOALS, 0) ?: return
        val update = runCatching { AideJson.decodeFromString(ProgressUpdate.serializer(), stored.json) }.getOrNull() ?: return
        val goals = update.goals.mapNotNull { read ->
            when {
                knowledgeKey(read.goal) != knowledgeKey(from) -> read
                to.isBlank() -> null
                else -> read.copy(goal = to)
            }
        }
        dao.upsert(stored.copy(json = AideJson.encodeToString(ProgressUpdate.serializer(), update.copy(goals = goals))))
    }

    /** Drafts a self-review covering the last [months] months. */
    fun draftReview(months: Int) {
        drafting?.cancel()
        val today = Days.today()
        val from = LocalDate.ofEpochDay(today).minusMonths(months.toLong()).toEpochDay()
        review.value = ReviewDraft(fromDay = from, toDay = today, working = true)
        drafting = viewModelScope.launch {
            try {
                val text = container.assistant.draftSelfReview(from, today) { piece ->
                    review.update { it?.copy(text = it.text + piece) }
                }
                review.value = ReviewDraft(from, today, text = text)
            } catch (e: LlmException) {
                review.value = ReviewDraft(from, today, error = e.message)
            }
        }
    }

    fun openLastReview() {
        val last = state.value.lastReview ?: return
        review.value = ReviewDraft(last.fromDay, last.toDay, text = last.text)
    }

    fun closeReview() {
        drafting?.cancel()
        review.value = null
    }
}
