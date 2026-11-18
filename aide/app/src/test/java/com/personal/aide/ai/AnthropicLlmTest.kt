package com.personal.aide.ai

import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineStart
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.boolean
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.long
import kotlinx.serialization.json.put
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import okhttp3.mockwebserver.SocketPolicy
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Before
import org.junit.Test
import java.util.Collections
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

/**
 * [AnthropicLlm] against a local HTTP server standing in for the Claude API: what the SDK really
 * puts on the wire for a request, and what each kind of reply turns into.
 */
class AnthropicLlmTest {
    private lateinit var server: MockWebServer
    private var key: String? = "sk-ant-test-key"
    private var model = AideModel.OPUS

    @Before
    fun setUp() {
        server = MockWebServer()
        server.start()
    }

    @After
    fun tearDown() {
        runCatching { server.shutdown() }
    }

    private fun llm(maxRetries: Int = 0) = AnthropicLlm(
        apiKey = { key },
        model = { model },
        baseUrl = server.url("/").toString().trimEnd('/'),
        maxRetries = maxRetries,
    )

    private fun request(
        system: List<SystemPart> = listOf(SystemPart("You are Aide.")),
        messages: List<LlmMessage> = listOf(LlmMessage(LlmMessage.Role.USER, "Hello")),
        schema: JsonObject? = null,
        maxTokens: Long = 16_000,
        effort: Effort = Effort.MEDIUM,
    ) = LlmRequest(feature = "test", system = system, messages = messages, schema = schema, maxTokens = maxTokens, effort = effort)

    // -------------------------------------------------------------------------------------------
    // Canned replies

    private fun event(name: String, data: String) = "event: $name\ndata: $data\n\n"

    private fun messageStart(
        model: String = "claude-opus-5-5",
        usage: String = """{"input_tokens":25,"output_tokens":1}""",
    ) = event(
        "message_start",
        """{"type":"message_start","message":{"id":"msg_01","type":"message","role":"assistant","model":"$model","content":[],"stop_reason":null,"stop_sequence":null,"usage":$usage}}""",
    )

    private fun textBlock(index: Int, vararg pieces: String) = buildString {
        append(event("content_block_start", """{"type":"content_block_start","index":$index,"content_block":{"type":"text","text":""}}"""))
        for (piece in pieces) {
            val delta = buildJsonObject {
                put("type", "content_block_delta")
                put("index", index)
                put("delta", buildJsonObject { put("type", "text_delta"); put("text", piece) })
            }
            append(event("content_block_delta", delta.toString()))
        }
        append(event("content_block_stop", """{"type":"content_block_stop","index":$index}"""))
    }

    private fun thinkingBlock(index: Int, thinking: String) = buildString {
        append(event("content_block_start", """{"type":"content_block_start","index":$index,"content_block":{"type":"thinking","thinking":"","signature":""}}"""))
        append(event("content_block_delta", """{"type":"content_block_delta","index":$index,"delta":{"type":"thinking_delta","thinking":"$thinking"}}"""))
        append(event("content_block_delta", """{"type":"content_block_delta","index":$index,"delta":{"type":"signature_delta","signature":"c2ln"}}"""))
        append(event("content_block_stop", """{"type":"content_block_stop","index":$index}"""))
    }

    private fun messageEnd(stopReason: String = "end_turn", usage: String = """{"output_tokens":12}""") =
        event("message_delta", """{"type":"message_delta","delta":{"stop_reason":"$stopReason","stop_sequence":null},"usage":$usage}""") +
            event("message_stop", """{"type":"message_stop"}""")

    private fun stream(body: String) = MockResponse()
        .setResponseCode(200)
        .setHeader("content-type", "text/event-stream")
        .setBody(body)

    private fun simpleReply(text: String = "Hello there.") = stream(messageStart() + textBlock(0, text) + messageEnd())

    private fun apiError(status: Int, type: String, message: String, extra: String = "") = MockResponse()
        .setResponseCode(status)
        .setHeader("content-type", "application/json")
        .setBody("""{"type":"error","error":{"type":"$type","message":"$message"$extra},"request_id":"req_01"}""")

    private fun complete(
        llm: AnthropicLlm = llm(),
        request: LlmRequest = request(),
        onText: ((String) -> Unit)? = null,
    ): LlmResponse = runBlocking { llm.complete(request, onText) }

