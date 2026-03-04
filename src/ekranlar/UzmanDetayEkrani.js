// AgroPi Marketplace — Uzman Detay Ekranı
// Uzmanın profil detayları ve "Pi ile Danışmanlık Al" ödeme akışı

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Animated,
    Alert,
} from 'react-native';
import { odemeBaslat } from '../pi/PiSDKKoprusu';
import Renkler from '../tema/renkler';
import PiOdemeModal from '../bilesanler/PiOdemeModal';

export default function UzmanDetayEkrani({ navigation, route }) {
    const { uzman } = route.params;
    const [modalAcik, setModalAcik] = useState(false);
    const [odemeYukleniyor, setOdemeYukleniyor] = useState(false);

    const soluklamaAnim = useRef(new Animated.Value(0)).current;
    const yukarıAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(soluklamaAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(yukarıAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start();
    }, []);

    const odemeBaslatFunc = async (saat) => {
        setModalAcik(false);
        setOdemeYukleniyor(true);

        const toplamUcret = uzman.ucret * saat;

        try {
            const sonuc = await odemeBaslat({
                miktar: toplamUcret,
                aciklama: `AgroPi Danışmanlık — ${uzman.ad} (${saat} saat)`,
                aliciKullaniciId: uzman.piKullaniciAdi,
                uygMetaVeri: { uzmanId: uzman.id, saat },
            });

            Alert.alert(
                '✅ Ödeme Başarılı!',
                `${toplamUcret} π olarak danışmanlık rezervasyonunuz alındı.\nTX: ${sonuc.txId || 'mock_tx'}`,
                [{ text: 'Harika!' }]
            );
        } catch (hata) {
            if (hata?.iptal) {
                Alert.alert('İptal Edildi', 'Ödeme işlemi iptal edildi.');
            } else {
                Alert.alert('Ödeme Hatası', 'İşlem gerçekleştirilemedi. Tekrar deneyin.');
            }
        } finally {
            setOdemeYukleniyor(false);
        }
    };

    return (
        <View style={stiller.kapsayici}>
            <StatusBar barStyle="light-content" />

            {/* Geri butonu */}
            <TouchableOpacity style={stiller.geriButon} onPress={() => navigation.goBack()}>
                <Text style={stiller.geriMetin}>← Geri</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Animated.View
                    style={{ opacity: soluklamaAnim, transform: [{ translateY: yukarıAnim }] }}
                >
                    {/* Profil header */}
                    <View style={stiller.header}>
                        <View style={stiller.avatarBuyuk}>
                            <Text style={stiller.avatarEmoji}>{uzman.kategoriEmoji}</Text>
                        </View>
                        <Text style={stiller.isim}>{uzman.ad}</Text>
                        <View style={stiller.kategoriEtiketi}>
                            <Text style={stiller.kategoriMetin}>{uzman.kategori}</Text>
                        </View>
                        <Text style={stiller.konumMetin}>📍 {uzman.konum}</Text>

                        {/* Pi kullanıcı adı */}
                        <View style={stiller.piKullaniciSatiri}>
                            <Text style={stiller.piSimge}>π</Text>
                            <Text style={stiller.piKullaniciAdi}>{uzman.piKullaniciAdi}</Text>
                        </View>
                    </View>

                    {/* İstatistikler */}
                    <View style={stiller.istatistikler}>
                        <View style={stiller.istatKutu}>
                            <Text style={stiller.istatDeger}>{uzman.puan}</Text>
                            <Text style={stiller.istatEtiket}>⭐ Puan</Text>
                        </View>
                        <View style={stiller.ayiriciDik} />
                        <View style={stiller.istatKutu}>
                            <Text style={stiller.istatDeger}>{uzman.yorumSayisi}</Text>
                            <Text style={stiller.istatEtiket}>Yorum</Text>
                        </View>
                        <View style={stiller.ayiriciDik} />
                        <View style={stiller.istatKutu}>
                            <Text style={[stiller.istatDeger, { color: Renkler.piAltin }]}>
                                π {uzman.ucret}
                            </Text>
                            <Text style={stiller.istatEtiket}>/saat</Text>
                        </View>
                    </View>

                    {/* Hakkında */}
                    <View style={stiller.bolum}>
                        <Text style={stiller.bolumBaslik}>Hakkında</Text>
                        <Text style={stiller.biyografi}>{uzman.biyografi}</Text>
                    </View>

                    {/* Durum */}
                    <View style={stiller.durumSatiri}>
                        <View style={[stiller.durumNokta, uzman.aktif ? stiller.aktif : stiller.pasif]} />
                        <Text style={[stiller.durumMetin, { color: uzman.aktif ? Renkler.basarili : Renkler.metinFade }]}>
                            {uzman.aktif ? 'Şu an müsait' : 'Şu an meşgul'}
                        </Text>
                    </View>

                    {/* Spacer */}
                    <View style={{ height: 140 }} />
                </Animated.View>
            </ScrollView>

            {/* Pi ile Danışmanlık Al butonu */}
            <View style={stiller.altButonAlan}>
                <View style={stiller.fiyatGoster}>
                    <Text style={stiller.fiyatLabel}>Saat başı</Text>
                    <Text style={stiller.fiyatDeger}>π {uzman.ucret}</Text>
                </View>
                <TouchableOpacity
                    style={[stiller.odemeButon, odemeYukleniyor && { opacity: 0.6 }]}
                    onPress={() => setModalAcik(true)}
                    disabled={!uzman.aktif || odemeYukleniyor}
                    activeOpacity={0.8}
                >
                    <Text style={stiller.piButonSimge}>π</Text>
                    <Text style={stiller.odemeButonMetin}>
                        {uzman.aktif ? 'Pi ile Danışmanlık Al' : 'Şu an müsait değil'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Pi Ödeme Modalı */}
            <PiOdemeModal
                gorunur={modalAcik}
                uzman={uzman}
                onOnayla={odemeBaslatFunc}
                onIptal={() => setModalAcik(false)}
            />
        </View>
    );
}

