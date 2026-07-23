package com.nooredarood.app.data.local.datastore

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.nooredarood.app.data.model.UserPreferences
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_preferences")

@Singleton
class UserPreferencesRepository @Inject constructor(
    private val context: Context
) {
    private object Keys {
        val LANGUAGE = stringPreferencesKey("language")
        val DAILY_TARGET = intPreferencesKey("daily_target")
        val TIME_CAPACITY = stringPreferencesKey("time_capacity")
        val GOAL = stringPreferencesKey("goal")
        val THEME = stringPreferencesKey("theme")
        val SOUND_ENABLED = booleanPreferencesKey("sound_enabled")
        val VIBRATION_ENABLED = booleanPreferencesKey("vibration_enabled")
        val SELECTED_CITY = stringPreferencesKey("selected_city")
        val ONBOARDING_COMPLETED = booleanPreferencesKey("onboarding_completed")
    }

    val userPreferencesFlow: Flow<UserPreferences> = context.dataStore.data.map { preferences ->
        UserPreferences(
            language = preferences[Keys.LANGUAGE] ?: "ur",
            dailyTarget = preferences[Keys.DAILY_TARGET] ?: 300,
            timeCapacity = preferences[Keys.TIME_CAPACITY] ?: "15 mins",
            goal = preferences[Keys.GOAL] ?: "build_habit",
            theme = preferences[Keys.THEME] ?: "emerald",
            soundEnabled = preferences[Keys.SOUND_ENABLED] ?: true,
            vibrationEnabled = preferences[Keys.VIBRATION_ENABLED] ?: true,
            selectedCity = preferences[Keys.SELECTED_CITY] ?: "Karachi",
            onboardingCompleted = preferences[Keys.ONBOARDING_COMPLETED] ?: true
        )
    }

    suspend fun updateLanguage(language: String) {
        context.dataStore.edit { preferences ->
            preferences[Keys.LANGUAGE] = language
        }
    }

    suspend fun updateDailyTarget(target: Int) {
        context.dataStore.edit { preferences ->
            preferences[Keys.DAILY_TARGET] = target
        }
    }

    suspend fun updateSettings(sound: Boolean, vibration: Boolean, language: String, city: String) {
        context.dataStore.edit { preferences ->
            preferences[Keys.SOUND_ENABLED] = sound
            preferences[Keys.VIBRATION_ENABLED] = vibration
            preferences[Keys.LANGUAGE] = language
            preferences[Keys.SELECTED_CITY] = city
        }
    }

    suspend fun setOnboardingCompleted(completed: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[Keys.ONBOARDING_COMPLETED] = completed
        }
    }
}
