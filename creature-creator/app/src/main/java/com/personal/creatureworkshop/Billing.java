package com.personal.creatureworkshop;

import android.app.Activity;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Google Play purchases. The product ids must match the in-app products created in the Play Console
 * (and web/src/items.js PRODUCTS). "patron" is bought once and kept; the others can be bought again.
 * The page is told what is for sale (ccProducts) and what was bought (ccPurchased); it does the granting.
 */
final class Billing implements PurchasesUpdatedListener {
    private static final String[] IDS = {"patron", "points_small", "points_big", "revives_3"};
    private static final String KEPT = "patron";

    interface Page { void call(String js); }

    private final Activity activity;
    private final Page page;
    private final BillingClient client;
    private final Map<String, ProductDetails> details = new HashMap<>();

    Billing(Activity activity, Page page) {
        this.activity = activity;
        this.page = page;
        client = BillingClient.newBuilder(activity).setListener(this)
                .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build()).build();
        connect();
    }

    private void connect() {
        client.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult result) {
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) return;
                loadProducts();
                restore();
            }

            @Override
            public void onBillingServiceDisconnected() { }
        });
    }

    private void loadProducts() {
        List<QueryProductDetailsParams.Product> list = new ArrayList<>();
        for (String id : IDS) {
            list.add(QueryProductDetailsParams.Product.newBuilder().setProductId(id).setProductType(BillingClient.ProductType.INAPP).build());
        }
        client.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(list).build(), (result, found) -> {
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) return;
            try {
                JSONArray out = new JSONArray();
                for (ProductDetails d : found.getProductDetailsList()) {
                    ProductDetails.OneTimePurchaseOfferDetails offer = d.getOneTimePurchaseOfferDetails();
                    if (offer == null) continue;
                    details.put(d.getProductId(), d);
                    out.put(new JSONObject().put("id", d.getProductId()).put("price", offer.getFormattedPrice()));
                }
                page.call("window.ccProducts && window.ccProducts(" + out + ")");
            } catch (Exception ignored) {
                // Leave the shop showing "Soon".
            }
        });
    }

    /** Anything bought earlier but not yet handed over (a new phone, an interrupted purchase). */
    void restore() {
        if (!client.isReady()) return;
        client.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
                (result, purchases) -> { if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) handle(purchases); });
    }

    void buy(String id) {
        ProductDetails d = details.get(id);
        if (d == null || !client.isReady()) return;
        BillingFlowParams.ProductDetailsParams p = BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(d).build();
        client.launchBillingFlow(activity, BillingFlowParams.newBuilder().setProductDetailsParamsList(Collections.singletonList(p)).build());
    }

    @Override
    public void onPurchasesUpdated(BillingResult result, List<Purchase> purchases) {
        if (result.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) handle(purchases);
    }

    private void handle(List<Purchase> purchases) {
        for (Purchase p : purchases) {
            if (p.getPurchaseState() != Purchase.PurchaseState.PURCHASED) continue;      // pending payments are granted when they clear
            String token = p.getPurchaseToken();
            for (String id : p.getProducts()) {
                if (KEPT.equals(id)) {
                    if (!p.isAcknowledged()) {
                        client.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder().setPurchaseToken(token).build(), r -> { });
                    }
                    granted(id, token);
                } else {
                    // Used up so it can be bought again; the page grants it once the store confirms.
                    client.consumeAsync(ConsumeParams.newBuilder().setPurchaseToken(token).build(), (r, t) -> {
                        if (r.getResponseCode() == BillingClient.BillingResponseCode.OK) granted(id, token);
                    });
                }
            }
        }
    }

    private void granted(String id, String token) {
        page.call("window.ccPurchased && window.ccPurchased(" + JSONObject.quote(id) + "," + JSONObject.quote(token) + ")");
    }
}
