package com.nooredarood.app

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class NoorEdaroodApp : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}
