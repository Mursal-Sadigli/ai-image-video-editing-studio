import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateImage } from "@/lib/inngest/functions/generate-image";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateImage,
  ],
});
