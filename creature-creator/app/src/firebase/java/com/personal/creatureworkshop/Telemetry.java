package com.personal.creatureworkshop;

import android.content.Context;
import android.os.Bundle;

import com.google.firebase.analytics.FirebaseAnalytics;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import org.json.JSONObject;

import java.util.Iterator;

/** Analytics (Firebase Analytics) and crash reports (Crashlytics). Compiled only when app/google-services.json exists. */
final class Telemetry {
    private Telemetry() { }

    static void start(Context context) {
        FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(true);
    }

    /** name: a short event name such as "run_start". jsonParams: a flat JSON object of details. */
    static void event(Context context, String name, String jsonParams) {
        try {
            JSONObject o = new JSONObject(jsonParams == null ? "{}" : jsonParams);
            if ("js_error".equals(name)) {
                // An error inside the game page: record it as a non-fatal crash so it shows up with the rest.
                FirebaseCrashlytics.getInstance().recordException(new RuntimeException("JS: " + o.optString("msg") + " @ " + o.optString("at")));
                return;
            }
            Bundle b = new Bundle();
            for (Iterator<String> it = o.keys(); it.hasNext(); ) {
                String k = it.next();
                Object val = o.get(k);
                if (val instanceof Number) b.putDouble(k, ((Number) val).doubleValue());
                else b.putString(k, String.valueOf(val));
            }
            FirebaseAnalytics.getInstance(context).logEvent(name, b);
        } catch (Exception ignored) {
            // Analytics must never break the game.
        }
    }
}
