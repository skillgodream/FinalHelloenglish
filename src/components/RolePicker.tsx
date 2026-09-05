import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface PickerProps {
  options: string[];
  onSelect: (option: string) => void;
}

const ITEM_HEIGHT = 48;
const RADIUS = 120; // 3D cylinder radius in px
const ANGLE_STEP = 24; // degrees per item

export const RolePicker: React.FC<PickerProps> = ({ options, onSelect }) => {
  const [offset, setOffset] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const targetOffsetRef = useRef<number>(0);
  const currentOffsetRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartYRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  currentOffsetRef.current = offset;

  // Spring animation loop
  const animateToTarget = useCallback((target: number, immediate = false) => {
    if (immediate) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      currentOffsetRef.current = target;
      targetOffsetRef.current = target;
      setOffset(target);
      const rounded = Math.round(target);
      const clamped = Math.max(0, Math.min(options.length - 1, rounded));
      setSelectedIndex(clamped);
      return;
    }

    targetOffsetRef.current = Math.max(0, Math.min(options.length - 1, target));

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const startAnimate = () => {
      const diff = targetOffsetRef.current - currentOffsetRef.current;
      if (Math.abs(diff) < 0.002) {
        currentOffsetRef.current = targetOffsetRef.current;
        setOffset(targetOffsetRef.current);
        const finalIndex = Math.round(targetOffsetRef.current);
        setSelectedIndex(finalIndex);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate(6); } catch (_) {}
        }
        return;
      }

      currentOffsetRef.current += diff * 0.24;
      setOffset(currentOffsetRef.current);

      const closestIndex = Math.round(currentOffsetRef.current);
      const clampedClosest = Math.max(0, Math.min(options.length - 1, closestIndex));
      setSelectedIndex(clampedClosest);

      animFrameRef.current = requestAnimationFrame(startAnimate);
    };

    animFrameRef.current = requestAnimationFrame(startAnimate);
  }, [options.length]);

  // Pointer Down (Touch / Mouse)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartOffsetRef.current = currentOffsetRef.current;
    lastYRef.current = e.clientY;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const currentY = e.clientY;
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const dy = currentY - lastYRef.current;

    velocityRef.current = (dy / dt) * 15;
    lastYRef.current = currentY;
    lastTimeRef.current = now;

    const deltaY = currentY - dragStartYRef.current;
    let newOffset = dragStartOffsetRef.current - deltaY / ITEM_HEIGHT;

    // Boundary resistance
    if (newOffset < 0) {
      newOffset = newOffset * 0.35;
    } else if (newOffset > options.length - 1) {
      const excess = newOffset - (options.length - 1);
      newOffset = (options.length - 1) + excess * 0.35;
    }

    currentOffsetRef.current = newOffset;
    setOffset(newOffset);

    const closestIndex = Math.max(0, Math.min(options.length - 1, Math.round(newOffset)));
    setSelectedIndex(closestIndex);
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    const momentumOffset = -velocityRef.current * 0.08;
    const projectedTarget = currentOffsetRef.current + momentumOffset;
    const nearestIndex = Math.max(0, Math.min(options.length - 1, Math.round(projectedTarget)));

    animateToTarget(nearestIndex);
  };

  // Wheel Scroll
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const delta = e.deltaY * 0.0035;
    let nextOffset = currentOffsetRef.current + delta;

    if (nextOffset < -0.5) nextOffset = -0.5;
    if (nextOffset > options.length - 0.5) nextOffset = options.length - 0.5;

    currentOffsetRef.current = nextOffset;
    setOffset(nextOffset);

    const closest = Math.max(0, Math.min(options.length - 1, Math.round(nextOffset)));
    setSelectedIndex(closest);

    if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    wheelTimeoutRef.current = setTimeout(() => {
      const snapIndex = Math.max(0, Math.min(options.length - 1, Math.round(currentOffsetRef.current)));
      animateToTarget(snapIndex);
    }, 120);
  };

  // Tap Item
  const handleItemClick = (index: number) => {
    animateToTarget(index);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-8 bg-[#090d16] text-white select-none overflow-hidden"
    >
      {/* Clean Minimal Header */}
      <div className="flex flex-col items-center text-center mt-8 z-10">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Select Industry
        </h2>
      </div>

      {/* 3D Cylindrical Wheel */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="relative w-full max-w-xs h-[240px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none z-10 my-auto"
        style={{ perspective: 1000 }}
      >
        {/* iOS Selection Glass Lens */}
        <div className="absolute w-[94%] h-[46px] rounded-xl bg-white/[0.08] border border-white/[0.14] shadow-[0_2px_16px_rgba(0,0,0,0.5)] backdrop-blur-md pointer-events-none" />

        {/* 3D Rotating Drum List */}
        <div
          className="relative w-full h-[48px] flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {options.map((option, index) => {
            const distance = index - offset;
            const angle = distance * ANGLE_STEP;
            const rad = (angle * Math.PI) / 180;
            const isVisible = Math.abs(angle) <= 85;

            if (!isVisible) return null;

            const opacity = Math.max(0.12, Math.pow(Math.cos(rad), 2.2));
            const scale = 0.88 + 0.2 * Math.cos(rad);
            const isExactSelected = index === selectedIndex;

            return (
              <div
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(index);
                }}
                style={{
                  transform: `rotateX(${-angle}deg) translateZ(${RADIUS}px) scale(${scale})`,
                  opacity,
                  height: ITEM_HEIGHT,
                  transformStyle: 'preserve-3d',
                }}
                className={`absolute inset-x-0 flex items-center justify-center transition-colors duration-150 cursor-pointer ${
                  isExactSelected
                    ? 'text-white font-bold text-xl drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]'
                    : 'text-zinc-400 font-medium text-base'
                }`}
              >
                <span className="flex items-center gap-2">
                  {option}
                  {isExactSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-cyan-400 text-black text-xs font-bold shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </motion.span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Top & Bottom Depth Vignettes */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#090d16] via-[#090d16]/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#090d16] via-[#090d16]/80 to-transparent pointer-events-none" />
      </div>

      {/* Clean Continue Button */}
      <div className="w-full max-w-xs mb-6 z-10">
        <button
          onClick={() => onSelect(options[selectedIndex])}
          className="w-full py-3.5 bg-white text-black font-bold text-base rounded-xl shadow-lg hover:bg-zinc-100 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <span className="text-zinc-500 text-sm">→</span>
        </button>
      </div>
    </motion.div>
  );
};
