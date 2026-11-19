package com.personal.aide.data

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.graphics.Matrix
import android.graphics.pdf.PdfRenderer
import android.media.ExifInterface
import android.net.Uri
import android.os.ParcelFileDescriptor
import android.provider.OpenableColumns
import androidx.core.content.FileProvider
import com.personal.aide.domain.MaterialKind
import com.personal.aide.domain.docxText
import com.personal.aide.domain.fitWithin
import com.personal.aide.domain.materialKind
import com.personal.aide.domain.scaleTo
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.IOException
import java.io.InputStream
import java.util.UUID
import kotlin.math.max

/** Something the user picked couldn't be read; the message says why in words meant for them. */
class DocumentException(message: String) : Exception(message)

/** Something the user added, opened and ready to be taken in. */
sealed interface Material {
    val name: String

    /** Text that could be read straight off the phone: a text file, a Word document. */
    data class Words(override val name: String, val text: String) : Material

    /**
     * Pictures of pages, as JPEG files in the app's cache: photographs, or the pages of a PDF.
     * Claude reads these. [photos] says the user took or chose them one by one, so more can join.
     */
    data class Pages(override val name: String, val files: List<File>, val photos: Boolean = false) : Material
}

/**
 * Opens what the user picks. Text and Word documents are read on the phone; pictures and PDFs
 * are turned into page images of a sensible size for Claude to read. Nothing here leaves the
 * phone, and nothing is kept: the page images live in the cache until they have been read.
 */
class DocumentReader(context: Context) {
    private val context = context.applicationContext
    private val pages: File get() = File(context.cacheDir, PAGE_DIR).apply { mkdirs() }

    /** Reads the file at [uri], whatever it turns out to be. */
    suspend fun read(uri: Uri): Material = withContext(Dispatchers.IO) {
        val name = nameOf(uri)
        val mime = runCatching { context.contentResolver.getType(uri) }.getOrNull()
        try {
            when (materialKind(mime, name)) {
                MaterialKind.TEXT -> Material.Words(name, readText(uri, name))
                MaterialKind.WORD -> Material.Words(name, readWord(uri, name))
                MaterialKind.PDF -> Material.Pages(name, renderPdf(uri, name))
                MaterialKind.IMAGE -> Material.Pages(name, listOf(pageFromImage(name) { open(uri) }), photos = true)
                MaterialKind.UNSUPPORTED -> throw DocumentException(
                    "Aide can't open \"$name\". It reads PDFs, Word documents (.docx), text files and pictures. " +
                        "For anything else, save it as a PDF first, or paste the text in.",
                )
            }
        } catch (e: DocumentException) {
            throw e
        } catch (e: SecurityException) {
            throw DocumentException("Aide wasn't allowed to open \"$name\". Pick it again.")
        } catch (e: OutOfMemoryError) {
            throw DocumentException("\"$name\" is too large to open on this phone.")
        } catch (e: Exception) {
            throw DocumentException("\"$name\" couldn't be read.")
        }
    }

    /** A file for the camera to save a photo into, and the address to hand the camera app. */
    fun newPhoto(): Pair<File, Uri> {
        val file = File(pages, "camera-" + UUID.randomUUID() + ".jpg")
        return file to FileProvider.getUriForFile(context, context.packageName + AUTHORITY_SUFFIX, file)
    }

    /** Turns a photo the camera just saved into a page, and removes the original. */
    suspend fun photo(taken: File): Material.Pages = withContext(Dispatchers.IO) {
        try {
            if (!taken.exists() || taken.length() == 0L) throw DocumentException("The camera didn't save a picture.")
            Material.Pages("Photo", listOf(pageFromImage("the photo") { taken.inputStream() }), photos = true)
        } catch (e: DocumentException) {
            throw e
        } catch (e: OutOfMemoryError) {
            throw DocumentException("That photo is too large to open on this phone.")
        } catch (e: Exception) {
            throw DocumentException("That photo couldn't be read.")
        } finally {
            taken.delete()
        }
    }

    fun discard(material: Material) {
        if (material is Material.Pages) material.files.forEach { it.delete() }
    }

    /** Removes every page image left in the cache. For when nothing is being read. */
    fun clear() {
        runCatching { pages.listFiles()?.forEach { it.delete() } }
    }

    private fun open(uri: Uri): InputStream? = context.contentResolver.openInputStream(uri)

