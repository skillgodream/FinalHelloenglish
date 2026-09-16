import {
  CanonicalMeaning,
  ConversationAction,
  ConversationMode,
  ConversationOrchestrationInput,
  ConversationOrchestrationResult,
  ConversationTurnMessage,
} from './conversation/types';
import { resolveCanonicalMeaning, isGarbledOrIncomprehensible } from './conversation/meaningResolver';
import { evaluateEnglishQuality, evaluateEnglishQualityV2 } from './conversation/englishEvaluator';
import { decideNextConversationAction, decideNextConversationActionV2, selectContextualNextQuestion } from './conversation/policyEngine';
import {
  generateConversationalResponse,
  generateLocalFallbackResponse,
  getCircuitStatus,
} from './conversation/responseGenerator';
import {
  checkIdempotentTurn,
  recordIdempotentTurn,
  recordTurnEvidence,
  getOrCreateLearnerState,
} from './conversation/learnerStore';
import {
  parseLearnerStoryToMeaningRepresentation,
  synthesizeNaturalEnglishStory,
  applySheekoGrammarCorrections,
} from '../../src/data/sheekoEngine';

// Re-export all types
export * from './conversation/types';
export { getOrCreateLearnerState } from './conversation/learnerStore';



/**
 * Health status reporting for diagnostics & health endpoints
 */
export function getProviderHealthStatus() {
  const circuit = getCircuitStatus();
  return {
    groq: circuit.groq,
    gemini: circuit.gemini,
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
    },
  };
}

/**
 * Backward compatibility helper for testing / legacy callers
 */
export function validateAndGroundMeaning(
  rawInput: string,
  modelOutput: any,
  sheekoExtraction: ReturnType<typeof parseLearnerStoryToMeaningRepresentation>
): CanonicalMeaning {
  const meaning = resolveCanonicalMeaning(rawInput, [], sheekoExtraction.activities);
  const finalModel = modelOutput?.subtleRecast || modelOutput?.englishModel || meaning.normalizedEnglishModel;
  return {
    ...meaning,
    normalizedEnglishModel: finalModel,
    normalizedEnglishText: finalModel,
    activities: sheekoExtraction.activities || meaning.activities,
  };
}

/**
 * Backward compatibility helper for local Sheeko fallback
 */
export function buildSheekoBuddyFallback(
  rawInput: string,
  wasAwaitingRetry: boolean,
  exchangeCount: number,
  sheekoExtraction?: any
): ConversationOrchestrationResult {
  const clean = (rawInput || '').trim();
  if (isGarbledOrIncomprehensible(clean)) {
    return {
      action: 'CLARIFY_AND_PROBE',
      understoodMeaning: "Unrecognized or garbled input",
      naturalResponse: "I didn't quite catch that. Could you tell me in simple words? 😊",
      nextQuestion: "",
      subtleRecast: "",
      englishModel: "",
      awaitingEnglishRetry: false,
      learnerComfortLanguage: "english",
      newFacts: [],
      topic: "Clarification",
      conversationDepth: exchangeCount,
      needsClarification: true,
      shouldEnd: false,
      canonicalMeaning: {
        rawInput: clean,
        detectedLanguage: 'unknown',
        intent: 'clarification_needed',
        intendedMeaning: 'Unclear statement',
        action: '',
        object: '',
        people: [],
        time: '',
        place: '',
        relevantFacts: [],
        groundedFacts: [],
        activities: [],
        confidence: 0,
        communicationQualityScore: 0,
        isUnderstandable: false,
        normalizedEnglishModel: '',
        normalizedEnglishText: '',
      },
      providerUsed: 'clarification_fallback',
      responseTimeMs: 0,
    };
  }

  const canonicalMeaning = resolveCanonicalMeaning(rawInput, []);
  const evaluated = evaluateEnglishQuality(canonicalMeaning, wasAwaitingRetry);
  canonicalMeaning.communicationQualityScore = evaluated.communicationQualityScore;
  canonicalMeaning.isUnderstandable = evaluated.isUnderstandable;

  const decision = decideNextConversationAction({
    canonicalMeaning,
    wasAwaitingEnglishRetry: wasAwaitingRetry,
    history: [],
    exchangeCount,
    mode: 'buddy',
  });

  return generateLocalFallbackResponse({
    canonicalMeaning,
    decision,
    exchangeCount,
    mode: 'buddy',
    history: [],
  });
}

