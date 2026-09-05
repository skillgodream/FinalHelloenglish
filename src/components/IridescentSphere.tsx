import React from 'react';
import { motion } from 'motion/react';

interface IridescentSphereProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  isListening?: boolean;
  isPlayingAudio?: boolean;
  className?: string;
  onClick?: () => void;
}

export const IridescentSphere: React.FC<IridescentSphereProps> = ({
  size = 'lg',
  isListening = false,
  isPlayingAudio = false,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    hero: 'w-52 h-52',
  };

  const isActive = isListening || isPlayingAudio;

  return (
    <div 
      className={`relative flex items-center justify-center cursor-pointer select-none ${className}`}
      onClick={onClick}
    >
      {/* Outer subtle glow rings */}
      {isActive && (
        <>
          <motion.div
            className="absolute rounded-full bg-gradient-to-r from-[#C084FC]/50 via-[#F472B6]/45 to-[#38BDF8]/45 blur-xl pointer-events-none"
            style={{ width: '140%', height: '140%' }}
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute rounded-full border border-[#C084FC]/50 pointer-events-none"
            style={{ width: '125%', height: '125%' }}
            animate={{
              scale: [0.95, 1.15, 0.95],
              opacity: [0.6, 0.1, 0.6],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}

      {/* Floating sphere body */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full iridescent-sphere relative shadow-2xl flex items-center justify-center`}
        animate={{
          y: isActive ? [-3, 3, -3] : [-4, 4, -4],
          scale: isListening ? [0.98, 1.04, 0.98] : isPlayingAudio ? [1, 1.03, 1] : 1,
        }}
        transition={{
          duration: isActive ? 2 : 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Top-Left Specular highlight reflection */}
        <div className="absolute top-[12%] left-[20%] w-[36%] h-[28%] rounded-full bg-gradient-to-br from-white/95 via-white/40 to-transparent transform -rotate-45 pointer-events-none" />

        {/* Secondary soft bottom highlight */}
        <div className="absolute bottom-[10%] right-[18%] w-[45%] h-[25%] rounded-full bg-gradient-to-tl from-[#9fe4f7]/70 via-[#f8c4ea]/40 to-transparent blur-[2px] pointer-events-none" />

        {/* Center luminous core */}
        <div className="absolute inset-[15%] rounded-full bg-radial from-white/30 via-transparent to-transparent pointer-events-none" />

        {/* Optional inner icon or status if sm/md */}
        {size === 'sm' && (
          <span className="text-xs font-bold text-[#5B3E8E] drop-shadow-sm">AI</span>
        )}
      </motion.div>

      {/* Soft floor shadow */}
      <motion.div
        className="absolute -bottom-4 w-[60%] h-3 bg-[#A886E5]/20 rounded-full blur-md pointer-events-none"
        animate={{
          scaleX: isActive ? [0.9, 1.1, 0.9] : [0.95, 1.05, 0.95],
          opacity: isActive ? [0.3, 0.5, 0.3] : [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};
