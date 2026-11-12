package com.personal.mealgym.ads

import android.app.Activity
import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.personal.mealgym.data.SettingsRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.emptyFlow

/** The personal edition: no ads, no purchases, no network. */
@Suppress("UNUSED_PARAMETER")
fun createMonetization(context: Context, scope: CoroutineScope, settings: SettingsRepository): Monetization = NoAds

private object NoAds : Monetization {
    override val available = false
    override val adsRemoved: StateFlow<Boolean> = MutableStateFlow(true)
    override val removeAdsPrice: StateFlow<String?> = MutableStateFlow(null)
    override val privacyOptionsRequired: StateFlow<Boolean> = MutableStateFlow(false)
    override val messages: Flow<String> = emptyFlow()

    override fun onActivityCreated(activity: Activity) = Unit
    override fun buyRemoveAds(activity: Activity) = Unit
    override fun restorePurchase() = Unit
    override fun showPrivacyOptions(activity: Activity) = Unit

    @Composable
    override fun Banner(modifier: Modifier) = Unit
}
