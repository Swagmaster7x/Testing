package com.personal.mealgym.domain

import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.seed.WorkoutTemplate
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.DayOfWeek

class PlanBuilderTest {

    private val man = PlanAnswers(sex = "MALE", age = 30, heightCm = 180.0, weightKg = 80.0, activity = "MODERATE")

    private fun ready(a: PlanAnswers) = (PlanBuilder.targets(a) as TargetResult.Ready).targets

    @Test
    fun maintenanceFollowsMifflinStJeor() {
        // Resting 10*80 + 6.25*180 - 5*30 + 5 = 1,780; times 1.55 = 2,759.
        val t = ready(man.copy(goal = "FIT"))
        assertEquals(2750, t.calories)
        assertEquals(110, t.proteinGrams)
        assertTrue(t.notes.isEmpty())
    }

    @Test
    fun fatLossIsAtMost500BelowAndMuscleAtMost300Above() {
        assertEquals(2250, ready(man.copy(goal = "LOSE")).calories)
        assertEquals(145, ready(man.copy(goal = "LOSE")).proteinGrams)
        assertEquals(3050, ready(man.copy(goal = "BUILD")).calories)
        // A smaller person: 20% is less than 500, so the deficit is the 20%.
        val small = PlanAnswers(goal = "LOSE", sex = "FEMALE", age = 35, heightCm = 165.0, weightKg = 70.0, activity = "LIGHT")
        // Resting 700 + 1031.25 - 175 - 161 = 1,395.25; times 1.375 = 1,918.5; minus 20% = 1,534.8.
        assertEquals(1550, ready(small).calories)
    }

    @Test
    fun neverBelowTheFloor() {
        val a = PlanAnswers(goal = "LOSE", sex = "FEMALE", age = 28, heightCm = 160.0, weightKg = 55.0, activity = "LOW")
        val t = ready(a)
        assertEquals(1200, t.calories)
        assertTrue(t.notes.single().contains("lowest this app suggests"))
        assertEquals(1500, PlanBuilder.calorieFloor(Sex.MALE))
        assertEquals(1400, PlanBuilder.calorieFloor(Sex.UNSPECIFIED))
    }

    @Test
    fun noDeficitForSomeoneAlreadyUnderweight() {
        val a = PlanAnswers(goal = "LOSE", sex = "FEMALE", age = 25, heightCm = 170.0, weightKg = 50.0, activity = "LIGHT")
        val t = ready(a)
        // Maintenance: (500 + 1062.5 - 125 - 161) * 1.375 = 1,755.
        assertEquals(1750, t.calories)
        assertTrue(t.notes.single().contains("no deficit"))
    }

    @Test
    fun noNumbersUnder18OrWhilePregnant() {
        val teen = PlanBuilder.targets(man.copy(age = 16))
        assertTrue(teen is TargetResult.Withheld && teen.message.contains("under 18"))
        val expecting = PlanBuilder.targets(man.copy(sex = "FEMALE", pregnant = true))
        assertTrue(expecting is TargetResult.Withheld && expecting.message.contains("midwife"))
        assertEquals(1, PlanBuilder.guide(man.copy(age = 16)).size)
    }

    @Test
    fun missingOrImplausibleDetailsGiveNoNumbers() {
        assertEquals(TargetResult.NeedsDetails, PlanBuilder.targets(PlanAnswers()))
        assertEquals(TargetResult.NeedsDetails, PlanBuilder.targets(man.copy(weightKg = 20.0)))
        assertEquals(TargetResult.NeedsDetails, PlanBuilder.targets(man.copy(heightCm = 300.0)))
        assertTrue(PlanBuilder.guide(PlanAnswers()).isEmpty())
    }

    @Test
    fun proteinUsesAnAdjustedWeightAtHighBodyWeight() {
        val a = PlanAnswers(goal = "LOSE", sex = "MALE", age = 40, heightCm = 175.0, weightKg = 130.0)
        // Healthy weight for 175 cm is 76.6 kg; adjusted = 76.6 + 25% of the rest = 89.9 kg; times 1.8.
        assertEquals(160, ready(a).proteinGrams)
    }

    @Test
    fun ratherNotSaySitsBetweenTheTwoEquations() {
        val base = man.copy(goal = "FIT")
        val between = ready(base.copy(sex = "UNSPECIFIED")).calories
        assertTrue(between < ready(base).calories && between > ready(base.copy(sex = "FEMALE")).calories)
    }

    @Test
    fun guideReadsAsReferenceLines() {
        val lines = PlanBuilder.guide(man.copy(goal = "LOSE"))
        assertEquals(listOf("Calories", "Protein", "Pace"), lines.map { it.label })
        assertEquals("about 2,250 a day", lines[0].text)
        assertEquals("about 145 g a day or more, roughly 40 g a meal", lines[1].text)
    }