/**
 * SINGLE EXECUTION AUTHORITY: orchestrateConversationTurn
 *
 * The core loop executed on every learner turn:
 * LEARNER SPEAKS
 * → SPEAKER LISTENS
 * → SYSTEM UNDERSTANDS (CanonicalMeaning via Sheeko + Context)
 * → SYSTEM EVALUATES THE ENGLISH (Communication quality ~85% rule)
 * → SYSTEM DECIDES WHAT TO DO (PolicyEngine decides the action; NO endless loops)
 * → SPEAKER RESPONDS NATURALLY (Groq -> Gemini -> Sheeko Local)
 * → NEXT QUESTION (Contextual single question; Stop & Wait if awaiting retry)
 */
export async function orchestrateConversationTurn(
  input: ConversationOrchestrationInput
): Promise<ConversationOrchestrationResult> {
  const startTime = Date.now();
  const cleanMsg = (input.learnerMessage || "").trim();
  const exchangeCount = typeof input.exchangeCount === 'number' ? input.exchangeCount : 1;
  const wasAwaitingRetry = Boolean(input.wasAwaitingEnglishRetry);
  const mode = input.mode || 'buddy';
  const clientTurnId = input.context?.clientTurnId;

  // 0. Idempotency Guard (Network replay / duplicate request safety)
  if (clientTurnId) {
    const cachedResult = checkIdempotentTurn(clientTurnId);
    if (cachedResult) {
      return cachedResult;
    }
  }

  if (isGarbledOrIncomprehensible(cleanMsg)) {

    return {
      action: 'CLARIFY_AND_PROBE',
      understoodMeaning: "Unrecognized or garbled input",
      naturalResponse: "I didn't quite catch that. Could you tell me in simple words? 😊",
      nextQuestion: "",
      subtleRecast: "",
      englishModel: "",
      awaitingEnglishRetry: false,
      learnerComfortLanguage: "english",
      newFacts: [],
      topic: "Clarification",
      conversationDepth: exchangeCount,
      needsClarification: true,
      shouldEnd: false,
      canonicalMeaning: {
        rawInput: cleanMsg,
        detectedLanguage: 'unknown',
        intent: 'clarification_needed',
        intendedMeaning: 'Unclear statement',
        action: '',
        object: '',
        people: [],
        time: '',
        place: '',
        relevantFacts: [],
        groundedFacts: [],
        activities: [],
        confidence: 0,
        communicationQualityScore: 0,
        isUnderstandable: false,
        normalizedEnglishModel: '',
        normalizedEnglishText: '',
      },
      providerUsed: 'clarification_fallback',
      responseTimeMs: Date.now() - startTime,
    };
  }

  // 1. WHAT DID THE LEARNER MEAN? (Decoupled from grammar)
  const canonicalMeaning = resolveCanonicalMeaning(cleanMsg, input.history || []);

  // 2. HOW WELL DID THE LEARNER EXPRESS THAT MEANING IN ENGLISH? (~85% Rule)
  const englishEvaluation = evaluateEnglishQuality(canonicalMeaning, wasAwaitingRetry);
  canonicalMeaning.communicationQualityScore = englishEvaluation.communicationQualityScore;
  canonicalMeaning.isUnderstandable = englishEvaluation.isUnderstandable;
  if (englishEvaluation.naturalModelSentence) {
    canonicalMeaning.normalizedEnglishModel = englishEvaluation.naturalModelSentence;
  }

  // Compute structured EvaluationResultV2
  const evaluationV2 = evaluateEnglishQualityV2(canonicalMeaning, wasAwaitingRetry);

  // 3. WHAT SHOULD THE CONVERSATION DO NEXT? (Engine Decides the Action)
  // Strict invariants:
  // - If English >= 85%: ACCEPT_AND_PROBE
  // - If English < 85% or Hindi/Hinglish:
  //   * If not already awaiting retry: ENCOURAGE_AND_MODEL (Stop & Wait, awaitingEnglishRetry = true, nextQuestion = "")
  //   * If was awaiting retry: ACCEPT_REPEAT_AND_PROBE (NO ENDLESS LOOP! Acknowledge effort and advance)
  const decision = decideNextConversationAction({
    canonicalMeaning,
    wasAwaitingEnglishRetry: wasAwaitingRetry,
    history: input.history || [],
    exchangeCount,
    mode,
  });

  const nextActionV2 = decideNextConversationActionV2({
    canonicalMeaning,
    wasAwaitingEnglishRetry: wasAwaitingRetry,
    history: input.history || [],
    exchangeCount,
    mode,
    context: input.context,
  });

  // 4. GENERATE NATURAL CONVERSATIONAL RESPONSE (Frozen 3-tier cascade)
  const result = await generateConversationalResponse({
    input: {
      ...input,
      exchangeCount,
      wasAwaitingEnglishRetry: wasAwaitingRetry,
      mode,
    },
    canonicalMeaning,
    decision,
  });

  // 5. COMMIT IMMUTABLE EVIDENCE V2 & OUTCOME V2 (State Engine)
  const { evidence, outcome } = recordTurnEvidence({
    learnerId: input.context?.learnerId || 'default_learner',
    sessionId: input.context?.sessionId || 'default_session',
    turnNumber: exchangeCount,
    clientTurnId,
    sourceExperience: mode,
    canonicalMeaning,
    evaluation: evaluationV2,
    nextAction: nextActionV2,
    wasAwaitingRetry,
  });

  // Attach V2 metadata onto response result (Backward Compatible Superset)
  result.v2 = {
    nextAction: nextActionV2,
    evidence,
    evaluation: evaluationV2,
    outcome,
  };

  if (clientTurnId) {
    recordIdempotentTurn(clientTurnId, result);
  }

  result.responseTimeMs = Date.now() - startTime;
  return result;
}


