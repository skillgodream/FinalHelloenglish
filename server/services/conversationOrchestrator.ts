import { generateGeminiContent } from './geminiService';
import { 
  parseLearnerStoryToMeaningRepresentation, 
  extractNaturalEnglishMeaning, 
  applySheekoGrammarCorrections 
} from '../../src/data/sheekoEngine';

export interface ConversationTurnMessage {
  sender: 'buddy' | 'user' | 'system';
  text: string;
}

export interface ConversationOrchestrationInput {
  history: ConversationTurnMessage[];
  learnerMessage: string;
  exchangeCount: number;
  wasAwaitingEnglishRetry?: boolean;
}

export interface CanonicalMeaning {
  rawInput: string;
  detectedLanguage: 'hindi' | 'hinglish' | 'broken_english' | 'english' | 'unknown';
  intent: string;
  activities: string[];
  people: string[];
  places: string[];
  timeMarkers: string[];
  sequenceMarkers: string[];
  groundedFacts: string[];
  confidence: number;
  normalizedEnglishText: string;
}

export interface ConversationOrchestrationResult {
  understoodMeaning: string;
  naturalResponse: string;
  nextQuestion: string;
  subtleRecast: string;
  englishModel?: string;
  awaitingEnglishRetry: boolean;
  learnerComfortLanguage: 'hindi' | 'hinglish' | 'english';
  newFacts: string[];
  topic: string;
  conversationDepth: number;
  needsClarification: boolean;
  shouldEnd: boolean;
  canonicalMeaning: CanonicalMeaning;
  providerUsed: 'groq' | 'gemini' | 'sheeko_local' | 'clarification_fallback';
  responseTimeMs: number;
}

// Circuit Breaker & Provider Health Tracking
interface ProviderHealth {
  consecutiveFailures: number;
  lastFailureTime: number;
  cooldownMs: number;
  isOpen: boolean; 
}

const groqHealth: ProviderHealth = {
  consecutiveFailures: 0,
  lastFailureTime: 0,
  cooldownMs: 30000, 
  isOpen: false,
};

const geminiHealth: ProviderHealth = {
  consecutiveFailures: 0,
  lastFailureTime: 0,
  cooldownMs: 30000,
  isOpen: false,
};

function checkCircuit(health: ProviderHealth): boolean {
  if (!health.isOpen) return true;
  const now = Date.now();
  if (now - health.lastFailureTime > health.cooldownMs) {
    health.isOpen = false;
    health.consecutiveFailures = 0;
    return true;
  }
  return false;
}

function recordSuccess(health: ProviderHealth, providerName: string) {
  health.consecutiveFailures = 0;
  health.isOpen = false;
}

function recordFailure(health: ProviderHealth, providerName: string, error: any) {
  health.consecutiveFailures += 1;
  health.lastFailureTime = Date.now();
  if (health.consecutiveFailures >= 3) {
    health.isOpen = true;
    console.warn(`[CircuitBreaker] ${providerName} opened after ${health.consecutiveFailures} consecutive failures. Cooldown for ${health.cooldownMs / 1000}s.`);
  }
}

export function getProviderHealthStatus() {
  const now = Date.now();
  return {
    groq: {
      available: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim()),
      circuitState: groqHealth.isOpen ? 'OPEN (Cooldown)' : 'CLOSED (Healthy)',
      consecutiveFailures: groqHealth.consecutiveFailures,
      lastFailureSecondsAgo: groqHealth.lastFailureTime ? Math.round((now - groqHealth.lastFailureTime) / 1000) : null,
    },
    gemini: {
      available: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()),
      circuitState: geminiHealth.isOpen ? 'OPEN (Cooldown)' : 'CLOSED (Healthy)',
      consecutiveFailures: geminiHealth.consecutiveFailures,
      lastFailureSecondsAgo: geminiHealth.lastFailureTime ? Math.round((now - geminiHealth.lastFailureTime) / 1000) : null,
    },
    sheeko: {
      available: true,
      circuitState: 'ALWAYS_READY (Deterministic Local Engine)',
      deterministicRules: 10000,
    },
    sarvam: {
      available: Boolean(process.env.SARVAM_API_KEY && process.env.SARVAM_API_KEY.trim()),
      model: 'bulbul:v3',
      speaker: 'ritu',
      pace: 0.94,
    }
  };
}

