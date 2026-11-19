package com.personal.aide.ui

import com.personal.aide.ai.IntakeState
import com.personal.aide.data.Material
import com.personal.aide.ui.meetings.AddKind
import com.personal.aide.ui.meetings.AddState
import com.personal.aide.ui.meetings.joinMaterial
import com.personal.aide.ui.meetings.materialDetail
import com.personal.aide.ui.meetings.readingCost
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import java.io.File
import java.util.Locale

/** The small decisions the "Add to Aide" screen makes about what the user has added so far. */
class AddHelpersTest {
    private lateinit var localeBefore: Locale

    @Before
    fun useAKnownLocale() {
        // Numbers on the screen are written the way the phone writes them.
        localeBefore = Locale.getDefault()
        Locale.setDefault(Locale.US)
    }

    @After
    fun restoreLocale() {
        Locale.setDefault(localeBefore)
    }

    /** Names of files that are never opened: these helpers only count and group them. */
    private fun files(vararg names: String): List<File> = names.map { File("/nowhere/$it") }

    private fun photo(vararg names: String) = Material.Pages("Photo", files(*names), photos = true)

    private fun pdf(name: String, vararg pages: String) = Material.Pages(name, files(*pages))

    private fun words(name: String, text: String = "Some words.") = Material.Words(name, text)

    // -------------------------------------------------------------------------------------------
    // Adding to the list

    @Test
    fun `the first thing added starts the list`() {
        val first = photo("a.jpg")
        assertEquals(listOf<Material>(first), joinMaterial(emptyList(), first))
        assertSame("a lone photo is kept as it came", first, joinMaterial(emptyList(), first).single())
    }

    @Test
    fun `photographs taken one after another collect into one set, in the order taken`() {
        var list = joinMaterial(emptyList(), photo("a.jpg"))
        list = joinMaterial(list, photo("b.jpg"))
        list = joinMaterial(list, photo("c.jpg", "d.jpg"))

        assertEquals(listOf<Material>(Material.Pages("Photos", files("a.jpg", "b.jpg", "c.jpg", "d.jpg"), photos = true)), list)
    }

    @Test
    fun `a photograph does not join a PDF, nor a PDF a photograph`() {
        val scan = pdf("scan.pdf", "p1.jpg", "p2.jpg")
        val shot = photo("a.jpg")

        assertEquals(listOf<Material>(scan, shot), joinMaterial(listOf(scan), shot))
        assertEquals(listOf<Material>(shot, scan), joinMaterial(listOf(shot), scan))
        assertEquals("two PDFs stay two documents", listOf<Material>(scan, pdf("other.pdf", "q1.jpg")), joinMaterial(listOf(scan), pdf("other.pdf", "q1.jpg")))
    }

    @Test
    fun `words are always added as their own item`() {
        val notes = words("notes.txt")
        val more = words("more.txt")
        assertEquals(listOf<Material>(notes, more), joinMaterial(listOf(notes), more))
        assertEquals(listOf<Material>(photo("a.jpg"), notes), joinMaterial(listOf(photo("a.jpg")), notes))
        assertEquals(listOf<Material>(notes, photo("a.jpg")), joinMaterial(listOf(notes), photo("a.jpg")))
    }

    @Test
    fun `photographs join only the set just before them, so the order things were added in is kept`() {
        val notes = words("agenda.txt")
        var list = joinMaterial(emptyList(), photo("a.jpg"))
        list = joinMaterial(list, photo("b.jpg"))
        list = joinMaterial(list, notes)
        list = joinMaterial(list, photo("c.jpg"))
        list = joinMaterial(list, photo("d.jpg"))

        assertEquals(
            listOf(
                Material.Pages("Photos", files("a.jpg", "b.jpg"), photos = true),
                notes,
                Material.Pages("Photos", files("c.jpg", "d.jpg"), photos = true),
            ),
            list,
        )
    }

    @Test
    fun `adding never changes the list it was given`() {
        val before = listOf<Material>(photo("a.jpg"))
        val snapshot = before.toList()
        joinMaterial(before, photo("b.jpg"))
        joinMaterial(before, words("notes.txt"))
        assertEquals(snapshot, before)
        assertEquals(1, (before.single() as Material.Pages).files.size)
    }

