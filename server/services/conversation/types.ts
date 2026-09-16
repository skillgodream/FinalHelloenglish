export type ConversationMode = 'buddy' | 'day_story' | 'rock_and_roll';

export type ConversationAction =
  | 'ACCEPT_AND_PROBE'
  | 'ENCOURAGE_AND_MODEL'
  | 'ASK_REPEAT'
  | 'ACCEPT_REPEAT_AND_PROBE'
  | 'CLARIFY_AND_PROBE';

export type DetectedLanguage = 'hindi' | 'hinglish' | 'broken_english' | 'english' | 'unknown';

export interface ConversationTurnMessage {
  sender: 'buddy' | 'user' | 'learner' | 'system' | 'customer';
  text: string;
  role?: string;
  timestamp?: string | number | Date;
}

export interface CanonicalMeaning {
  rawInput: string;
  detectedLanguage: DetectedLanguage;
  intent: string;
  intendedMeaning: string;
  action: string;
  object: string;
  people: string[];
  time: string;
  place: string;
  relevantFacts: string[];
  groundedFacts: string[];
  activities: string[];
  confidence: number;
  communicationQualityScore: number; // 0 to 100
  isUnderstandable: boolean; // approximately 85% or better
  normalizedEnglishModel: string;
  normalizedEnglishText: string;
}

export interface ConversationOrchestrationInput {
  history: ConversationTurnMessage[];
  learnerMessage: string;
  exchangeCount: number;
  wasAwaitingEnglishRetry?: boolean;
  mode?: ConversationMode;
  context?: Record<string, any>;
}

export interface ConversationOrchestrationResult {
  action: ConversationAction;
  understoodMeaning: string;
  naturalResponse: string;
  nextQuestion: string;
  subtleRecast: string;
  englishModel: string;
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
  
  // Optional mode-specific extensions
  dayStoryData?: {
    rephrase: string;
    probeQuestion: string;
    probeDirection: string;
    topicIsCompleted: boolean;
    completionSummary?: string;
    updatedDayMap?: any;
    deepAnalysis?: any;
  };
  rockAndRollData?: {
    customerReply: string;
    customerMood: 'angry' | 'frustrated' | 'neutral' | 'satisfied' | 'happy';
    coachingFeedback: {
      type: 'positive' | 'warning' | 'tip';
      message: string;
    };
    resolutionReached: boolean;
  };

  // V2 Engine Layer Extensions (Backward Compatible Superset)
  v2?: {
    nextAction: import('./typesV2').NextActionV2;
    evidence: import('./typesV2').EvidenceV2;
    evaluation: import('./typesV2').EvaluationResultV2;
    outcome?: import('./typesV2').OutcomeV2;
  };
}

export * from './typesV2';

