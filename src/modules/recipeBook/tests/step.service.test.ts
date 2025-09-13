import StepService from "../services/step.service";
import {
  Context,
  MockContext,
  createMockContext,
} from "../../../shared/jest/context";

describe("StepService", () => {
  let stepService: StepService;
  let mockCtx: MockContext;
  let ctx: Context;
  const currentDate = new Date();

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    stepService = new StepService();
  });

  describe("create", () => {
    it("should create a step successfully", async () => {
      // Arrange
      const stepData = {
        idRecipe: 1,
        number: 1,
        instruction: "Cortar las verduras en cubos pequeños",
      };

      const expectedStep = {
        id: 1,
        idRecipe: 1,
        number: 1,
        instruction: "Cortar las verduras en cubos pequeños",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.step.create.mockResolvedValue(expectedStep);

      // Act
      const result = await stepService.create(stepData, ctx);

      // Assert
      expect(result).toEqual(expectedStep);
      expect(mockCtx.prisma.step.create).toHaveBeenCalledWith({
        data: stepData,
      });
      expect(mockCtx.prisma.step.create).toHaveBeenCalledTimes(1);
    });

    it("should create multiple steps for same recipe", async () => {
      // Arrange
      const stepData = {
        idRecipe: 1,
        number: 2,
        instruction: "Calentar aceite en una sartén",
      };

      const expectedStep = {
        id: 2,
        idRecipe: 1,
        number: 2,
        instruction: "Calentar aceite en una sartén",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.step.create.mockResolvedValue(expectedStep);

      // Act
      const result = await stepService.create(stepData, ctx);

      // Assert
      expect(result).toEqual(expectedStep);
      expect(result.number).toBe(2);
      expect(result.idRecipe).toBe(1);
    });

    it("should throw error when create fails", async () => {
      // Arrange
      const stepData = {
        idRecipe: 1,
        number: 1,
        instruction: "Invalid step",
      };
      const error = new Error("Database connection failed");
      mockCtx.prisma.step.create.mockRejectedValue(error);

      // Act & Assert
      await expect(stepService.create(stepData, ctx)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("get", () => {
    it("should get steps with count", async () => {
      // Arrange
      const query = {
        where: { idRecipe: 1 },
        orderBy: { number: "asc" },
      };

      const steps = [
        {
          id: 1,
          idRecipe: 1,
          number: 1,
          instruction: "Cortar las verduras",
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          id: 2,
          idRecipe: 1,
          number: 2,
          instruction: "Calentar aceite",
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ];

      const count = 2;
      mockCtx.prisma.$transaction.mockResolvedValue([steps, count]);

      // Act
      const result = await stepService.get(query, ctx);

      // Assert
      expect(result).toEqual({
        count,
        steps,
      });
      expect(mockCtx.prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it("should return empty result when no steps found", async () => {
      // Arrange
      const query = { where: { idRecipe: 999 } };
      const steps: any[] = [];
      const count = 0;
      mockCtx.prisma.$transaction.mockResolvedValue([steps, count]);

      // Act
      const result = await stepService.get(query, ctx);

      // Assert
      expect(result).toEqual({
        count: 0,
        steps: [],
      });
    });

    it("should handle search by instruction content", async () => {
      // Arrange
      const query = {
        where: {
          instruction: { contains: "cortar" },
        },
      };

      const steps = [
        {
          id: 1,
          idRecipe: 1,
          number: 1,
          instruction: "Cortar las verduras en cubos",
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ];

      const count = 1;
      mockCtx.prisma.$transaction.mockResolvedValue([steps, count]);

      // Act
      const result = await stepService.get(query, ctx);

      // Assert
      expect(result.count).toBe(1);
      expect(result.steps[0].instruction).toContain("Cortar");
    });

    it("should throw error when get fails", async () => {
      // Arrange
      const query = {};
      const error = new Error("Database connection failed");
      mockCtx.prisma.$transaction.mockRejectedValue(error);

      // Act & Assert
      await expect(stepService.get(query, ctx)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("patch", () => {
    it("should update a step successfully", async () => {
      // Arrange
      const stepId = 1;
      const updateData = {
        idRecipe: 1,
        number: 1,
        instruction: "Cortar las verduras en cubos más pequeños",
      };

      const expectedStep = {
        id: 1,
        idRecipe: 1,
        number: 1,
        instruction: "Cortar las verduras en cubos más pequeños",
        createdAt: currentDate,
        updatedAt: new Date(),
      };

      mockCtx.prisma.step.update.mockResolvedValue(expectedStep);

      // Act
      const result = await stepService.patch(stepId, updateData, ctx);

      // Assert
      expect(result).toEqual(expectedStep);
      expect(mockCtx.prisma.step.update).toHaveBeenCalledWith({
        where: { id: stepId },
        data: updateData,
      });
      expect(mockCtx.prisma.step.update).toHaveBeenCalledTimes(1);
    });

    it("should update step number", async () => {
      // Arrange
      const stepId = 1;
      const updateData = {
        idRecipe: 1,
        number: 3,
        instruction: "Same instruction",
      };

      const expectedStep = {
        id: 1,
        idRecipe: 1,
        number: 3, // updated
        instruction: "Same instruction",
        createdAt: currentDate,
        updatedAt: new Date(),
      };

      mockCtx.prisma.step.update.mockResolvedValue(expectedStep);

      // Act
      const result = await stepService.patch(stepId, updateData, ctx);

      // Assert
      expect(result).toEqual(expectedStep);
      expect(result.number).toBe(3);
    });

    it("should throw error when step not found", async () => {
      // Arrange
      const stepId = 999;
      const updateData = {
        idRecipe: 1,
        number: 1,
        instruction: "New instruction",
      };
      const error = new Error("Step not found");
      mockCtx.prisma.step.update.mockRejectedValue(error);

      // Act & Assert
      await expect(stepService.patch(stepId, updateData, ctx)).rejects.toThrow(
        "Step not found"
      );
    });
  });

  describe("delete", () => {
    it("should delete a step successfully", async () => {
      // Arrange
      const stepId = 1;
      const expectedStep = {
        id: 1,
        idRecipe: 1,
        number: 1,
        instruction: "Cortar las verduras",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.step.delete.mockResolvedValue(expectedStep);

      // Act
      const result = await stepService.delete(stepId, ctx);

      // Assert
      expect(result).toEqual(expectedStep);
      expect(mockCtx.prisma.step.delete).toHaveBeenCalledWith({
        where: { id: stepId },
      });
      expect(mockCtx.prisma.step.delete).toHaveBeenCalledTimes(1);
    });

    it("should throw error when step not found", async () => {
      // Arrange
      const stepId = 999;
      const error = new Error("Step not found");
      mockCtx.prisma.step.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(stepService.delete(stepId, ctx)).rejects.toThrow(
        "Step not found"
      );
    });

    it("should handle deletion of middle step in sequence", async () => {
      // Arrange
      const stepId = 2; // middle step
      const expectedStep = {
        id: 2,
        idRecipe: 1,
        number: 2,
        instruction: "Middle step instruction",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.step.delete.mockResolvedValue(expectedStep);

      // Act
      const result = await stepService.delete(stepId, ctx);

      // Assert
      expect(result).toEqual(expectedStep);
      expect(result.number).toBe(2);
    });
  });
});
