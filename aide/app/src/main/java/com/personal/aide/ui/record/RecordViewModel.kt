package com.personal.aide.ui.record

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.data.db.SegmentEntity
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

@OptIn(ExperimentalCoroutinesApi::class)
class RecordViewModel(container: AppContainer) : ViewModel() {
    val recorder = container.recorder

    val segments: StateFlow<List<SegmentEntity>> = recorder.state
        .map { it.meetingId }
        .distinctUntilChanged()
        .flatMapLatest { id -> if (id == null) flowOf(emptyList()) else container.db.meetings().observeSegments(id) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    /** The time, twice a second, for the running clock. */
    val now: StateFlow<Long> = flow {
        while (true) {
            emit(recorder.clock())
            delay(500)
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(), recorder.clock())
}
