// AgroPi — Pi Auth Service (Next.js / Web)
// Pi.authenticate() → localStorage persist + Firestore profil eşleştirme

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { piGirisYap } from './PiSDKKoprusu';

const DEPOLAMA_ANAHTARI = 'agropi_pi_kullanici';

const profilEslestir = async (piKullanici) => {
  const { kullaniciId, kullaniciAdi, mockMod } = piKullanici;

  if (!db) {
    return { ...piKullanici, profilTamamlandi: false, profilTipi: 'belirsiz' };
  }

  try {
    const uzmanSnap = await getDoc(doc(db, 'uzmanlar', kullaniciId));
    if (uzmanSnap.exists()) {
      return { ...piKullanici, ...uzmanSnap.data(), profilTamamlandi: true, profilTipi: 'uzman' };
    }

    const isverenSnap = await getDoc(doc(db, 'isverenler', kullaniciId));
    if (isverenSnap.exists()) {
      return { ...piKullanici, ...isverenSnap.data(), profilTamamlandi: true, profilTipi: 'isveren' };
    }

    const yeniProfil = {
      kullaniciId, kullaniciAdi,
      piKullaniciAdi: kullaniciAdi,
      profilTipi: 'belirsiz',
      olusturmaTarihi: serverTimestamp(),
      mockMod,
    };
    await setDoc(doc(db, 'kullanicilar', kullaniciId), yeniProfil);
    return { ...piKullanici, ...yeniProfil, profilTamamlandi: false };
  } catch (e) {
    console.warn('[AgroPi] Profil eşleştirme hatası:', e.message);
    return { ...piKullanici, profilTamamlandi: false, profilTipi: 'belirsiz' };
  }
};

export const piIleGirisYap = async () => {
  const piKullanici = await piGirisYap();
  const tamProfil   = await profilEslestir(piKullanici);

  try {
    localStorage.setItem(DEPOLAMA_ANAHTARI, JSON.stringify(tamProfil));
  } catch (_) {}

  return tamProfil;
};

export const kaydedilmisOturumAl = () => {
  try {
    const json = localStorage.getItem(DEPOLAMA_ANAHTARI);
    return json ? JSON.parse(json) : null;
  } catch (_) {
    return null;
  }
};

export const cikisYap = () => {
  try {
    localStorage.removeItem(DEPOLAMA_ANAHTARI);
  } catch (_) {}
};
