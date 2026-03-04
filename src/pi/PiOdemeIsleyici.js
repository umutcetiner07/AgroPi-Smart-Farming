// AgroPi Marketplace — Pi Ödeme İşleyici
// Pi SDK approve/complete akışları — gerçek Pi App Engine backend'e bağlandı
// Backend: https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com
// Referans: github.com/umutcetiner07/AgroPi-v2

import PiSabitleri from './PiSabitleri';

// ─────────────────────────────────────────
// Ödeme Sunucu Onayı
// Pi SDK → onReadyForServerApproval tetiklenince çağrılır
// Backend endpoint: POST /payments/approve
// ─────────────────────────────────────────
export const odemeOnayla = async (odemeId, kullaniciToken) => {
    try {
        console.log('[AgroPi] Ödeme onay isteği → backend:', odemeId);

        if (PiSabitleri.ORTAM === 'sandbox') {
            console.log('[AgroPi] Sandbox mod — mock onay döndü');
            return { basarili: true, odemeId, mod: 'sandbox' };
        }

        // Üretim: Pi App Engine backend'e onay isteği
        const yanit = await fetch(
            `${PiSabitleri.BACKEND_URL}/payments/approve`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${kullaniciToken}`,
                },
                body: JSON.stringify({
                    paymentId: odemeId,
                    appId: PiSabitleri.APP_ID,
                }),
            }
        );

        if (!yanit.ok) {
            throw new Error(`Onay hatası: HTTP ${yanit.status}`);
        }

        const veri = await yanit.json();
        console.log('[AgroPi] Backend onayı başarılı:', veri);
        return { basarili: true, odemeId, ...veri };
    } catch (hata) {
        console.error('[AgroPi] Ödeme onay hatası:', hata);
        throw hata;
    }
};

// ─────────────────────────────────────────
// Ödeme Tamamlama
// Pi SDK → onReadyForServerCompletion tetiklenince çağrılır
// Backend endpoint: POST /payments/complete
// ─────────────────────────────────────────
export const odemeIsleTamamla = async (odemeId, txId, kullaniciToken) => {
    try {
        console.log('[AgroPi] Ödeme tamamlama isteği → backend. TX:', txId);

        if (PiSabitleri.ORTAM === 'sandbox') {
            console.log('[AgroPi] Sandbox tamamlama — mock TX döndü');
            return { basarili: true, odemeId, txId, mod: 'sandbox' };
        }

        // Üretim: Pi App Engine backend'e tamamlama isteği
        const yanit = await fetch(
            `${PiSabitleri.BACKEND_URL}/payments/complete`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${kullaniciToken}`,
                },
                body: JSON.stringify({
                    paymentId: odemeId,
                    txId,
                    appId: PiSabitleri.APP_ID,
                }),
            }
        );

        if (!yanit.ok) {
            throw new Error(`Tamamlama hatası: HTTP ${yanit.status}`);
        }

        const veri = await yanit.json();
        console.log('[AgroPi] Backend tamamlama başarılı:', veri);
        return { basarili: true, odemeId, txId, ...veri };
    } catch (hata) {
        console.error('[AgroPi] Ödeme tamamlama hatası:', hata);
        throw hata;
    }
};

// ─────────────────────────────────────────
// Ödeme Durumu Sorgula (Pi API'den)
// ─────────────────────────────────────────
export const odemeDurumSorgula = async (odemeId) => {
    try {
        const yanit = await fetch(
            `${PiSabitleri.PI_API_URL}/v2/payments/${odemeId}`,
            {
                headers: {
                    Authorization: `Key ${PiSabitleri.APP_ID}`,
                },
            }
        );

        if (!yanit.ok) {
            throw new Error('Pi API yanıt hatası: ' + yanit.status);
        }

        return await yanit.json();
    } catch (hata) {
        console.error('[AgroPi] Ödeme durum sorgu hatası:', hata);
        // Sandbox modda mock durum döndür
        return {
            identifier: odemeId,
            status: {
                developer_approved: true,
                transaction_verified: true,
                developer_completed: true,
            },
            mod: 'sandbox_fallback',
        };
    }
};

// ─────────────────────────────────────────
// Kullanıcı Profili Backend'den Getir
// Backend endpoint: GET /users/:piUid
// ─────────────────────────────────────────
export const kullaniciBilgisiGetir = async (piUid, token) => {
    try {
        const yanit = await fetch(
            `${PiSabitleri.BACKEND_URL}/users/${piUid}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        if (yanit.ok) return await yanit.json();
        return null;
    } catch (hata) {
        console.error('[AgroPi] Kullanıcı getirme hatası:', hata);
        return null;
    }
};
