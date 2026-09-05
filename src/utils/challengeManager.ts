import { FiveDayChallenge, UserProgress, ChallengeDayProgress } from '../types';

export interface ChallengePlanOption {
  days: 3 | 5 | 7 | 10;
  title: string;
  hindiTitle: string;
  tagline: string;
  badge: string;
  storyTarget: number;
  questionTarget: number;
  dailyTime: string;
  description: string;
  topics: string[];
}

export const CHALLENGE_PLANS: ChallengePlanOption[] = [
  {
    days: 3,
    title: '3-Day Rapid Sprint',
    hindiTitle: '3 दिन का क्विक स्पीकिंग चैलेंज',
    tagline: 'Quick weekend or mid-week fluency jumpstart',
    badge: '⚡ Rapid Sprint',
    storyTarget: 3,
    questionTarget: 60,
    dailyTime: '12-15 mins/day',
    description: 'Perfect for quick interview preparation or building fast speaking confidence in 3 focused days.',
    topics: ['Daily Routine & Introductions', 'Workplace Tasks & Updates', 'Problem Solving & Questions'],
  },
  {
    days: 5,
    title: '5-Day Fluency Habit',
    hindiTitle: '5 दिन की फ्लुएंसी हैबिट',
    tagline: 'The gold standard habit builder for daily English',
    badge: '🔥 Recommended Habit',
    storyTarget: 5,
    questionTarget: 100,
    dailyTime: '15 mins/day',
    description: 'Build an unbreakable daily speaking routine. 5 continuous days of stories and real workplace dialogues.',
    topics: ['Morning Greetings & Day Plan', 'Logistics, Warehouse & Tasks', 'Colleague & Tea Break Chats', 'Problem Reporting & Escalation', 'Weekly Wrap-up & Review'],
  },
  {
    days: 7,
    title: '7-Day Workplace Immersion',
    hindiTitle: '7 दिन का वर्कप्लेस इमर्शन',
    tagline: 'Full week professional speaking immersion',
    badge: '🌟 Full Week Immersion',
    storyTarget: 7,
    questionTarget: 140,
    dailyTime: '18 mins/day',
    description: 'Comprehensive 7-day immersion covering supervisor interactions, client support, and natural storytelling.',
    topics: ['Introductions & Roles', 'Shift Handover & Operations', 'Customer Handling & Queries', 'Technical Issues & Remedies', 'Team Collaboration', 'Weekend Stories', 'Full Fluency Graduation'],
  },
  {
    days: 10,
    title: '10-Day Mastery Bootcamp',
    hindiTitle: '10 दिन की कम्प्लीट मास्टरी',
    tagline: 'Deep transformation into confident, spontaneous English',
    badge: '👑 Fluency Mastery',
    storyTarget: 10,
    questionTarget: 200,
    dailyTime: '20 mins/day',
    description: 'The ultimate fluency bootcamp. Transform hesitation into effortless, natural workplace English in 10 days.',
    topics: ['Foundational Confidence', 'Workplace Operations', 'Expressing Opinions & Ideas', 'Handling Conflict & Delays', 'Advanced Vocabulary', 'Spontaneous Storytelling', 'Supervisor Negotiations', 'Client Presentation', 'Mock Real-world Scenarios', 'Final Fluency Showcase'],
  },
];

export function generateDailyProgress(totalDays: number, currentDay: number = 1): ChallengeDayProgress[] {
  const days: ChallengeDayProgress[] = [];
  for (let d = 1; d <= totalDays; d++) {
    const isCompleted = d < currentDay;
    const isCurrent = d === currentDay;
    const isStarted = d <= currentDay;

    let completedActivities: string[] = [];
    if (d === 1 && currentDay >= 1) {
      completedActivities = [
        'Morning Routine & Work Greeting Story (My Day)',
        '20 Workplace Speaking Drills (Coach Neha)',
        'Shift Handover Roleplay Dialogue',
      ];
    } else if (d === 2 && currentDay >= 2) {
      completedActivities = [
        'Inventory & Parcel Damage Reporting Story (My Day)',
        '20 Logistics & Warehouse Questions (Coach Neha)',
        'Manager Confirmation Practice Session',
      ];
    } else if (d === 3 && currentDay === 3) {
      completedActivities = [
        'Lunch Break Conversation with Colleagues (My Day)',
        '8 Real-time Conversation Drills Completed',
      ];
    }

    days.push({
      day: d,
      dayLabel: `Day ${d}`,
      isCompleted: isCompleted,
      isCurrent: isCurrent,
      isStarted: isStarted,
      myDayCompleted: isCompleted || (isCurrent && d <= 2),
      questionsCompleted: isCompleted ? 20 : isCurrent ? 8 : 0,
      questionsTarget: 20,
      completedActivities: isCompleted ? completedActivities : (isCurrent ? completedActivities : []),
    });
  }
  return days;
}

