SOFTWARE & ENGLISH HUB - GEMINI LIVE SESLİ SOHBET

Dosyalar:
- index.html: Mevcut siten + sesli sohbet düğmeleri ve Gemini Live istemcisi
- api/live-token.js: Vercel üzerinde kısa ömürlü Gemini Live jetonu oluşturan sunucu fonksiyonu

KURULUM
1) index.html dosyasını mevcut projenin ana HTML dosyası olarak kullan (genellikle index.html).
2) api/live-token.js dosyasını projenin api klasörüne koy: /api/live-token.js
3) Vercel projesinde Settings > Environment Variables bölümüne GEMINI_API_KEY ekle.
   Değer olarak Google AI Studio'dan aldığın Gemini API anahtarını gir. Anahtarı HTML/JavaScript içine yazma.
4) Değişiklikleri GitHub'a gönder veya Vercel'e yeniden deploy et.
5) Siteyi HTTPS üzerinden aç; Sesli Sohbeti Başlat'a bas ve mikrofon iznini ver.

NOTLAR
- Bu özellik için tarayıcı mikrofon izni gerekir.
- Gemini Live model/erişim durumu Google hesabına ve API erişimine göre değişebilir. Bir model/jeton hatası görülürse Vercel Function Logs ve Google AI Studio'daki API erişimini kontrol et.
- Mevcut /api/chat yazılı sohbet fonksiyonunu değiştirmez; yeni rota yalnızca /api/live-token'dır.
- Sesli görüşmeyi bitirmek için Görüşmeyi Bitir düğmesine bas.
