package com.personal.aide.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import kotlinx.coroutines.launch

/** What every screen that shows tasks can do to them. */
abstract class TaskActionsViewModel(protected val container: AppContainer) : ViewModel() {
    fun setDone(task: TaskEntity, done: Boolean) {
        viewModelScope.launch { container.tasks.setDone(task.id, done) }
    }

    /** Saves the task sheet's result: a task without an id is new. */
    fun saveTask(task: TaskEntity, meetingId: Long? = null) {
        viewModelScope.launch {
            if (task.id == 0L) {
                container.tasks.add(
                    title = task.title,
                    dueDay = task.dueDay,
                    priority = task.priority,
                    details = task.details,
                    ownership = task.ownership,
                    owner = task.owner,
                    plannedDay = task.plannedDay,
                    meetingId = meetingId,
                )
            } else {
                container.tasks.edit(task)
            }
        }
    }

    fun deleteTask(task: TaskEntity) {
        viewModelScope.launch { container.tasks.delete(task.id) }
    }

    fun dismissTask(task: TaskEntity) {
        viewModelScope.launch { container.tasks.dismiss(task.id) }
    }

    fun setOwnership(task: TaskEntity, ownership: Ownership) {
        viewModelScope.launch { container.tasks.setOwnership(task.id, ownership) }
    }
}
