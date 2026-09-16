import { CanonicalMeaning } from './types';
import { EvaluationResultV2 } from './typesV2';

/**
 * English Quality and Communicative Understandability Evaluator
 * Enforces the ~85% Understandability Rule:
 * "Would a normal conversation partner understand what the learner is trying to communicate?"
 *
 * Spoken communication and confidence, NOT rigid academic grammar checking.
 */
export function evaluateEnglishQuality(
  canonicalMeaning: CanonicalMeaning,
  wasAwaitingRetry: boolean = false
): { communicationQualityScore: number; isUnderstandable: boolean; naturalModelSentence: string } {

  const { rawInput, detectedLanguage, normalizedEnglishModel } = canonicalMeaning;
  const cleanInput = rawInput.trim();
  const lower = cleanInput.toLowerCase();

  // 1. If Hindi or Hinglish, communication is not in English
  if (detectedLanguage === 'hindi' || detectedLanguage === 'hinglish') {
    return {
      communicationQualityScore: 20,
      isUnderstandable: false,
      naturalModelSentence: normalizedEnglishModel || 'I have eaten my food.',
    };
  }

  // 2. Greetings and common conversational affirmations are 100% understandable
  if (/^(hi|hello|hey|yes|no|yeah|yep|sure|fine|good|okay|ok|thanks|thank you|nice)[.!]?$/i.test(cleanInput)) {
    return {
      communicationQualityScore: 95,
      isUnderstandable: true,
      naturalModelSentence: cleanInput,
    };
  }

  // 3. Check for severe word order inversion or garbled speech (e.g. "Eat I food", "late bus yesterday office")
  const words = cleanInput.split(/\s+/).filter(Boolean);
  const isInvertedVerbSubject = /^(eat|ate|go|went|drink|drank|buy|bought|take|took|sleep|slept)\s+(i|we|you|he|she|they)\b/i.test(cleanInput);

  if (isInvertedVerbSubject) {
    return {
      communicationQualityScore: 45,
      isUnderstandable: false,
      naturalModelSentence: normalizedEnglishModel || `I ${words.slice(0, 3).join(' ')}.`,
    };
  }

  // 4. Natural correct English match
  const isExactGrammarMatch = normalizedEnglishModel.toLowerCase().replace(/[.,?!]/g, '') === lower.replace(/[.,?!]/g, '');
  if (isExactGrammarMatch) {
    return {
      communicationQualityScore: 95,
      isUnderstandable: true,
      naturalModelSentence: normalizedEnglishModel,
    };
  }

  // 5. Short natural contextual answers (e.g., "Rice", "Biryani", "At home", "With my brother", "By bus")
  if (words.length <= 3) {
    // If it contains recognisable nouns/prepositions without severe syntax breakdown
    const isContextualPhrase = /^(rice|food|roti|tea|coffee|water|market|home|office|bus|train|bike|car|metro|friend|brother|sister|father|mother|colleague|alone|happy|tired|fine|good|work|shopping)[.!]?$/i.test(cleanInput) ||
      /^(at|in|with|by|for|on)\s+[a-zA-Z0-9\s]+$/i.test(cleanInput);

    if (isContextualPhrase) {
      return {
        communicationQualityScore: 90,
        isUnderstandable: true,
        naturalModelSentence: normalizedEnglishModel || cleanInput,
      };
    }
  }

  // 6. Minor tense mismatch (e.g. "I eat food yesterday" or "Yesterday I go market" or "I buy phone")
  const hasPastMarker = /\b(yesterday|last night|last week|morning|kal|ago)\b/i.test(lower);
  const hasPresentVerbWithPastMarker = hasPastMarker && /\b(i|we|they|he|she)\s+(go|eat|buy|take|do|come|see|make)\b/i.test(lower);

  if (hasPresentVerbWithPastMarker) {
    // Meaning is clear to a conversation partner!
    // But natural English should be modeled once:
    return {
      communicationQualityScore: 78, // Under 85 threshold, triggers gentle model
      isUnderstandable: false,
      naturalModelSentence: normalizedEnglishModel,
    };
  }

  // 7. General simple English sentences:
  // "I ate my food." -> 95%
  // "I eat food." -> 90% (if describing habit or general answer)
  // "I went to market." -> 92%
  if (/^i\s+(ate|eat|have\s+eaten|had)\s+(my\s+)?(food|lunch|dinner|breakfast|meal)/i.test(cleanInput)) {
    if (cleanInput.toLowerCase().includes('ate') || cleanInput.toLowerCase().includes('had') || cleanInput.toLowerCase().includes('have eaten')) {
      return {
        communicationQualityScore: 95,
        isUnderstandable: true,
        naturalModelSentence: 'I have eaten my food.',
      };
    }
    // "I eat food" without past marker
    return {
      communicationQualityScore: 88, // Clear enough!
      isUnderstandable: true,
      naturalModelSentence: 'I ate my food.',
    };
  }

  // General heuristic calculation:
  // If words are standard English and structure has Subject + Verb:
  const hasSubject = /\b(i|you|he|she|we|they|it|my\s+[a-z]+|the\s+[a-z]+)\b/i.test(cleanInput);
  const hasVerb = /\b(am|is|are|was|were|have|has|had|go|went|eat|ate|work|worked|feel|felt|do|did|take|took|get|got|will|can|could|would|should|check|checked|resolve|resolved|send|sent|issue|issued|help|helped|call|called|tell|told|make|made|see|saw)\b/i.test(cleanInput);

  if (hasSubject && hasVerb) {
    // Basic communicative competence achieved
    const score = 88;
    return {
      communicationQualityScore: score,
      isUnderstandable: true,
      naturalModelSentence: normalizedEnglishModel || cleanInput,
    };
  }


  // Fallback: communicative but imperfect
  return {
    communicationQualityScore: 75,
    isUnderstandable: false,
    naturalModelSentence: normalizedEnglishModel || cleanInput,
  };
}

