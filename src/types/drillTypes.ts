export interface DrillTarget {
  id: string;
  title: string;
  description: string;
  category?: string;
  keyRuleOrTip?: string;
  exampleTarget?: string;
}

export type LearnerRating = 'Great' | 'Good' | 'Getting Better' | 'Needs Practice';

export interface QuestionAttempt {
  questionId: string;
  questionText: string;
  context: string;
  attemptNumber: number; // 1 = first attempt, 2 = retry 1, 3 = retry 2
  learnerRawText: string;
  isRetry: boolean;
  
  // Structured Llama evaluation evidence
  communicationSuccessful: boolean;
  targetSkillDemonstrated: boolean;
  targetErrorPresent: boolean;
  sentenceClarity: 'COMPLETE_UNDERSTANDABLE' | 'FRAGMENTED_UNDERSTANDABLE' | 'NOT_UNDERSTANDABLE';
  relevantGrammarCorrect: boolean;
  hasRelevantGrammarEvidence: boolean;
  naturalCorrection: string;
  retryRecommended: boolean;
  feedbackToLearner: string;
  
  // Specific mistake classifications
  errorType?: 'TARGET_SKILL' | 'VOCABULARY' | 'SENTENCE_FORMATION' | 'GRAMMAR_TENSE' | 'NONE';
  specificErrorNotes?: string;
}

export interface ScoredCoreQuestion {
  questionNumber: number;
  questionText: string;
  context: string;
  attempts: QuestionAttempt[];
  
  // Final resolution of question
  score: number; // 1.0 (first attempt correct), 0.5 (correct after retry), 0.0 (not demonstrated)
  firstAttemptCorrect: boolean;
  requiredRetry: boolean;
  correctAfterRetry: boolean;
  targetDemonstrated: boolean;
  
  bestOriginalAttempt?: string;
  bestCorrection?: string;
}

export interface DrillScoreSummary {
  targetAccuracy: number; // 0-100
  firstAttemptAccuracy: number; // 0-100
  retryRecovery: number | null; // 0-100 or null if no retry required
  sentenceMakingAccuracy: number; // 0-100
  relevantGrammarAccuracy: number | null; // 0-100 or null if insufficient evidence
  overallAccuracy: number; // 0-100 (weighted)
  
  // Rating labels for UI (never showing raw percentages)
  accuracyRating: LearnerRating;
  speakingRating: LearnerRating;
  confidenceRating: LearnerRating;
  
  // Qualitative feedback
  didWell: string[];
  practiceNext: string[];
  bestCorrection: {
    original: string;
    betterEnglish: string;
  } | null;
  nextPracticeAction: string;
}

export interface DrillSessionRecord {
  sessionId: string;
  dayNumber: number;
  timestamp: number;
  target: DrillTarget;
  questionsAttemptedCount: number;
  coreQuestions: ScoredCoreQuestion[];
  scores: DrillScoreSummary;
  completionStatus: 'COMPLETED' | 'STOPPED_EARLY';
}
