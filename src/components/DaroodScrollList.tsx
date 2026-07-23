import React, { useState, useEffect } from 'react';
import { Play, BookOpen, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { Darood, UserPreferences } from '../types';

type DaroodScrollListProps = {
  daroods: Darood[];
  prefs: UserPreferences;
  onSelectDaroodForRecitation: (darood: Darood) => void;
  titleEn?: string;
  titleUr?: string;
};

export const DaroodScrollList: React.FC<DaroodScrollListProps> = ({
  daroods,
  prefs,
  onSelectDaroodForRecitation,
  titleEn = 'Darood & Salam Quick Selector',
  titleUr = 'انتخابِ درود و سلام',
}) => {
  const isUrdu = prefs.language === 'ur';
  const [activeFilter, setActiveFilter] = useState<'all' | 'darood' | 'salam' | 'qasida'>('all');

  const filteredItems = daroods.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'darood') return item.type === 'darood' || (!item.type && !item.id.includes('salam'));
    if (activeFilter === 'salam') return item.type === 'salam' || item.id.includes('salam');
    if (activeFilter === 'qasida') return item.type === 'qasida' || item.id.includes('qasida');
    return true;
  });

  const [selectedId, setSelectedId] = useState<string>(() => filteredItems[0]?.id || 'darood_e_ibrahim');

  // Keep selectedId valid when filter changes
  useEffect(() => {
    if (filteredItems.length > 0 && !filteredItems.some((item) => item.id === selectedId)) {
      setSelectedId(filteredItems[0].id);
    }
  }, [activeFilter, filteredItems, selectedId]);

  const selectedItem = filteredItems.find((item) => item.id === selectedId) || filteredItems[0] || daroods[0];
  const selectedIndex = filteredItems.findIndex((item) => item.id === selectedItem?.id);

  const handlePrev = () => {
    if (filteredItems.length === 0) return;
    const prevIdx = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedId(filteredItems[prevIdx].id);
  };

  const handleNext = () => {
    if (filteredItems.length === 0) return;
    const nextIdx = (selectedIndex + 1) % filteredItems.length;
    setSelectedId(filteredItems[nextIdx].id);
  };

  const isSalam = selectedItem?.type === 'salam' || selectedItem?.id.includes('salam');
  const isQasida = selectedItem?.type === 'qasida' || selectedItem?.id.includes('qasida');

  return (
    <div className="bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-emerald-950/90 rounded-3xl p-5 sm:p-6 border border-emerald-800/80 shadow-2xl space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-amber-300 flex items-center gap-2">
              <span>{isUrdu ? titleUr : titleEn}</span>
              <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {filteredItems.length}
              </span>
            </h3>
            <p className="text-[11px] text-emerald-300/80">
              {isUrdu
                ? 'ڈراپ ڈاؤن مینو سے کوئی بھی درود یا سلام منتخب کریں'
                : 'Select any Darood or Salam from the dropdown menu to recite'}
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 bg-emerald-950/90 p-1 rounded-2xl border border-emerald-800/80 self-start sm:self-auto">
          {[
            { id: 'all', labelUr: 'تمام', labelEn: 'All' },
            { id: 'darood', labelUr: 'درود', labelEn: 'Darood' },
            { id: 'salam', labelUr: 'سلام', labelEn: 'Salam' },
            { id: 'qasida', labelUr: 'قصیدہ', labelEn: 'Qasida' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-amber-500 text-emerald-950 shadow-md'
                  : 'text-emerald-300 hover:text-amber-300'
              }`}
            >
              {isUrdu ? tab.labelUr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown Selector Bar */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-emerald-200 block">
          {isUrdu ? 'درود یا سلام منتخب کریں:' : 'Select Darood or Salam from list:'}
        </label>
        <div className="flex items-center gap-2">
          {/* Dropdown Menu */}
          <select
            value={selectedItem?.id || ''}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex-1 bg-emerald-900/90 border-2 border-emerald-700/80 hover:border-amber-400/60 text-amber-200 text-sm font-bold rounded-2xl p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer"
          >
            {filteredItems.map((item) => (
              <option key={item.id} value={item.id} className="bg-emerald-950 text-emerald-100 py-2">
                {isUrdu ? item.nameUr : item.nameEn} ({isUrdu ? item.nameEn : item.nameUr})
              </option>
            ))}
          </select>

          {/* Previous / Next Stepper Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrev}
              title={isUrdu ? 'پچھلا' : 'Previous'}
              className="p-3 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700/80 shadow-md transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              title={isUrdu ? 'اگلا' : 'Next'}
              className="p-3 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700/80 shadow-md transition-all active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Single Darood / Salam Detailed Card Display */}
      {selectedItem ? (
        <div className="bg-gradient-to-b from-emerald-900/90 to-emerald-950/90 rounded-2xl p-5 border border-amber-400/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          {/* Card Header: Title & Type Badge */}
          <div className="flex items-start justify-between gap-3 border-b border-emerald-800/60 pb-3">
            <div>
              <h4 className="text-lg font-bold font-serif text-amber-300 flex items-center gap-2">
                <span>{isUrdu ? selectedItem.nameUr : selectedItem.nameEn}</span>
              </h4>
              <p className="text-xs text-emerald-300/80">
                {isUrdu ? selectedItem.nameEn : selectedItem.nameUr}
              </p>
            </div>

            <span
              className={`text-xs uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border shadow-sm shrink-0 ${
                isQasida
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : isSalam
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-emerald-800/90 text-emerald-200 border-emerald-700/80'
              }`}
            >
              {isQasida
                ? isUrdu ? 'قصیدہ' : 'Qasida'
                : isSalam
                ? isUrdu ? 'سلام' : 'Salam'
                : isUrdu ? 'درود' : 'Darood'}
            </span>
          </div>

          {/* Arabic Text Display Box */}
          <div className="bg-emerald-950 p-4 sm:p-5 rounded-2xl border border-emerald-800/80 flex items-center justify-center text-center shadow-inner">
            <p
              className="font-serif text-xl sm:text-2xl md:text-3xl text-amber-300 dir-rtl leading-loose select-none"
              dir="rtl"
              style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
            >
              {selectedItem.arabicText}
            </p>
          </div>

          {/* Virtues & Meaning */}
          <div className="space-y-1.5 bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800/40 text-xs">
            <p className="text-emerald-200/90 leading-relaxed font-serif">
              ✨ <strong className="text-amber-300">{isUrdu ? 'فضل و برکت:' : 'Virtue:'}</strong>{' '}
              {isUrdu ? selectedItem.virtuesShortUr : selectedItem.virtuesShortEn}
            </p>
            {selectedItem.meaningUr && isUrdu && (
              <p className="text-emerald-300/80 dir-rtl font-serif pt-1 border-t border-emerald-800/40" dir="rtl">
                <strong>ترجمہ:</strong> {selectedItem.meaningUr}
              </p>
            )}
            {selectedItem.meaningEn && !isUrdu && (
              <p className="text-emerald-300/80 pt-1 border-t border-emerald-800/40">
                <strong>Meaning:</strong> {selectedItem.meaningEn}
              </p>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onSelectDaroodForRecitation(selectedItem)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Play className="w-4 h-4 fill-emerald-950" />
            <span>
              {isUrdu ? `اس ${isSalam ? 'سلام' : 'درود'} کا شمار شروع کریں` : `Start Reciting ${selectedItem.nameEn}`}
            </span>
          </button>
        </div>
      ) : (
        <div className="py-8 text-center text-emerald-300/60 text-xs">
          {isUrdu ? 'اس زمرے میں کوئی انتخاب نہیں ملا۔' : 'No items found in this category.'}
        </div>
      )}
    </div>
  );
};

