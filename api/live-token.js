
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY Vercel ortam değişkenlerinde bulunamadı."
    });
  }

  const now = Date.now();

  const payload = {
    uses: 1,
    expireTime: new Date(
      now + 30 * 60 * 1000
    ).toISOString(),
    newSessionExpireTime: new Date(
      now + 60 * 1000
    ).toISOString(),
    liveConnectConstraints: {
      model: "models/gemini-3.1-flash-live-preview",
      config: {
        responseModalities: ["AUDIO"],
        sessionResumption: {},
        systemInstruction: {
          parts: [
            {
              text: "You are a friendly English and software teacher. Speak Turkish when explaining concepts and help the user practice English. Respond naturally in real-time voice conversations."
            }
          ]
        }
      }
    }
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/auth_tokens",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini token error:", data);

      return res.status(response.status).json({
        error:
          data.error?.message ||
          "Gemini geçici jetonu oluşturulamadı."
      });
    }

    if (!data.name) {
      return res.status(502).json({
        error: "Gemini yanıtında jeton bulunamadı."
      });
    }

    return res.status(200).json({
      token: data.name
    });

  } catch (error) {
    console.error("Gemini token request failed:", error);

    return res.status(500).json({
      error: "Gemini sunucusuna bağlanılamadı."
    });
  }
}
