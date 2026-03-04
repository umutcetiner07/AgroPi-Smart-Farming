// AgroPi Marketplace — Profilim Ekranı
// Kullanıcının kendi Pi profil kartını gördüğü ve düzenleyebildiği ekran

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Alert,
} from 'react-native';
// Firebase Auth kaldırıldı — çıkış işlemi Pi oturumunu yerel olarak temizler
import Renkler from '../tema/renkler';
import PiSabitleri from '../pi/PiSabitleri';

// Demo profil verisi — Firebase Firestore'dan gelecek
const DEMO_PROFIL = {
    ad: 'Umut Çetiner',
    kategori: 'Tarım Yatırımcısı',
    kategoriEmoji: '💼',
    konum: 'İstanbul',
    puan: 0,
    yorumSayisi: 0,
    ucret: 5.0,
    biyografi: 'Pi ekosistemi ve tarım teknolojileri girişimcisi.',
    piKullaniciAdi: 'umutcetiner07',
    toplamKazanc: 0,
    tamamlananDanismanlik: 0,
};

export default function ProfilEkrani() {
    const [profil] = useState(DEMO_PROFIL);

    const cikisYap = () => {
        Alert.alert('Çıkış Yap', 'Oturumu kapatmak istiyor musunuz?', [
            { text: 'İptal', style: 'cancel' },
            {
                text: 'Çıkış Yap',
                style: 'destructive',
                onPress: () => {
                    // Pi Network oturumu yerel — basit konsol logu yeterli
                    console.log('[AgroPi] Kullanıcı oturumu kapattı.');
                    // TODO: AsyncStorage'daki Pi kullanıcı verisini burada silebilirsiniz
                },
            },
        ]);
    };

    return (
        <View style={stiller.kapsayici}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profil header */}
                <View style={stiller.header}>
                    <View style={stiller.avatarDaire}>
                        <Text style={stiller.avatarEmoji}>{profil.kategoriEmoji}</Text>
                    </View>
                    <Text style={stiller.ad}>{profil.ad}</Text>
                    <View style={stiller.piKullaniciSatiri}>
                        <Text style={stiller.piSimge}>π</Text>
                        <Text style={stiller.piKullanici}>{profil.piKullaniciAdi}</Text>
                    </View>
                    <View style={stiller.kategoriEtiket}>
                        <Text style={stiller.kategoriMetin}>{profil.kategori}</Text>
                    </View>
                    <Text style={stiller.konum}>📍 {profil.konum}</Text>
                </View>

                {/* İstatistikler */}
                <View style={stiller.istatistikler}>
                    <View style={stiller.istatKutu}>
                        <Text style={stiller.istatDeger}>π {profil.ucret}</Text>
                        <Text style={stiller.istatEtiket}>/saat</Text>
                    </View>
                    <View style={stiller.ayiriciDik} />
                    <View style={stiller.istatKutu}>
                        <Text style={stiller.istatDeger}>{profil.tamamlananDanismanlik}</Text>
                        <Text style={stiller.istatEtiket}>Danışmanlık</Text>
                    </View>
                    <View style={stiller.ayiriciDik} />
                    <View style={stiller.istatKutu}>
                        <Text style={[stiller.istatDeger, { color: Renkler.piAltin }]}>
                            π {profil.toplamKazanc}
                        </Text>
                        <Text style={stiller.istatEtiket}>Kazanç</Text>
                    </View>
                </View>

                {/* Ortam bilgisi */}
                <View style={stiller.bolum}>
                    <Text style={stiller.bolumBaslik}>Bağlantı Bilgisi</Text>
                    <View style={stiller.bilgiKart}>
                        <View style={stiller.bilgiSatiri}>
                            <Text style={stiller.bilgiEtiket}>Pi Ağı</Text>
                            <Text style={[stiller.bilgiDeger, { color: Renkler.piAltin }]}>
                                {PiSabitleri.ORTAM === 'sandbox' ? '🔧 Sandbox' : '🟢 Production'}
                            </Text>
                        </View>
                        <View style={stiller.bilgiSatiri}>
                            <Text style={stiller.bilgiEtiket}>APP ID</Text>
                            <Text style={stiller.bilgiDeger} numberOfLines={1}>
                                {PiSabitleri.APP_ID.slice(0, 12)}…
                            </Text>
                        </View>
                        <View style={stiller.bilgiSatiri}>
                            <Text style={stiller.bilgiEtiket}>Backend</Text>
                            <Text style={stiller.bilgiDeger} numberOfLines={1}>
                                Pi App Engine ✓
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Biyografi */}
                <View style={stiller.bolum}>
                    <Text style={stiller.bolumBaslik}>Hakkımda</Text>
                    <Text style={stiller.biyografi}>{profil.biyografi}</Text>
                </View>

                {/* Çıkış butonu */}
                <TouchableOpacity style={stiller.cikisButon} onPress={cikisYap}>
                    <Text style={stiller.cikisMetin}>Oturumu Kapat</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const stiller = StyleSheet.create({
    kapsayici: { flex: 1, backgroundColor: Renkler.zemin },

    // Header
    header: {
        alignItems: 'center',
        paddingTop: 72,
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: Renkler.ayirici,
    },
    avatarDaire: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: Renkler.yarimSeffafAltin,
        borderWidth: 2,
        borderColor: Renkler.piAltin,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        shadowColor: Renkler.piAltin,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 14,
        elevation: 6,
    },
    avatarEmoji: { fontSize: 44 },
    ad: { fontSize: 22, fontWeight: '800', color: Renkler.metinAna, marginBottom: 6 },
    piKullaniciSatiri: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
    piSimge: { fontSize: 14, color: Renkler.piMorAcik, fontWeight: '900' },
    piKullanici: { fontSize: 14, color: Renkler.piMorAcik },
    kategoriEtiket: {
        backgroundColor: Renkler.yarimSeffafAltin,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: Renkler.piAltin,
        marginBottom: 8,
    },
    kategoriMetin: { fontSize: 13, color: Renkler.piAltin, fontWeight: '700' },
    konum: { fontSize: 13, color: Renkler.metinFade },

    // İstatistikler
    istatistikler: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Renkler.kartZemin,
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 16,
        paddingVertical: 18,
        borderWidth: 1,
        borderColor: Renkler.ayirici,
    },
    istatKutu: { alignItems: 'center' },
    istatDeger: { fontSize: 20, fontWeight: '800', color: Renkler.metinAna },
    istatEtiket: { fontSize: 12, color: Renkler.metinFade, marginTop: 2 },
    ayiriciDik: { width: 1, height: 34, backgroundColor: Renkler.ayirici },

    // Bölümler
    bolum: { paddingHorizontal: 20, paddingTop: 24 },
    bolumBaslik: {
        fontSize: 12,
        fontWeight: '700',
        color: Renkler.metinIkincil,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    biyografi: { fontSize: 14, color: Renkler.metinAna, lineHeight: 22 },

    // Bilgi kartı
    bilgiKart: {
        backgroundColor: Renkler.kartZemin,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: Renkler.ayirici,
        gap: 10,
    },
    bilgiSatiri: { flexDirection: 'row', justifyContent: 'space-between' },
    bilgiEtiket: { fontSize: 13, color: Renkler.metinFade },
    bilgiDeger: { fontSize: 13, color: Renkler.metinIkincil, fontWeight: '600' },

    // Çıkış
    cikisButon: {
        marginHorizontal: 20,
        marginTop: 28,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(239,83,80,0.35)',
        alignItems: 'center',
        backgroundColor: 'rgba(239,83,80,0.08)',
    },
    cikisMetin: { fontSize: 15, fontWeight: '700', color: Renkler.hata },
});
