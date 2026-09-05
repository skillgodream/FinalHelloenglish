import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Layers,
  Flame,
  MessageSquare,
  Music,
  Zap,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { getPlaygroundData, getSheekoJourney, PlaygroundPlan } from '../../utils/playgroundManager';

interface PlaygroundReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlayground?: () => void;
  onOpenDailyReport?: () => void;
}

export const PlaygroundReportModal: React.FC<PlaygroundReportModalProps> = ({
  isOpen,
  onClose,
  onOpenPlayground,
  onOpenDailyReport,
}) => {
  if (!isOpen) return null;

  const plan: PlaygroundPlan = getPlaygroundData();
  const journey = getSheekoJourney();
  const currentDay = journey ? journey.currentDay : 1;
  const journeyLength = journey ? journey.journeyLength : 3;
  const journeyPercent = Math.min(
    100,
    Math.round((currentDay / journeyLength) * 100)
  );

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#111317] border border-zinc-800 rounded-2xl p-5 text-zinc-100 shadow-2xl relative flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/80">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Daily Progress Summary
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Consolidated plan and activity status
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content - Flat layout with clean dividers */}
          <div className="py-3 divide-y divide-zinc-800/60 text-xs">
            {/* Start My Day Status */}
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300">
                <Sparkles className="w-4 h-4 text-zinc-400" />
                <span>Morning Speaking Drills</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    plan.isStartMyDayDrillCompleted ? 'bg-emerald-400' : 'bg-zinc-500'
                  }`}
                />
                <span className="text-zinc-300 font-normal">
                  {plan.isStartMyDayDrillCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>

            {/* Sheeko Journey Progress */}
            <div className="py-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Flame className="w-4 h-4 text-zinc-400" />
                  <span>Sheeko Journey</span>
                </div>
                <span className="text-zinc-300 font-medium">
                  Day {currentDay} of {journeyLength} ({journeyPercent}%)
                </span>
              </div>
              <div className="w-full bg-zinc-800/70 rounded-full h-1.5 overflow-hidden">
                <div
                  style={{ width: `${journeyPercent}%` }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
            </div>

            {/* Activity Metrics in a clean horizontal grid without boxed outlines */}
            <div className="pt-3 grid grid-cols-3 gap-3 text-center">
              {/* Buddy */}
              <div className="py-2">
                <div className="flex items-center justify-center gap-1 text-zinc-400 mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">Buddy</span>
                </div>
                <div className="text-sm font-semibold text-zinc-100">
                  {plan.buddyCompletedCount || 0}
                  <span className="text-zinc-500 font-normal"> / {plan.buddyTargetCount || 2}</span>
                </div>
              </div>

              {/* Rock & Roll */}
              <div className="py-2">
                <div className="flex items-center justify-center gap-1 text-zinc-400 mb-1">
                  <Music className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">R&R</span>
                </div>
                <div className="text-sm font-semibold text-zinc-100">
                  {plan.rockRollCompletedCount || 0}
                  <span className="text-zinc-500 font-normal"> / {plan.rockRollTargetCount || 1}</span>
                </div>
              </div>

              {/* Bytes */}
              <div className="py-2">
                <div className="flex items-center justify-center gap-1 text-zinc-400 mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">Bytes</span>
                </div>
                <div className="text-sm font-semibold text-zinc-100">
                  {plan.bytesCompletedCount || 0}
                  <span className="text-zinc-500 font-normal"> / {plan.bytesTargetCount || 3}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-2.5 border-t border-zinc-800/80 space-y-2">
            {onOpenDailyReport && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDailyReport();
                }}
                className="w-full py-2.5 rounded-xl bg-[#151922] border border-sky-500/40 hover:border-sky-400 text-sky-300 hover:text-white text-xs font-semibold tracking-tight transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Open Daily English Report</span>
              </button>
            )}

            {onOpenPlayground && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPlayground();
                }}
                className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>Open Consolidated Plan</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
