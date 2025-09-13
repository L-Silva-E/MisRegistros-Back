import IngredientService from "../services/ingredient.service";
import {
  Context,
  MockContext,
  createMockContext,
} from "../../../shared/jest/context";

describe("IngredientService", () => {
  let ingredientService: IngredientService;
  let mockCtx: MockContext;
  let ctx: Context;
  const currentDate = new Date();

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    ingredientService = new IngredientService();
  });

  describe("create", () => {
    it("should create an ingredient successfully", async () => {
      // Arrange
      const ingredientData = {
        name: "Tomate",
        unit: "kg",
      };

      const expectedIngredient = {
        id: 1,
        name: "Tomate",
        unit: "kg",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.ingredient.create.mockResolvedValue(expectedIngredient);

      // Act
      const result = await ingredientService.create(ingredientData, ctx);

      // Assert
      expect(result).toEqual(expectedIngredient);
      expect(mockCtx.prisma.ingredient.create).toHaveBeenCalledWith({
        data: ingredientData,
      });
      expect(mockCtx.prisma.ingredient.create).toHaveBeenCalledTimes(1);
    });

    it("should throw error when create fails", async () => {
      // Arrange
      const ingredientData = {
        name: "Cebolla",
        unit: "u",
      };
      const error = new Error("Database connection failed");
      mockCtx.prisma.ingredient.create.mockRejectedValue(error);

      // Act & Assert
      await expect(
        ingredientService.create(ingredientData, ctx)
      ).rejects.toThrow("Database connection failed");
    });

    it("should handle ingredients with different units", async () => {
      // Arrange
      const ingredientData = {
        name: "Leche",
        unit: "ml",
      };

      const expectedIngredient = {
        id: 2,
        name: "Leche",
        unit: "ml",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.ingredient.create.mockResolvedValue(expectedIngredient);

      // Act
      const result = await ingredientService.create(ingredientData, ctx);

      // Assert
      expect(result).toEqual(expectedIngredient);
      expect(result.unit).toBe("ml");
    });

    it("should throw error when unit is invalid", async () => {
      // Arrange
      const ingredientData = {
        name: "Azúcar",
        unit: "invalid_unit",
      };

      const validationError = new Error(
        "El campo 'unidad' debe ser uno de los siguientes tipos: mg, g, kg, ml, cl, l, u, tsp, tbsp, cup, pinch"
      );
      mockCtx.prisma.ingredient.create.mockRejectedValue(validationError);

      // Act & Assert
      await expect(
        ingredientService.create(ingredientData, ctx)
      ).rejects.toThrow(
        "El campo 'unidad' debe ser uno de los siguientes tipos: mg, g, kg, ml, cl, l, u, tsp, tbsp, cup, pinch"
      );

      expect(mockCtx.prisma.ingredient.create).toHaveBeenCalledWith({
        data: ingredientData,
      });
    });
  });

  describe("get", () => {
    it("should get ingredients with count", async () => {
      // Arrange
      const query = {
        where: { name: { contains: "Tom" } },
        take: 10,
        skip: 0,
      };

      const ingredients = [
        {
          id: 1,
          name: "Tomate",
          unit: "kg",
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          id: 2,
          name: "Tomate Cherry",
          unit: "g",
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ];

      const count = 2;
      mockCtx.prisma.$transaction.mockResolvedValue([ingredients, count]);

      // Act
      const result = await ingredientService.get(query, ctx);

      // Assert
      expect(result).toEqual({
        count,
        ingredients,
      });
      expect(mockCtx.prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it("should return empty result when no ingredients found", async () => {
      // Arrange
      const query = { where: { name: "NonExistent" } };
      const ingredients: any[] = [];
      const count = 0;
      mockCtx.prisma.$transaction.mockResolvedValue([ingredients, count]);

      // Act
      const result = await ingredientService.get(query, ctx);

      // Assert
      expect(result).toEqual({
        count: 0,
        ingredients: [],
      });
    });

    it("should handle pagination correctly", async () => {
      // Arrange
      const query = {
        take: 5,
        skip: 10,
      };

      const ingredients = [
        {
          id: 11,
          name: "Ingredient 11",
          unit: "kg",
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ];
      const count = 100;
      mockCtx.prisma.$transaction.mockResolvedValue([ingredients, count]);

      // Act
      const result = await ingredientService.get(query, ctx);

      // Assert
      expect(result.count).toBe(100);
      expect(result.ingredients).toHaveLength(1);
    });

    it("should throw error when get fails", async () => {
      // Arrange
      const query = {};
      const error = new Error("Database connection failed");
      mockCtx.prisma.$transaction.mockRejectedValue(error);

      // Act & Assert
      await expect(ingredientService.get(query, ctx)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("patch", () => {
    it("should update an ingredient successfully", async () => {
      // Arrange
      const ingredientId = 1;
      const updateData = {
        name: "Tomate Actualizado",
        unit: "g",
      };

      const expectedIngredient = {
        id: 1,
        name: "Tomate Actualizado",
        unit: "g",
        createdAt: currentDate,
        updatedAt: new Date(),
      };

      mockCtx.prisma.ingredient.update.mockResolvedValue(expectedIngredient);

      // Act
      const result = await ingredientService.patch(
        ingredientId,
        updateData,
        ctx
      );

      // Assert
      expect(result).toEqual(expectedIngredient);
      expect(mockCtx.prisma.ingredient.update).toHaveBeenCalledWith({
        where: { id: ingredientId },
        data: updateData,
      });
      expect(mockCtx.prisma.ingredient.update).toHaveBeenCalledTimes(1);
    });

    it("should update only specific fields", async () => {
      // Arrange
      const ingredientId = 1;
      const updateData = {
        name: "Leche",
        unit: "ml",
      };

      const expectedIngredient = {
        id: 1,
        name: "Leche",
        unit: "ml",
        createdAt: currentDate,
        updatedAt: new Date(),
      };

      mockCtx.prisma.ingredient.update.mockResolvedValue(expectedIngredient);

      // Act
      const result = await ingredientService.patch(
        ingredientId,
        updateData,
        ctx
      );

      // Assert
      expect(result).toEqual(expectedIngredient);
      expect(result.unit).toBe("ml");
    });

    it("should throw error when ingredient not found", async () => {
      // Arrange
      const ingredientId = 999;
      const updateData = {
        name: "New Name",
        unit: "kg",
      };
      const error = new Error("Ingredient not found");
      mockCtx.prisma.ingredient.update.mockRejectedValue(error);

      // Act & Assert
      await expect(
        ingredientService.patch(ingredientId, updateData, ctx)
      ).rejects.toThrow("Ingredient not found");
    });
  });

  describe("delete", () => {
    it("should delete an ingredient successfully", async () => {
      // Arrange
      const ingredientId = 1;
      const expectedIngredient = {
        id: 1,
        name: "Tomate",
        unit: "kg",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.ingredient.delete.mockResolvedValue(expectedIngredient);

      // Act
      const result = await ingredientService.delete(ingredientId, ctx);

      // Assert
      expect(result).toEqual(expectedIngredient);
      expect(mockCtx.prisma.ingredient.delete).toHaveBeenCalledWith({
        where: { id: ingredientId },
      });
      expect(mockCtx.prisma.ingredient.delete).toHaveBeenCalledTimes(1);
    });

    it("should throw error when ingredient not found", async () => {
      // Arrange
      const ingredientId = 999;
      const error = new Error("Ingredient not found");
      mockCtx.prisma.ingredient.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(ingredientService.delete(ingredientId, ctx)).rejects.toThrow(
        "Ingredient not found"
      );
    });

    it("should throw error when ingredient is used in recipes", async () => {
      // Arrange
      const ingredientId = 1;
      const error = new Error("Cannot delete ingredient used in recipes");
      mockCtx.prisma.ingredient.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(ingredientService.delete(ingredientId, ctx)).rejects.toThrow(
        "Cannot delete ingredient used in recipes"
      );
    });
  });
});
