import React from 'react';
import { RockAndRollSession } from '../types/rockAndRollTypes';
import { Target, Award, BarChart3, CheckCircle2, XCircle, Sparkles, Smile, ArrowLeft, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { DottedWaveBackground } from '../components/DottedWaveBackground';

interface RockAndRollDashboardProps {
  onBack: () => void;
  sessions: RockAndRollSession[];
}

export const RockAndRollDashboard: React.FC<RockAndRollDashboardProps> = ({ onBack, sessions }) => {
  const totalPoints = sessions.reduce((acc, s) => acc + s.score, 0);
  const avgScore = sessions.length > 0 ? Math.round(totalPoints / sessions.length) : 0;
  const completed = sessions.length;
  const happyPercent = sessions.length > 0 ? Math.round((sessions.filter(s => s.customerResponse === 'Happy').length / sessions.length) * 100) : 0;
  const resolvedPercent = sessions.length > 0 ? Math.round((sessions.filter(s => s.isResolved).length / sessions.length) * 100) : 0;
  const avgHandling = sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.situationHandling, 0) / sessions.length) : 0;
  const avgGrammar = sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.englishGrammar, 0) / sessions.length) : 0;

  // Recent scores for trend graph
  const recentScores = sessions.length > 0 
    ? sessions.slice(-5).map(s => s.score) 
    : [72, 78, 82, 85, 88];

  return (
    <div className="relative w-full min-h-screen bg-black text-white p-4 pt-8 pb-12 flex flex-col overflow-hidden font-sans">
      {/* Black & Slight Grey High-Pixel Dotted Wave Background */}
      <DottedWaveBackground variant="monochrome" intensity={0.95} />

      <div className="relative z-10 flex flex-col w-full max-w-[430px] mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <button 
            onClick={onBack} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/60 rounded-full text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-950/50 border border-amber-600/40 text-amber-300 text-[11px] font-semibold">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalPoints} Pts Earned</span>
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">Performance Overview</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Roleplay competency analytics & conversation history</p>
        </div>

      {/* Hero Overview Card */}
      <div className="w-full bg-gradient-to-b from-zinc-800/95 via-zinc-900/95 to-[#0b0c10] border border-amber-600/30 rounded-2xl p-4 mb-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Overall Mastery</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black tracking-tight text-white">{completed > 0 ? avgScore : '--'}</span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              {completed === 0 ? 'Complete a scenario to unlock stats' : `${completed} roleplay ${completed === 1 ? 'drill' : 'drills'} completed`}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1 text-xs bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-600/30 text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">{completed > 0 ? `${resolvedPercent}% Resolved` : '0%'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs bg-sky-950/40 px-2.5 py-1 rounded-lg border border-sky-600/30 text-sky-200">
              <Smile className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold">{completed > 0 ? `${happyPercent}% Satisfaction` : '0%'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Bento Grid with Tasteful Rich Accents */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { label: 'Situation Handling', value: completed > 0 ? `${avgHandling}%` : '--', icon: Target, color: 'text-indigo-300', bg: 'border-indigo-600/30 bg-indigo-950/20', barColor: 'bg-indigo-500', progress: avgHandling },
          { label: 'English & Grammar', value: completed > 0 ? `${avgGrammar}%` : '--', icon: Sparkles, color: 'text-sky-300', bg: 'border-sky-600/30 bg-sky-950/20', barColor: 'bg-sky-500', progress: avgGrammar },
          { label: 'Completed Drills', value: `${completed}`, icon: BarChart3, color: 'text-amber-300', bg: 'border-amber-600/30 bg-amber-950/20', barColor: 'bg-amber-500', progress: Math.min(100, completed * 25) },
          { label: 'Customer Satisfaction', value: completed > 0 ? `${happyPercent}%` : '--', icon: Smile, color: 'text-emerald-300', bg: 'border-emerald-600/30 bg-emerald-950/20', barColor: 'bg-emerald-500', progress: happyPercent },
        ].map((stat, i) => (
          <div key={i} className={`border ${stat.bg} p-3 rounded-xl flex flex-col justify-between backdrop-blur-sm shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold line-clamp-1">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-white font-mono">{stat.value}</p>
              {stat.progress !== undefined && (
                <div className="w-full h-1.5 bg-zinc-950 rounded-full mt-2 overflow-hidden border border-white/5">
                  <div 
                    className={`h-full ${stat.barColor} rounded-full transition-all duration-500`} 
                    style={{ width: `${completed > 0 ? stat.progress : 0}%` }} 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Mastery Trajectory Graph */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">Score Trend Trajectory</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            {completed > 0 ? `Last ${recentScores.length} Sessions` : 'Simulated Baseline'}
          </span>
        </div>

        {/* SVG Mini Trend Graph */}
        <div className="w-full h-24 pt-1">
          <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
            {/* Guide Lines */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />

            {/* Target 80 Threshold Line */}
            <line x1="0" y1="30" x2="300" y2="30" stroke="#059669" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
            <text x="295" y="27" textAnchor="end" fill="#10b981" fontSize="8" fontWeight="bold" fontFamily="monospace">
              80 Target
            </text>

            {/* Bars / Area Points */}
            {recentScores.map((sc, idx) => {
              const x = 30 + idx * 60;
              const y = 70 - ((sc - 50) / 50) * 55;
              return (
                <g key={idx}>
                  {/* Vertical bar column */}
                  <rect
                    x={x - 12}
                    y={y}
                    width={24}
                    height={75 - y}
                    rx="4"
                    fill="rgba(59, 130, 246, 0.25)"
                    stroke="#3b82f6"
                    strokeWidth="1"
                  />
                  {/* Score Text */}
                  <text
                    x={x}
                    y={Math.max(12, y - 5)}
                    textAnchor="middle"
                    fill="#f1f5f9"
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {sc}
                  </text>
                  <text
                    x={x}
                    y="78"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="sans-serif"
                  >
                    #{idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Recent Sessions List */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm font-bold tracking-tight text-zinc-200">Recent Roleplays</h2>
        {sessions.length > 0 && (
          <span className="text-[11px] text-zinc-500 font-medium">Last {Math.min(3, sessions.length)}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {sessions.length === 0 ? (
          <div className="p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-xl text-center">
            <Target className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400 font-medium">No roleplays recorded yet</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">Start a challenge in Rock & Roll to review your conversational score here</p>
          </div>
        ) : (
          sessions.slice(0, 4).map((session) => (
            <motion.div 
              key={session.id} 
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${session.isResolved ? 'bg-emerald-950/50 border border-emerald-600/30 text-emerald-400' : 'bg-rose-950/50 border border-rose-600/30 text-rose-400'}`}>
                  {session.isResolved ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-zinc-200 truncate">{session.situationTitle}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-semibold ${session.isResolved ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {session.isResolved ? 'Resolved' : 'Needs Work'}
                    </span>
                    <span className="text-[10px] text-zinc-600">•</span>
                    <span className="text-[10px] text-zinc-400">{session.customerResponse} Customer</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="inline-block font-extrabold text-sm text-amber-200 px-2.5 py-0.5 bg-amber-950/50 border border-amber-600/30 rounded-lg font-mono">
                  {session.score}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};
