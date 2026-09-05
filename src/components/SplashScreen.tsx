import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [zoomComplete, setZoomComplete] = useState(false);
  const onFinishRef = React.useRef(onFinish);
  onFinishRef.current = onFinish;
  const finishedRef = React.useRef(false);

  const handleFinish = React.useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (onFinishRef.current) {
      onFinishRef.current();
    }
  }, []);

  useEffect(() => {
    // Zoom-in finishes after 500ms
    const zoomTimer = setTimeout(() => {
      setZoomComplete(true);
    }, 500);

    // Auto-advance after 4.3 seconds (4300ms)
    const autoFinishTimer = setTimeout(() => {
      handleFinish();
    }, 4300);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(autoFinishTimer);
    };
  }, [handleFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 text-white cursor-pointer select-none overflow-hidden px-6 py-12"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top subtle badge */}
      <div className="w-full flex justify-center pt-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: zoomComplete ? 0.8 : 0, y: zoomComplete ? 0 : -10 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] uppercase tracking-[0.25em] font-semibold text-sky-400 backdrop-blur-md"
          style={{ fontFamily: "'Syncopate', sans-serif" }}
        >
          <Sparkles className="w-3 h-3 text-sky-400 animate-pulse" />
          <span>ALL NEW</span>
        </motion.div>
      </div>

      {/* Central Wordmark with Slow Zoom-In Animation */}
      <div className="flex flex-col items-center justify-center my-auto relative z-10 text-center px-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, filter: 'blur(8px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative"
        >
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-white"
            style={{ fontFamily: "'Syncopate', sans-serif" }}
          >
            HELLO ENGLISH
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: zoomComplete ? 0.75 : 0, y: zoomComplete ? 0 : 8 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs sm:text-sm text-slate-400 tracking-widest uppercase mt-3 font-medium"
        >
          Speak with Confidence
        </motion.p>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: zoomComplete ? '100px' : '40px', opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-[2px] bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 mt-5 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)]"
        />
      </div>

      {/* Bottom Interactive Hint */}
      <div className="w-full flex flex-col items-center pb-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: zoomComplete ? 1 : 0, y: zoomComplete ? 0 : 10 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center space-y-2"
        >
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-slate-500 animate-pulse">
            Tap anywhere to continue
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-sky-400/80 mt-1 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
        </motion.div>
      </div>
    </motion.div>
  );
};