const stiller = StyleSheet.create({
    kapsayici: { flex: 1, backgroundColor: Renkler.zemin },
    geriButon: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 8 },
    geriMetin: { fontSize: 16, color: Renkler.piAltin, fontWeight: '600' },

    // Header
    header: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: Renkler.ayirici,
    },
    avatarBuyuk: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Renkler.yarimSeffafAltin,
        borderWidth: 2,
        borderColor: Renkler.piAltin,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: Renkler.piAltin,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 6,
    },
    avatarEmoji: { fontSize: 46 },
    isim: { fontSize: 24, fontWeight: '800', color: Renkler.metinAna, marginBottom: 8 },
    kategoriEtiketi: {
        backgroundColor: Renkler.yarimSeffafAltin,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: Renkler.piAltin,
        marginBottom: 8,
    },
    kategoriMetin: { fontSize: 13, color: Renkler.piAltin, fontWeight: '700' },
    konumMetin: { fontSize: 14, color: Renkler.metinFade, marginBottom: 10 },
    piKullaniciSatiri: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    piSimge: { fontSize: 14, color: Renkler.piMorAcik, fontWeight: '800' },
    piKullaniciAdi: { fontSize: 13, color: Renkler.piMorAcik },

    // İstatistikler
    istatistikler: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: Renkler.kartZemin,
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 16,
        paddingVertical: 18,
        borderWidth: 1,
        borderColor: Renkler.ayirici,
    },
    istatKutu: { alignItems: 'center' },
    istatDeger: { fontSize: 22, fontWeight: '800', color: Renkler.metinAna },
    istatEtiket: { fontSize: 12, color: Renkler.metinFade, marginTop: 2 },
    ayiriciDik: { width: 1, height: 36, backgroundColor: Renkler.ayirici },

    // Bölüm
    bolum: { paddingHorizontal: 24, paddingTop: 24 },
    bolumBaslik: {
        fontSize: 14,
        fontWeight: '700',
        color: Renkler.metinIkincil,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    biyografi: { fontSize: 15, color: Renkler.metinAna, lineHeight: 24 },

    // Durum
    durumSatiri: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 16,
        gap: 8,
    },
    durumNokta: { width: 10, height: 10, borderRadius: 5 },
    aktif: { backgroundColor: Renkler.basarili },
    pasif: { backgroundColor: Renkler.metinFade },
    durumMetin: { fontSize: 14, fontWeight: '600' },

    // Alt ödeme alanı
    altButonAlan: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Renkler.kartZemin,
        borderTopWidth: 1,
        borderTopColor: Renkler.ayirici,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    fiyatGoster: { flex: 1 },
    fiyatLabel: { fontSize: 11, color: Renkler.metinFade, marginBottom: 2 },
    fiyatDeger: { fontSize: 22, fontWeight: '800', color: Renkler.piAltin },
    odemeButon: {
        flex: 2,
        backgroundColor: Renkler.piAltin,
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: Renkler.piAltin,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    piButonSimge: { fontSize: 18, color: Renkler.zeminkk, fontWeight: '900' },
    odemeButonMetin: { fontSize: 14, fontWeight: '800', color: Renkler.zeminkk },
});
