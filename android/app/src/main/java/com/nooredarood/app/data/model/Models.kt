package com.nooredarood.app.data.model

data class Darood(
    val id: String,
    val nameEn: String,
    val nameUr: String,
    val arabicText: String,
    val urduTranslation: String,
    val transliteration: String,
    val virtuesShortEn: String,
    val virtuesShortUr: String,
    val category: String, // 'core' | 'short' | 'healing' | 'comprehensive' | 'special'
    val recommendedCount: Int = 100,
    val audioUrl: String? = null,
    val type: String = "darood"
)

data class CustomSlot(
    val id: String,
    val nameEn: String,
    val nameUr: String,
    val timeStr: String,
    val enabled: Boolean
)

data class UserPreferences(
    val language: String = "ur", // "ur" | "en"
    val dailyTarget: Int = 300,
    val timeCapacity: String = "15 mins",
    val preferredTimes: List<String> = listOf("fajr", "maghrib", "before_sleep"),
    val goal: String = "build_habit",
    val theme: String = "emerald",
    val soundEnabled: Boolean = true,
    val vibrationEnabled: Boolean = true,
    val selectedCity: String = "Karachi",
    val onboardingCompleted: Boolean = true
)

data class DailyLog(
    val date: String, // YYYY-MM-DD
    val totalCount: Int,
    val sessionsCount: Int,
    val slotBreakdown: Map<String, Int> = emptyMap()
)

data class StreakData(
    val currentStreak: Int = 0,
    val lastActiveDate: String = "",
    val longestStreak: Int = 0
)

data class AIPlanSlot(
    val time: String,
    val count: Int,
    val daroodId: String,
    val daroodName: String
)

data class AIPlan(
    val dailyTarget: Int,
    val slots: List<AIPlanSlot>,
    val recommendedDaroods: List<String>,
    val coachMessageEn: String,
    val coachMessageUr: String,
    val weeklyTarget: Int
)

data class PrayerTimeSlot(
    val name: String,
    val key: String,
    val timeStr: String,
    val targetCount: Int,
    val completedCount: Int
)
