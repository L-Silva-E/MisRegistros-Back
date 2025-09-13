import RecipeService from "../services/recipe.service";
import CategoryService from "../services/category.service";
import OriginService from "../services/origin.service";
import IngredientService from "../services/ingredient.service";
import {
  Context,
  MockContext,
  createMockContext,
} from "../../../shared/jest/context";

describe("RecipeBook Integration Tests", () => {
  let recipeService: RecipeService;
  let categoryService: CategoryService;
  let originService: OriginService;
  let ingredientService: IngredientService;
  let mockCtx: MockContext;
  let ctx: Context;
  const currentDate = new Date();

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    recipeService = new RecipeService();
    categoryService = new CategoryService();
    originService = new OriginService();
    ingredientService = new IngredientService();
  });

  describe("Complete Recipe Creation Workflow", () => {
    it("should create category, origin, ingredients and then a complete recipe", async () => {
      // Arrange - Create Category
      const categoryData = { name: "Pasta" };
      const createdCategory = {
        id: 1,
        name: "Pasta",
        createdAt: currentDate,
        updatedAt: currentDate,
      };
      mockCtx.prisma.category.create.mockResolvedValueOnce(createdCategory);

      // Arrange - Create Origin
      const originData = { name: "Italiana" };
      const createdOrigin = {
        id: 1,
        name: "Italiana",
        createdAt: currentDate,
        updatedAt: currentDate,
      };
      mockCtx.prisma.origin.create.mockResolvedValueOnce(createdOrigin);

      // Arrange - Create Ingredients
      const ingredient1Data = { name: "Fideos", unit: "g" };
      const ingredient2Data = { name: "Salsa de Tomate", unit: "ml" };

      const createdIngredient1 = {
        id: 1,
        name: "Fideos",
        unit: "g",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      const createdIngredient2 = {
        id: 2,
        name: "Salsa de Tomate",
        unit: "ml",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.ingredient.create
        .mockResolvedValueOnce(createdIngredient1)
        .mockResolvedValueOnce(createdIngredient2);

      // Arrange - Create Recipe
      const recipeData = {
        idCategory: 1,
        idOrigin: 1,
        name: "Pasta Italiana",
        description: "Una deliciosa pasta italiana tradicional",
        score: 5,
        thumbnail: "https://example.com/pasta.jpg",
        time: 30,
        servings: 4,
        ingredients: [
          { id: 1, quantity: 500 },
          { id: 2, quantity: 200 },
        ],
        steps: [
          { number: 1, instruction: "Hervir agua en una olla grande" },
          { number: 2, instruction: "Agregar sal al agua" },
          { number: 3, instruction: "Cocinar la pasta por 10-12 minutos" },
        ] as any,
      };

      const createdRecipe = {
        id: 1,
        idCategory: 1,
        idOrigin: 1,
        name: "Pasta Italiana",
        description: "Una deliciosa pasta italiana tradicional",
        score: 5,
        thumbnail: "https://example.com/pasta.jpg",
        time: 30,
        servings: 4,
        createdAt: currentDate,
        updatedAt: currentDate,
        category: { name: "Pasta" },
        origin: { name: "Italiana" },
        ingredients: [
          {
            quantity: 500,
            ingredient: { id: 1, name: "Fideos", unit: "g" },
          },
          {
            quantity: 200,
            ingredient: { id: 2, name: "Salsa de Tomate", unit: "ml" },
          },
        ],
        steps: [
          { number: 1, instruction: "Hervir agua en una olla grande" },
          { number: 2, instruction: "Agregar sal al agua" },
          { number: 3, instruction: "Cocinar la pasta por 10-12 minutos" },
        ],
      };

      mockCtx.prisma.recipe.create.mockResolvedValue(createdRecipe);

      // Act
      const category = await categoryService.create(categoryData, ctx);
      const origin = await originService.create(originData, ctx);
      const ingredient1 = await ingredientService.create(ingredient1Data, ctx);
      const ingredient2 = await ingredientService.create(ingredient2Data, ctx);
      const recipe = await recipeService.create(recipeData, ctx);

      // Assert
      expect(category).toEqual(createdCategory);
      expect(origin).toEqual(createdOrigin);
      expect(ingredient1).toEqual(createdIngredient1);
      expect(ingredient2).toEqual(createdIngredient2);
      expect(recipe).toEqual(createdRecipe);

      // Verify the correct sequence of calls
      expect(mockCtx.prisma.category.create).toHaveBeenCalledWith({
        data: categoryData,
      });
      expect(mockCtx.prisma.origin.create).toHaveBeenCalledWith({
        data: originData,
      });
      expect(mockCtx.prisma.ingredient.create).toHaveBeenCalledTimes(2);
      expect(mockCtx.prisma.recipe.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: "Pasta Italiana",
            idCategory: 1,
            idOrigin: 1,
          }),
        })
      );
    });

    it("should handle recipe search with related data", async () => {
      // Arrange
      const searchQuery = {
        where: {
          OR: [
            { name: { contains: "pasta" } },
            { category: { name: { contains: "pasta" } } },
            { origin: { name: { contains: "italia" } } },
          ],
        },
        take: 10,
        skip: 0,
      };

      const searchResults = [
        {
          id: 1,
          idCategory: 1,
          idOrigin: 1,
          name: "Pasta Italiana",
          description: "Una deliciosa pasta italiana",
          score: 5,
          thumbnail: "https://example.com/pasta.jpg",
          time: 30,
          servings: 4,
          createdAt: currentDate,
          updatedAt: currentDate,
          category: { name: "Pasta" },
          origin: { name: "Italiana" },
          ingredients: [
            {
              quantity: 500,
              ingredient: { id: 1, name: "Fideos", unit: "g" },
            },
          ],
          steps: [{ number: 1, instruction: "Hervir agua en una olla grande" }],
        },
        {
          id: 2,
          idCategory: 1,
          idOrigin: 1,
          name: "Pasta Carbonara",
          description: "Pasta carbonara italiana auténtica",
          score: 5,
          thumbnail: "https://example.com/carbonara.jpg",
          time: 25,
          servings: 2,
          createdAt: currentDate,
          updatedAt: currentDate,
          category: { name: "Pasta" },
          origin: { name: "Italiana" },
          ingredients: [
            {
              quantity: 200,
              ingredient: { id: 1, name: "Fideos", unit: "g" },
            },
            {
              quantity: 100,
              ingredient: { id: 3, name: "Panceta", unit: "g" },
            },
          ],
          steps: [
            { number: 1, instruction: "Cocinar la panceta" },
            { number: 2, instruction: "Mezclar con huevos" },
          ],
        },
      ];

      const count = 2;
      mockCtx.prisma.$transaction.mockResolvedValue([searchResults, count]);

      // Act
      const result = await recipeService.get(searchQuery, ctx);

      // Assert
      expect(result).toEqual({
        count: 2,
        recipes: searchResults,
      });
      expect(mockCtx.prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(result.recipes).toHaveLength(2);
      expect(result.recipes[0].name).toContain("Pasta");
      expect(result.recipes[1].name).toContain("Pasta");
    });

    it("should handle recipe update with ingredient and step changes", async () => {
      // Arrange
      const recipeId = 1;
      const updateData = {
        idCategory: 1,
        idOrigin: 1,
        name: "Pasta Italiana Mejorada",
        description: "Una versión mejorada",
        score: 5,
        time: 35,
        servings: 4,
        ingredients: [
          { id: 1, quantity: 600 }, // updated quantity
          { id: 4, quantity: 50 }, // new ingredient
        ],
        steps: [
          { number: 1, instruction: "Hervir agua con sal" }, // updated
          { number: 2, instruction: "Cocinar la pasta" },
          { number: 3, instruction: "Servir caliente" }, // new step
        ] as any,
      };

      const updatedRecipe = {
        id: 1,
        idCategory: 1,
        idOrigin: 1,
        name: "Pasta Italiana Mejorada",
        description: "Una versión mejorada",
        score: 5,
        thumbnail: null,
        time: 35,
        servings: 4,
        createdAt: currentDate,
        updatedAt: new Date(),
        category: { name: "Pasta" },
        origin: { name: "Italiana" },
        ingredients: [
          {
            quantity: 600,
            ingredient: { id: 1, name: "Fideos", unit: "g" },
          },
          {
            quantity: 50,
            ingredient: { id: 4, name: "Queso", unit: "g" },
          },
        ],
        steps: [
          { number: 1, instruction: "Hervir agua con sal" },
          { number: 2, instruction: "Cocinar la pasta" },
          { number: 3, instruction: "Servir caliente" },
        ],
      };

      mockCtx.prisma.recipe.update.mockResolvedValue(updatedRecipe);

      // Act
      const result = await recipeService.patch(recipeId, updateData, ctx);

      // Assert
      expect(result).toEqual(updatedRecipe);
      expect(mockCtx.prisma.recipe.update).toHaveBeenCalledWith({
        where: { id: recipeId },
        data: expect.objectContaining({
          name: "Pasta Italiana Mejorada",
          time: 35,
          steps: {
            deleteMany: {},
            create: expect.any(Array),
          },
          ingredients: {
            deleteMany: {},
            create: expect.any(Array),
          },
        }),
        include: expect.any(Object),
      });
    });
  });

  describe("Error Handling in Workflow", () => {
    it("should handle cascading errors when recipe creation fails after ingredients are created", async () => {
      // Arrange
      const ingredientData = { name: "Test Ingredient", unit: "g" };
      const createdIngredient = {
        id: 1,
        name: "Test Ingredient",
        unit: "g",
        createdAt: currentDate,
        updatedAt: currentDate,
      };
      mockCtx.prisma.ingredient.create.mockResolvedValue(createdIngredient);

      const recipeData = {
        idCategory: 1,
        idOrigin: 1,
        name: "Failed Recipe",
        description: "This will fail",
        score: 5,
        time: 30,
        servings: 4,
        ingredients: [{ id: 1, quantity: 100 }],
        steps: [{ number: 1, instruction: "Do something" }] as any,
      };

      const error = new Error("Recipe creation failed");
      mockCtx.prisma.recipe.create.mockRejectedValue(error);

      // Act & Assert
      const ingredient = await ingredientService.create(ingredientData, ctx);
      expect(ingredient).toEqual(createdIngredient);

      await expect(recipeService.create(recipeData, ctx)).rejects.toThrow(
        "Recipe creation failed"
      );

      // Verify ingredient was created but recipe failed
      expect(mockCtx.prisma.ingredient.create).toHaveBeenCalledWith({
        data: ingredientData,
      });
      expect(mockCtx.prisma.recipe.create).toHaveBeenCalled();
    });

    it("should handle constraint violations when deleting categories with recipes", async () => {
      // Arrange
      const categoryId = 1;
      const error = new Error("Foreign key constraint failed");
      mockCtx.prisma.category.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryService.delete(categoryId, ctx)).rejects.toThrow(
        "Foreign key constraint failed"
      );
    });
  });

  describe("Bulk Operations", () => {
    it("should handle multiple ingredient creation for a recipe", async () => {
      // Arrange
      const ingredients = [
        { name: "Ingredient 1", unit: "g" },
        { name: "Ingredient 2", unit: "ml" },
        { name: "Ingredient 3", unit: "u" },
      ];

      const createdIngredients = ingredients.map((ing, index) => ({
        id: index + 1,
        ...ing,
        createdAt: currentDate,
        updatedAt: currentDate,
      }));

      mockCtx.prisma.ingredient.create
        .mockResolvedValueOnce(createdIngredients[0])
        .mockResolvedValueOnce(createdIngredients[1])
        .mockResolvedValueOnce(createdIngredients[2]);

      // Act
      const results = await Promise.all(
        ingredients.map((ingredient) =>
          ingredientService.create(ingredient, ctx)
        )
      );

      // Assert
      expect(results).toHaveLength(3);
      expect(results[0]).toEqual(createdIngredients[0]);
      expect(results[1]).toEqual(createdIngredients[1]);
      expect(results[2]).toEqual(createdIngredients[2]);
      expect(mockCtx.prisma.ingredient.create).toHaveBeenCalledTimes(3);
    });
  });
});
