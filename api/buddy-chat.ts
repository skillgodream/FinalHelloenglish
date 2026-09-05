export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    const {
      history,
      learnerMessage,
      message,
      exchangeCount,
      wasAwaitingEnglishRetry: explicitRetry,
    } = body;

    const cleanMsg = (learnerMessage || message || "").trim();

    const currentExchanges =
      typeof exchangeCount === "number"
        ? exchangeCount
        : 1;

    // Detect if previous Buddy message was waiting for an English retry
    let wasAwaitingEnglishRetry = Boolean(explicitRetry);

    if (
      !wasAwaitingEnglishRetry &&
      Array.isArray(history) &&
      history.length > 0
    ) {
      const lastBuddyMsg = [...history]
        .reverse()
        .find((m: any) => m.sender === "buddy");

      if (lastBuddyMsg) {
        const text = (lastBuddyMsg.text || "").toLowerCase();

        if (
          text.includes("try karo") ||
          text.includes("try saying") ||
          text.includes("main sun raha hoon") ||
          text.includes("ab aap try") ||
          text.includes("aap try karo") ||
          text.includes("in english:") ||
          text.includes("english mein aap keh sakte ho") ||
          text.includes("you can say:") ||
          text.includes("bolo") ||
          text.includes("try")
        ) {
          wasAwaitingEnglishRetry = true;
        }
      }
    }

    /*
     * Load the existing conversation orchestrator.
     * Dynamic import prevents a module-loading failure
     * from turning the endpoint into a 500.
     */
    try {
      const {
        orchestrateConversationTurn,
      } = await import(
        "../server/services/conversationOrchestrator.ts"
      );

      const orchestrationResult =
        await orchestrateConversationTurn({
          history: Array.isArray(history) ? history : [],
          learnerMessage: cleanMsg,
          exchangeCount: currentExchanges,
          wasAwaitingEnglishRetry,
        });

      return res.status(200).json({
        ...orchestrationResult,
        englishModel:
          orchestrationResult?.subtleRecast || "",
      });
    } catch (orchestrationError: any) {
      console.error(
        "[Buddy Orchestrator Error]",
        orchestrationError?.message || orchestrationError
      );
    }

    // Safe local fallback
    return res.status(200).json({
      understoodMeaning:
        cleanMsg || "Shared thoughts",

      naturalResponse:
        "I'm listening and understand you completely 😊 Take your time.",

      nextQuestion:
        "Can you tell me more about that?",

      subtleRecast:
        cleanMsg || "",

      englishModel:
        cleanMsg || "",

      awaitingEnglishRetry:
        false,

      learnerComfortLanguage:
        "english",

      newFacts:
        cleanMsg
          ? [`Learner shared: "${cleanMsg}"`]
          : [],

      topic:
        "Daily Life",

      conversationDepth:
        currentExchanges,

      needsClarification:
        false,

      shouldEnd:
        false,

      providerUsed:
        "sheeko_local",

      responseTimeMs:
        0,
    });

  } catch (err: any) {
    console.error(
      "[Buddy Chat API Error]",
      err?.message || err
    );

    // NEVER return 500 for normal Buddy operation
    return res.status(200).json({
      understoodMeaning: "Shared thoughts",

      naturalResponse:
        "I'm listening and understand you completely 😊 Take your time.",

      nextQuestion:
        "Can you tell me more about that?",

      subtleRecast: "",

      englishModel: "",

      awaitingEnglishRetry: false,

      learnerComfortLanguage: "english",

      newFacts: [],

      topic: "Daily Life",

      conversationDepth: 1,

      needsClarification: false,

      shouldEnd: false,

      providerUsed: "sheeko_local",

      responseTimeMs: 0,
    });
  }
}