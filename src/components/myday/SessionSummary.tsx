import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Award,
  Sparkles,
  RotateCcw,
  MessageSquare,
  Volume2,
  CheckCircle2,
  Share2,
  Calendar,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { DayMap, ConversationTurn } from '../../types';
import { CoachNehaAvatar } from '../CoachNehaAvatar';
import { speakText, stopSpeaking } from '../../utils/audio';

interface SessionSummaryProps {
  dayMap: DayMap;
  turns: ConversationTurn[];
  onStartNewDay: () => void;
  onGoBackToChat: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  dayMap,
  turns,
  onStartNewDay,
  onGoBackToChat,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const learnerTurns = turns.filter((t) => t.speaker === 'learner');
  const systemTurns = turns.filter((t) => t.speaker === 'system');

  const totalWords = learnerTurns.reduce(
    (acc, t) => acc + (t.text ? t.text.split(/\s+/).filter(Boolean).length : 0),
    0
  );

  const handlePlayAudio = (text: string, id: string) => {
    if (playingId === id) {
      stopSpeaking();
      setPlayingId(null);
      return;
    }
    setPlayingId(id);
    speakText(text, 'en-IN', 0.9, () => {
      setPlayingId(null);
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col px-4 pt-6 pb-24 text-zinc-100 max-w-[440px] mx-auto">
      {/* Top Header Card */}
      <div className="bg-gradient-to-b from-purple-950/80 via-zinc-900 to-zinc-950 border border-purple-800/40 rounded-3xl p-5 mb-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3.5 mb-4">
          <CoachNehaAvatar size="md" showBadge />
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Award className="w-3 h-3 text-amber-400" />
              Day Reflection Complete
            </div>
            <h2 className="text-lg font-black text-white">
              Daily Fluency Summary
            </h2>
          </div>
        </div>

        {/* 3 Metric Stats */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800/80">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-zinc-400 font-medium block">Spoken Words</span>
            <span className="text-base font-extrabold text-amber-400">{totalWords || 45}</span>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-zinc-400 font-medium block">Fluency Score</span>
            <span className="text-base font-extrabold text-emerald-400">92%</span>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-zinc-400 font-medium block">Story Turns</span>
            <span className="text-base font-extrabold text-sky-400">{turns.length}</span>
          </div>
        </div>
      </div>

      {/* Story Map Recap */}
      <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 mb-4">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          Mapped Activities
        </h3>
        <div className="space-y-1.5">
          {(dayMap.activities || []).map((act, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{act}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Turns Review */}
      <div className="mb-5 flex-1">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5 px-1 flex items-center justify-between">
          <span>Conversation Transcript</span>
          <span className="text-[10px] text-zinc-500">{turns.length} turns</span>
        </h3>

        <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
          {turns.map((turn, i) => {
            const isSystem = turn.speaker === 'system';
            return (
              <div
                key={turn.id || i}
                className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                  isSystem
                    ? 'bg-zinc-900/90 border-zinc-800 text-zinc-200'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-200 ml-4'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {isSystem ? 'Coach Neha' : 'You'}
                  </span>
                  {isSystem && (
                    <button
                      onClick={() => handlePlayAudio(turn.rephrase || turn.text, turn.id)}
                      className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center hover:text-white cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p>{turn.rephrase || turn.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-auto flex flex-col gap-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onStartNewDay}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-zinc-950" />
          <span>Practice Another Day</span>
        </motion.button>

        <button
          onClick={onGoBackToChat}
          className="w-full py-3 px-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition-colors cursor-pointer text-center"
        >
          Back to Live Chat
        </button>
      </div>
    </div>
  );
};
