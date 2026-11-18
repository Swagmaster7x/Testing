package com.personal.aide

import android.Manifest
import android.app.Application
import android.app.NotificationManager
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.rule.GrantPermissionRule
import com.personal.aide.ai.AideModel
import com.personal.aide.ai.AnthropicLlm
import com.personal.aide.ai.Assistant
import com.personal.aide.ai.Effort
import com.personal.aide.ai.KeyCheck
import com.personal.aide.ai.LlmException
import com.personal.aide.ai.LlmMessage
import com.personal.aide.ai.LlmRequest
import com.personal.aide.ai.Schemas
import com.personal.aide.ai.SystemPart
import com.personal.aide.data.KeystoreSecretStore
import com.personal.aide.data.MemorySecretStore
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.notify.Notifications
import com.personal.aide.transcribe.RecorderState
import com.personal.aide.transcribe.Transcriber
import kotlinx.coroutines.runBlocking
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * What only a real Android runtime can confirm: that the Claude SDK loads and works there, that
 * the key store really encrypts with the phone's keystore, and that a recording can run as a
 * foreground service. Claude is played by a local web server; nothing here uses the network.
 */
@RunWith(AndroidJUnit4::class)
class OnDeviceTest {
    @get:Rule
    val permissions: GrantPermissionRule = GrantPermissionRule.grant(Manifest.permission.RECORD_AUDIO, Manifest.permission.POST_NOTIFICATIONS)

    private val app: Application get() = ApplicationProvider.getApplicationContext()
    private val server = MockWebServer()

    @Before
    fun setUp() = server.start()

    @After
    fun tearDown() = server.shutdown()

    private fun sse(vararg events: Pair<String, String>): MockResponse =
        MockResponse().setHeader("content-type", "text/event-stream")
            .setBody(events.joinToString("") { (name, data) -> "event: $name\ndata: $data\n\n" })

    private fun reply(text: String, stopReason: String = "end_turn"): MockResponse {
        val escaped = text.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n")
        val half = escaped.length / 2
        // Split where it can't cut an escape sequence in two.
        val cut = (half downTo 0).first { it == 0 || escaped[it - 1] != '\\' }
        return sse(
            "message_start" to """{"type":"message_start","message":{"id":"msg_1","type":"message","role":"assistant","model":"claude-opus-5-5","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":321,"output_tokens":1,"cache_read_input_tokens":40,"cache_creation_input_tokens":0}}}""",
            "content_block_start" to """{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}""",
            "content_block_delta" to """{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"${escaped.substring(0, cut)}"}}""",
            "content_block_delta" to """{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"${escaped.substring(cut)}"}}""",
            "content_block_stop" to """{"type":"content_block_stop","index":0}""",
            "message_delta" to """{"type":"message_delta","delta":{"stop_reason":"$stopReason","stop_sequence":null},"usage":{"output_tokens":57}}""",
            "message_stop" to """{"type":"message_stop"}""",
        )
    }

    private fun llm(model: AideModel = AideModel.OPUS) =
        AnthropicLlm(apiKey = { "sk-ant-test" }, model = { model }, baseUrl = server.url("/").toString().trimEnd('/'), maxRetries = 0)

    @Test
    fun claudeSdkStreamsAReplyOnAndroid() = runBlocking {
        server.enqueue(reply("Hello from the phone."))
        val pieces = ArrayList<String>()
        val response = llm().complete(
            LlmRequest("test", listOf(SystemPart("You are a test.", cache = true)), listOf(LlmMessage(LlmMessage.Role.USER, "Hi")), effort = Effort.LOW),
        ) { pieces += it }

        assertEquals("Hello from the phone.", response.text)
        assertEquals("Hello from the phone.", pieces.joinToString(""))
        assertEquals("claude-opus-5-5", response.model)
        assertEquals(321, response.usage.inputTokens)
        assertEquals(57, response.usage.outputTokens)
        assertEquals(40, response.usage.cacheReadTokens)

        val request = server.takeRequest()
        assertTrue(request.path!!.startsWith("/v1/messages"))
        // The SDK decides which header carries the key; what matters is that the key is sent.
        val credentials = listOfNotNull(request.getHeader("x-api-key"), request.getHeader("authorization")).joinToString(" ")
        assertTrue(credentials, credentials.contains("sk-ant-test"))
        assertTrue(request.getHeader("anthropic-beta").orEmpty().contains(AnthropicLlm.FALLBACK_BETA))
        val body = request.body.readUtf8()
        assertTrue(body, body.contains("\"model\":\"claude-opus-5-5\""))
        assertTrue(body, body.contains("\"stream\":true"))
        assertTrue(body, body.contains("\"fallbacks\":\"default\""))
        assertTrue(body, body.contains("\"effort\":\"low\""))
        assertTrue(body, body.contains("\"cache_control\""))
    }

