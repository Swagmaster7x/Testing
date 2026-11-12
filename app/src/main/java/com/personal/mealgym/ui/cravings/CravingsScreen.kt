package com.personal.mealgym.ui.cravings

import android.content.ActivityNotFoundException
import android.content.Intent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.MenuPick
import com.personal.mealgym.data.Restaurant
import com.personal.mealgym.data.RestaurantRepository
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.domain.Avoid
import com.personal.mealgym.domain.Foods
import com.personal.mealgym.domain.answers
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.EmptyState
import com.personal.mealgym.ui.components.SectionHeader
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine

/** One place on the list, with how many of its home versions this person can cook. */
data class PlaceRow(val restaurant: Restaurant, val recipes: Int)

data class CravingsUi(
    val places: List<PlaceRow>,
    /** Every home version of restaurant food in this person's library. */
    val copycats: List<Recipe>,
    val asOf: String,
    /** The person's "Show nutrition info" switch: off hides the figures. */
    val showNutrition: Boolean,
)

/** A home version of something on the menu. */
data class Homemade(val recipe: Recipe, val like: String)

data class RestaurantUi(
    val restaurant: Restaurant,
    val asOf: String,
    /** Picks with nothing we know this person avoids come first. */
    val picks: List<Pair<MenuPick, Set<Avoid>>>,
    /** The allergens this person avoids: restaurant food needs its own check for these. */
    val allergens: Set<Avoid>,
    val homemade: List<Homemade>,
    /** Home versions left out because they contain something this person avoids. */
    val leftOut: Int,
    val showNutrition: Boolean,
)

/** The person's own view of the library: nothing hidden, nothing they've asked to avoid. */
private fun mine(recipes: List<Recipe>, conflicts: Map<Long, Set<Avoid>>): List<Recipe> =
    recipes.filter { !it.isHidden && it.id !in conflicts }

class CravingsViewModel(c: AppContainer) : MessageViewModel() {
    private val profileId = c.currentProfileId()

    val ui: StateFlow<CravingsUi?> = combine(
        c.meals.recipesFor(profileId),
        c.meals.conflictsFor(profileId),
        c.settings.settings(profileId),
    ) { recipes, conflicts, settings ->
        val mine = mine(recipes, conflicts)
        val keys = mine.mapNotNull { it.seedKey }.toSet()
        CravingsUi(
            places = c.restaurants.all.map { place -> PlaceRow(place, place.copycats.count { it.recipe in keys }) },
            copycats = mine.filter { RestaurantRepository.COPYCAT_TAG in it.cuisineTags }.sortedBy { it.name.lowercase() },
            asOf = c.restaurants.file.asOf,
            showNutrition = settings.showNutrition,
        )
    }.stateInVm(null)
}

class RestaurantViewModel(c: AppContainer, handle: SavedStateHandle) : MessageViewModel() {
    private val profileId = c.currentProfileId()
    val restaurant: Restaurant? = c.restaurants.byKey(handle.get<String>("key").orEmpty())

    val ui: StateFlow<RestaurantUi?> = combine(
        c.meals.recipesFor(profileId),
        c.meals.conflictsFor(profileId),
        c.profile(profileId),
        c.settings.settings(profileId),
    ) { recipes, conflicts, person, settings ->
        val place = restaurant ?: return@combine null
        val avoids = person.answers?.avoids.orEmpty()
        val bySeedKey = recipes.filter { it.seedKey != null }.associateBy { it.seedKey }
        val linked = place.copycats.mapNotNull { link -> bySeedKey[link.recipe]?.let { Homemade(it, link.like) } }
        val shown = linked.filter { !it.recipe.isHidden && it.recipe.id !in conflicts }
        RestaurantUi(
            restaurant = place,
            asOf = c.restaurants.file.asOf,
            picks = place.picks.map { it to (it.contains intersect avoids) }.sortedBy { it.second.isNotEmpty() },
            allergens = avoids.filter { it.isAllergen }.toSet(),
            homemade = shown,
            leftOut = linked.count { it.recipe.id in conflicts },
            showNutrition = settings.showNutrition,
        )
    }.stateInVm(null)
}

/** "What are you craving?": pick a place, see the better choices there and what to cook that tastes like it. */
@Composable
fun CravingsScreen(nav: AppNavigator, vm: CravingsViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()

    AppScaffold(topBar = { DetailTopBar(title = "What are you craving?", onBack = nav::back) }) { padding ->
        val state = ui ?: return@AppScaffold
        LazyColumn(Modifier.fillMaxSize().padding(padding), contentPadding = PaddingValues(bottom = 24.dp)) {
            item {
                Text(
                    "Pick a place. You'll see the better choices on its menu and how to order them, " +
                        "plus recipes here that taste like the favorites.",
                    style = MaterialTheme.typography.bodyLarge,
                    modifier = Modifier.padding(horizontal = 16.dp),
                )
            }
            item { SectionHeader("Eating out", Modifier.padding(horizontal = 16.dp)) }
            items(state.places, key = { "place-${it.restaurant.key}" }) { row ->
                val place = row.restaurant
                ListItem(
                    modifier = Modifier.clickable { nav.restaurant(place.key) },
                    headlineContent = { Text(place.name) },
                    supportingContent = {
                        Text(
                            listOfNotNull(
                                place.kind.takeIf { it.isNotBlank() },
                                "${place.picks.size} better picks",
                                when (row.recipes) {
                                    0 -> null
                                    1 -> "1 recipe to make at home"
                                    else -> "${row.recipes} recipes to make at home"
                                },
                            ).joinToString(" · "),
                        )
                    },
                    trailingContent = { Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = null) },
                )
            }
            if (state.copycats.isNotEmpty()) {
                item { SectionHeader("Make it at home", Modifier.padding(horizontal = 16.dp)) }
                item {
                    Text(
                        "Home versions of restaurant favorites: grilled or baked, with more protein and fewer calories.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(horizontal = 16.dp),
                    )
                }
                items(state.copycats, key = { "recipe-${it.id}" }) { recipe ->
                    HomemadeRow(recipe, like = null, showNutrition = state.showNutrition) { nav.recipe(recipe.id) }
                }
            }
            item { MenuNote(state.asOf, Modifier.padding(start = 16.dp, end = 16.dp, top = 24.dp)) }
        }
    }
}

