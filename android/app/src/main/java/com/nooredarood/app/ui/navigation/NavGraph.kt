package com.nooredarood.app.ui.navigation

sealed class Screen(val route: String, val titleEn: String, val titleUr: String) {
    object Home : Screen("home", "Home", "ہوم")
    object Counter : Screen("counter/{daroodId}", "Tasbeeh Counter", "تسبیح کاؤنٹر") {
        fun createRoute(daroodId: String) = "counter/$daroodId"
    }
    object Library : Screen("library", "Darood Library", "درود لائبریری")
    object Plan : Screen("plan", "Personal Plan", "ذاتی پلان")
    object PrayerTimes : Screen("prayer_times", "Prayer Times", "نماز کے اوقات")
    object Analytics : Screen("analytics", "Analytics", "شماریات")
    object Settings : Screen("settings", "Settings", "سیٹنگز")
    object Onboarding : Screen("onboarding", "Welcome", "خوش آمدید")
}
