import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  Footprints, 
  Music,
  ArrowRight,
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Video
} from 'lucide-react';
import { getBestFemaleVoice, playFixedAudio, stopSpeaking, speakText } from '../utils/audio';

interface AppPurposeScreenProps {
  onContinue: () => void;
  onClose?: () => void;
  onReplaySplash?: () => void;
}

export interface OnboardingAudioSegment {
  id: string;
  stepIndex: number;
  text: string;
  subTitleEn: string;
  subTitleHi: string;
}

export interface OnboardingStepItem {
  id: string;
  stepNumber: string;
  badge: string;
  titleEn: string;
  descriptionHi: string;
  speechText: string;
  Icon: React.ElementType;
  iconColor: string;
  glowColor: string;
  bgGradient: string;
  borderColor: string;
}

export const ONBOARDING_STEPS: OnboardingStepItem[] = [
  {
    id: 'intro',
    stepNumber: '00',
    badge: 'Welcome',
    titleEn: 'HELLO ENGLISH',
    descriptionHi: 'English सीखने के 4 आसान steps समझें',
    speechText: 'Hello! English सीखने के लिए इस ऐप को चार आसान steps में use करें।',
    Icon: Sparkles,
    iconColor: 'text-sky-300',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    bgGradient: 'from-sky-500/20 via-sky-500/10 to-indigo-500/20',
    borderColor: 'border-sky-400/50',
  },
  {
    id: 'learn',
    stepNumber: '01',
    badge: 'Step 1 • Learn',
    titleEn: 'LEARN (Bytes)',
    descriptionHi: 'Bytes में daily words और rules समझें',
    speechText: 'पहला step है Learn. यहाँ Bytes में रोज़मर्रा के words और basic rules समझें।',
    Icon: Compass,
    iconColor: 'text-sky-300',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    bgGradient: 'from-sky-500/25 via-blue-500/15 to-indigo-500/25',
    borderColor: 'border-sky-400/60',
  },
  {
    id: 'practice',
    stepNumber: '02',
    badge: 'Step 2 • Practice',
    titleEn: 'PRACTICE (Sheeko)',
    descriptionHi: 'Sheeko में AI hints से sentences बनाएं',
    speechText: 'दूसरा step है Practice. यहाँ Sheeko में AI hints के साथ खुद sentences बनाएं।',
    Icon: Sparkles,
    iconColor: 'text-amber-300',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    bgGradient: 'from-amber-500/25 via-yellow-500/15 to-orange-500/25',
    borderColor: 'border-amber-400/60',
  },
  {
    id: 'speak',
    stepNumber: '03',
    badge: 'Step 3 • Speak',
    titleEn: 'SPEAK (Buddy)',
    descriptionHi: 'Buddy के साथ real situations में खुलकर बोलें',
    speechText: 'तीसरा step है Speak. यहाँ Buddy के साथ real workplace situations में खुलकर बोलें।',
    Icon: Footprints,
    iconColor: 'text-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    bgGradient: 'from-emerald-500/25 via-teal-500/15 to-cyan-500/25',
    borderColor: 'border-emerald-400/60',
  },
  {
    id: 'improve',
    stepNumber: '04',
    badge: 'Step 4 • Improve',
    titleEn: 'IMPROVE (Rock & Roll)',
    descriptionHi: 'Rock & Roll roleplay से English बेहतर बनाएं',
    speechText: 'चौथा step है Improve. यहाँ Rock and Roll roleplay खेलें और अपनी English को और बेहतर बनाएं।',
    Icon: Music,
    iconColor: 'text-purple-300',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    bgGradient: 'from-purple-500/25 via-fuchsia-500/15 to-indigo-500/25',
    borderColor: 'border-purple-400/60',
  },
  {
    id: 'outro',
    stepNumber: '★',
    badge: 'Ready',
    titleEn: 'READY TO SPEAK',
    descriptionHi: 'रोज़ थोड़ा practice करें और confident English बोलें!',
    speechText: 'बस रोज़ थोड़ा practice करें और confident English बोलें!',
    Icon: CheckCircle,
    iconColor: 'text-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    bgGradient: 'from-emerald-500/25 via-sky-500/15 to-teal-500/25',
    borderColor: 'border-emerald-400/60',
  },
];

