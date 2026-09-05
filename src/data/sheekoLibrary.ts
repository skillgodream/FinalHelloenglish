import meaningIntentData from './sheeko/skillgo_my_day_meaning_intent_library (1).json';
import timeSequenceData from './sheeko/skillgo_my_day_time_sequence_library (1).json';
import vocabGrammarData from './sheeko/skillgo_my_day_vocabulary_grammar_library (1).json';

export interface MeaningIntentRecord {
  id: string;
  category: 'DAILY' | 'FRIENDS' | 'WORK';
  patternKey: string;
  meaning: string;
  intent: string;
  matchingFields?: string[];
  sourceType?: string;
  confidence?: number;
}

export interface TimeSequenceRecord {
  id: string;
  pattern: string;
  normalizedValue: string;
  type: 'DAY_RELATIVE' | 'TIME_OF_DAY' | 'SEQUENCE' | 'OVERLAP' | 'TIME_LINK' | 'DURATION' | 'FREQUENCY' | 'REPETITION';
  meaning: string;
  sourceType?: string;
  confidence?: number;
}

export interface VocabGrammarRecord {
  id: string;
  inputPattern: string;
  correctForm: string;
  correctionType: string;
  usageNote?: string;
  sourceType?: string;
  confidence?: number;
}

export interface RephraseTemplateRecord {
  id: string;
  patternId: string;
  category: 'DAILY' | 'WORK' | 'FRIENDS';
  matchedMeaning: string;
  rephraseTemplate: string;
  rephraseMeaning: string;
  activitySlots?: {
    activity?: string;
    step1?: string;
    step2?: string;
    step3?: string;
  };
  sourceType?: string;
  confidence?: number;
}

export interface ReferencePatternRecord {
  id: string;
  sentence: string;
  normalizedMeaning: string;
  category: string;
  activities?: string[];
  people?: string[];
  places?: string[];
  objects?: string[];
  time?: {
    value: string;
    explicit: boolean;
  };
  sequenceMarkers?: string[];
  intent?: string;
}

export interface PipelineStage {
  id: 'LISTEN' | 'UNDERSTAND' | 'CAPTURE' | 'CONNECT' | 'REPHRASE' | 'PROBE' | 'REMEMBER' | 'CONTINUE';
  name: string;
  tagline: string;
  description: string;
  hindiDescription: string;
  rules: string[];
  icon: string;
  color: string;
}

