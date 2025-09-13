import OriginService from "../services/origin.service";
import {
  Context,
  MockContext,
  createMockContext,
} from "../../../shared/jest/context";

describe("OriginService", () => {
  let originService: OriginService;
  let mockCtx: MockContext;
  let ctx: Context;
  const currentDate = new Date();

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    originService = new OriginService();
  });

  describe("create", () => {
    it("should create an origin successfully", async () => {
      // Arrange
      const originData = {
        name: "Italiana",
      };

      const expectedOrigin = {
        id: 1,
        name: "Italiana",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.origin.create.mockResolvedValue(expectedOrigin);

      // Act
      const result = await originService.create(originData, ctx);

      // Assert
      expect(result).toEqual(expectedOrigin);
      expect(mockCtx.prisma.origin.create).toHaveBeenCalledWith({
        data: originData,
      });
      expect(mockCtx.prisma.origin.create).toHaveBeenCalledTimes(1);
    });

    it("should throw error when create fails", async () => {
      // Arrange
      const originData = {
        name: "Mexicana",
      };
      const error = new Error("Database connection failed");
      mockCtx.prisma.origin.create.mockRejectedValue(error);

      // Act & Assert
      await expect(originService.create(originData, ctx)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("get", () => {
    it("should get origins with count", async () => {
      // Arrange
      const query = {
        where: { name: { contains: "It" } },
        take: 10,
        skip: 0,
      };

      const origins = [
        {
          id: 1,
          name: "Italiana",
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          id: 2,
          name: "Italiana del Norte",
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ];

      const count = 2;
      mockCtx.prisma.$transaction.mockResolvedValue([origins, count]);

      // Act
      const result = await originService.get(query, ctx);

      // Assert
      expect(result).toEqual({
        count,
        origins,
      });
      expect(mockCtx.prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it("should return empty result when no origins found", async () => {
      // Arrange
      const query = { where: { name: "NonExistent" } };
      const origins: any[] = [];
      const count = 0;
      mockCtx.prisma.$transaction.mockResolvedValue([origins, count]);

      // Act
      const result = await originService.get(query, ctx);

      // Assert
      expect(result).toEqual({
        count: 0,
        origins: [],
      });
    });

    it("should throw error when get fails", async () => {
      // Arrange
      const query = {};
      const error = new Error("Database connection failed");
      mockCtx.prisma.$transaction.mockRejectedValue(error);

      // Act & Assert
      await expect(originService.get(query, ctx)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("patch", () => {
    it("should update an origin successfully", async () => {
      // Arrange
      const originId = 1;
      const updateData = {
        name: "Italiana Actualizada",
      };

      const expectedOrigin = {
        id: 1,
        name: "Italiana Actualizada",
        createdAt: currentDate,
        updatedAt: new Date(),
      };

      mockCtx.prisma.origin.update.mockResolvedValue(expectedOrigin);

      // Act
      const result = await originService.patch(originId, updateData, ctx);

      // Assert
      expect(result).toEqual(expectedOrigin);
      expect(mockCtx.prisma.origin.update).toHaveBeenCalledWith({
        where: { id: originId },
        data: updateData,
      });
      expect(mockCtx.prisma.origin.update).toHaveBeenCalledTimes(1);
    });

    it("should throw error when origin not found", async () => {
      // Arrange
      const originId = 999;
      const updateData = { name: "New Name" };
      const error = new Error("Origin not found");
      mockCtx.prisma.origin.update.mockRejectedValue(error);

      // Act & Assert
      await expect(
        originService.patch(originId, updateData, ctx)
      ).rejects.toThrow("Origin not found");
    });
  });

  describe("delete", () => {
    it("should delete an origin successfully", async () => {
      // Arrange
      const originId = 1;
      const expectedOrigin = {
        id: 1,
        name: "Italiana",
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockCtx.prisma.origin.delete.mockResolvedValue(expectedOrigin);

      // Act
      const result = await originService.delete(originId, ctx);

      // Assert
      expect(result).toEqual(expectedOrigin);
      expect(mockCtx.prisma.origin.delete).toHaveBeenCalledWith({
        where: { id: originId },
      });
      expect(mockCtx.prisma.origin.delete).toHaveBeenCalledTimes(1);
    });

    it("should throw error when origin not found", async () => {
      // Arrange
      const originId = 999;
      const error = new Error("Origin not found");
      mockCtx.prisma.origin.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(originService.delete(originId, ctx)).rejects.toThrow(
        "Origin not found"
      );
    });

    it("should throw error when origin has related recipes", async () => {
      // Arrange
      const originId = 1;
      const error = new Error("Cannot delete origin with related recipes");
      mockCtx.prisma.origin.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(originService.delete(originId, ctx)).rejects.toThrow(
        "Cannot delete origin with related recipes"
      );
    });
  });
});
