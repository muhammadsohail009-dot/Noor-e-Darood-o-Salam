import React, { useState, useEffect } from 'react';
import { Navbar, SidebarNav } from './components/Navbar';
import { OnboardingWizard } from './components/OnboardingWizard';
import { HomeView } from './components/HomeView';
import { TasbeehCounter } from './components/TasbeehCounter';
import { PlanView } from './components/PlanView';
import { LibraryView } from './components/LibraryView';
import { AnalyticsView } from './components/AnalyticsView';
import { PrayerTimesView } from './components/PrayerTimesView';
import { SettingsView } from './components/SettingsView';

import {
  loadUserPreferences,
  saveUserPreferences,
  loadDailyLogs,
  loadSessions,
  loadStreakData,
  loadAIPlan,
  saveAIPlan,
  recordRecitationSession,
  getTodayDateStr,
} from './utils/storage';
import { SEED_DAROODS } from './data/daroods';
import { UserPreferences, DailyLog, StreakData, Session, AIPlan, Darood } from './types';

export default function App() {
  const [prefs, setPrefs] = useState<UserPreferences>(() => loadUserPreferences());
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(() => loadDailyLogs());
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions());
  const [streak, setStreak] = useState<StreakData>(() => loadStreakData());
  const [plan, setPlan] = useState<AIPlan | null>(() => loadAIPlan());
  const [daroods] = useState<Darood[]>(SEED_DAROODS);

  const [activeTab, setActiveTab] = useState<
    'home' | 'counter' | 'plan' | 'library' | 'analytics' | 'prayers' | 'settings'
  >('home');
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [selectedDaroodIdForCounter, setSelectedDaroodIdForCounter] = useState<string | undefined>();
  const [selectedTargetSlotForCounter, setSelectedTargetSlotForCounter] = useState<string | undefined>();
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredInstallPrompt(null);
    }
  };

  const todayStr = getTodayDateStr();
  const todayLog: DailyLog = dailyLogs[todayStr] || {
    date: todayStr,
    totalCount: 0,
    sessionsCount: 0,
    slotBreakdown: {},
  };

  const isUrdu = prefs.language === 'ur';

  const handleOpenCounterForSlot = (slotKey?: string) => {
    setSelectedTargetSlotForCounter(slotKey);
    setActiveTab('counter');
  };

  // Handle Onboarding Completion
  const handleOnboardingComplete = (newPrefs: UserPreferences, newPlan: AIPlan) => {
    setPrefs(newPrefs);
    saveUserPreferences(newPrefs);

    setPlan(newPlan);
    saveAIPlan(newPlan);
  };

  // Handle Recitation Session Saved
  const handleFinishSession = (session: Session) => {
    const { updatedLog, updatedStreak } = recordRecitationSession(session, prefs);

    setDailyLogs(loadDailyLogs());
    setSessions(loadSessions());
    setStreak(updatedStreak);

    // Switch back to Home or stay
  };

  // Update Preferences Helper
  const handleUpdatePreferences = (updated: UserPreferences) => {
    setPrefs(updated);
    saveUserPreferences(updated);
  };

  // Handle Select Darood from Library for Counter
  const handleSelectDaroodForRecitation = (darood: Darood) => {
    setSelectedDaroodIdForCounter(darood.id);
    setActiveTab('counter');
  };

  // If user hasn't completed onboarding, render wizard
  if (!prefs.onboardingCompleted) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className={`min-h-screen bg-emerald-950 text-emerald-100 font-sans ${isUrdu ? 'dir-rtl' : 'dir-ltr'}`}>
      <Navbar
        prefs={prefs}
        streak={streak}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleLanguage={() =>
          handleUpdatePreferences({ ...prefs, language: isUrdu ? 'en' : 'ur' })
        }
        onToggleSound={() =>
          handleUpdatePreferences({ ...prefs, soundEnabled: !prefs.soundEnabled })
        }
        isSidebarVisible={isSidebarVisible}
        onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
      />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-6 pt-6 pb-12 ${isUrdu ? 'md:flex-row-reverse' : ''}`}>
        {/* Desktop Vertical Navigation Sidebar */}
        {isSidebarVisible && (
          <aside className="w-full md:w-60 lg:w-64 shrink-0 hidden md:block animate-in fade-in zoom-in-95 duration-200">
            <SidebarNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isUrdu={isUrdu}
              onClose={() => setIsSidebarVisible(false)}
            />
          </aside>
        )}

        {/* Main View Area - Expands to 100% full width when sidebar is hidden */}
        <main className="flex-1 min-w-0 transition-all duration-300">
          {deferredInstallPrompt && (
            <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-900 to-emerald-950 border-2 border-amber-400/60 flex items-center justify-between gap-4 text-emerald-100 shadow-xl animate-bounce">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    {isUrdu ? 'اینڈرائیڈ ایپ انسٹال کریں' : 'Install Android Mobile App'}
                  </h4>
                  <p className="text-xs text-emerald-200/90">
                    {isUrdu ? 'اس ایپ کو فون کی ہوم اسکرین پر شامل کریں اور آف لائن استعمال کریں' : 'Add to Home Screen & run 100% offline without internet'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleInstallApp}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md shrink-0 cursor-pointer transition-transform active:scale-95"
              >
                {isUrdu ? 'انسٹال کریں' : 'Install Now'}
              </button>
            </div>
          )}

          {!isSidebarVisible && (

            <div className={`hidden md:flex mb-4 ${isUrdu ? 'justify-end' : 'justify-start'}`}>
              <button
                onClick={() => setIsSidebarVisible(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/25 via-emerald-900 to-emerald-950 hover:from-amber-500/35 border border-amber-400/50 text-amber-300 text-xs font-bold shadow-lg hover:border-amber-400 transition-all cursor-pointer"
              >
                <span>{isUrdu ? 'عمودی نیویگیشن مینو کھولیں 👈' : '👉 Open Vertical Navigation Menu'}</span>
              </button>
            </div>
          )}

          {activeTab === 'home' && (
            <HomeView
              prefs={prefs}
              todayLog={todayLog}
              streak={streak}
              plan={plan}
              daroods={daroods}
              onOpenCounter={() => handleOpenCounterForSlot()}
              onOpenCounterForSlot={handleOpenCounterForSlot}
              onSelectTab={setActiveTab}
              onSelectDaroodForRecitation={handleSelectDaroodForRecitation}
            />
          )}

          {activeTab === 'counter' && (
            <TasbeehCounter
              daroods={daroods}
              prefs={prefs}
              onFinishSession={handleFinishSession}
              isUrdu={isUrdu}
              initialDaroodId={selectedDaroodIdForCounter}
              initialTargetSlot={selectedTargetSlotForCounter}
            />
          )}

          {activeTab === 'plan' && (
            <PlanView
              prefs={prefs}
              plan={plan}
              onUpdatePlan={(newPlan, newPrefs) => {
                setPlan(newPlan);
                saveAIPlan(newPlan);
                handleUpdatePreferences(newPrefs);
              }}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView
              daroods={daroods}
              prefs={prefs}
              onSelectDaroodForRecitation={handleSelectDaroodForRecitation}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              dailyLogs={dailyLogs}
              sessions={sessions}
              streak={streak}
              prefs={prefs}
            />
          )}

          {activeTab === 'prayers' && (
            <PrayerTimesView
              prefs={prefs}
              todayLog={todayLog}
              onUpdatePreferences={handleUpdatePreferences}
              onOpenCounterForSlot={handleOpenCounterForSlot}
              onFinishSession={handleFinishSession}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              prefs={prefs}
              dailyLogs={dailyLogs}
              sessions={sessions}
              onUpdatePreferences={handleUpdatePreferences}
              onResetOnboarding={() =>
                handleUpdatePreferences({ ...prefs, onboardingCompleted: false })
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}
