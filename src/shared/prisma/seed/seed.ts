import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Data
import { dataIngredients } from "./data";

async function main() {
  console.log("🌱 Seeding... 🌱");

  console.log("> 🍅 Ingredients");
  for (const ingredient of dataIngredients) {
    await prisma.ingredient.create({
      data: ingredient,
    });
    console.log("  > " + ingredient.name);
  }
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
