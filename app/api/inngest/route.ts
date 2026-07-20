import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { 
  processBackgroundRemoval, 
  processUpscaler,
  processImageToImage,
  processObjectRemoval,
  processVideoGeneration,
  processVideoEditing
} from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processBackgroundRemoval,
    processUpscaler,
    processImageToImage,
    processObjectRemoval,
    processVideoGeneration,
    processVideoEditing
  ],
});
