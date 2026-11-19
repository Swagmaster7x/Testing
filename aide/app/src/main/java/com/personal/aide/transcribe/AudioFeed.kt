package com.personal.aide.transcribe

import android.annotation.SuppressLint
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.os.ParcelFileDescriptor
import android.os.SystemClock
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.channels.FileChannel
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.TimeUnit

/**
 * A supply of microphone audio that the app captures itself and hands to the speech recognizer,
 * instead of letting the recognizer open the microphone.
 */
interface Feed {
    /** Opens the microphone. False if it can't be opened; nothing is left running then. */
    fun start(): Boolean

    fun stop()

    /**
     * A fresh stream of audio for one recognition session, starting with the last moment already
     * heard so that words spoken while sessions change over are not lost. Any earlier stream ends.
     * Null if the feed isn't running.
     */
    fun open(): ParcelFileDescriptor?

    /**
     * Ends the current stream because its session is over. The microphone stays open, and the next
     * [open] begins with what was captured in between (up to a few seconds), so a changeover costs no words.
     */
    fun pause()

    /** False once capture has stopped by itself, for instance because the microphone was taken away. */
    fun alive(): Boolean

    /** How long audio has been piling up unread, in milliseconds: large means nobody is taking it. */
    fun stalledMs(): Long

    /** How much speech (as opposed to quiet) has been captured since [start], in milliseconds. */
    fun speechMs(): Long
}

/**
 * Captures the microphone at 16 kHz, turns quiet voices up with [AutoGain], and writes the result
 * into a pipe the recognizer reads. Capturing never waits for the reader: audio nobody takes is
 * dropped after a few seconds, and [stalledMs] says so.
 */
