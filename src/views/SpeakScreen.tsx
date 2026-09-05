import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Keyboard,
  Send,
  Sparkles,
  RotateCcw,
  Volume2,
  HelpCircle,
  Square,
  PenLine,
} from 'lucide-react';
import { Question } from '../types';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import { IridescentSphere } from '../components/IridescentSphere';
import { createSpeechRecognizer, soundFx, stopSpeaking } from '../utils/audio';

interface SpeakScreenProps {
  question: Question;
  onBack: () => void;
  onSubmitAnswer: (transcript: string) => void;
  isAnalyzing?: boolean;
}

export const SpeakScreen: React.FC<SpeakScreenProps> = ({
  question,
  onBack,
  onSubmitAnswer,
  isAnalyzing = false,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');
  const [isTypingMode, setIsTypingMode] = useState<boolean>(false);
  const [hasPermissionError, setHasPermissionError] = useState<boolean>(false);

  const recognizerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (e) {}
      }
      stopSpeaking();
    };
  }, []);

  const startListening = () => {
    soundFx.playBubbleStart();
    setHasPermissionError(false);

    try {
      const recognizer = createSpeechRecognizer(
        (text, isFinal) => {
          setTranscript(text);
        },
        (error) => {
          console.warn('Recognition error:', error);
          if (error === 'not-allowed' || error === 'service-not-allowed') {
            setHasPermissionError(true);
          }
          setIsRecording(false);
        },
        () => {
          // Ended
          setIsRecording(false);
        }
      );

      if (recognizer) {
        recognizerRef.current = recognizer;
        recognizer.start();
        setIsRecording(true);
      } else {
        // Fallback if browser doesn't have Web Speech API (e.g. some webviews)
        setIsRecording(true);
        // Simulate speech helper if no microphone API
        setTimeout(() => {
          if (!transcript && question.sampleLearnerSpoken) {
            setTranscript(question.sampleLearnerSpoken);
          }
        }, 1500);
      }
    } catch (err) {
      console.warn('Speech capture initiation error:', err);
      setIsRecording(false);
    }
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    soundFx.playBubbleStart();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSend = () => {
    const textToSend = isTypingMode ? typedText.trim() : transcript.trim();
    if (!textToSend) return;
    onSubmitAnswer(textToSend);
  };

  const handleUseSamplePhrase = (phrase: string) => {
    if (isTypingMode) {
      setTypedText(phrase);
    } else {
      setTranscript(phrase);
    }
  };

  const activeText = isTypingMode ? typedText : transcript;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#FDF4FF] via-[#F8F7FF] to-[#FFF1F5] text-slate-900 flex flex-col justify-between pb-6 pt-3 px-4 sm:px-5">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between py-2 border-b border-[#E9D5FF]/70">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/95 border border-[#E9D5FF] flex items-center justify-center text-slate-700 hover:bg-[#FAF5FF] hover:border-[#D8B4FE] transition-colors shadow-2xs cursor-pointer"
            aria-label="Back to question"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
              Coach Neha
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              Speaking Session
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-white/80 border border-[#E9D5FF] flex items-center justify-center text-[#7C3AED] text-xs font-bold">
            1/1
          </div>
        </div>

        {/* Current Question Reminder Tag */}
        <div className="mt-3 px-3.5 py-2.5 rounded-2xl bg-white/90 border border-[#E9D5FF] pastel-card-shadow flex items-start gap-2.5">
          <span className="text-xs font-black text-[#7C3AED] shrink-0 mt-0.5">
            Q:
          </span>
          <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">
            {question.questionEn}
          </p>
        </div>

        {/* Screen Title & Friendly Subheading */}
        <div className="text-center mt-5">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Your Turn
          </h1>
          <p className="text-xs sm:text-[13px] font-semibold text-slate-500 mt-0.5">
            Speak in English. Don't worry about mistakes.
          </p>
        </div>
      </div>

      {/* CENTER INTERACTION AREA */}
      <div className="flex flex-col items-center justify-center my-4 py-2">
        {!isTypingMode ? (
          /* VOICE MODE: Large Circular Microphone & Floating Iridescent Orb */
          <div className="flex flex-col items-center w-full">
            {/* The Large Circular Glowing Element */}
            <div className="relative my-3 flex items-center justify-center">
              {/* Outer soft vibrant gradient ring pulses */}
              <div
                className={`absolute w-64 h-64 rounded-full transition-all duration-700 pointer-events-none ${
                  isRecording
                    ? 'bg-gradient-to-tr from-[#8B5CF6]/50 via-[#EC4899]/40 to-[#06B6D4]/40 animate-pulse-ring blur-xl'
                    : 'bg-gradient-to-tr from-[#C084FC]/30 to-[#F472B6]/30 blur-lg'
                }`}
              />

              {/* Floating Iridescent Sphere */}
              <IridescentSphere
                size="hero"
                isListening={isRecording}
                onClick={toggleRecording}
              />

              {/* Center Micro Icon Button Inside Sphere Base */}
              <button
                onClick={toggleRecording}
                className={`absolute w-18 h-18 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer ${
                  isRecording
                    ? 'bg-gradient-to-tr from-[#E11D48] via-[#DB2777] to-[#EA580C] text-white scale-110 shadow-[#DB2777]/40 ring-4 ring-white/60'
                    : 'bg-white/95 text-[#7C3AED] hover:scale-105 shadow-[#7C3AED]/25 border-2 border-white'
                }`}
                aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
              >
                {isRecording ? (
                  <Square className="w-6 h-6 fill-white" />
                ) : (
                  <Mic className="w-8 h-8 stroke-[2.4]" />
                )}
              </button>
            </div>

            {/* Audio Waveform & Status Indicator */}
            <div className="w-full max-w-xs flex flex-col items-center mt-2 min-h-[70px] justify-center">
              {isRecording ? (
                <div className="flex flex-col items-center">
                  <WaveformVisualizer isActive={true} barCount={26} />
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#E11D48] mt-1 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                    Listening... Speak your mind
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-extrabold text-slate-900">
                    Tap to Speak
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    Coach Neha is ready to listen
                  </p>
                </div>
              )}
            </div>

            {/* Live Spoken Transcript Preview */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full mt-3 p-4 rounded-2xl bg-white/95 border border-[#E9D5FF] pastel-card-shadow text-center relative"
              >
                <span className="text-[10px] font-extrabold text-[#7C3AED] uppercase tracking-wider block mb-1">
                  You said
                </span>
                <p className="text-sm font-bold text-slate-900 leading-relaxed">
                  “{transcript}”
                </p>

                <button
                  onClick={() => setTranscript('')}
                  className="mt-2 text-[10px] font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear and re-speak
                </button>
              </motion.div>
            )}

            {/* Permission warning if microphone is blocked */}
            {hasPermissionError && (
              <div className="mt-2 p-2.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#BE123C] text-center font-medium">
                Microphone access was blocked. You can still type your answer below!
              </div>
            )}
          </div>
        ) : (
          /* TYPING MODE: Soft Vibrant Text Area */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="rounded-3xl p-4 sm:p-5 bg-white border border-[#E9D5FF] pastel-card-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#7C3AED] flex items-center gap-1.5">
                  <PenLine className="w-3.5 h-3.5" />
                  Type your answer
                </span>
                <button
                  onClick={() => setIsTypingMode(false)}
                  className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
                >
                  Switch to Voice
                </button>
              </div>

              <textarea
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="e.g. I call supervisor on road when bike running..."
                rows={4}
                className="w-full p-3.5 rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF] text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:bg-white resize-none"
              />

              <p className="text-[10px] font-medium text-slate-500 mt-2">
                ✍️ Write in simple English as it comes to your mind.
              </p>
            </div>
          </motion.div>
        )}

        {/* Quick Sample Starter Chips for Learners */}
        <div className="w-full mt-3">
          <p className="text-[11px] font-bold text-slate-600 mb-1.5 px-1">
            Need an example starter? Tap any phrase:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {question.samplePhrases.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleUseSamplePhrase(sample)}
                className="px-3 py-1.5 rounded-full bg-white/90 border border-[#E9D5FF] text-[11px] font-semibold text-slate-700 hover:bg-[#FAF5FF] hover:border-[#C084FC] hover:text-[#7C3AED] transition-colors cursor-pointer"
              >
                “{sample}”
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ACTIONS AREA */}
      <div className="sticky bottom-0 mt-4 pt-2 pb-2 bg-gradient-to-t from-[#FFF1F5] via-[#FFF1F5]/95 to-transparent backdrop-blur-xs z-20 space-y-2.5">
        {/* Toggle Mode: Tap to Write / Tap to Speak */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (isRecording) stopListening();
              setIsTypingMode(!isTypingMode);
            }}
            className="py-2 px-4 rounded-full bg-white/90 border border-[#E9D5FF] text-xs font-bold text-[#7C3AED] hover:bg-[#FAF5FF] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            {isTypingMode ? (
              <>
                <Mic className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>🎤 Tap to Speak</span>
              </>
            ) : (
              <>
                <Keyboard className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>⌨️ Tap to Write</span>
              </>
            )}
          </button>
        </div>

        {/* Send Button */}
        <button
          disabled={!activeText || isAnalyzing}
          onClick={handleSend}
          className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeText && !isAnalyzing
              ? 'bg-gradient-to-r from-[#7C3AED] via-[#DB2777] to-[#EA580C] text-white shadow-xl shadow-[#DB2777]/30 hover:opacity-95 active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Coach Neha is listening...</span>
            </>
          ) : (
            <>
              <span>Send to Coach Neha</span>
              <Send className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
