package com.personal.aide

import android.Manifest
import android.app.ActivityManager
import android.app.Application
import android.app.Notification
import android.app.NotificationManager
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import android.net.Uri
import android.os.ParcelFileDescriptor
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.rule.GrantPermissionRule
import com.personal.aide.ai.AideModel
import com.personal.aide.ai.AnthropicLlm
import com.personal.aide.ai.Assistant
import com.personal.aide.ai.Effort
import com.personal.aide.ai.IntakeState
import com.personal.aide.ai.KeyCheck
import com.personal.aide.ai.LlmException
import com.personal.aide.ai.LlmMessage
import com.personal.aide.ai.LlmRequest
import com.personal.aide.ai.Schemas
import com.personal.aide.ai.SystemPart
import com.personal.aide.calendar.Agenda
import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.DocumentException
import com.personal.aide.data.DocumentReader
import com.personal.aide.data.KeystoreSecretStore
import com.personal.aide.data.Material
import com.personal.aide.data.MemorySecretStore
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.domain.Days
import com.personal.aide.notify.Notifications
import com.personal.aide.notify.Reminders
import com.personal.aide.notify.WorkService
import com.personal.aide.transcribe.AudioFeed
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
import org.junit.Assume.assumeTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

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

    private fun titleOf(notification: Notification): String = notification.extras.getCharSequence(Notification.EXTRA_TITLE)?.toString().orEmpty()

    private fun textOf(notification: Notification): String =
        (notification.extras.getCharSequence(Notification.EXTRA_BIG_TEXT) ?: notification.extras.getCharSequence(Notification.EXTRA_TEXT))?.toString().orEmpty()

    /**
     * The whole path of a meeting brief on a real system: the calendar is read, an exact alarm is
     * set, the alarm wakes the receiver, and the brief is put together from the database and posted.
     */
    @Test
    fun aMeetingBriefArrivesByAlarmWithWhatIsOnRecord() {
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val notifications = app.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val db = AppDatabase.inMemory(app)
        // Five minutes away: inside the ten-minute lead, so its brief is due straight away.
        val start = System.currentTimeMillis() + 5 * 60_000
        val event = CalendarEvent(id = 4242, title = "Quoting standup", start = start, end = start + 30 * 60_000, attendees = listOf("Dana Whitfield"))
        val agenda = object : Agenda {
            override suspend fun events(fromMillis: Long, toMillis: Long): List<CalendarEvent> = listOf(event)
        }
        lateinit var container: AppContainer
        instrumentation.runOnMainSync {
            container = AppContainer(app, db = db, secrets = MemorySecretStore(), agenda = agenda)
            (app as AideApp).container = container
        }
        val calendarWasOn = runBlocking { container.settings.current().calendarEnabled }
        try {
            runBlocking {
                container.settings.setCalendarEnabled(true)
                container.settings.setPrepEnabled(true)
                val week = 7 * 86_400_000L
                val seriesId = container.series.findOrCreate("Quoting standup", calendarEventId = 4242)
                db.meetings().insert(
                    MeetingEntity(
                        title = "Quoting standup", titleIsAuto = false, startedAt = start - week, endedAt = start - week + 1_500_000,
                        status = MeetingStatus.READY, attendees = listOf("Dana Whitfield"), calendarEventId = 4242,
                        tldr = "The rate feed fix is close to review.", seriesId = seriesId,
                    ),
                )
                db.tasks().insert(TaskEntity(title = "Fix the rate feed", owner = "Dana Whitfield", ownership = Ownership.OTHERS, createdAt = start - week))
                Reminders.refreshPrep(container)
            }
            waitUntil("the meeting brief", timeoutMs = 180_000) {
                notifications.activeNotifications.any { titleOf(it.notification).startsWith("Quoting standup") }
            }
            val posted = notifications.activeNotifications.first { titleOf(it.notification).startsWith("Quoting standup") }
            val text = textOf(posted.notification)
            assertTrue(text, text.contains("Last time"))
            assertTrue(text, text.contains("The rate feed fix is close to review."))
            assertTrue(text, text.contains("Owed to you: Fix the rate feed"))
            assertEquals("the brief offers to start recording", 1, posted.notification.actions?.size ?: 0)
            assertEquals(Notifications.PREP_ID, posted.id)
            notifications.cancel(posted.tag, posted.id)
        } finally {
            runBlocking {
                container.settings.setCalendarEnabled(calendarWasOn)
                // With the calendar off again this clears any alarm the test left behind.
                Reminders.refreshPrep(container)
            }
            db.close()
        }
    }

    @Test
    fun theAfternoonReminderSaysWhatIsDueAndWhoHasGoneQuiet() = runBlocking {
        val notifications = app.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val db = AppDatabase.inMemory(app)
        val container = AppContainer(app, db = db, secrets = MemorySecretStore())
        container.settings.setNudgesEnabled(true)
        val now = System.currentTimeMillis()
        db.tasks().insert(TaskEntity(title = "Send the pricing copy", dueDay = Days.today(), createdAt = now))
        val staleId = db.tasks().insert(
            TaskEntity(title = "Confirm the override window", owner = "Marcus Lee", ownership = Ownership.OTHERS, createdAt = now - 8 * 86_400_000L),
        )

        Reminders.nudge(container)

        val due = notifications.activeNotifications.firstOrNull { it.id == Notifications.DUE_ID }
        val waiting = notifications.activeNotifications.firstOrNull { it.id == Notifications.WAITING_ID }
        assertNotNull("a reminder of what is due today", due)
        assertNotNull("a nudge about the stale follow-up", waiting)
        assertTrue(textOf(due!!.notification), textOf(due.notification).contains("Send the pricing copy"))
        assertEquals("Marcus Lee still owes you something", titleOf(waiting!!.notification))
        assertTrue(textOf(waiting.notification), textOf(waiting.notification).contains("Confirm the override window"))
        assertTrue("the follow-up is marked as reminded", db.tasks().get(staleId)!!.nudgedAt >= now)

        // Asked again the same day, it stays quiet about the follow-up.
        notifications.cancel(Notifications.WAITING_ID)
        Reminders.nudge(container)
        assertNull(notifications.activeNotifications.firstOrNull { it.id == Notifications.WAITING_ID })

        notifications.cancel(Notifications.DUE_ID)
        db.close()
    }

    /**
     * What only a real Android can do with a document: draw the pages of a PDF, and bring a
     * photograph down to a size worth sending, the right way up.
     */
    @Test
    fun aPdfAWordFileAndAPhotoAreOpenedOnThePhone() = runBlocking {
        val reader = DocumentReader(app)
        val work = File(app.cacheDir, "ondevice-docs").apply { mkdirs() }

        // A two-page PDF, one page upright and one on its side.
        val pdf = File(work, "Quoting brief.pdf")
        PdfDocument().apply {
            for ((index, size) in listOf(595 to 842, 842 to 595).withIndex()) {
                val page = startPage(PdfDocument.PageInfo.Builder(size.first, size.second, index + 1).create())
                page.canvas.drawText("Self-serve quoting, page ${index + 1}", 72f, 100f, Paint().apply { textSize = 24f })
                finishPage(page)
            }
            pdf.outputStream().use { writeTo(it) }
            close()
        }
        val pages = reader.read(Uri.fromFile(pdf)) as Material.Pages
        assertEquals("Quoting brief.pdf", pages.name)
        assertEquals(2, pages.files.size)
        assertFalse(pages.photos)
        val sizes = pages.files.map { file -> BitmapFactory.decodeFile(file.path).let { it.width to it.height } }
        assertEquals("each page is drawn with its long side at the reading size", listOf(1800, 1800), sizes.map { maxOf(it.first, it.second) })
        assertTrue("the upright page stays upright", sizes[0].second > sizes[0].first)
        assertTrue("the sideways page stays sideways", sizes[1].first > sizes[1].second)
        // Drawn on white, not on the transparent black a JPEG would make of an empty page.
        val corner = BitmapFactory.decodeFile(pages.files[0].path).getPixel(5, 5)
        assertTrue("page background is white", Color.red(corner) > 240 && Color.green(corner) > 240 && Color.blue(corner) > 240)

        // A photograph far bigger than Claude makes use of.
        val big = File(work, "whiteboard.jpg")
        Bitmap.createBitmap(4000, 3000, Bitmap.Config.ARGB_8888).also { bitmap ->
            bitmap.eraseColor(Color.LTGRAY)
            big.outputStream().use { bitmap.compress(Bitmap.CompressFormat.JPEG, 90, it) }
            bitmap.recycle()
        }
        val photo = reader.read(Uri.fromFile(big)) as Material.Pages
        assertTrue(photo.photos)
        val shrunk = BitmapFactory.decodeFile(photo.files.single().path)
        assertEquals(2200, shrunk.width)
        assertEquals(1650, shrunk.height)

        // A Word document, read without Claude.
        val word = File(work, "Notes.docx")
        ZipOutputStream(word.outputStream()).use { zip ->
            zip.putNextEntry(ZipEntry("word/document.xml"))
            zip.write(
                ("<w:document xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\"><w:body>" +
                    "<w:p><w:r><w:t>Decisions</w:t></w:r></w:p><w:p><w:r><w:t>Beta opens 9 February.</w:t></w:r></w:p>" +
                    "</w:body></w:document>").toByteArray(),
            )
            zip.closeEntry()
        }
        val words = reader.read(Uri.fromFile(word)) as Material.Words
        assertEquals("Decisions\nBeta opens 9 February.", words.text)

        // Something it can't read is refused in words, not with a crash.
        val sheet = File(work, "budget.xlsx").apply { writeText("not really a spreadsheet") }
        try {
            reader.read(Uri.fromFile(sheet))
            fail("A spreadsheet should have been refused")
        } catch (e: DocumentException) {
            assertTrue(e.message.orEmpty(), e.message.orEmpty().contains("budget.xlsx"))
        }

        (pages.files + photo.files).forEach { assertTrue(it.exists()) }
        reader.discard(pages)
        reader.discard(photo)
        (pages.files + photo.files).forEach { assertFalse(it.exists()) }
        work.deleteRecursively()
        Unit
    }

    /** Pictures of pages go to Claude as images, and what comes back is saved as a document and filed. */
    @Test
    fun photographedNotesAreReadAndFiledEndToEnd() = runBlocking {
        val db = AppDatabase.inMemory(app)
        val container = AppContainer(app, db = db, secrets = MemorySecretStore("sk-ant-test"), llm = llm())
        val page = File(app.cacheDir, "ondevice-page.jpg")
        Bitmap.createBitmap(400, 300, Bitmap.Config.ARGB_8888).also { bitmap ->
            bitmap.eraseColor(Color.WHITE)
            page.outputStream().use { bitmap.compress(Bitmap.CompressFormat.JPEG, 80, it) }
            bitmap.recycle()
        }
        server.enqueue(reply("--- page 1 ---\nRateStream supplies carrier rates for the quoting project. Dana Whitfield owns the rate feed and reports to Priya Nair, who signs off pricing changes above five percent."))
        server.enqueue(
            reply(
                """{"title":"Quoting notes","meeting_type":"document","tldr":"Who owns what on quoting.","key_points":["Dana owns the rate feed"],"decisions":[],"action_items":[],"open_questions":[],"risks":[],"attendees":[],"knowledge":[{"type":"org","title":"RateStream","content":"Supplies carrier rates for the quoting project."}],"clarifying_questions":[],"transcript_quality":"good","series":{"existing_id":0,"new_name":""},"since_last_time":[],"earlier_items":[]}""",
            ),
        )

        assertTrue(container.intake.submit("", "", listOf(Material.Pages("Photos", listOf(page), photos = true)), MeetingSource.DOCUMENT))
        // Generous: the first request in a run also loads the whole Claude SDK, which is slow on an emulator.
        waitUntil("the photographed page to be read", timeoutMs = 480_000) { container.intake.state.value !is IntakeState.Working }
        assertTrue("reading ended as ${container.intake.state.value}", container.intake.state.value is IntakeState.Done)
        waitUntil("the document to be filed", timeoutMs = 240_000) {
            runBlocking { db.meetings().all().firstOrNull()?.status == MeetingStatus.READY }
        }

        val saved = db.meetings().all().single()
        assertEquals(MeetingSource.DOCUMENT, saved.source)
        assertEquals("Quoting notes", saved.title)
        assertTrue(db.meetings().segments(saved.id).joinToString(" ") { it.text }.contains("Dana Whitfield owns the rate feed"))
        assertNotNull(db.knowledge().findByKey("ratestream"))
        assertEquals("a document is not a meeting with anyone", emptyList<String>(), saved.attendees)
        assertFalse("the picture is not kept once it has been read", page.exists())

        val reading = server.takeRequest().body.readUtf8()
        assertTrue(reading.take(600), reading.contains("\"type\":\"image\""))
        assertTrue(reading.contains("\"media_type\":\"image/jpeg\""))
        assertTrue(reading.contains("page 1 of 1"))
        val filing = server.takeRequest().body.readUtf8()
        assertTrue(filing.contains("<document>"))
        assertFalse("the second request carries the text, not the picture again", filing.contains("\"type\":\"image\""))
        db.close()
    }

    /**
     * The app's own microphone capture really produces audio into a pipe a recognizer could read.
     * Skipped where the microphone can't be opened at all (some emulators have none).
     */
    @Test
    fun theAppsOwnCaptureDeliversAudioThroughAPipe() {
        val levels = AtomicInteger(0)
        val feed = AudioFeed(maxGain = 16f) { levels.incrementAndGet() }
        assumeTrue("this device has no microphone to open", feed.start())
        try {
            assertTrue(feed.alive())
            val stream = feed.open()
            assertNotNull(stream)
            val read = AtomicInteger(0)
            val reader = Thread {
                runCatching {
                    ParcelFileDescriptor.AutoCloseInputStream(stream).use { input ->
                        val buffer = ByteArray(3200)
                        while (read.get() < 32_000) {
                            val count = input.read(buffer)
                            if (count < 0) break
                            read.addAndGet(count)
                        }
                    }
                }
            }.also { it.start() }
            // A second of 16 kHz, 16-bit audio is 32,000 bytes.
            waitUntil("a second of audio to come through the pipe", timeoutMs = 30_000) { read.get() >= 32_000 }
            assertTrue("the level meter is fed too", levels.get() > 0)
            assertEquals("a reader that keeps up is never reported as stalled", 0L, feed.stalledMs())

            // A new session gets a new stream; the old one ends instead of hanging its reader.
            val next = feed.open()
            assertNotNull(next)
            reader.join(10_000)
            assertFalse("the first stream's reader was released", reader.isAlive)
            next!!.close()
        } finally {
            feed.stop()
        }
        assertFalse(feed.alive())
    }

    /**
     * Notes dictated in another app and brought across in parts: shared once, then copied and
     * added with the notification's button, which only works if a window of Aide's can take
     * focus for a moment to read what was copied. Then finished.
     */
    @Test
    fun notesFromAnotherAppAreCollectedIntoOneMeeting() {
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val notifications = app.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val clipboard = app.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        app.getSharedPreferences("aide_collecting", Context.MODE_PRIVATE).edit().clear().commit()
        val db = AppDatabase.inMemory(app)
        lateinit var container: AppContainer
        instrumentation.runOnMainSync {
            container = AppContainer(app, db = db, secrets = MemorySecretStore())
            (app as AideApp).container = container
        }
        fun quick(action: String) = Intent(app, QuickAddActivity::class.java).setAction(action).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try {
            // The first stretch, shared from the other app.
            ActivityScenario.launch<QuickAddActivity>(
                quick(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, "Dana said the fix is in review."),
            ).close()
            waitUntil("the shared text to be collected") { container.collector.state.value?.parts == 1 }
            val meetingId = container.collector.state.value!!.meetingId

            waitUntil("the collecting notification") { notifications.activeNotifications.any { it.id == Notifications.COLLECT_ID } }
            val posted = notifications.activeNotifications.first { it.id == Notifications.COLLECT_ID }
            assertEquals(listOf("Add copied text", "Finish"), posted.notification.actions.map { it.title.toString() })
            assertTrue(titleOf(posted.notification), titleOf(posted.notification).contains("collecting"))

            // The second stretch: the whole box is copied, earlier words and all, and the button pressed.
            instrumentation.runOnMainSync {
                clipboard.setPrimaryClip(ClipData.newPlainText("dictation", "Dana said the fix is in review. Marcus wants a two-week override window."))
            }
            ActivityScenario.launch<QuickAddActivity>(quick(QuickAddActivity.ACTION_ADD_COPIED)).close()
            waitUntil("the copied text to be collected") { container.collector.state.value?.parts == 2 }
            assertEquals(
                listOf("Dana said the fix is in review.", "Marcus wants a two-week override window."),
                runBlocking { db.meetings().segments(meetingId) }.map { it.text },
            )

            // The meeting is over.
            ActivityScenario.launch<QuickAddActivity>(quick(QuickAddActivity.ACTION_FINISH)).close()
            waitUntil("the collecting to end") { container.collector.state.value == null }
            waitUntil("the notification to go") { notifications.activeNotifications.none { it.id == Notifications.COLLECT_ID } }
            assertEquals(MeetingStatus.TRANSCRIBED, runBlocking { db.meetings().get(meetingId) }!!.status)
            assertEquals(13, runBlocking { db.meetings().get(meetingId) }!!.wordCount)
        } finally {
            app.getSharedPreferences("aide_collecting", Context.MODE_PRIVATE).edit().clear().commit()
            notifications.cancel(Notifications.COLLECT_ID)
            db.close()
        }
    }

    /**
     * While Claude is writing notes the app holds a foreground service, which is what stops
     * Android freezing it (and cutting the connection) when the user switches to another app.
     */
    @Test
    fun writingNotesKeepsTheAppAliveUntilTheyAreDone() {
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val activity = app.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        @Suppress("DEPRECATION") // Still answers for the app's own services, which is all that is asked.
        fun keptAlive() = activity.getRunningServices(50).any { it.service.className == WorkService::class.java.name && it.foreground }
        val db = AppDatabase.inMemory(app)
        lateinit var container: AppContainer
        instrumentation.runOnMainSync {
            container = AppContainer(app, db = db, secrets = MemorySecretStore("sk-ant-test"), llm = llm())
            (app as AideApp).container = container
        }
        try {
            assertFalse("nothing is being written yet", keptAlive())
            val meetingId = runBlocking {
                container.meetings.importText(
                    "",
                    "Sam will send the pricing page copy to Marcus by Friday. Dana said the rate feed fix needs two more weeks. " +
                        "We agreed the beta opens on the ninth of February with twenty-five customers, and that tiers stay fixed for ninety days.",
                )
            }
            // Claude takes its time, as it does with a real meeting.
            server.enqueue(
                reply(
                    """{"title":"Pricing review","meeting_type":"review","tldr":"Fixed tiers agreed.","key_points":[],"decisions":[],"action_items":[],"open_questions":[],"risks":[],"attendees":[],"knowledge":[],"clarifying_questions":[],"transcript_quality":"good","series":{"existing_id":0,"new_name":""},"since_last_time":[],"earlier_items":[]}""",
                ).setBodyDelay(8, TimeUnit.SECONDS),
            )
            instrumentation.runOnMainSync { container.processor.summarize(meetingId) }

            waitUntil("the app to hold a foreground service while the notes are written") { keptAlive() }
            assertTrue(container.busy.value)
            waitUntil("the notes to be written", timeoutMs = 480_000) { runBlocking { db.meetings().get(meetingId)?.status == MeetingStatus.READY } }
            waitUntil("the service to go once the work is done") { !keptAlive() }
            assertFalse(container.busy.value)
        } finally {
            db.close()
        }
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
