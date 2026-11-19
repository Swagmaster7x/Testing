package com.personal.aide.ai

import com.anthropic.client.AnthropicClient
import com.anthropic.client.okhttp.AnthropicOkHttpClient
import com.anthropic.core.JsonValue
import com.anthropic.errors.AnthropicIoException
import com.anthropic.errors.AnthropicServiceException
import com.anthropic.errors.BadRequestException
import com.anthropic.errors.NotFoundException
import com.anthropic.errors.OverloadedException
import com.anthropic.errors.PaymentRequiredException
import com.anthropic.errors.PermissionDeniedException
import com.anthropic.errors.RateLimitException
import com.anthropic.errors.SseException
import com.anthropic.errors.UnauthorizedException
import com.anthropic.helpers.BetaMessageAccumulator
import com.anthropic.models.beta.messages.BetaBase64ImageSource
import com.anthropic.models.beta.messages.BetaCacheControlEphemeral
import com.anthropic.models.beta.messages.BetaContentBlockParam
import com.anthropic.models.beta.messages.BetaFallbacksParam
import com.anthropic.models.beta.messages.BetaImageBlockParam
import com.anthropic.models.beta.messages.BetaJsonOutputFormat
import com.anthropic.models.beta.messages.BetaMessage
import com.anthropic.models.beta.messages.BetaOutputConfig
import com.anthropic.models.beta.messages.BetaStopReason
import com.anthropic.models.beta.messages.BetaTextBlockParam
import com.anthropic.models.beta.messages.MessageCreateParams
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.ensureActive
import kotlinx.coroutines.runInterruptible
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.doubleOrNull
import kotlinx.serialization.json.longOrNull
import java.io.InterruptedIOException
import java.net.ConnectException
import java.net.SocketTimeoutException
import java.net.UnknownHostException
import javax.net.ssl.SSLException
import java.time.Duration

/**
 * Claude through the official Anthropic SDK. Every request streams, so a long summary can't run
 * into an HTTP timeout, and asks the server to reroute a declined request to another model
 * (server-side fallbacks) where the chosen model supports that.
 *
 * [apiKey] and [model] are read on every call so a change in Settings applies at once.
 * [baseUrl] exists for tests.
 */
