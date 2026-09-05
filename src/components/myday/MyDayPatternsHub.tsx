import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Briefcase,
  Coffee,
  Users,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Mic,
  Compass,
  Play,
  Layers,
  Truck,
  MessageSquare,
} from 'lucide-react';
import { Question } from '../../types';
import { PRACTICE_QUESTIONS } from '../../data/questions';
import { playFixedAudio, stopSpeaking } from '../../utils/audio';
import { AudioMuteButton } from '../AudioMuteButton';

interface MyDayPatternsHubProps {
  onStartPracticeQuestion: (question: Question) => void;
  onUsePatternForStory?: (patternText: string) => void;
  onBackToBuddy?: () => void;
  hideNavigation?: boolean;
}

export type CategoryKey = 'workplace' | 'daily_routine' | 'friends' | 'logistics' | 'customer';
export type LevelKey = 'Level 1' | 'Level 2' | 'Level 3';

interface CategoryConfig {
  id: CategoryKey;
  numBadge: string;
  title: string;
  subtitle: string;
  description: string;
  hindiLabel: string;
  questionCount: number;
  gradient: string;
  iconBg: string;
  accentColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'workplace',
    numBadge: '01',
    title: 'वर्कप्लेस (Workplace)',
    subtitle: 'प्रोफेशनल अंग्रेजी और वर्क कन्वर्सेशन',
    description: 'वेयरहाउस ऑपरेशन्स, मैनेजर से बातचीत, क्लाइंट रिक्वेस्ट्स, हैंडओवर नोट्स और टीम कोऑर्डिनेशन का अभ्यास करें।',
    hindiLabel: 'ऑफिस और काम की बातचीत',
    questionCount: PRACTICE_QUESTIONS.filter((q) => q.category === 'workplace').length || 40,
    gradient: 'from-amber-500/20 via-zinc-900 to-black',
    iconBg: 'from-amber-500 to-orange-600',
    accentColor: '#f59e0b',
    borderColor: 'border-amber-500/40',
    icon: <Briefcase className="w-7 h-7 text-white stroke-[2]" />,
  },
  {
    id: 'daily_routine',
    numBadge: '02',
    title: 'डेली रूटीन (Daily Routine)',
    subtitle: 'दैनिक आदतें, आवागमन और रोजमर्रा के काम',
    description: 'अपनी सुबह की दिनचर्या, सफर, खान-पान, शॉपिंग, चाय के ब्रेक और रोजमर्रा की गतिविधियों को आसानी से बताएं।',
    hindiLabel: 'दिनचर्या और रोजमर्रा की बातें',
    questionCount: PRACTICE_QUESTIONS.filter((q) => q.category === 'daily_routine').length || 35,
    gradient: 'from-rose-500/20 via-zinc-900 to-black',
    iconBg: 'from-rose-500 to-pink-600',
    accentColor: '#f43f5e',
    borderColor: 'border-rose-500/40',
    icon: <Coffee className="w-7 h-7 text-white stroke-[2]" />,
  },
  {
    id: 'friends',
    numBadge: '03',
    title: 'दोस्त और सोशल (Friends & Social)',
    subtitle: 'कैजुअल बातचीत और वीकेंड हैंगआउट्स',
    description: 'दोस्तों के साथ कैजुअल गपशप, वीकेंड प्लान्स, फिल्मों, मजेदार बातों और कॉन्फिडेंट बातचीत का अभ्यास करें।',
    hindiLabel: 'दोस्तों और सामाजिक बातचीत',
    questionCount: PRACTICE_QUESTIONS.filter((q) => q.category === 'friends').length || 25,
    gradient: 'from-sky-500/20 via-zinc-900 to-black',
    iconBg: 'from-sky-500 via-blue-600 to-indigo-700',
    accentColor: '#38bdf8',
    borderColor: 'border-sky-500/40',
    icon: <Users className="w-7 h-7 text-white stroke-[2]" />,
  },
  {
    id: 'logistics',
    numBadge: '04',
    title: 'लॉजिस्टिक्स और डिलीवरी (Logistics)',
    subtitle: 'वेयरहाउस डिस्पैच और फील्ड कस्टमर कॉल्स',
    description: 'पार्सल ट्रैकिंग, डिलीवरी कन्फर्मेशन, पता सत्यापन और डिलीवरी से जुड़ी कॉल्स का अभ्यास करें।',
    hindiLabel: 'डिलीवरी और कस्टमर बातचीत',
    questionCount: 30,
    gradient: 'from-emerald-500/20 via-zinc-900 to-black',
    iconBg: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    borderColor: 'border-emerald-500/40',
    icon: <Truck className="w-7 h-7 text-white stroke-[2]" />,
  },
  {
    id: 'friends',
    numBadge: '05',
    title: 'स्मॉल टॉक और चैट (Small Talk)',
    subtitle: 'क्विक रिस्पॉन्स और त्वरित बातचीत',
    description: 'अचानक पूछे गए सवालों के जवाब दें, अपनी राय रखें, आगे के सवाल पूछें और बातचीत का प्रवाह बनाए रखें।',
    hindiLabel: 'क्विक रिस्पॉन्स और बातचीत',
    questionCount: 28,
    gradient: 'from-purple-500/20 via-zinc-900 to-black',
    iconBg: 'from-purple-500 via-violet-600 to-indigo-600',
    accentColor: '#a855f7',
    borderColor: 'border-purple-500/40',
    icon: <MessageSquare className="w-7 h-7 text-white stroke-[2]" />,
  },
];

