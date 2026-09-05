import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Target,
  X,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import {
  DrillTarget,
  QuestionAttempt,
  ScoredCoreQuestion,
  DrillScoreSummary,
} from '../../types/drillTypes';
import { LlamaDrillEvalResult, LlamaNextQuestionResult } from '../../../server/services/llamaDrillService';
import { calculateDrillScores, saveDrillSessionRecord } from '../../utils/drillScoringEngine';
import { PRACTICE_QUESTIONS } from '../../data/questions';
import { Question } from '../../types';
import { speakText as audioSpeakText, stopSpeaking } from '../../utils/audio';

interface DrillEngineViewProps {
  target: DrillTarget;
  dayNumber?: number;
  onFinishSession: (scores: DrillScoreSummary) => void;
  onExit: () => void;
}

export const DrillEngineView: React.FC<DrillEngineViewProps> = ({
  target,
  dayNumber = 1,
  onFinishSession,
  onExit,
}) => {
  // Target 5 core questions (strictly not more than 5)
  const TOTAL_TARGET_QUESTIONS = 5;

  // Select 5 random questions from the entire 150 questions pool on session start
  const [selectedQuestions] = useState<Question[]>(() => {
    const shuffled = [...PRACTICE_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, TOTAL_TARGET_QUESTIONS);
  });

  // Session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<LlamaNextQuestionResult | null>(null);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [attemptNumberForCurrent, setAttemptNumberForCurrent] = useState<number>(1); // 1, 2 (retry 1), 3 (retry 2)
  
  // Recorded attempts & scored questions
  const [allAttempts, setAllAttempts] = useState<QuestionAttempt[]>([]);
  const [scoredQuestions, setScoredQuestions] = useState<ScoredCoreQuestion[]>([]);
  const [currentQuestionAttempts, setCurrentQuestionAttempts] = useState<QuestionAttempt[]>([]);

  // UI & Voice interaction states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastEvaluation, setLastEvaluation] = useState<LlamaDrillEvalResult | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');
  const [showRetryPrompt, setShowRetryPrompt] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load question from the randomly selected 5 questions
  const loadQuestionAtIndex = (index: number) => {
    setIsProcessing(true);
    setLastEvaluation(null);
    setShowRetryPrompt(false);
    setTranscript('');
    setManualText('');
    setAttemptNumberForCurrent(1);
    setCurrentQuestionAttempts([]);

    const q = selectedQuestions[index] || selectedQuestions[0];
    const qData: LlamaNextQuestionResult = {
      question: q.questionEn,
      context: `${q.categoryLabel || q.category} • ${q.level}`,
      hintsOrScenario: q.hintEn,
      sampleAnswer: q.samplePhrases?.[0] || q.sampleLearnerSpoken || '',
      hindiText: q.questionHi,
    };
    setCurrentQuestion(qData);
    setQuestionHistory((prev) => [...prev, qData.question]);
    speakText(qData.question);
    setIsProcessing(false);
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Optimized for Indian English

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error in Drill:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    // Load Question 1
    loadQuestionAtIndex(0);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopSpeaking();
    };
  }, []);

  // Natural Female TTS
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
          console.warn('Recognition start failed:', e);
        }
      }
    }
  };

  // Submit learner's spoken or typed answer
  const handleSubmitAnswer = async () => {
    const rawAnswer = (transcript || manualText).trim();
    if (!rawAnswer || !currentQuestion) return;

    setIsProcessing(true);

    try {
      const res = await fetch('/api/drill/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          questionText: currentQuestion.question,
          learnerResponse: rawAnswer,
          attemptNumber: attemptNumberForCurrent,
        }),
      });

      const evaluation: LlamaDrillEvalResult = await res.json();
      setLastEvaluation(evaluation);

      // Create structured attempt
      const attempt: QuestionAttempt = {
        questionId: `q_${currentQuestionIndex + 1}`,
        questionText: currentQuestion.question,
        context: currentQuestion.context,
        attemptNumber: attemptNumberForCurrent,
        learnerRawText: rawAnswer,
        isRetry: attemptNumberForCurrent > 1,
        communicationSuccessful: evaluation.communicationSuccessful,
        targetSkillDemonstrated: evaluation.targetSkillDemonstrated,
        targetErrorPresent: evaluation.targetErrorPresent,
        sentenceClarity: evaluation.sentenceClarity,
        relevantGrammarCorrect: evaluation.relevantGrammarCorrect,
        hasRelevantGrammarEvidence: evaluation.hasRelevantGrammarEvidence,
        naturalCorrection: evaluation.naturalCorrection,
        retryRecommended: evaluation.retryRecommended,
        feedbackToLearner: evaluation.feedbackToLearner,
        errorType: evaluation.errorType,
      };

      const updatedAttempts = [...allAttempts, attempt];
      const updatedCurrentAttempts = [...currentQuestionAttempts, attempt];
      setAllAttempts(updatedAttempts);
      setCurrentQuestionAttempts(updatedCurrentAttempts);

      // If target skill is not demonstrated on first attempt, offer a gentle retry
      if (
        !evaluation.targetSkillDemonstrated &&
        attemptNumberForCurrent === 1 &&
        evaluation.retryRecommended
      ) {
        setShowRetryPrompt(true);
        speakText(
          `${evaluation.feedbackToLearner} For example: "${evaluation.naturalCorrection}". Would you like to try saying that once?`
        );
      } else {
        // Resolve question and advance
        setShowRetryPrompt(false);
        resolveCurrentQuestionAndAdvance(updatedCurrentAttempts, updatedAttempts);
      }
    } catch (err) {
      console.error('Error submitting drill answer:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Resolve core question scoring and move to next question or summary
  const resolveCurrentQuestionAndAdvance = (
    attemptsForThisQ: QuestionAttempt[],
    allAccAttempts: QuestionAttempt[]
  ) => {
    if (!currentQuestion) return;

    const firstAttempt = attemptsForThisQ[0];
    const retryAttempt = attemptsForThisQ.find((a) => a.isRetry);

    let score = 0.0;
    let firstAttemptCorrect = false;
    let requiredRetry = false;
    let correctAfterRetry = false;
    let targetDemonstrated = false;

    if (firstAttempt && firstAttempt.targetSkillDemonstrated) {
      score = 1.0;
      firstAttemptCorrect = true;
      targetDemonstrated = true;
    } else if (retryAttempt && retryAttempt.targetSkillDemonstrated) {
      score = 0.5;
      requiredRetry = true;
      correctAfterRetry = true;
      targetDemonstrated = true;
    } else if (firstAttempt && !firstAttempt.targetSkillDemonstrated) {
      score = 0.0;
      requiredRetry = true;
      correctAfterRetry = false;
      targetDemonstrated = false;
    }

    const scoredQ: ScoredCoreQuestion = {
      questionNumber: currentQuestionIndex + 1,
      questionText: currentQuestion.question,
      context: currentQuestion.context,
      attempts: attemptsForThisQ,
      score,
      firstAttemptCorrect,
      requiredRetry,
      correctAfterRetry,
      targetDemonstrated,
      bestOriginalAttempt: firstAttempt?.learnerRawText,
      bestCorrection: firstAttempt?.naturalCorrection,
    };

    const newScoredQuestions = [...scoredQuestions, scoredQ];
    setScoredQuestions(newScoredQuestions);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= TOTAL_TARGET_QUESTIONS) {
      // Completed drill session!
      finishSession(newScoredQuestions, allAccAttempts, 'COMPLETED');
    } else {
      setCurrentQuestionIndex(nextIndex);
      loadQuestionAtIndex(nextIndex);
    }
  };

  // Handle explicit Retry click
  const handleStartRetry = () => {
    setAttemptNumberForCurrent((prev) => prev + 1);
    setTranscript('');
    setManualText('');
    setShowRetryPrompt(false);
  };

  // Skip retry and proceed
  const handleSkipRetry = () => {
    setShowRetryPrompt(false);
    resolveCurrentQuestionAndAdvance(currentQuestionAttempts, allAttempts);
  };

  // Finalize session and calculate mathematical scores
  const finishSession = (
    finalScoredQs: ScoredCoreQuestion[],
    finalAttempts: QuestionAttempt[],
    status: 'COMPLETED' | 'STOPPED_EARLY'
  ) => {
    const scores = calculateDrillScores(target, finalScoredQs, finalAttempts);

    // Save session record for Day 10, Day 15, Day 20 longitudinal tracking
    saveDrillSessionRecord({
      sessionId: `drill_${Date.now()}`,
      dayNumber,
      timestamp: Date.now(),
      target,
      questionsAttemptedCount: finalScoredQs.length,
      coreQuestions: finalScoredQs,
      scores,
      completionStatus: status,
    });

    onFinishSession(scores);
  };

  const handleEarlyExit = () => {
    // If learner wants to stop, end immediately and calculate scores based on completed attempts
    finishSession(scoredQuestions, allAttempts, 'STOPPED_EARLY');
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-6 pt-6 pb-24 text-white max-w-[480px] mx-auto font-sans min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#161722] via-[#0d0e14] to-[#07080b]">
      {/* Top Header Navigation */}
      <div className="w-full flex items-center justify-between py-2">
        {/* Early Exit / Menu */}
        <button
          onClick={handleEarlyExit}
          className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 transition-colors border border-white/[0.08]"
          title="End Drill"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Question Counter Pill */}
        <div className="px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-bold tracking-wider text-zinc-300">
          Q {Math.min(TOTAL_TARGET_QUESTIONS, currentQuestionIndex + 1)} / {TOTAL_TARGET_QUESTIONS}
        </div>

        {/* Audio Speaker */}
        <button
          onClick={() => currentQuestion && speakText(currentQuestion.question)}
          className={`p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 transition-colors border border-white/[0.08] ${
            isAudioPlaying ? 'text-sky-400 animate-pulse' : ''
          }`}
          title="Listen to question"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Question Display (Inspired by reference screenshot) */}
      <div className="w-full my-auto py-8 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.question}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col items-center"
            >
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-4 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                {currentQuestion.context || target.title}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                "{currentQuestion.question}"
              </h2>
              {currentQuestion.hindiText && (
                <p className="text-sm font-medium text-zinc-400 mt-3 max-w-sm">
                  {currentQuestion.hindiText}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio Visualizer Waves (Inspired by reference screenshot) */}
        <div className="w-full py-10 flex items-center justify-center gap-1.5 h-32">
          {[
            12, 24, 18, 36, 48, 30, 20, 56, 72, 45, 30, 60, 85, 95, 65, 40, 75, 55, 30, 65, 45, 25, 50, 35, 20
          ].map((h, i) => (
            <motion.div
              key={i}
              animate={
                isRecording
                  ? { height: [h * 0.4, h * (1 + Math.random() * 0.6), h * 0.4] }
                  : { height: h * 0.5 }
              }
              transition={
                isRecording
                  ? { repeat: Infinity, duration: 0.6 + (i % 5) * 0.1, ease: 'easeInOut' }
                  : { duration: 0.3 }
              }
              className={`w-1 rounded-full ${
                i % 2 === 0
                  ? 'bg-gradient-to-t from-rose-500 to-purple-500'
                  : 'bg-gradient-to-t from-purple-500 to-sky-400'
              }`}
              style={{ height: `${h * 0.6}px` }}
            />
          ))}
        </div>
      </div>

      {/* Evaluation / Retry Prompt if needed */}
      {showRetryPrompt && lastEvaluation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-4 flex flex-col gap-2.5"
        >
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-bold text-amber-300">Natural Phrasing Tip</div>
              <div className="text-sm text-zinc-200 mt-1 font-medium">
                "{lastEvaluation.naturalCorrection}"
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleStartRetry}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry with this phrase</span>
            </button>
            <button
              onClick={handleSkipRetry}
              className="py-2 px-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs hover:bg-zinc-700 transition-colors"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}

      {/* Bottom Interactive Area (Mic Button & Language Labels) */}
      <div className="w-full flex flex-col items-center gap-6 mt-auto pt-4">
        {/* Live Transcript / Optional Manual Input */}
        {(transcript || manualText) && (
          <div className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[11px] text-zinc-400 block mb-1">Your response:</span>
            <span className="text-sm font-semibold text-white">"{transcript || manualText}"</span>
          </div>
        )}

        <div className="w-full flex items-center justify-between px-4">
          <div className="text-left">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Listening</span>
            <span className="text-xs font-extrabold text-sky-400 tracking-wider">ENGLISH</span>
          </div>

          {/* Glowing Circular Record Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              isRecording
                ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse'
                : 'bg-gradient-to-b from-[#1e202d] to-[#121319] border-2 border-sky-500/60 shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:border-sky-400'
            }`}
          >
            <div className="absolute inset-1 rounded-full border border-white/10" />
            {isRecording ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-sky-400" />}
          </motion.button>

          <div className="text-right">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Target</span>
            <span className="text-xs font-extrabold text-purple-400 tracking-wider">PRACTICE</span>
          </div>
        </div>

        {/* Submit / Check Answer action */}
        {(transcript || manualText) && (
          <button
            onClick={handleSubmitAnswer}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 text-zinc-950 font-extrabold text-sm shadow-lg flex items-center justify-center gap-2"
          >
            <span>{isProcessing ? 'Evaluating with AI...' : 'Submit & Check Answer'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
