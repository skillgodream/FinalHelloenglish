import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Play,
  Award,
  Sparkles,
  ArrowRight,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';

let activeAudioElement: HTMLAudioElement | null = null;

const stopAudio = () => {
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {
      // ignore
    }
    activeAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }
};

const speakFallbackWebSpeech = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.94;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Web Speech fallback error:', e);
  }
};

interface Message {
  id: string;
  sender: 'buddy' | 'learner';
  text: string;
  hindiSupport?: string;
  timestamp: Date;
  suggestedPhrasing?: string;
}

export const BuddyView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isBuddySpeaking, setIsBuddySpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [awaitingRetry, setAwaitingRetry] = useState(false);
  const [retryPrompt, setRetryPrompt] = useState('');
  const [ttsAudioMuted, setTtsAudioMuted] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const transcript = event.results[i][0].transcript;
              setInputText(transcript);
              setInterimTranscript('');
              handleSendMessage(transcript);
            } else {
              current += event.results[i][0].transcript;
              setInterimTranscript(current);
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('[Speech Recognition Event]', event.error);
          setIsListening(false);
          setInterimTranscript('');
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      stopAudio();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript, isLoading]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
    } else {
      if (isBuddySpeaking) {
        stopAudio();
        setIsBuddySpeaking(false);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Speech recognition restart notice:', e);
        }
      }
    }
  };

  const playVoice = async (text: string) => {
    if (ttsAudioMuted) return;
    setIsBuddySpeaking(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          lang: 'en-IN',
          speaker: 'ritu',
          pace: 0.94,
          loudness: 1.0,
        }),
      });
      const data = await res.json();
      const audioSrc = data.audioData || (data.audioBase64 ? `data:audio/wav;base64,${data.audioBase64}` : null);
      if (audioSrc) {
        stopAudio();
        const audio = new Audio(audioSrc);
        activeAudioElement = audio;
        await audio.play();
      } else {
        speakFallbackWebSpeech(text);
      }
    } catch (err) {
      console.warn('Speech playback fallback:', err);
      speakFallbackWebSpeech(text);
    } finally {
      setIsBuddySpeaking(false);
    }
  };

  const startConversation = async () => {
    setSessionStarted(true);
    setSessionCompleted(false);
    setSummaryData(null);
    setExchangeCount(0);
    setAwaitingRetry(false);
    setRetryPrompt('');

    const initialGreeting =
      "Hello! I'm your English Buddy 😊 How are you today?";
    const initialMessage: Message = {
      id: 'msg-0',
      sender: 'buddy',
      text: initialGreeting,
      timestamp: new Date(),
    };

    setMessages([initialMessage]);
    playVoice(initialGreeting);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    setInterimTranscript('');

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'learner',
      text,
      timestamp: new Date(),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const currentAwaitingRetry = awaitingRetry;
      setRetryPrompt('');

      const res = await fetch('/api/buddy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerMessage: text,
          history: updatedHistory,
          exchangeCount: exchangeCount + 1,
          wasAwaitingEnglishRetry: currentAwaitingRetry,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const buddyReplyText = [data.naturalResponse, data.nextQuestion]
        .filter(Boolean)
        .join(' ')
        .trim();

      const buddyMsg: Message = {
        id: `msg-${Date.now()}-buddy`,
        sender: 'buddy',
        text: buddyReplyText || "I'm listening! Tell me more.",
        timestamp: new Date(),
        suggestedPhrasing: data.subtleRecast || data.englishModel,
      };

      setMessages((prev) => [...prev, buddyMsg]);
      setExchangeCount((prev) => prev + 1);

      const isWaitingRetry = Boolean(data.awaitingEnglishRetry);
      setAwaitingRetry(isWaitingRetry && Boolean(data.subtleRecast || data.englishModel));
      if (isWaitingRetry && (data.subtleRecast || data.englishModel)) {
        setRetryPrompt(data.subtleRecast || data.englishModel);
      } else {
        setRetryPrompt('');
      }

      playVoice(buddyReplyText);

      if ((exchangeCount + 1 >= 8 || data.shouldEnd) && !sessionCompleted) {
        triggerSummaryDebrief(updatedHistory);
      }
    } catch (err) {
      console.error('Failed to communicate with Buddy:', err);
      const fallbackBuddyMsg: Message = {
        id: `msg-${Date.now()}-buddy-err`,
        sender: 'buddy',
        text: "I heard you! Let's keep going. What else did you do today?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackBuddyMsg]);
      playVoice(fallbackBuddyMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerSummaryDebrief = async (history: Message[]) => {
    try {
      const res = await fetch('/api/buddy-chat/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history }),
      });

      if (res.ok) {
        const summary = await res.json();
        setSummaryData(summary);
        setSessionCompleted(true);
      }
    } catch (e) {
      console.warn('Summary fetch failed:', e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 py-3">
      {/* Top Session Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/20">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                English Buddy
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Adaptive Spoken English Partner (Voice: Ritu)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTtsAudioMuted(!ttsAudioMuted)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title={ttsAudioMuted ? 'Unmute voice' : 'Mute voice'}
          >
            {ttsAudioMuted ? (
              <VolumeX className="w-5 h-5 text-red-500" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          {!sessionStarted && (
            <button
              onClick={startConversation}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Conversation
            </button>
          )}
        </div>
      </div>

      {/* Main Conversation Screen */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {!sessionStarted ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Practice English Naturally with Buddy
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
              Buddy adapts to your level. You can speak freely in English, Hindi,
              or Hinglish. Buddy gently helps you turn thoughts into clear,
              natural English.
            </p>
            <button
              onClick={startConversation}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start Conversation
            </button>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'learner' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  m.sender === 'learner'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'buddy' && (
                <button
                  onClick={() => playVoice(m.text)}
                  className="mt-1 flex items-center gap-1 text-[11px] text-gray-400 hover:text-emerald-600 px-1"
                >
                  <Volume2 className="w-3 h-3" />
                  Listen again
                </button>
              )}
            </div>
          ))
        )}

        {interimTranscript && (
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 rounded-tr-none italic animate-pulse">
              {interimTranscript}...
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 p-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
            <div
              className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: '0.15s' }}
            />
            <div
              className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: '0.3s' }}
            />
            <span>Buddy is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested English Retry Prompt Chip */}
      {retryPrompt && (
        <div className="mb-2 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/40 rounded-xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              Try saying:{' '}
              <strong className="underline decoration-amber-400 font-semibold">
                "{retryPrompt}"
              </strong>
            </span>
          </div>
          <button
            onClick={() => {
              setInputText(retryPrompt);
            }}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-medium transition"
          >
            Tap to use
          </button>
        </div>
      )}

      {/* Input Bar */}
      {sessionStarted && !sessionCompleted && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl transition shadow-sm ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title={isListening ? 'Stop listening' : 'Speak'}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to you speak...'
                  : 'Type in English or Hindi / Hinglish...'
              }
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Summary Scorecard Modal */}
      {sessionCompleted && summaryData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <Award className="w-6 h-6" />
                <span>Conversation Progress Debrief</span>
              </div>
              <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full font-semibold">
                Score: {summaryData.overallScore || 82}%
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              {summaryData.whatWeTalkedAbout}
            </p>

            {summaryData.strengths && (
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  What You Did Well
                </h4>
                <ul className="text-xs text-emerald-700 dark:text-emerald-400 list-disc list-inside space-y-0.5">
                  {summaryData.strengths.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {summaryData.nextTimeGoal && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-800 dark:text-blue-300">
                <strong>Next Step Goal:</strong> {summaryData.nextTimeGoal}
              </div>
            )}

            <button
              onClick={() => {
                setSessionCompleted(false);
                startConversation();
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
            >
              Start New Practice
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
