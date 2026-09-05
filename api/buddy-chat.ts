export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const getLocalRuleResponse = (cleanMsg: string, isHindi: boolean, isBrokenEnglish: boolean, exchangeCount: number) => {
    const lowerMsg = cleanMsg.toLowerCase();

    if (isHindi) {
      let englishSentence = "I am not doing well today.";
      if (lowerMsg.includes("din") || lowerMsg.includes("day")) {
        englishSentence = "My day was not good.";
      } else if (lowerMsg.includes("thik") || lowerMsg.includes("theek") || lowerMsg.includes("acha")) {
        englishSentence = "I am not feeling well.";
      }

      return {
        understoodMeaning: "Learner is not feeling good / had a bad day",
        naturalResponse: `Achha, aap theek nahi ho 😊 English mein aap bol sakte ho: "${englishSentence}". Aap ek baar try karo!`,
        nextQuestion: "",
        subtleRecast: englishSentence,
        englishModel: englishSentence,
        awaitingEnglishRetry: true,
        learnerComfortLanguage: "hinglish",
        newFacts: [`Learner shared: "${cleanMsg}"`],
        topic: "Daily Life",
        conversationDepth: exchangeCount,
        needsClarification: false,
        shouldEnd: false,
        providerUsed: "rule_engine",
        responseTimeMs: 0,
      };
    }

    if (isBrokenEnglish) {
      let improvement = "I am not doing well.";
      if (lowerMsg.includes("day")) {
        improvement = "My day was not good.";
      }

      return {
        understoodMeaning: "Learner expressed they are not doing well",
        naturalResponse: `Very good! 😊 Aapne acha try kiya. Bas ek chhota improvement: "${improvement}".`,
        nextQuestion: "Tell me, why was your day not good?",
        subtleRecast: improvement,
        englishModel: improvement,
        awaitingEnglishRetry: false,
        learnerComfortLanguage: "broken_english",
        newFacts: [`Learner said: "${cleanMsg}"`],
        topic: "Daily Life",
        conversationDepth: exchangeCount,
        needsClarification: false,
        shouldEnd: false,
        providerUsed: "rule_engine",
        responseTimeMs: 0,
      };
    }

    return {
      understoodMeaning: cleanMsg || "Shared thoughts",
      naturalResponse: "I understand! Tell me more about what happened.",
      nextQuestion: "How are you feeling about it now?",
      subtleRecast: cleanMsg || "",
      englishModel: cleanMsg || "",
      awaitingEnglishRetry: false,
      learnerComfortLanguage: "english",
      newFacts: cleanMsg ? [`Learner shared: "${cleanMsg}"`] : [],
      topic: "Daily Life",
      conversationDepth: exchangeCount,
      needsClarification: false,
      shouldEnd: false,
      providerUsed: "rule_engine",
      responseTimeMs: 0,
    };
  };

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
    const lowerMsg = cleanMsg.toLowerCase();

    const isHindi =
      /[\u0900-\u097F]/.test(cleanMsg) ||
      /\b(nahi|acha|achha|theek|thik|hoon|hun|hai|mera|meri|aaj|din|kuch|bahut|kya|kyun|kaise|kar|raha|gaya|gaye|main|mai|yaar)\b/i.test(lowerMsg);

    const isBrokenEnglish =
      !isHindi &&
      (/\b(i not|me not|day not|i go office|i reach late|not good|very tire|no problem sir)\b/i.test(lowerMsg) ||
       (cleanMsg.split(/\s+/).length <= 4 && !/\b(i am|i was|i'm|it is|it was|my day was)\b/i.test(lowerMsg)) ||
       Boolean(explicitRetry));

    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey || !groqKey.trim()) {
      return res.status(200).json(getLocalRuleResponse(cleanMsg, isHindi, isBrokenEnglish, exchangeCount));
    }

    const systemPrompt = `You are Buddy, a warm English speaking companion for Indian learners.

RULES:
1. If learner speaks Hindi / Hinglish: respond warmly in Hinglish, provide ONE simple English sentence for their thought, and encourage them to try: "English mein aap bol sakte ho: '...' Aap ek baar try karo." STOP AND WAIT (leave nextQuestion empty ""). Set awaitingEnglishRetry: true.
2. If learner attempts broken English: praise their effort warmly ("Very good! 😊 Aapne acha try kiya."), give a gentle improvement, and ask ONE short follow-up question. Set awaitingEnglishRetry: false.
3. If learner speaks good English: respond naturally and ask ONE short question in simple English.
4. Return ONLY valid JSON matching this schema:
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
      conversationHistory: Array.isArray(history) ? history.slice(-8) : [],
      learnerMessage: cleanMsg,
      exchangeCount,
      wasAwaitingEnglishRetry: explicitRetry,
      isHindi,
      isBrokenEnglish,
    });

    const startTime = Date.now();
    const candidateModels = [
      "llama-3.1-8b-instant",
      "llama-3.3-70b-versatile",
      "llama3-8b-8192"
    ];

    let response: any = null;
    for (const model of candidateModels) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey.trim()}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.25,
            max_tokens: 600,
            response_format: { type: "json_object" },
          }),
        });

        if (res.ok) {
          response = res;
          break;
        } else {
          const errBody = await res.text();
          console.warn(`[Groq ${model} Error ${res.status}]:`, errBody);
        }
      } catch (e) {
        console.warn(`[Groq ${model} fetch failed]:`, e);
      }
    }

    if (!response || !response.ok) {
      return res.status(200).json(getLocalRuleResponse(cleanMsg, isHindi, isBrokenEnglish, exchangeCount));
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";
    let result: any;
    try {
      result = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      result = match ? JSON.parse(match[0]) : {};
    }

    return res.status(200).json({
      ...result,
      englishModel: result.subtleRecast || "",
      providerUsed: "groq_llama",
      responseTimeMs: Date.now() - startTime,
    });
  } catch (err: any) {
    console.error("[Buddy Chat API Error]", err);
    return res.status(200).json(getLocalRuleResponse("", true, false, 1));
  }
}
