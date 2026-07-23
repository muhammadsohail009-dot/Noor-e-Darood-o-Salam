import React from 'react';
import { Settings, Globe, Volume2, VolumeX, Download, Upload, RotateCcw, Save, ShieldCheck, Heart } from 'lucide-react';
import { UserPreferences, DailyLog, Session } from '../types';

type SettingsViewProps = {
  prefs: UserPreferences;
  dailyLogs: Record<string, DailyLog>;
  sessions: Session[];
  onUpdatePreferences: (updated: UserPreferences) => void;
  onResetOnboarding: () => void;
};

export const SettingsView: React.FC<SettingsViewProps> = ({
  prefs,
  dailyLogs,
  sessions,
  onUpdatePreferences,
  onResetOnboarding,
}) => {
  const isUrdu = prefs.language === 'ur';

  const handleExportData = () => {
    const exportData = {
      preferences: prefs,
      dailyLogs,
      sessions,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noor-e-darood-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-950/80 rounded-3xl p-6 border border-emerald-800/60 shadow-xl text-emerald-100 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-serif text-amber-300">
              {isUrdu ? 'ایپ ترجیحات و ترتیبات' : 'Settings & Preferences'}
            </h2>
          </div>
          <p className="text-xs text-emerald-300/80">
            {isUrdu
              ? 'زبان، صوتی اثرات، اور ڈیٹا کے تحفظ کی ترتیبات'
              : 'Customize application language, audio cues & backup data'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Language Selection */}
        <div className="bg-emerald-950/80 rounded-2xl p-5 border border-emerald-800/60 shadow-md text-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-bold text-sm text-amber-200 block">
                {isUrdu ? 'زبان کا انتخاب' : 'App Language'}
              </span>
              <span className="text-xs text-emerald-300/70">
                {isUrdu ? 'اردو یا انگریزی زبان منتخب کریں' : 'Switch between Urdu and English'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onUpdatePreferences({ ...prefs, language: isUrdu ? 'en' : 'ur' })}
            className="px-4 py-2 rounded-xl bg-amber-500 text-emerald-950 font-bold text-xs shadow hover:bg-amber-400 transition-colors"
          >
            {isUrdu ? 'English میں تبدیل کریں' : 'اردو میں تبدیل کریں'}
          </button>
        </div>

        {/* Audio Sound Toggle */}
        <div className="bg-emerald-950/80 rounded-2xl p-5 border border-emerald-800/60 shadow-md text-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {prefs.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-amber-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-emerald-500" />
            )}
            <div>
              <span className="font-bold text-sm text-amber-200 block">
                {isUrdu ? 'تسبیح کے صوتی اثرات' : 'Tasbeeh Bead Audio Clicks'}
              </span>
              <span className="text-xs text-emerald-300/70">
                {isUrdu ? 'شمار کے دوران نرم آواز اور مکمل ہونے پر گھنٹی' : 'Play subtle sound on count tap & goal chime'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onUpdatePreferences({ ...prefs, soundEnabled: !prefs.soundEnabled })}
            className={`px-4 py-2 rounded-xl font-bold text-xs border transition-colors ${
              prefs.soundEnabled
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-emerald-900 border-emerald-700 text-emerald-300'
            }`}
          >
            {prefs.soundEnabled ? (isUrdu ? 'فعال ہے' : 'Enabled') : (isUrdu ? 'غیر فعال' : 'Disabled')}
          </button>
        </div>

        {/* Backup & Export Data */}
        <div className="bg-emerald-950/80 rounded-2xl p-5 border border-emerald-800/60 shadow-md text-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-bold text-sm text-amber-200 block">
                {isUrdu ? 'ڈیٹا کا بیک اپ / ایکسپورٹ' : 'Export & Backup History'}
              </span>
              <span className="text-xs text-emerald-300/70">
                {isUrdu ? 'اپنی تاریخچہ کا بیک اپ محفوظ کریں (JSON)' : 'Download your recitation logs as JSON backup'}
              </span>
            </div>
          </div>

          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-emerald-900 border border-emerald-700/80 text-emerald-200 font-bold text-xs hover:bg-emerald-800 transition-colors"
          >
            {isUrdu ? 'بیک اپ ڈاؤن لوڈ کریں' : 'Export Backup'}
          </button>
        </div>

        {/* Android PWA App Installation Guide Card */}
        <div className="bg-gradient-to-r from-amber-500/15 via-emerald-950 to-emerald-950 rounded-2xl p-5 border-2 border-amber-400/40 shadow-md text-emerald-100 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <span className="font-bold text-sm text-amber-300 block">
                {isUrdu ? 'موبائل پر بطور اینڈرائیڈ ایپ استعمال کریں' : 'Use as Android Mobile App'}
              </span>
              <span className="text-xs text-emerald-200/90">
                {isUrdu
                  ? 'انٹرنیٹ کے بغیر 100% آف لائن کام کرتی ہے اور فون میں ایپ کی طرح انسٹال ہوتی ہے'
                  : 'Full offline support — works directly without internet connection on Android'}
              </span>
            </div>
          </div>

          <div className="bg-emerald-950/80 p-3.5 rounded-xl border border-emerald-800/80 text-xs text-emerald-200/90 space-y-1.5">
            <p className="font-semibold text-amber-300">
              {isUrdu ? 'انسٹال کرنے کا آسان طریقہ:' : 'How to install on Android Chrome:'}
            </p>
            <ol className="list-decimal list-inside space-y-1 text-emerald-300/90">
              <li>{isUrdu ? 'کروم مینو (تین نقطوں ⋮) پر کلک کریں۔' : 'Tap Chrome Menu (three dots ⋮ in top right)'}</li>
              <li>{isUrdu ? '"Add to Home screen" یا "Install App" کا انتخاب کریں۔' : 'Select "Add to Home screen" or "Install App"'}</li>
              <li>{isUrdu ? 'فون کی ہوم اسکرین سے ایپ کے طور پر بغیر انٹرنیٹ کے استعمال کریں!' : 'Launch anytime from your Android home screen offline!'}</li>
            </ol>
          </div>
        </div>

        {/* Reset Onboarding Flow */}

        <div className="bg-emerald-950/80 rounded-2xl p-5 border border-emerald-800/60 shadow-md text-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-bold text-sm text-amber-200 block">
                {isUrdu ? 'نئے ہدف کے لیے دوبارہ آن بورڈنگ' : 'Re-Run Onboarding Setup'}
              </span>
              <span className="text-xs text-emerald-300/70">
                {isUrdu ? 'دوبارہ سے اپنی ٹائمنگ اور ہدف کا انتخاب کریں' : 'Reset AI initial questionnaire wizard'}
              </span>
            </div>
          </div>

          <button
            onClick={onResetOnboarding}
            className="px-4 py-2 rounded-xl bg-emerald-900 border border-emerald-700/80 text-emerald-200 font-bold text-xs hover:bg-emerald-800 transition-colors"
          >
            {isUrdu ? 'دوبارہ آغاز کریں' : 'Re-Run Wizard'}
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-6 space-y-2 text-xs text-emerald-300/60 border-t border-emerald-900">
        <p className="font-serif">Noor-e-Darood (نورِ درود) • v1.0.0</p>
        <p>May Allah accept our humble Salawat upon Prophet Muhammad ﷺ</p>
      </div>
    </div>
  );
};
