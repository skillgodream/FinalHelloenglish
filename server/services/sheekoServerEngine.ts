import fs from 'fs';
import path from 'path';

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

// Built-in lightweight core patterns
const DEFAULT_REFERENCE_PATTERNS: SheekoReferencePattern[] = [
  {
    id: 'REF_0001',
    sentence: 'i wake up early morning and take bath',
    normalizedMeaning: 'I woke up early in the morning and took a bath.',
    category: 'DAILY',
    activities: ['wake up', 'bath', 'morning routine'],
    intent: 'Daily Morning Routine',
  },
  {
    id: 'REF_0002',
    sentence: 'reach office on time today morning',
    normalizedMeaning: 'I arrived at the office on time this morning.',
    category: 'WORK',
    activities: ['office', 'commute', 'on time'],
    intent: 'Workplace Punctuality',
  },
  {
    id: 'REF_0003',
    sentence: 'manager gave extra work in warehouse',
    normalizedMeaning: 'My manager assigned extra tasks in the warehouse.',
    category: 'WORK',
    activities: ['warehouse', 'manager', 'tasks'],
    intent: 'Workload & Assignments',
  },
  {
    id: 'REF_0004',
    sentence: 'in evening meet friend for tea',
    normalizedMeaning: 'In the evening, I met my friend for tea.',
    category: 'FRIENDS',
    activities: ['tea', 'friends', 'evening'],
    intent: 'Socializing & Leisure',
  },
  {
    id: 'REF_0005',
    sentence: 'customer angry because order delay',
    normalizedMeaning: 'The customer was upset due to a delayed delivery.',
    category: 'WORK',
    activities: ['customer', 'delay', 'order'],
    intent: 'Customer De-escalation',
  },
];

const DEFAULT_REPHRASE_TEMPLATES: SheekoRephraseTemplate[] = [
  {
    id: 'REP_0001',
    patternId: 'REF_0001',
    category: 'DAILY',
    matchedMeaning: 'morning routine',
    rephraseTemplate: 'I woke up early and got ready for the day.',
    rephraseMeaning: 'Completed morning routine',
  },
  {
    id: 'REP_0002',
    patternId: 'REF_0002',
    category: 'WORK',
    matchedMeaning: 'commute to work',
    rephraseTemplate: 'I reached work on time and started my shift.',
    rephraseMeaning: 'Arrived at workplace',
  },
];

let sheekoReferences: SheekoReferencePattern[] = [...DEFAULT_REFERENCE_PATTERNS];
let sheekoRephrases: SheekoRephraseTemplate[] = [...DEFAULT_REPHRASE_TEMPLATES];

try {
  const refPath = path.join(process.cwd(), 'src/data/sheeko/reference_patterns_light.json');
  if (fs.existsSync(refPath)) {
    const raw = fs.readFileSync(refPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.records) && parsed.records.length > 0) {
      sheekoReferences = parsed.records;
    }
  }
} catch (err) {
  console.warn('[SHEEKO SERVER] Optional light reference patterns not loaded, using built-in set:', err);
}

try {
  const repPath = path.join(process.cwd(), 'src/data/sheeko/rephrase_templates_light.json');
  if (fs.existsSync(repPath)) {
    const raw = fs.readFileSync(repPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.records) && parsed.records.length > 0) {
      sheekoRephrases = parsed.records;
    }
  }
} catch (err) {
  console.warn('[SHEEKO SERVER] Optional light rephrase templates not loaded, using built-in set:', err);
}

console.log(`[SHEEKO SERVER ENGINE] Initialized with ${sheekoReferences.length} reference patterns and ${sheekoRephrases.length} rephrase templates.`);

export function getSheekoReferences(): SheekoReferencePattern[] {
  return sheekoReferences;
}

export function findSheekoReferenceMatch(text: string, category?: string): SheekoReferencePattern | null {
  if (!sheekoReferences.length || !text) return null;
  const clean = text.toLowerCase().trim();
  const tokens = clean.split(/\s+/).filter(t => t.length > 2);

  let bestMatch: SheekoReferencePattern | null = null;
  let bestScore = 0;

  const pool = category && category !== 'All'
    ? sheekoReferences.filter(r => r.category.toLowerCase() === category.toLowerCase())
    : sheekoReferences;

  for (let i = 0; i < pool.length; i++) {
    const pat = pool[i];
    let score = 0;
    const sent = pat.sentence.toLowerCase();
    const mean = pat.normalizedMeaning.toLowerCase();

    if (clean === sent) return pat;

    for (const t of tokens) {
      if (sent.includes(t)) score += 3;
      if (mean.includes(t)) score += 2;
    }

    if (pat.activities) {
      for (const act of pat.activities) {
        if (clean.includes(act.toLowerCase())) score += 4;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = pat;
    }
  }

  return bestMatch;
}

export function findSheekoRephraseTemplate(meaningOrText: string): SheekoRephraseTemplate | null {
  if (!sheekoRephrases.length || !meaningOrText) return null;
  const clean = meaningOrText.toLowerCase().trim();
  const match = sheekoRephrases.find(r => r.matchedMeaning.toLowerCase().includes(clean) || clean.includes(r.matchedMeaning.toLowerCase()));
  return match || sheekoRephrases[0] || null;
}
