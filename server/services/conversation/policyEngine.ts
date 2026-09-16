import { CanonicalMeaning, ConversationAction, ConversationMode, ConversationTurnMessage } from './types';
import { NextActionV2 } from './typesV2';

export interface PolicyDecision {
  action: ConversationAction;
  awaitingEnglishRetry: boolean;
  nextQuestionPromptDirective: 'GENERATE_NEXT_QUESTION' | 'EMPTY_FOR_RETRY';
  acknowledgementType: 'NATURAL_ACCEPT' | 'MODEL_AND_ENCOURAGE' | 'REPEAT_ACKNOWLEDGE_AND_MOVE_FORWARD' | 'CLARIFY';
  guidanceText?: string;
}


/**
 * THE SINGLE CONVERSATION POLICY AUTHORITY
 *
 * Rules:
 * 1. Understands meaning first, English quality second.
 * 2. If English >= 85%: ACCEPT_AND_PROBE.
 * 3. If English < 85% or Hindi/Hinglish:
 *    - If wasAwaitingEnglishRetry is false: ENCOURAGE_AND_MODEL -> Stop & Wait (awaitingEnglishRetry = true, nextQuestion = "").
 *    - If wasAwaitingEnglishRetry is true (learner attempted repeat):
 *      MANDATORY: NO ENDLESS LOOP.
 *      Even if still imperfect: ACCEPT_REPEAT_AND_PROBE -> move forward with next question!
 */
export function decideNextConversationAction(params: {
  canonicalMeaning: CanonicalMeaning;
  wasAwaitingEnglishRetry: boolean;
  history: ConversationTurnMessage[];
  exchangeCount: number;
  mode: ConversationMode;
}): PolicyDecision {
  const { canonicalMeaning, wasAwaitingEnglishRetry, history, exchangeCount } = params;
  const { isUnderstandable, detectedLanguage, rawInput, normalizedEnglishModel } = canonicalMeaning;

  // 1. If learner just attempted a repeat (wasAwaitingEnglishRetry was true)
  if (wasAwaitingEnglishRetry) {
    // CORRECTION MUST NOT LOOP!
    // Acknowledge the attempt warmly and move the conversation forward.
    return {
      action: 'ACCEPT_REPEAT_AND_PROBE',
      awaitingEnglishRetry: false,
      nextQuestionPromptDirective: 'GENERATE_NEXT_QUESTION',
      acknowledgementType: 'REPEAT_ACKNOWLEDGE_AND_MOVE_FORWARD',
      guidanceText: isUnderstandable
        ? 'Very good! You said it nicely!'
        : `Acha try kiya! Now let's keep going.`,
    };
  }

  // 2. Initial greeting or empty input
  if (!rawInput.trim() || /^(hi|hello|namaste|hey)[.!]?$/i.test(rawInput.trim())) {
    return {
      action: 'ACCEPT_AND_PROBE',
      awaitingEnglishRetry: false,
      nextQuestionPromptDirective: 'GENERATE_NEXT_QUESTION',
      acknowledgementType: 'NATURAL_ACCEPT',
      guidanceText: 'Friendly greeting',
    };
  }

  // 3. If English is sufficiently understandable / natural (approx 85% or better)
  if (isUnderstandable) {
    return {
      action: 'ACCEPT_AND_PROBE',
      awaitingEnglishRetry: false,
      nextQuestionPromptDirective: 'GENERATE_NEXT_QUESTION',
      acknowledgementType: 'NATURAL_ACCEPT',
    };
  }

  // 4. If English is < 85% or Hindi/Hinglish:
  // Give natural model sentence, ask learner to try, and STOP & WAIT.
  return {
    action: 'ENCOURAGE_AND_MODEL',
    awaitingEnglishRetry: true,
    nextQuestionPromptDirective: 'EMPTY_FOR_RETRY',
    acknowledgementType: 'MODEL_AND_ENCOURAGE',
    guidanceText: `Encourage learner in warm Hinglish, present English model: "${normalizedEnglishModel}", and ask learner to try saying it.`,
  };
}

/**
 * Deterministic Question Planner: Ensures ONE short question at a time using context.
 */
