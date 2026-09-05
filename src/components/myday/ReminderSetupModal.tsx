import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Mic,
  MicOff,
  Keyboard,
  Check,
  Edit2,
  Trash2,
  Plus,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
  Volume2,
  X,
} from 'lucide-react';
import {
  DailyReminder,
  getTodayReminders,
  saveTodayReminders,
  parseEnglishReminderText,
  createDevTestReminder,
} from '../../utils/reminderManager';

interface ReminderSetupModalProps {
  onComplete: (remindersCount: number) => void;
  onSkip: () => void;
}

export const ReminderSetupModal: React.FC<ReminderSetupModalProps> = ({
  onComplete,
  onSkip,
}) => {
  // Step 1: "Would you like reminders?" Prompt
  // Step 2: "Set up to 4 reminders" Config Screen
  const [step, setStep] = useState<'PROMPT' | 'SETUP'>('PROMPT');
  const [reminders, setReminders] = useState<DailyReminder[]>(() => getTodayReminders());
  
  // Input state
  const [inputMode, setInputMode] = useState<'voice' | 'type'>('voice');
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Editing slot
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTimeValue, setEditTimeValue] = useState<string>('17:00');

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // STRICT ENGLISH ONLY

      recognition.onstart = () => {
        setIsListening(true);
        setValidationError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleProcessInput(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setValidationError('Could not catch your voice. Please try typing instead.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [reminders]);

  const toggleVoiceListening = () => {
    if (reminders.length >= 4) {
      setValidationError('Maximum 4 reminders allowed per day.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setValidationError(null);
      try {
        recognitionRef.current?.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleProcessInput = (text: string) => {
    setValidationError(null);
    if (reminders.length >= 4) {
      setValidationError('Maximum 4 reminders allowed per day.');
      return;
    }

    const result = parseEnglishReminderText(text);

    if (!result.isEnglish) {
      setValidationError('Please set your reminder in English.');
      return;
    }

    if (!result.success || !result.timeStr || !result.time24) {
      setValidationError(result.errorMessage || 'Please specify a valid time.');
      return;
    }

    // Check duplicate
    if (reminders.some((r) => r.timeStr === result.timeStr)) {
      setValidationError(`You already have a reminder set for ${result.timeStr}.`);
      return;
    }

    const newReminder: DailyReminder = {
      id: `rem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timeStr: result.timeStr,
      time24: result.time24,
      targetTimestamp: result.targetTimestamp || Date.now(),
      activity: result.activity || 'English Activities',
      rawText: text,
      enabled: true,
      triggered: false,
      createdAt: Date.now(),
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    saveTodayReminders(updated);
    setInputText('');

    // Request browser notification permission gently if supported
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleProcessInput(inputText);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveTodayReminders(updated);
  };

  const handleStartEdit = (reminder: DailyReminder) => {
    setEditingId(reminder.id);
    setEditTimeValue(reminder.time24 || '17:00');
  };

  const handleSaveEdit = (id: string) => {
    if (!editTimeValue) {
      setEditingId(null);
      return;
    }

    const [h, m] = editTimeValue.split(':').map((v) => parseInt(v, 10));
    let hours = h || 0;
    const minutes = m || 0;
    const displayHours = hours % 12 || 12;
    const displayMeridiem = hours >= 12 ? 'PM' : 'AM';
    const formattedMinutes = String(minutes).padStart(2, '0');
    const timeStr = `${displayHours}:${formattedMinutes} ${displayMeridiem}`;

    const updated = reminders.map((r) => {
      if (r.id === id) {
        const target = new Date();
        target.setHours(hours, minutes, 0, 0);
        return {
          ...r,
          timeStr,
          time24: editTimeValue,
          targetTimestamp: target.getTime(),
        };
      }
      return r;
    });

    setReminders(updated);
    saveTodayReminders(updated);
    setEditingId(null);
  };

  // Dev testing quick test option
  const handleAddDevTest = (seconds: number) => {
    if (reminders.length >= 4) {
      setValidationError('Maximum 4 reminders allowed per day.');
      return;
    }
    const devRem = createDevTestReminder(seconds);
    const updated = [...reminders, devRem];
    setReminders(updated);
    saveTodayReminders(updated);
  };

  const handleFinish = () => {
    saveTodayReminders(reminders);
    onComplete(reminders.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <AnimatePresence mode="wait">
        {step === 'PROMPT' ? (
          /* STEP 3 IN FLOW: WOULD YOU LIKE REMINDERS? */
          <motion.div
            key="prompt"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="w-full max-w-sm bg-[#18181b] border border-stone-800 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Bell className="w-8 h-8" />
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight mb-1">
              क्या आप रिमाइंडर्स सेट करना चाहते हैं?
            </h2>
            <p className="text-xs text-stone-400 mb-6 leading-relaxed">
              अपनी निर्धारित गतिविधियों को पूरा करने के लिए रिमाइंडर पाएं।
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => setStep('SETUP')}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>हाँ, रिमाइंडर सेट करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onSkip}
                className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-semibold transition-all border border-stone-800 cursor-pointer"
              >
                नहीं, बाद में
              </button>
            </div>
          </motion.div>
        ) : (
          /* STEP 4, 5, 6 IN FLOW: SET UP TO 4 REMINDERS */
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="w-full max-w-md bg-[#18181b] border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    अधिकतम 4 रिमाइंडर सेट करें
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    आज के लिए {reminders.length}/4 रिमाइंडर सेट हैं
                  </p>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="पूरा हुआ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Reminder Slots Indicator */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[0, 1, 2, 3].map((slotIdx) => {
                const rem = reminders[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                      rem
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                        : 'bg-stone-900/60 border-stone-800 text-stone-500'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider truncate">
                      स्लॉट {slotIdx + 1}
                    </div>
                    <div className="text-xs font-semibold mt-0.5 flex items-center justify-center gap-0.5">
                      {rem ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span className="text-[10px] truncate">{rem.timeStr}</span>
                        </>
                      ) : (
                        <span>+</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Reminder Cards List */}
            <div className="space-y-2 overflow-y-auto max-h-[160px] pr-1 mb-4">
              {reminders.length === 0 ? (
                <div className="text-center py-4 text-stone-500 text-xs bg-stone-900/40 rounded-xl border border-dashed border-stone-800">
                  अभी तक कोई रिमाइंडर सेट नहीं है। नीचे समय बोलें या टाइप करें।
                </div>
              ) : (
                reminders.map((rem, idx) => (
                  <div
                    key={rem.id}
                    className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        {editingId === rem.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={editTimeValue}
                              onChange={(e) => setEditTimeValue(e.target.value)}
                              className="bg-stone-950 border border-stone-700 text-white text-xs px-2 py-1 rounded"
                            />
                            <button
                              onClick={() => handleSaveEdit(rem.id)}
                              className="text-[10px] font-bold px-2 py-1 bg-amber-500 text-stone-950 rounded cursor-pointer"
                            >
                              सेव
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{rem.timeStr}</span>
                              <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 font-medium">
                                {rem.activity}
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-400 truncate">
                              "{rem.rawText}"
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(rem)}
                        className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded transition-colors cursor-pointer"
                        title="समय बदलें"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReminder(rem.id)}
                        className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded transition-colors cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Error Message (English only prompt) */}
            {validationError && (
              <div className="mb-3 p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Dual Input Controls: Speak / Type */}
            {reminders.length < 4 && (
              <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3 mb-4">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stone-800">
                  <span className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider">
                    रिमाइंडर जोड़ें (अंग्रेजी में)
                  </span>
                  <div className="flex items-center gap-1 bg-stone-950 p-0.5 rounded-lg border border-stone-800">
                    <button
                      onClick={() => setInputMode('voice')}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer transition-colors ${
                        inputMode === 'voice'
                          ? 'bg-amber-500 text-stone-950'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      🎤 बोलें
                    </button>
                    <button
                      onClick={() => setInputMode('type')}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer transition-colors ${
                        inputMode === 'type'
                          ? 'bg-amber-500 text-stone-950'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      ⌨️ टाइप करें
                    </button>
                  </div>
                </div>

                {inputMode === 'voice' ? (
                  <div className="flex flex-col items-center justify-center py-2 text-center">
                    <button
                      onClick={toggleVoiceListening}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isListening
                          ? 'bg-red-500 text-white ring-4 ring-red-500/30 animate-pulse'
                          : 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="w-6 h-6" />
                      ) : (
                        <Mic className="w-6 h-6" />
                      )}
                    </button>
                    <div className="mt-2 text-xs font-semibold text-white">
                      {isListening ? 'सुन रहे हैं... अब अंग्रेजी में बोलें' : 'रिमाइंडर बोलने के लिए टैप करें'}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      उदा. बोलें: "Remind me at 5 PM to practise Buddy"
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleTypeSubmit} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="उदा. Remind me at 8 PM to complete activities"
                        className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs cursor-pointer transition-colors shrink-0"
                      >
                        जोड़ें
                      </button>
                    </div>

                    {/* Quick suggestion pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        'Remind me at 1 PM',
                        'Remind me at 5 PM to practise Buddy',
                        'Remind me at 8 PM to complete my activities',
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleProcessInput(preset)}
                          className="text-[10px] px-2 py-1 rounded-lg bg-stone-950 text-stone-300 border border-stone-800 hover:border-amber-500/40 hover:text-amber-300 transition-colors cursor-pointer text-left"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Finish and continue */}
            <div className="mt-auto pt-2 border-t border-stone-800">
              <button
                onClick={handleFinish}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>कन्फर्म करें और प्लान तैयार करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