    private fun failure(llm: AnthropicLlm = llm(), request: LlmRequest = request()): LlmException =
        try {
            complete(llm, request)
            throw AssertionError("Expected the call to fail")
        } catch (e: LlmException) {
            e
        }

    private fun RecordedRequest.json(): JsonObject = Json.parseToJsonElement(body.readUtf8()).jsonObject

    /** The SDK decides which header carries the key; what matters is that the right key is the one sent. */
    private fun RecordedRequest.sentKey(): String? =
        getHeader("x-api-key") ?: getHeader("authorization")?.removePrefix("Bearer")?.trim()

    private fun RecordedRequest.betas(): List<String> =
        headers.values("anthropic-beta").flatMap { it.split(',') }.map { it.trim() }.filter { it.isNotEmpty() }

    // -------------------------------------------------------------------------------------------
    // The request

    @Test
    fun `posts to the messages endpoint with the key and a streaming body`() {
        server.enqueue(simpleReply())
        complete(request = request(maxTokens = 32_000))

        val sent = server.takeRequest()
        assertEquals("POST", sent.method)
        assertEquals("/v1/messages", sent.requestUrl!!.encodedPath)
        assertEquals("sk-ant-test-key", sent.sentKey())
        assertNotNull("an API version is always sent", sent.getHeader("anthropic-version"))
        assertTrue(sent.getHeader("content-type").orEmpty().startsWith("application/json"))

        val body = sent.json()
        assertEquals("claude-opus-5-5", body.getValue("model").jsonPrimitive.content)
        assertEquals(true, body.getValue("stream").jsonPrimitive.boolean)
        assertEquals(32_000L, body.getValue("max_tokens").jsonPrimitive.long)
    }

    @Test
    fun `sends nothing these models reject`() {
        server.enqueue(simpleReply())
        complete()

        val body = server.takeRequest().json()
        // Thinking can't be configured off and sampling parameters are refused, so neither is sent.
        for (banned in listOf("thinking", "temperature", "top_p", "top_k", "output_format", "tools", "tool_choice")) {
            assertFalse("$banned must not be sent", body.containsKey(banned))
        }
    }

    @Test
    fun `system prompt goes as text blocks and only marked parts carry cache_control`() {
        server.enqueue(simpleReply())
        complete(
            request = request(
                system = listOf(
                    SystemPart("Identity."),
                    SystemPart("Stable knowledge.", cache = true),
                    SystemPart("Volatile tail."),
                ),
            ),
        )

        val system = server.takeRequest().json().getValue("system").jsonArray.map { it.jsonObject }
        assertEquals(3, system.size)
        assertEquals(listOf("Identity.", "Stable knowledge.", "Volatile tail."), system.map { it.getValue("text").jsonPrimitive.content })
        assertTrue(system.all { it.getValue("type").jsonPrimitive.content == "text" })
        assertFalse(system[0].containsKey("cache_control"))
        assertEquals(buildJsonObject { put("type", "ephemeral") }, system[1].getValue("cache_control"))
        assertFalse(system[2].containsKey("cache_control"))
    }

    @Test
    fun `blank system parts are left out`() {
        server.enqueue(simpleReply())
        complete(request = request(system = listOf(SystemPart("  "), SystemPart("Kept."), SystemPart(""))))

        val system = server.takeRequest().json().getValue("system").jsonArray
        assertEquals(listOf("Kept."), system.map { it.jsonObject.getValue("text").jsonPrimitive.content })
    }

    @Test
    fun `messages keep their order roles and text`() {
        server.enqueue(simpleReply())
        complete(
            request = request(
                messages = listOf(
                    LlmMessage(LlmMessage.Role.USER, "First question"),
                    LlmMessage(LlmMessage.Role.ASSISTANT, "First answer"),
                    LlmMessage(LlmMessage.Role.USER, "Second question"),
                ),
            ),
        )

        val messages = server.takeRequest().json().getValue("messages").jsonArray.map { it.jsonObject }
        assertEquals(listOf("user", "assistant", "user"), messages.map { it.getValue("role").jsonPrimitive.content })
        assertEquals(listOf("First question", "First answer", "Second question"), messages.map { textOf(it.getValue("content")) })
    }

