import { BRAND } from "./brand";

export const STEPS = ["Province", "ID & Licence Type", "Applicant Info", "Checkout"] as const;

export const FAQS = [
  {
    question: "What provinces do you cover for fishing licence assistance?",
    answer:
      "We currently provide fishing licence advisory and application assistance for British Columbia, Ontario, Manitoba, Alberta, Saskatchewan, Quebec, Nova Scotia, and New Brunswick.",
  },
  {
    question: "Are you affiliated with any government agency?",
    answer: `No. ${BRAND.name} is an independent consultancy service. We are not affiliated with, endorsed, or sponsored by any governmental or regulatory entity. We provide advisory assistance to help individuals navigate the fishing licence application process.`,
  },
  {
    question: "How does the application process work?",
    answer:
      "After selecting your province and licence type, you'll fill out a guided application form with your personal details. Once submitted, our team reviews your information and helps facilitate the application with the relevant provincial agency.",
  },
  {
    question: "Do I need to be a resident of a province to get a fishing licence?",
    answer:
      "No. Most provinces offer both resident and non-resident fishing licences. Non-resident licences typically cost more but are available to anyone. Our system helps you determine the correct residency classification.",
  },
  {
    question: "How long does it take to receive my licence?",
    answer:
      "Processing times vary by province. Most digital licences are available immediately or within a few business days. Our team will provide you with estimated timelines based on your specific province and licence type.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "You have the right to cancel your order within 20 minutes of making the payment to receive a full refund. After the 20-minute window has passed and the order has been processed, there is a strict no-refund policy. Please refer to our Terms and Conditions for full details.",
  },
  {
    question: "Can I apply for multiple provincial licences?",
    answer:
      "Yes. You can apply for fishing licences in any of our covered provinces. Each application is handled separately to ensure compliance with each province's specific requirements.",
  },
  {
    question: "What documents do I need to apply?",
    answer:
      "Requirements vary by province and residency status. Generally, you'll need a valid government-issued ID (such as a driver's licence or passport) and proof of residency if applying for a resident licence. Our application form will guide you through the exact documents needed for your situation.",
  },
];

export const DECLARATIONS: Record<string, string> = {
  AB: `By checking this box, I acknowledge that I have read and understood all warnings, information, policies, laws, regulations, and rules relevant to the fishing licence purchase I am making through My Wild Alberta.

I recognize that I am solely responsible for any misunderstanding or errors made in the application process. Furthermore, I authorize ${BRAND.name.replace(" Canada", "")} to submit my Alberta fishing licence application on my behalf. I understand that once ${BRAND.name.replace(" Canada", "")} completes the application process, this transaction is final and non-refundable.

I agree to pay all associated fees and penalties as applicable. Additionally, I agree to the terms and policies of ${BRAND.name.replace(" Canada", "")}, detailed at ${BRAND.domain}. I accept full responsibility for ensuring the completeness and accuracy of all information provided in my application and acknowledge that failure to comply with these terms may lead to consequences, including but not limited to, the revocation of my fishing licence.`,
  BC: `By checking this box, I acknowledge that I have read and understood all warnings, information, policies, laws, regulations, and rules relevant to the freshwater fishing licence purchase I am making through the Province of British Columbia.

I recognize that I am solely responsible for any misunderstanding or errors made in the application process. Furthermore, I authorize ${BRAND.name.replace(" Canada", "")} to submit my British Columbia freshwater fishing licence application on my behalf. I understand that once ${BRAND.name.replace(" Canada", "")} completes the application process, this transaction is final and non-refundable.

I agree to pay all associated fees and penalties as applicable. Additionally, I agree to the terms and policies of ${BRAND.name.replace(" Canada", "")}, detailed at ${BRAND.domain}. I accept full responsibility for ensuring the completeness and accuracy of all information provided in my application and acknowledge that failure to comply with these terms may lead to consequences, including but not limited to, the revocation of my fishing licence.`,
  ON: `I hereby authorize ${BRAND.name.replace(" Canada", "")} to act on my behalf in submitting my Ontario fishing licence application. I acknowledge and accept that once ${BRAND.name.replace(" Canada", "")} has completed the application process on my behalf, this transaction is non-refundable.

Additionally, I agree to adhere to the terms and policies of ${BRAND.name.replace(" Canada", "")}, detailed at www.${BRAND.domain}. I understand my responsibility to provide complete and accurate information for my application. I am aware that any non-compliance with these terms and policies may result in penalties, including but not limited to the cancellation of my fishing licence.

By checking this box, I confirm that I have read, understood, and agreed to all terms and policies associated with the Ontario fishing licence as outlined on the Hunt and Fish Ontario website.`,
};

export const GENERIC_DECLARATION = `By submitting this application, I declare that all information provided is true, complete, and accurate to the best of my knowledge. I understand that ${BRAND.name} is an independent consultancy service and is not affiliated with, endorsed, or sponsored by any governmental or regulatory entity. I acknowledge that ${BRAND.name} provides advisory and application assistance services, and that all applicable provincial regulations and requirements apply independently of this service.`;

