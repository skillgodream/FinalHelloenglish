import { GoogleGenAI } from '@google/genai';
import { generateGeminiContent } from './geminiService.ts';
import { DrillTarget, QuestionAttempt } from '../../src/types/drillTypes';
import { generateLocalAnalysis } from '../../src/data/patternEngine';

export interface UsefulPhraseCorrection {
  learnerSaid: string;
  betterEnglish: string;
  teaching: string;
  hindiMeaning?: string;
}

export interface DrillAnswerFeedbackOutput {
  learnerTranscript: string;
  intendedMeaning: string;
  naturalEnglish: string;
  hindiMeaning: string;
  encouragingNote: string;
  usefulPhrases: UsefulPhraseCorrection[];
  keyVocabulary: Array<{ wordOrPhrase: string; hindiMeaning: string }>;
  confidenceScore: number;
}

export interface LlamaDrillEvalResult {
  communicationSuccessful: boolean;
  targetSkillDemonstrated: boolean;
  targetErrorPresent: boolean;
  sentenceClarity: 'COMPLETE_UNDERSTANDABLE' | 'FRAGMENTED_UNDERSTANDABLE' | 'NOT_UNDERSTANDABLE';
  relevantGrammarCorrect: boolean;
  hasRelevantGrammarEvidence: boolean;
  naturalCorrection: string;
  retryRecommended: boolean;
  feedbackToLearner: string;
  errorType: 'TARGET_SKILL' | 'VOCABULARY' | 'SENTENCE_FORMATION' | 'GRAMMAR_TENSE' | 'NONE';
  nextQuestionPrompt?: string;
}

export interface LlamaNextQuestionResult {
  question: string;
  context: string;
  hintsOrScenario: string;
  sampleAnswer?: string;
  hindiText?: string;
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_CANDIDATE_MODELS = [
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "qwen/qwen3.8-27b",
];

async function callGroqDirect(messages: Array<{ role: string; content: string }>, temperature = 0.3, max_tokens = 600): Promise<any | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !apiKey.trim()) return null;

  for (const model of GROQ_CANDIDATE_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
          response_format: { type: "json_object" },
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        continue;
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        return parseJsonSafely(content);
      }
    } catch (e) {
      // try next candidate model
    }
  }

  return null;
}

/**
 * Generate a practical context-specific question tailored to the target skill.
 */
export async function generateDrillQuestionWithLlama(
  target: DrillTarget,
  questionNumber: number,
  previousQuestions: string[]
): Promise<LlamaNextQuestionResult> {
  const prompt = `You are a practical, encouraging English coach running a speaking drill.
Target Skill: "${target.title}"
Target Description: "${target.description}"
${target.exampleTarget ? `Example: "${target.exampleTarget}"` : ''}

Question Number: ${questionNumber} of 5
Previous questions used: ${JSON.stringify(previousQuestions)}

YOUR TASK:
Create 1 simple, realistic everyday or workplace question that gives the learner a natural opportunity to practice this exact target skill.
- Keep questions short, relatable, and direct (e.g. asking about their day, work, plans, past experience, or choices).
- Do NOT repeat past situations.
- Do NOT include complicated instructions.

Return ONLY a valid JSON object matching this schema:
{
  "question": "The spoken question for the learner",
  "context": "Brief 3-word situation, e.g., 'At workplace', 'Morning routine', 'With supervisor'",
  "hintsOrScenario": "Short cue if needed"
}`;

  try {
    const parsed = await callGroqDirect([{ role: 'user', content: prompt }], 0.4, 300);
    if (parsed && parsed.question) {
      return {
        question: parsed.question,
        context: parsed.context || 'Daily situation',
        hintsOrScenario: parsed.hintsOrScenario || '',
      };
    }
  } catch (err) {
    console.error('Llama Drill question gen error:', err);
  }

  return generateFallbackQuestion(target, questionNumber);
}

/**
 * Evaluate learner response using Llama 3.1 8B Groq.
 * Evaluates intended meaning first, then assesses target accuracy vs communication success.
 */
