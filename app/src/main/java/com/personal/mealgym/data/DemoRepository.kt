package com.personal.mealgym.data

import android.content.Context
import android.graphics.BitmapFactory
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.util.concurrent.ConcurrentHashMap

/** What the bundled demo file holds (written by tools/exercise_demos.py). */
@Serializable
data class DemoFile(
    val source: String = "",
    val exercises: Map<String, DemoEntry> = emptyMap(),
    val cues: Map<String, List<String>> = emptyMap(),
)

@Serializable
data class DemoEntry(val id: String, val name: String, val instructions: List<String> = emptyList())

/** A demo for one exercise name: two photos (start and end), or just form cues. */
sealed interface Demo {
    val exerciseName: String

    data class Photos(
        override val exerciseName: String,
        val datasetName: String,
        val frames: List<String>,
        val instructions: List<String>,
    ) : Demo

    data class Cues(override val exerciseName: String, val cues: List<String>) : Demo

    /** Nothing bundled (e.g. an exercise added on the phone): only the web search. */
    data class None(override val exerciseName: String) : Demo
}

/**
 * Exercise demos bundled with the app from free-exercise-db (public domain). The app stays
 * offline: everything comes from assets/demos.
 */
class DemoRepository(private val context: Context) {

    private val file: DemoFile by lazy {
        runCatching {
            val text = context.assets.open("demos/demos.json").bufferedReader().use { it.readText() }
            parse(text)
        }.getOrDefault(DemoFile())
    }

    private val byName by lazy { file.exercises.mapKeys { it.key.lowercase() } }
    private val cuesByName by lazy { file.cues.mapKeys { it.key.lowercase() } }
    private val bitmaps = ConcurrentHashMap<String, ImageBitmap>()

    fun demoFor(exerciseName: String): Demo {
        val key = exerciseName.lowercase().trim()
        byName[key]?.let { e ->
            return Demo.Photos(exerciseName, e.name, listOf("demos/${e.id}/0.webp", "demos/${e.id}/1.webp"), e.instructions)
        }
        cuesByName[key]?.let { return Demo.Cues(exerciseName, it) }
        return Demo.None(exerciseName)
    }

    /** Loads (and keeps) one bundled frame. */
    fun frame(path: String): ImageBitmap? = bitmaps[path] ?: runCatching {
        context.assets.open(path).use { BitmapFactory.decodeStream(it) }?.asImageBitmap()
    }.getOrNull()?.also { bitmaps[path] = it }

    companion object {
        private val json = Json { ignoreUnknownKeys = true }

        fun parse(text: String): DemoFile = json.decodeFromString(DemoFile.serializer(), text)

        /** A web search for the move, opened in the phone's browser (the app itself has no internet access). */
        fun searchUrl(exerciseName: String): String =
            "https://www.google.com/search?q=" + java.net.URLEncoder.encode("$exerciseName exercise form demo", "UTF-8")
    }
}