/**
 * ENGINE V2 Linguistic Evaluation Bridge
 * Produces the structured EvaluationResultV2 while preserving the exact V1 evaluation logic.
 */
export function evaluateEnglishQualityV2(
  canonicalMeaning: CanonicalMeaning,
  wasAwaitingRetry: boolean = false,
  domainContext?: { passed?: boolean; domainScore?: number; coachingFeedback?: string }
): EvaluationResultV2 {
  const v1 = evaluateEnglishQuality(canonicalMeaning, wasAwaitingRetry);
  const syntaxErrors: string[] = [];
  const featureMatches: string[] = [];

  const lower = canonicalMeaning.rawInput.toLowerCase().trim();
  const hasPastMarker = /\b(yesterday|last night|last week|morning|kal|ago)\b/i.test(lower);
  const hasPresentVerbWithPastMarker = hasPastMarker && /\b(i|we|they|he|she)\s+(go|eat|buy|take|do|come|see|make)\b/i.test(lower);
  if (hasPresentVerbWithPastMarker) {
    syntaxErrors.push('ERR_PAST_TENSE_WITH_PAST_MARKER');
  }

  const isInvertedVerbSubject = /^(eat|ate|go|went|drink|drank|buy|bought|take|took|sleep|slept)\s+(i|we|you|he|she|they)\b/i.test(lower);
  if (isInvertedVerbSubject) {
    syntaxErrors.push('ERR_INVERTED_VERB_SUBJECT');
  }

  // 1. Positive Past Tense Feature Match:
  // Requires actual past-tense verb production (e.g., went, ate, worked, bought, was, were, had, did)
  // AND absence of past tense syntax errors
  const hasPastTenseVerb = /\b(went|ate|worked|bought|saw|took|made|came|did|was|were|had|played|watched|cooked|read|visited|told|helped|called|studied|finished)\b/i.test(lower);
  if (hasPastTenseVerb && !syntaxErrors.includes('ERR_PAST_TENSE_WITH_PAST_MARKER') && v1.isUnderstandable) {
    featureMatches.push('FEATURE_PAST_TENSE');
  }

  // 2. Positive Word Order Feature Match:
  // Requires multi-word sentence with valid subject + verb sequence AND absence of word order errors
  const words = lower.split(/\s+/).filter(Boolean);
  const hasSubject = /\b(i|you|he|she|we|they|it|my\s+[a-z]+|the\s+[a-z]+)\b/i.test(lower);
  const hasVerb = /\b(am|is|are|was|were|have|has|had|go|went|eat|ate|work|worked|feel|felt|do|did|take|took|get|got|will|can|could|would|should|check|checked|resolve|resolved|send|sent|issue|issued|help|helped|call|called|tell|told|make|made|see|saw|like|love|want)\b/i.test(lower);
  if (words.length >= 3 && hasSubject && hasVerb && !syntaxErrors.includes('ERR_INVERTED_VERB_SUBJECT') && v1.isUnderstandable) {
    featureMatches.push('FEATURE_WORD_ORDER');
  }

  return {
    understanding: {
      intendedMeaning: canonicalMeaning.intendedMeaning || canonicalMeaning.rawInput,
      isUnderstandable: v1.isUnderstandable,
      understandabilityScore: v1.communicationQualityScore,
      detectedLanguage: canonicalMeaning.detectedLanguage,
    },
    communication: {
      taskFulfilled: v1.isUnderstandable || wasAwaitingRetry,
      groundedFactsExtracted: canonicalMeaning.groundedFacts || [],
    },
    languageQuality: {
      grammarScore: v1.communicationQualityScore,
      syntaxErrorPatterns: syntaxErrors,
      subtleRecastModel: v1.naturalModelSentence,
      featureMatches,
    },
    experiencePerformance: {
      passed: domainContext?.passed ?? v1.isUnderstandable,
      domainScore: domainContext?.domainScore ?? v1.communicationQualityScore,
      coachingFeedback: domainContext?.coachingFeedback || (v1.isUnderstandable ? 'Good clear English!' : `Try saying: "${v1.naturalModelSentence}"`),
    },
    confidence: canonicalMeaning.confidence || 0.85,
  };
}