class AnthropicLlm(
    private val apiKey: suspend () -> String?,
    private val model: suspend () -> AideModel,
    private val baseUrl: String? = null,
    private val maxRetries: Int = 2,
) : Llm {
    private var cached: Pair<String, AnthropicClient>? = null

    @Synchronized
    private fun clientFor(key: String): AnthropicClient {
        cached?.let { (cachedKey, client) -> if (cachedKey == key) return client else client.close() }
        return newClient(key).also { cached = key to it }
    }

    private fun newClient(key: String): AnthropicClient {
        val builder = AnthropicOkHttpClient.builder()
            .apiKey(key)
            .maxRetries(maxRetries)
            .timeout(Duration.ofMinutes(10))
        baseUrl?.let { builder.baseUrl(it) }
        return builder.build()
    }

    override suspend fun complete(request: LlmRequest, onText: ((String) -> Unit)?): LlmResponse {
        val key = apiKey()?.trim().orEmpty()
        if (key.isEmpty()) throw LlmException(LlmException.Kind.NO_KEY, "Add your Claude API key in Settings first.")
        val chosen = model()
        val message = try {
            val params = buildParams(request, chosen)
            runInterruptible(Dispatchers.IO) { stream(clientFor(key), params, onText) }
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            // A cancelled call surfaces as an interrupted read; report the cancellation, not an error.
            currentCoroutineContext().ensureActive()
            throw translate(e, chosen)
        }

        val stop = message.stopReason().orElse(null)
        if (stop == BetaStopReason.REFUSAL) {
            throw LlmException(
                LlmException.Kind.REFUSED,
                "Claude declined this request. Rewording it, or picking a different model in Settings, may help.",
            )
        }
        val text = message.content().mapNotNull { it.text().orElse(null)?.text() }.joinToString("")
        if (stop == BetaStopReason.MAX_TOKENS) {
            throw LlmException(LlmException.Kind.TRUNCATED, "The reply was cut off before it finished. Try again.")
        }
        if (text.isBlank()) {
            throw LlmException(LlmException.Kind.BAD_REPLY, "Claude sent back an empty reply. Try again.")
        }
        val usage = message.usage()
        return LlmResponse(
            text = text,
            model = message.model().asString(),
            usage = LlmUsage(
                inputTokens = usage.inputTokens(),
                outputTokens = usage.outputTokens(),
                cacheReadTokens = usage.cacheReadInputTokens().orElse(0L),
                cacheWriteTokens = usage.cacheCreationInputTokens().orElse(0L),
            ),
        )
    }

    private fun stream(client: AnthropicClient, params: MessageCreateParams, onText: ((String) -> Unit)?): BetaMessage {
        val accumulator = BetaMessageAccumulator.create()
        client.beta().messages().createStreaming(params).use { response ->
            response.stream().forEach { event ->
                accumulator.accumulate(event)
                if (onText != null) {
                    event.contentBlockDelta().ifPresent { delta ->
                        delta.delta().text().ifPresent { onText(it.text()) }
                    }
                }
            }
        }
        return try {
            accumulator.message()
        } catch (e: IllegalStateException) {
            // The connection closed cleanly but the reply never finished.
            throw LlmException(LlmException.Kind.OFFLINE, "The connection to Claude dropped before the reply finished. Try again.", e)
        }
    }

    internal fun buildParams(request: LlmRequest, chosen: AideModel): MessageCreateParams {
        val builder = MessageCreateParams.builder()
            .model(chosen.id)
            .maxTokens(request.maxTokens)
            .systemOfBetaTextBlockParams(
                request.system.filter { it.text.isNotBlank() }.map { part ->
                    val block = BetaTextBlockParam.builder().text(part.text)
                    if (part.cache) block.cacheControl(BetaCacheControlEphemeral.builder().build())
                    block.build()
                },
            )
        for (message in request.messages) {
            when (message.role) {
                LlmMessage.Role.USER ->
                    if (message.images.isEmpty()) {
                        builder.addUserMessage(message.text)
                    } else {
                        // Pictures first, then what to do with them.
                        val blocks = message.images.map { image ->
                            BetaContentBlockParam.ofImage(
                                BetaImageBlockParam.builder()
                                    .source(
                                        BetaBase64ImageSource.builder()
                                            .mediaType(BetaBase64ImageSource.MediaType.of(image.mediaType))
                                            .data(image.base64)
                                            .build(),
                                    )
                                    .build(),
                            )
                        } + BetaContentBlockParam.ofText(BetaTextBlockParam.builder().text(message.text).build())
                        builder.addUserMessageOfContentBlockParams(blocks)
                    }
                LlmMessage.Role.ASSISTANT -> builder.addAssistantMessage(message.text)
            }
        }

        // Thinking is always on for these models; effort is the one dial for depth and cost.
        val output = BetaOutputConfig.builder().effort(
            when (request.effort) {
                Effort.LOW -> BetaOutputConfig.Effort.LOW
                Effort.MEDIUM -> BetaOutputConfig.Effort.MEDIUM
                Effort.HIGH -> BetaOutputConfig.Effort.HIGH
            },
        )
        request.schema?.let { schema ->
            output.format(
                BetaJsonOutputFormat.builder()
                    .schema(
                        BetaJsonOutputFormat.Schema.builder()
                            .putAllAdditionalProperties(schema.mapValues { JsonValue.from(it.value.toPlain()) })
                            .build(),
                    )
                    .build(),
            )
        }
        builder.outputConfig(output.build())

        // If a safety classifier declines the request (a security or biotech meeting can trip one by
        // mistake), let the API hand it to another model instead of failing the summary.
        if (chosen.supportsFallbacks) {
            builder.addBeta(FALLBACK_BETA)
            builder.fallbacks(BetaFallbacksParam.ofDefault())
        }
        return builder.build()
    }

    override suspend fun checkKey(apiKey: String, model: AideModel): KeyCheck {
        val key = apiKey.trim()
        if (key.isEmpty()) return KeyCheck.Invalid("Paste your API key first.")
        return try {
            runInterruptible(Dispatchers.IO) {
                val client = newClient(key)
                try {
                    client.models().retrieve(model.id)
                } finally {
                    client.close()
                }
            }
            KeyCheck.Valid
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            currentCoroutineContext().ensureActive()
            KeyCheck.Invalid(translate(e, model).message ?: "That key didn't work.")
        }
    }

    private fun translate(error: Exception, chosen: AideModel): LlmException {
        val (kind, message) = when (error) {
            is LlmException -> return error
            // An error sent after the stream opened arrives with HTTP 200; its type says what it is.
            is SseException -> when (error.type().map { it.toString() }.orElse("")) {
                "overloaded_error", "api_error", "timeout_error" ->
                    LlmException.Kind.OVERLOADED to "Claude is busy right now. Try again in a moment."
                "rate_limit_error" ->
                    LlmException.Kind.RATE_LIMITED to "Claude is rate-limiting this key. Give it a minute and try again."
                "authentication_error" ->
                    LlmException.Kind.BAD_KEY to "Claude rejected the API key. Check it in Settings."
                "billing_error" ->
                    LlmException.Kind.BILLING to "Your Claude account needs credit. Add some in the Claude Console, then try again."
                "permission_error", "not_found_error" ->
                    LlmException.Kind.MODEL_UNAVAILABLE to "Your account can't use ${chosen.label}. Pick another model in Settings."
                else ->
                    LlmException.Kind.OTHER to "Claude stopped with an error: ${error.apiMessage().orElse("unknown")}"
            }
            is UnauthorizedException ->
                LlmException.Kind.BAD_KEY to "Claude rejected the API key. Check it in Settings."
            is PaymentRequiredException ->
                LlmException.Kind.BILLING to "Your Claude account needs credit. Add some in the Claude Console, then try again."
            is PermissionDeniedException ->
                LlmException.Kind.MODEL_UNAVAILABLE to "This API key isn't allowed to do that. Check the key's workspace in the Claude Console."
            is NotFoundException ->
                LlmException.Kind.MODEL_UNAVAILABLE to "Your account can't use ${chosen.label}. Pick another model in Settings."
            is RateLimitException ->
                if (error.errorCode().orElse("") == "enforced_spend_limit_reached") {
                    LlmException.Kind.BILLING to "Your Claude account has reached its monthly spend limit."
                } else {
                    LlmException.Kind.RATE_LIMITED to "Claude is rate-limiting this key. Give it a minute and try again."
                }
            is OverloadedException ->
                LlmException.Kind.OVERLOADED to "Claude is busy right now. Try again in a moment."
            is BadRequestException -> {
                val detail = error.apiMessage().orElse("")
                if (detail.contains("credit balance", ignoreCase = true)) {
                    LlmException.Kind.BILLING to "Your Claude account is out of credit. Add some in the Claude Console."
                } else {
                    LlmException.Kind.OTHER to "Claude couldn't process that request: ${detail.ifBlank { "bad request" }}"
                }
            }
            is AnthropicServiceException ->
                if (error.statusCode() >= 500) {
                    LlmException.Kind.OVERLOADED to "Claude had a problem on its side. Try again in a moment."
                } else {
                    LlmException.Kind.OTHER to "Claude returned an error (${error.statusCode()}): ${error.apiMessage().orElse("unknown")}"
                }
            is AnthropicIoException, is java.io.IOException -> LlmException.Kind.OFFLINE to connectionProblem(error)
            else -> LlmException.Kind.OTHER to "Something went wrong talking to Claude: ${error.message ?: error.javaClass.simpleName}"
        }
        return LlmException(kind, message, error)
    }

    companion object {
        const val FALLBACK_BETA = "server-side-fallback-2026-07-01"

        /**
         * Why the connection failed, in words the user can act on. "Check your internet" is the wrong
         * advice when the internet is fine and it is this network that won't let Claude through, or
         * the app was put aside while it was working. The technical name follows in brackets, for
         * when the user passes the message on to someone who can read it.
         */
        internal fun connectionProblem(error: Throwable): String {
            val causes = generateSequence(error) { it.cause.takeIf { cause -> cause !== it } }.take(8).toList()
            val root = causes.firstOrNull { it is UnknownHostException || it is SSLException || it is SocketTimeoutException || it is ConnectException }
                ?: causes.last()
            val what = when (root) {
                is UnknownHostException ->
                    "Couldn't find Claude's servers. Either the phone is offline, or this network (a work or guest Wi-Fi, a VPN, an ad blocker) doesn't let apps reach them. Try mobile data."
                is SSLException ->
                    "This network is getting in the way of the secure connection to Claude. Work and guest Wi-Fi sometimes do. Try mobile data."
                is SocketTimeoutException ->
                    "The connection to Claude timed out. Check your internet and try again."
                is ConnectException ->
                    "Couldn't reach Claude. Check your internet connection."
                else ->
                    if (causes.any { it is InterruptedIOException }) {
                        "The connection to Claude timed out. Check your internet and try again."
                    } else {
                        "The connection to Claude was cut off part-way. Try again."
                    }
            }
            return "$what (${root.javaClass.simpleName})"
        }
    }
}

/** kotlinx JSON as the plain maps, lists and scalars the SDK's [JsonValue.from] takes. */
internal fun JsonElement.toPlain(): Any? = when (this) {
    is JsonNull -> null
    is JsonObject -> mapValues { it.value.toPlain() }
    is JsonArray -> map { it.toPlain() }
    is JsonPrimitive -> when {
        isString -> content
        booleanOrNull != null -> booleanOrNull
        longOrNull != null -> longOrNull
        else -> doubleOrNull
    }
}
