package com.personal.mealgym.ui

import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.stateIn
import androidx.lifecycle.viewModelScope

/** A ViewModel that can show short snackbar messages. */
abstract class MessageViewModel : ViewModel() {
    private val _messages = Channel<String>(Channel.BUFFERED)
    val messages: Flow<String> = _messages.receiveAsFlow()

    protected fun say(text: String) {
        _messages.trySend(text)
    }

    protected fun <T> Flow<T>.stateInVm(initial: T): StateFlow<T> =
        stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), initial)
}

@Composable
fun MessageViewModel.ShowMessages(snackbar: SnackbarHostState) {
    LaunchedEffect(this) {
        messages.collect { snackbar.showSnackbar(it) }
    }
}