@Composable
fun RestaurantScreen(nav: AppNavigator, vm: RestaurantViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val context = LocalContext.current

    AppScaffold(topBar = { DetailTopBar(title = vm.restaurant?.name ?: "Eating out", onBack = nav::back) }) { padding ->
        if (vm.restaurant == null) {
            EmptyState("Place not found", "It isn't on the app's list.", Modifier.padding(padding))
            return@AppScaffold
        }
        val state = ui ?: return@AppScaffold
        val place = state.restaurant
        val check: () -> Unit = {
            try {
                context.startActivity(Intent(Intent.ACTION_VIEW, RestaurantRepository.searchUrl(place).toUri()))
            } catch (_: ActivityNotFoundException) {
                // No browser on the phone: nothing else to do.
            }
        }
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 24.dp),
        ) {
            if (state.allergens.isNotEmpty()) {
                item {
                    Surface(
                        color = MaterialTheme.colorScheme.errorContainer,
                        contentColor = MaterialTheme.colorScheme.onErrorContainer,
                        shape = MaterialTheme.shapes.medium,
                        modifier = Modifier.fillMaxWidth().padding(bottom = 4.dp),
                    ) {
                        Text(
                            "You avoid ${Foods.describe(state.allergens)}. The app can't see a restaurant's full ingredients, " +
                                "and kitchens share equipment. Check the restaurant's own allergen guide every time.",
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(12.dp),
                        )
                    }
                }
            }
            item { SectionHeader("Better picks") }
            items(state.picks, key = { "pick-${it.first.name}" }) { (pick, flagged) ->
                PickRow(pick, flagged, state.showNutrition)
            }
            if (place.tips.isNotEmpty()) {
                item { SectionHeader("How to order") }
                items(place.tips) { tip ->
                    Row(Modifier.padding(bottom = 8.dp)) {
                        Text("•", modifier = Modifier.width(20.dp), color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
                        Text(tip, style = MaterialTheme.typography.bodyLarge)
                    }
                }
            }
            item {
                OutlinedButton(onClick = check, modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
                    Text("Check current nutrition (opens a web search)")
                }
            }
            if (state.homemade.isNotEmpty() || state.leftOut > 0) {
                item { SectionHeader("Make it at home") }
                items(state.homemade, key = { "home-${it.recipe.id}" }) { home ->
                    HomemadeRow(home.recipe, home.like, state.showNutrition) { nav.recipe(home.recipe.id) }
                }
                if (state.leftOut > 0) {
                    item {
                        Text(
                            if (state.leftOut == 1) {
                                "1 recipe with something you avoid is left out."
                            } else {
                                "${state.leftOut} recipes with something you avoid are left out."
                            },
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(top = 4.dp),
                        )
                    }
                }
            }
            item { MenuNote(state.asOf, Modifier.padding(top = 24.dp)) }
        }
    }
}

@Composable
private fun PickRow(pick: MenuPick, flagged: Set<Avoid>, showNutrition: Boolean) {
    Column(Modifier.fillMaxWidth().padding(bottom = 14.dp), verticalArrangement = Arrangement.spacedBy(2.dp)) {
        Text(pick.name, style = MaterialTheme.typography.titleMedium)
        pick.about?.takeIf { showNutrition }?.let {
            Text(it, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.primary)
        }
        pick.note?.let {
            Text(it, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        if (flagged.isNotEmpty()) {
            Text(
                "Has ${Foods.describe(flagged)}, which you avoid.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.error,
            )
        }
    }
}

/** A recipe from the library, with the menu item it is like when we're on that place's page. */
@Composable
private fun HomemadeRow(recipe: Recipe, like: String?, showNutrition: Boolean, onClick: () -> Unit) {
    ListItem(
        modifier = Modifier.clickable(onClick = onClick),
        headlineContent = { Text(recipe.name) },
        supportingContent = {
            Column {
                if (like != null) Text("Like $like")
                // With the serving size, since a home serving usually includes the rice or sides the menu figure leaves out.
                recipe.nutritionText?.takeIf { showNutrition && it.isNotBlank() }?.let { figures ->
                    val size = recipe.servingSizeText.trim()
                    Text(if (size.isEmpty()) "A serving: $figures" else "${size.replaceFirstChar { it.uppercase() }}: $figures")
                }
            }
        },
        trailingContent = { Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = null) },
    )
}

/** Where the figures come from, and that the app has nothing to do with the restaurants. */
@Composable
fun MenuNote(asOf: String, modifier: Modifier = Modifier) {
    Text(
        MENU_NOTE.replace("{asOf}", asOf.ifBlank { "the past" }),
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = modifier,
    )
}

const val MENU_NOTE = "Calories and protein are approximate, gathered from published menu information in {asOf}. " +
    "Menus, recipes and portions change and vary by location, so check the restaurant's own nutrition and allergen " +
    "information before you order. This app is not affiliated with, sponsored by or endorsed by any restaurant listed. " +
    "Restaurant and menu names belong to their owners."
