// AgroPi Marketplace — Pi Ödeme Onay Modalı
// "Pi ile Danışmanlık Al" butonuna basınca açılan saat seçimi + onay modalı

import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import Renkler from '../tema/renkler';
import PiSabitleri from '../pi/PiSabitleri';

const SAAT_SECENEKLERI = [1, 2, 3, 5];

export default function PiOdemeModal({ gorunur, uzman, onOnayla, onIptal }) {
    const [seciliSaat, setSeciliSaat] = useState(1);

    if (!uzman) return null;

    const toplamUcret = (uzman.ucret * seciliSaat).toFixed(2);
    const komisyon = (toplamUcret * PiSabitleri.PLATFORM_KOMISYON) / 100;
    const netUcret = (toplamUcret - komisyon).toFixed(2);

    return (
        <Modal
            visible={gorunur}
            transparent
            animationType="slide"
            onRequestClose={onIptal}
        >
            <View style={stiller.arkaZemin}>
                <TouchableOpacity style={stiller.kapatAlani} onPress={onIptal} />

                <View style={stiller.panel}>
                    {/* Header */}
                    <View style={stiller.tutamak} />
                    <Text style={stiller.baslik}>Danışmanlık Satın Al</Text>

                    {/* Uzman özeti */}
                    <View style={stiller.uzmanOzet}>
                        <Text style={stiller.uzmanEmoji}>{uzman.kategoriEmoji}</Text>
                        <View>
                            <Text style={stiller.uzmanAd}>{uzman.ad}</Text>
                            <Text style={stiller.uzmanKategori}>{uzman.kategori}</Text>
                        </View>
                    </View>

                    {/* Saat seçimi */}
                    <Text style={stiller.etiket}>Danışmanlık Süresi</Text>
                    <View style={stiller.saatSatiri}>
                        {SAAT_SECENEKLERI.map((saat) => (
                            <TouchableOpacity
                                key={saat}
                                style={[
                                    stiller.saatKutu,
                                    seciliSaat === saat && stiller.saatSecili,
                                ]}
                                onPress={() => setSeciliSaat(saat)}
                            >
                                <Text style={[stiller.saatSayi, seciliSaat === saat && stiller.saatSayiSecili]}>
                                    {saat}
                                </Text>
                                <Text style={[stiller.saatBirim, seciliSaat === saat && stiller.saatBirimSecili]}>
                                    saat
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Fiyat özeti */}
                    <View style={stiller.fiyatOzet}>
                        <View style={stiller.fiyatSatiri}>
                            <Text style={stiller.fiyatEtiket}>Danışmanlık ücreti</Text>
                            <Text style={stiller.fiyatDeger}>π {toplamUcret}</Text>
                        </View>
                        <View style={stiller.fiyatSatiri}>
                            <Text style={stiller.fiyatEtiket}>Platform komisyonu (%{PiSabitleri.PLATFORM_KOMISYON})</Text>
                            <Text style={stiller.fiyatDeger}>π {komisyon.toFixed(2)}</Text>
                        </View>
                        <View style={[stiller.fiyatSatiri, stiller.toplamSatiri]}>
                            <Text style={stiller.toplamEtiket}>Toplam Ödeme</Text>
                            <Text style={stiller.toplamDeger}>π {toplamUcret}</Text>
                        </View>
                    </View>

                    {/* Sandbox uyarısı */}
                    {PiSabitleri.ORTAM === 'sandbox' && (
                        <View style={stiller.sandboxBanner}>
                            <Text style={stiller.sandboxMetin}>
                                🔧 Sandbox Mod — Gerçek Pi transferi yapılmaz
                            </Text>
                        </View>
                    )}

                    {/* Butonlar */}
                    <View style={stiller.butonSatiri}>
                        <TouchableOpacity style={stiller.iptalButon} onPress={onIptal}>
                            <Text style={stiller.iptalMetin}>İptal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={stiller.onayButon}
                            onPress={() => onOnayla(seciliSaat)}
                            activeOpacity={0.8}
                        >
                            <Text style={stiller.piSimge}>π</Text>
                            <Text style={stiller.onayMetin}>{toplamUcret} π Öde</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const stiller = StyleSheet.create({
    arkaZemin: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    kapatAlani: { flex: 1 },
    panel: {
        backgroundColor: Renkler.kartZemin,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: 36,
        borderTopWidth: 1,
        borderTopColor: Renkler.ayirici,
    },

    tutamak: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: Renkler.ayirici,
        alignSelf: 'center',
        marginBottom: 20,
    },
    baslik: { fontSize: 20, fontWeight: '800', color: Renkler.metinAna, marginBottom: 18 },

    // Uzman özeti
    uzmanOzet: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Renkler.yarimSeffafAltin,
        borderRadius: 14,
        padding: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(240,192,64,0.25)',
        gap: 12,
    },
    uzmanEmoji: { fontSize: 32 },
    uzmanAd: { fontSize: 16, fontWeight: '700', color: Renkler.metinAna },
    uzmanKategori: { fontSize: 13, color: Renkler.piAltin, marginTop: 2 },

    // Saat seçimi
    etiket: {
        fontSize: 12,
        fontWeight: '700',
        color: Renkler.metinIkincil,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    saatSatiri: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    saatKutu: {
        flex: 1,
        backgroundColor: Renkler.girdiZemin,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Renkler.ayirici,
    },
    saatSecili: {
        borderColor: Renkler.piAltin,
        backgroundColor: Renkler.yarimSeffafAltin,
    },
    saatSayi: { fontSize: 22, fontWeight: '800', color: Renkler.metinIkincil },
    saatSayiSecili: { color: Renkler.piAltin },
    saatBirim: { fontSize: 11, color: Renkler.metinFade, marginTop: 2 },
    saatBirimSecili: { color: Renkler.piAltin },

    // Fiyat özeti
    fiyatOzet: {
        backgroundColor: Renkler.zemin,
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        gap: 8,
    },
    fiyatSatiri: { flexDirection: 'row', justifyContent: 'space-between' },
    fiyatEtiket: { fontSize: 13, color: Renkler.metinFade },
    fiyatDeger: { fontSize: 13, color: Renkler.metinIkincil, fontWeight: '600' },
    toplamSatiri: {
        borderTopWidth: 1,
        borderTopColor: Renkler.ayirici,
        paddingTop: 10,
        marginTop: 2,
    },
    toplamEtiket: { fontSize: 15, fontWeight: '700', color: Renkler.metinAna },
    toplamDeger: { fontSize: 18, fontWeight: '800', color: Renkler.piAltin },

    // Sandbox
    sandboxBanner: {
        backgroundColor: 'rgba(255,152,0,0.1)',
        borderRadius: 10,
        padding: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,152,0,0.25)',
    },
    sandboxMetin: { fontSize: 12, color: Renkler.uyari, textAlign: 'center' },

    // Butonlar
    butonSatiri: { flexDirection: 'row', gap: 12 },
    iptalButon: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: Renkler.ayirici,
        alignItems: 'center',
    },
    iptalMetin: { fontSize: 15, fontWeight: '600', color: Renkler.metinIkincil },
    onayButon: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Renkler.piAltin,
        paddingVertical: 16,
        borderRadius: 14,
        gap: 8,
        shadowColor: Renkler.piAltin,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    piSimge: { fontSize: 18, color: Renkler.zeminkk, fontWeight: '900' },
    onayMetin: { fontSize: 16, fontWeight: '800', color: Renkler.zeminkk },
});
