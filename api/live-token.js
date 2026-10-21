// Vercel serverless function: creates a short-lived Gemini Live API token.
// Keep GEMINI_API_KEY in Vercel Project Settings > Environment Variables.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Vercel ortam değişkenlerinde GEMINI_API_KEY bulunamadı.' });
  }

  const now = Date.now();
  const payload = {
    uses: 1,
    expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
    newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
    liveConnectConstraints: {
      model: 'gemini-3.1-flash-live-preview',
      config: {
        responseModalities: ['AUDIO'],
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        systemInstruction: {
          parts: [{ text: 'Sen Software & English Hub sitesinin sıcak, sabırlı ve teşvik edici İngilizce ve yazılım öğretmenisin. Kullanıcıyla doğal Türkçe konuş; İngilizce öğrenme pratiği isterse basit İngilizce kullan ve gerektiğinde Türkçe açıkla. Kısa, anlaşılır yanıtlar ver.' }]
        }
      }
    }
  };

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1alpha/auth_tokens', {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini token error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Gemini jetonu oluşturulamadı.' });
    }
    return res.status(200).json({ token: data.name });
  } catch (error) {
    console.error('Gemini token request failed:', error);
    return res.status(500).json({ error: 'Gemini sunucusuna bağlanılamadı.' });
  }
}
