import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, txid } = body;

    console.log('Payment completion request:', { paymentId, txid });

    // Test için otomatik tamamlama
    const completionData = {
      paymentId,
      txid,
      completed: true,
      timestamp: new Date().toISOString()
    };

    // Pi Network'e completion bildirimi
    console.log('Payment completed:', completionData);

    return NextResponse.json(completionData);

  } catch (error) {
    console.error('Payment completion error:', error);
    return NextResponse.json(
      { error: 'Payment completion failed' },
      { status: 500 }
    );
  }
}