const BUDDY_SYSTEM_PROMPT = `You are Buddy, an empathetic, conversational language learning tutor for Hello English. Your goal is to help learners improve their English by interpreting their inputs, correcting grammar smoothly without shaming, and maintaining conversational momentum. You must output raw JSON matching the specified schema with absolute fidelity.

CORE ARCHITECTURAL RULES:

1. HARD FACT-PRESERVATION (Strict Constraint)
- NEVER invent or add any facts, metrics, brands, times, or details that the learner did not explicitly provide.
- If the learner says "My brother buy phone.", correct the grammar to "My brother bought a phone." Do NOT add a brand (e.g., iPhone), a price, or a location. Preserve ONLY the provided facts.

2. SERVER-SIDE "STOP & WAIT" ENFORCEMENT
- If the learner speaks in Hindi or Hinglish (e.g., "Kal main market gaya"):
  * Understand the core meaning.
  * Set awaitingEnglishRetry to true.
  * Provide the correct English model in subtleRecast and englishModel.
  * Write a warm Hinglish/Hindi guiding prompt in naturalResponse.
  * CRITICAL: Force nextQuestion to be an empty string "". Do NOT advance the conversation. Stop and wait for their retry.
- If the learner attempts English (even broken English), set awaitingEnglishRetry to false and generate a natural follow-up question in nextQuestion.

3. STRICT DIALOGUE SEPARATION
- Keep naturalResponse and nextQuestion completely isolated.
- Never combine or leak question text into the naturalResponse field.

OUTPUT JSON SCHEMA:
{
  "understoodMeaning": "string - clear explanation of what the learner intended",
  "naturalResponse": "string - the warm, conversational response (Hinglish/English)",
  "nextQuestion": "string - follow-up question, or STRICTLY empty string \"\" if awaitingEnglishRetry is true",
  "subtleRecast": "string - natural English model sentence, or empty string \"\"",
  "englishModel": "string - identical natural English model sentence",
  "awaitingEnglishRetry": boolean,
  "learnerComfortLanguage": "hindi" | "hinglish" | "english",
  "topic": "string",
  "conversationDepth": number,
  "needsClarification": boolean,
  "shouldEnd": boolean
}`;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 2500;

function parseJsonSafely(text: string): any | null {
  if (!text || typeof text !== 'string') return null;
  try {
    return JSON.parse(text);
  } catch (_) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (err) {
        return null;
      }
    }
    return null;
  }
}

export function validateAndGroundMeaning(
  rawInput: string,
  modelOutput: any,
  sheekoExtraction: ReturnType<typeof parseLearnerStoryToMeaningRepresentation>
): CanonicalMeaning {
  const cleanInput = rawInput.trim();
  const isHindiOrHinglish = /[\u0900-\u097F]/.test(cleanInput) ||
    /\b(maine|khana|kha|liya|kiya|kaam|theek|samajh|gaya|gayi|aaya|aayi|kar|raha|rahi|hoon|hai|hain|mein|mera|meri|kuch|nahi|kya|bhai|dost|aaj|kal|subah|shaam|bahut|achha|accha|bohot|ghar|pata|mujhe|tum|aap|khelne|khel|dekh|baat|paisa|office|gadi|bus|sabzi|sabji|nahin)\b/i.test(cleanInput);

  let detectedLanguage: 'hindi' | 'hinglish' | 'broken_english' | 'english' | 'unknown' = 'unknown';
  if (isHindiOrHinglish) {
    detectedLanguage = /[\u0900-\u097F]/.test(cleanInput) ? 'hindi' : 'hinglish';
  } else {
    detectedLanguage = modelOutput?.learnerComfortLanguage === 'english' ? 'english' : 'broken_english';
  }

  return {
    rawInput: cleanInput,
    detectedLanguage,
    intent: 'communicate_thought',
    activities: sheekoExtraction.activities || [],
    people: sheekoExtraction.people || [],
    places: sheekoExtraction.places || [],
    timeMarkers: sheekoExtraction.timeMarkers || [],
    sequenceMarkers: sheekoExtraction.sequenceMarkers || [],
    groundedFacts: sheekoExtraction.activities.length > 0 ? sheekoExtraction.activities : [cleanInput],
    confidence: 0.85,
    normalizedEnglishText: modelOutput?.subtleRecast || modelOutput?.englishModel || ''
  };
}

