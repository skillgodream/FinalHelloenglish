import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Flame,
  Users,
  Compass,
  Music,
  ArrowRight,
} from 'lucide-react';
import {
  getSheekoJourney,
  getPlaygroundData,
  SheekoJourney,
  PlaygroundPlan,
} from '../../utils/playgroundManager';
import { getTodayReminders } from '../../utils/reminderManager';
import { Bell } from 'lucide-react';

interface PlanConfirmationViewProps {
  onGoToPlayground: () => void;
  onExit?: () => void;
}

export const PlanConfirmationView: React.FC<PlanConfirmationViewProps> = ({
  onGoToPlayground,
  onExit,
}) => {
  const journey: SheekoJourney | null = getSheekoJourney();
  const plan: PlaygroundPlan = getPlaygroundData();
  const reminders = getTodayReminders();

  const journeyLength = journey ? journey.journeyLength : 3;
  const currentDay = journey ? journey.currentDay : 1;
  const journeyPercent = Math.min(100, Math.round((currentDay / journeyLength) * 100));

  const totalActivities =
    (plan.buddyTargetCount || 0) +
    (plan.bytesTargetCount || 0) +
    (plan.rockRollTargetCount || 0);

  return (
    <div className="w-full flex-1 flex flex-col justify-between text-zinc-100 min-h-screen relative bg-[#0d1117] select-none font-sans">
      {/* Subtle minimalist ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content Container */}
      <div className="w-full flex-1 flex flex-col justify-between px-5 pt-8 pb-8 relative z-10 max-w-[440px] mx-auto min-h-screen">
        <div>
          {/* Top Status Header: "Your plan is ready!" */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800/80">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white tracking-tight">
                आपका प्लान तैयार है!
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                दिन में जब भी चाहें, यहाँ आकर अभ्यास करें और अपने टास्क पूरे करें।
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar: Today's Activities | Sheeko | Reminders */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">
                आज की गतिविधियां
              </span>
              <span className="text-sm font-bold text-amber-400 mt-0.5 block">
                {totalActivities}
              </span>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">
                शीको जर्नी
              </span>
              <span className="text-sm font-bold text-white mt-0.5 block">
                दिन {currentDay} / {journeyLength}
              </span>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">
                रिमाइंडर्स
              </span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                {reminders.length} सेट
              </span>
            </div>
          </div>

          {/* Sheeko Journey Milestone Card */}
          <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    शीको स्पीकिंग जर्नी
                  </span>
                  <span className="text-xs text-zinc-400">
                    दिन {currentDay} / {journeyLength} ({journeyLength} दिनों का लक्ष्य)
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-400">
                {journeyPercent}%
              </span>
            </div>

            <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${journeyPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>

          {/* Today's Activities Section */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-zinc-400 tracking-wide px-1 mb-1">
              निर्धारित अभ्यास मॉड्यूल
            </div>

            {/* Buddy */}
            <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    AI बडी प्रैक्टिस
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    लाइव स्पीकिंग रोलप्ले
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700/60">
                {plan.buddyTargetCount || 1} {plan.buddyTargetCount === 1 ? 'सत्र' : 'सत्र'}
              </span>
            </div>

            {/* Bytes */}
            <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    डेली बाइट्स लेसन्स
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    माइक्रो-लेसन्स और मुहावरे
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700/60">
                {plan.bytesTargetCount || 2} {plan.bytesTargetCount === 1 ? 'लेसन' : 'लेसन्स'}
              </span>
            </div>

            {/* Rock & Roll */}
            <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    सिनेरियो स्पीड ड्रिल्स
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    रिफ्लेक्स चैलेंज राउंड
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700/60">
                {plan.rockRollTargetCount || 1} {plan.rockRollTargetCount === 1 ? 'ड्रिल' : 'ड्रिल्स'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-4 space-y-2.5">
          <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              आज का कुल प्लान
            </span>
            <span className="text-xs font-bold text-amber-400">
              {totalActivities} गतिविधियां
            </span>
          </div>

          <button
            onClick={onGoToPlayground}
            className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <span>डेली प्लेग्राउंड में जाएं</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

