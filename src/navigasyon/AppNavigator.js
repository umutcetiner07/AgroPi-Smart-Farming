// AgroPi Marketplace — Navigasyon Yöneticisi
// Pi login → profil tamamlama → tab navigator (Marketplace, Profil)

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Ekranlar
import GirisEkrani from '../ekranlar/GirisEkrani';
import ProfilTamamlamaEkrani from '../ekranlar/ProfilTamamlamaEkrani';
import MarketplaceEkrani from '../ekranlar/MarketplaceEkrani';
import UzmanDetayEkrani from '../ekranlar/UzmanDetayEkrani';
import ProfilEkrani from '../ekranlar/ProfilEkrani';

import Renkler from '../tema/renkler';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Alt sekme navigatörü (Ana uygulama)
function AnaTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Renkler.kartZemin,
                    borderTopColor: Renkler.ayirici,
                    borderTopWidth: 1,
                    height: 65,
                    paddingBottom: 10,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: Renkler.piAltin,
                tabBarInactiveTintColor: Renkler.metinFade,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Marketplace"
                component={MarketplaceEkrani}
                options={{
                    tabBarLabel: 'Keşfet',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size - 4, color }}>🌾</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Profilim"
                component={ProfilEkrani}
                options={{
                    tabBarLabel: 'Profilim',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size - 4, color }}>👤</Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// Kimlik doğrulama yığını
function KimlikYigini() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="GirisEkrani" component={GirisEkrani} />
            <Stack.Screen name="ProfilTamamlama" component={ProfilTamamlamaEkrani} />
        </Stack.Navigator>
    );
}

// Ana uygulama yığını (giriş sonrası)
function UygulamaYigini() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Renkler.zemin },
            }}
        >
            <Stack.Screen name="AnaTabs" component={AnaTabNavigator} />
            <Stack.Screen
                name="UzmanDetay"
                component={UzmanDetayEkrani}
                options={{ animation: 'slide_from_right' }}
            />
        </Stack.Navigator>
    );
}

// Ana navigasyon bileşeni
export default function AppNavigator() {
    const [piKullanici, setPiKullanici] = useState(null);
    const [yukleniyor, setYukleniyor] = useState(true);

    useEffect(() => {
        // Oturum bilgisini kontrol et (AsyncStorage'dan okumak için genişletilebilir)
        const oturumKontrol = setTimeout(() => {
            setYukleniyor(false);
        }, 800);
        return () => clearTimeout(oturumKontrol);
    }, []);

    if (yukleniyor) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Renkler.zemin }}>
                <ActivityIndicator color={Renkler.piAltin} size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {piKullanici ? <UygulamaYigini /> : <KimlikYigini />}
        </NavigationContainer>
    );
}
