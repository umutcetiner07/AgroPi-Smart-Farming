"use client";

import { useEffect } from "react";
import Script from 'next/script';

export default function HomePage() {
  useEffect(() => {
    if (window.Pi) {
      window.Pi.init({ version: '2.0', sandbox: true });
    }
  }, []);

  const handlePayment = async () => {
    if (!window.Pi) return;
    try {
      const payment = await window.Pi.createPayment({
        amount: 0.1,
        memo: "AgroPi Test Payment",
        metadata: { orderId: "123" }
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
        onCancel: (paymentId) => console.log("Cancelled"),
        onError: (error, payment) => console.error(error)
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive" />
      <h1>AgroPi Smart Farming</h1>
      <p>10. Madde Test Sayfası</p>
      <button 
        onClick={handlePayment}
        style={{ backgroundColor: '#4CAF50', color: 'white', padding: '15px 32px', fontSize: '16px', borderRadius: '8px', cursor: 'pointer', border: 'none', marginTop: '20px' }}
      >
        TEST PAYMENT (0.1 PI)
      </button>
    </div>
  );
}
