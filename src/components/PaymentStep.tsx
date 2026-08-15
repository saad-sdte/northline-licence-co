"use client";

import { useEffect, useMemo, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { CreditCard, HelpCircle, Loader2, Lock } from "lucide-react";
import type { TokenizedPayment } from "@/lib/checkout";
import {
  initInlineCollectJs,
  type InlineField,
  nmiBrowserConfigured,
  submitInlinePayment,
  tokenizeCard,
} from "@/lib/payment-client";
import {
  billingZipError,
  BRAND_LABELS,
  cardNumberError,
  cvvError,
  detectBrand,
  expiryError,
  formatCardNumber,
  formatExpiry,
  type CardBrand,
} from "@/lib/card";
import { formatCad } from "@/lib/provinces";

type FieldKey = "number" | "expiry" | "cvv" | "zip";

const COLLECT_IDS: Record<InlineField, string> = {
  ccnumber: "taa-cc-number",
  ccexp: "taa-cc-exp",
  cvv: "taa-cc-cvv",
};

const FIELD_REQUIRED: Record<InlineField, string> = {
  ccnumber: "Card number is required",
  ccexp: "Expiry date is required",
  cvv: "Security code is required",
};

function BrandBadge({ brand }: { brand: CardBrand }) {
  if (brand === "unknown") {
    return <CreditCard className="h-5 w-5 text-muted-foreground" aria-hidden="true" />;
  }
  const styles: Record<Exclude<CardBrand, "unknown">, string> = {
    visa: "bg-[#1a1f71] text-white",
    mastercard: "bg-slate-900 text-white",
    amex: "bg-[#2e77bc] text-white",
    discover: "bg-[#f48120] text-white",
  };
  const labels: Record<Exclude<CardBrand, "unknown">, string> = {
    visa: "VISA",
    mastercard: "Mastercard",
    amex: "AMEX",
    discover: "Discover",
  };
  return (
    <span
      aria-label={BRAND_LABELS[brand]}
      className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${styles[brand]}`}
    >
      {labels[brand]}
    </span>
  );
}

function CollectFieldFrame({
  id,
  label,
  error,
  ready,
  rightAdornment,
}: {
  id: string;
  label: string;
  error?: string;
  ready: boolean;
  rightAdornment?: ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground block mb-1">
        {label}
        <span className="ml-1 text-destructive" aria-hidden="true">
          *
        </span>
      </label>
      <div className="relative">
        <div
          id={id}
          className={`taa-collect-field flex min-h-[40px] items-center ${
            error ? "taa-collect-field-error" : ""
          } ${rightAdornment ? "pr-11" : ""} ${ready ? "" : "opacity-60"}`}
        />
        {!ready && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        )}
        {ready && rightAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightAdornment}</div>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  error,
  rightAdornment,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  rightAdornment?: ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground block mb-1" htmlFor={props.name}>
        {label}
        {props.required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="relative">
        <input
          id={props.name}
          aria-invalid={error ? true : undefined}
          className={`field ${rightAdornment ? "pr-11" : ""} ${error ? "border-destructive" : ""}`}
          {...props}
        />
        {rightAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightAdornment}</div>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function PaymentStep({
  total,
  provinceName,
  licenceName,
  processing,
  error,
  disabled,
  onPay,
  t = (s) => s,
}: {
  total: number;
  provinceName: string;
  licenceName: string;
  processing: boolean;
  error: string | null;
  disabled?: boolean;
  onPay: (payment: TokenizedPayment) => void;
  t?: (s: string) => string;
}) {
  const liveNmi = nmiBrowserConfigured();
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [tokenizing, setTokenizing] = useState(false);
  const [tokenizeError, setTokenizeError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [liveErrors, setLiveErrors] = useState<Partial<Record<InlineField, string>>>({});
  const [initError, setInitError] = useState<string | null>(null);
  const fieldValidRef = useRef<Record<InlineField, boolean>>({
    ccnumber: false,
    ccexp: false,
    cvv: false,
  });
  const onPayRef = useRef(onPay);
  onPayRef.current = onPay;
  const zipRef = useRef(zip);
  zipRef.current = zip;

  const brand = useMemo(() => detectBrand(number), [number]);
  const busy = processing || tokenizing;

  useEffect(() => {
    if (!liveNmi) return;
    let cancelled = false;
    initInlineCollectJs({
      selectors: {
        ccnumber: `#${COLLECT_IDS.ccnumber}`,
        ccexp: `#${COLLECT_IDS.ccexp}`,
        cvv: `#${COLLECT_IDS.cvv}`,
      },
      onReady: () => {
        if (!cancelled) setReady(true);
      },
      onValidity: (field, valid, message) => {
        fieldValidRef.current[field] = valid;
        if (cancelled) return;
        setLiveErrors((e) => ({ ...e, [field]: valid ? undefined : message || FIELD_REQUIRED[field] }));
      },
      onToken: (card) => {
        if (cancelled) return;
        setTokenizing(false);
        onPayRef.current({
          token: card.token,
          last4: card.last4,
          brand: card.brand ? card.brand.charAt(0).toUpperCase() + card.brand.slice(1) : "",
          billingZip: zipRef.current.trim(),
        });
      },
      onError: (message) => {
        if (cancelled) return;
        setTokenizing(false);
        setTokenizeError(message);
      },
      onTimeout: () => {
        if (cancelled) return;
        setTokenizing(false);
        setTokenizeError("That took longer than expected — check your card details and try again.");
      },
    }).catch(() => {
      if (!cancelled) {
        setInitError("Secure payment fields could not load. Refresh the page and try again.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [liveNmi]);

  function validateField(key: FieldKey) {
    const message =
      key === "number"
        ? cardNumberError(number)
        : key === "expiry"
          ? expiryError(expiry)
          : key === "cvv"
            ? cvvError(cvv, brand)
            : billingZipError(zip);
    setErrors((e) => ({ ...e, [key]: message ?? undefined }));
    return message === null;
  }

  async function handlePay() {
    if (busy) return;
    setTokenizeError(null);

    if (liveNmi) {
      if (initError) {
        setTokenizeError(initError);
        return;
      }
      const zipMessage = billingZipError(zip);
      setErrors((e) => ({ ...e, zip: zipMessage ?? undefined }));

      const nextLive: Partial<Record<InlineField, string>> = {};
      for (const f of ["ccnumber", "ccexp", "cvv"] as InlineField[]) {
        if (!fieldValidRef.current[f]) nextLive[f] = liveErrors[f] ?? FIELD_REQUIRED[f];
      }
      const hasCardErrors = Object.keys(nextLive).length > 0;
      if (hasCardErrors) setLiveErrors((e) => ({ ...e, ...nextLive }));

      if (!ready) {
        setTokenizeError("Secure payment fields are still loading — one moment.");
        return;
      }
      if (zipMessage || hasCardErrors) {
        document.querySelector<HTMLElement>('[data-payment-fields] [aria-invalid="true"]')?.focus();
        return;
      }

      setTokenizing(true);
      submitInlinePayment();
      return;
    }

    const nextErrors: Partial<Record<FieldKey, string>> = {};
    for (const key of ["number", "expiry", "cvv", "zip"] as FieldKey[]) {
      const message =
        key === "number"
          ? cardNumberError(number)
          : key === "expiry"
            ? expiryError(expiry)
            : key === "cvv"
              ? cvvError(cvv, brand)
              : billingZipError(zip);
      if (message) nextErrors[key] = message;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      document.querySelector<HTMLElement>('[data-payment-fields] [aria-invalid="true"]')?.focus();
      return;
    }

    const digits = number.replace(/\D/g, "");
    const [mm, yy] = expiry.split("/");
    setTokenizing(true);
    try {
      const tokenized = await tokenizeCard({
        number: digits,
        expMonth: mm,
        expYear: `20${yy}`,
        cvv,
      });
      onPay({
        token: tokenized.token,
        last4: tokenized.last4,
        brand: BRAND_LABELS[brand],
        billingZip: zip.trim(),
      });
    } catch (err) {
      setTokenizeError(
        err instanceof Error ? err.message : "We couldn't process your card. Please try again.",
      );
    } finally {
      setTokenizing(false);
    }
  }

  return (
    <div className="gov-card rounded p-5 md:p-6 space-y-4">
      <div>
        <h3 className="font-heading text-lg font-semibold">{t("Complete Payment")}</h3>
        <p className="text-xs text-muted-foreground">{t("Secure payment")}</p>
      </div>
      <p className="text-sm">
        {t("Licence")}: {provinceName} — {licenceName}
      </p>
      <p className="font-heading text-lg font-bold">
        {t("Total Due")} {formatCad(total)} CAD
      </p>

      <div data-payment-fields className="grid gap-4 sm:grid-cols-2">
        {liveNmi ? (
          <>
            <div className="sm:col-span-2">
              <CollectFieldFrame
                id={COLLECT_IDS.ccnumber}
                label={t("Card number")}
                error={liveErrors.ccnumber}
                ready={ready}
                rightAdornment={<CreditCard className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
              />
            </div>
            <CollectFieldFrame
              id={COLLECT_IDS.ccexp}
              label={t("Expiry")}
              error={liveErrors.ccexp}
              ready={ready}
            />
            <CollectFieldFrame
              id={COLLECT_IDS.cvv}
              label={t("Security code")}
              error={liveErrors.cvv}
              ready={ready}
              rightAdornment={
                <span className="group relative inline-flex">
                  <span aria-label="Where is my security code?" className="rounded p-1 text-muted-foreground">
                    <HelpCircle className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 w-56 rounded bg-foreground px-3 py-2 text-xs leading-relaxed text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                  >
                    The 3–4 digit code on your card (back for most cards, front for Amex).
                  </span>
                </span>
              }
            />
          </>
        ) : (
          <>
            <div className="sm:col-span-2">
              <Field
                label={t("Card number")}
                name="cardNumber"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                value={number}
                onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                onBlur={() => validateField("number")}
                error={errors.number}
                required
                disabled={busy}
                rightAdornment={<BrandBadge brand={brand} />}
              />
            </div>
            <Field
              label={t("Expiry")}
              name="cardExpiry"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              onBlur={() => validateField("expiry")}
              error={errors.expiry}
              required
              disabled={busy}
            />
            <Field
              label={t("Security code")}
              name="cardCvv"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder={brand === "amex" ? "4 digits" : "3 digits"}
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onBlur={() => validateField("cvv")}
              error={errors.cvv}
              required
              disabled={busy}
              rightAdornment={
                <span className="group relative inline-flex">
                  <span aria-label="Where is my security code?" className="rounded p-1 text-muted-foreground">
                    <HelpCircle className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 w-56 rounded bg-foreground px-3 py-2 text-xs leading-relaxed text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                  >
                    {brand === "amex"
                      ? "American Express: the 4-digit code printed on the front of your card."
                      : "The 3-digit code in the signature panel on the back of your card."}
                  </span>
                </span>
              }
            />
          </>
        )}
        <div className="sm:col-span-2">
          <Field
            label={t("Billing postal / ZIP")}
            name="billingZip"
            type="text"
            autoComplete="postal-code"
            placeholder="A1A 1A1"
            value={zip}
            onChange={(e) => setZip(e.target.value.toUpperCase().slice(0, 12))}
            onBlur={() => validateField("zip")}
            error={errors.zip}
            required
            disabled={busy}
          />
        </div>
      </div>

      {(tokenizeError || error || initError) && (
        <div role="alert" className="rounded border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {tokenizeError ?? error ?? initError}
        </div>
      )}

      {disabled && (
        <p className="text-sm text-destructive">
          {t("Please agree to the declaration above before completing payment.")}
        </p>
      )}

      <button
        type="button"
        disabled={busy || disabled}
        onClick={handlePay}
        className="w-full gov-btn-primary rounded px-5 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        {processing || tokenizing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {t("Processing payment…")}
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" aria-hidden="true" />
            {t("Complete Payment")}
          </>
        )}
      </button>
      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        {t("Your card is charged once. Card details never touch our servers.")}
      </p>
    </div>
  );
}
