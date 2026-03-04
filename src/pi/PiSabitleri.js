// AgroPi Marketplace — Pi Network Sabitleri
// AgroPi-v2 reposundaki ortam yönetimi mantığı buraya taşındı
// APP_ID ve BACKEND_URL gerçek değerlerle güncellendi

export const PiSabitleri = {
    // Pi Developer Portal uygulaması — gerçek APP_ID
    APP_ID: '68a6fed62cb50254172b6593',

    // Ortam modu: 'sandbox' | 'production'
    // AgroPi-v2'deki ?env=sandbox / ?env=prod mantığının React Native karşılığı
    ORTAM: 'sandbox', // Canlıya geçerken 'production' yapın

    // AgroPi Marketplace Backend URL (Pi App Engine)
    BACKEND_URL: 'https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com',

    // Pi resmi API adresi
    PI_API_URL: 'https://api.minepi.com',

    // Pi Browser'ı tanımlamak için user-agent parçası
    PI_BROWSER_UA: 'PiBrowser',

    // İstenen kullanıcı izinleri
    IZINLER: ['username', 'payments', 'wallet_address'],

    // Minimum danışmanlık ücreti (Pi cinsinden)
    MIN_UCRET_PI: 0.1,

    // Platform komisyonu (%)
    PLATFORM_KOMISYON: 5,
};

export default PiSabitleri;
