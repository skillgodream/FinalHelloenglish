import React, { useState } from 'react';
import { DrillTarget, DrillScoreSummary } from '../types/drillTypes';
import { DrillEngineView } from '../components/drills/DrillEngineView';
import { DrillSessionSummary } from '../components/drills/DrillSessionSummary';
import { Question } from '../types';

interface DrillViewProps {
  // Receives the existing target exactly as provided by the system
  existingQuestion?: Question | null;
  dayNumber?: number;
  onExit: () => void;
  onCompleted?: (scores: DrillScoreSummary) => void;
}

export const DrillView: React.FC<DrillViewProps> = ({
  existingQuestion,
  dayNumber = 1,
  onExit,
  onCompleted,
}) => {
  // Convert existing system target question to structured DrillTarget without altering target-selection logic
  const target: DrillTarget = {
    id: existingQuestion?.id || `drill_day_${dayNumber}`,
    title: existingQuestion?.categoryLabel || existingQuestion?.questionEn || "Today's Core English Pattern",
    description: existingQuestion?.questionEn || existingQuestion?.hintEn || "Practice speaking accurately in practical workplace and daily situations.",
    category: existingQuestion?.category || 'workplace',
    keyRuleOrTip: existingQuestion?.hintEn || undefined,
    exampleTarget: existingQuestion?.samplePhrases?.[0] || undefined,
  };

  const [step, setStep] = useState<'DRILL' | 'SUMMARY'>('DRILL');
  const [sessionScores, setSessionScores] = useState<DrillScoreSummary | null>(null);

  const handleFinishDrill = (scores: DrillScoreSummary) => {
    setSessionScores(scores);
    setStep('SUMMARY');
    if (onCompleted) {
      onCompleted(scores);
    }
  };

  const handleRetry = () => {
    setSessionScores(null);
    setStep('DRILL');
  };

  if (step === 'SUMMARY' && sessionScores) {
    return (
      <DrillSessionSummary
        target={target}
        scores={sessionScores}
        onContinue={onExit}
        onRetryDrill={handleRetry}
      />
    );
  }

  return (
    <DrillEngineView
      target={target}
      dayNumber={dayNumber}
      onFinishSession={handleFinishDrill}
      onExit={onExit}
    />
  );
};
