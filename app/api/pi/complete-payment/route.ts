import { NextRequest, NextResponse } from "next/server";

const PI_COMPLETE = (paymentId: string) =>
  `https://api.minepi.com/v2/payments/${paymentId}/complete`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = body?.paymentId as string | undefined;
    const txid = body?.txid as string | undefined;
    if (!paymentId || !txid) {
      return NextResponse.json(
        { error: "paymentId and txid are required" },
        { status: 400 }
      );
    }

    const secret = process.env.PI_APP_SECRET;
    if (!secret) {
      return NextResponse.json(
        {
          error:
            "PI_APP_SECRET is not set. Add your Pi Developer Portal app secret to .env.local for server-side completion.",
        },
        { status: 503 }
      );
    }

    const res = await fetch(PI_COMPLETE(paymentId), {
      method: "POST",
      headers: {
        Authorization: `Key ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
    });
  } catch (error) {
    console.error("Payment completion error:", error);
    return NextResponse.json(
      { error: "Payment completion failed" },
      { status: 500 }
    );
  }
}