/**
 * Structural Invariant Gate: Intercepts responses at the application exit layer.
 * Prevents unmapped Hindi leaking into English models and enforces uniform schema structures.
 */
function applyFailSafeGroundingGuard(
  rawInput: string, 
  partialPayload: Partial<ConversationOrchestrationResult>,
  provider: 'groq' | 'gemini' | 'sheeko_local' | 'clarification_fallback'
): ConversationOrchestrationResult {
  const englishSentence = (partialPayload.englishModel || partialPayload.subtleRecast || "").trim();
  
  // Rule: If an English model sentence leaks high-frequency Hindi/Hinglish structural tokens or echoes the input word-for-word, it's unmapped.
  const containsRawHindiTokens = /(nahin|nahi|khaya|gaya|kiya|hai|tha|hu|aur|maine|sabzi|sabji|mera|meri|kuch|achha|accha)/i.test(englishSentence);
  const isVerbatimLeak = englishSentence.toLowerCase() === rawInput.trim().toLowerCase();

  const isHindiInput = /[\u0900-\u097F]/.test(rawInput) ||
    /\b(maine|khana|kha|liya|kiya|kaam|theek|samajh|gaya|gayi|aaya|aayi|kar|raha|rahi|hoon|hai|hain|mein|mera|meri|kuch|nahi|kya|bhai|dost|aaj|kal|subah|shaam|bahut|achha|accha|bohot|ghar|pata|mujhe|tum|aap|khelne|khel|dekh|baat|paisa|office|gadi|bus|sabzi|sabji|nahin)\b/i.test(rawInput);

  if (isHindiInput && (containsRawHindiTokens || isVerbatimLeak || !englishSentence || provider === 'clarification_fallback')) {
    return {
      understoodMeaning: `Learner expressed: "${rawInput}"`,
      naturalResponse: "Main samajh gaya! Kya aap isse English mein bolne ki koshish karenge? Main sun raha hoon. 😊",
      subtleRecast: "",
      englishModel: "", // Strictly cleared to protect language boundaries
      nextQuestion: "", // Strictly forces the Server-Side STOP & WAIT rule
      awaitingEnglishRetry: true,
      learnerComfortLanguage: "hinglish",
      newFacts: [],
      topic: partialPayload.topic || "Daily Routine",
      conversationDepth: partialPayload.conversationDepth || 1,
      needsClarification: true,
      shouldEnd: false,
      canonicalMeaning: {
        rawInput: rawInput,
        detectedLanguage: "hinglish",
        intent: "unmapped_hindi_utterance",
        activities: [],
        people: [],
        places: [],
        timeMarkers: [],
        sequenceMarkers: [],
        groundedFacts: [`Learner expressed: "${rawInput}"`],
        confidence: 0.85,
        normalizedEnglishText: ""
      },
      providerUsed: "clarification_fallback",
      responseTimeMs: partialPayload.responseTimeMs || 0
    };
  }

  const isAwaiting = Boolean(partialPayload.awaitingEnglishRetry);
  return {
    understoodMeaning: partialPayload.understoodMeaning || `Learner expressed: "${rawInput}"`,
    naturalResponse: partialPayload.naturalResponse || "",
    nextQuestion: isAwaiting ? "" : (partialPayload.nextQuestion || ""),
    subtleRecast: englishSentence,
    englishModel: englishSentence,
    awaitingEnglishRetry: isAwaiting,
    learnerComfortLanguage: partialPayload.learnerComfortLanguage || "english",
    newFacts: partialPayload.newFacts || [],
    topic: partialPayload.topic || "Daily Routine",
    conversationDepth: partialPayload.conversationDepth || 1,
    needsClarification: Boolean(partialPayload.needsClarification),
    shouldEnd: Boolean(partialPayload.shouldEnd),
    canonicalMeaning: partialPayload.canonicalMeaning || {
      rawInput: rawInput,
      detectedLanguage: "unknown",
      intent: "general_conversation",
      activities: [],
      people: [],
      places: [],
      timeMarkers: [],
      sequenceMarkers: [],
      groundedFacts: [rawInput],
      confidence: 1.0,
      normalizedEnglishText: englishSentence
    },
    providerUsed: provider,
    responseTimeMs: partialPayload.responseTimeMs || 0
  };
}