    // -------------------------------------------------------------------------------------------
    // What the screen shows of it

    @Test
    fun `the pages for Claude to read are the photographs and PDF pages, not the words`() {
        assertEquals(0, AddState().pageCount)
        assertEquals(0, AddState(materials = listOf(words("notes.txt"), words("more.txt"))).pageCount)
        assertEquals(
            2 + 3 + 1,
            AddState(
                materials = listOf(
                    Material.Pages("Photos", files("a.jpg", "b.jpg"), photos = true),
                    words("notes.txt"),
                    pdf("scan.pdf", "p1.jpg", "p2.jpg", "p3.jpg"),
                    photo("c.jpg"),
                ),
            ).pageCount,
        )
    }

    @Test
    fun `the screen is busy only while something is being taken in`() {
        assertFalse(AddState().working)
        assertTrue(AddState(intake = IntakeState.Working(0, 0)).working)
        assertTrue(AddState(intake = IntakeState.Working(3, 9)).working)
        assertFalse(AddState(intake = IntakeState.Done(7)).working)
        assertFalse(AddState(intake = IntakeState.Failed("Claude is busy right now.")).working)
        assertFalse("opening a file on the phone is not the same as taking it in", AddState(opening = true).working)
    }

    @Test
    fun `adding starts out as notes from a meeting`() {
        assertEquals(AddKind.MEETING, AddState().kind)
        assertEquals(emptyList<Material>(), AddState().materials)
        assertEquals(IntakeState.Idle, AddState().intake)
    }

    // -------------------------------------------------------------------------------------------
    // What it will cost

    @Test
    fun `a handful of pages costs a few cents`() {
        for (pages in 1..3) assertEquals("$pages pages", "a few cents", readingCost(pages))
    }

    @Test
    fun `more pages are priced to the nearest five cents below`() {
        assertEquals("roughly 10 cents", readingCost(4))
        assertEquals("roughly 10 cents", readingCost(5))
        assertEquals("roughly 15 cents", readingCost(6))
        assertEquals("roughly 25 cents", readingCost(10))
        assertEquals("roughly 50 cents", readingCost(20))
        assertEquals("roughly 95 cents", readingCost(39))
    }

    @Test
    fun `from a dollar up it is given in dollars and cents`() {
        assertEquals("roughly $1.00", readingCost(40))
        assertEquals("roughly $1.50", readingCost(60))
        assertEquals("roughly $2.50", readingCost(100))
        assertEquals("roughly $5.00", readingCost(200))
    }

    @Test
    fun `more pages never read as cheaper`() {
        fun cents(text: String): Double = when {
            text == "a few cents" -> 5.0
            text.endsWith(" cents") -> text.removePrefix("roughly ").removeSuffix(" cents").toDouble()
            else -> text.removePrefix("roughly $").toDouble() * 100
        }
        val costs = (1..120).map { cents(readingCost(it)) }
        assertEquals(costs.sorted(), costs)
        assertTrue("sixty pages, the most a PDF may have, is still small change", costs[59] <= 200.0)
    }

    // -------------------------------------------------------------------------------------------
    // The line under each item

    @Test
    fun `words are described by how many there are`() {
        assertEquals("1 word", materialDetail(words("a.txt", "Hello")))
        assertEquals("2 words", materialDetail(words("a.txt", "Hello there")))
        assertEquals("6 words", materialDetail(words("a.txt", "  Dana:\tlet's start.\n\nMarcus: pricing first. ")))
        assertEquals("1,234 words", materialDetail(words("a.txt", "word ".repeat(1_234))))
        assertEquals("0 words", materialDetail(words("a.txt", "  ")))
    }

    @Test
    fun `photographs are counted as photos and the pages of a PDF as pages`() {
        assertEquals("1 photo", materialDetail(photo("a.jpg")))
        assertEquals("3 photos", materialDetail(Material.Pages("Photos", files("a.jpg", "b.jpg", "c.jpg"), photos = true)))
        assertEquals("1 page", materialDetail(pdf("letter.pdf", "p1.jpg")))
        assertEquals("12 pages", materialDetail(pdf("handbook.pdf", *(1..12).map { "p$it.jpg" }.toTypedArray())))
    }
}
