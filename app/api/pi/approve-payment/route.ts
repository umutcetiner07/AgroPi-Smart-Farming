import { NextRequest, NextResponse } from "next/server";

const PI_APPROVE = (paymentId: string) =>
  `https://api.minepi.com/v2/payments/${paymentId}/approve`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = body?.paymentId as string | undefined;
    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId is required" },
        { status: 400 }
      );
    }

    const secret = process.env.PI_APP_SECRET;
    if (!secret) {
      return NextResponse.json(
        {
          error:
            "PI_APP_SECRET is not set. Add your Pi Developer Portal app secret to .env.local for server-side approval.",
        },
        { status: 503 }
      );
    }

    const res = await fetch(PI_APPROVE(paymentId), {
      method: "POST",
      headers: { Authorization: `Key ${secret}` },
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
    });
  } catch (error) {
    console.error("Payment approval error:", error);
    return NextResponse.json(
      { error: "Payment approval failed" },
      { status: 500 }
    );
  }
}
