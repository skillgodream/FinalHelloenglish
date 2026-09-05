/**
 * Audio synthesis, speech recognition, and sound effects for English Buddy & Coach Neha
 */

// Soft UI Chimes using Web Audio API
class SoundFx {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    try {
      if (typeof window === 'undefined') return null;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch (e) {
      return null;
    }
  }

  playBubbleStart() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {
      // Audio fx ignored safely
    }
  }

  playBubblePop() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      // Audio fx ignored safely
    }
  }

  playSuccessChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.08, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } catch (e) {
      // Audio fx ignored safely
    }
  }
}

export const soundFx = new SoundFx();

// Global active audio playback element
let currentAudioElement: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let activeSpeakSessionId = 0;

/**
 * Strict male keyword blacklist to prevent robotic or male voices
 */
const STRICT_MALE_KEYWORDS = [
  'male', 'ravi', 'rishi', 'madhur', 'hemant', 'david', 'mark', 'george', 
  'guy', 'ryan', 'christopher', 'eric', 'stefan', 'pradeep', 'anand', 
  'amit', 'rahul', 'karan', 'vikram', 'suresh', 'mahesh', 'james', 'john', 
  'robert', 'michael', 'william', 'daniel', 'paul', 'charles', 'alex', 
  'fred', 'oliver', 'thomas', 'arthur', 'brian', 'richard', 'joseph', 
  'stephen', 'andrew', 'kevin', 'jason', 'justin', 'brandon'
];

/**
 * Check if a voice is a known male voice
 */
export function isDefinitiveMaleVoice(v: SpeechSynthesisVoice): boolean {
  const name = (v.name || '').toLowerCase();
  const uri = (v.voiceURI || '').toLowerCase();
  if (name.includes('female') || uri.includes('female')) return false;
  return STRICT_MALE_KEYWORDS.some((kw) => name.includes(kw) || uri.includes(kw));
}

/**
 * Voice Preference Persistence Hooks
 */
export function getPreferredVoice(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('buddy_voice_preference') || 'ritu';
  }
  return 'ritu';
}

export function setPreferredVoice(voiceName: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('buddy_voice_preference', voiceName);
  }
}

const AUDIO_MUTED_KEY = 'app_audio_muted';
let isMutedState = typeof window !== 'undefined' ? localStorage.getItem(AUDIO_MUTED_KEY) === 'true' : false;

export function isAudioMuted(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUDIO_MUTED_KEY) === 'true';
  }
  return isMutedState;
}

export function setAudioMuted(muted: boolean): void {
  isMutedState = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUDIO_MUTED_KEY, muted ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('app_audio_mute_change', { detail: { muted } }));
  }
  if (muted) {
    stopSpeaking();
  }
}

export function toggleAudioMute(): boolean {
  const next = !isAudioMuted();
  setAudioMuted(next);
  return next;
}

/**
 * Female voice preference selector for browser fallback
 */
export function getBestFemaleVoice(
  targetLang: 'en-IN' | 'hi-IN' | 'en-US' = 'en-IN'
): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const isHindi = targetLang.startsWith('hi');
  const nonMaleVoices = voices.filter((v) => !isDefinitiveMaleVoice(v));
  const pool = nonMaleVoices.length > 0 ? nonMaleVoices : voices;

  if (isHindi) {
    const naturalHindiFemale = pool.find((v) => {
      const n = v.name.toLowerCase();
      const l = v.lang.toLowerCase();
      return (l.startsWith('hi') || n.includes('hindi')) &&
        (n.includes('swara') || n.includes('kalpana') || n.includes('lekha') || n.includes('female') || n.includes('google हिन्दी'));
    });
    if (naturalHindiFemale) return naturalHindiFemale;

    const anyHindi = pool.find(
      (v) => !isDefinitiveMaleVoice(v) && (v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'))
    );
    if (anyHindi) return anyHindi;
  }

  const indianFemale = pool.find((v) => {
    const n = v.name.toLowerCase();
    const l = v.lang.toLowerCase();
    return (l === 'en-in' || l.includes('in') || n.includes('india')) &&
      (n.includes('heera') || n.includes('neha') || n.includes('priya') || n.includes('veena') || n.includes('lekha') || n.includes('female'));
  });
  if (indianFemale) return indianFemale;

  const anyIndianNonMale = pool.find((v) => {
    const l = v.lang.toLowerCase();
    const n = v.name.toLowerCase();
    return !isDefinitiveMaleVoice(v) && (l === 'en-in' || (n.includes('india') && l.startsWith('en')));
  });
  if (anyIndianNonMale) return anyIndianNonMale;

  const topGlobalFemale = pool.find((v) => {
    const n = v.name.toLowerCase();
    return n.includes('jenny') || n.includes('aria') || n.includes('ava') || n.includes('samantha') || n.includes('zira');
  });
  if (topGlobalFemale) return topGlobalFemale;

  return pool[0] || null;
}

/**
 * Strips emojis, UI keywords, quotes, markdown formatting, and symbols
 * so the TTS engine speaks naturally like a human instead of reading code tokens aloud.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return "";
  
  // Create an explicit unicode pattern mapping standard emoji blocks completely
  const emojiRegex = /[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g;

  return text
    .replace(/[\*\#\_]/g, '') // Strip markdown formatting (bold, headers, italics)
    .replace(/(Buddy:|English:|Hindi:|Translation:|Try saying:)/gi, '') // Strip meta structural prefixes
    .replace(emojiRegex, '') // Strip visual emoticons and symbols
    .replace(/['"“”‘’]/g, '') // Strip quotes
    .replace(/:\s+/g, ', ') // Replace colon with comma for natural pause
    .replace(/[()[\]{}]/g, ' ') // Strip brackets
    .replace(/\s+/g, ' ') // Flatten duplicate whitespaces
    .trim();
}

/**
 * Primary Audio Interceptor Stop Thread
 */
