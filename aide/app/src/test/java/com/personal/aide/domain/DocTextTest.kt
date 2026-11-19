package com.personal.aide.domain

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class DocTextTest {
    @get:Rule
    val folder = TemporaryFolder()

    // -------------------------------------------------------------------------------------------
    // Making Word documents

    private val wordNamespace = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

    /** The main part of a Word document with [body] as its content. */
    private fun documentXml(body: String) =
        """<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="$wordNamespace"><w:body>$body<w:sectPr><w:pgSz w:w="12240" w:h="15840"/></w:sectPr></w:body></w:document>"""

    /** A paragraph of plain text, the way Word writes one. */
    private fun p(vararg runs: String) = "<w:p>" + runs.joinToString("") { r(it) } + "</w:p>"

    private fun r(text: String) = """<w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">$text</w:t></w:r>"""

    private fun cell(vararg paragraphs: String) = "<w:tc><w:tcPr><w:tcW w:w=\"2880\" w:type=\"dxa\"/></w:tcPr>" + paragraphs.joinToString("") + "</w:tc>"

    private fun row(vararg cells: String) = "<w:tr>" + cells.joinToString("") + "</w:tr>"

    private fun table(vararg rows: String) = "<w:tbl><w:tblPr><w:tblW w:w=\"0\" w:type=\"auto\"/></w:tblPr>" + rows.joinToString("") + "</w:tbl>"

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

    /** A .docx file as Word saves it: the text among the other parts every document carries. */
    private fun docx(body: String): ByteArray = zip(
        "[Content_Types].xml" to """<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>""",
        "_rels/.rels" to """<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>""",
        "word/styles.xml" to """<?xml version="1.0"?><w:styles xmlns:w="$wordNamespace"><w:style><w:name w:val="Normal"/></w:style></w:styles>""",
        "word/document.xml" to documentXml(body),
        "word/footer1.xml" to """<?xml version="1.0"?><w:ftr xmlns:w="$wordNamespace"><w:p><w:r><w:t>Confidential footer</w:t></w:r></w:p></w:ftr>""",
        "docProps/core.xml" to """<?xml version="1.0"?><coreProperties><title>Not the text</title></coreProperties>""",
    )

    private fun textOf(body: String): String = docxText(ByteArrayInputStream(docx(body)))

    @Test
    fun `a text box is read once, not again from the plain copy kept for older software`() {
        val box = "<w:p><w:r><mc:AlternateContent xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\">" +
            "<mc:Choice Requires=\"wps\"><w:drawing><w:txbxContent>" + p("Launch is 9 February") + "</w:txbxContent></w:drawing></mc:Choice>" +
            "<mc:Fallback><w:pict><w:txbxContent>" + p("Launch is 9 February") + "</w:txbxContent></w:pict></mc:Fallback>" +
            "</mc:AlternateContent></w:r></w:p>"

        val text = textOf(p("Before") + box + p("After"))

        assertEquals(1, Regex("Launch is 9 February").findAll(text).count())
        assertTrue(text, text.startsWith("Before") && text.endsWith("After"))
    }

    @Test
    fun `a table with nothing in it adds nothing`() {
        val empty = table(row(cell("<w:p/>"), cell("<w:p/>")), row(cell("<w:p/>"), cell("<w:p/>")))

        assertEquals("Above\n\nBelow", textOf(p("Above") + empty + p("Below")))
        // And a document that is nothing but an empty table has no text at all.
        assertEquals("", textOf(empty))
    }

    private fun refused(bytes: ByteArray, maxBytes: Long? = null): IOException =
        try {
            val text = if (maxBytes == null) docxText(ByteArrayInputStream(bytes)) else docxText(ByteArrayInputStream(bytes), maxBytes)
            throw AssertionError("Expected the file to be refused, but it read as: $text")
        } catch (e: IOException) {
            e
        }

    // -------------------------------------------------------------------------------------------
    // What kind of file something is

    @Test
    fun `a file is read by what the phone says it is`() {
        assertEquals(MaterialKind.PDF, materialKind("application/pdf", "Q4 brief"))
        assertEquals(MaterialKind.WORD, materialKind("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Handbook"))
        assertEquals(MaterialKind.IMAGE, materialKind("image/jpeg", "IMG_0042"))
        assertEquals(MaterialKind.IMAGE, materialKind("image/png", "whiteboard"))
        assertEquals(MaterialKind.IMAGE, materialKind("image/heic", "IMG_0043"))
        assertEquals(MaterialKind.TEXT, materialKind("text/plain", "notes"))
        assertEquals(MaterialKind.TEXT, materialKind("text/markdown", "README"))
        assertEquals(MaterialKind.TEXT, materialKind("text/csv", "attendees"))
    }

    @Test
    fun `and by its name when the phone does not say, or says nothing useful`() {
        for (mime in listOf(null, "", "application/octet-stream")) {
            assertEquals(MaterialKind.PDF, materialKind(mime, "Q4 brief.pdf"))
            assertEquals(MaterialKind.WORD, materialKind(mime, "Handbook.docx"))
            for (picture in listOf("a.jpg", "a.jpeg", "a.png", "a.webp", "a.heic", "a.heif", "a.gif", "a.bmp")) {
                assertEquals(picture, MaterialKind.IMAGE, materialKind(mime, picture))
            }
            for (text in listOf("a.txt", "a.md", "a.markdown", "a.csv", "a.tsv", "a.log", "a.vtt", "a.srt", "a.json", "a.xml", "a.html", "a.htm")) {
                assertEquals(text, MaterialKind.TEXT, materialKind(mime, text))
            }
        }
    }

    @Test
    fun `capitals in the type or the name make no difference`() {
        assertEquals(MaterialKind.PDF, materialKind("Application/PDF", "scan"))
        assertEquals(MaterialKind.PDF, materialKind(null, "SCAN.PDF"))
        assertEquals(MaterialKind.WORD, materialKind(null, "Handbook.DOCX"))
        assertEquals(MaterialKind.IMAGE, materialKind("IMAGE/JPEG", "photo"))
        assertEquals(MaterialKind.IMAGE, materialKind(null, "IMG_0042.JPG"))
        assertEquals(MaterialKind.TEXT, materialKind("Text/Plain", "notes"))
        assertEquals(MaterialKind.TEXT, materialKind(null, "NOTES.TXT"))
    }

    @Test
    fun `only the last part of a name is its kind`() {
        assertEquals(MaterialKind.TEXT, materialKind(null, "minutes.v2.final.txt"))
        assertEquals(MaterialKind.PDF, materialKind(null, "handbook.docx.pdf"))
        assertEquals(MaterialKind.UNSUPPORTED, materialKind(null, "notes.txt.zip"))
        assertEquals("a file merely called pdf is not a PDF", MaterialKind.UNSUPPORTED, materialKind(null, "pdf"))
        assertEquals(MaterialKind.UNSUPPORTED, materialKind(null, "docx"))
        assertEquals(MaterialKind.UNSUPPORTED, materialKind(null, "notes."))
        assertEquals(MaterialKind.UNSUPPORTED, materialKind(null, ""))
    }

    @Test
    fun `old Word files and other office formats are not mistaken for something readable`() {
        for (name in listOf("letter.doc", "letter.rtf", "letter.odt", "letter.pages", "deck.ppt", "deck.pptx", "deck.key", "budget.xls", "budget.xlsx", "budget.numbers")) {
            assertEquals(name, MaterialKind.UNSUPPORTED, materialKind(null, name))
            assertEquals("$name, even when the phone calls it text", MaterialKind.UNSUPPORTED, materialKind("text/plain", name))
        }
        assertEquals(MaterialKind.UNSUPPORTED, materialKind("application/msword", "letter.doc"))
        assertEquals(MaterialKind.UNSUPPORTED, materialKind("application/vnd.ms-excel", "budget"))
        assertEquals(MaterialKind.UNSUPPORTED, materialKind("application/zip", "archive.zip"))
        assertEquals(MaterialKind.UNSUPPORTED, materialKind("audio/mpeg", "recording.mp3"))
        assertEquals(MaterialKind.UNSUPPORTED, materialKind("video/mp4", "call.mp4"))
        assertEquals(MaterialKind.UNSUPPORTED, materialKind(null, "mystery"))
    }

    // -------------------------------------------------------------------------------------------
    // Sizes

    @Test
    fun `a picture is shrunk to fit, keeping its shape`() {
        assertEquals(2_200 to 1_650, fitWithin(4_000, 3_000, 2_200))
        assertEquals(1_650 to 2_200, fitWithin(3_000, 4_000, 2_200))
        assertEquals(2_200 to 2_200, fitWithin(8_800, 8_800, 2_200))
        assertEquals(1_000 to 333, fitWithin(3_000, 1_000, 1_000))
    }

    @Test
    fun `a picture that already fits is never enlarged`() {
        assertEquals(800 to 600, fitWithin(800, 600, 2_200))
        assertEquals(2_200 to 2_200, fitWithin(2_200, 2_200, 2_200))
        assertEquals(1 to 2_200, fitWithin(1, 2_200, 2_200))
        assertEquals(1 to 1, fitWithin(1, 1, 2_200))
    }

    @Test
    fun `a very long thin picture keeps at least one pixel across`() {
        assertEquals(2_200 to 1, fitWithin(100_000, 10, 2_200))
        assertEquals(1 to 2_200, fitWithin(10, 100_000, 2_200))
    }

    @Test
    fun `a picture with no size is passed back as it is`() {
        assertEquals(0 to 0, fitWithin(0, 0, 2_200))
    }

    @Test
    fun `a page is drawn with its longer side exactly at the size asked for`() {
        // A US Letter page, in the points a PDF measures in.
        assertEquals(1_391 to 1_800, scaleTo(612, 792, 1_800))
        assertEquals("landscape", 1_800 to 1_391, scaleTo(792, 612, 1_800))
        assertEquals("a big page is brought down", 1_800 to 900, scaleTo(7_200, 3_600, 1_800))
        assertEquals("a small one is brought up", 1_800 to 1_800, scaleTo(10, 10, 1_800))
        assertEquals(1_800 to 1, scaleTo(100_000, 10, 1_800))
        assertEquals("a page with no size still gets a canvas", 1_800 to 1_800, scaleTo(0, 0, 1_800))
    }

    // -------------------------------------------------------------------------------------------
    // Reading a Word document

    @Test
    fun `paragraphs come out a line each`() {
        assertEquals(
            "Team handbook\nWe ship on Thursdays.\nAsk Priya about budgets.",
            textOf(p("Team handbook") + p("We ship on Thursdays.") + p("Ask Priya about budgets.")),
        )
    }

    @Test
    fun `text split across runs is joined without gaps, and its own spaces are kept`() {
        assertEquals("RateStream is the pricing engine.", textOf(p("Rate", "Stream", " is the ", "pricing engine.")))
    }

    @Test
    fun `special characters come through as themselves`() {
        assertEquals(
            "R&D < 5% of \"budget\" — Zoë’s café, 東京",
            textOf(p("R&amp;D &lt; 5% of &quot;budget&quot; — Zoë’s café, 東京")),
        )
    }

    @Test
    fun `a table reads a row per line with bars between the cells`() {
        val body = p("Owners") + table(
            row(cell(p("Area")), cell(p("Owner")), cell(p("Due"))),
            row(cell(p("Pricing")), cell(p("Dana Whitfield")), cell(p("20 Nov"))),
            row(cell(p("Quoting API")), cell(p("Marcus Lee")), cell(p("4 Dec"))),
        ) + p("Ends.")

        assertEquals(
            "Owners\n" +
                "Area | Owner | Due\n" +
                "Pricing | Dana Whitfield | 20 Nov\n" +
                "Quoting API | Marcus Lee | 4 Dec\n" +
                "Ends.",
            textOf(body),
        )
    }

    @Test
    fun `several paragraphs in one cell stay in that cell`() {
        val body = table(row(cell(p("Dana Whitfield"), p("Engineering lead")), cell(p("Owns the quoting API"))))
        assertEquals("Dana Whitfield Engineering lead | Owns the quoting API", textOf(body))
    }

    @Test
    fun `an empty cell keeps its place in the row`() {
        val body = table(
            row(cell(p("Area")), cell(p("Owner")), cell(p("Due"))),
            row(cell(p("Pricing")), cell(p()), cell(p("20 Nov"))),
        )
        val (header, pricing) = textOf(body).lines()
        assertEquals("Area | Owner | Due", header)
        assertEquals(listOf("Pricing", "", "20 Nov"), pricing.split("|").map { it.trim() })
    }

    @Test
    fun `tabs and line breaks inside a paragraph are kept`() {
        val body = """<w:p><w:r><w:t>Name:</w:t><w:tab/><w:t>Sam Rivera</w:t><w:br/><w:t>Role:</w:t><w:tab/><w:t>Product</w:t></w:r></w:p>""" +
            """<w:p><w:r><w:t>First line</w:t><w:cr/><w:t>Second line</w:t></w:r></w:p>"""
        assertEquals("Name:\tSam Rivera\nRole:\tProduct\nFirst line\nSecond line", textOf(body))
    }

    @Test
    fun `a page break starts a new line and does not run two words together`() {
        val body = """<w:p><w:r><w:t>End of page one</w:t></w:r><w:r><w:br w:type="page"/></w:r><w:r><w:t>Start of page two</w:t></w:r></w:p>"""
        assertEquals("End of page one\nStart of page two", textOf(body))
    }

    @Test
    fun `where a paragraph's tab stops are set is formatting, not tabs in its text`() {
        // What Word writes for a line with its own tab stops, such as an entry in a table of contents.
        val body = p("Contents") +
            """<w:p><w:pPr><w:tabs><w:tab w:val="left" w:pos="2880"/><w:tab w:val="right" w:leader="dot" w:pos="9350"/></w:tabs></w:pPr>""" +
            """<w:r><w:t>Pricing</w:t></w:r><w:r><w:tab/></w:r><w:r><w:t>12</w:t></w:r></w:p>""" +
            p("Next line")
        assertEquals("Contents\nPricing\t12\nNext line", textOf(body))
    }

    @Test
    fun `formatting, pictures, field codes and deleted text are left behind`() {
        val body = """<w:p><w:pPr><w:pStyle w:val="Heading1"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FF0000"/></w:rPr><w:t>Launch plan</w:t></w:r></w:p>""" +
            """<w:p><w:r><w:drawing><wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><wp:docPr id="1" name="Picture 1" descr="A chart of revenue"/></wp:inline></w:drawing></w:r><w:r><w:t>See the chart.</w:t></w:r></w:p>""" +
            """<w:p><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE \* MERGEFORMAT </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r><w:r><w:t>Page shown here</w:t></w:r></w:p>""" +
            """<w:p><w:del w:id="1" w:author="Sam"><w:r><w:delText>in March</w:delText></w:r></w:del><w:ins w:id="2" w:author="Sam"><w:r><w:t>in April</w:t></w:r></w:ins></w:p>""" +
            // A comment and a footnote hang off the text here; what they say is kept in other parts of the file.
            """<w:p><w:commentRangeStart w:id="7"/><w:r><w:t>Budget approved</w:t></w:r><w:commentRangeEnd w:id="7"/><w:r><w:commentReference w:id="7"/></w:r><w:r><w:footnoteReference w:id="2"/></w:r><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p>"""

        assertEquals("Launch plan\nSee the chart.\nPage shown here\nin April\nBudget approved", textOf(body))
    }

    @Test
    fun `only the body of the document is read, not its footers, styles or properties`() {
        val text = textOf(p("The body."))
        assertEquals("The body.", text)
        assertFalse(text.contains("footer"))
    }

    @Test
    fun `runs of empty paragraphs shrink to one blank line and the ends are trimmed`() {
        val body = p() + p() + p("Heading") + p() + p() + p() + p() + p("Body  ") + p() + p()
        assertEquals("Heading\n\nBody", textOf(body))
    }

    @Test
    fun `a document with nothing written in it reads as empty`() {
        assertEquals("", textOf(""))
        assertEquals("", textOf(p() + p("   ") + p()))
        val emptyTable = textOf(table(row(cell(p()), cell(p())), row(cell(p()), cell(p()))))
        assertFalse("an empty table has no words in it: \"$emptyTable\"", emptyTable.any { it.isLetterOrDigit() })
    }

    @Test
    fun `a long document is read to the end`() {
        val lines = (1..5_000).map { "Paragraph $it of the handbook." }
        assertEquals(lines.joinToString("\n"), textOf(lines.joinToString("") { p(it) }))
    }

    @Test
    fun `the document part is found wherever it sits in the file`() {
        val first = zip("word/document.xml" to documentXml(p("Found first.")), "word/styles.xml" to "<styles/>")
        val last = zip("word/styles.xml" to "<styles/>", "word/media/image1.png" to "not really a picture", "word/document.xml" to documentXml(p("Found last.")))
        assertEquals("Found first.", docxText(ByteArrayInputStream(first)))
        assertEquals("Found last.", docxText(ByteArrayInputStream(last)))
    }

    @Test
    fun `the words are read the same whatever prefix the file gives Word's elements`() {
        val unprefixed = """<?xml version="1.0"?><document xmlns="$wordNamespace"><body><p><r><t>No prefix.</t></r></p><p><r><t>Second</t><tab/><t>line</t></r></p></body></document>"""
        assertEquals("No prefix.\nSecond\tline", wordXmlText(ByteArrayInputStream(unprefixed.toByteArray())))
    }

    // -------------------------------------------------------------------------------------------
    // Files that are not Word documents

    @Test
    fun `a zip that is not a Word document is refused`() {
        val spreadsheet = zip("[Content_Types].xml" to "<Types/>", "xl/workbook.xml" to "<workbook/>", "xl/worksheets/sheet1.xml" to "<worksheet/>")
        assertEquals("No Word document inside", refused(spreadsheet).message)

        val lookalike = zip("document.xml" to documentXml(p("Not in the word folder")), "word/Document.XML.bak" to "x", "other/word/document.xml" to documentXml(p("Nested")))
        refused(lookalike)

        refused(zip())
    }

    @Test
    fun `a file that is not a zip at all is refused`() {
        refused("Just some text that somebody named handbook.docx".toByteArray())
        refused(ByteArray(0))
        // An old binary .doc file starts like this.
        refused(byteArrayOf(0xD0.toByte(), 0xCF.toByte(), 0x11, 0xE0.toByte(), 0xA1.toByte(), 0xB1.toByte(), 0x1A, 0xE1.toByte()) + ByteArray(512))
    }

    @Test
    fun `a Word document whose text is damaged is refused, not half read`() {
        refused(zip("word/document.xml" to """<?xml version="1.0"?><w:document xmlns:w="$wordNamespace"><w:body><w:p><w:r><w:t>Cut off mid"""))
        refused(zip("word/document.xml" to "this is not XML"))
        refused(zip("word/document.xml" to ""))
    }

    @Test
    fun `a small file that unpacks into an enormous one is not read to the end`() {
        // Highly repetitive text packs to almost nothing.
        val bomb = docx(p("A".repeat(200_000)))
        assertTrue("the file itself is small: ${bomb.size} bytes", bomb.size < 10_000)

        assertEquals("Document too large", refused(bomb, maxBytes = 50_000).message)
        assertEquals("with room to spare it reads normally", 200_000, docxText(ByteArrayInputStream(bomb), maxBytes = 1_000_000).length)
    }

    @Test
    fun `a document cannot pull in a file from outside itself`() {
        val secret = folder.newFile("secret.txt").apply { writeText("TOP-SECRET-MARKER") }
        val xml = """<?xml version="1.0"?><!DOCTYPE w:document [<!ENTITY outside SYSTEM "${secret.toURI()}">]>""" +
            """<w:document xmlns:w="$wordNamespace"><w:body><w:p><w:r><w:t>Before &outside; after</w:t></w:r></w:p></w:body></w:document>"""
        try {
            val text = docxText(ByteArrayInputStream(zip("word/document.xml" to xml)))
            assertFalse("the document read a file from the phone: $text", text.contains("TOP-SECRET-MARKER"))
        } catch (e: IOException) {
            // Refusing such a document outright is fine too.
        }
    }

    // -------------------------------------------------------------------------------------------
    // Putting together what the user added

    @Test
    fun `what was typed comes first, then each file under a line naming it, in the order they were added`() {
        val text = intakeText(
            "Met with Dana about pricing.",
            listOf("whiteboard.jpg" to "--- page 1 ---\nThree tiers", "Handbook.docx" to "We ship on Thursdays.", "agenda.txt" to "1. Pricing\n2. Hiring"),
        )
        assertEquals(
            "Met with Dana about pricing.\n\n" +
                "=== whiteboard.jpg ===\n--- page 1 ---\nThree tiers\n\n" +
                "=== Handbook.docx ===\nWe ship on Thursdays.\n\n" +
                "=== agenda.txt ===\n1. Pricing\n2. Hiring",
            text,
        )
    }

    @Test
    fun `with nothing typed the first file starts the text`() {
        assertEquals("=== notes.txt ===\nOne line.", intakeText("", listOf("notes.txt" to "One line.")))
        assertEquals("=== notes.txt ===\nOne line.", intakeText("  \n\t", listOf("notes.txt" to "One line.")))
    }

    @Test
    fun `with no files what was typed is all there is`() {
        assertEquals("Just my notes.", intakeText("  Just my notes.\n\n", emptyList()))
    }

    @Test
    fun `a file with nothing in it is skipped, without leaving its heading or a gap behind`() {
        val text = intakeText(
            "Typed.",
            listOf("empty.txt" to "", "blank.docx" to "  \n ", "real.txt" to "Something.", "also-empty.txt" to "\n", "last.txt" to "The end."),
        )
        assertEquals("Typed.\n\n=== real.txt ===\nSomething.\n\n=== last.txt ===\nThe end.", text)

        assertEquals("=== real.txt ===\nSomething.", intakeText("", listOf("empty.txt" to " ", "real.txt" to "Something.")))
    }

    @Test
    fun `nothing typed and nothing in the files gives nothing at all`() {
        assertEquals("", intakeText("", emptyList()))
        assertEquals("", intakeText("   ", listOf("a.txt" to "", "b.txt" to "  \n")))
    }

    @Test
    fun `the text of each part is trimmed at its ends and left alone inside`() {
        assertEquals(
            "First line\n\n  indented second\n\n=== a.txt ===\nOne\n\n\nTwo",
            intakeText("\n\nFirst line\n\n  indented second\n", listOf("a.txt" to "\n One\n\n\nTwo  \n")),
        )
    }

    @Test
    fun `two files with the same name both stay, each under its own heading`() {
        assertEquals(
            "=== Photo ===\nFirst\n\n=== Photo ===\nSecond",
            intakeText("", listOf("Photo" to "First", "Photo" to "Second")),
        )
    }

    @Test
    fun `the docx reader gives up with a message rather than anything stranger`() {
        try {
            docxText(ByteArrayInputStream(zip("word/document.xml" to "<w:document><w:body></w:document>")))
            fail("Expected mismatched XML to be refused")
        } catch (e: IOException) {
            assertTrue(e.message.orEmpty().isNotBlank())
        }
    }
}
