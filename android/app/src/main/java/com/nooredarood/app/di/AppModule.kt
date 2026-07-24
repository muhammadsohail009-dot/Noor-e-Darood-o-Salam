package com.nooredarood.app.di

import android.content.Context
import androidx.room.Room
import com.nooredarood.app.data.local.dao.DailyLogDao
import com.nooredarood.app.data.local.dao.DaroodDao
import com.nooredarood.app.data.local.dao.SessionDao
import com.nooredarood.app.data.local.database.AppDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "noor_e_darood_db"
        ).fallbackToDestructiveMigration().build()
    }

    @Provides
    fun provideDaroodDao(database: AppDatabase): DaroodDao = database.daroodDao()

    @Provides
    fun provideSessionDao(database: AppDatabase): SessionDao = database.sessionDao()

    @Provides
    fun provideDailyLogDao(database: AppDatabase): DailyLogDao = database.dailyLogDao()
}

