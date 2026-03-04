# AgroPi Marketplace 🌾π

> Pi ekosisteminin tarım profesyonelleri için **Sarı Sayfalar** platformu.

Pi Network hesabınızla giriş yapın. Ziraat mühendislerini, veterinerleri, tarım danışmanlarını bulun ve danışmanlık ücretlerini **Pi Token** ile ödeyin.

---

## 📁 Proje Yapısı

```
AgroPi-Marketplace/
├── App.js
├── app.json
├── package.json
└── src/
    ├── pi/
    │   ├── PiSabitleri.js        ← APP_ID + Backend URL (✅ gerçek değerler)
    │   ├── PiSDKKoprusu.js       ← Pi.authenticate() + Pi.createPayment()
    │   └── PiOdemeIsleyici.js    ← Approve/Complete → Pi App Engine
    ├── config/
    │   └── firebase.js           ← Firestore (kullanicilar, uzmanlar, odemeler)
    ├── tema/
    │   ├── renkler.js            ← Pi Gold + Pi Purple + Agro Green
    │   └── tipografi.js
    ├── navigasyon/
    │   └── AppNavigator.js       ← Auth Stack + Bottom Tab Navigator
    ├── ekranlar/
    │   ├── GirisEkrani.js        ← Pi ile Giriş Yap (mock mod dahil)
    │   ├── ProfilTamamlamaEkrani.js ← Meslek kategorisi + bilgi girişi
    │   ├── MarketplaceEkrani.js  ← Sarı Sayfalar — arama + filtre + liste
    │   ├── UzmanDetayEkrani.js   ← Profil detay + Pi ödeme butonu
    │   └── ProfilEkrani.js       ← Kendi profilim + bağlantı bilgileri
    └── bilesanler/
        ├── UzmanKarti.js         ← Sarı Sayfalar liste kartı
        ├── KategoriCipi.js       ← Filtre etiketi
        └── PiOdemeModal.js       ← Saat seçimi + komisyon hesabı + Pi öde
```

---

## ⚙️ Pi Network Yapılandırması

| Değer | Açıklama |
|---|---|
| `APP_ID` | `68a6fed62cb50254172b6593` |
| `BACKEND_URL` | `https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com` |
| `ORTAM` | `sandbox` → canlıya geçerken `production` yapın |

> Referans: [github.com/umutcetiner07/AgroPi-v2](https://github.com/umutcetiner07/AgroPi-v2)

---

## 🚀 Kurulum

```bash
# 1. Node.js yükle: https://nodejs.org
# 2. Bağımlılıkları yükle
cd AgroPi-Marketplace
npm install

# 3. Firebase config → src/config/firebase.js içine kendi değerlerini gir

# 4. Başlat
npx expo start
```

---

## 📱 Uygulama Akışı

```
GirisEkrani (π ile Giriş)
    ↓
ProfilTamamlamaEkrani (Kategori + Bilgiler)
    ↓
┌─────────────────────────┐
│  Bottom Tab Navigator   │
│  🌾 Marketplace (Sarı Sayfalar) │
│  👤 Profilim            │
└─────────────────────────┘
          ↓
    UzmanDetayEkrani
          ↓
    PiOdemeModal → π TRANSFER
```

---

## 💡 Geliştirici Notu

Pi Browser dışında (Expo Go veya emülatör) uygulamayı açtığınızda **mock mod** otomatik devreye girer — gerçek Pi Network olmadan tüm akışı test edebilirsiniz. Tıpkı AgroPi-v2'deki localhost mock mantığı gibi.
