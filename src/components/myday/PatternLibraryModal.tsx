import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  SpellCheck,
  Brain,
  MessageSquareShare,
  CheckCircle2,
  BookmarkCheck,
  HelpCircle,
  Ear,
  Compass,
  Zap,
} from 'lucide-react';
import {
  SHEEKO_PIPELINE_STAGES,
  meaningIntentRecords,
  vocabGrammarRecords,
  timeSequenceRecords,
  rephraseTemplateRecords,
  referencePatternRecords,
  fetchReferencePatternsFromApi,
  PipelineStage,
  ReferencePatternRecord,
} from '../../data/sheekoLibrary';

interface PatternLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPattern: (patternText: string) => void;
}

type TabType = 'PIPELINE' | 'PATTERNS' | 'MEANING_INTENT' | 'VOCAB_GRAMMAR' | 'TIME_SEQUENCE' | 'REPHRASE_TEMPLATES';

export const PatternLibraryModal: React.FC<PatternLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPattern,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('PIPELINE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(SHEEKO_PIPELINE_STAGES[0]);
  const [serverRefPatterns, setServerRefPatterns] = useState<ReferencePatternRecord[]>([]);
  const [totalRefPatternsCount, setTotalRefPatternsCount] = useState<number>(10000);

  // Live async query for 10,000 patterns with debounce
  useEffect(() => {
    if (activeTab !== 'PATTERNS') return;
    let isCancelled = false;

    const timer = setTimeout(() => {
      fetchReferencePatternsFromApi(searchQuery, selectedCategory, 40)
        .then((res) => {
          if (!isCancelled) {
            setServerRefPatterns(res.records);
            if (res.totalCount) setTotalRefPatternsCount(res.totalCount);
          }
        })
        .catch(() => {
          // Keep local fallback
        });
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [activeTab, searchQuery, selectedCategory]);

  // Meaning & Intent filtering
  const filteredMeaning = useMemo(() => {
    let list = meaningIntentRecords;
    if (selectedCategory !== 'All') {
      list = list.filter((r) => r.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.meaning?.toLowerCase().includes(q) ||
          r.patternKey?.toLowerCase().includes(q) ||
          r.intent?.toLowerCase().includes(q)
      );
    }
    return list.slice(0, 50);
  }, [searchQuery, selectedCategory]);

  // Vocab & Grammar filtering
  const filteredVocab = useMemo(() => {
    let list = vocabGrammarRecords;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.inputPattern?.toLowerCase().includes(q) ||
          r.correctForm?.toLowerCase().includes(q) ||
          r.correctionType?.toLowerCase().includes(q)
      );
    }
    return list.slice(0, 50);
  }, [searchQuery]);

  // Time & Sequence filtering
  const filteredTime = useMemo(() => {
    let list = timeSequenceRecords;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.pattern?.toLowerCase().includes(q) ||
          r.meaning?.toLowerCase().includes(q) ||
          r.type?.toLowerCase().includes(q)
      );
    }
    return list.slice(0, 50);
  }, [searchQuery]);

  // Rephrase Templates filtering
  const filteredRephrase = useMemo(() => {
    let list = rephraseTemplateRecords;
    if (selectedCategory !== 'All') {
      list = list.filter((r) => r.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.matchedMeaning?.toLowerCase().includes(q) ||
          r.rephraseTemplate?.toLowerCase().includes(q) ||
          r.rephraseMeaning?.toLowerCase().includes(q)
      );
    }
    return list.slice(0, 40);
  }, [searchQuery, selectedCategory]);

  // Reference Patterns filtering (Uses server query when available, fallback to curated records)
  const filteredRefPatterns = useMemo(() => {
    if (serverRefPatterns.length > 0) {
      return serverRefPatterns;
    }
    let list = referencePatternRecords;
    if (selectedCategory !== 'All') {
      list = list.filter((r) => r.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.sentence?.toLowerCase().includes(q) ||
          r.normalizedMeaning?.toLowerCase().includes(q)
      );
    }
    return list.slice(0, 40);
  }, [serverRefPatterns, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col text-zinc-100 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-amber-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">My Day Conversation & Pattern Engine</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Official Libraries
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  LISTEN → UNDERSTAND → CAPTURE → CONNECT → REPHRASE → PROBE → REMEMBER → CONTINUE
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-zinc-800/80 shrink-0 scrollbar-none">
            <button
              onClick={() => { setActiveTab('PIPELINE'); setSelectedCategory('All'); }}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PIPELINE'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>8-Stage Pipeline</span>
            </button>

            <button
              onClick={() => { setActiveTab('PATTERNS'); setSelectedCategory('All'); }}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PATTERNS'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reference Patterns</span>
              <span className="text-[10px] opacity-75">({totalRefPatternsCount.toLocaleString()})</span>
            </button>

            <button
              onClick={() => { setActiveTab('MEANING_INTENT'); setSelectedCategory('All'); }}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'MEANING_INTENT'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Meaning / Intent</span>
              <span className="text-[10px] opacity-75">({meaningIntentRecords.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('VOCAB_GRAMMAR'); setSelectedCategory('All'); }}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'VOCAB_GRAMMAR'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <SpellCheck className="w-3.5 h-3.5" />
              <span>Vocabulary & Grammar</span>
              <span className="text-[10px] opacity-75">({vocabGrammarRecords.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('TIME_SEQUENCE'); setSelectedCategory('All'); }}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'TIME_SEQUENCE'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Time & Sequence</span>
              <span className="text-[10px] opacity-75">({timeSequenceRecords.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('REPHRASE_TEMPLATES'); setSelectedCategory('All'); }}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'REPHRASE_TEMPLATES'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <MessageSquareShare className="w-3.5 h-3.5" />
              <span>Rephrase Templates</span>
              <span className="text-[10px] opacity-75">({rephraseTemplateRecords.length}+)</span>
            </button>
          </div>

          {/* Search & Category Filter (for non-pipeline tabs) */}
          {activeTab !== 'PIPELINE' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 my-3 shrink-0">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab.replace('_', ' ').toLowerCase()}...`}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {(activeTab === 'MEANING_INTENT' || activeTab === 'REPHRASE_TEMPLATES' || activeTab === 'PATTERNS') && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {['All', 'DAILY', 'WORK', 'FRIENDS'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-zinc-800 text-white border-amber-500/50'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Main Tab Content */}
          <div className="flex-1 overflow-y-auto pr-1 mt-1">
            {/* TAB 1: 8-STAGE PIPELINE */}
            {activeTab === 'PIPELINE' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
                {/* Left Pipeline Steps List */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">
                    8 Operational Pipeline Stages
                  </div>
                  {SHEEKO_PIPELINE_STAGES.map((stage, idx) => (
                    <button
                      key={stage.id}
                      onClick={() => setSelectedStage(stage)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedStage.id === stage.id
                          ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                          selectedStage.id === stage.id ? 'bg-amber-500 text-zinc-950 font-extrabold' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{stage.name}</div>
                          <div className="text-[10px] text-zinc-400 line-clamp-1">{stage.tagline}</div>
                        </div>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform ${selectedStage.id === stage.id ? 'text-amber-400 translate-x-0.5' : 'text-zinc-600'}`} />
                    </button>
                  ))}
                </div>

                {/* Right Stage Inspector */}
                <div className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                          Stage {selectedStage.id}
                        </span>
                        <h4 className="text-base font-extrabold text-white mt-1">{selectedStage.name} — {selectedStage.tagline}</h4>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                        {selectedStage.description}
                      </p>
                      <p className="text-xs text-amber-300/90 font-hindi bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
                        {selectedStage.hindiDescription}
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        Operational Rules & Constraints
                      </div>
                      <div className="space-y-2">
                        {selectedStage.rules.map((rule, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 text-xs text-zinc-300 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800 mt-4 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Enforced across all Sheeko turns</span>
                    <span className="font-bold text-amber-400">Deterministic + Gemini Grounded</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REFERENCE PATTERNS */}
            {activeTab === 'PATTERNS' && (
              <div className="space-y-2.5">
                {filteredRefPatterns.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 text-xs">No reference patterns found.</div>
                ) : (
                  filteredRefPatterns.map((pat) => (
                    <div
                      key={pat.id}
                      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {pat.category}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">{pat.id}</span>
                        </div>
                        <button
                          onClick={() => {
                            onSelectPattern(pat.sentence);
                            onClose();
                          }}
                          className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors"
                        >
                          <span>Practice in My Day</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-1 mt-2">
                        <p className="text-xs text-zinc-100 font-medium">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1.5">Pattern Sentence:</span>
                          “{pat.sentence}”
                        </p>
                        <p className="text-xs text-emerald-300/90 font-medium">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1.5">Normalized Meaning:</span>
                          {pat.normalizedMeaning}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: MEANING / INTENT LIBRARY */}
            {activeTab === 'MEANING_INTENT' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {filteredMeaning.length === 0 ? (
                  <div className="col-span-2 text-center py-10 text-zinc-500 text-xs">No meaning/intent records found.</div>
                ) : (
                  filteredMeaning.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 flex flex-col justify-between hover:border-amber-500/30 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {rec.category}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500">{rec.id}</span>
                        </div>
                        <h5 className="text-xs font-bold text-white capitalize">{rec.patternKey.replace('_', ' ')}</h5>
                        <p className="text-xs text-zinc-300 mt-1">{rec.meaning}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                        <span className="text-amber-400 font-mono font-bold">{rec.intent}</span>
                        <span className="text-zinc-500">Confidence {rec.confidence || 0.9}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: VOCABULARY & GRAMMAR CORRECTION */}
            {activeTab === 'VOCAB_GRAMMAR' && (
              <div className="space-y-2">
                {filteredVocab.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 text-xs">No vocabulary records found.</div>
                ) : (
                  filteredVocab.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-emerald-500/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {rec.correctionType}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500">{rec.id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-rose-300 font-medium line-through decoration-rose-500/50">“{rec.inputPattern}”</span>
                          <ArrowRight className="w-3 h-3 text-zinc-500" />
                          <span className="text-emerald-300 font-bold">“{rec.correctForm}”</span>
                        </div>
                      </div>

                      {rec.usageNote && (
                        <span className="text-[10px] text-zinc-400 sm:max-w-xs text-right italic">
                          {rec.usageNote}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 5: TIME & SEQUENCE */}
            {activeTab === 'TIME_SEQUENCE' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {filteredTime.length === 0 ? (
                  <div className="col-span-3 text-center py-10 text-zinc-500 text-xs">No time markers found.</div>
                ) : (
                  filteredTime.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 hover:border-amber-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {rec.type}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500">{rec.id}</span>
                      </div>
                      <h5 className="text-xs font-bold text-white mt-1">“{rec.pattern}”</h5>
                      <p className="text-[11px] text-zinc-300 mt-1">{rec.meaning}</p>
                      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
                        Normalized: {rec.normalizedValue}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 6: REPHRASE TEMPLATES */}
            {activeTab === 'REPHRASE_TEMPLATES' && (
              <div className="space-y-2.5">
                {filteredRephrase.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 text-xs">No rephrase templates found.</div>
                ) : (
                  filteredRephrase.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 hover:border-blue-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {rec.category}
                          </span>
                          <span className="text-xs font-bold text-zinc-200 capitalize">
                            {rec.matchedMeaning}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500">{rec.id}</span>
                      </div>

                      <div className="space-y-1.5 mt-2">
                        <p className="text-xs text-blue-300 font-semibold bg-blue-950/20 p-2.5 rounded-xl border border-blue-500/20">
                          <span className="text-[10px] text-zinc-400 uppercase font-bold mr-1.5 block sm:inline">Template Mirror:</span>
                          “{rec.rephraseTemplate}”
                        </p>
                        <p className="text-xs text-zinc-300">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1.5">Underlying Meaning:</span>
                          “{rec.rephraseMeaning}”
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