    @Test
    fun unitsConvertBothWays() {
        assertEquals(81.6, PlanBuilder.lbToKg(180.0), 0.05)
        assertEquals(177.8, PlanBuilder.feetInchesToCm(5, 10.0), 0.05)
        assertEquals(5 to 10, PlanBuilder.cmToFeetInches(177.8))
        assertEquals(6 to 0, PlanBuilder.cmToFeetInches(182.5))
    }

    private val templates = listOf("full-body-3", "upper-lower-4", "glute-3", "home-3").map { WorkoutTemplate(key = it, name = it) }

    @Test
    fun workoutPlanFitsWhereAndHowSomeoneTrains() {
        fun pick(a: PlanAnswers) = PlanBuilder.suggestTemplate(a, templates)!!.key
        assertEquals("home-3", pick(PlanAnswers(place = "HOME", experience = "SOME", daysPerWeek = 5)))
        assertEquals("full-body-3", pick(PlanAnswers(place = "GYM", experience = "NEW", daysPerWeek = 5)))
        assertEquals("upper-lower-4", pick(PlanAnswers(place = "GYM", experience = "SOME", daysPerWeek = 4)))
        assertEquals("full-body-3", pick(PlanAnswers(place = "GYM", experience = "SOME", daysPerWeek = 3)))
        assertNull(PlanBuilder.suggestTemplate(PlanAnswers(), emptyList()))
        assertEquals(setOf(DayOfWeek.MONDAY, DayOfWeek.THURSDAY), PlanBuilder.trainingDays(2))
        assertEquals(4, PlanBuilder.trainingDays(4).size)
        assertEquals(6, PlanBuilder.trainingDays(9).size)
    }

    private fun recipe(type: MealType, nutrition: String) = Recipe(name = "r", mealType = type, nutritionText = nutrition)

    private val library = listOf(
        recipe(MealType.BREAKFAST, "~450 cal, 35 g protein"),
        recipe(MealType.LUNCH, "~600 cal, 45 g protein, 60 g carbs"),
        recipe(MealType.DINNER, "~600 cal, 45 g protein"),
        recipe(MealType.SNACK, "~200 cal, 15 g protein"),
    )

    @Test
    fun mealsAreSizedToLandNearTheGuide() {
        // Breakfast 450 + two mains of 600 + snack 200.
        assertEquals(MealSetup(0.75, false, 1350, 103), PlanBuilder.mealSetup(1300, library))
        assertEquals(MealSetup(1.0, false, 1650, 125), PlanBuilder.mealSetup(1700, library))
        assertEquals(MealSetup(1.0, true, 1850, 140), PlanBuilder.mealSetup(1900, library))
        assertEquals(MealSetup(1.5, true, 2450, 185), PlanBuilder.mealSetup(3000, library))
        // No guide: full portions and no snack.
        assertEquals(MealSetup(1.0, false, 1650, 125), PlanBuilder.mealSetup(null, library))
    }

    @Test
    fun nutritionTextIsReadLeniently() {
        assertEquals(1250, PlanBuilder.caloriesIn("~1,250 cal, 90 g protein"))
        assertEquals(90, PlanBuilder.proteinIn("~1,250 cal, 90 g protein"))
        assertNull(PlanBuilder.caloriesIn("Snack guide: about 15–20 g protein"))
        assertNull(PlanBuilder.caloriesIn(null))
    }

    @Test
    fun favouriteCuisinesComeUpMoreOften() {
        val thai = Recipe(name = "a", mealType = MealType.DINNER, cuisineTags = listOf("Asian"))
        val stew = Recipe(name = "b", mealType = MealType.DINNER, cuisineTags = listOf("Caribbean"))
        assertEquals(listOf(thai, thai, thai, stew), PlanBuilder.weighted(listOf(thai, stew), listOf("asian")))
        assertEquals(listOf(thai, stew), PlanBuilder.weighted(listOf(thai, stew), emptyList()))
    }

    @Test
    fun answersRoundTripAndTolerateNewerChoices() {
        val a = man.copy(avoid = listOf("DAIRY", "PORK", "SOMETHING_NEW"), cuisines = listOf("Asian"))
        assertEquals(a, PlanAnswers.decode(a.encode()))
        assertEquals(setOf(Avoid.DAIRY, Avoid.PORK), a.avoids)
        assertEquals(Goal.FIT, PlanAnswers(goal = "FLY").goalValue)
        assertNull(PlanAnswers.decode("nope"))
        assertEquals(a, Profile(1, "A", "IRON", planAnswers = a.encode()).answers)
        assertNull(Profile(1, "A", "IRON").answers)
        assertEquals(Profile.TIPS_EASIER, PlanBuilder.tipsStyle(Goal.BUILD))
    }
}
