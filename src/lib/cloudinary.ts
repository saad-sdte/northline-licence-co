import { v2 as cloudinary } from "cloudinary";

const FOLDER = "northline/driving-licences";

function cloudName(): string {
  return process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? "";
}

export function cloudinaryConfigured(): boolean {
  return Boolean(
    cloudName() && process.env.CLOUDINARY_API_KEY?.trim() && process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

function ensureConfig() {
  if (!cloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.");
  }
  cloudinary.config({
    cloud_name: cloudName(),
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export type CloudinaryUpload = {
  publicId: string;
  url: string;
  bytes: number;
  format?: string;
};

export async function uploadDrivingLicence(input: {
  bytes: Uint8Array;
  mime: string;
}): Promise<CloudinaryUpload> {
  ensureConfig();
  const resourceType = input.mime === "application/pdf" ? "raw" : "image";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        resource_type: resourceType,
        unique_filename: true,
        use_filename: false,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result?.secure_url || !result.public_id) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          bytes: result.bytes ?? input.bytes.byteLength,
          format: result.format,
        });
      },
    );
    stream.end(Buffer.from(input.bytes));
  });
}

export function isOurCloudinaryUrl(url: string): boolean {
  const name = cloudName();
  if (!name) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "res.cloudinary.com" &&
      parsed.pathname.startsWith(`/${name}/`)
    );
  } catch {
    return false;
  }
}

/** Small JPEG thumbnail for in-form preview. PDFs/raw assets are left unchanged. */
export function cloudinaryPreviewUrl(url: string, mime: string): string {
  if (!mime.startsWith("image/") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", "/upload/c_fill,w_128,h_128,f_jpg,q_auto/");
}