export async function evaluateDrillAttemptWithLlama(
  target: DrillTarget,
  questionText: string,
  learnerResponse: string,
  attemptNumber: number
): Promise<LlamaDrillEvalResult> {
  const prompt = `You are an expert, empathetic English evaluator analyzing an Indian learner's spoken drill attempt.

Target Skill: "${target.title}"
Target Details: "${target.description}"
Question Asked: "${questionText}"
Learner Spoken Input: "${learnerResponse}"
Attempt Number: ${attemptNumber} (1 = first attempt, 2 = retry 1, 3 = retry 2)

CRITICAL EVALUATION RULES:
1. UNDERSTAND FIRST: Understand broken Indian English, accents, and fragmented speech before judging accuracy.
2. ACCURACY PRINCIPLE: Separate communication success from target-skill accuracy.
   - Example: If target is "Past Tense", "Yesterday I go market" -> communicationSuccessful = true, but targetSkillDemonstrated = false, targetErrorPresent = true.
3. ACCEPT MULTIPLE ANSWERS: Do not require one rigid sentence structure. If the learner used the target skill naturally in their own way, count it as demonstrated.
4. NATURAL CORRECTION: Provide a natural, simple English phrasing of what the learner intended to say. Do NOT invent new facts.
5. RETRY LOGIC: If targetSkillDemonstrated is false and attemptNumber == 1, set retryRecommended = true. If targetSkillDemonstrated is true or attemptNumber >= 2, set retryRecommended = false.
6. IGNORE SPEECH-TO-TEXT GLITCHES: Do not penalize obvious ASR typos.

Return ONLY a valid JSON object matching this schema:
{
  "communicationSuccessful": true,
  "targetSkillDemonstrated": true,
  "targetErrorPresent": false,
  "sentenceClarity": "COMPLETE_UNDERSTANDABLE" | "FRAGMENTED_UNDERSTANDABLE" | "NOT_UNDERSTANDABLE",
  "relevantGrammarCorrect": true,
  "hasRelevantGrammarEvidence": true,
  "naturalCorrection": "A natural version of what the learner meant to say",
  "retryRecommended": false,
  "feedbackToLearner": "Short 1-sentence supportive response or prompt",
  "errorType": "TARGET_SKILL" | "VOCABULARY" | "SENTENCE_FORMATION" | "GRAMMAR_TENSE" | "NONE"
}`;

  try {
    const parsed = await callGroqDirect([{ role: 'user', content: prompt }], 0.2, 450);
    if (parsed) {
      return {
        communicationSuccessful: parsed.communicationSuccessful ?? true,
        targetSkillDemonstrated: parsed.targetSkillDemonstrated ?? (learnerResponse.trim().length > 5),
        targetErrorPresent: parsed.targetErrorPresent ?? false,
        sentenceClarity: parsed.sentenceClarity || 'COMPLETE_UNDERSTANDABLE',
        relevantGrammarCorrect: parsed.relevantGrammarCorrect ?? true,
        hasRelevantGrammarEvidence: parsed.hasRelevantGrammarEvidence ?? true,
        naturalCorrection: parsed.naturalCorrection || learnerResponse,
        retryRecommended: parsed.retryRecommended ?? (attemptNumber === 1 && parsed.targetSkillDemonstrated === false),
        feedbackToLearner: parsed.feedbackToLearner || 'Great attempt! Let us move to the next one.',
        errorType: parsed.errorType || 'NONE',
      };
    }
  } catch (err) {
    console.error('Llama Drill evaluation error:', err);
  }

  return evaluateFallbackAttempt(target, learnerResponse, attemptNumber);
}

// Deterministic fallbacks when API is unreachable
function generateFallbackQuestion(target: DrillTarget, num: number): LlamaNextQuestionResult {
  const fallbackBanks: Record<number, LlamaNextQuestionResult> = {
    1: { question: `When you started your day this morning, what was the first task you did?`, context: 'Morning routine', hintsOrScenario: 'Daily start' },
    2: { question: `If you have to speak with your manager or colleague today, what will you tell them?`, context: 'Workplace conversation', hintsOrScenario: 'Office discussion' },
    3: { question: `What is one challenge you handled recently, and how did you resolve it?`, context: 'Problem solving', hintsOrScenario: 'Past experience' },
    4: { question: `What are you planning to do right after finishing your practice session?`, context: 'Upcoming plan', hintsOrScenario: 'Next action' },
    5: { question: `How do you usually explain your work to someone new on your team?`, context: 'Team explanation', hintsOrScenario: 'Work introduction' },
  };
  return fallbackBanks[num] || { question: `How would you describe your main goal for today?`, context: 'Daily focus', hintsOrScenario: 'General practice' };
}

