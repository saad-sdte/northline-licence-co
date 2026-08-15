/**
 * In-process order store for checkout + NMI webhook reconciliation.
 * Survives for the life of the Node process (local/dev and single-instance).
 */

export type OrderStatus = "pending_payment" | "paid" | "payment_failed" | "refunded";

export type OrderRecord = {
  id: string;
  reference: string;
  status: OrderStatus;
  amount: number;
  provinceSlug: string;
  residency: string;
  licenceName: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  transactionId?: string;
  cardLast4?: string;
  cardBrand?: string;
  descriptor?: string;
  devMode?: boolean;
  createdAt: string;
  paidAt?: string;
};

const orders = new Map<string, OrderRecord>();
const webhookEvents = new Set<string>();

export function saveOrder(order: OrderRecord): OrderRecord {
  orders.set(order.reference, order);
  return order;
}

export function getOrder(reference: string): OrderRecord | undefined {
  return orders.get(reference);
}

export function markOrderPaid(
  reference: string,
  patch: Pick<OrderRecord, "transactionId" | "cardLast4" | "cardBrand" | "descriptor" | "devMode">,
): OrderRecord | undefined {
  const prev = orders.get(reference);
  if (!prev) return undefined;
  const next: OrderRecord = {
    ...prev,
    ...patch,
    status: "paid",
    paidAt: new Date().toISOString(),
  };
  orders.set(reference, next);
  return next;
}

export function markOrderFailed(reference: string, transactionId?: string): OrderRecord | undefined {
  const prev = orders.get(reference);
  if (!prev) return undefined;
  const next: OrderRecord = {
    ...prev,
    status: "payment_failed",
    transactionId: transactionId ?? prev.transactionId,
  };
  orders.set(reference, next);
  return next;
}

export function markOrderRefunded(reference: string): OrderRecord | undefined {
  const prev = orders.get(reference);
  if (!prev) return undefined;
  const next: OrderRecord = { ...prev, status: "refunded" };
  orders.set(reference, next);
  return next;
}

export function findOrderByTransactionId(transactionId: string): OrderRecord | undefined {
  for (const order of orders.values()) {
    if (order.transactionId === transactionId) return order;
  }
  return undefined;
}

/** Returns true if this webhook event id is new (and records it). */
export function claimWebhookEvent(eventId: string): boolean {
  if (webhookEvents.has(eventId)) return false;
  webhookEvents.add(eventId);
  if (webhookEvents.size > 5000) {
    const first = webhookEvents.values().next().value;
    if (first) webhookEvents.delete(first);
  }
  return true;
}
