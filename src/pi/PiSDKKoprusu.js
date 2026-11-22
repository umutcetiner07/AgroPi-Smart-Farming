// AgroPi — Pi SDK Köprüsü (Next.js / Web)
// Pi Browser'da window.Pi inject edilir; dışarıda mock mod devreye girer.

const SANDBOX = process.env.NEXT_PUBLIC_PI_ENV !== 'production';
const APP_ID  = process.env.NEXT_PUBLIC_PI_APP_ID || '68a6fed62cb50254172b6593';

const MockPiSDK = {
  authenticate: (_scopes, onSuccess, _onError) => {
    setTimeout(() => onSuccess({
      accessToken: 'mock_token_agropi_dev_12345',
      user: { uid: 'mock_uid_001', username: 'agropi_test_kullanici' },
    }), 1200);
  },
  createPayment: (data, callbacks) => {
    setTimeout(() => callbacks.onReadyForServerApproval('mock_odeme_id_001'), 800);
    setTimeout(() => callbacks.onReadyForServerCompletion('mock_odeme_id_001', 'mock_txid_001'), 2000);
  },
  openShareDialog: (title, _desc, _url) => {
    console.log('[AgroPi MockSDK] openShareDialog:', title);
  },
};

export const piBrowserMi = () =>
  typeof window !== 'undefined' && typeof window.Pi !== 'undefined';

export const piSDKAl = () => {
  if (piBrowserMi()) return window.Pi;
  console.warn('[AgroPi] Pi Browser dışı → Mock mod');
  return MockPiSDK;
};

export const piSDKBaslat = () => {
  if (!piBrowserMi()) return;
  try {
    window.Pi.init({ version: '2.0', sandbox: SANDBOX });
  } catch (e) {
    console.warn('[AgroPi] Pi SDK init hatası:', e.message);
  }
};

export const piGirisYap = () =>
  new Promise((resolve, reject) => {
    const sdk = piSDKAl();
    sdk.authenticate(
      ['username', 'payments', 'wallet_address'],
      (auth) => resolve({
        kullaniciAdi: auth.user.username,
        kullaniciId:  auth.user.uid,
        erisimToken:  auth.accessToken,
        mockMod:      !piBrowserMi(),
      }),
      (hata) => reject(new Error('Pi girişi başarısız: ' + (hata?.message ?? 'Bilinmeyen hata'))),
    );
  });

export const odemeBaslat = ({ miktar, aciklama, aliciKullaniciId = '', uygMetaVeri = {} }) =>
  new Promise((resolve, reject) => {
    const sdk = piSDKAl();
    sdk.createPayment(
      {
        amount:   miktar,
        memo:     aciklama,
        metadata: { alici: aliciKullaniciId, platform: 'AgroPi', ...uygMetaVeri },
      },
      {
        onReadyForServerApproval:   (id)       => resolve({ durum: 'onay_bekleniyor', odemeId: id }),
        onReadyForServerCompletion: (id, txid) => resolve({ durum: 'tamamlandi', odemeId: id, txid }),
        onCancel:  (id)        => reject({ iptal: true, odemeId: id }),
        onError:   (e, odeme)  => reject({ hata: e, odeme }),
      },
    );
  });

export const mevcutPiKullanicisiniAl = () =>
  piBrowserMi() ? null : { uid: 'mock_uid_001', username: 'agropi_test', mockMod: true };
