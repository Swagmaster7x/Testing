package com.personal.mealgym.ads

import android.content.Context
import com.personal.mealgym.data.SettingsRepository
import kotlinx.coroutines.CoroutineScope

/** The store edition: AdMob banners with consent, and a Remove ads purchase. */
fun createMonetization(context: Context, scope: CoroutineScope, settings: SettingsRepository): Monetization =
    StoreMonetization(context.applicationContext, scope, settings)
