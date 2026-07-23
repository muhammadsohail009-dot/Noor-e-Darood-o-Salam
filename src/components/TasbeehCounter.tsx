import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Volume2, VolumeX, CheckCircle, Heart, Minus, ChevronDown, BookOpen, Clock } from 'lucide-react';
import { Darood, UserPreferences, SessionReflection, Session } from '../types';
import { soundEngine } from '../utils/audio';
import { getCurrentPrayerSlotKey, formatPrayerName } from '../utils/prayerTimes';

type TasbeehCounterProps = {
  daroods: Darood[];
  prefs: UserPreferences;
  onFinishSession: (session: Session) => void;
  isUrdu: boolean;
  initialDaroodId?: string;
  initialTargetSlot?: string;
};

export const TasbeehCounter: React.FC<TasbeehCounterProps> = ({
  daroods,
  prefs,
  onFinishSession,
  isUrdu,
  initialDaroodId,
  initialTargetSlot,
}) => {
  const [selectedDaroodId, setSelectedDaroodId] = useState<string>(
    initialDaroodId || daroods[0]?.id || 'darood_e_ibrahim'
  );

  const [selectedSlot, setSelectedSlot] = useState<string>(
    initialTargetSlot || getCurrentPrayerSlotKey()
  );

  useEffect(() => {
    if (initialDaroodId) {
      setSelectedDaroodId(initialDaroodId);
    }
  }, [initialDaroodId]);

  useEffect(() => {
    if (initialTargetSlot) {
      setSelectedSlot(initialTargetSlot);
    }
  }, [initialTargetSlot]);

  const [sessionCount, setSessionCount] = useState<number>(0);
  const [sessionTarget, setSessionTarget] = useState<number>(33);
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl' | '2xl'>('xl');
  const [startTime] = useState<string>(new Date().toISOString());
  const [showReflectionModal, setShowReflectionModal] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(prefs.soundEnabled);
  const [selectedReflection, setSelectedReflection] = useState<SessionReflection | null>(null);

  const selectedDarood = daroods.find((d) => d.id === selectedDaroodId) || daroods[0];

  const handleIncrement = () => {
    const nextCount = sessionCount + 1;
    setSessionCount(nextCount);

    if (soundEnabled) {
      soundEngine.playBeadClick();
    }
    soundEngine.vibratePattern();

    // Check if goal reached
    if (nextCount === sessionTarget || (nextCount > 0 && nextCount % 33 === 0)) {
      if (soundEnabled) {
        soundEngine.playGoalChime();
      }
    }
  };

  const handleDecrement = () => {
    if (sessionCount > 0) {
      setSessionCount(sessionCount - 1);
    }
  };

  const handleReset = () => {
    if (sessionCount > 0) {
      if (confirm(isUrdu ? 'کیا آپ اس سیشن کی گنتی صفر کرنا چاہتے ہیں؟' : 'Reset session count to zero?')) {
        setSessionCount(0);
      }
    }
  };

  const handleCompleteSession = (reflection: SessionReflection) => {
    if (sessionCount === 0) return;

    const newSession: Session = {
      id: 'session_' + Date.now(),
      daroodId: selectedDarood.id,
      daroodName: isUrdu ? selectedDarood.nameUr : selectedDarood.nameEn,
      startedAt: startTime,
      endedAt: new Date().toISOString(),
      count: sessionCount,
      targetSlot: selectedSlot,
      reflection,
    };

    onFinishSession(newSession);
    setShowReflectionModal(false);
    setSelectedReflection(null);
    setSessionCount(0);
  };

  // Font size classes for Arabic
  const fontSizeClass = {
    md: 'text-2xl sm:text-3xl leading-relaxed',
    lg: 'text-3xl sm:text-4xl leading-relaxed',
    xl: 'text-4xl sm:text-5xl leading-loose',
    '2xl': 'text-5xl sm:text-6xl leading-loose',
  }[fontSize];

  // Calculate current bead index in 33-bead loop
  const currentBeadIndex = sessionCount > 0 ? (sessionCount - 1) % 33 : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header: Darood Selector & Salat Slot Selector */}
      <div className="bg-emerald-950/80 rounded-2xl p-5 border border-emerald-800/60 shadow-lg text-emerald-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Darood Dropdown */}
        <div className="flex-1 min-w-[220px]">
          <label className="text-xs text-amber-300 font-medium block mb-1">
            {isUrdu ? 'درود پاک منتخب کریں:' : 'Select Darood Recitation:'}
          </label>
          <div className="relative">
            <select
              value={selectedDaroodId}
              onChange={(e) => {
                setSelectedDaroodId(e.target.value);
                setSessionCount(0);
              }}
              className="w-full bg-emerald-900/80 border border-emerald-700 text-amber-200 text-sm font-semibold rounded-xl px-4 py-2.5 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            >
              {daroods.map((d) => (
                <option key={d.id} value={d.id} className="bg-emerald-950 text-emerald-100">
                  {isUrdu ? d.nameUr : d.nameEn} ({d.category})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Salat / Prayer Time Slot Dropdown */}
        <div className="w-full md:w-56">
          <label className="text-xs text-emerald-300 font-medium block mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUrdu ? 'نماز / موقع کا ہدف:' : 'Salat Time Slot Target:'}</span>
          </label>
          <div className="relative">
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full bg-emerald-900/80 border border-emerald-700 text-amber-200 text-xs font-bold rounded-xl px-3 py-2.5 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            >
              <option value="fajr" className="bg-emerald-950 text-emerald-100">{formatPrayerName('fajr', prefs.language, prefs.customSlots)}</option>
              <option value="dhuhr" className="bg-emerald-950 text-emerald-100">{formatPrayerName('dhuhr', prefs.language, prefs.customSlots)}</option>
              <option value="asr" className="bg-emerald-950 text-emerald-100">{formatPrayerName('asr', prefs.language, prefs.customSlots)}</option>
              <option value="maghrib" className="bg-emerald-950 text-emerald-100">{formatPrayerName('maghrib', prefs.language, prefs.customSlots)}</option>
              <option value="isha" className="bg-emerald-950 text-emerald-100">{formatPrayerName('isha', prefs.language, prefs.customSlots)}</option>
              <option value="before_sleep" className="bg-emerald-950 text-emerald-100">{formatPrayerName('before_sleep', prefs.language, prefs.customSlots)}</option>
              {(prefs.customSlots || []).map((cs) => (
                <option key={cs.id} value={cs.id} className="bg-emerald-950 text-emerald-100">
                  {formatPrayerName(cs.id, prefs.language, prefs.customSlots)} ({cs.timeStr})
                </option>
              ))}
              <option value="general" className="bg-emerald-950 text-emerald-100">{formatPrayerName('general', prefs.language, prefs.customSlots)}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Target Buttons */}
        <div className="flex items-center gap-1.5 justify-end pt-1 md:pt-0">
          <span className="text-xs text-emerald-300 font-medium hidden lg:inline">
            {isUrdu ? 'ہدف:' : 'Target:'}
          </span>
          {[33, 100, 313, 1000].map((tgt) => (
            <button
              key={tgt}
              onClick={() => setSessionTarget(tgt)}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                sessionTarget === tgt
                  ? 'bg-amber-500 text-emerald-950 shadow-md'
                  : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
              }`}
            >
              {tgt}
            </button>
          ))}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 ml-1"
            title="Toggle Click Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 opacity-50" />}
          </button>
        </div>
      </div>

      {/* Main Recitation Card */}
      <div className="bg-gradient-to-b from-emerald-900/90 to-emerald-950/95 rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Subtle Islamic Motif Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08)_0,transparent_70%)] pointer-events-none" />

        {/* Font Size Controls */}
        <div className="flex items-center justify-between text-xs text-emerald-300 border-b border-emerald-800/60 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-amber-300">
              {isUrdu ? selectedDarood.nameUr : selectedDarood.nameEn}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-800/80">
            <span className="text-[10px] text-emerald-400">{isUrdu ? 'فونٹ:' : 'Font:'}</span>
            {(['md', 'lg', 'xl', '2xl'] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => setFontSize(sz)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  fontSize === sz ? 'bg-amber-500 text-emerald-950' : 'text-emerald-300 hover:text-white'
                }`}
              >
                {sz.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Arabic Text Display */}
        <div className="py-4 px-2 min-h-[160px] flex items-center justify-center">
          <p
            className={`font-serif text-amber-200 tracking-wide dir-rtl text-center select-none drop-shadow-md ${fontSizeClass}`}
            dir="rtl"
            style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
          >
            {selectedDarood.arabicText}
          </p>
        </div>

        {/* Urdu Translation / Transliteration */}
        <div className="space-y-2 bg-emerald-950/60 rounded-2xl p-4 border border-emerald-800/40 text-emerald-200/90 text-sm">
          <p className="font-sans leading-relaxed text-emerald-100" dir={isUrdu ? 'rtl' : 'ltr'}>
            <span className="font-bold text-amber-400/90">{isUrdu ? 'ترجمہ: ' : 'Translation: '}</span>
            {selectedDarood.urduTranslation}
          </p>
          {selectedDarood.transliteration && (
            <p className="text-xs text-emerald-300/70 italic font-sans border-t border-emerald-900/60 pt-2">
              {selectedDarood.transliteration}
            </p>
          )}
        </div>

        {/* Tasbeeh 33 Bead Ring Visualizer */}
        <div className="py-2 flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md mx-auto p-3 bg-emerald-950/80 rounded-2xl border border-emerald-800/60">
            {Array.from({ length: 33 }).map((_, idx) => {
              const isPassed = idx < currentBeadIndex;
              const isCurrent = idx === currentBeadIndex;
              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 border ${
                    isCurrent
                      ? 'bg-amber-400 border-amber-300 scale-125 shadow-lg shadow-amber-400/50'
                      : isPassed
                      ? 'bg-emerald-500 border-emerald-400 opacity-90'
                      : 'bg-emerald-950 border-emerald-800 opacity-40'
                  }`}
                  title={`Bead ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* Big Counter Button & Controls */}
        <div className="flex flex-col items-center gap-4 py-2">
          {/* Progress Banner */}
          <div className="flex items-center gap-3 text-emerald-200 font-sans">
            <span className="text-2xl font-bold text-amber-300">{sessionCount}</span>
            <span className="text-sm opacity-60">/ {sessionTarget}</span>
            {sessionCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-800/60 text-emerald-300 border border-emerald-700/50">
                {Math.round((sessionCount / sessionTarget) * 100)}%
              </span>
            )}
          </div>

          {/* Massive Tap Button */}
          <button
            onClick={handleIncrement}
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-amber-500 via-emerald-600 to-emerald-400 p-1 shadow-2xl shadow-emerald-950 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group focus:outline-none"
          >
            <div className="w-full h-full rounded-full bg-emerald-950 flex flex-col items-center justify-center border-2 border-amber-400/40 text-amber-300 group-hover:bg-emerald-900 transition-colors">
              <span className="text-4xl sm:text-5xl font-extrabold font-sans tracking-tight text-white">
                {sessionCount}
              </span>
              <span className="text-xs font-semibold text-amber-400 mt-1 uppercase tracking-wider">
                {isUrdu ? 'درود پڑھیں (ٹیپ کریں)' : 'Tap to Count'}
              </span>
            </div>
          </button>

          {/* Auxiliary Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleDecrement}
              disabled={sessionCount === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 text-xs font-semibold hover:bg-emerald-800 disabled:opacity-40 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>{isUrdu ? '-1 منہا' : '-1 Undo'}</span>
            </button>

            <button
              onClick={handleReset}
              disabled={sessionCount === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 text-xs font-semibold hover:bg-emerald-800 disabled:opacity-40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ری سیٹ' : 'Reset'}</span>
            </button>

            <button
              onClick={() => setShowReflectionModal(true)}
              disabled={sessionCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 text-sm font-bold shadow-lg hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 transition-all"
            >
              <CheckCircle className="w-4 h-4 fill-emerald-950" />
              <span>{isUrdu ? 'سیشن مکمل کریں' : 'Finish Session'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spiritual Reflection Prompt Modal */}
      {showReflectionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-emerald-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-emerald-100 text-center space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Heart className="w-7 h-7 fill-amber-400/30" />
            </div>

            <h3 className="text-xl font-bold font-serif text-amber-300">
              {isUrdu ? 'روحانی کیفیت اور جائزہ' : 'Spiritual Reflection'}
            </h3>

            <p className="text-sm text-emerald-200/90 leading-relaxed">
              {isUrdu
                ? `ماشاءاللہ! آپ نے ${sessionCount} مرتبہ درودِ پاک کا تحفہ پیش کیا۔ اب آپ کیسا محسوس کر رہے ہیں؟`
                : `MashaAllah! You recited ${sessionCount} Salawat upon the Prophet ﷺ. How do you feel right now?`}
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => handleCompleteSession('peaceful')}
                className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 hover:bg-emerald-800 hover:border-amber-400 transition-all text-xs font-semibold text-emerald-100 group"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">🌿</span>
                <span>{isUrdu ? 'پُرسکون' : 'Peaceful'}</span>
              </button>

              <button
                onClick={() => handleCompleteSession('neutral')}
                className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 hover:bg-emerald-800 hover:border-amber-400 transition-all text-xs font-semibold text-emerald-100 group"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">😐</span>
                <span>{isUrdu ? 'معتدل' : 'Neutral'}</span>
              </button>

              <button
                onClick={() => handleCompleteSession('distracted')}
                className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 hover:bg-emerald-800 hover:border-amber-400 transition-all text-xs font-semibold text-emerald-100 group"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">💭</span>
                <span>{isUrdu ? 'توجہ ہٹ گئی' : 'Distracted'}</span>
              </button>
            </div>

            <button
              onClick={() => handleCompleteSession('peaceful')}
              className="w-full py-3 rounded-xl bg-emerald-900/40 border border-emerald-800 text-xs text-emerald-300 hover:bg-emerald-800/50 transition-colors mt-2"
            >
              {isUrdu ? 'بغیر تاثر کے محفوظ کریں' : 'Save Without Reflection'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
