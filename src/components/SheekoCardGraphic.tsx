import React from 'react';
import { BookOpen, Sparkles, Star, Flame } from 'lucide-react';

export const SheekoCardGraphic: React.FC = () => {
  return (
    <div className="w-full aspect-[16/10] rounded-[22px] bg-gradient-to-br from-[#2D1600] via-[#1D0E03] to-[#0A0501] border border-amber-500/50 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-amber-950/60 select-none">
      {/* Background glowing orbs & sparkles */}
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-amber-500/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-amber-700/20 blur-3xl pointer-events-none" />
      
      {/* Subtle Starbursts / Constellations */}
      <div className="absolute top-4 right-14 text-amber-300/40 animate-pulse">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="absolute bottom-12 right-6 text-amber-400/30">
        <Star className="w-3.5 h-3.5 fill-amber-400/30" />
      </div>

      {/* Top Bar: Badge & Tag */}
      <div className="flex items-center justify-between z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>My Day Stories</span>
        </div>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-amber-500/30 text-amber-200/90 text-[9px] font-bold">
          <Flame className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
          <span>Popular Track</span>
        </div>
      </div>

      {/* Center Art: 3D Storybook Graphic & Typography */}
      <div className="flex items-center justify-between gap-3 my-auto z-10">
        <div className="flex-1 min-w-0 pr-2">
          <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest block">
            Expressive English
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mt-0.5 drop-shadow-md">
            My Day Stories
          </h3>
          <p className="text-[11px] sm:text-xs text-amber-100/75 line-clamp-2 mt-1 leading-snug font-medium">
            Daily experiences, work shifts, childhood memories & life narratives.
          </p>
        </div>

        {/* Glowing Book Icon Art */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-600/40 via-amber-400/30 to-amber-200/20 border border-amber-400/60 p-3 flex items-center justify-center shadow-[0_0_24px_rgba(245,158,11,0.35)] backdrop-blur-md">
            <svg viewBox="0 0 48 48" className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" fill="none">
              <path
                d="M8 38V12C8 9.79086 9.79086 8 12 8H22C23.1046 8 24 8.89543 24 10V36C24 37.1046 23.1046 38 22 38H10C8.89543 38 8 38.8954 8 40"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fill-amber-950/70"
              />
              <path
                d="M40 38V12C40 9.79086 38.2091 8 36 8H26C24.8954 8 24 8.89543 24 10V36C24 37.1046 24.8954 38 26 38H38C39.1046 38 40 38.8954 40 40"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fill-amber-900/60"
              />
              <path d="M14 16H18M14 22H18M14 28H18" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
              <path d="M30 16H34M30 22H34M30 28H34" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
              <circle cx="24" cy="7" r="3" className="fill-amber-300" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Level Pills */}
      <div className="flex items-center gap-1.5 z-10 pt-1 border-t border-amber-500/20">
        <span className="text-[9px] font-bold text-amber-300/80 uppercase">Includes:</span>
        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-200 text-[9px] font-semibold">
          Words
        </span>
        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-200 text-[9px] font-semibold">
          Sentences
        </span>
        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-200 text-[9px] font-semibold">
          Moral Tales
        </span>
      </div>
    </div>
  );
};
