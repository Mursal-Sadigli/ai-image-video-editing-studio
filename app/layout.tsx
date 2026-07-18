import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VisionAI Studio — Hyper-Realistic AI Image & Video Generation",
    template: "%s | VisionAI Studio",
  },
  description:
    "Create photorealistic images and videos indistinguishable from reality. Professional studio quality with AI-powered generation, editing, and enhancement tools.",
  keywords: [
    "AI image generation",
    "photorealistic AI",
    "AI video generation",
    "hyper-realistic",
    "image editing",
    "video editing",
    "background removal",
    "image upscaler",
  ],
  authors: [{ name: "VisionAI Studio" }],
  creator: "VisionAI Studio",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "VisionAI Studio",
    title: "VisionAI Studio — Hyper-Realistic AI Image & Video Generation",
    description:
      "Create photorealistic images and videos indistinguishable from reality.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VisionAI Studio — Hyper-Realistic AI Image & Video Generation",
    description:
      "Create photorealistic images and videos indistinguishable from reality.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
