import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { seedRecipeBook } from "./recipeBook";

async function main() {
  console.log("🌱 Seeding... 🌱");

  seedRecipeBook();

  // seedFeatures(); // WIP
}

main()
  .then(async () => {
    console.log("🌳 Seeded! 🌳");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
