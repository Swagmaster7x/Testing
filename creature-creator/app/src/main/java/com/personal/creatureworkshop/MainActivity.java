package com.personal.creatureworkshop;

import android.app.Activity;
import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

/**
 * A full-screen landscape shell around the bundled editor (assets/www).
 * The editor is a WebGL page; this class only hosts it, hides the system bars,
 * routes the back button, saves photos to the gallery, and shows rewarded ads (AdMob).
 */
public class MainActivity extends Activity {
    private WebView web;
    private RewardedAd rewarded;          // the next ad, loaded ahead of time
    private boolean adLoading, adsStarted, earned;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        web = new WebView(this);
        web.setBackgroundColor(0xFF0F1A1C);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setLongClickable(false);
        web.setOnLongClickListener(v -> true);
        web.setHapticFeedbackEnabled(false);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // saved creatures live in localStorage
        s.setAllowFileAccess(true);
        s.setSupportZoom(false);
        s.setTextZoom(100);
        web.setWebChromeClient(new WebChromeClient());   // lets confirm() dialogs show
        web.addJavascriptInterface(new Bridge(), "Android");
        setContentView(web);
        // The page keeps its own state (saved creatures, runs, points), so a fresh load is always right.
        web.loadUrl("file:///android_asset/www/index.html");
        hideSystemBars();
        askConsentThenStartAds();
    }

    // ------------------------------------------------------------------ ads

    /** Google requires asking for consent (where the law needs it) before any ad is requested. */
    private void askConsentThenStartAds() {
        ConsentInformation info = UserMessagingPlatform.getConsentInformation(this);
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();
        info.requestConsentInfoUpdate(this, params,
                () -> UserMessagingPlatform.loadAndShowConsentFormIfRequired(this, formError -> {
                    if (info.canRequestAds()) startAds();
                }),
                requestError -> { if (info.canRequestAds()) startAds(); });
        if (info.canRequestAds()) startAds();      // consent already known from an earlier launch
    }

    private void startAds() {
        if (adsStarted) return;
        adsStarted = true;
        new Thread(() -> MobileAds.initialize(this, status -> runOnUiThread(this::loadRewarded))).start();
    }

    private void loadRewarded() {
        if (!adsStarted || adLoading || rewarded != null) return;
        adLoading = true;
        RewardedAd.load(this, getString(R.string.admob_rewarded_id), new AdRequest.Builder().build(), new RewardedAdLoadCallback() {
            @Override
            public void onAdLoaded(RewardedAd ad) { adLoading = false; rewarded = ad; }

            @Override
            public void onAdFailedToLoad(LoadAdError error) { adLoading = false; rewarded = null; }
        });
    }

    /** Tell the page how the ad went: window.ccAdDone(earned, reason). */
    private void adDone(boolean ok, String why) {
        runOnUiThread(() -> { if (web != null) web.evaluateJavascript("window.ccAdDone && window.ccAdDone(" + ok + "," + org.json.JSONObject.quote(why) + ")", null); });
    }

    private void showRewarded() {
        if (rewarded == null) {
            loadRewarded();
            adDone(false, "No ad is ready yet. Check your connection and try again in a moment.");
            return;
        }
        RewardedAd ad = rewarded;
        rewarded = null;
        earned = false;
        ad.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override
            public void onAdDismissedFullScreenContent() {
                hideSystemBars();
                // The reward callback can land a moment after the ad closes, so wait briefly before reporting.
                new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
                    adDone(earned, earned ? "" : "The ad was closed before the reward.");
                    loadRewarded();
                }, 400);
            }

            @Override
            public void onAdFailedToShowFullScreenContent(AdError error) {
                adDone(false, "The ad could not be shown.");
                loadRewarded();
            }
        });
        ad.show(this, reward -> earned = true);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    @SuppressWarnings("deprecation")
    private void hideSystemBars() {
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController c = getWindow().getInsetsController();
            if (c != null) {
                c.hide(WindowInsets.Type.systemBars());
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        // The page decides: close a panel, go back to the start screen, or (false) leave the app.
        web.evaluateJavascript("window.ccBack ? window.ccBack() : false", handled -> {
            if (!"true".equals(handled)) finish();
        });
    }

    @Override
    protected void onPause() {
        super.onPause();
        web.onPause();
        web.pauseTimers();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.resumeTimers();
        web.onResume();
    }

    @Override
    protected void onDestroy() {
        WebView w = web;
        web = null;
        if (w.getParent() instanceof android.view.ViewGroup) ((android.view.ViewGroup) w.getParent()).removeView(w);
        w.destroy();
        super.onDestroy();
    }

    private void toast(String msg) {
        runOnUiThread(() -> { if (web != null) web.evaluateJavascript("window.ccToast && window.ccToast(" + org.json.JSONObject.quote(msg) + ")", null); });
    }

    /** Google Play's own rating card. Play decides whether it really shows (it is rate-limited), and it never shows outside a Play install. */
    private void requestReview() {
        com.google.android.play.core.review.ReviewManager manager = com.google.android.play.core.review.ReviewManagerFactory.create(this);
        manager.requestReviewFlow().addOnCompleteListener(task -> {
            if (task.isSuccessful() && !isFinishing()) manager.launchReviewFlow(this, task.getResult());
        });
    }

    private class Bridge {
        /** Called by the page after a happy moment (a title won, a long Endless run). */
        @JavascriptInterface
        public void requestReview() {
            runOnUiThread(MainActivity.this::requestReview);
        }

        /** Called by the page when the player chooses to watch an ad for a reward. */
        @JavascriptInterface
        public void showRewarded() {
            runOnUiThread(MainActivity.this::showRewarded);
        }

        /** Called by the Photo button with a base64 PNG. */
        @JavascriptInterface
        public void savePng(String base64, String name) {
            new Thread(() -> {
                try {
                    byte[] png = Base64.decode(base64, Base64.DEFAULT);
                    if (Build.VERSION.SDK_INT >= 29) {
                        ContentValues v = new ContentValues();
                        v.put(MediaStore.Images.Media.DISPLAY_NAME, name);
                        v.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
                        v.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/CreatureWorkshop");
                        Uri uri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, v);
                        if (uri == null) throw new IllegalStateException("no gallery");
                        try (OutputStream out = getContentResolver().openOutputStream(uri)) {
                            out.write(png);
                        }
                        toast("Photo saved to Pictures/CreatureWorkshop");
                    } else {
                        // Older Android: the app's own pictures folder needs no permission.
                        File dir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
                        File f = new File(dir, name);
                        try (OutputStream out = new FileOutputStream(f)) {
                            out.write(png);
                        }
                        toast("Photo saved to " + f.getAbsolutePath());
                    }
                } catch (Exception e) {
                    toast("Could not save the photo");
                }
            }).start();
        }
    }
}
