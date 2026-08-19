import { isOurCloudinaryUrl } from "@/lib/cloudinary";

export const MAX_SCAN_BYTES = 8 * 1024 * 1024;

export const ALLOWED_SCAN_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
] as const;

export type LicenceScanRef = {
  frontUrl: string;
  frontPublicId: string;
  frontName: string;
  backUrl?: string;
  backPublicId?: string;
  backName?: string;
};

export function isAllowedScanType(type: string): boolean {
  return (ALLOWED_SCAN_TYPES as readonly string[]).includes(type.toLowerCase());
}

function safeName(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^\.+/, "").slice(0, 80) || "driving-licence";
}

export function parseScanAsset(raw: Record<string, unknown>, side: "front" | "back") {
  const urlVal = raw[`${side}Url`];
  const idVal = raw[`${side}PublicId`];
  const nameVal = raw[`${side}Name`];
  const url = typeof urlVal === "string" ? urlVal.trim() : "";
  const publicId = typeof idVal === "string" ? idVal.trim() : "";
  const name = typeof nameVal === "string" ? safeName(nameVal) : "";
  if (!url && !publicId && !name) return undefined;
  if (!url || !publicId || !isOurCloudinaryUrl(url)) return null;
  return { url, publicId, name: name || "driving-licence" };
}