export const FR: Record<string, string> = {
  "Select Your Province": "Sélectionnez votre province",
  "Choose the province where you want to fish.": "Choisissez la province où vous souhaitez pêcher.",
  "Residency Status *": "Statut de résidence *",
  "Your residency will be verified based on the identification document you provide below.\nIf your ID province differs from your selected residency, it will be adjusted automatically.":
    "Votre résidence sera vérifiée en fonction du document d'identité que vous fournirez ci-dessous.\nSi la province de votre pièce d'identité diffère de la résidence sélectionnée, elle sera ajustée automatiquement.",
  "Confirm your residency, provide your ID details, then select your licence.":
    "Confirmez votre résidence, fournissez vos pièces d'identité, puis sélectionnez votre permis.",
  "Available Licences": "Permis disponibles",
  "Only one licence is available — it has been pre-selected for you.":
    "Un seul permis est disponible — il a été présélectionné pour vous.",
  "Select the licence that suits your needs.": "Sélectionnez le permis qui convient à vos besoins.",
  "Identification & Licence": "Identification et permis",
  "Identification Details": "Détails d'identification",
  "Identification Information": "Informations d'identification",
  "ID Type *": "Type de pièce d'identité *",
  "Personal Information": "Informations personnelles",
  "First name *": "Prénom *",
  "Middle name (optional)": "Deuxième prénom (facultatif)",
  "Last name *": "Nom de famille *",
  "Date of birth *": "Date de naissance *",
  Year: "Année",
  Month: "Mois",
  Day: "Jour",
  January: "Janvier",
  February: "Février",
  March: "Mars",
  April: "Avril",
  May: "Mai",
  June: "Juin",
  July: "Juillet",
  August: "Août",
  September: "Septembre",
  October: "Octobre",
  November: "Novembre",
  December: "Décembre",
  "Residential Address": "Adresse résidentielle",
  "Country *": "Pays *",
  "Street address *": "Adresse *",
  "City/Town *": "Ville *",
  "Province/Territory *": "Province/Territoire *",
  "Postal code *": "Code postal *",
  "State/Region": "État/Région",
  "Postal address same as home address": "L'adresse postale est identique à l'adresse résidentielle",
  "Postal Address": "Adresse postale",
  Country: "Pays",
  "Contact Information": "Coordonnées",
  "Phone Number *": "Numéro de téléphone *",
  "Email *": "Courriel *",
  "Demographic Information": "Informations démographiques",
  "Gender *": "Sexe *",
  "Choose one...": "Choisir...",
  Male: "Homme",
  Female: "Femme",
  "Non-binary": "Non-binaire",
  "Prefer not to say": "Préfère ne pas répondre",
  "Payment Summary": "Sommaire du paiement",
  Licence: "Permis",
  Province: "Province",
  "Total Due": "Total à payer",
  "Name:": "Nom :",
  "Email:": "Courriel :",
  "Date of Birth:": "Date de naissance :",
  NEXT: "SUIVANT",
  BACK: "RETOUR",
  "SUBMIT & PAY": "SOUMETTRE ET PAYER",
  "Read full declaration": "Lire la déclaration complète",
  "I agree to the declaration and certify that the information provided is accurate.":
    "J'accepte la déclaration et certifie que les informations fournies sont exactes.",
  "Quebec Resident": "Résident(e) du Québec",
  "Canadian Resident (not in Quebec)": "Résident(e) canadien(ne) (hors Québec)",
  "Non-Canadian Resident (International Customer)": "Résident(e) non canadien(ne) (client international)",
  "Annual Regular Fishing Licence 2026 (Valid to 2027/03/31)":
    "Permis de pêche régulier annuel 2026 (Valide jusqu'au 2027/03/31)",
  "3-Day Regular Fishing Licence": "Permis de pêche régulier de 3 jours",
  "7-Day Regular Fishing Licence": "Permis de pêche régulier de 7 jours",
  "1-Day Regular Fishing Licence": "Permis de pêche régulier de 1 jour",
  "Annual Sport Fishing for Atlantic Salmon 2026 (Valid to 2027/03/31)":
    "Permis de pêche sportive au saumon atlantique annuel 2026 (Valide jusqu'au 2027/03/31)",
  "3-Day Sport Fishing for Atlantic Salmon": "Permis de pêche sportive au saumon atlantique de 3 jours",
  "Fishing Licence for Burbot in Saint-Jean": "Permis de pêche à la lotte au lac Saint-Jean",
  "Initializing payment…": "Initialisation du paiement…",
  "Waiting for payment…": "En attente du paiement…",
  "Complete Payment": "Finaliser le paiement",
  "Secure payment": "Paiement sécurisé",
  "Card number": "Numéro de carte",
  Expiry: "Expiration",
  "Security code": "Code de sécurité",
  "Billing postal / ZIP": "Code postal de facturation",
  "Processing payment…": "Traitement du paiement…",
  "Please agree to the declaration above before completing payment.":
    "Veuillez accepter la déclaration ci-dessus avant de finaliser le paiement.",
  "Your card is charged once. Card details never touch our servers.":
    "Votre carte n'est débitée qu'une seule fois. Les données de carte ne touchent jamais nos serveurs.",
  "Scan Driving Licence": "Numériser le permis de conduire",
  "Upload a photo or scan of your driving licence. Required for every province.":
    "Téléversez une photo ou une numérisation de votre permis de conduire. Requis pour toutes les provinces.",
  "Front of licence *": "Recto du permis *",
  "Back of licence (optional)": "Verso du permis (facultatif)",
  "Take a photo or choose a file": "Prenez une photo ou choisissez un fichier",
  "JPG, PNG, WEBP, HEIC, or PDF · max 8 MB": "JPG, PNG, WEBP, HEIC ou PDF · 8 Mo max",
  "Uploading…": "Téléversement…",
  "Remove file": "Retirer le fichier",
  "Upload failed. Please try a different file.": "Échec du téléversement. Veuillez essayer un autre fichier.",
  "Driving licence scan": "Numérisation du permis de conduire",
  "Front uploaded": "Recto téléversé",
  "Front and back uploaded": "Recto et verso téléversés",
};