/**
 * Level 3 / Sheeko Local Rule-Based Fallback
 */
export function buildSheekoBuddyFallback(
  rawInput: string,
  wasAwaitingRetry: boolean,
  exchangeCount: number,
  sheekoExtraction: ReturnType<typeof parseLearnerStoryToMeaningRepresentation>
): ConversationOrchestrationResult {
  const startTime = Date.now();
  const cleanMsg = rawInput.trim();
  const lower = cleanMsg.toLowerCase();

  // If input is empty or greeting
  if (!cleanMsg || /\b(hi|hello|hey|namaste)\b/i.test(cleanMsg)) {
    const defaultCanonical: CanonicalMeaning = {
      rawInput: cleanMsg,
      detectedLanguage: 'english',
      intent: 'greeting',
      activities: [],
      people: [],
      places: [],
      timeMarkers: [],
      sequenceMarkers: [],
      groundedFacts: ['Learner initiated greeting'],
      confidence: 1.0,
      normalizedEnglishText: 'Hello'
    };

    return {
      understoodMeaning: "Learner greeted Buddy",
      naturalResponse: "Hello! I'm your English Buddy 😊 How are you today?",
      nextQuestion: "",
      subtleRecast: "",
      englishModel: "",
      awaitingEnglishRetry: false,
      learnerComfortLanguage: "english",
      newFacts: ["Learner initiated greeting"],
      topic: "Greetings & Wellbeing",
      conversationDepth: 1,
      needsClarification: false,
      shouldEnd: false,
      canonicalMeaning: defaultCanonical,
      providerUsed: 'sheeko_local',
      responseTimeMs: Date.now() - startTime
    };
  }

  const isHindiInput = /[\u0900-\u097F]/.test(cleanMsg) ||
    /\b(maine|khana|kha|liya|kiya|kaam|theek|samajh|gaya|gayi|aaya|aayi|kar|raha|rahi|hoon|hai|hain|mein|mera|meri|kuch|nahi|kya|bhai|dost|aaj|kal|subah|shaam|bahut|achha|accha|bohot|ghar|pata|mujhe|tum|aap|khelne|khel|dekh|baat|paisa|office|gadi|bus|sabzi|sabji|nahin)\b/i.test(cleanMsg);

  let subtleRecast = "";
  let naturalResponse = "";
  let nextQuestion = "";
  let awaitingEnglishRetry = false;
  let learnerComfortLanguage: 'hindi' | 'hinglish' | 'english' = 'english';

  if (isHindiInput) {
    awaitingEnglishRetry = true;
    learnerComfortLanguage = /[\u0900-\u097F]/.test(cleanMsg) ? 'hindi' : 'hinglish';
    subtleRecast = extractNaturalEnglishMeaning(cleanMsg);

    const naturalEnglishModel = subtleRecast ? subtleRecast.trim() : "";

    if (/\b(din (acha|accha|theek) nahi|not good|mood kharab|pareshan|sad)\b/i.test(lower)) {
      naturalResponse = `Achha, toh aaj aapka din acha nahi raha 😊 English mein aap keh sakte ho: '${naturalEnglishModel}' Aap ek baar try karo. Main sun raha hoon.`;
    } else if (/\b(din (acha|accha|badhiya) tha|mazedar|great day)\b/i.test(lower)) {
      naturalResponse = `Achha 😊 English mein aap keh sakte ho: '${naturalEnglishModel}' Aap ek baar try karo. Main sun raha hoon.`;
    } else if (/\b(thak|thaka|tired|neend|rest|aram)\b/i.test(lower)) {
      naturalResponse = `Achha 😊 Rest lena zaroori hai. English mein aap keh sakte ho: '${naturalEnglishModel}' Ab aap try karo.`;
    } else if (/\b(nahi khaya|nahin khaya|nahi kiya|nahi pee|nahi pi)\b/i.test(lower)) {
      naturalResponse = `Achha 😊 English mein aap keh sakte ho: '${naturalEnglishModel}' Aap ek baar English mein bolo.`;
    } else if (/\b(khana|kha|dinner|lunch|breakfast|roti|chai|nashta)\b/i.test(lower)) {
      naturalResponse = `Achha 😊 English mein aap keh sakte ho: '${naturalEnglishModel}' Aap ek baar English mein bolo.`;
    } else if (/\b(kaam|office|shift|duty|warehouse|meeting)\b/i.test(lower)) {
      naturalResponse = `Got it! 😊 English mein aap keh sakte ho: '${naturalEnglishModel}' Ab aap try karo. Main sun raha hoon.`;
    } else if (/\b(market|bazaar|shopping|dukaan|kharida)\b/i.test(lower)) {
      naturalResponse = `Achha 😊 English mein aap keh sakte ho: '${naturalEnglishModel}' Aap ek baar English mein try karo.`;
    } else if (/\b(ghar|home|stayed)\b/i.test(lower)) {
      naturalResponse = `Achha 😊 English mein aap keh sakte ho: '${naturalEnglishModel}' Ek baar English mein bolo.`;
    } else {
      naturalResponse = `Achha 😊 English mein aap keh sakte ho: '${naturalEnglishModel}' Aap ek baar English mein bolo.`;
    }

    nextQuestion = ""; // Server-Side Stop & Wait
  } else {
    // English input (broken or fluent)
    awaitingEnglishRetry = false;
    learnerComfortLanguage = 'english';
    subtleRecast = applySheekoGrammarCorrections(cleanMsg);

    const isGrammarCorrect = subtleRecast.toLowerCase() === cleanMsg.toLowerCase();

    if (wasAwaitingRetry) {
      if (isGrammarCorrect) {
        naturalResponse = `Very good! 😊 You said it nicely!`;
      } else {
        naturalResponse = `Very good! 😊 Aapne acha try kiya. Bas ek chhota improvement: '${subtleRecast}'`;
      }
    } else {
      if (isGrammarCorrect) {
        naturalResponse = `That's great! 😊`;
      } else {
        naturalResponse = `Good try! 😊 A natural way to say that is: '${subtleRecast}'`;
      }
    }

    // Natural conversation continuation question
    if (exchangeCount >= 8) {
      nextQuestion = "It was wonderful chatting with you! Would you like to review what you practiced today?";
    } else if (/\b(market|shopping|vegetables|buy|bought)\b/i.test(lower)) {
      nextQuestion = "What else did you buy at the market?";
    } else if (/\b(food|eat|ate|dinner|lunch|hungry)\b/i.test(lower)) {
      nextQuestion = "What do you like to eat for dinner?";
    } else if (/\b(work|office|job|busy)\b/i.test(lower)) {
      nextQuestion = "How was your work today?";
    } else if (/\b(tired|sleep|rest)\b/i.test(lower)) {
      nextQuestion = "Did you get some time to rest?";
    } else {
      nextQuestion = "Tell me more, what else did you do today?";
    }
  }

  const canonicalMeaning = validateAndGroundMeaning(cleanMsg, {
    subtleRecast,
    englishModel: subtleRecast,
    learnerComfortLanguage,
  }, sheekoExtraction);

  const localResult: Partial<ConversationOrchestrationResult> = {
    understoodMeaning: `Learner expressed: "${cleanMsg}"`,
    naturalResponse,
    nextQuestion: awaitingEnglishRetry ? "" : nextQuestion,
    subtleRecast,
    englishModel: subtleRecast,
    awaitingEnglishRetry,
    learnerComfortLanguage,
    newFacts: canonicalMeaning.groundedFacts,
    topic: sheekoExtraction.activities[0] || 'Daily Routine',
    conversationDepth: exchangeCount,
    needsClarification: false,
    shouldEnd: exchangeCount >= 13,
    canonicalMeaning,
    providerUsed: 'sheeko_local',
    responseTimeMs: Date.now() - startTime
  };

  return applyFailSafeGroundingGuard(cleanMsg, localResult, 'sheeko_local');
}

