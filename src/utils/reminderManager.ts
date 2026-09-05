/**
 * Reminder Storage and Notification Manager
 * 
 * Manages up to 4 reminders per day linked strictly to the local date.
 * Exposes parsing, scheduling, trigger checks, and management without modifying existing state.
 */

export interface DailyReminder {
  id: string;
  timeStr: string; // e.g., "5:00 PM"
  time24: string; // e.g., "17:00"
  targetTimestamp: number; // epoch ms for today
  activity: string; // e.g., "Buddy Practice", "Bytes Lesson", "Rock & Roll Practice", "English Activities"
  rawText: string;
  enabled: boolean;
  triggered: boolean;
  createdAt: number;
}

export interface DayRemindersStorage {
  date: string; // YYYY-MM-DD
  reminders: DailyReminder[];
  lastTriggeredReminderId?: string;
}

const STORAGE_KEY = 'hello_english_daily_reminders';

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayReminders(): DailyReminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: DayRemindersStorage = JSON.parse(raw);
    const today = getTodayDateString();
    if (parsed.date !== today) {
      // Expired previous day's reminders
      return [];
    }
    return parsed.reminders || [];
  } catch {
    return [];
  }
}

export function saveTodayReminders(reminders: DailyReminder[]) {
  try {
    const today = getTodayDateString();
    const data: DayRemindersStorage = {
      date: today,
      reminders: reminders.slice(0, 4), // Cap at 4
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('reminder-updated'));
    }
  } catch (err) {
    console.error('Failed to save reminders:', err);
  }
}

/**
 * Natural language extraction for reminder time and activity context.
 * Strictly accepts English only.
 */
export function parseEnglishReminderText(text: string): {
  success: boolean;
  isEnglish: boolean;
  errorMessage?: string;
  timeStr?: string;
  time24?: string;
  targetTimestamp?: number;
  activity?: string;
} {
  const clean = text.trim();
  if (!clean) {
    return { success: false, isEnglish: true, errorMessage: 'Please enter a reminder time.' };
  }

  // Detect non-English (e.g. Devanagari script or typical Hindi phrases)
  const devanagariRegex = /[\u0900-\u097F]/;
  const hindiKeywords = /\b(yaad|batao|karna|subah|shaam|dopahar|baje)\b/i;
  if (devanagariRegex.test(clean) || hindiKeywords.test(clean)) {
    return {
      success: false,
      isEnglish: false,
      errorMessage: 'Please set your reminder in English.',
    };
  }

  // Activity detection
  let activity = 'English Activities';
  const lower = clean.toLowerCase();
  if (lower.includes('buddy')) {
    activity = 'Buddy Practice';
  } else if (lower.includes('byte') || lower.includes('lesson')) {
    activity = 'Bytes Lesson';
  } else if (lower.includes('rock') || lower.includes('roll') || lower.includes('scenario')) {
    activity = 'Rock & Roll Practice';
  }

  // Regex patterns for English times:
  // e.g. "at 5 pm", "5:30 pm", "1 pm", "13:00", "at 8:00 AM", "at 8"
  const timeRegex = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i;
  const match = clean.match(timeRegex);

  if (!match) {
    return {
      success: false,
      isEnglish: true,
      errorMessage: 'Could not detect a time. Try saying "Remind me at 5 PM".',
    };
  }

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3] ? match[3].toLowerCase() : null;

  if (hours > 24 || minutes >= 60) {
    return {
      success: false,
      isEnglish: true,
      errorMessage: 'Please specify a valid time.',
    };
  }

  // Convert to 24h format
  if (meridiem === 'pm' && hours < 12) {
    hours += 12;
  } else if (meridiem === 'am' && hours === 12) {
    hours = 0;
  } else if (!meridiem && hours >= 1 && hours <= 7) {
    // Default afternoon assumption for typical learner schedules
    hours += 12;
  }

  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  // If time has already passed today, keep timestamp for today so user sees it or can edit
  const displayHours = hours % 12 || 12;
  const displayMeridiem = hours >= 12 ? 'PM' : 'AM';
  const formattedMinutes = String(minutes).padStart(2, '0');
  const timeStr = `${displayHours}:${formattedMinutes} ${displayMeridiem}`;
  const time24 = `${String(hours).padStart(2, '0')}:${formattedMinutes}`;

  return {
    success: true,
    isEnglish: true,
    timeStr,
    time24,
    targetTimestamp: target.getTime(),
    activity,
  };
}

/**
 * Creates a dev-only fast reminder for testing (30s or 60s)
 */
export function createDevTestReminder(seconds: number): DailyReminder {
  const target = new Date(Date.now() + seconds * 1000);
  let hours = target.getHours();
  const minutes = target.getMinutes();
  const displayHours = hours % 12 || 12;
  const displayMeridiem = hours >= 12 ? 'PM' : 'AM';
  const formattedMinutes = String(minutes).padStart(2, '0');
  const secStr = String(target.getSeconds()).padStart(2, '0');

  return {
    id: `dev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timeStr: `${displayHours}:${formattedMinutes}:${secStr} ${displayMeridiem}`,
    time24: `${String(hours).padStart(2, '0')}:${formattedMinutes}:${secStr}`,
    targetTimestamp: target.getTime(),
    activity: 'Buddy Practice',
    rawText: `Dev Test (${seconds}s)`,
    enabled: true,
    triggered: false,
    createdAt: Date.now(),
  };
}

export const REMINDERS_MUTED_KEY = 'hello_english_reminders_muted';

/**
 * Checks if on-screen notifications are muted by the user
 */
export function isRemindersMuted(): boolean {
  try {
    return localStorage.getItem(REMINDERS_MUTED_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Sets on-screen notifications mute state
 */
export function setRemindersMuted(muted: boolean) {
  try {
    localStorage.setItem(REMINDERS_MUTED_KEY, muted ? 'true' : 'false');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('reminder-mute-updated', { detail: { muted } }));
      window.dispatchEvent(new CustomEvent('reminder-updated'));
    }
  } catch (err) {
    console.error('Failed to set reminder mute state:', err);
  }
}

/**
 * Checks if a reminder is currently due or was triggered in the last 60 minutes
 */
export function getActiveDueReminder(): DailyReminder | null {
  if (isRemindersMuted()) {
    return null;
  }
  const reminders = getTodayReminders();
  const now = Date.now();
  // Find a reminder that is due (timestamp <= now) and was triggered recently (< 2 hours ago)
  return (
    reminders.find(
      (r) => r.enabled && r.triggered && now - r.targetTimestamp < 2 * 60 * 60 * 1000
    ) || null
  );
}

/**
 * Triggers native system notification if permitted
 */
export function triggerSystemNotification(reminder: DailyReminder) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  const title = '🔔 Hello English';
  const body =
    reminder.activity && reminder.activity !== 'English Activities'
      ? `Time to continue your ${reminder.activity}.`
      : 'Your English activities are waiting for you.';

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    } catch {
      // Ignored in sandboxed iframes
    }
  }
}
