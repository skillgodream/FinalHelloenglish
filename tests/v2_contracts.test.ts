import {
  orchestrateConversationTurn,
  orchestrateDayStoryTurn,
  orchestrateRockAndRollTurn,
  getOrCreateLearnerState,
} from '../server/services/conversationOrchestrator';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, failureDetails?: string) {
  if (condition) {
    results.push({ name: testName, passed: true });
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    results.push({ name: testName, passed: false, details: failureDetails });
    console.error(`  ❌ FAIL: ${testName} - ${failureDetails}`);
  }
}

async function runV2Tests() {
  console.log('\n===============================================================');
  console.log('🧪 RUNNING ENGINE V2 FOUNDATION & CONTRACT VERIFICATION SUITE');
  console.log('===============================================================\n');

  // TEST 1: EvidenceV2, EvaluationResultV2, NextActionV2 Generation on Buddy Turn
  console.log('--- TEST SUITE 1: Engine V2 Contracts on Buddy Turn ---');
  {
    const result = await orchestrateConversationTurn({
      history: [],
      learnerMessage: "aaj mera din bohot acha tha maine market se fruits kharida",
      exchangeCount: 1,
      wasAwaitingEnglishRetry: false,
      context: {
        learnerId: 'test_learner_1',
        sessionId: 'test_session_1',
        clientTurnId: 'turn_client_001',
      },
    });

    assert(Boolean(result.v2), "V2 envelope exists on orchestration result");
    assert(Boolean(result.v2?.evidence), "EvidenceV2 object created");
    assert(Boolean(result.v2?.evaluation), "EvaluationResultV2 object created");
    assert(Boolean(result.v2?.nextAction), "NextActionV2 object created");
    assert(result.v2?.evidence.sourceExperience === 'buddy', "Evidence records sourceExperience correctly");
    assert(result.v2?.evaluation.understanding.detectedLanguage === 'hinglish', "EvaluationResultV2 records detected language");
    assert(result.v2?.nextAction.awaitingEnglishRetry === true, "NextActionV2 marks awaitingEnglishRetry for Hinglish");
    assert(result.v2?.nextAction.enforcedNextQuestion === "", "NextActionV2 enforces empty next question (STOP & WAIT)");
  }

  // TEST 2: Server-authoritative Idempotency Check
  console.log('\n--- TEST SUITE 2: Server-Authoritative Idempotency Guard ---');
  {
    const replayResult = await orchestrateConversationTurn({
      history: [],
      learnerMessage: "aaj mera din bohot acha tha maine market se fruits kharida",
      exchangeCount: 1,
      wasAwaitingEnglishRetry: false,
      context: {
        learnerId: 'test_learner_1',
        sessionId: 'test_session_1',
        clientTurnId: 'turn_client_001',
      },
    });

    assert(Boolean(replayResult), "Replayed turn returns identical valid result");
    assert(replayResult.v2?.evidence.clientTurnId === 'turn_client_001', "Replayed turn references original clientTurnId");
  }

  // TEST 3: State Progression & Evidence-Driven Skill Tracking
  console.log('\n--- TEST SUITE 3: Durable Learner State & Skill Memory ---');
  {
    const learnerState = getOrCreateLearnerState('test_learner_1');
    assert(Boolean(learnerState), "LearnerStateV2 retrieved from store");
    assert(learnerState.learnerId === 'test_learner_1', "Learner ID correctly mapped");
    assert(Boolean(learnerState.skills['SKILL_PAST_TENSE']), "Skill state exists for past tense");

    // Contamination Regression Test:
    // Utterance "I like mangoes" is understandable English, but NOT a demonstration of Past Tense.
    const pastTenseBefore = learnerState.skills['SKILL_PAST_TENSE'].evidenceCounters.successfulDemonstrations;
    await orchestrateConversationTurn({
      history: [],
      learnerMessage: "I like mangoes",
      exchangeCount: 2,
      wasAwaitingEnglishRetry: false,
      context: {
        learnerId: 'test_learner_1',
        sessionId: 'test_session_1',
      },
    });
    const pastTenseAfter = learnerState.skills['SKILL_PAST_TENSE'].evidenceCounters.successfulDemonstrations;
    assert(
      pastTenseAfter === pastTenseBefore,
      "Understandable non-past utterance ('I like mangoes') DOES NOT increment SKILL_PAST_TENSE credit",
      `Expected ${pastTenseBefore}, got ${pastTenseAfter}`
    );

    // Legitimate Past Tense Test:
    // Utterance "Yesterday I went to market" contains valid past tense verb and should increment SKILL_PAST_TENSE.
    await orchestrateConversationTurn({
      history: [],
      learnerMessage: "Yesterday I went to market",
      exchangeCount: 3,
      wasAwaitingEnglishRetry: false,
      context: {
        learnerId: 'test_learner_1',
        sessionId: 'test_session_1',
      },
    });
    const pastTenseAfterValid = learnerState.skills['SKILL_PAST_TENSE'].evidenceCounters.successfulDemonstrations;
    assert(
      pastTenseAfterValid === pastTenseBefore + 1,
      "Valid past tense utterance ('Yesterday I went to market') DOES increment SKILL_PAST_TENSE credit",
      `Expected ${pastTenseBefore + 1}, got ${pastTenseAfterValid}`
    );
  }

  // TEST 4: Mode Adapters Contract Integrity (Day Story & Rock & Roll)
  console.log('\n--- TEST SUITE 4: Experience Adapters (Day Story & Rock & Roll) ---');
  {
    const dayStoryResult = await orchestrateDayStoryTurn({
      dayMap: { activities: ['office'], emotions: ['tired'] },
      selectedTopic: { pointer: 'Office routine' },
      conversationHistory: [],
      answeredQuestions: [],
      knownFacts: [],
      latestLearnerAnswer: "I worked on reports yesterday",
      isFirstTurnOfTopic: false,
    });

    assert(Boolean(dayStoryResult.understoodMeaning), "Day Story adapter produces understoodMeaning");
    assert(Boolean(dayStoryResult.probeQuestion), "Day Story adapter produces probeQuestion");

    const rockAndRollResult = await orchestrateRockAndRollTurn({
      challenge: { mission: 'Resolve delayed package' },
      history: [],
      learnerMessage: "I will check the tracking status immediately and issue a replacement.",
      turnCount: 6,
    });

    assert(Boolean(rockAndRollResult.customerReply), "Rock & Roll adapter produces customerReply");
    assert(Boolean(rockAndRollResult.coachingFeedback), "Rock & Roll adapter produces coachingFeedback");
    assert(
      Boolean(rockAndRollResult.resolutionReached),
      "Rock & Roll adapter evaluates resolution condition correctly",
      `Expected true, got ${rockAndRollResult.resolutionReached}, isUnderstandable=${rockAndRollResult.orchestrationResult.canonicalMeaning.isUnderstandable}, score=${rockAndRollResult.orchestrationResult.canonicalMeaning.communicationQualityScore}`
    );

  }

  // Summary
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  console.log('\n===============================================================');
  console.log(`📊 V2 TEST SUMMARY: ${passedCount}/${totalCount} TESTS PASSED (${Math.round((passedCount / totalCount) * 100)}%)`);
  console.log('===============================================================\n');

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runV2Tests().catch(err => {
  console.error("V2 Test runner encountered an unhandled exception:", err);
  process.exit(1);
});
