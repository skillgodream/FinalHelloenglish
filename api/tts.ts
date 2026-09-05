/**
 * Serverless Text-to-Speech API Endpoint Handler for Vercel
 * Communicates directly with Sarvam AI using environment secrets.
 */

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : req.body || {};

    const {
      text,
      lang = 'en-IN',
      speaker = 'ritu',
      pace = 0.94,
      loudness = 1.0
    } = body;

    const apiKey = process.env.SARVAM_API_KEY;

    // Preserve existing client fallback contract
    if (!apiKey || !text) {
      return res.status(200).json({
        fallback: true,
        message: 'Missing required text parameters or environment secret.'
      });
    }

    const target_language_code = lang.startsWith('hi')
      ? 'hi-IN'
      : 'en-IN';

    const chosenSpeaker =
      !speaker || speaker === 'meera' || speaker === 'neha'
        ? 'ritu'
        : speaker;

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 6500);

    const response = await fetch(
      'https://api.sarvam.ai/text-to-speech',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': apiKey.trim()
        },

        signal: controller.signal,

        body: JSON.stringify({
          inputs: [text],
          target_language_code,
          speaker: chosenSpeaker,
          pitch: 0,
          pace: typeof pace === 'number' ? pace : 0.94,
          loudness:
            typeof loudness === 'number' ? loudness : 1.0,
          speech_sample_rate: 16000,
          enable_preprocessing: true,
          model: 'bulbul:v3'
        })
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Sarvam TTS API error: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();

    if (data.audios && data.audios[0]) {
      return res.status(200).json({
        success: true,
        speaker: chosenSpeaker,
        audioData:
          `data:audio/wav;base64,${data.audios[0]}`,
        audioBase64: data.audios[0],
        audioContent: data.audios[0]
      });
    }

    return res.status(200).json({
      fallback: true,
      message: 'Sarvam response contained no audio.'
    });

  } catch (err: any) {
    console.error(
      '[Serverless TTS Failure]',
      err?.message || err
    );

    return res.status(200).json({
      fallback: true,
      message: 'Falling back to Web Speech API.'
    });
  }
}