import React from 'react';
import { motion } from 'motion/react';
import pikku from '../data/rockandrole/pikku.json';
import chakkar from '../data/rockandrole/chakkar.json';
import jaldi from '../data/rockandrole/jaldi.json';
import mehmaan from '../data/rockandrole/mehmaan.json';
import hisab from '../data/rockandrole/hisab.json';
import kyaHua from '../data/rockandrole/kyaHua.json';
import vip from '../data/rockandrole/vip.json';
import { BarChart3, ChevronRight, Sparkles, ArrowLeft } from 'lucide-react';
import { DottedWaveBackground } from '../components/DottedWaveBackground';
import { AudioMuteButton } from '../components/AudioMuteButton';

interface ThemeCardProps {
  theme: any;
  onSelect: () => void;
}

const THEME_DATA: Record<string, { image: string; tag: string }> = {
  pikku: {
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    tag: 'De-escalation',
  },
  chakkar: {
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    tag: 'Guest Guidance',
  },
  jaldi: {
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    tag: 'Rapid Response',
  },
  mehmaan: {
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    tag: 'Special Care',
  },
  hisab: {
    image: 'https://images.unsplash.com/photo-1556742049-0a67e5572290?auto=format&fit=crop&w=800&q=80',
    tag: 'Billing & Folio',
  },
  kyaHua: {
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    tag: 'Issue Resolution',
  },
  vip: {
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    tag: 'Luxury Hospitality',
  },
};

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onSelect }) => {
  const meta = THEME_DATA[theme.bucketId] || {
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    tag: 'Customer Service',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 cursor-pointer shadow-lg transition-all duration-200"
    >
      {/* Real Photography Background */}
      <img
        src={meta.image}
        alt={theme.theme}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
      />

      {/* Cinematic Dark Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

      {/* Content Container */}
      <div className="relative h-full p-2.5 flex flex-col justify-end z-10 text-left">
        <h3 className="text-xs font-bold text-white tracking-tight drop-shadow-md leading-tight">
          {theme.theme}
        </h3>
        <p className="text-[10px] text-zinc-300 font-medium line-clamp-1 mt-0.5 opacity-90">
          {meta.tag}
        </p>
      </div>
    </motion.div>
  );
};

export const RockAndRollDashboardView: React.FC<{
  onBack: () => void;
  onSelectTheme: (theme: any) => void;
  onOpenDashboard: () => void;
}> = ({ onBack, onSelectTheme, onOpenDashboard }) => {
  const data = [pikku, chakkar, jaldi, mehmaan, hisab, kyaHua, vip];

  return (
    <div className="relative w-full bg-black text-white p-4 pt-6 pb-16 flex flex-col min-h-full overflow-hidden">
      {/* Black & Slight Grey High-Pixel Dotted Wave Background */}
      <DottedWaveBackground variant="monochrome" intensity={1.15} />

      <div className="relative z-10 flex flex-col w-full">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/85 backdrop-blur-md border border-white/10 rounded-full text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <AudioMuteButton size="sm" variant="glass" />
            <motion.button
              onClick={onOpenDashboard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/85 backdrop-blur-md border border-white/10 rounded-full text-zinc-300 hover:text-white text-xs font-medium cursor-pointer"
              animate={{
                scale: [1, 1.03, 1],
                borderColor: ['rgba(255,255,255,0.1)', 'rgba(212,212,216,0.4)', 'rgba(255,255,255,0.1)'],
              }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            >
              <BarChart3 className="w-3.5 h-3.5 text-zinc-300" />
              <span>Stats</span>
            </motion.button>
          </div>
        </div>

        {/* Screen Title */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-1 text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Roleplay Tracks</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">Rock & Roll Themes</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Select a workplace customer track to practice high-pressure conversation handling
          </p>
        </div>

        {/* Themes Cards Grid - 3 Column Layout matching reference */}
        <div className="grid grid-cols-3 gap-2.5">
          {data.map((d) => (
            <ThemeCard
              key={d.bucketId}
              theme={d}
              onSelect={() => onSelectTheme(d)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
