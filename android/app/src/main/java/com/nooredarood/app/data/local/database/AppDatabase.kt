package com.nooredarood.app.data.local.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.nooredarood.app.data.local.dao.DailyLogDao
import com.nooredarood.app.data.local.dao.DaroodDao
import com.nooredarood.app.data.local.dao.SessionDao
import com.nooredarood.app.data.local.entity.DailyLogEntity
import com.nooredarood.app.data.local.entity.DaroodEntity
import com.nooredarood.app.data.local.entity.SessionEntity

@Database(
    entities = [DaroodEntity::class, SessionEntity::class, DailyLogEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun daroodDao(): DaroodDao
    abstract fun sessionDao(): SessionDao
    abstract fun dailyLogDao(): DailyLogDao
}
