import React from 'react';
import { Sparkles, Flame, CheckCircle, Compass, Play, BookOpen, Clock, HeartHandshake } from 'lucide-react';
import { UserPreferences, DailyLog, StreakData, AIPlan, Darood } from '../types';
import { ProgressRing } from './ProgressRing';
import { formatPrayerName, getDefaultPrayerTimes } from '../utils/prayerTimes';

type HomeViewProps = {
  prefs: UserPreferences;
  todayLog: DailyLog;
  streak: StreakData;
  plan: AIPlan | null;
  daroods: Darood[];
  onOpenCounter: () => void;
  onOpenCounterForSlot?: (slotKey?: string) => void;
  onSelectTab: (tab: 'home' | 'counter' | 'plan' | 'library' | 'analytics' | 'prayers' | 'settings') => void;
  onSelectDaroodForRecitation: (darood: Darood) => void;
};

export const HomeView: React.FC<HomeViewProps> = ({
  prefs,
  todayLog,
  streak,
  plan,
  daroods,
  onOpenCounter,
  onOpenCounterForSlot,
  onSelectTab,
  onSelectDaroodForRecitation,
}) => {
  const isUrdu = prefs.language === 'ur';
  const currentCount = todayLog.totalCount || 0;
  const targetCount = prefs.dailyTarget || 100;

  // Rotating daily motivational lines
  const quotesUr = [
    'نبی کریم ﷺ پر ایک بار درود بھیجنے سے اللہ تعالیٰ ۱۰ رحمتیں نازل فرماتا ہے۔',
    'درودِ پاک ہر دعا کی قبولیت کی چابی اور قلبی سکون کا ذریعہ ہے۔',
    'قیامت کے دن نبی کریم ﷺ کے سب سے قریب وہ ہوگا جو سب سے زیادہ درود پڑھتا ہے۔',
    'درود شریف پڑھنا گناہوں کی معافی اور درجات کی بلندی کا باعث ہے۔',
  ];

  const quotesEn = [
    'Whoever sends blessings upon the Prophet ﷺ once, Allah sends 10 blessings upon them.',
    'Salawat is the key to accepted prayers and everlasting tranquility of the heart.',
    'The closest person to the Prophet ﷺ on the Day of Judgment is the one who sends the most Salawat.',
    'Sending peace upon the Prophet ﷺ elevates spiritual ranks and washes away worries.',
  ];

  const todayDateStr = todayLog.date || new Date().toISOString().split('T')[0];
  const dateSeed = todayDateStr.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const randomQuoteIndex = Math.abs(dateSeed) % quotesUr.length;
  const quoteText = isUrdu ? quotesUr[randomQuoteIndex] : quotesEn[randomQuoteIndex];

  // Randomly select a daily recommended Darood based on the date seed
  const recommendedIndex = daroods.length > 0 ? Math.abs(dateSeed) % daroods.length : 0;
  const recommendedDarood = daroods[recommendedIndex] || daroods[0];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner with Streak & Motivation */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-6 border border-amber-500/30 shadow-xl text-emerald-100 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUrdu ? 'روزمرہ اسلامی معمول' : 'Daily Islamic Habit'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-300">
            {isUrdu ? 'السلام علیکم ورحمۃ اللہ وبرکاتہ' : 'Assalam u Alaikum Wa Rahmatullah Wa Barakatuh'}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-200/90 italic font-serif leading-relaxed max-w-xl">
            "{quoteText}"
          </p>
        </div>

        {/* Streak Stats Card */}
        <div className="flex items-center gap-4 bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800/80 shadow-inner">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400/30 animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-sans text-amber-300">
              {streak.currentStreak}
            </span>
            <span className="text-xs font-medium text-emerald-300/80 block">
              {isUrdu ? 'دن مسلسل معمول' : 'Day Active Streak'}
            </span>
            <span className="text-[10px] text-amber-400/80 block">
              {isUrdu ? `بہترین: ${streak.longestStreak} دن` : `Best: ${streak.longestStreak} Days`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Progress Ring + Quick Recitation Launch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Progress Ring Card */}
        <ProgressRing
          current={currentCount}
          target={targetCount}
          isUrdu={isUrdu}
          onOpenCounter={onOpenCounter}
        />

        {/* Recommended Recitation & Quick Start Card */}
        <div className="bg-emerald-900/60 rounded-3xl p-6 border border-emerald-800/60 shadow-xl text-emerald-100 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                {isUrdu ? 'آج کا تجویز کردہ درود پاک' : "Today's Recommended Recitation"}
              </span>
              <span className="text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {isUrdu ? 'روزانہ تبدیل' : 'Daily Rotation'}
              </span>
            </div>

            <div
              onClick={() => onSelectDaroodForRecitation(recommendedDarood)}
              className="space-y-2 cursor-pointer group rounded-2xl p-2 -mx-2 hover:bg-emerald-950/40 transition-colors"
            >
              <h3 className="text-lg font-bold font-serif text-amber-200 group-hover:text-amber-300 transition-colors">
                {isUrdu ? recommendedDarood?.nameUr : recommendedDarood?.nameEn}
              </h3>
              <p
                className="text-xl sm:text-2xl font-serif text-amber-300 dir-rtl my-2 text-right leading-relaxed"
                dir="rtl"
                style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
              >
                {recommendedDarood?.arabicText.slice(0, 110)}...
              </p>
              <p className="text-xs text-emerald-200/80 line-clamp-2">
                ✨ {isUrdu ? recommendedDarood?.virtuesShortUr : recommendedDarood?.virtuesShortEn}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectDaroodForRecitation(recommendedDarood)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Play className="w-4 h-4 fill-emerald-950" />
              <span>
                {isUrdu ? `اس ${recommendedDarood?.type === 'salam' ? 'سلام' : 'درود'} کا شمار شروع کریں` : 'Start Reciting Tasbeeh'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Prayer Time Slots & Target Tracker */}
      <div className="bg-emerald-950/80 rounded-3xl p-6 border border-emerald-800/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold font-serif text-amber-300">
              {isUrdu ? 'نماز کے اوقات و کسٹم ہدف' : 'Prayer & Custom Time Slots Breakdown'}
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('plan')}
            className="text-xs text-emerald-300 hover:text-amber-300 underline"
          >
            {isUrdu ? 'درود و سلام پلان دیکھیں' : 'Edit Darood o Salam Plan'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {(
            plan?.slots ||
            getDefaultPrayerTimes(prefs.selectedCity, prefs.dailyTarget || 313, prefs.customSlots || []).map((s) => ({
              time: s.key,
              count: s.targetCount,
            }))
          ).map((slot, idx) => {
            const completedCount = todayLog.slotBreakdown?.[slot.time] || 0;
            const target = slot.count || 33;
            const isDone = completedCount >= target;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                  isDone
                    ? 'bg-emerald-900/80 border-emerald-500/80 shadow-md'
                    : 'bg-emerald-950/60 border-emerald-800/60'
                }`}
              >
                <span className="text-[11px] font-semibold text-emerald-200 block truncate">
                  {formatPrayerName(slot.time, prefs.language, prefs.customSlots)}
                </span>

                <div className="text-base font-extrabold font-sans text-amber-300">
                  {completedCount} <span className="text-xs opacity-60">/ {target}</span>
                </div>

                {isDone ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30 font-bold">
                    <CheckCircle className="w-3 h-3 text-amber-400" />
                    {isUrdu ? 'مکمل' : 'Done'}
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (onOpenCounterForSlot) {
                        onOpenCounterForSlot(slot.time);
                      } else {
                        onOpenCounter();
                      }
                    }}
                    className="text-[10px] text-emerald-300 hover:text-amber-300 underline font-medium"
                  >
                    {isUrdu ? '+ شمار کریں' : '+ Recite'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
