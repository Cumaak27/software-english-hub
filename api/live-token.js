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

  // Normal Gemini API anahtarınızı güvenli şekilde frontend'e iletir
  return res.status(200).json({
    token: apiKey
  });
}