import { WALLEYE_TAGS, getProvince, parseCadPrice, type Residency } from "@/lib/provinces";

export type TokenizedPayment = {
  token: string;
  last4?: string;
  brand?: string;
  billingZip?: string;
};

export type CheckoutApplicant = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
};

export type CheckoutPayload = {
  provinceSlug: string;
  residency: Residency;
  licenceName: string;
  licencePrice: string;
  walleye?: string;
  salmonStamp?: boolean;
  agreed: boolean;
  applicant: CheckoutApplicant;
  payment: TokenizedPayment;
};

const RESIDENCIES: Residency[] = ["resident", "canadian-resident", "non-resident"];

export function parseTokenizedPayment(raw: unknown): TokenizedPayment | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.token !== "string" || !p.token.trim()) return null;
  const last4 =
    typeof p.last4 === "string" ? p.last4.replace(/\D/g, "").slice(-4) : "";
  const brand = typeof p.brand === "string" ? p.brand.slice(0, 20) : "";
  const billingZip = typeof p.billingZip === "string" ? p.billingZip.trim().slice(0, 12) : "";
  return {
    token: p.token.trim(),
    last4: last4.length === 4 ? last4 : undefined,
    brand: brand || undefined,
    billingZip: billingZip || undefined,
  };
}

/**
 * Server-authoritative CAD total. Never trust a client-sent amount.
 * Returns null when the catalogue cannot price the selection.
 */
export function computeCheckoutAmount(input: {
  provinceSlug: string;
  residency: string;
  licenceName: string;
  licencePrice: string;
  walleye?: string;
  salmonStamp?: boolean;
}): number | null {
  const province = getProvince(input.provinceSlug);
  if (!province) return null;
  if (!RESIDENCIES.includes(input.residency as Residency)) return null;

  const matches = province.licences.filter(
    (l) => l.residency === input.residency && l.name === input.licenceName,
  );
  const clientCad = input.licencePrice ? parseCadPrice(input.licencePrice) : 0;
  const licence =
    matches.find((l) => clientCad > 0 && parseCadPrice(l.price) === clientCad) ??
    (matches.length === 1 ? matches[0] : undefined);
  if (!licence) return null;

  let total = parseCadPrice(licence.price);
  if (province.code === "AB" && input.walleye && input.walleye !== "none") {
    const tag = WALLEYE_TAGS.find((w) => w.id === input.walleye);
    if (!tag) return null;
    total += tag.price;
  }
  if (input.salmonStamp) {
    if (!licence.addon) return null;
    total += parseCadPrice(licence.addon.price);
  }
  return total > 0 ? Math.round(total * 100) / 100 : null;
}

export function generateOrderReference(provinceSlug: string): string {
  const state = provinceSlug.toUpperCase().replace(/-/g, "").slice(0, 8);
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomBytes = new Uint8Array(3);
  crypto.getRandomValues(randomBytes);
  const random = Array.from(randomBytes)
    .map((b) => (b % 36).toString(36))
    .join("")
    .toUpperCase()
    .slice(0, 4)
    .padStart(4, "0");
  return `AA-${state}-${timestamp}-${random}`;
}
