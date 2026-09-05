import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Compass,
  Music,
  Plus,
  Minus,
  Check,
  Flame,
  X,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  getSheekoJourney,
  startNewSheekoJourney,
  savePlaygroundData,
  SheekoJourney,
  PlaygroundPlan,
  getPlaygroundData,
} from '../../utils/playgroundManager';
import { ReminderSetupModal } from './ReminderSetupModal';
import { playFixedAudio, stopSpeaking } from '../../utils/audio';

interface DailyPlanningViewProps {
  onPlanCreated: () => void;
  onExit: () => void;
}

export const DailyPlanningView: React.FC<DailyPlanningViewProps> = ({
  onPlanCreated,
  onExit,
}) => {
  const existingJourney = getSheekoJourney();
  const currentDailyPlan: PlaygroundPlan = getPlaygroundData();

  useEffect(() => {
    playFixedAudio('D_myday_journey.mp3');
    return () => {
      stopSpeaking();
    };
  }, []);

  // Selected journey length if first time
  const [selectedJourneyLength, setSelectedJourneyLength] = useState<3 | 4 | 5>(
    existingJourney ? existingJourney.journeyLength : 3
  );

  // Activity targets with +/- steppers
  const [buddyCount, setBuddyCount] = useState<number>(currentDailyPlan.buddyTargetCount || 1);
  const [bytesCount, setBytesCount] = useState<number>(currentDailyPlan.bytesTargetCount || 2);
  const [rockRollCount, setRockRollCount] = useState<number>(currentDailyPlan.rockRollTargetCount || 1);

  // Reminder prompt step after plan submission
  const [showReminderPrompt, setShowReminderPrompt] = useState(false);

  const totalActivities = buddyCount + bytesCount + rockRollCount;

  const handleSubmitPlan = () => {
    // If no existing active journey, create one
    if (!existingJourney || existingJourney.isCompleted) {
      startNewSheekoJourney(selectedJourneyLength);
    }

    // Save today's selected activities & mark plan confirmed
    savePlaygroundData({
      buddyTargetCount: buddyCount,
      bytesTargetCount: bytesCount,
      rockRollTargetCount: rockRollCount,
      planConfirmed: true,
    });

    // Directly open the Reminder prompt step
    setShowReminderPrompt(true);
  };

  const handleReminderDone = () => {
    setShowReminderPrompt(false);
    onPlanCreated();
  };

  const handleReminderSkip = () => {
    setShowReminderPrompt(false);
    onPlanCreated();
  };

  const activeJourney: SheekoJourney | null =
    existingJourney && !existingJourney.isCompleted ? existingJourney : null;

  return (
    <div className="w-full flex-1 flex flex-col justify-between text-zinc-100 min-h-screen relative bg-[#0d1117] select-none font-sans">
      {/* Subtle minimalist ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content Container */}
      <div className="w-full flex-1 flex flex-col justify-between px-5 pt-6 pb-8 relative z-10 max-w-[440px] mx-auto min-h-screen">
        <div>
          {/* Top Header */}
          <div className="w-full flex items-center justify-between pb-3.5 border-b border-zinc-800/80 mb-4">
            <button
              onClick={onExit}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-300 tracking-wide">
                दैनिक योजना
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-amber-400 border border-zinc-700/60">
                कस्टम शेड्यूल
              </span>
            </div>

            <div className="w-9" />
          </div>

          {/* Section Heading */}
          <div className="mb-4">
            <h1 className="text-base font-semibold text-white tracking-tight">
              आज का लक्ष्य चुनें
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              चुनें कि आज आप कितने बडी चैट्स, बाइट्स लेसन्स और सिनेरियो प्रैक्टिस करेंगे।
            </p>
          </div>

          {/* Sheeko Journey Selector (Only if First-Time / No Active Journey) */}
          {!activeJourney ? (
            <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 mb-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-white">
                    शीको जर्नी लक्ष्य
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-400">
                  {selectedJourneyLength} दिन
                </span>
              </div>
              <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                अपने दैनिक स्पीकिंग अभ्यास चक्र के लिए दिनों का लक्ष्य चुनें।
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[3, 4, 5].map((days) => {
                  const isSelected = selectedJourneyLength === days;
                  return (
                    <button
                      key={days}
                      onClick={() => setSelectedJourneyLength(days as 3 | 4 | 5)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                          : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {days} दिन
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Journey Banner */
            <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 mb-3.5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    सक्रिय शीको जर्नी
                  </span>
                  <span className="text-xs text-zinc-400">
                    दिन {activeJourney.currentDay} / {activeJourney.journeyLength}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700/60">
                {Math.round((activeJourney.currentDay / activeJourney.journeyLength) * 100)}%
              </span>
            </div>
          )}

          {/* 3 Activity Selection Cards with Steppers */}
          <div className="space-y-2.5 flex flex-col justify-start">
            {/* Card 1: Buddy */}
            <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    AI बडी प्रैक्टिस
                  </h3>
                  <p className="text-xs text-zinc-400">
                    बातचीत और लाइव रोलप्ले
                  </p>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-1.5 bg-zinc-950/80 border border-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setBuddyCount((prev) => Math.max(0, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-white">
                  {buddyCount}
                </span>
                <button
                  onClick={() => setBuddyCount((prev) => Math.min(5, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Bytes */}
            <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Compass className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    डेली बाइट्स लेसन्स
                  </h3>
                  <p className="text-xs text-zinc-400">
                    छोटे लेसन्स और नए शब्द
                  </p>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-1.5 bg-zinc-950/80 border border-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setBytesCount((prev) => Math.max(0, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="कम करें"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-white">
                  {bytesCount}
                </span>
                <button
                  onClick={() => setBytesCount((prev) => Math.min(6, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="बढ़ाएं"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Rock & Roll */}
            <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Music className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    सिनेरियो स्पीड ड्रिल्स
                  </h3>
                  <p className="text-xs text-zinc-400">
                    इंटरैक्टिव रिफ्लेक्स चुनौतियां
                  </p>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-1.5 bg-zinc-950/80 border border-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setRockRollCount((prev) => Math.max(0, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="कम करें"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-white">
                  {rockRollCount}
                </span>
                <button
                  onClick={() => setRockRollCount((prev) => Math.min(5, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="बढ़ाएं"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Total Card & Confirm Button */}
        <div className="mt-4 space-y-2.5">
          {/* Total Summary */}
          <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              कुल निर्धारित गतिविधियां
            </span>
            <span className="text-xs font-bold text-amber-400">
              {totalActivities} {totalActivities === 1 ? 'गतिविधि' : 'गतिविधियां'}
            </span>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleSubmitPlan}
            className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Check className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
            <span>सबमिट करें और प्लेग्राउंड बनाएं</span>
          </button>
        </div>
      </div>

      {/* Reminder Setup Modal */}
      {showReminderPrompt && (
        <ReminderSetupModal
          onComplete={handleReminderDone}
          onSkip={handleReminderSkip}
        />
      )}
    </div>
  );
};

