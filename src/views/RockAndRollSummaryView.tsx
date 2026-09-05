import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Sparkles, 
  ChevronRight, 
  MessageSquareCode, 
  Shield, 
  BarChart3, 
  Clock, 
  MessageCircle, 
  Activity, 
  HeartHandshake 
} from 'lucide-react';
import { motion } from 'motion/react';
import { DottedWaveBackground } from '../components/DottedWaveBackground';

interface HandlingMetric {
  label: string;
  value: string;
  rating: number; // 1 to 4
  percentage: number;
  colorClass: string;
}

export const RockAndRollSummaryView: React.FC<{ challenge: any; summary?: any; onBack: () => void }> = ({ challenge, summary, onBack }) => {
  const [graphMode, setGraphMode] = useState<'radar' | 'benchmark'>('radar');

  const score = summary?.score || 84;
  const situationName = summary?.situationName || challenge?.title || 'Workplace Roleplay Situation';

  // Quantitative session metrics
  const turnCount = summary?.turnCount || 4;
  const wordCount = summary?.wordCount || 74;
  const empathyScore = summary?.empathyScore || 88;
  const handlingScore = summary?.handlingScore || score;
  const grammarScore = summary?.grammarScore || Math.min(95, score + 4);
  const wpm = Math.round((wordCount / Math.max(turnCount * 0.4, 1)) * 1.5) || 116;

  const rawHandled = summary?.howIHandledIt || {
    communication: 'Good',
    speaking: 'Good',
    confidence: 'Getting Better',
    situationHandling: 'Good'
  };

  const getMetricScore = (val: string): { rating: number; pct: number } => {
    const lower = (val || '').toLowerCase();
    if (lower.includes('great') || lower.includes('excellent')) return { rating: 4, pct: 92 };
    if (lower.includes('good')) return { rating: 3, pct: 84 };
    if (lower.includes('better') || lower.includes('fair')) return { rating: 2, pct: 72 };
    return { rating: 1, pct: 58 };
  };

  const commM = getMetricScore(rawHandled.communication);
  const speakM = getMetricScore(rawHandled.speaking);
  const confM = getMetricScore(rawHandled.confidence);
  const sitM = getMetricScore(rawHandled.situationHandling);

  const metrics: HandlingMetric[] = [
    { 
      label: 'Communication Flow', 
      value: rawHandled.communication || 'Good', 
      rating: commM.rating, 
      percentage: commM.pct,
      colorClass: 'text-sky-300'
    },
    { 
      label: 'Spoken Delivery', 
      value: rawHandled.speaking || 'Good', 
      rating: speakM.rating, 
      percentage: speakM.pct,
      colorClass: 'text-indigo-300'
    },
    { 
      label: 'Poise & Tone', 
      value: rawHandled.confidence || 'Getting Better', 
      rating: confM.rating, 
      percentage: confM.pct,
      colorClass: 'text-amber-300'
    },
    { 
      label: 'Problem Resolution', 
      value: rawHandled.situationHandling || 'Good', 
      rating: sitM.rating, 
      percentage: sitM.pct,
      colorClass: 'text-emerald-300'
    },
  ];

  // 5 Radar Dimensions for Graphical Chart (0 to 100)
  const radarDimensions = [
    { label: 'Communication', value: commM.pct },
    { label: 'Fluency', value: Math.min(96, Math.max(65, Math.round(wpm * 0.72))) },
    { label: 'Empathy', value: empathyScore },
    { label: 'Resolution', value: sitM.pct },
    { label: 'Grammar', value: grammarScore },
  ];

  const iDidWell = summary?.iDidWell && summary.iDidWell.length > 0 ? summary.iDidWell : [
    "Maintained a calm, respectful, and attentive tone with the customer.",
    "Acknowledged the core issue directly without becoming defensive."
  ];

  const practiceNext = summary?.practiceNext && summary.practiceNext.length > 0 ? summary.practiceNext : [
    "Minimize hesitant pauses when presenting alternative options.",
    "State your resolution timeline with clear, concise commitments."
  ];

  const myNaturalEnglish = summary?.myNaturalEnglish && summary.myNaturalEnglish.length > 0 ? summary.myNaturalEnglish : [
    { 
      learnerSaid: "I will check room right now sir.", 
      betterEnglish: "I will check the room right away, sir.", 
      explanation: "Add article 'the' and substitute 'right away' for more natural service cadence." 
    },
    { 
      learnerSaid: "Don't worry I make it fix.", 
      betterEnglish: "Don't worry, I will have this taken care of immediately.", 
      explanation: "Use 'have this taken care of' to convey confident ownership." 
    }
  ];

  const nextTimeGoal = summary?.nextTimeGoal || "Deliver your expected resolution timeframe clearly within the first exchange.";

  const getPerformanceVerdict = (s: number) => {
    if (s >= 88) return { verdict: 'Exceptional Execution', note: 'Customer handled with high authority and poise', percentile: 'Top 8%' };
    if (s >= 75) return { verdict: 'Solid Resolution', note: 'Clear communication with strong situational control', percentile: 'Top 18%' };
    return { verdict: 'Developing Fluency', note: 'Good foundational handling with polishing opportunities', percentile: 'Top 35%' };
  };

  const performance = getPerformanceVerdict(score);

  // SVG Radar Polygon Math (5 vertices)
  const cx = 135;
  const cy = 115;
  const rMax = 72;
  const numPoints = radarDimensions.length;

  const getCoord = (index: number, valPercent: number) => {
    const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
    const r = (valPercent / 100) * rMax;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Construct SVG polygon points
  const userPolygonPoints = radarDimensions
    .map((dim, i) => {
      const { x, y } = getCoord(i, dim.value);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const targetPolygonPoints = radarDimensions
    .map((_, i) => {
      const { x, y } = getCoord(i, 75);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="relative w-full min-h-screen bg-[#07080a] text-zinc-100 p-4 pt-7 pb-16 flex flex-col items-center overflow-hidden font-sans">
      {/* Dark Monochrome Dotted Wave Background */}
      <DottedWaveBackground variant="monochrome" intensity={0.9} />

      <div className="relative z-10 w-full max-w-[430px] flex flex-col space-y-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(217,119,6,0.5)]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              Roleplay Debrief
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 font-medium tracking-wide">
            Session Report
          </span>
        </div>

        {/* Dimensional Hero Score Card with Warm Amber & Sapphire Accents */}
        <div className="relative rounded-2xl bg-gradient-to-b from-zinc-800/95 via-zinc-900/95 to-[#0b0c10] border border-zinc-700/50 shadow-[0_16px_36px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] p-5 overflow-hidden">
          {/* Subtle metallic amber top highlight bar */}
          <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-950/50 border border-amber-600/40 text-[10px] font-semibold uppercase tracking-wider text-amber-300 mb-2">
                <Shield className="w-3 h-3 text-amber-400" />
                <span>{performance.verdict}</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug line-clamp-2">
                {situationName}
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono font-semibold text-zinc-300">
                  {performance.percentile}
                </span>
                <span className="text-[11px] text-zinc-400">
                  +7 pts vs baseline
                </span>
              </div>
            </div>

            {/* Sculpted Dimensional Score Plaque */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-21 h-21 rounded-2xl bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border border-amber-500/30 shadow-[inset_0_2px_4px_rgba(245,158,11,0.12),0_8px_24px_rgba(0,0,0,0.85)]">
              <span className="text-3xl font-black text-amber-100 tracking-tighter leading-none drop-shadow-sm">
                {score}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase text-amber-400/80 tracking-wider mt-1">
                out of 100
              </span>
            </div>
          </div>
        </div>

        {/* Quantified Dialogue Numbers Ribbon */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Exchanges', value: `${turnCount}`, sub: 'Turns', icon: MessageCircle, color: 'text-sky-400', bg: 'bg-sky-950/40 border-sky-600/30' },
            { label: 'Volume', value: `${wordCount}`, sub: 'Words', icon: BarChart3, color: 'text-indigo-400', bg: 'bg-indigo-950/40 border-indigo-600/30' },
            { label: 'Pacing', value: `${wpm}`, sub: 'WPM', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-600/30' },
            { label: 'Empathy', value: `${empathyScore}%`, sub: 'Index', icon: HeartHandshake, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-600/30' },
          ].map((item, i) => (
            <div 
              key={i} 
              className={`rounded-xl ${item.bg} border p-2 flex flex-col items-center justify-center text-center shadow-sm`}
            >
              <item.icon className={`w-3.5 h-3.5 ${item.color} mb-1`} />
              <div className="text-xs sm:text-sm font-black text-white leading-tight font-mono">
                {item.value}
              </div>
              <div className="text-[9px] font-semibold text-zinc-400 uppercase tracking-tight">
                {item.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Visual Graph Section: Interactive Radar & Benchmark Bars */}
        <div className="rounded-2xl bg-zinc-900/85 border border-zinc-800 shadow-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Performance Analytics
              </h2>
              <p className="text-[10px] text-zinc-400 mt-0.5">5-point skill competency distribution</p>
            </div>

            {/* Toggle Graph Mode */}
            <div className="flex rounded-lg bg-zinc-950 p-0.5 border border-zinc-800">
              <button
                onClick={() => setGraphMode('radar')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                  graphMode === 'radar'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Radar
              </button>
              <button
                onClick={() => setGraphMode('benchmark')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                  graphMode === 'benchmark'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Bars
              </button>
            </div>
          </div>

          {graphMode === 'radar' ? (
            /* Radar Spider Chart */
            <div className="flex flex-col items-center justify-center pt-1 pb-1">
              <div className="relative w-full max-w-[290px] h-[230px] flex items-center justify-center">
                <svg viewBox="0 0 270 230" className="w-full h-full overflow-visible">
                  {/* Concentric Reference Rings */}
                  {[0.25, 0.5, 0.75, 1.0].map((ring, idx) => (
                    <polygon
                      key={idx}
                      points={radarDimensions
                        .map((_, i) => {
                          const { x, y } = getCoord(i, ring * 100);
                          return `${x.toFixed(1)},${y.toFixed(1)}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth={idx === 2 ? "1.5" : "1"}
                      strokeDasharray={idx === 2 ? "3,3" : undefined}
                    />
                  ))}

                  {/* Radial Axis Lines */}
                  {radarDimensions.map((_, i) => {
                    const { x, y } = getCoord(i, 100);
                    return (
                      <line
                        key={i}
                        x1={cx}
                        y1={cy}
                        x2={x}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.12)"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Target Standard (75%) Polygon */}
                  <polygon
                    points={targetPolygonPoints}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    strokeDasharray="4,3"
                    opacity="0.55"
                  />

                  {/* User Actual Performance Polygon (Rich Royal Sapphire) */}
                  <polygon
                    points={userPolygonPoints}
                    fill="rgba(59, 130, 246, 0.22)"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    className="transition-all duration-500"
                  />

                  {/* Vertex Points & Number Tags */}
                  {radarDimensions.map((dim, i) => {
                    const pt = getCoord(i, dim.value);
                    const labelPt = getCoord(i, 118);
                    return (
                      <g key={i}>
                        {/* Vertex Jewel Dot */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4"
                          fill="#60a5fa"
                          stroke="#1e3a8a"
                          strokeWidth="1.5"
                        />
                        {/* Label & Value */}
                        <text
                          x={labelPt.x}
                          y={labelPt.y - 4}
                          textAnchor="middle"
                          fill="#cbd5e1"
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {dim.label}
                        </text>
                        <text
                          x={labelPt.x}
                          y={labelPt.y + 8}
                          textAnchor="middle"
                          fill="#38bdf8"
                          fontSize="10"
                          fontWeight="900"
                          fontFamily="monospace"
                        >
                          {dim.value}%
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-5 mt-1 pt-2 border-t border-zinc-800/80 w-full text-[10px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-blue-500/30 border border-blue-400" />
                  <span className="font-medium text-zinc-300">Your Output</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 border-t border-dashed border-slate-400" />
                  <span className="font-medium text-zinc-400">Target Standard (75%)</span>
                </div>
              </div>
            </div>
          ) : (
            /* Benchmark Comparison Bars Graph */
            <div className="space-y-2.5 pt-1">
              {radarDimensions.map((item, idx) => {
                const diff = item.value - 75;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{item.value}%</span>
                        <span className={`text-[10px] font-mono font-semibold ${diff >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {diff >= 0 ? `+${diff}%` : `${diff}%`}
                        </span>
                      </div>
                    </div>
                    <div className="relative w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                      {/* Target Indicator Line at 75% */}
                      <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-zinc-500 z-10" />
                      {/* Performance Bar */}
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-600 to-sky-400"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
                <span>0% Baseline</span>
                <span className="text-zinc-400 font-mono">| Target 75%</span>
                <span>100% Mastery</span>
              </div>
            </div>
          )}
        </div>

        {/* Handling Breakdown Grid - Sculpted 2x2 with Exact Percentage Values */}
        <div className="rounded-2xl bg-zinc-900/85 border border-zinc-800 shadow-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
              Core Competency Breakdown
            </h2>
            <span className="text-[10px] text-zinc-400 font-mono">4 Areas Rated</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {metrics.map((m, idx) => (
              <div 
                key={idx} 
                className="rounded-xl bg-zinc-950/80 border border-zinc-800/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] p-3 flex flex-col justify-between"
              >
                <div className="text-[10px] text-zinc-400 font-medium leading-tight">
                  {m.label}
                </div>
                
                <div className="mt-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-zinc-100">{m.value}</span>
                    <span className={`text-[11px] font-mono font-bold ${m.colorClass}`}>{m.percentage}%</span>
                  </div>

                  {/* Stepped Charcoal / Color Micro-Ticks */}
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full transition-colors ${
                          step <= m.rating 
                            ? 'bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.3)]' 
                            : 'bg-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Strengths & Polishing Priorities (Deep Emerald Sage & Warm Amber) */}
        <div className="space-y-3">
          {/* Strengths Card - Deep Emerald Accent */}
          <div className="rounded-2xl bg-gradient-to-b from-emerald-950/40 to-zinc-900/90 border border-emerald-600/30 shadow-lg p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                Observed Strengths
              </span>
            </div>
            <div className="space-y-2 pt-0.5">
              {iDidWell.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Card - Warm Terracotta/Amber Accent */}
          <div className="rounded-2xl bg-gradient-to-b from-amber-950/40 to-zinc-900/90 border border-amber-600/30 shadow-lg p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-900/60 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                Coaching Adjustments
              </span>
            </div>
            <div className="space-y-2 pt-0.5">
              {practiceNext.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Natural Spoken English Refinements */}
        <div className="rounded-2xl bg-zinc-900/85 border border-zinc-800 shadow-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                <MessageSquareCode className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
                Natural Phrasing Polish
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium">Comparison</span>
          </div>

          <div className="space-y-3 pt-0.5">
            {myNaturalEnglish.map((ex: any, idx: number) => (
              <div 
                key={idx} 
                className="rounded-xl bg-zinc-950 border border-zinc-800/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] p-3 space-y-2"
              >
                {/* What user said (Subtle Rosewood / Muted Wine Border) */}
                <div className="rounded-lg bg-zinc-900/90 border border-rose-950/60 p-2.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-rose-300 font-bold mb-0.5">
                    Original Delivery
                  </div>
                  <div className="text-xs text-zinc-300 italic font-serif leading-snug">
                    &ldquo;{ex.learnerSaid}&rdquo;
                  </div>
                </div>

                {/* Professional Polish (Deep Sapphire / Classic Blue) */}
                <div className="rounded-lg bg-gradient-to-r from-blue-950/60 to-indigo-950/40 border border-blue-600/40 p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-blue-300 font-bold mb-0.5">
                    <ArrowRight className="w-3 h-3 text-blue-400" />
                    <span>Professional Polish</span>
                  </div>
                  <div className="text-xs font-semibold text-white leading-snug">
                    {ex.betterEnglish}
                  </div>
                </div>

                {/* Linguistic Note */}
                <div className="text-[11px] text-zinc-400 font-medium px-1 leading-snug">
                  {ex.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Scenario Target Banner (Warm Ochre / Gold Accent) */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-600/30 shadow-lg p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-900/60 border border-amber-500/40 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5 shadow-xs">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
              Focus Goal for Next Session
            </span>
            <p className="text-xs font-semibold text-zinc-100 mt-0.5 leading-snug">
              {nextTimeGoal}
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={onBack}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-b from-zinc-100 to-zinc-300 hover:from-white hover:to-zinc-200 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,255,255,0.15)] transition-all cursor-pointer active:scale-[0.98]"
          >
            <span>Finish & Return to Tracks</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Apple Submerged Home Button */}
        <div className="pt-2 pb-1 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={onBack}
            aria-label="Home"
            className="group relative w-15 h-15 rounded-full bg-[#0a0b0e] border border-white/[0.07] shadow-[inset_0_4px_10px_rgba(0,0,0,0.95),0_1px_1px_rgba(255,255,255,0.06)] flex items-center justify-center cursor-pointer transition-all duration-150"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#24262c] via-[#1a1b20] to-[#131417] border border-[#2f323a]/70 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.12),inset_0_-2px_5px_rgba(0,0,0,0.85),0_3px_8px_rgba(0,0,0,0.7)] flex items-center justify-center group-hover:brightness-110 group-active:brightness-90 group-active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] transition-all">
              <div className="w-3.5 h-3.5 rounded-[4px] border-[1.5px] border-zinc-400/60 shadow-[0_1px_1px_rgba(0,0,0,0.8)] group-hover:border-zinc-300 transition-colors" />
            </div>
          </motion.button>
          <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase mt-2">
            Tap Home to Exit
          </span>
        </div>
      </div>
    </div>
  );
};


