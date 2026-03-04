// AgroPi Marketplace — Uzman Kart Bileşeni
// MarketplaceEkrani'ndaki FlatList'te kullanılan yeniden kullanılabilir kart
// Güncelleme: usdUcret, hizmetBolgesi, deneyimYili, referansProje chip'leri eklendi

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Renkler from '../tema/renkler';

export default function UzmanKarti({ uzman, onBasildi, gecikme = 0 }) {
    const yukarıAnim = useRef(new Animated.Value(30)).current;
    const soluklamaAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(yukarıAnim, {
                toValue: 0,
                duration: 400,
                delay: gecikme,
                useNativeDriver: true,
            }),
            Animated.timing(soluklamaAnim, {
                toValue: 1,
                duration: 400,
                delay: gecikme,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Yıldız derecelendirmesi render et
    const yildizlar = (puan) => {
        const tamYildiz = Math.floor(puan);
        return '⭐'.repeat(tamYildiz) + (puan % 1 >= 0.5 ? '✨' : '');
    };

    return (
        <Animated.View
            style={[
                stiller.sarici,
                { opacity: soluklamaAnim, transform: [{ translateY: yukarıAnim }] },
            ]}
        >
            <TouchableOpacity
                style={stiller.kart}
                onPress={onBasildi}
                activeOpacity={0.8}
            >
                {/* Üst satır: Avatar + İsim + Durum */}
                <View style={stiller.ustSatir}>
                    <View style={stiller.avatarDaire}>
                        <Text style={stiller.avatarEmoji}>{uzman.kategoriEmoji}</Text>
                    </View>
                    <View style={stiller.bilgiKolonu}>
                        <View style={stiller.isimSatiri}>
                            <Text style={stiller.isim} numberOfLines={1}>{uzman.ad}</Text>
                            <View style={[stiller.durumNoktasi, uzman.aktif ? stiller.aktif : stiller.pasif]} />
                        </View>
                        <Text style={stiller.kategori}>{uzman.kategori}</Text>
                        <Text style={stiller.konum}>📍 {uzman.konum}</Text>
                    </View>
                </View>

                {/* Biyografi */}
                <Text style={stiller.biyografi} numberOfLines={2}>
                    {uzman.biyografi}
                </Text>

                {/* Yeni bilgi chip'leri satırı */}
                <View style={stiller.chipSatiri}>
                    {uzman.deneyimYili > 0 && (
                        <View style={stiller.chip}>
                            <Text style={stiller.chipMetin}>📅 {uzman.deneyimYili} yıl</Text>
                        </View>
                    )}
                    {!!uzman.hizmetBolgesi && (
                        <View style={stiller.chip}>
                            <Text style={stiller.chipMetin} numberOfLines={1}>
                                📍 {uzman.hizmetBolgesi}
                            </Text>
                        </View>
                    )}
                    {uzman.usdUcret > 0 && (
                        <View style={[stiller.chip, stiller.chipYesil]}>
                            <Text style={[stiller.chipMetin, stiller.chipMetinYesil]}>
                                ${uzman.usdUcret}/sa
                            </Text>
                        </View>
                    )}
                </View>

                {/* Referans proje */}
                {!!uzman.referansProje && (
                    <View style={stiller.referansSatiri}>
                        <Text style={stiller.referansEtiket}>🏆 </Text>
                        <Text style={stiller.referansMetin} numberOfLines={1}>
                            {uzman.referansProje}
                        </Text>
                    </View>
                )}

                {/* Alt satır: Puan + Pi Ücreti */}
                <View style={stiller.altSatir}>
                    <View style={stiller.puanBolum}>
                        <Text style={stiller.yildizlar}>{yildizlar(uzman.puan)}</Text>
                        <Text style={stiller.puanMetin}>
                            {uzman.puan} ({uzman.yorumSayisi})
                        </Text>
                    </View>
                    <View style={stiller.ucretBolum}>
                        <Text style={stiller.ucretMiktar}>π {uzman.ucret}</Text>
                        <Text style={stiller.ucretSaat}>/saat</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const stiller = StyleSheet.create({
    sarici: { marginBottom: 12 },
    kart: {
        backgroundColor: Renkler.kartZemin,
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: Renkler.ayirici,
    },

    // Üst satır
    ustSatir: { flexDirection: 'row', marginBottom: 12 },
    avatarDaire: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: Renkler.yarimSeffafAltin,
        borderWidth: 1.5,
        borderColor: Renkler.piAltin,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarEmoji: { fontSize: 26 },
    bilgiKolonu: { flex: 1 },
    isimSatiri: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
    isim: {
        fontSize: 16,
        fontWeight: '700',
        color: Renkler.metinAna,
        flex: 1,
    },
    durumNoktasi: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 6,
    },
    aktif: { backgroundColor: Renkler.basarili },
    pasif: { backgroundColor: Renkler.metinFade },
    kategori: { fontSize: 12, color: Renkler.piAltin, fontWeight: '600', marginBottom: 2 },
    konum: { fontSize: 12, color: Renkler.metinFade },

    // Biyografi
    biyografi: {
        fontSize: 13,
        color: Renkler.metinIkincil,
        lineHeight: 19,
        marginBottom: 10,
    },

    // Bilgi chip'leri
    chipSatiri: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 8,
    },
    chip: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: Renkler.ayirici,
    },
    chipMetin: {
        fontSize: 11,
        color: Renkler.metinIkincil,
        fontWeight: '600',
    },
    chipYesil: {
        backgroundColor: 'rgba(76,175,80,0.12)',
        borderColor: 'rgba(76,175,80,0.35)',
    },
    chipMetinYesil: {
        color: '#4CAF50',
    },

    // Referans proje
    referansSatiri: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    referansEtiket: { fontSize: 12 },
    referansMetin: {
        fontSize: 12,
        color: Renkler.piAltin,
        fontStyle: 'italic',
        flex: 1,
        fontWeight: '500',
    },

    // Alt satır
    altSatir: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Renkler.ayirici,
        paddingTop: 10,
        marginTop: 2,
    },
    puanBolum: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    yildizlar: { fontSize: 11 },
    puanMetin: { fontSize: 12, color: Renkler.metinIkincil },
    ucretBolum: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
    ucretMiktar: { fontSize: 18, fontWeight: '800', color: Renkler.piAltin },
    ucretSaat: { fontSize: 12, color: Renkler.metinFade },
});
