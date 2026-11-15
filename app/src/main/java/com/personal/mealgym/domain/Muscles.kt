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
 * "Chest-supported row machine" is a row before it is chest. Hyphens are read as spaces, so
 * "Pull-ups", "Pull ups" and "Pullups" all land in the same place.
 */
object Muscles {
    private val rules: List<Pair<MuscleGroup, Regex>> = listOf(
        MuscleGroup.CALVES to "calf",
        MuscleGroup.CORE to "plank|dead bug|crunch|\\babs?\\b|knee raise|leg raise|mountain climber|farmer|sit ?ups?|russian twist|bird dog|pallof",
        MuscleGroup.ARMS to "triceps?|chair dip|bench dip|skull|close grip (?:bench|press|push)",
        MuscleGroup.SHOULDERS to "shoulder press|overhead press|military press|lateral raise|side raise|rear delt|reverse pec deck|" +
            "reverse fl(?:y|ies)|face pull|pull ?apart|pike push ?up|arnold|upright row|front raise|shrug",
        MuscleGroup.GLUTES_HAMS to "hip thrust|glute|kickback|hip abduction|side step|side kick|pull through|romanian|deadlift|leg curl|" +
            "good morning|back extension|reverse hyper|superman|hamstring",
        MuscleGroup.QUADS to "squat|leg press|lunge|step ?ups?|leg extension|wall sit",
        MuscleGroup.ARMS to "curl|pushdown|overhead cable extension",
        MuscleGroup.BACK to "\\brows?\\b|pulldown|pull ?ups?|chin ?ups?|dead hang|\\blats?\\b",
        MuscleGroup.CHEST to "bench|chest|push ?ups?|pec deck|crossover|\\bdips?\\b|press|fl(?:y|ies)",
    ).map { (group, words) -> group to Regex(words) }

    fun groupOf(exerciseName: String): MuscleGroup {
        val name = exerciseName.lowercase().replace('-', ' ')
        return rules.firstOrNull { (_, words) -> words.containsMatchIn(name) }?.first ?: MuscleGroup.OTHER
    }
}