export function getOrCreateChallenge(progress: UserProgress, targetDays: number = 5): FiveDayChallenge {
  if (progress.challenge && progress.challenge.totalDays) {
    const myDayCount = progress.myDayCompletedTasks?.length || 2;
    const questionsCount = progress.totalPracticed || 18;

    return {
      ...progress.challenge,
      myDayCompletedCount: Math.max(progress.challenge.myDayCompletedCount || 0, myDayCount),
      coachQuestionsCompletedCount: Math.max(progress.challenge.coachQuestionsCompletedCount || 0, questionsCount),
    };
  }

  const totalDays = targetDays;
  const currentDay = Math.min(totalDays, Math.max(1, (progress.streakDays % totalDays) || 3));
  const daysRemaining = Math.max(1, totalDays - currentDay + 1);
  const myDayTarget = totalDays;
  const coachQuestionsTarget = totalDays * 20;
  const myDayCount = Math.min(myDayTarget, progress.myDayCompletedTasks?.length || 2);
  const questionsCount = Math.min(coachQuestionsTarget, progress.totalPracticed || 18);

  return {
    isStarted: true,
    startDate: Date.now() - (currentDay - 1) * 86400000,
    totalDays: totalDays,
    daysRemaining,
    currentDay,
    myDayTarget,
    myDayCompletedCount: myDayCount,
    coachQuestionsTarget,
    coachQuestionsCompletedCount: questionsCount,
    dailyProgress: generateDailyProgress(totalDays, currentDay),
  };
}

export function startNewChallenge(progress: UserProgress, totalDays: 3 | 5 | 7 | 10 = 5): UserProgress {
  const myDayTarget = totalDays;
  const coachQuestionsTarget = totalDays * 20;

  const newChallenge: FiveDayChallenge = {
    isStarted: true,
    startDate: Date.now(),
    totalDays: totalDays,
    daysRemaining: totalDays,
    currentDay: 1,
    myDayTarget,
    myDayCompletedCount: 0,
    coachQuestionsTarget,
    coachQuestionsCompletedCount: 0,
    dailyProgress: generateDailyProgress(totalDays, 1),
  };

  return {
    ...progress,
    challenge: newChallenge,
  };
}

export function recordChallengePractice(
  progress: UserProgress,
  activityType: 'my_day_activity' | 'coach_question',
  activityTitle?: string
): UserProgress {
  const currentChallenge = getOrCreateChallenge(progress);

  const updatedChallenge: FiveDayChallenge = {
    ...currentChallenge,
    isStarted: true,
    myDayCompletedCount:
      activityType === 'my_day_activity'
        ? Math.min(currentChallenge.myDayTarget, currentChallenge.myDayCompletedCount + 1)
        : currentChallenge.myDayCompletedCount,
    coachQuestionsCompletedCount:
      activityType === 'coach_question'
        ? Math.min(currentChallenge.coachQuestionsTarget, currentChallenge.coachQuestionsCompletedCount + 1)
        : currentChallenge.coachQuestionsCompletedCount,
  };

  const currentDayIndex = Math.min(
    updatedChallenge.totalDays - 1,
    Math.max(0, updatedChallenge.currentDay - 1)
  );
  const updatedDaily = [...updatedChallenge.dailyProgress];
  if (updatedDaily[currentDayIndex]) {
    const dayItem = { ...updatedDaily[currentDayIndex] };
    const activities = [...(dayItem.completedActivities || [])];

    if (activityType === 'my_day_activity') {
      dayItem.myDayCompleted = true;
      if (activityTitle && !activities.includes(activityTitle)) {
        activities.push(activityTitle);
      } else if (!activities.some((a) => a.includes('My Day'))) {
        activities.push('Daily Speaking Story (My Day)');
      }
    } else if (activityType === 'coach_question') {
      dayItem.questionsCompleted = Math.min(dayItem.questionsTarget, dayItem.questionsCompleted + 1);
      const qText = activityTitle ? `Drill: ${activityTitle}` : `Coach Neha Question #${dayItem.questionsCompleted}`;
      if (!activities.includes(qText)) {
        activities.push(qText);
      }
    }

    dayItem.completedActivities = activities;

    if (dayItem.myDayCompleted && dayItem.questionsCompleted >= dayItem.questionsTarget) {
      dayItem.isCompleted = true;
    }
    updatedDaily[currentDayIndex] = dayItem;
  }
  updatedChallenge.dailyProgress = updatedDaily;

  return {
    ...progress,
    challenge: updatedChallenge,
  };
}
