import { GoogleGenAI } from "@google/genai";

export async function generateResponse(promptOrPayload: any): Promise<any> {
  const result = await callLlamaConversationStep(promptOrPayload || {});
  return {
    naturalResponse: result?.meaning || "I understand you.",
    englishModel: result?.rephrase || "I understand.",
    awaitingEnglishRetry: false,
    ...result
  };
}

export function getProviderHealth(): boolean {
  return true;
}

export interface LlamaConversationContext {
  latestLearnerAnswer?: string;
  selectedTopic?: {
    pointer?: string;
    category?: string;
    turnCount?: number;
    exploredAspects?: Record<string, any>;
    isCompleted?: boolean;
  };
  conversationHistory?: Array<{
    speaker: 'system' | 'learner' | string;
    text: string;
    rephrase?: string;
    probeQuestion?: string;
  }>;
  dayMap?: {
    activities?: string[];
    emotions?: string[];
    environments?: string[];
    knownFacts?: string[];
    rawStatement?: string;
    naturalEnglishMeaning?: string;
    naturalEnglishStory?: string;
  };
  answeredQuestions?: string[];
  knownFacts?: string[];
  isFirstTurnOfTopic?: boolean;
}

export interface LlamaConversationOutput {
  meaning: string;
  rephrase: string;
  intent: string;
  probeQuestion: string;
  probeDirection: 'WHAT' | 'HOW' | 'WHY' | 'WHO' | 'WHERE' | 'WHEN' | 'RESULT' | 'FEELING' | 'DETAIL';
  topicCompleted: boolean;
  extractedFacts: string[];
  confidence: number;
  naturalStory?: string;
}

const GROQ_CANDIDATE_MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "openai/gpt-oss-20b",
  "groq/compound",
];

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 9000;

const VALID_PROBE_DIRECTIONS = new Set([
  'WHAT',
  'HOW',
  'WHY',
  'WHO',
  'WHERE',
  'WHEN',
  'RESULT',
  'FEELING',
  'DETAIL',
]);

let activeWorkingGroqModel: string | null = null;

/**
 * Clean & validate LLM JSON output
 */
function validateAndNormalizeLlamaOutput(raw: any): LlamaConversationOutput {
  if (!raw || typeof raw !== 'object') {
    throw new Error('LLM response is not an object');
  }

  const meaning = typeof raw.meaning === 'string' && raw.meaning.trim()
    ? raw.meaning.trim()
    : 'Learner shared their experience';

  const rephrase = typeof raw.rephrase === 'string' && raw.rephrase.trim()
    ? raw.rephrase.trim()
    : 'You described your experience.';

  const intent = typeof raw.intent === 'string' && raw.intent.trim()
    ? raw.intent.trim()
    : 'Describing past activity';

  const probeQuestion = typeof raw.probeQuestion === 'string' && raw.probeQuestion.trim()
    ? raw.probeQuestion.trim()
    : 'What happened after that?';

  let rawDirection = (typeof raw.probeDirection === 'string' ? raw.probeDirection.trim().toUpperCase() : 'WHAT') as any;
  if (!VALID_PROBE_DIRECTIONS.has(rawDirection)) {
    rawDirection = 'WHAT';
  }

  const topicCompleted = Boolean(raw.topicCompleted);

  const extractedFacts = Array.isArray(raw.extractedFacts)
    ? raw.extractedFacts.filter((f: any) => typeof f === 'string' && f.trim()).map((f: string) => f.trim())
    : [];

  let confidence = typeof raw.confidence === 'number' && !isNaN(raw.confidence)
    ? raw.confidence
    : 0.88;
  if (confidence > 1 && confidence <= 100) {
    confidence = confidence / 100;
  }
  confidence = Math.max(0.1, Math.min(1.0, confidence));

  const naturalStory = typeof raw.naturalStory === 'string' && raw.naturalStory.trim()
    ? raw.naturalStory.trim()
    : undefined;

  return {
    meaning,
    rephrase,
    intent,
    probeQuestion,
    probeDirection: rawDirection,
    topicCompleted,
    extractedFacts,
    confidence,
    naturalStory,
  };
}

