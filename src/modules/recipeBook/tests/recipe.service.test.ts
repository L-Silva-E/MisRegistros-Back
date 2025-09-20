import { RecipeModel } from "../models/recipe.model";
import RecipeService from "../services/recipe.service";
import {
  Context,
  MockContext,
  createMockContext,
} from "../../../shared/jest/context";

describe("RecipeService", () => {
  let recipeService: RecipeService;
  let mockCtx: MockContext;
  let ctx: Context;
  const currentDate = new Date();

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    recipeService = new RecipeService();
  });

  describe("create", () => {
    it("should create a recipe with ingredients and steps successfully", async () => {
      // Arrange
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
          {
            id: 1,
            name: "Fideos",
            unit: "g",
            quantity: 500,
          },
          {
            id: 2,
            name: "Salsa de Tomate",
            unit: "ml",
            quantity: 200,
          },
        ],
        steps: [
          {
            number: 1,
            instruction: "Hervir agua en una olla grande",
          },
          {
            number: 2,
            instruction: "Agregar sal al agua",
          },
          {
            number: 3,
            instruction: "Cocinar la pasta por 10-12 minutos",
          },
        ],
      };

      const expectedRecipe = {
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
        origin: { name: "Italia" },
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
          {
            number: 1,
            instruction: "Hervir agua en una olla grande",
          },
          {
            number: 2,
            instruction: "Agregar sal al agua",
          },
          {
            number: 3,
            instruction: "Cocinar la pasta por 10-12 minutos",
          },
        ],
      };

      mockCtx.prisma.recipe.create.mockResolvedValue(expectedRecipe);

      // Act
      const result = await recipeService.create(recipeData, ctx);

      // Assert
      expect(result).toEqual(expectedRecipe);
      expect(mockCtx.prisma.recipe.create).toHaveBeenCalledTimes(1);
      expect((result as any).ingredients).toHaveLength(2);
      expect((result as any).steps).toHaveLength(3);
    });

    it("should create recipe with empty steps array", async () => {
      // Arrange
      const recipeData = {
        idCategory: 1,
        idOrigin: 1,
        name: "Simple Recipe",
        description: "A simple recipe without steps",
        score: 3,
        time: 15,
        servings: 2,
        ingredients: [
          { id: 1, name: "Test Ingredient", unit: "g", quantity: 100 },
        ],
        steps: [],
      };

      const expectedRecipe = {
        id: 2,
        idCategory: 1,
        idOrigin: 1,
        name: "Simple Recipe",
        description: "A simple recipe without steps",
        score: 3,
        thumbnail: null,
        time: 15,
        servings: 2,
        createdAt: currentDate,
        updatedAt: currentDate,
        category: { name: "Simple" },
        origin: { name: "Local" },
        ingredients: [
          {
            quantity: 100,
            ingredient: { id: 1, name: "Ingredient", unit: "g" },
          },
        ],
        steps: [],
      };

      mockCtx.prisma.recipe.create.mockResolvedValue(expectedRecipe);

      // Act
      const result = await recipeService.create(recipeData, ctx);

      // Assert
      expect(result).toEqual(expectedRecipe);
      expect((result as any).steps).toHaveLength(0);
    });

    it("should throw error when create fails", async () => {
      // Arrange
      const recipeData = {
        idCategory: 1,
        idOrigin: 1,
        name: "Failed Recipe",
        description: "This will fail",
        score: 5,
        time: 30,
        servings: 4,
        ingredients: [
          { id: 1, name: "Test Ingredient", unit: "g", quantity: 100 },
        ],
        steps: [{ instruction: "Do something" }] as any,
      };

      const error = new Error("Database connection failed");
      mockCtx.prisma.recipe.create.mockRejectedValue(error);

      // Act & Assert
      await expect(recipeService.create(recipeData, ctx)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("get", () => {
    it("should get recipes with count and full details", async () => {
      // Arrange
      const query = {
        where: { name: { contains: "pasta" } },
        take: 10,
        skip: 0,
      };

      const recipes = [
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
          origin: { name: "Italia" },
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
            {
              number: 1,
              instruction: "Hervir agua en una olla grande",
            },
            {
              number: 2,
              instruction: "Agregar sal al agua",
            },
          ],
        },
      ];

      const count = 1;
      mockCtx.prisma.$transaction.mockResolvedValue([recipes, count]);

      // Act
      const result = await recipeService.get(query, ctx);

      // Assert
      expect(result).toEqual({
        count,
        recipes,
      });
      expect(mockCtx.prisma.$transaction).toHaveBeenCalledTimes(1);
      expect((result.recipes[0] as any).ingredients).toHaveLength(2);
      expect((result.recipes[0] as any).steps).toHaveLength(2);
    });

    it("should return empty result when no recipes found", async () => {
      // Arrange
      const query = { where: { name: "NonExistentRecipe" } };
      const recipes: RecipeModel[] = [];
      const count = 0;
      mockCtx.prisma.$transaction.mockResolvedValue([recipes, count]);

      // Act
      const result = await recipeService.get(query, ctx);

      // Assert
      expect(result).toEqual({
        count: 0,
        recipes: [],
      });
    });

    it("should handle filtering by category and origin", async () => {
      // Arrange
      const query = {
        where: {
          idCategory: 1,
          idOrigin: 2,
        },
      };

      const recipes = [
        {
          id: 1,
          idCategory: 1,
          idOrigin: 2,
          name: "Special Recipe",
          description: "A recipe with specific category and origin",
          score: 4,
          thumbnail: null,
          time: 45,
          servings: 6,
          createdAt: currentDate,
          updatedAt: currentDate,
          category: { name: "Special" },
          origin: { name: "Mexico" },
          ingredients: [],
          steps: [],
        },
      ];

      const count = 1;
      mockCtx.prisma.$transaction.mockResolvedValue([recipes, count]);

      // Act
      const result = await recipeService.get(query, ctx);

      // Assert
      expect(result.count).toBe(1);
      expect(result.recipes[0].idCategory).toBe(1);
      expect(result.recipes[0].idOrigin).toBe(2);
    });

    it("should throw error when get fails", async () => {
      // Arrange
      const query = {};
      const error = new Error("Database connection failed");
      mockCtx.prisma.$transaction.mockRejectedValue(error);

      // Act & Assert
      await expect(recipeService.get(query, ctx)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("patch", () => {
    it("should update a recipe with new ingredients and steps", async () => {
      // Arrange
      const recipeId = 1;
      const updateData = {
        idCategory: 1,
        idOrigin: 1,
        name: "Pasta Italiana Mejorada",
        description: "Una versión mejorada de la pasta italiana",
        score: 5,
        thumbnail: "https://example.com/pasta-new.jpg",
        time: 35,
        servings: 4,
        ingredients: [
          {
            id: 1,
            name: "Fideos",
            unit: "g",
            quantity: 600,
          },
          {
            id: 3,
            name: "Queso Parmesano",
            unit: "g",
            quantity: 50,
          },
        ],
        steps: [
          {
            number: 1,
            instruction: "Hervir agua con sal en una olla grande",
          },
          {
            number: 2,
            instruction: "Cocinar la pasta por 10-12 minutos",
          },
          {
            number: 3,
            instruction: "Servir caliente",
          },
        ] as any,
      };

      const expectedRecipe = {
        id: 1,
        idCategory: 1,
        idOrigin: 1,
        name: "Pasta Italiana Mejorada",
        description: "Una versión mejorada de la pasta italiana",
        score: 5,
        thumbnail: "https://example.com/pasta-new.jpg",
        time: 35,
        servings: 4,
        createdAt: currentDate,
        updatedAt: new Date(),
        category: { name: "Pasta" },
        origin: { name: "Italia" },
        ingredients: [
          {
            quantity: 600,
            ingredient: { id: 1, name: "Fideos", unit: "g" },
          },
          {
            quantity: 50,
            ingredient: { id: 3, name: "Queso Parmesano", unit: "g" },
          },
        ],
        steps: [
          {
            number: 1,
            instruction: "Hervir agua con sal en una olla grande",
          },
          {
            number: 2,
            instruction: "Cocinar la pasta por 10-12 minutos",
          },
          {
            number: 3,
            instruction: "Servir caliente",
          },
        ],
      };

      mockCtx.prisma.recipe.update.mockResolvedValue(expectedRecipe);

      // Act
      const result = await recipeService.patch(recipeId, updateData, ctx);

      // Assert
      expect(result).toEqual(expectedRecipe);
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

    it("should throw error when recipe not found", async () => {
      // Arrange
      const recipeId = 999;
      const updateData = {
        idCategory: 1,
        idOrigin: 1,
        name: "Non-existent Recipe",
        description: "This recipe doesn't exist",
        score: 5,
        time: 30,
        servings: 4,
        ingredients: [],
        steps: [],
      };

      const error = new Error("Recipe not found");
      mockCtx.prisma.recipe.update.mockRejectedValue(error);

      // Act & Assert
      await expect(
        recipeService.patch(recipeId, updateData, ctx)
      ).rejects.toThrow("Recipe not found");
    });
  });

  describe("delete", () => {
    it("should delete a recipe successfully", async () => {
      // Arrange
      const recipeId = 1;
      const expectedRecipe = {
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
        origin: { name: "Italia" },
        ingredients: [
          {
            quantity: 500,
            ingredient: { id: 1, name: "Fideos", unit: "g" },
          },
        ],
        steps: [
          {
            number: 1,
            instruction: "Hervir agua en una olla grande",
          },
        ],
      };

      mockCtx.prisma.recipe.delete.mockResolvedValue(expectedRecipe);

      // Act
      const result = await recipeService.delete(recipeId, ctx);

      // Assert
      expect(result).toEqual(expectedRecipe);
      expect(mockCtx.prisma.recipe.delete).toHaveBeenCalledWith({
        where: { id: recipeId },
        include: expect.any(Object),
      });
      expect(mockCtx.prisma.recipe.delete).toHaveBeenCalledTimes(1);
    });

    it("should throw error when recipe not found", async () => {
      // Arrange
      const recipeId = 999;
      const error = new Error("Recipe not found");
      mockCtx.prisma.recipe.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(recipeService.delete(recipeId, ctx)).rejects.toThrow(
        "Recipe not found"
      );
    });

    it("should handle deletion of recipe with many ingredients and steps", async () => {
      // Arrange
      const recipeId = 2;
      const expectedRecipe = {
        id: 2,
        idCategory: 2,
        idOrigin: 3,
        name: "Complex Recipe",
        description: "A complex recipe with many ingredients and steps",
        score: 4,
        thumbnail: null,
        time: 120,
        servings: 8,
        createdAt: currentDate,
        updatedAt: currentDate,
        category: { name: "Complex" },
        origin: { name: "France" },
        ingredients: Array(10)
          .fill(null)
          .map((_, i) => ({
            quantity: 100 + i * 10,
            ingredient: { id: i + 1, name: `Ingredient ${i + 1}`, unit: "g" },
          })),
        steps: Array(15)
          .fill(null)
          .map((_, i) => ({
            number: i + 1,
            instruction: `Step ${i + 1} instruction`,
          })),
      };

      mockCtx.prisma.recipe.delete.mockResolvedValue(expectedRecipe);

      // Act
      const result = await recipeService.delete(recipeId, ctx);

      // Assert
      expect(result).toEqual(expectedRecipe);
      expect((result as any).ingredients).toHaveLength(10);
      expect((result as any).steps).toHaveLength(15);
    });
  });

  describe("duplicate", () => {
    test("should duplicate a recipe successfully", async () => {
      // Mock data
      const originalRecipeFromDB = {
        id: 1,
        idCategory: 1,
        idOrigin: 1,
        name: "Paella Valenciana",
        description: "Receta tradicional de paella",
        score: 5,
        time: 60,
        servings: 4,
        thumbnail: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: { name: "Arroces" },
        origin: { name: "España" },
        ingredients: [
          {
            quantity: 400,
            ingredient: { id: 1, name: "Arroz", unit: "gramos" },
          },
          {
            quantity: 500,
            ingredient: { id: 2, name: "Pollo", unit: "gramos" },
          },
        ],
        steps: [
          { number: 1, instruction: "Preparar los ingredientes" },
          { number: 2, instruction: "Cocinar el arroz" },
        ],
      };

      mockCtx.prisma.recipe.findUnique.mockResolvedValue(originalRecipeFromDB);

      const duplicatedRecipe = await recipeService.duplicate(1, ctx);

      expect(duplicatedRecipe.name).toBe("Paella Valenciana (Copia)");
      expect(duplicatedRecipe.description).toBe("Receta tradicional de paella");
      expect(duplicatedRecipe.idCategory).toBe(1);
      expect(duplicatedRecipe.idOrigin).toBe(1);
      expect(duplicatedRecipe.score).toBe(5);
      expect(duplicatedRecipe.time).toBe(60);
      expect(duplicatedRecipe.servings).toBe(4);
      expect(duplicatedRecipe.id).toBeUndefined();

      // Verify ingredients
      expect(duplicatedRecipe.ingredients).toHaveLength(2);
      expect(duplicatedRecipe.ingredients[0]).toEqual({
        id: 1,
        name: "Arroz",
        unit: "gramos",
        quantity: 400,
      });

      // Verify steps
      expect(duplicatedRecipe.steps).toHaveLength(2);
      expect(duplicatedRecipe.steps![0]).toEqual({
        number: 1,
        instruction: "Preparar los ingredientes",
      });
    });

    test("should throw error when recipe does not exist", async () => {
      // Mock not found
      mockCtx.prisma.recipe.findUnique.mockResolvedValue(null);

      await expect(recipeService.duplicate(999, ctx)).rejects.toThrow(
        "Recipe with id 999 not found"
      );
    });
  });
});