const LEVELS: {
  id: LevelKey;
  levelNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
}[] = [
  {
    id: 'Level 1',
    levelNumber: 1,
    title: 'लेवल 1',
    subtitle: 'शब्द और वाक्यांश (Words & Phrases)',
    badge: 'फाउंडेशन',
    description: 'शब्दावली, मुख्य कीवर्ड्स और 2-4 शब्दों के सरल संरचित उत्तर।',
  },
  {
    id: 'Level 2',
    levelNumber: 2,
    title: 'लेवल 2',
    subtitle: 'वाक्य और प्रवाह (Sentences & Flow)',
    badge: 'धाराप्रवाह',
    description: 'भूतकाल और वर्तमान काल के पूरे वाक्य, कारण और सही कनेक्टर्स।',
  },
  {
    id: 'Level 3',
    levelNumber: 3,
    title: 'लेवल 3',
    subtitle: 'वास्तविक बातचीत (Real Conversations)',
    badge: 'मास्टरी',
    description: 'धाराप्रवाह बहु-वाक्य संवाद, अचानक आने वाली परिस्थितियां और आत्मविश्वास से बोलना।',
  },
];

export const MyDayPatternsHub: React.FC<MyDayPatternsHubProps> = ({
  onStartPracticeQuestion,
  onBackToBuddy,
  hideNavigation = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Helper to pick a completely random question from the selected category + level
  const handleSelectRandomLevelQuestion = (level: LevelKey) => {
    if (!selectedCategory) return;
    const pool = PRACTICE_QUESTIONS.filter(
      (q) => q.category === selectedCategory.id && q.level === level
    );

    const questionsList =
      pool.length > 0
        ? pool
        : PRACTICE_QUESTIONS.filter((q) => q.category === selectedCategory.id);

    if (questionsList.length > 0) {
      const randomIndex = Math.floor(Math.random() * questionsList.length);
      const chosenQuestion = questionsList[randomIndex];
      onStartPracticeQuestion(chosenQuestion);
    }
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < CATEGORIES.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : CATEGORIES.length - 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedCategory) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCategory]);

  // Touch Swipe Handling for Mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 45;

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
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // ==========================================
  // VIEW 1: DISCOVER PATTERNS - COVER FLOW CAROUSEL
  // ==========================================
  if (!selectedCategory) {
    return (
      <div className="w-full min-h-screen bg-black text-white px-2 sm:px-6 pt-3 sm:pt-4 pb-32 select-none flex flex-col justify-between overflow-x-hidden">
        {/* Top iOS Header */}
        <div className="w-full max-w-lg mx-auto flex items-center justify-between z-20 pb-2 px-2">
          <div className="flex items-center gap-2.5">
            {onBackToBuddy && (
              <button
                onClick={onBackToBuddy}
                className="p-1.5 -ml-1 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="पीछे जाएं"
                aria-label="पीछे जाएं"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  पैटर्न लाइब्रेरी
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                डिस्कवर
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioMuteButton size="sm" variant="glass" />
            <span className="text-xs font-mono text-zinc-400 font-bold bg-zinc-900/80 px-2.5 py-1 rounded-full border border-zinc-800">
              {activeIndex + 1} <span className="text-zinc-600">/</span> {CATEGORIES.length}
            </span>
          </div>
        </div>

        {/* Cover Flow Carousel Container with Touch Swipe */}
        <div
          ref={containerRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative w-full max-w-lg mx-auto my-auto flex items-center justify-center min-h-[420px] sm:min-h-[480px] py-2 overflow-visible"
          style={{ perspective: 1000 }}
        >
          {/* Navigation Arrows on Left & Right for easy clicking */}
          <button
            onClick={handlePrev}
            className="absolute left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-white flex items-center justify-center cursor-pointer shadow-2xl transition-all active:scale-95 hover:scale-105"
            aria-label="पिछला"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-white flex items-center justify-center cursor-pointer shadow-2xl transition-all active:scale-95 hover:scale-105"
            aria-label="अगला"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Cards Rendered in 3D Space */}
          <div className="relative w-full h-[390px] sm:h-[440px] flex items-center justify-center">
            {CATEGORIES.map((cat, index) => {
              const offset = index - activeIndex;
              const isCenter = offset === 0;

              // Responsive 3D transformation values
              let xTranslate = offset * 56; // tighter shift on mobile so cards fit comfortably
              let scale = 1 - Math.abs(offset) * 0.14;
              let rotateY = offset * -22; // 3D rotation angle
              let zIndex = 30 - Math.abs(offset) * 10;
              let opacity = 1 - Math.abs(offset) * 0.45;

              if (Math.abs(offset) > 2) {
                opacity = 0;
                scale = 0.55;
              }

              return (
                <motion.div
                  key={cat.title + index}
                  onClick={() => {
                    if (isCenter) {
                      setSelectedCategory(cat);
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                  animate={{
                    x: `${xTranslate}%`,
                    scale: isCenter ? 1.02 : Math.max(0.72, scale),
                    rotateY: rotateY,
                    opacity: Math.max(0, opacity),
                    zIndex: zIndex,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 24,
                  }}
                  className={`absolute top-0 bottom-0 my-auto w-[240px] sm:w-72 h-[375px] sm:h-[415px] rounded-[32px] sm:rounded-[36px] p-4 sm:p-5 flex flex-col justify-between cursor-pointer select-none transition-colors border-2 shadow-2xl ${
                    isCenter
                      ? `bg-gradient-to-b ${cat.gradient} ${cat.borderColor} shadow-black shadow-[0_20px_50px_rgba(0,0,0,0.9)]`
                      : 'bg-[#14151b] border-zinc-800/80 shadow-black'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
                        isCenter
                          ? 'bg-black/60 text-white border-white/20'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                      }`}
                    >
                      {cat.numBadge}
                    </span>

                    {/* Active badge */}
                    {isCenter && (
                      <span
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{
                          backgroundColor: `${cat.accentColor}25`,
                          color: cat.accentColor,
                          border: `1px solid ${cat.accentColor}40`,
                        }}
                      >
                        सक्रिय फोकस
                      </span>
                    )}
                  </div>

                  {/* Icon & Title Area */}
                  <div className="flex flex-col items-center text-center my-auto">
                    {/* Squircle Icon Container */}
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-b ${cat.iconBg} flex items-center justify-center shadow-xl mb-3 transition-transform duration-300 ${
                        isCenter ? 'scale-105' : 'scale-90 opacity-80'
                      }`}
                    >
                      {cat.icon}
                    </div>

                    <h2
                      className={`text-base sm:text-xl font-black tracking-tight ${
                        isCenter ? 'text-white' : 'text-zinc-400'
                      }`}
                    >
                      {cat.title}
                    </h2>

                    <p className="text-[11px] sm:text-xs text-zinc-400 font-medium mt-0.5 line-clamp-1">
                      {cat.subtitle}
                    </p>

                    {/* ONLY IN CENTER CARD: Description & Hindi Label */}
                    <AnimatePresence>
                      {isCenter && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="w-full mt-2 sm:mt-3"
                        >
                          <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed px-1">
                            {cat.description}
                          </p>

                          <div className="mt-2 inline-block text-[10px] sm:text-[11px] font-semibold text-zinc-400 bg-black/50 px-2.5 py-0.5 rounded-full border border-white/5">
                            {cat.hindiLabel}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom Action Area */}
                  <div className="w-full pt-2 border-t border-white/10 flex items-center justify-between">
                    {isCenter ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(cat);
                        }}
                        className="w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-2xl bg-white text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-black stroke-none" />
                        <span>लेवल ड्रिल्स चुनें</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between text-zinc-500 text-[11px] font-bold">
                        <span>देखने के लिए टैप करें</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 my-2">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'w-7 bg-white'
                  : 'w-2 bg-zinc-700 hover:bg-zinc-500'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {!hideNavigation && (
          /* Bottom Floating Navigation Dock */
          <div className="fixed bottom-4 left-0 right-0 max-w-sm mx-auto px-4 z-50 pointer-events-auto">
            <div className="bg-[#1C1C1E]/95 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 flex items-center justify-around shadow-2xl">
              {/* My Story / Buddy Tab */}
              {onBackToBuddy && (
                <button
                  onClick={onBackToBuddy}
                  className="flex flex-col items-center gap-0.5 px-3 py-1 text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full border border-[#8E8E93] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]" />
                  </div>
                  <span className="text-[10px] font-medium">माई स्टोरी</span>
                </button>
              )}

              {/* Discover / Patterns Tab (Active Pill) */}
              <div className="bg-[#3A3A3C] text-amber-400 rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-sm">
                <Compass className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-white">डिस्कवर</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LEVEL SELECTION SCREEN (DIRECT RANDOM QUESTION ON LEVEL TAP)
  // ==========================================
  return (
    <div className="w-full min-h-screen bg-black text-white px-4 sm:px-6 pt-3 pb-32 select-none">
      {/* Top Header with Back to All Categories & Sound Control */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-xs font-semibold text-[#8E8E93] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>वापस डिस्कवर पर जाएं</span>
        </button>

        <AudioMuteButton size="sm" variant="glass" />
      </div>

      {/* Screen Title: Only Main Category Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${selectedCategory.accentColor}25`,
              color: selectedCategory.accentColor,
              border: `1px solid ${selectedCategory.accentColor}40`,
            }}
          >
            {selectedCategory.numBadge}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {selectedCategory.title}
        </h1>
      </div>

      {/* 
        CHOOSE LEVEL CARDS
      */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
            अभ्यास के लिए लेवल चुनें
          </h2>
        </div>

        <div className="space-y-3">
          {LEVELS.map((lvl) => {
            const count = PRACTICE_QUESTIONS.filter(
              (q) => q.category === selectedCategory.id && q.level === lvl.id
            ).length || 12;

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleSelectRandomLevelQuestion(lvl.id)}
                className="w-full text-left flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl bg-[#1C1C1E] border border-white/5 hover:border-blue-500/60 hover:bg-[#242428] transition-all cursor-pointer group active:scale-[0.98] shadow-md shadow-black/40"
              >
                {/* Circular Icon Container */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#2C2C2E] border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm sm:text-base shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
                    <span>L{lvl.levelNumber}</span>
                  </div>
                </div>

                {/* Level Title, Subtitle & Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {`${lvl.title}: ${lvl.subtitle}`}
                    </h3>
                  </div>

                  <p className="text-xs text-[#8E8E93] mt-1 leading-snug">
                    {lvl.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950/90 text-blue-300 border border-blue-800/80">
                      {count} ड्रिल्स
                    </span>
                    <span className="text-[10px] text-[#636366]">
                      • रैंडम ड्रिल शुरू करने के लिए टैप करें
                    </span>
                  </div>
                </div>

                {/* Action Icon */}
                <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                  <Mic className="w-4 h-4 stroke-[2.2]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {!hideNavigation && (
        <div className="fixed bottom-4 left-0 right-0 max-w-sm mx-auto px-4 z-30 pointer-events-auto">
          <div className="bg-[#1C1C1E]/95 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 flex items-center justify-around shadow-2xl">
            {/* My Story / Buddy Tab */}
            {onBackToBuddy && (
              <button
                onClick={onBackToBuddy}
                className="flex flex-col items-center gap-0.5 px-3 py-1 text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full border border-[#8E8E93] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]" />
                </div>
                <span className="text-[10px] font-medium">माई स्टोरी</span>
              </button>
            )}

            {/* Discover / Patterns Tab (Active Pill) */}
            <div className="bg-[#3A3A3C] text-amber-400 rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-sm">
              <Compass className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-white">डिस्कवर</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
