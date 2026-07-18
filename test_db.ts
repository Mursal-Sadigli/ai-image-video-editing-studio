import { db } from "./lib/db";
import { users } from "./lib/db/schema";
import { addCreditTransaction } from "./lib/db/queries/credits";
import { createGeneration } from "./lib/db/queries/generations";

async function run() {
  try {
    const user = await db.select().from(users).limit(1);
    if (!user.length) { console.log("No users found"); return; }
    
    console.log("Testing addCreditTransaction...");
    await addCreditTransaction({
      userId: user[0].id,
      amount: -1,
      balanceAfter: 0,
      type: "usage",
      description: "Test",
    });
    
    console.log("Testing createGeneration...");
    await createGeneration({
      userId: user[0].id,
      type: "image_generation",
      prompt: "test",
      creditsCost: 1,
    });
    console.log("Success");
  } catch(e) {
    console.error("ERROR:", e);
  }
}
run();
