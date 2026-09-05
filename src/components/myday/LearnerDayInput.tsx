import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  MicOff,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Activity as ActivityIcon,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface LearnerDayInputProps {
  onSubmitStatement: (statement: string) => void;
  onGoBack: () => void;
  isLoading: boolean;
  initialText?: string;
  onOpenPatternLibrary?: () => void;
  onOpenInspector?: () => void;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
}

export const LearnerDayInput: React.FC<LearnerDayInputProps> = ({
  onSubmitStatement,
  onGoBack,
  isLoading,
  initialText = '',
  onOpenPatternLibrary,
  onOpenInspector,
  voiceEnabled = true,
  onToggleVoice,
}) => {
  const [statement, setStatement] = useState(initialText);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        soundFx.playBubbleStart();
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTrans) {
          setStatement((prev) => (prev ? `${prev.trim()} ${finalTrans.trim()}` : finalTrans.trim()));
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type your day below!');
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
      soundFx.playBubblePop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Error starting speech recognition:', e);
      }
    }
  };

  const handleReset = () => {
    setStatement('');
    soundFx.playBubblePop();
  };

  const handleSubmit = () => {
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }
    if (!statement.trim() || isLoading) return;
    soundFx.playSuccessChime();
    onSubmitStatement(statement.trim());
  };

  return (
    <div className="w-full flex-1 flex flex-col px-4 pt-3 pb-6 text-zinc-100 max-w-[460px] mx-auto min-h-[calc(100vh-80px)]">
      {/* Top App Bar with back button on page 2 */}
      <div className="w-full flex items-center justify-between py-2 mb-3">
        {/* Left: Back Button + Buddy Pill */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onGoBack}
            className="w-10 h-10 rounded-full bg-[#181920] hover:bg-[#232530] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-950/40 border border-sky-500/40 text-sky-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
            <span>Buddy</span>
          </div>
        </div>

        {/* Right: Actions (Patterns, Performance, Audio Toggle, Reset) */}
        <div className="flex items-center gap-1.5">
          {onOpenPatternLibrary && (
            <button
              onClick={onOpenPatternLibrary}
              className="w-9 h-9 rounded-full bg-[#181920] hover:bg-[#232530] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Patterns"
            >
              <BookOpen className="w-4 h-4 stroke-[2]" />
            </button>
          )}

          {onOpenInspector && (
            <button
              onClick={onOpenInspector}
              className="w-9 h-9 rounded-full bg-[#181920] hover:bg-[#232530] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Performance & Analysis"
            >
              <ActivityIcon className="w-4 h-4 stroke-[2]" />
            </button>
          )}

          {onToggleVoice && (
            <button
              onClick={onToggleVoice}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                voiceEnabled
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                  : 'bg-[#181920] border-zinc-800 text-zinc-400'
              }`}
              title={voiceEnabled ? 'Mute Voice' : 'Enable Voice'}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4 stroke-[2]" />
              ) : (
                <VolumeX className="w-4 h-4 stroke-[2]" />
              )}
            </button>
          )}

          <button
            onClick={handleReset}
            className="w-9 h-9 rounded-full bg-[#181920] hover:bg-[#232530] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Text"
          >
            <RotateCcw className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Subtitle instruction */}
      <div className="mb-4 px-1">
        <p className="text-sm text-zinc-300 leading-relaxed font-normal">
          Speak or type freely in any English. Don't worry about grammar or sentence structure.
        </p>
      </div>

      {/* Main Input Container Card */}
      <div className="w-full flex-1 bg-[#13141a] border border-zinc-800/90 focus-within:border-sky-500/60 rounded-[32px] p-5 flex flex-col justify-between shadow-2xl shadow-black/80 relative min-h-[380px]">
        {/* Text Area */}
        <div className="w-full flex-1 flex flex-col">
          <textarea
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder="e.g. morning i go office on bike then my supervisor angry because inbound mistake then evening meet Ravi at tea stall..."
            className="w-full flex-1 bg-transparent text-zinc-100 placeholder-zinc-500/80 text-base leading-relaxed resize-none focus:outline-none font-normal min-h-[220px]"
          />
        </div>

        {/* Bottom Status & Actions inside Container */}
        <div className="w-full pt-4 border-t border-zinc-800/60 flex flex-col gap-3.5">
          {/* Status line with checkmark and char count */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              <span>Your exact meaning will be understood</span>
            </div>
            <span className="text-zinc-400 font-mono text-[11px]">
              {statement.length} chars
            </span>
          </div>

          {/* Action buttons: Mic on left, Enter Text on right */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {/* Mic Toggle Button */}
            <button
              onClick={toggleRecording}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse ring-4 ring-rose-500/20'
                  : 'bg-[#1e2029] hover:bg-[#282b37] border-zinc-700/80 text-sky-400 shadow-md'
              }`}
              title={isRecording ? 'Stop Recording' : 'Speak Your Day'}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <Mic className="w-5 h-5 stroke-[2.2]" />
              )}
            </button>

            {/* Enter Text / Analyze CTA Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={!statement.trim() || isLoading}
              className={`flex-1 py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                statement.trim() && !isLoading
                  ? 'bg-[#0B69A3] hover:bg-[#0284C7] text-white shadow-sky-950/50'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Meaning...</span>
                </div>
              ) : (
                <>
                  <span>Enter Text</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
