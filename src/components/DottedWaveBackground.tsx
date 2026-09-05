import React, { useEffect, useRef } from 'react';

interface DottedWaveBackgroundProps {
  className?: string;
  intensity?: number;
  variant?: 'color' | 'monochrome';
}

export const DottedWaveBackground: React.FC<DottedWaveBackgroundProps> = ({
  className = '',
  intensity = 1.0,
  variant = 'color',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      // High-pixel DPR scaling for razor sharp dots
      const dpr = Math.min(window.devicePixelRatio || 2, 3);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    let time = 0;

    // Grid configuration for the 3D high-pixel dotted wave
    const NUM_ROWS = 36;       // Parallel contour lines
    const COLS_PER_ROW = 85;   // Dotted resolution per line

    const render = () => {
      time += 0.008;

      if (!width || !height || width <= 20 || height <= 20) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      try {
        ctx.clearRect(0, 0, width, height);
      
      if (variant === 'monochrome') {
        // Deep Pitch Black Base Background
        const bgGrad = ctx.createLinearGradient(0, 0, width * 0.3, height);
        bgGrad.addColorStop(0, '#000000');
        bgGrad.addColorStop(0.4, '#030304');
        bgGrad.addColorStop(0.7, '#050507');
        bgGrad.addColorStop(1, '#010102');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Very subtle dark slate-grey underglow under left mountain peak
        const leftGlow = ctx.createRadialGradient(
          width * 0.22,
          height * 0.72,
          10,
          width * 0.22,
          height * 0.72,
          width * 0.55
        );
        leftGlow.addColorStop(0, `rgba(50, 52, 60, ${0.18 * intensity})`);
        leftGlow.addColorStop(0.45, `rgba(32, 34, 40, ${0.08 * intensity})`);
        leftGlow.addColorStop(0.8, 'rgba(15, 16, 20, 0.02)');
        leftGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = leftGlow;
        ctx.fillRect(0, 0, width, height);

        // Very subtle deep charcoal underglow on right
        const rightGlow = ctx.createRadialGradient(
          width * 0.78,
          height * 0.78,
          10,
          width * 0.78,
          height * 0.78,
          width * 0.5
        );
        rightGlow.addColorStop(0, `rgba(40, 42, 50, ${0.12 * intensity})`);
        rightGlow.addColorStop(0.5, `rgba(25, 26, 32, ${0.05 * intensity})`);
        rightGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = rightGlow;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Base background: Deep dark midnight navy/black gradient (Color variant)
        const bgGrad = ctx.createLinearGradient(0, 0, width * 0.3, height);
        bgGrad.addColorStop(0, '#020409');
        bgGrad.addColorStop(0.35, '#040815');
        bgGrad.addColorStop(0.7, '#060b1e');
        bgGrad.addColorStop(1, '#020308');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Ambient Underglow 1: Rich dark crimson/ruby gradient under left mountain peak
        const leftGlow = ctx.createRadialGradient(
          width * 0.22,
          height * 0.72,
          10,
          width * 0.22,
          height * 0.72,
          width * 0.55
        );
        leftGlow.addColorStop(0, `rgba(220, 16, 62, ${0.22 * intensity})`);
        leftGlow.addColorStop(0.4, `rgba(160, 12, 48, ${0.11 * intensity})`);
        leftGlow.addColorStop(0.75, `rgba(90, 6, 28, ${0.03 * intensity})`);
        leftGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = leftGlow;
        ctx.fillRect(0, 0, width, height);

        // Ambient Underglow 2: Deep violet/cobalt gradient on right
        const rightGlow = ctx.createRadialGradient(
          width * 0.78,
          height * 0.78,
          10,
          width * 0.78,
          height * 0.78,
          width * 0.5
        );
        rightGlow.addColorStop(0, `rgba(88, 70, 220, ${0.18 * intensity})`);
        rightGlow.addColorStop(0.42, `rgba(62, 48, 180, ${0.09 * intensity})`);
        rightGlow.addColorStop(0.78, `rgba(28, 18, 100, ${0.02 * intensity})`);
        rightGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = rightGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw the high-pixel 3D undulating dotted mesh
      // Each row represents a depth contour line from back (row 0) to front (row NUM_ROWS - 1)
      for (let r = 0; r < NUM_ROWS; r++) {
        const rowProgress = r / (NUM_ROWS - 1); // 0 (back) to 1 (front)
        
        // Depth perspective parameters
        const depthY = height * 0.46 + rowProgress * (height * 0.44);
        const rowAlpha = 0.38 + rowProgress * 0.62;
        const baseDotSize = 0.95 + rowProgress * 1.15;

        for (let c = 0; c < COLS_PER_ROW; c++) {
          const colProgress = c / (COLS_PER_ROW - 1); // 0 (left) to 1 (right)
          const x = colProgress * width;

          // Compute 3D elevation matching the uploaded reference image:
          // 1. High prominent mountain peak on left (centered around colProgress = 0.18 - 0.24)
          const leftPeakDist = Math.abs(colProgress - 0.20);
          const leftMountain = Math.exp(-Math.pow(leftPeakDist / 0.16, 2)) * (height * 0.24);

          // 2. Secondary gentle rolling crest in center-right (colProgress ~ 0.55 - 0.65)
          const midPeakDist = Math.abs(colProgress - 0.58);
          const midRidge = Math.exp(-Math.pow(midPeakDist / 0.22, 2)) * (height * 0.09);

          // 3. Low rolling waves towards right
          const rightWave = Math.sin(colProgress * Math.PI * 3 + time * 0.5 + rowProgress * 2) * (height * 0.025);

          // 4. Subtle dynamic harmonic breathing
          const harmonic = Math.sin(colProgress * 5 + rowProgress * 3 - time) * (height * 0.012)
            + Math.cos(colProgress * 3 - time * 0.6) * (height * 0.008);

          // Total height displacement
          const elevation = (leftMountain + midRidge + rightWave + harmonic) * (0.85 + 0.15 * Math.sin(time * 0.8 + rowProgress));
          const y = depthY - elevation;

          let rVal: number, gVal: number, bVal: number;
          let dotAlpha = 1.0;

          if (variant === 'monochrome') {
            // Very Dark Grey Palette (no bright white/silver):
            // Deep dark charcoal to muted mid-dark grey across undulating waves
            if (colProgress < 0.38) {
              const t = colProgress / 0.38;
              const val = Math.round(75 + t * 25); // 75 -> 100 (subtle dark grey crest)
              rVal = val;
              gVal = val;
              bVal = Math.round(val + 3);
            } else if (colProgress < 0.68) {
              const t = (colProgress - 0.38) / 0.3;
              const val = Math.round(100 - t * 35); // 100 -> 65 (deep muted charcoal)
              rVal = val;
              gVal = val;
              bVal = Math.round(val + 2);
            } else {
              const t = (colProgress - 0.68) / 0.32;
              const val = Math.round(65 - t * 25); // 65 -> 40 (very dark graphite grey)
              rVal = val;
              gVal = val;
              bVal = val;
            }
            dotAlpha = 0.85;
          } else {
            // Neon Red to Magenta to Cobalt Palette
            if (colProgress < 0.38) {
              const t = colProgress / 0.38;
              rVal = 255;
              gVal = Math.round(20 + t * 40);
              bVal = Math.round(75 + t * 140);
            } else if (colProgress < 0.68) {
              const t = (colProgress - 0.38) / 0.3;
              rVal = Math.round(255 - t * 135);
              gVal = Math.round(60 + t * 40);
              bVal = Math.round(215 + t * 35);
            } else {
              const t = (colProgress - 0.68) / 0.32;
              rVal = Math.round(120 - t * 75);
              gVal = Math.round(100 + t * 30);
              bVal = Math.round(250 + t * 5);
            }
          }

          // Elevation brightness boost: dots higher up on peaks glow subtly
          const elevationBoost = Math.min(1.0, (elevation / (height * 0.24)));
          const finalAlpha = Math.min(1.0, (rowAlpha * 0.6 + elevationBoost * 0.4)) * intensity * dotAlpha;
          const dotRadius = baseDotSize * (1 + elevationBoost * 0.35);

          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${finalAlpha})`;
          ctx.fill();

          // Subtle extra glow for peak dots
          if (elevationBoost > 0.6 && r % 2 === 0 && c % 2 === 0) {
            ctx.beginPath();
            ctx.arc(x, y, dotRadius * 2.0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${finalAlpha * (variant === 'monochrome' ? 0.15 : 0.22)})`;
            ctx.fill();
          }
        }
      }
      } catch (err) {
        console.warn('Canvas render error suppressed:', err);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [intensity]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