/**
 * Main Conversation Orchestrator Entry Point
 * Executes the strict AI Cascade: Groq -> Gemini -> Sheeko Local -> Clarification
 */
export async function orchestrateConversationTurn(
  input: ConversationOrchestrationInput
): Promise<ConversationOrchestrationResult> {
  const startTime = Date.now();
  const cleanMsg = (input.learnerMessage || "").trim();
  const currentExchanges = typeof input.exchangeCount === 'number' ? input.exchangeCount : 1;
  const wasAwaitingRetry = Boolean(input.wasAwaitingEnglishRetry);

  // Extract baseline local deterministic facts using Sheeko
  const sheekoExtraction = parseLearnerStoryToMeaningRepresentation(cleanMsg);

  // If input is empty, return initial greeting directly
  if (!cleanMsg) {
    return buildSheekoBuddyFallback(cleanMsg, wasAwaitingRetry, currentExchanges, sheekoExtraction);
  }

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const userContextJson = JSON.stringify({
    exchangeCount: currentExchanges,
    history: input.history || [],
    latestLearnerMessage: cleanMsg,
    wasAwaitingEnglishRetry: wasAwaitingRetry,
    localSheekoExtractedFacts: sheekoExtraction.activities,
  });

  // ==========================================
  // LEVEL 1: Primary LLM (Groq / Llama 3.1)
  // ==========================================
  if (groqKey && groqKey.trim() && checkCircuit(groqHealth)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey.trim()}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: BUDDY_SYSTEM_PROMPT },
            { role: "user", content: userContextJson },
          ],
          temperature: 0.5,
          max_tokens: 500,
          response_format: { type: "json_object" },
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        const parsed = parseJsonSafely(content);

        if (parsed && typeof parsed.naturalResponse === 'string' && parsed.naturalResponse.trim()) {
          recordSuccess(groqHealth, "Groq");
          const canonical = validateAndGroundMeaning(cleanMsg, parsed, sheekoExtraction);

          const isAwaiting = Boolean(parsed.awaitingEnglishRetry);
          const enforcedNextQuestion = isAwaiting ? "" : (parsed.nextQuestion || "").trim();

          const duration = Date.now() - startTime;
          console.info(`[ConversationOrchestrator] Level 1 (Groq) succeeded in ${duration}ms (AwaitingRetry: ${isAwaiting})`);

          const result: Partial<ConversationOrchestrationResult> = {
            understoodMeaning: parsed.understoodMeaning || `Learner expressed: "${cleanMsg}"`,
            naturalResponse: parsed.naturalResponse.trim(),
            nextQuestion: enforcedNextQuestion,
            subtleRecast: (parsed.subtleRecast || parsed.englishModel || "").trim(),
            englishModel: (parsed.englishModel || parsed.subtleRecast || "").trim(),
            awaitingEnglishRetry: isAwaiting,
            learnerComfortLanguage: parsed.learnerComfortLanguage || 'english',
            newFacts: canonical.groundedFacts,
            topic: parsed.topic || "Daily Routine",
            conversationDepth: currentExchanges,
            needsClarification: Boolean(parsed.needsClarification),
            shouldEnd: Boolean(parsed.shouldEnd) || currentExchanges >= 13,
            canonicalMeaning: canonical,
            providerUsed: 'groq',
            responseTimeMs: duration,
          };

          return applyFailSafeGroundingGuard(cleanMsg, result, 'groq');
        }
      } else {
        recordFailure(groqHealth, "Groq", `HTTP ${response.status}`);
      }
    } catch (groqErr: any) {
      recordFailure(groqHealth, "Groq", groqErr?.message || groqErr);
      console.warn(`[ConversationOrchestrator] Groq call failed or timed out (${groqErr?.message || groqErr}), cascading to Secondary LLM (Gemini)...`);
    }
  }

  // ==========================================
  // LEVEL 2: Secondary LLM (Gemini Flash)
  // ==========================================
  if (geminiKey && geminiKey.trim() && checkCircuit(geminiHealth)) {
    try {
      const geminiPromise = generateGeminiContent({
        apiKey: geminiKey.trim(),
        contents: `${BUDDY_SYSTEM_PROMPT}\n\nUser Context:\n${userContextJson}`,
        responseMimeType: "application/json",
        temperature: 0.5,
      });

      // Bounded timeout race for Gemini
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error("Gemini timeout exceeded")), REQUEST_TIMEOUT_MS)
      );

      const geminiText = await Promise.race([geminiPromise, timeoutPromise]);

      if (geminiText) {
        const parsed = parseJsonSafely(geminiText);
        if (parsed && typeof parsed.naturalResponse === 'string' && parsed.naturalResponse.trim()) {
          recordSuccess(geminiHealth, "Gemini");
          const canonical = validateAndGroundMeaning(cleanMsg, parsed, sheekoExtraction);

          const isAwaiting = Boolean(parsed.awaitingEnglishRetry);
          const enforcedNextQuestion = isAwaiting ? "" : (parsed.nextQuestion || "").trim();

          const duration = Date.now() - startTime;
          console.info(`[ConversationOrchestrator] Level 2 (Gemini) succeeded in ${duration}ms (AwaitingRetry: ${isAwaiting})`);

          const result: Partial<ConversationOrchestrationResult> = {
            understoodMeaning: parsed.understoodMeaning || `Learner expressed: "${cleanMsg}"`,
            naturalResponse: parsed.naturalResponse.trim(),
            nextQuestion: enforcedNextQuestion,
            subtleRecast: (parsed.subtleRecast || parsed.englishModel || "").trim(),
            englishModel: (parsed.englishModel || parsed.subtleRecast || "").trim(),
            awaitingEnglishRetry: isAwaiting,
            learnerComfortLanguage: parsed.learnerComfortLanguage || 'english',
            newFacts: canonical.groundedFacts,
            topic: parsed.topic || "Daily Routine",
            conversationDepth: currentExchanges,
            needsClarification: Boolean(parsed.needsClarification),
            shouldEnd: Boolean(parsed.shouldEnd) || currentExchanges >= 13,
            canonicalMeaning: canonical,
            providerUsed: 'gemini',
            responseTimeMs: duration,
          };

          return applyFailSafeGroundingGuard(cleanMsg, result, 'gemini');
        }
      }
    } catch (geminiErr: any) {
      recordFailure(geminiHealth, "Gemini", geminiErr?.message || geminiErr);
      console.warn(`[ConversationOrchestrator] Gemini call failed or timed out (${geminiErr?.message || geminiErr}), cascading to Level 3 (Sheeko Local)...`);
    }
  }

  // ==========================================
  // LEVEL 3 & 4: Deterministic Local Sheeko Fallback / Safe Clarification
  // ==========================================
  const duration = Date.now() - startTime;
  console.info(`[ConversationOrchestrator] Level 3 (Local Sheeko Engine) executing deterministic resolution in ${duration}ms`);
  const sheekoResult = buildSheekoBuddyFallback(cleanMsg, wasAwaitingRetry, currentExchanges, sheekoExtraction);
  sheekoResult.responseTimeMs = Date.now() - startTime;
  return sheekoResult;
}
