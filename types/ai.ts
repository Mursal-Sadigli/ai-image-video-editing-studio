import type {
  generationTypeEnum,
  generationStatusEnum,
} from "@/lib/db/schema";

// =========================================================
// AI Enum Tipləri (sxemdən çıxarılmış)
// =========================================================

export type GenerationType = (typeof generationTypeEnum.enumValues)[number];
export type GenerationStatus = (typeof generationStatusEnum.enumValues)[number];

// =========================================================
// Generasiya Parametrləri
// =========================================================

export interface ImageGenerationParams {
  prompt: string;
  style?: string;
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  numVariants?: 1 | 2 | 4;
  resolution?: "720p" | "1080p" | "4k";
  seed?: number;
}

export interface ImageToImageParams {
  prompt?: string;
  strength?: number; // 0-1, orijinala nə qədər sadiq qalacağı
  style?: string;
}

export interface VideoGenerationParams {
  prompt: string;
  duration?: 5 | 10;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  cameraMotion?: string;
}

export interface VideoEditingParams {
  editType: "trim" | "style_transfer" | "object_tracking";
  startTime?: number;
  endTime?: number;
  style?: string;
}

export interface BackgroundRemovalParams {
  backgroundColor?: "transparent" | "white" | "black" | string;
}

export interface UpscaleParams {
  scale: 2 | 4;
  faceEnhance?: boolean;
}

export interface ObjectRemovalParams {
  maskData: string; // base64 encoded mask
}

export type GenerationParams =
  | ImageGenerationParams
  | ImageToImageParams
  | VideoGenerationParams
  | VideoEditingParams
  | BackgroundRemovalParams
  | UpscaleParams
  | ObjectRemovalParams;

// =========================================================
// AI Provider İnterfeysi
// =========================================================

export interface AIProviderResponse {
  success: boolean;
  outputUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  metadata?: Record<string, unknown>;
  durationMs?: number;
}

export interface AIProviderConfig {
  name: string;
  apiKey: string;
  baseUrl?: string;
  maxRetries?: number;
  timeoutMs?: number;
}

// =========================================================
// Studio Alət Konfiqurasiyası
// =========================================================

export interface AIToolConfig {
  id: string;
  type: GenerationType;
  name: string;
  description: string;
  icon: string;
  href: string;
  creditCost: number;
  category: "image" | "video";
  acceptsInput: boolean; // şəkil/video yükləmə tələb edir?
  isAvailable: boolean;
  demoImage?: string;
  demoVideo?: string;
}
