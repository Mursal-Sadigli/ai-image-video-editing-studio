import { db } from "./lib/db/index";
import { users } from "./lib/db/schema";

async function run() {
  const allUsers = await db.select().from(users);
  console.log("Users:", allUsers);
  process.exit(0);
}
run();
