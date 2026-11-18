@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.insights

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.personal.aide.data.WeekReview
import com.personal.aide.domain.AssistantStats
import com.personal.aide.domain.Days
import com.personal.aide.domain.WorkStats
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.BulletSection
import com.personal.aide.ui.components.Pill
import com.personal.aide.ui.components.RatingRow
import com.personal.aide.ui.components.SectionHeader
import com.personal.aide.ui.components.Tone
import com.personal.aide.ui.components.Working
import com.personal.aide.ui.theme.AideTheme
import kotlin.math.roundToInt

class InsightsActions(
    val onPrevious: () -> Unit = {},
    val onNext: () -> Unit = {},
    val onReview: () -> Unit = {},
    val onRate: (Int) -> Unit = {},
    val onDismissError: () -> Unit = {},
    val onCopy: (String) -> Unit = {},
    val onShare: (String) -> Unit = {},
    val onAsk: () -> Unit = {},
    val onSettings: () -> Unit = {},
)

@Composable
fun InsightsScreen(state: InsightsState, actions: InsightsActions) {
    Scaffold(
        contentWindowInsets = WindowInsets(0),
        topBar = {
            TopAppBar(
                title = { Text("Insights") },
                actions = { IconButton(onClick = actions.onAsk) { Icon(AideIcons.Sparkle, contentDescription = "Ask Aide") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background),
            )
        },
    ) { padding ->
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item(key = "week") { WeekSwitcher(state, actions) }
            item(key = "review") { ReviewCard(state, actions) }
            state.reviewError?.let { error ->
                item(key = "error") { Banner(error, tone = Tone.BAD, action = "OK", onAction = actions.onDismissError) }
            }
            item(key = "numbers-header") { SectionHeader("The week in numbers") }
            item(key = "numbers") { StatGrid(state.stats) }
            item(key = "chart") { CompletionChart(state.stats, state.today) }
            item(key = "assistant-header") { SectionHeader("How Aide is doing") }
            item(key = "assistant") { AssistantCard(state.assistant) }
        }
    }
}

@Composable
private fun WeekSwitcher(state: InsightsState, actions: InsightsActions) {
    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        IconButton(onClick = actions.onPrevious) { Icon(Icons.AutoMirrored.Filled.KeyboardArrowLeft, contentDescription = "Earlier week") }
        Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                when (state.weekStart) {
                    Days.weekStart(state.today) -> "This week"
                    Days.weekStart(state.today) - 7 -> "Last week"
                    else -> "Week of " + Days.mediumDate(state.weekStart).substringAfter(' ')
                },
                style = MaterialTheme.typography.titleMedium,
            )
            Text(
                Days.mediumDate(state.weekStart) + " – " + Days.mediumDate(state.weekStart + 6),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        IconButton(onClick = actions.onNext, enabled = !state.isThisWeek) {
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = "Later week")
        }
    }
}

fun overallLabel(overall: String): Pair<String, Tone> = when (overall) {
    "strong" -> "A strong week" to Tone.GOOD
    "steady" -> "A steady week" to Tone.INFO
    "mixed" -> "A mixed week" to Tone.WARN
    "at_risk" -> "Needs attention" to Tone.BAD
    else -> "Aide's read" to Tone.NEUTRAL
}

@Composable
private fun ReviewCard(state: InsightsState, actions: InsightsActions) {
    val review = state.review
    if (review == null) {
        AideCard(container = MaterialTheme.colorScheme.tertiaryContainer) {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.onTertiaryContainer, modifier = Modifier.size(18.dp))
                    Text("How you're doing", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onTertiaryContainer)
                }
                Text(
                    if (state.isThisWeek) {
                        "Aide can look over your week so far: what got done, what slipped, the patterns worth noticing, and what to try next."
                    } else {
                        "Aide can look back over this week: what got done, what slipped, and the patterns worth noticing."
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onTertiaryContainer,
                )
                when {
                    state.reviewing -> Working("Reviewing the week…")
                    state.hasKey -> Button(onClick = actions.onReview) { Text("Review my week") }
                    else -> OutlinedButton(onClick = actions.onSettings) { Text("Connect Claude first") }
                }
            }
        }
        return
    }
    ReviewBody(review, state, actions)
}