    /** A message's content is either a plain string or a list of text blocks; both mean the same to the API. */
    private fun textOf(content: kotlinx.serialization.json.JsonElement): String = when (content) {
        is JsonPrimitive -> content.content
        is JsonArray -> content.joinToString("") {
            assertEquals("text", it.jsonObject.getValue("type").jsonPrimitive.content)
            it.jsonObject.getValue("text").jsonPrimitive.content
        }
        else -> throw AssertionError("Unexpected message content: $content")
    }

    @Test
    fun `effort is sent inside output_config`() {
        for ((effort, word) in listOf(Effort.LOW to "low", Effort.MEDIUM to "medium", Effort.HIGH to "high")) {
            server.enqueue(simpleReply())
            complete(request = request(effort = effort))
            val body = server.takeRequest().json()
            assertEquals(word, body.getValue("output_config").jsonObject.getValue("effort").jsonPrimitive.content)
            assertFalse("effort belongs in output_config, not at the top level", body.containsKey("effort"))
        }
    }

    @Test
    fun `prose requests ask for no output format`() {
        server.enqueue(simpleReply())
        complete(request = request(schema = null))
        assertFalse(server.takeRequest().json().getValue("output_config").jsonObject.containsKey("format"))
    }

    @Test
    fun `a schema is sent whole as a json_schema output format`() {
        for (schema in listOf(Schemas.meetingAnalysis, Schemas.interviewTurn, Schemas.dayPlan, Schemas.weekPlan, Schemas.weekReview)) {
            server.enqueue(simpleReply("{}"))
            complete(request = request(schema = schema))

            val format = server.takeRequest().json().getValue("output_config").jsonObject.getValue("format").jsonObject
            assertEquals(setOf("type", "schema"), format.keys)
            assertEquals("json_schema", format.getValue("type").jsonPrimitive.content)
            // Exactly the schema: every type, enum, description, required list and boolean survives the trip.
            assertEquals(schema, format.getValue("schema"))
        }
    }

    @Test
    fun `schema values of every JSON kind survive conversion`() {
        val schema = Json.parseToJsonElement(
            """{"type":"object","properties":{"n":{"type":"integer","minimum":0,"maximum":2.5},"s":{"type":"string","enum":["true","1",""]},"z":{"type":["string","null"],"default":null}},"required":["n","s","z"],"additionalProperties":false}""",
        ).jsonObject
        server.enqueue(simpleReply("{}"))
        complete(request = request(schema = schema))

        assertEquals(schema, server.takeRequest().json().getValue("output_config").jsonObject.getValue("format").jsonObject.getValue("schema"))
    }

    @Test
    fun `opus asks for server-side fallbacks`() {
        model = AideModel.OPUS
        server.enqueue(simpleReply())
        complete()

        val sent = server.takeRequest()
        assertTrue("beta header was ${sent.betas()}", "server-side-fallback-2026-07-01" in sent.betas())
        val body = sent.json()
        assertEquals(JsonPrimitive("default"), body.getValue("fallbacks"))
        assertFalse("betas travel in the header, not the body", body.containsKey("betas"))
    }

    @Test
    fun `sonnet asks for server-side fallbacks`() {
        model = AideModel.SONNET
        server.enqueue(simpleReply())
        complete()

        val sent = server.takeRequest()
        assertTrue("server-side-fallback-2026-07-01" in sent.betas())
        val body = sent.json()
        assertEquals("claude-sonnet-5-5", body.getValue("model").jsonPrimitive.content)
        assertEquals(JsonPrimitive("default"), body.getValue("fallbacks"))
    }

    @Test
    fun `haiku sends neither the fallback header nor the parameter`() {
        model = AideModel.HAIKU
        server.enqueue(simpleReply())
        complete()

        val sent = server.takeRequest()
        assertFalse("beta header was ${sent.betas()}", sent.betas().any { it.startsWith("server-side-fallback") })
        val body = sent.json()
        assertEquals("claude-haiku-5-5", body.getValue("model").jsonPrimitive.content)
        assertFalse(body.containsKey("fallbacks"))
        // Everything else is unchanged.
        assertEquals("medium", body.getValue("output_config").jsonObject.getValue("effort").jsonPrimitive.content)
        assertEquals(true, body.getValue("stream").jsonPrimitive.boolean)
    }

