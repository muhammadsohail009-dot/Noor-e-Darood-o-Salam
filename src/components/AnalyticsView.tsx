import React, { useState } from 'react';
import { BarChart2, Award, Share2, Flame, Heart, Calendar, CheckCircle2, Download, Copy, Sparkles } from 'lucide-react';
import { DailyLog, Session, StreakData, UserPreferences } from '../types';

type AnalyticsViewProps = {
  dailyLogs: Record<string, DailyLog>;
  sessions: Session[];
  streak: StreakData;
  prefs: UserPreferences;
};

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  dailyLogs,
  sessions,
  streak,
  prefs,
}) => {
  const isUrdu = prefs.language === 'ur';
  const [showShareCardModal, setShowShareCardModal] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Calculate total lifetime recitations
  const lifetimeTotal = Object.values(dailyLogs).reduce((acc: number, log: DailyLog) => acc + (log.totalCount || 0), 0);

  // Reflections Breakdown
  const peacefulCount = sessions.filter((s) => s.reflection === 'peaceful').length;
  const neutralCount = sessions.filter((s) => s.reflection === 'neutral').length;
  const distractedCount = sessions.filter((s) => s.reflection === 'distracted').length;
  const totalReflections = peacefulCount + neutralCount + distractedCount;

  // Compute Last 7 Days counts
  const last7Days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', { weekday: 'short' });
    const log = dailyLogs[dateStr];
    return {
      dateStr,
      dayLabel,
      count: log?.totalCount || 0,
    };
  });

  const maxWeeklyCount = Math.max(...last7Days.map((d) => d.count), prefs.dailyTarget || 100);

  const handleCopyShareText = () => {
    const shareMessage = isUrdu
      ? `الحمد للہ! میں نے نورِ درود ایپ کے ذریعے نبی کریم ﷺ پر کل ${lifetimeTotal} مرتبہ درودِ پاک کا نذرانہ پیش کیا ہے۔ باقاعدگی: ${streak.currentStreak} دن مسلسل! 🌟`
      : `Alhamdulillah! I have recited ${lifetimeTotal} Salawat upon Prophet Muhammad ﷺ with Noor-e-Darood app. Active streak: ${streak.currentStreak} days! 🌟`;

    navigator.clipboard.writeText(shareMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-950/80 rounded-3xl p-6 border border-emerald-800/60 shadow-xl text-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-serif text-amber-300">
              {isUrdu ? 'پیشرفت و تاریخچہ' : 'Progress & Analytics'}
            </h2>
          </div>
          <p className="text-xs text-emerald-300/80">
            {isUrdu
              ? 'درودِ پاک کے شمار کی ہفتہ وار رپورٹ اور روحانی کیفیت کے اعداد و شمار'
              : 'Lifetime recitation stats, weekly trends & spiritual reflection history'}
          </p>
        </div>

        <button
          onClick={() => setShowShareCardModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-xs shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2"
        >
          <Share2 className="w-4 h-4 fill-emerald-950" />
          <span>{isUrdu ? 'کامیابی کارڈ شیئر کریں' : 'Share Achievement Card'}</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Lifetime Recitations */}
        <div className="bg-emerald-950/80 rounded-2xl p-4 border border-amber-500/30 text-center space-y-1">
          <span className="text-[11px] text-amber-300/80 font-medium block">
            {isUrdu ? 'کل پڑھا گیا درود:' : 'Lifetime Recitations:'}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-sans text-amber-300">
            {lifetimeTotal.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-300/70 block">
            {isUrdu ? 'مجموعی برکات' : 'Total Blessings'}
          </span>
        </div>

        {/* Current Active Streak */}
        <div className="bg-emerald-950/80 rounded-2xl p-4 border border-emerald-800/80 text-center space-y-1">
          <span className="text-[11px] text-emerald-300 font-medium block">
            {isUrdu ? 'موجودہ تسلسل:' : 'Current Streak:'}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-sans text-amber-400 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            {streak.currentStreak}
          </span>
          <span className="text-[10px] text-emerald-300/70 block">
            {isUrdu ? 'دن مسلسل' : 'Days Active'}
          </span>
        </div>

        {/* Longest Streak */}
        <div className="bg-emerald-950/80 rounded-2xl p-4 border border-emerald-800/80 text-center space-y-1">
          <span className="text-[11px] text-emerald-300 font-medium block">
            {isUrdu ? 'بہترین ریکارڈ:' : 'Longest Streak:'}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-sans text-emerald-200">
            {streak.longestStreak}
          </span>
          <span className="text-[10px] text-emerald-300/70 block">
            {isUrdu ? 'دن کا ریکارڈ' : 'Best Streak'}
          </span>
        </div>

        {/* Total Sessions */}
        <div className="bg-emerald-950/80 rounded-2xl p-4 border border-emerald-800/80 text-center space-y-1">
          <span className="text-[11px] text-emerald-300 font-medium block">
            {isUrdu ? 'کل سیشنز:' : 'Total Sessions:'}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-sans text-emerald-200">
            {sessions.length}
          </span>
          <span className="text-[10px] text-emerald-300/70 block">
            {isUrdu ? 'تسبیح کے نشستیں' : 'Completed Sessions'}
          </span>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="bg-emerald-950/80 rounded-3xl p-6 border border-emerald-800/60 shadow-xl space-y-4">
        <h3 className="text-base font-bold font-serif text-amber-300 border-b border-emerald-800/60 pb-3">
          {isUrdu ? 'گزشتہ 7 ایام کی درود رپورٹ' : 'Last 7 Days Recitation Bar Chart'}
        </h3>

        <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
          {last7Days.map((item, idx) => {
            const heightPercent = maxWeeklyCount > 0 ? Math.round((item.count / maxWeeklyCount) * 100) : 0;
            const isToday = idx === 6;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.count}
                </span>

                <div className="w-full bg-emerald-900/60 rounded-t-xl h-full max-h-[140px] flex items-end p-0.5 relative overflow-hidden">
                  <div
                    style={{ height: `${Math.max(8, heightPercent)}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-amber-500 to-amber-400 shadow-md'
                        : 'bg-emerald-500/80 hover:bg-emerald-400'
                    }`}
                  />
                </div>

                <span className={`text-[11px] font-semibold ${isToday ? 'text-amber-300 font-bold' : 'text-emerald-300/80'}`}>
                  {item.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spiritual Reflections Breakdown */}
      {totalReflections > 0 && (
        <div className="bg-emerald-950/80 rounded-3xl p-6 border border-emerald-800/60 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-3">
            <Heart className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold font-serif text-amber-300">
              {isUrdu ? 'روحانی کیفیت کا تجزیہ' : 'Spiritual Wellness Distribution'}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 space-y-1">
              <span className="text-2xl">🌿</span>
              <span className="text-lg font-bold text-amber-300 block">{peacefulCount}</span>
              <span className="text-xs text-emerald-200">{isUrdu ? 'پُرسکون' : 'Peaceful'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 space-y-1">
              <span className="text-2xl">😐</span>
              <span className="text-lg font-bold text-emerald-200 block">{neutralCount}</span>
              <span className="text-xs text-emerald-200">{isUrdu ? 'معتدل' : 'Neutral'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 space-y-1">
              <span className="text-2xl">💭</span>
              <span className="text-lg font-bold text-emerald-300 block">{distractedCount}</span>
              <span className="text-xs text-emerald-200">{isUrdu ? 'توجہ ہٹ گئی' : 'Distracted'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Sessions Logs */}
      <div className="bg-emerald-950/80 rounded-3xl p-6 border border-emerald-800/60 shadow-xl space-y-4">
        <h3 className="text-base font-bold font-serif text-amber-300 border-b border-emerald-800/60 pb-3">
          {isUrdu ? 'حال ہی کے سیشنز کی تاریخ' : 'Recent Recitation Session Logs'}
        </h3>

        <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
          {sessions.slice(0, 15).map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-900/50 border border-emerald-800/50 text-xs text-emerald-100"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-amber-200 block">{session.daroodName}</span>
                <span className="text-[10px] text-emerald-300/70">
                  {new Date(session.endedAt).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {session.reflection && (
                  <span className="text-base" title={session.reflection}>
                    {session.reflection === 'peaceful' ? '🌿' : session.reflection === 'neutral' ? '😐' : '💭'}
                  </span>
                )}
                <span className="font-extrabold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-400/20 text-sm">
                  {session.count} {isUrdu ? 'بار' : 'times'}
                </span>
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <p className="text-center text-xs text-emerald-300/70 py-6">
              {isUrdu ? 'ابھی کوئی سیشن ریکارڈ نہیں ہوا۔' : 'No recitation sessions logged yet.'}
            </p>
          )}
        </div>
      </div>

      {/* Shareable Achievement Modal */}
      {showShareCardModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-emerald-950 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-emerald-100 text-center relative animate-in fade-in zoom-in duration-200">
            {/* Visual Card Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-emerald-900 border-2 border-amber-400/40 space-y-4 shadow-xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="text-xl font-bold font-serif text-amber-300">
                {isUrdu ? 'درودِ پاک کی برکات' : 'Noor-e-Darood Milestone'}
              </h3>

              <div className="py-2">
                <span className="text-xs text-amber-200/80 block uppercase tracking-wider">
                  {isUrdu ? 'مجموعی نذرانہ' : 'Total Recitations'}
                </span>
                <span className="text-4xl font-extrabold font-sans text-amber-300 tracking-tight">
                  {lifetimeTotal.toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-emerald-200/90 italic font-serif" dir={isUrdu ? 'rtl' : 'ltr'}>
                {isUrdu
                  ? 'نورِ درود ایپ کے ساتھ نبی کریم ﷺ پر Salawat بھیجنے کا مبارک سفر'
                  : 'Sending peace and blessings upon Prophet Muhammad ﷺ'}
              </p>

              <div className="flex items-center justify-center gap-2 text-[11px] text-amber-300 bg-amber-500/20 py-1.5 px-3 rounded-full border border-amber-400/30">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{streak.currentStreak} {isUrdu ? 'دن مسلسل فعال' : 'Days Streak Active'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyShareText}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-xs shadow-md hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
              >
                {copiedText ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? (isUrdu ? 'متن کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'پیغام کاپی کریں' : 'Copy Message')}</span>
              </button>

              <button
                onClick={() => setShowShareCardModal(false)}
                className="px-4 py-3 rounded-xl bg-emerald-900 border border-emerald-700 text-xs text-emerald-200 font-semibold hover:bg-emerald-800 transition-colors"
              >
                {isUrdu ? 'بند کریں' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
