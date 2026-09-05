import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Play, 
  ChevronRight, 
  ArrowLeft,
  Volume2,
  Mic,
  Check
} from 'lucide-react';
import { Question } from '../types';
import { PRACTICE_QUESTIONS } from '../data/questions';
import { speakText, playFixedAudio, stopSpeaking } from '../utils/audio';
import { AudioMuteButton } from '../components/AudioMuteButton';

interface CourseViewProps {
  onStartPractice: (question?: Question) => void;
}

interface SubModule {
  title: string;
  duration: string;
  sentences: { english: string; meaning: string }[];
  question: Question;
}

interface CourseModule {
  id: string;
  title: string;
  category: 'Tenses' | 'Helping Verbs' | 'Office' | 'Daily' | 'Friends' | 'Patterns';
  duration: string;
  instructor: string;
  badge: string;
  image: string;
  description: string;
  subModules: SubModule[];
}

type LessonStep = 'hub' | 'how_to_use' | 'practice' | 'real_situation' | 'completed';

export const CourseView: React.FC<CourseViewProps> = ({ onStartPractice }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeProgram, setActiveProgram] = useState<CourseModule | null>(null);
  
  // Lesson Flow States
  const [activeSubModule, setActiveSubModule] = useState<SubModule | null>(null);
  const [lessonStep, setLessonStep] = useState<LessonStep>('hub');
  const [cardIndex, setCardIndex] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const courseModules: CourseModule[] = [
    {
      id: 'c-1',
      title: 'Mastering Past, Present & Future Tenses',
      category: 'Tenses',
      duration: '15 min • Grammar Snippet',
      instructor: 'Coach Neha',
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      description: 'Master past actions (yesterday), present duties (today), and future plans (tomorrow) with correct verb forms.',
      subModules: [
        {
          title: 'Snippet 1: Present State & Routine',
          duration: '3 min',
          sentences: [
            { english: 'I work in the logistics warehouse.', meaning: 'मैं लॉजिस्टिक्स वेयरहाउस में काम करता हूँ।' },
            { english: 'She checks the parcel inventory daily.', meaning: 'वह रोज़ पार्सल इन्वेंट्री चेक करती है।' },
            { english: 'We start our shift at 9 AM.', meaning: 'हम सुबह 9 बजे अपनी शिफ्ट शुरू करते हैं।' }
          ],
          question: PRACTICE_QUESTIONS[0]
        },
        {
          title: 'Snippet 2: Past Actions & Yesterday',
          duration: '4 min',
          sentences: [
            { english: 'Yesterday I finished 50 orders.', meaning: 'कल मैंने 50 ऑर्डर पूरे किए।' },
            { english: 'He checked the box before dispatch.', meaning: 'उसने रवानगी से पहले बॉक्स चेक किया।' }
          ],
          question: PRACTICE_QUESTIONS[1]
        },
        {
          title: 'Snippet 3: Future Plans & Tomorrow',
          duration: '4 min',
          sentences: [
            { english: 'Tomorrow I will come early for duty.', meaning: 'कल मैं ड्यूटी पर जल्दी आऊँगा।' },
            { english: 'We will dispatch the express shipment.', meaning: 'हम एक्सप्रेस शिपमेंट भेजेंगे।' }
          ],
          question: PRACTICE_QUESTIONS[2]
        }
      ]
    },
    {
      id: 'c-2',
      title: 'Frequently Used Helping Verbs',
      category: 'Helping Verbs',
      duration: '18 min • Core Grammar',
      instructor: 'Coach Neha',
      badge: 'ESSENTIAL',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      description: 'Master auxiliary verbs (do, does, did, have, has, can, should) naturally in daily conversations.',
      subModules: [
        {
          title: 'Snippet 1: Do & Does in Questions',
          duration: '4 min',
          sentences: [
            { english: 'Do you need any help with packing?', meaning: 'क्या आपको पैकिंग में कोई मदद चाहिए?' },
            { english: 'Does he work in the evening shift?', meaning: 'क्या वह शाम की शिफ्ट में काम करता है?' }
          ],
          question: PRACTICE_QUESTIONS[1]
        },
        {
          title: 'Snippet 2: Did & Have for Completion',
          duration: '5 min',
          sentences: [
            { english: 'Did you check the delivery receipt?', meaning: 'क्या आपने डिलीवरी रसीद चेक की?' },
            { english: 'I have completed my assigned task.', meaning: 'मैंने अपना सौंपा गया काम पूरा कर लिया है।' }
          ],
          question: PRACTICE_QUESTIONS[2]
        }
      ]
    },
    {
      id: 'c-3',
      title: 'Office & Workplace Communication',
      category: 'Office',
      duration: '20 min • Professional',
      instructor: 'Coach Neha',
      badge: 'WORK',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      description: 'Talk to supervisors, report damaged inventory, and handle shipments with confidence.',
      subModules: [
        {
          title: 'Snippet 1: Reporting to Supervisor',
          duration: '5 min',
          sentences: [
            { english: 'Sir, I have finished all pending orders.', meaning: 'सर, मैंने सभी पेंडिंग ऑर्डर पूरे कर दिए हैं।' },
            { emoji: '📋', english: 'Can you please verify this invoice?', meaning: 'क्या आप कृपया इस इनवॉइस को सत्यापित कर सकते हैं?' }
          ] as any,
          question: PRACTICE_QUESTIONS[3]
        }
      ]
    },
    {
      id: 'c-4',
      title: 'Daily Routine English',
      category: 'Daily',
      duration: '15 min • Practical',
      instructor: 'Coach Neha',
      badge: 'NEW',
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
      description: 'Practice describing your morning routine, commute, meals, and evening relaxation.',
      subModules: [
        {
          title: 'Snippet 1: Morning & Commute',
          duration: '4 min',
          sentences: [
            { english: 'I woke up at 6 AM and had tea.', meaning: 'मैं सुबह 6 बजे उठा और चाय पी।' },
            { english: 'I took the bus to reach work on time.', meaning: 'मैं समय पर काम पर पहुँचने के लिए बस से गया।' }
          ],
          question: PRACTICE_QUESTIONS[1]
        }
      ]
    },
    {
      id: 'c-5',
      title: 'Friends & Social Chat',
      category: 'Friends',
      duration: '15 min • Casual',
      instructor: 'Coach Neha',
      badge: 'SOCIAL',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      description: 'Discuss weekend plans, share news, and chat easily with friends and colleagues.',
      subModules: [
        {
          title: 'Snippet 1: Catching Up & Weekend',
          duration: '4 min',
          sentences: [
            { english: 'How are you doing today?', meaning: 'आज आप कैसे हैं?' },
            { english: 'Let us grab evening tea together.', meaning: 'चलो साथ में शाम की चाय पीते हैं।' }
          ],
          question: PRACTICE_QUESTIONS[0]
        }
      ]
    },
    {
      id: 'c-6',
      title: '10,000 Everyday English Patterns',
      category: 'Patterns',
      duration: '25 min • Pattern Masterclass',
      instructor: 'Coach Neha',
      badge: 'PATTERNS',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      description: 'Master core sentence structures and grammatical patterns used across daily work, commuting, and social interactions.',
      subModules: [
        {
          title: 'Snippet 1: Daily Routine & Time Structure',
          duration: '5 min',
          sentences: [
            { english: 'Every morning I wake up at 6 AM and prepare for work.', meaning: 'हर सुबह मैं सुबह 6 बजे उठता हूँ और काम के लिए तैयार होता हूँ।' },
            { english: 'After that, I take the bus to reach my workplace.', meaning: 'उसके बाद, मैं अपने कार्यस्थल पर पहुँचने के लिए बस लेता हूँ।' }
          ],
          question: PRACTICE_QUESTIONS[0]
        },
        {
          title: 'Snippet 2: Problem Solving & Assistance',
          duration: '5 min',
          sentences: [
            { english: 'Can you please check this inventory report?', meaning: 'क्या आप कृपया इस इन्वेंट्री रिपोर्ट को देख सकते हैं?' },
            { english: 'I will finish the pending dispatch right now.', meaning: 'मैं अभी पेंडिंग रवानगी पूरी कर दूंगा।' }
          ],
          question: PRACTICE_QUESTIONS[1]
        }
      ]
    },
  ];

  useEffect(() => {
    stopSpeaking();
    if (!activeSubModule) {
      playFixedAudio('B_byte_learning_hub.mp3');
    }

    return () => {
      stopSpeaking();
    };
  }, [activeSubModule]);

  const filteredModules = selectedCategory 
    ? courseModules.filter(m => m.category === selectedCategory)
    : courseModules;

  const handleStartSubModule = (sub: SubModule) => {
    setActiveSubModule(sub);
    setLessonStep('how_to_use');
    setCardIndex(0);
    setPracticeStep(0);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
  };

  if (activeSubModule && lessonStep !== 'hub') {
    return (
      <div className="min-h-screen bg-[#000000] text-white pb-32 pt-6 px-4 font-sans select-none max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (lessonStep === 'how_to_use') setActiveSubModule(null);
              else setLessonStep('how_to_use');
            }}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">SkillGo Snippet Lesson</span>
            <h2 className="text-sm font-bold text-white truncate max-w-[200px]">{activeSubModule.title}</h2>
          </div>
          <AudioMuteButton size="sm" variant="glass" />
        </div>

        {lessonStep === 'how_to_use' && (
          <div className="space-y-6">
            <div className="bg-[#18191E] rounded-3xl p-6 border border-zinc-800 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-3 right-3 text-xs font-bold text-zinc-500">
                Sentence {cardIndex + 1} of {activeSubModule.sentences.length}
              </div>

              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8" />
              </div>

              <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2">Learn Sentence Snippet</p>
              
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                "{activeSubModule.sentences[cardIndex].english}"
              </h3>
              
              <p className="text-sm text-zinc-400 font-medium bg-zinc-900/80 py-2 px-4 rounded-xl inline-block border border-zinc-800/60 mb-6">
                💡 {activeSubModule.sentences[cardIndex].meaning}
              </p>

              <div className="flex items-center justify-center gap-3 mb-6">
                <button 
                  onClick={() => {
                    speakText(activeSubModule.sentences[cardIndex].english, 'en-IN', 0.92);
                  }}
                  className="px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-white text-xs font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all cursor-pointer shadow"
                >
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span>Listen Audio</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (cardIndex < activeSubModule.sentences.length - 1) {
                    setCardIndex(cardIndex + 1);
                  } else {
                    setLessonStep('practice');
                    setPracticeStep(0);
                  }
                }}
                className="w-full py-4 rounded-2xl bg-[#ccff00] text-black text-sm font-black hover:bg-[#b8f500] transition-all shadow-lg cursor-pointer"
              >
                {cardIndex < activeSubModule.sentences.length - 1 ? 'Next Sentence →' : 'Start Snippet Practice →'}
              </button>
            </div>
          </div>
        )}

        {lessonStep === 'practice' && (
          <div className="space-y-6">
            <div className="bg-[#18191E] rounded-3xl p-6 border border-zinc-800 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Practice Drill {practiceStep + 1} of 3</span>
                <span className="text-xs text-zinc-400">Interactive Snippet</span>
              </div>

              {practiceStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2">Choose correct verb:</h3>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-xl font-bold">
                    "I <span className="text-cyan-400 underline">___</span> in the warehouse."
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {['work', 'working', 'worked'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedOption(opt);
                          setIsAnswerCorrect(opt === 'work');
                        }}
                        className={`py-3 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                          selectedOption === opt 
                            ? opt === 'work' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {practiceStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2">Complete sentence:</h3>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-lg font-bold">
                    "Yesterday I <span className="text-cyan-400 underline">______</span> orders."
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {['finished', 'finish', 'finishing'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedOption(opt);
                          setIsAnswerCorrect(opt === 'finished');
                        }}
                        className={`py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedOption === opt 
                            ? opt === 'finished' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {practiceStep === 2 && (
                <div className="space-y-4 text-center">
                  <h3 className="text-lg font-bold text-white mb-2">Voice Pronunciation Check</h3>
                  <p className="text-xs text-zinc-400">Say this snippet out loud:</p>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-lg font-bold text-cyan-400">
                    "I am ready for the shift."
                  </div>
                  <button
                    onClick={() => {
                      setIsAnswerCorrect(true);
                      setSelectedOption('spoken');
                    }}
                    className={`w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                      selectedOption === 'spoken' ? 'bg-emerald-600 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    <Mic className="w-5 h-5 animate-pulse" />
                    <span>{selectedOption === 'spoken' ? '✓ Spoken Successfully!' : 'Tap to Speak'}</span>
                  </button>
                </div>
              )}

              {isAnswerCorrect && (
                <div className="mt-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>✓ Correct! Great job.</span>
                </div>
              )}

              <div className="mt-6">
                <button
                  disabled={!selectedOption}
                  onClick={() => {
                    if (practiceStep < 2) {
                      setPracticeStep(practiceStep + 1);
                      setSelectedOption(null);
                      setIsAnswerCorrect(null);
                    } else {
                      setLessonStep('completed');
                    }
                  }}
                  className={`w-full py-4 rounded-2xl text-sm font-black transition-all shadow-lg ${
                    selectedOption 
                      ? 'bg-[#ccff00] text-black hover:bg-[#b8f500] cursor-pointer' 
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  {practiceStep < 2 ? 'Next Practice →' : 'Complete Snippet →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {lessonStep === 'completed' && (
          <div className="space-y-6 text-center">
            <div className="bg-[#18191E] rounded-3xl p-8 border border-zinc-800 shadow-2xl space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">🎉 SNIPPET MASTERED!</span>
                <h2 className="text-2xl font-black text-white mt-1">You completed this learning card</h2>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setActiveSubModule(null)}
                  className="w-full py-4 rounded-2xl bg-[#ccff00] text-black text-sm font-black hover:bg-[#b8f500] transition-all shadow-lg cursor-pointer"
                >
                  Back to Hub →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeProgram) {
    return (
      <div className="min-h-screen bg-[#000000] text-white pb-36 font-sans select-none relative">
        <div className="relative h-80 w-full overflow-hidden">
          <img 
            src={activeProgram.image} 
            alt={activeProgram.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-black/40 to-black/60" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <button
              onClick={() => setActiveProgram(null)}
              className="w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-zinc-800 transition-colors shadow-lg cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20">
            <p className="text-xs font-bold text-rose-400 tracking-wider uppercase mb-1">SkillGo Snippet Module</p>
            <h1 className="text-2xl font-black text-white tracking-tight">{activeProgram.title}</h1>
          </div>
        </div>

        <div className="px-5 mt-4 space-y-4 max-w-xl mx-auto">
          <div>
            <h2 className="text-sm font-bold text-zinc-300">{activeProgram.instructor}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{activeProgram.duration} • Core Snippet Focus</p>
          </div>

          <div className="pt-2">
            <h3 className="text-lg font-black text-white mb-3">Snippet Learning Units</h3>
            <div className="space-y-3">
              {activeProgram.subModules.map((sub, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleStartSubModule(sub)}
                  className="bg-[#18191E] rounded-2xl p-4 border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-rose-400 flex items-center justify-center font-bold text-sm border border-rose-500/30">
                      S{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">{sub.title}</h4>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {sub.duration} • Learn → Practice
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-[#ccff00] group-hover:text-black transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white pb-36 pt-4 px-4 font-sans select-none">
      <header className="mb-6 px-2 flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <span className="text-rose-500">SkillGo</span>
          <span className="text-white">Hub</span>
        </h1>
        <AudioMuteButton size="sm" variant="glass" />
      </header>

      <div className="space-y-6 max-w-xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === null
                ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.5)]'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            All Snippets
          </button>
          {['Tenses', 'Helping Verbs', 'Office', 'Daily', 'Friends', 'Patterns'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.5)]'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">Tenses, Helping Verbs & Topics</h2>
            <span className="text-xs text-zinc-400 font-semibold">{filteredModules.length} Cards</span>
          </div>

          {filteredModules.map((module) => (
            <div
              key={module.id}
              onClick={() => setActiveProgram(module)}
              className="bg-[#18191E] rounded-3xl overflow-hidden border border-zinc-800/80 shadow-xl group cursor-pointer hover:border-zinc-700 transition-all flex flex-col"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={module.image} 
                  alt={module.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black tracking-wider uppercase shadow">
                  {module.badge}
                </span>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">{module.category}</span>
                    <h3 className="text-lg font-bold text-white drop-shadow mt-0.5">{module.title}</h3>
                    <p className="text-xs text-zinc-300 mt-0.5">{module.duration} • {module.instructor}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-rose-600 transition-colors shadow-lg">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-[#18191E]">
                <p className="text-xs text-zinc-400 leading-relaxed">{module.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

