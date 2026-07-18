export const siteConfig = {
  name: "VisionAI Studio",
  description:
    "Hyper-realistic AI image & video generation studio. Create photorealistic images and videos indistinguishable from reality.",
  shortDescription: "Photorealistic AI Image & Video Generation",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.png",
  creator: "VisionAI Studio",
  keywords: [
    "AI image generation",
    "photorealistic AI",
    "AI video generation",
    "hyper-realistic",
    "image editing",
    "video editing",
    "background removal",
    "image upscaler",
    "object removal",
    "AI studio",
  ],
  links: {
    twitter: "#",
    github: "#",
    discord: "#",
  },
  support: {
    email: "support@visionai.studio",
    docs: "/docs",
  },
} as const;

export type SiteConfig = typeof siteConfig;
