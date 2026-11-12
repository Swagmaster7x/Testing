package com.personal.mealgym.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import androidx.compose.ui.res.painterResource
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.personal.mealgym.MainActivity
import com.personal.mealgym.R
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.ui.cook.CookScreen
import com.personal.mealgym.ui.cook.CookingModeScreen
import com.personal.mealgym.ui.cook.RecipeEditScreen
import com.personal.mealgym.ui.cook.RecipeScreen
import com.personal.mealgym.ui.cook.ShoppingListScreen
import com.personal.mealgym.ui.gym.DemoScreen
import com.personal.mealgym.ui.gym.GymScreen
import com.personal.mealgym.ui.gym.WorkoutEditScreen
import com.personal.mealgym.ui.history.HistoryScreen
import com.personal.mealgym.ui.looks.LookScreen
import com.personal.mealgym.ui.people.PersonScreen
import com.personal.mealgym.ui.plan.PlanScreen
import com.personal.mealgym.ui.sauna.SaunaScreen
import com.personal.mealgym.ui.settings.SettingsScreen
import com.personal.mealgym.ui.theme.Looks
import com.personal.mealgym.ui.theme.ThemedBackground
import com.personal.mealgym.ui.today.TodayScreen
import kotlinx.coroutines.flow.StateFlow

object Routes {
    const val TODAY = "today"
    const val PLAN = "plan"
    const val COOK = "cook"
    const val GYM = "gym"
    const val RECIPE = "recipe/{id}"
    const val COOKING = "cooking/{id}"
    const val RECIPE_EDIT = "recipe-edit/{id}"
    const val SHOPPING = "shopping"
    const val SAUNA = "sauna"
    const val SETTINGS = "settings"
    const val HISTORY = "history"
    const val WORKOUT_EDIT = "workout-edit"
    const val DEMO = "demo/{name}"
    const val PERSON = "person/{id}"
    const val LOOK = "look"

    /** Screens that may show a banner ad in the store edition. */
    val withBanner = setOf(PLAN, COOK, RECIPE, HISTORY)

    fun recipe(id: Long) = "recipe/$id"
    fun cooking(id: Long) = "cooking/$id"
    fun recipeEdit(id: Long = 0) = "recipe-edit/$id"
    fun demo(exerciseName: String) = "demo/" + android.net.Uri.encode(exerciseName)
    fun person(id: Long = 0) = "person/$id"
}

/** Every way one screen can open another. */
class AppNavigator(private val nav: NavHostController) {
    fun back() {
        nav.popBackStack()
    }

    fun tab(route: String) {
        nav.navigate(route) {
            popUpTo(nav.graph.findStartDestination().id) { saveState = true }
            launchSingleTop = true
            restoreState = true
        }
    }

    fun recipe(id: Long) = nav.navigate(Routes.recipe(id))
    fun cooking(id: Long) = nav.navigate(Routes.cooking(id))
    fun editRecipe(id: Long = 0) = nav.navigate(Routes.recipeEdit(id))
    fun shopping() = nav.navigate(Routes.SHOPPING) { launchSingleTop = true }
    fun sauna() = nav.navigate(Routes.SAUNA) { launchSingleTop = true }
    fun settings() = nav.navigate(Routes.SETTINGS) { launchSingleTop = true }
    fun history() = nav.navigate(Routes.HISTORY) { launchSingleTop = true }
    fun editWorkouts() = nav.navigate(Routes.WORKOUT_EDIT) { launchSingleTop = true }
    fun demo(exerciseName: String) = nav.navigate(Routes.demo(exerciseName))
    fun person(id: Long = 0) = nav.navigate(Routes.person(id))
    fun look() = nav.navigate(Routes.LOOK) { launchSingleTop = true }
}

private data class Tab(val route: String, val label: String, val icon: @Composable () -> Painter)

