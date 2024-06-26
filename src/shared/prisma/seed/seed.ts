import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Data
import dataCategories from "./categories";
import dataIngredients from "./ingredients";
import dataOrigins from "./origins";
import dataRecipes from "./recipes";

async function main() {
  console.log("🌱 Seeding... 🌱");

  await generateCategories();
  await generateIngredients();
  await generateOrigins();
  await generateRecipes();
}

async function generateCategories() {
  console.log("> 🍽️ Categories");

  for (const category of dataCategories) {
    await prisma.category.create({
      data: category,
    });
    console.log("  > " + category.name);
  }
}

async function generateIngredients() {
  console.log("> 🍅 Ingredients");

  for (const ingredient of dataIngredients) {
    await prisma.ingredient.create({
      data: ingredient,
    });
    console.log("  > " + ingredient.name);
  }
}

async function generateOrigins() {
  console.log("> 🌍 Origins");

  for (const origin of dataOrigins) {
    await prisma.origin.create({
      data: origin,
    });
    console.log("  > " + origin.name);
  }
}

async function generateRecipes() {
  console.log("> 🍝 Recipes");

  for (const recipe of dataRecipes) {
    await prisma.recipe.create({
      data: {
        ...recipe,
        steps: {
          create: recipe.steps,
        },
        ingredients: {
          create: recipe.ingredients.map((ingredient) => ({
            quantity: ingredient.quantity,
            ingredient: {
              connect: {
                id: ingredient.id,
              },
            },
          })),
        },
      },
    });
    console.log("  > " + recipe.name);
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
