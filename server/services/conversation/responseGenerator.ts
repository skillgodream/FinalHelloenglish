import * as llamaService from '../llamaService';
import * as geminiService from '../geminiService';
import * as sheekoEngine from '../sheekoEngine';
import {
  CanonicalMeaning,
  ConversationAction,
  ConversationMode,
  ConversationOrchestrationInput,
  ConversationOrchestrationResult,
  ConversationTurnMessage,
} from './types';
import { PolicyDecision, selectContextualNextQuestion } from './policyEngine';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 2800;

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

function recordSuccess(health: ProviderHealth) {
  health.consecutiveFailures = 0;
  health.isOpen = false;
}

function recordFailure(health: ProviderHealth, providerName: string, error: any) {
  health.consecutiveFailures += 1;
  health.lastFailureTime = Date.now();
  if (health.consecutiveFailures >= 3) {
    health.isOpen = true;
    console.warn(`[CircuitBreaker] ${providerName} opened after ${health.consecutiveFailures} consecutive failures.`);
  }
}

export function getCircuitStatus() {
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
  };
}

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

/**
 * Deterministic Local Sheeko Fallback Generator
 * Guaranteed zero-lag, no-cloud fallback that executes all policies.
 */
export function generateLocalFallbackResponse(params: {
  canonicalMeaning: CanonicalMeaning;
  decision: PolicyDecision;
  exchangeCount: number;
  mode: ConversationMode;
  context?: Record<string, any>;
  history: ConversationTurnMessage[];
}): ConversationOrchestrationResult {
  const { canonicalMeaning, decision, exchangeCount, mode, context, history } = params;
  const { rawInput, detectedLanguage, intendedMeaning } = canonicalMeaning;
  const cleanInput = rawInput.trim();

  // Call Sheeko parser & synthesizer to support deterministic grounding and test hooks
  const sheekoParsed = sheekoEngine.parseLearnerStoryToMeaningRepresentation(cleanInput);
  let normalizedEnglishModel = canonicalMeaning.normalizedEnglishModel;
  
  if (!normalizedEnglishModel || normalizedEnglishModel === cleanInput) {
    const synthesized = sheekoEngine.synthesizeNaturalEnglishStory({
      rawStatement: cleanInput,
      activities: sheekoParsed.activities,
      emotions: [],
      knownFacts: canonicalMeaning.relevantFacts,
      learnerAnswers: [cleanInput],
    });
    if (synthesized) {
      normalizedEnglishModel = synthesized;
    }
  }

  let naturalResponse = "";
  let nextQuestion = "";

  if (!cleanInput || /^(hi|hello|hey|namaste)[.!]?$/i.test(cleanInput)) {
    return {
      action: 'ACCEPT_AND_PROBE',
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
      canonicalMeaning,
      providerUsed: 'sheeko_local',
      responseTimeMs: 0,
    };
  }

  // Handle based on the Policy Action
  switch (decision.action) {
    case 'ENCOURAGE_AND_MODEL': {
      // Model English and ask to try once. Stop & Wait enforced.
      if (detectedLanguage === 'hindi' || detectedLanguage === 'hinglish') {
        naturalResponse = `Achha! 😊 English mein aap bol sakte ho, "${normalizedEnglishModel}". Aap ek baar English mein try karo.`;
      } else {
        naturalResponse = `Very good effort! 😊 In English you can say: "${normalizedEnglishModel}". Try saying it once!`;
      }
      nextQuestion = ""; // Stop & Wait
      break;
    }
    case 'ACCEPT_REPEAT_AND_PROBE': {
      // Learner attempted repeat! No endless loop.
      if (canonicalMeaning.isUnderstandable) {
        naturalResponse = "Arey bahut acha! 😊 You said it nicely!";
      } else {
        naturalResponse = `Arey bahut acha try kiya! 😊 Ek baar pura sentence dhyan mein rakhna: "${normalizedEnglishModel}".`;
      }
      nextQuestion = selectContextualNextQuestion({
        canonicalMeaning,
        history,
        exchangeCount,
        mode,
        context,
      });
      break;
    }
    case 'ACCEPT_AND_PROBE':
    default: {
      // Good English or acceptable communication
      if (cleanInput.split(/\s+/).length <= 2) {
        naturalResponse = "Arey wah, very nice! 😊";
      } else {
        naturalResponse = "That's great! 😊 I understand you completely.";
      }
      nextQuestion = selectContextualNextQuestion({
        canonicalMeaning,
        history,
        exchangeCount,
        mode,
        context,
      });
      break;
    }
  }

  return {
    action: decision.action,
    understoodMeaning: intendedMeaning,
    naturalResponse,
    nextQuestion: decision.awaitingEnglishRetry ? "" : nextQuestion,
    subtleRecast: normalizedEnglishModel,
    englishModel: normalizedEnglishModel,
    awaitingEnglishRetry: decision.awaitingEnglishRetry,
    learnerComfortLanguage: detectedLanguage === 'hindi' ? 'hindi' : (detectedLanguage === 'hinglish' ? 'hinglish' : 'english'),
    newFacts: canonicalMeaning.relevantFacts,
    topic: canonicalMeaning.action || "Daily Life",
    conversationDepth: exchangeCount,
    needsClarification: false,
    shouldEnd: exchangeCount >= 12,
    canonicalMeaning: {
      ...canonicalMeaning,
      normalizedEnglishModel,
    },
    providerUsed: 'sheeko_local',
    responseTimeMs: 0,
  };
}

