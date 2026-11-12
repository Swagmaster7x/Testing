package com.personal.creatureworkshop;

import android.content.Context;

/**
 * Analytics and crash reporting, switched off. This version is compiled when there is no
 * app/google-services.json. Add that file (from your Firebase project) and the build uses
 * src/firebase/java/.../Telemetry.java instead, with no other change.
 */
final class Telemetry {
    private Telemetry() { }

    static void start(Context context) { }

    static void event(Context context, String name, String jsonParams) { }
}
