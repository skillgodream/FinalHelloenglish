import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  ArrowRight,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Square,
} from 'lucide-react';
import { AnalysisResult, Question } from '../types';
import { speakText, stopSpeaking, soundFx } from '../utils/audio';

interface ResultScreenProps {
  question: Question;
  result: AnalysisResult;
  onTryAgain: () => void;
  onNextQuestion: () => void;
  onSavePhrase?: (saved: boolean) => void;
  isSaved?: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  question,
  result,
  onTryAgain,
  onNextQuestion,
  onSavePhrase,
  isSaved = false,
}) => {
  const [isPlayingCoach, setIsPlayingCoach] = useState<boolean>(false);
  const [isPlayingLearner, setIsPlayingLearner] = useState<boolean>(false);
  const [isPlayingHindi, setIsPlayingHindi] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.92);
  const [saved, setSaved] = useState<boolean>(isSaved);

  useEffect(() => {
    // Play celebratory sound & soft confetti burst
    soundFx.playSuccessChime();
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#D6A9FF', '#FFAEC9', '#90E0EF', '#FFE180'],
      });
    } catch (e) {}

    // Automatically speak Coach Neha's improved sentence
    const timer = setTimeout(() => {
      handlePlayCoachAudio();
    }, 600);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, []);

  const handlePlayCoachAudio = (rate?: number) => {
    const activeRate = rate || speechRate;
    if (isPlayingCoach) {
      stopSpeaking();
      setIsPlayingCoach(false);
      return;
    }
    stopSpeaking();
    setIsPlayingLearner(false);
    setIsPlayingHindi(false);
    setIsPlayingCoach(true);

    speakText(result.naturalEnglish, 'en-IN', activeRate, () => {
      setIsPlayingCoach(false);
    });
  };

  const handlePlayHindiAudio = () => {
    if (isPlayingHindi) {
      stopSpeaking();
      setIsPlayingHindi(false);
      return;
    }
    stopSpeaking();
    setIsPlayingCoach(false);
    setIsPlayingLearner(false);
    setIsPlayingHindi(true);

    speakText(result.hindiMeaning, 'hi-IN', 0.9, () => {
      setIsPlayingHindi(false);
    });
  };

  const handlePlayLearnerAudio = () => {
    if (isPlayingLearner) {
      stopSpeaking();
      setIsPlayingLearner(false);
      return;
    }
    stopSpeaking();
    setIsPlayingCoach(false);
    setIsPlayingHindi(false);
    setIsPlayingLearner(true);

    speakText(result.learnerTranscript, 'en-IN', 0.95, () => {
      setIsPlayingLearner(false);
    });
  };

  const handleToggleSave = () => {
    const nextState = !saved;
    setSaved(nextState);
    if (onSavePhrase) {
      onSavePhrase(nextState);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#FDF4FF] via-[#F8F7FF] to-[#FFF1F5] text-slate-900 flex flex-col justify-between pb-6 pt-3 px-4 sm:px-5">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between py-2 border-b border-[#E9D5FF]/70">
          <button
            onClick={onTryAgain}
            className="w-10 h-10 rounded-full bg-white/95 border border-[#E9D5FF] flex items-center justify-center text-slate-700 hover:bg-[#FAF5FF] hover:border-[#D8B4FE] transition-colors shadow-2xs cursor-pointer"
            aria-label="Try again"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
              HELLO ENGLISH
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              Practice Feedback
            </span>
          </div>

          {/* Save phrase bookmark button */}
          <button
            onClick={handleToggleSave}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors shadow-2xs cursor-pointer ${
              saved
                ? 'bg-[#FFF1F2] text-[#E11D48] border-[#FDA4AF]'
                : 'bg-white/95 text-slate-600 border-[#E9D5FF] hover:bg-[#FAF5FF]'
            }`}
            title={saved ? 'Saved to Practice Book' : 'Save to Practice Book'}
          >
            {saved ? (
              <BookmarkCheck className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Bookmark className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>
        </div>

        {/* TWO PRIMARY INTERACTIVE CARDS */}
        <div className="space-y-4 mt-4">
          {/* CARD 1 — What you said (Refined typography & Integrated Smart Speaker Tab) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl p-5 bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF]/80 to-[#EDE9FE] border border-[#DDD6FE] pastel-card-shadow relative"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#6D28D9] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                What you said
              </span>

              {/* Smart Speaker Tab for Learner Speech */}
              <button
                onClick={handlePlayLearnerAudio}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                  isPlayingLearner
                    ? 'bg-[#7C3AED] text-white border-[#6D28D9] shadow-sm'
                    : 'bg-white/95 text-[#6D28D9] border-[#DDD6FE] hover:bg-[#FAF5FF] hover:border-[#C4B5FD]'
                }`}
                title="Listen to your recording"
              >
                {isPlayingLearner ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Playing...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            </div>

            {/* Increased text font size for learner speech */}
            <p className="text-base sm:text-lg md:text-xl font-bold text-slate-900 leading-snug">
              “{result.learnerTranscript}”
            </p>

            {/* What you mean (Learner's intended meaning) */}
            {result.intendedMeaning && (
              <div className="mt-3.5 pt-3 border-t border-[#DDD6FE]/70">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#6D28D9] block mb-1">
                  What you mean
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed">
                  “{result.intendedMeaning}”
                </p>
              </div>
            )}
          </motion.div>

          {/* CARD 2 — What you want to say (Larger System Response & Clean Visual Hierarchy) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#FFFBEB] via-[#FFF1F2] to-[#FAF5FF] border-2 border-[#FED7AA] pastel-card-glow relative overflow-hidden"
          >
            {/* Header with pill and speed controls */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white text-xs font-black shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                What you want to say
              </div>

              {/* Speed Toggle for Listen */}
              <div className="flex items-center gap-1 bg-white/90 border border-[#E9D5FF] p-0.5 rounded-full text-[10px] font-bold">
                <button
                  onClick={() => {
                    setSpeechRate(0.92);
                    handlePlayCoachAudio(0.92);
                  }}
                  className={`px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                    speechRate === 0.92 ? 'bg-[#7C3AED] text-white' : 'text-slate-600'
                  }`}
                >
                  1.0x
                </button>
                <button
                  onClick={() => {
                    setSpeechRate(0.78);
                    handlePlayCoachAudio(0.78);
                  }}
                  className={`px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                    speechRate === 0.78 ? 'bg-[#7C3AED] text-white' : 'text-slate-600'
                  }`}
                >
                  Slow 0.8x
                </button>
              </div>
            </div>

            {/* Increased Text Size for System Rephrase */}
            <div className="my-3.5">
              <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-snug tracking-tight">
                “{result.naturalEnglish}”
              </p>
            </div>

            {/* Hindi Translation Pill Box */}
            <div className="p-3.5 rounded-2xl bg-white/95 border border-[#FED7AA] text-sm sm:text-base font-semibold text-slate-800 leading-relaxed flex items-center justify-between gap-3 shadow-2xs">
              <div>
                <span className="font-bold text-[#C2410C] mr-2">हिंदी अर्थ:</span>
                <span>{result.hindiMeaning}</span>
              </div>
              <button
                onClick={handlePlayHindiAudio}
                className={`shrink-0 p-2 rounded-full border transition-colors cursor-pointer ${
                  isPlayingHindi
                    ? 'bg-[#E11D48] text-white border-[#E11D48]'
                    : 'bg-[#FFF1F2] border-[#FDA4AF] text-[#BE123C] hover:bg-[#FFE4E6]'
                }`}
                title="हिंदी में सुनें (Listen in Hindi)"
                aria-label="Listen in Hindi"
              >
                {isPlayingHindi ? (
                  <Square className="w-4 h-4 fill-white" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Listen to Coach Neha Full Button */}
            <button
              onClick={() => handlePlayCoachAudio()}
              className={`mt-4 w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-2xs ${
                isPlayingCoach
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white border-[#7C3AED] shadow-md shadow-[#7C3AED]/25'
                  : 'bg-white text-slate-800 border-[#E9D5FF] hover:bg-[#FAF5FF] hover:border-[#D8B4FE]'
              }`}
            >
              {isPlayingCoach ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Coach Neha is speaking...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#7C3AED]" />
                  <span>Listen to Coach Neha pronounce it</span>
                </>
              )}
            </button>

            {/* Useful Workplace Phrases / Correction Teaching */}
            {result.usefulPhrases && result.usefulPhrases.length > 0 ? (
              <div className="mt-4 pt-3.5 border-t border-[#FED7AA]/60">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#7C3AED] block mb-2.5">
                  Useful Workplace Phrases
                </span>
                <div className="space-y-2.5">
                  {result.usefulPhrases.map((phrase, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 rounded-2xl bg-white/95 border border-[#E9D5FF] text-xs sm:text-sm shadow-2xs space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center gap-1.5 font-bold text-slate-900">
                        <span className="text-slate-500 font-medium">Learner said:</span>
                        <span className="text-rose-700 line-through font-semibold">“{phrase.learnerSaid}”</span>
                        <span className="text-slate-400 font-bold mx-0.5">→</span>
                        <span className="text-slate-500 font-medium">Better English:</span>
                        <span className="text-[#7C3AED] font-black">“{phrase.betterEnglish}”</span>
                        {phrase.hindiMeaning && (
                          <span className="text-[11px] text-slate-500 font-medium ml-1">
                            ({phrase.hindiMeaning})
                          </span>
                        )}
                      </div>
                      <div className="text-slate-600 text-xs font-medium pl-1 border-l-2 border-[#C084FC]">
                        {phrase.teaching}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : result.keyVocabulary && result.keyVocabulary.length > 0 ? (
              <div className="mt-4 pt-3.5 border-t border-[#FED7AA]/60">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7C3AED] block mb-2">
                  Useful Workplace Phrases
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.keyVocabulary.map((vocab, vIdx) => (
                    <div
                      key={vIdx}
                      className="px-3 py-1.5 rounded-xl bg-white/95 border border-[#E9D5FF] flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs"
                    >
                      <span className="text-[#7C3AED] font-extrabold">{vocab.wordOrPhrase}</span>
                      <span className="text-xs font-medium text-slate-500">
                        ({vocab.hindiMeaning})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* BOTTOM ACTIONS: Try Again & Next Question */}
      <div className="sticky bottom-0 mt-6 pt-3 pb-2 bg-gradient-to-t from-[#FFF1F5] via-[#FFF1F5]/95 to-transparent backdrop-blur-xs z-20 grid grid-cols-2 gap-3">
        {/* Button 1: 🎤 Try Again */}
        <button
          onClick={() => {
            stopSpeaking();
            onTryAgain();
          }}
          className="py-3.5 px-4 rounded-2xl bg-white border border-[#E9D5FF] text-slate-800 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#FAF5FF] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-[#7C3AED]" />
          <span>🎤 Try Again</span>
        </button>

        {/* Button 2: → Next Question */}
        <button
          onClick={() => {
            stopSpeaking();
            onNextQuestion();
          }}
          className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#DB2777] to-[#EA580C] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#DB2777]/30 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Next Question</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
