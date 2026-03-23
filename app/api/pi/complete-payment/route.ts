import { NextRequest, NextResponse } from "next/server";
import { getPiServerAuthorizationKey } from "@/lib/pi-env";
import {
  getOrderByPaymentIdAnyStatus,
  markOrderCompleted,
} from "@/lib/pi-order-store";

const PI_COMPLETE = (paymentId: string) =>
  `https://api.minepi.com/v2/payments/${paymentId}/complete`;

function parseBoolean(value: string | undefined): boolean {
  return (value ?? "").toLowerCase() === "true";
}

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

    const serverSandbox = parseBoolean(process.env.NEXT_PUBLIC_PI_SANDBOX);

    const order = await getOrderByPaymentIdAnyStatus(paymentId);
    if (!order) {
      return NextResponse.json(
        {
          error:
            "paymentId aktif bir order ile eşleşmiyor. İşlem iptal edildi.",
        },
        { status: 403 }
      );
    }
    if (order.expectedSandbox !== serverSandbox) {
      return NextResponse.json(
        { error: "Sandbox mode mismatch (order vs server)." },
        { status: 403 }
      );
    }

    if (order.status === "completed") {
      if (order.txid === txid) {
        return NextResponse.json(
          { ok: true, alreadyCompleted: true },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          error:
            "Bu paymentId ile eşleşen order zaten tamamlanmış ama txid uyuşmuyor. İşlem iptal edildi.",
        },
        { status: 403 }
      );
    }

    if (order.status !== "approved") {
      return NextResponse.json(
        { error: `Order onaylanmadı (status=${order.status}).` },
        { status: 409 }
      );
    }

    const serverKey = getPiServerAuthorizationKey();
    if (!serverKey) {
      return NextResponse.json(
        {
          error:
            "PI_API_KEY veya PI_APP_SECRET tanımlı değil. .env.local içine ekleyin.",
        },
        { status: 503 }
      );
    }

    const res = await fetch(PI_COMPLETE(paymentId), {
      method: "POST",
      headers: {
        Authorization: `Key ${serverKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    if (!res.ok) {
      const text = await res.text();
      return new NextResponse(text, {
        status: res.status,
        headers: {
          "Content-Type":
            res.headers.get("Content-Type") ?? "application/json",
        },
      });
    }

    // Pi completion başarılı olduktan sonra, lokal order state'ini tamamlarız.
    await markOrderCompleted({
      paymentId,
      txid,
      expectedSandbox: serverSandbox,
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Payment completion error:", error);
    return NextResponse.json(
      { error: "Payment completion failed" },
      { status: 500 }
    );
  }
}
