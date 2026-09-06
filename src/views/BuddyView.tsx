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
    if (lower.includes("dost") || lower.includes("friend")) {
      return {
        meaning: "Learner met with a friend",
        english: lower.includes("khana") ? "I went to my friend's place and had food." : "I met my friend today.",
        hinglishAck: "Achha, aap dost se mile! 😊",
      };
    }
    if (lower.includes("khana") || lower.includes("food") || lower.includes("lunch") || lower.includes("dinner") || lower.includes("kheer")) {
      return {
        meaning: "Learner ate food",
        english: lower.includes("kheer") ? "I had kheer for dinner." : "I had a good meal.",
        hinglishAck: "Achha, aapne khana khaya! 🍲",
      };
    }
    if (lower.includes("shadi") || lower.includes("wedding") || lower.includes("marriage")) {
      return {
        meaning: "Learner attended a wedding",
        english: "I went to a wedding.",
        hinglishAck: "Achha, aap shadi mein gaye the! 🎉",
      };
    }
    if (lower.includes("market") || lower.includes("bazaar")) {
      return {
        meaning: "Learner went to the market",
        english: "I went to the market.",
        hinglishAck: "Achha, aap market gaye the! 🛍️",
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
        english: "I had a very busy day.",
        hinglishAck: "Achha, toh aaj bohot kaam tha!",
      };
    }
    return {
      meaning: "Learner shared what they did",
      english: "I had an interesting day.",
      hinglishAck: "Achha, main samajh gaya 😊",
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
      let improvement = "";
      if (lowerMsg.includes("bus")) {
        improvement = "My bus broke down.";
      } else if (lowerMsg.includes("not good") || lowerMsg.includes("no good") || lowerMsg.includes("not well")) {
        improvement = "I am not doing well.";
      } else if (lowerMsg.includes("food") || lowerMsg.includes("eat") || lowerMsg.includes("dinner") || lowerMsg.includes("kheer")) {
        improvement = "I had food and relaxed.";
      } else if (lowerMsg.includes("traffic")) {
        improvement = "There was too much traffic.";
      } else if (lowerMsg.includes("dost") || lowerMsg.includes("friend")) {
        improvement = "I went to my friend's place.";
      } else if (lowerMsg.includes("shadi") || lowerMsg.includes("wedding") || lowerMsg.includes("marriage")) {
        improvement = "I went to a wedding.";
      } else if (lowerMsg.includes("market") || lowerMsg.includes("bazaar")) {
        improvement = "I went to the market.";
      } else {
        improvement = "I had a busy and eventful day.";
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
      /\b(nahi|acha|achha|theek|thik|hoon|hun|hai|mera|meri|aaj|din|kuch|bahut|bohot|kya|kyun|kaise|kar|raha|rahi|gaya|gayi|gaye|thi|tha|the|main|mai|bus|kharab|gaadi|traffic|office|yaar|dost|khana|shadi|shaadi|kheer)\b/i.test(lowerMsg);

    const isBrokenEnglish =
      !isHindi &&
      (/\b(i not|me not|day not|i go office|i reach late|not good|very tire|no problem sir|my bus breakdown|bus kharab|i food|i eat|i go|we fill)\b/i.test(lowerMsg) ||
       (cleanMsg.split(/\s+/).length <= 5 && !/\b(i am|i was|i'm|it is|it was|my day was|i had|i went)\b/i.test(lowerMsg)) ||
       Boolean(explicitRetry));

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are Buddy, a warm English speaking companion for Indian learners.

RULES:
1. If learner speaks Hindi / Hinglish (e.g. "meri bus kharab ho gayi thi", "shadi mai gaya", "dinner mai kheer khayi"):
   - Understand the EXACT meaning of what happened.
   - Respond warmly in friendly Hinglish acknowledging their specific situation.
   - Give ONE simple, natural English sentence expressing that exact meaning (e.g. "I went to a wedding." or "I had kheer for dinner.").
   - Encourage them to try: "English mein aap bol sakte ho: '...' Aap ek baar try karo."
   - STOP AND WAIT (leave nextQuestion empty ""). Set awaitingEnglishRetry: true.

2. If learner attempts broken English (e.g. "my bus break", "i food and relaxed", "i not good"):
   - Praise their effort warmly: "Very good! 😊 Aapne acha try kiya."
   - Give the CORRECT, natural English sentence as the improvement (NEVER repeat the learner's grammatical mistake!).
   - Continue the conversation with ONE short follow-up question. Set awaitingEnglishRetry: false.

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

    const historyText = Array.isArray(history)
      ? history
          .slice(-6)
          .map((m: any) => `${m.sender === "learner" || m.sender === "user" ? "Learner" : "Buddy"}: ${String(m.text || "").replace(/[\r\n]+/g, " ")}`)
          .join("\n")
      : "";

    const userPromptText = `Conversation History:
${historyText || "None (starting)"}

Latest Learner Message: "${cleanMsg}"
Awaiting Retry: ${explicitRetry}
Exchange Count: ${exchangeCount}

Analyze what the learner meant, provide natural Hinglish or English guidance, and return the JSON.`;

    const startTime = Date.now();

    // 1. GEMINI PRIMARY (Fluent in Hindi & English, handles Indian conversational nuances)
    if (geminiKey && geminiKey.trim()) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey.trim()}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: "user", parts: [{ text: userPromptText }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.25,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          const gText = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (gText) {
            let parsed: any;
            try {
              parsed = JSON.parse(gText);
            } catch {
              const match = gText.match(/\{[\s\S]*\}/);
              parsed = match ? JSON.parse(match[0]) : null;
            }
            if (parsed && parsed.naturalResponse) {
              return res.status(200).json({
                ...parsed,
                englishModel: parsed.subtleRecast || parsed.englishModel || "",
                providerUsed: "gemini_2_5_flash",
                responseTimeMs: Date.now() - startTime,
              });
            }
          }
        } else {
          console.warn("[Gemini API Error]", await geminiRes.text());
        }
      } catch (gemErr) {
        console.warn("[Gemini Call Failed]", gemErr);
      }
    }

    // 2. GROQ SECONDARY
    if (groqKey && groqKey.trim()) {
      const candidateModels = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"];
      let response: any = null;

      for (const model of candidateModels) {
        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqKey.trim().replace(/^Bearer\s+/i, "")}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPromptText },
              ],
              temperature: 0.25,
              max_tokens: 600,
              response_format: { type: "json_object" },
            }),
          });

          if (res.ok) {
            response = res;
            break;
          }
        } catch (e: any) {
          console.warn(`[Groq ${model} fetch failed]:`, e);
        }
      }

      if (response && response.ok) {
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
      }
    }

    // 3. CONTEXTUAL RULE ENGINE FALLBACK
    return res.status(200).json(getLocalRuleResponse(cleanMsg, isHindi, isBrokenEnglish, exchangeCount));
  } catch (err: any) {
    console.error("[Buddy Chat API Error]", err);
    return res.status(200).json(getLocalRuleResponse("", true, false, 1));
  }
}
