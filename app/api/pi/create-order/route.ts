import { NextRequest, NextResponse } from "next/server";
import { createPiOrder, type PiOrderIntent } from "@/lib/pi-order-store";

function parseBoolean(value: string | undefined): boolean {
  return (value ?? "").toLowerCase() === "true";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as any));

    const amount = Number(body?.amount);
    const memo = String(body?.memo ?? "");
    const intent = (body?.intent ?? "real") as PiOrderIntent;

    const serverSandbox = parseBoolean(process.env.NEXT_PUBLIC_PI_SANDBOX);

    // Sandbox Check: mainnet modunda test datası ile ödeme denemeye çalışıyorsan,
    // açıkça geliştiriciyi uyarmalıyız.
    if (!serverSandbox && intent === "test") {
      return NextResponse.json(
        {
          error:
            "SANDBOX KAPALI (NEXT_PUBLIC_PI_SANDBOX=false) ama test intent ile create-order çağrıldı. " +
            "Kod/konfigürasyonu mainnet ödeme akışına göre güncelleyin (Test Payment datası mainnet'te kullanılmamalı).",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "amount geçersiz." },
        { status: 400 }
      );
    }
    if (!memo) {
      return NextResponse.json(
        { error: "memo boş olamaz." },
        { status: 400 }
      );
    }

    const order = await createPiOrder({
      expectedSandbox: serverSandbox,
      intent,
      amount,
      memo,
    });

    return NextResponse.json({ orderId: order.orderId });
  } catch (error) {
    console.error("create-order error:", error);
    return NextResponse.json(
      { error: "create-order failed" },
      { status: 500 }
    );
  }
}

