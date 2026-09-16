import {
  CanonicalMeaning,
  ConversationAction,
  ConversationMode,
  ConversationTurnMessage,
} from './types';

/**
 * ============================================================================
 * ENGINE V2 CORE CONTRACTS & IMMUTABLE DATA STRUCTURES
 * ============================================================================
 * 
 * Strict Architecture Separation:
 * 1. OBSERVATION: EvidenceV2 (What was observed from the learner)
 * 2. EVALUATION: EvaluationResultV2 (Linguistic & communicative appraisal)
 * 3. DECISION: NextActionV2 (Authoritative Next Step from policyEngine.ts)
 * 4. OUTCOME: OutcomeV2 (Observable verification of previous intervention)
 * 5. DURABLE STATE: LearnerStateV2, SkillStateV2, LearnerErrorV2, GroundedFactV2
 */

// ----------------------------------------------------------------------------
// 1. EVIDENCE MODEL (Immutable Observation Log)
// ----------------------------------------------------------------------------
export interface EvidenceV2 {
  evidenceId: string;
  learnerId: string;
  sessionId: string;
  turnNumber: number;
  clientTurnId?: string;
  timestamp: string;
  sourceExperience: ConversationMode | 'drill';

  observation: {
    rawInput: string;
    detectedLanguage: 'hindi' | 'hinglish' | 'broken_english' | 'english' | 'unknown';
    normalizedEnglishModel: string;
    promptOrQuestionPresented: string;
    wasUnderScaffolding: boolean;
  };

  evaluationSnapshot: {
    understandabilityScore: number; // 0 to 100
    isUnderstandable: boolean;      // ~85% threshold
    grammarScore: number;           // 0 to 100
    detectedErrorCategory?: string;
    taskFulfilled: boolean;
  };

  provenance: {
    engineVersion: 'V2';
    confidence: number;
  };
}

// ----------------------------------------------------------------------------
// 2. EVALUATION MODEL (Diagnostic Linguistic & Domain Appraisal)
// ----------------------------------------------------------------------------
export interface EvaluationResultV2 {
  understanding: {
    intendedMeaning: string;
    isUnderstandable: boolean;
    understandabilityScore: number;
    detectedLanguage: 'hindi' | 'hinglish' | 'broken_english' | 'english' | 'unknown';
  };
  communication: {
    taskFulfilled: boolean;
    groundedFactsExtracted: string[];
  };
  languageQuality: {
    grammarScore: number;
    syntaxErrorPatterns: string[];
    subtleRecastModel: string;
    featureMatches?: string[];
  };
  experiencePerformance: {
    passed: boolean;
    domainScore: number;
    coachingFeedback: string;
  };
  confidence: number;
}

// ----------------------------------------------------------------------------
// 3. NEXT ACTION MODEL (Single Authoritative Decision from policyEngine)
// ----------------------------------------------------------------------------
export type ActionTypeV2 =
  | 'ACCEPT_AND_PROBE'
  | 'ENCOURAGE_AND_MODEL'
  | 'ACCEPT_REPEAT_AND_PROBE'
  | 'CLARIFY_AND_PROBE'
  | 'OFFER_DRILL_INTERVENTION'
  | 'CUSTOMER_NEXT_CONDITION'
  | 'CUSTOMER_RECOVERY_BRANCH'
  | 'RESOLVE_SCENARIO'
  | 'END_SESSION_SUMMARY';

export interface NextActionV2 {
  actionType: ActionTypeV2;
  awaitingEnglishRetry: boolean;
  enforcedNextQuestion: string; // Strictly "" when awaitingEnglishRetry === true
  englishModelSentence: string;
  nextQuestionPromptDirective: 'GENERATE_NEXT_QUESTION' | 'EMPTY_FOR_RETRY';
  acknowledgementType: 'NATURAL_ACCEPT' | 'MODEL_AND_ENCOURAGE' | 'REPEAT_ACKNOWLEDGE_AND_MOVE_FORWARD' | 'CLARIFY';
  guidanceText?: string;
  
