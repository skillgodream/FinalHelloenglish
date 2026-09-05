import {
  DrillTarget,
  ScoredCoreQuestion,
  QuestionAttempt,
  DrillScoreSummary,
  LearnerRating,
  DrillSessionRecord,
} from '../types/drillTypes';

export function scoreToRating(score: number): LearnerRating {
  if (score >= 90) return 'Great';
  if (score >= 75) return 'Good';
  if (score >= 55) return 'Getting Better';
  return 'Needs Practice';
}

/**
 * Deterministically calculates all drill scores strictly according to specification:
 * - Target Accuracy: 60%
 * - First-Attempt Accuracy: 20%
 * - Sentence Making: 10%
 * - Relevant Grammar Accuracy: 10%
 * Redistributes weights proportionally if a component has insufficient evidence.
 */
export function calculateDrillScores(
  target: DrillTarget,
  coreQuestions: ScoredCoreQuestion[],
  allAttempts: QuestionAttempt[]
): DrillScoreSummary {
  const scoredCoreCount = coreQuestions.length;

  if (scoredCoreCount === 0 || allAttempts.length === 0) {
    return {
      targetAccuracy: 0,
      firstAttemptAccuracy: 0,
      retryRecovery: null,
      sentenceMakingAccuracy: 0,
      relevantGrammarAccuracy: null,
      overallAccuracy: 0,
      accuracyRating: 'Needs Practice',
      speakingRating: 'Needs Practice',
      confidenceRating: 'Needs Practice',
      didWell: ['Showed up and attempted English practice today.'],
      practiceNext: [`Continue building familiarity with ${target.title}.`],
      bestCorrection: null,
      nextPracticeAction: `Practice framing one simple sentence with ${target.title} aloud.`,
    };
  }

  // 1. Target Accuracy
  // Sum of core question scores (1.0 = first attempt correct, 0.5 = correct after retry, 0.0 = not demonstrated)
  const sumTargetScores = coreQuestions.reduce((acc, q) => acc + q.score, 0);
  const targetAccuracy = Math.min(100, Math.max(0, (sumTargetScores / scoredCoreCount) * 100));

  // 2. First-Attempt Accuracy
  const firstAttemptCorrectCount = coreQuestions.filter((q) => q.firstAttemptCorrect).length;
  const firstAttemptAccuracy = Math.min(
    100,
    Math.max(0, (firstAttemptCorrectCount / scoredCoreCount) * 100)
  );

  // 3. Retry Recovery
  const questionsRequiringRetry = coreQuestions.filter((q) => q.requiredRetry);
  let retryRecovery: number | null = null;
  if (questionsRequiringRetry.length > 0) {
    const recoveredCount = questionsRequiringRetry.filter((q) => q.correctAfterRetry).length;
    retryRecovery = Math.min(
      100,
      Math.max(0, (recoveredCount / questionsRequiringRetry.length) * 100)
    );
  }

  // 4. Sentence Making Accuracy
  // For each response: 1.0 = complete & understandable, 0.5 = fragmented & understandable, 0 = not understandable
  const sentenceScores = allAttempts.map((att) => {
    if (att.sentenceClarity === 'COMPLETE_UNDERSTANDABLE') return 1.0;
    if (att.sentenceClarity === 'FRAGMENTED_UNDERSTANDABLE') return 0.5;
    return 0.0;
  });
  const sumSentenceScores = sentenceScores.reduce((a, b) => a + b, 0);
  const sentenceMakingAccuracy = Math.min(
    100,
    Math.max(0, (sumSentenceScores / allAttempts.length) * 100)
  );

  // 5. Relevant Grammar Accuracy
  const grammarEvidenceAttempts = allAttempts.filter((att) => att.hasRelevantGrammarEvidence);
  let relevantGrammarAccuracy: number | null = null;
  if (grammarEvidenceAttempts.length > 0) {
    const correctGrammarCount = grammarEvidenceAttempts.filter(
      (att) => att.relevantGrammarCorrect
    ).length;
    relevantGrammarAccuracy = Math.min(
      100,
      Math.max(0, (correctGrammarCount / grammarEvidenceAttempts.length) * 100)
    );
  }

  // 6. Overall Accuracy (Weighted application formula)
  // Target: 60%, First-Attempt: 20%, Sentence Making: 10%, Relevant Grammar: 10%
  let overallAccuracy = 0;
  if (relevantGrammarAccuracy !== null) {
    overallAccuracy =
      targetAccuracy * 0.60 +
      firstAttemptAccuracy * 0.20 +
      sentenceMakingAccuracy * 0.10 +
      relevantGrammarAccuracy * 0.10;
  } else {
    // Proportional redistribution without grammar evidence:
    // Target: 60/90 = 66.67%, First-Attempt: 20/90 = 22.22%, Sentence Making: 10/90 = 11.11%
    overallAccuracy =
      targetAccuracy * (60 / 90) +
      firstAttemptAccuracy * (20 / 90) +
      sentenceMakingAccuracy * (10 / 90);
  }
  overallAccuracy = Math.round(Math.min(100, Math.max(0, overallAccuracy)));

  // Derived Speaking & Confidence Ratings
  const accuracyRating = scoreToRating(overallAccuracy);

  // Speaking calculation depends on sentence making & communication success rate
  const communicationSuccessCount = allAttempts.filter((a) => a.communicationSuccessful).length;
  const communicationRate = (communicationSuccessCount / allAttempts.length) * 100;
  const speakingComposite = sentenceMakingAccuracy * 0.6 + communicationRate * 0.4;
  const speakingRating = scoreToRating(speakingComposite);

  // Confidence calculation depends on attempt persistence and first attempt fluency
  const retryBonus = retryRecovery !== null ? (retryRecovery > 50 ? 10 : 0) : 10;
  const confidenceComposite = Math.min(
    100,
    firstAttemptAccuracy * 0.5 + communicationRate * 0.4 + retryBonus
  );
  const confidenceRating = scoreToRating(confidenceComposite);

  // 7. Qualitative Evidence Mining
  // Evidence-based strengths
  const didWell: string[] = [];
  if (firstAttemptCorrectCount >= 3) {
    didWell.push(
      `Quickly applied ${target.title} on your very first attempt in ${firstAttemptCorrectCount} situations.`
    );
  } else if (firstAttemptCorrectCount > 0) {
    didWell.push(`Accurately framed ${target.title} on first try.`);
  }

  if (retryRecovery !== null && retryRecovery >= 50) {
    didWell.push(`Quickly self-corrected your sentences after hearing the natural phrasing.`);
  }

  if (sentenceMakingAccuracy >= 75) {
    didWell.push(`Delivered complete, clearly understandable thoughts across all situations.`);
  }

  if (didWell.length === 0) {
    didWell.push(`Communicated your core meaning clearly in every workplace scenario.`);
  }

  // Actual weaknesses, prioritizing the target skill
  const practiceNext: string[] = [];
  const targetErrors = allAttempts.filter((a) => a.targetErrorPresent);
  if (targetErrors.length > 0) {
    practiceNext.push(
      `Reinforcing the core rule for ${target.title} in everyday spontaneous replies.`
    );
  }

  const fragmentedAttempts = allAttempts.filter(
    (a) => a.sentenceClarity === 'FRAGMENTED_UNDERSTANDABLE'
  );
  if (fragmentedAttempts.length >= 2) {
    practiceNext.push(`Connecting short phrases into full sentences without pausing.`);
  }

  if (practiceNext.length === 0) {
    practiceNext.push(`Maintaining this high level of fluency in longer conversations.`);
  }

  // My Best Correction
  // Find a meaningful target error that had an accurate natural correction
  let bestCorrection: { original: string; betterEnglish: string } | null = null;
  const candidateAttempts = allAttempts.filter(
    (a) =>
      a.targetErrorPresent &&
      a.naturalCorrection &&
      a.learnerRawText.trim().length > 3 &&
      a.naturalCorrection.trim() !== a.learnerRawText.trim()
  );

  if (candidateAttempts.length > 0) {
    const selected = candidateAttempts[0];
    bestCorrection = {
      original: selected.learnerRawText,
      betterEnglish: selected.naturalCorrection,
    };
  } else {
    // If no target error, check for any attempt with a polished natural correction
    const anyCorrection = allAttempts.find(
      (a) =>
        a.naturalCorrection &&
        a.learnerRawText.trim().length > 3 &&
        a.naturalCorrection.toLowerCase() !== a.learnerRawText.toLowerCase()
    );
    if (anyCorrection) {
      bestCorrection = {
        original: anyCorrection.learnerRawText,
        betterEnglish: anyCorrection.naturalCorrection,
      };
    }
  }

  // Next Practice Action
  const nextPracticeAction = target.keyRuleOrTip
    ? `Tip for tomorrow: Remember to ${target.keyRuleOrTip}.`
    : `Try using "${target.title}" in one real conversation today.`;

  return {
    targetAccuracy: Math.round(targetAccuracy),
    firstAttemptAccuracy: Math.round(firstAttemptAccuracy),
    retryRecovery: retryRecovery !== null ? Math.round(retryRecovery) : null,
    sentenceMakingAccuracy: Math.round(sentenceMakingAccuracy),
    relevantGrammarAccuracy:
      relevantGrammarAccuracy !== null ? Math.round(relevantGrammarAccuracy) : null,
    overallAccuracy,
    accuracyRating,
    speakingRating,
    confidenceRating,
    didWell: didWell.slice(0, 2),
    practiceNext: practiceNext.slice(0, 2),
    bestCorrection,
    nextPracticeAction,
  };
}

/**
 * Storage key and functions for persistent Day 10, Day 15, Day 20 progress tracking.
 */
const DRILL_STORAGE_KEY = 'engine2_drill_records_v1';

export function saveDrillSessionRecord(record: DrillSessionRecord): void {
  try {
    const existingRaw = localStorage.getItem(DRILL_STORAGE_KEY);
    const records: DrillSessionRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    records.push(record);
    localStorage.setItem(DRILL_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save drill session record to localStorage:', err);
  }
}

export function getDrillSessionRecords(): DrillSessionRecord[] {
  try {
    const existingRaw = localStorage.getItem(DRILL_STORAGE_KEY);
    return existingRaw ? JSON.parse(existingRaw) : [];
  } catch (err) {
    console.error('Failed to read drill session records from localStorage:', err);
    return [];
  }
}
