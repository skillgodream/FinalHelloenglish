import fs from 'fs';
import path from 'path';

// Load the 3 source domain libraries
const meaningIntentRaw = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/data/sheeko/skillgo_my_day_meaning_intent_library (1).json'), 'utf-8')
);
const timeSequenceRaw = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/data/sheeko/skillgo_my_day_time_sequence_library (1).json'), 'utf-8')
);
const vocabGrammarRaw = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/data/sheeko/skillgo_my_day_vocabulary_grammar_library (1).json'), 'utf-8')
);

// Extract records array safely
const meaningIntentRecords = Array.isArray(meaningIntentRaw.records) ? meaningIntentRaw.records : (Array.isArray(meaningIntentRaw) ? meaningIntentRaw : []);
const timeSequenceRecords = Array.isArray(timeSequenceRaw.records) ? timeSequenceRaw.records : (Array.isArray(timeSequenceRaw) ? timeSequenceRaw : []);
const vocabGrammarRecords = Array.isArray(vocabGrammarRaw.records) ? vocabGrammarRaw.records : (Array.isArray(vocabGrammarRaw) ? vocabGrammarRaw : []);

// Built-in foundational reference patterns
const corePatterns = [
  {
    id: 'REF_0001',
    sentence: 'i wake up early morning and take bath',
    normalizedMeaning: 'I woke up early in the morning and took a bath.',
    category: 'DAILY',
    activities: ['wake up', 'bath', 'morning routine'],
    intent: 'Daily Morning Routine'
  },
  {
    id: 'REF_0002',
    sentence: 'reach office on time today morning',
    normalizedMeaning: 'I arrived at the office on time this morning.',
    category: 'WORK',
    activities: ['office', 'commute', 'on time'],
    intent: 'Workplace Punctuality'
  },
  {
    id: 'REF_0003',
    sentence: 'manager gave extra work in warehouse',
    normalizedMeaning: 'My manager assigned extra tasks in the warehouse.',
    category: 'WORK',
    activities: ['warehouse', 'manager', 'tasks'],
    intent: 'Workload & Assignments'
  },
  {
    id: 'REF_0004',
    sentence: 'in evening meet friend for tea',
    normalizedMeaning: 'In the evening, I met my friend for tea.',
    category: 'FRIENDS',
    activities: ['tea', 'friends', 'evening'],
    intent: 'Socializing & Leisure'
  },
  {
    id: 'REF_0005',
    sentence: 'customer angry because order delay',
    normalizedMeaning: 'The customer was upset due to a delayed delivery.',
    category: 'WORK',
    activities: ['customer', 'delay', 'order'],
    intent: 'Customer De-escalation'
  },
  {
    id: 'REF_0006',
    sentence: 'aaj mera din acha nahi tha',
    normalizedMeaning: 'My day was not good.',
    category: 'DAILY',
    activities: ['day summary', 'feeling down'],
    intent: 'Daily Experience Sharing'
  },
  {
    id: 'REF_0007',
    sentence: 'maine khana kha liya',
    normalizedMeaning: 'I have had my food.',
    category: 'DAILY',
    activities: ['dinner', 'lunch', 'eating'],
    intent: 'Meal & Nutrition'
  },
  {
    id: 'REF_0008',
    sentence: 'aaj khelne nahi gaya',
    normalizedMeaning: "I didn't go out to play today.",
    category: 'FRIENDS',
    activities: ['play', 'sports', 'cricket'],
    intent: 'Recreation & Sports'
  },
  {
    id: 'REF_0009',
    sentence: 'bahut thak gaya hoon',
    normalizedMeaning: 'I was very tired today.',
    category: 'DAILY',
    activities: ['tired', 'rest', 'fatigue'],
    intent: 'Physical Well-being'
  },
  {
    id: 'REF_0010',
    sentence: 'market gaya tha shopping ke liye',
    normalizedMeaning: 'I went to the market for shopping.',
    category: 'DAILY',
    activities: ['market', 'shopping', 'groceries'],
    intent: 'Errands & Shopping'
  }
];

// Transform meaning intent library entries into reference patterns
const transformedPatterns = meaningIntentRecords.map((item: any, idx: number) => ({
  id: item.id || `REF_MI_${idx + 1}`,
  sentence: item.patternKey || item.meaning || '',
  normalizedMeaning: item.meaning || item.intent || '',
  category: item.category || 'DAILY',
  activities: item.matchingFields || [item.category?.toLowerCase() || 'routine'],
  intent: item.intent || 'Daily Conversation'
}));

const allPatterns = [...corePatterns, ...transformedPatterns];

// Build Rephrase Templates
const coreRephrases = [
  {
    id: 'REP_0001',
    patternId: 'REF_0001',
    category: 'DAILY',
    matchedMeaning: 'morning routine',
    rephraseTemplate: 'I woke up early and got ready for the day.',
    rephraseMeaning: 'Completed morning routine'
  },
  {
    id: 'REP_0002',
    patternId: 'REF_0002',
    category: 'WORK',
    matchedMeaning: 'commute to work',
    rephraseTemplate: 'I reached work on time and started my shift.',
    rephraseMeaning: 'Arrived at workplace'
  },
  {
    id: 'REP_0003',
    patternId: 'REF_0006',
    category: 'DAILY',
    matchedMeaning: 'day was not good',
    rephraseTemplate: 'My day was not good today.',
    rephraseMeaning: 'Expressing a difficult day'
  },
  {
    id: 'REP_0004',
    patternId: 'REF_0007',
    category: 'DAILY',
    matchedMeaning: 'had food',
    rephraseTemplate: 'I have already had my food.',
    rephraseMeaning: 'Meal completed'
  },
  {
    id: 'REP_0005',
    patternId: 'REF_0008',
    category: 'FRIENDS',
    matchedMeaning: 'did not play',
    rephraseTemplate: "I didn't go out to play sports today.",
    rephraseMeaning: 'Skipped playing'
  },
  {
    id: 'REP_0006',
    patternId: 'REF_0009',
    category: 'DAILY',
    matchedMeaning: 'tired',
    rephraseTemplate: 'I was exhausted after a long day.',
    rephraseMeaning: 'Fatigue expression'
  }
];

const transformedRephrases = vocabGrammarRecords.map((item: any, idx: number) => ({
  id: item.id || `REP_VG_${idx + 1}`,
  patternId: `REF_VG_${idx + 1}`,
  category: 'DAILY',
  matchedMeaning: item.inputPattern || '',
  rephraseTemplate: item.correctForm || '',
  rephraseMeaning: item.usageNote || item.correctionType || 'Natural conversational English'
}));

const allRephrases = [...coreRephrases, ...transformedRephrases];

const refOutputPath = path.join(process.cwd(), 'src/data/sheeko/reference_patterns_light.json');
const repOutputPath = path.join(process.cwd(), 'src/data/sheeko/rephrase_templates_light.json');

fs.writeFileSync(refOutputPath, JSON.stringify({ version: '1.0.0', records: allPatterns }, null, 2));
fs.writeFileSync(repOutputPath, JSON.stringify({ version: '1.0.0', records: allRephrases }, null, 2));

console.log(`Successfully generated ${allPatterns.length} reference patterns at ${refOutputPath}`);
console.log(`Successfully generated ${allRephrases.length} rephrase templates at ${repOutputPath}`);
