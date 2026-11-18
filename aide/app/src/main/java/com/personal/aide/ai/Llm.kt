package com.personal.aide.ai

import kotlinx.serialization.json.JsonObject

/** The Claude models the app offers. Ids are sent to the API exactly as written. */
enum class AideModel(val id: String, val label: String, val blurb: String, val supportsFallbacks: Boolean) {
    OPUS("claude-opus-5-5", "Claude Opus 5.5", "Best notes and judgement. The default.", true),
    SONNET("claude-sonnet-5-5", "Claude Sonnet 5.5", "Faster, about half the cost.", true),
    HAIKU("claude-haiku-5-5", "Claude Haiku 5.5", "Fastest and cheapest; lighter summaries.", false),
    ;

    companion object {
        fun of(id: String): AideModel = entries.firstOrNull { it.id == id } ?: OPUS
    }
}

enum class Effort { LOW, MEDIUM, HIGH }

/** A block of the system prompt. [cache] marks the end of a prefix worth caching between turns. */
data class SystemPart(val text: String, val cache: Boolean = false)

data class LlmMessage(val role: Role, val text: String) {
    enum class Role { USER, ASSISTANT }
}

data class LlmRequest(
    /** What this call is for; recorded with its token use. */
    val feature: String,
    val system: List<SystemPart>,
    val messages: List<LlmMessage>,
    /** A JSON schema the reply must match, or null for prose. */
    val schema: JsonObject? = null,
    val maxTokens: Long = 16_000,
    val effort: Effort = Effort.MEDIUM,
)

data class LlmUsage(
    val inputTokens: Long = 0,
    val outputTokens: Long = 0,
    val cacheReadTokens: Long = 0,
    val cacheWriteTokens: Long = 0,
)

data class LlmResponse(
    val text: String,
    /** The model that answered; differs from the one asked when a fallback served the request. */
    val model: String,
    val usage: LlmUsage,
)

/** Everything that can go wrong talking to Claude, sorted by what the user can do about it. */
class LlmException(val kind: Kind, message: String, cause: Throwable? = null) : Exception(message, cause) {
    enum class Kind {
        /** No key saved yet. */
        NO_KEY,
        /** The key was rejected. */
        BAD_KEY,
        /** The account can't pay for the request, or has hit its spend limit. */
        BILLING,
        /** The key works but may not use this model. */
        MODEL_UNAVAILABLE,
        RATE_LIMITED,
        /** Claude is briefly overloaded or down. */
        OVERLOADED,
        OFFLINE,
        /** Claude declined the request. */
        REFUSED,
        /** The reply was cut off before it finished. */
        TRUNCATED,
        /** The reply wasn't in the shape asked for. */
        BAD_REPLY,
        OTHER,
    }

    /** Worth trying again without the user changing anything. */
    val retryable: Boolean get() = kind == Kind.RATE_LIMITED || kind == Kind.OVERLOADED || kind == Kind.OFFLINE
}

sealed interface KeyCheck {
    data object Valid : KeyCheck
    data class Invalid(val reason: String) : KeyCheck
}

interface Llm {
    /**
     * Sends one request and returns the whole reply. [onText] is called with each piece of prose
     * as it streams in, on a background thread.
     */
    suspend fun complete(request: LlmRequest, onText: ((String) -> Unit)? = null): LlmResponse

    /** Whether [apiKey] is accepted and may use [model], without spending any tokens. */
    suspend fun checkKey(apiKey: String, model: AideModel): KeyCheck
}
