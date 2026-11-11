package com.personal.mealgym

import android.app.Application
import com.personal.mealgym.sauna.Alerts

class MealGymApp : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
        container.start()
        Alerts.createChannels(this)
    }
}
