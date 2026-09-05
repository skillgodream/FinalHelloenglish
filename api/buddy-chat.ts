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

  const getContextualHinglishTranslation = (cleanMsg: string) => {
    const lower = cleanMsg.toLowerCase();
    if (lower.includes("bus") && (lower.includes("kharab") || lower.includes("break") || lower.includes("late"))) {
      return {
        meaning: "Learner's bus broke down",
        english: "My bus broke down.",
        hinglishAck: "Achha, aapki bus kharab ho gayi thi! 🚌",
      };
    }
    if (lower.includes("traffic") || lower.includes("jam")) {
      return {
        meaning: "Learner got stuck in traffic",
        english: "I got stuck in heavy traffic.",
        hinglishAck: "Achha, toh bohot traffic tha! 🚗",
      };
    }
    if (lower.includes("boss") || lower.includes("manager") || lower.includes("daant")) {
      return {
        meaning: "Issue with boss or manager",
        english: "My boss was upset with me.",
        hinglishAck: "Achha, office mein aisi problem ho gayi!",
      };
    }
    if (lower.includes("tabiyat") || lower.includes("bimar") || lower.includes("headache") || lower.includes("sir dard")) {
      return {
        meaning: "Learner was feeling unwell",
        english: "I was not feeling well.",
        hinglishAck: "Oh, aapki tabiyat theek nahi thi! Take care.",
      };
    }
    if (lower.includes("late") || lower.includes("der")) {
      return {
        meaning: "Learner arrived late",
        english: "I reached late today.",
        hinglishAck: "Achha, toh aaj late ho gaya!",
      };
    }
    if (lower.includes("acha hun") || lower.includes("theek hun") || lower.includes("thik hun") || lower.includes("good")) {
      return {
        meaning: "Learner is doing good",
        english: "I am doing well.",
        hinglishAck: "Yeh toh bohot achhi baat hai! 😊",
      };
    }
    if (lower.includes("din") || lower.includes("day") || lower.includes("kaam") || lower.includes("work")) {
      return {
        meaning: "Learner had a tough work day",
        english: "I had a very busy and tiring day at work.",
        hinglishAck: "Achha, toh aaj bohot kaam tha!",
      };
    }
    return {
      meaning: "Learner is not doing well",
      english: "I am not doing well.",
      hinglishAck: "Achha, toh aap theek nahi ho 😊",
    };
  };

  const getLocalRuleResponse = (cleanMsg: string, isHindi: boolean, isBrokenEnglish: boolean, exchangeCount: number) => {
    const lowerMsg = cleanMsg.toLowerCase();

    if (isHindi) {
      const { meaning, english, hinglishAck } = getContextualHinglishTranslation(cleanMsg);

      return {
        understoodMeaning: meaning,
        naturalResponse: `${hinglishAck} English mein aap bol sakte ho: "${english}". Aap ek baar try karo!`,
        nextQuestion: "",
        subtleRecast: english,
        englishModel: english,
        awaitingEnglishRetry: true,
        learnerComfortLanguage: "hinglish",
        newFacts: [`Learner shared: "${cleanMsg}"`],
        topic: "Daily Life",
        conversationDepth: exchangeCount,
        needsClarification: false,
        shouldEnd: false,
        providerUsed: "contextual_rule_engine",
        responseTimeMs: 0,
      };
    }

    if (isBrokenEnglish) {
      let improvement = cleanMsg;
      if (lowerMsg.includes("bus")) {
        improvement = "My bus broke down.";
      } else if (lowerMsg.includes("not good")) {
        improvement = "I am not doing well.";
      } else if (lowerMsg.includes("traffic")) {
        improvement = "There was too much traffic.";
      } else {
        improvement = cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1);
        if (!improvement.endsWith(".")) improvement += ".";
      }

      return {
        understoodMeaning: "Learner expressed their thoughts in English",
        naturalResponse: `Very good! 😊 Aapne acha try kiya. Bas ek chhota improvement: "${improvement}".`,
        nextQuestion: "Tell me, what did you do after that?",
        subtleRecast: improvement,
        englishModel: improvement,
        awaitingEnglishRetry: false,
        learnerComfortLanguage: "broken_english",
        newFacts: [`Learner said: "${cleanMsg}"`],
        topic: "Daily Life",
        conversationDepth: exchangeCount,
        needsClarification: false,
        shouldEnd: false,
        providerUsed: "contextual_rule_engine",
        responseTimeMs: 0,
      };
    }

    return {
      understoodMeaning: cleanMsg || "Shared thoughts",
      naturalResponse: "I understand! Tell me more about what happened.",
      nextQuestion: "How did that make you feel?",
      subtleRecast: cleanMsg || "",
      englishModel: cleanMsg || "",
      awaitingEnglishRetry: false,
      learnerComfortLanguage: "english",
      newFacts: cleanMsg ? [`Learner shared: "${cleanMsg}"`] : [],
      topic: "Daily Life",
      conversationDepth: exchangeCount,
      needsClarification: false,
      shouldEnd: false,
      providerUsed: "contextual_rule_engine",
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
      /\b(nahi|acha|achha|theek|thik|hoon|hun|hai|mera|meri|aaj|din|kuch|bahut|bohot|kya|kyun|kaise|kar|raha|rahi|gaya|gayi|gaye|thi|tha|the|main|mai|bus|kharab|gaadi|traffic|office|yaar)\b/i.test(lowerMsg);

    const isBrokenEnglish =
      !isHindi &&
      (/\b(i not|me not|day not|i go office|i reach late|not good|very tire|no problem sir|my bus breakdown|bus kharab)\b/i.test(lowerMsg) ||
       (cleanMsg.split(/\s+/).length <= 4 && !/\b(i am|i was|i'm|it is|it was|my day was)\b/i.test(lowerMsg)) ||
       Boolean(explicitRetry));

    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey || !groqKey.trim()) {
      return res.status(200).json(getLocalRuleResponse(cleanMsg, isHindi, isBrokenEnglish, exchangeCount));
    }

    const systemPrompt = `You are Buddy, a warm English speaking companion for Indian learners.

RULES:
1. If learner speaks Hindi / Hinglish (e.g. "meri bus kharab ho gayi thi", "aaj bohot traffic tha"):
   - Understand the EXACT meaning of what happened.
   - Respond warmly in friendly Hinglish acknowledging their specific situation.
   - Give ONE simple English sentence expressing that exact meaning (e.g. "My bus broke down." or "I got stuck in traffic.").
   - Encourage them to try: "English mein aap bol sakte ho: '...' Aap ek baar try karo."
   - STOP AND WAIT (leave nextQuestion empty ""). Set awaitingEnglishRetry: true.

2. If learner attempts broken English (e.g. "my bus break", "i not good"):
   - Praise their effort warmly ("Very good! 😊 Aapne acha try kiya.").
   - Give a gentle improvement.
   - Ask ONE short follow-up question. Set awaitingEnglishRetry: false.

3. If learner speaks good English: respond naturally and ask ONE short question in simple English.

Return ONLY valid JSON matching this schema:
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
    const candidateModels = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"];
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
