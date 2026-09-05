import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { DottedWaveBackground } from '../components/DottedWaveBackground';
import { AudioMuteButton } from '../components/AudioMuteButton';

export const RockAndRollDummyView: React.FC<{ profileName: string; onBack: () => void }> = ({ profileName, onBack }) => {
  return (
    <div className="relative w-full min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Black & Slight Grey High-Pixel Dotted Wave Background */}
      <DottedWaveBackground variant="monochrome" intensity={1.15} />

      <button 
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white uppercase tracking-wider font-bold transition-colors bg-zinc-900/85 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-lg cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Profiles
      </button>

      <div className="absolute top-6 right-6 z-20">
        <AudioMuteButton size="sm" variant="glass" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-zinc-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-2xl flex flex-col items-center"
      >
        <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-zinc-300 mb-4 shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-2 drop-shadow-sm">
          {profileName} Section
        </h1>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          We are adding relevant scenarios and roleplay content for <span className="text-white font-semibold">{profileName}</span> soon. Check back shortly!
        </p>

        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer active:scale-95"
        >
          Return to Profiles
        </button>
      </motion.div>
    </div>
  );
};