function buildPrompts(context: LlamaConversationContext) {
  const {
    latestLearnerAnswer = '',
    selectedTopic,
    conversationHistory = [],
    dayMap,
    answeredQuestions = [],
    knownFacts = [],
    isFirstTurnOfTopic = false,
  } = context;

  const currentTopic = selectedTopic?.pointer || 'Daily Routine';
  const turnCount = selectedTopic?.turnCount || 0;

  const recentTurns = (conversationHistory || []).slice(-4).map((t) => ({
    speaker: t.speaker,
    text: t.text,
  }));

  const relevantFacts = Array.from(
    new Set([
      ...(knownFacts || []).slice(-6),
      ...(dayMap?.knownFacts || []).slice(-6),
    ])
  );

  const answeredList = (answeredQuestions || []).slice(-6);

  const systemPrompt = `You are the language intelligence engine for "Hello English", an English learning platform for Indian learners who often speak in broken English, transliterated Hindi-English, or fragmented phrases.

Your mission is to perform four core tasks for the current conversational turn:
1. Understand the learner's intended meaning accurately (even if spoken with broken grammar, missing articles/prepositions, or Indian English idioms).
2. Rephrase the learner's latest expression into natural, simple, professional English for Coach Neha's immediate response.
3. Synthesize/update the learner's complete accumulated Day Story rewritten in correct, simple, natural English in first person ("naturalStory").
4. Generate exactly ONE contextual, natural follow-up/probing question to advance the conversation.

CRITICAL INSTRUCTIONS & RULES:
- NATURAL ENGLISH MEANING vs NATURAL ENGLISH STORY:
  * "meaning" = short interpretation of the learner's latest utterance only.
  * "naturalStory" = complete accumulated Day Story rewritten in correct, simple, natural English in first-person (e.g. "This morning, I... Then, I..."). Preserve exact chronological sequence, people, places, and events. Never invent unmentioned facts or details.
- UNDERSTAND BROKEN & INDIAN ENGLISH: Seamlessly decipher Indian English usage (e.g. "I did the needful", "take rest", "boss gave tension", "today morning I went").
- PRESERVE ACTUAL MEANING & FACTS: Never invent facts. Never add details, times, or characters that the learner did not mention. Preserve all names, places, events, and chronology.
- SIMPLE & NATURAL REPHRASING: Rephrase into clean, natural English (e.g. "So, you completed the stock check before your supervisor arrived."). Do NOT use overly flowery or pretentious GRE vocabulary. Do NOT simply echo/repeat the learner's broken sentence verbatim. Do NOT start with "You said...".
- EXACTLY ONE FOLLOW-UP QUESTION: The probing question must directly follow the story. Do NOT ask multiple questions at once.
- NO REPEATING QUESTIONS: Avoid asking questions listed in Already Answered Questions.
- DO NOT ANSWER FOR THE LEARNER: Ask an open or clarifying prompt that encourages the learner to speak.
- HANDLE SHORT / UNEXPECTED ANSWERS: If the learner gives a brief 1-2 word response or unexpected detail, acknowledge it smoothly and probe for the next logical step without breaking the flow.
- UNCLEAR STATEMENTS: If the learner's input is genuinely incomprehensible, set meaning to what could be understood and ask a gentle clarification question.
- CONVERSATIONAL PACING (5-TURN TARGET): Maintain a focused 5-turn interactive dialogue with the learner.
  * Turn 1: Probe opening action / context ("WHAT / WHO").
  * Turn 2: Probe timeline / detail / environment ("WHEN / WHERE / DETAIL").
  * Turn 3: Probe feelings / challenges / emotions ("FEELING / WHY").
  * Turn 4: Probe resolution / action taken / response ("HOW / RESULT").
  * Turn 5: Final reflection / takeaway before concluding session summary.
  * Only set "topicCompleted": true on or after Turn 5.

OUTPUT FORMAT REQUIREMENTS:
You MUST return ONLY a valid JSON object with this exact schema:
{
  "meaning": "string - clear short interpretation of what the learner intended to say in this turn",
  "rephrase": "string - natural, fluent, simple English rephrasing of their latest statement",
  "intent": "string - underlying conversational intent (e.g., explaining problem, sharing routine, expressing relief)",
  "naturalStory": "string - complete accumulated Day Story so far rewritten in clean, simple, natural first-person English",
  "probeQuestion": "string - exactly one follow-up question to probe deeper",
  "probeDirection": "WHAT | HOW | WHY | WHO | WHERE | WHEN | RESULT | FEELING | DETAIL",
  "topicCompleted": boolean,
  "extractedFacts": ["string", "string"],
  "confidence": 0.90
}`;

  const userPrompt = JSON.stringify({
    currentTopic,
    turnNumber: turnCount + 1,
    isFirstTurnOfTopic,
    latestLearnerAnswer: latestLearnerAnswer.trim() || (isFirstTurnOfTopic ? `Starting topic: ${currentTopic}` : 'I am ready'),
    recentConversationHistory: recentTurns,
    initialStory: dayMap?.rawStatement || '',
    previousAccumulatedStory: dayMap?.naturalEnglishStory || '',
    relevantFacts: relevantFacts.slice(0, 5),
    alreadyAnsweredQuestions: answeredList,
    dayContext: {
      activity: dayMap?.activities?.slice(0, 3) || [],
      emotion: dayMap?.emotions?.slice(0, 2) || [],
    },
    conversationObjective: `Help the learner speak about "${currentTopic}" fluently and naturally, and keep their complete accumulated natural English story updated.`,
  });

  return { systemPrompt, userPrompt };
}

