import React, { useState } from 'react';
import { BookOpen, Search, Filter, Sparkles, Play, Bookmark, Heart } from 'lucide-react';
import { Darood, UserPreferences } from '../types';
import { DaroodScrollList } from './DaroodScrollList';

type LibraryViewProps = {
  daroods: Darood[];
  prefs: UserPreferences;
  onSelectDaroodForRecitation: (darood: Darood) => void;
};

export const LibraryView: React.FC<LibraryViewProps> = ({
  daroods,
  prefs,
  onSelectDaroodForRecitation,
}) => {
  const isUrdu = prefs.language === 'ur';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredDaroods = daroods.filter((d) => {
    const matchesSearch =
      d.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameUr.includes(searchQuery) ||
      d.arabicText.includes(searchQuery);

    const matchesCategory =
      selectedCategory === 'all' || d.category === selectedCategory;

    const matchesType =
      selectedType === 'all' ||
      (selectedType === 'salam' && (d.type === 'salam' || d.id.includes('salam'))) ||
      (selectedType === 'darood' && (d.type === 'darood' || (!d.type && !d.id.includes('salam')))) ||
      (selectedType === 'qasida' && (d.type === 'qasida' || d.id.includes('qasida')));

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Scrollable Quick List Section */}
      <DaroodScrollList
        daroods={daroods}
        prefs={prefs}
        onSelectDaroodForRecitation={onSelectDaroodForRecitation}
        titleEn="Quick Scroll List of Darood-o-Salam"
        titleUr="درود و سلام کی کوئیک اسکرول فہرست"
      />

      {/* Header Banner & Filters */}
      <div className="bg-emerald-950/80 rounded-3xl p-6 border border-emerald-800/60 shadow-xl text-emerald-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold font-serif text-amber-300">
                {isUrdu ? 'مستند درودِ پاک ڈائریکٹری' : 'Authentic Darood Directory'}
              </h2>
            </div>
            <p className="text-xs text-emerald-300/80">
              {isUrdu
                ? 'مختلف فضائل و برکات کے حامل درود و سلام اور ان کا مستند ترجمہ'
                : 'Collection of blessed Salawat & Salam recitations with Arabic text & translation'}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={isUrdu ? 'تلاش کریں...' : 'Search Darood or Salam...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-900/80 border border-emerald-700/80 text-emerald-100 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
          </div>
        </div>

        {/* Filter Rows: Type Filter + Category Filter */}
        <div className="space-y-2 pt-2 border-t border-emerald-800/50">
          {/* Type Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-amber-400/90 whitespace-nowrap">
              {isUrdu ? 'قسم:' : 'Type:'}
            </span>
            {[
              { id: 'all', labelUr: 'تمام', labelEn: 'All' },
              { id: 'darood', labelUr: 'درودِ پاک', labelEn: 'Darood' },
              { id: 'salam', labelUr: 'سلام', labelEn: 'Salam' },
              { id: 'qasida', labelUr: 'قصیدہ', labelEn: 'Qasida' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedType === t.id
                    ? 'bg-amber-500 text-emerald-950 font-bold shadow-md'
                    : 'bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800 border border-emerald-800'
                }`}
              >
                {isUrdu ? t.labelUr : t.labelEn}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] font-bold text-emerald-400/80 whitespace-nowrap">
              {isUrdu ? 'برکت:' : 'Category:'}
            </span>
            {[
              { id: 'all', labelUr: 'تمام زمرے', labelEn: 'All Categories' },
              { id: 'core', labelUr: 'بنیادی و مسنون', labelEn: 'Core & Sunnah' },
              { id: 'short', labelUr: 'مختصر', labelEn: 'Short' },
              { id: 'healing', labelUr: 'شفائے قلوب', labelEn: 'Healing & Peace' },
              { id: 'special', labelUr: 'مشکلات و حاجت', labelEn: 'Relief & Special' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-amber-300 font-bold border border-amber-400/50 shadow-md'
                    : 'bg-emerald-950/40 text-emerald-300/80 hover:bg-emerald-900 border border-emerald-800/60'
                }`}
              >
                {isUrdu ? cat.labelUr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDaroods.map((darood) => (
          <div
            key={darood.id}
            className="bg-gradient-to-b from-emerald-900/80 to-emerald-950/90 rounded-3xl p-6 border border-emerald-800/60 shadow-xl space-y-4 hover:border-amber-400/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Title & Category Badge */}
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <h3 className="text-lg font-bold font-serif text-amber-300">
                  {isUrdu ? darood.nameUr : darood.nameEn}
                </h3>
                <div className="flex items-center gap-1.5">
                  {darood.type && (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {darood.type}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-700/60">
                    {darood.category}
                  </span>
                </div>
              </div>

              {/* Full Arabic Text */}
              <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800/40">
                <p
                  className="font-serif text-2xl sm:text-3xl text-amber-200 dir-rtl text-center leading-loose select-none"
                  dir="rtl"
                  style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
                >
                  {darood.arabicText}
                </p>
              </div>

              {/* Translation */}
              <div className="space-y-1.5 text-xs text-emerald-200/90 font-sans">
                <p className="leading-relaxed" dir={isUrdu ? 'rtl' : 'ltr'}>
                  <span className="font-bold text-amber-400/90">
                    {isUrdu ? 'ترجمہ: ' : 'Translation: '}
                  </span>
                  {darood.urduTranslation}
                </p>

                {darood.transliteration && (
                  <p className="text-[11px] text-emerald-300/70 italic">
                    {darood.transliteration}
                  </p>
                )}
              </div>

              {/* Virtues & Benefits */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 font-serif leading-relaxed">
                <span className="font-bold text-amber-300 block mb-0.5">
                  ✨ {isUrdu ? 'فضیلت و برکت:' : 'Virtues & Benefits:'}
                </span>
                {isUrdu ? darood.virtuesShortUr : darood.virtuesShortEn}
              </div>
            </div>

            {/* Recite Action */}
            <div className="pt-2">
              <button
                onClick={() => onSelectDaroodForRecitation(darood)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-xs shadow-md hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-emerald-950" />
                <span>{isUrdu ? 'اس درود کا شمار کریں' : 'Recite This Darood'}</span>
              </button>
            </div>
          </div>
        ))}

        {filteredDaroods.length === 0 && (
          <div className="col-span-full py-12 text-center text-emerald-300/70 space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-emerald-600" />
            <p>{isUrdu ? 'کوئی درودِ پاک نہیں ملا۔' : 'No Darood found matching your query.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
