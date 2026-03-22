"use client";
import Script from 'next/script';

export default function Page() {
  const startPayment = async () => {
    if (!window.Pi) {
      alert("Pi SDK yuklenemedi, sayfayi yenile!");
      return;
    }
    try {
      // Zorla yeniden init yapıyoruz hata almamak için
      await window.Pi.init({ version: '2.0', sandbox: true });
      
      await window.Pi.createPayment({
        amount: 0.1,
        memo: "AgroPi Final 10/10",
        metadata: { orderId: "final-step" }
      }, {
        onReadyForServerApproval: (paymentId) => {
          return fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
            method: 'POST',
            headers: { 'Authorization': 'Key ipqhskxaso0wqujzgwgsxrcpfwcjkk1kmgq1xvbptqh6lqpuq1xebsnjzz7v6gud' }
          });
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          return fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
            method: 'POST',
            headers: { 'Authorization': 'Key ipqhskxaso0wqujzgwgsxrcpfwcjkk1kmgq1xvbptqh6lqpuq1xebsnjzz7v6gud' },
            body: JSON.stringify({ txid })
          });
        },
        onCancel: (paymentId) => console.log("Iptal"),
        onError: (error) => alert("Hata: " + error.message)
      });
    } catch (e) { alert("Hata: " + e); }
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="beforeInteractive" />
      <h1>AgroPi 10. Madde Onay</h1>
      <button 
        onClick={startPayment}
        style={{ backgroundColor: '#4CAF50', color: 'white', padding: '20px 40px', fontSize: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
      >
        ODEMEYI YAP VE BITIR (0.1 PI)
      </button>
    </div>
  );
}