@Composable
private fun ReviewBody(review: WeekReview, state: InsightsState, actions: InsightsActions) {
    AideCard {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            val (label, tone) = overallLabel(review.overall)
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.tertiary, modifier = Modifier.size(18.dp))
                Text("How you're doing", style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.tertiary, modifier = Modifier.weight(1f))
                Pill(label, tone = tone)
            }
            if (review.headline.isNotBlank()) Text(review.headline, style = MaterialTheme.typography.titleLarge)
            if (review.summary.isNotBlank()) Text(review.summary, style = MaterialTheme.typography.bodyLarge)
            BulletSection("What went well", review.wins, tone = Tone.GOOD)
            BulletSection("What slipped", review.slipped, tone = Tone.WARN)
            BulletSection("Patterns", review.patterns)
            BulletSection("Try next week", review.suggestions, tone = Tone.ASSISTANT)
            BulletSection("Start with", review.nextFocus)
            if (review.statusUpdate.isNotBlank()) {
                Column(
                    Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.surfaceContainer, MaterialTheme.shapes.small).padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    Text("Status update, ready to send", style = MaterialTheme.typography.titleSmall)
                    Text(review.statusUpdate, style = MaterialTheme.typography.bodyMedium)
                    Row {
                        TextButton(onClick = { actions.onCopy(review.statusUpdate) }, contentPadding = PaddingValues(horizontal = 4.dp)) { Text("Copy") }
                        TextButton(onClick = { actions.onShare(review.statusUpdate) }) { Text("Send with…") }
                    }
                }
            }
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (state.reviewing) {
                    Working("Reviewing…", Modifier.weight(1f))
                } else {
                    TextButton(onClick = actions.onReview, contentPadding = PaddingValues(0.dp)) { Text("Review again") }
                    Spacer(Modifier.weight(1f))
                }
                RatingRow(state.reviewRating, actions.onRate)
            }
        }
    }
}

/** One headline number with what it counts and, where it helps, a line of context. */
@Composable
private fun StatTile(label: String, value: String, detail: String?, modifier: Modifier = Modifier, meter: Float? = null) {
    AideCard(modifier = modifier, padding = 14.dp) {
        Text(label, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, style = MaterialTheme.typography.headlineMedium)
        if (meter != null) {
            LinearProgressIndicator(
                progress = { meter.coerceIn(0f, 1f) },
                modifier = Modifier.fillMaxWidth().padding(top = 4.dp, bottom = 2.dp),
                color = AideTheme.colors.chart,
                trackColor = MaterialTheme.colorScheme.surfaceContainerHigh,
            )
        }
        Text(detail.orEmpty(), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, minLines = 1)
    }
}

@Composable
private fun StatGrid(stats: WorkStats) {
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StatTile(
                "Tasks completed",
                stats.completed.toString(),
                if (stats.created > 0) "${stats.created} new ones taken on" else "No new tasks taken on",
                Modifier.weight(1f),
            )
            val rate = stats.onTimeRate
            StatTile(
                "Done on time",
                rate?.let { "${(it * 100).roundToInt()}%" } ?: "–",
                if (rate == null) "No dated tasks finished" else "${stats.completedOnTime} of ${stats.completedOnTime + stats.completedLate} with a due date",
                Modifier.weight(1f),
                meter = rate?.toFloat(),
            )
        }
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StatTile(
                "Overdue now",
                stats.overdueNow.toString(),
                "${stats.openNow} open in all",
                Modifier.weight(1f),
            )
            StatTile(
                "Waiting on others",
                stats.waitingNow.toString(),
                if (stats.waitingNow > 0) "Oldest: ${stats.oldestWaitingDays} days" else "Nobody owes you anything",
                Modifier.weight(1f),
            )
        }
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StatTile(
                "Meetings recorded",
                stats.meetings.toString(),
                if (stats.meetingMinutes >= 60) "%.1f hours".format(stats.meetingMinutes / 60.0) else "${stats.meetingMinutes} minutes",
                Modifier.weight(1f),
            )
            StatTile(
                "Days to finish a task",
                stats.averageDaysToClose?.let { "%.1f".format(it) } ?: "–",
                "Average, start to done",
                Modifier.weight(1f),
            )
        }
    }
}

/**
 * Tasks completed on each day of the week: one series, so one colour and no legend; thin columns
 * with a rounded top on a hairline baseline; the count sits on each column in ordinary text.
 */