export function stopSpeaking(): void {
  activeSpeakSessionId++;
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.src = "";
    } catch (_) {}
    currentAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
  activeUtterance = null;
}

/**
 * Fallback browser speech synthesis with strict female voice and warm natural pitch
 */
function fallbackBrowserSpeak(
  text: string,
  lang: 'en-IN' | 'hi-IN' | 'en-US' = 'en-IN',
  rate: number = 0.93,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis || typeof window.speechSynthesis.speak !== 'function') {
    if (onEnd) onEnd();
    return false;
  }

  try {
    if (typeof window.speechSynthesis.cancel === 'function') {
      window.speechSynthesis.cancel();
    }
  } catch (_) {}

  const isHindi = lang.startsWith('hi') || /[\u0900-\u097F]/.test(text);
  const targetLang = isHindi ? 'hi-IN' : 'en-IN';

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLang;
  utterance.rate = rate || 0.93;
  utterance.pitch = 1.05;

  const femaleVoice = getBestFemaleVoice(targetLang);
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  activeUtterance = utterance;

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    activeUtterance = null;
    if (onEnd) onEnd();
    return false;
  }
}

/**
 * Unified Core Speech Controller
 * Prioritizes Sarvam Bulbul:v3 Ritu -> Gracefully Downsamples to WebSpeech API on Failure
 */
export async function speakText(
  rawText: string,
  lang: 'en-IN' | 'hi-IN' | 'en-US' = 'en-IN',
  rate: number = 0.94,
  onEnd?: () => void,
  customSpeaker?: string
): Promise<boolean> {
  try {
    if (isAudioMuted()) {
      if (onEnd) onEnd();
      return false;
    }

    stopSpeaking();
    const sessionId = ++activeSpeakSessionId;

    const text = cleanTextForSpeech(rawText);
    if (!text || !text.trim()) {
      if (onEnd) onEnd();
      return false;
    }

    const isHindiText = /[\u0900-\u097F]/.test(text) || lang.startsWith('hi');
    const targetLang = isHindiText ? 'hi-IN' : 'en-IN';

    const speaker = customSpeaker || getPreferredVoice();

    // If user explicitly chose browser native voice, use SpeechSynthesis directly
    if (speaker === 'browser') {
      return fallbackBrowserSpeak(text, targetLang, rate, onEnd);
    }

    // Attempt 1: Sarvam Bulbul:v3 Backend TTS
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          lang: targetLang,
          speaker: speaker || 'ritu',
          pace: 0.94,
          loudness: 1.0,
        }),
      });

      if (sessionId !== activeSpeakSessionId) {
        return false;
      }

      if (res.ok) {
        const data = await res.json();
        if (sessionId !== activeSpeakSessionId) {
          return false;
        }

        const audioSource = data.audioData || (data.audioBase64 ? `data:audio/wav;base64,${data.audioBase64}` : null);
        if (audioSource && (data.success || data.audioData || data.audioBase64)) {
          if (currentAudioElement) {
            try {
              currentAudioElement.pause();
              currentAudioElement.currentTime = 0;
            } catch (_) {}
            currentAudioElement = null;
          }

          const audio = new Audio(audioSource);
          currentAudioElement = audio;
          audio.playbackRate = 1.0;

          audio.onended = () => {
            if (currentAudioElement === audio) {
              currentAudioElement = null;
            }
            if (onEnd) onEnd();
          };

          audio.onerror = () => {
            if (currentAudioElement === audio) {
              currentAudioElement = null;
            }
            fallbackBrowserSpeak(text, targetLang, rate, onEnd);
          };

          if (sessionId !== activeSpeakSessionId) {
            return false;
          }

          await audio.play();
          return true;
        }
      }
    } catch (_) {
      // Gracefully fall back to browser speech synthesis
    }

    if (sessionId !== activeSpeakSessionId) {
      return false;
    }

    // Attempt 2: Browser SpeechSynthesis Fallback
    return fallbackBrowserSpeak(text, targetLang, rate, onEnd);
  } catch (err) {
    if (onEnd) onEnd();
    return false;
  }
}

export function playFixedAudio(
  filename: string,
  onPlay?: () => void,
  onEnded?: () => void
): HTMLAudioElement | null {
  if (isAudioMuted()) {
    if (onEnded) onEnded();
    return null;
  }

  try {
    stopSpeaking();
    let cleanPath = filename.trim();
    if (cleanPath.startsWith('public/')) {
      cleanPath = cleanPath.slice(6);
    }
    if (!cleanPath.startsWith('/')) {
      cleanPath = cleanPath.startsWith('audio/fixed/') ? `/${cleanPath}` : `/audio/fixed/${cleanPath}`;
    }
    const audio = new Audio(cleanPath);
    audio.preload = 'auto';
    currentAudioElement = audio;

    audio.onplay = () => {
      if (onPlay) onPlay();
    };

    audio.onended = () => {
      if (currentAudioElement === audio) {
        currentAudioElement = null;
      }
      if (onEnded) onEnded();
    };

    audio.onerror = () => {
      if (currentAudioElement === audio) {
        currentAudioElement = null;
      }
      if (onEnded) onEnded();
    };

    audio.play().then(() => {
      if (onPlay) onPlay();
    }).catch(() => {
      if (onEnded) onEnded();
    });
    return audio;
  } catch (e) {
    if (onEnded) onEnded();
    return null;
  }
}

// Browser Speech Recognition Factory
export function createSpeechRecognizer(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void
) {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-IN'; // Optimized for Indian English accents

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    const currentText = final || interim;
    onResult(currentText, Boolean(final));
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
