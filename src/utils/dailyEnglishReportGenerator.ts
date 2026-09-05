/**
 * DAILY ENGLISH REPORT GENERATOR
 * 
 * Generates an encouraging, personalized, visual, action-oriented report
 * designed for Indian learners (10th/12th grade level, rural/semi-urban).
 * Uses simple spoken English (max 12-15 words per explanation).
 * Never exposes raw analytics, JSON, internal scores, or technical jargon.
 */

export type EnglishLevel = 'Starting' | 'Developing' | 'Improving' | 'Confident' | 'Strong';

export type ActivityActionType =
  | 'sentence_building'
  | 'speaking'
  | 'fix_sentence'
  | 'vocabulary'
  | 'conversation'
  | 'listening'
  | 'workplace'
  | 'daily_routine';

export interface RecommendedActivity {
  id: string;
  number: number;
  emoji: string;
  title: string;
  description: string;
  actionType: ActivityActionType;
  targetQuestionId?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  score: number;
  explanation: string;
  actionType: ActivityActionType;
}

export interface DailyEnglishReportData {
  overallScore: number;
  level: EnglishLevel;
  abilitySentence: string;
  totalActivities: number;
  strength: SkillItem;
  focus: SkillItem;
  practicePlan: RecommendedActivity[];
  weeklyStats: {
    words: number;
    sentences: number;
    minutes: number;
    comparisonText: string;
    trend: 'up' | 'steady' | 'down';
  };
  nextStep: {
    prompt: string;
    actionLabel: string;
    actionType: ActivityActionType;
    targetQuestionId?: string;
  };
}

export interface LearnerReportInput {
  overallScore?: number;
  totalActivities?: number;
  skills?: {
    communication?: number;
    conversation?: number;
    vocabulary?: number;
    sentenceAccuracy?: number;
    sentenceBuilding?: number;
    listening?: number;
    speaking?: number;
    workplace?: number;
    dailyRoutine?: number;
    [key: string]: number | undefined;
  };
  weeklyStats?: {
    words?: number;
    sentences?: number;
    minutes?: number;
  };
  previousWeekStats?: {
    words?: number;
    sentences?: number;
    minutes?: number;
  };
  activityPerformance?: Record<string, number>;
  recentMistakes?: Array<{ raw?: string; correction?: string; category?: string }>;
  completedActivities?: string[];
  userName?: string;
}

/**
 * Derives a simple level label from overall score (0 - 100)
 */
export function getSimpleLevel(score: number): EnglishLevel {
  if (score >= 88) return 'Strong';
  if (score >= 75) return 'Confident';
  if (score >= 60) return 'Improving';
  if (score >= 45) return 'Developing';
  return 'Starting';
}

/**
 * Generates ONE simple sentence explaining the learner's current ability.
 * Maximum 12-15 words. Simple spoken English only.
 */
function getAbilitySentence(level: EnglishLevel, strongestSkill: string, weakestSkill: string): string {
  switch (level) {
    case 'Strong':
      return 'You express your thoughts easily. Keep speaking every day to stay strong.';
    case 'Confident':
      return 'You speak with good confidence. Now let us make your speech more natural.';
    case 'Improving':
      return 'You can share your ideas clearly. Now let us make your sentences better.';
    case 'Developing':
      return 'You can say simple words. Now let us connect words into full sentences.';
    case 'Starting':
    default:
      return 'You are starting your English journey. Every single word you practice helps.';
  }
}

/**
 * Main report generator function.
 * Receives learner data and calculates all 7 sections dynamically.
 */
