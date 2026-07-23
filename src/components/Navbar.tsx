import React, { useState } from 'react';
import { Sparkles, Flame, Volume2, VolumeX, Globe, Settings, BarChart2, BookOpen, Compass, Home, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { UserPreferences, StreakData } from '../types';

export type TabType = 'home' | 'counter' | 'plan' | 'library' | 'analytics' | 'prayers' | 'settings';

type NavbarProps = {
  prefs: UserPreferences;
  streak: StreakData;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onToggleLanguage: () => void;
  onToggleSound: () => void;
  isSidebarVisible: boolean;
  onToggleSidebar: () => void;
};

export const navItems: { id: TabType; labelEn: string; labelUr: string; icon: React.ReactNode }[] = [
  { id: 'home', labelEn: 'Home Center', labelUr: 'مرکز', icon: <Home className="w-4 h-4 text-emerald-400" /> },
  { id: 'counter', labelEn: 'Tasbeeh Counter', labelUr: 'تسلیح و شمار', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
  { id: 'plan', labelEn: 'Darood & Salam Plan', labelUr: 'درود و سلام پلان', icon: <Compass className="w-4 h-4 text-emerald-300" /> },
  { id: 'library', labelEn: 'Darood Directory', labelUr: 'درود ڈائریکٹری', icon: <BookOpen className="w-4 h-4 text-emerald-300" /> },
  { id: 'analytics', labelEn: 'Progress & History', labelUr: 'پیشرفت و تاریخ', icon: <BarChart2 className="w-4 h-4 text-emerald-300" /> },
  { id: 'prayers', labelEn: 'Prayer Time Slots', labelUr: 'اوقاتِ نماز', icon: <Compass className="w-4 h-4 text-emerald-300" /> },
  { id: 'settings', labelEn: 'Preferences & Settings', labelUr: 'ترجیحات', icon: <Settings className="w-4 h-4 text-emerald-300" /> },
];

export const Navbar: React.FC<NavbarProps> = ({
  prefs,
  streak,
  activeTab,
  setActiveTab,
  onToggleLanguage,
  onToggleSound,
  isSidebarVisible,
  onToggleSidebar,
}) => {
  const isUrdu = prefs.language === 'ur';
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileTimeLeft, setMobileTimeLeft] = useState<number>(5);

  React.useEffect(() => {
    if (!mobileMenuOpen) return;

    if (mobileTimeLeft <= 0) {
      setMobileMenuOpen(false);
      return;
    }

    const timer = setInterval(() => {
      setMobileTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [mobileMenuOpen, mobileTimeLeft]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => {
      if (!prev) setMobileTimeLeft(5);
      return !prev;
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/90 backdrop-blur-md border-b border-emerald-800/40 text-emerald-50 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between h-16 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Logo & App Name */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-emerald-600 to-emerald-400 p-0.5 shadow-lg shadow-emerald-900/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-emerald-950 rounded-full flex items-center justify-center border border-amber-400/30">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg sm:text-xl text-amber-300 tracking-wide">
                  {isUrdu ? 'نورِ درود و سلام' : 'Noor-e-Darood o Salam'}
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans uppercase font-medium">
                  {isUrdu ? 'درود و سلام' : 'Salawat & Salam'}
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 font-sans hidden sm:block">
                {isUrdu ? 'نبی کریم ﷺ پر درود و سلام کا نور' : 'Light of Sending Salawat & Salam Upon Prophet ﷺ'}
              </p>
            </div>
          </button>

          {/* Quick Controls & Mobile Menu Toggle */}
          <div className={`flex items-center gap-2 sm:gap-3 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Streak Badge */}
            {streak.currentStreak > 0 && (
              <button
                onClick={() => setActiveTab('analytics')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium hover:bg-amber-500/25 transition-colors"
                title={`${streak.currentStreak} Day Streak!`}
              >
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                <span>{streak.currentStreak} {isUrdu ? 'دن مسلسل' : 'Days'}</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-lg bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 transition-colors"
              title={prefs.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {prefs.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
            </button>

            {/* Language Switch */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 text-xs font-semibold transition-colors"
              title="Switch Language / زبان تبدیل کریں"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* Desktop Vertical Nav Toggle Button */}
            <button
              onClick={onToggleSidebar}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isSidebarVisible
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
                  : 'bg-emerald-900/80 text-emerald-100 border-emerald-700/80 hover:text-amber-300 hover:bg-emerald-800/90 shadow-md'
              }`}
              title={isSidebarVisible ? 'Disappear Vertical Navigation' : 'Show Vertical Navigation'}
            >
              <Menu className="w-4 h-4 text-amber-400" />
              <span>
                {isSidebarVisible
                  ? isUrdu ? 'نیویگیشن بند کریں' : 'Hide Sidebar'
                  : isUrdu ? 'عمودی نیویگیشن کھولیں' : 'Vertical Nav'}
              </span>
            </button>

            {/* Mobile Menu Button (Vertical Drawer Toggle) */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors"
              aria-label="Toggle vertical navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>{isUrdu ? 'نیویگیشن' : 'Menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Vertical Navigation Drawer with Auto-Hide Countdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-emerald-800/60 animate-in slide-in-from-top-2 duration-200 space-y-2">
            <div className={`flex items-center justify-between px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
              <span>{isUrdu ? 'عمودی نیویگیشن مینو' : 'Vertical Navigation Menu'}</span>
              <span className="text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30 font-mono">
                {isUrdu ? `${mobileTimeLeft} سیکنڈ` : `Hiding in ${mobileTimeLeft}s`}
              </span>
            </div>

            <div className="w-full bg-emerald-900/80 rounded-full h-1 overflow-hidden px-1">
              <div
                className="bg-amber-400 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(mobileTimeLeft / 5) * 100}%` }}
              />
            </div>

            <div className="flex flex-col space-y-1.5 pt-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isUrdu ? 'flex-row-reverse text-right' : 'flex-row text-left'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/25 via-emerald-900/80 to-emerald-900/50 text-amber-300 border border-amber-400/40 shadow-sm'
                        : 'text-emerald-200/80 hover:text-emerald-100 hover:bg-emerald-900/50'
                    }`}
                  >
                    <div className={`flex items-center gap-2.5 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
                      {item.icon}
                      <span>{isUrdu ? item.labelUr : item.labelEn}</span>
                    </div>
                    {isUrdu ? (
                      <ChevronLeft className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-emerald-600'}`} />
                    ) : (
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-emerald-600'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export type SidebarNavProps = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isUrdu: boolean;
  onClose: () => void;
};

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, setActiveTab, isUrdu, onClose }) => {
  return (
    <nav
      className="bg-emerald-950/95 backdrop-blur-xl border-2 border-amber-400/50 rounded-3xl p-4 shadow-2xl space-y-3 sticky top-20 animate-in fade-in zoom-in-95 duration-200"
      aria-label="Sidebar Navigation"
    >
      {/* Header with Title and Close Button */}
      <div className={`flex items-center justify-between pb-2.5 border-b border-emerald-800/60 px-1 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-serif font-bold tracking-wider text-amber-300 uppercase">
            {isUrdu ? 'عمودی نیویگیشن' : 'Vertical Navigation'}
          </span>
        </div>

        {/* Explicit Close Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          title={isUrdu ? 'مینو بند کریں' : 'Close navigation menu'}
        >
          <X className="w-4 h-4 text-amber-300" />
          <span>{isUrdu ? 'بند کریں' : 'Close'}</span>
        </button>
      </div>

      {/* Vertical Navigation Items */}
      <div className="flex flex-col space-y-1.5 pt-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                isUrdu ? 'flex-row-reverse text-right' : 'flex-row text-left'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/30 via-emerald-900 to-emerald-900/60 text-amber-300 border border-amber-400/50 shadow-md shadow-emerald-950 transform scale-[1.01]'
                  : 'text-emerald-200/90 hover:text-amber-200 hover:bg-emerald-900/60 border border-transparent'
              }`}
            >
              <div className={`flex items-center gap-3 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-amber-500/25 text-amber-300' : 'bg-emerald-950 text-emerald-300'}`}>
                  {item.icon}
                </div>
                <span>{isUrdu ? item.labelUr : item.labelEn}</span>
              </div>

              {isUrdu ? (
                <ChevronLeft className={`w-4 h-4 transition-transform ${isActive ? 'text-amber-400 -translate-x-1' : 'text-emerald-600/60'}`} />
              ) : (
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-amber-400 translate-x-1' : 'text-emerald-600/60'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Close Quick Action */}
      <div className="pt-2 border-t border-emerald-800/40">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800/80 text-emerald-300/90 hover:text-amber-300 text-xs font-medium border border-emerald-700/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'سائیڈبار مخفی کریں' : 'Hide Navigation'}</span>
        </button>
      </div>
    </nav>
  );
};