    private fun nameOf(uri: Uri): String {
        val shown = runCatching {
            context.contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)?.use { cursor ->
                if (cursor.moveToFirst()) cursor.getString(0) else null
            }
        }.getOrNull()
        return (shown ?: uri.lastPathSegment?.substringAfterLast('/') ?: "file").trim().ifEmpty { "file" }
    }

    private fun readText(uri: Uri, name: String): String {
        val text = open(uri)?.use { input ->
            // One more than the limit, to tell "exactly at the limit" from "over it".
            val buffer = CharArray(MAX_TEXT_CHARS + 1)
            val reader = input.reader(Charsets.UTF_8)
            var length = 0
            while (length < buffer.size) {
                val read = reader.read(buffer, length, buffer.size - length)
                if (read < 0) break
                length += read
            }
            String(buffer, 0, length)
        } ?: throw DocumentException("\"$name\" couldn't be opened.")
        return checked(text.removePrefix("﻿"), name)
    }

    private fun readWord(uri: Uri, name: String): String {
        val text = try {
            open(uri)?.use { docxText(it) } ?: throw DocumentException("\"$name\" couldn't be opened.")
        } catch (e: IOException) {
            throw DocumentException("\"$name\" doesn't open as a Word document. If it is an older .doc file, save it as .docx or PDF first.")
        }
        return checked(text, name)
    }

    private fun checked(text: String, name: String): String {
        if (text.isBlank()) throw DocumentException("\"$name\" has no text in it.")
        // Refused whole: a document cut off part-way would be filed as if it were complete.
        if (text.length > MAX_TEXT_CHARS) {
            throw DocumentException("\"$name\" is too long to take in at once (over ${MAX_TEXT_CHARS / 1000},000 characters). Add it in parts.")
        }
        return text
    }

    private fun renderPdf(uri: Uri, name: String): List<File> {
        // The renderer needs a real file it can move around in.
        val copy = File(pages, "pdf-" + UUID.randomUUID() + ".pdf")
        val made = ArrayList<File>()
        try {
            open(uri)?.use { input -> copy.outputStream().use { input.copyTo(it) } } ?: throw DocumentException("\"$name\" couldn't be opened.")
            ParcelFileDescriptor.open(copy, ParcelFileDescriptor.MODE_READ_ONLY).use { descriptor ->
                PdfRenderer(descriptor).use { pdf ->
                    if (pdf.pageCount == 0) throw DocumentException("\"$name\" has no pages.")
                    if (pdf.pageCount > MAX_PDF_PAGES) {
                        throw DocumentException("\"$name\" has ${pdf.pageCount} pages. Aide reads up to $MAX_PDF_PAGES at a time: add the part you need, or split it.")
                    }
                    for (index in 0 until pdf.pageCount) {
                        pdf.openPage(index).use { page ->
                            val (width, height) = scaleTo(page.width, page.height, PDF_EDGE)
                            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                            // Pages are drawn on transparent by default, which a JPEG turns black.
                            bitmap.eraseColor(Color.WHITE)
                            page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_PRINT)
                            made += save(bitmap, PDF_QUALITY)
                            bitmap.recycle()
                        }
                    }
                }
            }
            return made
        } catch (e: DocumentException) {
            made.forEach { it.delete() }
            throw e
        } catch (e: SecurityException) {
            made.forEach { it.delete() }
            throw DocumentException("\"$name\" is protected with a password. Save an unprotected copy and add that.")
        } catch (e: Exception) {
            made.forEach { it.delete() }
            throw DocumentException("\"$name\" doesn't open as a PDF.")
        } finally {
            copy.delete()
        }
    }

    /** Decodes a picture at no more than the size Claude makes use of, turned the right way up. */
    private fun pageFromImage(name: String, open: () -> InputStream?): File {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        open()?.use { BitmapFactory.decodeStream(it, null, bounds) } ?: throw DocumentException("\"$name\" couldn't be opened.")
        if (bounds.outWidth <= 0 || bounds.outHeight <= 0) throw DocumentException("\"$name\" isn't a picture Aide can read.")
        var sample = 1
        while (max(bounds.outWidth, bounds.outHeight) / (sample * 2) >= IMAGE_EDGE) sample *= 2
        val decoded = open()?.use { BitmapFactory.decodeStream(it, null, BitmapFactory.Options().apply { inSampleSize = sample }) }
            ?: throw DocumentException("\"$name\" isn't a picture Aide can read.")
        val turn = runCatching {
            open()?.use { stream ->
                when (ExifInterface(stream).getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)) {
                    ExifInterface.ORIENTATION_ROTATE_90 -> 90f
                    ExifInterface.ORIENTATION_ROTATE_180 -> 180f
                    ExifInterface.ORIENTATION_ROTATE_270 -> 270f
                    else -> 0f
                }
            }
        }.getOrNull() ?: 0f
        val (width, height) = fitWithin(decoded.width, decoded.height, IMAGE_EDGE)
        val matrix = Matrix().apply {
            postScale(width.toFloat() / decoded.width, height.toFloat() / decoded.height)
            if (turn != 0f) postRotate(turn)
        }
        val page = if (matrix.isIdentity) decoded else Bitmap.createBitmap(decoded, 0, 0, decoded.width, decoded.height, matrix, true)
        val file = save(page, IMAGE_QUALITY)
        if (page !== decoded) page.recycle()
        decoded.recycle()
        return file
    }

    private fun save(bitmap: Bitmap, quality: Int): File {
        val file = File(pages, "page-" + UUID.randomUUID() + ".jpg")
        file.outputStream().use { bitmap.compress(Bitmap.CompressFormat.JPEG, quality, it) }
        return file
    }

    companion object {
        const val AUTHORITY_SUFFIX = ".files"
        const val PAGE_DIR = "aide_pages"

        /** About 75,000 words: far more than any meeting's notes, and still one request to Claude. */
        const val MAX_TEXT_CHARS = 400_000
        const val MAX_PDF_PAGES = 60

        /** The longest side Claude's current models look at before shrinking a picture themselves is 2,576. */
        private const val IMAGE_EDGE = 2_200
        private const val IMAGE_QUALITY = 85
        private const val PDF_EDGE = 1_800
        private const val PDF_QUALITY = 82
    }
}
