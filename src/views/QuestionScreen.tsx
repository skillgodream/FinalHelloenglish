import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  MoreHorizontal,
  Volume2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Square,
} from 'lucide-react';
import { CoachNehaAvatar } from '../components/CoachNehaAvatar';
import { Question } from '../types';
import { speakText, stopSpeaking, soundFx } from '../utils/audio';

interface QuestionScreenProps {
  question: Question;
  onBack: () => void;
  onContinue: () => void;
  onShuffleQuestion?: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  onBack,
  onContinue,
  onShuffleQuestion,
}) => {
  const [playingAudio, setPlayingAudio] = useState<'en' | 'hi' | null>(null);
  const [showTips, setShowTips] = useState<boolean>(false);

  useEffect(() => {
    // Play subtle soft chime when question screen opens
    soundFx.playBubbleStart();
    return () => {
      stopSpeaking();
    };
  }, [question.id]);

  const handleListenEnglish = () => {
    if (playingAudio === 'en') {
      stopSpeaking();
      setPlayingAudio(null);
      return;
    }
    stopSpeaking();
    setPlayingAudio('en');
    speakText(question.questionEn, 'en-IN', 0.9, () => {
      setPlayingAudio(null);
    });
  };

  const handleListenHindi = () => {
    if (playingAudio === 'hi') {
      stopSpeaking();
      setPlayingAudio(null);
      return;
    }
    stopSpeaking();
    setPlayingAudio('hi');
    speakText(question.questionHi, 'hi-IN', 0.92, () => {
      setPlayingAudio(null);
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#FDF4FF] via-[#F8F7FF] to-[#FFF1F5] text-slate-900 flex flex-col justify-between pb-6 pt-3 px-4 sm:px-5">
      {/* Top Navigation Bar */}
      <div>
        <div className="flex items-center justify-between py-2 border-b border-[#E9D5FF]/70">
          {/* Back Button */}
          <button
            onClick={() => {
              stopSpeaking();
              onBack();
            }}
            className="w-10 h-10 rounded-full bg-white/95 border border-[#E9D5FF] flex items-center justify-center text-slate-700 hover:bg-[#FAF5FF] hover:border-[#D8B4FE] transition-colors shadow-2xs cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Center Title */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-extrabold text-slate-900 tracking-tight">
              Coach Neha
            </span>
            <span className="text-[10px] font-bold text-[#7C3AED] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ready to help
            </span>
          </div>

          {/* Right Action Menu */}
          <button
            onClick={onShuffleQuestion}
            className="w-10 h-10 rounded-full bg-white/95 border border-[#E9D5FF] flex items-center justify-center text-slate-700 hover:bg-[#FAF5FF] hover:border-[#D8B4FE] transition-colors shadow-2xs cursor-pointer"
            title="Next scenario"
            aria-label="Options"
          >
            <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Coach Neha Avatar Showcase */}
        <div className="flex flex-col items-center mt-6 mb-4">
          <div className="relative p-2 rounded-full bg-gradient-to-tr from-[#8B5CF6]/30 via-[#EC4899]/25 to-[#38BDF8]/30 backdrop-blur-xs">
            <CoachNehaAvatar
              size="xl"
              showBadge
              isSpeaking={playingAudio !== null}
            />
          </div>
          <p className="text-xs font-bold text-slate-600 mt-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
            {question.categoryLabel}
          </p>
        </div>

        {/* LARGE VIBRANT CONVERSATION CARD */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#FFFBEB] via-[#FFF1F2] to-[#FAF5FF] border border-[#FED7AA] pastel-card-shadow relative overflow-hidden"
        >
          {/* Card Eyebrow */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#7C3AED] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
              Coach Neha asks
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#6B21A8] border border-[#E9D5FF]">
              {question.level}
            </span>
          </div>

          {/* Question Text */}
          <blockquote className="text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed">
            “{question.questionEn}”
          </blockquote>

          {/* Hindi Comprehension Text Box */}
          <div className="mt-3 p-3 rounded-2xl bg-white/80 border border-[#FED7AA] text-xs font-medium text-slate-700 leading-relaxed">
            <span className="font-bold text-[#C2410C] mr-1">हिंदी अर्थ:</span>
            {question.questionHi}
          </div>

          {/* TWO LARGE PILL BUTTONS (As Requested) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
            {/* Button 1: Listen in English */}
            <button
              onClick={handleListenEnglish}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-2xs ${
                playingAudio === 'en'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white border-[#7C3AED] shadow-md shadow-[#7C3AED]/25'
                  : 'bg-white text-slate-800 border-[#E9D5FF] hover:bg-[#FAF5FF] hover:border-[#D8B4FE]'
              }`}
            >
              {playingAudio === 'en' ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Playing English...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#7C3AED]" />
                  <span>Listen in English</span>
                </>
              )}
            </button>

            {/* Button 2: Listen in Hindi */}
            <button
              onClick={handleListenHindi}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-2xs ${
                playingAudio === 'hi'
                  ? 'bg-gradient-to-r from-[#E11D48] to-[#F43F5E] text-white border-[#E11D48] shadow-md shadow-[#E11D48]/25'
                  : 'bg-white text-slate-800 border-[#FECDD3] hover:bg-[#FFF1F2]'
              }`}
            >
              {playingAudio === 'hi' ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>हिंदी में बोल रहे हैं...</span>
                </>
              ) : (
                <>
                  <span>🇮🇳</span>
                  <span>सुनें हिंदी में</span>
                </>
              )}
            </button>
          </div>

          {/* Hindi comprehension note */}
          <p className="text-[10px] font-medium text-slate-500 text-center mt-3">
            💡 Hindi is for your understanding. You will speak your answer in English.
          </p>
        </motion.div>

        {/* Optional Hint Toggle */}
        <div className="mt-3">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full py-2 px-3 rounded-xl bg-white/80 border border-[#E9D5FF] text-[11px] font-semibold text-slate-700 flex items-center justify-between cursor-pointer hover:bg-white"
          >
            <span className="flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
              {showTips ? 'Hide speaking hint' : 'Need an idea? View speaking hint'}
            </span>
            <span className="text-[10px] font-bold text-[#7C3AED]">
              {showTips ? 'Close' : 'View'}
            </span>
          </button>

          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-amber-900 space-y-1"
            >
              <p className="font-bold text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                Speaking Tip:
              </p>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                {question.hintEn}
              </p>
              <p className="text-[11px] text-amber-800 italic">
                ({question.hintHi})
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* BOTTOM CTA: Large Rounded Gradient Button (Continue to Speak →) */}
      <div className="sticky bottom-0 mt-6 pt-3 pb-2 bg-gradient-to-t from-[#FFF1F5] via-[#FFF1F5]/95 to-transparent backdrop-blur-xs z-20">
        <button
          onClick={() => {
            stopSpeaking();
            onContinue();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#DB2777] to-[#EA580C] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-[#DB2777]/30 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Continue to Speak</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
