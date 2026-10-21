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

  try {
    // Google Generative Language API'sinden geçici oturum jetonu alma isteği
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/tokens?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uses: 1,
          ttl: "1800s" // 30 dakika geçerli
        })
      }
    );

    // Yanıtın boş olup olmadığını ve JSON olup olmadığını güvenli şekilde kontrol et
    const text = await response.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("JSON parse hatası, ham yanıt:", text);
        return res.status(502).json({
          error: "Google API geçersiz bir yanıt döndürdü.",
          raw: text
        });
      }
    }

    if (!response.ok) {
      console.error("Gemini API Hata Yanıtı:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Gemini jetonu oluşturulamadı."
      });
    }

    const token = data.name || data.token || data.authToken;

    if (!token) {
      console.error("Yanıtta token alanı yok:", data);
      return res.status(502).json({
        error: "Google yanıtında geçerli jeton bulunamadı."
      });
    }

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Token isteğinde beklenmeyen hata:", error);
    return res.status(500).json({
      error: `Token isteği başarısız: ${error.message}`
    });
  }
}