// Retain backward compatibility with any other references
export const ONBOARDING_AUDIO_SEGMENTS: OnboardingAudioSegment[] = ONBOARDING_STEPS.map((s, idx) => ({
  id: s.id,
  stepIndex: idx === 0 || idx === ONBOARDING_STEPS.length - 1 ? -1 : idx - 1,
  text: s.speechText,
  subTitleEn: s.titleEn,
  subTitleHi: s.descriptionHi,
}));

export const AppPurposeScreen: React.FC<AppPurposeScreenProps> = ({ onContinue, onClose, onReplaySplash }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const stepTimeoutsRef = useRef<number[]>([]);
  const isPlayingRef = useRef<boolean>(false);
  const stepTimeoutRef = useRef<number | null>(null);
  const heartbeatTimerRef = useRef<number | null>(null);
  const hasPlayedRef = useRef<boolean>(false);

  const handleDismiss = () => {
    stopAudio();
    if (onClose) onClose();
    else onContinue();
  };

  const startAudio = useCallback((fromIndex = 0) => {
    stopSpeaking();
    setCurrentStepIndex(fromIndex);
    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsFinished(false);

    if (intervalRef.current) clearInterval(intervalRef.current);
    stepTimeoutsRef.current.forEach(id => clearTimeout(id));
    stepTimeoutsRef.current = [];

    const duration = 18.5;
    const durationMs = duration * 1000;

    // Proportional duration distribution across the 6 onboarding steps (0 to 5)
    const stepFractions = [0, 0.27, 0.54, 0.76, 0.98, 1.10];

    stepFractions.forEach((fraction, idx) => {
      if (idx <= fromIndex) return;
      const delay = durationMs * fraction;
      const timerId = window.setTimeout(() => {
        if (isPlayingRef.current) {
          setCurrentStepIndex(idx);
        }
      }, delay);
      stepTimeoutsRef.current.push(timerId);
    });

    const audio = playFixedAudio(
      '09_app_steps_intro.mp3',
      undefined,
      () => {
        if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        stepTimeoutsRef.current.forEach(id => clearTimeout(id));
        stepTimeoutsRef.current = [];
        setIsPlaying(false);
        isPlayingRef.current = false;
        setIsFinished(true);
        setCurrentStepIndex(ONBOARDING_STEPS.length - 1);
      }
    );
    audioElementRef.current = audio;
  }, []);

  const pauseAudio = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stepTimeoutsRef.current.forEach(id => clearTimeout(id));
    stepTimeoutsRef.current = [];
    stopSpeaking();
  }, []);

  const stopAudio = useCallback(() => {
    pauseAudio();
    setIsFinished(false);
  }, [pauseAudio]);

  const replayAudio = useCallback(() => {
    stopAudio();
    setTimeout(() => {
      startAudio(0);
    }, 80);
  }, [stopAudio, startAudio]);

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      if (isFinished) {
        replayAudio();
      } else {
        startAudio(currentStepIndex);
      }
    }
  };

  const handleSelectStep = (index: number) => {
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
    }
    startAudio(index);
  };

  const handleNextStep = () => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      handleSelectStep(currentStepIndex + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      handleSelectStep(currentStepIndex - 1);
    }
  };

  // Preload speech synthesis voices
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis && typeof window.speechSynthesis.getVoices === 'function') {
        window.speechSynthesis.getVoices();
        const onVoicesChanged = () => {
          try {
            window.speechSynthesis?.getVoices();
          } catch (e) {}
        };
        window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
        return () => {
          try {
            window.speechSynthesis?.removeEventListener('voiceschanged', onVoicesChanged);
          } catch (e) {}
        };
      }
    } catch (e) {}
  }, []);

  // Heartbeat to prevent Chrome's SpeechSynthesis timeout bug
  useEffect(() => {
    if (isPlaying) {
      heartbeatTimerRef.current = window.setInterval(() => {
        try {
          if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        } catch (e) {}
      }, 10000);
    } else {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    }
    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
    };
  }, [isPlaying]);

  // Autoplay narration on screen entry
  useEffect(() => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const timer = window.setTimeout(() => {
      startAudio(0);
    }, 450);

    return () => {
      clearTimeout(timer);
      isPlayingRef.current = false;
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      try {
        if (typeof window !== 'undefined' && window.speechSynthesis && typeof window.speechSynthesis.cancel === 'function') {
          window.speechSynthesis.cancel();
        }
      } catch (e) {}
    };
  }, [startAudio]);

  const activeStep = ONBOARDING_STEPS[currentStepIndex] || ONBOARDING_STEPS[0];
  const StepIcon = activeStep.Icon;
  const isLastStep = currentStepIndex === ONBOARDING_STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 bg-black text-slate-100 flex flex-col items-center justify-between px-4 py-4 sm:py-6 overflow-hidden select-none font-sans"
    >
      {/* Deep Royal Purple Gradient positioned at Right-Bottom (Dark Moody Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Core Right-Bottom Purple Radial Glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 75% at 92% 96%, rgba(65, 18, 118, 0.85) 0%, rgba(46, 12, 85, 0.65) 28%, rgba(26, 6, 52, 0.42) 52%, rgba(12, 2, 25, 0.2) 72%, #000000 95%)',
          }}
        />

        {/* Ambient Deep Purple Diffusion Orb anchored to the Bottom-Right */}
        <div
          className="absolute -bottom-24 -right-24 w-[460px] h-[460px] sm:w-[580px] sm:h-[580px] rounded-full blur-[110px] pointer-events-none opacity-65"
          style={{
            background: 'radial-gradient(circle, #581c87 0%, #3b0764 42%, #1e053a 72%, transparent 100%)',
          }}
        />

        {/* Cinematic Vignette ensuring top and left regions remain deep pitch-black */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-black/35 to-black pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[420px] mx-auto flex-1 flex flex-col justify-between relative z-10 my-auto">
        
        {/* 1. Clean Minimal Top Header */}
        <div className="w-full flex items-center justify-between pt-1 pb-2">
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-bold tracking-[0.2em] text-sky-400/90 uppercase"
              style={{ fontFamily: "'Syncopate', sans-serif" }}
            >
              HELLO ENGLISH
            </span>
            <span className="text-[10px] text-slate-400 font-medium">| Guide</span>
          </div>

          {/* Top Skip / Close Button */}
          <button
            onClick={handleDismiss}
            className="text-[11px] font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 transition-all cursor-pointer backdrop-blur-md flex items-center gap-1 active:scale-95"
            title="Skip to Home"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Hero Center Stage: ONLY ONE ICON & A SMALL DESCRIPTION IN HINDI */}
        <div className="w-full flex-1 flex flex-col items-center justify-center my-auto py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, scale: 0.82, y: 22 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.82, y: -22 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center max-w-xs"
            >
              {/* Pulsing Aura & Central Single Big Hero Icon */}
              <div className="relative mb-6 flex items-center justify-center">
                {/* Glowing Pulsing Aura */}
                <motion.div
                  animate={{
                    scale: isPlaying ? [1, 1.25, 1.05] : 1,
                    opacity: isPlaying ? [0.6, 0.15, 0.5] : 0.3,
                  }}
                  transition={{
                    repeat: isPlaying ? Infinity : 0,
                    duration: 1.8,
                    ease: 'easeInOut',
                  }}
                  className="absolute -inset-4 rounded-full blur-xl pointer-events-none"
                  style={{ backgroundColor: activeStep.glowColor }}
                />

                {/* The Single Pop-out Hero Icon Container */}
                <motion.div
                  animate={{
                    scale: isPlaying ? [1, 1.05, 1] : 1,
                    y: isPlaying ? [0, -3, 0] : 0,
                  }}
                  transition={{
                    repeat: isPlaying ? Infinity : 0,
                    duration: 2,
                    ease: 'easeInOut',
                  }}
                  className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br ${activeStep.bgGradient} backdrop-blur-2xl border ${activeStep.borderColor} shadow-[0_15px_35px_rgba(0,0,0,0.55)] flex items-center justify-center`}
                >
                  <StepIcon 
                    className={`w-14 h-14 sm:w-16 sm:h-16 ${activeStep.iconColor} drop-shadow-md`} 
                    strokeWidth={2.2}
                  />

                  {/* Corner Step Pill */}
                  <span className="absolute -top-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-white/20 text-[10px] font-bold text-slate-200 shadow-md">
                    {activeStep.badge}
                  </span>

                  {/* Speaker Wave Bars indicator when speaking */}
                  {isPlaying && (
                    <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-sky-400/40 flex items-center gap-1 shadow-md">
                      <span className="w-1 h-2.5 bg-sky-400 rounded-full animate-pulse" />
                      <span className="w-1 h-4 bg-sky-300 rounded-full animate-pulse delay-75" />
                      <span className="w-1 h-2 bg-sky-400 rounded-full animate-pulse delay-150" />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Step Title in English */}
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wide uppercase mb-1.5 drop-shadow-sm">
                {activeStep.titleEn}
              </h2>

              {/* Single Small Description in Hindi */}
              <p className="text-base sm:text-lg font-medium text-slate-200 leading-relaxed max-w-[270px] sm:max-w-xs drop-shadow-sm">
                {activeStep.descriptionHi}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Clean Step Navigation Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="p-1 rounded-full text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {ONBOARDING_STEPS.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleSelectStep(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      isActive 
                        ? 'w-7 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]' 
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={step.badge}
                    aria-label={step.badge}
                  />
                );
              })}
            </div>

            <button
              onClick={handleNextStep}
              className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Next step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. Bottom Action CTA: Button for Home Screen */}
        <div className="w-full pt-2 pb-1">
          <motion.button
            onClick={handleDismiss}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer active:scale-[0.98] ${
              isFinished || isLastStep
                ? 'bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 hover:from-sky-300 hover:to-purple-400 text-white shadow-indigo-500/40 ring-2 ring-sky-400/50 animate-pulse'
                : 'bg-gradient-to-r from-sky-500/90 to-indigo-600/90 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/25'
            }`}
          >
            <span>Home Screen पर जाएं (Start Learning)</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>

          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 mt-2 font-medium">
            <span>Video Guide</span>
            <span>•</span>
            <button
              type="button"
              onClick={togglePlayPause}
              className="text-sky-300 hover:text-sky-200 underline underline-offset-2 transition-colors cursor-pointer"
            >
              {isPlaying ? 'Pause narration' : isFinished ? 'Replay narration' : 'Play narration'}
            </button>
            {onReplaySplash && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    stopAudio();
                    onReplaySplash();
                  }}
                  className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Splash
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. Shrunk Video/Voice Guide Icon Placed Right Side Center */}
      <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40">
        <motion.button
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={togglePlayPause}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-xl backdrop-blur-xl border ${
            isPlaying
              ? 'bg-sky-500 text-slate-950 border-white ring-4 ring-sky-400/40 shadow-[0_0_25px_rgba(56,189,248,0.7)]'
              : isFinished
              ? 'bg-indigo-600 text-white border-indigo-300/80 shadow-[0_0_20px_rgba(99,102,241,0.5)]'
              : 'bg-slate-900/90 text-sky-300 hover:text-white border-sky-400/40 hover:border-sky-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
          }`}
          title={isPlaying ? 'Pause Video Guide' : isFinished ? 'Replay Video Guide' : 'Play Video Guide'}
          aria-label="Video Guide"
        >
          {isPlaying ? (
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-slate-950 rounded-full animate-pulse" />
              <span className="w-1 h-4 bg-slate-950 rounded-full animate-pulse delay-75" />
              <span className="w-1 h-3 bg-slate-950 rounded-full animate-pulse delay-150" />
            </div>
          ) : isFinished ? (
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current stroke-[2] ml-0.5" />
          )}
        </motion.button>
      </div>
    </div>
  );
};
