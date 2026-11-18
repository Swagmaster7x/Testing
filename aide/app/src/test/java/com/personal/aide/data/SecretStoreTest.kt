package com.personal.aide.data

import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/** The in-memory store that tests use. The keystore-backed one needs a real phone to exercise. */
class SecretStoreTest {
    @Test
    fun `there is no key to begin with`(): Unit = runBlocking {
        val store = MemorySecretStore()
        assertNull(store.apiKey())
        assertFalse(store.hasKey.first())
    }

    @Test
    fun `a key given at the start is there`(): Unit = runBlocking {
        val store = MemorySecretStore("sk-ant-test")
        assertEquals("sk-ant-test", store.apiKey())
        assertTrue(store.hasKey.first())
    }

    @Test
    fun `a saved key is trimmed and reported as present`(): Unit = runBlocking {
        val store = MemorySecretStore()
        store.setApiKey("  sk-ant-test\n")
        assertEquals("sk-ant-test", store.apiKey())
        assertTrue(store.hasKey.first())
    }

    @Test
    fun `saving nothing removes the key`(): Unit = runBlocking {
        for (nothing in listOf(null, "", "   ")) {
            val store = MemorySecretStore("sk-ant-test")
            store.setApiKey(nothing)
            assertNull(store.apiKey())
            assertFalse(store.hasKey.first())
        }
    }
}
