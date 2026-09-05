import React from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Award,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { ActiveTopic, DayMap } from '../../types';
import { CoachNehaAvatar } from '../CoachNehaAvatar';

interface TopicCompletionCardProps {
  topic: ActiveTopic;
  completionSummary?: string;
  dayMap: DayMap;
  onSelectNextTopic: (pointer: string, category: 'ACTIVITY' | 'EMOTION' | 'ENVIRONMENT') => void;
  onViewSummary: () => void;
  onGoBackToDayMap: () => void;
  completedTopics: string[];
}

export const TopicCompletionCard: React.FC<TopicCompletionCardProps> = ({
  topic,
  completionSummary,
  dayMap,
  onSelectNextTopic,
  onViewSummary,
  onGoBackToDayMap,
  completedTopics = [],
}) => {
  const remainingActivities = (dayMap.activities || []).filter(
    (act) => !completedTopics.includes(act) && act !== topic.pointer
  );

  return (
    <div className="w-full flex-1 flex flex-col px-4 pt-6 pb-24 text-zinc-100 max-w-[440px] mx-auto">
      {/* Celebration Hero Box */}
      <div className="bg-gradient-to-b from-amber-500/20 via-zinc-900 to-zinc-950 border border-amber-500/40 rounded-3xl p-6 mb-5 text-center relative overflow-hidden shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/30">
          <Trophy className="w-8 h-8 text-zinc-950 stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Topic Mastered!</span>
        </div>

        <h2 className="text-xl font-black text-white leading-tight mb-2">
          Great Job Sharing This Moment!
        </h2>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-xs mx-auto">
          {completionSummary ||
            `You explained "${topic.pointer}" with natural confidence, descriptive details, and polite workplace phrasing.`}
        </p>
      </div>

      {/* Recommended Next Topics from Day Map */}
      {remainingActivities.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5 px-1 flex items-center justify-between">
            <span>Next Suggested Topic</span>
            <span className="text-[10px] text-amber-400 font-semibold">Keep Momentum</span>
          </h3>

          <div className="flex flex-col gap-2">
            {remainingActivities.slice(0, 2).map((act, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectNextTopic(act, 'ACTIVITY')}
                className="w-full text-left p-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors">
                    {act}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto flex flex-col gap-2.5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onViewSummary}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <span>View Full Day Session Summary</span>
          <ArrowRight className="w-4 h-4 text-zinc-950" />
        </motion.button>

        <button
          onClick={onGoBackToDayMap}
          className="w-full py-3 px-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition-colors cursor-pointer text-center"
        >
          Return to Day Map
        </button>
      </div>
    </div>
  );
};
