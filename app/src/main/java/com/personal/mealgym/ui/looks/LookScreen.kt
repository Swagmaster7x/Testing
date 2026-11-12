package com.personal.mealgym.ui.looks

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.foundation.relocation.BringIntoViewRequester
import androidx.compose.foundation.relocation.bringIntoViewRequester
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.ShowMessages
import com.personal.mealgym.ui.components.AppButton
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.theme.CustomLook
import com.personal.mealgym.ui.theme.Looks
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** Settings > Look: the open person's look. A ready-made one applies at once, so the whole app is the preview. */
class LookViewModel(private val c: AppContainer) : MessageViewModel() {
    val profileId = c.currentProfileId()
    val profile: StateFlow<Profile> = c.profile(profileId).stateInVm(c.currentProfile())

    /** The look being made in the creator: the saved one, or a starting point. */
    private val _draft = MutableStateFlow(CustomLook.decode(c.currentProfile().customLook) ?: CustomLook())
    val draft: StateFlow<CustomLook> = _draft.asStateFlow()

    private val _creating = MutableStateFlow(c.currentProfile().themeKey == Looks.CUSTOM)

    /** The creator is open (picked "Your own look"). */
    val creating: StateFlow<Boolean> = _creating.asStateFlow()

    fun pick(key: String) {
        if (key == Looks.CUSTOM) {
            _creating.value = true
            // Someone who already made a look gets it back straight away.
            if (profile.value.customLook != null) save(profile.value.copy(themeKey = Looks.CUSTOM))
            return
        }
        _creating.value = false
        save(profile.value.copy(themeKey = key))
        say("${Looks.forKey(key).name} is on.")
    }

    fun change(look: CustomLook) {
        _draft.value = look
    }

    fun useCustom() {
        save(profile.value.copy(themeKey = Looks.CUSTOM, customLook = _draft.value.encode()))
        say("Your own look is on.")
    }

    private fun save(p: Profile) {
        viewModelScope.launch { c.people.update(p) }
    }
}

@Composable
fun LookScreen(nav: AppNavigator, vm: LookViewModel = viewModel(factory = AppViewModels.Factory)) {
    val profile by vm.profile.collectAsStateWithLifecycle()
    val draft by vm.draft.collectAsStateWithLifecycle()
    val creating by vm.creating.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    val selected = if (creating) Looks.CUSTOM else profile.themeKey
    val saved = CustomLook.decode(profile.customLook)

    AppScaffold(
        topBar = { DetailTopBar(title = "Look", onBack = nav::back) },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(start = 16.dp, end = 16.dp, bottom = 32.dp),
        ) {
            Text(
                "Pick a look for ${profile.name.ifBlank { "this person" }}. It changes straight away; everyone on the phone keeps their own.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            SectionHeader("Ready-made")
            LookGrid(selectedKey = selected, custom = saved, onPick = vm::pick)
            if (creating) {
                // Opening the creator scrolls to it; it sits below the grid.
                val creator = remember { BringIntoViewRequester() }
                var shown by remember { mutableStateOf(false) }
                LaunchedEffect(Unit) {
                    if (!shown) {
                        shown = true
                        if (profile.themeKey != Looks.CUSTOM) creator.bringIntoView()
                    }
                }
                SectionHeader("Make your own", Modifier.bringIntoViewRequester(creator))
                val look = Looks.custom(draft)
                LookPreview(look)
                CustomLookEditor(value = draft, onChange = vm::change, modifier = Modifier.padding(top = 4.dp))
                AppButton(
                    onClick = vm::useCustom,
                    enabled = profile.themeKey != Looks.CUSTOM || saved != draft,
                    modifier = Modifier.fillMaxWidth().padding(top = 20.dp),
                ) { Text(if (profile.themeKey == Looks.CUSTOM && saved == draft) "This look is on" else "Use this look") }
            }
        }
    }
}