    @Test
    fun `the model and key are read afresh for every call`() {
        val llm = llm()
        server.enqueue(simpleReply())
        server.enqueue(simpleReply())
        server.enqueue(simpleReply())

        complete(llm)
        model = AideModel.HAIKU
        complete(llm)
        key = "  sk-ant-second-key\n"
        complete(llm)

        val first = server.takeRequest()
        val second = server.takeRequest()
        val third = server.takeRequest()
        assertEquals("claude-opus-5-5", first.json().getValue("model").jsonPrimitive.content)
        assertEquals("claude-haiku-5-5", second.json().getValue("model").jsonPrimitive.content)
        assertEquals("sk-ant-test-key", second.sentKey())
        assertEquals("a key pasted with stray whitespace is trimmed", "sk-ant-second-key", third.sentKey())
    }

    // -------------------------------------------------------------------------------------------
    // Replies

    @Test
    fun `a streamed reply comes back whole with its deltas model and usage`() {
        server.enqueue(
            stream(
                messageStart(
                    model = "claude-opus-5-5",
                    usage = """{"input_tokens":120,"cache_creation_input_tokens":40,"cache_read_input_tokens":2000,"output_tokens":1}""",
                ) +
                    event("ping", """{"type":"ping"}""") +
                    textBlock(0, "Hel", "lo ", "wörld", " \"quoted\"\n") +
                    messageEnd(usage = """{"output_tokens":57}"""),
            ),
        )
        val pieces = Collections.synchronizedList(ArrayList<String>())
        val response = complete(onText = { pieces += it })

        assertEquals("Hello wörld \"quoted\"\n", response.text)
        assertEquals(listOf("Hel", "lo ", "wörld", " \"quoted\"\n"), pieces.toList())
        assertEquals("claude-opus-5-5", response.model)
        assertEquals(LlmUsage(inputTokens = 120, outputTokens = 57, cacheReadTokens = 2000, cacheWriteTokens = 40), response.usage)
    }

    @Test
    fun `usage repeated in full on the closing event is not double counted`() {
        server.enqueue(
            stream(
                messageStart(usage = """{"input_tokens":120,"cache_creation_input_tokens":40,"cache_read_input_tokens":2000,"output_tokens":1}""") +
                    textBlock(0, "Done.") +
                    messageEnd(usage = """{"input_tokens":120,"cache_creation_input_tokens":40,"cache_read_input_tokens":2000,"output_tokens":57}"""),
            ),
        )
        assertEquals(
            LlmUsage(inputTokens = 120, outputTokens = 57, cacheReadTokens = 2000, cacheWriteTokens = 40),
            complete().usage,
        )
    }

    @Test
    fun `usage without cache fields reads as zero cache tokens`() {
        server.enqueue(stream(messageStart(usage = """{"input_tokens":9,"output_tokens":1}""") + textBlock(0, "Ok.") + messageEnd(usage = """{"output_tokens":3}""")))
        assertEquals(LlmUsage(inputTokens = 9, outputTokens = 3), complete().usage)
    }

    @Test
    fun `thinking is neither returned nor streamed as prose`() {
        server.enqueue(
            stream(messageStart() + thinkingBlock(0, "private reasoning") + textBlock(1, "The ", "answer.") + messageEnd()),
        )
        val pieces = Collections.synchronizedList(ArrayList<String>())
        val response = complete(onText = { pieces += it })

        assertEquals("The answer.", response.text)
        assertEquals(listOf("The ", "answer."), pieces.toList())
    }

    @Test
    fun `several text blocks are joined in order`() {
        server.enqueue(stream(messageStart() + textBlock(0, "{\"a\":") + textBlock(1, "1}") + messageEnd()))
        assertEquals("{\"a\":1}", complete().text)
    }

    @Test
    fun `a reply served by a fallback model is returned with that model's name`() {
        // Declined before any output: the stream opens already naming the fallback model, and a
        // fallback block marks the switch.
        server.enqueue(
            stream(
                messageStart(model = "claude-opus-4-8") +
                    event(
                        "content_block_start",
                        """{"type":"content_block_start","index":0,"content_block":{"type":"fallback","from":{"model":"claude-opus-5-5"},"to":{"model":"claude-opus-4-8"}}}""",
                    ) +
                    event("content_block_stop", """{"type":"content_block_stop","index":0}""") +
                    textBlock(1, "Notes ", "from the fallback.") +
                    messageEnd(),
            ),
        )
        val pieces = Collections.synchronizedList(ArrayList<String>())
        val response = complete(onText = { pieces += it })

        assertEquals("Notes from the fallback.", response.text)
        assertEquals("claude-opus-4-8", response.model)
        assertEquals(listOf("Notes ", "from the fallback."), pieces.toList())
    }

