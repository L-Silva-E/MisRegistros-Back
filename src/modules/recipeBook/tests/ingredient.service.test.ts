import IngredientService from "../services/ingredient.service";
let ingredientService: IngredientService;

import {
  Context,
  MockContext,
  createMockContext,
} from "../../../shared/jest/context";

let mockCtx: MockContext;
let ctx: Context;
const currentDate = new Date();

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
  ingredientService = new IngredientService();
});

test("Create - Ingredient", async () => {
  const ingredient = {
    id: 1,
    name: "Palta",
    unit: "u",
    createdAt: currentDate,
    updatedAt: currentDate,
  };
  mockCtx.prisma.ingredient.create.mockResolvedValue(ingredient);

  await expect(ingredientService.create(ingredient, ctx)).resolves.toEqual({
    id: 1,
    name: "Palta",
    unit: "u",
    createdAt: currentDate,
    updatedAt: currentDate,
  });
});

test("Get - Ingredient", async () => {
  const query = {
    where: { id: 1 },
  };
  const ingredients = [
    {
      id: 1,
      name: "Palta",
      unit: "u",
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  ];
  const count = 1;
  mockCtx.prisma.$transaction.mockResolvedValue([ingredients, count]);

  await expect(ingredientService.get(query, ctx)).resolves.toEqual({
    count: 1,
    ingredients: [
      {
        id: 1,
        name: "Palta",
        unit: "u",
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    ],
  });
});

test("Patch - Ingredient", async () => {
  const ingredient = {
    id: 1,
    name: "Palta",
    unit: "u",
    createdAt: currentDate,
    updatedAt: currentDate,
  };
  mockCtx.prisma.ingredient.update.mockResolvedValue(ingredient);

  await expect(ingredientService.patch(1, ingredient, ctx)).resolves.toEqual({
    id: 1,
    name: "Palta",
    unit: "u",
    createdAt: currentDate,
    updatedAt: currentDate,
  });
});

test("Delete - Ingredient", async () => {
  const ingredient = {
    id: 1,
    name: "Palta",
    unit: "u",
    createdAt: currentDate,
    updatedAt: currentDate,
  };
  mockCtx.prisma.ingredient.delete.mockResolvedValue(ingredient);

  await expect(ingredientService.delete(1, ctx)).resolves.toEqual({
    id: 1,
    name: "Palta",
    unit: "u",
    createdAt: currentDate,
    updatedAt: currentDate,
  });
});