    @Test
    fun structuredRequestCarriesTheSchemaAndHaikuSkipsFallbacks() = runBlocking {
        server.enqueue(reply("""{"headline":"h","focus":[],"if_time":[],"chase":[],"heads_up":[]}"""))
        llm(AideModel.HAIKU).complete(
            LlmRequest("test", listOf(SystemPart("s")), listOf(LlmMessage(LlmMessage.Role.USER, "plan")), schema = Schemas.dayPlan),
        )
        val request = server.takeRequest()
        val body = request.body.readUtf8()
        assertTrue(body, body.contains("\"type\":\"json_schema\""))
        assertTrue(body, body.contains("\"additionalProperties\":false"))
        assertFalse(body, body.contains("\"fallbacks\""))
        assertFalse(request.getHeader("anthropic-beta").orEmpty().contains(AnthropicLlm.FALLBACK_BETA))
    }

    @Test
    fun errorsAreTranslatedOnAndroid() = runBlocking {
        server.enqueue(MockResponse().setResponseCode(401).setHeader("content-type", "application/json").setBody("""{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"}}"""))
        try {
            llm().complete(LlmRequest("test", listOf(SystemPart("s")), listOf(LlmMessage(LlmMessage.Role.USER, "Hi"))))
            fail("expected a rejected key")
        } catch (e: LlmException) {
            assertEquals(LlmException.Kind.BAD_KEY, e.kind)
        }

        server.enqueue(reply("partial", stopReason = "refusal"))
        try {
            llm().complete(LlmRequest("test", listOf(SystemPart("s")), listOf(LlmMessage(LlmMessage.Role.USER, "Hi"))))
            fail("expected a refusal")
        } catch (e: LlmException) {
            assertEquals(LlmException.Kind.REFUSED, e.kind)
        }
    }

    @Test
    fun keyCheckUsesTheModelsEndpoint() = runBlocking {
        server.enqueue(MockResponse().setHeader("content-type", "application/json").setBody("""{"id":"claude-opus-5-5","type":"model","display_name":"Claude Opus 5.5","created_at":"2026-01-01T00:00:00Z"}"""))
        assertEquals(KeyCheck.Valid, llm().checkKey("sk-ant-test", AideModel.OPUS))
        assertTrue(server.takeRequest().path!!.startsWith("/v1/models/claude-opus-5-5"))

        server.enqueue(MockResponse().setResponseCode(401).setHeader("content-type", "application/json").setBody("""{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"}}"""))
        assertTrue(llm().checkKey("sk-ant-wrong", AideModel.OPUS) is KeyCheck.Invalid)
    }

    @Test
    fun apiKeyIsEncryptedWithThePhonesKeystore() = runBlocking {
        val store = KeystoreSecretStore(app)
        store.setApiKey("sk-ant-secret-value")
        assertEquals("sk-ant-secret-value", KeystoreSecretStore(app).apiKey())
        val onDisk = app.getSharedPreferences("aide_secret", Context.MODE_PRIVATE).all.values.joinToString(" ")
        assertFalse("the key must not be stored in the clear", onDisk.contains("sk-ant-secret-value"))
        store.setApiKey(null)
        assertNull(KeystoreSecretStore(app).apiKey())
    }

