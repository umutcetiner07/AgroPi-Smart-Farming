import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export type PiOrderIntent = "test" | "real";

export type PiOrderStatus = "created" | "approved" | "completed" | "cancelled";

export type PiOrderRecord = {
  orderId: string;
  createdAt: number;
  expiresAt: number;
  // Sunucu tarafında beklenen sandbox modu. create-order çağrısı anında env'e göre set edilir.
  expectedSandbox: boolean;
  intent: PiOrderIntent;
  amount: number;
  memo: string;
  status: PiOrderStatus;
  // Pi SDK'dan gelen aşama bilgileri
  paymentId?: string;
  txid?: string;
  lastUpdatedAt: number;
};

type PiOrderStore = {
  orders: PiOrderRecord[];
};

const STORE_PATH = path.join(process.cwd(), ".agropi-pi-orders.json");
const EXPIRE_MS = 15 * 60 * 1000; // 15 dakika: mapping için yeterli zaman penceresi

let writeQueue: Promise<void> = Promise.resolve();

function nowMs() {
  return Date.now();
}

async function readStore(): Promise<PiOrderStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as PiOrderStore;
    if (!parsed || !Array.isArray(parsed.orders)) return { orders: [] };
    return parsed;
  } catch {
    return { orders: [] };
  }
}

async function writeStore(store: PiOrderStore) {
  const tmp = `${STORE_PATH}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tmp, STORE_PATH);
}

async function pruneExpired(store: PiOrderStore): Promise<PiOrderStore> {
  const t = nowMs();
  const orders = store.orders.filter((o) => o.expiresAt > t);
  return { orders };
}

export async function createPiOrder(input: {
  expectedSandbox: boolean;
  intent: PiOrderIntent;
  amount: number;
  memo: string;
}): Promise<PiOrderRecord> {
  const orderId = crypto.randomUUID();
  const t = nowMs();
  const record: PiOrderRecord = {
    orderId,
    createdAt: t,
    expiresAt: t + EXPIRE_MS,
    expectedSandbox: input.expectedSandbox,
    intent: input.intent,
    amount: input.amount,
    memo: input.memo,
    status: "created",
    lastUpdatedAt: t,
  };

  await (writeQueue = writeQueue.then(async () => {
    const store = await pruneExpired(await readStore());
    store.orders.push(record);
    await writeStore(store);
  }));

  return record;
}

export async function getActiveOrderByOrderId(orderId: string): Promise<PiOrderRecord | null> {
  const store = await pruneExpired(await readStore());
  const order = store.orders.find((o) => o.orderId === orderId);
  if (!order) return null;
  if (order.status === "completed" || order.status === "cancelled") return null;
  return order;
}

export async function getActiveOrderByPaymentId(paymentId: string): Promise<PiOrderRecord | null> {
  const store = await pruneExpired(await readStore());
  const order = store.orders.find((o) => o.paymentId === paymentId);
  if (!order) return null;
  if (order.status === "completed" || order.status === "cancelled") return null;
  return order;
}

export async function getOrderByPaymentIdAnyStatus(
  paymentId: string
): Promise<PiOrderRecord | null> {
  const store = await pruneExpired(await readStore());
  const order = store.orders.find((o) => o.paymentId === paymentId);
  return order ?? null;
}

export async function attachPaymentToOrder(input: {
  orderId: string;
  paymentId: string;
  expectedSandbox: boolean;
}): Promise<PiOrderRecord> {
  return (await (writeQueue = writeQueue.then(async () => {
    const store = await pruneExpired(await readStore());
    const order = store.orders.find((o) => o.orderId === input.orderId);
    if (!order) {
      throw new Error("Order bulunamadı.");
    }
    if (order.status === "completed" || order.status === "cancelled") {
      throw new Error("Order aktif değil.");
    }
    if (order.expectedSandbox !== input.expectedSandbox) {
      throw new Error("Sandbox modu uyumsuz.");
    }
    // PaymentID başka bir active order'a daha bağlı olmamalı.
    const usedByOther = store.orders.some(
      (o) => o.paymentId === input.paymentId && o.orderId !== input.orderId
    );
    if (usedByOther) {
      throw new Error("paymentId zaten başka bir order'a bağlı.");
    }

    order.paymentId = input.paymentId;
    order.status = "approved";
    order.lastUpdatedAt = nowMs();

    await writeStore(store);
    return order;
  }))) as PiOrderRecord;
}

export async function markOrderCompleted(input: {
  paymentId: string;
  txid: string;
  expectedSandbox: boolean;
}): Promise<PiOrderRecord> {
  return (await (writeQueue = writeQueue.then(async () => {
    const store = await pruneExpired(await readStore());
    const order = store.orders.find((o) => o.paymentId === input.paymentId);
    if (!order) {
      throw new Error("Aktif order bulunamadı.");
    }
    if (order.expectedSandbox !== input.expectedSandbox) {
      throw new Error("Sandbox modu uyumsuz.");
    }
    if (order.status !== "approved") {
      throw new Error("Order onaylanmadı.");
    }

    order.txid = input.txid;
    order.status = "completed";
    order.lastUpdatedAt = nowMs();

    await writeStore(store);
    return order;
  }))) as PiOrderRecord;
}

