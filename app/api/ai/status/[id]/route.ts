import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGenerationById } from "@/lib/db/queries/generations";
import { getFileById } from "@/lib/db/queries/files";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const generation = await getGenerationById(params.id);
    if (!generation || generation.userId !== userId) {
      return new NextResponse("Not Found", { status: 404 });
    }

    let outputUrl = null;
    if (generation.outputFileId) {
      const file = await getFileById(generation.outputFileId, userId);
      if (file) {
        outputUrl = file.url;
      }
    }

    return NextResponse.json({
      status: generation.status,
      outputUrl,
      error: (generation.parameters as any)?.error,
    });
  } catch (error) {
    console.error("[STATUS_CHECK_ERROR]", error);
    return new NextResponse("Daxili server xətası", { status: 500 });
  }
}
