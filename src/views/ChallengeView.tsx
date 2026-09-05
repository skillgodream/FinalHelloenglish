import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Lock,
  BookOpen,
  Mic,
  Target,
  X,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import { PRACTICE_QUESTIONS } from '../data/questions';
import { UserProgress, Question, ChallengeDayProgress } from '../types';
import {
  CHALLENGE_PLANS,
  ChallengePlanOption,
  getOrCreateChallenge,
  startNewChallenge,
} from '../utils/challengeManager';
import { MyDayPatternsHub } from '../components/myday/MyDayPatternsHub';
import { playFixedAudio, stopSpeaking } from '../utils/audio';

interface ChallengeViewProps {
  progress: UserProgress;
  onBack: () => void;
  onStartMyDay: () => void;
  onStartPracticeQuestion: (question?: Question) => void;
  onStartDrill?: (question?: Question) => void;
  onUpdateProgress?: (updater: (prev: UserProgress) => UserProgress) => void;
}

type ChallengeSubView = 'carousel' | 'dashboard' | 'training_options' | 'patterns_page';

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  progress,
  onBack,
  onStartMyDay,
  onStartPracticeQuestion,
  onStartDrill,
  onUpdateProgress,
}) => {
  const activeChallenge = getOrCreateChallenge(progress);
  const activeDays = activeChallenge.totalDays || 5;

  const initialIndex = Math.max(
    0,
    CHALLENGE_PLANS.findIndex((p) => p.days === activeDays)
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 1);
  const [subView, setSubView] = useState<ChallengeSubView>('carousel');
  const [selectedDayDetail, setSelectedDayDetail] = useState<ChallengeDayProgress | null>(null);
  const [showPatterns, setShowPatterns] = useState(false);

  const selectedPlan: ChallengePlanOption = CHALLENGE_PLANS[activeIndex] || CHALLENGE_PLANS[1];
  const isSelectedPlanActive = activeChallenge.isStarted && activeChallenge.totalDays === selectedPlan.days;

  // Touch Swipe Gesture Handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 40;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : CHALLENGE_PLANS.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < CHALLENGE_PLANS.length - 1 ? prev + 1 : 0));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (subView === 'carousel') {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subView]);

  useEffect(() => {
    if (subView === 'carousel') {
      playFixedAudio('D_myday_journey.mp3');
    } else {
      stopSpeaking();
    }
    return () => {
      stopSpeaking();
    };
  }, [subView]);

  const handleCardClick = (plan: ChallengePlanOption, index: number) => {
    setActiveIndex(index);
    if (!isSelectedPlanActive || activeChallenge.totalDays !== plan.days) {
      if (onUpdateProgress) {
        onUpdateProgress((prev) => startNewChallenge(prev, plan.days));
      }
    }
    setSubView('dashboard');
  };

  const totalTargetActivities = selectedPlan.storyTarget + selectedPlan.questionTarget;
  const currentDoneActivities = isSelectedPlanActive
    ? activeChallenge.myDayCompletedCount + activeChallenge.coachQuestionsCompletedCount
    : 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#141622] via-[#0d0e15] to-[#07080b] text-white flex flex-col justify-between overflow-x-hidden select-none font-sans relative pb-24">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-900/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 w-full max-w-lg mx-auto px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between">
        <button
          onClick={() => {
            if (subView === 'training_options') {
              setSubView('dashboard');
            } else if (subView === 'dashboard') {
              setSubView('carousel');
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white transition-all cursor-pointer text-xs font-semibold active:scale-95 shadow-sm"
          aria-label="पीछे जाएं"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>पीछे जाएं</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-black text-white bg-zinc-900/90 px-3.5 py-1 rounded-full border border-zinc-800 tracking-tight">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{subView === 'carousel' ? 'शीको जर्नी' : `${selectedPlan.days} दिन`}</span>
        </div>

        <div className="w-12" /> {/* spacer for alignment */}
      </header>

      {/* VIEW 1: CAROUSEL */}
      {subView === 'carousel' && (
        <main className="relative z-20 w-full max-w-lg mx-auto flex-1 flex flex-col justify-between py-2 px-3 sm:px-4">
          <div className="text-center pt-2 pb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">दिन चुनें</h1>
            <p className="text-xs text-zinc-400 mt-0.5">अपनी सीखने की अवधि और दिनों का लक्ष्य चुनें</p>
          </div>
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative w-full h-[40vh] min-h-[260px] max-h-[340px] flex items-center justify-center my-auto"
            style={{ perspective: 1100 }}
          >
            <button
              onClick={handlePrev}
              className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer shadow-xl transition-all active:scale-95"
              aria-label="पिछला"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer shadow-xl transition-all active:scale-95"
              aria-label="अगला"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
              {CHALLENGE_PLANS.map((plan, index) => {
                const offset = index - activeIndex;
                const isCenter = offset === 0;

                const xTranslate = offset * 62;
                const rotateY = offset * -25;
                const scale = isCenter ? 1.05 : Math.max(0.65, 1 - Math.abs(offset) * 0.2);
                const zIndex = 30 - Math.abs(offset) * 10;
                const opacity = isCenter ? 1 : Math.max(0, 0.45 - Math.abs(offset) * 0.15);
                const blurAmount = isCenter ? 'blur(0px)' : 'blur(4px)';

                return (
                  <motion.div
                    key={plan.days}
                    onClick={() => handleCardClick(plan, index)}
                    initial={false}
                    animate={{
                      x: `${xTranslate}%`,
                      scale: scale,
                      rotateY: rotateY,
                      opacity: opacity,
                      zIndex: zIndex,
                      filter: blurAmount,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 24,
                    }}
                    className={`absolute top-0 bottom-0 my-auto w-56 sm:w-64 h-[92%] rounded-[36px] flex flex-col items-center justify-center cursor-pointer select-none transition-all ${
                      isCenter
                        ? 'bg-gradient-to-b from-zinc-800/40 via-zinc-900/60 to-black/80 border border-zinc-700/60 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-md'
                        : 'bg-zinc-950/40 border border-zinc-900/60 shadow-black'
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span
                        className={`text-[96px] sm:text-[118px] font-black tracking-tighter leading-none transition-all duration-300 font-mono ${
                          isCenter
                            ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-[0_10px_20px_rgba(255,255,255,0.12)]'
                            : 'text-zinc-600/80'
                        }`}
                      >
                        {plan.days}
                      </span>
                      <span
                        className={`text-2xl sm:text-3xl font-black uppercase tracking-tight -ml-1 sm:-ml-2 self-start mt-3 font-mono ${
                          isCenter ? 'text-zinc-400' : 'text-zinc-700'
                        }`}
                      >
                        D
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                          isCenter
                            ? 'bg-zinc-800/90 text-zinc-300 border border-zinc-700/60'
                            : 'text-zinc-600 bg-black/40'
                        }`}
                      >
                        {plan.days} दिन का लक्ष्य
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Minimal targets: 15 mins per day, 5 day stories, 100 coach questions */}
          <div className="w-full flex flex-col items-center text-center mt-3 mb-2 space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/50 border border-zinc-800 text-zinc-300">
                📖 {selectedPlan.storyTarget} डे स्टोरीज़
              </span>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/50 border border-zinc-800 text-zinc-300">
                🎙️ {selectedPlan.questionTarget} कोच सवाल
              </span>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/50 border border-zinc-800 text-emerald-400">
                ⏱️ {selectedPlan.dailyTime.replace('mins/day', 'मिनट / दिन').replace('mins per day', 'मिनट / दिन')}
              </span>
            </div>
          </div>
        </main>
      )}

      {/* VIEW 2: ROADMAP DASHBOARD (APPLE WATCH STYLE) */}
      {subView === 'dashboard' && (
        <main className="relative z-20 w-full max-w-lg mx-auto flex-1 flex flex-col py-2 px-4 space-y-5">
          {/* Header Title replacement matching Apple Watch Discover reference */}
          <div className="px-1 pt-1">
            <div className="flex items-center gap-3">
              <span className={`w-3.5 h-3.5 rounded-full ${activeChallenge.isStarted ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                {selectedPlan.days} दिन
              </h1>
            </div>
          </div>

          {/* Active Talk to me Card Summary - Sleek & Lightweight */}
          <div className="bg-[#12131a]/80 backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                दैनिक प्रगति विवरण
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400">
                  {currentDoneActivities} पूरे हुए
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-400">
                  {Math.max(0, totalTargetActivities - currentDoneActivities)} बाकी
                </span>
              </div>
            </div>

            {/* Linear Daily Programs Overview */}
            <div className="pt-2 pb-1">
              {/* Linear Track container */}
              <div className="relative px-2 py-3">
                {/* Connecting background line */}
                <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-white/[0.06] rounded-full z-0" />

                <div className="relative z-10 flex items-center justify-between">
                  {activeChallenge.dailyProgress.slice(0, selectedPlan.days).map((dayItem) => {
                    const isDone = dayItem.isCompleted;
                    const isCurrent = dayItem.isCurrent;

                    return (
                      <button
                        key={dayItem.day}
                        type="button"
                        onClick={() => setSelectedDayDetail(dayItem)}
                        className="flex flex-col items-center gap-2 group cursor-pointer"
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                            isDone
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                              : isCurrent
                              ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse'
                              : 'bg-white/[0.04] border-white/10 text-zinc-500 group-hover:border-white/20'
                          }`}
                        >
                          {isDone ? '✓' : dayItem.day}
                        </div>
                        <span className={`text-[11px] font-medium ${isCurrent ? 'text-amber-400 font-semibold' : isDone ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          दिन {dayItem.day}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Get More From Your Talk to me Section: Practice Action Card - Moved Down */}
          <div className="space-y-3 pt-6">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubView('training_options')}
              className="w-full relative overflow-hidden rounded-[28px] p-5 bg-[#12131a] border border-zinc-800 flex items-center justify-between transition-all cursor-pointer shadow-none backdrop-blur-xl group"
            >
              {/* Apple Glass Loom Glow & Top Shine */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-purple-900/20 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-800/20 transition-all duration-500" />
              
              <div className="flex items-center gap-4 text-left relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-900/30 via-indigo-950/20 to-purple-950/40 border border-purple-900/50 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(126,34,206,0.2)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 to-transparent pointer-events-none" />
                  <Play className="w-6 h-6 text-purple-400 fill-purple-950 ml-0.5 relative z-10" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-tight group-hover:text-purple-300 transition-colors whitespace-nowrap">
                    आज की स्टोरी और ड्रिल्स का अभ्यास करें
                  </h3>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-purple-600/30 group-hover:border-purple-500/50 transition-all relative z-10 shrink-0">
                <ChevronRight className="w-4.5 h-4.5" />
              </div>
            </motion.button>
          </div>
        </main>
      )}

      {/* VIEW 3: TWO OVERLAPPING WATCH CARDS (DAY STORIES & PATTERNS) */}
      {subView === 'training_options' && (
        <main className="relative z-20 w-full max-w-sm mx-auto flex-1 flex flex-col py-3 px-3 space-y-4 justify-center">
          <div className="px-1 pt-1 text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              दिन {activeChallenge.currentDay || 1} का अभ्यास
            </h1>
            <p className="text-xs font-semibold text-zinc-400 mt-0.5">
              अभ्यास के लिए मॉड्यूल चुनें
            </p>
          </div>

          {/* Two Overlapping V-shape Watches Container */}
          <div className="relative w-full py-2 flex flex-col items-center space-y-2">
            {/* Card 1: Drills Card with Smart Progress Linear */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => {
                if (onStartDrill) {
                  onStartDrill();
                } else if (onStartPracticeQuestion) {
                  onStartPracticeQuestion(PRACTICE_QUESTIONS[0]);
                }
              }}
              className="w-full rounded-[28px] bg-gradient-to-b from-[#14151b] via-[#0d0e12] to-[#07080a] border border-zinc-800 p-5 shadow-2xl cursor-pointer relative z-25 flex flex-col justify-between group backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/30 to-teal-500/20 border border-sky-500/40 flex items-center justify-center text-sky-300 shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-900 text-sky-300 border border-zinc-800">
                  {currentDoneActivities} / {totalTargetActivities} पूर्ण
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight group-hover:text-sky-300 transition-colors">
                  ड्रिल्स (Drills)
                </h3>
              </div>

              {/* Smart Progress Linear Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px] text-zinc-400 font-bold">
                  <span>स्मार्ट प्रोग्रेस</span>
                  <span>{Math.round((currentDoneActivities / Math.max(1, totalTargetActivities)) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (currentDoneActivities / Math.max(1, totalTargetActivities)) * 100)}%` }}
                    className="h-full bg-gradient-to-r from-sky-500 to-teal-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Card 2: Day Story Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={onStartMyDay}
              className="w-[92%] -mt-4 rounded-[28px] bg-gradient-to-br from-[#272832] via-[#1a1b24] to-[#121319] border border-zinc-700/80 p-5 shadow-2xl cursor-pointer relative z-10 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500/30 to-indigo-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-800/80 text-purple-300 border border-zinc-700">
                  सक्रिय
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight group-hover:text-purple-300 transition-colors">
                  डे स्टोरी (Day Story)
                </h3>
              </div>
            </motion.div>
          </div>
        </main>
      )}

      {/* VIEW 4: DEDICATED PATTERNS PAGE */}
      {subView === 'patterns_page' && (
        <main className="relative z-20 w-full max-w-md mx-auto flex-1 flex flex-col py-3 px-3 space-y-4">
          <div className="w-full bg-[#12131a] border border-zinc-800/80 rounded-3xl p-4 overflow-hidden shadow-xl">
            <MyDayPatternsHub
              hideNavigation={true}
              onStartPracticeQuestion={(q) => {
                if (onStartPracticeQuestion) {
                  onStartPracticeQuestion(q);
                }
              }}
              onBackToBuddy={() => setSubView('training_options')}
            />
          </div>
        </main>
      )}

      {/* ACTIVITIES LOG MODAL (WHEN TAPPING ANY DAY BAR) */}
      <AnimatePresence>
        {selectedDayDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-[#12141c] border border-zinc-700/80 rounded-3xl p-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">
                      {selectedDayDetail.dayLabel.replace('Day', 'दिन')} की गतिविधियां
                    </span>
                    {selectedDayDetail.isCompleted ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                        पूर्ण
                      </span>
                    ) : selectedDayDetail.isCurrent ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">
                        आज सक्रिय
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        आगामी
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 block mt-0.5">
                    लक्ष्य: 1 डे स्टोरी + 20 स्पीकिंग ड्रिल्स
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDayDetail(null)}
                  className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{selectedDayDetail.dayLabel.replace('Day', 'दिन')} के कार्य</span>
                </span>

                {selectedDayDetail.completedActivities && selectedDayDetail.completedActivities.length > 0 ? (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {selectedDayDetail.completedActivities.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-black/40 border border-zinc-800/70 flex items-start gap-2 text-xs text-zinc-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-black/30 border border-zinc-800/70 text-center text-xs text-zinc-400">
                    {selectedDayDetail.isCompleted
                      ? 'इस दिन की सभी आवश्यक गतिविधियां पूरी हो चुकी हैं।'
                      : selectedDayDetail.isCurrent
                      ? 'आप आज का अभ्यास कर रहे हैं। इस दिन को पूरा करने के लिए 1 डे स्टोरी और कोच सवालों को पूरा करें।'
                      : 'यह दिन पिछले दिनों के पूरे होने पर खुलेगा।'}
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setSelectedDayDetail(null)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all cursor-pointer"
                >
                  बंद करें
                </button>
                {selectedDayDetail.isCurrent && (
                  <button
                    onClick={() => {
                      setSelectedDayDetail(null);
                      setSubView('training_options');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>अभी अभ्यास करें</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
