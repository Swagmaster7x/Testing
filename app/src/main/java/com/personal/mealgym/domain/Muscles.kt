package com.personal.mealgym.domain

/** The part of the body an exercise mostly trains, for the weekly summary. */
enum class MuscleGroup(val label: String) {
    CHEST("Chest"),
    BACK("Back"),
    SHOULDERS("Shoulders"),
    ARMS("Arms"),
    QUADS("Quads"),
    GLUTES_HAMS("Glutes and hamstrings"),
    CALVES("Calves"),
    CORE("Core"),
    OTHER("Other"),
}

/**
 * Sorts an exercise into a muscle group by its name. The rules are checked in order, so the
 * specific ones come first: "Leg-press calf raise" is calves before it is a leg press, and
 * "Chest-supported row machine" is a row before it is chest.
 */
object Muscles {
    private val rules: List<Pair<MuscleGroup, Regex>> = listOf(
        MuscleGroup.CALVES to "calf",
        MuscleGroup.CORE to "plank|dead bug|crunch|\\bab\\b|knee raise|leg raise|mountain climber|farmer|sit-up|russian twist|bird dog|pallof",
        MuscleGroup.SHOULDERS to "shoulder press|overhead press|lateral raise|side raise|rear-delt|rear delt|reverse pec-deck|face pull|" +
            "pull-apart|pike push-up|arnold|upright row|front raise|shrug",
        MuscleGroup.GLUTES_HAMS to "hip thrust|glute|kickback|hip abduction|side step|side kick|pull-through|romanian|deadlift|leg curl|" +
            "good morning|back extension|reverse hyper|superman|hamstring",
        MuscleGroup.QUADS to "squat|leg press|lunge|step-up|leg extension|wall sit",
        MuscleGroup.ARMS to "chair dip|curl|pushdown|triceps|tricep|overhead cable extension|skull|close-grip",
        MuscleGroup.BACK to "\\brows?\\b|pulldown|pull-up|chin-up|dead hang|\\blat\\b",
        MuscleGroup.CHEST to "bench|chest|push-up|pec-deck|crossover|\\bdips?\\b|press|fl(?:y|ies)",
    ).map { (group, words) -> group to Regex(words) }

    fun groupOf(exerciseName: String): MuscleGroup {
        val name = exerciseName.lowercase()
        return rules.firstOrNull { (_, words) -> words.containsMatchIn(name) }?.first ?: MuscleGroup.OTHER
    }
}
