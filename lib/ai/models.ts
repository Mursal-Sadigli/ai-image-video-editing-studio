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
  // Yeni, pulsuz və mükəmməl modellər buraya əlavə olunacaq
];

export const getModelById = (modelId: string): AIModel | undefined => {
  return AI_MODELS.find(m => m.id === modelId);
};
