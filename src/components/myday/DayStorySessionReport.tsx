import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Volume2,
  RotateCcw,
  Check,
  ArrowRight,
  Target,
  Sparkles,
  TrendingUp,
  Award,
  Loader2,
} from 'lucide-react';
import { DayMap, ConversationTurn, DeepAnalysis } from '../../types';
import { speakText, stopSpeaking } from '../../utils/audio';
import { synthesizeNaturalEnglishStory, applySheekoGrammarCorrections } from '../../data/sheekoEngine';
import { EnglishProgressScreen } from './EnglishProgressScreen';

interface DayStorySessionReportProps {
  dayMap: DayMap;
  turns: ConversationTurn[];
  latestAnalysis?: DeepAnalysis;
  onStartNewDay: () => void;
  onGoBackToChat: () => void;
}

type RatingLabel = 'Great' | 'Good' | 'Getting Better' | 'Needs Practice';

// High-precision grammar correction for learner Indian-English and spoken phrasing
function getOfflineNaturalCorrection(text: string): string {
  let res = text.trim();
  res = applySheekoGrammarCorrections(res);

  res = res
    // Reduplication
    .replace(/\bfast fast\b/gi, 'very quickly')
    .replace(/\bslow slow\b/gi, 'very slowly')
    .replace(/\bheavy heavy\b/gi, 'very heavy')
    // Tense and auxiliary verbs
    .replace(/\bi am wake up\b/gi, 'I woke up')
    .replace(/\bi am wake\b/gi, 'I woke up')
    .replace(/\bi wake early\b/gi, 'I woke up early')
    .replace(/\bi wake\b/gi, 'I woke up')
    .replace(/\btea is go very cold\b/gi, 'tea got cold')
    .replace(/\btea is go\b/gi, 'tea went')
    .replace(/\bis go\b/gi, 'became')
    .replace(/\bi am feel\b/gi, 'I feel')
    .replace(/\bsun is not coming outside yet\b/gi, "the sun hasn't come out yet")
    .replace(/\bnot coming outside\b/gi, 'not coming out')
    .replace(/\bfeel very lazy for work\b/gi, 'feel too lazy to go to work')
    .replace(/\blazy for work\b/gi, 'lazy about work')
    .replace(/\btoo much dark\b/gi, 'very dark')
    .replace(/\btoo much traffic\b/gi, 'heavy traffic')
    .replace(/\btoday morning\b/gi, 'this morning')
    .replace(/\byesterday night\b/gi, 'last night')
    .replace(/\bcame late to office\b/gi, 'arrived late at the office')
    .replace(/\bcome late to office\b/gi, 'arrive late at the office')
    .replace(/\bgot late\b/gi, 'was delayed')
    .replace(/\blittle angry with me\b/gi, 'a bit upset with me')
    .replace(/\blittle angry\b/gi, 'a bit upset')
    .replace(/\bwent to warehouse\b/gi, 'went to the warehouse')
    .replace(/\bwent to office\b/gi, 'went to the office')
    .replace(/\bi done\b/gi, 'I did')
    .replace(/\bi seen\b/gi, 'I saw')
    .replace(/\bgave tension\b/gi, 'was stressful')
    .replace(/\btake rest\b/gi, 'take a break')
    .replace(/\bdid the needful\b/gi, 'completed the task');

  // Fix capitalization of standalone 'i'
  res = res.replace(/\b i \b/g, ' I ').replace(/\bi'm\b/g, "I'm");
  res = res.charAt(0).toUpperCase() + res.slice(1);
  if (!/[.!?]$/.test(res)) {
    res += '.';
  }
  return res;
}

export const DayStorySessionReport: React.FC<DayStorySessionReportProps> = ({
  dayMap,
  turns,
  latestAnalysis,
  onStartNewDay,
  onGoBackToChat,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [naturalPairs, setNaturalPairs] = useState<
    Array<{ original: string; natural: string; id: string }>
  >([]);
  const [isRefiningPairs, setIsRefiningPairs] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  // 1. Gather all actual discrete learner utterances
  const discreteLearnerUtterances = useMemo(() => {
    const list: string[] = [];
    if (dayMap.rawStatement && dayMap.rawStatement.trim()) {
      list.push(dayMap.rawStatement.trim());
    }
    for (const t of turns) {
      if (t.speaker === 'learner') {
        const text = (t.rawLearnerText || t.text || '').trim();
        if (text && !list.includes(text)) {
          list.push(text);
        }
      }
    }
    return list;
  }, [dayMap.rawStatement, turns]);

  // Total words typed/entered by learner
  const totalLearnerWords = useMemo(() => {
    return discreteLearnerUtterances.reduce(
      (acc, u) => acc + u.split(/\s+/).filter(Boolean).length,
      0
    );
  }, [discreteLearnerUtterances]);

  // 2. Section 1: My Day (Polished narrative identical to Natural English Story)
  const myDaySummary = useMemo(() => {
    if (dayMap.naturalEnglishStory && dayMap.naturalEnglishStory.trim()) {
      return dayMap.naturalEnglishStory.trim();
    }
    if (discreteLearnerUtterances.length > 0) {
      return synthesizeNaturalEnglishStory({
        rawStatement: dayMap.rawStatement,
        learnerAnswers: discreteLearnerUtterances,
      });
    }
    return 'You shared your daily routine and activities.';
  }, [dayMap.naturalEnglishStory, dayMap.rawStatement, discreteLearnerUtterances]);

  // 3. Populate and AI-refine Section 5: My Natural English
  useEffect(() => {
    const initialPairs = discreteLearnerUtterances.map((utterance, idx) => {
      const matchingTurn = turns.find(
        (t) =>
          t.speaker === 'learner' &&
          (t.rawLearnerText === utterance || t.text === utterance)
      );
      let natural = '';
      if (matchingTurn) {
        const turnIdx = turns.indexOf(matchingTurn);
        const nextSysTurn = turns[turnIdx + 1];
        if (nextSysTurn && nextSysTurn.rephrase && nextSysTurn.rephrase.length > 5) {
          natural = nextSysTurn.rephrase;
        }
      }

      if (!natural || natural.toLowerCase().includes('i understand')) {
        natural = getOfflineNaturalCorrection(utterance);
      }

      natural = natural.charAt(0).toUpperCase() + natural.slice(1);
      if (!/[.!?]$/.test(natural)) natural += '.';

      let origFormatted = utterance.charAt(0).toUpperCase() + utterance.slice(1);
      if (!/[.!?]$/.test(origFormatted)) origFormatted += '.';

      return {
        original: origFormatted,
        natural,
        id: `pair-${idx}`,
      };
    });

    setNaturalPairs(initialPairs);

    if (discreteLearnerUtterances.length > 0) {
      setIsRefiningPairs(true);
      Promise.all(
        discreteLearnerUtterances.map(async (utterance, idx) => {
          try {
            const res = await fetch('/api/conversation-step', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                dayMap: { rawStatement: utterance },
                selectedTopic: { pointer: 'Natural Phrasing', turnCount: 0 },
                latestLearnerAnswer: utterance,
                isFirstTurnOfTopic: true,
              }),
            });
            const data = await res.json();
            if (data && data.rephrase && data.rephrase.trim()) {
              let aiRephrase = data.rephrase.trim();
              aiRephrase = aiRephrase.charAt(0).toUpperCase() + aiRephrase.slice(1);
              if (!/[.!?]$/.test(aiRephrase)) aiRephrase += '.';
              return { idx, natural: aiRephrase };
            }
          } catch (e) {
            // fallback remains
          }
          return null;
        })
      )
        .then((results) => {
          setNaturalPairs((prev) => {
            const next = [...prev];
            results.forEach((r) => {
              if (r && next[r.idx]) {
                next[r.idx] = {
                  ...next[r.idx],
                  natural: r.natural,
                };
              }
            });
            return next;
          });
        })
        .catch((err) => {
          console.warn('Failed to refine story pairs safely:', err);
        })
        .finally(() => {
          setIsRefiningPairs(false);
        });
    }
  }, [discreteLearnerUtterances, turns]);

  // 4. Strict, Multi-Parametric Calculation directly on actual learner input
  const metricsCalculation = useMemo(() => {
    const wordCount = totalLearnerWords;
    const utteranceCount = discreteLearnerUtterances.length;
    const joinedText = discreteLearnerUtterances.join(' ');
    const lowerText = joinedText.toLowerCase();

    // A. Grammar Analysis
    const detectedErrors: Array<{ label: string; tip: string }> = [];

    // Tense & auxiliary verb errors (e.g. "am wake", "is go", "is come", "am feel")
    if (/\b(am wake|is go|is come|am feel|am go|is do|am take)\b/i.test(lowerText)) {
      detectedErrors.push({
        label: 'auxiliary verb misuse ("am wake" / "is go")',
        tip: 'Use standard past or present verbs without adding "am/is" before base verbs (e.g., "I woke up", "the tea got cold").',
      });
    }

    // Reduplication errors (e.g. "fast fast", "slow slow")
    if (/\b(fast fast|slow slow|heavy heavy|small small|quick quick)\b/i.test(lowerText)) {
      detectedErrors.push({
        label: 'word repetition ("fast fast")',
        tip: 'Avoid repeating words like "fast fast"; say "very quickly" or "rapidly" instead.',
      });
    }

    // "too much" modifier errors
    if (/\btoo much (dark|cold|hot|busy|late|lazy|tired)\b/i.test(lowerText)) {
      detectedErrors.push({
        label: '"too much" modifier',
        tip: 'Use "very dark" or "extremely cold" instead of "too much dark".',
      });
    }

    // Time collocation errors
    if (/\btoday morning\b/i.test(lowerText)) {
      detectedErrors.push({
        label: '"today morning"',
        tip: 'Say "this morning" rather than "today morning".',
      });
    }
    if (/\byesterday night\b/i.test(lowerText)) {
      detectedErrors.push({
        label: '"yesterday night"',
        tip: 'Say "last night" rather than "yesterday night".',
      });
    }

    // Preposition & Article errors
    if (/\b(went to office|came late to office|went to warehouse|reach to office)\b/i.test(lowerText)) {
      detectedErrors.push({
        label: 'missing article with place',
        tip: 'Use articles before specific locations (e.g. "arrived late at the office").',
      });
    }

    // Lowercase "i"
    if (/\b(i)\b(?!\.)/.test(joinedText) && !/\bI\b/.test(joinedText)) {
      detectedErrors.push({
        label: 'lowercase pronoun "i"',
        tip: 'Always capitalize "I" when referring to yourself.',
      });
    }

    const errorCount = detectedErrors.length;
    
    // Strict Grammar Score
    let grammarScore = 80;
    if (errorCount === 0 && wordCount >= 15) {
      grammarScore = 92;
    } else if (errorCount === 1) {
      grammarScore = 70;
    } else if (errorCount === 2) {
      grammarScore = 55;
    } else if (errorCount === 3) {
      grammarScore = 44;
    } else {
      grammarScore = Math.max(35, 45 - errorCount * 4);
    }

    let grammarRating: RatingLabel = 'Good';
    if (grammarScore >= 88) grammarRating = 'Great';
    else if (grammarScore >= 72) grammarRating = 'Good';
    else if (grammarScore >= 55) grammarRating = 'Getting Better';
    else grammarRating = 'Needs Practice';

    // B. Expression / Fluency (Word production & 5-Turn conversational participation)
    // 5 turns is the full target. Minimum depends on learner, and fewer turns proportionally lowers Expression.
    let expressionScore = 40;
    if (utteranceCount >= 5 && wordCount >= 35) {
      expressionScore = 92;
    } else if (utteranceCount >= 4 && wordCount >= 25) {
      expressionScore = 84;
    } else if (utteranceCount >= 3 && wordCount >= 18) {
      expressionScore = 72;
    } else if (utteranceCount >= 2 && wordCount >= 10) {
      expressionScore = 58;
    } else if (utteranceCount >= 1 && wordCount >= 4) {
      expressionScore = 46;
    } else {
      expressionScore = 35;
    }

    let expressionRating: RatingLabel = 'Good';
    if (expressionScore >= 88) expressionRating = 'Great';
    else if (expressionScore >= 72) expressionRating = 'Good';
    else if (expressionScore >= 55) expressionRating = 'Getting Better';
    else expressionRating = 'Needs Practice';

    // C. Sentence Making (Syntax & Clause Formation - STRICTLY GATED BY GRAMMAR & TURN DEPTH)
    // If learner made major grammar errors (like "am wake", "is go", "fast fast"),
    // sentence formation is structurally flawed and cannot be rated Great.
    const connectorMatches =
      lowerText.match(
        /\b(because|after that|then|so|when|and|but|as soon as|although|while|since)\b/gi
      ) || [];
    const uniqueConnectors = new Set(connectorMatches.map((c) => c.toLowerCase()));

    let baseSentenceScore = 50;
    if (uniqueConnectors.size >= 3 && wordCount >= 20 && utteranceCount >= 3) baseSentenceScore = 86;
    else if (uniqueConnectors.size >= 1 && wordCount >= 10 && utteranceCount >= 2) baseSentenceScore = 72;
    else if (wordCount >= 8) baseSentenceScore = 58;
    else baseSentenceScore = 45;

    // Strict penalty if clauses contain grammatical breakdowns
    let sentenceMakingScore = baseSentenceScore;
    if (errorCount >= 3) {
      sentenceMakingScore = Math.min(52, baseSentenceScore - 30);
    } else if (errorCount === 2) {
      sentenceMakingScore = Math.min(60, baseSentenceScore - 20);
    } else if (errorCount === 1) {
      sentenceMakingScore = Math.min(74, baseSentenceScore - 10);
    }

    let sentenceMakingRating: RatingLabel = 'Good';
    if (sentenceMakingScore >= 85) sentenceMakingRating = 'Great';
    else if (sentenceMakingScore >= 70) sentenceMakingRating = 'Good';
    else if (sentenceMakingScore >= 54) sentenceMakingRating = 'Getting Better';
    else sentenceMakingRating = 'Needs Practice';

    // D. Details (Concrete actions, workplace tasks, timestamps, resolutions across completed turns)
    const workplaceDetails =
      lowerText.match(
        /\b(office|warehouse|market|manager|supervisor|colleague|client|team|task|meeting|bike|bus|train|shift|stock|problem|resolved|finished)\b/gi
      ) || [];
    const sensoryDetails =
      lowerText.match(/\b(tea|wind|cold|dark|sky|sun|lazy|morning|night)\b/gi) || [];

    const uniqueWorkplace = new Set(workplaceDetails.map((d) => d.toLowerCase()));
    const uniqueSensory = new Set(sensoryDetails.map((d) => d.toLowerCase()));

    let detailsScore = 45;
    if (utteranceCount >= 4 && uniqueWorkplace.size >= 3 && uniqueSensory.size >= 1) {
      detailsScore = 90;
    } else if (utteranceCount >= 3 && (uniqueWorkplace.size >= 2 || (uniqueWorkplace.size >= 1 && uniqueSensory.size >= 2))) {
      detailsScore = 78;
    } else if (utteranceCount >= 2 && (uniqueSensory.size >= 2 || uniqueWorkplace.size >= 1)) {
      detailsScore = 62;
    } else if (utteranceCount >= 1) {
      detailsScore = 50;
    } else {
      detailsScore = 38;
    }

    let detailsRating: RatingLabel = 'Getting Better';
    if (detailsScore >= 85) detailsRating = 'Great';
    else if (detailsScore >= 72) detailsRating = 'Good';
    else if (detailsScore >= 56) detailsRating = 'Getting Better';
    else detailsRating = 'Needs Practice';

    // E. Weighted Overall English Confidence Score (Strict calibration)
    const weightedConfidence = Math.round(
      expressionScore * 0.20 +
      grammarScore * 0.40 +
      sentenceMakingScore * 0.25 +
      detailsScore * 0.15
    );

    let confidenceRating: RatingLabel = 'Getting Better';
    if (weightedConfidence >= 85) confidenceRating = 'Great';
    else if (weightedConfidence >= 70) confidenceRating = 'Good';
    else if (weightedConfidence >= 52) confidenceRating = 'Getting Better';
    else confidenceRating = 'Needs Practice';

    let confidenceTierText = 'Building Spoken Foundations';
    if (weightedConfidence >= 88) confidenceTierText = 'High Confidence & Fluency';
    else if (weightedConfidence >= 72) confidenceTierText = 'Clear & Capable Speaking';
    else if (weightedConfidence >= 55) confidenceTierText = 'Steady Progress & Building';
    else confidenceTierText = 'Foundations in Progress';

    return {
      overallConfidenceScore: weightedConfidence,
      confidenceRating,
      confidenceTierText,
      detectedErrors,
      utteranceCount,
      totalLearnerWords: wordCount,
      ratings: [
        { skill: 'Expression', rating: expressionRating, score: expressionScore },
        { skill: 'Confidence', rating: confidenceRating, score: weightedConfidence },
        { skill: 'Grammar', rating: grammarRating, score: grammarScore },
        { skill: 'Sentence Making', rating: sentenceMakingRating, score: sentenceMakingScore },
        { skill: 'Details', rating: detailsRating, score: detailsScore },
      ] as Array<{ skill: string; rating: RatingLabel; score: number }>,
    };
  }, [totalLearnerWords, discreteLearnerUtterances]);

  // 5. Section 3: I Did Well
  const didWellPoints = useMemo((): [string, string] => {
    const joinedText = discreteLearnerUtterances.join(' ').toLowerCase();
    const points: string[] = [];

    if (/\b(wind|tea|cold|dark|sky|sun|lazy|morning)\b/i.test(joinedText)) {
      points.push('You shared your personal morning experience using descriptive words like "cold wind" and "dark sky".');
    }

    if (/\b(because|so|but|and|then|when)\b/i.test(joinedText)) {
      points.push('You attempted to connect causes and effects using linking words like "so" and "but".');
    }

    if (points.length < 2 && discreteLearnerUtterances.length >= 2) {
      points.push('You actively engaged and replied with follow-up information during the conversation.');
    }

    if (points.length < 2) {
      points.push('You expressed your thoughts and answered the prompt directly.');
    }

    return [points[0], points[1] || 'You communicated your daily routine clearly.'];
  }, [discreteLearnerUtterances]);

  // 6. Section 4: Practice Next
  const practiceNextPoints = useMemo((): [string, string] => {
    const points: string[] = [];

    for (const err of metricsCalculation.detectedErrors) {
      if (!points.includes(err.tip)) {
        points.push(err.tip);
      }
      if (points.length >= 2) break;
    }

    if (points.length < 2) {
      points.push('Practice switching to simple past tense verbs ("I woke up", "the tea went cold") when narrating morning events.');
    }

    if (points.length < 2) {
      points.push('Use natural adverbs like "very quickly" instead of repeated words like "fast fast".');
    }

    return [points[0], points[1]];
  }, [metricsCalculation.detectedErrors]);

  // 7. Section 6: Next Time Goal
  const nextTimeGoal = useMemo(() => {
    const joinedText = discreteLearnerUtterances.join(' ').toLowerCase();
    if (joinedText.includes('cold') || joinedText.includes('dark') || joinedText.includes('morning')) {
      return 'In your next Day Story, try sharing what specific actions you took after waking up and how you started your work.';
    }
    return 'In your next Day Story, try adding 1 sentence about how someone around you reacted during your morning.';
  }, [discreteLearnerUtterances]);

  // Audio preview handler
  const handlePlayAudio = (text: string, id: string) => {
    if (playingId === id) {
      stopSpeaking();
      setPlayingId(null);
      return;
    }
    setPlayingId(id);
    speakText(text, 'en-IN', 0.92, () => {
      setPlayingId(null);
    });
  };

  const getRatingBadgeStyle = (rating: RatingLabel) => {
    switch (rating) {
      case 'Great':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'Good':
        return 'bg-blue-50 text-blue-800 border-blue-200/80';
      case 'Getting Better':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'Needs Practice':
        return 'bg-zinc-100 text-zinc-700 border-zinc-200/80';
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col px-4 pt-4 pb-28 text-zinc-900 max-w-[480px] mx-auto font-sans">
      {/* Apple-style Header */}
      <div className="mb-4 px-1 flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 text-zinc-600 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
            <span>Day Story Report</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Session Summary
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Based on your actual input and conversation turns.
          </p>
        </div>

        {/* Turn Completion Chip */}
        <div className="flex flex-col items-end gap-1 shrink-0 pt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-bold">
            <span>{Math.min(5, metricsCalculation.utteranceCount)}/5 Turns</span>
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">
            {metricsCalculation.totalLearnerWords} words spoken
          </span>
        </div>
      </div>

      {/* Large Overall Confidence Hero Banner (Clickable to open 30-Day Graph) */}
      <div
        onClick={() => setIsProgressModalOpen(true)}
        className="mb-5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden cursor-pointer active:scale-[0.99] transition-all group"
        title="Click to view 30-Day Confidence History"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                Overall English Confidence
              </span>
            </div>
            <div className="text-xs text-zinc-400 font-medium">
              {metricsCalculation.confidenceTierText}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full w-fit">
                <TrendingUp className="w-3 h-3" />
                <span>Rating: {metricsCalculation.confidenceRating}</span>
              </div>
              <span className="text-[11px] text-zinc-400 group-hover:text-amber-400 flex items-center gap-1 font-semibold transition-colors">
                View 30-Day Graph <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-5xl font-black text-white tracking-tight flex items-baseline">
              <span>{metricsCalculation.overallConfidenceScore}</span>
              <span className="text-lg font-bold text-zinc-400 ml-0.5">%</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-1">
              Calculated Score
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* 1. MY DAY */}
        <section className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              1. My Day
            </h2>
            <button
              onClick={() => handlePlayAudio(myDaySummary, 'my-day-summary')}
              className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                playingId === 'my-day-summary'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
              title="Listen to your story"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{playingId === 'my-day-summary' ? 'Playing' : 'Listen'}</span>
            </button>
          </div>

          <p className="text-sm text-zinc-700 leading-relaxed font-normal">
            {myDaySummary}
          </p>
        </section>

        {/* 2. MY ENGLISH TODAY */}
        <section className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="mb-3.5">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              2. My English Today
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Strictly calculated from your actual statements and grammar structure.
            </p>
          </div>

          <div className="divide-y divide-zinc-100">
            {metricsCalculation.ratings.map((item, idx) => (
              <div
                key={idx}
                className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-700">{item.skill}</span>
                  <span className="text-[11px] text-zinc-400 font-normal">({item.score}%)</span>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getRatingBadgeStyle(
                    item.rating
                  )}`}
                >
                  {item.rating}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. I DID WELL */}
        <section className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-bold text-zinc-900 tracking-tight mb-3">
            3. I Did Well
          </h2>

          <div className="space-y-2.5">
            {didWellPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed font-normal">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. PRACTICE NEXT */}
        <section className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-bold text-zinc-900 tracking-tight mb-3">
            4. Practice Next
          </h2>

          <div className="space-y-2.5">
            {practiceNextPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed font-normal">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. MY NATURAL ENGLISH */}
        <section className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              5. My Natural English
            </h2>
            {isRefiningPairs && (
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Refining</span>
              </div>
            )}
          </div>

          <div className="space-y-3.5">
            {naturalPairs.map((pair, idx) => (
              <div
                key={pair.id || idx}
                className="bg-zinc-50 border border-zinc-200/70 rounded-xl p-3.5"
              >
                <div className="mb-2">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-0.5">
                    What you said
                  </span>
                  <p className="text-xs text-zinc-600 font-normal italic">
                    "{pair.original}"
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-200/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider block">
                      Natural English
                    </span>
                    <button
                      onClick={() => handlePlayAudio(pair.natural, `pair-audio-${idx}`)}
                      className={`p-1 rounded-lg flex items-center gap-1 text-[11px] font-semibold cursor-pointer transition-colors ${
                        playingId === `pair-audio-${idx}`
                          ? 'text-zinc-950 font-bold'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                      title="Listen to natural sentence"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{playingId === `pair-audio-${idx}` ? 'Playing' : 'Listen'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-900 font-semibold leading-relaxed">
                    "{pair.natural}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. NEXT TIME */}
        <section className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-zinc-700" />
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              6. Next Time
            </h2>
          </div>
          <p className="text-xs text-zinc-700 leading-relaxed font-normal">
            {nextTimeGoal}
          </p>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-2.5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onStartNewDay}
          className="w-full py-3.5 px-4 rounded-2xl bg-zinc-900 hover:bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-white" />
          <span>Practice Another Day Story</span>
        </motion.button>

        <button
          onClick={onGoBackToChat}
          className="w-full py-2.5 px-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium text-xs transition-colors cursor-pointer text-center"
        >
          Review Full Conversation Transcript
        </button>
      </div>

      {/* 30-Day Confidence Progress Modal */}
      <EnglishProgressScreen
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        turns={turns}
        dayMap={dayMap}
        initialTab={0}
      />
    </div>
  );
};
