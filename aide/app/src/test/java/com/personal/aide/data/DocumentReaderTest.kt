package com.personal.aide.data

import android.app.Application
import android.content.ContentProvider
import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.database.MatrixCursor
import android.net.Uri
import android.os.ParcelFileDescriptor
import android.provider.OpenableColumns
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import org.junit.runner.RunWith
import org.robolectric.Robolectric
import org.robolectric.Shadows.shadowOf
import org.robolectric.annotation.Config
import java.io.ByteArrayOutputStream
import java.io.File
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

/**
 * [DocumentReader] on the files a desktop JVM can open the way a phone does: text and Word
 * documents. Turning PDFs and pictures into page images needs a real Android and is tested on a
 * device instead.
 */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class DocumentReaderTest {
    @get:Rule
    val folder = TemporaryFolder()

    private val context: Context = ApplicationProvider.getApplicationContext()
    private val reader = DocumentReader(context)

    /** Where the reader keeps page images until they have been read. */
    private val pageCache: File get() = File(context.cacheDir, DocumentReader.PAGE_DIR)

    @After
    fun tearDown() {
        PickedFiles.shown.clear()
    }

    // -------------------------------------------------------------------------------------------
    // Files to read

    private fun saved(name: String, bytes: ByteArray): File = File(folder.root, name).apply { writeBytes(bytes) }

    /** A file on the phone called [name], and the address a file manager would hand over for it. */
    private fun file(name: String, content: String): Uri = Uri.fromFile(saved(name, content.toByteArray(Charsets.UTF_8)))

    private fun file(name: String, bytes: ByteArray): Uri = Uri.fromFile(saved(name, bytes))

    private fun zip(vararg files: Pair<String, String>): ByteArray {
        val bytes = ByteArrayOutputStream()
        ZipOutputStream(bytes).use { zip ->
            for ((name, content) in files) {
                zip.putNextEntry(ZipEntry(name))
                zip.write(content.toByteArray(Charsets.UTF_8))
                zip.closeEntry()
            }
        }
        return bytes.toByteArray()
    }

    /** A Word document with a paragraph for each of [paragraphs]. */
    private fun docx(vararg paragraphs: String): ByteArray = zip(
        "[Content_Types].xml" to "<Types/>",
        "word/document.xml" to
            """<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>""" +
            paragraphs.joinToString("") { "<w:p><w:r><w:t xml:space=\"preserve\">$it</w:t></w:r></w:p>" } +
            "</w:body></w:document>",
    )

    private fun read(uri: Uri): Material = runBlocking { reader.read(uri) }

    /** Reads [uri], which must be refused, and returns what the user would be told. */
    private fun refused(uri: Uri): String =
        try {
            val material = read(uri)
            throw AssertionError("Expected the file to be refused, but it was read as $material")
        } catch (e: DocumentException) {
            e.message.orEmpty()
        }

    // -------------------------------------------------------------------------------------------
    // Text files

    @Test
    fun `a text file is read as it is, under its own name`() {
        val text = "Pricing sync, 18 November\n\nDana — three tiers agreed.\n  Marcus to send the deck.\n"
        val material = read(file("pricing notes.txt", text))

        assertEquals(Material.Words("pricing notes.txt", text), material)
    }

    @Test
    fun `other kinds of plain text are read the same way`() {
        for (name in listOf("README.md", "attendees.csv", "call.vtt", "call.srt", "export.json", "page.html", "server.log", "NOTES.TXT")) {
            val material = read(file(name, "Line one of $name\nLine two"))
            assertEquals(name, Material.Words(name, "Line one of $name\nLine two"), material)
        }
    }

    @Test
    fun `accents and other alphabets come through`() {
        val text = "Zoë Müller — café, naïve, 東京, Ελληνικά, emoji 🎉"
        assertEquals(text, (read(file("names.txt", text)) as Material.Words).text)
    }

    @Test
    fun `a byte-order mark at the start is not part of the text`() {
        val material = read(file("from-windows.txt", "﻿First line\nSecond line"))
        assertEquals("First line\nSecond line", (material as Material.Words).text)
    }

    @Test
    fun `a text file with nothing in it is refused`() {
        for ((name, content) in listOf("empty.txt" to "", "blank.txt" to "  \n\t\n  ", "only-a-mark.txt" to "﻿")) {
            val message = refused(file(name, content))
            assertTrue(message, message.contains("\"$name\""))
            assertTrue(message, message.contains("no text"))
        }
    }

    @Test
    fun `a text file at the limit is taken whole and one character over is refused whole`() {
        val limit = DocumentReader.MAX_TEXT_CHARS
        val atLimit = "word ".repeat(limit / 5)
        assertEquals(limit, atLimit.length)
        assertEquals(atLimit, (read(file("long.txt", atLimit)) as Material.Words).text)

        val message = refused(file("too-long.txt", atLimit + "x"))
        assertTrue(message, message.contains("\"too-long.txt\""))
        assertTrue(message, message.contains("too long"))
        assertTrue("the limit is given in round numbers: $message", message.contains("400,000 characters"))
    }

    @Test
    fun `the limit is counted in characters, not bytes`() {
        // Every one of these takes two bytes in the file.
        val accented = "é".repeat(DocumentReader.MAX_TEXT_CHARS)
        assertEquals(accented.length, (read(file("accents.txt", accented)) as Material.Words).text.length)
        assertTrue(refused(file("more-accents.txt", accented + "é")).contains("too long"))
    }

    @Test
    fun `a far longer file is refused just the same, never cut short`() {
        val message = refused(file("enormous.txt", "All work and no play. ".repeat(100_000)))
        assertTrue(message, message.contains("too long"))
    }

    // -------------------------------------------------------------------------------------------
    // Word documents

    @Test
    fun `a Word document is read on the phone into its text`() {
        val material = read(file("Team handbook.docx", docx("Team handbook", "We ship on Thursdays.", "Ask Priya about budgets.")))

        assertEquals(Material.Words("Team handbook.docx", "Team handbook\nWe ship on Thursdays.\nAsk Priya about budgets."), material)
    }

    @Test
    fun `a Word document with nothing written in it is refused`() {
        val message = refused(file("blank.docx", docx("", "   ")))
        assertTrue(message, message.contains("\"blank.docx\""))
        assertTrue(message, message.contains("no text"))
    }

    @Test
    fun `a file called docx that is not a Word document is refused, with what to do about it`() {
        val pretenders = listOf(
            "renamed.docx" to "This was a text file all along.".toByteArray(),
            "spreadsheet.docx" to zip("xl/workbook.xml" to "<workbook/>"),
            "damaged.docx" to zip("word/document.xml" to "<w:document><w:body><w:p><w:r><w:t>Cut off"),
            "nothing.docx" to ByteArray(0),
        )
        for ((name, bytes) in pretenders) {
            val message = refused(file(name, bytes))
            assertTrue(message, message.contains("\"$name\""))
            assertTrue(message, message.contains("doesn't open as a Word document"))
            assertTrue("it says what would work: $message", message.contains(".docx or PDF"))
        }
    }

    @Test
    fun `a Word document too long to take in at once is refused whole`() {
        val message = refused(file("epic.docx", docx("word ".repeat(DocumentReader.MAX_TEXT_CHARS / 5 + 1))))
        assertTrue(message, message.contains("\"epic.docx\""))
        assertTrue(message, message.contains("too long"))
    }

    // -------------------------------------------------------------------------------------------
    // Files Aide can't read

    @Test
    fun `a kind of file Aide cannot open is refused, saying what it can`() {
        for (name in listOf("budget.xlsx", "letter.doc", "deck.pptx", "archive.zip", "recording.m4a", "mystery")) {
            val message = refused(file(name, "whatever is inside"))
            assertTrue(message, message.contains("Aide can't open \"$name\""))
            assertTrue(message, message.contains("PDFs, Word documents (.docx), text files and pictures"))
            assertTrue("it says what to do instead: $message", message.contains("save it as a PDF") && message.contains("paste the text in"))
        }
    }

    @Test
    fun `a file that has gone by the time it is opened is refused, not crashed on`() {
        val gone = Uri.fromFile(File(folder.root, "moved-away.txt"))
        val message = refused(gone)
        assertTrue(message, message.contains("\"moved-away.txt\""))
        assertTrue(message, message.contains("couldn't be"))
    }

    @Test
    fun `a file the app is no longer allowed to open says so`() {
        val uri = Uri.parse("content://com.example.cloud/shared/minutes.txt")
        shadowOf(context.contentResolver).registerInputStreamSupplier(uri) { throw SecurityException("Permission Denial") }

        val message = refused(uri)
        assertTrue(message, message.contains("wasn't allowed to open \"minutes.txt\""))
        assertTrue(message, message.contains("Pick it again"))
    }

    // -------------------------------------------------------------------------------------------
    // Files picked from another app

    @Test
    fun `a file picked from another app is read through the address it was given`() {
        val uri = Uri.parse("content://com.example.cloud/shared/minutes.txt")
        shadowOf(context.contentResolver).registerInputStream(uri, "Agreed: ship on Thursday.".byteInputStream())

        assertEquals(Material.Words("minutes.txt", "Agreed: ship on Thursday."), read(uri))
    }

    @Test
    fun `a picked file goes by the name and kind the phone gives it, whatever its address looks like`() {
        Robolectric.setupContentProvider(PickedFiles::class.java, PickedFiles.AUTHORITY)

        PickedFiles.shown["41"] = PickedFiles.Shown("Q4 brief", "text/plain", saved("a", "The brief itself.".toByteArray()))
        assertEquals(Material.Words("Q4 brief", "The brief itself."), read(PickedFiles.uri("41")))

        val word = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        PickedFiles.shown["42"] = PickedFiles.Shown("Team handbook", word, saved("b", docx("We ship on Thursdays.")))
        assertEquals(Material.Words("Team handbook", "We ship on Thursdays."), read(PickedFiles.uri("42")))

        PickedFiles.shown["43"] = PickedFiles.Shown("Budget 2027", "application/vnd.ms-excel", saved("c", "1,2,3".toByteArray()))
        assertTrue(refused(PickedFiles.uri("43")).contains("Aide can't open \"Budget 2027\""))
    }

    // -------------------------------------------------------------------------------------------
    // Tidying up

    @Test
    fun `reading text leaves the user's file alone and nothing in the cache`() {
        val notes = saved("notes.txt", "Keep me.".toByteArray())
        val handbook = saved("handbook.docx", docx("Keep me too."))
        read(Uri.fromFile(notes))
        read(Uri.fromFile(handbook))
        refused(file("empty.txt", ""))

        assertEquals("Keep me.", notes.readText())
        assertTrue(handbook.exists())
        assertTrue("page images are only for pictures and PDFs", pageCache.listFiles().orEmpty().isEmpty())
    }

    @Test
    fun `discarding pages removes their pictures`() {
        val pages = (1..3).map { saved("page-$it.jpg", byteArrayOf(1, 2, 3)) }
        val other = saved("page-kept.jpg", byteArrayOf(1, 2, 3))

        reader.discard(Material.Pages("scan.pdf", pages))

        assertTrue(pages.none { it.exists() })
        assertTrue("only the pages that were discarded", other.exists())
    }

    @Test
    fun `discarding is safe for words, for pages already gone and for no pages at all`() {
        reader.discard(Material.Words("notes.txt", "Nothing on disk to remove."))
        reader.discard(Material.Pages("Photos", emptyList(), photos = true))
        val gone = File(folder.root, "never-existed.jpg")
        reader.discard(Material.Pages("scan.pdf", listOf(gone)))
        reader.discard(Material.Pages("scan.pdf", listOf(gone)))
        assertFalse(gone.exists())
    }

    @Test
    fun `clearing removes every page picture left in the cache and nothing else`() {
        pageCache.mkdirs()
        val leftovers = listOf("page-1.jpg", "camera-2.jpg", "pdf-3.pdf").map { File(pageCache, it).apply { writeBytes(byteArrayOf(9)) } }
        val elsewhere = File(context.cacheDir, "something-else.tmp").apply { writeBytes(byteArrayOf(9)) }
        val kept = File(context.filesDir, "kept.txt").apply { writeText("kept") }

        reader.clear()

        assertTrue(leftovers.none { it.exists() })
        assertTrue(elsewhere.exists())
        assertTrue(kept.exists())
    }

    @Test
    fun `clearing with nothing to clear is harmless`() {
        pageCache.deleteRecursively()
        reader.clear()
        reader.clear()
        assertTrue(pageCache.listFiles().orEmpty().isEmpty())
    }

    @Test
    fun `a photo the camera never saved is refused and its empty file removed`() {
        val never = File(folder.root, "camera-never.jpg")
        val empty = saved("camera-empty.jpg", ByteArray(0))

        for (taken in listOf(never, empty)) {
            try {
                runBlocking { reader.photo(taken) }
                throw AssertionError("Expected a photo that was never saved to be refused")
            } catch (e: DocumentException) {
                assertEquals("The camera didn't save a picture.", e.message)
            }
            assertFalse(taken.exists())
        }
    }

    /** Stands in for the phone's file picker: files known by a number, each with the name and type the phone would show. */
    class PickedFiles : ContentProvider() {
        class Shown(val name: String, val mime: String, val file: File)

        override fun onCreate(): Boolean = true

        private fun shownAt(uri: Uri): Shown = shown.getValue(uri.lastPathSegment.orEmpty())

        override fun query(uri: Uri, projection: Array<out String>?, selection: String?, selectionArgs: Array<out String>?, sortOrder: String?): Cursor =
            MatrixCursor(arrayOf(OpenableColumns.DISPLAY_NAME)).apply { addRow(arrayOf(shownAt(uri).name)) }

        override fun getType(uri: Uri): String = shownAt(uri).mime

        override fun openFile(uri: Uri, mode: String): ParcelFileDescriptor =
            ParcelFileDescriptor.open(shownAt(uri).file, ParcelFileDescriptor.MODE_READ_ONLY)

        override fun insert(uri: Uri, values: ContentValues?): Uri? = null
        override fun delete(uri: Uri, selection: String?, selectionArgs: Array<out String>?): Int = 0
        override fun update(uri: Uri, values: ContentValues?, selection: String?, selectionArgs: Array<out String>?): Int = 0

        companion object {
            const val AUTHORITY = "com.personal.aide.test.picker"
            val shown = HashMap<String, Shown>()

            fun uri(number: String): Uri = Uri.parse("content://$AUTHORITY/document/$number")
        }
    }
}
