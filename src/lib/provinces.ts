export type Residency = "resident" | "canadian-resident" | "non-resident";

export type IdField = {
  name: "idCountry" | "idProvince" | "idNumber";
  type: "country-dropdown" | "province-dropdown" | "text";
  label: string;
  preselect?: string;
};

export type IdOption = {
  label: string;
  fields: IdField[];
};

export type Licence = {
  name: string;
  price: string;
  eligibility: string;
  category: "fishing";
  residency: Residency;
  group?: "freshwater" | "tidal";
  subcategory?: "sport" | "conservation";
  info?: string;
  addon?: { name: string; price: string };
};

export type Province = {
  code: string;
  slug: string;
  name: string;
  nickname: string;
  description: string;
  residency: string;
  ageReq: string;
  validity: string;
  specialNotes: string;
  licenceCount: number;
  requiresPhysicalId?: boolean;
  residencyByAddress?: boolean;
  outdoorsCardQuestion?: boolean;
  bilingual?: boolean;
  residencyOptions: { value: Residency; label: string }[];
  licences: Licence[];
  idRequirements?: { residency: Residency; options: IdOption[] }[];
};

export const WALLEYE_TAGS = [
  { id: "none", label: "No Walleye Tag", description: "", price: 0 },
  { id: "class-a", label: "Class A (Large)", description: "Over 50 cm", price: 25 },
  { id: "class-b", label: "Class B (Medium)", description: "43–50 cm", price: 25 },
  { id: "class-c", label: "Class C (Small)", description: "Under 43 cm", price: 25 },
] as const;