function parseJsonFromLlmText(content: string): any {
  let cleanJson = content.trim();
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
  }
  return JSON.parse(cleanJson);
}

/**
 * Call Groq API with automatic model fallback
 */
async function callGroqWithFallback(systemPrompt: string, userPrompt: string, apiKey: string): Promise<LlamaConversationOutput> {
  const modelsToTry = activeWorkingGroqModel
    ? [activeWorkingGroqModel, ...GROQ_CANDIDATE_MODELS.filter((m) => m !== activeWorkingGroqModel)]
    : GROQ_CANDIDATE_MODELS;

  let lastError: any = null;

  for (const model of modelsToTry) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 800,
          response_format: { type: "json_object" },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        // If model not found or forbidden, try next candidate model
        if (response.status === 404 || response.status === 400 || response.status === 403) {
          lastError = new Error(`Groq model ${model} returned ${response.status}: ${errorBody}`);
          continue;
        }
        throw new Error(`Groq API returned status ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content || typeof content !== 'string') {
        throw new Error('Empty message content in Groq response');
      }

      const parsed = parseJsonFromLlmText(content);
      activeWorkingGroqModel = model;
      return validateAndNormalizeLlamaOutput(parsed);
    } catch (err: any) {
      clearTimeout(timeoutId);
      lastError = err;
    }
  }

  throw lastError || new Error('All Groq candidate models failed');
}

/**
 * Call Gemini API as resilient secondary LLM engine
 */
async function callGeminiFallback(systemPrompt: string, userPrompt: string, apiKey: string): Promise<LlamaConversationOutput> {
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const geminiModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

  let lastError: any = null;
  for (const model of geminiModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `${systemPrompt}\n\nUser Input / Context:\n${userPrompt}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const text = response.text;
      if (!text) throw new Error(`Empty response from Gemini model ${model}`);

      const parsed = parseJsonFromLlmText(text);
      return validateAndNormalizeLlamaOutput(parsed);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini fallback models failed');
}

/**
 * Main conversational intelligence step
 */
export async function callLlamaConversationStep(
  context: LlamaConversationContext
): Promise<LlamaConversationOutput> {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const { systemPrompt, userPrompt } = buildPrompts(context);

  // 1. Try Groq with active/candidate models
  if (groqKey && groqKey.trim()) {
    try {
      return await callGroqWithFallback(systemPrompt, userPrompt, groqKey);
    } catch (groqErr) {
      console.warn("[LlamaService] Groq attempt failed, falling back to Gemini:", (groqErr as any)?.message || groqErr);
    }
  }

  // 2. Fallback to Gemini
  if (geminiKey && geminiKey.trim()) {
    try {
      return await callGeminiFallback(systemPrompt, userPrompt, geminiKey);
    } catch (geminiErr) {
      console.warn("[LlamaService] Gemini fallback failed:", (geminiErr as any)?.message || geminiErr);
    }
  }

  throw new Error("No operational LLM service available (Groq/Gemini)");
}
