export interface SheekoJourney {
  journeyLength: 3 | 4 | 5;
  currentDay: number;
  startDate: string;
  lastActiveDate: string;
  isCompleted: boolean;
}

export interface PlaygroundPlan {
  date: string; // YYYY-MM-DD
  isStartMyDayDrillCompleted: boolean;
  buddyTargetCount: number;
  buddyCompletedCount: number;
  rockRollTargetCount: number;
  rockRollCompletedCount: number;
  bytesTargetCount: number;
  bytesCompletedCount: number;
  planConfirmed: boolean;
}

const JOURNEY_STORAGE_KEY = 'hello_english_sheeko_journey';
const DAILY_PLAN_STORAGE_KEY = 'hello_english_daily_playground_plan';

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ==========================================
// 1. SHEEKO JOURNEY MANAGEMENT (Persistent across days)
// ==========================================

export function getSheekoJourney(): SheekoJourney | null {
  try {
    const raw = localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!raw) return null;
    const parsed: SheekoJourney = JSON.parse(raw);
    
    // Check if new day has arrived to advance the day if active
    const todayStr = getTodayDateString();
    if (parsed && !parsed.isCompleted && parsed.lastActiveDate !== todayStr) {
      // It's a new day! Increment the day if within journey
      if (parsed.currentDay < parsed.journeyLength) {
        parsed.currentDay += 1;
        parsed.lastActiveDate = todayStr;
        localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(parsed));
      } else if (parsed.currentDay >= parsed.journeyLength) {
        parsed.isCompleted = true;
        localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(parsed));
      }
    }
    
    return parsed;
  } catch (e) {
    return null;
  }
}

export function startNewSheekoJourney(length: 3 | 4 | 5): SheekoJourney {
  const todayStr = getTodayDateString();
  const journey: SheekoJourney = {
    journeyLength: length,
    currentDay: 1,
    startDate: todayStr,
    lastActiveDate: todayStr,
    isCompleted: false,
  };
  try {
    localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(journey));
  } catch (e) {
    console.error('Failed to save Sheeko journey:', e);
  }
  return journey;
}

export function completeSheekoJourney(): void {
  const journey = getSheekoJourney();
  if (journey) {
    journey.isCompleted = true;
    localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(journey));
  }
}

// ==========================================
// 2. DAILY PLAYGROUND PLAN (Resets every day)
// ==========================================

export function getPlaygroundData(): PlaygroundPlan {
  const todayStr = getTodayDateString();
  const defaultPlan: PlaygroundPlan = {
    date: todayStr,
    isStartMyDayDrillCompleted: false,
    buddyTargetCount: 1,
    buddyCompletedCount: 0,
    rockRollTargetCount: 1,
    rockRollCompletedCount: 0,
    bytesTargetCount: 2,
    bytesCompletedCount: 0,
    planConfirmed: false,
  };

  try {
    const raw = localStorage.getItem(DAILY_PLAN_STORAGE_KEY);
    if (!raw) return defaultPlan;
    const parsed = JSON.parse(raw);
    
    // If the saved date is not today, auto-wipe and start fresh for the new day
    if (parsed.date !== todayStr) {
      const freshPlan: PlaygroundPlan = {
        ...defaultPlan,
      };
      localStorage.setItem(DAILY_PLAN_STORAGE_KEY, JSON.stringify(freshPlan));
      return freshPlan;
    }
    
    return { ...defaultPlan, ...parsed };
  } catch (e) {
    return defaultPlan;
  }
}