  rationale: {
    primaryReason: string;
    ruleApplied: string;
    confidence: number;
  };

  directives: {
    conversationalTone: 'warm_supportive' | 'hinglish_scaffolding' | 'customer_persona';
    targetSkillId?: string;
    targetErrorCategory?: string;
  };
}

// ----------------------------------------------------------------------------
// 4. OUTCOME MODEL (Observable Post-Action Verification)
// ----------------------------------------------------------------------------
export type OutcomeResultTypeV2 =
  | 'RETRY_SUCCEEDED'
  | 'RETRY_FAILED_ADVANCED'
  | 'RECAST_ADOPTED_IN_SUBSEQUENT_TURN'
  | 'PROBE_ANSWERED_CLEARLY'
  | 'SCENARIO_CONDITION_HANDLED'
  | 'SCENARIO_CONDITION_FAILED'
  | 'DRILL_TARGET_PASSED'
  | 'CLARIFICATION_PROVIDED';

export interface OutcomeV2 {
  outcomeId: string;
  priorActionType?: ActionTypeV2;
  observedEvidenceId: string;
  timestamp: string;
  resultType: OutcomeResultTypeV2;
  skillScoreDelta?: {
    skillId: string;
    delta: number;
  };
  notes?: string;
}

// ----------------------------------------------------------------------------
// 5. GROUNDED FACT MODEL (Durable Fact Memory with Provenance)
// ----------------------------------------------------------------------------
export interface GroundedFactV2 {
  factId: string;
  statement: string;
  category: 'PROFILE' | 'PREFERENCE' | 'EXPERIENCE' | 'TEMPORARY';
  isDurable: boolean;
  confidence: number;
  firstLearnedAt: string;
  lastConfirmedAt: string;
  supersededBy?: string;
}

// ----------------------------------------------------------------------------
// 6. ERROR MEMORY MODEL (Recurring Friction Tracker)
// ----------------------------------------------------------------------------
export interface LearnerErrorV2 {
  errorId: string;
  category: 'VERB_TENSE' | 'PREPOSITION' | 'WORD_ORDER' | 'PRONOUN' | 'HINDI_INTERFERENCE' | 'GENERAL_SYNTAX';
  patternDescription: string;
  status: 'ACTIVE' | 'IMPROVING' | 'RESOLVED' | 'RECURRING';
  occurrenceCount: number;
  firstObservedAt: string;
  lastObservedAt: string;
  resolutionMetrics: {
    consecutiveCleanOpportunities: number;
    recastsAdopted: number;
    drillSuccessCount: number;
  };
  drillPriorityScore: number; // 0 to 100
}

// ----------------------------------------------------------------------------
// 7. SKILL STATE MODEL (Evidence-Derived Competency Trajectory)
// ----------------------------------------------------------------------------
export type SkillTrajectoryStatus =
  | 'UNTESTED'
  | 'INTRODUCED'
  | 'DEVELOPING'
  | 'DEMONSTRATED'
  | 'CONSISTENT'
  | 'MASTERED';

export interface SkillStateV2 {
  skillId: string;
  category: 'TENSE_ASPECT' | 'SENTENCE_STRUCTURE' | 'PRAGMATICS' | 'VOCABULARY';
  status: SkillTrajectoryStatus;
  evidenceCounters: {
    totalAttempts: number;
    successfulDemonstrations: number;
    consecutiveCleanStreak: number;
    sessionsDemonstrated: number;
  };
  lastObservedAt: string;
  associatedErrorIds: string[];
}

// ----------------------------------------------------------------------------
// 8. DURABLE LEARNER STATE MODEL
// ----------------------------------------------------------------------------
export interface LearnerStateV2 {
  learnerId: string;
  createdAt: string;
  updatedAt: string;
  languageProfile: {
    primaryNativeLanguage: string;
    comfortLanguage: 'hindi' | 'hinglish' | 'english';
    overallCefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  };
  skills: Record<string, SkillStateV2>;
  recurringErrors: Record<string, LearnerErrorV2>;
  durableFacts: GroundedFactV2[];
}