export const SHEEKO_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'LISTEN',
    name: '1. LISTEN',
    tagline: 'Accept Free-Form Expression',
    description: 'Listen without interruption or grammar gatekeeping. Accept broken English, mixed Hindi, missing prepositions, and natural frontline speech patterns.',
    hindiDescription: 'बिना टोके ध्यान से सुनें। टूटी-फूटी अंग्रेजी या हिंदी-मिश्रित भाषा का पूरा स्वागत करें।',
    rules: [
      'Never reject or interrupt learner input for incorrect grammar or vocabulary.',
      'Allow broken words, missing helping verbs, and irregular tenses (e.g., "yesterday i go market").',
      'Preserve the emotional safety and speaking confidence of the learner.'
    ],
    icon: 'Ear',
    color: 'sky'
  },
  {
    id: 'UNDERSTAND',
    name: '2. UNDERSTAND',
    tagline: 'Decode Underlying Intent & Meaning',
    description: 'Map broken expressions to underlying daily life, workplace, or social intents using the Meaning / Intent & Time Sequence libraries.',
    hindiDescription: 'बोलने वाले की असली भावना और इरादे (Intent) को समझें, शब्दों की गलती को नज़रअंदाज़ करें।',
    rules: [
      'Match intent across WORK (inbound, supervisor, attendance), DAILY (groceries, routine), and FRIENDS (outing, support).',
      'Extract time markers (morning, evening, after that, while, during shift) using Time Sequence patterns.',
      'Recognize intended actions even when phrased in shorthand.'
    ],
    icon: 'Brain',
    color: 'purple'
  },
  {
    id: 'CAPTURE',
    name: '3. CAPTURE',
    tagline: '3-Domain Day Breakdown',
    description: 'Distill learner input into structured components: Activities (what happened), Emotions (feelings/reactions), and Context & People (environment, settings, companions).',
    hindiDescription: 'दिन की मुख्य बातों को 3 भागों में बांटें: काम (Activities), भावनाएं (Emotions), और लोग/जगह (Context & People)।',
    rules: [
      'Activities: Short, crisp action pointers (e.g. "Went to office by bike", "Handled product check").',
      'Emotions: Underlying mood and pressure levels (e.g. "Felt tense about supervisor reaction").',
      'Context & People: Setting, colleagues, family, and locations.'
    ],
    icon: 'Layers',
    color: 'amber'
  },
  {
    id: 'CONNECT',
    name: '4. CONNECT',
    tagline: 'Cross-Reference Memory & Reality',
    description: 'Link new inputs with previously captured facts and reference patterns. Never treat reference examples as learner facts, and never re-ask known details.',
    hindiDescription: 'पुरानी बताई बातों और नए तथ्यों को आपस में जोड़ें। पहले से जानी हुई बात दोबारा न पूछें।',
    rules: [
      'Match with 10,000+ reference patterns to identify common narrative structures.',
      'Lock confirmed known facts into session state.',
      'Prevent hallucinations or inventing unmentioned facts.'
    ],
    icon: 'Network',
    color: 'emerald'
  },
  {
    id: 'REPHRASE',
    name: '5. REPHRASE',
    tagline: 'Natural English Mirroring',
    description: 'Acknowledge the learner by reflecting what they said in polite, natural, workplace-ready English using pre-built rephrase templates.',
    hindiDescription: 'शिक्षार्थी की बात को सहज और सुंदर अंग्रेजी में दोहराएं ताकि वे सही रूप सुन सकें।',
    rules: [
      'Use natural frames (e.g., "So, you started your shift...", "In other words, you resolved the mistake...").',
      'Apply Vocabulary & Grammar Library replacements without lecturing or calling out mistakes.',
      'Keep reflections warm, affirming, and concise.'
    ],
    icon: 'MessageSquareShare',
    color: 'blue'
  },
  {
    id: 'PROBE',
    name: '6. PROBE',
    tagline: 'Multi-Directional Questioning',
    description: 'Guide the conversation forward using structured probing angles (WHAT, WHY, HOW_RESOLVED, FEELING, RESULT, NEXT_STEP) without conversational loops.',
    hindiDescription: 'कहानी को आगे बढ़ाने के लिए सही सवाल पूछें (क्या हुआ, कैसे संभाला, कैसा लगा, आगे क्या किया)।',
    rules: [
      'Cycle through fresh inquiry angles: WHAT happened first → HOW did you resolve it → WHAT was the outcome.',
      'Never repeat the same question angle back-to-back.',
      'Keep questions simple, inviting, and open-ended.'
    ],
    icon: 'HelpCircle',
    color: 'rose'
  },
  {
    id: 'REMEMBER',
    name: '7. REMEMBER',
    tagline: 'Dynamic Memory & Fact Tracking',
    description: 'Update the real-time knowledge graph, recording new entities, milestones, and learner vocabulary growth for instant recall.',
    hindiDescription: 'बातचीत में सामने आए नए तथ्यों और प्रगति को याद रखें।',
    rules: [
      'Store people, places, times, and completed topics in active memory.',
      'Highlight vocabulary gains and confidence improvements.',
      'Update completion status of active topic aspects.'
    ],
    icon: 'BookmarkCheck',
    color: 'teal'
  },
  {
    id: 'CONTINUE',
    name: '8. CONTINUE',
    tagline: 'Topic Progression & Celebration',
    description: 'Smoothly transition to the next topic or provide a motivating whole-day synthesis once the current topic is fully explored.',
    hindiDescription: 'अगले विषय पर सहजता से बढ़ें या पूरे दिन का सकारात्मक सारांश प्रस्तुत करें।',
    rules: [
      'Complete topic after 2-3 deep turns and congratulate the learner.',
      'Transition to the next unaddressed DayMap pointer.',
      'Generate a comprehensive Daily Achievement summary with speech coaching tips.'
    ],
    icon: 'Compass',
    color: 'indigo'
  }
];