    @Test
    fun `a fallback that takes over mid-reply continues the same text`() {
        server.enqueue(
            stream(
                messageStart(model = "claude-opus-5-5") +
                    textBlock(0, "{\"title\":\"Sec") +
                    event(
                        "content_block_start",
                        """{"type":"content_block_start","index":1,"content_block":{"type":"fallback","from":{"model":"claude-opus-5-5"},"to":{"model":"claude-opus-4-8"}}}""",
                    ) +
                    event("content_block_stop", """{"type":"content_block_stop","index":1}""") +
                    textBlock(2, "urity review\"}") +
                    messageEnd(),
            ),
        )
        assertEquals("{\"title\":\"Security review\"}", complete().text)
    }

    @Test
    fun `a refusal is reported as refused`() {
        server.enqueue(stream(messageStart() + messageEnd(stopReason = "refusal", usage = """{"output_tokens":0}""")))
        val error = failure()
        assertEquals(LlmException.Kind.REFUSED, error.kind)
        assertFalse(error.retryable)
    }

    @Test
    fun `a refusal part-way through discards the partial reply`() {
        server.enqueue(stream(messageStart() + textBlock(0, "Here is how you") + messageEnd(stopReason = "refusal")))
        assertEquals(LlmException.Kind.REFUSED, failure().kind)
    }

    @Test
    fun `a reply cut off at the token limit is reported as truncated`() {
        server.enqueue(stream(messageStart() + textBlock(0, "{\"title\":\"Half a") + messageEnd(stopReason = "max_tokens")))
        val error = failure()
        assertEquals(LlmException.Kind.TRUNCATED, error.kind)
    }

    @Test
    fun `an empty reply is a bad reply`() {
        server.enqueue(stream(messageStart() + textBlock(0, "  \n") + messageEnd()))
        assertEquals(LlmException.Kind.BAD_REPLY, failure().kind)

        server.enqueue(stream(messageStart() + messageEnd()))
        assertEquals(LlmException.Kind.BAD_REPLY, failure().kind)
    }

    // -------------------------------------------------------------------------------------------
    // Errors

    @Test
    fun `401 is a bad key`() {
        server.enqueue(apiError(401, "authentication_error", "invalid x-api-key"))
        val error = failure()
        assertEquals(LlmException.Kind.BAD_KEY, error.kind)
        assertFalse(error.retryable)
        assertEquals(1, server.requestCount)
    }

    @Test
    fun `402 is a billing problem`() {
        server.enqueue(apiError(402, "billing_error", "Payment required"))
        assertEquals(LlmException.Kind.BILLING, failure().kind)
    }

    @Test
    fun `400 for an empty credit balance is a billing problem`() {
        server.enqueue(apiError(400, "invalid_request_error", "Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."))
        assertEquals(LlmException.Kind.BILLING, failure().kind)
    }

    @Test
    fun `any other 400 carries the API's explanation`() {
        server.enqueue(apiError(400, "invalid_request_error", "max_tokens: 999999 > 128000, which is the maximum allowed"))
        val error = failure()
        assertEquals(LlmException.Kind.OTHER, error.kind)
        assertTrue(error.message.orEmpty(), error.message.orEmpty().contains("max_tokens: 999999 > 128000"))
    }

    @Test
    fun `403 means the key may not do this`() {
        server.enqueue(apiError(403, "permission_error", "Your API key does not have permission to use the specified resource."))
        assertEquals(LlmException.Kind.MODEL_UNAVAILABLE, failure().kind)
    }

    @Test
    fun `404 means the model is not available and names it`() {
        model = AideModel.SONNET
        server.enqueue(apiError(404, "not_found_error", "model: claude-sonnet-5-5"))
        val error = failure()
        assertEquals(LlmException.Kind.MODEL_UNAVAILABLE, error.kind)
        assertTrue(error.message.orEmpty(), error.message.orEmpty().contains("Claude Sonnet 5.5"))
    }

