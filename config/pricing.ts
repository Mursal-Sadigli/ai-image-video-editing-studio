// =========================================================
// Subscription Planları
// =========================================================

export const PLANS = {
  free: {
    id: "free" as const,
    name: "Free",
    description: "Əsas AI generasiya ilə tanışlıq üçün",
    monthlyCredits: 20,
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceIdMonthly: "",
    stripePriceIdYearly: "",
    features: [
      "Aylıq 20 credit",
      "Şəkil generasiyası",
      "Arxa fon silmə",
      "Standart keyfiyyət",
      "720p maksimum rezolyusiya",
    ],
    limits: {
      maxResolution: "720p" as const,
      maxVideoLengthSeconds: 5,
      teamMembers: 0,
      projectsLimit: 5,
      maxVariants: 1,
    },
  },
  starter: {
    id: "starter" as const,
    name: "Starter",
    description: "Fərdi istifadəçilər və freelancer-lər üçün",
    monthlyCredits: 100,
    priceMonthly: 999, // $9.99
    priceYearly: 9590, // $95.90 (2 ay pulsuz)
    stripePriceIdMonthly: "",
    stripePriceIdYearly: "",
    features: [
      "Aylıq 100 credit",
      "Bütün AI alətləri",
      "1080p rezolyusiya",
      "10 saniyə video",
      "20 layihə",
      "Prioritet dəstək",
    ],
    limits: {
      maxResolution: "1080p" as const,
      maxVideoLengthSeconds: 10,
      teamMembers: 0,
      projectsLimit: 20,
      maxVariants: 2,
    },
  },
  pro: {
    id: "pro" as const,
    name: "Pro",
    description: "Professional yaradıcılar və kiçik komandalar üçün",
    monthlyCredits: 500,
    priceMonthly: 2999, // $29.99
    priceYearly: 28790, // $287.90 (2 ay pulsuz)
    stripePriceIdMonthly: "",
    stripePriceIdYearly: "",
    popular: true,
    features: [
      "Aylıq 500 credit",
      "Bütün AI alətləri",
      "4K rezolyusiya",
      "10 saniyə video",
      "Limitsiz layihə",
      "5 komanda üzvü",
      "API girişi",
      "Prioritet dəstək",
    ],
    limits: {
      maxResolution: "4k" as const,
      maxVideoLengthSeconds: 10,
      teamMembers: 5,
      projectsLimit: -1, // limitsiz
      maxVariants: 4,
    },
  },
  business: {
    id: "business" as const,
    name: "Business",
    description: "Agentliklər və böyük komandalar üçün",
    monthlyCredits: 2000,
    priceMonthly: 9999, // $99.99
    priceYearly: 95990, // $959.90 (2 ay pulsuz)
    stripePriceIdMonthly: "",
    stripePriceIdYearly: "",
    features: [
      "Aylıq 2000 credit",
      "Bütün AI alətləri",
      "4K rezolyusiya",
      "10 saniyə video",
      "Limitsiz layihə",
      "Limitsiz komanda üzvü",
      "API girişi",
      "Dedik account manager",
      "SLA garantiyası",
      "Xüsusi inteqrasiyalar",
    ],
    limits: {
      maxResolution: "4k" as const,
      maxVideoLengthSeconds: 10,
      teamMembers: -1, // limitsiz
      projectsLimit: -1,
      maxVariants: 4,
    },
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type Plan = (typeof PLANS)[PlanId];

// =========================================================
// Credit Xərcləri (hər alət üçün)
// =========================================================

export const CREDIT_COSTS = {
  image_generation: 2,
  image_to_image: 2,
  video_generation: 10,
  video_editing: 8,
  background_removal: 1,
  upscale: 1,
  object_removal: 2,
} as const;

export type CreditCostKey = keyof typeof CREDIT_COSTS;

// =========================================================
// Credit Paketləri
// =========================================================

export const CREDIT_PACKS = [
  {
    name: "Başlanğıc Paket",
    credits: 50,
    priceCents: 499, // $4.99
    stripePriceId: "",
  },
  {
    name: "Standart Paket",
    credits: 200,
    priceCents: 1499, // $14.99
    popular: true,
    stripePriceId: "",
  },
  {
    name: "Professional Paket",
    credits: 500,
    priceCents: 2999, // $29.99
    stripePriceId: "",
  },
  {
    name: "Mega Paket",
    credits: 1500,
    priceCents: 6999, // $69.99
    stripePriceId: "",
  },
] as const;

// =========================================================
// Pulsuz başlanğıc creditləri
// =========================================================

export const FREE_SIGNUP_CREDITS = 20;
