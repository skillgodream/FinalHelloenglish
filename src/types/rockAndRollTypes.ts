import React from 'react';

export interface RockAndRollSession {
  id: string;
  situationTitle: string;
  score: number;
  isResolved: boolean;
  situationHandling: number; // 0-100
  englishGrammar: number; // 0-100
  customerResponse: 'Happy' | 'Neutral' | 'Unhappy';
  timestamp: number;
}
