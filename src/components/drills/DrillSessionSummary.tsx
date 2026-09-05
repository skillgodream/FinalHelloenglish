import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target,
  Mic,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { DrillTarget, DrillScoreSummary } from '../../types/drillTypes';

interface DrillSessionSummaryProps {
  target: DrillTarget;
  scores: DrillScoreSummary;
  onContinue: () => void;
  onRetryDrill?: () => void;
}

export const DrillSessionSummary: React.FC<DrillSessionSummaryProps> = ({
  target,
  scores,
  onContinue,
  onRetryDrill,
}) => {
  const getRatingBadgeColor = (rating: string) => {
    switch (rating) {
      case 'Great':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'Good':
        return 'bg-sky-50 text-sky-800 border-sky-200/80';
      case 'Getting Better':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'Needs Practice':
      default:
        return 'bg-rose-50 text-rose-800 border-rose-200/80';
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col px-4 pt-5 pb-24 text-zinc-900 max-w-[480px] mx-auto font-sans">
      {/* Header */}
      <div className="mb-4 px-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 text-zinc-600 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
          <span>Engine 2 • Drills for the Day</span>
        </div>
        <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
          Drill Session Summary
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Based on your actual responses and target accuracy.
        </p>
      </div>

      {/* Overall Drill Score Hero Banner */}
      <div className="mb-4 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1">
              Drill Session Score
            </div>
            <div className="text-sm font-semibold text-zinc-200">
              {scores.accuracyRating} Performance
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span>Overall Accuracy</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-4xl font-black text-white tracking-tight flex items-baseline">
              <span>{scores.overallAccuracy}</span>
              <span className="text-base font-bold text-zinc-400 ml-0.5">%</span>
            </div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
              Calculated Score
            </span>
          </div>
        </div>
      </div>

      {/* 1. Today's Practice (The actual target provided by the existing system) */}
      <div className="w-full bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Today's Practice
          </span>
        </div>
        <h2 className="text-lg font-bold text-zinc-900 mb-1">{target.title}</h2>
        <p className="text-sm text-zinc-600 leading-relaxed">{target.description}</p>
        {target.keyRuleOrTip && (
          <div className="mt-2.5 pt-2.5 border-t border-zinc-100 flex items-start gap-2 text-xs text-zinc-500">
            <span className="font-semibold text-zinc-700">Key rule:</span>
            <span>{target.keyRuleOrTip}</span>
          </div>
        )}
      </div>

      {/* 2. My Performance (Apple-style Clean Ratings) */}
      <div className="w-full bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            My Performance
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Accuracy */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-50/80 border border-zinc-100 text-center">
            <span className="text-[11px] text-zinc-500 font-medium mb-1">Accuracy</span>
            <span className="text-lg font-black text-zinc-950 mb-1">{scores.targetAccuracy}%</span>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRatingBadgeColor(
                scores.accuracyRating
              )}`}
            >
              {scores.accuracyRating}
            </span>
          </div>

          {/* Speaking */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-50/80 border border-zinc-100 text-center">
            <span className="text-[11px] text-zinc-500 font-medium mb-1">Speaking</span>
            <span className="text-lg font-black text-zinc-950 mb-1">{scores.sentenceMakingAccuracy}%</span>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRatingBadgeColor(
                scores.speakingRating
              )}`}
            >
              {scores.speakingRating}
            </span>
          </div>

          {/* Confidence */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-50/80 border border-zinc-100 text-center">
            <span className="text-[11px] text-zinc-500 font-medium mb-1">Confidence</span>
            <span className="text-lg font-black text-zinc-950 mb-1">{scores.firstAttemptAccuracy}%</span>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRatingBadgeColor(
                scores.confidenceRating
              )}`}
            >
              {scores.confidenceRating}
            </span>
          </div>
        </div>
      </div>

      {/* 3. I Did Well (1-2 evidence-based strengths) */}
      <div className="w-full bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            I Did Well
          </span>
        </div>
        <div className="space-y-2">
          {scores.didWell.map((strength, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-sm text-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <p className="leading-snug">{strength}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Practice Next (1-2 actual weaknesses) */}
      <div className="w-full bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Practice Next
          </span>
        </div>
        <div className="space-y-2">
          {scores.practiceNext.map((weakness, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-sm text-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
              <p className="leading-snug">{weakness}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. My Best Correction (exact learner sentence vs better English) */}
      {scores.bestCorrection && (
        <div className="w-full bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              My Best Correction
            </span>
          </div>

          <div className="space-y-3">
            {/* You said */}
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                You said:
              </div>
              <div className="text-sm font-medium text-zinc-700 italic">
                "{scores.bestCorrection.original}"
              </div>
            </div>

            {/* Better English */}
            <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100">
              <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-sky-600" />
                <span>Better English:</span>
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                "{scores.bestCorrection.betterEnglish}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Next Practice (One simple action) */}
      <div className="w-full bg-zinc-900 text-white rounded-2xl p-4 shadow-sm mb-6">
        <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
          Next Practice
        </span>
        <p className="text-sm text-zinc-200 leading-relaxed font-medium">
          {scores.nextPracticeAction}
        </p>
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="mt-auto pt-2 flex items-center gap-3">
        {onRetryDrill && (
          <button
            onClick={onRetryDrill}
            className="flex-1 py-3.5 px-4 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-zinc-500" />
            <span>Practice Again</span>
          </button>
        )}
        <button
          onClick={onContinue}
          className="flex-1 py-3.5 px-4 rounded-xl bg-zinc-950 text-white font-semibold text-sm hover:bg-zinc-800 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span>Done</span>
          <ArrowRight className="w-4 h-4 text-zinc-300" />
        </button>
      </div>
    </div>
  );
};
