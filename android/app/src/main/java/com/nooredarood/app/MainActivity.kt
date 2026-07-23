package com.nooredarood.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.*
import com.nooredarood.app.ui.navigation.Screen
import com.nooredarood.app.ui.theme.BlackBg
import com.nooredarood.app.ui.theme.EmeraldDark
import com.nooredarood.app.ui.theme.GoldPrimary
import com.nooredarood.app.ui.theme.NoorEdaroodTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate()
        setContent {
            NoorEdaroodTheme {
                val navController = rememberNavController()
                var currentRoute by remember { mutableStateOf(Screen.Home.route) }

                Scaffold(
                    bottomBar = {
                        NavigationBar(
                            containerColor = EmeraldDark,
                            contentColor = GoldPrimary
                        ) {
                            NavigationBarItem(
                                selected = currentRoute == Screen.Home.route,
                                onClick = {
                                    currentRoute = Screen.Home.route
                                    navController.navigate(Screen.Home.route)
                                },
                                icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                                label = { Text("ہوم") }
                            )
                            NavigationBarItem(
                                selected = currentRoute == Screen.Library.route,
                                onClick = {
                                    currentRoute = Screen.Library.route
                                    navController.navigate(Screen.Library.route)
                                },
                                icon = { Icon(Icons.Default.MenuBook, contentDescription = "Library") },
                                label = { Text("لائبیرری") }
                            )
                            NavigationBarItem(
                                selected = currentRoute == Screen.Plan.route,
                                onClick = {
                                    currentRoute = Screen.Plan.route
                                    navController.navigate(Screen.Plan.route)
                                },
                                icon = { Icon(Icons.Default.Schedule, contentDescription = "Plan") },
                                label = { Text("پلان") }
                            )
                            NavigationBarItem(
                                selected = currentRoute == Screen.PrayerTimes.route,
                                onClick = {
                                    currentRoute = Screen.PrayerTimes.route
                                    navController.navigate(Screen.PrayerTimes.route)
                                },
                                icon = { Icon(Icons.Default.Mosque, contentDescription = "Prayers") },
                                label = { Text("اوقات") }
                            )
                            NavigationBarItem(
                                selected = currentRoute == Screen.Settings.route,
                                onClick = {
                                    currentRoute = Screen.Settings.route
                                    navController.navigate(Screen.Settings.route)
                                },
                                icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                                label = { Text("سیٹنگز") }
                            )
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                            .background(BlackBg)
                    ) {
                        NavHost(
                            navController = navController,
                            startDestination = Screen.Home.route
                        ) {
                            composable(Screen.Home.route) {
                                // Home Screen Jetpack Compose
                                Text(
                                    text = "نورِ درود - Native Android Jetpack Compose Home Screen",
                                    color = Color.White,
                                    modifier = Modifier.padding(16.dp)
                                )
                            }
                            composable(Screen.Library.route) {
                                Text(
                                    text = "درود شریف کی مکمل فہرست",
                                    color = Color.White,
                                    modifier = Modifier.padding(16.dp)
                                )
                            }
                            composable(Screen.Plan.route) {
                                Text(
                                    text = "روزانہ کا روحانی پلان",
                                    color = Color.White,
                                    modifier = Modifier.padding(16.dp)
                                )
                            }
                            composable(Screen.PrayerTimes.route) {
                                Text(
                                    text = "نماز کے اوقات اور درود پاک کے اہداف",
                                    color = Color.White,
                                    modifier = Modifier.padding(16.dp)
                                )
                            }
                            composable(Screen.Settings.route) {
                                Text(
                                    text = "ایپلی کیشن سیٹنگز",
                                    color = Color.White,
                                    modifier = Modifier.padding(16.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