export const KNOWLEDGE = [
  {
    title: "Understanding Provincial Regulations",
    body: "Each province operates its own fish and wildlife agency with distinct rules governing seasons, bag limits, gear restrictions, and protected species. Navigating these regulations can be challenging, especially for anglers who fish across multiple provinces. Our advisory service distills complex regulatory frameworks into clear, actionable guidance tailored to your specific needs.",
  },
  {
    title: "Residency & Eligibility",
    body: "Residency definitions vary significantly between provinces. Some require six months of continuous domicile, others define it by primary residence. Military service members, students, and part-year residents often face unique eligibility scenarios. We help you determine your correct classification so you can access the appropriate licence category and pricing.",
  },
  {
    title: "Freshwater vs Tidal Waters",
    body: "Several coastal provinces maintain separate licensing systems for freshwater and tidal (saltwater) fishing. Understanding which licence covers your intended waters — and whether additional endorsements, salmon stamps, or classified waters permits are required — is essential to staying compliant and avoiding penalties.",
  },
  {
    title: "Conservation & Licence Fees",
    body: "Fishing licence fees fund critical conservation programs, habitat restoration, fish stocking, and access improvements. By purchasing the correct licence and any required stamps, anglers directly contribute to the health of Canada's fisheries. Our team ensures you understand how your fees support the waters you enjoy.",
  },
];

export const WHY_US = [
  {
    title: "Institutional Knowledge",
    body: "Deep understanding of fishing regulations built from years of tracking provincial policy changes across Canada.",
  },
  {
    title: "Regulatory Intelligence",
    body: "We monitor rule updates across all covered provinces so you always have current, accurate information.",
  },
  {
    title: "Fast-Track Advisory",
    body: "Streamlined consultancy process designed to save you time and eliminate confusion.",
  },
  {
    title: "Eligibility Expertise",
    body: "Clear guidance on residency requirements, age thresholds, and special exemptions in every province.",
  },
  {
    title: "8 Premier Provinces",
    body: "Focused coverage of eight of Canada's most productive and popular fishing destinations.",
  },
  {
    title: "Dedicated Support",
    body: "Personalized advisory from knowledgeable fishing regulation consultants.",
  },
];

export const SERVICES = [
  {
    title: "Fishing Licence Application Assistance",
    body: "Complete guidance through your province's fishing licence application process, from form selection to submission.",
    points: [
      "Province-specific form identification",
      "Document checklist preparation",
      "Application review & verification",
      "Submission guidance",
    ],
  },
  {
    title: "Provincial Regulation Advisory",
    body: "Comprehensive review of fishing regulations including seasons, bag limits, gear restrictions, and protected species.",
    points: ["Current season schedules", "Species-specific bag limits", "Gear & method restrictions", "Protected waters identification"],
  },
  {
    title: "Eligibility & Residency Assessment",
    body: "Determine your correct residency classification and licence eligibility before you apply.",
    points: [
      "Residency status determination",
      "Military & student eligibility",
      "Age-based exemption review",
      "Discount & waiver identification",
    ],
  },
  {
    title: "Season & Trip Planning Advisory",
    body: "Plan your fishing trips around peak seasons, species runs, and optimal conditions in your target province.",
    points: [
      "Species availability calendar",
      "Peak season identification",
      "Regional hotspot guidance",
      "Weather & condition advisory",
    ],
  },
  {
    title: "Special Permit & Stamp Assistance",
    body: "Navigate salmon licences, classified waters permits, and additional endorsements.",
    points: ["Salmon licence guidance", "Classified waters permits", "Special area permits", "Multi-province coordination"],
  },
  {
    title: "Licence Renewal Support",
    body: "Hassle-free guidance for renewing expiring or expired fishing licences across all covered provinces.",
    points: [
      "Expiration tracking",
      "Renewal process guidance",
      "Lapsed licence reinstatement",
      "Digital licence setup help",
    ],
  },
];
