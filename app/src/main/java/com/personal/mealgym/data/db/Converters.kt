package com.personal.mealgym.data.db

import androidx.room.TypeConverter
import kotlinx.serialization.json.Json

class Converters {
    @TypeConverter
    fun fromStringList(value: List<String>): String = Json.encodeToString(value)

    @TypeConverter
    fun toStringList(value: String): List<String> =
        if (value.isBlank()) emptyList() else Json.decodeFromString(value)

    @TypeConverter
    fun fromSwaps(value: List<ProteinSwap>): String = json.encodeToString(value)

    @TypeConverter
    fun toSwaps(value: String): List<ProteinSwap> =
        if (value.isBlank()) emptyList() else json.decodeFromString(value)

    private companion object {
        val json = Json { ignoreUnknownKeys = true }
    }
}