export const meaningIntentRecords: MeaningIntentRecord[] = (meaningIntentData as any).records || [];
export const timeSequenceRecords: TimeSequenceRecord[] = (timeSequenceData as any).records || [];
export const vocabGrammarRecords: VocabGrammarRecord[] = (vocabGrammarData as any).records || [];
export const rephraseTemplateRecords: RephraseTemplateRecord[] = [
  {
    id: 'REPHRASE_0001',
    patternId: 'PAT_0001',
    category: 'DAILY',
    matchedMeaning: 'morning routine',
    rephraseTemplate: 'I woke up in the morning and completed my daily routine.',
    rephraseMeaning: 'Completed morning routine'
  },
  {
    id: 'REPHRASE_0002',
    patternId: 'PAT_0002',
    category: 'WORK',
    matchedMeaning: 'reach office or warehouse on time',
    rephraseTemplate: 'I reached work on time and started my assigned tasks.',
    rephraseMeaning: 'Commuted and started work shift'
  },
  {
    id: 'REPHRASE_0003',
    patternId: 'PAT_0003',
    category: 'WORK',
    matchedMeaning: 'customer or guest communication',
    rephraseTemplate: 'I assisted the customer and addressed their issue promptly.',
    rephraseMeaning: 'Handled customer communication'
  },
  {
    id: 'REPHRASE_0004',
    patternId: 'PAT_0004',
    category: 'FRIENDS',
    matchedMeaning: 'meet friends and have tea',
    rephraseTemplate: 'I met my friends for tea in the evening and had a great conversation.',
    rephraseMeaning: 'Socialized with friends'
  }
];
export const referencePatternRecords: ReferencePatternRecord[] = [
  {
    id: 'MYDAY_00001',
    sentence: 'morning i wake up early then i wash my face and finally make tea',
    normalizedMeaning: 'I wake up early during the morning, then I wash my face, and later I make tea.',
    category: 'DAILY',
    activities: ['morning routine'],
    people: [],
    places: ['home'],
    time: { value: 'morning', explicit: true },
    sequenceMarkers: ['then', 'finally'],
    intent: 'REPORT_DAY_ACTIVITY'
  },
  {
    id: 'MYDAY_00002',
    sentence: 'i make breakfast in morning after that i eat breakfast then wash the dishes',
    normalizedMeaning: 'I make breakfast during the morning, then I eat breakfast, and later I wash the dishes.',
    category: 'DAILY',
    activities: ['breakfast'],
    people: [],
    places: ['home'],
    time: { value: 'morning', explicit: true },
    sequenceMarkers: ['then', 'after that'],
    intent: 'REPORT_DAY_ACTIVITY'
  },
  {
    id: 'MYDAY_07001',
    sentence: 'morning i take the bus to work then i reach the warehouse and finally change into safety shoes',
    normalizedMeaning: 'I take the bus to work during the morning, then I reach the warehouse, and later I change into safety shoes.',
    category: 'WORK',
    activities: ['commute'],
    people: ['supervisor'],
    places: ['warehouse'],
    time: { value: 'morning', explicit: true },
    sequenceMarkers: ['then', 'finally'],
    intent: 'REPORT_WORK_ACTIVITY'
  },
  {
    id: 'MYDAY_07003',
    sentence: 'after i unload boxes i count the cartons and later i record the quantity',
    normalizedMeaning: 'I unload boxes during the morning, then I count the cartons, and later I record the quantity.',
    category: 'WORK',
    activities: ['inbound count'],
    people: ['team leader'],
    places: ['warehouse'],
    time: { value: 'morning', explicit: true },
    sequenceMarkers: ['later'],
    intent: 'REPORT_WORK_ACTIVITY'
  },
  {
    id: 'MYDAY_09001',
    sentence: 'evening i meet Ravi then i have tea and finally talk about work',
    normalizedMeaning: 'I meet a friend during the evening, then I have tea, and later I talk about work.',
    category: 'FRIENDS',
    activities: ['meeting'],
    people: ['Ravi'],
    places: ['tea shop'],
    time: { value: 'evening', explicit: true },
    sequenceMarkers: ['then', 'finally'],
    intent: 'REPORT_SOCIAL_ACTIVITY'
  }
];

export function matchMeaningIntent(text: string): MeaningIntentRecord | null {
  const lower = (text || '').toLowerCase();
  for (const record of meaningIntentRecords) {
    if (record.patternKey && lower.includes(record.patternKey.toLowerCase())) {
      return record;
    }
  }
  return null;
}

export function matchVocabGrammar(text: string): VocabGrammarRecord[] {
  const lower = (text || '').toLowerCase();
  const matched: VocabGrammarRecord[] = [];
  for (const record of vocabGrammarRecords) {
    if (record.inputPattern && lower.includes(record.inputPattern.toLowerCase())) {
      matched.push(record);
    }
  }
  return matched;
}

export function matchTimeSequence(text: string): TimeSequenceRecord[] {
  const lower = (text || '').toLowerCase();
  const matched: TimeSequenceRecord[] = [];
  for (const record of timeSequenceRecords) {
    if (record.pattern && lower.includes(record.pattern.toLowerCase())) {
      matched.push(record);
    }
  }
  return matched;
}

export function findRephraseTemplate(meaningOrCategory: string): RephraseTemplateRecord | null {
  const lower = (meaningOrCategory || '').toLowerCase();
  const match = rephraseTemplateRecords.find(
    (r) => r.matchedMeaning?.toLowerCase().includes(lower) || r.category?.toLowerCase() === lower
  );
  return match || rephraseTemplateRecords[0] || null;
}

export function matchReferencePattern(text: string, category?: string): ReferencePatternRecord | null {
  const lower = (text || '').toLowerCase();
  const candidates = category && category !== 'All'
    ? referencePatternRecords.filter((r) => r.category === category)
    : referencePatternRecords;

  for (const record of candidates) {
    if (record.sentence && lower.includes(record.sentence.toLowerCase())) {
      return record;
    }
  }
  return candidates[0] || null;
}

export async function fetchReferencePatternsFromApi(query: string, category?: string, limit = 40): Promise<{
  records: ReferencePatternRecord[];
  totalCount: number;
}> {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category && category !== 'All') params.append('category', category);
    params.append('limit', String(limit));

    const res = await fetch(`/api/patterns/reference?${params.toString()}`);
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return {
      records: data.records || [],
      totalCount: data.totalCount || (data.records?.length || 0),
    };
  } catch (err) {
    console.warn('Fallback to local curated reference patterns:', err);
    let list = referencePatternRecords;
    if (category && category !== 'All') {
      list = list.filter((r) => r.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.sentence?.toLowerCase().includes(q) ||
          r.normalizedMeaning?.toLowerCase().includes(q)
      );
    }
    return {
      records: list.slice(0, limit),
      totalCount: list.length,
    };
  }
}
