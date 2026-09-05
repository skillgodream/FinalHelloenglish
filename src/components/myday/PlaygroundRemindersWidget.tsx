import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  BellOff,
  Plus,
  Trash2,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  DailyReminder,
  getTodayReminders,
  saveTodayReminders,
  parseEnglishReminderText,
  isRemindersMuted,
  setRemindersMuted,
} from '../../utils/reminderManager';

export const PlaygroundRemindersWidget: React.FC = () => {
  const [reminders, setReminders] = useState<DailyReminder[]>(() => getTodayReminders());
  const [isMuted, setIsMuted] = useState<boolean>(() => isRemindersMuted());
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [inputText, setInputText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Edit slot state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTimeValue, setEditTimeValue] = useState<string>('17:00');

  useEffect(() => {
    setReminders(getTodayReminders());
    const handleMute = () => setIsMuted(isRemindersMuted());
    window.addEventListener('reminder-mute-updated', handleMute);
    return () => window.removeEventListener('reminder-mute-updated', handleMute);
  }, []);

  const handleToggleEnable = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setReminders(updated);
    saveTodayReminders(updated);
  };

  const handleDelete = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveTodayReminders(updated);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (reminders.length >= 4) {
      setValidationError('Maximum 4 reminders allowed per day.');
      return;
    }

    const result = parseEnglishReminderText(inputText);

    if (!result.isEnglish) {
      setValidationError('Please set your reminder in English.');
      return;
    }

    if (!result.success || !result.timeStr || !result.time24) {
      setValidationError(result.errorMessage || 'Please specify a valid time.');
      return;
    }

    if (reminders.some((r) => r.timeStr === result.timeStr)) {
      setValidationError(`Reminder for ${result.timeStr} already exists.`);
      return;
    }

    const newReminder: DailyReminder = {
      id: `rem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timeStr: result.timeStr,
      time24: result.time24,
      targetTimestamp: result.targetTimestamp || Date.now(),
      activity: result.activity || 'English Activities',
      rawText: inputText,
      enabled: true,
      triggered: false,
      createdAt: Date.now(),
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    saveTodayReminders(updated);
    setInputText('');
    setValidationError(null);
    setShowAddForm(false);
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

  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-zinc-800/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-white block">
              Today's Reminders
            </span>
            <span className="text-[11px] text-zinc-400">
              {reminders.length}/4 reminders active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {reminders.length > 0 && (
            <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {reminders.filter((r) => r.enabled).length} ON
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </div>
      </div>

      {/* Accordion Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 pt-1 border-t border-zinc-800/80 bg-zinc-950/40"
          >
            {/* On-Screen Reminders Mute / Active Control */}
            <div className="my-2.5 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isMuted
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {isMuted ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-white block">
                    On-Screen Reminders
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate block">
                    {isMuted ? 'Muted (reminders won\'t show banner)' : 'Active (shows floating reminder banner)'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !isMuted;
                  setIsMuted(next);
                  setRemindersMuted(next);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {isMuted ? 'Muted (Tap to unmute)' : 'Mute'}
              </button>
            </div>

            {/* List */}
            <div className="space-y-2 mb-3">
              {reminders.length === 0 ? (
                <p className="text-xs text-zinc-500 py-2 text-center">
                  No reminders scheduled for today.
                </p>
              ) : (
                reminders.map((rem, idx) => (
                  <div
                    key={rem.id}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </div>

                      <div className="min-w-0">
                        {editingId === rem.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={editTimeValue}
                              onChange={(e) => setEditTimeValue(e.target.value)}
                              className="bg-zinc-950 border border-zinc-700 text-white text-xs px-2 py-0.5 rounded"
                            />
                            <button
                              onClick={() => handleSaveEdit(rem.id)}
                              className="text-[10px] font-bold px-2 py-1 bg-amber-500 text-zinc-950 rounded cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold ${
                                  rem.enabled ? 'text-white' : 'text-zinc-500 line-through'
                                }`}
                              >
                                {rem.timeStr}
                              </span>
                              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 rounded font-medium">
                                {rem.activity}
                              </span>
                            </div>
                            <span className="text-[10px] text-zinc-500 truncate block">
                              "{rem.rawText}"
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Controls: on/off, edit, delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleEnable(rem.id)}
                        className="text-zinc-400 hover:text-white cursor-pointer"
                        title={rem.enabled ? 'Disable' : 'Enable'}
                      >
                        {rem.enabled ? (
                          <ToggleRight className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-zinc-600" />
                        )}
                      </button>

                      <button
                        onClick={() => handleStartEdit(rem)}
                        className="p-1 text-zinc-400 hover:text-amber-400 cursor-pointer"
                        title="Edit Time"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(rem.id)}
                        className="p-1 text-zinc-400 hover:text-rose-400 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Reminder form (English only) */}
            {reminders.length < 4 ? (
              showAddForm ? (
                <form onSubmit={handleAddSubmit} className="space-y-2 pt-1 border-t border-zinc-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="e.g. Remind me at 6 PM to practise"
                      className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setValidationError(null);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {validationError && (
                    <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}
                </form>
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-dashed border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Reminder ({4 - reminders.length} remaining)</span>
                </button>
              )
            ) : (
              <p className="text-[11px] text-zinc-500 text-center">
                Maximum 4 reminders set for today.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
