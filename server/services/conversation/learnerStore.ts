import {
  EvidenceV2,
  EvaluationResultV2,
  NextActionV2,
  OutcomeV2,
  LearnerStateV2,
  SkillStateV2,
  LearnerErrorV2,
  GroundedFactV2,
} from './typesV2';
import { CanonicalMeaning, ConversationMode, ConversationOrchestrationResult } from './types';

/**
 * In-Memory Durable Learner Intelligence Store & Idempotency Manager
 * 
 * Provides:
 * 1. Server-authoritative idempotency check (clientTurnId / turn deduplication)
 * 2. Immutable EvidenceV2 recording
 * 3. Evidence-driven SkillStateV2 and LearnerErrorV2 updates (NO unearned mastery)
 * 4. Grounded fact management with provenance
 */

const evidenceStore = new Map<string, EvidenceV2>();
const turnCache = new Map<string, ConversationOrchestrationResult>();
const learnerStore = new Map<string, LearnerStateV2>();

/**
 * Get or initialize default LearnerStateV2
 */
export function getOrCreateLearnerState(learnerId: string = 'default_learner'): LearnerStateV2 {
  if (learnerStore.has(learnerId)) {
    return learnerStore.get(learnerId)!;
  }

  const defaultState: LearnerStateV2 = {
    learnerId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    languageProfile: {
      primaryNativeLanguage: 'Hindi',
      comfortLanguage: 'hinglish',
      overallCefrLevel: 'A2',
    },
    skills: {
      'SKILL_PAST_TENSE': {
        skillId: 'SKILL_PAST_TENSE',
        category: 'TENSE_ASPECT',
        status: 'DEVELOPING',
        evidenceCounters: {
          totalAttempts: 0,
          successfulDemonstrations: 0,
          consecutiveCleanStreak: 0,
          sessionsDemonstrated: 0,
        },
        lastObservedAt: new Date().toISOString(),
        associatedErrorIds: ['ERR_PAST_TENSE_WITH_PAST_MARKER'],
      },
      'SKILL_WORD_ORDER': {
        skillId: 'SKILL_WORD_ORDER',
        category: 'SENTENCE_STRUCTURE',
        status: 'DEVELOPING',
        evidenceCounters: {
          totalAttempts: 0,
          successfulDemonstrations: 0,
          consecutiveCleanStreak: 0,
          sessionsDemonstrated: 0,
        },
        lastObservedAt: new Date().toISOString(),
        associatedErrorIds: ['ERR_INVERTED_VERB_SUBJECT'],
      },
    },
    recurringErrors: {},
    durableFacts: [],
  };

  learnerStore.set(learnerId, defaultState);
  return defaultState;
}

/**
 * Check if a turn was already processed (Idempotency Guard)
 */
export function checkIdempotentTurn(clientTurnId?: string): ConversationOrchestrationResult | null {
  if (!clientTurnId) return null;
  return turnCache.get(clientTurnId) || null;
}

/**
 * Record an idempotent turn result in cache
 */
export function recordIdempotentTurn(clientTurnId: string, result: ConversationOrchestrationResult): void {
  if (!clientTurnId) return;
  turnCache.set(clientTurnId, result);
  // Prevent unbounded memory growth
  if (turnCache.size > 2000) {
    const oldestKey = turnCache.keys().next().value;
    if (oldestKey) turnCache.delete(oldestKey);
  }
}

/**
 * Commit immutable EvidenceV2 and update state
 */
