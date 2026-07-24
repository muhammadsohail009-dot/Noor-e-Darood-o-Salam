# Product Requirement Document (PRD)

## Project Title
**Noor-e-Darood o Salam (نورِ درود و سلام)**

---

## 1. Executive Summary & Vision
**Noor-e-Darood o Salam** is a comprehensive Islamic spiritual companion app designed to facilitate, encourage, and track the recitation of Darood Shareef (Salawat upon Prophet Muhammad ﷺ). The application bridges traditional spiritual practice with modern digital convenience, offering an intuitive smart Tasbeeh counter, an authentic library of Darood Shareef recitations, personalized goal tracking, streak analytics, and AI-powered habit coaching—all with seamless bilingual support (Urdu & English) and offline-first capabilities.

---

## 2. Target Audience & Problem Statement

### Target Audience
- Muslims worldwide seeking a dedicated, ad-free digital tool to recite and track daily Darood o Salam.
- Users who prefer Urdu (RTL) or English (LTR) language support.
- Android device users looking for a native, fast, lightweight mobile app experience.
- Web users looking for a clean, accessible desktop/tablet/mobile browser experience.

### Key Problems Solved
1. **Lack of Consistency**: Users struggle to maintain daily recitation habits without structured goal setting and reminders.
2. **Scattered Resources**: Translations, transliterations, audio recitations, and authentic virtues of different Darood Shareef are often fragmented across multiple sources.
3. **Inconvenient Tracking**: Manual physical counters are easily lost or inconvenient to carry everywhere; basic digital counters lack history, streak metrics, and insights.
4. **Language Barriers**: Many existing apps only support English or simple Arabic, neglecting fluent Urdu speakers who prefer authentic Urdu typography and layout.

---

## 3. Core Features & Functional Requirements

### 3.1 Digital Tasbeeh & Smart Counter
- **Interactive Counter Screen**: Responsive tap area with tactile haptic/vibration feedback and customizable audio tap sounds.
- **Goal Targets**: Configurable targets (e.g., 33, 100, 313, 1000) with auto-reset or target completion alerts.
- **Quick Switch**: Easily switch between active Darood Shareef items directly from the counter.
- **Manual Adjustments**: Ability to increment, decrement, or reset count with safety confirmation.

### 3.2 Authentic Darood Shareef Library
- **Curated Collection**: Includes renowned recitations such as Darood-e-Ibrahimi, Darood-e-Taj, Darood-e-Tanjina, Darood-e-Nariya, Darood-e-Mahi, and more.
- **Bilingual Content**:
  - Full Arabic text with clear tashkeel/diacritics.
  - Urdu translation & transliteration (RTL formatted).
  - English translation & transliteration.
- **Virtues & References (Fazaail)**: Contextual benefits, authentic Hadith references, and spiritual virtues of each Darood.

### 3.3 Goal Setting, Streaks & Analytics
- **Daily & Weekly Targets**: Set personalized daily recitation goals.
- **Streak Calculation**: Track continuous daily recitation streaks to build long-term spiritual habits.
- **Analytics Dashboard**: Visual charts depicting weekly and monthly recitation volume.
- **Historical Logs**: Detailed session logs recording timestamps, counts, and selected Darood.

### 3.4 AI Habit Coach & Daily Reflection (Gemini Powered)
- **AI Coach**: Interactive AI companion powered by Google Gemini (@google/genai) offering personalized encouragement, daily Islamic reflections, and habit-building tips.
- **Smart Recommendations**: Tailored suggestions based on current recitation progress and user goals.

### 3.5 Language & Theme Customization
- **Dual Language Support**: Instant toggle between Urdu (نورِ درود - RTL) and English (LTR).
- **Dark & Light Mode**: Visually refined dark mode for night recitation and light mode for high-contrast daytime use.
- **Typography**: Custom Naskh / Nastaliq font styling for Arabic and Urdu scripts.

---

## 4. Technical Architecture & Stack

### 4.1 Cross-Platform Deployment Strategy
The project is structured as a unified repository delivering two key platforms:
1. **Web / Full-Stack Web Application** (React + Express + Node.js)
2. **Native Android Application** (Kotlin + Jetpack Compose)

```
/ (Project Root)
├── src/                          # React + TypeScript Web Frontend
├── server.ts                     # Express + Gemini API Web Server
├── android/                      # Native Android Kotlin Application
│   ├── app/                      # Android Module (Jetpack Compose, Room, Hilt)
│   ├── build.gradle.kts          # Root & App Build Configurations
│   └── gradle/wrapper/           # Gradle Wrapper Config
├── .github/workflows/build-apk.yml# Automated CI/CD Workflow for Android APK
├── metadata.json                 # AI Studio Metadata
└── PRD.md                        # Product Requirements Document
```

### 4.2 Web Architecture Stack
- **Frontend Framework**: React 19, TypeScript, Vite.
- **Styling**: Tailwind CSS v4, Motion (Animations), Lucide React (Icons).
- **Backend API Server**: Express.js (Node.js runtime).
- **AI Integration**: Server-side `@google/genai` SDK using `GEMINI_API_KEY`.

### 4.3 Native Android Architecture Stack
- **Language**: Kotlin 1.9+.
- **UI Framework**: Jetpack Compose with Material 3 design system.
- **Dependency Injection**: Dagger Hilt (`hilt-android`, `hilt-compiler`).
- **Database / Local Storage**:
  - **Room Database**: Entity definitions (`DaroodEntity`, `SessionEntity`, `DailyLogEntity`), DAOs, and SQLite database for offline session logging.
  - **DataStore Preferences**: Lightweight key-value store for user settings (language, theme, haptics, targets).
- **Navigation**: Jetpack Compose Navigation (`androidx.navigation:navigation-compose`).

---

## 5. CI/CD & Build Pipeline

### GitHub Actions Workflow (`.github/workflows/build-apk.yml`)
- Automatically triggers on pushes and pull requests to `main` or `master`.
- Sets up JDK 17 (Temurin).
- Configures Gradle environment.
- Executes `./gradlew assembleDebug` (or fallback system Gradle) to verify build integrity and generate downloadable debug APK artifacts.

---

## 6. Non-Functional Requirements (NFRs)

1. **Offline-First Resilience**: All core counter features, local database storage, and library recitations must function 100% offline without requiring active internet connectivity.
2. **Performance**: Counter tap latency must be <16ms (60 FPS rendering) with immediate haptic response.
3. **Data Privacy**: Local counts and progress logs are stored purely on-device (Room DB / LocalStorage). No personal identifier tracking or unconsented telemetry.
4. **Accessibility**: High-contrast typography for Arabic script; large tap target areas for Tasbeeh counter (>48dp / 44px).

---

## 7. Future Expansion Roadmap

- **Phase 1 (Current)**: Core Tasbeeh counter, Darood library, Room/LocalStorage persistence, Gemini AI Habit Coach, Dual language UI, Android APK build workflow.
- **Phase 2**: Audio playback support for all Darood Shareef recitations with verse-by-verse highlighting.
- **Phase 3**: Optional cloud sync via Firebase for multi-device backup.
- **Phase 4**: Home Screen Widgets for Android to quickly increment counts without opening the main app.
