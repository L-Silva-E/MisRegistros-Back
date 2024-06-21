import RecipeService from "../services/recipe.service";
let recipeService: RecipeService;

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
  recipeService = new RecipeService();
});

test("Create - Recipe", async () => {
  const recipe = {
    id: 1,
    name: "string",
    description: "string",
    score: 5,
    createdAt: currentDate,
    updatedAt: currentDate,
    ingredients: [
      {
        id: 1,
        quantity: 10,
      },
    ],
    steps: [
      {
        number: 1,
        instruction: "string",
      },
      {
        number: 2,
        instruction: "string",
      },
      {
        number: 3,
        instruction: "string",
      },
    ],
  };
  mockCtx.prisma.recipe.create.mockResolvedValue(recipe);

  await expect(recipeService.create(recipe, ctx)).resolves.toEqual({
    id: 1,
    name: "string",
    description: "string",
    score: 5,
    createdAt: currentDate,
    updatedAt: currentDate,
    ingredients: [
      {
        quantity: 10,
        id: 1,
      },
    ],
    steps: [
      {
        number: 1,
        instruction: "string",
      },
      {
        number: 2,
        instruction: "string",
      },
      {
        number: 3,
        instruction: "string",
      },
    ],
  });
});

test("Get - Recipe", async () => {
  const query = {
    where: { id: 1 },
  };
  const recipes = [
    {
      id: 1,
      name: "string",
      description: "string",
      score: 5,
      createdAt: currentDate,
      updatedAt: currentDate,
      ingredients: [
        {
          quantity: 10,
          ingredient: {
            name: "Tomate",
            unit: "u",
          },
        },
      ],
      steps: [
        {
          number: 1,
          instruction: "string",
        },
        {
          number: 2,
          instruction: "string",
        },
        {
          number: 3,
          instruction: "string",
        },
      ],
    },
  ];
  const count = 1;
  mockCtx.prisma.$transaction.mockResolvedValue([recipes, count]);

  await expect(recipeService.get(query, ctx)).resolves.toEqual({
    count: 1,
    recipes: [
      {
        id: 1,
        name: "string",
        description: "string",
        score: 5,
        createdAt: currentDate,
        updatedAt: currentDate,
        ingredients: [
          {
            quantity: 10,
            ingredient: {
              name: "Tomate",
              unit: "u",
            },
          },
        ],
        steps: [
          {
            number: 1,
            instruction: "string",
          },
          {
            number: 2,
            instruction: "string",
          },
          {
            number: 3,
            instruction: "string",
          },
        ],
      },
    ],
  });
});

test("Patch - Recipe", async () => {
  const recipe = {
    id: 1,
    name: "string",
    description: "string",
    score: 5,
    createdAt: currentDate,
    updatedAt: currentDate,
    ingredients: [
      {
        id: 1,
        quantity: 10,
      },
    ],
    steps: [
      {
        number: 1,
        instruction: "string",
      },
      {
        number: 2,
        instruction: "string",
      },
      {
        number: 3,
        instruction: "string",
      },
    ],
  };
  mockCtx.prisma.recipe.update.mockResolvedValue(recipe);

  await expect(recipeService.patch(1, recipe, ctx)).resolves.toEqual({
    id: 1,
    name: "string",
    description: "string",
    score: 5,
    createdAt: currentDate,
    updatedAt: currentDate,
    ingredients: [
      {
        id: 1,
        quantity: 10,
      },
    ],
    steps: [
      {
        number: 1,
        instruction: "string",
      },
      {
        number: 2,
        instruction: "string",
      },
      {
        number: 3,
        instruction: "string",
      },
    ],
  });
});

test("Delete - Recipe", async () => {
  const recipe = {
    id: 1,
    name: "string",
    description: "string",
    score: 5,
    createdAt: currentDate,
    updatedAt: currentDate,
    ingredients: [
      {
        id: 1,
        quantity: 10,
      },
    ],
    steps: [
      {
        number: 1,
        instruction: "string",
      },
      {
        number: 2,
        instruction: "string",
      },
      {
        number: 3,
        instruction: "string",
      },
    ],
  };
  mockCtx.prisma.recipe.delete.mockResolvedValue(recipe);

  await expect(recipeService.delete(1, ctx)).resolves.toEqual({
    id: 1,
    name: "string",
    description: "string",
    score: 5,
    createdAt: currentDate,
    updatedAt: currentDate,
    ingredients: [
      {
        id: 1,
        quantity: 10,
      },
    ],
    steps: [
      {
        number: 1,
        instruction: "string",
      },
      {
        number: 2,
        instruction: "string",
      },
      {
        number: 3,
        instruction: "string",
      },
    ],
  });
});
