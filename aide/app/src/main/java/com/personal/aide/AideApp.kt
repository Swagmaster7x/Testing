package com.personal.aide

import android.app.Application
import com.personal.aide.notify.Notifications
import com.personal.aide.notify.Reminders
import kotlinx.coroutines.launch

class AideApp : Application() {
    /** Replaced by tests before the first activity starts. */
    lateinit var container: AppContainer

    override fun onCreate() {
        super.onCreate()
        Notifications.createChannels(this)
        if (!::container.isInitialized) container = AppContainer(this)
        // Alarms don't survive a restart of the phone, and the calendar may have changed since the app last ran.
        container.scope.launch { runCatching { Reminders.sync(container) } }
    }
}
