package com.personal.aide.ai

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.IOException
import java.io.InterruptedIOException
import java.net.ConnectException
import java.net.SocketException
import java.net.SocketTimeoutException
import java.net.UnknownHostException
import javax.net.ssl.SSLHandshakeException

/** What the user is told when the connection to Claude fails, which depends on how it failed. */
class ConnectionProblemTest {
    private fun told(error: Throwable) = AnthropicLlm.connectionProblem(error)

    @Test
    fun `servers that can't be found may mean no internet or a network that blocks them`() {
        val message = told(IOException("request failed", UnknownHostException("api.anthropic.com")))
        assertTrue(message, message.contains("Couldn't find Claude's servers"))
        assertTrue(message, message.contains("mobile data"))
        assertTrue("the technical name is there to pass on", message.endsWith("(UnknownHostException)"))
    }

    @Test
    fun `a secure connection that is interfered with points at the network, not the phone`() {
        val message = told(IOException("request failed", SSLHandshakeException("Trust anchor for certification path not found")))
        assertTrue(message, message.contains("secure connection"))
        assertFalse(message, message.contains("Check your internet"))
        assertTrue(message, message.endsWith("(SSLHandshakeException)"))
    }

    @Test
    fun `a timeout is called a timeout`() {
        assertTrue(told(SocketTimeoutException("timeout")).contains("timed out"))
        assertTrue(told(IOException("wrapped", InterruptedIOException("timeout"))).contains("timed out"))
    }

    @Test
    fun `no route to the servers is a plain connection problem`() {
        val message = told(IOException("request failed", ConnectException("Failed to connect")))
        assertTrue(message, message.startsWith("Couldn't reach Claude. Check your internet connection."))
    }

    @Test
    fun `a connection that broke part-way is not blamed on the user's internet`() {
        // What a reply looks like from an app that was frozen in the background while it waited.
        val message = told(IOException("unexpected end of stream", SocketException("Software caused connection abort")))
        assertTrue(message, message.contains("cut off part-way"))
        assertTrue(message, message.endsWith("(SocketException)"))
    }

    @Test
    fun `the cause that explains it is found however deeply it is wrapped`() {
        val deep = IOException("a", IOException("b", IOException("c", UnknownHostException("api.anthropic.com"))))
        assertTrue(told(deep).contains("Couldn't find Claude's servers"))
    }

    @Test
    fun `an error that is its own cause does not send it round in circles`() {
        val odd = object : IOException("loop") {
            override val cause: Throwable get() = this
        }
        assertTrue(told(odd).contains("cut off part-way"))
    }
}
