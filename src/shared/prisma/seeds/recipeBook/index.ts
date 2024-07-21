import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Data
import dataCategories from "./categories";
import dataIngredients from "./ingredients";
import dataOrigins from "./origins";
import dataRecipes from "./recipes";

export async function seedRecipeBook() {
  await generateCategories();
  await generateIngredients();
  await generateOrigins();
  await generateRecipes();
}

async function generateCategories() {
  console.log(" > 🍽️  Categories");

  for (const category of dataCategories) {
    await prisma.category.create({
      data: category,
    });
    console.log("  > " + category.name);
  }
}

async function generateIngredients() {
  console.log(" > 🍅 Ingredients");

  for (const ingredient of dataIngredients) {
    await prisma.ingredient.create({
      data: ingredient,
    });
    console.log("  > " + ingredient.name);
  }
}

async function generateOrigins() {
  console.log(" > 🌍 Origins");

  for (const origin of dataOrigins) {
    await prisma.origin.create({
      data: origin,
    });
    console.log("  > " + origin.name);
  }
}

async function generateRecipes() {
  console.log(" > 🍝 Recipes");

  for (const recipe of dataRecipes) {
    const idCategory = await prisma.category.findFirst({
      where: { name: recipe.category },
    });

    const idOrigin = await prisma.origin.findFirst({
      where: { name: recipe.origin },
    });

    const stepsFormatted = recipe.steps.map((step, index) => ({
      number: index + 1,
      instruction: step,
    }));

    const ingredientsFormatted = await Promise.all(
      recipe.ingredients.map(async (ingredient) => {
        const ingredientData = await prisma.ingredient.findFirst({
          where: {
            name: ingredient.name,
          },
        });

        if (ingredientData === undefined) {
          console.log(ingredient);
          console.log(recipe);
        }

        return {
          quantity: ingredient.quantity,
          ingredient: {
            connect: {
              id: ingredientData?.id,
            },
          },
        };
      })
    );

    await prisma.recipe.create({
      data: {
        ...recipe,
        category: {
          connect: { id: idCategory?.id },
        },
        origin: {
          connect: { id: idOrigin?.id },
        },
        steps: {
          create: stepsFormatted,
        },
        ingredients: {
          create: ingredientsFormatted,
        },
      },
    });
    console.log("  > " + recipe.name);
  }
}
