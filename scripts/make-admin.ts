import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function makeFirstUserAdmin() {
  console.log("Admin təyini başladılır...");
  
  // İlk istifadəçini tapırıq (adətən saytın yaradıcısıdır)
  const firstUser = await db.query.users.findFirst();
  
  if (!firstUser) {
    console.log("Sistemdə heç bir istifadəçi tapılmadı.");
    process.exit(1);
  }
  
  console.log(`İstifadəçi tapıldı: ${firstUser.email}. Admin edilir...`);
  
  await db
    .update(users)
    .set({ role: "admin" })
    .where(eq(users.id, firstUser.id));
    
  console.log("Uğurla tamamlandı! Artıq /admin panelinə daxil ola bilərsiniz.");
  process.exit(0);
}

makeFirstUserAdmin().catch(console.error);
