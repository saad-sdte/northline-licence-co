"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react";
import {
  PROVINCES,
  WALLEYE_TAGS,
  formatCad,
  getProvince,
  parseCadPrice,
  type Licence,
  type Province,
  type Residency,
} from "@/lib/provinces";
import { STEPS, DECLARATIONS, GENERIC_DECLARATION, FR } from "@/lib/copy";
import { PaymentStep } from "@/components/PaymentStep";
import type { TokenizedPayment } from "@/lib/checkout";
import {
  ADDRESS_COUNTRIES,
  CANADIAN_PROVINCES,
  EYE_COLOURS,
  FAVOURITE_COLOURS,
  GENDERS,
  HAIR_COLOURS,
  ID_COUNTRIES,
  MONTHS,
  US_STATES,
} from "@/lib/lists";

type Props = {
  initialSlug?: string;
  basePath?: "/apply" | "/services/apply";
};

const emptyApplicant = {
  firstName: "",
  middleName: "",
  lastName: "",
  dobYear: "",
  dobMonth: "",
  dobDay: "",
  email: "",
  phone: "",
  country: "Canada",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  mailingSame: true,
  mailingAddress: "",
  mailingCity: "",
  mailingProvince: "",
  mailingPostalCode: "",
  mailingCountry: "Canada",
  demoGender: "",
  favouriteColour: "",
  eyeColour: "",
  hairColour: "",
  outdoorsCardAnswer: "",
  outdoorsCardNumber: "",
  licenceStartDate: "",
};

const emptyId = {
  idType: "",
  idCountry: "",
  idProvince: "",
  idNumber: "",
  gender: "",
  heightFeet: "",
  heightInches: "",
  weightKg: "",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-foreground block mb-1">{children}</label>;
}

function needsStartDate(licence: Licence | null) {
  return licence ? /\b\d+-day/i.test(licence.name) : false;
}

function homeProvinceName(code: string) {
  if (code === "BC") return "British Columbia";
  if (code === "ON") return "Ontario";
  return "";
}

