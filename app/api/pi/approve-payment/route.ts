import { NextRequest, NextResponse } from "next/server";
import { getPiServerAuthorizationKey } from "@/lib/pi-env";
import {
  attachPaymentToOrder,
  getActiveOrderByOrderId,
  getOrderByPaymentIdAnyStatus,
} from "@/lib/pi-order-store";

const PI_APPROVE = (paymentId: string) =>
  `https://api.minepi.com/v2/payments/${paymentId}/approve`;

function parseBoolean(value: string | undefined): boolean {
  return (value ?? "").toLowerCase() === "true";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = body?.paymentId as string | undefined;
    const orderId = body?.orderId as string | undefined;
    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId is required" },
        { status: 400 }
      );
    }
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    const serverSandbox = parseBoolean(process.env.NEXT_PUBLIC_PI_SANDBOX);

    const order = await getActiveOrderByOrderId(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Active order not found for given orderId." },
        { status: 403 }
      );
    }
    if (order.expectedSandbox !== serverSandbox) {
      return NextResponse.json(
        { error: "Sandbox mode mismatch for active order." },
        { status: 403 }
      );
    }
    // Idempotency: daha önce aynı paymentId ile onaylandıysa tekrar approve'a gitme.
    if (order.status === "approved") {
      if (order.paymentId === paymentId) {
        return NextResponse.json(
          { ok: true, alreadyApproved: true },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          error:
            "Aktif order 'approved' ama bu paymentId ile eşleşmiyor. İşlem iptal edildi.",
        },
        { status: 403 }
      );
    }
    if (order.status !== "created") {
      return NextResponse.json(
        { error: `Order is not in created state (status=${order.status}).` },
        { status: 409 }
      );
    }

    // PaymentId mapping doğrulaması: bu paymentId başka bir order'a bağlıysa Pi onayını asla göndermeyiz.
    const usedBy = await getOrderByPaymentIdAnyStatus(paymentId);
    if (usedBy && usedBy.orderId !== orderId) {
      if (usedBy.status !== "completed" && usedBy.status !== "cancelled") {
        return NextResponse.json(
          {
            error:
              "paymentId başka bir aktif order ile eşleşiyor. İşlem iptal edildi.",
          },
          { status: 403 }
        );
      }
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

    const res = await fetch(PI_APPROVE(paymentId), {
      method: "POST",
      headers: { Authorization: `Key ${serverKey}` },
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

    // Pi onayı başarılı olduktan sonra paymentId'yi aktif order'a bağlarız.
    await attachPaymentToOrder({
      orderId,
      paymentId,
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
    console.error("Payment approval error:", error);
    return NextResponse.json(
      { error: "Payment approval failed" },
      { status: 500 }
    );
  }
}
