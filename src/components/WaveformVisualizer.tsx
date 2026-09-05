import React from 'react';
import { motion } from 'motion/react';

interface WaveformVisualizerProps {
  isActive?: boolean;
  barCount?: number;
  className?: string;
  colorClass?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isActive = false,
  barCount = 28,
  className = '',
  colorClass = 'bg-[#B085F5]',
}) => {
  // Generate harmonious symmetrical base heights
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Symmetrical bell curve distribution
    const center = (barCount - 1) / 2;
    const dist = Math.abs(i - center) / center;
    const baseHeight = Math.max(10, Math.round(38 * (1 - dist * 0.65) + (i % 3) * 4));
    return { id: i, baseHeight };
  });

  return (
    <div className={`flex items-center justify-center gap-[3.5px] h-14 px-2 ${className}`}>
      {bars.map((bar, index) => {
        const delay = (index % 5) * 0.12;
        const activeMin = Math.max(8, bar.baseHeight * 0.3);
        const activeMax = Math.min(48, bar.baseHeight * 1.35);

        return (
          <motion.div
            key={bar.id}
            className={`w-[3px] rounded-full transition-colors duration-300 ${colorClass}`}
            animate={{
              height: isActive
                ? [activeMin, activeMax, activeMin]
                : bar.baseHeight * 0.45,
              opacity: isActive ? [0.7, 1, 0.7] : 0.4,
            }}
            transition={
              isActive
                ? {
                    duration: 0.8 + (index % 4) * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay,
                  }
                : { duration: 0.4 }
            }
            style={{
              minHeight: '4px',
            }}
          />
        );
      })}
    </div>
  );
};
