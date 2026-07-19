import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ImageGenerationForm } from "@/components/studio/image-generation-form";

export const metadata = {
  title: "Studiya | Vision AI",
  description: "Vision AI ilə dərhal şəkillər generasiya edin.",
};

export default async function StudioPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Studiya</h1>
        <p className="text-muted-foreground mt-1">
          Hugging Face FLUX modelinin gücü ilə mətnlərinizi vizual sənətə çevirin.
        </p>
      </div>

      <ImageGenerationForm />
    </div>
  );
}
