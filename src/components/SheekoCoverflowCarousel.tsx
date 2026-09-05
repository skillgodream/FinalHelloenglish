import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mic, Activity, BookOpen } from 'lucide-react';

interface SheekoCardData {
  id: string;
  title: string;
  translations: string[];
}

interface SheekoCoverflowCarouselProps {
  onVoiceStudio?: () => void;
  onPerformance?: () => void;
  onPatterns?: () => void;
}

const CARDS_DATA: SheekoCardData[] = [
  {
    id: 'supervisor',
    title: 'Supervisor',
    translations: ['पर्यवेक्षक', 'तत्त्वधायक', 'ಮೇಲ್ವಿಚಾರಕ', 'மேற்பார்வையாளர்', 'पर्यवेक्षकुडु', 'निरीक्षक'],
  },
  {
    id: 'verify',
    title: 'Verify',
    translations: ['सत्यापन', 'যাচাইকরণ', 'പരിശീലനേ', 'சரிபார்ப்பு', 'ధ్వీకరణ', 'സ്ഥിരീകരണം'],
  },
  {
    id: 'procedure',
    title: 'Procedure',
    translations: ['प्रक्रिया', 'प्रक्रिया', 'ಪ್ರಕ್ರಿಯೆ', 'நடைமுறை', 'ప్రక్రియ', 'പ്രക്രിയ'],
  },
  {
    id: 'feedback',
    title: 'Feedback',
    translations: ['फीडबैक', 'ফিডব্যাক', 'ಪ್ರಕ್ರಿಯೆ', 'கருத்து', 'ఫీడ్ బ్యాక్', 'ഫീഡ്ബാക്ക്'],
  },
];

export const SheekoCoverflowCarousel: React.FC<SheekoCoverflowCarouselProps> = ({
  onVoiceStudio,
  onPerformance,
  onPatterns,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic rotation every 1.3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CARDS_DATA.length);
    }, 1300);
    return () => clearInterval(timer);
  }, []);

  // Get indices for left, center, right
  const len = CARDS_DATA.length;
  const prevIndex = (currentIndex - 1 + len) % len;
  const centerIndex = currentIndex;
  const nextIndex = (currentIndex + 1) % len;

  const visibleCards = [
    { card: CARDS_DATA[prevIndex], position: 'left' },
    { card: CARDS_DATA[centerIndex], position: 'center' },
    { card: CARDS_DATA[nextIndex], position: 'right' },
  ];

  return (
    <div className="w-full relative py-1 overflow-hidden flex flex-col items-center justify-center">
      {/* Three Small Icon Buttons Centered on Top of Carousel */}
      <div className="w-full flex items-center justify-center mb-1">
        <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-800 shadow-lg">
          {onVoiceStudio && (
            <button
              onClick={onVoiceStudio}
              className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 hover:bg-sky-500 hover:text-black transition-all cursor-pointer shadow-sm"
              title="Voice Studio"
              aria-label="Voice Studio"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
            </button>
          )}
          {onPerformance && (
            <button
              onClick={onPerformance}
              className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 hover:bg-amber-500 hover:text-black transition-all cursor-pointer shadow-sm"
              title="Performance"
              aria-label="Performance"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
          )}
          {onPatterns && (
            <button
              onClick={onPatterns}
              className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 hover:bg-purple-500 hover:text-black transition-all cursor-pointer shadow-sm"
              title="Patterns"
              aria-label="Patterns"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="relative w-full max-w-[384px] h-[348px] flex items-center justify-center perspective-[1000px]">
        {visibleCards.map(({ card, position }) => {
          const isCenter = position === 'center';
          const isLeft = position === 'left';

          return (
            <motion.div
              key={card.id + position}
              animate={{
                scale: isCenter ? 1 : 0.82,
                x: isCenter ? 0 : isLeft ? -125 : 125,
                zIndex: isCenter ? 30 : 10,
                opacity: isCenter ? 1 : 0.45,
                filter: isCenter ? 'blur(0px)' : 'blur(3px)',
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={`absolute w-[240px] h-[324px] rounded-[32px] bg-gradient-to-b from-[#22232d] via-[#14151d] to-[#0d0e14] border ${
                isCenter ? 'border-zinc-500/80 shadow-[0_20px_50px_rgba(0,0,0,0.9)]' : 'border-zinc-800 shadow-xl'
              } p-5 flex flex-col items-center justify-between select-none cursor-pointer`}
              onClick={() => {
                if (isLeft) setCurrentIndex(prevIndex);
                if (!isCenter && !isLeft) setCurrentIndex(nextIndex);
              }}
            >
              {/* Brushed metallic top & user avatar */}
              <div className="flex flex-col items-center w-full pt-1">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-zinc-300 via-zinc-100 to-zinc-400 p-0.5 shadow-lg flex items-center justify-center mb-2">
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-zinc-200 to-zinc-400 flex items-center justify-center overflow-hidden relative">
                    <div className="w-5 h-5 rounded-full bg-white mb-1" />
                    <div className="absolute bottom-1 w-8 h-4 rounded-t-full bg-white" />
                  </div>
                </div>

                <h3 className="text-lg font-black text-white tracking-tight drop-shadow-md">
                  {card.title}
                </h3>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-zinc-700/60 my-0.5" />

              {/* Translations list */}
              <div className="flex-1 w-full flex flex-col items-center justify-center gap-1 py-0.5">
                {card.translations.map((trans, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium text-zinc-300/95 tracking-wide text-center"
                  >
                    {trans}
                  </span>
                ))}
              </div>

              {/* Bottom sparkle indicator */}
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(245,158,11,0.8)] mt-0.5" />
            </motion.div>
          );
        })}
      </div>

      {/* Carousel Dots */}
      <div className="flex items-center gap-1.5 mt-1">
        {CARDS_DATA.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === idx ? 'w-6 bg-amber-400' : 'w-1.5 bg-zinc-700 hover:bg-zinc-600'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
