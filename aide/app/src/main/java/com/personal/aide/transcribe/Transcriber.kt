package com.personal.aide.transcribe

/** Turns what the microphone hears into text, continuously, until told to stop. */
interface Transcriber {
    /** Begins listening. Must be called on the main thread; [listener] is called there too. */
    fun start(config: Config, listener: Listener)

    /** Stops listening and releases the microphone. Any words still pending are delivered first. */
    fun stop()

    data class Config(
        /** A language tag such as "en-US"; blank uses the phone's language. */
        val language: String = "",
        val preferOnDevice: Boolean = true,
        val muteChimes: Boolean = false,
        /** How hard to work at hearing quiet voices. */
        val sensitivity: Sensitivity = Sensitivity.PHONE,
        /** Names and terms likely to come up, which the recognizer is asked to listen out for. */
        val hints: List<String> = emptyList(),
    )

    /**
     * Who handles the microphone. With [PHONE] the recognizer opens it and hears what it hears.
     * With the others the app captures the audio itself, turns quiet voices up by as much as
     * [maxGain], and passes the result to the recognizer (Android 13 and later).
     */
    enum class Sensitivity(val maxGain: Float) {
        PHONE(1f),
        BOOSTED(16f),
        MAXIMUM(40f),
    }

    interface Listener {
        /** The words heard so far in the sentence being spoken; replaces the previous partial. */
        fun onPartial(text: String)

        /** A finished stretch of speech. */
        fun onFinal(text: String)

        /** How loud the room is, 0 to 1, for the level meter. */
        fun onLevel(level: Float)

        /** Whether recognition is running normally, or what it is waiting for. Null clears the note. */
        fun onNotice(notice: String?)

        /**
         * The recognizer on this phone would not take audio the app had boosted, so it has gone
         * back to handling the microphone itself. Called at most once per [start].
         */
        fun onBoostUnsupported() = Unit

        /** Recognition can't continue. Listening has stopped. */
        fun onFatal(message: String)
    }
}