class AudioFeed(
    private val maxGain: Float,
    /** Called from the capture thread, a few times a second, with a 0 to 1 level. */
    private val onLevel: (Float) -> Unit,
) : Feed {
    @Volatile private var running = false
    private var record: AudioRecord? = null
    private var capture: Thread? = null
    @Volatile private var stream: Stream? = null
    @Volatile private var speech = 0L

    /** The last few seconds captured, so a new stream can begin with what the last one missed. */
    private val recent = ArrayDeque<ByteArray>()
    /** Frames captured since a stream last took any; -1 while one is open. */
    private var missed = 0
    private val lock = Any()

    @SuppressLint("MissingPermission") // Only ever started while recording, which needs the microphone permission first.
    override fun start(): Boolean {
        stop()
        val minimum = AudioRecord.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT)
        if (minimum <= 0) return false
        val opened = try {
            // VOICE_RECOGNITION is the source recognizers are tuned for: no noise suppression or
            // automatic gain of the phone's own gets in before ours.
            AudioRecord(
                MediaRecorder.AudioSource.VOICE_RECOGNITION,
                SAMPLE_RATE,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                maxOf(minimum, SAMPLE_RATE * 2), // a second of slack
            )
        } catch (_: Exception) {
            return false
        }
        if (opened.state != AudioRecord.STATE_INITIALIZED) {
            opened.release()
            return false
        }
        try {
            opened.startRecording()
        } catch (_: Exception) {
            opened.release()
            return false
        }
        if (opened.recordingState != AudioRecord.RECORDSTATE_RECORDING) {
            runCatching { opened.stop() }
            opened.release()
            return false
        }
        record = opened
        speech = 0
        running = true
        capture = Thread({ run(opened) }, "aide-audio-in").also { it.start() }
        return true
    }

    private fun run(source: AudioRecord) {
        val gain = AutoGain(maxGain)
        val frame = ShortArray(FRAME_SAMPLES)
        var sinceLevel = 0
        var loudest = 0f
        while (running) {
            val read = try {
                source.read(frame, 0, frame.size)
            } catch (_: Exception) {
                -1
            }
            if (read <= 0) {
                if (read < 0) break
                continue
            }
            val level = gain.process(frame, read)
            if (gain.speaking) speech += read * 1000L / SAMPLE_RATE
            val bytes = ByteArray(read * 2)
            ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().put(frame, 0, read)
            synchronized(lock) {
                recent.addLast(bytes)
                while (recent.size > REPLAY_FRAMES) recent.removeFirst()
                val current = stream
                if (current != null) current.offer(bytes) else if (missed >= 0) missed++
            }
            loudest = maxOf(loudest, level)
            sinceLevel += read
            if (sinceLevel >= SAMPLE_RATE / 8) {
                onLevel(loudest)
                sinceLevel = 0
                loudest = 0f
            }
        }
    }

    override fun stop() {
        running = false
        synchronized(lock) {
            stream?.close()
            stream = null
            recent.clear()
            missed = 0
        }
        record?.let { source ->
            runCatching { source.stop() }
            runCatching { capture?.join(500) }
            runCatching { source.release() }
        }
        record = null
        capture = null
    }

    override fun open(): ParcelFileDescriptor? {
        if (!running) return null
        val pipe = try {
            ParcelFileDescriptor.createPipe()
        } catch (_: IOException) {
            return null
        }
        val next = Stream(pipe[0], ParcelFileDescriptor.AutoCloseOutputStream(pipe[1]).channel)
        synchronized(lock) {
            stream?.close()
            // What was captured while no stream was open, plus a moment of overlap with the last one.
            val replay = (missed.coerceAtLeast(0) + OVERLAP_FRAMES).coerceAtMost(recent.size)
            for (chunk in recent.takeLast(replay)) next.offer(chunk)
            missed = -1
            stream = next
        }
        return pipe[0]
    }

    override fun pause() {
        synchronized(lock) {
            stream?.close()
            stream = null
            if (missed < 0) missed = 0
        }
    }

    override fun alive(): Boolean = running && capture?.isAlive == true

    override fun stalledMs(): Long = stream?.stalledMs() ?: 0

    override fun speechMs(): Long = speech

    /** One pipe to one recognition session, with its own thread so a slow reader never holds up capture. */
    private class Stream(private val readEnd: ParcelFileDescriptor, private val channel: FileChannel) {
        private val queue = ArrayBlockingQueue<ByteArray>(QUEUE_FRAMES)
        @Volatile private var open = true
        @Volatile private var fullSince = 0L

        private val writer = Thread({
            try {
                while (open) {
                    val chunk = queue.poll(200, TimeUnit.MILLISECONDS) ?: continue
                    val buffer = ByteBuffer.wrap(chunk)
                    while (buffer.hasRemaining()) channel.write(buffer)
                }
            } catch (_: IOException) {
                // The recognizer closed its end, or this stream was closed under us: either way it is over.
            } catch (_: InterruptedException) {
                // Closed while waiting for audio.
            } finally {
                open = false
                runCatching { channel.close() }
            }
        }, "aide-audio-out").also { it.start() }

        fun offer(chunk: ByteArray) {
            if (!open) return
            if (queue.offer(chunk)) {
                fullSince = 0
            } else if (fullSince == 0L) {
                fullSince = SystemClock.elapsedRealtime()
            }
        }

        fun stalledMs(): Long {
            val since = fullSince
            // The queue itself holds a few seconds, so by the time it is full that much has already gone unread.
            return if (since == 0L || !open) 0 else SystemClock.elapsedRealtime() - since + QUEUE_FRAMES * FRAME_MS
        }

        fun close() {
            open = false
            // Closing the channel is what frees a writer stuck on a full pipe.
            runCatching { channel.close() }
            writer.interrupt()
            runCatching { readEnd.close() }
        }
    }

    companion object {
        const val SAMPLE_RATE = 16_000
        private const val FRAME_MS = 20L
        private const val FRAME_SAMPLES = (SAMPLE_RATE * FRAME_MS / 1000).toInt()
        private const val REPLAY_FRAMES = 150 // three seconds
        private const val OVERLAP_FRAMES = 15 // a third of a second
        private const val QUEUE_FRAMES = 150 // three seconds
    }
}
