import { UserPreferences, DailyLog, StreakData, Session, AIPlan } from '../types';
import { getCurrentPrayerSlotKey } from './prayerTimes';

const STORAGE_KEYS = {
  PREFERENCES: 'noor_darood_user_preferences',
  DAILY_LOGS: 'noor_darood_daily_logs',
  SESSIONS: 'noor_darood_sessions',
  STREAK: 'noor_darood_streak',
  AI_PLAN: 'noor_darood_ai_plan',
};

export function getTodayDateStr(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getDefaultPreferences(): UserPreferences {
  return {
    language: 'ur',
    dailyTarget: 100,
    timeCapacity: '3-5min',
    preferredTimes: ['fajr', 'maghrib', 'before_sleep'],
    goal: 'build_habit',
    theme: 'emerald',
    soundEnabled: true,
    vibrationEnabled: true,
    selectedCity: 'Multan, Pakistan',
    onboardingCompleted: false,
  };
}

export function loadUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return getDefaultPreferences();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return getDefaultPreferences();
    return JSON.parse(raw);
  } catch {
    return getDefaultPreferences();
  }
}

export function saveUserPreferences(prefs: UserPreferences) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function loadDailyLogs(): Record<string, DailyLog> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveDailyLogs(logs: Record<string, DailyLog>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch {
    // ignore
  }
}

export function loadSessions(): Session[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch {
    // ignore
  }
}

export function loadStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, lastActiveDate: '', longestStreak: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (!raw) return { currentStreak: 0, lastActiveDate: '', longestStreak: 0 };
    return JSON.parse(raw);
  } catch {
    return { currentStreak: 0, lastActiveDate: '', longestStreak: 0 };
  }
}

export function saveStreakData(streak: StreakData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
  } catch {
    // ignore
  }
}

export function loadAIPlan(): AIPlan | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AI_PLAN);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAIPlan(plan: AIPlan) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.AI_PLAN, JSON.stringify(plan));
  } catch {
    // ignore
  }
}

export function recordRecitationSession(
  session: Session,
  currentPrefs: UserPreferences
): { updatedLog: DailyLog; updatedStreak: StreakData } {
  const today = getTodayDateStr();
  const logs = loadDailyLogs();
  const todayLog: DailyLog = logs[today] || {
    date: today,
    totalCount: 0,
    sessionsCount: 0,
    slotBreakdown: {},
  };

  todayLog.totalCount += session.count;
  todayLog.sessionsCount += 1;
  if (!todayLog.slotBreakdown) {
    todayLog.slotBreakdown = {};
  }
  const slotKey = session.targetSlot || getCurrentPrayerSlotKey();
  todayLog.slotBreakdown[slotKey] = (todayLog.slotBreakdown[slotKey] || 0) + session.count;

  logs[today] = todayLog;
  saveDailyLogs(logs);

  // Save session list
  const sessions = loadSessions();
  sessions.unshift(session);
  saveSessions(sessions);

  // Update streak
  const streak = loadStreakData();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (!streak.lastActiveDate) {
    streak.currentStreak = 1;
    streak.lastActiveDate = today;
    streak.longestStreak = 1;
  } else if (streak.lastActiveDate === today) {
    // Already recorded active today
  } else if (streak.lastActiveDate === yesterdayStr) {
    streak.currentStreak += 1;
    streak.lastActiveDate = today;
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
  } else {
    // Missed days
    streak.currentStreak = 1;
    streak.lastActiveDate = today;
  }

  saveStreakData(streak);

  return { updatedLog: todayLog, updatedStreak: streak };
}
