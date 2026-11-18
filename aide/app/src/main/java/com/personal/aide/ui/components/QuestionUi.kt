package com.personal.aide.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import com.personal.aide.data.db.QuestionEntity

/** One of the assistant's questions, with room to answer it on the spot. */
@Composable
fun QuestionCard(
    question: QuestionEntity,
    onAnswer: (String) -> Unit,
    onSkip: () -> Unit,
    modifier: Modifier = Modifier,
    source: String? = null,
) {
    var answer by rememberSaveable(question.id) { mutableStateOf("") }
    AideCard(modifier) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.tertiary, modifier = Modifier.size(20.dp))
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(question.question, style = MaterialTheme.typography.titleMedium)
                    val context = listOfNotNull(question.why.takeIf { it.isNotBlank() }?.replaceFirstChar { it.uppercase() }, source?.let { "From \"$it\"" })
                    if (context.isNotEmpty()) {
                        Text(context.joinToString(" · "), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
            OutlinedTextField(
                value = answer,
                onValueChange = { answer = it },
                placeholder = { Text("Your answer") },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
            )
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                TextButton(onClick = onSkip) { Text("Skip") }
                Spacer(Modifier.weight(1f))
                Button(onClick = { onAnswer(answer) }, enabled = answer.isNotBlank()) { Text("Save answer") }
            }
        }
    }
}