    @Test
    fun `429 is rate limiting and worth retrying`() {
        server.enqueue(apiError(429, "rate_limit_error", "This request would exceed your organization's rate limit"))
        val error = failure()
        assertEquals(LlmException.Kind.RATE_LIMITED, error.kind)
        assertTrue(error.retryable)
    }

    @Test
    fun `429 for the monthly spend limit is a billing problem`() {
        server.enqueue(
            apiError(
                429,
                "rate_limit_error",
                "You have reached your specified API usage limits.",
                extra = ""","details":{"error_code":"enforced_spend_limit_reached"}""",
            ),
        )
        val error = failure()
        assertEquals(LlmException.Kind.BILLING, error.kind)
        assertFalse("waiting a minute won't lift a spend limit", error.retryable)
    }

    @Test
    fun `529 is overloaded`() {
        server.enqueue(apiError(529, "overloaded_error", "Overloaded"))
        val error = failure()
        assertEquals(LlmException.Kind.OVERLOADED, error.kind)
        assertTrue(error.retryable)
    }

    @Test
    fun `500 503 and 504 are trouble on Claude's side`() {
        for (status in listOf(500, 503, 504)) {
            server.enqueue(apiError(status, "api_error", "Internal server error"))
            val error = failure()
            assertEquals("HTTP $status", LlmException.Kind.OVERLOADED, error.kind)
            assertTrue(error.retryable)
        }
    }

    @Test
    fun `an error page that is not JSON still maps by status`() {
        server.enqueue(MockResponse().setResponseCode(502).setHeader("content-type", "text/html").setBody("<html>Bad gateway</html>"))
        assertEquals(LlmException.Kind.OVERLOADED, failure().kind)

        server.enqueue(MockResponse().setResponseCode(401).setBody(""))
        assertEquals(LlmException.Kind.BAD_KEY, failure().kind)
    }

    @Test
    fun `overload reported after the stream has opened is still overloaded`() {
        // Under load the API can accept the request (HTTP 200) and then fail it with an error event.
        server.enqueue(
            stream(
                messageStart() + textBlock(0, "Half") +
                    event("error", """{"type":"error","error":{"type":"overloaded_error","message":"Overloaded"}}"""),
            ),
        )
        val error = failure()
        assertEquals(LlmException.Kind.OVERLOADED, error.kind)
        assertTrue(error.retryable)
    }

    @Test
    fun `a server error reported after the stream has opened is trouble on Claude's side`() {
        server.enqueue(
            stream(messageStart() + event("error", """{"type":"error","error":{"type":"api_error","message":"Internal server error"}}""")),
        )
        val error = failure()
        assertEquals(LlmException.Kind.OVERLOADED, error.kind)
        assertTrue(error.retryable)
    }

    @Test
    fun `a connection dropped before any reply is offline`() {
        server.enqueue(MockResponse().setSocketPolicy(SocketPolicy.DISCONNECT_AT_START))
        val error = failure()
        assertEquals(LlmException.Kind.OFFLINE, error.kind)
        assertTrue(error.retryable)
    }

    @Test
    fun `a connection dropped part-way through the stream is offline`() {
        server.enqueue(
            stream(messageStart() + textBlock(0, "x".repeat(4000)) + messageEnd()).setSocketPolicy(SocketPolicy.DISCONNECT_DURING_RESPONSE_BODY),
        )
        val error = failure()
        assertEquals(LlmException.Kind.OFFLINE, error.kind)
        assertTrue(error.retryable)
    }

    @Test
    fun `a stream that ends before the message is finished is not mistaken for a reply`() {
        // The body ends cleanly, as a proxy closing the connection would make it, but the reply never finished.
        server.enqueue(stream(messageStart() + textBlock(0, "{\"title\":\"Half a")))
        val error = failure()
        assertTrue("was ${error.kind}", error.retryable)
    }

    @Test
    fun `nothing is listening is offline`() {
        val llm = llm()
        server.shutdown()
        val error = failure(llm)
        assertEquals(LlmException.Kind.OFFLINE, error.kind)
    }

    @Test
    fun `no key fails without any request`() {
        for (missing in listOf(null, "", "   ")) {
            key = missing
            val error = failure()
            assertEquals(LlmException.Kind.NO_KEY, error.kind)
            assertFalse(error.retryable)
        }
        assertEquals(0, server.requestCount)
    }

