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

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

/**
 * A full-screen landscape shell around the bundled editor (assets/www).
 * The editor is a WebGL page; this class only hosts it, hides the system bars,
 * routes the back button, and saves photos to the gallery.
 */
public class MainActivity extends Activity {
    private WebView web;

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
        if (savedInstanceState == null) web.loadUrl("file:///android_asset/www/index.html");
        else web.restoreState(savedInstanceState);
        hideSystemBars();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
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
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
    }

    @Override
    protected void onDestroy() {
        web.destroy();
        super.onDestroy();
    }

    private void toast(String msg) {
        runOnUiThread(() -> web.evaluateJavascript("window.ccToast && window.ccToast(" + org.json.JSONObject.quote(msg) + ")", null));
    }

    private class Bridge {
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