function evaluateFallbackAttempt(target: DrillTarget, learnerText: string, attemptNumber: number): LlamaDrillEvalResult {
  const clean = learnerText.trim();
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  const isTargetSkillDemonstrated = wordCount >= 4;

  return {
    communicationSuccessful: wordCount >= 2,
    targetSkillDemonstrated: isTargetSkillDemonstrated,
    targetErrorPresent: !isTargetSkillDemonstrated,
    sentenceClarity: wordCount >= 5 ? 'COMPLETE_UNDERSTANDABLE' : wordCount >= 2 ? 'FRAGMENTED_UNDERSTANDABLE' : 'NOT_UNDERSTANDABLE',
    relevantGrammarCorrect: isTargetSkillDemonstrated,
    hasRelevantGrammarEvidence: wordCount >= 3,
    naturalCorrection: clean,
    retryRecommended: attemptNumber === 1 && !isTargetSkillDemonstrated,
    feedbackToLearner: isTargetSkillDemonstrated ? 'Well expressed!' : 'Try saying the full sentence once more.',
    errorType: isTargetSkillDemonstrated ? 'NONE' : 'TARGET_SKILL',
  };
}

/**
 * Clean & parse LLM JSON output string safely
 */
function parseJsonSafely(raw: string): any {
  let clean = raw.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
  }
  return JSON.parse(clean);
}

/**
 * Validate and normalize Drill Answer Feedback to strictly enforce:
 * 1. Listen -> Understand -> Rephrase -> Teach
 * 2. What you mean (short, clear interpretation of learner's intent)
 * 3. Hindi translation of the intended meaning (not generic fallback)
 * 4. What you want to say (natural English answering the question, never copying broken text)
 * 5. Useful Workplace Phrases (2-3 structured correction components)
 */
function normalizeDrillFeedback(
  raw: any,
  learnerTranscript: string,
  questionText: string,
  category: string
): DrillAnswerFeedbackOutput {
  const cleanTranscript = (learnerTranscript || '').trim();

  let intendedMeaning = typeof raw?.intendedMeaning === 'string' && raw.intendedMeaning.trim()
    ? raw.intendedMeaning.trim()
    : `You explained your reason regarding: "${cleanTranscript}".`;

  let naturalEnglish = typeof raw?.naturalEnglish === 'string' && raw.naturalEnglish.trim()
    ? raw.naturalEnglish.trim()
    : '';

  // Guardrail: Never blindly copy broken learner sentence as naturalEnglish
  if (!naturalEnglish || naturalEnglish.toLowerCase() === cleanTranscript.toLowerCase()) {
    const fallbackLocal = generateLocalAnalysis(cleanTranscript, questionText, category);
    naturalEnglish = fallbackLocal.naturalEnglish;
  }

  let hindiMeaning = typeof raw?.hindiMeaning === 'string' && raw.hindiMeaning.trim()
    ? raw.hindiMeaning.trim()
    : '';

  if (!hindiMeaning || hindiMeaning.includes('यह आपका संदेश है')) {
    const fallbackLocal = generateLocalAnalysis(cleanTranscript, questionText, category);
    hindiMeaning = fallbackLocal.hindiMeaning;
  }

  const encouragingNote = typeof raw?.encouragingNote === 'string' && raw.encouragingNote.trim()
    ? raw.encouragingNote.trim()
    : 'Great attempt! Coach Neha understood your exact thought.';

  let usefulPhrases: UsefulPhraseCorrection[] = [];
  if (Array.isArray(raw?.usefulPhrases)) {
    usefulPhrases = raw.usefulPhrases
      .filter((p: any) => p && typeof p.learnerSaid === 'string' && typeof p.betterEnglish === 'string')
      .slice(0, 3)
      .map((p: any) => ({
        learnerSaid: p.learnerSaid.trim(),
        betterEnglish: p.betterEnglish.trim(),
        teaching: typeof p.teaching === 'string' && p.teaching.trim() ? p.teaching.trim() : `Use "${p.betterEnglish.trim()}" for clear workplace communication.`,
        hindiMeaning: typeof p.hindiMeaning === 'string' ? p.hindiMeaning.trim() : undefined,
      }));
  }

  // If usefulPhrases is empty or missing learning opportunities, extract from fallback
  if (usefulPhrases.length === 0) {
    const fallbackLocal = generateLocalAnalysis(cleanTranscript, questionText, category);
    usefulPhrases = fallbackLocal.usefulPhrases || [];
  }

  let keyVocabulary: Array<{ wordOrPhrase: string; hindiMeaning: string }> = [];
  if (Array.isArray(raw?.keyVocabulary) && raw.keyVocabulary.length > 0) {
    keyVocabulary = raw.keyVocabulary
      .filter((v: any) => v && typeof v.wordOrPhrase === 'string')
      .slice(0, 3)
      .map((v: any) => ({
        wordOrPhrase: v.wordOrPhrase.trim(),
        hindiMeaning: typeof v.hindiMeaning === 'string' ? v.hindiMeaning.trim() : 'उपयोगी वाक्यांश',
      }));
  } else {
    keyVocabulary = usefulPhrases.map((p) => ({
      wordOrPhrase: p.betterEnglish,
      hindiMeaning: p.hindiMeaning || 'उपयोगी वाक्यांश',
    }));
  }

  const confidenceScore = typeof raw?.confidenceScore === 'number' && raw.confidenceScore >= 50 && raw.confidenceScore <= 100
    ? Math.round(raw.confidenceScore)
    : 92;

  return {
    learnerTranscript: cleanTranscript,
    intendedMeaning,
    naturalEnglish,
    hindiMeaning,
    encouragingNote,
    usefulPhrases,
    keyVocabulary,
    confidenceScore,
  };
}