    @Test
    fun `a transient failure is retried by the client when retries are allowed`() {
        server.enqueue(apiError(529, "overloaded_error", "Overloaded").setHeader("retry-after-ms", "10"))
        server.enqueue(simpleReply("Second time lucky."))

        assertEquals("Second time lucky.", complete(llm(maxRetries = 1)).text)
        assertEquals(2, server.requestCount)
    }

    @Test
    fun `a rejected key is not retried`() {
        server.enqueue(apiError(401, "authentication_error", "invalid x-api-key"))
        server.enqueue(simpleReply())

        assertEquals(LlmException.Kind.BAD_KEY, failure(llm(maxRetries = 2)).kind)
        assertEquals(1, server.requestCount)
    }

    @Test
    fun `cancelling the caller stops the request and is not reported as an error`() {
        val started = CountDownLatch(1)
        // The first piece arrives at once, then the reply stalls.
        server.enqueue(
            stream(messageStart() + textBlock(0, "First", "x".repeat(64 * 1024)) + messageEnd())
                .throttleBody(512, 1, TimeUnit.SECONDS),
        )
        runBlocking {
            val call = async(Dispatchers.Default, start = CoroutineStart.DEFAULT) {
                llm().complete(request()) { started.countDown() }
            }
            assertTrue("the stream never started", started.await(10, TimeUnit.SECONDS))
            call.cancel()
            try {
                withTimeout(10_000) { call.await() }
                fail("Expected cancellation")
            } catch (e: CancellationException) {
                assertTrue(call.isCancelled)
            } catch (e: LlmException) {
                fail("Cancellation was reported as ${e.kind}: ${e.message}")
            }
        }
    }

    // -------------------------------------------------------------------------------------------
    // Checking a key

    @Test
    fun `checkKey accepts a key that can see the model`() {
        server.enqueue(
            MockResponse().setResponseCode(200).setHeader("content-type", "application/json")
                .setBody("""{"type":"model","id":"claude-sonnet-5-5","display_name":"Claude Sonnet 5.5","created_at":"2026-09-01T00:00:00Z"}"""),
        )
        val result = runBlocking { llm().checkKey("  sk-ant-new  ", AideModel.SONNET) }

        assertEquals(KeyCheck.Valid, result)
        val sent = server.takeRequest()
        assertEquals("GET", sent.method)
        assertEquals("/v1/models/claude-sonnet-5-5", sent.requestUrl!!.encodedPath)
        assertEquals("the key being checked is used, not the saved one", "sk-ant-new", sent.sentKey())
        assertEquals("checking a key spends no tokens", 1, server.requestCount)
    }

    @Test
    fun `checkKey reports a rejected key`() {
        server.enqueue(apiError(401, "authentication_error", "invalid x-api-key"))
        val result = runBlocking { llm().checkKey("sk-ant-wrong", AideModel.OPUS) }

        assertTrue(result is KeyCheck.Invalid)
        assertTrue((result as KeyCheck.Invalid).reason, result.reason.contains("rejected", ignoreCase = true))
    }

    @Test
    fun `checkKey reports a model the key cannot use`() {
        server.enqueue(apiError(404, "not_found_error", "model: claude-opus-5-5"))
        val result = runBlocking { llm().checkKey("sk-ant-ok", AideModel.OPUS) }

        assertTrue(result is KeyCheck.Invalid)
        assertTrue((result as KeyCheck.Invalid).reason, result.reason.contains("Claude Opus 5.5"))
    }

    @Test
    fun `checkKey with nothing pasted makes no request`() {
        val result = runBlocking { llm().checkKey("   ", AideModel.OPUS) }
        assertTrue(result is KeyCheck.Invalid)
        assertEquals(0, server.requestCount)
    }

    @Test
    fun `checkKey without a connection says so rather than blaming the key`() {
        val llm = llm()
        server.shutdown()
        val result = runBlocking { llm.checkKey("sk-ant-ok", AideModel.OPUS) }

        assertTrue(result is KeyCheck.Invalid)
        val reason = (result as KeyCheck.Invalid).reason
        assertTrue(reason, reason.contains("internet", ignoreCase = true) || reason.contains("reach", ignoreCase = true))
        assertNull("a network failure says nothing about the key", reason.takeIf { it.contains("rejected", ignoreCase = true) })
    }
}
