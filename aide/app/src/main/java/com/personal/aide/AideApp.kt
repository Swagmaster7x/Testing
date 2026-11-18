package com.personal.aide

import android.app.Application
import com.personal.aide.notify.Notifications

class AideApp : Application() {
    /** Replaced by tests before the first activity starts. */
    lateinit var container: AppContainer

    override fun onCreate() {
        super.onCreate()
        Notifications.createChannels(this)
        if (!::container.isInitialized) container = AppContainer(this)
    }
}