export function savePlaygroundData(updates: Partial<PlaygroundPlan>): PlaygroundPlan {
  const current = getPlaygroundData();
  const updated: PlaygroundPlan = {
    ...current,
    ...updates,
    date: getTodayDateString(),
  };
  try {
    localStorage.setItem(DAILY_PLAN_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save playground plan:', e);
  }
  return updated;
}

export function isStartMyDayDoneToday(): boolean {
  return getPlaygroundData().isStartMyDayDrillCompleted;
}

export function markStartMyDayDoneToday(): void {
  savePlaygroundData({ isStartMyDayDrillCompleted: true });
}

export function incrementPlaygroundActivity(type: 'buddy' | 'rockroll' | 'bytes'): void {
  const current = getPlaygroundData();
  if (type === 'buddy') {
    savePlaygroundData({ buddyCompletedCount: (current.buddyCompletedCount || 0) + 1 });
  } else if (type === 'rockroll') {
    savePlaygroundData({ rockRollCompletedCount: (current.rockRollCompletedCount || 0) + 1 });
  } else if (type === 'bytes') {
    savePlaygroundData({ bytesCompletedCount: (current.bytesCompletedCount || 0) + 1 });
  }
}

export function resetPlaygroundForRebuild(): void {
  const defaultPlan: PlaygroundPlan = {
    date: getTodayDateString(),
    isStartMyDayDrillCompleted: false,
    buddyTargetCount: 1,
    buddyCompletedCount: 0,
    rockRollTargetCount: 1,
    rockRollCompletedCount: 0,
    bytesTargetCount: 2,
    bytesCompletedCount: 0,
    planConfirmed: false,
  };
  try {
    localStorage.setItem(DAILY_PLAN_STORAGE_KEY, JSON.stringify(defaultPlan));
  } catch (e) {
    console.error('Failed to reset playground plan:', e);
  }
}

export function isPlaygroundActiveAndIncomplete(): boolean {
  try {
    const plan = getPlaygroundData();
    if (!plan) return false;
    // Active if today's plan is confirmed or start my day drill is finished
    const isActive = Boolean(plan.planConfirmed || plan.isStartMyDayDrillCompleted);
    if (!isActive) return false;

    const totalTarget = (plan.buddyTargetCount || 0) + (plan.rockRollTargetCount || 0) + (plan.bytesTargetCount || 0);
    const totalCompleted = (plan.buddyCompletedCount || 0) + (plan.rockRollCompletedCount || 0) + (plan.bytesCompletedCount || 0);

    // If there are target activities, check if incomplete; if no target activities selected yet, it's incomplete
    if (totalTarget > 0) {
      return totalCompleted < totalTarget;
    }
    return true;
  } catch (e) {
    return false;
  }
}

// ==========================================
// 3. DAY-WISE SNAPSHOTS OF PLAYGROUND (For Awards / Summary)
// ==========================================

export interface DailyPlaygroundSnapshot {
  id: string;
  date: string; // e.g. "2026-09-02" or "2026-08-01"
  formattedDate: string; // e.g. "1st Aug", "2nd Sep"
  completionPercent: number; // e.g. 70
  sheekoCount: number;
  buddyCount: number;
  bytesCount: number;
  rockRollCount: number;
  isToday?: boolean;
}

const PLAYGROUND_HISTORY_KEY = 'hello_english_playground_history_snapshots';

export function getOrdinalSuffix(n: number): string {
  try {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  } catch (e) {
    return `${n}th`;
  }
}

export function formatToOrdinalDate(dateObj: Date): string {
  try {
    const day = dateObj.getDate();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[dateObj.getMonth()] || 'Aug';
    return `${getOrdinalSuffix(day)} ${month}`;
  } catch (e) {
    return '1st Aug';
  }
}

export function getPlaygroundDaySnapshots(): DailyPlaygroundSnapshot[] {
  try {
    const today = new Date();
    const todayStr = getTodayDateString();
    const plan = getPlaygroundData();

    // Calculate today's real dynamic progress
    const totalTarget = (plan?.buddyTargetCount || 0) + (plan?.rockRollTargetCount || 0) + (plan?.bytesTargetCount || 0) + 1; // +1 for sheeko
    const totalCompleted =
      (plan?.buddyCompletedCount || 0) +
      (plan?.rockRollCompletedCount || 0) +
      (plan?.bytesCompletedCount || 0) +
      (plan?.isStartMyDayDrillCompleted ? 1 : 0);
    
    const todayPercent = totalTarget > 0
      ? Math.min(100, Math.round((totalCompleted / totalTarget) * 100))
      : (plan?.isStartMyDayDrillCompleted ? 100 : 0);

    const todaySnapshot: DailyPlaygroundSnapshot = {
      id: `snap-${todayStr}`,
      date: todayStr,
      formattedDate: `${formatToOrdinalDate(today)} (Today)`,
      completionPercent: todayPercent,
      sheekoCount: plan?.isStartMyDayDrillCompleted ? 1 : 0,
      buddyCount: plan?.buddyCompletedCount || 0,
      bytesCount: plan?.bytesCompletedCount || 0,
      rockRollCount: plan?.rockRollCompletedCount || 0,
      isToday: true,
    };

    // Base preset / historical timeline of day snapshots matching user's requested format
    // (e.g. 1st Aug - 70% activity done with icon sheeko 1, buddy 4, bytes 2, rock and roll 2)
    const defaultHistory: DailyPlaygroundSnapshot[] = [
      {
        id: 'snap-2026-08-01',
        date: '2026-08-01',
        formattedDate: '1st Aug',
        completionPercent: 70,
        sheekoCount: 1,
        buddyCount: 4,
        bytesCount: 2,
        rockRollCount: 2,
      },
      {
        id: 'snap-2026-07-31',
        date: '2026-07-31',
        formattedDate: '31st Jul',
        completionPercent: 100,
        sheekoCount: 1,
        buddyCount: 5,
        bytesCount: 3,
        rockRollCount: 2,
      },
      {
        id: 'snap-2026-07-30',
        date: '2026-07-30',
        formattedDate: '30th Jul',
        completionPercent: 85,
        sheekoCount: 1,
        buddyCount: 3,
        bytesCount: 2,
        rockRollCount: 1,
      },
      {
        id: 'snap-2026-07-29',
        date: '2026-07-29',
        formattedDate: '29th Jul',
        completionPercent: 100,
        sheekoCount: 1,
        buddyCount: 4,
        bytesCount: 3,
        rockRollCount: 2,
      },
      {
        id: 'snap-2026-07-28',
        date: '2026-07-28',
        formattedDate: '28th Jul',
        completionPercent: 60,
        sheekoCount: 1,
        buddyCount: 2,
        bytesCount: 1,
        rockRollCount: 1,
      },
      {
        id: 'snap-2026-07-27',
        date: '2026-07-27',
        formattedDate: '27th Jul',
        completionPercent: 90,
        sheekoCount: 1,
        buddyCount: 4,
        bytesCount: 2,
        rockRollCount: 2,
      },
    ];

    const raw = typeof window !== 'undefined' ? localStorage.getItem(PLAYGROUND_HISTORY_KEY) : null;
    let customHistory: DailyPlaygroundSnapshot[] = raw ? JSON.parse(raw) : [];
    
    // Merge today snapshot + custom/default history
    const all = [todaySnapshot, ...customHistory, ...defaultHistory];
    
    // Deduplicate by date
    const seen = new Set<string>();
    const uniqueList: DailyPlaygroundSnapshot[] = [];
    for (const item of all) {
      if (!seen.has(item.date)) {
        seen.add(item.date);
        uniqueList.push(item);
      }
    }
    return uniqueList;
  } catch (e) {
    return [
      {
        id: 'snap-default',
        date: '2026-08-01',
        formattedDate: '1st Aug',
        completionPercent: 70,
        sheekoCount: 1,
        buddyCount: 4,
        bytesCount: 2,
        rockRollCount: 2,
      }
    ];
  }
}

