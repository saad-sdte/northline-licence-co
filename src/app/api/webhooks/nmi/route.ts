import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import {
  claimWebhookEvent,
  findOrderByTransactionId,
  getOrder,
  markOrderFailed,
  markOrderPaid,
  markOrderRefunded,
} from "@/lib/orders";
import { NMI_DESCRIPTOR } from "@/lib/nmi";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/nmi — gateway webhook receiver (belt-and-braces with the
 * synchronous charge response).
 *
 * Register in the NMI merchant portal (Settings -> Webhooks) for at least:
 * transaction.sale.success, transaction.sale.failure,
 * transaction.refund.success, transaction.void.success — then put the signing
 * key NMI shows you into NMI_WEBHOOK_SIGNING_KEY.
 *
 * Security: every delivery is verified with HMAC-SHA256 over
 * "{timestamp}.{raw body}" using the signing key (NMI's webhook-signature
 * header carries t=<unix>,s=<hex>). Stale timestamps (>5 min) and bad
 * signatures are rejected — unverified payloads are NEVER processed.
 */

const MAX_SKEW_SECONDS = 5 * 60;

function parseSignatureHeader(header: string | null): { t: string; s: string } | null {
  if (!header) return null;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.trim().split("=", 2) as [string, string]),
  );
  return parts.t && parts.s ? { t: parts.t, s: parts.s } : null;
}

function verifySignature(rawBody: string, header: string | null, key: string): boolean {
  const sig = parseSignatureHeader(header);
  if (!sig) return false;
  const ts = Number(sig.t);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > MAX_SKEW_SECONDS) return false;
  const expected = createHmac("sha256", key).update(`${sig.t}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(sig.s.toLowerCase(), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Pull a value out of NMI's (varied) payload shapes. */
function dig(obj: unknown, keys: string[]): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const record = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = record[k];
    if (typeof v === "string" && v) return v;
    if (typeof v === "number") return String(v);
  }
  for (const v of Object.values(record)) {
    if (v && typeof v === "object") {
      const found = dig(v, keys);
      if (found) return found;
    }
  }
  return undefined;
}

export async function POST(request: Request) {
  const key = process.env.NMI_WEBHOOK_SIGNING_KEY?.trim();
  const rawBody = await request.text();

  if (!key) {
    console.warn("[webhooks/nmi] received a webhook but NMI_WEBHOOK_SIGNING_KEY is not set — ignored");
    return NextResponse.json({ ok: false, error: "signing key not configured" }, { status: 503 });
  }

  const header =
    request.headers.get("webhook-signature") ?? request.headers.get("x-nmi-signature");
  const valid = verifySignature(rawBody, header, key);

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    payload = { raw: rawBody.slice(0, 2000) };
  }

  const eventId = dig(payload, ["event_id", "id", "webhook_id"]);
  const eventType = dig(payload, ["event_type", "type"]) ?? "unknown";

  if (eventId && !claimWebhookEvent(eventId)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  if (!valid) {
    console.warn(`[webhooks/nmi] INVALID signature for event ${eventId ?? "?"} (${eventType})`);
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  const transactionId = dig(payload, ["transaction_id", "transactionid"]);
  const orderId = dig(payload, ["order_id", "orderid"]);
  let processed = false;

  try {
    if (/sale\.success|transaction\.sale\.success/i.test(eventType) && (transactionId || orderId)) {
      const existing = (orderId && getOrder(orderId)) || (transactionId ? findOrderByTransactionId(transactionId) : undefined);
      if (existing && (existing.status === "pending_payment" || existing.status === "payment_failed")) {
        markOrderPaid(existing.reference, {
          transactionId: transactionId ?? existing.transactionId,
          descriptor: NMI_DESCRIPTOR,
        });
        console.log(`[webhooks/nmi] reconciled sale.success for ${existing.reference}`);
      }
      processed = true;
    } else if (/refund\.success|void\.success/i.test(eventType) && (transactionId || orderId)) {
      const existing = (orderId && getOrder(orderId)) || (transactionId ? findOrderByTransactionId(transactionId) : undefined);
      if (existing) {
        markOrderRefunded(existing.reference);
        console.log(`[webhooks/nmi] marked ${existing.reference} refunded`);
      }
      processed = true;
    } else if (/sale\.failure/i.test(eventType)) {
      const existing = (orderId && getOrder(orderId)) || (transactionId ? findOrderByTransactionId(transactionId) : undefined);
      if (existing && existing.status === "pending_payment") {
        markOrderFailed(existing.reference, transactionId);
      }
      processed = true;
    }
  } catch (err) {
    console.error(`[webhooks/nmi] processing error for ${eventId ?? "?"}: ${err instanceof Error ? err.message : "unknown"}`);
  }

  return NextResponse.json({ ok: true, processed });
}
