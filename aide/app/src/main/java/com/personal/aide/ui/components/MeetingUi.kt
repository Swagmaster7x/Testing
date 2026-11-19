package com.personal.aide.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.domain.Days

/** How a meeting's state reads on a card, and how loudly. Null when it is simply done. */
fun meetingStatusLabel(meeting: MeetingEntity, summarizing: Boolean): Pair<String, Tone>? = when {
    summarizing || meeting.status == MeetingStatus.PROCESSING -> "Writing notes…" to Tone.ASSISTANT
    meeting.status == MeetingStatus.RECORDING -> "Recording" to Tone.BAD
    meeting.status == MeetingStatus.FAILED -> "Notes failed" to Tone.BAD
    meeting.status == MeetingStatus.TRANSCRIBED && meeting.source == MeetingSource.DOCUMENT -> "Not read yet" to Tone.WARN
    meeting.status == MeetingStatus.TRANSCRIBED -> "No notes yet" to Tone.WARN
    else -> null
}

fun meetingWhen(meeting: MeetingEntity): String = buildString {
    append(Days.dateTime(meeting.startedAt))
    val length = (meeting.endedAt ?: meeting.startedAt) - meeting.startedAt
    when {
        meeting.source == MeetingSource.DOCUMENT -> append(" · added by you")
        meeting.source == MeetingSource.IMPORT -> append(" · your notes")
        length >= 1000 -> append(" · ").append(Days.duration(length))
    }
}

@Composable
fun MeetingCard(
    meeting: MeetingEntity,
    summarizing: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    actionCount: Int = 0,
    /** The recurring meeting it belongs to, where the list it is shown in doesn't already say. */
    series: String? = null,
) {
    AideCard(modifier = modifier, onClick = onClick) {
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    meeting.title,
                    style = MaterialTheme.typography.titleMedium,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f),
                )
                meetingStatusLabel(meeting, summarizing)?.let { (label, tone) -> Pill(label, tone = tone) }
            }
            Text(meetingWhen(meeting), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            val preview = meeting.tldr.ifBlank { meeting.error }
            if (preview.isNotBlank()) {
                Text(
                    preview,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 3,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            if (actionCount > 0 || meeting.meetingType.isNotBlank() || !series.isNullOrBlank()) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    // A recurring meeting's name says more than its type, and there is room for one of them.
                    if (!series.isNullOrBlank()) {
                        Pill(series, Modifier.weight(1f, fill = false), icon = AideIcons.Loop)
                    } else if (meeting.meetingType.isNotBlank()) {
                        Pill(meeting.meetingType.replaceFirstChar { it.uppercase() })
                    }
                    if (actionCount > 0) Pill(if (actionCount == 1) "1 action" else "$actionCount actions", tone = Tone.INFO, icon = AideIcons.Tasks)
                }
            }
        }
    }
}
