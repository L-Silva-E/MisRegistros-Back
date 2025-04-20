import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { seedRecipeBook } from "./recipeBook";
import { seedFeatures } from "./feature";

async function main() {
  console.log("🌱 Seeding...🌱");

  console.log("\n>>>📚 Recipe Book");
  await seedRecipeBook();

  console.log("\n>>>💡 Feature");
  await seedFeatures();
}

main()
  .then(async () => {
    console.log("\n🌳 Seeded!🌳");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
