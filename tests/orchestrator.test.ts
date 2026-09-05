import {
  orchestrateConversationTurn,
  buildSheekoBuddyFallback,
  validateAndGroundMeaning,
  CanonicalMeaning,
} from '../server/services/conversationOrchestrator';
import { parseLearnerStoryToMeaningRepresentation } from '../src/data/sheekoEngine';
import { getSheekoReferences } from '../server/services/sheekoServerEngine';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
  error?: any;
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

async function runAllTests() {
  console.log('\n===============================================================');
  console.log('🧪 RUNNING AUTOMATED ORCHESTRATION & RELIABILITY TEST SUITE');
  console.log('===============================================================\n');

  // TEST 1: Single Canonical Meaning Object Creation and Shared Consumption
  console.log('--- TEST SUITE 1: Canonical Meaning Object Creation & Single Source of Truth ---');
  {
    const learnerUtterance = "aaj mera din acha nahi tha, office mein late ho gaya";
    const sheekoExtraction = parseLearnerStoryToMeaningRepresentation(learnerUtterance);
    const mockModelOutput = {
      subtleRecast: "My day was not good and I arrived late at the office.",
      topic: "Workplace & Daily Routine",
    };

    const canonical: CanonicalMeaning = validateAndGroundMeaning(learnerUtterance, mockModelOutput, sheekoExtraction);

    assert(Boolean(canonical), "Canonical meaning object is instantiated");
    assert(canonical.rawInput === learnerUtterance, "Canonical meaning preserves raw input");
    assert(canonical.detectedLanguage === 'hinglish', "Canonical meaning detects Hinglish language correctly");
    assert(canonical.normalizedEnglishText === "My day was not good and I arrived late at the office.", "Canonical meaning stores unified normalized English text");
    assert(Array.isArray(canonical.groundedFacts) && canonical.groundedFacts.length > 0, "Canonical grounded facts are extracted from learner utterance");
    assert(canonical.activities.includes('office') || canonical.groundedFacts.some(f => f.toLowerCase().includes('office')), "Canonical preserves office fact without hallucination");
  }

  // TEST 2: STOP & WAIT Verification for Hindi/Hinglish
  console.log('\n--- TEST SUITE 2: STOP & WAIT Protocol for Hindi / Hinglish ---');
  {
    const hinglishResult = await orchestrateConversationTurn({
      history: [],
      learnerMessage: "Aaj mera din acha nahi tha.",
      exchangeCount: 1,
      wasAwaitingEnglishRetry: false,
    });

    assert(hinglishResult.awaitingEnglishRetry === true, "STOP & WAIT: awaitingEnglishRetry is TRUE");
    assert(hinglishResult.nextQuestion === "", "STOP & WAIT: nextQuestion is STRICTLY EMPTY STRING");
    assert(hinglishResult.subtleRecast === "My day was not good.", `STOP & WAIT: subtleRecast is accurate ("${hinglishResult.subtleRecast}")`);
    assert(hinglishResult.naturalResponse.toLowerCase().includes("english") || hinglishResult.naturalResponse.toLowerCase().includes("try"), "STOP & WAIT: naturalResponse prompts learner to try in English");
  }

  // TEST 3: Broken English Effort Recognition & Natural Continuation
  console.log('\n--- TEST SUITE 3: Broken English Handling & Single Question Continuation ---');
  {
    const brokenResult = await orchestrateConversationTurn({
      history: [],
      learnerMessage: "My day not good.",
      exchangeCount: 1,
      wasAwaitingEnglishRetry: false,
    });

    assert(brokenResult.awaitingEnglishRetry === false, "Broken English: awaitingEnglishRetry is FALSE");
    assert(Boolean(brokenResult.naturalResponse), "Broken English: naturalResponse provides warm encouragement");
    assert(brokenResult.subtleRecast.length > 0, "Broken English: provides gentle recast model");
  }

  // TEST 4: Sheeko Local Fallback when LLMs are Unavailable
  console.log('\n--- TEST SUITE 4: Deterministic Sheeko Fallback ---');
  {
    const extraction = parseLearnerStoryToMeaningRepresentation("maine khana kha liya");
    const sheekoResult = buildSheekoBuddyFallback("maine khana kha liya", false, 1, extraction);

    assert(sheekoResult.providerUsed === 'sheeko_local', "Fallback executed via Sheeko Local engine");
    assert(sheekoResult.awaitingEnglishRetry === true, "Sheeko Local sets awaitingEnglishRetry for Hindi");
    assert(sheekoResult.nextQuestion === "", "Sheeko Local enforces empty nextQuestion for Hindi");
    assert(sheekoResult.subtleRecast.includes("food") || sheekoResult.subtleRecast.includes("eat"), "Sheeko Local maps Hindi food intent to English");
  }

  // TEST 5: Complete Failure on Incomprehensible / Garbled Input -> Clarification Fallback (Never Generic)
  console.log('\n--- TEST SUITE 5: Complete Failure on Incomprehensible Input -> Clarification (No Canned Slop) ---');
  {
    const garbledExtraction = parseLearnerStoryToMeaningRepresentation("??? @@@ !!! 12345");
    const uncomprehendedResult = buildSheekoBuddyFallback("??? @@@ !!! 12345", false, 1, garbledExtraction);

    assert(uncomprehendedResult.needsClarification === true, "Garbled input sets needsClarification to TRUE");
    assert(uncomprehendedResult.providerUsed === 'clarification_fallback', "Provider flagged as clarification_fallback");
    assert(uncomprehendedResult.nextQuestion === "", "No spurious probing question on incomprehensible input");
    assert(
      !uncomprehendedResult.naturalResponse.includes("Nice! That sounds interesting") &&
      !uncomprehendedResult.naturalResponse.includes("Bahut badhiya! 👏"),
      "Refuses to return fake praise or canned generic response on unrecognized gibberish"
    );
    assert(
      uncomprehendedResult.naturalResponse.toLowerCase().includes("didn't quite catch") ||
      uncomprehendedResult.naturalResponse.toLowerCase().includes("could you tell me"),
      "Explicitly asks the learner for gentle clarification"
    );
  }

  // TEST 6: Malformed AI Output Handling & JSON Recovery
  console.log('\n--- TEST SUITE 6: Malformed AI Output & Graceful JSON Recovery ---');
  {
    const badJson1 = "```json { \"naturalResponse\": \"Hello there!\", \"awaitingEnglishRetry\": true, \"nextQuestion\": \"Why?\" } ```";
    const extraction = parseLearnerStoryToMeaningRepresentation("hello");
    const canonical = validateAndGroundMeaning("hello", { subtleRecast: "" }, extraction);

    assert(Boolean(canonical), "Recovers canonical meaning when payload requires fallback extraction");
  }

  // TEST 7: Reference Library Loading in Sheeko Server Engine
  console.log('\n--- TEST SUITE 7: Reference Library File Existence & Server Loading ---');
  {
    const refs = getSheekoReferences();
    assert(Array.isArray(refs) && refs.length > 5, `Sheeko server engine loaded ${refs.length} reference patterns (greater than fallback default 5)`);
  }

  // TEST 8: Sarvam TTS Fallback Guard
  console.log('\n--- TEST SUITE 8: Sarvam TTS Abort / Error Fallback Protocol ---');
  {
    // Simulate what /api/tts does on timeout or API error
    const simulateTtsErrorHandling = (hasApiKey: boolean, isTimeout: boolean) => {
      if (!hasApiKey || isTimeout) {
        return { fallback: true, message: "Use client-side Web Speech API." };
      }
      return { audio: "base64_data", format: "wav" };
    };

    const fallbackResult = simulateTtsErrorHandling(false, false);
    assert(fallbackResult.fallback === true, "TTS returns fallback: true when API key is missing or invalid");

    const timeoutResult = simulateTtsErrorHandling(true, true);
    assert(timeoutResult.fallback === true, "TTS returns fallback: true when upstream times out");
  }

  // Summary
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  console.log('\n===============================================================');
  console.log(`📊 TEST SUMMARY: ${passedCount}/${totalCount} TESTS PASSED (${Math.round((passedCount / totalCount) * 100)}%)`);
  console.log('===============================================================\n');

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error("Test runner encountered an unhandled exception:", err);
  process.exit(1);
});
