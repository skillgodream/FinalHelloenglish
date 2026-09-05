import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Briefcase,
  Target,
  Volume2,
  Heart,
  Sparkles,
  ShieldCheck,
  Check,
  Flame,
  Award,
  BookOpen,
  Trash2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { CoachNehaAvatar } from '../components/CoachNehaAvatar';
import { UserProgress, SavedPhrase } from '../types';
import { speakText, stopSpeaking } from '../utils/audio';

interface ProfileViewProps {
  targetRole: string;
  onChangeRole: (role: string) => void;
  dailyGoal: number;
  onChangeDailyGoal: (goal: number) => void;
  voiceSpeed: 'normal' | 'slow';
  onChangeVoiceSpeed: (speed: 'normal' | 'slow') => void;
  progress: UserProgress;
  onSelectSavedPhrase: (phrase: SavedPhrase) => void;
  onRemoveSavedPhrase: (id: string) => void;
  onStartPractice: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  targetRole,
  onChangeRole,
  dailyGoal,
  onChangeDailyGoal,
  voiceSpeed,
  onChangeVoiceSpeed,
  progress,
  onSelectSavedPhrase,
  onRemoveSavedPhrase,
  onStartPractice,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlayAudio = (phrase: SavedPhrase) => {
    if (playingId === phrase.id) {
      stopSpeaking();
      setPlayingId(null);
      return;
    }
    stopSpeaking();
    setPlayingId(phrase.id);
    speakText(phrase.improvedSentence, 'en-IN', 0.92, () => {
      setPlayingId(null);
    });
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const roles = [
    { id: 'Warehouse & Logistics Staff', label: 'Warehouse & Logistics Associate', hindi: 'गोदाम एवं लॉजिस्टिक्स' },
    { id: 'Delivery Partner', label: 'Delivery Driver / Rider', hindi: 'डिलीवरी पार्टनर' },
    { id: 'QSR & Restaurant Crew', label: 'QSR / Restaurant Staff', hindi: 'रेस्टोरेंट व काउंटर स्टाफ' },
    { id: 'Retail Store Associate', label: 'Retail & Store Associate', hindi: 'रिटेल स्टोर सेल्स' },
    { id: 'Office & Admin Assistant', label: 'Office & Facility Assistant', hindi: 'ऑफिस असिस्टेंट' },
    { id: 'General Spoken English', label: 'Everyday Spoken English', hindi: 'दैनिक बातचीत' },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#FDF4FF] via-[#F8F7FF] to-[#FFF1F5] text-slate-900 pb-28 pt-4 px-4 sm:px-5">
      {/* Title */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
          PROFILE & DASHBOARD
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          My Profile & Progress
        </h1>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="p-3.5 rounded-2xl bg-white border border-[#E9D5FF] pastel-card-shadow">
          <span className="text-xl font-black text-[#7C3AED]">{progress.totalPracticed}</span>
          <p className="text-[11px] font-bold text-slate-700 mt-0.5">Sentences</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#CCFBF1] pastel-card-shadow">
          <span className="text-xl font-black text-[#0D9488]">{progress.totalMinutes}m</span>
          <p className="text-[11px] font-bold text-slate-700 mt-0.5">Speaking Time</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#FECDD3] pastel-card-shadow">
          <span className="text-xl font-black text-[#E11D48]">{progress.savedPhrases.length}</span>
          <p className="text-[11px] font-bold text-slate-700 mt-0.5">Saved</p>
        </div>
      </div>

      {/* Coach Neha Philosophy Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#FFFBEB] via-[#FFF1F2] to-[#FAF5FF] border border-[#FED7AA] pastel-card-shadow relative overflow-hidden mb-5">
        <div className="flex items-center gap-3.5">
          <CoachNehaAvatar size="lg" showBadge />
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#7C3AED]">
              <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
              Coach Neha
            </div>
            <h2 className="text-base font-extrabold text-slate-900">
              “Understand first. Improve second.”
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Practice speaking freely without fear of mistakes.
            </p>
          </div>
        </div>
      </div>

      {/* SAVED PHRASES PERSONAL PRACTICE BOOK */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#7C3AED]" />
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
              My Saved Phrases
            </h2>
          </div>
          <span className="text-xs font-bold text-[#7C3AED]">
            {progress.savedPhrases.length} saved
          </span>
        </div>

        {progress.savedPhrases.length === 0 ? (
          <div className="p-6 rounded-3xl bg-white/90 border border-[#E9D5FF] text-center pastel-card-shadow">
            <Sparkles className="w-8 h-8 text-[#C084FC] mx-auto mb-2" />
            <p className="text-sm font-extrabold text-slate-900">
              No saved phrases yet
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Whenever Coach Neha improves a sentence, tap the bookmark icon to save it here for quick revision!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {progress.savedPhrases.map((phrase) => (
              <motion.div
                key={phrase.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 bg-white border border-[#E9D5FF] pastel-card-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#7E22CE]">
                    Workplace Practice
                  </span>
                  <button
                    onClick={() => onRemoveSavedPhrase(phrase.id)}
                    className="text-slate-400 hover:text-[#E11D48] p-1 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-sm font-extrabold text-slate-900 leading-snug">
                  “{phrase.improvedSentence}”
                </p>

                {phrase.hindiTranslation && (
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    हिंदी: {phrase.hindiTranslation}
                  </p>
                )}

                <div className="mt-3 pt-2 border-t border-[#E9D5FF]/60 flex items-center justify-between">
                  <button
                    onClick={() => handlePlayAudio(phrase)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      playingId === phrase.id
                        ? 'bg-[#7C3AED] text-white'
                        : 'bg-[#FAF5FF] text-[#7C3AED] hover:bg-[#F3E8FF]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{playingId === phrase.id ? 'Playing...' : 'Pronounce'}</span>
                  </button>

                  <button
                    onClick={() => onSelectSavedPhrase(phrase)}
                    className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Practice this</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* WORKPLACE ROLE CUSTOMIZATION */}
      <div className="mt-5">
        <div className="flex items-center gap-2 mb-2.5 px-1">
          <Briefcase className="w-4 h-4 text-[#7C3AED]" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
            Select Your Target Work Role
          </h3>
        </div>

        <div className="space-y-2">
          {roles.map((role) => {
            const isSelected = targetRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => onChangeRole(role.id)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#7C3AED] pastel-card-shadow ring-2 ring-[#7C3AED]/20 shadow-sm'
                    : 'bg-white/80 border-[#E9D5FF] hover:bg-white hover:border-[#D8B4FE]'
                }`}
              >
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {role.label}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    {role.hindi}
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white shadow-xs' : 'border border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DAILY PRACTICE TARGET */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2.5 px-1">
          <Target className="w-4 h-4 text-[#EA580C]" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
            Daily Practice Target
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[1, 3, 5].map((count) => {
            const isSelected = dailyGoal === count;
            return (
              <button
                key={count}
                onClick={() => onChangeDailyGoal(count)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#EA580C] pastel-card-shadow ring-2 ring-[#EA580C]/20 shadow-sm'
                    : 'bg-white/80 border-[#E9D5FF] hover:bg-white'
                }`}
              >
                <span className="text-lg font-black text-slate-900">{count}</span>
                <p className="text-[11px] font-bold text-slate-500">
                  {count === 1 ? 'Quick (1 min)' : count === 3 ? 'Standard (3 min)' : 'Mastery (5 min)'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* COACH NEHA AUDIO SPEED */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2.5 px-1">
          <Volume2 className="w-4 h-4 text-[#0D9488]" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
            Voice Pronunciation Speed
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onChangeVoiceSpeed('normal')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              voiceSpeed === 'normal'
                ? 'bg-white border-[#0D9488] pastel-card-shadow ring-2 ring-[#0D9488]/20 shadow-sm'
                : 'bg-white/80 border-[#E9D5FF] hover:bg-white'
            }`}
          >
            <span className="text-xs font-extrabold text-slate-900">
              Natural Speed (1.0x)
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Normal conversation pace
            </p>
          </button>

          <button
            onClick={() => onChangeVoiceSpeed('slow')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              voiceSpeed === 'slow'
                ? 'bg-white border-[#0D9488] pastel-card-shadow ring-2 ring-[#0D9488]/20 shadow-sm'
                : 'bg-white/80 border-[#E9D5FF] hover:bg-white'
            }`}
          >
            <span className="text-xs font-extrabold text-slate-900">
              Clear & Slow (0.8x)
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Easy word-by-word pronunciation
            </p>
          </button>
        </div>
      </div>

      {/* About Box */}
      <div className="mt-6 p-4 rounded-2xl bg-white/70 border border-[#E9D5FF] text-center text-xs text-slate-500">
        <p className="font-bold text-slate-800">HELLO ENGLISH • Mobile-First AI Coach</p>
        <p className="text-[11px] mt-0.5">Crafted with ❤️ for Indian frontline learners</p>
      </div>
    </div>
  );
};
