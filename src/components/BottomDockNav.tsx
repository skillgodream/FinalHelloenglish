import React, { useState } from 'react';
import { Activity, Compass, Sparkles, Footprints, Music, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTranslation } from '../lib/translations';
import { isPlaygroundActiveAndIncomplete } from '../utils/playgroundManager';

export type NavTab = 'sheeko' | 'dashboard' | 'buddy' | 'snippets' | 'myday' | 'fitness' | 'course' | 'profile' | 'challenge' | 'drill' | 'rocknroll' | 'practice' | 'home' | 'progress' | 'discover';

interface BottomDockNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language?: 'en' | 'hi';
}

interface PopoutItem {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  gradient: string;
  ringColor: string;
  shadowColor: string;
  iconColor: string;
}

export const BottomDockNav: React.FC<BottomDockNavProps> = ({
  activeTab,
  onSelectTab,
  language = 'en',
}) => {
  const [isSheekoOpen, setIsSheekoOpen] = useState<boolean>(false);
  const isPlaygroundIncomplete = isPlaygroundActiveAndIncomplete();

  const popoutIcons: PopoutItem[] = [
    {
      id: 'discover',
      label: 'डिस्कवर',
      Icon: Compass,
      gradient: 'from-sky-500 to-blue-600',
      ringColor: 'ring-sky-400/40',
      shadowColor: 'shadow-[0_0_25px_rgba(56,189,248,0.5)]',
      iconColor: 'text-white',
    },
    {
      id: 'sheeko',
      label: 'Sheeko',
      Icon: Sparkles,
      gradient: 'from-amber-400 to-yellow-500',
      ringColor: 'ring-amber-400/40',
      shadowColor: 'shadow-[0_0_25px_rgba(245,158,11,0.5)]',
      iconColor: 'text-slate-950',
    },
    {
      id: 'buddy',
      label: 'Buddy',
      Icon: Footprints,
      gradient: 'from-cyan-400 via-sky-500 to-blue-600',
      ringColor: 'ring-cyan-400/50',
      shadowColor: 'shadow-[0_0_25px_rgba(6,182,212,0.6)]',
      iconColor: 'text-slate-950',
    },
    {
      id: 'rocknroll',
      label: 'Rock and Roll',
      Icon: Music,
      gradient: 'from-purple-500 to-fuchsia-600',
      ringColor: 'ring-purple-400/40',
      shadowColor: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]',
      iconColor: 'text-white',
    },
  ];

  const handlePopoutClick = (id: string) => {
    setIsSheekoOpen(false);
    if (id === 'buddy') {
      onSelectTab('buddy');
    } else if (id === 'rocknroll') {
      onSelectTab('rocknroll');
    } else if (id === 'sheeko') {
      onSelectTab('challenge');
    } else if (id === 'discover' || id === 'bytes') {
      onSelectTab('discover');
    }
  };

  return (
    <>
      {/* Backdrop when 4 icons are popped out */}
      <AnimatePresence>
        {isSheekoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSheekoOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs pointer-events-auto"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-0 right-0 z-50 flex flex-col items-center justify-center px-3 pointer-events-none">
        {/* Popped-out 4 Icons (Only Icons) */}
        <AnimatePresence>
          {isSheekoOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                mass: 0.6,
              }}
              className="pointer-events-auto mb-4 bg-slate-950/90 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-3 sm:p-4 flex items-center justify-center gap-3.5 sm:gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
            >
              {popoutIcons.map((item, index) => {
                const ItemIcon = item.Icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handlePopoutClick(item.id)}
                    initial={{ opacity: 0, scale: 0.5, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 10 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 24,
                      delay: index * 0.05,
                    }}
                    whileHover={{ scale: 1.15, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${item.gradient} ${item.shadowColor} ring-2 ${item.ringColor} flex items-center justify-center cursor-pointer transition-transform duration-150 relative active:scale-95`}
                    title={item.label}
                    aria-label={item.label}
                  >
                    <ItemIcon className={`w-6 h-6 sm:w-7 sm:h-7 ${item.iconColor} stroke-[2.2]`} />
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dock Navigation */}
        <nav
          aria-label="Main Navigation"
          className="pointer-events-auto bg-[#101522]/95 backdrop-blur-2xl rounded-full px-7 sm:px-8 py-2.5 border border-slate-800/60 flex items-center justify-between gap-6 sm:gap-8 shadow-2xl shadow-black/80 relative w-full max-w-xs sm:max-w-sm"
        >
          {/* 1. Summary */}
          <button
            onClick={() => {
              setIsSheekoOpen(false);
              onSelectTab('dashboard');
            }}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'dashboard' || activeTab === 'fitness'
                ? 'text-slate-200'
                : 'text-[#8A92A6] hover:text-slate-200'
            }`}
            title={getTranslation(language, 'summary')}
          >
            <Activity className="w-5.5 h-5.5 stroke-[2]" />
            <span className="text-[10px] font-medium tracking-tight">{getTranslation(language, 'summary')}</span>
          </button>

          {/* 2. Sheeko Center Button */}
          <div className="relative flex flex-col items-center -mt-6">
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsSheekoOpen((prev) => !prev)}
              className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-xl relative ${
                isSheekoOpen
                  ? 'bg-[#F5C453] text-slate-950 ring-4 ring-[#F5C453]/30 shadow-[0_0_25px_rgba(245,196,83,0.5)]'
                  : 'bg-gradient-to-tr from-[#E2B13C] via-[#F5C453] to-[#FCE38A] text-slate-950 ring-4 ring-[#0B0F19] shadow-[0_0_20px_rgba(245,196,83,0.4)]'
              }`}
              title="Sheeko"
              aria-label="Sheeko Menu"
            >
              {isSheekoOpen ? (
                <X className="w-7 h-7 stroke-[2.8]" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <Sparkles className="w-7 h-7 stroke-[2.2] fill-amber-950/20" />
                  {isPlaygroundIncomplete && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E2B13C] ring-2 ring-[#0B0F19]" />
                  )}
                </div>
              )}
            </motion.button>
            <span className="text-[10px] font-extrabold tracking-tight text-[#F5C453] mt-1 uppercase">
              sheeko
            </span>
          </div>

          {/* 3. Profile (unattached icon) */}
          <button
            type="button"
            onClick={() => {
              setIsSheekoOpen(false);
            }}
            className="flex flex-col items-center gap-1 transition-colors cursor-pointer text-[#8A92A6] hover:text-slate-200"
            title={getTranslation(language, 'profile')}
          >
            <User className="w-5.5 h-5.5 stroke-[2]" />
            <span className="text-[10px] font-medium tracking-tight">{getTranslation(language, 'profile')}</span>
          </button>
        </nav>
      </div>
    </>
  );
};

