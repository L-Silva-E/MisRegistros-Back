import { CategoryModel } from "../models/category.model";
import CategoryService from "../services/category.service";
import {
  Context,
  MockContext,
  createMockContext,
} from "../../../shared/jest/context";

describe("CategoryService", () => {
  let categoryService: CategoryService;
  let mockCtx: MockContext;
  let ctx: Context;
  const currentDate = new Date();

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    categoryService = new CategoryService();
  });

  describe("create", () => {
    it("should create a category successfully", async () => {
      // Arrange
      const categoryData = {
        name: "Postres",
      };

      const expectedCategory = {
        id: 1,
        name: "Postres",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.category.create.mockResolvedValue(expectedCategory);

      // Act
      const result = await categoryService.create(categoryData, ctx);

      // Assert
      expect(result).toEqual(expectedCategory);
      expect(mockCtx.prisma.category.create).toHaveBeenCalledWith({
        data: categoryData,
      });
      expect(mockCtx.prisma.category.create).toHaveBeenCalledTimes(1);
    });

    it("should throw error when create fails", async () => {
      // Arrange
      const categoryData = {
        name: "Postres",
      };
      const error = new Error("Database connection failed");
      mockCtx.prisma.category.create.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryService.create(categoryData, ctx)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("get", () => {
    it("should get categories with count", async () => {
      // Arrange
      const query = {
        where: { name: { contains: "Post" } },
        take: 10,
        skip: 0,
      };

      const categories = [
        {
          id: 1,
          name: "Postres",
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          id: 2,
          name: "Postres Fríos",
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ];

      const count = 2;
      mockCtx.prisma.$transaction.mockResolvedValue([categories, count]);

      // Act
      const result = await categoryService.get(query, ctx);

      // Assert
      expect(result).toEqual({
        count,
        categories,
      });
      expect(mockCtx.prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it("should return empty result when no categories found", async () => {
      // Arrange
      const query = { where: { name: "NonExistent" } };
      const categories: CategoryModel[] = [];
      const count = 0;
      mockCtx.prisma.$transaction.mockResolvedValue([categories, count]);

      // Act
      const result = await categoryService.get(query, ctx);

      // Assert
      expect(result).toEqual({
        count: 0,
        categories: [],
      });
    });

    it("should throw error when get fails", async () => {
      // Arrange
      const query = {};
      const error = new Error("Database connection failed");
      mockCtx.prisma.$transaction.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryService.get(query, ctx)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("patch", () => {
    it("should update a category successfully", async () => {
      // Arrange
      const categoryId = 1;
      const updateData = {
        name: "Postres Actualizados",
      };

      const expectedCategory = {
        id: 1,
        name: "Postres Actualizados",
        createdAt: currentDate,
        updatedAt: new Date(),
      };

      mockCtx.prisma.category.update.mockResolvedValue(expectedCategory);

      // Act
      const result = await categoryService.patch(categoryId, updateData, ctx);

      // Assert
      expect(result).toEqual(expectedCategory);
      expect(mockCtx.prisma.category.update).toHaveBeenCalledWith({
        where: { id: categoryId },
        data: updateData,
      });
      expect(mockCtx.prisma.category.update).toHaveBeenCalledTimes(1);
    });

    it("should throw error when category not found", async () => {
      // Arrange
      const categoryId = 999;
      const updateData = { name: "New Name" };
      const error = new Error("Category not found");
      mockCtx.prisma.category.update.mockRejectedValue(error);

      // Act & Assert
      await expect(
        categoryService.patch(categoryId, updateData, ctx)
      ).rejects.toThrow("Category not found");
    });
  });

  describe("delete", () => {
    it("should delete a category successfully", async () => {
      // Arrange
      const categoryId = 1;
      const expectedCategory = {
        id: 1,
        name: "Postres",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.category.delete.mockResolvedValue(expectedCategory);

      // Act
      const result = await categoryService.delete(categoryId, ctx);

      // Assert
      expect(result).toEqual(expectedCategory);
      expect(mockCtx.prisma.category.delete).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(mockCtx.prisma.category.delete).toHaveBeenCalledTimes(1);
    });

    it("should throw error when category not found", async () => {
      // Arrange
      const categoryId = 999;
      const error = new Error("Category not found");
      mockCtx.prisma.category.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryService.delete(categoryId, ctx)).rejects.toThrow(
        "Category not found"
      );
    });

    it("should throw error when category has related recipes", async () => {
      // Arrange
      const categoryId = 1;
      const error = new Error("Cannot delete category with related recipes");
      mockCtx.prisma.category.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryService.delete(categoryId, ctx)).rejects.toThrow(
        "Cannot delete category with related recipes"
      );
    });
  });
});
