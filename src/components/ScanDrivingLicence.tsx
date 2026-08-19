"use client";

import { useRef, useState } from "react";
import { Camera, FileText, Upload, X } from "lucide-react";

export type ScanFile = {
  publicId: string;
  url: string;
  previewUrl: string;
  name: string;
  type: string;
  size: number;
};

type Props = {
  front: ScanFile | null;
  back: ScanFile | null;
  onFront: (file: ScanFile | null) => void;
  onBack: (file: ScanFile | null) => void;
  t: (s: string) => string;
};

async function uploadFile(file: File): Promise<ScanFile> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body });
  const json = (await res.json()) as {
    ok?: boolean;
    message?: string;
    file?: ScanFile;
  };
  if (!res.ok || !json.ok || !json.file?.url) {
    throw new Error(json.message || "Upload failed. Please try a different file.");
  }
  return json.file;
}

function Slot({
  label,
  hint,
  file,
  onChange,
  t,
}: {
  label: string;
  hint: string;
  file: ScanFile | null;
  onChange: (file: ScanFile | null) => void;
  t: (s: string) => string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(list: FileList | null) {
    const picked = list?.[0];
    if (!picked) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadFile(picked));
    } catch (err) {
      onChange(null);
      setError(err instanceof Error ? err.message : t("Upload failed. Please try a different file."));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const showImage = Boolean(file && file.type.startsWith("image/") && file.previewUrl);

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-foreground">{label}</p>
      {file ? (
        <div className="border border-border rounded p-3 bg-muted/30 flex items-center gap-3">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={file.previewUrl} alt="" className="w-16 h-16 object-cover rounded border border-border" />
          ) : (
            <div className="w-16 h-16 rounded border border-border bg-background flex items-center justify-center">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-muted"
            aria-label={t("Remove file")}
            onClick={() => onChange(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="border border-dashed border-border rounded p-4 bg-muted/20 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Camera className="w-5 h-5" />
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-sm text-foreground text-center">{busy ? t("Uploading…") : hint}</span>
          <span className="text-xs text-muted-foreground">{t("JPG, PNG, WEBP, HEIC, or PDF · max 8 MB")}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            capture="environment"
            className="sr-only"
            disabled={busy}
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </label>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ScanDrivingLicence({ front, back, onFront, onBack, t }: Props) {
  return (
    <div className="gov-card rounded p-5 md:p-6 space-y-4">
      <div>
        <h3 className="font-heading text-lg font-semibold">{t("Scan Driving Licence")}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {t("Upload a photo or scan of your driving licence. Required for every province.")}
        </p>
      </div>
      <Slot
        label={t("Front of licence *")}
        hint={t("Take a photo or choose a file")}
        file={front}
        onChange={onFront}
        t={t}
      />
      <Slot
        label={t("Back of licence (optional)")}
        hint={t("Take a photo or choose a file")}
        file={back}
        onChange={onBack}
        t={t}
      />
    </div>
  );
}