/**
 * Mode Adapter: Day Story Exploration (Used by /api/conversation-step)
 * Operates on the SAME unified Conversation Engine.
 */
export async function orchestrateDayStoryTurn(params: {
  dayMap: any;
  selectedTopic: any;
  conversationHistory: any[];
  answeredQuestions: string[];
  knownFacts: string[];
  latestLearnerAnswer?: string;
  isFirstTurnOfTopic?: boolean;
}) {
  const {
    dayMap = {},
    selectedTopic,
    conversationHistory = [],
    answeredQuestions = [],
    knownFacts = [],
    latestLearnerAnswer = "",
    isFirstTurnOfTopic = false,
  } = params;

  const cleanAnswer = (latestLearnerAnswer || "").trim();
  const topicPointer = selectedTopic?.pointer || "your day";
  const turnCount = selectedTopic?.turnCount || 0;

  // Turn 0: Topic Introduction
  if (isFirstTurnOfTopic || !cleanAnswer) {
    const cleanTopic = topicPointer.replace(/^["']|["']$/g, '');
    const firstProbe = `Can you tell me more about "${cleanTopic}" and how that experience went?`;

    return {
      rephrase: `You mentioned: "${cleanTopic}".`,
      probeQuestion: firstProbe,
      probeDirection: 'WHAT',
      topicIsCompleted: false,
      updatedDayMap: dayMap,
      deepAnalysis: {
        mainMeaning: `Starting focus on ${cleanTopic}`,
        intent: 'Initial topic exploration',
        sentiment: 'Engaged',
        fluencyScore: 85,
        clarityScore: 88,
        detectedPatterns: ['Action phrase initiation', 'Topic introduction'],
        keyInsights: ['Clear communication intent', 'Ready for conversational elaboration'],
        recommendedPhrases: ['First of all', 'At that time', 'When I arrived'],
      },
      understoodMeaning: `Starting focus on ${cleanTopic}`,
      response: `You mentioned: "${cleanTopic}".`,
      conversationalResponse: `You mentioned: "${cleanTopic}".`,
    };
  }

  // Turn 1+: Process with ONE Conversation Engine
  const historyConverted: ConversationTurnMessage[] = conversationHistory.map((t: any) => ({
    sender: t.speaker === 'learner' ? 'learner' : 'buddy',
    text: t.text || t.rawLearnerText || '',
  }));

  const orchestration = await orchestrateConversationTurn({
    history: historyConverted,
    learnerMessage: cleanAnswer,
    exchangeCount: turnCount + 1,
    wasAwaitingEnglishRetry: false,
    mode: 'day_story',
    context: { selectedTopic, dayMap, answeredQuestions },
  });

  // Accumulate facts and activities in dayMap
  const updatedDayMap = { ...dayMap };
  const newFacts: string[] = [];

  if (cleanAnswer && !updatedDayMap.knownFacts?.includes(`Learner shared: "${cleanAnswer}"`)) {
    newFacts.push(`Learner shared: "${cleanAnswer}"`);
  }
  if (orchestration.newFacts && orchestration.newFacts.length > 0) {
    newFacts.push(...orchestration.newFacts);
  }
  if (newFacts.length > 0) {
    updatedDayMap.knownFacts = Array.from(new Set([...(updatedDayMap.knownFacts || []), ...newFacts]));
  }

  const modelEnglish = orchestration.canonicalMeaning.normalizedEnglishModel || cleanAnswer;
  if (!updatedDayMap.activities?.includes(modelEnglish)) {
    updatedDayMap.activities = [...(updatedDayMap.activities || []), modelEnglish];
  }

  // Synthesize accumulated Day Story
  updatedDayMap.naturalEnglishStory = synthesizeNaturalEnglishStory({
    rawStatement: updatedDayMap.rawStatement || cleanAnswer,
    activities: updatedDayMap.activities || [],
    emotions: updatedDayMap.emotions || [],
    knownFacts: updatedDayMap.knownFacts || [],
    learnerAnswers: cleanAnswer ? [cleanAnswer] : [],
  });

  const isCompleted = turnCount + 1 >= 5;
  const probeQuestion = orchestration.nextQuestion || "What happened after that?";

  return {
    rephrase: `So, ${modelEnglish.charAt(0).toLowerCase() + modelEnglish.slice(1)}.`,
    probeQuestion,
    probeDirection: 'RESULT',
    topicIsCompleted: isCompleted,
    completionSummary: isCompleted
      ? `Wonderful job explaining "${topicPointer}"! You clearly described the situation, the actions you took, and how it was resolved.`
      : undefined,
    updatedDayMap,
    deepAnalysis: {
      mainMeaning: orchestration.understoodMeaning,
      intent: orchestration.canonicalMeaning.intent,
      sentiment: "Constructive & Engaged",
      fluencyScore: orchestration.canonicalMeaning.communicationQualityScore,
      clarityScore: Math.min(98, 85 + Math.round(orchestration.canonicalMeaning.communicationQualityScore * 0.12)),
      detectedPatterns: ["Semantic understanding", "Natural rephrasing"],
      keyInsights: [orchestration.understoodMeaning],
      recommendedPhrases: ["After that", "As a result", "Next"],
    },
    understoodMeaning: orchestration.understoodMeaning,
    response: `So, ${modelEnglish.charAt(0).toLowerCase() + modelEnglish.slice(1)}.`,
    conversationalResponse: orchestration.naturalResponse,
  };
}

/**
 * Mode Adapter: Rock & Roll Workplace Challenge (Used by /api/rock-and-roll/chat)
 * Operates on the SAME unified Conversation Engine.
 */
export async function orchestrateRockAndRollTurn(params: {
  challenge: any;
  history: any[];
  learnerMessage: string;
  turnCount: number;
}) {
  const { challenge, history = [], learnerMessage = "", turnCount = 1 } = params;
  const cleanMsg = learnerMessage.trim();

  const historyConverted: ConversationTurnMessage[] = history.map((t: any) => ({
    sender: t.sender === 'learner' ? 'learner' : 'customer',
    text: t.text || '',
  }));

  const orchestration = await orchestrateConversationTurn({
    history: historyConverted,
    learnerMessage: cleanMsg,
    exchangeCount: turnCount,
    wasAwaitingEnglishRetry: false,
    mode: 'rock_and_roll',
    context: { challenge },
  });

  const isGoodCommunication = orchestration.canonicalMeaning.isUnderstandable;
  const resolutionReached = turnCount >= 6 && isGoodCommunication;

  let customerMood: 'angry' | 'frustrated' | 'neutral' | 'satisfied' | 'happy' = 'neutral';
  if (resolutionReached) {
    customerMood = 'satisfied';
  } else if (isGoodCommunication) {
    customerMood = 'neutral';
  } else {
    customerMood = 'frustrated';
  }

  const customerReply = orchestration.naturalResponse || `I understand what you mean. What can we do next to fix this?`;
  const coachingFeedback = {
    type: isGoodCommunication ? ('positive' as const) : ('tip' as const),
    message: isGoodCommunication
      ? 'Good clear communication and problem solving!'
      : `Try saying: "${orchestration.canonicalMeaning.normalizedEnglishModel}". This sounds more professional.`,
  };

  return {
    customerReply,
    customerMood,
    coachingFeedback,
    resolutionReached,
    orchestrationResult: orchestration,
  };
}
