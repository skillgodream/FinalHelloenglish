import { getSheekoReferences } from './sheekoEngine';

export interface EnglishPattern {
  id: string;
  broken_english: string;
  natural_english: string;
  hindi_meaning?: string;
  category: string;
  explanation?: string;
  key_vocabulary?: { wordOrPhrase: string; hindiMeaning: string }[];
}

export const englishPatterns: EnglishPattern[] = getSheekoReferences().map(r => ({
  id: r.id,
  broken_english: r.sentence,
  natural_english: r.normalizedMeaning,
  hindi_meaning: r.intent || 'दैनिक बातचीत',
  category: r.category || 'DAILY',
  explanation: `Context: ${(r.activities || []).join(', ')}`,
  key_vocabulary: []
}));

export interface PatternMatchResult {
  pattern: EnglishPattern;
  score: number;
  matchType: 'exact' | 'strong' | 'partial' | 'thematic';
}

export interface UsefulPhraseCorrection {
  learnerSaid: string;
  betterEnglish: string;
  teaching: string;
  hindiMeaning?: string;
}

export interface EngineAnalysisResult {
  learnerTranscript: string;
  intendedMeaning: string;
  naturalEnglish: string;
  hindiMeaning: string;
  encouragingNote: string;
  keyVocabulary: { wordOrPhrase: string; hindiMeaning: string }[];
  usefulPhrases?: UsefulPhraseCorrection[];
  confidenceScore: number;
  matchedPatternId?: string;
}

/**
 * Clean and tokenize a sentence into lowercase words
 */
