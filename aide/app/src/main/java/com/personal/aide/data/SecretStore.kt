package com.personal.aide.data

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import androidx.core.content.edit
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.withContext
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/** Where the Claude API key lives. */
interface SecretStore {
    val hasKey: Flow<Boolean>
    suspend fun apiKey(): String?
    suspend fun setApiKey(key: String?)
}

/**
 * Keeps the API key encrypted with a key that never leaves the phone's hardware-backed keystore.
 * The ciphertext sits in a private preferences file that is excluded from backups; if it can't be
 * decrypted (a restore onto another phone, say) the key simply reads as not set.
 */
class KeystoreSecretStore(context: Context) : SecretStore {
    private val prefs = context.applicationContext.getSharedPreferences("aide_secret", Context.MODE_PRIVATE)
    private val state = MutableStateFlow(prefs.contains(CIPHERTEXT))
    override val hasKey: Flow<Boolean> = state

    override suspend fun apiKey(): String? = withContext(Dispatchers.IO) {
        val ciphertext = prefs.getString(CIPHERTEXT, null) ?: return@withContext null
        val iv = prefs.getString(IV, null) ?: return@withContext null
        try {
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.DECRYPT_MODE, secretKey(), GCMParameterSpec(128, Base64.decode(iv, Base64.NO_WRAP)))
            String(cipher.doFinal(Base64.decode(ciphertext, Base64.NO_WRAP)), Charsets.UTF_8)
        } catch (_: Exception) {
            null
        }
    }

    override suspend fun setApiKey(key: String?) = withContext(Dispatchers.IO) {
        val clean = key?.trim().orEmpty()
        if (clean.isEmpty()) {
            prefs.edit { remove(CIPHERTEXT).remove(IV) }
            state.value = false
            return@withContext
        }
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, secretKey())
        val encrypted = cipher.doFinal(clean.toByteArray(Charsets.UTF_8))
        prefs.edit {
            putString(CIPHERTEXT, Base64.encodeToString(encrypted, Base64.NO_WRAP))
            putString(IV, Base64.encodeToString(cipher.iv, Base64.NO_WRAP))
        }
        state.value = true
    }

    private fun secretKey(): SecretKey {
        val keyStore = KeyStore.getInstance(KEYSTORE).apply { load(null) }
        (keyStore.getKey(ALIAS, null) as? SecretKey)?.let { return it }
        val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, KEYSTORE)
        generator.init(
            KeyGenParameterSpec.Builder(ALIAS, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build(),
        )
        return generator.generateKey()
    }

    private companion object {
        const val KEYSTORE = "AndroidKeyStore"
        const val ALIAS = "aide_api_key"
        const val TRANSFORMATION = "AES/GCM/NoPadding"
        const val CIPHERTEXT = "ciphertext"
        const val IV = "iv"
    }
}

/** For tests, and for anywhere the keystore isn't available. Nothing is written to disk. */
class MemorySecretStore(initial: String? = null) : SecretStore {
    private var key: String? = initial
    private val state = MutableStateFlow(!initial.isNullOrBlank())
    override val hasKey: Flow<Boolean> = state
    override suspend fun apiKey(): String? = key
    override suspend fun setApiKey(key: String?) {
        this.key = key?.trim()?.ifEmpty { null }
        state.value = this.key != null
    }
}
