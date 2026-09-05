import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Activity as ActivityIcon,
  Volume2,
  VolumeX,
  RotateCcw,
  Compass,
  Zap,
  Heart,
  Star,
  Check,
  Circle,
  Users,
} from 'lucide-react';
import { DayMap, ActiveTopic } from '../../types';
import { synthesizeNaturalEnglishStory } from '../../data/sheekoEngine';

interface DayMapVisualizerProps {
  dayMap: DayMap;
  selectedTopic: ActiveTopic | null;
  onSelectTopic: (pointer: string, category: 'ACTIVITY' | 'EMOTION' | 'ENVIRONMENT') => void;
  onSelectWholeStory: () => void;
  onContinueToConversation: () => void;
  onGoBack: () => void;
  completedTopics: string[];
  isWholeStorySelected: boolean;
  onOpenPatternLibrary?: () => void;
  onOpenInspector?: () => void;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
}

export const DayMapVisualizer: React.FC<DayMapVisualizerProps> = ({
  dayMap,
  selectedTopic,
  onSelectTopic,
  onSelectWholeStory,
  onContinueToConversation,
  onGoBack,
  completedTopics = [],
  isWholeStorySelected,
  onOpenPatternLibrary,
  onOpenInspector,
  voiceEnabled = true,
  onToggleVoice,
}) => {
  const activities = dayMap.activities && dayMap.activities.length > 0
    ? dayMap.activities
    : (dayMap.rawStatement ? [dayMap.rawStatement] : ['Completed daily routine and duties']);

  const emotions = dayMap.emotions && dayMap.emotions.length > 0
    ? dayMap.emotions
    : ['Felt focused and engaged'];

  const environments = dayMap.environments && dayMap.environments.length > 0
    ? dayMap.environments
    : ['Workplace and daily environment'];

  const naturalStory = dayMap.naturalEnglishStory || synthesizeNaturalEnglishStory({
    rawStatement: dayMap.rawStatement,
    activities: dayMap.activities,
    emotions: dayMap.emotions,
    knownFacts: dayMap.knownFacts,
  });

  const pointsCount = dayMap.pointsExtractedCount || (activities.length + emotions.length + environments.length);

  return (
    <div className="w-full flex-1 flex flex-col px-4 pt-3 pb-8 text-zinc-100 max-w-[460px] mx-auto min-h-[calc(100vh-80px)]">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between py-2 mb-3">
        {/* Left: Back Button + Day Summary title + Buddy Pill */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onGoBack}
            className="w-10 h-10 rounded-full bg-[#181920] hover:bg-[#232530] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div>
            <h2 className="text-sm font-bold text-white leading-none">Day Summary</h2>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-950/40 border border-sky-500/40 text-sky-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
            <span>Buddy</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {onOpenPatternLibrary && (
            <button
              onClick={onOpenPatternLibrary}
              className="w-9 h-9 rounded-full bg-[#181920] hover:bg-[#232530] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Patterns"
            >
              <BookOpen className="w-4 h-4 stroke-[2]" />
            </button>
          )}

          {onOpenInspector && (
            <button
              onClick={onOpenInspector}
              className="w-9 h-9 rounded-full bg-[#181920] hover:bg-[#232530] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Performance & Analysis"
            >
              <ActivityIcon className="w-4 h-4 stroke-[2]" />
            </button>
          )}

          {onToggleVoice && (
            <button
              onClick={onToggleVoice}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                voiceEnabled
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                  : 'bg-[#181920] border-zinc-800 text-zinc-400'
              }`}
              title={voiceEnabled ? 'Mute Voice' : 'Enable Voice'}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4 stroke-[2]" />
              ) : (
                <VolumeX className="w-4 h-4 stroke-[2]" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col gap-4">
        {/* SUMMARY Pill & Title */}
        <div className="flex flex-col gap-1.5 px-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-[11px] font-extrabold uppercase tracking-wide">
              SUMMARY
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              • {pointsCount} Points Extracted
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Here is your Day Summary
          </h1>
        </div>

        {/* Card 1: Natural English Story */}
        <div className="bg-gradient-to-b from-[#141824] to-[#14151c] border border-sky-500/40 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>NATURAL ENGLISH STORY:</span>
          </div>

          <p className="text-sm text-zinc-100 leading-relaxed font-medium">
            "{naturalStory}"
          </p>
        </div>

        {/* YOUR WORDS text below card */}
        {dayMap.rawStatement && (
          <div className="px-1 text-xs text-zinc-400 leading-normal">
            <span className="font-bold text-zinc-500 mr-1.5 uppercase tracking-wider text-[11px]">
              YOUR WORDS:
            </span>
            <span className="italic text-zinc-300">
              "{dayMap.rawStatement}"
            </span>
          </div>
        )}

        {/* CHOOSE WHAT TO TALK ABOUT Header */}
        <div className="flex items-center justify-between pt-2 px-1">
          <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">
            CHOOSE WHAT TO TALK ABOUT:
          </span>
          <span className="text-xs font-semibold text-sky-400">
            Select an option below
          </span>
        </div>

        {/* Option 1: Explore Entire (Whole Story) Card */}
        <div
          onClick={onSelectWholeStory}
          className={`rounded-3xl p-4 border transition-all cursor-pointer shadow-lg ${
            isWholeStorySelected
              ? 'bg-[#121622] border-sky-500/80 ring-2 ring-sky-500/30'
              : 'bg-[#14151c] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-white">Explore Entire</span>
          </div>

          {/* Current selection display inside */}
          <div className="bg-[#1b1d26] rounded-2xl p-3.5 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-sky-950/60 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Compass className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">
                  CURRENT SELECTION:
                </span>
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Whole Story as One Flow
                </span>
              </div>
            </div>

            {isWholeStorySelected && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onContinueToConversation();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-950/60 cursor-pointer"
              >
                <span>Start Conversation</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Section 2: OR CHOOSE ANY LISTED ACTIVITY / TOPIC */}
        <div className="pt-2 px-1">
          <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider block mb-3">
            OR CHOOSE ANY LISTED ACTIVITY / TOPIC:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* ACTIVITIES Box */}
            <div className="bg-[#14151c] border border-zinc-800 rounded-3xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Zap className="w-4 h-4 stroke-[2.5]" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-200">
                    ACTIVITIES
                  </span>
                </div>
                <span className="w-5 h-5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-extrabold flex items-center justify-center">
                  {activities.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {activities.map((act, idx) => {
                  const isSelected = !isWholeStorySelected && selectedTopic?.pointer === act;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectTopic(act, 'ACTIVITY')}
                      className={`w-full text-left py-3 px-4 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-sky-950/40 border-sky-500 text-white font-semibold ring-1 ring-sky-500/40'
                          : 'bg-[#1b1d26] border-zinc-800/80 hover:bg-[#22242f] text-zinc-300 font-normal'
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isSelected ? 'bg-sky-400 shadow-[0_0_6px_#38bdf8]' : 'bg-zinc-600'
                        }`}
                      />
                      <span className="text-xs flex-1 truncate">{act}</span>
                      {isSelected && <Check className="w-4 h-4 text-sky-400 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FEELINGS & MOOD Box */}
            {emotions.length > 0 && (
              <div className="bg-[#14151c] border border-zinc-800 rounded-3xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-rose-400">
                    <Heart className="w-4 h-4 stroke-[2.5]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-200">
                      FEELINGS & MOOD
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 text-[11px] font-extrabold flex items-center justify-center">
                    {emotions.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {emotions.map((emo, idx) => {
                    const isSelected = !isWholeStorySelected && selectedTopic?.pointer === emo;
                    return (
                      <button
                        key={idx}
                        onClick={() => onSelectTopic(emo, 'EMOTION')}
                        className={`w-full text-left py-3 px-4 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-rose-950/40 border-rose-500 text-white font-semibold ring-1 ring-rose-500/40'
                            : 'bg-[#1b1d26] border-zinc-800/80 hover:bg-[#22242f] text-zinc-300 font-normal'
                        }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            isSelected ? 'bg-rose-400 shadow-[0_0_6px_#f43f5e]' : 'bg-zinc-600'
                          }`}
                        />
                        <span className="text-xs flex-1 truncate">{emo}</span>
                        {isSelected && <Check className="w-4 h-4 text-rose-400 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CONTEXT & PEOPLE Box */}
            {environments.length > 0 && (
              <div className="bg-[#14151c] border border-zinc-800 rounded-3xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Users className="w-4 h-4 stroke-[2.5]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-200">
                      CONTEXT & PEOPLE
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[11px] font-extrabold flex items-center justify-center">
                    {environments.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {environments.map((env, idx) => {
                    const isSelected = !isWholeStorySelected && selectedTopic?.pointer === env;
                    return (
                      <button
                        key={idx}
                        onClick={() => onSelectTopic(env, 'ENVIRONMENT')}
                        className={`w-full text-left py-3 px-4 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-500 text-white font-semibold ring-1 ring-amber-500/40'
                            : 'bg-[#1b1d26] border-zinc-800/80 hover:bg-[#22242f] text-zinc-300 font-normal'
                        }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            isSelected ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' : 'bg-zinc-600'
                          }`}
                        />
                        <span className="text-xs flex-1 truncate">{env}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Current Selection & CTA (if specific topic chosen) */}
        {!isWholeStorySelected && selectedTopic && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#14151c] border border-sky-500/60 rounded-3xl p-4 mt-2 shadow-2xl flex flex-col gap-3 sticky bottom-4 z-20"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-sky-950/60 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Compass className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">
                  CURRENT SELECTION:
                </span>
                <span className="text-xs font-extrabold text-white truncate block mt-0.5">
                  {selectedTopic.pointer}
                </span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onContinueToConversation}
              className="w-full py-3.5 px-6 rounded-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-950/60 cursor-pointer"
            >
              <span>Start Conversation</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
