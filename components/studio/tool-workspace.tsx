"use client";

import { ReactNode } from "react";
import { ArrowLeft, Wand2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ToolWorkspaceProps {
  title: string;
  description: string;
  creditCost: number;
  isGenerating: boolean;
  onGenerate: () => void;
  sidebarContent: ReactNode;
  resultContent: ReactNode;
  isGenerateDisabled?: boolean;
}

export function ToolWorkspace({
  title,
  description,
  creditCost,
  isGenerating,
  onGenerate,
  sidebarContent,
  resultContent,
  isGenerateDisabled = false,
}: ToolWorkspaceProps) {
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-100px)] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/studio">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          <p className="text-muted-foreground ml-10">{description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Sidebar (Controls) */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col space-y-6">
          <div className="flex-1 space-y-6">
            {sidebarContent}
          </div>

          <div className="pt-4 border-t sticky bottom-0 bg-background pb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">Qiymət:</span>
              <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md">
                {creditCost} kredit
              </span>
            </div>
            <Button
              className="w-full h-12 text-lg"
              onClick={onGenerate}
              disabled={isGenerating || isGenerateDisabled}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">🌀</span>
                  Gözləyin...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generasiya et
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-8 xl:col-span-9 bg-muted/30 rounded-xl border border-dashed flex items-center justify-center min-h-[500px] overflow-hidden relative">
          {resultContent}
        </div>
      </div>
    </div>
  );
}
