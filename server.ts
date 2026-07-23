import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { SEED_DAROODS } from './src/data/daroods.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API: Get Seed Daroods
app.get('/api/daroods', (req, res) => {
  res.json({ success: true, daroods: SEED_DAROODS });
});

// API: AI Plan Generation Endpoint using Gemini
app.post('/api/ai/generate-plan', async (req, res) => {
  try {
    const { timeCapacity, preferredTimes, goal, customTarget, language } = req.body;

    const requestedTarget = Number(customTarget) && Number(customTarget) > 0 ? Number(customTarget) : 313;
    const requestedSlots: string[] = Array.isArray(preferredTimes) && preferredTimes.length > 0
      ? preferredTimes
      : ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'before_sleep'];

    // Helper to divide target cleanly across all requested slots
    const buildBalancedSlots = (aiSlots?: any[]) => {
      const numSlots = requestedSlots.length;
      const baseCount = Math.floor(requestedTarget / numSlots);
      let remainder = requestedTarget % numSlots;

      return requestedSlots.map((slotKey: string, idx: number) => {
        const count = baseCount + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;

        const aiMatch = (aiSlots || []).find((s: any) => s.time === slotKey);

        return {
          time: slotKey,
          count,
          daroodId: aiMatch?.daroodId || (idx % 2 === 0 ? 'darood_e_ibrahim' : 'short_darood'),
          daroodName: aiMatch?.daroodName || (idx % 2 === 0 ? (language === 'ur' ? 'درودِ ابراہیمی' : 'Darood-e-Ibrahim') : (language === 'ur' ? 'مختصر درودِ پاک' : 'Short Salawat')),
        };
      });
    };

    if (!process.env.GEMINI_API_KEY) {
      // Fallback if API key is not yet set
      const fallbackSlots = buildBalancedSlots();
      return res.json({
        success: true,
        plan: {
          dailyTarget: requestedTarget,
          slots: fallbackSlots,
          recommendedDaroods: ['darood_e_ibrahim', 'short_darood'],
          coachMessageEn: 'Consistency in sending peace upon Prophet Muhammad ﷺ illuminates the heart. Start small and build a lifelong spiritual bond.',
          coachMessageUr: 'نبی کریم ﷺ پر باقاعدگی سے درود پاک بھیجنا دلوں کو منور کرتا ہے۔ چھوٹے ہدف سے آغاز کریں اور مستقل مزاجی اپنائیں۔',
          weeklyTarget: requestedTarget * 7,
        },
      });
    }

    const systemInstruction = `You are an encouraging, authentic Islamic Habit Coach for "Noor-e-Darood o Salam".
Your job is to generate a personalized, realistic 7-day Darood & Salam recitation habit plan (Noor-e-Darood o Salam Plan) for a muslim seeking daily spiritual connection through sending Salawat & Salam upon Prophet Muhammad ﷺ.
The response must strictly follow the JSON schema. Provide advice in the requested language ("ur" for Urdu or "en" for English).`;

    const prompt = `User Constraints:
- Language: ${language === 'ur' ? 'Urdu' : 'English'}
- Daily Time Capacity: ${timeCapacity || '5-10min'}
- Target Daily Recitations: ${requestedTarget}
- Preferred Recitation Time Slots: ${JSON.stringify(requestedSlots)}
- Main Goal: ${goal || 'build_habit'}

Generate a structured daily target of ${requestedTarget} total recitations distributed accurately across preferred time slots, recommend 2 primary Darood names, and craft a short 2-sentence encouraging spiritual coach message in ${language === 'ur' ? 'Urdu' : 'English'}.`;

    const modelName = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dailyTarget: { type: Type.INTEGER, description: 'Total daily recitation target' },
            slots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING, description: 'Time slot key' },
                  count: { type: Type.INTEGER, description: 'Target count for this slot' },
                  daroodId: { type: Type.STRING, description: 'Recommended Darood ID' },
                  daroodName: { type: Type.STRING, description: 'Display name of Darood' },
                },
                required: ['time', 'count', 'daroodId', 'daroodName'],
              },
            },
            recommendedDaroods: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            coachMessageEn: { type: Type.STRING, description: 'Motivational coach tip in English' },
            coachMessageUr: { type: Type.STRING, description: 'Motivational coach tip in Urdu' },
            weeklyTarget: { type: Type.INTEGER, description: 'Total weekly target' },
          },
          required: ['dailyTarget', 'slots', 'recommendedDaroods', 'coachMessageEn', 'coachMessageUr', 'weeklyTarget'],
        },
      },
    });

    const rawPlan = JSON.parse(response.text || '{}');
    const balancedSlots = buildBalancedSlots(rawPlan.slots);

    const finalPlan = {
      ...rawPlan,
      dailyTarget: requestedTarget,
      slots: balancedSlots,
      weeklyTarget: requestedTarget * 7,
    };

    return res.json({ success: true, plan: finalPlan });
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
      console.warn('Gemini API rate limit reached, serving structured fallback plan.');
    } else {
      console.error('Error generating AI plan:', error);
    }
    const requestedTarget = Number(req.body?.customTarget) || 313;
    const requestedSlots = Array.isArray(req.body?.preferredTimes) && req.body.preferredTimes.length > 0
      ? req.body.preferredTimes
      : ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'before_sleep'];

    const numSlots = requestedSlots.length;
    const baseCount = Math.floor(requestedTarget / numSlots);
    let remainder = requestedTarget % numSlots;

    const fallbackSlots = requestedSlots.map((slotKey: string, idx: number) => {
      const count = baseCount + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;

      return {
        time: slotKey,
        count,
        daroodId: idx % 2 === 0 ? 'darood_e_ibrahim' : 'short_darood',
        daroodName: idx % 2 === 0 ? (req.body?.language === 'ur' ? 'درودِ ابراہیمی' : 'Darood-e-Ibrahim') : (req.body?.language === 'ur' ? 'مختصر درودِ پاک' : 'Short Salawat'),
      };
    });

    return res.json({
      success: true,
      plan: {
        dailyTarget: requestedTarget,
        slots: fallbackSlots,
        recommendedDaroods: ['darood_e_ibrahim', 'short_darood'],
        coachMessageEn: 'Sending salutations upon the Beloved Prophet ﷺ brings peace to the heart and blessings to your day.',
        coachMessageUr: 'نبی کریم ﷺ پر درود و سلام بھیجنا قلبی سکون اور لامتناہی برکات کا ذریعہ ہے۔',
        weeklyTarget: requestedTarget * 7,
      },
    });
  }
});

