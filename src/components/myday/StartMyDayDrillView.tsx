import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  X,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { PRACTICE_QUESTIONS } from '../../data/questions';
import { Question } from '../../types';
import { markStartMyDayDoneToday } from '../../utils/playgroundManager';
import { speakText as audioSpeakText, stopSpeaking } from '../../utils/audio';

interface StartMyDayDrillViewProps {
  onFinishDrill: () => void;
  onExit: () => void;
}

// 3 Level 1 Workplace & Daily Questions from Directory
const LEVEL_1_DRILL_QUESTIONS: Question[] = PRACTICE_QUESTIONS.filter(
  (q) => q.level === 'Level 1'
).slice(0, 3);

// Fallback questions if none found
const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 'wp-l1-time',
    category: 'workplace',
    categoryLabel: 'Workplace Time',
    categoryHindi: 'समय',
    questionEn: 'What is the time right now?',
    questionHi: 'अभी क्या समय हुआ है?',
    hintEn: 'Say: "It is 2:30 PM" or "Current time is 4 o\'clock."',
    hintHi: 'समय बताएं: "अभी 2:30 बजे हैं"',
    level: 'Level 1',
    samplePhrases: ['It is 3 o\'clock now.', 'Current time is 4:15 PM.'],
    sampleLearnerSpoken: 'It is 3 PM right now.',
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'clock',
  },
  {
    id: 'wp-l1-parcel',
    category: 'workplace',
    categoryLabel: 'Workplace Parcel',
    categoryHindi: 'पार्सल',
    questionEn: 'Where is the customer parcel?',
    questionHi: 'ग्राहक का पार्सल कहाँ है?',
    hintEn: 'Say: "It is on shelf number 3" or "Inside the delivery bag."',
    hintHi: 'स्थान बताएं: "यह शेल्फ नंबर 3 पर है"',
    level: 'Level 1',
    samplePhrases: ['It is inside my delivery bag.', 'Placed on shelf number 3.'],
    sampleLearnerSpoken: 'Parcel is inside my bag.',
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'package',
  },
  {
    id: 'wp-l1-task',
    category: 'workplace',
    categoryLabel: 'Workplace Task',
    categoryHindi: 'कार्य',
    questionEn: 'Is your packing task completed?',
    questionHi: 'क्या आपकी पैकिंग का काम पूरा हो गया है?',
    hintEn: 'Say: "Yes sir, all boxes are packed!" or "Almost done, 5 minutes more."',
    hintHi: 'कहें: "हाँ सर, पैकिंग पूरी हो गई है"',
    level: 'Level 1',
    samplePhrases: ['Yes sir, packing is finished.', 'Almost done, 5 minutes more.'],
    sampleLearnerSpoken: 'Yes sir, packing is done.',
    cardColor: 'from-[#EBF8EE] to-[#D2F2DA]',
    iconType: 'check',
  },
];

