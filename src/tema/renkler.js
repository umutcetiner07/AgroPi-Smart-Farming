// AgroPi Marketplace — Renk Paleti
// Pi Network renk diliyle uyumlu, premium koyu tema

export const Renkler = {
    // Pi Network renkleri
    piAltin: '#F0C040',          // Pi'nin altın sarısı — birincil akcent
    piAltinKoyu: '#C8960A',      // Koyu altın — basılı/hover
    piMor: '#6C3FC5',            // Pi mor — ikincil vurgu
    piMorAcik: '#9B72E8',        // Açık mor — gradient üst

    // Agro yeşili (AgroPi markası)
    agroYesil: '#2D6A4F',        // Tarım yeşili
    agroYesilAcik: '#52B788',    // Açık yeşil akcent

    // Zemin renkleri (derin koyu mor-siyah)
    zeminkk: '#0A0514',          // En koyu
    zemin: '#12091F',            // Ana ekran zemini
    kartZemin: '#1C1230',        // Kart arka planı
    girdiZemin: '#231844',       // Input zemin
    ayirici: '#2A1D52',          // Bölücü/kenarlık

    // Metin
    metinAna: '#F0EBF8',         // Açık beyazımsı
    metinIkincil: '#B8A8D8',     // Soluk mor-beyaz
    metinFade: '#7A6A9A',        // Çok soluk yardımcı metin

    // Sistem
    basarili: '#4CAF50',
    hata: '#EF5350',
    uyari: '#FF9800',
    bilgi: '#42A5F5',

    // Gradyanlar (LinearGradient için dizi)
    gradyanPiAltin: ['#F0C040', '#C8960A'],
    gradyanPiMor: ['#9B72E8', '#6C3FC5'],
    gradyanKaranlik: ['#1C1230', '#12091F'],
    gradyanHero: ['#6C3FC5', '#12091F'],

    // Yardımcı
    beyaz: '#FFFFFF',
    seffaf: 'transparent',
    yarimSeffafBeyaz: 'rgba(255, 255, 255, 0.08)',
    yarimSeffafAltin: 'rgba(240, 192, 64, 0.15)',
    yarimSeffafMor: 'rgba(108, 63, 197, 0.2)',
};

export default Renkler;
