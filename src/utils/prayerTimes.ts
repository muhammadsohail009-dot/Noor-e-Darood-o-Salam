import { PrayerTimeSlot, CustomSlot } from '../types';

export const MAJOR_CITIES = [
  { name: 'Multan, Pakistan', lat: 30.1575, lng: 71.5249, timezone: 'Asia/Karachi', fajr: '04:15 AM', dhuhr: '12:25 PM', asr: '04:15 PM', maghrib: '07:12 PM', isha: '08:40 PM', before_sleep: '10:30 PM' },
  { name: 'Lahore, Pakistan', lat: 31.5204, lng: 74.3587, timezone: 'Asia/Karachi', fajr: '04:10 AM', dhuhr: '12:20 PM', asr: '04:10 PM', maghrib: '07:08 PM', isha: '08:35 PM', before_sleep: '10:30 PM' },
  { name: 'Karachi, Pakistan', lat: 24.8607, lng: 67.0011, timezone: 'Asia/Karachi', fajr: '04:45 AM', dhuhr: '12:35 PM', asr: '04:20 PM', maghrib: '07:22 PM', isha: '08:45 PM', before_sleep: '10:30 PM' },
  { name: 'Islamabad, Pakistan', lat: 33.6844, lng: 73.0479, timezone: 'Asia/Karachi', fajr: '04:08 AM', dhuhr: '12:22 PM', asr: '04:15 PM', maghrib: '07:14 PM', isha: '08:42 PM', before_sleep: '10:30 PM' },
  { name: 'Mecca, Saudi Arabia', lat: 21.3891, lng: 39.8579, timezone: 'Asia/Riyadh', fajr: '04:25 AM', dhuhr: '12:28 PM', asr: '03:50 PM', maghrib: '07:02 PM', isha: '08:32 PM', before_sleep: '10:30 PM' },
  { name: 'Medina, Saudi Arabia', lat: 24.5247, lng: 39.5692, timezone: 'Asia/Riyadh', fajr: '04:22 AM', dhuhr: '12:28 PM', asr: '03:55 PM', maghrib: '07:04 PM', isha: '08:34 PM', before_sleep: '10:30 PM' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', fajr: '03:20 AM', dhuhr: '01:08 PM', asr: '05:20 PM', maghrib: '09:05 PM', isha: '10:35 PM', before_sleep: '11:30 PM' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York', fajr: '04:35 AM', dhuhr: '01:02 PM', asr: '04:55 PM', maghrib: '08:22 PM', isha: '09:50 PM', before_sleep: '11:00 PM' },
];

export function getDefaultPrayerTimes(
  selectedCityName?: string,
  dailyTarget: number = 313,
  customSlots: CustomSlot[] = []
): PrayerTimeSlot[] {
  const city = MAJOR_CITIES.find((c) => c.name === selectedCityName) || MAJOR_CITIES[0];

  const standardSlots: PrayerTimeSlot[] = [
    { name: 'Fajr', key: 'fajr', timeStr: city.fajr, targetCount: 0, completedCount: 0 },
    { name: 'Dhuhr', key: 'dhuhr', timeStr: city.dhuhr, targetCount: 0, completedCount: 0 },
    { name: 'Asr', key: 'asr', timeStr: city.asr, targetCount: 0, completedCount: 0 },
    { name: 'Maghrib', key: 'maghrib', timeStr: city.maghrib, targetCount: 0, completedCount: 0 },
    { name: 'Isha', key: 'isha', timeStr: city.isha, targetCount: 0, completedCount: 0 },
    { name: 'Before Sleep', key: 'before_sleep', timeStr: city.before_sleep, targetCount: 0, completedCount: 0 },
  ];

  const activeCustomSlots: PrayerTimeSlot[] = (customSlots || [])
    .filter((cs) => cs.enabled !== false)
    .map((cs) => ({
      name: cs.nameEn,
      key: cs.id,
      timeStr: cs.timeStr,
      targetCount: 0,
      completedCount: 0,
    }));

  const allSlots = [...standardSlots, ...activeCustomSlots];
  const numSlots = allSlots.length;

  if (numSlots > 0 && dailyTarget > 0) {
    const baseCount = Math.floor(dailyTarget / numSlots);
    let remainder = dailyTarget % numSlots;

    for (let i = 0; i < numSlots; i++) {
      allSlots[i].targetCount = baseCount + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
    }
  }

  return allSlots;
}

export function getCurrentPrayerSlotKey(): string {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 4 && hour < 12) return 'fajr';
  if (hour >= 12 && hour < 15) return 'dhuhr';
  if (hour >= 15 && hour < 18) return 'asr';
  if (hour >= 18 && hour < 20) return 'maghrib';
  if (hour >= 20 && hour < 22) return 'isha';
  return 'before_sleep';
}

export function formatPrayerName(key: string, lang: 'en' | 'ur', customSlots: CustomSlot[] = []): string {
  const map: Record<string, { en: string; ur: string }> = {
    fajr: { en: 'After Fajr', ur: 'بعد نمازِ فجر' },
    dhuhr: { en: 'After Dhuhr', ur: 'بعد نمازِ ظہر' },
    asr: { en: 'After Asr', ur: 'بعد نمازِ عصر' },
    maghrib: { en: 'After Maghrib', ur: 'بعد نمازِ مغرب' },
    isha: { en: 'After Isha', ur: 'بعد نمازِ عشاء' },
    before_sleep: { en: 'Before Sleep', ur: 'سونے سے پہلے' },
    general: { en: 'General Recitation', ur: 'عام ذکر' },
  };

  if (map[key]) {
    return map[key][lang];
  }

  const custom = (customSlots || []).find((cs) => cs.id === key);
  if (custom) {
    return lang === 'ur' ? (custom.nameUr || custom.nameEn) : custom.nameEn;
  }

  return key;
}