export function ApplyWizard({ initialSlug, basePath = "/services/apply" }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(initialSlug ? 1 : 0);
  const [province, setProvince] = useState<Province | null>(() =>
    initialSlug ? getProvince(initialSlug) ?? null : null,
  );
  const [residency, setResidency] = useState<Residency | "">("");
  const [licence, setLicence] = useState<Licence | null>(null);
  const [idData, setIdData] = useState(emptyId);
  const [app, setApp] = useState(emptyApplicant);
  const [walleye, setWalleye] = useState("none");
  const [salmonStamp, setSalmonStamp] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showDecl, setShowDecl] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [lang, setLang] = useState<"en" | "fr">(() =>
    initialSlug === "quebec" ? "fr" : "en",
  );
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const t = (s: string) => (province?.code === "QC" && lang === "fr" && FR[s] ? FR[s] : s);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (initialSlug) {
      const p = getProvince(initialSlug);
      if (p) {
        setProvince(p);
        setStep(1);
        if (p.code === "QC") setLang("fr");
      }
    }
  }, [initialSlug]);

  const licences = useMemo(
    () => (province && residency ? province.licences.filter((l) => l.residency === residency) : []),
    [province, residency],
  );

  useEffect(() => {
    if (licences.length === 1) setLicence(licences[0]);
    else setLicence(null);
    setWalleye("none");
    setSalmonStamp(false);
    setApp((a) => ({ ...a, licenceStartDate: "" }));
  }, [residency, province?.code]);

  function selectResidency(value: Residency) {
    setResidency(value);
    if (!province?.residencyByAddress) return;
    const home = homeProvinceName(province.code);
    if (value === "resident") {
      setApp((a) => ({ ...a, country: "Canada", province: home }));
    } else if (value === "canadian-resident") {
      setApp((a) => ({ ...a, country: "Canada", province: "" }));
    } else {
      setApp((a) => ({ ...a, country: "", province: "" }));
    }
  }

  function onAddressCountryChange(country: string) {
    setApp((a) => ({ ...a, country, province: country === "Canada" ? a.province : "" }));
    if (!province?.residencyByAddress) return;
    if (country && country !== "Canada") setResidency("non-resident");
  }

  function onAddressProvinceChange(prov: string) {
    setApp((a) => ({ ...a, province: prov }));
    if (!province?.residencyByAddress || app.country !== "Canada") return;
    const home = homeProvinceName(province.code);
    if (prov === home) setResidency("resident");
    else if (prov) setResidency("canadian-resident");
  }

  useEffect(() => {
    if (!province || !residency) return;
    const req = province.idRequirements?.find((r) => r.residency === residency);
    if (req?.options.length === 1) {
      const opt = req.options[0];
      setIdData((prev) => ({
        ...prev,
        idType: opt.label,
        idCountry: opt.fields.find((f) => f.name === "idCountry")?.preselect || prev.idCountry,
        idProvince:
          opt.fields.find((f) => f.name === "idProvince")?.preselect === "AB"
            ? "Alberta"
            : opt.fields.find((f) => f.name === "idProvince")?.preselect || prev.idProvince,
      }));
    } else {
      setIdData((prev) => ({ ...prev, idType: "", idNumber: "" }));
    }
  }, [province, residency]);

  const idOption = province?.idRequirements
    ?.find((r) => r.residency === residency)
    ?.options.find((o) => o.label === idData.idType);

  const cadTotal = useMemo(() => {
    if (!licence) return 0;
    let total = parseCadPrice(licence.price);
    if (province?.code === "AB" && walleye !== "none") {
      total += WALLEYE_TAGS.find((w) => w.id === walleye)?.price ?? 0;
    }
    if (licence.addon && salmonStamp) {
      total += parseCadPrice(licence.addon.price);
    }
    return total;
  }, [licence, province, walleye, salmonStamp]);

  function validate() {
    const next: string[] = [];
    if (step === 0 && !province) next.push("Please select a province");
    if (step === 1) {
      if (!residency) next.push("Please select your residency status");
      if (!licence) next.push("Please select a licence");
      if (province?.residencyByAddress) {
        if (!app.address.trim()) next.push("Street address is required");
        if (!app.city.trim()) next.push("City is required");
        if (!app.postalCode.trim()) next.push("Postal code is required");
        if (app.country === "Canada" && !app.province) next.push("Province is required");
        if (!app.country) next.push("Country is required");
      } else if (province?.requiresPhysicalId) {
        if (!idData.idType) next.push("Please select an ID type");
        if (!idData.idNumber) next.push("Please enter your ID number");
      }
      if (needsStartDate(licence) && !app.licenceStartDate) next.push("Licence start date is required");
    }
    if (step === 2) {
      if (!app.firstName.trim()) next.push("First name is required");
      if (!app.lastName.trim()) next.push("Last name is required");
      if (!app.dobYear || !app.dobMonth || !app.dobDay) next.push("Date of birth is required");
      if (!app.email.trim()) next.push("Email is required");
      if (!app.phone.trim()) next.push("Phone number is required");
      const code = province?.code;
      if (code === "BC") {
        if (!app.demoGender) next.push("Gender is required");
        if (!app.favouriteColour) next.push("Favourite colour is required");
      } else if (code === "MB") {
        if (!app.demoGender) next.push("Gender is required");
        if (!app.eyeColour) next.push("Eye colour is required");
        if (!app.hairColour) next.push("Hair colour is required");
        if (!app.favouriteColour) next.push("Favourite colour is required");
        if (!idData.heightFeet) next.push("Height is required");
      } else if (code === "SK") {
        if (!app.demoGender) next.push("Gender is required");
        if (!app.eyeColour) next.push("Eye colour is required");
        if (!app.hairColour) next.push("Hair colour is required");
        if (!idData.heightFeet) next.push("Height is required");
      } else if (code === "ON") {
        if (!app.demoGender) next.push("Gender is required");
        if (!app.eyeColour) next.push("Eye colour is required");
        if (!idData.heightFeet) next.push("Height is required");
      } else if (code === "QC") {
        if (!app.demoGender) next.push("Gender is required");
      } else {
        if (!app.address.trim()) next.push("Street address is required");
        if (!app.city.trim()) next.push("City is required");
        if (!app.province) next.push("Province is required");
        if (!app.postalCode.trim()) next.push("Postal code is required");
        if (province?.requiresPhysicalId) {
          if (!idData.gender) next.push("Gender is required");
          if (!idData.heightFeet) next.push("Height is required");
          if (!idData.weightKg) next.push("Weight is required");
        }
      }
    }
    if (step === 3 && !agreed) next.push("Please agree to the declaration");
    return next;
  }

  function goNext() {
    const v = validate();
    if (v.length) {
      setErrors(v);
      return;
    }
    setErrors([]);
    if (step === 0 && province) {
      router.push(`${basePath}/${province.slug}`);
      setStep(1);
      return;
    }
    setStep((s) => s + 1);
  }

  function goBack() {
    setErrors([]);
    if (step === 1) {
      router.push(basePath);
      setStep(0);
      return;
    }
    setStep((s) => s - 1);
  }

  async function handlePay(payment: TokenizedPayment) {
    const v = validate();
    if (v.length) {
      setErrors(v);
      return;
    }
    if (!province || !licence || !residency) return;
    setPaying(true);
    setPaymentError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provinceSlug: province.slug,
          residency,
          licenceName: licence.name,
          licencePrice: licence.price,
          walleye,
          salmonStamp,
          agreed,
          applicant: {
            firstName: app.firstName,
            middleName: app.middleName,
            lastName: app.lastName,
            email: app.email,
            phone: app.phone,
          },
          payment,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; orderId?: string; message?: string };
      if (res.ok && json.ok && json.orderId) {
        router.push(`/order-confirmation?order_id=${encodeURIComponent(json.orderId)}`);
        return;
      }
      setPaymentError(
        json.message ?? "Your payment could not be completed. Please try a different card.",
      );
    } catch {
      setPaymentError("We could not reach the payment processor. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  const declaration = (province && DECLARATIONS[province.code]) || GENERIC_DECLARATION;
  const isBC = province?.code === "BC";
  const isON = province?.code === "ON";
  const isMB = province?.code === "MB";
  const isSK = province?.code === "SK";
  const isQC = province?.code === "QC";
  const showResidentialAddress = !isBC && !(isON && residency === "resident");
  const showPostalOnly = isBC || (isON && residency === "resident");
  const showPhysicalId =
    !!province?.requiresPhysicalId && !isBC && !isON && !isMB && !isSK && !isQC;

  return (
    <div>
      <section className="gov-banner py-10 md:py-14">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">
            Get Assistance with Your Canadian Fishing Licence
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ol className="flex items-center justify-center gap-2 md:gap-4 mb-10">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-2 md:gap-4">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                        ? "bg-primary/80 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </span>
                <span className="text-[11px] text-muted-foreground hidden sm:block">{t(label)}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-8 md:w-16 h-px bg-border mb-5" />}
            </li>
          ))}
        </ol>

        {province?.bilingual && (
          <div className="flex justify-end mb-4">
            <div className="inline-flex gap-1">
              <button
                type="button"
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
                onClick={() => setLang("en")}
              >
                English
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  lang === "fr"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
                onClick={() => setLang("fr")}
              >
                Français
              </button>
            </div>
          </div>
        )}

        {step === 0 && (
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold mb-2">{t("Select Your Province")}</h2>
            <p className="text-muted-foreground text-sm mb-6">
              {t("Choose the province where you want to fish.")}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PROVINCES.map((p) => (
                <button
                  key={p.code}
                  onClick={() => setProvince(p)}
                  className={`gov-card rounded p-5 text-center transition-all cursor-pointer ${
                    province?.code === p.code ? "ring-2 ring-primary border-primary" : "hover:border-primary/40 hover:shadow-sm"
                  }`}
                >
                  <span className="block text-xl font-heading font-bold">{p.code}</span>
                  <span className="block text-sm text-foreground font-medium mt-1">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && province && (
          <div className="space-y-6">
            <div className="gov-card rounded p-5 md:p-6 space-y-5">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-1">
                  {province.name} —{" "}
                  {province.residencyByAddress ? "Residency & Licence" : t("Identification & Licence")}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {province.code === "BC"
                    ? "Select your residency status. Your address will be pre-filled accordingly — you can adjust it if needed."
                    : province.code === "ON"
                      ? "Select your residency status to see available licence options."
                      : t("Confirm your residency, provide your ID details, then select your licence.")}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">{t("Residency Status *")}</label>
                <div className="flex flex-wrap gap-2">
                  {province.residencyOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => selectResidency(opt.value)}
                      className={`flex-1 min-w-[140px] text-sm font-medium py-2.5 rounded border transition-colors cursor-pointer ${
                        residency === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {t(opt.label)}
                    </button>
                  ))}
                </div>
              </div>

              {!province.residencyByAddress && (
                <p className="text-xs text-muted-foreground whitespace-pre-line">
                  {t(
                    "Your residency will be verified based on the identification document you provide below.\nIf your ID province differs from your selected residency, it will be adjusted automatically.",
                  )}
                </p>
              )}

              {residency && province.residencyByAddress && (
                <div className="space-y-3">
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {province.code === "ON" && residency === "resident"
                      ? "Ontario Residential Address"
                      : t("Residential Address")}
                  </h3>
                  {province.code === "ON" && residency === "resident" && (
                    <p className="text-xs text-muted-foreground">
                      You must have an Ontario residential address to qualify as an Ontario Resident.
                    </p>
                  )}
                  <div>
                    <FieldLabel>{t("Country *")}</FieldLabel>
                    <select className="field" value={app.country} onChange={(e) => onAddressCountryChange(e.target.value)}>
                      <option value="">{t("Choose one...")}</option>
                      {ADDRESS_COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FieldLabel>{t("Street address *")}</FieldLabel>
                    <input
                      className="field"
                      value={app.address}
                      onChange={(e) => setApp((a) => ({ ...a, address: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <FieldLabel>{t("City/Town *")}</FieldLabel>
                      <input
                        className="field"
                        value={app.city}
                        onChange={(e) => setApp((a) => ({ ...a, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <FieldLabel>
                        {app.country === "Canada" || !app.country ? t("Province/Territory *") : "State/Region"}
                      </FieldLabel>
                      {app.country === "Canada" || !app.country ? (
                        <select className="field" value={app.province} onChange={(e) => onAddressProvinceChange(e.target.value)}>
                          <option value="">{t("Choose one...")}</option>
                          {CANADIAN_PROVINCES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="field"
                          value={app.province}
                          onChange={(e) => setApp((a) => ({ ...a, province: e.target.value }))}
                        />
                      )}
                    </div>
                    <div>
                      <FieldLabel>{t("Postal code *")}</FieldLabel>
                      <input
                        className="field"
                        value={app.postalCode}
                        onChange={(e) => setApp((a) => ({ ...a, postalCode: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {residency === "canadian-resident" && province.code === "ON" && (
                <p className="text-xs text-muted-foreground">
                  This confirms that you have lived in Canada for at least 6 consecutive months in the past 12 months.
                </p>
              )}

              {residency && province.outdoorsCardQuestion && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground block">
                    Do you have an Outdoors Card number?
                  </label>
                  <div className="flex gap-2">
                    {(["yes", "no"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setApp((a) => ({ ...a, outdoorsCardAnswer: v }))}
                        className={`px-4 py-2 text-sm font-medium rounded border cursor-pointer ${
                          app.outdoorsCardAnswer === v
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {v === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                  {app.outdoorsCardAnswer === "yes" && (
                    <input
                      className="field max-w-sm"
                      placeholder="Outdoors Card number"
                      value={app.outdoorsCardNumber}
                      onChange={(e) => setApp((a) => ({ ...a, outdoorsCardNumber: e.target.value }))}
                    />
                  )}
                </div>
              )}

              {residency && province.residencyByAddress && (
                <div className="bg-secondary rounded p-3 text-sm">
                  <span className="text-muted-foreground">Residency status: </span>
                  <span className="text-foreground font-medium">
                    {t(province.residencyOptions.find((o) => o.value === residency)?.label || residency)}
                  </span>
                </div>
              )}
            </div>

            {residency && province.requiresPhysicalId && !province.residencyByAddress && (
              <div className="gov-card rounded p-5 md:p-6 space-y-4">
                <h3 className="font-heading text-lg font-semibold">{t("Identification Details")}</h3>
                <div>
                  <FieldLabel>{t("ID Type *")}</FieldLabel>
                  <select
                    className="field"
                    value={idData.idType}
                    onChange={(e) => setIdData((d) => ({ ...d, idType: e.target.value }))}
                  >
                    <option value="">{t("Choose one...")}</option>
                    {province.idRequirements
                      ?.find((r) => r.residency === residency)
                      ?.options.map((o) => (
                        <option key={o.label} value={o.label}>
                          {o.label}
                        </option>
                      ))}
                  </select>
                </div>
                {idOption && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {idOption.fields.map((f) => (
                      <div key={f.name}>
                        <FieldLabel>{f.label} *</FieldLabel>
                        {f.type === "country-dropdown" ? (
                          <select
                            className="field"
                            value={idData.idCountry}
                            onChange={(e) => setIdData((d) => ({ ...d, idCountry: e.target.value }))}
                          >
                            <option value="">{t("Choose one...")}</option>
                            <option value="Canada">Canada</option>
                            <option value="United States">United States</option>
                            <option disabled>────────────</option>
                            {ID_COUNTRIES.filter((c) => c !== "Canada" && c !== "United States").map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        ) : f.type === "province-dropdown" ? (
                          <select
                            className="field"
                            value={idData.idProvince}
                            onChange={(e) => setIdData((d) => ({ ...d, idProvince: e.target.value }))}
                          >
                            <option value="">{t("Choose one...")}</option>
                            {(idData.idCountry === "United States" ? US_STATES : CANADIAN_PROVINCES).map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="field"
                            value={idData.idNumber}
                            onChange={(e) => setIdData((d) => ({ ...d, idNumber: e.target.value }))}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {residency && licences.length > 0 && (
              <div className="gov-card rounded p-5 md:p-6 space-y-4">
                <h3 className="font-heading text-lg font-bold text-foreground">{t("Available Licences")}</h3>
                {province.code === "AB" && (
                  <>
                    <div className="bg-secondary rounded p-3 text-sm text-foreground">
                      🎣 The Sportfishing Licence covers trout fishing and ice fishing across Alberta.
                    </div>
                    <div className="bg-secondary rounded p-3 text-sm text-foreground">
                      <span className="font-medium">📋 Note:</span> All licence packages automatically include
                      your Wildlife Identification Number (WIN) card — no separate purchase required.
                    </div>
                  </>
                )}
                {province.code === "ON" && (
                  <div className="bg-secondary rounded p-3 text-sm text-foreground">
                    <span className="font-medium">📋 Note:</span> All licence packages include the Outdoors Card
                    — no separate purchase required.
                  </div>
                )}
                {licences.length === 1 ? (
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("Only one licence is available — it has been pre-selected for you.")}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mb-2">{t("Select the licence that suits your needs.")}</p>
                )}

                {province.code === "ON" ? (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <h4 className="text-base font-heading font-bold">Sport Fishing Licences</h4>
                      {licences
                        .filter((l) => l.subcategory === "sport")
                        .map((l) => (
                          <LicenceButton key={l.name + l.price} licence={l} selected={licence} onSelect={setLicence} t={t} />
                        ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-heading font-bold">Conservation Fishing Licences</h4>
                      {licences
                        .filter((l) => l.subcategory === "conservation")
                        .map((l) => (
                          <LicenceButton key={l.name + l.price} licence={l} selected={licence} onSelect={setLicence} t={t} />
                        ))}
                    </div>
                  </div>
                ) : province.code === "BC" ? (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <h4 className="text-base font-heading font-bold">🐟 Freshwater Fishing Licences</h4>
                      <p className="text-xs text-muted-foreground -mt-1">
                        You need a BC Freshwater Fishing Licence for trout, bass and freshwater salmon fishing (in
                        rivers/lakes).
                      </p>
                      {licences
                        .filter((l) => l.group === "freshwater")
                        .map((l) => (
                          <LicenceButton key={l.name + l.price} licence={l} selected={licence} onSelect={setLicence} t={t} />
                        ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-heading font-bold">🦀 Tidal Waters Sport Fishing Licences</h4>
                      <p className="text-xs text-muted-foreground -mt-1">
                        You need a Tidal Waters Fishing Licence for crabbing, shrimping, salmon (stamp needed) and any
                        ocean/tidal waters fishing.
                      </p>
                      {licences
                        .filter((l) => l.group === "tidal")
                        .map((l) => (
                          <LicenceButton
                            key={l.name + l.price}
                            licence={l}
                            selected={licence}
                            onSelect={setLicence}
                            showInfo
                            t={t}
                          />
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {licences.map((l) => (
                      <LicenceButton key={l.name + l.price} licence={l} selected={licence} onSelect={setLicence} t={t} />
                    ))}
                  </div>
                )}

                {licence?.addon && (
                  <div className="border border-border rounded p-3 bg-muted/30 mt-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={salmonStamp}
                        onChange={(e) => setSalmonStamp(e.target.checked)}
                        className="rounded border-border"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-foreground">{licence.addon.name}</span>
                        <span className="text-xs text-muted-foreground block">Optional add-on</span>
                      </div>
                      <span className="text-sm font-bold text-primary">+{licence.addon.price}</span>
                    </label>
                  </div>
                )}

                {needsStartDate(licence) && (
                  <div className="border border-border rounded p-3 bg-muted/30 mt-3">
                    <FieldLabel>Licence Start Date *</FieldLabel>
                    <input
                      type="date"
                      className="field"
                      min={new Date().toISOString().split("T")[0]}
                      value={app.licenceStartDate}
                      onChange={(e) => setApp((a) => ({ ...a, licenceStartDate: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Select the date you want your licence to start.
                    </p>
                  </div>
                )}

                {province.code === "AB" && licence && (
                  <div className="pt-4 space-y-2">
                    <p className="text-sm font-medium">
                      Special Harvest Licence — Walleye Tags{" "}
                      <span className="text-muted-foreground font-normal">Optional add-on · $25.00 each</span>
                    </p>
                    {WALLEYE_TAGS.map((tag) => (
                      <label key={tag.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="walleye"
                          checked={walleye === tag.id}
                          onChange={() => setWalleye(tag.id)}
                        />
                        {tag.label}
                        {tag.description ? ` (${tag.description})` : ""}
                        {tag.price ? ` +CA $25.00` : ""}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 2 && province && (
          <div className="space-y-5">
            <div className="gov-card rounded p-5 md:p-6 space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">{t("Personal Information")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <FieldLabel>{t("First name *")}</FieldLabel>
                  <input className="field" value={app.firstName} onChange={(e) => setApp((a) => ({ ...a, firstName: e.target.value }))} />
                </div>
                <div>
                  <FieldLabel>{t("Middle name (optional)")}</FieldLabel>
                  <input className="field" value={app.middleName} onChange={(e) => setApp((a) => ({ ...a, middleName: e.target.value }))} />
                </div>
                <div>
                  <FieldLabel>{t("Last name *")}</FieldLabel>
                  <input className="field" value={app.lastName} onChange={(e) => setApp((a) => ({ ...a, lastName: e.target.value }))} />
                </div>
              </div>
              <div>
                <FieldLabel>{t("Date of birth *")}</FieldLabel>
                <div className="flex gap-2 max-w-sm">
                  <select className="field" value={app.dobYear} onChange={(e) => setApp((a) => ({ ...a, dobYear: e.target.value }))}>
                    <option value="">{t("Year")}</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <select className="field" value={app.dobMonth} onChange={(e) => setApp((a) => ({ ...a, dobMonth: e.target.value }))}>
                    <option value="">{t("Month")}</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={String(i + 1).padStart(2, "0")}>
                        {t(m)}
                      </option>
                    ))}
                  </select>
                  <select className="field" value={app.dobDay} onChange={(e) => setApp((a) => ({ ...a, dobDay: e.target.value }))}>
                    <option value="">{t("Day")}</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={String(d).padStart(2, "0")}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {showResidentialAddress && <AddressBlock app={app} setApp={setApp} t={t} />}

            {showPostalOnly && (
              <div className="gov-card rounded p-5 md:p-6 space-y-4">
                <h3 className="font-heading text-lg font-semibold text-foreground">Postal Address</h3>
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={app.mailingSame}
                    onChange={(e) => setApp((a) => ({ ...a, mailingSame: e.target.checked }))}
                    className="rounded border-border"
                  />
                  Postal address same as residential address
                </label>
                {!app.mailingSame && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div>
                      <FieldLabel>Country</FieldLabel>
                      <select className="field" value={app.mailingCountry} onChange={(e) => setApp((a) => ({ ...a, mailingCountry: e.target.value }))}>
                        {ADDRESS_COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Street address *</FieldLabel>
                      <input className="field" value={app.mailingAddress} onChange={(e) => setApp((a) => ({ ...a, mailingAddress: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <FieldLabel>City/Town</FieldLabel>
                        <input className="field" value={app.mailingCity} onChange={(e) => setApp((a) => ({ ...a, mailingCity: e.target.value }))} />
                      </div>
                      <div>
                        <FieldLabel>Province/Territory</FieldLabel>
                        <select className="field" value={app.mailingProvince} onChange={(e) => setApp((a) => ({ ...a, mailingProvince: e.target.value }))}>
                          <option value="">Choose one...</option>
                          {CANADIAN_PROVINCES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <FieldLabel>Postal code</FieldLabel>
                        <input className="field" value={app.mailingPostalCode} onChange={(e) => setApp((a) => ({ ...a, mailingPostalCode: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="gov-card rounded p-5 md:p-6 space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">{t("Contact Information")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel>{t("Phone Number *")}</FieldLabel>
                  <input type="tel" className="field" value={app.phone} onChange={(e) => setApp((a) => ({ ...a, phone: e.target.value }))} />
                </div>
                <div>
                  <FieldLabel>{t("Email *")}</FieldLabel>
                  <input type="email" className="field" value={app.email} onChange={(e) => setApp((a) => ({ ...a, email: e.target.value }))} />
                </div>
              </div>
            </div>

            {showPhysicalId && (
              <div className="gov-card rounded p-5 md:p-6 space-y-4">
                <h3 className="font-heading text-lg font-semibold text-foreground">{t("Identification Information")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <SelectField
                    label={t("Gender *")}
                    value={idData.gender}
                    onChange={(v) => setIdData((d) => ({ ...d, gender: v }))}
                    options={GENDERS}
                    t={t}
                  />
                  <HeightFields idData={idData} setIdData={setIdData} />
                  <div>
                    <FieldLabel>Weight (kg) *</FieldLabel>
                    <input
                      type="number"
                      min={20}
                      max={300}
                      placeholder="e.g. 75"
                      className="field"
                      value={idData.weightKg}
                      onChange={(e) => setIdData((d) => ({ ...d, weightKg: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {(isBC || isMB || isON || isSK || isQC) && (
              <div className="gov-card rounded p-5 md:p-6 space-y-4">
                <h3 className="font-heading text-lg font-semibold text-foreground">{t("Demographic Information")}</h3>
                <p className="text-xs text-muted-foreground -mt-2">
                  Provincial wildlife agencies require physical descriptors to verify licence holder identity during
                  conservation enforcement checks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectField
                    label={t("Gender *")}
                    value={app.demoGender}
                    onChange={(v) => setApp((a) => ({ ...a, demoGender: v }))}
                    options={GENDERS}
                    t={t}
                  />
                  {isBC && (
                    <SelectField
                      label="Favourite Colour *"
                      value={app.favouriteColour}
                      onChange={(v) => setApp((a) => ({ ...a, favouriteColour: v }))}
                      options={FAVOURITE_COLOURS}
                      t={t}
                    />
                  )}
                  {(isMB || isON || isSK) && (
                    <SelectField
                      label="Eye Colour *"
                      value={app.eyeColour}
                      onChange={(v) => setApp((a) => ({ ...a, eyeColour: v }))}
                      options={EYE_COLOURS}
                      t={t}
                    />
                  )}
                  {(isMB || isSK) && (
                    <SelectField
                      label="Hair Colour *"
                      value={app.hairColour}
                      onChange={(v) => setApp((a) => ({ ...a, hairColour: v }))}
                      options={HAIR_COLOURS}
                      t={t}
                    />
                  )}
                  {(isMB || isON || isSK) && <HeightFields idData={idData} setIdData={setIdData} />}
                  {isMB && (
                    <SelectField
                      label="Favourite Colour *"
                      value={app.favouriteColour}
                      onChange={(v) => setApp((a) => ({ ...a, favouriteColour: v }))}
                      options={FAVOURITE_COLOURS}
                      t={t}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && province && licence && (
          <div className="space-y-6 max-w-xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-center">{t("Checkout")}</h2>
            <div className="gov-card rounded p-5 md:p-6 space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">{t("Name:")}</span> {app.firstName} {app.middleName} {app.lastName}
              </p>
              <p>
                <span className="text-muted-foreground">{t("Email:")}</span> {app.email}
              </p>
              <p>
                <span className="text-muted-foreground">{t("Licence")}:</span> {licence.name}
              </p>
              <p>
                <span className="text-muted-foreground">{t("Province")}:</span> {province.name}
              </p>
              <p className="pt-3 border-t border-border font-heading text-lg font-bold flex justify-between">
                <span>{t("Total Due")}</span>
                <span>{formatCad(cadTotal)}</span>
              </p>
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              {t("I agree to the declaration and certify that the information provided is accurate.")}
            </label>
            <button type="button" className="text-sm text-gov-link underline" onClick={() => setShowDecl((v) => !v)}>
              {t("Read full declaration")}
            </button>
            {showDecl && (
              <div className="gov-card rounded p-5 text-sm whitespace-pre-line text-muted-foreground">{declaration}</div>
            )}

            <PaymentStep
              total={cadTotal}
              provinceName={province.name}
              licenceName={licence.name}
              processing={paying}
              error={paymentError}
              disabled={!agreed}
              onPay={handlePay}
              t={t}
            />
          </div>
        )}

        {errors.length > 0 && (
          <ul className="mt-6 text-sm text-destructive space-y-1">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}

        <div className={`flex mt-8 ${step === 0 ? "justify-end" : "justify-between"}`}>
          {step > 0 && (
            <button onClick={goBack} className="inline-flex items-center gap-2 px-5 py-2 text-sm border border-border rounded">
              <ArrowLeft className="w-4 h-4" /> {t("BACK")}
            </button>
          )}
          {step < 3 && (
            <button onClick={goNext} className="gov-btn-primary rounded px-5 py-2 text-sm font-semibold inline-flex items-center gap-2">
              {t("NEXT")} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LicenceButton({
  licence,
  selected,
  onSelect,
  showInfo,
  t = (s) => s,
}: {
  licence: Licence;
  selected: Licence | null;
  onSelect: (l: Licence) => void;
  showInfo?: boolean;
  t?: (s: string) => string;
}) {
  const active = selected?.name === licence.name && selected?.price === licence.price;
  return (
    <button
      type="button"
      onClick={() => onSelect(licence)}
      className={`w-full text-left rounded px-3 py-2.5 border transition-all cursor-pointer ${
        active ? "border-primary border-2 bg-secondary" : "border-border bg-card hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
            active ? "border-primary" : "border-muted-foreground/40"
          }`}
        >
          {active && <div className="w-2 h-2 rounded-full bg-primary" />}
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-sm font-medium text-foreground">{t(licence.name)}</span>
          {showInfo && (
            <span title={licence.info || "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing"}>
              <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-primary whitespace-nowrap">
          {formatCad(licence.price)}
        </span>
      </div>
    </button>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  t,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  t: (s: string) => string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{t("Choose one...")}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {t(o)}
          </option>
        ))}
      </select>
    </div>
  );
}

function HeightFields({
  idData,
  setIdData,
}: {
  idData: typeof emptyId;
  setIdData: React.Dispatch<React.SetStateAction<typeof emptyId>>;
}) {
  return (
    <div>
      <FieldLabel>Height *</FieldLabel>
      <div className="grid grid-cols-2 gap-2">
        <select className="field" value={idData.heightFeet} onChange={(e) => setIdData((d) => ({ ...d, heightFeet: e.target.value }))}>
          <option value="">ft</option>
          {[3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={String(n)}>
              {n} ft
            </option>
          ))}
        </select>
        <select className="field" value={idData.heightInches} onChange={(e) => setIdData((d) => ({ ...d, heightInches: e.target.value }))}>
          <option value="">in</option>
          {Array.from({ length: 12 }, (_, i) => i).map((n) => (
            <option key={n} value={String(n)}>
              {n} in
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function AddressBlock({
  app,
  setApp,
  t,
}: {
  app: typeof emptyApplicant;
  setApp: React.Dispatch<React.SetStateAction<typeof emptyApplicant>>;
  t: (s: string) => string;
}) {
  return (
    <div className="gov-card rounded p-5 md:p-6 space-y-4">
      <h3 className="font-heading text-lg font-semibold text-foreground">{t("Residential Address")}</h3>
      <div>
        <FieldLabel>{t("Country *")}</FieldLabel>
        <select className="field" value={app.country} onChange={(e) => setApp((a) => ({ ...a, country: e.target.value }))}>
          {ADDRESS_COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <FieldLabel>{t("Street address *")}</FieldLabel>
        <input className="field" value={app.address} onChange={(e) => setApp((a) => ({ ...a, address: e.target.value }))} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <FieldLabel>{t("City/Town *")}</FieldLabel>
          <input className="field" value={app.city} onChange={(e) => setApp((a) => ({ ...a, city: e.target.value }))} />
        </div>
        <div>
          <FieldLabel>{app.country === "Canada" ? t("Province/Territory *") : "State/Region"}</FieldLabel>
          {app.country === "Canada" ? (
            <select className="field" value={app.province} onChange={(e) => setApp((a) => ({ ...a, province: e.target.value }))}>
              <option value="">{t("Choose one...")}</option>
              {CANADIAN_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          ) : (
            <input className="field" value={app.province} onChange={(e) => setApp((a) => ({ ...a, province: e.target.value }))} />
          )}
        </div>
        <div>
          <FieldLabel>{t("Postal code *")}</FieldLabel>
          <input className="field" value={app.postalCode} onChange={(e) => setApp((a) => ({ ...a, postalCode: e.target.value }))} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={app.mailingSame}
          onChange={(e) => setApp((a) => ({ ...a, mailingSame: e.target.checked }))}
          className="rounded border-border"
        />
        {t("Postal address same as home address")}
      </label>
      {!app.mailingSame && (
        <div className="space-y-3 pt-2 border-t border-border">
          <h4 className="text-sm font-medium text-foreground">{t("Postal Address")}</h4>
          <div>
            <FieldLabel>{t("Country")}</FieldLabel>
            <select className="field" value={app.mailingCountry} onChange={(e) => setApp((a) => ({ ...a, mailingCountry: e.target.value }))}>
              {ADDRESS_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <input className="field" placeholder="Postal address" value={app.mailingAddress} onChange={(e) => setApp((a) => ({ ...a, mailingAddress: e.target.value }))} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input className="field" placeholder="City/Town" value={app.mailingCity} onChange={(e) => setApp((a) => ({ ...a, mailingCity: e.target.value }))} />
            <select className="field" value={app.mailingProvince} onChange={(e) => setApp((a) => ({ ...a, mailingProvince: e.target.value }))}>
              <option value="">Province/Territory</option>
              {CANADIAN_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input className="field" placeholder="Postal code" value={app.mailingPostalCode} onChange={(e) => setApp((a) => ({ ...a, mailingPostalCode: e.target.value }))} />
          </div>
        </div>
      )}
    </div>
  );
}