/**
 * Main AI Feedback Generator for Engine 2: Drills for the Day
 * Flow: Listen -> Understand -> Rephrase -> Teach
 */
export async function analyzeDrillFeedbackWithLlama(params: {
  learnerTranscript: string;
  questionText: string;
  category?: string;
}): Promise<DrillAnswerFeedbackOutput> {
  const { learnerTranscript, questionText, category = 'workplace' } = params;
  const cleanTranscript = (learnerTranscript || '').trim();

  if (!cleanTranscript) {
    const local = generateLocalAnalysis('', questionText, category);
    return {
      learnerTranscript: '',
      intendedMeaning: local.intendedMeaning,
      naturalEnglish: local.naturalEnglish,
      hindiMeaning: local.hindiMeaning,
      encouragingNote: local.encouragingNote,
      usefulPhrases: local.usefulPhrases || [],
      keyVocabulary: local.keyVocabulary,
      confidenceScore: 90,
    };
  }

  const systemPrompt = `You are the expert English speaking evaluator and pedagogical coach for "Hello English", teaching Indian learners practical workplace English.

You must follow the strict four-step pedagogical sequence:
LISTEN → UNDERSTAND → REPHRASE → TEACH

CONTEXT FOR THIS ATTEMPT:
- Current Coach Neha Question: "${questionText}"
- Category / Drill Target: "${category}"
- Learner Spoken Utterance: "${cleanTranscript}"

CRITICAL PEDAGOGICAL RULES & GUARDRAILS:

1. UNDERSTAND FIRST ("intendedMeaning"):
- The learner may speak grammatically broken English, transliterated Hindi-English, or fragmented words (e.g. "i come home late in hosptial").
- Infer meaning from:
  1) The Coach Neha question context
  2) The category/drill context
  3) The learner's utterance
- Output a short, clear interpretation of what the learner intended to convey:
  Example: "You were late because you were at the hospital."
- Accept broken English if the meaning is understandable. Do not judge the learner only from grammar. Ignore obvious speech-to-text glitches.
- If the meaning is genuinely unclear, provide the most helpful likely interpretation or one polite clarification.

2. HINDI MEANING OF INTENDED MEANING ("hindiMeaning"):
- Output the accurate, natural Hindi translation of the learner's INTENDED meaning.
- Example: "मैं अस्पताल में था, इसलिए मुझे देर हो गई।"
- NEVER output generic fallback messages like "यह आपका संदेश है" when the meaning is understood.

3. REPHRASE NATURALLY ("naturalEnglish"):
- Output the corrected natural English sentence that answers the Coach Neha question.
- Example: "I was late because I was at the hospital."
- MUST answer the current Coach Neha question directly.
- MUST preserve the learner's intended meaning.
- MUST use simple, natural English.
- MUST correct meaningful grammar errors (tense, prepositions, verb forms, sentence structure).
- NEVER invent facts not implied by the learner.
- NEVER blindly copy the broken learner sentence into "naturalEnglish".
- NEVER produce an unrelated correction.

4. USEFUL WORKPLACE PHRASES / CORRECTION TEACHING ("usefulPhrases"):
- Break the learner's actual sentence into useful correction components (MAXIMUM 2–3 components).
- For each component show:
  * "learnerSaid": Spoken fragment with error (e.g. "i come home late")
  * "betterEnglish": Corrected natural phrase (e.g. "I was late")
  * "teaching": 1-sentence pedagogical tip explaining when and why to use it (e.g. "Use “I was late” when talking about being late in the past.")
  * "hindiMeaning": Brief Hindi translation of the corrected phrase (e.g. "देर हो गई थी")
- ONLY extract phrases where there is a meaningful learning opportunity.
- DO NOT create useless cards by simply copying words from the learner sentence.
- DO NOT over-teach every word.
- Limit to 2–3 useful components.

5. "keyVocabulary":
- 2–3 key phrase pills with Hindi translations for quick review.

Return ONLY a valid JSON object matching this schema:
{
  "learnerTranscript": "${cleanTranscript}",
  "intendedMeaning": "Short, clear interpretation of the learner's intended meaning",
  "naturalEnglish": "Correct natural English sentence answering Coach Neha",
  "hindiMeaning": "Natural Hindi translation of the learner's intended meaning",
  "encouragingNote": "Encouraging 1-sentence note from Coach Neha",
  "usefulPhrases": [
    {
      "learnerSaid": "broken piece",
      "betterEnglish": "corrected piece",
      "teaching": "clear pedagogical tip",
      "hindiMeaning": "Hindi translation"
    }
  ],
  "keyVocabulary": [
    {
      "wordOrPhrase": "key phrase",
      "hindiMeaning": "Hindi translation"
    }
  ],
  "confidenceScore": 92
}`;

  const userPrompt = JSON.stringify({
    question: questionText,
    category,
    transcript: cleanTranscript,
  });

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // 1. Try Groq with Llama models
  try {
    const parsed = await callGroqDirect(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      0.2,
      700
    );

    if (parsed) {
      return normalizeDrillFeedback(parsed, cleanTranscript, questionText, category);
    }
  } catch (groqErr) {
    console.warn('[LlamaDrillService] Groq attempt failed:', groqErr);
  }

  // 2. Fallback to Gemini
  if (geminiKey && geminiKey.trim()) {
    try {
      const text = await generateGeminiContent({
        apiKey: geminiKey,
        contents: `${systemPrompt}\n\nInput JSON:\n${userPrompt}`,
        responseMimeType: 'application/json',
        temperature: 0.2,
      });

      if (text) {
        const parsed = parseJsonSafely(text);
        return normalizeDrillFeedback(parsed, cleanTranscript, questionText, category);
      }
    } catch (geminiErr) {
      console.warn('[LlamaDrillService] Gemini fallback attempt failed:', geminiErr);
    }
  }

  // 3. Fallback to High Quality Local Pattern Engine
  const localAnalysis = generateLocalAnalysis(cleanTranscript, questionText, category);
  return {
    learnerTranscript: cleanTranscript,
    intendedMeaning: localAnalysis.intendedMeaning,
    naturalEnglish: localAnalysis.naturalEnglish,
    hindiMeaning: localAnalysis.hindiMeaning,
    encouragingNote: localAnalysis.encouragingNote,
    usefulPhrases: localAnalysis.usefulPhrases || [],
    keyVocabulary: localAnalysis.keyVocabulary,
    confidenceScore: localAnalysis.confidenceScore,
  };
}
