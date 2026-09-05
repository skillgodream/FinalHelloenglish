import { GoogleGenAI } from "@google/genai";

const APPROVED_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
];

export interface GeminiContentOptions {
  apiKey?: string;
  contents: string;
  responseMimeType?: string;
  temperature?: number;
}

/**
 * Robust Gemini Content Generator with automatic model failover
 * Bypasses 503 UNAVAILABLE / high-demand errors by cascading across approved SDK models.
 */
export async function generateGeminiContent(options: GeminiContentOptions): Promise<string | null> {
  const apiKey = (options.apiKey || process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError: any = null;

  for (const model of APPROVED_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: {
          ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {}),
          temperature: options.temperature !== undefined ? options.temperature : 0.4,
        },
      });

      if (response.text && response.text.trim()) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      if (
        errMsg.includes("503") ||
        errMsg.includes("high demand") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("ResourceExhausted") ||
        errMsg.includes("429")
      ) {
        console.warn(`[GeminiService] Model ${model} unavailable/high-demand, cascading to next model...`);
        await new Promise((r) => setTimeout(r, 150));
        continue;
      }
      console.warn(`[GeminiService] Model ${model} encountered error:`, errMsg);
    }
  }

  console.warn("[GeminiService] All approved Gemini fallback models failed:", lastError?.message || lastError);
  return null;
}

export async function generateResponse(promptOrPayload: any): Promise<any> {
  const text = await generateGeminiContent({
    contents: typeof promptOrPayload === 'string' ? promptOrPayload : JSON.stringify(promptOrPayload)
  });
  return {
    naturalResponse: text || "Achha, samajh gaya.",
    englishModel: "I understood.",
    awaitingEnglishRetry: false
  };
}

