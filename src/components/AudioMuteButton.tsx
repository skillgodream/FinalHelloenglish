import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { isAudioMuted, toggleAudioMute } from '../utils/audio';

interface AudioMuteButtonProps {
  className?: string;
  variant?: 'glass' | 'dark' | 'light' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const AudioMuteButton: React.FC<AudioMuteButtonProps> = ({
  className = '',
  variant = 'glass',
  size = 'md',
  showLabel = false,
}) => {
  const [muted, setMuted] = useState<boolean>(isAudioMuted());

  useEffect(() => {
    const handleMuteChange = (e: any) => {
      if (e?.detail?.muted !== undefined) {
        setMuted(e.detail.muted);
      } else {
        setMuted(isAudioMuted());
      }
    };

    window.addEventListener('app_audio_mute_change', handleMuteChange);
    window.addEventListener('storage', handleMuteChange);

    return () => {
      window.removeEventListener('app_audio_mute_change', handleMuteChange);
      window.removeEventListener('storage', handleMuteChange);
    };
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = toggleAudioMute();
    setMuted(newMuted);
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-9 h-9 text-sm',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5',
  }[size];

  const variantStyles = {
    glass: 'bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-md border border-white/10 text-zinc-200 shadow-md',
    dark: 'bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 shadow-sm',
    light: 'bg-white/90 hover:bg-white border border-zinc-200 text-zinc-700 shadow-sm',
    floating: 'bg-zinc-900/90 hover:bg-zinc-800/95 backdrop-blur-lg border border-white/15 text-white shadow-xl',
  }[variant];

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={handleToggle}
      title={muted ? 'Unmute Audio & Voice' : 'Mute Audio & Voice'}
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${sizeClasses} ${variantStyles} ${className} ${
        muted ? 'text-zinc-400 opacity-90' : 'text-emerald-400 ring-1 ring-emerald-500/20'
      }`}
    >
      <AnimatePresence mode="wait">
        {muted ? (
          <motion.div
            key="muted"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center text-zinc-400"
          >
            <VolumeX className={iconSizes} />
          </motion.div>
        ) : (
          <motion.div
            key="unmuted"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center text-zinc-200"
          >
            <Volume2 className={iconSizes} />
          </motion.div>
        )}
      </AnimatePresence>

      {showLabel && (
        <span className="ml-1.5 font-medium text-[11px] whitespace-nowrap pr-1">
          {muted ? 'Muted' : 'Sound On'}
        </span>
      )}
    </motion.button>
  );
};