    @Test
    fun aMeetingIsSummarizedEndToEndOnAndroid() = runBlocking {
        val db = AppDatabase.inMemory(app)
        val container = AppContainer(app, db = db, secrets = MemorySecretStore("sk-ant-test"), llm = llm())
        val meetingId = container.meetings.importText(
            "",
            "Sam will send the pricing page copy to Marcus by Friday. Dana said the rate feed fix needs two more weeks. " +
                "We agreed the beta opens on the ninth of February with twenty-five customers, and that tiers stay fixed for ninety days.",
        )
        server.enqueue(
            reply(
                """{"title":"Pricing review","meeting_type":"review","tldr":"Fixed tiers agreed; beta on 9 February.","key_points":["Three fixed tiers"],"decisions":["Beta opens 9 February"],"action_items":[{"title":"Send pricing page copy to Marcus","details":"","owner":"","ownership":"mine","due_date":"2026-11-20","priority":"high","evidence":"Sam will send"},{"title":"Fix the rate feed","details":"","owner":"Dana","ownership":"others","due_date":"","priority":"normal","evidence":"Dana said"}],"open_questions":[],"risks":[],"attendees":["Dana","Marcus"],"knowledge":[{"type":"person","title":"Dana","content":"Owns the rate feed."}],"clarifying_questions":[{"question":"Who is Marcus?","why":"new name","topic":"Marcus","topic_type":"person"}],"transcript_quality":"good"}""",
            ),
        )
        assertEquals(Assistant.SummaryResult.Done, container.assistant.summarizeMeeting(meetingId))

        val meeting = db.meetings().get(meetingId)!!
        assertEquals(MeetingStatus.READY, meeting.status)
        assertEquals("Pricing review", meeting.title)
        assertEquals(2, db.tasks().forMeeting(meetingId).size)
        assertNotNull(db.knowledge().findByKey("dana"))
        assertEquals(1, db.questions().all().size)
        assertEquals(1, db.usage().all().size)
        val sent = server.takeRequest().body.readUtf8()
        assertTrue(sent.contains("pricing page copy"))
        db.close()
    }

    /** Hears whatever the test tells it to. */
    private class FakeTranscriber : Transcriber {
        var listener: Transcriber.Listener? = null
        override fun start(config: Transcriber.Config, listener: Transcriber.Listener) {
            this.listener = listener
        }
        override fun stop() {
            listener = null
        }
    }

    @Test
    fun aRecordingRunsBehindAForegroundServiceAndSavesWhatItHears() {
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val db = AppDatabase.inMemory(app)
        val fake = FakeTranscriber()
        lateinit var container: AppContainer
        instrumentation.runOnMainSync {
            container = AppContainer(app, db = db, secrets = MemorySecretStore(), newTranscriber = { fake })
            (app as AideApp).container = container
            container.recorder.start(title = "Standup")
        }
        waitUntil("the recording to start") { container.recorder.state.value.meetingId != null && fake.listener != null }
        val meetingId = container.recorder.state.value.meetingId!!
        instrumentation.runOnMainSync {
            fake.listener!!.onPartial("good morning every")
            fake.listener!!.onFinal("Good morning everyone.")
            container.recorder.addNote("Dana owns the rate feed")
            container.recorder.flag()
        }
        // The system must have accepted a microphone-type foreground service and shown its notification.
        val notifications = app.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        waitUntil("the recording notification") { notifications.activeNotifications.any { it.id == Notifications.RECORDING_ID } }
        assertEquals(RecorderState.Phase.LISTENING, container.recorder.state.value.phase)

        instrumentation.runOnMainSync { container.recorder.stop() }
        waitUntil("the meeting to be saved") { runBlocking { db.meetings().get(meetingId)?.status == MeetingStatus.TRANSCRIBED } }
        val segments = runBlocking { db.meetings().segments(meetingId) }
        assertEquals(listOf(SegmentKind.SPEECH, SegmentKind.NOTE, SegmentKind.FLAG), segments.map { it.kind })
        assertEquals("Good morning everyone.", segments[0].text)
        waitUntil("the notification to go away") { notifications.activeNotifications.none { it.id == Notifications.RECORDING_ID } }
        db.close()
    }

    private fun waitUntil(what: String, timeoutMs: Long = 60_000, condition: () -> Boolean) {
        val deadline = System.currentTimeMillis() + timeoutMs
        while (System.currentTimeMillis() < deadline) {
            if (condition()) return
            Thread.sleep(100)
        }
        fail("Timed out waiting for $what")
    }
}
