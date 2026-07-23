package com.nooredarood.app.data.local.dao

import androidx.room.*
import com.nooredarood.app.data.local.entity.DailyLogEntity
import com.nooredarood.app.data.local.entity.DaroodEntity
import com.nooredarood.app.data.local.entity.SessionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface DaroodDao {
    @Query("SELECT * FROM daroods")
    fun getAllDaroods(): Flow<List<DaroodEntity>>

    @Query("SELECT * FROM daroods WHERE isFavorite = 1")
    fun getFavoriteDaroods(): Flow<List<DaroodEntity>>

    @Query("SELECT * FROM daroods WHERE id = :id")
    suspend fun getDaroodById(id: String): DaroodEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(daroods: List<DaroodEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(darood: DaroodEntity)

    @Query("UPDATE daroods SET isFavorite = :isFavorite WHERE id = :id")
    suspend fun updateFavorite(id: String, isFavorite: Boolean)
}

@Dao
interface SessionDao {
    @Query("SELECT * FROM sessions ORDER BY endedAt DESC")
    fun getAllSessions(): Flow<List<SessionEntity>>

    @Query("SELECT * FROM sessions WHERE startedAt LIKE :datePrefix || '%' ORDER BY endedAt DESC")
    fun getSessionsByDate(datePrefix: String): Flow<List<SessionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: SessionEntity)
}

@Dao
interface DailyLogDao {
    @Query("SELECT * FROM daily_logs WHERE date = :date")
    suspend fun getDailyLogByDate(date: String): DailyLogEntity?

    @Query("SELECT * FROM daily_logs ORDER BY date DESC")
    fun getAllDailyLogs(): Flow<List<DailyLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateDailyLog(dailyLog: DailyLogEntity)
}
