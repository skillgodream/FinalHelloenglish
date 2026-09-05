import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Music,
  Building2,
  ShoppingBag,
  Truck,
  Users,
  X,
  Globe,
  Bot,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  ChevronRight,
  Gamepad2,
  Bell,
  BellOff,
  CheckCircle,
  Video,
  Compass,
} from 'lucide-react';
import { ConversationTurn, PracticeHistoryItem, DayMap, UserProgress } from '../../types';
import { getTranslation } from '../../lib/translations';
import { isPlaygroundActiveAndIncomplete, getPlaygroundData } from '../../utils/playgroundManager';
import {
  DailyReminder,
  getTodayReminders,
  saveTodayReminders,
  triggerSystemNotification,
  isRemindersMuted,
  setRemindersMuted,
} from '../../utils/reminderManager';
import { playFixedAudio, stopSpeaking } from '../../utils/audio';
import { AudioMuteButton } from '../AudioMuteButton';

interface HomePageProps {
  onStart: () => void;
  onOpenPlayground?: () => void;
  onOpenPatternLibrary: () => void;
  onOpenInspector: () => void;
  onOpenChallenge?: () => void;
  onOpenRockRoll?: (sector?: string) => void;
  onOpenRolePicker?: () => void;
  onOpenProfile?: () => void;
  onOpenHelpRoadmap?: () => void;
  onOpenLogin?: () => void;
  onSelectSample?: (sampleText: string) => void;
  onClose?: () => void;
  turns?: ConversationTurn[];
  practiceHistory?: PracticeHistoryItem[];
  dayMap?: DayMap;
  progress?: UserProgress;
  language?: 'en' | 'hi';
  onToggleLanguage?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStart,
  onOpenPlayground,
  onOpenPatternLibrary,
  onOpenChallenge,
  onOpenRockRoll,
  onOpenHelpRoadmap,
  onOpenLogin,
  progress,
  language = 'en',
  onToggleLanguage,
}) => {
  const [greeting, setGreeting] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showStatsDrawer, setShowStatsDrawer] = useState(false);
  const [hasIncompletePlayground, setHasIncompletePlayground] = useState<boolean>(() => isPlaygroundActiveAndIncomplete());
  const [hasConfirmedPlayground, setHasConfirmedPlayground] = useState<boolean>(() => getPlaygroundData().planConfirmed);
  const playgroundData = getPlaygroundData();

  // Due reminder banner state & mute controls
  const [activeDueReminder, setActiveDueReminder] = useState<DailyReminder | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => isRemindersMuted());
  const [muteToast, setMuteToast] = useState<string | null>(null);

  const handleMuteOnScreen = () => {
    setRemindersMuted(true);
    setIsMuted(true);
    setActiveDueReminder(null);
    setMuteToast(language === 'hi' ? 'नोटिफिकेशन्स म्यूट कर दिए गए।' : 'Notifications muted. Reminders will not pop up on screen.');
    setTimeout(() => setMuteToast(null), 3200);
  };

  const handleUnmuteOnScreen = () => {
    setRemindersMuted(false);
    setIsMuted(false);
    setMuteToast(language === 'hi' ? 'स्क्रीन नोटिफिकेशन्स चालू कर दिए गए।' : 'On-screen notifications enabled.');
    setTimeout(() => setMuteToast(null), 2500);
  };

  useEffect(() => {
    if (showActionMenu) {
      playFixedAudio('F_rock_and_roll_roleplay.mp3');
    } else {
      stopSpeaking();
    }
    return () => {
      stopSpeaking();
    };
  }, [showActionMenu]);

  useEffect(() => {
    setHasIncompletePlayground(isPlaygroundActiveAndIncomplete());
    setHasConfirmedPlayground(getPlaygroundData().planConfirmed);

    // Interval to check due reminders and trigger notification
    const checkReminders = () => {
      if (isRemindersMuted()) {
        setActiveDueReminder(null);
        return;
      }

      const reminders = getTodayReminders();
      const now = Date.now();
      let triggeredAny = false;

      const updated = reminders.map((rem) => {
        if (rem.enabled && !rem.triggered && now >= rem.targetTimestamp) {
          triggerSystemNotification(rem);
          triggeredAny = true;
          return { ...rem, triggered: true };
        }
        return rem;
      });

      if (triggeredAny) {
        saveTodayReminders(updated);
      }

      // Show banner if a reminder is active and within 2 hours
      const due = updated.find(
        (r) => r.enabled && r.triggered && now - r.targetTimestamp < 2 * 60 * 60 * 1000
      );
      setActiveDueReminder(due || null);
    };

    const handleMuteToggle = () => {
      const currentMuted = isRemindersMuted();
      setIsMuted(currentMuted);
      if (currentMuted) {
        setActiveDueReminder(null);
      } else {
        checkReminders();
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 10000); // Check every 10s
    window.addEventListener('reminder-updated', checkReminders);
    window.addEventListener('reminder-mute-updated', handleMuteToggle);
    window.addEventListener('storage', checkReminders);
    return () => {
      clearInterval(interval);
      window.removeEventListener('reminder-updated', checkReminders);
      window.removeEventListener('reminder-mute-updated', handleMuteToggle);
      window.removeEventListener('storage', checkReminders);
    };
  }, []);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting(getTranslation(language, 'good_morning'));
    else if (hours < 17) setTranslationGreeting(getTranslation(language, 'good_afternoon'));
    else setTranslationGreeting(getTranslation(language, 'good_evening'));
  }, [language]);

  const setTranslationGreeting = (val: string) => setGreeting(val);

  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="w-full flex-1 flex flex-col justify-between text-slate-100 min-h-screen relative overflow-hidden bg-[#0a0c10] select-none">
      {/* Toast confirmation for mute/unmute */}
      <AnimatePresence>
        {muteToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="fixed top-5 inset-x-0 z-[60] flex justify-center px-4 pointer-events-none"
          >
            <div className="px-4 py-2 rounded-full bg-zinc-900/95 border border-zinc-700/80 text-zinc-200 text-xs font-medium shadow-2xl backdrop-blur-md flex items-center gap-2 pointer-events-auto">
              {isMuted ? (
                <BellOff className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{muteToast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apple Glass Reminder Notification Banner (Floats over the screen, never shifts layout) */}
      <AnimatePresence>
        {activeDueReminder && !isMuted && (
          <div className="fixed top-4 sm:top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
            <motion.div
              drag="y"
              dragConstraints={{ top: -100, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y < -25) {
                  setActiveDueReminder(null);
                }
              }}
              initial={{ opacity: 0, y: -50, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.94 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="w-full max-w-[390px] rounded-[24px] bg-white/85 dark:bg-[#1c1d22]/85 backdrop-blur-2xl border border-white/60 dark:border-white/15 shadow-[0_20px_45px_rgba(0,0,0,0.45),0_1px_2px_rgba(0,0,0,0.2)] p-3.5 sm:p-4 pointer-events-auto text-zinc-900 dark:text-white select-none"
            >
              {/* Header row: Apple Glass Icon (Blue) + App Name + Time + Mute & Dismiss */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {/* Apple Glass Blue Icon */}
                  <div className="relative w-6 h-6 rounded-[7px] bg-gradient-to-b from-[#38a0ff] via-[#007aff] to-[#0051d5] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_5px_rgba(0,113,227,0.35)] flex items-center justify-center overflow-hidden shrink-0">
                    {/* Top glass reflection arc */}
                    <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                    <Bell className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] relative z-10" />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 tracking-wider uppercase">
                    {language === 'hi' ? 'हेलो इंग्लिश' : 'HELLO ENGLISH'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500">
                    {language === 'hi' ? 'अभी' : 'now'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMuteOnScreen();
                    }}
                    className="p-1 rounded-full text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer"
                    title={language === 'hi' ? 'नोटिफिकेशन म्यूट करें' : "Mute notifications (Don't show on screen)"}
                    aria-label="Mute notifications"
                  >
                    <BellOff className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDueReminder(null);
                    }}
                    className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer"
                    title={language === 'hi' ? 'हटाएं' : 'Dismiss'}
                    aria-label="Dismiss notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Notification Body (Exact requested text & items) */}
              <div
                onClick={onStart}
                className="cursor-pointer"
              >
                <h4 className="text-[14px] sm:text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight leading-snug">
                  {language === 'hi' ? 'आपका रिमाइंडर आ गया है' : 'Your reminder is here'}
                </h4>
                <p className="text-[12.5px] sm:text-[13px] text-zinc-600 dark:text-zinc-200 mt-0.5 leading-snug">
                  {language === 'hi'
                    ? `आपने ${activeDueReminder.timeStr} बजे अभ्यास करने की योजना बनाई थी।`
                    : `You planned to practise at ${activeDueReminder.timeStr}.`}
                </p>
                {hasIncompletePlayground && (
                  <p className="text-[11.5px] sm:text-[12px] text-sky-600 dark:text-sky-300 mt-1 font-medium">
                    {language === 'hi'
                      ? 'आपके प्लेग्राउंड में गतिविधियां प्रतीक्षारत हैं।'
                      : 'You have activities waiting in your Playground.'}
                  </p>
                )}
              </div>

              {/* Action Buttons: Continue Playing + Don't Show Notification (Mute) + Dismiss */}
              <div className="mt-3 flex items-center justify-between gap-2 pt-2.5 border-t border-zinc-200/60 dark:border-white/10">
                <button
                  onClick={onStart}
                  className="px-3.5 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/25"
                >
                  <span>{language === 'hi' ? 'अभ्यास जारी रखें' : 'Continue Playing'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMuteOnScreen();
                    }}
                    className="px-2.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/15 text-zinc-700 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-300 text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5"
                    title={language === 'hi' ? 'स्क्रीन पर नोटिफिकेशन न दिखाएं' : "Mute notifications (Don't show notification on screen)"}
                  >
                    <BellOff className="w-3 h-3 text-amber-500" />
                    <span>{language === 'hi' ? 'नोटिफिकेशन बंद करें' : "Don't show notification"}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDueReminder(null);
                    }}
                    className="px-2 py-1.5 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white text-xs font-medium cursor-pointer transition-colors"
                  >
                    {language === 'hi' ? 'हटाएं' : 'Dismiss'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. Full-Bleed Dark Atmospheric Background with Headphones & Ambient Glow Pins */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Cinematic dark desk & headphones photography */}
        <img
          src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85"
          alt="English from Everywhere"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-right-bottom filter brightness-[0.72] contrast-125 saturate-[1.15]"
        />

        {/* World Map Silhouette & Glowing Location Pins Layer */}
        <div className="absolute inset-0 opacity-45 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px] mix-blend-screen" />

        {/* Ambient Golden Location Pins scattered across the dark background */}
        <div className="absolute top-[18%] right-[18%] text-amber-400/90 animate-pulse">
          <MapPin className="w-5 h-5 fill-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
        </div>
        <div className="absolute top-[26%] right-[32%] text-amber-400/80 animate-pulse delay-300">
          <MapPin className="w-4 h-4 fill-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
        </div>
        <div className="absolute top-[32%] right-[10%] text-amber-400/85 animate-pulse delay-700">
          <MapPin className="w-4.5 h-4.5 fill-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
        </div>
        <div className="absolute top-[38%] right-[22%] text-amber-400/75 animate-pulse delay-500">
          <MapPin className="w-3.5 h-3.5 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
        </div>
        <div className="absolute top-[44%] right-[14%] text-amber-400/85 animate-pulse delay-200">
          <MapPin className="w-4 h-4 fill-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
        </div>
        <div className="absolute top-[48%] right-[28%] text-amber-400/70 animate-pulse delay-1000">
          <MapPin className="w-3 h-3 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
        </div>

        {/* Vignette & Contrast Gradients for exact optical balance */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-black/75" />
      </div>

      {/* 2. Top Header Utility Bar */}
      <div className="w-full px-6 pt-6 pb-2 relative z-20 flex items-center justify-between max-w-lg mx-auto">
        {/* User Greeting Tag & Account Switch & Mute status */}
        <div className="flex items-center gap-2">
          {onOpenLogin ? (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white tracking-wider uppercase bg-black/40 hover:bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 hover:border-white/25 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Click to switch user or view login screen"
            >
              <span>{progress?.userName || 'VIKRAM'}</span>
              <span className="text-[9px] text-zinc-400 font-normal lowercase">{language === 'hi' ? '(बदलें)' : '(switch)'}</span>
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {progress?.userName || 'VIKRAM'}
            </span>
          )}

          {/* Mute indicator pill button */}
          {isMuted && (
            <button
              onClick={handleUnmuteOnScreen}
              className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 hover:border-amber-400 flex items-center gap-1.5 text-amber-300 hover:text-amber-200 text-[10px] font-semibold transition-all cursor-pointer backdrop-blur-md shadow-xs active:scale-95"
              title={language === 'hi' ? 'नोटिफिकेशन्स म्यूट हैं। चालू करने के लिए टैप करें।' : "Notifications are muted. Click to turn on."}
            >
              <BellOff className="w-3 h-3 text-amber-400" />
              <span>{language === 'hi' ? 'म्यूट है (चालू करें)' : 'Muted (Tap to unmute)'}</span>
            </button>
          )}
        </div>

        {/* Controls: Language, Guide, Audio Mute, Rock & Roll */}
        <div className="flex items-center gap-1.5">
          <AudioMuteButton size="sm" variant="glass" />

          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1 rounded-full bg-black/50 border border-slate-700/70 hover:border-slate-500 flex items-center gap-1 text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95 backdrop-blur-md"
              title={`Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}`}
            >
              <Globe className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-[10px] font-bold uppercase">{language === 'hi' ? 'HI' : 'EN'}</span>
            </button>
          )}

          {onOpenHelpRoadmap && (
            <button
              onClick={onOpenHelpRoadmap}
              className="px-2.5 py-1 rounded-full bg-sky-950/70 border border-sky-500/50 hover:border-sky-400 flex items-center gap-1 text-sky-300 hover:text-sky-100 transition-all cursor-pointer shadow-xs active:scale-95 backdrop-blur-md"
              title={language === 'hi' ? 'वीडियो गाइड' : 'Video Guide'}
            >
              <Video className="w-3.5 h-3.5 text-sky-300 stroke-[2.2]" />
              <span className="text-[10px] font-bold">{language === 'hi' ? 'गाइड' : 'Guide'}</span>
            </button>
          )}

          {/* Rock & Roll Sector Trigger */}
          <div className="relative">
            <motion.button 
              onClick={() => setShowActionMenu(!showActionMenu)} 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="p-1.5 rounded-full bg-gradient-to-r from-amber-500/30 to-purple-600/30 border border-amber-400/80 hover:border-amber-300 flex items-center justify-center cursor-pointer shadow-md backdrop-blur-md"
              title={language === 'hi' ? 'रॉक एंड रोल सेक्टर्स' : 'Rock & Roll Sectors'}
            >
              <Music className="w-3.5 h-3.5 text-amber-300 stroke-[2.4]" />
            </motion.button>

            <AnimatePresence>
              {showActionMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-9 z-50 w-48 bg-slate-950/95 border border-amber-500/40 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{language === 'hi' ? 'रॉक एंड रोल सेक्टर्स' : 'Rock & Roll Sectors'}</span>
                    <div className="flex items-center gap-1">
                      <AudioMuteButton size="sm" variant="glass" className="w-6 h-6" />
                      <button 
                        onClick={() => setShowActionMenu(false)}
                        className="text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        if (onOpenRockRoll) onOpenRockRoll('hospitality');
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                    >
                      <Building2 className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">{language === 'hi' ? 'हॉस्पिटैलिटी' : 'Hospitality'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        if (onOpenRockRoll) onOpenRockRoll('retail');
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">{language === 'hi' ? 'रिटेल' : 'Retail'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        if (onOpenRockRoll) onOpenRockRoll('supply-chain');
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                    >
                      <Truck className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">{language === 'hi' ? 'सप्लाई चेन' : 'Supply Chain'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        if (onOpenRockRoll) onOpenRockRoll('services');
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                    >
                      <Users className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">{language === 'hi' ? 'सर्विसेज' : 'Services'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. Pull-Out Controls on Right Edge of Screen: Stats */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-2.5">
        <motion.button
          onClick={() => setShowStatsDrawer(true)}
          whileHover={{ x: -3, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-slate-950/85 hover:bg-slate-900 text-slate-200 border-l-2 border-y border-sky-400/80 hover:border-sky-300 pl-2.5 pr-1.5 py-3 rounded-l-2xl shadow-[0_0_20px_rgba(56,189,248,0.35)] flex flex-col items-center gap-1.5 cursor-pointer backdrop-blur-xl transition-colors group"
          title={language === 'hi' ? 'प्रगति और आंकड़े' : 'Open Progress & Stats'}
          aria-label={language === 'hi' ? 'प्रगति और आंकड़े' : 'Open Progress & Stats'}
        >
          <TrendingUp className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          <div className="flex items-center text-[10px] font-bold text-sky-300 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
            {language === 'hi' ? 'प्रगति' : 'Stats'}
          </div>
        </motion.button>
      </div>

      {/* 4. Exact Hero Typography & Call-To-Action (Replicated directly from attachment) */}
      <div className="w-full flex-1 flex flex-col justify-center px-8 sm:px-10 relative z-10 max-w-lg mx-auto pb-24">
        {/* Large Bold Display Typography (Hindi: इंग्लिश कहीं से भी) */}
        {language === 'hi' ? (
          <div className="flex flex-col mb-2">
            <h1 className="text-[44px] sm:text-[54px] font-black tracking-tight leading-[1.05] text-white">
              इंग्लिश
            </h1>
            <h1 className="text-[44px] sm:text-[54px] font-black tracking-tight leading-[1.05] text-white">
              कहीं से
            </h1>
            <h1 className="text-[44px] sm:text-[54px] font-black tracking-tight leading-[1.05] text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.45)]">
              भी
            </h1>
          </div>
        ) : (
          <div className="flex flex-col mb-2">
            <h1 className="text-[44px] sm:text-[54px] font-black tracking-tight leading-[1.05] text-white">
              English
            </h1>
            <h1 className="text-[44px] sm:text-[54px] font-black tracking-tight leading-[1.05] text-white">
              from
            </h1>
            <h1 className="text-[44px] sm:text-[54px] font-black tracking-tight leading-[1.05] text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.45)]">
              everywhere
            </h1>
          </div>
        )}

        {/* Small Yellow Accent Line under text */}
        <div className="w-12 h-1 bg-amber-400 rounded-full my-4 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />

        {/* Subtitle Description */}
        {language === 'hi' ? (
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-[280px] sm:max-w-xs mb-8 drop-shadow-sm">
            असली ज़िंदगी के लिए रियल इंग्लिश।
            <br />
            सीखें, अभ्यास करें और पूरे
            <br />
            आत्मविश्वास से बोलें — कभी भी, कहीं भी।
          </p>
        ) : (
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-[280px] sm:max-w-xs mb-8 drop-shadow-sm">
            Real English for real life.
            <br />
            Learn, practice and speak with
            <br />
            confidence—anytime, anywhere.
          </p>
        )}

        {/* Start My Day Pill Button */}
        <div>
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-2xl transition-all cursor-pointer backdrop-blur-xl group shadow-black/80 relative ${
              hasConfirmedPlayground
                ? 'bg-emerald-950/85 hover:bg-emerald-900/90 border border-emerald-500/80 hover:border-emerald-400 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                : 'bg-[#181a20]/90 hover:bg-[#20232b] border border-amber-500/40 hover:border-amber-400 text-white'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Sparkles
                className={`w-4 h-4 transition-colors ${
                  hasConfirmedPlayground
                    ? 'text-emerald-400 fill-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                    : 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]'
                }`}
              />
              {hasIncompletePlayground && (
                <span 
                  className={`absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full animate-pulse ${
                    hasConfirmedPlayground
                      ? 'bg-emerald-400 ring-2 ring-emerald-950 shadow-[0_0_8px_rgba(52,211,153,0.95)]'
                      : 'bg-rose-500 ring-2 ring-[#181a20] shadow-[0_0_8px_rgba(244,63,94,0.95)]'
                  }`} 
                  title="Daily Playground"
                />
              )}
            </div>
            <span className="tracking-wide">
              {language === 'hi' ? 'दिन की शुरुआत करें' : 'Start My Day'}
            </span>
            <ArrowRight
              className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${
                hasConfirmedPlayground ? 'text-emerald-400' : 'text-amber-400'
              }`}
            />
          </motion.button>
        </div>
      </div>

      {/* 5. Slide-Out Drawer for Beginner & This Week Cards */}
      <AnimatePresence>
        {showStatsDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowStatsDrawer(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[310px] sm:w-[350px] bg-slate-950/95 border-l border-slate-800 p-5 flex flex-col justify-start gap-4 shadow-2xl backdrop-blur-2xl overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sky-400" />
                  <span className="font-bold text-white text-base tracking-tight">
                    {language === 'hi' ? 'आपकी प्रगति' : 'Your Progress'}
                  </span>
                </div>
                <button
                  onClick={() => setShowStatsDrawer(false)}
                  className="p-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Beginner Level Card */}
              <div className="w-full bg-slate-900/85 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
                    <span className="text-sm font-bold text-white tracking-tight">
                      {language === 'hi' ? 'शुरुआती स्तर (Beginner)' : 'Beginner'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded-md border border-sky-700/60 shadow-xs">
                    {(progress?.totalPracticed || 0) * 10} {language === 'hi' ? 'अंक' : 'Pts'}
                  </span>
                </div>

                <div className="my-3">
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[15%] h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span className="text-slate-200 font-bold">{language === 'hi' ? 'लेवल 1' : 'Lvl 1'}</span>
                  <span className="text-slate-400">
                    {language === 'hi' ? 'लेवल 2 के लिए 100 अंक' : '100 pts to Lvl 2'}
                  </span>
                </div>
              </div>

              {/* Weekly Activity / Streak Card (Below Beginner Card) */}
              <div className="w-full bg-slate-900/85 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {language === 'hi' ? 'इस सप्ताह' : 'This Week'}
                  </span>
                  <div className="flex items-center gap-1.5 text-sky-300 font-bold text-xs">
                    <Flame className="w-4 h-4 text-sky-400 fill-sky-400/40" />
                    <span>{progress?.streakDays || 1}{language === 'hi' ? ' दिन की स्ट्रीक' : 'd Streak'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 mt-4">
                  {(language === 'hi' ? ['सो', 'मं', 'बु', 'गु', 'शु', 'श', 'र'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S']).map((day, index) => {
                    const isToday = index === todayIndex;
                    const isCompleted = index < todayIndex;

                    return (
                      <div key={`${day}-${index}`} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            isToday
                              ? 'bg-sky-500 text-slate-950 ring-2 ring-sky-400/50 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                              : isCompleted
                              ? 'bg-slate-700 text-slate-200'
                              : 'bg-slate-800/80 text-slate-500'
                          }`}
                        >
                          {isToday ? '•' : ''}
                        </div>
                        <span className={`text-[10px] font-medium ${isToday ? 'text-sky-300 font-bold' : 'text-slate-400'}`}>
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

