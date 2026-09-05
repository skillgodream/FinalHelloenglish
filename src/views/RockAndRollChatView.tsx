import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  User,
  ShieldAlert,
  Flame,
  Smile,
  Frown,
  Meh,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createSpeechRecognizer, soundFx, speakText, stopSpeaking } from '../utils/audio';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'learner' | 'coach';
  text: string;
  timestamp: string;
  emotion?: 'angry' | 'frustrated' | 'neutral' | 'satisfied' | 'happy';
  coachingFeedback?: {
    type: 'positive' | 'warning' | 'tip';
    message: string;
  };
}

interface RockAndRollChatViewProps {
  challenge: any;
  onComplete: (summary: any) => void;
  onBack?: () => void;
}

export const RockAndRollChatView: React.FC<RockAndRollChatViewProps> = ({
  challenge,
  onComplete,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState<boolean>(true);
  const [isCustomerTyping, setIsCustomerTyping] = useState<boolean>(false);
  const [showScenarioInfo, setShowScenarioInfo] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<'level1' | 'level2' | 'level3'>('level1');
  const [customerMood, setCustomerMood] = useState<'angry' | 'frustrated' | 'neutral' | 'satisfied' | 'happy'>('frustrated');
  const [turnCount, setTurnCount] = useState<number>(0);

  // Scoring telemetry
  const [empathyScore, setEmpathyScore] = useState<number>(75);
  const [handlingScore, setHandlingScore] = useState<number>(80);
  const [grammarScore, setGrammarScore] = useState<number>(82);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  const recognizerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLElement>(null);

  // Pre-seed first customer opening line based on scenario context
  useEffect(() => {
    const openingLine = generateInitialCustomerLine(challenge);
    const initialMsg: ChatMessage = {
      id: 'init-1',
      sender: 'customer',
      text: openingLine,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: 'frustrated',
    };

    setMessages([initialMsg]);

    if (isSpeakingEnabled) {
      setTimeout(() => {
        speakText(openingLine, 'en-IN', 0.95);
      }, 400);
    }

    return () => {
      stopSpeaking();
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (_) {}
      }
    };
  }, [challenge]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCustomerTyping]);

  // Speech Recognition Handling
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (_) {}
      }
      setIsRecording(false);
      soundFx.playBubblePop();
      return;
    }

    soundFx.playBubbleStart();
    try {
      const recognizer = createSpeechRecognizer(
        (text, isFinal) => {
          setInputText(text);
          if (isFinal) {
            setIsRecording(false);
          }
        },
        (error) => {
          console.warn('Recognition error:', error);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );

      if (recognizer) {
        recognizerRef.current = recognizer;
        recognizer.start();
        setIsRecording(true);
      }
    } catch (e) {
      console.warn('Speech recognition not available', e);
      setIsRecording(false);
    }
  };

  // Generate context-tailored initial customer prompt
  function generateInitialCustomerLine(c: any): string {
    const title = (c.title || '').toLowerCase();
    const startingSit = c.scenarioContext?.startingSituation;

    if (startingSit) {
      if (title.includes('room') && (title.includes('clean') || title.includes('dirty'))) {
        return "Excuse me! I just walked into Room 304 and the bathroom is not clean at all, and the towels haven't been replaced. I have an important meeting in 45 minutes!";
      }
      if (title.includes('unavailable') || title.includes('booking') || title.includes('check in')) {
        return "Hi, I have a confirmed reservation under David Miller, but your colleague just told me my room isn't ready. I've had a 14-hour flight, what is happening?";
      }
      if (title.includes('bill') || title.includes('charge') || title.includes('hisab')) {
        return "Look at this invoice! There is an extra ₹3,500 charged for dining services that I never ordered. I need this corrected immediately.";
      }
      if (title.includes('food') || title.includes('order') || title.includes('cold') || title.includes('delay')) {
        return "We have been waiting for our main course for over 40 minutes, and the soup served earlier was completely cold. This is unacceptable service.";
      }
      return `${startingSit} Can you please tell me how this is going to be handled right now?`;
    }

    return `Excuse me, I need immediate assistance with ${c.title || 'this issue'}. It has caused a major inconvenience for me!`;
  }

  // Suggest context-sensitive quick phrases for the learner
  const quickPhrases = [
    "I sincerely apologize for the inconvenience, let me check this right away.",
    "May I please confirm your room number or booking details so I can prioritize this?",
    "I completely understand your urgency, let me coordinate with our team immediately.",
  ];

  // Send Learner Message and Generate Dynamic Customer Reaction
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    soundFx.playBubbleStart();

    // Check learner input quality & grammar
    const lower = text.toLowerCase();
    const hasApology = lower.includes('sorry') || lower.includes('apologize') || lower.includes('apologies') || lower.includes('regret');
    const hasVerification = lower.includes('check') || lower.includes('confirm') || lower.includes('verify') || lower.includes('room') || lower.includes('details');
    const hasUncheckedPromise = lower.includes('free upgrade') || lower.includes('full refund') || lower.includes('i guarantee 5 minutes');

    let feedback: { type: 'positive' | 'warning' | 'tip'; message: string } | undefined;
    if (hasUncheckedPromise) {
      feedback = {
        type: 'warning',
        message: 'Caution: Avoid promising unauthorized refunds or upgrades before confirming authority.',
      };
      setHandlingScore((prev) => Math.max(60, prev - 8));
    } else if (hasApology && hasVerification) {
      feedback = {
        type: 'positive',
        message: 'Excellent de-escalation: sincere empathy combined with immediate fact-finding.',
      };
      setEmpathyScore((prev) => Math.min(98, prev + 8));
      setHandlingScore((prev) => Math.min(96, prev + 6));
    } else if (hasApology) {
      feedback = {
        type: 'positive',
        message: 'Good empathetic opening. Now follow up with a concrete next action.',
      };
      setEmpathyScore((prev) => Math.min(95, prev + 5));
    }

    const learnerMsg: ChatMessage = {
      id: `learner-${Date.now()}`,
      sender: 'learner',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coachingFeedback: feedback,
    };

    const updatedMessages = [...messages, learnerMsg];
    setMessages(updatedMessages);
    setInputText('');
    const newTurnCount = turnCount + 1;
    setTurnCount(newTurnCount);

    // Simulate customer thinking & dynamic response
    setIsCustomerTyping(true);

    try {
      const response = await fetch('/api/rock-and-roll/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge,
          history: updatedMessages,
          learnerMessage: text,
          turnCount: newTurnCount,
        }),
      });

      if (response.ok) {
        const aiData = await response.json();
        setIsCustomerTyping(false);
        const newMood = aiData.customerMood || 'neutral';
        setCustomerMood(newMood);
        if (aiData.resolutionReached) {
          setIsResolved(true);
        }

        const customerMsg: ChatMessage = {
          id: `customer-${Date.now()}`,
          sender: 'customer',
          text: aiData.customerReply || "I understand. Let's proceed.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          emotion: newMood,
        };

        setMessages((prev) => [...prev, customerMsg]);
        soundFx.playBubblePop();

        if (isSpeakingEnabled) {
          speakText(customerMsg.text, 'en-IN', 0.96);
        }
        return;
      }
    } catch (e) {
      console.warn("AI chat API error, falling back to local generator", e);
    }

    setTimeout(() => {
      const { replyText, newMood, resolutionReached } = generateCustomerReply({
        learnerText: text,
        turnNumber: newTurnCount,
        challenge,
        currentMood: customerMood,
      });

      setIsCustomerTyping(false);
      setCustomerMood(newMood);
      if (resolutionReached) {
        setIsResolved(true);
      }

      const customerMsg: ChatMessage = {
        id: `customer-${Date.now()}`,
        sender: 'customer',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: newMood,
      };

      setMessages((prev) => [...prev, customerMsg]);
      soundFx.playBubblePop();

      if (isSpeakingEnabled) {
        speakText(replyText, 'en-IN', 0.96);
      }
    }, 1200);
  };

  // Conversational response synthesis generator
  function generateCustomerReply(params: {
    learnerText: string;
    turnNumber: number;
    challenge: any;
    currentMood: typeof customerMood;
  }): { replyText: string; newMood: typeof customerMood; resolutionReached: boolean } {
    const { learnerText, turnNumber, challenge } = params;
    const lower = learnerText.toLowerCase();

    const title = (challenge?.title || '').toLowerCase();

    // Turn 1 reactions
    if (turnNumber === 1) {
      if (lower.includes('sorry') || lower.includes('apologize') || lower.includes('understand')) {
        if (title.includes('clean')) {
          return {
            replyText: "Thank you for understanding. It's Room 304. Can you send someone immediately or arrange another clean room? I need to get ready for my client presentation.",
            newMood: 'neutral',
            resolutionReached: false,
          };
        }
        if (title.includes('unavailable') || title.includes('booking')) {
          return {
            replyText: "I appreciate you looking into this. Here is my confirmation voucher #HL-9821. How soon can a room be prepared?",
            newMood: 'neutral',
            resolutionReached: false,
          };
        }
        if (title.includes('bill') || title.includes('charge')) {
          return {
            replyText: "Thank you. Here is the folio copy. If you check yesterday's room service bill, I was in a conference all evening so these minibar items aren't mine.",
            newMood: 'neutral',
            resolutionReached: false,
          };
        }
        return {
          replyText: "Alright, I appreciate your polite approach. What are the next steps to resolve this right now?",
          newMood: 'neutral',
          resolutionReached: false,
        };
      } else {
        return {
          replyText: "I don't just want explanations, I need a clear solution. What are you going to do about this right now?",
          newMood: 'frustrated',
          resolutionReached: false,
        };
      }
    }

    // Turn 2 reactions (Complication / Clarification)
    if (turnNumber === 2) {
      if (lower.includes('housekeeping') || lower.includes('team') || lower.includes('manager') || lower.includes('action') || lower.includes('coordinate') || lower.includes('check')) {
        return {
          replyText: "Okay, if housekeeping can refresh the room in the next 15 minutes, or if there is a ready room on the same floor, that would work. Will you keep me updated personally?",
          newMood: 'satisfied',
          resolutionReached: false,
        };
      } else {
        return {
          replyText: "Can you confirm a specific timeframe? I cannot wait around indefinitely.",
          newMood: 'frustrated',
          resolutionReached: false,
        };
      }
    }

    // Turn 3+ reactions (Resolution)
    if (lower.includes('yes') || lower.includes('update') || lower.includes('ensure') || lower.includes('personally') || lower.includes('right away') || lower.includes('assist')) {
      return {
        replyText: "Thank you for handling this so professionally and taking ownership. I really appreciate your swift help!",
        newMood: 'happy',
        resolutionReached: true,
      };
    }

    return {
      replyText: "Alright, that sounds fair and acceptable. Thank you for resolving this for me.",
      newMood: 'satisfied',
      resolutionReached: true,
    };
  }

  // Complete and package session debrief data
  const handleFinishDebrief = async () => {
    soundFx.playSuccessChime();
    const learnerWords = messages
      .filter((m: any) => m.sender === 'learner')
      .reduce((sum: number, m: any) => sum + (m.text?.split(/\s+/).filter(Boolean).length || 0), 0);

    try {
      const response = await fetch('/api/rock-and-roll/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge,
          history: messages,
        }),
      });
      if (response.ok) {
        const summaryData = await response.json();
        onComplete({
          ...summaryData,
          turnCount,
          wordCount: Math.max(learnerWords, turnCount * 14),
          empathyScore,
          handlingScore,
          grammarScore,
          customerResponse: customerMood === 'happy' || customerMood === 'satisfied' ? 'Satisfied' : 'Neutral',
          timestamp: Date.now(),
        });
        return;
      }
    } catch (e) {
      console.warn("AI summary API error, falling back to local summary", e);
    }

    const finalScore = Math.round((empathyScore * 0.4) + (handlingScore * 0.35) + (grammarScore * 0.25));

    onComplete({
      situationName: challenge.title,
      score: Math.min(99, Math.max(68, finalScore)),
      turnCount,
      wordCount: Math.max(learnerWords, turnCount * 14),
      empathyScore,
      handlingScore,
      grammarScore,
      isResolved: true,
      howIHandledIt: {
        communication: 'Good',
        speaking: 'Good',
        confidence: 'Getting Better',
        situationHandling: 'Good'
      },
      iDidWell: [
        "Maintained professional de-escalation tone",
        "Acknowledged customer urgency promptly"
      ],
      practiceNext: [
        "Avoid pausing too long between verification steps",
        "Use more assertive phrasing when setting timeframes"
      ],
      myNaturalEnglish: [
        { learnerSaid: "I will check room right now sir.", betterEnglish: "I will check the room right away, sir.", explanation: "Adding articles and polite timeframe adverbs." }
      ],
      nextTimeGoal: "Confidently state the exact expected timeframe within the first 30 seconds.",
      customerResponse: customerMood === 'happy' || customerMood === 'satisfied' ? 'Satisfied' : 'Neutral',
      timestamp: Date.now(),
    });
  };

  // Customer Mood Icon & Color config
  const moodConfig = {
    angry: { label: 'High Tension', icon: Flame, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    frustrated: { label: 'Frustrated', icon: Frown, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    neutral: { label: 'Listening', icon: Meh, color: 'text-zinc-300', bg: 'bg-zinc-800 border-zinc-700' },
    satisfied: { label: 'Cooperative', icon: Smile, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    happy: { label: 'Satisfied', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  }[customerMood];

  return (
    <div className="w-full min-h-screen bg-[#07090e] text-white flex flex-col justify-between select-none">
      {/* Top Fixed Header */}
      <header className="sticky top-0 z-30 bg-[#0a0d14]/90 backdrop-blur-md border-b border-white/[0.08] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            onClick={onBack || (() => onComplete({}))}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>

          {/* Scenario Center Title & Mood Pill */}
          <div className="flex flex-col items-center text-center min-w-0 flex-1 px-1">
            <h1 className="text-xs font-bold text-white truncate max-w-[170px] sm:max-w-xs">
              {challenge.title}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${moodConfig.bg} ${moodConfig.color}`}>
                <moodConfig.icon className="w-3 h-3" />
                <span>{moodConfig.label}</span>
              </span>
            </div>
          </div>

          {/* Audio & Info Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (isSpeakingEnabled) stopSpeaking();
                setIsSpeakingEnabled(!isSpeakingEnabled);
              }}
              title={isSpeakingEnabled ? "Mute Customer Voice" : "Enable Customer Voice"}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isSpeakingEnabled
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              {isSpeakingEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setShowScenarioInfo(!showScenarioInfo)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                showScenarioInfo
                  ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Collapsible Mission / Context Card */}
        <AnimatePresence>
          {showScenarioInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-md mx-auto overflow-hidden pt-2.5"
            >
              <div className="p-3 bg-zinc-900/90 border border-white/10 rounded-xl text-xs space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Your Role</span>
                  <p className="text-zinc-200 font-medium capitalize mt-0.5">{challenge.staffRole || 'Hotel & Guest Service Staff'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Roleplay Mission</span>
                  <p className="text-zinc-300 leading-relaxed mt-0.5">{challenge.mission}</p>
                </div>
                {challenge.guestProfile?.whatTheGuestCaresAboutMost && (
                  <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-amber-400">Guest Priority:</span>
                    <span className="text-zinc-300 ml-1.5">{challenge.guestProfile.whatTheGuestCaresAboutMost}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Message Stream Container */}
      <main 
        ref={messagesContainerRef}
        className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col justify-between overflow-y-auto overscroll-contain touch-pan-y space-y-3.5"
      >
        {/* Scenario Intro Watermark */}
        <div className="text-center my-2">
          <span className="inline-block px-3 py-1 bg-zinc-900/80 border border-white/10 rounded-full text-[10px] font-semibold text-zinc-400 tracking-wider uppercase">
            Live Roleplay Session Started
          </span>
        </div>

        {/* Message Bubbles */}
        <div className="flex-1 flex flex-col space-y-3.5">
          {messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
              >
                {/* Sender Avatar & Role Label */}
                <div className={`flex items-center gap-1.5 mb-1 px-1 text-[11px] font-semibold ${isCustomer ? 'text-zinc-400' : 'text-purple-300'}`}>
                  {isCustomer ? (
                    <>
                      <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[9px] text-amber-400 font-bold">
                        G
                      </div>
                      <span>Guest ({challenge.guestRole || 'Customer'})</span>
                    </>
                  ) : (
                    <>
                      <span>You ({challenge.staffRole || 'Staff'})</span>
                      <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[9px] text-purple-300 font-bold">
                        ✓
                      </div>
                    </>
                  )}
                </div>

                {/* Speech Bubble */}
                <div
                  className={`relative max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                    isCustomer
                      ? 'bg-zinc-900/90 border border-white/10 text-zinc-100 rounded-tl-sm'
                      : 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white border border-purple-400/30 rounded-tr-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[10px] text-zinc-400">
                    <span>{msg.timestamp}</span>

                    {isCustomer && (
                      <button
                        onClick={() => speakText(msg.text, 'en-IN', 0.95)}
                        className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Volume2 className="w-3 h-3 text-zinc-400 hover:text-cyan-400" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Coach Feedback Pill */}
                {msg.coachingFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mt-1.5 max-w-[88%] p-2 rounded-xl text-[11px] flex items-start gap-2 border ${
                      msg.coachingFeedback.type === 'positive'
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{msg.coachingFeedback.message}</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isCustomerTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3 bg-zinc-900/80 border border-white/10 rounded-2xl rounded-tl-sm w-20"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Sticky Action Area */}
      <footer className="sticky bottom-0 z-30 bg-[#090c14]/95 backdrop-blur-lg border-t border-white/[0.08] p-3 pb-6">
        <div className="max-w-md mx-auto flex flex-col gap-2.5">
          {/* Context Quick Helper Suggestions */}
          {messages.length > 0 && !isCustomerTyping && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
              {quickPhrases.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(phrase)}
                  className="flex-shrink-0 text-[11px] bg-zinc-900/90 hover:bg-purple-900/30 border border-white/10 hover:border-purple-500/30 text-zinc-300 hover:text-white px-3 py-1.5 rounded-full cursor-pointer transition-all truncate max-w-[260px]"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          )}

          {/* Main Input Control Bar */}
          <div className="flex items-center gap-2">
            {/* Microphone Button */}
            <button
              onClick={toggleSpeechRecognition}
              aria-label="Voice Input"
              className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-[0_0_16px_rgba(225,29,72,0.8)] animate-pulse'
                  : 'bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-white/10'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isRecording && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" />
              )}
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isRecording ? "Listening to your voice..." : "Respond to the guest..."}
                className="w-full bg-zinc-900/90 border border-white/15 focus:border-purple-500 rounded-full px-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                inputText.trim()
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Complete & Debrief Bar */}
          {turnCount >= 1 && (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <Award className="w-3.5 h-3.5 text-zinc-400" />
                <span>Turn {turnCount} of 4</span>
              </div>

              <button
                onClick={handleFinishDebrief}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black font-bold text-xs rounded-full hover:bg-zinc-200 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <span>Finish & Debrief</span>
                <span className="text-[10px]">→</span>
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
