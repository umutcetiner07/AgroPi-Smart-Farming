import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, txid } = body;

    console.log('Payment approval request:', { paymentId, txid });

    // Test için otomatik onay
    // Gerçek uygulamada burada güvenlik kontrolleri yapılmalı
    const approvalData = {
      paymentId,
      txid,
      approved: true,
      timestamp: new Date().toISOString()
    };

    // Pi Network'e approval bildirimi
    // Not: Gerçek uygulamada Pi'nin approve endpoint'i çağrılmalı
    console.log('Payment approved:', approvalData);

    return NextResponse.json(approvalData);

  } catch (error) {
    console.error('Payment approval error:', error);
    return NextResponse.json(
      { error: 'Payment approval failed' },
      { status: 500 }
    );
  }
}
