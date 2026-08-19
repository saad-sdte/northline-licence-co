import { NextResponse } from "next/server";
import { chargeSale, vaultEnabled, NMI_DESCRIPTOR } from "@/lib/nmi";
import {
  computeCheckoutAmount,
  generateOrderReference,
  parseTokenizedPayment,
  type CheckoutApplicant,
} from "@/lib/checkout";
import { markOrderFailed, markOrderPaid, saveOrder } from "@/lib/orders";
import { parseScanAsset } from "@/lib/documents";
import type { Residency } from "@/lib/provinces";

export const runtime = "nodejs";

const ipHits = new Map<string, number[]>();
const IP_LIMIT = 15;
const IP_WINDOW_MS = 60 * 60 * 1000;

function ipThrottled(request: Request): boolean {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  if (hits.length >= IP_LIMIT) return true;
  hits.push(now);
  ipHits.set(ip, hits);
  if (ipHits.size > 5000) {
    ipHits.forEach((v, k) => {
      if (!v.some((t) => now - t < IP_WINDOW_MS)) ipHits.delete(k);
    });
  }
  return false;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(request: Request) {
  if (ipThrottled(request)) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts from your connection. Please wait a while and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Request body must be valid JSON." }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const applicantRaw = (raw.applicant ?? {}) as Record<string, unknown>;
  const applicant: CheckoutApplicant = {
    firstName: str(applicantRaw.firstName),
    middleName: str(applicantRaw.middleName) || undefined,
    lastName: str(applicantRaw.lastName),
    email: str(applicantRaw.email),
    phone: str(applicantRaw.phone),
  };

  if (!applicant.firstName || !applicant.lastName || !applicant.email || !applicant.phone) {
    return NextResponse.json(
      { ok: false, message: "Applicant name, email, and phone are required." },
      { status: 400 },
    );
  }
  if (raw.agreed !== true) {
    return NextResponse.json(
      { ok: false, message: "Please agree to the declaration before completing payment." },
      { status: 400 },
    );
  }

  const payment = parseTokenizedPayment(raw.payment);
  if (!payment) {
    return NextResponse.json(
      { ok: false, message: "Your payment session expired — please re-enter your card details." },
      { status: 400 },
    );
  }

  const provinceSlug = str(raw.provinceSlug);
  const residency = str(raw.residency) as Residency;
  const licenceName = str(raw.licenceName);
  const licencePrice = str(raw.licencePrice);
  const walleye = str(raw.walleye) || undefined;
  const salmonStamp = raw.salmonStamp === true;
  const scanRaw = (raw.licenceScan ?? {}) as Record<string, unknown>;
  const frontScan = parseScanAsset(scanRaw, "front");
  if (!frontScan) {
    return NextResponse.json(
      { ok: false, message: "Please scan or upload the front of your driving licence." },
      { status: 400 },
    );
  }
  const backScan = parseScanAsset(scanRaw, "back");
  if (backScan === null) {
    return NextResponse.json(
      { ok: false, message: "The back-of-licence scan could not be verified. Please upload it again." },
      { status: 400 },
    );
  }

  const amount = computeCheckoutAmount({
    provinceSlug,
    residency,
    licenceName,
    licencePrice,
    walleye,
    salmonStamp,
  });
  if (amount == null) {
    return NextResponse.json(
      { ok: false, message: "We could not price this order. Please re-select your licence." },
      { status: 400 },
    );
  }

  const reference = generateOrderReference(provinceSlug);
  saveOrder({
    id: reference,
    reference,
    status: "pending_payment",
    amount,
    provinceSlug,
    residency,
    licenceName,
    email: applicant.email,
    firstName: applicant.firstName,
    lastName: applicant.lastName,
    phone: applicant.phone,
    licenceScan: {
      frontUrl: frontScan.url,
      frontPublicId: frontScan.publicId,
      frontName: frontScan.name,
      backUrl: backScan?.url,
      backPublicId: backScan?.publicId,
      backName: backScan?.name,
    },
    descriptor: NMI_DESCRIPTOR,
    createdAt: new Date().toISOString(),
  });

  const charge = await chargeSale({
    amount,
    paymentToken: payment.token,
    orderId: reference,
    billingZip: payment.billingZip,
    customer: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      email: applicant.email,
      phone: applicant.phone,
    },
    addToVault: vaultEnabled(),
  });

  if (!charge.ok) {
    markOrderFailed(reference, charge.transactionId);
    return NextResponse.json(
      {
        ok: false,
        message: charge.message,
        declineCode: charge.declineCode,
        retriable: charge.retriable,
        reference,
      },
      { status: 402 },
    );
  }

  markOrderPaid(reference, {
    transactionId: charge.transactionId,
    cardLast4: payment.last4,
    cardBrand: payment.brand,
    descriptor: NMI_DESCRIPTOR,
    devMode: charge.devMode,
  });

  return NextResponse.json({
    ok: true,
    reference,
    orderId: reference,
    amount,
    transactionId: charge.transactionId,
    devMode: charge.devMode,
  });
}