@Composable
private fun CompletionChart(stats: WorkStats, today: Long) {
    val days = stats.completedByDay
    val peak = (days.maxOfOrNull { it.second } ?: 0).coerceAtLeast(1)
    val chartHeight = 96.dp
    val summary = "Tasks completed each day. " + days.joinToString(", ") { (day, count) -> "${Days.weekdayName(day)} $count" }
    AideCard {
        Text("Tasks completed each day", style = MaterialTheme.typography.titleSmall)
        Spacer(Modifier.height(12.dp))
        Column(Modifier.fillMaxWidth().clearAndSetSemantics { contentDescription = summary }) {
            Row(Modifier.fillMaxWidth().height(chartHeight + 20.dp), verticalAlignment = Alignment.Bottom) {
                for ((day, count) in days) {
                    Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Bottom) {
                        if (count > 0) {
                            Text(count.toString(), style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurface)
                            Spacer(Modifier.height(4.dp))
                            Box(
                                Modifier
                                    .width(20.dp)
                                    .height(chartHeight * (count.toFloat() / peak))
                                    .clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp))
                                    .background(AideTheme.colors.chart),
                            )
                        } else if (day <= today) {
                            // A day with nothing done still gets a mark on the baseline, so it reads as zero and not as missing.
                            Box(Modifier.width(20.dp).height(2.dp).background(MaterialTheme.colorScheme.outlineVariant))
                        }
                    }
                }
            }
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
            Row(Modifier.fillMaxWidth().padding(top = 6.dp)) {
                for ((day, _) in days) {
                    Text(
                        Days.shortWeekday(day),
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = if (day == today) FontWeight.Bold else FontWeight.Normal,
                        color = if (day > today) MaterialTheme.colorScheme.outline else MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.weight(1f),
                    )
                }
            }
        }
    }
}

@Composable
private fun AssistantCard(stats: AssistantStats) {
    AideCard {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                "Judged by what you did with its work. Rate notes and answers with the thumbs and this gets sharper.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            AssistantRow(
                "Meeting notes",
                when {
                    stats.summaries == 0 -> "None written yet"
                    stats.summariesUp + stats.summariesDown == 0 -> "${stats.summaries} written, none rated yet"
                    else -> "${stats.summariesUp} rated right, ${stats.summariesDown} rated wrong, of ${stats.summaries} written"
                },
                stats.summaryApproval,
            )
            AssistantRow(
                "Action items it spotted",
                when {
                    stats.tasksSuggested == 0 -> "None yet"
                    else -> "${stats.tasksSuggested} spotted: ${stats.tasksDismissed} weren't real tasks, ${stats.tasksEdited} you had to correct" +
                        if (stats.tasksUnclear > 0) ", ${stats.tasksUnclear} waiting for an owner" else ""
                },
                stats.taskPrecision,
            )
            AssistantRow(
                "Questions it asked you",
                if (stats.questionsAsked == 0) "None yet" else "${stats.questionsAnswered} of ${stats.questionsAsked} answered",
                null,
            )
            AssistantRow(
                "Answers and plans",
                when (val rated = stats.answersUp + stats.answersDown + stats.plansUp + stats.plansDown) {
                    0 -> "None rated yet"
                    else -> "${stats.answersUp + stats.plansUp} of $rated rated helpful"
                },
                null,
            )
            AssistantRow("Knowledge base", if (stats.knowledgeEntries == 1) "1 entry" else "${stats.knowledgeEntries} entries", null)
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
            AssistantRow(
                "Claude usage, last 30 days",
                if (stats.calls == 0) {
                    "No calls yet"
                } else {
                    "${stats.calls} calls, about ${formatTokens(stats.inputTokens + stats.outputTokens)} tokens, roughly ${formatCost(stats.estimatedCostUsd)}" +
                        if (stats.failedCalls > 0) " (${stats.failedCalls} failed)" else ""
                },
                null,
            )
            Text(
                "The cost is an estimate from list prices. Your Claude Console has the actual bill.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.outline,
            )
        }
    }
}

@Composable
private fun AssistantRow(label: String, detail: String, share: Double?) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
            Text(label, style = MaterialTheme.typography.bodyLarge)
            Text(detail, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        if (share != null) Text("${(share * 100).roundToInt()}%", style = MaterialTheme.typography.titleLarge)
    }
}

fun formatTokens(tokens: Long): String = when {
    tokens >= 1_000_000 -> "%.1fM".format(tokens / 1_000_000.0)
    tokens >= 1_000 -> "${(tokens / 1000.0).roundToInt()}K"
    else -> tokens.toString()
}

fun formatCost(usd: Double): String = if (usd < 0.01) "under $0.01" else "$" + "%.2f".format(usd)
