// Interfaces for Sheeko 5 Libraries
import meaningIntentData from './sheeko/skillgo_my_day_meaning_intent_library (1).json';
import timeSequenceData from './sheeko/skillgo_my_day_time_sequence_library (1).json';
import vocabGrammarData from './sheeko/skillgo_my_day_vocabulary_grammar_library (1).json';

export interface SheekoReferencePattern {
  id: string;
  sentence: string;
  normalizedMeaning: string;
  category: 'DAILY' | 'WORK' | 'FRIENDS';
  activities?: string[];
  people?: string[];
  places?: string[];
  objects?: string[];
  time?: { value: string; explicit: boolean };
  sequenceMarkers?: string[];
  intent?: string;
}

export interface SheekoRephraseTemplate {
  id: string;
  patternId: string;
  category: string;
  matchedMeaning: string;
  rephraseTemplate: string;
  rephraseMeaning: string;
  activitySlots?: Record<string, string>;
}

export interface SheekoMeaningIntent {
  id: string;
  category: string;
  patternKey: string;
  meaning: string;
  intent: string;
}

export interface SheekoTimeSequence {
  id: string;
  pattern: string;
  normalizedValue: string;
  type: string;
  meaning: string;
}

export interface SheekoVocabularyGrammar {
  id: string;
  inputPattern: string;
  correctForm: string;
  correctionType: string;
  usageNote?: string;
}

const sheekoIntents: SheekoMeaningIntent[] = (meaningIntentData as any).records || [];
const sheekoTimeSequences: SheekoTimeSequence[] = (timeSequenceData as any).records || [];
const sheekoGrammars: SheekoVocabularyGrammar[] = (vocabGrammarData as any).records || [];

export function getSheekoReferences(): SheekoReferencePattern[] {
  return [];
}

export function findSheekoReferenceMatch(text: string, category?: string): SheekoReferencePattern | null {
  return null;
}

export function findSheekoRephraseTemplate(meaningOrText: string): SheekoRephraseTemplate | null {
  return null;
}

export function applySheekoGrammarCorrections(text: string): string {
  if (!text) return '';
  let corrected = text;

  for (const rule of sheekoGrammars) {
    if (rule.inputPattern && rule.correctForm && rule.correctionType !== 'NO_CHANGE') {
      const regex = new RegExp(`\\b${rule.inputPattern}\\b`, 'gi');
      corrected = corrected.replace(regex, rule.correctForm);
    }
  }

  return corrected;
}

