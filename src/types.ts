export type Language = 'en' | 'ur';

export type CustomSlot = {
  id: string;
  nameEn: string;
  nameUr: string;
  timeStr: string;
  enabled: boolean;
};

export type UserPreferences = {
  language: Language;
  dailyTarget: number;
  timeCapacity: string; // e.g. '<3min', '3-5min', '5-10min', '10+min', '15 mins', '30 mins', etc.
  preferredTimes: string[]; // e.g. ['fajr', 'maghrib', 'before_sleep']
  goal: 'build_habit' | 'increase_count' | 'seek_peace' | 'follow_sunnah';
  theme: 'light' | 'dark' | 'emerald';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  selectedCity?: string;
  onboardingCompleted: boolean;
  customSlots?: CustomSlot[];
};

export type Darood = {
  id: string;
  nameEn: string;
  nameUr: string;
  arabicText: string;
  urduTranslation: string;
  transliteration: string;
  virtuesShortEn: string;
  virtuesShortUr: string;
  category: 'core' | 'short' | 'healing' | 'comprehensive' | 'special';
  recommendedCount?: number;
  type?: 'darood' | 'salam' | 'qasida' | 'naat' | 'dua';
};

export type SessionReflection = 'peaceful' | 'neutral' | 'distracted';

export type Session = {
  id: string;
  daroodId: string;
  daroodName: string;
  startedAt: string;
  endedAt: string;
  count: number;
  targetSlot?: string;
  reflection?: SessionReflection;
};

export type DailyLog = {
  date: string; // YYYY-MM-DD
  totalCount: number;
  sessionsCount: number;
  slotBreakdown: Record<string, number>;
};

export type StreakData = {
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  longestStreak: number;
};

export type PlanSlot = {
  time: string; // 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'before_sleep'
  count: number;
  daroodId: string;
  daroodName: string;
};

export type AIPlan = {
  dailyTarget: number;
  slots: PlanSlot[];
  recommendedDaroods: string[];
  coachMessageEn: string;
  coachMessageUr: string;
  weeklyTarget: number;
};

export type PrayerTimeSlot = {
  name: string; // 'Fajr', 'Dhuhr', etc.
  key: string;
  timeStr: string;
  targetCount: number;
  completedCount: number;
};
