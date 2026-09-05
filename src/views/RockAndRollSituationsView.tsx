import React, { useEffect } from 'react';
import { ArrowLeft, ChevronRight, MessageSquareCode } from 'lucide-react';
import { motion } from 'motion/react';
import { DottedWaveBackground } from '../components/DottedWaveBackground';
import { playFixedAudio, stopSpeaking } from '../utils/audio';
import { AudioMuteButton } from '../components/AudioMuteButton';

const THEME_IMAGES: Record<string, string> = {
  pikku: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  chakkar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  jaldi: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
  mehmaan: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
  hisab: 'https://images.unsplash.com/photo-1556742049-0a67e5572290?auto=format&fit=crop&w=800&q=80',
  kyaHua: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
  vip: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  retail_gussa: 'https://images.unsplash.com/photo-1556742049-0a67e5572290?auto=format&fit=crop&w=800&q=80',
  retail_samjho: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  retail_jaldi: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  retail_badlo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  retail_hisab: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
  retail_kahan: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
  retail_khaas: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  qc_jaldi_delay: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=800&q=80',
  qc_damaged_missing: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  qc_wrong_address: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
  qc_quality_expiry: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  qc_out_of_stock: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
  qc_hisab_refund: 'https://images.unsplash.com/photo-1556742049-0a67e5572290?auto=format&fit=crop&w=800&q=80',
};

export const RockAndRollSituationsView: React.FC<{
  theme: any;
  onBack: () => void;
  onSelectChallenge: (challenge: any) => void;
}> = ({ theme, onBack, onSelectChallenge }) => {
  const bannerImage = THEME_IMAGES[theme.bucketId] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  useEffect(() => {
    playFixedAudio('H_scenario_selection.mp3');
    return () => {
      stopSpeaking();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black text-white p-4 pt-8 pb-16 flex flex-col overflow-hidden">
      {/* Black & Slight Grey High-Pixel Dotted Wave Background */}
      <DottedWaveBackground variant="monochrome" intensity={1.0} />

      <div className="relative z-10 flex flex-col w-full">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/85 backdrop-blur-md border border-white/10 rounded-full text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Themes</span>
          </button>

          <AudioMuteButton size="sm" variant="glass" />
        </div>

        {/* Theme Hero Banner Card with Real Image */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-white/10 mb-5 shadow-xl">
          <img
            src={bannerImage}
            alt={theme.theme}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/25" />
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              {theme.challenges?.length || 0} Workplace Scenarios
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">{theme.theme}</h1>
            <p className="text-xs text-zinc-300 line-clamp-1">{theme.themeDescription}</p>
          </div>
        </div>

        {/* Situations List */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Available Scenarios</h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {theme.challenges.map((c: any) => (
            <motion.div
              key={c.id}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="p-3.5 rounded-xl border border-white/[0.08] bg-zinc-900/85 backdrop-blur-md hover:bg-zinc-900 hover:border-white/20 cursor-pointer transition-all flex items-center justify-between gap-3"
              onClick={() => onSelectChallenge(c)}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 text-zinc-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquareCode className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-zinc-100">{c.title}</h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-snug">{c.shortDescription}</p>
                </div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
