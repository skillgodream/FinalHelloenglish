import request from 'supertest';
import { app } from '../server'; // Path to your express/API app
import * as geminiService from '../services/geminiService';
import * as llamaService from '../services/llamaService';
import * as sheekoEngine from '../services/sheekoEngine';

describe('Hello English — Conversation Core Resilience Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ==========================================
  // 1. CASCADE & CIRCUIT BREAKER TESTS
  // ==========================================
  describe('API Cascade & Circuit Breakers', () => {
    it('should degrade to Gemini when Groq returns an error or quota exhaustion', async () => {
      // Mock Groq failure
      jest.spyOn(llamaService, 'generateResponse').mockRejectedValue(new Error('Quota Exhausted'));
      
      // Mock Gemini success
      const geminiSpy = jest.spyOn(geminiService, 'generateResponse').mockResolvedValue({
        naturalResponse: 'Achha, samajh gaya.',
        englishModel: 'I understood.',
        awaitingEnglishRetry: false
      });

      const res = await request(app)
        .post('/api/buddy-chat')
        .send({ message: 'I am learning English' });

      expect(res.status).toBe(200);
      expect(geminiSpy).toHaveBeenCalled();
      expect(res.body.englishModel).toBe('I understood.');
    });

    it('should degrade completely to Local Sheeko Engine when all cloud LLMs fail', async () => {
      // Mock both cloud providers failing
      jest.spyOn(llamaService, 'generateResponse').mockRejectedValue(new Error('Groq Down'));
      jest.spyOn(geminiService, 'generateResponse').mockRejectedValue(new Error('Gemini Down'));
      
      // Spy on local deterministic backup
      const sheekoParseSpy = jest.spyOn(sheekoEngine, 'parseLearnerStoryToMeaningRepresentation');
      const sheekoSynthSpy = jest.spyOn(sheekoEngine, 'synthesizeNaturalEnglishStory')
        .mockReturnValue('Yesterday I went to the market and bought vegetables.');

      const res = await request(app)
        .post('/api/buddy-chat')
        .send({ message: 'yesterday I go market and buy vegetable' });

      expect(res.status).toBe(200);
      expect(sheekoParseSpy).toHaveBeenCalledWith('yesterday I go market and buy vegetable');
      expect(sheekoSynthSpy).toHaveBeenCalled();
      // Verifies that a real dynamic fallback happens, not a canned generic string
      expect(res.body.englishModel).toContain('market');
      expect(res.body.englishModel).not.toBe('I want to share my thoughts.'); 
    });

    it('should trip the circuit breaker and enforce a timeout under 5000ms', async () => {
      // Simulate an un-responsive Groq API hanging indefinitely
      jest.spyOn(llamaService, 'generateResponse').mockImplementation(() => {
        return new Promise((resolve) => setTimeout(resolve, 10000)); // Hangs for 10s
      });

      jest.spyOn(geminiService, 'generateResponse').mockResolvedValue({
        naturalResponse: 'Fallback working',
        englishModel: 'Saved by Gemini',
        awaitingEnglishRetry: false
      });

      const responsePromise = request(app)
        .post('/api/buddy-chat')
        .send({ message: 'Hello Buddy' });

      // Fast-forward past the 5000ms timeout threshold
      jest.advanceTimersByTime(5100);

      const res = await responsePromise;
      expect(res.status).toBe(200);
      expect(res.body.englishModel).toBe('Saved by Gemini');
    });
  });

  // ==========================================
  // 2. SERVER-SIDE STOP & WAIT ENFORCEMENT
  // ==========================================
  describe('Server-Side "Stop & Wait" Rules', () => {
    it('should force nextQuestion to empty when learner uses Hinglish/Hindi', async () => {
      jest.spyOn(llamaService, 'generateResponse').mockResolvedValue({
        naturalResponse: 'Bahut achha! Ab ise English mein bolo.',
        englishModel: 'My father paid the electricity bill.',
        awaitingEnglishRetry: true // Triggers the rule lock
      });

      const res = await request(app)
        .post('/api/buddy-chat')
        .send({ message: 'Papa ne bill pay kiya' });

      expect(res.status).toBe(200);
      expect(res.body.awaitingEnglishRetry).toBe(true);
      // CRITICAL SECURITY ASSERTION: Server must blank out the next question
      expect(res.body.nextQuestion).toBe('');
    });
  });

  // ==========================================
  // 3. FACT PRESERVATION & HEALTH TESTS
  // ==========================================
  describe('Fact Preservation & System Diagnostics', () => {
    it('should verify /health endpoint returns 200 even when cloud dependencies are down', async () => {
      // Set providers to un-healthy states
      jest.spyOn(llamaService, 'getProviderHealth').mockReturnValue(false);

      const res = await request(app).get('/health');
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('alive');
      expect(res.body.process).toBe('healthy');
    });
  });
});
