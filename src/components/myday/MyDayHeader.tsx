import React from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  BookOpen,
  Sliders,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface MyDayHeaderProps {
  currentStep:
    | '1_HOME'
    | '2_CHAT_INPUT'
    | '3_SYSTEM_SUMMARIZATION'
    | '4_CHATBOT_CONVERSATION'
    | '5_TOPIC_COMPLETE'
    | '6_SESSION_SUMMARY';
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenPatternLibrary: () => void;
  onToggleInspector: () => void;
  onResetSession: () => void;
  onGoBack?: () => void;
  inspectorOpen?: boolean;
}

export const MyDayHeader: React.FC<MyDayHeaderProps> = ({
  currentStep,
  voiceEnabled,
  onToggleVoice,
  onOpenPatternLibrary,
  onToggleInspector,
  onResetSession,
  onGoBack,
  inspectorOpen,
}) => {
  const getStepTitle = () => {
    switch (currentStep) {
      case '1_HOME':
        return 'My Day';
      case '2_CHAT_INPUT':
        return 'My Day: Tell Your Day';
      case '3_SYSTEM_SUMMARIZATION':
        return 'My Day: Day Story Map';
      case '4_CHATBOT_CONVERSATION':
        return 'My Day: Live Conversation';
      case '5_TOPIC_COMPLETE':
        return 'My Day: Topic Completed';
      case '6_SESSION_SUMMARY':
        return 'My Day: Story Summary';
      default:
        return 'My Day';
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-30">
      <div className="flex items-center gap-2.5">
        {onGoBack && currentStep !== '1_HOME' ? (
          <button
            onClick={onGoBack}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Go back"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>
        )}

        <div>
          <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            {getStepTitle()}
          </h1>
          <p className="text-[10px] text-zinc-400 font-medium">Coach Neha Conversational Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Voice Toggle */}
        <button
          onClick={onToggleVoice}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border cursor-pointer ${
            voiceEnabled
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
          title={voiceEnabled ? 'Voice Auto-play Enabled' : 'Voice Muted'}
          aria-label="Toggle Voice"
        >
          {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* 1000 Patterns Library */}
        <button
          onClick={onOpenPatternLibrary}
          className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
          title="Pattern Library (500+ Patterns)"
          aria-label="Open Pattern Library"
        >
          <BookOpen className="w-3.5 h-3.5" />
        </button>

        {/* Engine Inspector Drawer */}
        <button
          onClick={onToggleInspector}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border cursor-pointer ${
            inspectorOpen
              ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
          }`}
          title="Engine Analytics Inspector"
          aria-label="Engine Inspector"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Reset Session */}
        {currentStep !== '1_HOME' && (
          <button
            onClick={onResetSession}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 flex items-center justify-center transition-colors cursor-pointer"
            title="Reset Session"
            aria-label="Reset Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
