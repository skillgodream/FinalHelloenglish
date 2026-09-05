import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Flame,
  Users,
  Compass,
  Music,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  X,
  RotateCcw,
  CheckCircle2,
  Clock,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  getSheekoJourney,
  getPlaygroundData,
  SheekoJourney,
  PlaygroundPlan,
} from '../../utils/playgroundManager';
import { PlaygroundRemindersWidget } from './PlaygroundRemindersWidget';

interface PlaygroundViewProps {
  onExit: () => void;
  onNavigateTab: (tab: string, extra?: any) => void;
  onRestartQuestions?: () => void;
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  onExit,
  onNavigateTab,
  onRestartQuestions,
}) => {
  const journey: SheekoJourney | null = getSheekoJourney();
  const plan: PlaygroundPlan = getPlaygroundData();

  const journeyLength = journey ? journey.journeyLength : 3;
  const currentDay = journey ? journey.currentDay : 1;
  const journeyPercent = Math.min(100, Math.round((currentDay / journeyLength) * 100));

  // Expanded states for activity accordion cards
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedActivity((prev) => (prev === id ? null : id));
  };

  const totalTarget =
    (plan.buddyTargetCount || 0) +
    (plan.bytesTargetCount || 0) +
    (plan.rockRollTargetCount || 0);

  const totalCompleted =
    (plan.buddyCompletedCount || 0) +
    (plan.bytesCompletedCount || 0) +
    (plan.rockRollCompletedCount || 0);

  const completionRate = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

  return (
    <div className="w-full flex-1 flex flex-col justify-between text-zinc-100 min-h-screen relative bg-[#0d1117] select-none font-sans">
      {/* 1. Subtle, Clean Minimalist Backdrop (Professional & Non-flashy) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(13,17,23,0.8)_100%)]" />
      </div>

      {/* 2. Main Content Container */}
      <div className="w-full flex-1 flex flex-col justify-between px-5 pt-6 pb-8 relative z-10 max-w-[440px] mx-auto min-h-screen">
        {/* Top Header Navigation Bar */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <button
            onClick={onExit}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-300 tracking-wide">
              Daily Playground
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              Active Plan
            </span>
          </div>

          {onRestartQuestions ? (
            <button
              onClick={onRestartQuestions}
              className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/60 transition-colors cursor-pointer"
              title="Reset and Customize Plan"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>
          ) : (
            <div className="w-9" />
          )}
        </div>

        {/* Core Content Area */}
        <div className="w-full flex-1 flex flex-col justify-center my-auto py-4 space-y-4">
          {/* Header Summary Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4.5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3.5">
              <div>
                <h1 className="text-base font-semibold text-white tracking-tight">
                  Today's Practice Session
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Structured speaking drills and core workplace modules
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-zinc-400 block">Progress</span>
                <span className="text-sm font-bold text-amber-400">
                  {totalCompleted}/{totalTarget} Done
                </span>
              </div>
            </div>

            {/* Journey Milestone Bar */}
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2 font-medium text-zinc-300">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Sheeko Journey • Day {currentDay} of {journeyLength}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-400">
                  {journeyPercent}% complete
                </span>
              </div>

              <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${journeyPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Activity Modules List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-zinc-400 tracking-wide">
                Assigned Modules
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                {totalTarget - totalCompleted > 0
                  ? `${totalTarget - totalCompleted} remaining`
                  : 'All completed'}
              </span>
            </div>

            {/* 1. Buddy Module */}
            {(() => {
              const completed = plan.buddyCompletedCount || 0;
              const target = plan.buddyTargetCount || 1;
              const isDone = completed >= target;
              return (
                <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl overflow-hidden transition-colors shadow-sm">
                  <button
                    onClick={() => toggleExpand('buddy')}
                    className="w-full p-4 flex items-center justify-between cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Users className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">AI Buddy Conversation</h3>
                          {isDone && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Done
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Speaking roleplay & fluid conversation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-medium text-zinc-400 bg-zinc-800 px-2 py-1 rounded-lg">
                        {completed}/{target}
                      </span>
                      <div className="text-zinc-500">
                        {expandedActivity === 'buddy' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedActivity === 'buddy' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 pt-1 border-t border-zinc-800/80 bg-zinc-950/40"
                      >
                        <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
                          Engage in guided workplace conversations, pronunciation fine-tuning, and open-ended dialogues.
                        </p>
                        <button
                          onClick={() => onNavigateTab('buddy')}
                          className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Start Buddy Conversation</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}

            {/* 2. Bytes Module */}
            {(() => {
              const completed = plan.bytesCompletedCount || 0;
              const target = plan.bytesTargetCount || 2;
              const isDone = completed >= target;
              return (
                <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl overflow-hidden transition-colors shadow-sm">
                  <button
                    onClick={() => toggleExpand('bytes')}
                    className="w-full p-4 flex items-center justify-between cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Compass className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">Daily Bytes Lessons</h3>
                          {isDone && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Done
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Micro-lessons, idioms & sentence structures
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-medium text-zinc-400 bg-zinc-800 px-2 py-1 rounded-lg">
                        {completed}/{target}
                      </span>
                      <div className="text-zinc-500">
                        {expandedActivity === 'bytes' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedActivity === 'bytes' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 pt-1 border-t border-zinc-800/80 bg-zinc-950/40"
                      >
                        <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
                          Master high-frequency business phrases, correct grammatical nuance, and concise vocabulary.
                        </p>
                        <button
                          onClick={() => onNavigateTab('learn')}
                          className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Open Daily Bytes</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}

            {/* 3. Rock & Roll Module */}
            {(() => {
              const completed = plan.rockRollCompletedCount || 0;
              const target = plan.rockRollTargetCount || 1;
              const isDone = completed >= target;
              return (
                <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl overflow-hidden transition-colors shadow-sm">
                  <button
                    onClick={() => toggleExpand('rockroll')}
                    className="w-full p-4 flex items-center justify-between cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Music className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">Scenario Speed Drills</h3>
                          {isDone && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Done
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Rapid reaction & fluency challenges
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-medium text-zinc-400 bg-zinc-800 px-2 py-1 rounded-lg">
                        {completed}/{target}
                      </span>
                      <div className="text-zinc-500">
                        {expandedActivity === 'rockroll' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedActivity === 'rockroll' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 pt-1 border-t border-zinc-800/80 bg-zinc-950/40"
                      >
                        <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
                          Sharpen your English instinct with timed scenario responses and interactive challenges.
                        </p>
                        <button
                          onClick={() => onNavigateTab('rockroll')}
                          className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Start Speed Drills</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}
          </div>

          {/* Today's Reminders Management Widget */}
          <PlaygroundRemindersWidget />
        </div>

        {/* Footer info note */}
        <div className="text-center pt-3 pb-1 border-t border-zinc-800/60">
          <p className="text-xs text-zinc-500 font-medium">
            Progress updates automatically as you complete activities
          </p>
        </div>
      </div>
    </div>
  );
};