export const StartMyDayDrillView: React.FC<StartMyDayDrillViewProps> = ({
  onFinishDrill,
  onExit,
}) => {
  const TOTAL_QUESTIONS = 5;
  // Select 5 random questions from the entire 150 questions pool
  const [questions] = useState<Question[]>(() => {
    const shuffled = [...PRACTICE_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, TOTAL_QUESTIONS);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [attemptCount, setAttemptCount] = useState<number>(1); // 1 = 1st attempt, 2 = 2nd attempt, 3 = model answer read
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [manualText, setManualText] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  
  // Evaluation state
  const [feedback, setFeedback] = useState<{
    status: 'success' | 'retry' | 'model_answer';
    message: string;
    modelCorrection: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentQ = questions[currentIndex] || questions[0];
  const modelAnswer = currentQ.samplePhrases?.[0] || 'Yes sir, I have finished my task.';

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error in StartMyDay Drill:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    // Play question audio on start
    speakText(currentQ.questionEn);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopSpeaking();
    };
  }, [currentIndex]);

  const speakText = async (text: string) => {
    if (!text) return;
    setIsAudioPlaying(true);
    await audioSpeakText(text, 'en-IN', 0.93, () => {
      setIsAudioPlaying(false);
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.warn('Mic start failed:', e);
        }
      }
    }
  };

  // Evaluate the learner's response
  const handleEvaluateAnswer = async () => {
    const rawResponse = (transcript || manualText).trim();
    if (!rawResponse) return;

    setIsEvaluating(true);

    try {
      // Check evaluation via API or local intelligent heuristic
      const res = await fetch('/api/drill/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: {
            id: currentQ.id,
            title: currentQ.categoryLabel,
            category: currentQ.category,
            exampleTarget: modelAnswer,
          },
          questionText: currentQ.questionEn,
          learnerResponse: rawResponse,
          attemptNumber: attemptCount,
        }),
      });

      const evalData = await res.json();
      const isCorrect = evalData.communicationSuccessful && (evalData.sentenceClarity >= 65 || evalData.targetSkillDemonstrated);

      if (attemptCount === 3) {
        // Learner read & registered the model answer!
        setFeedback({
          status: 'success',
          message: 'Model answer recorded and registered successfully!',
          modelCorrection: modelAnswer,
        });
        speakText('Excellent! Well registered.');
        setTimeout(() => {
          advanceToNextQuestion();
        }, 1600);
      } else if (isCorrect) {
        // Answered correctly!
        setFeedback({
          status: 'success',
          message: 'Great job! Your English sentence is clear and correct.',
          modelCorrection: evalData.naturalCorrection || modelAnswer,
        });
        speakText('Great job! That was accurate.');
        setTimeout(() => {
          advanceToNextQuestion();
        }, 1600);
      } else if (attemptCount === 1) {
        // First incorrect attempt -> Give 1 more attempt
        setFeedback({
          status: 'retry',
          message: 'Let\'s try one more time. Speak your sentence clearly into the mic.',
          modelCorrection: evalData.naturalCorrection || modelAnswer,
        });
        setAttemptCount(2);
        speakText('Let\'s try one more time. Please speak clearly.');
      } else {
        // Second attempt failed -> Show model answer, ask to read and register
        setFeedback({
          status: 'model_answer',
          message: 'Here is the correct model answer. Please read and speak it to register.',
          modelCorrection: modelAnswer,
        });
        setAttemptCount(3);
        speakText(`Here is the correct answer: "${modelAnswer}". Please read and speak it now.`);
      }
    } catch (e) {
      // Fallback evaluation heuristic
      const words = rawResponse.toLowerCase().split(/\s+/);
      const isDecentLength = words.length >= 2;
      
      if (attemptCount === 3 || (attemptCount === 1 && isDecentLength)) {
        setFeedback({
          status: 'success',
          message: 'Well done! Clear answer.',
          modelCorrection: modelAnswer,
        });
        setTimeout(() => {
          advanceToNextQuestion();
        }, 1500);
      } else if (attemptCount === 1) {
        setFeedback({
          status: 'retry',
          message: 'Let\'s try one more attempt. Speak clearly.',
          modelCorrection: modelAnswer,
        });
        setAttemptCount(2);
      } else {
        setFeedback({
          status: 'model_answer',
          message: 'Please read, speak, and register the correct answer.',
          modelCorrection: modelAnswer,
        });
        setAttemptCount(3);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const advanceToNextQuestion = () => {
    const next = currentIndex + 1;
    if (next >= TOTAL_QUESTIONS) {
      // Mark Start My Day completed for today
      markStartMyDayDoneToday();
      onFinishDrill();
    } else {
      setCurrentIndex(next);
      setAttemptCount(1);
      setFeedback(null);
      setTranscript('');
      setManualText('');
    }
  };

  const handleResetForRetry = () => {
    setTranscript('');
    setManualText('');
    setFeedback(null);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-6 pt-6 pb-24 text-white max-w-[480px] mx-auto font-sans min-h-screen bg-gradient-to-b from-[#161722] via-[#0d0e14] to-[#07080b] select-none">
      {/* 1. Header Bar: Exit X, Question Pill, Audio Listen */}
      <div className="w-full flex items-center justify-between py-2 relative z-10">
        <button
          onClick={onExit}
          className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 transition-colors border border-white/[0.08] cursor-pointer"
          title="Exit to Home"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>START MY DAY</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-bold tracking-wider text-zinc-300">
            Q {currentIndex + 1} / {TOTAL_QUESTIONS}
          </div>
        </div>

        <button
          onClick={() => speakText(currentQ.questionEn)}
          className={`p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 transition-colors border border-white/[0.08] cursor-pointer ${
            isAudioPlaying ? 'text-sky-400 animate-pulse' : ''
          }`}
          title="Listen to question"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Main Question Display & Audio Visualizer */}
      <div className="w-full my-auto py-4 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full flex flex-col items-center"
          >
            {/* Category / Context Pill */}
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              {currentQ.categoryLabel || 'Level 1 Workplace'}
            </span>

            {/* Question Text */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug max-w-sm">
              "{currentQ.questionEn}"
            </h2>

            {/* Hindi Translation Subtitle for Clarity */}
            {currentQ.questionHi && (
              <p className="text-xs text-zinc-400 mt-2 font-medium">
                {currentQ.questionHi}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Audio Visualizer Waves (Drills UI Aesthetic) */}
        <div className="w-full py-6 flex items-center justify-center gap-1.5 h-24">
          {[12, 24, 18, 36, 48, 30, 20, 56, 72, 45, 30, 60, 85, 95, 65, 40, 75, 55, 30, 65, 45, 25, 50, 35, 20].map((h, i) => (
            <motion.div
              key={i}
              animate={
                isRecording
                  ? { height: [h * 0.4, h * (1 + Math.random() * 0.6), h * 0.4] }
                  : { height: h * 0.4 }
              }
              transition={
                isRecording
                  ? { repeat: Infinity, duration: 0.6 + (i % 5) * 0.1, ease: 'easeInOut' }
                  : { duration: 0.3 }
              }
              className={`w-1 rounded-full ${
                i % 2 === 0
                  ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                  : 'bg-gradient-to-t from-amber-400 to-amber-200'
              }`}
              style={{ height: `${h * 0.5}px` }}
            />
          ))}
        </div>
      </div>

      {/* 3. Feedback / Attempt Status Box */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full rounded-2xl p-4 mb-4 flex flex-col gap-2.5 border backdrop-blur-xl ${
            feedback.status === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-100'
              : feedback.status === 'retry'
              ? 'bg-amber-950/70 border-amber-500/40 text-amber-100'
              : 'bg-stone-900/90 border-amber-500/40 text-stone-100'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {feedback.status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : feedback.status === 'retry' ? (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wider">
                {feedback.status === 'success'
                  ? 'Great English'
                  : feedback.status === 'retry'
                  ? 'Attempt 1 of 2'
                  : 'Correct Model Answer'}
              </div>
              <div className="text-xs sm:text-sm mt-0.5 font-medium leading-relaxed">
                {feedback.message}
              </div>

              {/* Show Model Correction clearly if 2nd attempt failed */}
              {feedback.status === 'model_answer' && (
                <div className="mt-2.5 p-3 rounded-xl bg-black/50 border border-amber-400/40">
                  <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                    Read and speak this:
                  </div>
                  <div className="text-sm font-bold text-stone-100 tracking-wide">
                    "{modelAnswer}"
                  </div>
                </div>
              )}
            </div>
          </div>

          {feedback.status === 'retry' && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleResetForRetry}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Attempt 2</span>
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* 4. Bottom Controls: Transcript & Big Circular Mic */}
      <div className="w-full flex flex-col items-center gap-4 mt-auto pt-2">
        {/* Live Spoken Transcript */}
        {(transcript || manualText) && (
          <div className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] text-zinc-400 block mb-0.5 uppercase tracking-wider">
              Your response:
            </span>
            <span className="text-sm font-semibold text-white">
              "{transcript || manualText}"
            </span>
          </div>
        )}

        <div className="w-full flex items-center justify-between px-4">
          <div className="text-left">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Listening
            </span>
            <span className="text-xs font-extrabold text-amber-400 tracking-wider">ENGLISH</span>
          </div>

          {/* Record Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleRecording}
            disabled={isEvaluating}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              isRecording
                ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse'
                : 'bg-gradient-to-b from-stone-800 to-stone-950 border-2 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:border-amber-400'
            }`}
            title={isRecording ? 'Stop Recording' : 'Start Speaking'}
          >
            <div className="absolute inset-1 rounded-full border border-white/10" />
            {isRecording ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-amber-400" />
            )}
          </motion.button>

          <div className="text-right">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Attempt
            </span>
            <span className="text-xs font-extrabold text-amber-400 tracking-wider">
              {attemptCount === 3 ? 'REGISTER' : `${attemptCount} / 2`}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        {(transcript || manualText) && (
          <button
            onClick={handleEvaluateAnswer}
            disabled={isEvaluating}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
          >
            <span>
              {isEvaluating
                ? 'Evaluating with AI...'
                : attemptCount === 3
                ? 'Register Model Answer'
                : 'Submit & Check Answer'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
