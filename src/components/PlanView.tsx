import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, RefreshCw, Clock, CheckCircle2, Save, Loader2, Calendar, Plus, X } from 'lucide-react';
import { UserPreferences, AIPlan, CustomSlot } from '../types';
import { formatPrayerName } from '../utils/prayerTimes';

type PlanViewProps = {
  prefs: UserPreferences;
  plan: AIPlan | null;
  onUpdatePlan: (newPlan: AIPlan, newPrefs: UserPreferences) => void;
};

export const PlanView: React.FC<PlanViewProps> = ({ prefs, plan, onUpdatePlan }) => {
  const isUrdu = prefs.language === 'ur';

  const [timeCapacity, setTimeCapacity] = useState<string>(prefs.timeCapacity || '3-5min');
  const [customMinutes, setCustomMinutes] = useState<number>(() => {
    const parsed = parseInt(prefs.timeCapacity || '', 10);
    return isNaN(parsed) ? 15 : parsed;
  });

  const [preferredTimes, setPreferredTimes] = useState<string[]>(() => {
    const existing = prefs.preferredTimes || ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'before_sleep'];
    const customIds = (prefs.customSlots || []).map((cs) => cs.id);
    return Array.from(new Set([...existing, ...customIds]));
  });

  const [goal, setGoal] = useState<UserPreferences['goal']>(prefs.goal);
  const [customTarget, setCustomTarget] = useState<number>(plan?.dailyTarget || prefs.dailyTarget || 313);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  // Custom Slot Form Modal inside PlanView
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [customNameEn, setCustomNameEn] = useState<string>('');
  const [customNameUr, setCustomNameUr] = useState<string>('');
  const [customTimeStr, setCustomTimeStr] = useState<string>('03:00 AM');

  const toggleTimeSlot = (slot: string) => {
    if (preferredTimes.includes(slot)) {
      if (preferredTimes.length > 1) {
        setPreferredTimes(preferredTimes.filter((s) => s !== slot));
      }
    } else {
      setPreferredTimes([...preferredTimes, slot]);
    }
  };

  const handleAddCustomTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNameEn.trim()) return;

    const newCustom: CustomSlot = {
      id: 'custom_slot_' + Date.now(),
      nameEn: customNameEn.trim(),
      nameUr: customNameUr.trim() || customNameEn.trim(),
      timeStr: customTimeStr.trim() || '03:00 AM',
      enabled: true,
    };

    const updatedCustomSlots = [...(prefs.customSlots || []), newCustom];
    const updatedPreferredTimes = Array.from(new Set([...preferredTimes, newCustom.id]));

    setPreferredTimes(updatedPreferredTimes);

    // Auto update prefs with new custom slot
    const updatedPrefs: UserPreferences = {
      ...prefs,
      customSlots: updatedCustomSlots,
      preferredTimes: updatedPreferredTimes,
    };

    // Calculate updated plan with new slot
    const numSlots = updatedPreferredTimes.length;
    const baseCount = Math.floor(customTarget / numSlots);
    let remainder = customTarget % numSlots;

    const newSlots = updatedPreferredTimes.map((t, idx) => {
      const count = baseCount + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      return {
        time: t,
        count,
        daroodId: idx % 2 === 0 ? 'darood_e_ibrahim' : 'short_darood',
        daroodName: idx % 2 === 0 ? (isUrdu ? 'درودِ ابراہیمی' : 'Darood-e-Ibrahim') : (isUrdu ? 'مختصر درودِ پاک' : 'Short Salawat'),
      };
    });

    const newPlan: AIPlan = {
      dailyTarget: customTarget,
      slots: newSlots,
      recommendedDaroods: ['darood_e_ibrahim', 'short_darood'],
      coachMessageEn: 'Custom recitation slot added! Keep spreading salutations upon the Prophet ﷺ.',
      coachMessageUr: 'نیا کسٹم وقت شامل ہو گیا! درود و سلام کے بابرکت معمول کو برقرار رکھیں۔',
      weeklyTarget: customTarget * 7,
    };

    onUpdatePlan(newPlan, updatedPrefs);

    setCustomNameEn('');
    setCustomNameUr('');
    setShowAddCustomModal(false);
  };

  const handleRegenerateAI = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeCapacity,
          preferredTimes,
          goal,
          customTarget,
          language: prefs.language,
        }),
      });

      const data = await res.json();
      if (data.success && data.plan) {
        const updatedPrefs: UserPreferences = {
          ...prefs,
          dailyTarget: customTarget,
          timeCapacity,
          preferredTimes,
          goal,
        };
        onUpdatePlan(data.plan, updatedPrefs);
      }
    } catch {
      // Fallback update with equal division
      const numSlots = preferredTimes.length || 1;
      const baseCount = Math.floor(customTarget / numSlots);
      let remainder = customTarget % numSlots;

      const fallbackSlots = preferredTimes.map((t, idx) => {
        const cnt = baseCount + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        return {
          time: t,
          count: cnt,
          daroodId: idx % 2 === 0 ? 'darood_e_ibrahim' : 'short_darood',
          daroodName: idx % 2 === 0 ? (isUrdu ? 'درودِ ابراہیمی' : 'Darood-e-Ibrahim') : (isUrdu ? 'مختصر درودِ پاک' : 'Short Salawat'),
        };
      });

      const fallbackPlan: AIPlan = {
        dailyTarget: customTarget,
        slots: fallbackSlots,
        recommendedDaroods: ['darood_e_ibrahim', 'short_darood'],
        coachMessageEn: 'Sending salutations upon Prophet Muhammad ﷺ brings eternal serenity to mind and spirit.',
        coachMessageUr: 'رسول پاک ﷺ پر درود پاک کا نذرانہ پیش کرنا روح و قلوب کی طہارت و سکون کا باعث ہے۔',
        weeklyTarget: customTarget * 7,
      };

      const updatedPrefs: UserPreferences = {
        ...prefs,
        dailyTarget: customTarget,
        timeCapacity,
        preferredTimes,
        goal,
      };
      onUpdatePlan(fallbackPlan, updatedPrefs);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-950/80 rounded-3xl p-6 border border-emerald-800/60 shadow-xl text-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-serif text-amber-300">
              {isUrdu ? 'درود و سلام پلان' : 'Darood o Salam Plan'}
            </h2>
          </div>
          <p className="text-xs text-emerald-300/80">
            {isUrdu
              ? 'اپنے وقت کی گنجائش اور ترجیحی نماز کے وقت کے مطابق درود کا ہدف ترتیب دیں'
              : 'Tailor your customized daily Salawat target and prayer time capacity'}
          </p>
        </div>

        <button
          onClick={handleRegenerateAI}
          disabled={loadingAI}
          className="px-4 py-2.5 rounded-2xl bg-amber-500 text-emerald-950 font-bold text-xs shadow-md hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>{isUrdu ? 'پلان اپ ڈیٹ کریں' : 'Update Plan'}</span>
        </button>
      </div>

      {/* Current Active Plan Breakdown */}
      {plan && (
        <div className="bg-gradient-to-b from-emerald-900/90 to-emerald-950/95 rounded-3xl p-6 border border-amber-500/30 shadow-2xl text-emerald-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-4">
            <div>
              <span className="text-xs text-amber-300/80 font-medium block">
                {isUrdu ? 'موجودہ روزانہ کا ہدف:' : 'Current Active Daily Goal:'}
              </span>
              <span className="text-3xl font-extrabold font-sans text-amber-300">
                {plan.dailyTarget} {isUrdu ? 'مرتبہ درود پاک / دن' : 'Salawat / Day'}
              </span>
            </div>

            <div className="bg-emerald-950/80 px-4 py-2 rounded-xl border border-emerald-800 text-xs text-emerald-300">
              <span className="font-semibold text-amber-300">
                {isUrdu ? 'ہفتہ وار ہدف:' : 'Weekly Target:'}{' '}
              </span>
              {plan.weeklyTarget || plan.dailyTarget * 7} {isUrdu ? 'مرتبہ' : 'recitations'}
            </div>
          </div>

          {/* Time Slot Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{isUrdu ? 'نماز کے اوقات میں روزانہ ہدف کی تقسیم:' : 'Daily Prayer Time Target Breakdown:'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {plan.slots.map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-200">
                    <span>{formatPrayerName(s.time, prefs.language, prefs.customSlots)}</span>
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/20 font-bold">
                      {s.count} {isUrdu ? 'بار' : 'times'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300/70 font-serif italic truncate">
                    {s.daroodName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Coach Encouragement */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed italic font-serif">
            <span className="font-bold text-amber-300 block not-italic mb-1">
              ✨ {isUrdu ? 'اسلامک گائیڈ مشورہ:' : 'Islamic Plan Coach Tip:'}
            </span>
            "{isUrdu ? plan.coachMessageUr : plan.coachMessageEn}"
          </div>
        </div>
      )}

      {/* Customize Plan Form */}
      <div className="bg-emerald-950/80 rounded-3xl p-6 border border-emerald-800/60 shadow-xl text-emerald-100 space-y-5">
        <h3 className="text-base font-bold font-serif text-amber-300 border-b border-emerald-800/60 pb-3">
          {isUrdu ? 'درود و سلام پلان اور وقت کی ترجیحات' : 'Customize Plan & Time Capacity'}
        </h3>

        {/* Custom Target Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-emerald-200">
            {isUrdu ? 'روزانہ کی درود تعداد (کسٹم ہدف):' : 'Daily Recitation Target (Custom Target):'}
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              min={10}
              max={10000}
              step={10}
              value={customTarget}
              onChange={(e) => setCustomTarget(Number(e.target.value))}
              className="bg-emerald-900 border border-emerald-700 text-amber-200 text-base font-bold rounded-xl px-4 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
            <div className="flex items-center gap-1.5 flex-wrap">
              {[33, 100, 313, 1000, 2000].map((num) => (
                <button
                  key={num}
                  onClick={() => setCustomTarget(num)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    customTarget === num
                      ? 'bg-amber-500 text-emerald-950 border-amber-400'
                      : 'bg-emerald-900/60 border-emerald-800 text-emerald-200 hover:bg-emerald-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time Capacity Selection & Customization */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-emerald-200 block">
            {isUrdu ? 'دستیاب وقت کی گنجائش (کسٹم ٹائم):' : 'Customized Time Capacity:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { val: '<3min', labelUr: '< 3 منٹ', labelEn: '< 3 min' },
              { val: '3-5min', labelUr: '3–5 منٹ', labelEn: '3–5 min' },
              { val: '5-10min', labelUr: '5–10 منٹ', labelEn: '5–10 min' },
              { val: '10+min', labelUr: '10+ منٹ', labelEn: '10+ min' },
              { val: '15min', labelUr: '15 منٹ', labelEn: '15 min' },
              { val: '30min', labelUr: '30 منٹ', labelEn: '30 min' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setTimeCapacity(opt.val)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  timeCapacity === opt.val
                    ? 'bg-amber-500 text-emerald-950 border-amber-400'
                    : 'bg-emerald-900/60 border-emerald-800 text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                {isUrdu ? opt.labelUr : opt.labelEn}
              </button>
            ))}
          </div>

          {/* Custom Minutes Input */}
          <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-800/80 flex items-center gap-3">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-emerald-200 whitespace-nowrap">
              {isUrdu ? 'حسبِ منشاء منٹ درج کریں:' : 'Custom Duration (Minutes):'}
            </span>
            <input
              type="number"
              min={1}
              max={240}
              value={customMinutes}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCustomMinutes(val);
                setTimeCapacity(`${val} mins`);
              }}
              className="bg-emerald-900 border border-emerald-700 text-amber-200 text-xs font-bold rounded-lg px-3 py-1.5 w-24 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="text-xs text-amber-300 font-medium">
              {isUrdu ? 'منٹ روزانہ' : 'mins daily'}
            </span>
          </div>
        </div>

        {/* Preferred Prayer & Custom Time Slots */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-emerald-200">
              {isUrdu ? 'اوقاتِ نماز و کسٹم ٹائم:' : 'Active Prayer & Custom Slots:'}
            </label>
            <button
              type="button"
              onClick={() => setShowAddCustomModal(true)}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-xl flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'کسٹم وقت شامل کریں' : '+ Add Custom Time Slot'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { key: 'fajr', labelUr: 'فجر کے بعد', labelEn: 'After Fajr' },
              { key: 'dhuhr', labelUr: 'ظہر کے بعد', labelEn: 'After Dhuhr' },
              { key: 'asr', labelUr: 'عصر کے بعد', labelEn: 'After Asr' },
              { key: 'maghrib', labelUr: 'مغرب کے بعد', labelEn: 'After Maghrib' },
              { key: 'isha', labelUr: 'عشاء کے بعد', labelEn: 'After Isha' },
              { key: 'before_sleep', labelUr: 'سونے سے پہلے', labelEn: 'Before sleep' },
              ...(prefs.customSlots || []).map((cs) => ({
                key: cs.id,
                labelUr: `${cs.nameUr || cs.nameEn} (${cs.timeStr})`,
                labelEn: `${cs.nameEn} (${cs.timeStr})`,
              })),
            ].map((slot) => {
              const isSelected = preferredTimes.includes(slot.key);
              return (
                <button
                  key={slot.key}
                  type="button"
                  onClick={() => toggleTimeSlot(slot.key)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-emerald-900/60 border-emerald-800 text-emerald-300 hover:bg-emerald-800'
                  }`}
                >
                  {isUrdu ? slot.labelUr : slot.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleRegenerateAI}
          disabled={loadingAI}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-sm shadow-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
        >
          {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isUrdu ? 'تبدیلیاں محفوظ کریں' : 'Save & Update Plan'}</span>
        </button>

        {/* Add Custom Time Slot Modal */}
        {showAddCustomModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-emerald-950 border border-emerald-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                <h3 className="text-base font-bold font-serif text-amber-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{isUrdu ? 'نیا کسٹم وقت شامل کریں' : 'Add Custom Time Slot'}</span>
                </h3>
                <button
                  onClick={() => setShowAddCustomModal(false)}
                  className="text-emerald-400 hover:text-emerald-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCustomTimeSlot} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-200">
                    {isUrdu ? 'وقت یا سیشن کا نام (English):' : 'Slot Name (English):'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tahajjud, Ishraq, Night"
                    value={customNameEn}
                    onChange={(e) => setCustomNameEn(e.target.value)}
                    className="w-full bg-emerald-900 border border-emerald-700 text-amber-200 text-xs font-medium rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-200">
                    {isUrdu ? 'وقت کا نام (اردو میں):' : 'Slot Name (Urdu):'}
                  </label>
                  <input
                    type="text"
                    placeholder="مثلاً: تہجد کا وقت، اشراق، یا بعد از ظہر"
                    value={customNameUr}
                    onChange={(e) => setCustomNameUr(e.target.value)}
                    className="w-full bg-emerald-900 border border-emerald-700 text-amber-200 text-xs font-medium rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-200">
                    {isUrdu ? 'وقت (ٹائمنگ):' : 'Time (e.g. 03:30 AM):'}
                  </label>
                  <input
                    type="text"
                    value={customTimeStr}
                    onChange={(e) => setCustomTimeStr(e.target.value)}
                    className="w-full bg-emerald-900 border border-emerald-700 text-amber-200 text-xs font-medium rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-emerald-700 text-emerald-300 text-xs font-bold hover:bg-emerald-900 transition-colors"
                  >
                    {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-amber-500 text-emerald-950 text-xs font-bold shadow-md hover:bg-amber-400 transition-colors"
                  >
                    {isUrdu ? 'شامل کریں' : 'Add Slot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