export function selectContextualNextQuestion(params: {
  canonicalMeaning: CanonicalMeaning;
  history: ConversationTurnMessage[];
  exchangeCount: number;
  mode: ConversationMode;
  context?: Record<string, any>;
}): string {
  const { canonicalMeaning, exchangeCount, mode, context } = params;
  const lower = canonicalMeaning.rawInput.toLowerCase();
  const meaningLower = canonicalMeaning.intendedMeaning.toLowerCase();

  // Mode: Rock & Roll (Workplace Challenge)
  if (mode === 'rock_and_roll') {
    if (context?.challenge?.mission) {
      return `How do you plan to handle this for the customer?`;
    }
    return `What is your immediate next action to resolve this?`;
  }

  // Mode: Day Story (Exploring day topics)
  if (mode === 'day_story') {
    const topic = context?.selectedTopic?.pointer || 'your day';
    if (exchangeCount >= 5) {
      return `What was the most rewarding part of that experience before your day ended?`;
    }
    if (lower.includes('work') || lower.includes('office') || lower.includes('bus') || lower.includes('travel')) {
      return `How did that turn out, and what did you do next?`;
    }
    return `What happened after that?`;
  }

  // Mode: Buddy (Everyday friendly companion)
  if (exchangeCount >= 8) {
    return "It was wonderful chatting with you! Would you like to review what we practiced today?";
  }

  if (meaningLower.includes('food') || meaningLower.includes('eat') || meaningLower.includes('ate') || lower.includes('rice') || lower.includes('khana')) {
    if (lower.includes('rice') || lower.includes('chawal') || lower.includes('roti') || lower.includes('khana')) {
      return "So, what did you eat with it?";
    }
    return "So, what did you eat for your meal?";
  }

  if (meaningLower.includes('market') || meaningLower.includes('shopping') || lower.includes('kharida')) {
    return "What else did you buy at the market?";
  }

  if (meaningLower.includes('office') || meaningLower.includes('work') || meaningLower.includes('job')) {
    return "How did your work go today?";
  }

  if (meaningLower.includes('tired') || meaningLower.includes('sleep') || meaningLower.includes('rest')) {
    return "Did you get time to take some rest?";
  }

  return "Tell me, what else did you do today?";
}

/**
 * ENGINE V2 DECISION AUTHORITY BRIDGE
 * Emits the canonical NextActionV2 object, strictly maintaining single-brain authority.
 */
export function decideNextConversationActionV2(params: {
  canonicalMeaning: CanonicalMeaning;
  wasAwaitingEnglishRetry: boolean;
  history: ConversationTurnMessage[];
  exchangeCount: number;
  mode: ConversationMode;
  context?: Record<string, any>;
}): NextActionV2 {
  const v1 = decideNextConversationAction(params);
  const plannedQuestion = v1.awaitingEnglishRetry
    ? ""
    : selectContextualNextQuestion({
        canonicalMeaning: params.canonicalMeaning,
        history: params.history,
        exchangeCount: params.exchangeCount,
        mode: params.mode,
        context: params.context,
      });

  let tone: 'warm_supportive' | 'hinglish_scaffolding' | 'customer_persona' = 'warm_supportive';
  if (params.mode === 'rock_and_roll') {
    tone = 'customer_persona';
  } else if (v1.awaitingEnglishRetry) {
    tone = 'hinglish_scaffolding';
  }

  let ruleApplied = 'STANDARD_ACCEPT';
  if (params.wasAwaitingEnglishRetry) {
    ruleApplied = 'RETRY_ACKNOWLEDGE_NO_LOOP';
  } else if (v1.awaitingEnglishRetry) {
    ruleApplied = 'STOP_AND_WAIT_MODEL_ENGLISH';
  }

  return {
    actionType: v1.action,
    awaitingEnglishRetry: v1.awaitingEnglishRetry,
    enforcedNextQuestion: v1.awaitingEnglishRetry ? "" : plannedQuestion,
    englishModelSentence: params.canonicalMeaning.normalizedEnglishModel || "",
    nextQuestionPromptDirective: v1.nextQuestionPromptDirective,
    acknowledgementType: v1.acknowledgementType,
    guidanceText: v1.guidanceText,
    rationale: {
      primaryReason: v1.guidanceText || `Action ${v1.action} triggered by language/quality evaluation.`,
      ruleApplied,
      confidence: params.canonicalMeaning.confidence || 0.85,
    },
    directives: {
      conversationalTone: tone,
      targetSkillId: params.context?.targetSkillId,
      targetErrorCategory: params.context?.targetErrorCategory,
    },
  };
}