export const PROVINCES: Province[] = [
  {
    code: "AB",
    slug: "alberta",
    name: "Alberta",
    nickname: "Wild Rose Country",
    description:
      "From Rocky Mountain trout streams to northern pike lakes, Alberta offers diverse freshwater fishing across varied landscapes.",
    residency: "Canadian citizens or permanent residents domiciled in Alberta.",
    ageReq: "16 and older (under 16 free, seniors 65+ free for residents)",
    validity: "April 1 – March 31",
    specialNotes:
      "Wildlife Identification Number (WIN) required. Under 16 and Alberta residents 65+ do not need a licence. Digital licence available via Alberta RELm.",
    licenceCount: 7,
    requiresPhysicalId: true,
    residencyOptions: [
      { value: "resident", label: "Alberta Resident" },
      { value: "canadian-resident", label: "Canadian Resident (not in Alberta)" },
      { value: "non-resident", label: "International Customer (Non-Canadian Resident)" },
    ],
    licences: [
      { name: "Sportfishing Season Licence - Year 2026 (Valid to 2027/03/31)", price: "US $49.95 – CA $69.00", eligibility: "", category: "fishing", residency: "resident" },
      { name: "Sportfishing Season Licence - Year 2026 (Valid to 2027/03/31)", price: "US $74.95 – CA $103.00", eligibility: "", category: "fishing", residency: "canadian-resident" },
      { name: "Sportfishing Licence - 7 Days", price: "US $59.95 – CA $82.00", eligibility: "", category: "fishing", residency: "canadian-resident" },
      { name: "Sportfishing Licence - 1 Day", price: "US $39.95 – CA $55.00", eligibility: "", category: "fishing", residency: "canadian-resident" },
      { name: "Sportfishing Season Licence - Year 2026 (Valid to 2027/03/31)", price: "US $107.95 – CA $148.00", eligibility: "", category: "fishing", residency: "non-resident" },
      { name: "Sportfishing Licence - 7 Days", price: "US $79.95 – CA $110.00", eligibility: "", category: "fishing", residency: "non-resident" },
      { name: "Sportfishing Licence - 1 Day", price: "US $43.95 – CA $61.00", eligibility: "", category: "fishing", residency: "non-resident" },
    ],
    idRequirements: [
      {
        residency: "resident",
        options: [
          {
            label: "Alberta Driver's Licence or Identification Card",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idProvince", type: "province-dropdown", label: "Province/State", preselect: "AB" },
              { name: "idNumber", type: "text", label: "Licence Number / ID Card Number" },
            ],
          },
        ],
      },
      {
        residency: "canadian-resident",
        options: [
          {
            label: "Canadian Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idProvince", type: "province-dropdown", label: "Province", preselect: "" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
          {
            label: "Healthcare ID Number",
            fields: [
              { name: "idProvince", type: "province-dropdown", label: "Province", preselect: "" },
              { name: "idNumber", type: "text", label: "Healthcare ID Number" },
            ],
          },
          {
            label: "Passport Number",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idNumber", type: "text", label: "Passport Number" },
            ],
          },
          { label: "Canadian Armed Forces Number", fields: [{ name: "idNumber", type: "text", label: "Armed Forces Number" }] },
        ],
      },
      {
        residency: "non-resident",
        options: [
          {
            label: "Non-Resident Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "" },
              { name: "idProvince", type: "province-dropdown", label: "Province/State", preselect: "" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
          {
            label: "Passport",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country of Issue", preselect: "" },
              { name: "idNumber", type: "text", label: "Passport Number" },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "BC",
    slug: "british-columbia",
    name: "British Columbia",
    nickname: "Pacific Province",
    description:
      "World-class salmon, steelhead, and trout fishing from Pacific coastal waters to pristine interior lakes and mountain streams.",
    residency: "Canadian citizens or permanent residents domiciled in BC for 6+ months.",
    ageReq: "16 and older",
    validity: "April 1 – March 31",
    specialNotes:
      "Classified waters require additional licence. Non-tidal (freshwater) and tidal (saltwater) licences are separate. Conservation surcharge applies.",
    licenceCount: 21,
    residencyByAddress: true,
    residencyOptions: [
      { value: "resident", label: "B.C. Resident" },
      { value: "canadian-resident", label: "Canadian Resident (not in B.C.)" },
      { value: "non-resident", label: "Non-Canadian Resident / International Customer" },
    ],
    licences: [
      { name: "Freshwater Fishing Licence: 1-Day", price: "US $39.95 – CA $55.00", eligibility: "Valid for selected date", category: "fishing", residency: "resident", group: "freshwater" },
      { name: "Freshwater Fishing Licence: 8-Days", price: "US $49.95 – CA $69.00", eligibility: "Valid for 8 days", category: "fishing", residency: "resident", group: "freshwater" },
      { name: "Freshwater Fishing Licence 2026 Season: Valid from 2026-04-01 to 2027-03-31", price: "US $79.95 – CA $110.00", eligibility: "Valid for licence year", category: "fishing", residency: "resident", group: "freshwater" },
      { name: "Freshwater Fishing Licence: 1-Day", price: "US $39.95 – CA $55.00", eligibility: "Valid for selected date", category: "fishing", residency: "canadian-resident", group: "freshwater" },
      { name: "Freshwater Fishing Licence: 8-Days", price: "US $59.95 – CA $82.00", eligibility: "Valid for 8 days", category: "fishing", residency: "canadian-resident", group: "freshwater" },
      { name: "Freshwater Fishing Licence 2026 Season: Valid from 2026-04-01 to 2027-03-31", price: "US $89.95 – CA $123.00", eligibility: "Valid for licence year", category: "fishing", residency: "canadian-resident", group: "freshwater" },
      { name: "Freshwater Fishing Licence: 1-Day", price: "US $39.95 – CA $55.00", eligibility: "Valid for selected date", category: "fishing", residency: "non-resident", group: "freshwater" },
      { name: "Freshwater Fishing Licence: 8-Days", price: "US $74.95 – CA $103.00", eligibility: "Valid for 8 days", category: "fishing", residency: "non-resident", group: "freshwater" },
      { name: "Freshwater Fishing Licence 2026 Season: Valid from 2026-04-01 to 2027-03-31", price: "US $109.95 – CA $151.00", eligibility: "Valid for licence year", category: "fishing", residency: "non-resident", group: "freshwater" },
      { name: "Tidal Waters Sport Fishing Licence: 1-Day", price: "US $25.00 – CA $35.00", eligibility: "Valid for selected date", category: "fishing", residency: "resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
      { name: "Tidal Waters Sport Fishing Licence: 3-Days", price: "US $29.00 – CA $40.00", eligibility: "Valid for 3 days", category: "fishing", residency: "resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
      { name: "Tidal Waters Sport Fishing Licence: 5-Days", price: "US $36.00 – CA $50.00", eligibility: "Valid for 5 days", category: "fishing", residency: "resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
      { name: "Tidal Waters Sport Fishing Licence 2027 Season (Valid from April 1 to March 31 2027)", price: "US $50.00 – CA $70.00", eligibility: "Valid for licence year", category: "fishing", residency: "resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
      { name: "Tidal Waters Sport Fishing Licence: 1-Day", price: "US $29.00 – CA $40.00", eligibility: "Valid for selected date", category: "fishing", residency: "canadian-resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
      { name: "Tidal Waters Sport Fishing Licence: 3-Days", price: "US $43.00 – CA $60.00", eligibility: "Valid for 3 days", category: "fishing", residency: "canadian-resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
      { name: "Tidal Waters Sport Fishing Licence: 5-Days", price: "US $65.00 – CA $90.00", eligibility: "Valid for 5 days", category: "fishing", residency: "canadian-resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
      { name: "Tidal Waters Sport Fishing Licence 2027 Season (Valid from April 1 to March 31 2027)", price: "US $145.00 – CA $200.00", eligibility: "Valid for licence year", category: "fishing", residency: "canadian-resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
      { name: "Tidal Waters Sport Fishing Licence: 1-Day", price: "US $29.00 – CA $40.00", eligibility: "Valid for selected date", category: "fishing", residency: "non-resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
      { name: "Tidal Waters Sport Fishing Licence: 3-Days", price: "US $43.00 – CA $60.00", eligibility: "Valid for 3 days", category: "fishing", residency: "non-resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
      { name: "Tidal Waters Sport Fishing Licence: 5-Days", price: "US $65.00 – CA $90.00", eligibility: "Valid for 5 days", category: "fishing", residency: "non-resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
      { name: "Tidal Waters Sport Fishing Licence 2027 Season (Valid from April 1 to March 31 2027)", price: "US $145.00 – CA $200.00", eligibility: "Valid for licence year", category: "fishing", residency: "non-resident", group: "tidal", info: "Tidal (saltwater) licence — required for crabbing, prawning, and ocean fishing", addon: { name: "Salmon Conservation Stamp", price: "CA $12.50" } },
    ],
  },
  {
    code: "MB",
    slug: "manitoba",
    name: "Manitoba",
    nickname: "Land of 100,000 Lakes",
    description:
      "Premier destination for walleye, northern pike, and lake trout with vast wilderness lakes and fly-in fishing lodges.",
    residency: "Canadian citizens or permanent residents with principal residence in Manitoba.",
    ageReq: "16 and older",
    validity: "April 1 – March 31",
    specialNotes:
      "Angling licence includes up to 2 children under 16. Free fishing week in June. Conservation licence available with reduced limits.",
    licenceCount: 9,
    requiresPhysicalId: true,
    residencyOptions: [
      { value: "resident", label: "Manitoba Resident" },
      { value: "canadian-resident", label: "Canadian Resident (not in Manitoba)" },
      { value: "non-resident", label: "Non-Canadian Resident (International Customer)" },
    ],
    licences: [
      { name: "1-Day Fishing Licence", price: "US $29.95 – CA $41.00", eligibility: "Valid for selected date", category: "fishing", residency: "resident" },
      { name: "Annual Fishing Licence 2025 (valid until 2026-04-30)", price: "US $49.95 – CA $69.00", eligibility: "Valid until Apr 30, 2026", category: "fishing", residency: "resident" },
      { name: "Annual Fishing Licence 2026 (valid until 2027-04-30) — Reserve", price: "US $49.95 – CA $69.00", eligibility: "Coming soon — reserve now", category: "fishing", residency: "resident" },
      { name: "1-Day Fishing Licence", price: "US $39.95 – CA $55.00", eligibility: "Valid for selected date", category: "fishing", residency: "canadian-resident" },
      { name: "Annual Fishing Licence 2025 (valid until 2026-04-30)", price: "US $89.95 – CA $123.00", eligibility: "Valid until Apr 30, 2026", category: "fishing", residency: "canadian-resident" },
      { name: "Annual Fishing Licence 2026 (valid until 2027-04-30) — Reserve", price: "US $89.95 – CA $123.00", eligibility: "Coming soon — reserve now", category: "fishing", residency: "canadian-resident" },
      { name: "1-Day Fishing Licence", price: "US $39.95 – CA $55.00", eligibility: "Valid for selected date", category: "fishing", residency: "non-resident" },
      { name: "Annual Fishing Licence 2025 (valid until 2026-04-30)", price: "US $89.95 – CA $123.00", eligibility: "Valid until Apr 30, 2026", category: "fishing", residency: "non-resident" },
      { name: "Annual Fishing Licence 2026 (valid until 2027-04-30) — Reserve", price: "US $89.95 – CA $123.00", eligibility: "Coming soon — reserve now", category: "fishing", residency: "non-resident" },
    ],
    idRequirements: [
      {
        residency: "resident",
        options: [
          {
            label: "Manitoba Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idProvince", type: "province-dropdown", label: "Province", preselect: "Manitoba" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
        ],
      },
      {
        residency: "canadian-resident",
        options: [
          {
            label: "Canadian Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idProvince", type: "province-dropdown", label: "Province", preselect: "" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
        ],
      },
      {
        residency: "non-resident",
        options: [
          {
            label: "Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
          {
            label: "Passport",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country of Issue", preselect: "" },
              { name: "idNumber", type: "text", label: "Passport Number" },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "NB",
    slug: "new-brunswick",
    name: "New Brunswick",
    nickname: "Picture Province",
    description:
      "World-renowned Atlantic salmon rivers and excellent bass, trout, and pickerel fishing throughout the Maritime province.",
    residency: "Canadian citizens or permanent residents domiciled in New Brunswick.",
    ageReq: "16 and older",
    validity: "April 1 – March 31",
    specialNotes:
      "Crown Reserve waters require additional permits. Atlantic salmon fishing has species-specific regulations. Youth under 16 fish free with licensed adult.",
    licenceCount: 8,
    requiresPhysicalId: true,
    residencyOptions: [
      { value: "resident", label: "New Brunswick Resident" },
      { value: "non-resident", label: "Non New Brunswick Resident" },
    ],
    licences: [
      { name: "All Species Fishing Licence: Season 2026 (except Salmon) — Valid to 2027/03/31", price: "US $54.95 – CA $76.00", eligibility: "Valid for licence year", category: "fishing", residency: "resident" },
      { name: "Salmon Fishing Licence Season 2026 — Valid to 2027/03/31", price: "US $59.95 – CA $83.00", eligibility: "Valid for licence year", category: "fishing", residency: "resident" },
      { name: "All Species Fishing Licence: Season 2026 (except Salmon) — Valid to 2027/03/31", price: "US $108.95 – CA $150.00", eligibility: "Valid for licence year", category: "fishing", residency: "non-resident" },
      { name: "7-Days All Species (Except Salmon)", price: "US $59.95 – CA $83.00", eligibility: "Valid for 7 days", category: "fishing", residency: "non-resident" },
      { name: "3-Days All Species (Except Salmon)", price: "US $49.95 – CA $69.00", eligibility: "Valid for 3 days", category: "fishing", residency: "non-resident" },
      { name: "Salmon Fishing Licence Season 2026 — Valid to 2027/03/31", price: "US $219.95 – CA $300.00", eligibility: "Valid for licence year", category: "fishing", residency: "non-resident" },
      { name: "7-Days Salmon Fishing Licence", price: "US $144.95 – CA $199.00", eligibility: "Valid for 7 days", category: "fishing", residency: "non-resident" },
      { name: "3-Days Salmon Fishing Licence", price: "US $74.95 – CA $103.00", eligibility: "Valid for 3 days", category: "fishing", residency: "non-resident" },
    ],
    idRequirements: [
      {
        residency: "resident",
        options: [
          {
            label: "New Brunswick Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idProvince", type: "province-dropdown", label: "Province", preselect: "New Brunswick" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
          {
            label: "New Brunswick Identification Card",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idProvince", type: "province-dropdown", label: "Province", preselect: "New Brunswick" },
              { name: "idNumber", type: "text", label: "ID Card Number" },
            ],
          },
        ],
      },
      {
        residency: "non-resident",
        options: [
          {
            label: "Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "" },
              { name: "idProvince", type: "province-dropdown", label: "Province/State", preselect: "" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
          {
            label: "Identification Card",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "" },
              { name: "idNumber", type: "text", label: "ID Card Number" },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "NS",
    slug: "nova-scotia",
    name: "Nova Scotia",
    nickname: "Canada's Ocean Playground",
    description:
      "Atlantic salmon, brook trout, and striped bass fishing along rugged coastlines and pristine inland waterways.",
    residency: "Canadian citizens or permanent residents domiciled in Nova Scotia.",
    ageReq: "16 and older",
    validity: "April 1 – March 31",
    specialNotes:
      "Salmon Angling Licence required in addition to regular licence for Atlantic salmon. Under 16 fish free. Catch-and-release only on some rivers.",
    licenceCount: 4,
    residencyOptions: [
      { value: "resident", label: "Nova Scotia Resident" },
      { value: "non-resident", label: "Non Nova Scotia Resident" },
    ],
    licences: [
      { name: "1-Day Angling Licence", price: "US $24.95 – CA $35.00", eligibility: "Valid for selected date", category: "fishing", residency: "resident" },
      { name: "Annual Angling Licence 2026 (Valid to 2027/03/31)", price: "US $44.95 – CA $62.00", eligibility: "Valid for licence year", category: "fishing", residency: "resident" },
      { name: "1-Day Angling Licence", price: "US $29.95 – CA $41.00", eligibility: "Valid for selected date", category: "fishing", residency: "non-resident" },
      { name: "Annual Angling Licence 2026 (Valid to 2027/03/31)", price: "US $49.95 – CA $69.00", eligibility: "Valid for licence year", category: "fishing", residency: "non-resident" },
    ],
  },
  {
    code: "ON",
    slug: "ontario",
    name: "Ontario",
    nickname: "Land of Lakes",
    description:
      "Over 250,000 lakes and 100,000 km of rivers offering exceptional walleye, bass, muskie, pike, and lake trout fishing.",
    residency: "Canadian citizens or permanent residents with primary residence in Ontario.",
    ageReq: "18 and older (under 18 free with licensed adult)",
    validity: "January 1 – December 31",
    specialNotes:
      "Outdoors Card required before purchasing any licence. Free fishing events in February and July. Sport vs Conservation licence categories with different catch limits.",
    licenceCount: 16,
    residencyByAddress: true,
    outdoorsCardQuestion: true,
    residencyOptions: [
      { value: "resident", label: "Ontario Resident" },
      { value: "canadian-resident", label: "Canadian Resident (not in Ontario)" },
      { value: "non-resident", label: "Non-Canadian Resident (International Customer)" },
    ],
    licences: [
      { name: "1-Day Sport Fishing Licence", price: "US $49.95 – CA $69.00", eligibility: "Valid for selected date", category: "fishing", residency: "resident", subcategory: "sport" },
      { name: "1-Season Sport Fishing Licence (Valid until 2026-12-31)", price: "US $79.95 – CA $109.00", eligibility: "Valid for season", category: "fishing", residency: "resident", subcategory: "sport" },
      { name: "3-Seasons Sport Fishing Licence (Valid until 2028-12-31)", price: "US $149.95 – CA $205.00", eligibility: "Valid for 3 seasons", category: "fishing", residency: "resident", subcategory: "sport" },
      { name: "1-Season Conservation Fishing Licence (Valid until 2026-12-31)", price: "US $49.95 – CA $68.00", eligibility: "Reduced catch limits", category: "fishing", residency: "resident", subcategory: "conservation" },
      { name: "3-Seasons Conservation Fishing Licence (Valid until 2028-12-31)", price: "US $79.95 – CA $109.00", eligibility: "Reduced catch limits, 3 seasons", category: "fishing", residency: "resident", subcategory: "conservation" },
      { name: "1-Day Sport Fishing Licence", price: "US $57.95 – CA $79.00", eligibility: "Valid for selected date", category: "fishing", residency: "canadian-resident", subcategory: "sport" },
      { name: "1-Season Sport Fishing Licence (Valid until 2026-12-31)", price: "US $79.95 – CA $109.00", eligibility: "Valid for season", category: "fishing", residency: "canadian-resident", subcategory: "sport" },
      { name: "3-Seasons Sport Fishing Licence (Valid until 2028-12-31)", price: "US $214.95 – CA $294.00", eligibility: "Valid for 3 seasons", category: "fishing", residency: "canadian-resident", subcategory: "sport" },
      { name: "1-Season Conservation Fishing Licence (Valid until 2026-12-31)", price: "US $59.95 – CA $82.00", eligibility: "Reduced catch limits", category: "fishing", residency: "canadian-resident", subcategory: "conservation" },
      { name: "3-Seasons Conservation Fishing Licence (Valid until 2028-12-31)", price: "US $129.95 – CA $178.00", eligibility: "Reduced catch limits, 3 seasons", category: "fishing", residency: "canadian-resident", subcategory: "conservation" },
      { name: "1-Day Sport Fishing Licence", price: "US $64.95 – CA $89.00", eligibility: "Valid for selected date", category: "fishing", residency: "non-resident", subcategory: "sport" },
      { name: "1-Season Sport Fishing Licence (Valid until 2026-12-31)", price: "US $143.95 – CA $197.00", eligibility: "Valid for season", category: "fishing", residency: "non-resident", subcategory: "sport" },
      { name: "3-Seasons Sport Fishing Licence (Valid until 2028-12-31)", price: "US $299.95 – CA $411.00", eligibility: "Valid for 3 seasons", category: "fishing", residency: "non-resident", subcategory: "sport" },
      { name: "8-Day Conservation Fishing Licence", price: "US $59.95 – CA $82.00", eligibility: "Valid for 8 days, reduced limits", category: "fishing", residency: "non-resident", subcategory: "conservation" },
      { name: "1-Season Conservation Fishing Licence (Valid until 2026-12-31)", price: "US $74.95 – CA $103.00", eligibility: "Reduced catch limits", category: "fishing", residency: "non-resident", subcategory: "conservation" },
      { name: "3-Seasons Conservation Fishing Licence (Valid until 2028-12-31)", price: "US $214.95 – CA $294.00", eligibility: "Reduced catch limits, 3 seasons", category: "fishing", residency: "non-resident", subcategory: "conservation" },
    ],
  },
  {
    code: "QC",
    slug: "quebec",
    name: "Quebec",
    nickname: "La Belle Province",
    description:
      "Exceptional fishing for walleye, brook trout, and Atlantic salmon across vast boreal lakes and historic rivers.",
    residency: "Canadian citizens or permanent residents domiciled in Quebec for 183+ days per year.",
    ageReq: "18 and older (under 18 free with licensed adult)",
    validity: "April 1 – March 31",
    specialNotes:
      "Atlantic salmon fishing requires separate exclusive licence. ZEC (controlled harvesting zones) may require additional fees. Bilingual services available (English/French).",
    licenceCount: 19,
    requiresPhysicalId: true,
    bilingual: true,
    residencyOptions: [
      { value: "resident", label: "Quebec Resident" },
      { value: "canadian-resident", label: "Canadian Resident (not in Quebec)" },
      { value: "non-resident", label: "Non-Canadian Resident (International Customer)" },
    ],
    licences: [
      { name: "Annual Regular Fishing Licence 2026 (Valid to 2027/03/31)", price: "US $49.95 – CA $69.00", eligibility: "Valid for licence year", category: "fishing", residency: "resident" },
      { name: "3-Day Regular Fishing Licence", price: "US $39.95 – CA $54.00", eligibility: "Valid for 3 days", category: "fishing", residency: "resident" },
      { name: "Annual Sport Fishing for Atlantic Salmon 2026 (Valid to 2027/03/31)", price: "US $74.95 – CA $103.00", eligibility: "Valid for licence year", category: "fishing", residency: "resident" },
      { name: "3-Day Sport Fishing for Atlantic Salmon", price: "US $49.95 – CA $69.00", eligibility: "Valid for 3 days", category: "fishing", residency: "resident" },
      { name: "Fishing Licence for Burbot in Saint-Jean", price: "US $43.95 – CA $61.00", eligibility: "Saint-Jean area only", category: "fishing", residency: "resident" },
      { name: "Annual Regular Fishing Licence 2026 (Valid to 2027/03/31)", price: "US $129.95 – CA $178.00", eligibility: "Valid for licence year", category: "fishing", residency: "canadian-resident" },
      { name: "7-Day Regular Fishing Licence", price: "US $74.95 – CA $103.00", eligibility: "Valid for 7 days", category: "fishing", residency: "canadian-resident" },
      { name: "3-Day Regular Fishing Licence", price: "US $43.95 – CA $61.00", eligibility: "Valid for 3 days", category: "fishing", residency: "canadian-resident" },
      { name: "1-Day Regular Fishing Licence", price: "US $34.95 – CA $48.00", eligibility: "Valid for selected date", category: "fishing", residency: "canadian-resident" },
      { name: "Annual Sport Fishing for Atlantic Salmon 2026 (Valid to 2027/03/31)", price: "US $239.95 – CA $329.00", eligibility: "Valid for licence year", category: "fishing", residency: "canadian-resident" },
      { name: "3-Day Sport Fishing for Atlantic Salmon", price: "US $64.95 – CA $89.00", eligibility: "Valid for 3 days", category: "fishing", residency: "canadian-resident" },
      { name: "Fishing Licence for Burbot in Saint-Jean", price: "US $108.95 – CA $149.00", eligibility: "Saint-Jean area only", category: "fishing", residency: "canadian-resident" },
      { name: "Annual Regular Fishing Licence 2026 (Valid to 2027/03/31)", price: "US $129.95 – CA $178.00", eligibility: "Valid for licence year", category: "fishing", residency: "non-resident" },
      { name: "7-Day Regular Fishing Licence", price: "US $74.95 – CA $103.00", eligibility: "Valid for 7 days", category: "fishing", residency: "non-resident" },
      { name: "3-Day Regular Fishing Licence", price: "US $43.95 – CA $61.00", eligibility: "Valid for 3 days", category: "fishing", residency: "non-resident" },
      { name: "1-Day Regular Fishing Licence", price: "US $34.95 – CA $48.00", eligibility: "Valid for selected date", category: "fishing", residency: "non-resident" },
      { name: "Annual Sport Fishing for Atlantic Salmon 2026 (Valid to 2027/03/31)", price: "US $239.95 – CA $329.00", eligibility: "Valid for licence year", category: "fishing", residency: "non-resident" },
      { name: "3-Day Sport Fishing for Atlantic Salmon", price: "US $64.95 – CA $89.00", eligibility: "Valid for 3 days", category: "fishing", residency: "non-resident" },
      { name: "Fishing Licence for Burbot in Saint-Jean", price: "US $108.95 – CA $149.00", eligibility: "Saint-Jean area only", category: "fishing", residency: "non-resident" },
    ],
    idRequirements: [
      {
        residency: "resident",
        options: [
          {
            label: "Canadian Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idProvince", type: "province-dropdown", label: "Province", preselect: "Quebec" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
          { label: "Canadian Armed Forces Number", fields: [{ name: "idNumber", type: "text", label: "Armed Forces Number" }] },
          { label: "Canadian Firearms Licence Number", fields: [{ name: "idNumber", type: "text", label: "Firearms Licence Number" }] },
          {
            label: "Passport",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idNumber", type: "text", label: "Passport Number" },
            ],
          },
        ],
      },
      {
        residency: "canadian-resident",
        options: [
          {
            label: "Canadian Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idProvince", type: "province-dropdown", label: "Province", preselect: "" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
          { label: "Canadian Armed Forces Number", fields: [{ name: "idNumber", type: "text", label: "Armed Forces Number" }] },
          { label: "Canadian Firearms Licence Number", fields: [{ name: "idNumber", type: "text", label: "Firearms Licence Number" }] },
          {
            label: "Passport",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idNumber", type: "text", label: "Passport Number" },
            ],
          },
        ],
      },
      {
        residency: "non-resident",
        options: [
          {
            label: "Canadian Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idProvince", type: "province-dropdown", label: "Province", preselect: "" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
          {
            label: "Non-Canadian Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
          { label: "Canadian Armed Forces Number", fields: [{ name: "idNumber", type: "text", label: "Armed Forces Number" }] },
          { label: "Canadian Firearms Licence Number", fields: [{ name: "idNumber", type: "text", label: "Firearms Licence Number" }] },
          {
            label: "Passport",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "" },
              { name: "idNumber", type: "text", label: "Passport Number" },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "SK",
    slug: "saskatchewan",
    name: "Saskatchewan",
    nickname: "Land of Living Skies",
    description:
      "Outstanding northern pike, walleye, and lake trout fishing across 100,000+ lakes in pristine wilderness settings.",
    residency: "Canadian citizens or permanent residents with primary residence in Saskatchewan.",
    ageReq: "16 and older",
    validity: "April 1 – March 31",
    specialNotes:
      "HAL (Hunting, Angling, Trapping Licence) system. Under 16 fish free with licensed adult. Senior discounts available.",
    licenceCount: 9,
    requiresPhysicalId: true,
    residencyOptions: [
      { value: "resident", label: "Saskatchewan Resident" },
      { value: "canadian-resident", label: "Canadian Resident (not in Saskatchewan)" },
      { value: "non-resident", label: "Non-Canadian Resident" },
    ],
    licences: [
      { name: "1-Day Angling Licence", price: "US $29.95 – CA $41.00", eligibility: "Valid for selected date", category: "fishing", residency: "resident" },
      { name: "3-Day Angling Licence", price: "US $39.95 – CA $54.00", eligibility: "Valid for 3 days", category: "fishing", residency: "resident" },
      { name: "Annual Angling Licence 2026 (Valid to 2027/03/31)", price: "US $64.95 – CA $89.00", eligibility: "Valid for licence year", category: "fishing", residency: "resident" },
      { name: "1-Day Angling Licence", price: "US $34.95 – CA $48.00", eligibility: "Valid for selected date", category: "fishing", residency: "canadian-resident" },
      { name: "3-Day Angling Licence", price: "US $74.95 – CA $103.00", eligibility: "Valid for 3 days", category: "fishing", residency: "canadian-resident" },
      { name: "Annual Angling Licence 2026 (Valid to 2027/03/31)", price: "US $108.95 – CA $149.00", eligibility: "Valid for licence year", category: "fishing", residency: "canadian-resident" },
      { name: "1-Day Angling Licence", price: "US $43.95 – CA $61.00", eligibility: "Valid for selected date", category: "fishing", residency: "non-resident" },
      { name: "3-Day Angling Licence", price: "US $74.95 – CA $103.00", eligibility: "Valid for 3 days", category: "fishing", residency: "non-resident" },
      { name: "Annual Angling Licence 2026 (Valid to 2027/03/31)", price: "US $144.95 – CA $199.00", eligibility: "Valid for licence year", category: "fishing", residency: "non-resident" },
    ],
    idRequirements: [
      {
        residency: "resident",
        options: [
          {
            label: "Saskatchewan Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idProvince", type: "province-dropdown", label: "Province", preselect: "Saskatchewan" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
        ],
      },
      {
        residency: "canadian-resident",
        options: [
          {
            label: "Canadian Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "Canada" },
              { name: "idProvince", type: "province-dropdown", label: "Province", preselect: "" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
          { label: "Canadian Armed Forces Number", fields: [{ name: "idNumber", type: "text", label: "Armed Forces Number" }] },
          { label: "Canadian Firearms Licence Number", fields: [{ name: "idNumber", type: "text", label: "Firearms Licence Number" }] },
        ],
      },
      {
        residency: "non-resident",
        options: [
          {
            label: "Non-Canadian Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "" },
              { name: "idProvince", type: "province-dropdown", label: "Province/State", preselect: "" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
          {
            label: "Passport",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "" },
              { name: "idNumber", type: "text", label: "Passport Number" },
            ],
          },
          {
            label: "Non-Resident Driver's Licence",
            fields: [
              { name: "idCountry", type: "country-dropdown", label: "Country", preselect: "" },
              { name: "idNumber", type: "text", label: "Licence Number" },
            ],
          },
        ],
      },
    ],
  },
];

export function getProvince(slugOrCode: string) {
  const key = slugOrCode.toLowerCase();
  return PROVINCES.find((p) => p.slug === key || p.code.toLowerCase() === key);
}

export function parseCadPrice(price: string) {
  const match = price.match(/CA\s*\$([\d,.]+)/i);
  return match ? Number(match[1].replace(",", "")) : 0;
}

export function formatCad(price: string | number) {
  if (typeof price === "number") return `$${price.toFixed(2)}`;
  const match = price.match(/CA\s*(\$[\d,.]+)/i);
  return match ? match[1] : price;
}
