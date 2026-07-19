import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { deleteFile, getFileById } from "@/lib/db/queries/files";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "İcazəsiz giriş" }, { status: 401 });

    const userDb = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    if (!userDb.length) return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });

    const fileId = params.id;
    const file = await getFileById(fileId, userDb[0].id);
    
    if (!file) {
      return NextResponse.json({ error: "Fayl tapılmadı və ya icazəniz yoxdur" }, { status: 404 });
    }

    // TODO: Bura ImageKit və ya s3-dən (cloud) fiziki faylı silmək məntiqi əlavə oluna bilər
    
    const deletedFile = await deleteFile(fileId, userDb[0].id);
    
    if (!deletedFile) {
      return NextResponse.json({ error: "Fayl silinərkən xəta baş verdi" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Fayl silindi" });
  } catch (error: any) {
    console.error("DELETE /api/files/[id] error:", error);
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 });
  }
}