// API: AI Spiritual Reflection Insight
app.post('/api/ai/reflection-insight', async (req, res) => {
  try {
    const { sessions, language } = req.body;
    const peacefulCount = (sessions || []).filter((s: any) => s.reflection === 'peaceful').length;
    const totalCount = (sessions || []).reduce((acc: number, s: any) => acc + (s.count || 0), 0);

    const prompt = `A user has completed ${sessions?.length || 0} recitation sessions totaling ${totalCount} Daroods. ${peacefulCount} sessions felt 'peaceful'.
Provide a 2-sentence soothing Islamic reflection and encouraging advice in ${language === 'ur' ? 'Urdu' : 'English'}.`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        insight: language === 'ur'
          ? 'ماشاءاللہ! آپ کا ہر درودِ پاک آپ کے نامہ اعمال میں روشنی کا باعث بن رہا ہے۔ اس مبارک عمل کو جاری رکھیں۔'
          : 'MashaAllah! Every Salawat you recite creates a light in your deeds. Keep up this blessed habit with devotion.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a compassionate Islamic spiritual mentor. Respond in 2 soothing sentences.',
      },
    });

    res.json({ success: true, insight: response.text });
  } catch (err) {
    res.json({
      success: true,
      insight: req.body.language === 'ur'
        ? 'اللہ تعالیٰ آپ کی تمام نیک کاوشوں کو قبول فرمائے اور درودِ پاک کی برکت سے آپ کی زندگی کو منور کرے۔'
        : 'May Allah accept your earnest recitations and illuminate your heart with the light of Darood Shareef.',
    });
  }
});

// Start Server with Vite Middleware in Development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Noor-e-Darood Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
