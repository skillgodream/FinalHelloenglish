import React from 'react';
import { motion } from 'motion/react';
import retailGussa from '../data/rockandrole/retail_gussa.json';
import retailSamjho from '../data/rockandrole/retail_samjho.json';
import retailJaldi from '../data/rockandrole/retail_jaldi.json';
import retailBadlo from '../data/rockandrole/retail_badlo.json';
import retailHisab from '../data/rockandrole/retail_hisab.json';
import retailKahan from '../data/rockandrole/retail_kahan.json';
import retailKhaas from '../data/rockandrole/retail_khaas.json';
import { ChevronRight, Sparkles, ArrowLeft } from 'lucide-react';
import { DottedWaveBackground } from '../components/DottedWaveBackground';
import { AudioMuteButton } from '../components/AudioMuteButton';

interface ThemeCardProps {
  theme: any;
  onSelect: () => void;
}

const RETAIL_META: Record<string, { image: string; tag: string }> = {
  retail_gussa: {
    image: 'https://images.unsplash.com/photo-1556742049-0a67e5572290?auto=format&fit=crop&w=800&q=80',
    tag: 'Anger & Frustration',
  },
  retail_samjho: {
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    tag: 'Product Questions',
  },
  retail_jaldi: {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    tag: 'Urgent Requests',
  },
  retail_badlo: {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    tag: 'Returns & Exchanges',
  },
  retail_hisab: {
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    tag: 'Billing & Payments',
  },
  retail_kahan: {
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    tag: 'Stock & Availability',
  },
  retail_khaas: {
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    tag: 'VIP Customers',
  },
};

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onSelect }) => {
  const meta = RETAIL_META[theme.bucketId] || {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    tag: 'Retail Service',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 cursor-pointer shadow-lg transition-all duration-200"
    >
      <img
        src={meta.image}
        alt={theme.theme}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
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

export const RetailDashboardView: React.FC<{
  onBack: () => void;
  onSelectTheme: (theme: any) => void;
}> = ({ onBack, onSelectTheme }) => {
  const data = [
    retailGussa,
    retailSamjho,
    retailJaldi,
    retailBadlo,
    retailHisab,
    retailKahan,
    retailKhaas,
  ];

  return (
    <div className="relative w-full bg-black text-white p-4 pt-6 pb-16 flex flex-col min-h-full overflow-hidden">
      {/* Black & Slight Grey High-Pixel Dotted Wave Background */}
      <DottedWaveBackground variant="monochrome" intensity={1.15} />

      <div className="relative z-10 flex flex-col w-full">
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/85 backdrop-blur-md border border-white/10 rounded-full text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <AudioMuteButton size="sm" variant="glass" />
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-1 text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Retail Sector</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">Retail Themes</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Select a customer scenario track to practice retail communication handling
          </p>
        </div>

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
