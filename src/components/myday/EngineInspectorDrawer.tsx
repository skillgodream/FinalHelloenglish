import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sliders,
  Sparkles,
  Activity,
  CheckCircle2,
  HelpCircle,
  Zap,
  Tag,
  Smile,
  MapPin,
} from 'lucide-react';
import { DayMap, DeepAnalysis } from '../../types';

interface EngineInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dayMap: DayMap;
  answeredQuestions: string[];
  latestAnalysis?: DeepAnalysis;
}

export const EngineInspectorDrawer: React.FC<EngineInspectorDrawerProps> = ({
  isOpen,
  onClose,
  dayMap,
  answeredQuestions = [],
  latestAnalysis,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
        />

        {/* Drawer Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-sm h-full bg-zinc-950 border-l border-zinc-800 p-5 overflow-y-auto flex flex-col text-zinc-100 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Engine Inspector</h3>
                <p className="text-[10px] text-zinc-400">Real-time Semantic AST & Telemetry</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Metric Badges & Deep Analysis Breakdown */}
          {latestAnalysis && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 mb-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Fluency Score</span>
                <span className="font-extrabold text-emerald-400">{latestAnalysis.fluencyScore || 88}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Clarity Score</span>
                <span className="font-extrabold text-sky-400">{latestAnalysis.clarityScore || 90}%</span>
              </div>
              {latestAnalysis.mainMeaning && (
                <div className="text-xs">
                  <span className="text-zinc-400 block mb-0.5 font-bold uppercase text-[9px]">Captured Meaning (Rule 2 & 9)</span>
                  <span className="font-medium text-amber-300">“{latestAnalysis.mainMeaning}”</span>
                </div>
              )}
              {latestAnalysis.newActivity && (
                <div className="text-xs">
                  <span className="text-zinc-400 block mb-0.5 font-bold uppercase text-[9px] text-sky-400">New Activity Discovered (Rule 12)</span>
                  <span className="font-semibold text-sky-300">{latestAnalysis.newActivity}</span>
                </div>
              )}
              {latestAnalysis.emotion && (
                <div className="text-xs">
                  <span className="text-zinc-400 block mb-0.5 font-bold uppercase text-[9px] text-pink-400">Emotion / Reaction (Rule 13)</span>
                  <span className="font-semibold text-pink-300">{latestAnalysis.emotion}</span>
                </div>
              )}
              {latestAnalysis.problem && (
                <div className="text-xs">
                  <span className="text-zinc-400 block mb-0.5 font-bold uppercase text-[9px] text-rose-400">Problem / Challenge</span>
                  <span className="font-semibold text-rose-300">{latestAnalysis.problem}</span>
                </div>
              )}

              {latestAnalysis.detectedPatterns && latestAnalysis.detectedPatterns.length > 0 && (
                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                    Detected Patterns
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {latestAnalysis.detectedPatterns.map((p, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-purple-500/15 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mapped Activities */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              Day Map Activities ({dayMap.activities?.length || 0})
            </h4>
            <div className="space-y-1.5">
              {(dayMap.activities || []).map((act, i) => (
                <div
                  key={i}
                  className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 flex items-center gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center text-zinc-400 font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="truncate">{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Answered Questions History */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Answered Probe Questions ({answeredQuestions.length})
            </h4>
            {answeredQuestions.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No probe questions asked yet in this session.</p>
            ) : (
              <div className="space-y-1.5">
                {answeredQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-2 text-xs text-zinc-300"
                  >
                    “{q}”
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Raw JSON AST */}
          <div className="mt-auto pt-4 border-t border-zinc-800">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
              Raw State JSON
            </span>
            <pre className="text-[10px] bg-zinc-900 p-2 rounded-xl text-zinc-400 overflow-x-auto max-h-36">
              {JSON.stringify(dayMap, null, 2)}
            </pre>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
