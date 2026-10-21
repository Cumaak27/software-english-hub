export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY Vercel ortam değişkenlerinde bulunamadı."
    });
  }

  // Gemini Live için yetkilendirilmiş Ephemeral Token Payload'ı
  const payload = {
    uses: 1,
    expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    newSessionExpireTime: new Date(Date.now() + 60 * 1000).toISOString()
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/authTokens?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Gemini geçici jetonu oluşturamadı."
      });
    }

    // Token 'name' veya 'authToken' alanından döner
    const token = data.authToken || data.name;

    if (!token) {
      console.error("Token bulunamadı:", data);
      return res.status(502).json({
        error: "Gemini yanıtında geçerli jeton bulunamadı."
      });
    }

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Token isteği başarısız:", error);
    return res.status(500).json({
      error: "Gemini API bağlantısı başarısız oldu."
    });
  }
}