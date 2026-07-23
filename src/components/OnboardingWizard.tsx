import React, { useState } from 'react';
import { Sparkles, Clock, Calendar, Compass, ArrowRight, ArrowLeft, CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import { UserPreferences, AIPlan, Language } from '../types';

type OnboardingWizardProps = {
  onComplete: (prefs: UserPreferences, plan: AIPlan) => void;
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [language, setLanguage] = useState<Language>('ur');
  const [capacity, setCapacity] = useState<UserPreferences['timeCapacity']>('3-5min');
  const [preferredTimes, setPreferredTimes] = useState<string[]>(['fajr', 'maghrib', 'before_sleep']);
  const [goal, setGoal] = useState<UserPreferences['goal']>('build_habit');
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<AIPlan | null>(null);

  const isUrdu = language === 'ur';

  const toggleTimeSlot = (slot: string) => {
    if (preferredTimes.includes(slot)) {
      if (preferredTimes.length > 1) {
        setPreferredTimes(preferredTimes.filter((s) => s !== slot));
      }
    } else {
      setPreferredTimes([...preferredTimes, slot]);
    }
  };

  const handleGenerateAIPlan = async () => {
    setLoadingAI(true);
    setStep(3); // Loading step

    try {
      const res = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeCapacity: capacity,
          preferredTimes,
          goal,
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setGeneratedPlan(data.plan);
      } else {
        throw new Error('Fallback required');
      }
    } catch {
      // Fallback local plan
      setGeneratedPlan({
        dailyTarget: capacity === '<3min' ? 33 : capacity === '3-5min' ? 66 : 100,
        slots: preferredTimes.map((time) => ({
          time,
          count: 33,
          daroodId: 'darood_e_ibrahim',
          daroodName: isUrdu ? 'درودِ ابراہیمی' : 'Darood-e-Ibrahim',
        })),
        recommendedDaroods: ['darood_e_ibrahim', 'short_darood'],
        coachMessageEn: 'Consistency in sending peace upon Prophet Muhammad ﷺ illuminates the heart.',
        coachMessageUr: 'نبی کریم ﷺ پر باقاعدگی سے درود پاک بھیجنا دلوں کو منور کرتا ہے۔',
        weeklyTarget: 700,
      });
    } finally {
      setLoadingAI(false);
      setStep(4); // Summary step
    }
  };

  const handleFinishOnboarding = () => {
    if (!generatedPlan) return;

    const prefs: UserPreferences = {
      language,
      dailyTarget: generatedPlan.dailyTarget,
      timeCapacity: capacity,
      preferredTimes,
      goal,
      theme: 'emerald',
      soundEnabled: true,
      vibrationEnabled: true,
      selectedCity: 'Multan, Pakistan',
      onboardingCompleted: true,
    };

    onComplete(prefs, generatedPlan);
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-emerald-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
        {/* Subtle Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12)_0,transparent_70%)] pointer-events-none" />

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs text-amber-300 font-medium border-b border-emerald-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-serif text-sm">Noor-e-Darood o Salam</span>
          </div>
          <span>
            {isUrdu ? `مرحلہ ${step} / 4` : `Step ${step} of 4`}
          </span>
        </div>

        {/* Step 1: Language Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <p className="text-sm font-serif text-amber-400 font-semibold">
                السلام علیکم ورحمۃ اللہ وبرکاتہ
              </p>
              <h2 className="text-2xl font-bold font-serif text-amber-300">
                Welcome to Noor-e-Darood o Salam
              </h2>
              <p className="text-xs text-emerald-200/90">
                زبان کا انتخاب کریں / Choose your preferred language
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => setLanguage('ur')}
                className={`p-5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  language === 'ur'
                    ? 'bg-amber-500 text-emerald-950 border-amber-400 font-bold shadow-lg scale-105'
                    : 'bg-emerald-950/80 border-emerald-800 text-emerald-200 hover:bg-emerald-900'
                }`}
              >
                <span className="text-2xl font-serif">اردو</span>
                <span className="text-xs opacity-80">Urdu</span>
              </button>

              <button
                onClick={() => setLanguage('en')}
                className={`p-5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  language === 'en'
                    ? 'bg-amber-500 text-emerald-950 border-amber-400 font-bold shadow-lg scale-105'
                    : 'bg-emerald-950/80 border-emerald-800 text-emerald-200 hover:bg-emerald-900'
                }`}
              >
                <span className="text-xl font-bold font-sans">English</span>
                <span className="text-xs opacity-80">English</span>
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-sm shadow-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
            >
              <span>{isUrdu ? 'آگے بڑھیں' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Intent & Capacity Questions */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-bold font-serif text-amber-300">
                {isUrdu ? 'درود پاک کا معمول اور ہدف' : 'Recitation Capacity & Goal'}
              </h2>
              <p className="text-xs text-emerald-300/80">
                {isUrdu
                  ? 'اپنے روزمرہ اوقات کے مطابق انتخاب کریں'
                  : 'Customize according to your daily availability'}
              </p>
            </div>

            {/* Daily Time Capacity */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-amber-300/90 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {isUrdu ? 'روزانہ کتنا وقت دے سکتے ہیں؟' : 'How much time can you give daily?'}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '<3min', labelUr: '< 3 منٹ', labelEn: '< 3 min' },
                  { value: '3-5min', labelUr: '3–5 منٹ', labelEn: '3–5 min' },
                  { value: '5-10min', labelUr: '5–10 منٹ', labelEn: '5–10 min' },
                  { value: '10+min', labelUr: '10+ منٹ', labelEn: '10+ min' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCapacity(opt.value as UserPreferences['timeCapacity'])}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      capacity === opt.value
                        ? 'bg-amber-500 text-emerald-950 border-amber-400 shadow-md'
                        : 'bg-emerald-950/80 border-emerald-800 text-emerald-200 hover:bg-emerald-900'
                    }`}
                  >
                    {isUrdu ? opt.labelUr : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Time Slots */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-amber-300/90 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {isUrdu ? 'کس وقت درود پڑھنا چاہتے ہیں؟' : 'When do you want to recite Darood?'}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'fajr', labelUr: 'فجر کے بعد', labelEn: 'After Fajr' },
                  { key: 'dhuhr', labelUr: 'ظہر کے بعد', labelEn: 'After Dhuhr' },
                  { key: 'asr', labelUr: 'عصر کے بعد', labelEn: 'After Asr' },
                  { key: 'maghrib', labelUr: 'مغرب کے بعد', labelEn: 'After Maghrib' },
                  { key: 'isha', labelUr: 'عشاء کے بعد', labelEn: 'After Isha' },
                  { key: 'before_sleep', labelUr: 'سونے سے پہلے', labelEn: 'Before sleep' },
                ].map((slot) => {
                  const isSelected = preferredTimes.includes(slot.key);
                  return (
                    <button
                      key={slot.key}
                      onClick={() => toggleTimeSlot(slot.key)}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                          : 'bg-emerald-950/80 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                      }`}
                    >
                      {isUrdu ? slot.labelUr : slot.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Goal */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-amber-300/90 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'بنیادی مقصد:' : 'Main goal:'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'build_habit', labelUr: 'عادت بنانا', labelEn: 'Build Habit' },
                  { value: 'increase_count', labelUr: 'تعداد بڑھانا', labelEn: 'Increase Count' },
                  { value: 'seek_peace', labelUr: 'قلبی سکون', labelEn: 'Seek Peace' },
                  { value: 'follow_sunnah', labelUr: 'پیروی سنت', labelEn: 'Follow Sunnah' },
                ].map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value as UserPreferences['goal'])}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      goal === g.value
                        ? 'bg-amber-500 text-emerald-950 border-amber-400 shadow-md'
                        : 'bg-emerald-950/80 border-emerald-800 text-emerald-200 hover:bg-emerald-900'
                    }`}
                  >
                    {isUrdu ? g.labelUr : g.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold hover:bg-emerald-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleGenerateAIPlan}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-sm shadow-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isUrdu ? 'اے آئی نور پلان تشکیل دیں' : 'Generate Noor-e-Darood o Salam Plan'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Loading AI Plan */}
        {step === 3 && loadingAI && (
          <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto" />
            <h3 className="text-xl font-bold font-serif text-amber-300">
              {isUrdu ? 'آپ کا نورِ درود و سلام پلان تیار کیا جا رہا ہے...' : 'Creating Your Noor-e-Darood o Salam Plan...'}
            </h3>
            <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
              {isUrdu
                ? 'اے آئی کوچ آپ کی دستیاب ٹائمنگ کے مطابق بہترین ہدف ترتیب دے رہا ہے'
                : 'Formulating realistic daily targets & prayer time slots for spiritual consistency'}
            </p>
          </div>
        )}

        {/* Step 4: AI Plan Summary Display */}
        {step === 4 && generatedPlan && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-amber-300">
                {isUrdu ? 'آپ کا 7 روزہ نورِ درود و سلام پلان' : 'Your 7-Day Noor-e-Darood o Salam Plan'}
              </h2>
              <p className="text-xs text-emerald-300/80">
                {isUrdu ? 'اے آئی اسلامک کوچ کی تجویز کردہ کاوش' : 'AI Coach Tailored Plan'}
              </p>
            </div>

            {/* Daily Target Banner */}
            <div className="bg-emerald-950/80 rounded-2xl p-4 border border-amber-500/30 text-center space-y-1">
              <span className="text-xs text-amber-300/90 font-medium">
                {isUrdu ? 'روزانہ کا کل ہدف:' : 'Total Daily Target:'}
              </span>
              <div className="text-3xl font-extrabold font-sans text-amber-300">
                {generatedPlan.dailyTarget} {isUrdu ? 'درود پاک' : 'Salawat / Day'}
              </div>
            </div>

            {/* Time Slot Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-emerald-200">
                {isUrdu ? 'اوقات کے مطابق تقسیم:' : 'Prayer Time Slots:'}
              </h4>
              <div className="space-y-1.5">
                {generatedPlan.slots.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs"
                  >
                    <span className="font-semibold text-emerald-100">
                      • {s.time.toUpperCase()} ({s.daroodName})
                    </span>
                    <span className="font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-400/20">
                      {s.count} {isUrdu ? 'مرتبہ' : 'times'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coach Message */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed italic font-serif">
              "{isUrdu ? generatedPlan.coachMessageUr : generatedPlan.coachMessageEn}"
            </div>

            <button
              onClick={handleFinishOnboarding}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-sm shadow-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-emerald-950" />
              <span>{isUrdu ? 'آج سے آغاز کریں' : 'Start Reciting Today'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
