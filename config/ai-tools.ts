import type { AIToolConfig } from "@/types/ai";

// =========================================================
// AI Alətləri Konfiqurasiyası
// =========================================================

export const AI_TOOLS: AIToolConfig[] = [
  {
    id: "image-to-image",
    type: "image_to_image",
    name: "Image-to-Image",
    description:
      "Mövcud şəkli transformasiya edin — stil dəyişimi, real toxuma qorunaraq.",
    icon: "ArrowRightLeft",
    href: "/studio/image-to-image",
    creditCost: 2,
    category: "image",
    acceptsInput: true,
    isAvailable: true,
    demoImage: "/images/image-to-image.png",
  },
  {
    id: "video-generation",
    type: "video_generation",
    name: "Video Generation",
    description:
      "Mətn və ya şəkildən hyper-realistic videolar yaradın.",
    icon: "Film",
    href: "/studio/video-generation",
    creditCost: 10,
    category: "video",
    acceptsInput: false,
    isAvailable: true,
    demoImage: "/images/video-generation.png",
    demoVideo: "/api/video",
  },
  {
    id: "video-editing",
    type: "video_editing",
    name: "Video Editing",
    description:
      "Video üzərində AI dəstəkli redaktə. Məsələn, qızın çay içdiyi kadrı fərqli stillərdə animasiya edin.",
    icon: "Clapperboard",
    href: "/studio/video-editing",
    creditCost: 8,
    category: "video",
    acceptsInput: true,
    isAvailable: true,
    demoImage: "/images/video-editing.png",
  },
  {
    id: "background-removal",
    type: "background_removal",
    name: "Background Removal",
    description:
      "Bir klikdə arxa fonu avtomatik silin və şəkli tamamilə təmiz bir formada kəsib çıxarın.",
    icon: "Eraser",
    href: "/studio/background-removal",
    creditCost: 1,
    category: "image",
    acceptsInput: true,
    isAvailable: true,
    demoImage: "/images/bg-removal.png",
  },
  {
    id: "upscaler",
    type: "upscale",
    name: "AI Upscaler",
    description:
      "Aşağı keyfiyyətli, bulanıq şəkli 8k rezolyusiyaya qədər kəskinləşdirin. Ən xırda detalları belə bərpa edin.",
    icon: "ZoomIn",
    href: "/studio/upscaler",
    creditCost: 1,
    category: "image",
    acceptsInput: true,
    isAvailable: true,
    demoImage: "/images/upscale.png",
  },
  {
    id: "object-removal",
    type: "object_removal",
    name: "Object Removal",
    description:
      "Şəkildən istənməyən obyektləri silin. AI boşluğu təbii şəkildə doldurur.",
    icon: "Wand2",
    href: "/studio/object-removal",
    creditCost: 2,
    category: "image",
    acceptsInput: true,
    isAvailable: true,
    demoImage: "/images/object-removal.png",
  },
];

// =========================================================
// Helper funksiyalar
// =========================================================

export function getToolById(id: string): AIToolConfig | undefined {
  return AI_TOOLS.find((tool) => tool.id === id);
}

export function getToolByType(type: string): AIToolConfig | undefined {
  return AI_TOOLS.find((tool) => tool.type === type);
}

export function getImageTools(): AIToolConfig[] {
  return AI_TOOLS.filter((tool) => tool.category === "image");
}

export function getVideoTools(): AIToolConfig[] {
  return AI_TOOLS.filter((tool) => tool.category === "video");
}

// =========================================================
// Stil Presetləri (Image Generation üçün)
// =========================================================

export const IMAGE_STYLE_PRESETS = [
  { id: "photorealistic", name: "Photorealistic", description: "Defolt — real fotodan fərqlənməyən", isDefault: true },
  { id: "cinematic", name: "Cinematic", description: "Film kadrı effekti" },
  { id: "studio-lighting", name: "Studio Lighting", description: "Professional studio işıqlandırması" },
  { id: "natural-light", name: "Natural Light", description: "Təbii gün işığı" },
  { id: "product-shot", name: "Product Shot", description: "E-commerce məhsul fotosu" },
  { id: "portrait", name: "Portrait", description: "Professional portret" },
  { id: "architectural", name: "Architectural", description: "Memarlıq vizuallaşdırma" },
  { id: "food", name: "Food Photography", description: "Yemək fotoqrafiyası" },
] as const;

// =========================================================
// Aspect Ratio Seçimləri
// =========================================================

export const ASPECT_RATIOS = [
  { id: "1:1", name: "1:1", description: "Kvadrat", width: 1024, height: 1024 },
  { id: "16:9", name: "16:9", description: "Geniş ekran", width: 1344, height: 768 },
  { id: "9:16", name: "9:16", description: "Portret / Stories", width: 768, height: 1344 },
  { id: "4:3", name: "4:3", description: "Standart", width: 1152, height: 896 },
  { id: "3:4", name: "3:4", description: "Portret", width: 896, height: 1152 },
] as const;
