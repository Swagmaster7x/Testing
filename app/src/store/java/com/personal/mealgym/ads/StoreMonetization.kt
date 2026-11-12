package com.personal.mealgym.ads

import android.app.Activity
import android.content.Context
import android.os.Build
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.android.billingclient.api.AcknowledgePurchaseParams
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClient.BillingResponseCode
import com.android.billingclient.api.BillingClient.ProductType
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.PendingPurchasesParams
import com.android.billingclient.api.ProductDetails
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.PurchasesUpdatedListener
import com.android.billingclient.api.QueryProductDetailsParams
import com.android.billingclient.api.QueryPurchasesParams
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.MobileAds
import com.google.android.ump.ConsentInformation
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform
import com.personal.mealgym.BuildConfig
import com.personal.mealgym.data.SettingsRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Google's consent prompt (UMP) runs before any ad request, as AdMob requires in the EEA, UK
 * and Switzerland; ads start only once consent allows them. Someone who bought Remove ads
 * never sees the prompt or an ad. The purchase is a one-time, non-consumable product.
 */
class StoreMonetization(
    private val context: Context,
    private val scope: CoroutineScope,
    private val settings: SettingsRepository,
) : Monetization, PurchasesUpdatedListener {

    override val available = true

    override val adsRemoved: StateFlow<Boolean> = settings.adsRemoved.stateIn(scope, SharingStarted.Eagerly, false)

    private val _price = MutableStateFlow<String?>(null)
    override val removeAdsPrice: StateFlow<String?> = _price.asStateFlow()

    private val _privacyRequired = MutableStateFlow(false)
    override val privacyOptionsRequired: StateFlow<Boolean> = _privacyRequired.asStateFlow()

    private val _messages = Channel<String>(Channel.BUFFERED)
    override val messages: Flow<String> = _messages.receiveAsFlow()

    /** The ads SDK has started (consent allowed it). */
    private val sdkReady = MutableStateFlow(false)
    private val showAds: StateFlow<Boolean> =
        combine(sdkReady, adsRemoved) { ready, removed -> ready && !removed }.stateIn(scope, SharingStarted.Eagerly, false)

    private val consent: ConsentInformation by lazy { UserMessagingPlatform.getConsentInformation(context) }
    private val consentAsked = AtomicBoolean(false)
    private val sdkStarting = AtomicBoolean(false)

    private val billing: BillingClient by lazy {
        BillingClient.newBuilder(context)
            .setListener(this)
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .enableAutoServiceReconnection()
            .build()
    }
    private var product: ProductDetails? = null

    /** Robolectric tests run the real activity; there's no Play Store or network there. */
    private val offline = Build.FINGERPRINT == "robolectric"

    override fun onActivityCreated(activity: Activity) {
        if (offline) return
        connectBilling()
        // Once per app launch: Google asks apps to check consent on every launch, not every screen rotation.
        if (!consentAsked.compareAndSet(false, true)) return
        scope.launch(Dispatchers.Main) {
            if (settings.adsRemoved.first()) return@launch
            // Consent from an earlier launch lets ads start while the check runs.
            startAdsIfAllowed()
            consent.requestConsentInfoUpdate(
                activity,
                ConsentRequestParameters.Builder().build(),
                {
                    UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) {
                        updatePrivacyStatus()
                        startAdsIfAllowed()
                    }
                },
                {
                    // Offline or a form error: whatever consent is on file still applies.
                    updatePrivacyStatus()
                    startAdsIfAllowed()
                },
            )
        }
    }

    private fun updatePrivacyStatus() {
        _privacyRequired.value =
            consent.privacyOptionsRequirementStatus == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED
    }

    private fun startAdsIfAllowed() {
        if (!consent.canRequestAds() || !sdkStarting.compareAndSet(false, true)) return
        scope.launch(Dispatchers.IO) {
            MobileAds.initialize(context) { sdkReady.value = true }
        }
    }

    override fun showPrivacyOptions(activity: Activity) {
        UserMessagingPlatform.showPrivacyOptionsForm(activity) { error ->
            if (error != null) say("Privacy choices aren't available right now.")
            updatePrivacyStatus()
            startAdsIfAllowed()
        }
    }

    @Composable
    override fun Banner(modifier: Modifier) {
        val show by showAds.collectAsStateWithLifecycle()
        if (!show) return
        BoxWithConstraints(modifier.fillMaxWidth()) {
            val context = LocalContext.current
            val width = maxWidth.value.toInt()
            val size = remember(width) { AdSize.getLargeAnchoredAdaptiveBannerAdSize(context, width) }
            val adView = remember(size) {
                AdView(context).apply {
                    setAdSize(size)
                    adUnitId = BuildConfig.BANNER_AD_UNIT
                    loadAd(AdRequest.Builder().build())
                }
            }
            val lifecycle = LocalLifecycleOwner.current.lifecycle
            DisposableEffect(adView, lifecycle) {
                val observer = LifecycleEventObserver { _, event ->
                    when (event) {
                        Lifecycle.Event.ON_RESUME -> adView.resume()
                        Lifecycle.Event.ON_PAUSE -> adView.pause()
                        else -> Unit
                    }
                }
                lifecycle.addObserver(observer)
                onDispose {
                    lifecycle.removeObserver(observer)
                    adView.destroy()
                }
            }
            // The space is kept the banner's height so the screen doesn't jump when the ad arrives.
            AndroidView(factory = { adView }, modifier = Modifier.fillMaxWidth().height(size.height.dp))
        }
    }

    // ---------- Remove ads ----------

    private fun connectBilling() {
        if (billing.isReady) {
            queryProduct()
            queryPurchases(announce = false)
            return
        }
        billing.startConnection(
            object : BillingClientStateListener {
                override fun onBillingSetupFinished(result: BillingResult) {
                    if (result.responseCode == BillingResponseCode.OK) {
                        queryProduct()
                        queryPurchases(announce = false)
                    }
                }

                // Reconnection is automatic (enableAutoServiceReconnection).
                override fun onBillingServiceDisconnected() = Unit
            },
        )
    }

    private fun queryProduct() {
        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(
                listOf(
                    QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(REMOVE_ADS)
                        .setProductType(ProductType.INAPP)
                        .build(),
                ),
            )
            .build()
        billing.queryProductDetailsAsync(params) { result, details ->
            if (result.responseCode != BillingResponseCode.OK) return@queryProductDetailsAsync
            product = details.productDetailsList.firstOrNull { it.productId == REMOVE_ADS }
            _price.value = product?.oneTimePurchaseOfferDetailsList?.firstOrNull()?.formattedPrice
        }
    }

    /** Google Play's answer is the truth: a refunded purchase turns ads back on. */
    private fun queryPurchases(announce: Boolean) {
        val params = QueryPurchasesParams.newBuilder().setProductType(ProductType.INAPP).build()
        billing.queryPurchasesAsync(params) { result, purchases ->
            if (result.responseCode != BillingResponseCode.OK) {
                if (announce) say("Couldn't reach Google Play. Try again in a moment.")
                return@queryPurchasesAsync
            }
            val owned = handle(purchases)
            if (!owned) setRemoved(false)
            if (announce) say(if (owned) "Purchase restored. Ads are off." else "No Remove ads purchase on this Google account.")
        }
    }

    /** Grants and acknowledges completed purchases. Returns whether Remove ads is owned. */
    private fun handle(purchases: List<Purchase>): Boolean {
        var owned = false
        for (p in purchases.filter { REMOVE_ADS in it.products }) {
            when (p.purchaseState) {
                Purchase.PurchaseState.PURCHASED -> {
                    owned = true
                    // Unacknowledged purchases are refunded after three days.
                    if (!p.isAcknowledged) {
                        billing.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder().setPurchaseToken(p.purchaseToken).build()) { }
                    }
                }
                Purchase.PurchaseState.PENDING -> say("Your payment is pending. Ads turn off once it goes through.")
                else -> Unit
            }
        }
        if (owned) setRemoved(true)
        return owned
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: List<Purchase>?) {
        when (result.responseCode) {
            BillingResponseCode.OK -> if (handle(purchases.orEmpty())) say("Ads are off. Thank you!")
            BillingResponseCode.ITEM_ALREADY_OWNED -> queryPurchases(announce = true)
            BillingResponseCode.USER_CANCELED -> Unit
            else -> say("The purchase didn't go through. Nothing was charged.")
        }
    }

    override fun buyRemoveAds(activity: Activity) {
        val details = product
        if (offline || details == null) {
            say("Google Play isn't available right now. Try again in a moment.")
            if (!offline) connectBilling()
            return
        }
        val offer = details.oneTimePurchaseOfferDetailsList?.firstOrNull()
        val productParams = BillingFlowParams.ProductDetailsParams.newBuilder()
            .setProductDetails(details)
            .apply { offer?.offerToken?.let { setOfferToken(it) } }
            .build()
        billing.launchBillingFlow(activity, BillingFlowParams.newBuilder().setProductDetailsParamsList(listOf(productParams)).build())
    }

    override fun restorePurchase() {
        if (offline) return
        if (billing.isReady) queryPurchases(announce = true) else {
            say("Checking with Google Play…")
            connectBilling()
        }
    }

    private fun setRemoved(removed: Boolean) {
        scope.launch { settings.setAdsRemoved(removed) }
    }

    private fun say(text: String) {
        _messages.trySend(text)
    }

    companion object {
        /** The one-time product to create in Play Console, under Monetize > Products > In-app products. */
        const val REMOVE_ADS = "remove_ads"
    }
}