export function tokenize(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Common stopwords
 */
const STOP_WORDS = new Set([
  'i', 'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'is', 'am', 'are',
  'was', 'were', 'my', 'me', 'he', 'she', 'they', 'we', 'you', 'it', 'of'
]);

/**
 * Category-to-Hindi mapping for contextual feedback
 */
export const CATEGORY_HINDI_MAP: Record<string, string> = {
  'Past tense': 'बीते हुए समय की बात (Past Tense)',
  'Present tense': 'रोज़मर्रा की बातचीत (Present Tense)',
  'Present continuous': 'अभी हो रहे काम की बात (Present Continuous)',
  'Future': 'आने वाले समय की बात (Future Tense)',
  'Be verbs': 'सहायक क्रिया का सही प्रयोग (am / is / are)',
  'Was/were': 'बीते समय में स्थिति (was / were)',
  'Have/has': 'पास होना या संबंध (have / has)',
  'Do/did': 'प्रश्न पूछने का सही तरीका (do / did)',
  "Can/can't": 'क्षमता या अनुमति (can / can’t)',
  'Articles': 'a, an, the का सही प्रयोग',
  'Prepositions': 'सही प्रीपोजिशन (in, at, on, to)',
  'Word order': 'सही वाक्य क्रम (Word Order)',
  'Countable/plural': 'एकवचन और बहुवचन (Singular / Plural)',
  'Questions': 'सवाल पूछने का स्वाभाविक तरीका',
  'Negatives': 'नकार का सही प्रयोग (not / don’t / doesn’t)',
  'Verb patterns': 'क्रिया का सही रूप (Verb Pattern)',
  'Modal/obligation': 'ज़रूरी या विनम्र वाक्य (should / must / need to)',
  'Time expressions': 'समय बताने के शब्द',
  'Workplace English': 'कार्यस्थल की उपयोगी बातचीत',
  'Daily life': 'दैनिक जीवन की बातचीत',
  'Common Indian-English patterns': 'स्वाभाविक अंग्रेजी शैली',
  'Requests/politeness': 'विनम्र निवेदन (Polite Requests)',
  'Common verb-form errors': 'क्रिया का सही रूप',
  'There is/are': 'मौजूदगी बताना (There is / There are)',
};

/**
 * Compute similarity score between two token arrays
 */
function computeTokenOverlap(tokensA: string[], tokensB: string[]): number {
  if (!tokensA.length || !tokensB.length) return 0;
  const setB = new Set(tokensB);
  let matches = 0;
  for (const t of tokensA) {
    if (setB.has(t)) matches++;
  }
  return (2 * matches) / (tokensA.length + tokensB.length);
}

/**
 * Find matching patterns from the 500 patterns library
 */
export function findMatchingPatterns(
  transcript: string,
  limit: number = 6
): PatternMatchResult[] {
  if (!transcript || !transcript.trim()) {
    return [];
  }

  const rawClean = transcript.trim().toLowerCase();
  const inputTokens = tokenize(rawClean);
  if (inputTokens.length === 0) return [];

  const inputContentTokens = inputTokens.filter(t => !STOP_WORDS.has(t));
  const results: PatternMatchResult[] = [];

  for (const item of englishPatterns) {
    const brokenLower = item.broken_english.toLowerCase();
    const naturalLower = item.natural_english.toLowerCase();
    const brokenTokens = tokenize(brokenLower);
    const naturalTokens = tokenize(naturalLower);

    let score = 0;
    let matchType: PatternMatchResult['matchType'] = 'thematic';

    // 1. Exact match
    if (rawClean === brokenLower || rawClean === naturalLower) {
      score += 25.0;
      matchType = 'exact';
    } else if (rawClean.includes(brokenLower) || brokenLower.includes(rawClean)) {
      score += 12.0;
      matchType = 'strong';
    }

    // 2. Overlap similarity with broken phrase
    const brokenOverlap = computeTokenOverlap(inputTokens, brokenTokens);
    const naturalOverlap = computeTokenOverlap(inputTokens, naturalTokens);
    const maxOverlap = Math.max(brokenOverlap, naturalOverlap);

    score += maxOverlap * 10.0;
    if (maxOverlap >= 0.7 && matchType === 'thematic') matchType = 'strong';
    else if (maxOverlap >= 0.4 && matchType === 'thematic') matchType = 'partial';

    // 3. Significant content words match (nouns, verbs)
    if (inputContentTokens.length > 0) {
      let sharedCount = 0;
      for (const ct of inputContentTokens) {
        if (brokenTokens.includes(ct) || naturalTokens.includes(ct)) {
          sharedCount++;
        }
      }
      const ratio = sharedCount / inputContentTokens.length;
      score += ratio * 8.0;
    }

    // 4. Grammar category triggers
    const cat = item.category.toLowerCase();
    if ((rawClean.includes('yesterday') || rawClean.includes('last ') || rawClean.includes('morning')) && cat.includes('past')) {
      score += 2.0;
    }
    if ((rawClean.includes('tomorrow') || rawClean.includes('will') || rawClean.includes('later')) && cat.includes('future')) {
      score += 2.0;
    }
    if ((rawClean.includes('now') || rawClean.includes('going') || rawClean.includes('coming')) && cat.includes('continuous')) {
      score += 1.5;
    }
    if ((rawClean.includes('why') || rawClean.includes('what') || rawClean.includes('how')) && (cat.includes('question') || cat.includes('word order'))) {
      score += 1.5;
    }

    if (score > 2.0) {
      results.push({ pattern: item, score, matchType });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/**
 * Intelligent grammar and intent normalizer for broken English
 */
export function applyComprehensiveGrammarFixes(raw: string): string {
  let text = raw.trim();

  // Common broken phrases & Indian English idioms to natural workplace English
  const phraseReplacements: [RegExp, string][] = [
    [/\bready for work\b/gi, 'prepared for work'],
    [/\bi take bus\b/gi, 'I take the bus'],
    [/\btell me to check\b/gi, 'asked me to check'],
    [/\bshift finish\b/gi, 'the shift finished'],
    [/\btake rest\b/gi, 'took some rest'],
    [/\bi wake up at (\d+) o['’]?clock and ready for work\b/gi, 'I woke up at $1 o’clock and got ready for work'],
    [/\bi take bus and reach workplace at (\d+) o['’]?clock\b/gi, 'I took the bus and reached my workplace at $1 o’clock'],
    [/\bmy supervisor tell me to check the stock\b/gi, 'my supervisor asked me to check the stock inventory'],
    [/\bi finish my work and go for lunch with my friend\b/gi, 'I finished my tasks and went for lunch with my friend'],
    [/\bafter shift finish,?\s*i go home and take rest\b/gi, 'After my shift finished, I returned home and took some rest'],
    [/\b(i\s+)?wake up\b/gi, 'I woke up'],
    [/\b(i\s+)?take bus\b/gi, 'I took the bus'],
    [/\b(i\s+)?reach\b/gi, 'I reached'],
    [/\b(i\s+)?finish\b/gi, 'I finished'],
    [/\b(i\s+)?go for\b/gi, 'I went for'],
    [/\b(i\s+)?go home\b/gi, 'I went home'],
    [/\b(i\s+)?take rest\b/gi, 'I took some rest'],
    [/\bmy supervisor tell\b/gi, 'my supervisor told'],
    [/\bshift finish\b/gi, 'the shift finished'],
    [/\bi am having a doubt\b/gi, 'I have a question'],
    [/\bi have one doubt\b/gi, 'I have a question'],
    [/\bi am having doubt\b/gi, 'I have a question'],
    [/\bdo one thing\b/gi, 'Here is what we can do'],
    [/\bplease tell again\b/gi, 'Could you please repeat that?'],
    [/\bplease explain again\b/gi, 'Could you please explain that once more?'],
    [/\bnot understand\b/gi, 'I did not understand'],
    [/\bi not understand\b/gi, 'I do not understand'],
    [/\bi am not understand\b/gi, 'I do not understand'],
    [/\bi am not understand this\b/gi, 'I do not understand this'],
    [/\bi not get\b/gi, 'I did not understand'],
    [/\bi reaching warehouse\b/gi, 'I will reach the warehouse'],
    [/\bi reaching office\b/gi, 'I will reach the office'],
    [/\bi reaching\b/gi, 'I am reaching'],
    [/\bi coming\b/gi, 'I am on my way'],
    [/\bi call supervisor on road\b/gi, 'I will call my supervisor while on the road'],
    [/\bwhen bike running\b/gi, 'while I am driving'],
    [/\bparcel box breaking\b/gi, 'The parcel box is damaged'],
    [/\bparcel is break\b/gi, 'The parcel is damaged'],
    [/\bitem is break\b/gi, 'The item is broken'],
    [/\bwater coming\b/gi, 'and the liquid is leaking'],
    [/\bmanager telling me\b/gi, 'My manager has asked me'],
    [/\bmanager saying\b/gi, 'My manager said'],
    [/\bcustomer saying he not want\b/gi, 'The customer said they do not want'],
    [/\bcustomer saying\b/gi, 'The customer said'],
    [/\bhe not want\b/gi, 'he does not want'],
    [/\bshe not want\b/gi, 'she does not want'],
    [/\bi want one day leave\b/gi, 'I would like to request one day of leave'],
    [/\bi want leave tomorrow\b/gi, 'I need to take leave tomorrow'],
    [/\bwhy you not pick call\b/gi, 'Why were you unable to answer the call'],
    [/\bwhy you not\b/gi, 'Why did you not'],
    [/\byesterday i work\b/gi, 'Yesterday I worked'],
    [/\byesterday i clean\b/gi, 'Yesterday I cleaned'],
    [/\byesterday i go\b/gi, 'Yesterday I went'],
    [/\byesterday i call\b/gi, 'Yesterday I called'],
    [/\byesterday i see\b/gi, 'Yesterday I saw'],
    [/\btomorrow i go\b/gi, 'Tomorrow I will go'],
    [/\btomorrow i come\b/gi, 'Tomorrow I will come'],
    [/\bi morning go\b/gi, 'I go in the morning'],
    [/\bi night go\b/gi, 'I go at night'],
    [/\bi go market\b/gi, 'I am going to the market'],
    [/\bi go office\b/gi, 'I am going to the office'],
    [/\bi am go to\b/gi, 'I am going to'],
    [/\bi am come\b/gi, 'I am coming'],
    [/\bi can to\b/gi, 'I can'],
    [/\bcan you to\b/gi, 'Can you'],
    [/\bi will to\b/gi, 'I will'],
    [/\bi has\b/gi, 'I have'],
    [/\bhe have\b/gi, 'He has'],
    [/\bshe have\b/gi, 'She has'],
    [/\bthey is\b/gi, 'They are'],
    [/\bwe is\b/gi, 'We are'],
    [/\byou is\b/gi, 'You are'],
    [/\bhe work here\b/gi, 'He works here'],
    [/\bshe work here\b/gi, 'She works here'],
    [/\bbecause traffic\b/gi, 'due to traffic'],
    [/\bbecause rain\b/gi, 'due to rain'],
  ];

  for (const [pattern, replacement] of phraseReplacements) {
    text = text.replace(pattern, replacement);
  }

  // Capitalize first character
  text = text.charAt(0).toUpperCase() + text.slice(1);

  // Ending punctuation
  if (!/[.?!]$/.test(text)) {
    if (/^(why|what|when|where|who|how|could|can|would|is|are|do|did)/i.test(text)) {
      text += '?';
    } else {
      text += '.';
    }
  }

  return text;
}

/**
 * Generate a dynamic, high quality local analysis from the learner's transcript and patterns library
 * Follows Listen -> Understand -> Rephrase -> Teach
 */
export function generateLocalAnalysis(
  transcript: string,
  questionText: string = '',
  category: string = 'workplace'
): EngineAnalysisResult {
  const clean = (transcript || '').trim();
  if (!clean) {
    return {
      learnerTranscript: '',
      intendedMeaning: 'You started your speaking attempt.',
      naturalEnglish: 'I am ready to answer.',
      hindiMeaning: 'मैं उत्तर देने के लिए तैयार हूँ।',
      encouragingNote: 'Press the microphone and say a few words in English!',
      keyVocabulary: [{ wordOrPhrase: 'ready to speak', hindiMeaning: 'बोलने के लिए तैयार' }],
      usefulPhrases: [],
      confidenceScore: 90,
    };
  }

  const lower = clean.toLowerCase();
  const qLower = (questionText || '').toLowerCase();

  let naturalEnglish = '';
  let intendedMeaning = '';
  let hindiMeaning = '';
  let encouragingNote = 'Great attempt! Coach Neha understood your exact thought.';
  let usefulPhrases: UsefulPhraseCorrection[] = [];
  let keyVocab: { wordOrPhrase: string; hindiMeaning: string }[] = [];
  let confidenceScore = 92;

  // 1. Specific Contextual Handlers (e.g. Late for shift / Hospital / Traffic / Routine)
  if (lower.includes('hosptial') || lower.includes('hospital') || lower.includes('doctor') || lower.includes('clinic')) {
    intendedMeaning = 'You were late because you were at the hospital.';
    naturalEnglish = 'I was late because I was at the hospital.';
    hindiMeaning = 'मैं अस्पताल में था, इसलिए मुझे देर हो गई।';
    usefulPhrases = [
      {
        learnerSaid: lower.includes('come home late') ? 'i come home late' : (lower.includes('late') ? 'late' : 'come late'),
        betterEnglish: 'I was late',
        teaching: 'Use “I was late” when talking about being late in the past.',
        hindiMeaning: 'मुझे देर हो गई थी',
      },
      {
        learnerSaid: lower.includes('in hosptial') ? 'in hosptial' : (lower.includes('in hospital') ? 'in hospital' : 'hospital'),
        betterEnglish: 'because I was at the hospital',
        teaching: 'Use “because” to explain the reason for a situation.',
        hindiMeaning: 'अस्पताल में होने के कारण',
      },
    ];
  } else if (lower.includes('traffic') || lower.includes('jam') || lower.includes('road')) {
    intendedMeaning = 'You were delayed due to heavy traffic on the road.';
    naturalEnglish = 'I was late because I got stuck in heavy traffic.';
    hindiMeaning = 'रास्ते में भारी ट्रैफिक था, इसलिए मुझे देर हो गई।';
    usefulPhrases = [
      {
        learnerSaid: lower.includes('because traffic') ? 'because traffic' : 'traffic',
        betterEnglish: 'due to heavy traffic',
        teaching: 'Use “due to heavy traffic” or “stuck in traffic” to explain road delays.',
        hindiMeaning: 'भारी ट्रैफिक के कारण',
      },
      {
        learnerSaid: lower.includes('i late') ? 'i late' : 'late',
        betterEnglish: 'I was delayed',
        teaching: 'Use “I was delayed” when explaining an unavoidable delay in the past.',
        hindiMeaning: 'मुझे देर हो गई थी',
      },
    ];
  } else if (lower.includes('puncture') || lower.includes('bike break') || lower.includes('tyre') || lower.includes('tire')) {
    intendedMeaning = 'You were delayed because your bike had a flat tyre.';
    naturalEnglish = 'I was late because my bike had a flat tyre on the way.';
    hindiMeaning = 'रास्ते में मेरी बाइक पंक्चर हो गई थी, इसलिए मुझे देर हो गई।';
    usefulPhrases = [
      {
        learnerSaid: 'bike tyre',
        betterEnglish: 'had a flat tyre',
        teaching: 'Say “had a flat tyre” or “bike had a puncture” for vehicle problems.',
        hindiMeaning: 'टायर पंक्चर होना',
      },
      {
        learnerSaid: 'on road',
        betterEnglish: 'on the way',
        teaching: 'Use “on the way” when talking about traveling to work.',
        hindiMeaning: 'रास्ते में',
      },
    ];
  } else if (lower.includes('stock') || lower.includes('inventory') || lower.includes('check')) {
    intendedMeaning = 'You were carrying out the stock checking as instructed by your supervisor.';
    naturalEnglish = 'I was checking the stock inventory as instructed by my supervisor.';
    hindiMeaning = 'सुपरवाइज़र के निर्देश पर मैं स्टॉक इन्वेंटरी चेक कर रहा था।';
    usefulPhrases = [
      {
        learnerSaid: lower.includes('supervisor tell') ? 'supervisor tell' : 'supervisor say',
        betterEnglish: 'as instructed by my supervisor',
        teaching: 'Use “as instructed by” or “my supervisor asked me to” in professional workplace settings.',
        hindiMeaning: 'सुपरवाइज़र के निर्देश अनुसार',
      },
      {
        learnerSaid: 'check stock',
        betterEnglish: 'checking the stock inventory',
        teaching: 'Use “checking the stock inventory” for accurate workplace vocabulary.',
        hindiMeaning: 'स्टॉक इन्वेंटरी चेक करना',
      },
    ];
  } else if (lower.includes('doubt') || lower.includes('question') || lower.includes('ask')) {
    intendedMeaning = 'You had a question about the task and needed clarification.';
    naturalEnglish = 'I have a question regarding this task. Could you please clarify?';
    hindiMeaning = 'इस काम को लेकर मेरा एक सवाल था, क्या आप इसे स्पष्ट कर सकते हैं?';
    usefulPhrases = [
      {
        learnerSaid: lower.includes('having doubt') || lower.includes('one doubt') ? 'having a doubt' : 'doubt',
        betterEnglish: 'I have a question',
        teaching: 'In workplace English, use “I have a question” instead of “I have a doubt”.',
        hindiMeaning: 'मेरा एक सवाल है',
      },
    ];
  } else {
    // 2. Pattern Matching and Rule-Based Deconstruction
    const matches = findMatchingPatterns(clean, 5);
    const topMatch = matches.length > 0 ? matches[0] : null;

    if (topMatch && (topMatch.matchType === 'exact' || (topMatch.matchType === 'strong' && topMatch.score >= 8.0))) {
      const p = topMatch.pattern;
      naturalEnglish = p.natural_english;
      intendedMeaning = `You wanted to explain: "${p.natural_english}".`;
      hindiMeaning = p.hindi_meaning || 'इसे सही और स्वाभाविक अंग्रेजी में इस प्रकार बोलें।';
      encouragingNote = `Awesome! Coach Neha understood your message. Here is the natural ${p.category.toLowerCase()} pattern.`;

      usefulPhrases = [
        {
          learnerSaid: p.broken_english || clean,
          betterEnglish: p.natural_english,
          teaching: p.explanation || `Use "${p.natural_english}" for natural conversational English.`,
          hindiMeaning: p.hindi_meaning,
        },
      ];
      confidenceScore = Math.min(99, Math.round(88 + topMatch.score));
    } else {
      naturalEnglish = applyComprehensiveGrammarFixes(clean);
      intendedMeaning = `You wanted to state that you ${naturalEnglish.replace(/[.?!]+$/, '').toLowerCase()}.`;
      hindiMeaning = 'आपका संदेश स्पष्ट है - इसे प्राकृतिक वर्कप्लेस अंग्रेजी में इस प्रकार कह सकते हैं।';

      const words = clean.split(/\s+/);
      if (words.length >= 2) {
        usefulPhrases = [
          {
            learnerSaid: clean,
            betterEnglish: naturalEnglish,
            teaching: 'Use correct subject-verb tense agreement when speaking about past activities.',
            hindiMeaning: 'सही क्रिया और काल का प्रयोग',
          },
        ];
      }
      confidenceScore = 88;
    }
  }

  // Populate keyVocabulary from usefulPhrases or tokens
  if (usefulPhrases.length > 0) {
    keyVocab = usefulPhrases.map((p) => ({
      wordOrPhrase: p.betterEnglish,
      hindiMeaning: p.hindiMeaning || 'उपयोगी वाक्यांश',
    }));
  } else {
    const words = tokenize(naturalEnglish);
    const keyPhrase = words.slice(0, Math.min(3, words.length)).join(' ');
    keyVocab = [
      {
        wordOrPhrase: keyPhrase || 'workplace English',
        hindiMeaning: 'महत्वपूर्ण बातचीत वाक्यांश',
      },
    ];
  }

  return {
    learnerTranscript: clean,
    intendedMeaning,
    naturalEnglish,
    hindiMeaning,
    encouragingNote,
    usefulPhrases,
    keyVocabulary: keyVocab,
    confidenceScore,
  };
}