export function generateDailyEnglishReport(input: LearnerReportInput): DailyEnglishReportData {
  // 1. Calculate and normalize skill scores from actual data
  const rawSkills = input.skills || {};

  const comm = rawSkills.communication ?? 82;
  const conv = rawSkills.conversation ?? 74;
  const vocab = rawSkills.vocabulary ?? 68;
  const sentence = rawSkills.sentenceBuilding ?? rawSkills.sentenceAccuracy ?? 46;
  const speaking = rawSkills.speaking ?? 70;
  const listening = rawSkills.listening ?? 76;
  const workplace = rawSkills.workplace ?? 78;
  const daily = rawSkills.dailyRoutine ?? 72;

  const candidateSkills: SkillItem[] = [
    {
      id: 'communication',
      name: 'Communication',
      score: Math.min(100, Math.max(10, Math.round(comm))),
      explanation: 'You share your core message directly so listeners understand your meaning.',
      actionType: 'speaking',
    },
    {
      id: 'conversation',
      name: 'Conversation',
      score: Math.min(100, Math.max(10, Math.round(conv))),
      explanation: 'You respond quickly when someone asks you simple questions.',
      actionType: 'conversation',
    },
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      score: Math.min(100, Math.max(10, Math.round(vocab))),
      explanation: 'You use useful daily words to talk about your work and routine.',
      actionType: 'vocabulary',
    },
    {
      id: 'sentence_building',
      name: 'Sentence Building',
      score: Math.min(100, Math.max(10, Math.round(sentence))),
      explanation: 'Your ideas are clear. Now practise making complete sentences with proper verbs.',
      actionType: 'sentence_building',
    },
    {
      id: 'speaking',
      name: 'Speaking',
      score: Math.min(100, Math.max(10, Math.round(speaking))),
      explanation: 'You speak aloud with steady voice and clear voice rhythm.',
      actionType: 'speaking',
    },
    {
      id: 'listening',
      name: 'Listening',
      score: Math.min(100, Math.max(10, Math.round(listening))),
      explanation: 'You listen carefully and grasp English words spoken at normal speed.',
      actionType: 'listening',
    },
    {
      id: 'workplace',
      name: 'Workplace English',
      score: Math.min(100, Math.max(10, Math.round(workplace))),
      explanation: 'You know practical words for shift updates, tasks, and parcels.',
      actionType: 'workplace',
    },
    {
      id: 'daily_routine',
      name: 'Daily English',
      score: Math.min(100, Math.max(10, Math.round(daily))),
      explanation: 'You explain your daily activities and morning tasks step by step.',
      actionType: 'daily_routine',
    },
  ];

  // 2. Identify Strongest and Weakest (Focus) skills
  const sortedByScoreDesc = [...candidateSkills].sort((a, b) => b.score - a.score);
  const strength = sortedByScoreDesc[0];
  const focus = sortedByScoreDesc[sortedByScoreDesc.length - 1];

  // 3. Overall Score calculation
  const calculatedOverall = input.overallScore !== undefined
    ? input.overallScore
    : Math.round(candidateSkills.reduce((sum, s) => sum + s.score, 0) / candidateSkills.length);

  const overallScore = Math.min(100, Math.max(15, calculatedOverall));
  const level = getSimpleLevel(overallScore);
  const abilitySentence = getAbilitySentence(level, strength.name, focus.name);
  const totalActivities = Math.max(12, input.totalActivities || 24);

  // 4. Activity Recommendation Logic (Section 5)
  // Check weak skills (< 50 or lowest first)
  const weakSkills = [...candidateSkills].sort((a, b) => a.score - b.score);
  const plan: RecommendedActivity[] = [];

  const activityCatalog: Record<ActivityActionType, { emoji: string; title: string; desc: string }> = {
    sentence_building: {
      emoji: '🧩',
      title: 'Build a Sentence',
      desc: 'Practise making complete sentences with the right words.',
    },
    speaking: {
      emoji: '🗣',
      title: 'Speak About Your Day',
      desc: 'Practise talking about your morning and work routine aloud.',
    },
    fix_sentence: {
      emoji: '🔄',
      title: 'Fix My Sentence',
      desc: 'Turn your spoken words into natural, fluent English.',
    },
    vocabulary: {
      emoji: '📚',
      title: 'Daily Vocabulary',
      desc: 'Learn 5 practical words you can use at work today.',
    },
    conversation: {
      emoji: '💬',
      title: 'Quick Buddy Chat',
      desc: 'Practice answering 3 quick questions in real time.',
    },
    listening: {
      emoji: '🎧',
      title: 'Listen & Repeat',
      desc: 'Listen to clear English sentences and say them back.',
    },
    workplace: {
      emoji: '💼',
      title: 'Workplace Situations',
      desc: 'Practise updating your supervisor and team with confidence.',
    },
    daily_routine: {
      emoji: '☀️',
      title: 'Daily Routine Story',
      desc: 'Tell what you did from morning until evening in English.',
    },
  };

  // Primary recommendation: directly targeted at weakest skill
  const primaryAction = focus.actionType;
  const primaryMeta = activityCatalog[primaryAction];
  plan.push({
    id: `rec-1-${primaryAction}`,
    number: 1,
    emoji: primaryMeta.emoji,
    title: primaryMeta.title,
    description: primaryMeta.desc,
    actionType: primaryAction,
    targetQuestionId: primaryAction === 'workplace' ? 'wp-l2-why-late-shift' : 'wp-l1-what-is-time',
  });

  // Secondary recommendation: Fix My Sentence (always highly actionable for Indian learners)
  // or second weakest skill
  const secondWeakest = weakSkills.find((s) => s.actionType !== primaryAction);
  const secondaryAction: ActivityActionType = secondWeakest && secondWeakest.score < 65
    ? secondWeakest.actionType
    : (primaryAction === 'fix_sentence' ? 'speaking' : 'fix_sentence');
  
  const secondaryMeta = activityCatalog[secondaryAction];
  plan.push({
    id: `rec-2-${secondaryAction}`,
    number: 2,
    emoji: secondaryMeta.emoji,
    title: secondaryMeta.title,
    description: secondaryMeta.desc,
    actionType: secondaryAction,
  });

  // Third recommendation: Strengthen existing skill or routine practice
  const tertiaryAction: ActivityActionType = primaryAction === 'speaking' || secondaryAction === 'speaking'
    ? 'daily_routine'
    : 'speaking';
  const tertiaryMeta = activityCatalog[tertiaryAction];
  plan.push({
    id: `rec-3-${tertiaryAction}`,
    number: 3,
    emoji: tertiaryMeta.emoji,
    title: tertiaryMeta.title,
    description: tertiaryMeta.desc,
    actionType: tertiaryAction,
  });

  // Ensure maximum 3 activities
  const finalPlan = plan.slice(0, 3);

  // 5. This Week Stats & Comparison
  const thisWeekWords = input.weeklyStats?.words ?? Math.max(480, totalActivities * 45);
  const thisWeekSentences = input.weeklyStats?.sentences ?? Math.max(38, totalActivities * 3);
  const thisWeekMinutes = input.weeklyStats?.minutes ?? Math.max(28, Math.round(totalActivities * 2.2));

  const prevWords = input.previousWeekStats?.words ?? Math.round(thisWeekWords * 0.82);

  let comparisonText = '↑ You spoke more than last week.';
  let trend: 'up' | 'steady' | 'down' = 'up';

  if (thisWeekWords > prevWords * 1.1) {
    const percentDiff = Math.min(50, Math.max(10, Math.round(((thisWeekWords - prevWords) / prevWords) * 100)));
    comparisonText = `↑ You practised ${percentDiff}% more this week.`;
    trend = 'up';
  } else if (thisWeekWords >= prevWords * 0.95) {
    comparisonText = '→ Your practice stayed steady this week.';
    trend = 'steady';
  } else {
    comparisonText = '↓ Your practice dropped a little. Let us do 3 minutes today!';
    trend = 'down';
  }

  // 6. Your Next Step (Section 7)
  // Single most important action generated from learner's weakest/highest-priority skill
  let nextStepPrompt = 'Talk about what you did yesterday.';
  let nextStepActionType: ActivityActionType = focus.actionType;
  let nextQuestionId: string | undefined = undefined;

  switch (focus.actionType) {
    case 'sentence_building':
      nextStepPrompt = 'Practise building complete sentences.';
      nextStepActionType = 'sentence_building';
      nextQuestionId = 'wp-l2-why-late-shift';
      break;
    case 'speaking':
      nextStepPrompt = 'Talk for 2 minutes about your daily routine.';
      nextStepActionType = 'speaking';
      break;
    case 'vocabulary':
      nextStepPrompt = 'Learn and use 5 new workplace words.';
      nextStepActionType = 'vocabulary';
      break;
    case 'conversation':
      nextStepPrompt = 'Practise a quick conversation with Coach Neha.';
      nextStepActionType = 'conversation';
      break;
    case 'workplace':
      nextStepPrompt = 'Practise telling your supervisor that you will be late.';
      nextStepActionType = 'workplace';
      nextQuestionId = 'wp-l2-why-late-shift';
      break;
    case 'daily_routine':
    default:
      nextStepPrompt = 'Talk about what you did yesterday.';
      nextStepActionType = 'daily_routine';
      break;
  }

  return {
    overallScore,
    level,
    abilitySentence,
    totalActivities,
    strength,
    focus,
    practicePlan: finalPlan,
    weeklyStats: {
      words: thisWeekWords,
      sentences: thisWeekSentences,
      minutes: thisWeekMinutes,
      comparisonText,
      trend,
    },
    nextStep: {
      prompt: nextStepPrompt,
      actionLabel: 'START NOW',
      actionType: nextStepActionType,
      targetQuestionId: nextQuestionId,
    },
  };
}
