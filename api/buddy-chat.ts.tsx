export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const {
      history = [],
      learnerMessage,
      message,
      exchangeCount = 1,
      wasAwaitingEnglishRetry: explicitRetry = false,
    } = body;

    const cleanMsg = String(learnerMessage || message || "").trim();
    let wasAwaitingEnglishRetry = Boolean(explicitRetry);

    if (!wasAwaitingEnglishRetry && Array.isArray(history)) {
      const lastBuddyMessage = [...history].reverse().find((item: any) => item.sender === "buddy");
      if (lastBuddyMessage) {
        const text = String(lastBuddyMessage.text || "").toLowerCase();
        wasAwaitingEnglishRetry =
          text.includes("try karo") ||
          text.includes("try saying") ||
          text.includes("main sun raha hoon") ||
          text.includes("ab aap try") ||
          text.includes("aap try karo") ||
          text.includes("in english:") ||
          text.includes("english mein aap keh sakte ho") ||
          text.includes("you can say:") ||
          text.includes("bolo") ||
          text.includes("try");
      }
    }

    const groqKey = process.env.GROQ_API_KEY;

    // Fallback if GROQ_API_KEY is not configured
    if (!groqKey || !groqKey.trim()) {
      return res.status(200).json({
        understoodMeaning: cleanMsg || "Shared thoughts",
        naturalResponse: "I'm listening and understand you completely 😊 Take your time.",
        nextQuestion: "Can you tell me more about that?",
        subtleRecast: cleanMsg || "",
        englishModel: cleanMsg || "",
        awaitingEnglishRetry: wasAwaitingEnglishRetry,
        learnerComfortLanguage: "english",
        newFacts: cleanMsg ? [`Learner shared: "${cleanMsg}"`] : [],
        topic: "Daily Life",
        conversationDepth: exchangeCount,
        needsClarification: false,
        shouldEnd: false,
        providerUsed: "local_fallback",
        responseTimeMs: 0,
      });
    }

    const systemPrompt = `You are Buddy, a warm English speaking companion for Indian learners.
Your job:
1. Understand what the learner means even in broken English or Hindi/Hinglish.
2. If the learner speaks Hindi/Hinglish: acknowledge warmly in friendly Hinglish, provide a simple English sentence they can use, and encourage them to try. Do NOT ask another question yet.
3. If the learner tries broken English: praise their effort warmly, provide a gentle improvement, and continue with ONE simple follow-up question.
4. If the learner speaks good English: reply naturally and ask ONE follow-up question.
5. Return ONLY a valid JSON object matching this exact schema:
{
  "understoodMeaning": "string",
  "naturalResponse": "string",
  "nextQuestion": "string",
  "subtleRecast": "string",
  "awaitingEnglishRetry": boolean,
  "learnerComfortLanguage": "english" | "hinglish" | "hindi",
  "newFacts": [],
  "topic": "Daily Life",
  "conversationDepth": number,
  "needsClarification": false,
  "shouldEnd": false
}`;

    const userPrompt = JSON.stringify({
      conversationHistory: Array.isArray(history) ? history.slice(-10) : [],
      learnerMessage: cleanMsg,
      exchangeCount,
      wasAwaitingEnglishRetry,
    });

    const startTime = Date.now();
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey.trim()}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 700,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";
    const result = JSON.parse(content);

    return res.status(200).json({
      ...result,
      englishModel: result.subtleRecast || "",
      providerUsed: "groq_llama",
      responseTimeMs: Date.now() - startTime,
    });
  } catch (err: any) {
    console.error("[Buddy Chat API Error]", err?.message || err);
    return res.status(200).json({
      understoodMeaning: "Shared thoughts",
      naturalResponse: "I'm listening and understand you completely 😊 Take your time.",
      nextQuestion: "Can you tell me more about that?",
      subtleRecast: "",
      englishModel: "",
      awaitingEnglishRetry: false,
      learnerComfortLanguage: "english",
      newFacts: [],
      topic: "Daily Life",
      conversationDepth: 1,
      needsClarification: false,
      shouldEnd: false,
      providerUsed: "local_fallback",
      responseTimeMs: 0,
    });
  }
}