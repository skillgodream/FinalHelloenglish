import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MyDayHeader } from '../components/myday/MyDayHeader';
import { HomePage } from '../components/myday/HomePage';
import { LearnerDayInput } from '../components/myday/LearnerDayInput';
import { DayMapVisualizer } from '../components/myday/DayMapVisualizer';
import { ConversationView } from '../components/myday/ConversationView';
import { TopicCompletionCard } from '../components/myday/TopicCompletionCard';
import { SessionSummary } from '../components/myday/SessionSummary';
import { DayStorySessionReport } from '../components/myday/DayStorySessionReport';
import { EngineInspectorDrawer } from '../components/myday/EngineInspectorDrawer';
import { PatternLibraryModal } from '../components/myday/PatternLibraryModal';
import { MyDayPatternsHub } from '../components/myday/MyDayPatternsHub';
import { ChallengeView } from './ChallengeView';
import { RockAndRollContainer } from './RockAndRollContainer';
import { StartMyDayWarmupView } from '../components/myday/StartMyDayWarmupView';
import { DailyPlanningView } from '../components/myday/DailyPlanningView';
import { PlanConfirmationView } from '../components/myday/PlanConfirmationView';
import { PlaygroundView } from '../components/myday/PlaygroundView';
import { isStartMyDayDoneToday, getPlaygroundData, incrementPlaygroundActivity, resetPlaygroundForRebuild } from '../utils/playgroundManager';
import { DayMap, ActiveTopic, ConversationTurn, DeepAnalysis, Question, UserProgress } from '../types';
import { parseLearnerStoryToMeaningRepresentation, extractNaturalEnglishMeaning, synthesizeNaturalEnglishStory } from '../data/sheekoEngine';
import { playFixedAudio, stopSpeaking } from '../utils/audio';

interface MyDayViewProps {
  userName?: string;
  onUpdateUserName?: (name: string) => void;
  streakDays?: number;
  completedTaskIds?: string[];
  onToggleTaskCompleted?: (taskId: string) => void;
  onResetTasks?: () => void;
  onStartPractice?: (question?: Question) => void;
  onStartDrill?: (question?: Question) => void;
  onNavigateTab?: (tab: 'home' | 'myday' | 'practice' | 'progress' | 'profile' | 'challenge' | 'fitness') => void;
  initialMode?: 'story' | 'patterns' | 'challenge' | 'playground';
  progress?: UserProgress;
  onUpdateProgress?: (updater: (prev: UserProgress) => UserProgress) => void;
  onStepChange?: (step: string) => void;
  onOpenRolePicker?: () => void;
  onOpenHelpRoadmap?: () => void;
  onOpenLogin?: () => void;
  language?: 'en' | 'hi';
  onToggleLanguage?: () => void;
}

