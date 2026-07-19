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
    id: "imagen-3",
    name: "Google Gemini (Imagen 3)",
    provider: "google",
    description: "Google-un ən qabaqcıl vizual modeli.",
    category: "google",
    creditsCost: 8,
  }
];

export const getModelById = (modelId: string): AIModel | undefined => {
  return AI_MODELS.find(m => m.id === modelId);
};
