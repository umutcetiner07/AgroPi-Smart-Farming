// AgroPi Marketplace — Uygulama Giriş Noktası
// Firebase tam yüklenmeden render etmez — loading spinner ile bekler

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import AppNavigator from './src/navigasyon/AppNavigator';

export default function App() {
    const [firebaseHazir, setFirebaseHazir] = useState(false);
    const [hata, setHata] = useState(null);

    useEffect(() => {
        const firebaseBaslat = async () => {
            try {
                // firebase.js import edildiğinde başlatma zaten gerçekleşir
                // Burada kısa bir bekleme ile modüllerin yüklenmesini garantiliyoruz
                await import('./src/config/firebase');
                setFirebaseHazir(true);
            } catch (err) {
                console.error('[AgroPi] Firebase başlatma hatası:', err);
                setHata(err.message);
                // Hata olsa bile uygulamayı göster (Pi auth mock modla devam eder)
                setFirebaseHazir(true);
            }
        };

        firebaseBaslat();
    }, []);

    // Firebase yüklenene kadar spinner göster
    if (!firebaseHazir) {
        return (
            <View style={stiller.yukleniyor}>
                <Text style={stiller.logoMetin}>🌾π</Text>
                <ActivityIndicator
                    color="#F0C040"
                    size="large"
                    style={{ marginTop: 20 }}
                />
                <Text style={stiller.altMetin}>AgroPi Marketplace yükleniyor...</Text>
            </View>
        );
    }

    return <AppNavigator />;
}

const stiller = StyleSheet.create({
    yukleniyor: {
        flex: 1,
        backgroundColor: '#12091F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoMetin: {
        fontSize: 52,
    },
    altMetin: {
        color: '#7A6A9A',
        fontSize: 14,
        marginTop: 16,
    },
});