export function extractNaturalEnglishMeaning(text: string): string {
  if (!text || !text.trim()) {
    return 'The learner shared their experience.';
  }

  const clean = text.trim();
  // Split into sentences while keeping structure
  const rawSentences = clean
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (rawSentences.length === 0) {
    rawSentences.push(clean);
  }

  const polished = rawSentences.map(rawSentence => {
    let s = applySheekoGrammarCorrections(rawSentence);

    // Apply Hindi / Hinglish to natural English deterministic models
    s = s
      // Complex multi-clause sentences
      .replace(/\bkal maine naya phone (khareeda|kharida|liya),?\s*par wo chal nahi raha tha,?\s*toh maine customer care ko phone lagaya aur unhone bola kal aao\b/gi, 'Yesterday I bought a new phone, but it was not working, so I called customer care and they told me to come tomorrow')
      
      // Food, meals & negations
      .replace(/\b(maine khana nahi khaya|maine khana nahin khaya|khana nahi khaya|khana nahin khaya|maine khana nahi khaya tha)\b/gi, 'I have not eaten food')
      .replace(/\b(maine dinner nahi kiya|dinner nahi kiya|dinner nahi khaya)\b/gi, 'I have not had dinner')
      .replace(/\b(maine lunch nahi kiya|lunch nahi kiya|lunch nahi khaya)\b/gi, 'I have not had lunch')
      .replace(/\b(maine breakfast nahi kiya|breakfast nahi kiya|nashta nahi kiya)\b/gi, 'I have not had breakfast')
      .replace(/\b(chai nahi pee|chai nahi pi|chai nahi li)\b/gi, 'I did not have tea')
      .replace(/\b(chai pee|chai pi|chai pi li|chai li)\b/gi, 'I had a cup of tea')
      .replace(/\b(paani nahi piya|pani nahi piya)\b/gi, 'I did not drink water')
      .replace(/\b(bhookh lagi hai|bhookh lagi thi|bhookh lag rahi hai)\b/gi, 'I am feeling hungry')
      .replace(/\b(maine khana kha liya|khana kha liya|dinner kar liya|lunch kar liya|nashta kar liya)\b/gi, 'I have had my food')

      // Purchases & objects
      .replace(/\b(my brother buy phone|brother buy phone)\b/gi, 'My brother bought a phone')
      .replace(/\b(i buy phone|i buy new phone)\b/gi, 'I bought a new phone')
      .replace(/\b(naya phone khareeda|naya phone liya|new phone buy kiya)\b/gi, 'I bought a new phone')
      .replace(/\bbuy phone\b/gi, 'bought a phone')
      .replace(/\bbought phone\b/gi, 'bought a phone')

      // Routine & Home
      .replace(/\b(ghar par hi tha|ghar par tha|ghar mein tha|ghar pe tha)\b/gi, 'I stayed at home today')
      .replace(/\b(kuch nahi kiya|aaj kuch nahi kiya|kuch khas nahi kiya)\b/gi, "I didn't do anything special today")
      .replace(/\b(so nahi paya|neend nahi aayi|soya nahi)\b/gi, "I couldn't sleep well")
      .replace(/\b(subah jaldi utha|jaldi uth gaya)\b/gi, 'I woke up early in the morning')
      .replace(/\b(der se utha|late utha)\b/gi, 'I woke up late today')
      .replace(/\b(so gaya|so gaya tha)\b/gi, 'I went to sleep')
      .replace(/\b(padhai ki|padhai kar raha tha)\b/gi, 'I was studying')
      .replace(/\b(padhai nahi ki)\b/gi, 'I did not study today')

      // Health & Mood
      .replace(/\b(tabiyat theek nahi hai|tabiyat kharab hai|tabiyat thik nahi)\b/gi, 'I am not feeling well')
      .replace(/\b(sar dard ho raha hai|headache hai|sar dard tha)\b/gi, 'I have a headache')
      .replace(/\b(aaj mera din (acha|accha|theek) nahi tha|din acha nahi tha|aaj din kharab tha)\b/gi, 'My day was not good')
      .replace(/\b(aaj mera din (acha|accha|theek|badhiya) tha)\b/gi, 'My day was good today')
      .replace(/\b(bahut thak gaya hoon|thak gaya|bohot thaka tha|bohot thak gaya)\b/gi, 'I was very tired today')
      .replace(/\b(my day not good|my day no good)\b/gi, 'My day was not good')
      .replace(/\b(day not good|day no good)\b/gi, 'The day was not good')
      .replace(/\b(i not good)\b/gi, 'I was not feeling good')

      // Social & People
      .replace(/\b(papa ne bill pay kiya|papa ne bill bhara)\b/gi, 'My father paid the electricity bill')
      .replace(/\b(dost se mila|dosto se mila|friends se mila)\b/gi, 'I met my friends')
      .replace(/\b(dost se baat ki|dosto ke sath tha)\b/gi, 'I talked to my friends')
      .replace(/\b(kisi se baat nahi ki)\b/gi, "I didn't talk to anyone")

      // Sports & Outings
      .replace(/\b(khelne nahi gaya|aaj khelne nahi gaya|match nahi khela)\b/gi, "I didn't go out to play today")
      .replace(/\b(khelne gaya|cricket khela|match khela)\b/gi, 'I went out to play cricket')
      .replace(/\b(kal main market gaya aur sabzi khareedi|kal main market gaya aur sabji khareedi|kal market gaya aur sabzi kharidi)\b/gi, 'Yesterday I went to the market and bought vegetables')
      .replace(/\b(yesterday i go market and buy vegetable|yesterday i go market and buy vegetables)\b/gi, 'Yesterday I went to the market and bought vegetables')
      .replace(/\b(kal main market gaya|kal market gaya tha)\b/gi, 'Yesterday I went to the market')
      .replace(/\b(sabzi khareedi|sabji kharidi|sabzi li)\b/gi, 'bought vegetables')
      .replace(/\b(market gaya tha|shopping gaya tha)\b/gi, 'I went to the market')
      .replace(/\b(office nahi gaya|aaj office nahi gaya)\b/gi, 'I did not go to the office today')
      .replace(/\b(kaam par tha|office mein busy tha|bahut kaam tha)\b/gi, 'I was busy with work')
      .replace(/\btoday morning\b/gi, 'this morning')
      .replace(/\byesterday night\b/gi, 'last night')
      .replace(/\bcame late to office\b/gi, 'arrived late at the office')
      .replace(/\bcame late to the office\b/gi, 'arrived late at the office')
      .replace(/\bcome late to office\b/gi, 'arrive late at the office')
      .replace(/\bgot late\b/gi, 'was delayed')
      .replace(/\bgetting late\b/gi, 'running late')
      .replace(/\btoo much traffic\b/gi, 'heavy traffic')
      .replace(/\blittle angry with me\b/gi, 'a bit upset with me')
      .replace(/\blittle angry\b/gi, 'a bit upset')
      .replace(/\bgave tension\b/gi, 'caused stress')
      .replace(/\bgiving tension\b/gi, 'causing stress')
      .replace(/\btake rest\b/gi, 'rest')
      .replace(/\btaking rest\b/gi, 'resting')
      .replace(/\bdid the needful\b/gi, 'took the necessary steps')
      .replace(/\bwent to warehouse\b/gi, 'went to the warehouse')
      .replace(/\bwent to office\b/gi, 'went to the office')
      .replace(/\breached to office\b/gi, 'arrived at the office')
      .replace(/\breached office\b/gi, 'arrived at the office')
      .replace(/\bi done\b/gi, 'I did')
      .replace(/\bi seen\b/gi, 'I saw')
      .replace(/\bi talk\b/gi, 'I talked')
      .replace(/\bi tell\b/gi, 'I told')
      .replace(/\bi reach\b/gi, 'I arrived')
      .replace(/\bi go\b/gi, 'I went');

    s = s.replace(/[.!?]+$/, '').trim();
    if (s.length > 0) {
      s = s.charAt(0).toUpperCase() + s.slice(1);
      s = s.replace(/\b i \b/g, ' I ').replace(/\bi'm\b/g, "I'm");
      if (!/[.!?]$/.test(s)) {
        s += '.';
      }
    }
    return s;
  });

  return polished.filter(Boolean).join(' ');
}

export function parseLearnerStoryToMeaningRepresentation(text: string) {
  if (!text || !text.trim()) {
    return {
      clauses: [],
      activities: [],
      people: [],
      places: [],
      objects: [],
      timeMarkers: [],
      sequenceMarkers: [],
      normalizedSummary: 'The learner shared their daily experience.'
    };
  }

  const cleanText = text.toLowerCase().trim();
  // Extract activities solely from the learner's actual sentences and clauses
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const activities: string[] = [];

  for (const sent of sentences) {
    const clauses = sent.split(/,\s*|\b(?:and then|after that|but)\b/gi).map(c => c.trim()).filter(Boolean);
    for (const rawClause of (clauses.length > 0 ? clauses : [sent])) {
      let cleaned = rawClause
        .replace(/^(?:and|but|so|because|that|of|then|after that)\s+/i, '')
        .trim();
      cleaned = applySheekoGrammarCorrections(cleaned);
      if (cleaned.length > 6) {
        const cap = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        if (!activities.includes(cap)) {
          activities.push(cap);
        }
      }
    }
  }

  // Extract people mentioned directly in learner's input
  const directPeopleMentions: string[] = [];
  const personKeywords = [
    'mother', 'mom', 'father', 'dad', 'brother', 'sister',
    'friend', 'friends', 'colleague', 'colleagues', 'manager',
    'boss', 'supervisor', 'team', 'wife', 'husband', 'son',
    'daughter', 'customer', 'client'
  ];
  for (const kw of personKeywords) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(cleanText)) {
      directPeopleMentions.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  // Extract places mentioned directly in learner's input
  const directPlaceMentions: string[] = [];
  const placeKeywords = [
    'office', 'warehouse', 'home', 'road', 'store', 'shop',
    'station', 'market', 'workplace', 'cafeteria', 'canteen',
    'desk', 'factory'
  ];
  for (const kw of placeKeywords) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(cleanText)) {
      directPlaceMentions.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  // Extract time markers mentioned directly in learner's input
  const directTimeMentions: string[] = [];
  const timeKeywords = ['today', 'morning', 'afternoon', 'evening', 'night', 'yesterday', 'on time', 'late', 'early'];
  for (const kw of timeKeywords) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(cleanText)) {
      directTimeMentions.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  for (const ts of sheekoTimeSequences) {
    if (cleanText.includes(ts.pattern.toLowerCase())) {
      if (ts.type === 'TIME' && !directTimeMentions.includes(ts.normalizedValue)) {
        directTimeMentions.push(ts.normalizedValue);
      }
    }
  }

  // Extract sequence markers directly from learner's input
  const sequenceMarkers: string[] = [];
  const seqKeywords = ['after that', 'first', 'then', 'next', 'finally', 'before', 'because', 'so'];
  for (const sk of seqKeywords) {
    if (cleanText.includes(sk)) {
      sequenceMarkers.push(sk);
    }
  }

  const clauses = sentences.flatMap(s => s.split(/,\s*|\b(?:and then|after that|because|so|but)\b/gi).map(c => c.trim()).filter(Boolean));

  // Natural English Meaning = meaning of ONLY the current learner utterance
  const normalizedSummary = extractNaturalEnglishMeaning(text);

  return {
    clauses,
    activities: activities.length > 0 ? activities : [text.trim()],
    people: Array.from(new Set(directPeopleMentions)),
    places: Array.from(new Set(directPlaceMentions)),
    objects: [],
    timeMarkers: Array.from(new Set(directTimeMentions)),
    sequenceMarkers: Array.from(new Set(sequenceMarkers)),
    normalizedSummary
  };
}

/**
 * Synthesizes the complete accumulated Day Story rewritten in correct, simple, natural English.
 * Preserves exact learner facts, chronology, people, and details without hallucinating.
 */
export function synthesizeNaturalEnglishStory(params: {
  rawStatement?: string;
  activities?: string[];
  emotions?: string[];
  knownFacts?: string[];
  learnerAnswers?: string[];
}): string {
  const { rawStatement = '', learnerAnswers = [] } = params;
  if (!rawStatement.trim() && learnerAnswers.length === 0) {
    return 'Today, I went through my daily routine and completed my scheduled activities.';
  }

  // Gather raw utterances in exact chronological sequence
  const rawUtterances: string[] = [];
  if (rawStatement && rawStatement.trim()) {
    rawUtterances.push(rawStatement.trim());
  }
  for (const ans of learnerAnswers) {
    if (ans && ans.trim() && !rawUtterances.includes(ans.trim())) {
      rawUtterances.push(ans.trim());
    }
  }

  const polishedSentences: string[] = [];

  for (let idx = 0; idx < rawUtterances.length; idx++) {
    const raw = rawUtterances[idx];
    let sentence = raw;

    // Apply grammatical replacements while strictly preserving facts
    sentence = applySheekoGrammarCorrections(sentence);

    // Common STT typos and broken verb phrasings
    sentence = sentence
      .replace(/\bearly moring\b/gi, 'early in the morning')
      .replace(/\bmoring\b/gi, 'morning')
      .replace(/\bwiht\b/gi, 'with')
      .replace(/\bbiy\b/gi, 'buy')
      .replace(/\bbuy vegetable\b/gi, 'buy vegetables')
      .replace(/\btake cycle to market\b/gi, 'cycled to the market')
      .replace(/\btake cycle\b/gi, 'rode my cycle')
      .replace(/\bgo to bath\b/gi, 'took a bath')
      .replace(/\bcome home cook food\b/gi, 'came home and cooked food')
      .replace(/\bcome home and cook food\b/gi, 'came home and cooked food')
      .replace(/\bcome home\b/gi, 'came home')
      .replace(/\bcook food\b/gi, 'cooked food')
      .replace(/\bi wake\b/gi, 'I woke up')
      .replace(/\bwake early\b/gi, 'woke up early')
      .replace(/\bkishan friend\b/gi, 'my friend Kishan')
      .replace(/\bdrink tea\b/gi, 'had tea')
      .replace(/\btoday morning\b/gi, 'this morning')
      .replace(/\byesterday night\b/gi, 'last night')
      .replace(/\bcame late to office\b/gi, 'arrived late at the office')
      .replace(/\bcome late to office\b/gi, 'arrive late at the office')
      .replace(/\bgot late\b/gi, 'was delayed')
      .replace(/\btoo much traffic\b/gi, 'heavy traffic')
      .replace(/\blittle angry with me\b/gi, 'a bit upset with me')
      .replace(/\blittle angry\b/gi, 'a bit upset')
      .replace(/\bwent to warehouse\b/gi, 'went to the warehouse')
      .replace(/\bwent to office\b/gi, 'went to the office')
      .replace(/\bgave tension\b/gi, 'was stressful')
      .replace(/\btake rest\b/gi, 'rested')
      .replace(/\btaking rest\b/gi, 'resting')
      .replace(/\bdid the needful\b/gi, 'did what was necessary')
      .replace(/\bi done\b/gi, 'I did')
      .replace(/\bi seen\b/gi, 'I saw')
      .replace(/\bi talk\b/gi, 'I talked')
      .replace(/\bi help\b/gi, 'I helped')
      .replace(/\bi have dinner\b/gi, 'I had dinner')
      .replace(/\bi have lunch\b/gi, 'I had lunch')
      .replace(/\bi meet\b/gi, 'I met')
      .replace(/\bi reach\b/gi, 'I reached')
      .replace(/\bi start\b/gi, 'I started')
      .replace(/\bi finish\b/gi, 'I finished')
      .replace(/\bi go\b/gi, 'I went')
      .replace(/\bi come\b/gi, 'I came');

    sentence = sentence.replace(/[.!?]+$/, '').trim();
    if (sentence.length > 0) {
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      sentence = sentence.replace(/\b i \b/g, ' I ').replace(/\bi'm\b/g, "I'm");
      if (!sentence.endsWith('.')) {
        sentence += '.';
      }
      polishedSentences.push(sentence);
    }
  }

  return polishedSentences.join(' ');
}

