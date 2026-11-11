package com.personal.mealgym.ui.cook

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Checkbox
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.components.AppButton
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.displayLine
import kotlinx.coroutines.launch

/** Step-by-step cooking: large text, one step per page, screen kept on. */
@Composable
fun CookingModeScreen(nav: AppNavigator, vm: RecipeViewModel = viewModel(factory = AppViewModels.Factory)) {
    val state by vm.state.collectAsStateWithLifecycle()
    val ui = (state as? RecipeState.Loaded)?.ui

    val view = LocalView.current
    DisposableEffect(view) {
        view.keepScreenOn = true
        onDispose { view.keepScreenOn = false }
    }

    AppScaffold(topBar = { DetailTopBar(title = ui?.recipe?.name ?: "Cooking", onBack = nav::back) }) { padding ->
        if (ui == null) return@AppScaffold
        val steps = ui.recipe.steps
        val pageCount = steps.size + 1
        val pager = rememberPagerState(pageCount = { pageCount })
        val scope = rememberCoroutineScope()
        val gathered = remember { mutableStateListOf<Long>() }

        Column(Modifier.fillMaxSize().padding(padding)) {
            LinearProgressIndicator(
                progress = { (pager.currentPage + 1f) / pageCount },
                modifier = Modifier.fillMaxWidth(),
            )
            HorizontalPager(state = pager, modifier = Modifier.weight(1f)) { page ->
                Column(
                    Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                ) {
                    if (page == 0) {
                        Text("Get these out", style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.primary)
                        ui.ingredients.forEach { ing ->
                            val done = ing.id in gathered
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.fillMaxWidth().clickable {
                                    if (done) gathered.remove(ing.id) else gathered.add(ing.id)
                                },
                            ) {
                                Checkbox(checked = done, onCheckedChange = null, modifier = Modifier.padding(end = 12.dp))
                                Text(
                                    ing.displayLine(),
                                    fontSize = 22.sp,
                                    lineHeight = 28.sp,
                                    textDecoration = if (done) TextDecoration.LineThrough else null,
                                )
                            }
                        }
                    } else {
                        Text(
                            "Step $page of ${steps.size}",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.primary,
                        )
                        Text(steps[page - 1], fontSize = 30.sp, lineHeight = 40.sp)
                    }
                }
            }
            Row(
                Modifier.fillMaxWidth().padding(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                OutlinedButton(
                    onClick = { scope.launch { pager.animateScrollToPage(pager.currentPage - 1) } },
                    enabled = pager.currentPage > 0,
                    modifier = Modifier.weight(1f),
                ) { Text("Back", fontSize = 18.sp) }
                val last = pager.currentPage == pageCount - 1
                AppButton(
                    onClick = {
                        if (last) nav.back() else scope.launch { pager.animateScrollToPage(pager.currentPage + 1) }
                    },
                    modifier = Modifier.weight(1f),
                ) { Text(if (last) "Done" else "Next", fontSize = 18.sp) }
            }
        }
    }
}
