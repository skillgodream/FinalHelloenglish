import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Layers
} from 'lucide-react';
import { UserProgress, Question } from '../types';
import { PRACTICE_QUESTIONS } from '../data/questions';
import { EnglishProgressScreen } from '../components/myday/EnglishProgressScreen';
import { PlaygroundReportModal } from '../components/myday/PlaygroundReportModal';
import { PlaygroundAwardsSnapshotModal } from '../components/myday/PlaygroundAwardsSnapshotModal';
import { DailyEnglishReportView } from './DailyEnglishReportView';
import { getDrillSessionRecords } from '../utils/drillScoringEngine';

interface FitnessDashboardViewProps {
  progress?: UserProgress;
  onStartPractice: (question?: Question) => void;
  onStartDrill?: (question?: Question) => void;
  onOpenBuddy?: () => void;
  onOpenMyDay: () => void;
  onOpenPlayground?: () => void;
  onBack: () => void;
}

export const FitnessDashboardView: React.FC<FitnessDashboardViewProps> = ({
  progress,
  onStartPractice,
  onStartDrill,
  onOpenBuddy,
  onOpenMyDay,
  onOpenPlayground,
  onBack,
}) => {
  const [isMetricsOpen, setIsMetricsOpen] = useState<boolean>(false);
  const [isPlaygroundReportOpen, setIsPlaygroundReportOpen] = useState<boolean>(false);
  const [isDailyEnglishReportOpen, setIsDailyEnglishReportOpen] = useState<boolean>(false);
  const [isAwardsSnapshotOpen, setIsAwardsSnapshotOpen] = useState<boolean>(false);

  const drillRecords = getDrillSessionRecords();
  const totalActivities = Math.max(24, (progress?.totalPracticed || 0) + drillRecords.length * 3);
  const overallAverage = drillRecords.length > 0
    ? Math.round(drillRecords.reduce((sum, r) => sum + r.scores.overallAccuracy, 0) / drillRecords.length)
    : 76;
  const grammarScore = drillRecords.length > 0
    ? Math.round(drillRecords.reduce((sum, r) => sum + (r.scores.relevantGrammarAccuracy || r.scores.targetAccuracy), 0) / drillRecords.length)
    : 60;
  const commScore = drillRecords.length > 0
    ? Math.round(drillRecords.reduce((sum, r) => sum + r.scores.firstAttemptAccuracy, 0) / drillRecords.length)
    : 95;
  const vocabScore = drillRecords.length > 0
    ? Math.round(drillRecords.reduce((sum, r) => sum + r.scores.sentenceMakingAccuracy, 0) / drillRecords.length)
    : 74;

  const wordsSpoken = Math.max(1450, (progress?.totalPracticed || 0) * 80 + drillRecords.length * 300);
  const sentencesSpoken = Math.max(92, (progress?.totalPracticed || 0) * 5 + drillRecords.length * 15);
  const sessionMins = Math.max(125, (progress?.totalMinutes || 0) * 5 + drillRecords.length * 15);

  const dashOffset = Number((251.2 * (1 - overallAverage / 100)).toFixed(1));

  // Render Daily English Progress Report page when open
  if (isDailyEnglishReportOpen) {
    return (
      <DailyEnglishReportView
        progress={progress}
        onBack={() => setIsDailyEnglishReportOpen(false)}
        onStartActivity={(actionType, targetQuestionId) => {
          setIsDailyEnglishReportOpen(false);
          const matchedQuestion = targetQuestionId
            ? PRACTICE_QUESTIONS.find((q) => q.id === targetQuestionId) || PRACTICE_QUESTIONS[0]
            : PRACTICE_QUESTIONS[0];

          switch (actionType) {
            case 'sentence_building':
            case 'workplace':
              if (onStartDrill) {
                onStartDrill(matchedQuestion);
              } else {
                onStartPractice(matchedQuestion);
              }
              break;
            case 'speaking':
            case 'daily_routine':
              onOpenMyDay();
              break;
            case 'conversation':
              if (onOpenBuddy) {
                onOpenBuddy();
              } else {
                onOpenMyDay();
              }
              break;
            case 'fix_sentence':
            case 'vocabulary':
            case 'listening':
            default:
              onStartPractice(matchedQuestion);
              break;
          }
        }}
      />
    );
  }

  return (
    <div className="w-full min-h-full bg-black text-white pb-36 pt-5 px-4 font-sans select-none max-w-[440px] mx-auto">
      {/* Top Header */}
      <header className="flex items-center justify-between mb-5 px-1">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            SUMMARY
          </p>
          <h1 className="text-2xl sm:text-[26px] font-black text-white tracking-tight mt-0.5">
            Sunday, 30 Aug
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDailyEnglishReportOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-[#151922] border border-sky-500/40 text-sky-300 hover:text-white hover:bg-sky-500/20 hover:border-sky-400 text-xs font-semibold tracking-tight flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Daily Report"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Daily Report</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-3.5">
        {/* Activity Ring Card - Confidence Score */}
        <div 
          onClick={() => setIsMetricsOpen(true)}
          className="bg-[#18191E] rounded-3xl p-5 border border-zinc-800/80 shadow-2xl relative overflow-hidden group cursor-pointer hover:border-zinc-700 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white tracking-tight">
              Confidence Score
            </h2>
            <div className="w-7 h-7 rounded-full bg-[#38141e] flex items-center justify-center text-[#ff2d55] font-bold">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#38141e" strokeWidth="10" fill="none" />
                <circle 
                  cx="50" cy="50" r="40" 
                  stroke="#ff2d55" 
                  strokeWidth="10" 
                  fill="none" 
                  strokeDasharray="251.2"
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#ff2d55] flex items-center justify-center text-black shadow-[0_0_8px_rgba(255,45,85,0.7)]">
                  <ChevronRight className="w-3.5 h-3.5 -rotate-45 font-black stroke-[3.5]" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">OVERALL AVERAGE</p>
              <p className="text-3xl font-black text-[#ff2d55] tracking-tight leading-none mt-1">
                {overallAverage}%
              </p>
              <p className="text-xs font-semibold text-zinc-300 mt-2">
                {totalActivities} Activities
              </p>
            </div>
          </div>
        </div>

        {/* English Metrics Summary under Activity Ring */}
        <div className="bg-[#18191E] rounded-3xl py-4 px-6 border border-zinc-800/80 shadow-xl flex items-center justify-between text-center">
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">GRAMMAR</p>
            <p className="text-xl font-black text-white mt-1">{grammarScore}%</p>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">COMM</p>
            <p className="text-xl font-black text-[#00e5ff] mt-1">{commScore}%</p>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">VOCAB</p>
            <p className="text-xl font-black text-[#d9b8ff] mt-1">{vocabScore}%</p>
          </div>
        </div>

        {/* Grid for Words Spoken & Sentences Spoken */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Words Spoken Card */}
          <div className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-xl flex flex-col justify-between h-[162px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 truncate pr-1">
                WORDS SPOKEN
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400 font-medium">This Week</p>
              <p className="text-2xl font-black text-[#d9b8ff] tracking-tight leading-none mt-0.5">
                {wordsSpoken.toLocaleString()}
              </p>
            </div>
            <div className="mt-2">
              <div className="h-9 flex items-end gap-1">
                {[28, 35, 48, 30, 55, 95, 40].map((h, i) => (
                  <div 
                    key={i} 
                    style={{ height: `${h}%` }} 
                    className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-[#d9b8ff] shadow-[0_0_10px_rgba(217,184,255,0.8)]' : 'bg-zinc-700/60'}`} 
                  />
                ))}
              </div>
              <div className="flex justify-between text-[8px] font-semibold text-zinc-400 mt-1.5">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Sentences Spoken Card */}
          <div className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-xl flex flex-col justify-between h-[162px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 truncate pr-1">
                SENTENCES SPOK...
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400 font-medium">This Week</p>
              <p className="text-2xl font-black text-[#00e5ff] tracking-tight leading-none mt-0.5">
                {sentencesSpoken}
              </p>
            </div>
            <div className="mt-2">
              <div className="h-9 flex items-end gap-1">
                {[20, 32, 45, 52, 68, 95, 48].map((h, i) => (
                  <div 
                    key={i} 
                    style={{ height: `${h}%` }} 
                    className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.8)]' : 'bg-zinc-700/60'}`} 
                  />
                ))}
              </div>
              <div className="flex justify-between text-[8px] font-semibold text-zinc-400 mt-1.5">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid for Sessions & Awards */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Sessions */}
          <div className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-xl flex flex-col justify-between h-[148px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">
                SESSIONS
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="flex flex-col justify-center my-auto">
              <p className="text-[11px] text-zinc-400 font-medium">This Week</p>
              <p className="text-2xl font-black text-[#ffb703] tracking-tight mt-0.5">
                {sessionMins} <span className="text-xs text-zinc-300 font-semibold">mins</span>
              </p>
            </div>
          </div>

          {/* Awards */}
          <div 
            onClick={() => setIsAwardsSnapshotOpen(true)}
            className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-xl flex flex-col justify-between h-[148px] cursor-pointer group hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">
                AWARDS
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center -mt-1">
              <div className="w-11 h-11 rounded-2xl border-2 border-[#00ff88] bg-zinc-950/90 shadow-[0_0_12px_rgba(0,255,136,0.3)] flex items-center justify-center mb-1">
                <Award className="w-6 h-6 text-[#00ff88]" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Daily Snapshots</span>
              <span className="text-[10px] text-zinc-400 font-medium">Playground Records</span>
            </div>
          </div>
        </div>

        {/* Apple Phone Style Round Dark Grey Back Button */}
        <div className="pt-6 pb-6 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#2c2c2e] hover:bg-[#38383a] active:bg-[#1f1f21] active:scale-95 border border-zinc-700/60 text-white text-sm font-semibold tracking-tight shadow-xl shadow-black/50 transition-all cursor-pointer"
            aria-label="Back to Home"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5] text-zinc-300" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Detailed English Progress Screen Modal */}
      <EnglishProgressScreen
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
        progress={progress}
        onStartPractice={() => {
          setIsMetricsOpen(false);
          onStartPractice();
        }}
      />

      {/* Playground Daily Report Modal */}
      <PlaygroundReportModal
        isOpen={isPlaygroundReportOpen}
        onClose={() => setIsPlaygroundReportOpen(false)}
        onOpenDailyReport={() => setIsDailyEnglishReportOpen(true)}
        onOpenPlayground={() => {
          setIsPlaygroundReportOpen(false);
          if (onOpenPlayground) {
            onOpenPlayground();
          }
        }}
      />

      {/* Day-wise Snapshot of Playground Awards Modal */}
      <PlaygroundAwardsSnapshotModal
        isOpen={isAwardsSnapshotOpen}
        onClose={() => setIsAwardsSnapshotOpen(false)}
        onOpenPlayground={() => {
          setIsAwardsSnapshotOpen(false);
          if (onOpenPlayground) {
            onOpenPlayground();
          }
        }}
      />
    </div>
  );
};

