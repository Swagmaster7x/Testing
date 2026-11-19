package com.personal.aide.domain

import org.xml.sax.Attributes
import org.xml.sax.helpers.DefaultHandler
import java.io.IOException
import java.io.InputStream
import java.util.zip.ZipInputStream
import javax.xml.parsers.SAXParserFactory
import kotlin.math.max
import kotlin.math.roundToInt

/** What a file the user picked turns out to be, as far as reading it goes. */
enum class MaterialKind { TEXT, WORD, PDF, IMAGE, UNSUPPORTED }

/** Decides how to read a file from what the phone says it is ([mime]) and what it is called. */
fun materialKind(mime: String?, name: String): MaterialKind {
    val type = mime.orEmpty().lowercase()
    val extension = name.substringAfterLast('.', "").lowercase()
    return when {
        type == "application/pdf" || extension == "pdf" -> MaterialKind.PDF
        type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || extension == "docx" -> MaterialKind.WORD
        type.startsWith("image/") || extension in setOf("jpg", "jpeg", "png", "webp", "heic", "heif", "gif", "bmp") -> MaterialKind.IMAGE
        // Old Word files and other office formats can't be opened without their own software.
        extension in setOf("doc", "rtf", "odt", "pages", "ppt", "pptx", "xls", "xlsx", "key", "numbers") -> MaterialKind.UNSUPPORTED
        type.startsWith("text/") || extension in setOf("txt", "md", "markdown", "csv", "tsv", "log", "vtt", "srt", "json", "xml", "html", "htm") -> MaterialKind.TEXT
        else -> MaterialKind.UNSUPPORTED
    }
}

/** A size no bigger than [maxEdge] on its longer side, in the same proportions. Never enlarges. */
fun fitWithin(width: Int, height: Int, maxEdge: Int): Pair<Int, Int> {
    val longest = max(width, height)
    if (longest <= maxEdge || longest <= 0) return width to height
    val scale = maxEdge.toDouble() / longest
    return max(1, (width * scale).roundToInt()) to max(1, (height * scale).roundToInt())
}

/** A size whose longer side is exactly [edge], in the same proportions: for drawing a page of a PDF. */
fun scaleTo(width: Int, height: Int, edge: Int): Pair<Int, Int> {
    val longest = max(width, height)
    if (longest <= 0) return edge to edge
    val scale = edge.toDouble() / longest
    return max(1, (width * scale).roundToInt()) to max(1, (height * scale).roundToInt())
}

/**
 * The text of a Word document (.docx): its paragraphs a line each, tables a row per line with
 * " | " between cells. Formatting, pictures and comments are left behind.
 * @throws IOException when [input] is not a Word document.
 */
fun docxText(input: InputStream, maxBytes: Long = 40L shl 20): String {
    ZipInputStream(input).use { zip ->
        while (true) {
            val entry = zip.nextEntry ?: break
            if (entry.name == "word/document.xml") return wordXmlText(Capped(zip, maxBytes))
        }
    }
    throw IOException("No Word document inside")
}

/** Stops a small file that unpacks into an enormous one from being read to the end. */
private class Capped(private val source: InputStream, private var left: Long) : InputStream() {
    override fun read(): Int {
        if (left <= 0) throw IOException("Document too large")
        val value = source.read()
        if (value >= 0) left--
        return value
    }

    override fun read(buffer: ByteArray, offset: Int, length: Int): Int {
        if (left <= 0) throw IOException("Document too large")
        val count = source.read(buffer, offset, minOf(length.toLong(), left).toInt())
        if (count > 0) left -= count
        return count
    }
}

internal fun wordXmlText(xml: InputStream): String {
    val out = StringBuilder()
    val handler = object : DefaultHandler() {
        private var inText = false
        private var cells = 0
        /** Inside the list of where a paragraph's tab stops are set, which is formatting and not text. */
        private var tabStops = 0
        /** Inside the plain copy Word keeps of a text box for older software; the real one is read. */
        private var fallback = 0

        override fun startElement(uri: String?, localName: String?, qName: String, attributes: Attributes?) {
            val name = qName.substringAfter(':')
            if (name == "Fallback") fallback++
            if (fallback > 0) return
            when (name) {
                "t" -> inText = true
                "tabs" -> tabStops++
                "tab" -> if (tabStops == 0) out.append('\t')
                "br", "cr" -> out.append('\n')
                "tc" -> cells++
            }
        }

        override fun endElement(uri: String?, localName: String?, qName: String) {
            val name = qName.substringAfter(':')
            if (name == "Fallback") {
                fallback = (fallback - 1).coerceAtLeast(0)
                return
            }
            if (fallback > 0) return
            when (name) {
                "tabs" -> tabStops = (tabStops - 1).coerceAtLeast(0)
                "t" -> inText = false
                // Inside a table a paragraph is part of a cell, not a line of its own.
                "p" -> out.append(if (cells > 0) ' ' else '\n')
                "tc" -> {
                    cells = (cells - 1).coerceAtLeast(0)
                    trimEnd()
                    out.append(" | ")
                }
                "tr" -> {
                    if (out.endsWith(" | ")) out.setLength(out.length - 3)
                    out.append('\n')
                }
            }
        }

        override fun characters(chars: CharArray, start: Int, length: Int) {
            if (inText && fallback == 0) out.append(chars, start, length)
        }

        private fun trimEnd() {
            while (out.isNotEmpty() && out.last() == ' ') out.setLength(out.length - 1)
        }
    }
    val factory = SAXParserFactory.newInstance()
    // A document has no business pulling in anything from outside itself.
    runCatching { factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true) }
    runCatching { factory.setFeature("http://xml.org/sax/features/external-general-entities", false) }
    try {
        factory.newSAXParser().parse(xml, handler)
    } catch (e: IOException) {
        throw e
    } catch (e: Exception) {
        throw IOException("The document's text couldn't be read", e)
    }
    return out.toString().lines()
        // A row of empty cells is only its dividers; it says nothing.
        .joinToString("\n") { line -> if (line.all { it == '|' || it.isWhitespace() }) "" else line.trimEnd() }
        .replace(Regex("\n{3,}"), "\n\n").trim()
}

/**
 * Puts together everything the user added in one go, in the order they added it: what they
 * typed first, then each file under a line naming it.
 */
fun intakeText(typed: String, sections: List<Pair<String, String>>): String = buildString {
    if (typed.isNotBlank()) append(typed.trim())
    for ((name, text) in sections) {
        if (text.isBlank()) continue
        if (isNotEmpty()) append("\n\n")
        append("=== ").append(name).append(" ===\n").append(text.trim())
    }
}
