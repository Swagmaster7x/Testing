package com.personal.aide.domain

/**
 * What is new in [incoming], given the text that was added last time ([previous]).
 *
 * Someone dictating into a text box in another app and copying it across in parts will often
 * copy the whole box each time, earlier words included, because dictation adds to what is
 * already there. Adding that as it stands would repeat the start of the meeting with every
 * part. So when the new text begins with all of the last one, only what follows is new; when
 * it is the same text again, nothing is; and anything else is taken whole.
 *
 * Differences in spacing and line breaks between the two copies don't count.
 */
fun freshPart(previous: String, incoming: String): String {
    val now = incoming.trim()
    val before = previous.trim()
    if (now.isEmpty() || before.isEmpty()) return now

    // Walk the two together, treating any run of white space in either as the same gap.
    var at = 0
    var earlier = 0
    while (earlier < before.length) {
        if (at >= now.length) return if (before.substring(earlier).isBlank()) "" else now
        val a = now[at]
        val b = before[earlier]
        when {
            a.isWhitespace() && b.isWhitespace() -> {
                while (at < now.length && now[at].isWhitespace()) at++
                while (earlier < before.length && before[earlier].isWhitespace()) earlier++
            }
            a == b -> {
                at++
                earlier++
            }
            // They part ways before the earlier text ends: this is something else, not a continuation.
            else -> return now
        }
    }
    val rest = now.substring(at)
    // "…the rate feed" followed by "…the rate feeds are" is a different sentence, not three new letters.
    if (rest.isNotEmpty() && !rest.first().isWhitespace() && before.last().isLetterOrDigit() && rest.first().isLetterOrDigit()) return now
    return rest.trim()
}
