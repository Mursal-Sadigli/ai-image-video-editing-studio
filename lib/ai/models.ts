export type AIProvider = "fal" | "openai" | "google" | "replicate";

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  category: "flux" | "stable-diffusion" | "openai" | "google" | "other";
  creditsCost: number;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "fal-ai/flux/schnell",
    name: "FLUX.1 Schnell",
    provider: "fal",
    description: "Ən sürətli şəkil generasiyası, gündəlik istifadə üçün.",
    category: "flux",
    creditsCost: 1,
  },
  {
    id: "fal-ai/flux/dev",
    name: "FLUX.1 Dev",
    provider: "fal",
    description: "Yüksək keyfiyyət və dəqiqlik, proyektlər üçün ideal.",
    category: "flux",
    creditsCost: 3,
  },
  {
    id: "fal-ai/flux-pro/v1.1",
    name: "FLUX.1 Pro",
    provider: "fal",
    description: "Mükəmməl fotorealizm və sənət əsərləri.",
    category: "flux",
    creditsCost: 5,
  },
  {
    id: "fal-ai/ideogram/v2",
    name: "Ideogram V2",
    provider: "fal",
    description: "Mətn tərkibli şəkillər və loqolar üçün ən yaxşısı.",
    category: "other",
    creditsCost: 4,
  },
  {
    id: "fal-ai/recraft-v3",
    name: "Recraft V3",
    provider: "fal",
    description: "Vektorlar, illüstrasiyalar və dizayn üçün.",
    category: "other",
    creditsCost: 3,
  },
  {
    id: "fal-ai/fast-sdxl",
    name: "Stable Diffusion XL (SDXL)",
    provider: "fal",
    description: "Klassik yüksək keyfiyyətli SDXL modeli.",
    category: "stable-diffusion",
    creditsCost: 2,
  },
  {
    id: "fal-ai/stable-diffusion-v35-large",
    name: "Stable Diffusion 3.5 Large",
    provider: "fal",
    description: "Stability AI-nin ən son və ən güclü modeli.",
    category: "stable-diffusion",
    creditsCost: 6,
  },
  {
    id: "dall-e-3",
    name: "OpenAI DALL-E 3",
    provider: "openai",
    description: "Promptlara ən dəqiq riayət edən OpenAI modeli.",
    category: "openai",
    creditsCost: 8,
  },
  {
    id: "imagen-3",
    name: "Google Gemini (Imagen 3)",
    provider: "google",
    description: "Google-un ən qabaqcıl vizual modeli.",
    category: "google",
    creditsCost: 8,
  },
  {
    id: "veo-3",
    name: "Google Veo",
    provider: "google",
    description: "Google-un ən son generasiya vizual (və video) modeli.",
    category: "google",
    creditsCost: 10,
  }
];

export const getModelById = (modelId: string): AIModel | undefined => {
  return AI_MODELS.find(m => m.id === modelId);
};
