import {
  parseLearnerStoryToMeaningRepresentation,
  extractNaturalEnglishMeaning,
  applySheekoGrammarCorrections,
} from '../../../src/data/sheekoEngine';
import { findSheekoReferenceMatch } from '../sheekoServerEngine';
import { CanonicalMeaning, DetectedLanguage, ConversationTurnMessage } from './types';

const HINDI_DEVANAGARI_REGEX = /[\u0900-\u097F]/;
const HINDI_HINGLISH_WORDS_REGEX = /\b(maine|khana|kha|liya|kiya|kaam|theek|samajh|gaya|gayi|aaya|aayi|kar|raha|rahi|hoon|hai|hain|mein|mera|meri|kuch|nahi|kya|bhai|dost|aaj|kal|subah|shaam|bahut|achha|accha|bohot|ghar|pata|mujhe|tum|aap|khelne|khel|dekh|baat|paisa|office|gadi|bus|sabzi|sabji|nahin|bhi|tha|thi|the|pe|par|se|ko|kyun|kyu|kaise|kaha|kahan|paani|pani|chawal|roti|chai|daal|dal)\b/i;

export function isGarbledOrIncomprehensible(text: string): boolean {
  const clean = text.trim();
  if (!clean) return true;
  // If no letters at all (Latin or Devanagari)
  if (!/[a-zA-Z\u0900-\u097F]/.test(clean)) return true;
  // If mostly punctuation and symbols
  const letters = clean.replace(/[^a-zA-Z\u0900-\u097F]/g, '');
  if (letters.length < 2 && clean.length >= 4) return true;
  return false;
}

