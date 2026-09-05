import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Flame,
  MessageSquare,
  Zap,
  Music,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { getPlaygroundDaySnapshots, DailyPlaygroundSnapshot } from '../../utils/playgroundManager';

interface PlaygroundAwardsSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlayground?: () => void;
}

export const PlaygroundAwardsSnapshotModal: React.FC<PlaygroundAwardsSnapshotModalProps> = ({
  isOpen,
  onClose,
  onOpenPlayground,
}) => {
  const snapshots: DailyPlaygroundSnapshot[] = React.useMemo(() => {
    if (!isOpen) return [];
    try {
      return getPlaygroundDaySnapshots();
    } catch (e) {
      return [];
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/75 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#111317] border border-zinc-800 rounded-2xl p-5 text-zinc-100 shadow-2xl relative flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 shrink-0">
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Daily Activity Snapshots
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Day-by-day record of speaking exercises and milestones
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-header / metadata row */}
            <div className="py-2.5 px-3 sm:px-4 flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/80 shrink-0">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Recent Activity Log</span>
              </div>
              <span className="text-zinc-500 font-medium text-[11px]">
                {snapshots.length} {snapshots.length === 1 ? 'day' : 'days'} recorded
              </span>
            </div>

            {/* Flat List (Structured rows with subtle horizontal dividers & background tint) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 divide-y divide-zinc-800/40">
              {snapshots.map((snap, index) => {
                const isFull = snap.completionPercent >= 100;
                return (
                  <div
                    key={snap.id}
                    className={`py-4 sm:py-4.5 px-3 sm:px-4 flex items-center justify-between gap-3 sm:gap-4 transition-colors ${
                      snap.isToday
                        ? 'bg-amber-500/[0.04]'
                        : index % 2 === 1
                        ? 'bg-zinc-900/25'
                        : 'bg-transparent'
                    } hover:bg-zinc-800/25`}
                  >
                    {/* Left: Date & De-emphasized Status on the Same Line */}
                    <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap min-w-[58px] sm:min-w-[64px]">
                        {snap.formattedDate}
                      </span>
                      <span className="text-zinc-700 text-xs">—</span>

                      {/* Clean Status Dot & De-emphasized Percentage */}
                      <div className="flex items-center gap-1.5 text-xs shrink-0">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isFull
                              ? 'bg-emerald-400'
                              : snap.completionPercent > 0
                              ? 'bg-amber-400'
                              : 'bg-zinc-600'
                          }`}
                        />
                        <span className="text-zinc-300 font-medium whitespace-nowrap text-xs">
                          {snap.completionPercent}%{' '}
                          <span className="text-zinc-500 font-light text-[11px]">Done</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Metrics aligned into strict vertical columns across all days */}
                    <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 items-center shrink-0">
                      {/* Sheeko (Flame) */}
                      <div
                        className="flex items-center justify-start gap-1.5 w-9 sm:w-11 text-zinc-400 hover:text-zinc-200 transition-colors"
                        title={`Sheeko: ${snap.sheekoCount}`}
                      >
                        <Flame className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="text-xs font-medium text-zinc-200 tabular-nums">
                          {snap.sheekoCount}
                        </span>
                      </div>

                      {/* Buddy (Comment bubble) */}
                      <div
                        className="flex items-center justify-start gap-1.5 w-9 sm:w-11 text-zinc-400 hover:text-zinc-200 transition-colors"
                        title={`Buddy: ${snap.buddyCount}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="text-xs font-medium text-zinc-200 tabular-nums">
                          {snap.buddyCount}
                        </span>
                      </div>

                      {/* Bytes (Lightning) */}
                      <div
                        className="flex items-center justify-start gap-1.5 w-9 sm:w-11 text-zinc-400 hover:text-zinc-200 transition-colors"
                        title={`Bytes: ${snap.bytesCount}`}
                      >
                        <Zap className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="text-xs font-medium text-zinc-200 tabular-nums">
                          {snap.bytesCount}
                        </span>
                      </div>

                      {/* Rock & Roll (Music note) */}
                      <div
                        className="flex items-center justify-start gap-1.5 w-9 sm:w-11 text-zinc-400 hover:text-zinc-200 transition-colors"
                        title={`Rock & Roll: ${snap.rockRollCount}`}
                      >
                        <Music className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="text-xs font-medium text-zinc-200 tabular-nums">
                          {snap.rockRollCount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-3.5 mt-2 border-t border-zinc-800/80 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-zinc-500">
                Completed plans update daily automatically
              </span>

              {onOpenPlayground && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPlayground();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Playground</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

