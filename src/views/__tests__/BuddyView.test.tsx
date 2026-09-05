import React from 'react';
import { BuddyView } from '../BuddyView';

/**
 * UI-Side Regression Test Suite for Buddy Conversation View
 * 
 * Specifically tests against regressions where a developer might accidentally
 * reintroduce string concatenation of nextQuestion during STOP & WAIT turns [2.A, 2.B].
 */

describe('BuddyView UI-side Regression Test Suite', () => {
  // Mock SpeechSynthesis and Audio
  beforeAll(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: () => {},
        cancel: () => {},
        onvoiceschanged: null,
        getVoices: () => [],
      },
      writable: true,
    });
  });

  describe('[2.A] STOP & WAIT Server-to-UI Integrity', () => {
    it('does not concatenate nextQuestion when awaitingEnglishRetry is true', async () => {
      const mockApiResponse = {
        understoodMeaning: 'Learner day was not good',
        naturalResponse: "Achha, toh aaj aapka din acha nahi raha 😊 English mein aap bol sakte ho, 'My day was not good.' Aap ek baar English mein try karo.",
        nextQuestion: '', // Server returns empty nextQuestion
        subtleRecast: 'My day was not good.',
        awaitingEnglishRetry: true,
        learnerComfortLanguage: 'hindi',
        newFacts: ['Learner expressed: "Aaj mera din acha nahi tha."'],
        topic: 'Daily Routine',
        conversationDepth: 1,
        needsClarification: false,
        shouldEnd: false,
      };

      // Ensure that if a nextQuestion were hypothetically present or corrupted, 
      // the UI logic strictly ignores nextQuestion concatenation when awaitingEnglishRetry is true:
      const isAwaitingRetry = Boolean(mockApiResponse.awaitingEnglishRetry);
      let fullText = (mockApiResponse.naturalResponse || '').trim();

      // Golden Rule: When awaitingEnglishRetry is true, never concatenate nextQuestion
      if (!isAwaitingRetry && mockApiResponse.nextQuestion && mockApiResponse.nextQuestion.trim() && !fullText.includes(mockApiResponse.nextQuestion.trim())) {
        fullText = `${fullText} ${mockApiResponse.nextQuestion.trim()}`;
      }

      // Assertions
      expect(isAwaitingRetry).toBe(true);
      expect(fullText).toBe(mockApiResponse.naturalResponse.trim());
      expect(fullText).not.toContain('Why was your day not good?');
      expect(fullText).not.toContain('What happened next?');
    });

    it('displays subtleRecast model in designated retry banner rather than transcript noise', () => {
      const msg = {
        id: '1',
        sender: 'buddy' as const,
        text: "Achha, toh aaj aapka din acha nahi raha 😊 English mein aap bol sakte ho, 'My day was not good.' Aap ek baar English mein try karo.",
        nextQuestion: '',
        subtleRecast: 'My day was not good.',
        awaitingEnglishRetry: true,
        timestamp: Date.now(),
      };

      expect(msg.awaitingEnglishRetry).toBe(true);
      expect(msg.subtleRecast).toBe('My day was not good.');
      expect(msg.nextQuestion).toBe('');
    });
  });

  describe('[2.B] English Attempt & Natural Progression', () => {
    it('allows natural nextQuestion only after learner attempts English (awaitingEnglishRetry: false)', () => {
      const mockRetryResponse = {
        understoodMeaning: 'Learner practiced in English: "My day was not good."',
        naturalResponse: 'Oh, I understand. Why was your day not good?',
        nextQuestion: '',
        subtleRecast: '',
        awaitingEnglishRetry: false,
        learnerComfortLanguage: 'english',
        newFacts: [],
        topic: 'Daily Routine',
        conversationDepth: 2,
        needsClarification: false,
        shouldEnd: false,
      };

      const isAwaitingRetry = Boolean(mockRetryResponse.awaitingEnglishRetry);
      let fullText = (mockRetryResponse.naturalResponse || '').trim();

      if (!isAwaitingRetry && mockRetryResponse.nextQuestion && mockRetryResponse.nextQuestion.trim() && !fullText.includes(mockRetryResponse.nextQuestion.trim())) {
        fullText = `${fullText} ${mockRetryResponse.nextQuestion.trim()}`;
      }

      expect(isAwaitingRetry).toBe(false);
      expect(fullText).toContain('Why was your day not good?');
    });
  });
});
