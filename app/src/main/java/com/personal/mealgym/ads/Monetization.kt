package com.personal.mealgym.ads

import android.app.Activity
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.StateFlow

/**
 * Banner ads, the consent prompt they need, and the one-time Remove ads purchase. Only the
 * store edition has them; the personal edition's version does nothing and has no internet.
 */
interface Monetization {
    /** False in the personal edition: Settings shows no ads section. */
    val available: Boolean

    /** Bought Remove ads (remembered on the phone, checked with Google Play each launch). */
    val adsRemoved: StateFlow<Boolean>

    /** The Remove ads price in the person's currency, once Google Play has answered. */
    val removeAdsPrice: StateFlow<String?>

    /** Where the law asks for it (EEA, UK, Switzerland), Settings must offer "Privacy choices". */
    val privacyOptionsRequired: StateFlow<Boolean>

    /** Short notes for a snackbar, e.g. "Ads are off. Thank you!". */
    val messages: Flow<String>

    /** Asks for consent where needed, starts the ads SDK and checks for the purchase. */
    fun onActivityCreated(activity: Activity)

    fun buyRemoveAds(activity: Activity)

    /** Asks Google Play again, e.g. on a new phone. */
    fun restorePurchase()

    fun showPrivacyOptions(activity: Activity)

    /** An anchored banner at the full width it's given, or nothing while ads can't or shouldn't show. */
    @Composable
    fun Banner(modifier: Modifier)
}
