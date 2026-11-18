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
    )

    interface Listener {
        /** The words heard so far in the sentence being spoken; replaces the previous partial. */
        fun onPartial(text: String)

        /** A finished stretch of speech. */
        fun onFinal(text: String)

        /** How loud the room is, 0 to 1, for the level meter. */
        fun onLevel(level: Float)

        /** Whether recognition is running normally, or what it is waiting for. Null clears the note. */
        fun onNotice(notice: String?)

        /** Recognition can't continue. Listening has stopped. */
        fun onFatal(message: String)
    }
}
