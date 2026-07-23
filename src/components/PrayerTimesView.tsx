import React, { useState } from 'react';
import { Compass, MapPin, Clock, CheckCircle2, Plus, Trash2, Calendar, Sparkles, X } from 'lucide-react';
import { UserPreferences, DailyLog, Session, CustomSlot } from '../types';
import { MAJOR_CITIES, getDefaultPrayerTimes, formatPrayerName } from '../utils/prayerTimes';

type PrayerTimesViewProps = {
  prefs: UserPreferences;
  todayLog: DailyLog;
  onUpdatePreferences: (updated: UserPreferences) => void;
  onOpenCounterForSlot: (slotKey?: string) => void;
  onFinishSession?: (session: Session) => void;
};

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({
  prefs,
  todayLog,
  onUpdatePreferences,
  onOpenCounterForSlot,
  onFinishSession,
}) => {
  const isUrdu = prefs.language === 'ur';
  const [selectedCity, setSelectedCity] = useState<string>(prefs.selectedCity || 'Multan, Pakistan');
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [customNameEn, setCustomNameEn] = useState<string>('');
  const [customNameUr, setCustomNameUr] = useState<string>('');
  const [customTimeStr, setCustomTimeStr] = useState<string>('03:00 AM');

  const customSlots = prefs.customSlots || [];
  const prayerSlots = getDefaultPrayerTimes(selectedCity, prefs.dailyTarget || 313, customSlots);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onUpdatePreferences({ ...prefs, selectedCity: city });
  };

  const handleQuickAdd = (slotKey: string, countToAdd: number = 33) => {
    if (!onFinishSession) return;
    const quickSession: Session = {
      id: 'session_' + Date.now(),
      daroodId: 'darood_e_ibrahim',
      daroodName: isUrdu ? 'درودِ ابراہیمی' : 'Darood-e-Ibrahimi',
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      count: countToAdd,
      targetSlot: slotKey,
      reflection: 'peaceful',
    };
    onFinishSession(quickSession);
  };

  const handleAddCustomSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNameEn.trim()) return;

    const newCustom: CustomSlot = {
      id: 'custom_slot_' + Date.now(),
      nameEn: customNameEn.trim(),
      nameUr: customNameUr.trim() || customNameEn.trim(),
      timeStr: customTimeStr.trim() || '12:00 PM',
      enabled: true,
    };

    const updatedCustomSlots = [...customSlots, newCustom];
    onUpdatePreferences({ ...prefs, customSlots: updatedCustomSlots });

    setCustomNameEn('');
    setCustomNameUr('');
    setCustomTimeStr('03:00 AM');
    setShowAddCustomModal(false);
  };

  const handleDeleteCustomSlot = (slotId: string) => {
    const updatedCustomSlots = customSlots.filter((cs) => cs.id !== slotId);
    onUpdatePreferences({ ...prefs, customSlots: updatedCustomSlots });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-950/80 rounded-3xl p-6 border border-emerald-800/60 shadow-xl text-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-serif text-amber-300">
              {isUrdu ? 'اوقاتِ نماز و درود کے ہدف' : 'Prayer Slots & Recitation Tracker'}
            </h2>
          </div>
          <p className="text-xs text-emerald-300/80">
            {isUrdu
              ? 'روزانہ کا درود ہدف نماز کے اوقات اور کسٹم ٹائم سلاٹس میں تقسیم کریں'
              : 'Daily recitation target divided automatically across prayer & custom time slots'}
          </p>
        </div>

        {/* City Selector & Add Custom Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-emerald-900/80 px-3 py-2 rounded-2xl border border-emerald-700/80 text-xs">
            <MapPin className="w-4 h-4 text-amber-400" />
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="bg-transparent text-amber-200 font-semibold focus:outline-none"
            >
              {MAJOR_CITIES.map((c) => (
                <option key={c.name} value={c.name} className="bg-emerald-950 text-emerald-100">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddCustomModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-amber-500 text-emerald-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{isUrdu ? '+ کسٹم وقت شامل کریں' : '+ Custom Time Slot'}</span>
          </button>
        </div>
      </div>

      {/* Target Division Summary Card */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-950 to-emerald-900/90 rounded-2xl p-4 border border-amber-400/30 text-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
          <div>
            <span className="font-bold text-amber-300 block text-sm">
              {isUrdu ? 'روزانہ ہدف کی اوقات میں تقسیم:' : 'Target Division Across Slots:'}
            </span>
            <span className="text-emerald-200/90">
              {isUrdu
                ? `کل روزانہ ہدف ${prefs.dailyTarget || 313} درود پاک کو ${prayerSlots.length} سلاٹس میں برابر تقسیم کیا گیا ہے (~${Math.round((prefs.dailyTarget || 313) / prayerSlots.length)} فی وقت)`
                : `Total daily goal of ${prefs.dailyTarget || 313} Salawat is divided across ${prayerSlots.length} active slots (~${Math.round((prefs.dailyTarget || 313) / prayerSlots.length)} per slot).`}
            </span>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold shrink-0">
          {prefs.dailyTarget || 313} {isUrdu ? 'مجموعی ہدف' : 'Total Target'}
        </div>
      </div>

      {/* Modal for Adding Custom Time Slot */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-emerald-950 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl text-emerald-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <h3 className="text-base font-bold font-serif text-amber-300 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>{isUrdu ? 'نیا کسٹم وقت شامل کریں' : 'Add Custom Time Slot'}</span>
              </h3>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="p-1 rounded-full text-emerald-400 hover:text-white hover:bg-emerald-900/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomSlot} className="space-y-4">
              <div>
                <label className="text-xs text-amber-200 font-medium block mb-1">
                  {isUrdu ? 'نام (انگریزی):' : 'Slot Name (English):'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tahajjud, Evening Dhikr, Commute"
                  value={customNameEn}
                  onChange={(e) => setCustomNameEn(e.target.value)}
                  className="w-full bg-emerald-900 border border-emerald-700 text-amber-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-amber-200 font-medium block mb-1">
                  {isUrdu ? 'نام (اردو):' : 'Slot Name (Urdu):'}
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: تہجد کا وقت، شام کا ذکر"
                  value={customNameUr}
                  onChange={(e) => setCustomNameUr(e.target.value)}
                  className="w-full bg-emerald-900 border border-emerald-700 text-amber-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-amber-200 font-medium block mb-1">
                  {isUrdu ? 'وقت:' : 'Slot Time (e.g. 03:00 AM):'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="03:00 AM, 09:30 PM, etc."
                  value={customTimeStr}
                  onChange={(e) => setCustomTimeStr(e.target.value)}
                  className="w-full bg-emerald-900 border border-emerald-700 text-amber-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-900 text-emerald-200 text-xs font-bold hover:bg-emerald-800"
                >
                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-emerald-950 text-xs font-bold hover:bg-amber-400"
                >
                  {isUrdu ? 'شامل کریں' : 'Add Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prayer Slots Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {prayerSlots.map((slot) => {
          const completedCount = todayLog.slotBreakdown?.[slot.key] || 0;
          const target = slot.targetCount || 33;
          const isDone = completedCount >= target;
          const isCustom = slot.key.startsWith('custom_slot_');

          return (
            <div
              key={slot.key}
              className={`p-5 rounded-3xl border text-emerald-100 space-y-3 transition-all relative ${
                isDone
                  ? 'bg-gradient-to-b from-emerald-900/90 to-emerald-950/90 border-emerald-500/80 shadow-lg'
                  : 'bg-emerald-950/80 border-emerald-800/80'
              }`}
            >
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
                <span className="font-bold font-serif text-amber-300 text-sm flex items-center gap-1.5">
                  {formatPrayerName(slot.key, prefs.language, customSlots)}
                  {isCustom && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-sans border border-amber-400/20">
                      {isUrdu ? 'کسٹم' : 'Custom'}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-emerald-300/70 flex items-center gap-1 font-sans">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {slot.timeStr}
                  </span>
                  {isCustom && (
                    <button
                      onClick={() => handleDeleteCustomSlot(slot.key)}
                      className="p-1 text-emerald-500 hover:text-red-400 transition-colors ml-1"
                      title={isUrdu ? 'کسٹم وقت کو حذف کریں' : 'Delete custom slot'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-emerald-300/80">{isUrdu ? 'شمار ہوا:' : 'Progress:'}</span>
                <span className="text-xl font-extrabold font-sans text-amber-300">
                  {completedCount} <span className="text-xs opacity-60">/ {target}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onOpenCounterForSlot(slot.key)}
                  className="flex-1 py-2 rounded-xl bg-emerald-900 border border-emerald-700/60 text-xs font-bold text-amber-200 hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1"
                >
                  <span>{isUrdu ? 'درود پڑھیں' : 'Recite Now'}</span>
                </button>

                {onFinishSession && (
                  <button
                    onClick={() => handleQuickAdd(slot.key, 33)}
                    className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center gap-1"
                    title={isUrdu ? '33 شمار شامل کریں' : 'Quick add +33'}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>33</span>
                  </button>
                )}
              </div>

              {isDone && (
                <div className="w-full py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-400/30 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isUrdu ? 'ہدف مکمل ہوا' : 'Target Completed'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
