package com.nooredarood.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "daroods")
data class DaroodEntity(
    @PrimaryKey val id: String,
    val nameEn: String,
    val nameUr: String,
    val arabicText: String,
    val urduTranslation: String,
    val transliteration: String,
    val virtuesShortEn: String,
    val virtuesShortUr: String,
    val category: String,
    val recommendedCount: Int,
    val isFavorite: Boolean = false,
    val isCustom: Boolean = false
)

@Entity(tableName = "sessions")
data class SessionEntity(
    @PrimaryKey val id: String,
    val daroodId: String,
    val daroodName: String,
    val startedAt: String,
    val endedAt: String,
    val count: Int,
    val targetSlot: String?,
    val reflection: String?
)

@Entity(tableName = "daily_logs")
data class DailyLogEntity(
    @PrimaryKey val date: String, // YYYY-MM-DD
    val totalCount: Int,
    val sessionsCount: Int,
    val slotBreakdownJson: String // Serialized JSON of slot counts
)
