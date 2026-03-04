// AgroPi Marketplace — Profil Tamamlama Ekranı
// Pi girişi sonrası kullanıcının meslek kategorisini ve bilgilerini girdiği ekran

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
    Animated,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import Renkler from '../tema/renkler';

// Güncellenmiş meslek kategorileri — 4 uzmanlık alanı
const KATEGORILER = [
    { id: 'topraksiz', emoji: '🌱', ad: 'Topraksız Tarım Uzmanı' },
    { id: 'ziraat', emoji: '🌾', ad: 'Ziraat Mühendisi' },
    { id: 'teknisyen', emoji: '🔧', ad: 'Tarım Teknisyeni' },
    { id: 'mudur', emoji: '🏭', ad: 'Üretim Müdürü' },
];

export default function ProfilTamamlamaEkrani({ navigation, route }) {
    const { piKullanici } = route.params || {};

    const [seciliKategori, setSeciliKategori] = useState(null);
    const [adSoyad, setAdSoyad] = useState('');
    const [konum, setKonum] = useState('');
    const [biyografi, setBiyografi] = useState('');

    // 4 yeni alan
    const [usdUcret, setUsdUcret] = useState('');
    const [hizmetBolgesi, setHizmetBolgesi] = useState('');
    const [deneyimYili, setDeneyimYili] = useState('');
    const [referansProje, setReferansProje] = useState('');

    const [yukleniyor, setYukleniyor] = useState(false);

    const soluklamaAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(soluklamaAnim, {
            toValue: 1, duration: 500, useNativeDriver: true,
        }).start();
    }, []);

    const profilKaydet = async () => {
        if (!seciliKategori) {
            Alert.alert('Eksik Bilgi', 'Lütfen bir meslek kategorisi seçin.');
            return;
        }
        if (!adSoyad.trim()) {
            Alert.alert('Eksik Bilgi', 'Lütfen adınızı girin.');
            return;
        }

        setYukleniyor(true);
        try {
            const kullaniciId = piKullanici?.kullaniciId || `pi_${Date.now()}`;

            const profilVerisi = {
                piKullaniciAdi: piKullanici?.kullaniciAdi || '',
                kullaniciId,
                ad: adSoyad.trim(),
                kategori: seciliKategori.ad,
                kategoriId: seciliKategori.id,
                kategoriEmoji: seciliKategori.emoji,
                konum: konum.trim(),
                biyografi: biyografi.trim(),
                // 4 yeni alan
                usdUcret: usdUcret ? parseFloat(usdUcret) : 0,
                hizmetBolgesi: hizmetBolgesi.trim(),
                deneyimYili: deneyimYili ? parseInt(deneyimYili, 10) : 0,
                referansProje: referansProje.trim(),
                // Meta
                puan: 0,
                yorumSayisi: 0,
                aktif: true,
                olusturmaTarihi: serverTimestamp(),
            };

            // Firestore'a kaydet (db null ise konsol log ile devam eder)
            if (db) {
                await setDoc(doc(db, 'uzmanlar', kullaniciId), profilVerisi);
                console.log('[AgroPi] Profil Firestore\'a kaydedildi:', kullaniciId);
            } else {
                console.log('[AgroPi] Firebase offline — profil konsola yazıldı:', profilVerisi);
            }

            navigation.replace('AnaTabs');
        } catch (hata) {
            console.error('[AgroPi] Profil kayıt hatası:', hata);
            Alert.alert('Hata', 'Profil kaydedilemedi. Tekrar deneyin.');
        } finally {
            setYukleniyor(false);
        }
    };

    return (
        <View style={stiller.kapsayici}>
            <StatusBar barStyle="light-content" backgroundColor={Renkler.zeminkk} />
            <ScrollView
                contentContainerStyle={stiller.kaydirma}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View style={{ opacity: soluklamaAnim }}>
                    {/* Başlık */}
                    <View style={stiller.baslik}>
                        <Text style={stiller.merhaba}>
                            Merhaba, {piKullanici?.kullaniciAdi || 'Kullanıcı'} 👋
                        </Text>
                        <Text style={stiller.baslikMetin}>Profilinizi Oluşturun</Text>
                        <Text style={stiller.altBaslik}>
                            Pi ekosistemindeki diğer profesyoneller sizi bulsun
                        </Text>
                    </View>

                    {/* Kategori Seçimi */}
                    <Text style={stiller.etiket}>Meslek Kategorisi *</Text>
                    <View style={stiller.kategoriIzgara}>
                        {KATEGORILER.map((kat) => (
                            <TouchableOpacity
                                key={kat.id}
                                style={[
                                    stiller.kategoriKart,
                                    seciliKategori?.id === kat.id && stiller.kategoriSecili,
                                ]}
                                onPress={() => setSeciliKategori(kat)}
                                activeOpacity={0.75}
                            >
                                <Text style={stiller.kategoriEmoji}>{kat.emoji}</Text>
                                <Text
                                    style={[
                                        stiller.kategoriAd,
                                        seciliKategori?.id === kat.id && stiller.kategoriAdSecili,
                                    ]}
                                    numberOfLines={2}
                                >
                                    {kat.ad}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Ad Soyad */}
                    <Text style={stiller.etiket}>Ad Soyad *</Text>
                    <TextInput
                        style={stiller.input}
                        value={adSoyad}
                        onChangeText={setAdSoyad}
                        placeholder="Adınızı girin"
                        placeholderTextColor={Renkler.metinFade}
                    />

                    {/* Konum */}
                    <Text style={stiller.etiket}>Konum</Text>
                    <TextInput
                        style={stiller.input}
                        value={konum}
                        onChangeText={setKonum}
                        placeholder="Şehir, Bölge (örn. İzmir, Ege)"
                        placeholderTextColor={Renkler.metinFade}
                    />

                    {/* YENİ — Saatlik USD Ücreti */}
                    <Text style={stiller.etiket}>Saatlik Danışmanlık Ücreti (USD)</Text>
                    <View style={stiller.ucretSarici}>
                        <Text style={stiller.dovizSimge}>$</Text>
                        <TextInput
                            style={stiller.ucretInput}
                            value={usdUcret}
                            onChangeText={setUsdUcret}
                            placeholder="0.00"
                            placeholderTextColor={Renkler.metinFade}
                            keyboardType="decimal-pad"
                        />
                        <Text style={stiller.saatMetin}>/saat</Text>
                    </View>

                    {/* YENİ — Hizmet Bölgesi */}
                    <Text style={stiller.etiket}>Hizmet Bölgesi</Text>
                    <TextInput
                        style={stiller.input}
                        value={hizmetBolgesi}
                        onChangeText={setHizmetBolgesi}
                        placeholder="örn. Ege, Akdeniz, Tüm Türkiye"
                        placeholderTextColor={Renkler.metinFade}
                    />

                    {/* YENİ — Deneyim Yılı */}
                    <Text style={stiller.etiket}>Deneyim Yılı</Text>
                    <TextInput
                        style={stiller.input}
                        value={deneyimYili}
                        onChangeText={setDeneyimYili}
                        placeholder="örn. 8"
                        placeholderTextColor={Renkler.metinFade}
                        keyboardType="number-pad"
                    />

                    {/* YENİ — Referans Proje */}
                    <Text style={stiller.etiket}>Referans Proje İsmi</Text>
                    <TextInput
                        style={stiller.input}
                        value={referansProje}
                        onChangeText={setReferansProje}
                        placeholder="Öne çıkan bir projenizin adı"
                        placeholderTextColor={Renkler.metinFade}
                    />

                    {/* Kısa Biyografi */}
                    <Text style={stiller.etiket}>Kısa Biyografi</Text>
                    <TextInput
                        style={[stiller.input, stiller.inputCokSatir]}
                        value={biyografi}
                        onChangeText={setBiyografi}
                        placeholder="Kendinizi kısaca tanıtın..."
                        placeholderTextColor={Renkler.metinFade}
                        multiline
                        numberOfLines={3}
                    />

                    {/* Kaydet Butonu */}
                    <TouchableOpacity
                        style={stiller.kaydetButon}
                        onPress={profilKaydet}
                        disabled={yukleniyor}
                        activeOpacity={0.8}
                    >
                        {yukleniyor ? (
                            <ActivityIndicator color={Renkler.zeminkk} />
                        ) : (
                            <Text style={stiller.kaydetMetin}>🌾 Marketplace'e Gir</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const stiller = StyleSheet.create({
    kapsayici: { flex: 1, backgroundColor: Renkler.zemin },
    kaydirma: { padding: 24, paddingTop: 60 },

    baslik: { marginBottom: 32 },
    merhaba: { fontSize: 15, color: Renkler.piAltin, fontWeight: '600', marginBottom: 6 },
    baslikMetin: { fontSize: 26, fontWeight: '800', color: Renkler.metinAna, marginBottom: 8 },
    altBaslik: { fontSize: 14, color: Renkler.metinIkincil, lineHeight: 20 },

    etiket: {
        fontSize: 13,
        fontWeight: '700',
        color: Renkler.metinIkincil,
        marginBottom: 10,
        marginTop: 20,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    // Kategori kartları — tam genişlik (2 sütun)
    kategoriIzgara: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 8,
    },
    kategoriKart: {
        width: '47%',
        backgroundColor: Renkler.kartZemin,
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Renkler.ayirici,
    },
    kategoriSecili: {
        borderColor: Renkler.piAltin,
        backgroundColor: Renkler.yarimSeffafAltin,
    },
    kategoriEmoji: { fontSize: 28, marginBottom: 8 },
    kategoriAd: {
        fontSize: 12,
        fontWeight: '600',
        color: Renkler.metinIkincil,
        textAlign: 'center',
    },
    kategoriAdSecili: { color: Renkler.piAltin },

    // Inputlar
    input: {
        backgroundColor: Renkler.girdiZemin,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: Renkler.metinAna,
        borderWidth: 1,
        borderColor: Renkler.ayirici,
    },
    inputCokSatir: { height: 90, textAlignVertical: 'top', paddingTop: 12 },

    // USD ücret satırı
    ucretSarici: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Renkler.girdiZemin,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Renkler.ayirici,
        overflow: 'hidden',
    },
    dovizSimge: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 20,
        color: '#4CAF50',
        fontWeight: '800',
        borderRightWidth: 1,
        borderRightColor: Renkler.ayirici,
    },
    ucretInput: {
        flex: 1,
        paddingHorizontal: 14,
        fontSize: 18,
        color: Renkler.metinAna,
        fontWeight: '600',
    },
    saatMetin: {
        paddingHorizontal: 12,
        fontSize: 13,
        color: Renkler.metinFade,
    },

    // Kaydet butonu
    kaydetButon: {
        backgroundColor: Renkler.piAltin,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 20,
        shadowColor: Renkler.piAltin,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 8,
    },
    kaydetMetin: {
        fontSize: 16,
        fontWeight: '800',
        color: Renkler.zeminkk,
        letterSpacing: 0.3,
    },
});
