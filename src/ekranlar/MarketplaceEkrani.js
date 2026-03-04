// AgroPi Marketplace — Ana Marketplace Ekranı (Sarı Sayfalar)
// Pi ekosistemindeki tarım profesyonellerinin listelendiği keşif ekranı

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    TextInput,
    Animated,
    ScrollView,
} from 'react-native';
import Renkler from '../tema/renkler';
import UzmanKarti from '../bilesanler/UzmanKarti';
import KategoriCipi from '../bilesanler/KategoriCipi';

// Demo uzman verisi — 4 yeni kategori + 4 yeni alan (Firebase Firestore'dan gelecek)
const DEMO_UZMANLAR = [
    {
        id: '1',
        ad: 'Dr. Ayşe Kaya',
        kategori: 'Ziraat Mühendisi',
        kategoriEmoji: '🌾',
        konum: 'İzmir',
        puan: 4.9,
        yorumSayisi: 47,
        ucret: 2.5,
        biyografi: 'Toprak analizi ve sulama sistemleri uzmanı. 12 yıl saha deneyimi.',
        aktif: true,
        piKullaniciAdi: 'aysekaya_pi',
        usdUcret: 45,
        hizmetBolgesi: 'Ege, İç Anadolu',
        deneyimYili: 12,
        referansProje: 'Ege Zeytin Tarlaları Sulama Projesi',
    },
    {
        id: '2',
        ad: 'Murat Demir',
        kategori: 'Topraksız Tarım Uzmanı',
        kategoriEmoji: '🌱',
        konum: 'Konya',
        puan: 4.7,
        yorumSayisi: 31,
        ucret: 1.8,
        biyografi: 'Hidroponik ve aeroponik sistemler kurulum ve yönetim uzmanı.',
        aktif: true,
        piKullaniciAdi: 'muratdemir_pi',
        usdUcret: 35,
        hizmetBolgesi: 'İç Anadolu, Tüm Türkiye (Uzaktan)',
        deneyimYili: 8,
        referansProje: 'Konya Büyükşehir Dikey Tarım Tesisi',
    },
    {
        id: '3',
        ad: 'Fatma Erdoğan',
        kategori: 'Tarım Teknisyeni',
        kategoriEmoji: '🔧',
        konum: 'Muğla',
        puan: 4.8,
        yorumSayisi: 22,
        ucret: 1.2,
        biyografi: 'Sera ekipmanları kurulumu, bakımı ve arıza tespiti konusunda uzman.',
        aktif: false,
        piKullaniciAdi: 'fatmaerdogan_pi',
        usdUcret: 25,
        hizmetBolgesi: 'Ege, Akdeniz',
        deneyimYili: 6,
        referansProje: 'Muğla Organize Sera Bölgesi Teknik Destek',
    },
    {
        id: '4',
        ad: 'Kemal Yıldız',
        kategori: 'Üretim Müdürü',
        kategoriEmoji: '🏭',
        konum: 'Ankara',
        puan: 4.6,
        yorumSayisi: 58,
        ucret: 3.0,
        biyografi: 'Büyük ölçekli sera üretim süreçleri planlama ve ekip yönetimi.',
        aktif: true,
        piKullaniciAdi: 'kemalyildiz_pi',
        usdUcret: 60,
        hizmetBolgesi: 'Tüm Türkiye',
        deneyimYili: 15,
        referansProje: 'TARSİM Domates Sera Kompleksi (500 da)',
    },
    {
        id: '5',
        ad: 'Hasan Çelik',
        kategori: 'Tarım Teknisyeni',
        kategoriEmoji: '🔧',
        konum: 'Şanlıurfa',
        puan: 4.5,
        yorumSayisi: 18,
        ucret: 0.8,
        biyografi: 'Damla sulama ve gübreleme sistemleri kurulum ve bakım uzmanı.',
        aktif: true,
        piKullaniciAdi: 'hasancelik_pi',
        usdUcret: 20,
        hizmetBolgesi: 'Güneydoğu Anadolu (GAP Bölgesi)',
        deneyimYili: 9,
        referansProje: 'GAP Sulama Modernizasyon Projesi',
    },
    {
        id: '6',
        ad: 'Selin Aydın',
        kategori: 'Topraksız Tarım Uzmanı',
        kategoriEmoji: '🌱',
        konum: 'Bursa',
        puan: 4.9,
        yorumSayisi: 35,
        ucret: 2.0,
        biyografi: 'NFT ve DWC hidroponik sistemlerde marul, fesleğen ve çilek üretimi.',
        aktif: true,
        piKullaniciAdi: 'selinaydin_pi',
        usdUcret: 50,
        hizmetBolgesi: 'Marmara, Uzaktan Danışmanlık',
        deneyimYili: 11,
        referansProje: 'Bursa Sofralık Çilek Hidroponik Çiftliği',
    },
];

const KATEGORILER = [
    { id: 'hepsi', emoji: '✨', ad: 'Hepsi' },
    { id: 'topraksiz', emoji: '🌱', ad: 'Topraksız Tarım' },
    { id: 'ziraat', emoji: '🌾', ad: 'Ziraat Müh.' },
    { id: 'teknisyen', emoji: '🔧', ad: 'Teknisyen' },
    { id: 'mudur', emoji: '🏭', ad: 'Üretim Müdürü' },
];