/**
 * Executes LLM Provider with Engine Authority
 * The engine dictates the decision, action, and Stop & Wait state.
 * The provider generates natural Indian English conversational wording.
 */
export async function generateConversationalResponse(params: {
  input: ConversationOrchestrationInput;
  canonicalMeaning: CanonicalMeaning;
  decision: PolicyDecision;
}): Promise<ConversationOrchestrationResult> {
  const startTime = Date.now();
  const { input, canonicalMeaning, decision } = params;
  const { learnerMessage, history, exchangeCount, mode = 'buddy', context } = input;
  const cleanMsg = learnerMessage.trim();

  // If empty input or greeting, return immediately
  if (!cleanMsg || /^(hi|hello|hey|namaste)[.!]?$/i.test(cleanMsg)) {
    return generateLocalFallbackResponse({
      canonicalMeaning,
      decision,
      exchangeCount,
      mode,
      context,
      history,
    });
  }

  const plannedNextQuestion = decision.awaitingEnglishRetry
    ? ""
    : selectContextualNextQuestion({
        canonicalMeaning,
        history,
        exchangeCount,
        mode,
        context,
      });

  const promptDirective = `You are a warm, supportive Indian conversational English companion ("Buddy").
The Conversation Engine has already analyzed the learner and made the authoritative decision:
- Learner Input: "${cleanMsg}"
- Learner Intended Meaning: "${canonicalMeaning.intendedMeaning}"
- Evaluated English Model: "${canonicalMeaning.normalizedEnglishModel}"
- Evaluated Quality Score: ${canonicalMeaning.communicationQualityScore}% (Understandable: ${canonicalMeaning.isUnderstandable})
- Decided Action: ${decision.action}
- Awaiting Repeat Retry: ${decision.awaitingEnglishRetry}

YOUR RULES FOR THIS TURN:
1. Speak warmly like a real Indian conversation partner (natural conversational Hinglish/English).
2. Action "${decision.action}":
   - If "ACCEPT_AND_PROBE": Acknowledge what the learner said warmly ("Arey wah, good!", "That's great!"), and ask the next question: "${plannedNextQuestion}".
   - If "ENCOURAGE_AND_MODEL": Understand their meaning warmly, provide the English model ("Try saying that in English: ${canonicalMeaning.normalizedEnglishModel}"), encourage them to try once. CRITICAL: "nextQuestion" MUST be an empty string "". Do not ask another question yet!
   - If "ACCEPT_REPEAT_AND_PROBE": Learner made their repeat attempt! Acknowledge their effort warmly ("Arey bahut acha!", "Good effort!"). DO NOT loop correction! Ask the next question: "${plannedNextQuestion}".
3. Output ONLY valid JSON matching this schema:
{
  "naturalResponse": "string - your warm response to the learner",
  "nextQuestion": "string - the single follow-up question, or STRICTLY empty string \"\" if awaitingEnglishRetry is true",
  "subtleRecast": "string - the model English sentence: ${canonicalMeaning.normalizedEnglishModel}",
  "understoodMeaning": "string - clear description of learner's intended meaning"
}`;

  // ==========================================
  // LEVEL 1: Primary LLM (Groq / Llama 3.1)
  // Calls llamaService.generateResponse to enable provider abstraction & test mocking
  // ==========================================
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey && groqKey.trim() && checkCircuit(groqHealth)) {
    try {
      const llamaOutput = await Promise.race([
        llamaService.generateResponse({
          prompt: promptDirective,
          learnerMessage: cleanMsg,
          history,
          exchangeCount,
        }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Groq timeout")), REQUEST_TIMEOUT_MS)),
      ]);

      if (llamaOutput) {
        recordSuccess(groqHealth);

        // Enforce Server-Side Policy Invariants on provider output
        const isAwaiting = decision.awaitingEnglishRetry;
        const enforcedNextQuestion = isAwaiting ? "" : (llamaOutput.nextQuestion || plannedNextQuestion || "").trim();
        const modelToUse = (canonicalMeaning.normalizedEnglishModel || llamaOutput.englishModel || llamaOutput.subtleRecast || "").trim();

        let finalNaturalResponse = (llamaOutput.naturalResponse || "I understand you completely 😊").trim();
        if (decision.action === 'ENCOURAGE_AND_MODEL') {
          if (!finalNaturalResponse.toLowerCase().includes('english') && !finalNaturalResponse.toLowerCase().includes('try')) {
            finalNaturalResponse = `Achha! 😊 English mein aap bol sakte ho, "${modelToUse}". Aap ek baar English mein try karo.`;
          }
        }

        return {
          action: decision.action,
          understoodMeaning: llamaOutput.understoodMeaning || llamaOutput.meaning || canonicalMeaning.intendedMeaning,
          naturalResponse: finalNaturalResponse,
          nextQuestion: enforcedNextQuestion,
          subtleRecast: modelToUse,
          englishModel: modelToUse,
          awaitingEnglishRetry: isAwaiting,
          learnerComfortLanguage: canonicalMeaning.detectedLanguage === 'hindi' ? 'hindi' : (canonicalMeaning.detectedLanguage === 'hinglish' ? 'hinglish' : 'english'),
          newFacts: canonicalMeaning.relevantFacts,
          topic: canonicalMeaning.action || "Daily Routine",
          conversationDepth: exchangeCount,
          needsClarification: false,
          shouldEnd: exchangeCount >= 12,
          canonicalMeaning: {
            ...canonicalMeaning,
            normalizedEnglishModel: modelToUse,
          },
          providerUsed: 'groq',
          responseTimeMs: Date.now() - startTime,
        };
      }
    } catch (err: any) {
      recordFailure(groqHealth, "Groq", err);
      console.warn(`[Conversation Engine] Groq failed (${err?.message || err}), falling back to Gemini...`);
    }
  }

  // ==========================================
  // LEVEL 2: Secondary LLM (Gemini Flash)
  // Calls geminiService.generateResponse to enable provider abstraction & test mocking
  // ==========================================
  if (checkCircuit(geminiHealth)) {
    try {
      const geminiOutput = await Promise.race([
        geminiService.generateResponse({
          prompt: promptDirective,
          learnerMessage: cleanMsg,
          history,
          exchangeCount,
        }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Gemini timeout")), REQUEST_TIMEOUT_MS)),
      ]);

      if (geminiOutput) {
        recordSuccess(geminiHealth);

        const isAwaiting = decision.awaitingEnglishRetry;
        const enforcedNextQuestion = isAwaiting ? "" : (geminiOutput.nextQuestion || plannedNextQuestion || "").trim();
        const modelToUse = (canonicalMeaning.normalizedEnglishModel || geminiOutput.englishModel || geminiOutput.subtleRecast || "").trim();

        let finalNaturalResponse = (geminiOutput.naturalResponse || "Achha, samajh gaya 😊").trim();
        if (decision.action === 'ENCOURAGE_AND_MODEL') {
          if (!finalNaturalResponse.toLowerCase().includes('english') && !finalNaturalResponse.toLowerCase().includes('try')) {
            finalNaturalResponse = `Achha! 😊 English mein aap bol sakte ho, "${modelToUse}". Aap ek baar English mein try karo.`;
          }
        }

        return {
          action: decision.action,
          understoodMeaning: geminiOutput.understoodMeaning || geminiOutput.meaning || canonicalMeaning.intendedMeaning,
          naturalResponse: finalNaturalResponse,
          nextQuestion: enforcedNextQuestion,
          subtleRecast: modelToUse,
          englishModel: modelToUse,
          awaitingEnglishRetry: isAwaiting,
          learnerComfortLanguage: canonicalMeaning.detectedLanguage === 'hindi' ? 'hindi' : (canonicalMeaning.detectedLanguage === 'hinglish' ? 'hinglish' : 'english'),
          newFacts: canonicalMeaning.relevantFacts,
          topic: canonicalMeaning.action || "Daily Routine",
          conversationDepth: exchangeCount,
          needsClarification: false,
          shouldEnd: exchangeCount >= 12,
          canonicalMeaning: {
            ...canonicalMeaning,
            normalizedEnglishModel: modelToUse,
          },
          providerUsed: 'gemini',
          responseTimeMs: Date.now() - startTime,
        };
      }
    } catch (err: any) {
      recordFailure(geminiHealth, "Gemini", err);
      console.warn(`[Conversation Engine] Gemini failed (${err?.message || err}), falling back to Sheeko Local...`);
    }
  }

  // ==========================================
  // LEVEL 3: Deterministic Sheeko Local Fallback (100% Reliable, Zero AI Needed)
  // ==========================================
  const fallbackResult = generateLocalFallbackResponse({
    canonicalMeaning,
    decision,
    exchangeCount,
    mode,
    context,
    history,
  });
  fallbackResult.responseTimeMs = Date.now() - startTime;
  return fallbackResult;
}
