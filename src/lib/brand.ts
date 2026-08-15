export const BRAND = {
  name: "Northline Licence Co.",
  short: "NORTHLINE LICENCE CO.",
  taglineConsultancy: "Online Fishing Consultancy",
  taglineApplication: "Simplified Online Application Service",
  email: "info@northline.ca",
  domain: "northline.ca",
  legalEntity: "Northline Licence Co. B.V.",
  address: "Arnhemseweg 2",
  city: "3817CH – Amersfoort",
  country: "The Netherlands",
  registration: "91020964",
} as const;

/** Brand name with a single sentence-ending period (name already includes “Co.”). */
export function brandNameStop() {
  return BRAND.name.endsWith(".") ? BRAND.name : `${BRAND.name}.`;
}