private val ironTabs = listOf(
    Tab(Routes.TODAY, "Today") { rememberVectorPainter(Icons.Filled.Home) },
    Tab(Routes.PLAN, "Plan") { rememberVectorPainter(Icons.Filled.DateRange) },
    Tab(Routes.COOK, "Cook") { painterResource(R.drawable.ic_restaurant) },
    Tab(Routes.GYM, "Gym") { painterResource(R.drawable.ic_fitness) },
)

/** Ashley's tab icons: star, calendar with a heart, whisk, dumbbell with a bow (all drawn fresh). */
private val glamTabs = listOf(
    Tab(Routes.TODAY, "Today") { painterResource(R.drawable.ic_star) },
    Tab(Routes.PLAN, "Plan") { painterResource(R.drawable.ic_calendar_heart) },
    Tab(Routes.COOK, "Cook") { painterResource(R.drawable.ic_whisk) },
    Tab(Routes.GYM, "Gym") { painterResource(R.drawable.ic_dumbbell_bow) },
)

@Composable
fun MealGymNavHost(
    profile: Profile,
    /** The store edition's ad banner; nothing in the personal edition. */
    banner: @Composable (Modifier) -> Unit = {},
    pendingOpen: StateFlow<String?>,
    onOpenHandled: () -> Unit,
    navController: NavHostController = rememberNavController(),
) {
    val navigator = AppNavigator(navController)
    val backStack by navController.currentBackStackEntryAsState()
    val currentRoute = backStack?.destination?.route
    val open by pendingOpen.collectAsState()
    val tabs = if (Looks.of(profile).cuteTabs) glamTabs else ironTabs

    LaunchedEffect(open) {
        if (open == MainActivity.OPEN_SAUNA) {
            navigator.sauna()
            onOpenHandled()
        }
    }

    ThemedBackground {
    Scaffold(
        containerColor = Color.Transparent,
        contentColor = MaterialTheme.colorScheme.onBackground,
        bottomBar = {
            val showTabs = tabs.any { it.route == currentRoute }
            Column {
                // Banners only where people browse: never on Today, the gym, the sauna or while cooking.
                if (currentRoute in Routes.withBanner) {
                    banner(if (showTabs) Modifier else Modifier.navigationBarsPadding())
                }
                if (showTabs) {
                    NavigationBar {
                        tabs.forEach { tab ->
                            NavigationBarItem(
                                selected = currentRoute == tab.route,
                                onClick = { navigator.tab(tab.route) },
                                icon = { Icon(tab.icon(), contentDescription = null) },
                                label = { Text(tab.label) },
                            )
                        }
                    }
                }
            }
        },
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Routes.TODAY,
            modifier = Modifier.padding(padding).consumeWindowInsets(padding),
        ) {
            composable(Routes.TODAY) { TodayScreen(navigator) }
            composable(Routes.PLAN) { PlanScreen(navigator) }
            composable(Routes.COOK) { CookScreen(navigator) }
            composable(Routes.GYM) { GymScreen(navigator) }
            composable(Routes.RECIPE, arguments = listOf(navArgument("id") { type = NavType.LongType })) {
                RecipeScreen(navigator)
            }
            composable(Routes.COOKING, arguments = listOf(navArgument("id") { type = NavType.LongType })) {
                CookingModeScreen(navigator)
            }
            composable(Routes.RECIPE_EDIT, arguments = listOf(navArgument("id") { type = NavType.LongType })) {
                RecipeEditScreen(navigator)
            }
            composable(Routes.SHOPPING) { ShoppingListScreen(navigator) }
            composable(Routes.SAUNA) { SaunaScreen(navigator) }
            composable(Routes.SETTINGS) { SettingsScreen(navigator) }
            composable(Routes.HISTORY) { HistoryScreen(navigator) }
            composable(Routes.WORKOUT_EDIT) { WorkoutEditScreen(navigator) }
            composable(Routes.DEMO, arguments = listOf(navArgument("name") { type = NavType.StringType })) {
                DemoScreen(navigator)
            }
            composable(Routes.PERSON, arguments = listOf(navArgument("id") { type = NavType.LongType })) {
                PersonScreen(navigator)
            }
            composable(Routes.LOOK) { LookScreen(navigator) }
        }
    }
    }
}
