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
    id: "huggingface-flux",
    name: "Hugging Face (FLUX.1 Schnell)",
    provider: "other",
    description: "Hugging Face tərəfindən pulsuz və sürətli FLUX modeli.",
    category: "flux",
    creditsCost: 0,
  }
];

export const getModelById = (modelId: string): AIModel | undefined => {
  return AI_MODELS.find(m => m.id === modelId);
};