export const MyDayView: React.FC<MyDayViewProps> = ({
  userName = 'Vikram',
  streakDays = 5,
  completedTaskIds = ['share_day', 'conversation'],
  onToggleTaskCompleted,
  onResetTasks,
  onStartPractice,
  onStartDrill,
  onNavigateTab,
  initialMode = 'story',
  progress,
  onUpdateProgress,
  onStepChange,
  onOpenRolePicker,
  onOpenHelpRoadmap,
  onOpenLogin,
  language = 'en',
  onToggleLanguage,
}) => {
  // Navigation State Machine matching story workflow + patterns hub + challenge view + start my day warm-up, daily planning, plan confirmation & playground
  const [step, setStep] = useState<
    '1_HOME' | '2_CHAT_INPUT' | '3_SYSTEM_SUMMARIZATION' | '4_CHATBOT_CONVERSATION' | '5_TOPIC_COMPLETE' | '6_SESSION_SUMMARY' | 'PATTERNS_HUB' | 'CHALLENGE' | 'ROCK_ROLL' | 'START_MY_DAY_WARMUP' | 'DAILY_PLANNING' | 'PLAN_CONFIRMATION' | 'PLAYGROUND'
  >(
    initialMode === 'patterns'
      ? 'PATTERNS_HUB'
      : initialMode === 'challenge'
      ? 'CHALLENGE'
      : initialMode === 'playground'
      ? 'PLAYGROUND'
      : '1_HOME'
  );

  React.useEffect(() => {
    onStepChange?.(step);
    stopSpeaking();

    return () => {
      stopSpeaking();
    };
  }, [step, onStepChange]);

  const [dayMap, setDayMap] = useState<DayMap>({
    activities: [],
    emotions: [],
    environments: [],
    rawStatement: '',
    knownFacts: [],
    capturedAt: Date.now(),
  });

  const [selectedTopic, setSelectedTopic] = useState<ActiveTopic | null>(null);
  const [isWholeStoryMode, setIsWholeStoryMode] = useState<boolean>(false);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<DeepAnalysis | undefined>(undefined);
  const [lastCompletionSummary, setLastCompletionSummary] = useState<string | undefined>(undefined);
  const [rockRollInitialView, setRockRollInitialView] = useState<'dashboard' | 'retail-dashboard' | 'supply-dashboard' | 'dummy'>('dashboard');
  const [rockRollDummyName, setRockRollDummyName] = useState<string>('Services');

  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [patternLibraryOpen, setPatternLibraryOpen] = useState(false);

  // 1. Submit Initial Learner Statement (From Page 2 or Presets)
  const handleSubmitInitialStatement = async (statement: string) => {
    const clean = statement.trim();
    if (!clean) return;
    setIsLoading(true);

    const parsed = parseLearnerStoryToMeaningRepresentation(clean);
    const fallbackDayMap: DayMap = {
      activities: parsed.activities.length > 0 ? parsed.activities : [clean],
      emotions: [
        clean.toLowerCase().includes('angry') || clean.toLowerCase().includes('tension') || clean.toLowerCase().includes('late')
          ? 'Felt concerned about the delay, then focused on resolving work'
          : 'Felt focused and motivated',
      ],
      environments: parsed.places.length > 0
        ? parsed.places.map(p => `At ${p}`)
        : ['Workplace & transit environment'],
      rawStatement: clean,
      knownFacts: [`Learner shared: "${clean}"`],
      naturalEnglishMeaning: parsed.normalizedSummary || extractNaturalEnglishMeaning(clean),
      naturalEnglishStory: synthesizeNaturalEnglishStory({
        rawStatement: clean,
        activities: parsed.activities,
        emotions: ['Felt focused and responsible'],
        knownFacts: [`Learner shared: "${clean}"`],
      }),
      pointsExtractedCount: parsed.activities.length + parsed.places.length + 2,
      capturedAt: Date.now(),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch('/api/analyze-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement: clean }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.dayMap) {
        setDayMap(data.dayMap);
      } else {
        setDayMap(fallbackDayMap);
      }
    } catch (error) {
      console.warn('Day analysis fast fallback triggered:', error);
      setDayMap(fallbackDayMap);
    } finally {
      setIsWholeStoryMode(true);
      setSelectedTopic({
        pointer: 'Whole Story Flow (Morning to Evening)',
        category: 'ACTIVITY',
        exploredAspects: {},
        isCompleted: false,
        turnCount: 0,
      });
      setStep('3_SYSTEM_SUMMARIZATION');
      setIsLoading(false);
    }
  };

  // 2. Select Individual Activity/Emotion/Environment Topic from Day Map
  const handleSelectTopic = (pointer: string, category: 'ACTIVITY' | 'EMOTION' | 'ENVIRONMENT') => {
    setIsWholeStoryMode(false);
    setSelectedTopic({
      pointer,
      category,
      exploredAspects: {},
      isCompleted: false,
      turnCount: 0,
    });
  };

  // 3. Select Whole Story Mode
  const handleSelectWholeStory = () => {
    setIsWholeStoryMode(true);
    setSelectedTopic({
      pointer: 'Whole Story Flow (Morning to Evening)',
      category: 'ACTIVITY',
      exploredAspects: {},
      isCompleted: false,
      turnCount: 0,
    });
  };

  // 4. Begin / Continue Conversation on Selected Topic (Page 4: Chat Bot Starts)
  const handleStartConversation = async () => {
    if (!selectedTopic) return;
    setIsLoading(true);
    setStep('4_CHATBOT_CONVERSATION');

    try {
      // Clear previous turns if starting fresh on this topic
      const res = await fetch('/api/conversation-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayMap,
          selectedTopic,
          conversationHistory: turns,
          answeredQuestions,
          knownFacts: dayMap.knownFacts,
          isFirstTurnOfTopic: true,
        }),
      });

      const data = await res.json();
      const rephrase = data.rephrase || `Let's focus on ${selectedTopic.pointer}.`;
      const probeQuestion = data.probeQuestion || `How did that part of your day begin?`;

      const initialSystemTurn: ConversationTurn = {
        id: `turn-${Date.now()}`,
        speaker: 'system',
        text: `${rephrase} ${probeQuestion}`,
        rephrase,
        probeQuestion,
        probeDirection: data.probeDirection || 'WHAT',
        deepAnalysis: data.deepAnalysis,
        timestamp: Date.now(),
      };

      setTurns((prev) => [...prev, initialSystemTurn]);
      if (probeQuestion) {
        setAnsweredQuestions((prev) => [...prev, probeQuestion]);
      }
      if (data.updatedDayMap) {
        setDayMap(data.updatedDayMap);
      }
      if (data.deepAnalysis) {
        setLatestAnalysis(data.deepAnalysis);
      }

      setSelectedTopic((prev) => (prev ? { ...prev, turnCount: prev.turnCount + 1 } : null));
    } catch (e) {
      console.error('Conversation init error:', e);
      const fallbackTurn: ConversationTurn = {
        id: `turn-${Date.now()}`,
        speaker: 'system',
        text: `Let's talk about ${selectedTopic?.pointer || 'your day'}. How did that go?`,
        rephrase: `Let's focus on ${selectedTopic?.pointer || 'your day'}.`,
        probeQuestion: `How did that go?`,
        probeDirection: 'WHAT',
        timestamp: Date.now(),
      };
      setTurns((prev) => [...prev, fallbackTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Learner Answers a Probe Question
  const handleLearnerAnswer = async (answerText: string) => {
    if (!selectedTopic) return;

    // Add Learner Turn
    const learnerTurn: ConversationTurn = {
      id: `turn-learner-${Date.now()}`,
      speaker: 'learner',
      text: answerText,
      rawLearnerText: answerText,
      timestamp: Date.now(),
    };

    setTurns((prev) => [...prev, learnerTurn]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/conversation-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayMap,
          selectedTopic,
          conversationHistory: [...turns, learnerTurn],
          answeredQuestions,
          knownFacts: dayMap.knownFacts,
          latestLearnerAnswer: answerText,
          isFirstTurnOfTopic: false,
        }),
      });

      const data = await res.json();
      const rephrase = data.rephrase || `I understand. You shared: "${answerText}".`;
      const probeQuestion = data.probeQuestion || `What happened after that?`;

      const systemTurn: ConversationTurn = {
        id: `turn-sys-${Date.now()}`,
        speaker: 'system',
        text: `${rephrase} ${probeQuestion}`,
        rephrase,
        probeQuestion,
        probeDirection: data.probeDirection || 'WHAT',
        deepAnalysis: data.deepAnalysis,
        timestamp: Date.now(),
      };

      setTurns((prev) => [...prev, systemTurn]);

      if (probeQuestion) {
        setAnsweredQuestions((prev) => [...prev, probeQuestion]);
      }
      if (data.updatedDayMap) {
        setDayMap(data.updatedDayMap);
      }
      if (data.deepAnalysis) {
        setLatestAnalysis(data.deepAnalysis);
      }

      // Mark share_day completed in global progress tracker
      if (onToggleTaskCompleted && !completedTaskIds.includes('share_day')) {
        onToggleTaskCompleted('share_day');
      }

      const learnerTurnsCount = turns.filter((t) => t.speaker === 'learner').length + 1;

      // Check if topic reached fixed 5-turn completion or learner finishes
      if (learnerTurnsCount >= 5 || (data.topicIsCompleted && learnerTurnsCount >= 5)) {
        setCompletedTopics((prev) => Array.from(new Set([...prev, selectedTopic.pointer])));
        setLastCompletionSummary(data.completionSummary || `Great job completing all 5 practice turns!`);
        setSelectedTopic((prev) => (prev ? { ...prev, isCompleted: true, turnCount: learnerTurnsCount } : null));
        incrementPlaygroundActivity('buddy');
        setTimeout(() => {
          // Open Day Story Session Report automatically after completed session
          setStep('6_SESSION_SUMMARY');
        }, 1400);
      } else {
        setSelectedTopic((prev) => (prev ? { ...prev, turnCount: learnerTurnsCount } : null));
      }
    } catch (e) {
      console.error('Conversation step error:', e);
      const fallbackTurn: ConversationTurn = {
        id: `turn-sys-${Date.now()}`,
        speaker: 'system',
        text: `I see what you mean. What happened next in your day?`,
        rephrase: `I see what you mean.`,
        probeQuestion: `What happened next in your day?`,
        probeDirection: 'WHAT',
        timestamp: Date.now(),
      };
      setTurns((prev) => [...prev, fallbackTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Navigation Back Button Handler
  const handleGlobalBack = () => {
    switch (step) {
      case '2_CHAT_INPUT':
        setStep('1_HOME');
        break;
      case '3_SYSTEM_SUMMARIZATION':
        setStep('2_CHAT_INPUT');
        break;
      case '4_CHATBOT_CONVERSATION':
        setStep('3_SYSTEM_SUMMARIZATION');
        break;
      case '5_TOPIC_COMPLETE':
        setStep('3_SYSTEM_SUMMARIZATION');
        break;
      case '6_SESSION_SUMMARY':
        setStep('4_CHATBOT_CONVERSATION');
        break;
      default:
        setStep('1_HOME');
        break;
    }
  };

  // 7. Select Next Topic from Completion View
  const handleSelectNextTopicFromCompletion = (
    pointer: string,
    category: 'ACTIVITY' | 'EMOTION' | 'ENVIRONMENT'
  ) => {
    setSelectedTopic({
      pointer,
      category,
      exploredAspects: {},
      isCompleted: false,
      turnCount: 0,
    });
    setStep('3_SYSTEM_SUMMARIZATION');
  };

  // 8. Reset Session
  const handleResetSession = () => {
    setStep('1_HOME');
    setDayMap({
      activities: [],
      emotions: [],
      environments: [],
      rawStatement: '',
      knownFacts: [],
      capturedAt: Date.now(),
    });
    setSelectedTopic(null);
    setIsWholeStoryMode(false);
    setTurns([]);
    setAnsweredQuestions([]);
    setCompletedTopics([]);
    setLatestAnalysis(undefined);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-sky-500 selection:text-black">
      {/* Main Page Router */}
      <main className="flex-1 flex flex-col">
        {/* PAGE 1: Minimalist Home Page (With top X exit button to return to Home) */}
        {step === '1_HOME' && (
          <HomePage
            onStart={() => {
              const plan = getPlaygroundData();
              if (plan.planConfirmed) {
                setStep('PLAYGROUND');
              } else if (isStartMyDayDoneToday()) {
                setStep('DAILY_PLANNING');
              } else {
                setStep('START_MY_DAY_WARMUP');
              }
            }}
            onOpenPlayground={() => {
              setStep('PLAYGROUND');
            }}
            onOpenPatternLibrary={() => setStep('PATTERNS_HUB')}
            onOpenChallenge={() => setStep('CHALLENGE')}
            onOpenRockRoll={(sector) => {
              if (sector === 'hospitality') {
                setRockRollInitialView('dashboard');
              } else if (sector === 'retail') {
                setRockRollInitialView('retail-dashboard');
              } else if (sector === 'supply-chain') {
                setRockRollInitialView('supply-dashboard');
              } else if (sector === 'services') {
                setRockRollInitialView('dummy');
                setRockRollDummyName('Services');
              } else {
                setRockRollInitialView('dashboard');
              }
              setStep('ROCK_ROLL');
            }}
            onOpenRolePicker={onOpenRolePicker}
            onOpenInspector={() => setInspectorOpen(true)}
            onOpenProfile={() => {
              if (onNavigateTab) {
                onNavigateTab('profile');
              }
            }}
            onClose={() => {
              if (onNavigateTab) {
                onNavigateTab('fitness');
              }
            }}
            onSelectSample={(sampleText) => {
              handleSubmitInitialStatement(sampleText);
            }}
            turns={turns}
            dayMap={dayMap}
            progress={progress}
            language={language}
            onToggleLanguage={onToggleLanguage}
            onOpenHelpRoadmap={onOpenHelpRoadmap}
            onOpenLogin={onOpenLogin}
          />
        )}

        {/* ROCK AND ROLL VIEW */}
        {step === 'ROCK_ROLL' && (
          <RockAndRollContainer 
            key={rockRollInitialView + '-' + rockRollDummyName}
            initialView={rockRollInitialView}
            initialDummyName={rockRollDummyName}
            onBack={() => {
              setRockRollInitialView('dashboard');
              setStep('1_HOME');
            }} 
          />
        )}
        {step === 'CHALLENGE' && (
          <div className="w-full flex-1 flex flex-col">
            <ChallengeView
              progress={
                progress || {
                  userName: userName,
                  streakDays: streakDays,
                  completedToday: 3,
                  dailyGoal: 5,
                  totalPracticed: 18,
                  totalMinutes: 24,
                  targetRole: 'Warehouse & Logistics Staff',
                  savedPhrases: [],
                  history: [],
                  myDayCompletedTasks: ['share_day', 'conversation'],
                  weakAreas: ['Grammar Accuracy'],
                  strongAreas: ['Communication Clarity'],
                  challenge: {
                    isStarted: true,
                    startDate: Date.now() - 2 * 86400000,
                    totalDays: 5,
                    daysRemaining: 3,
                    currentDay: 3,
                    myDayTarget: 5,
                    myDayCompletedCount: 2,
                    coachQuestionsTarget: 100,
                    coachQuestionsCompletedCount: 18,
                    dailyProgress: [
                      {
                        day: 1,
                        dayLabel: 'Day 1',
                        isCompleted: true,
                        isCurrent: false,
                        isStarted: true,
                        myDayCompleted: true,
                        questionsCompleted: 20,
                        questionsTarget: 20,
                        completedActivities: [
                          'Morning Routine & Work Greeting Story',
                          '20 Workplace Speaking Drills (Coach Neha)',
                        ],
                      },
                      {
                        day: 2,
                        dayLabel: 'Day 2',
                        isCompleted: true,
                        isCurrent: false,
                        isStarted: true,
                        myDayCompleted: true,
                        questionsCompleted: 20,
                        questionsTarget: 20,
                        completedActivities: [
                          'Inventory & Parcel Damage Reporting Story',
                          '20 Logistics & Warehouse Questions (Coach Neha)',
                        ],
                      },
                      {
                        day: 3,
                        dayLabel: 'Day 3',
                        isCompleted: false,
                        isCurrent: true,
                        isStarted: true,
                        myDayCompleted: false,
                        questionsCompleted: 8,
                        questionsTarget: 20,
                        completedActivities: [
                          '8 Workplace Speaking Drills completed today',
                        ],
                      },
                      {
                        day: 4,
                        dayLabel: 'Day 4',
                        isCompleted: false,
                        isCurrent: false,
                        isStarted: false,
                        myDayCompleted: false,
                        questionsCompleted: 0,
                        questionsTarget: 20,
                        completedActivities: [],
                      },
                      {
                        day: 5,
                        dayLabel: 'Day 5',
                        isCompleted: false,
                        isCurrent: false,
                        isStarted: false,
                        myDayCompleted: false,
                        questionsCompleted: 0,
                        questionsTarget: 20,
                        completedActivities: [],
                      },
                    ],
                  },
                }
              }
              onBack={() => setStep('1_HOME')}
              onStartMyDay={() => setStep('2_CHAT_INPUT')}
              onStartPracticeQuestion={(q) => {
                if (onStartPractice) {
                  onStartPractice(q);
                }
              }}
              onStartDrill={(q) => {
                if (onStartDrill) {
                  onStartDrill(q);
                } else if (onStartPractice) {
                  onStartPractice(q);
                }
              }}
              onUpdateProgress={onUpdateProgress}
            />
          </div>
        )}

        {/* PATTERNS & PRACTICE HUB (Apple Watch Discover & Categories / Levels) */}
        {step === 'PATTERNS_HUB' && (
          <div className="w-full flex-1 flex flex-col">
            <MyDayPatternsHub
              hideNavigation={true}
              onStartPracticeQuestion={(q) => {
                if (onStartPractice) {
                  onStartPractice(q);
                }
              }}
              onUsePatternForStory={(pat) => {
                handleSubmitInitialStatement(pat);
              }}
              onBackToBuddy={() => setStep('1_HOME')}
            />
          </div>
        )}

        {/* PAGE 2: Chat Input Page (Type and Speak, with back button to Page 1) */}
        {step === '2_CHAT_INPUT' && (
          <LearnerDayInput
            onSubmitStatement={handleSubmitInitialStatement}
            onGoBack={() => setStep('1_HOME')}
            isLoading={isLoading}
            initialText={dayMap.rawStatement}
            onOpenPatternLibrary={() => setStep('PATTERNS_HUB')}
            onOpenInspector={() => setInspectorOpen(true)}
            voiceEnabled={voiceEnabled}
            onToggleVoice={() => setVoiceEnabled((prev) => !prev)}
          />
        )}

        {/* PAGE 3: System Summarization & Activity Pointers (with back button to Page 2) */}
        {step === '3_SYSTEM_SUMMARIZATION' && (
          <DayMapVisualizer
            dayMap={dayMap}
            selectedTopic={selectedTopic}
            onSelectTopic={handleSelectTopic}
            onSelectWholeStory={handleSelectWholeStory}
            onContinueToConversation={handleStartConversation}
            onGoBack={() => setStep('2_CHAT_INPUT')}
            completedTopics={completedTopics}
            isWholeStorySelected={isWholeStoryMode}
            onOpenPatternLibrary={() => setStep('PATTERNS_HUB')}
            onOpenInspector={() => setInspectorOpen(true)}
            voiceEnabled={voiceEnabled}
            onToggleVoice={() => setVoiceEnabled((prev) => !prev)}
          />
        )}

        {/* PAGE 4: Chatbot Conversation Starts (with back button to Page 3) */}
        {step === '4_CHATBOT_CONVERSATION' && (
          <ConversationView
            dayMap={dayMap}
            selectedTopic={selectedTopic || {
              pointer: 'Daily Routine & Activities',
              category: 'ACTIVITY',
              exploredAspects: {},
              isCompleted: false,
              turnCount: 0,
            }}
            turns={turns}
            onLearnerAnswer={handleLearnerAnswer}
            isLoading={isLoading}
            onGoBackToDayMap={() => setStep('3_SYSTEM_SUMMARIZATION')}
            onChooseAnotherActivity={() => setStep('3_SYSTEM_SUMMARIZATION')}
            onEndChatTopic={() => {
              const ptr = selectedTopic ? selectedTopic.pointer : 'Daily Routine & Activities';
              setCompletedTopics((prev) => Array.from(new Set([...prev, ptr])));
              setStep('5_TOPIC_COMPLETE');
            }}
            onEndSession={() => setStep('6_SESSION_SUMMARY')}
            voiceEnabled={voiceEnabled}
            isWholeStoryMode={isWholeStoryMode}
            onOpenPatternLibrary={() => setStep('PATTERNS_HUB')}
            onOpenInspector={() => setInspectorOpen(true)}
            onToggleVoice={() => setVoiceEnabled((prev) => !prev)}
          />
        )}

        {/* PAGE 5: Topic Completion Card */}
        {step === '5_TOPIC_COMPLETE' && (
          <TopicCompletionCard
            topic={selectedTopic || {
              pointer: 'Daily Routine & Activities',
              category: 'ACTIVITY',
              exploredAspects: {},
              isCompleted: false,
              turnCount: 0,
            }}
            completionSummary={lastCompletionSummary}
            dayMap={dayMap}
            onSelectNextTopic={handleSelectNextTopicFromCompletion}
            onViewSummary={() => setStep('6_SESSION_SUMMARY')}
            onGoBackToDayMap={() => setStep('3_SYSTEM_SUMMARIZATION')}
            completedTopics={completedTopics}
          />
        )}

        {/* PAGE 6: Day Story Session Report (Engine 1 Learner-facing Report) */}
        {step === '6_SESSION_SUMMARY' && (
          <div className="w-full min-h-screen bg-[#fbfbfd] text-zinc-900 flex flex-col">
            <DayStorySessionReport
              dayMap={dayMap}
              turns={turns}
              latestAnalysis={latestAnalysis}
              onStartNewDay={handleResetSession}
              onGoBackToChat={() => setStep('4_CHATBOT_CONVERSATION')}
            />
          </div>
        )}

        {/* 1. START MY DAY WARM-UP & 2-ATTEMPT SPOKEN DRILL FLOW */}
        {step === 'START_MY_DAY_WARMUP' && (
          <StartMyDayWarmupView
            onCompleteWarmup={() => setStep('DAILY_PLANNING')}
            onExit={() => setStep('1_HOME')}
          />
        )}

        {/* 2. DAILY PLANNING FLOW (Sheeko Journey + Daily Activities) */}
        {step === 'DAILY_PLANNING' && (
          <DailyPlanningView
            onPlanCreated={() => setStep('PLAN_CONFIRMATION')}
            onExit={() => setStep('1_HOME')}
          />
        )}

        {/* 3. PLAN CONFIRMATION FLOW ("YOUR PLAN IS READY!") */}
        {step === 'PLAN_CONFIRMATION' && (
          <PlanConfirmationView
            onGoToPlayground={() => setStep('PLAYGROUND')}
            onExit={() => setStep('1_HOME')}
          />
        )}

        {/* 4. MY PLAYGROUND INTERACTIVE DASHBOARD */}
        {step === 'PLAYGROUND' && (
          <PlaygroundView
            onExit={() => setStep('1_HOME')}
            onRestartQuestions={() => {
              resetPlaygroundForRebuild();
              setStep('START_MY_DAY_WARMUP');
            }}
            onNavigateTab={(tab) => {
              if (tab === 'buddy') {
                setStep('2_CHAT_INPUT');
              } else if (tab === 'rockroll') {
                setStep('ROCK_ROLL');
              } else if (tab === 'learn' || tab === 'bytes') {
                setStep('PATTERNS_HUB');
              } else if (onNavigateTab) {
                onNavigateTab(tab as any);
              }
            }}
          />
        )}

        {/* Guaranteed fallback to HomePage if step state is unknown or initializing */}
        {!['1_HOME', 'ROCK_ROLL', 'CHALLENGE', 'PATTERNS_HUB', '2_CHAT_INPUT', '3_SYSTEM_SUMMARIZATION', '4_CHATBOT_CONVERSATION', '5_TOPIC_COMPLETE', '6_SESSION_SUMMARY', 'START_MY_DAY_WARMUP', 'DAILY_PLANNING', 'PLAN_CONFIRMATION', 'PLAYGROUND'].includes(step) && (
          <HomePage
            onStart={() => {
              const plan = getPlaygroundData();
              if (plan.planConfirmed) {
                setStep('PLAYGROUND');
              } else if (isStartMyDayDoneToday()) {
                setStep('DAILY_PLANNING');
              } else {
                setStep('START_MY_DAY_WARMUP');
              }
            }}
            onOpenPlayground={() => {
              setStep('PLAYGROUND');
            }}
            onOpenPatternLibrary={() => setStep('PATTERNS_HUB')}
            onOpenChallenge={() => setStep('CHALLENGE')}
            onOpenRockRoll={(sector) => {
              if (sector === 'hospitality') {
                setRockRollInitialView('dashboard');
              } else if (sector === 'retail') {
                setRockRollInitialView('retail-dashboard');
              } else if (sector === 'supply-chain') {
                setRockRollInitialView('supply-dashboard');
              } else if (sector === 'services') {
                setRockRollInitialView('dummy');
                setRockRollDummyName('Services');
              } else {
                setRockRollInitialView('dashboard');
              }
              setStep('ROCK_ROLL');
            }}
            onOpenRolePicker={onOpenRolePicker}
            onOpenInspector={() => setInspectorOpen(true)}
            onOpenProfile={() => {
              if (onNavigateTab) {
                onNavigateTab('profile');
              }
            }}
            onClose={() => {
              if (onNavigateTab) {
                onNavigateTab('fitness');
              }
            }}
            onSelectSample={(sampleText) => {
              handleSubmitInitialStatement(sampleText);
            }}
            turns={turns}
            dayMap={dayMap}
            progress={progress}
            language={language}
            onToggleLanguage={onToggleLanguage}
            onOpenHelpRoadmap={onOpenHelpRoadmap}
            onOpenLogin={onOpenLogin}
          />
        )}
      </main>

      {/* Slide-out Performance Analytics Drawer */}
      <EngineInspectorDrawer
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        dayMap={dayMap}
        answeredQuestions={answeredQuestions}
        latestAnalysis={latestAnalysis}
      />

      {/* Reference Pattern Library Modal (500+ Patterns) */}
      <PatternLibraryModal
        isOpen={patternLibraryOpen}
        onClose={() => setPatternLibraryOpen(false)}
        onSelectPattern={(patternText) => {
          handleSubmitInitialStatement(patternText);
        }}
      />
    </div>
  );
};
