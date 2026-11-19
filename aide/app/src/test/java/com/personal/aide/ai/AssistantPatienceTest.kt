package com.personal.aide.ai

import android.app.Application
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.calendar.NoAgenda
import com.personal.aide.data.KnowledgeBase
import com.personal.aide.data.SettingsStore
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.testing.FakeLlm
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.MemoryDataStore
import com.personal.aide.testing.prompt
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import java.io.File

/** Reading pages carries on past a connection that drops for a moment, without paying again for pages already read. */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class AssistantPatienceTest {
    private lateinit var db: AppDatabase
    private lateinit var assistant: Assistant
    private val llm = FakeLlm()
    private val work = File(System.getProperty("java.io.tmpdir"), "aide-patience-test")

    @Before
    fun setUp() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        db = AppDatabase.inMemory(context)
        val settings = SettingsStore(MemoryDataStore())
        assistant = Assistant(
            db, settings, llm, KnowledgeBase(db.knowledge()) { Fixed.now }, NoAgenda,
            now = { Fixed.now }, zone = { Fixed.zone }, retryDelays = listOf(5L, 5L),
        )
        work.mkdirs()
    }

    @After
    fun tearDown() {
        db.close()
        work.deleteRecursively()
    }

    private fun pages(count: Int): List<File> = (1..count).map { number -> File(work, "page-$number.jpg").apply { writeBytes(byteArrayOf(1, 2, 3, number.toByte())) } }

    @Test
    fun `a batch that fails for want of a connection is read again, and only that batch`(): Unit = runBlocking {
        val seven = pages(Assistant.PAGES_PER_CALL + 1)
        llm.reply("--- page 1 ---\nFirst batch.")
        llm.fail(LlmException.Kind.OFFLINE, "The connection to Claude was cut off part-way. Try again.")
        llm.reply("--- page 7 ---\nLast page.")

        val text = assistant.readPages("Handbook", seven)

        assertEquals("--- page 1 ---\nFirst batch.\n\n--- page 7 ---\nLast page.", text)
        assertEquals(3, llm.requests.size)
        // The first batch was sent once; the second twice.
        assertEquals(Assistant.PAGES_PER_CALL, llm.requests[0].messages.single().images.size)
        assertEquals(1, llm.requests[1].messages.single().images.size)
        assertEquals(1, llm.requests[2].messages.single().images.size)
        assertTrue(llm.requests[2].prompt.contains("page 7"))
    }

    @Test
    fun `when it keeps failing the reading stops and says why`(): Unit = runBlocking {
        repeat(3) { llm.fail(LlmException.Kind.OVERLOADED, "Claude is busy right now. Try again in a moment.") }
        try {
            assistant.readPages("Handbook", pages(1))
            fail("Expected the reading to give up")
        } catch (e: LlmException) {
            assertEquals(LlmException.Kind.OVERLOADED, e.kind)
        }
        assertEquals("the first try and one after each wait", 3, llm.requests.size)
    }

    @Test
    fun `a refusal or a bad key is not something to wait out`(): Unit = runBlocking {
        llm.fail(LlmException.Kind.BAD_KEY, "Claude rejected the API key. Check it in Settings.")
        try {
            assistant.readPages("Handbook", pages(1))
            fail("Expected the reading to stop")
        } catch (e: LlmException) {
            assertEquals(LlmException.Kind.BAD_KEY, e.kind)
        }
        assertEquals(1, llm.requests.size)
    }
}
