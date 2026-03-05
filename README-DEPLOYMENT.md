# AgroPi Marketplace - Canlıya Geçiş Kılavuzu

## 🚀 Hızlı Yayınlama

### Vercel ile Tek Tıkla Yayınlama (Önerilen)

1. **GitHub'a Push Et:**
   ```bash
   git add .
   git commit -m "Production build hazır"
   git push origin main
   ```

2. **Vercel'e Import Et:**
   - [vercel.com](https://vercel.com) sitesine git
   - "Import Project" de
   - GitHub reposunu seç
   - Framework: "Other" (Expo Web)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Otomatik Yayınlama:**
   - Her push'ta otomatik build ve yayınlanır
   - URL: `https://agropi-marketplace.vercel.app`

### Firebase Hosting ile Yayınlama

1. **Firebase CLI Kurulum:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Build ve Deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

3. **URL:**
   - `https://agropi-marketplace.web.app`

## 📱 Pi Browser Entegrasyonu

Uygulama yayınlandıktan sonra:

1. **Pi Developer Portal:**
   - App ID: `68a6fed62cb50254172b6593`
   - Production URL: `https://agropi-marketplace.vercel.app`
   - Status: "Published" olarak güncelle

2. **Pi Browser Test:**
   - Pi Browser'ı aç
   - Uygulama URL'sini gir
   - Pi Network ile giriş test et

## 🔧 Build Komutları

```bash
# Geliştirme
npm run web

# Production Build
npm run build

# Expo Web Build
npm run build:web
```

## 📁 Dosya Yapısı

```
AgroPi-Marketplace/
├── vercel.json          # Vercel konfigürasyonu
├── firebase.json         # Firebase Hosting konfigürasyonu
├── package.json         # Build komutları eklendi
├── app.json            # Web build ayarları
└── dist/               # Build çıktısı (oluşturulacak)
```

## ✅ Kontrol Listesi

- [x] package.json build komutları
- [x] vercel.json konfigürasyonu  
- [x] firebase.json konfigürasyonu
- [x] app.json web ayarları
- [x] Pi Network SDK entegrasyonu
- [x] Firebase Firestore bağlantısı
- [ ] GitHub'a push
- [ ] Vercel/Firebase deploy
- [ ] Pi Developer Portal güncelleme

## 🌐 URL'ler

- **Vercel:** `https://vercel.com/agropi-marketplace`
- **Firebase:** `https://console.firebase.google.com`
- **Pi Developer:** `https://developers.minepi.com`

Uygulama hazır! 🎉
