// AgroPi Marketplace — Kategori Çipi Bileşeni
// Marketplace filtreleme çubukları

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Renkler from '../tema/renkler';

export default function KategoriCipi({ emoji, ad, secili, onPress }) {
    return (
        <TouchableOpacity
            style={[stiller.cip, secili && stiller.cipSecili]}
            onPress={onPress}
            activeOpacity={0.75}
        >
            <Text style={stiller.emoji}>{emoji}</Text>
            <Text style={[stiller.ad, secili && stiller.adSecili]}>{ad}</Text>
        </TouchableOpacity>
    );
}

const stiller = StyleSheet.create({
    cip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Renkler.kartZemin,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1.5,
        borderColor: Renkler.ayirici,
        gap: 5,
    },
    cipSecili: {
        backgroundColor: Renkler.yarimSeffafAltin,
        borderColor: Renkler.piAltin,
    },
    emoji: { fontSize: 14 },
    ad: { fontSize: 13, fontWeight: '600', color: Renkler.metinIkincil },
    adSecili: { color: Renkler.piAltin },
});
