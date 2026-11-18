package com.personal.aide

import android.os.Bundle
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    companion object {
        const val ACTION_OPEN_RECORDING = "com.personal.aide.action.OPEN_RECORDING"
        const val ACTION_OPEN_MEETING = "com.personal.aide.action.OPEN_MEETING"
        const val EXTRA_MEETING_ID = "meeting_id"
    }
}