export function detectLanguage(text: string): DetectedLanguage {
  const clean = text.trim();
  if (!clean || isGarbledOrIncomprehensible(clean)) return 'unknown';

  if (HINDI_DEVANAGARI_REGEX.test(clean)) {
    return 'hindi';
  }

  // Count words
  const words = clean.split(/\s+/).filter(Boolean);
  const hindiMatches = clean.match(new RegExp(HINDI_HINGLISH_WORDS_REGEX.source, 'gi')) || [];

  // If input contains clear Hinglish markers and isn't purely 100% fluent multi-word English
  if (hindiMatches.length > 0) {
    const ratio = hindiMatches.length / words.length;
    if (words.length <= 4 || ratio >= 0.25) {
      return 'hinglish';
    }
  }

  const englishTokens = words.filter(w => /^[a-zA-Z0-9'.,?!-]+$/.test(w));
  if (englishTokens.length / words.length > 0.6) {
    return 'english';
  }

  return 'unknown';
}


/**
 * Resolves context when a learner gives a short answer to a preceding question.
 * Example:
 *   Speaker asks: "What did you eat?"
 *   Learner says: "Rice."
 *   Resolved meaning: "Learner ate rice for the meal."
 */
export function resolveContextualUtterance(
  rawInput: string,
  history: ConversationTurnMessage[]
): { contextResolvedMeaning: string; extractedAction?: string; extractedObject?: string } {
  const cleanInput = rawInput.trim();
  const lastSystemMessage = [...history]
    .reverse()
    .find(m => m.sender === 'buddy' || m.sender === 'system' || m.sender === 'customer');

  const lastQuestion = (lastSystemMessage?.text || '').toLowerCase();

  // If input is a single word or short phrase answering a question
  const isShortAnswer = cleanInput.split(/\s+/).length <= 4;

  if (isShortAnswer && lastQuestion) {
    if (lastQuestion.includes('what did you eat') || lastQuestion.includes('what do you like to eat') || lastQuestion.includes('what did you have for lunch') || lastQuestion.includes('what did you have for dinner')) {
      return {
        contextResolvedMeaning: `Learner ate ${cleanInput}`,
        extractedAction: 'eat',
        extractedObject: cleanInput,
      };
    }
    if (lastQuestion.includes('where did you go') || lastQuestion.includes('where were you')) {
      return {
        contextResolvedMeaning: `Learner went to ${cleanInput}`,
        extractedAction: 'go',
        extractedObject: cleanInput,
      };
    }
    if (lastQuestion.includes('who were you with') || lastQuestion.includes('who else was there')) {
      return {
        contextResolvedMeaning: `Learner was with ${cleanInput}`,
        extractedAction: 'meet',
        extractedObject: cleanInput,
      };
    }
    if (lastQuestion.includes('how are you') || lastQuestion.includes('how was your day')) {
      return {
        contextResolvedMeaning: `Learner is feeling: ${cleanInput}`,
        extractedAction: 'feel',
        extractedObject: cleanInput,
      };
    }
  }

  return {
    contextResolvedMeaning: cleanInput,
  };
}

/**
 * Grounded Canonical Meaning Resolver
 * Decouples meaning understanding from grammar / English quality evaluation.
 */
export function resolveCanonicalMeaning(
  rawInput: string,
  history: ConversationTurnMessage[] = [],
  knownFacts: string[] = []
): CanonicalMeaning {
  const cleanInput = rawInput.trim();
  const language = detectLanguage(cleanInput);

  // Sheeko deterministic entity & fact extraction
  const sheekoExtraction = parseLearnerStoryToMeaningRepresentation(cleanInput);
  const contextResolution = resolveContextualUtterance(cleanInput, history);

  // Deterministic Hindi/Hinglish model extraction via Sheeko
  let normalizedEnglish = '';
  if (language === 'hindi' || language === 'hinglish') {
    normalizedEnglish = extractNaturalEnglishMeaning(cleanInput);
  } else {
    normalizedEnglish = applySheekoGrammarCorrections(cleanInput);
  }

  // Detect time markers
  let timeStr = sheekoExtraction.timeMarkers.join(', ');
  if (!timeStr) {
    if (/\b(yesterday|kal|aaj|today|subah|morning|evening|night|shaam)\b/i.test(cleanInput)) {
      const match = cleanInput.match(/\b(yesterday|kal|aaj|today|morning|evening|night|subah|shaam)\b/i);
      timeStr = match ? match[0] : '';
    }
  }

  // Detect action and object
  const action = contextResolution.extractedAction || sheekoExtraction.activities[0] || 'communicated';
  const object = contextResolution.extractedObject || sheekoExtraction.places[0] || '';

  // Intended meaning summary
  let intendedMeaning = '';
  if (contextResolution.contextResolvedMeaning !== cleanInput) {
    intendedMeaning = contextResolution.contextResolvedMeaning;
  } else if (language === 'hindi' || language === 'hinglish') {
    intendedMeaning = normalizedEnglish
      ? `Learner expressed: "${normalizedEnglish}"`
      : `Learner communicated: "${cleanInput}"`;
  } else {
    intendedMeaning = normalizedEnglish || cleanInput;
  }

  // Facts array
  const facts: string[] = [];
  if (sheekoExtraction.activities.length > 0) {
    facts.push(...sheekoExtraction.activities);
  } else if (cleanInput) {
    facts.push(`Learner shared: "${cleanInput}"`);
  }

  const allFacts = Array.from(new Set([...knownFacts, ...facts]));
  const finalModel = normalizedEnglish || cleanInput;

  return {
    rawInput: cleanInput,
    detectedLanguage: language,
    intent: 'communicate_experience',
    intendedMeaning,
    action,
    object,
    people: sheekoExtraction.people,
    time: timeStr,
    place: sheekoExtraction.places[0] || '',
    relevantFacts: allFacts,
    groundedFacts: allFacts,
    activities: sheekoExtraction.activities,
    confidence: 0.90,
    communicationQualityScore: 0, // Computed by EnglishEvaluator
    isUnderstandable: false,       // Computed by EnglishEvaluator
    normalizedEnglishModel: finalModel,
    normalizedEnglishText: finalModel,
  };
}