export default function MarketplaceEkrani({ navigation }) {
    const [aramaMetni, setAramaMetni] = useState('');
    const [seciliKategori, setSeciliKategori] = useState('hepsi');
    const baslikOpak = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(baslikOpak, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, []);

    // Arama + kategori filtresi
    const filtreliUzmanlar = DEMO_UZMANLAR.filter((u) => {
        const aramaUyumu =
            aramaMetni.length === 0 ||
            u.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
            u.kategori.toLowerCase().includes(aramaMetni.toLowerCase()) ||
            u.konum.toLowerCase().includes(aramaMetni.toLowerCase()) ||
            (u.hizmetBolgesi || '').toLowerCase().includes(aramaMetni.toLowerCase());

        const kategoriUyumu =
            seciliKategori === 'hepsi' ||
            u.kategori.toLowerCase().includes(
                KATEGORILER.find((k) => k.id === seciliKategori)?.ad.toLowerCase().replace('.', '') || ''
            );

        return aramaUyumu && kategoriUyumu;
    });

    const uzmanDetayGit = (uzman) => {
        navigation.navigate('UzmanDetay', { uzman });
    };

    return (
        <View style={stiller.kapsayici}>
            <StatusBar barStyle="light-content" backgroundColor={Renkler.zeminkk} />

            {/* Üst başlık */}
            <Animated.View style={[stiller.ustBolum, { opacity: baslikOpak }]}>
                <View style={stiller.baslikSatiri}>
                    <View>
                        <Text style={stiller.baslik}>Sarı Sayfalar 🌾</Text>
                        <Text style={stiller.altBaslik}>
                            {filtreliUzmanlar.length} profesyonel bulundu
                        </Text>
                    </View>
                    <View style={stiller.piRozet}>
                        <Text style={stiller.piRozetMetin}>π</Text>
                    </View>
                </View>

                {/* Arama çubuğu */}
                <View style={stiller.aramaSarici}>
                    <Text style={stiller.aramaIkon}>🔍</Text>
                    <TextInput
                        style={stiller.aramaInput}
                        value={aramaMetni}
                        onChangeText={setAramaMetni}
                        placeholder="İsim, uzmanlık, konum veya bölge ara..."
                        placeholderTextColor={Renkler.metinFade}
                    />
                    {aramaMetni.length > 0 && (
                        <TouchableOpacity onPress={() => setAramaMetni('')}>
                            <Text style={stiller.temizle}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Kategori filtreleri */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={stiller.kategoriKaydirma}
                >
                    {KATEGORILER.map((kat) => (
                        <KategoriCipi
                            key={kat.id}
                            emoji={kat.emoji}
                            ad={kat.ad}
                            secili={seciliKategori === kat.id}
                            onPress={() => setSeciliKategori(kat.id)}
                        />
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Uzman listesi */}
            <FlatList
                data={filtreliUzmanlar}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <UzmanKarti
                        uzman={item}
                        onBasildi={() => uzmanDetayGit(item)}
                        gecikme={index * 80}
                    />
                )}
                contentContainerStyle={stiller.listeIcerik}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={stiller.bos}>
                        <Text style={stiller.bosEmoji}>🔍</Text>
                        <Text style={stiller.bosMetin}>Sonuç bulunamadı</Text>
                        <Text style={stiller.bosAlt}>Farklı bir arama deneyin</Text>
                    </View>
                }
            />
        </View>
    );
}

const stiller = StyleSheet.create({
    kapsayici: { flex: 1, backgroundColor: Renkler.zemin },

    // Üst bölüm
    ustBolum: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 8,
        backgroundColor: Renkler.zemin,
        borderBottomWidth: 1,
        borderBottomColor: Renkler.ayirici,
    },
    baslikSatiri: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    baslik: { fontSize: 24, fontWeight: '800', color: Renkler.metinAna },
    altBaslik: { fontSize: 13, color: Renkler.metinFade, marginTop: 2 },
    piRozet: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Renkler.yarimSeffafAltin,
        borderWidth: 1.5,
        borderColor: Renkler.piAltin,
        justifyContent: 'center',
        alignItems: 'center',
    },
    piRozetMetin: { fontSize: 20, color: Renkler.piAltin, fontWeight: '900' },

    // Arama
    aramaSarici: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Renkler.girdiZemin,
        borderRadius: 14,
        paddingHorizontal: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: Renkler.ayirici,
    },
    aramaIkon: { fontSize: 16, marginRight: 8 },
    aramaInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: Renkler.metinAna },
    temizle: { fontSize: 14, color: Renkler.metinFade, padding: 4 },

    // Kategori kaydırma
    kategoriKaydirma: { paddingVertical: 8, gap: 8 },

    // Liste
    listeIcerik: { padding: 16, paddingTop: 12 },
    bos: { alignItems: 'center', paddingTop: 60 },
    bosEmoji: { fontSize: 48, marginBottom: 16 },
    bosMetin: { fontSize: 18, fontWeight: '700', color: Renkler.metinIkincil },
    bosAlt: { fontSize: 13, color: Renkler.metinFade, marginTop: 6 },
});