export function recordTurnEvidence(params: {
  learnerId?: string;
  sessionId?: string;
  turnNumber: number;
  clientTurnId?: string;
  sourceExperience: ConversationMode | 'drill';
  canonicalMeaning: CanonicalMeaning;
  evaluation: EvaluationResultV2;
  nextAction: NextActionV2;
  wasAwaitingRetry: boolean;
}): { evidence: EvidenceV2; outcome?: OutcomeV2 } {
  const {
    learnerId = 'default_learner',
    sessionId = 'default_session',
    turnNumber,
    clientTurnId,
    sourceExperience,
    canonicalMeaning,
    evaluation,
    nextAction,
    wasAwaitingRetry,
  } = params;

  const evidenceId = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  // 1. Create Immutable Evidence Record
  const evidence: EvidenceV2 = {
    evidenceId,
    learnerId,
    sessionId,
    turnNumber,
    clientTurnId,
    timestamp: now,
    sourceExperience,
    observation: {
      rawInput: canonicalMeaning.rawInput,
      detectedLanguage: canonicalMeaning.detectedLanguage,
      normalizedEnglishModel: canonicalMeaning.normalizedEnglishModel,
      promptOrQuestionPresented: nextAction.enforcedNextQuestion,
      wasUnderScaffolding: wasAwaitingRetry,
    },
    evaluationSnapshot: {
      understandabilityScore: evaluation.understanding.understandabilityScore,
      isUnderstandable: evaluation.understanding.isUnderstandable,
      grammarScore: evaluation.languageQuality.grammarScore,
      detectedErrorCategory: evaluation.languageQuality.syntaxErrorPatterns[0],
      taskFulfilled: evaluation.communication.taskFulfilled,
    },
    provenance: {
      engineVersion: 'V2',
      confidence: evaluation.confidence,
    },
  };

  evidenceStore.set(evidenceId, evidence);

  // 2. Compute Observable Outcome
  let outcome: OutcomeV2 | undefined;
  if (wasAwaitingRetry) {
    const isRetrySuccessful = evaluation.understanding.isUnderstandable;
    outcome = {
      outcomeId: `out_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      priorActionType: 'ENCOURAGE_AND_MODEL',
      observedEvidenceId: evidenceId,
      timestamp: now,
      resultType: isRetrySuccessful ? 'RETRY_SUCCEEDED' : 'RETRY_FAILED_ADVANCED',
    };
  } else if (sourceExperience === 'rock_and_roll') {
    outcome = {
      outcomeId: `out_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      observedEvidenceId: evidenceId,
      timestamp: now,
      resultType: evaluation.experiencePerformance.passed ? 'SCENARIO_CONDITION_HANDLED' : 'SCENARIO_CONDITION_FAILED',
    };
  }

  // 3. Update Durable Learner State
  const state = getOrCreateLearnerState(learnerId);
  state.updatedAt = now;

  // Update Error Memory if syntax errors detected
  for (const errorPattern of evaluation.languageQuality.syntaxErrorPatterns) {
    if (!state.recurringErrors[errorPattern]) {
      state.recurringErrors[errorPattern] = {
        errorId: errorPattern,
        category: errorPattern.includes('PAST') ? 'VERB_TENSE' : 'GENERAL_SYNTAX',
        patternDescription: `Observed error pattern: ${errorPattern}`,
        status: 'ACTIVE',
        occurrenceCount: 1,
        firstObservedAt: now,
        lastObservedAt: now,
        resolutionMetrics: {
          consecutiveCleanOpportunities: 0,
          recastsAdopted: 0,
          drillSuccessCount: 0,
        },
        drillPriorityScore: 50,
      };
    } else {
      const err = state.recurringErrors[errorPattern];
      err.occurrenceCount += 1;
      err.lastObservedAt = now;
      if (err.occurrenceCount >= 3) {
        err.status = 'RECURRING';
        err.drillPriorityScore = Math.min(100, err.drillPriorityScore + 20);
      }
    }
  }

  // 4. Update Skill Counters (Evidence-Driven & Feature-Gated Only)
  // Step 4.2 Semantic Rule:
  // Generic understandability must NOT advance unrelated skills.
  // A skill receives positive demonstration evidence ONLY when:
  // 1. The skill is relevant to the turn (via targetSkillId directive OR positive feature match)
  // 2. The relevant feature is positively identified in evaluation.languageQuality.featureMatches
  // 3. No syntax errors associated with that skill were detected

  const targetSkillId = nextAction.directives.targetSkillId;
  const featureMatches = evaluation.languageQuality.featureMatches || [];
  const syntaxErrors = evaluation.languageQuality.syntaxErrorPatterns || [];

  // Evaluate Past Tense Skill:
  const isPastTenseTested = targetSkillId === 'SKILL_PAST_TENSE' ||
    featureMatches.includes('FEATURE_PAST_TENSE') ||
    syntaxErrors.includes('ERR_PAST_TENSE_WITH_PAST_MARKER');

  if (isPastTenseTested) {
    const pastSkill = state.skills['SKILL_PAST_TENSE'];
    if (pastSkill) {
      pastSkill.evidenceCounters.totalAttempts += 1;
      pastSkill.lastObservedAt = now;

      const isCleanDemonstration = featureMatches.includes('FEATURE_PAST_TENSE') &&
        !syntaxErrors.includes('ERR_PAST_TENSE_WITH_PAST_MARKER') &&
        evaluation.understanding.isUnderstandable;

      if (isCleanDemonstration) {
        pastSkill.evidenceCounters.successfulDemonstrations += 1;
        pastSkill.evidenceCounters.consecutiveCleanStreak += 1;
        if (pastSkill.evidenceCounters.consecutiveCleanStreak >= 5 && pastSkill.status === 'DEVELOPING') {
          pastSkill.status = 'DEMONSTRATED';
        }
      } else {
        pastSkill.evidenceCounters.consecutiveCleanStreak = 0;
      }
    }
  }

  // Evaluate Word Order Skill:
  const isWordOrderTested = targetSkillId === 'SKILL_WORD_ORDER' ||
    syntaxErrors.includes('ERR_INVERTED_VERB_SUBJECT');

  if (isWordOrderTested) {
    const wordOrderSkill = state.skills['SKILL_WORD_ORDER'];
    if (wordOrderSkill) {
      wordOrderSkill.evidenceCounters.totalAttempts += 1;
      wordOrderSkill.lastObservedAt = now;

      const isCleanDemonstration = featureMatches.includes('FEATURE_WORD_ORDER') &&
        !syntaxErrors.includes('ERR_INVERTED_VERB_SUBJECT') &&
        evaluation.understanding.isUnderstandable;

      if (isCleanDemonstration) {
        wordOrderSkill.evidenceCounters.successfulDemonstrations += 1;
        wordOrderSkill.evidenceCounters.consecutiveCleanStreak += 1;
        if (wordOrderSkill.evidenceCounters.consecutiveCleanStreak >= 5 && wordOrderSkill.status === 'DEVELOPING') {
          wordOrderSkill.status = 'DEMONSTRATED';
        }
      } else {
        wordOrderSkill.evidenceCounters.consecutiveCleanStreak = 0;
      }
    }
  }

  // Record Durable Facts if extracted
  if (canonicalMeaning.groundedFacts && canonicalMeaning.groundedFacts.length > 0) {
    for (const factStr of canonicalMeaning.groundedFacts) {
      const exists = state.durableFacts.some((f) => f.statement.toLowerCase() === factStr.toLowerCase());
      if (!exists) {
        state.durableFacts.push({
          factId: `fact_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          statement: factStr,
          category: 'PROFILE',
          isDurable: true,
          confidence: canonicalMeaning.confidence || 0.9,
          firstLearnedAt: now,
          lastConfirmedAt: now,
        });
      }
    }
  }

  return { evidence, outcome };
}
