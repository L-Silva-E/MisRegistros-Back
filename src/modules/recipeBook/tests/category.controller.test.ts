// Mock CategoryService at module level before importing
const mockCategoryService = {
  create: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
};

jest.mock("../services/category.service", () => {
  return jest.fn().mockImplementation(() => mockCategoryService);
});

jest.mock("../../../services/logger", () => {
  return jest.fn().mockImplementation(() => mockLoggerService);
});

const mockErrorCodes = jest.fn().mockImplementation((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  if (errorMessage.includes("Retrieval failed")) {
    return {
      code: 500,
      response: { error: "Internal Server Error" },
    };
  }
  if (
    errorMessage.includes("Deletion failed") ||
    errorMessage.includes("not found")
  ) {
    return {
      code: 404,
      response: { error: "Not Found" },
    };
  }
  return {
    code: 400,
    response: { error: "Bad Request" },
  };
});

jest.mock(
  "../../../shared/prisma/middlewares/error.codes",
  () => mockErrorCodes
);

import { Request, Response } from "express";
import CategoryController from "../controllers/category.controller";

describe("CategoryController", () => {
  let controller: CategoryController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new CategoryController();

    mockReq = {
      body: {},
      query: {},
      params: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("create", () => {
    it("should create a category successfully", async () => {
      const mockCategoryData = { name: "Postres" };
      const mockCreatedCategory = {
        id: 1,
        name: "Postres",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.body = mockCategoryData;
      mockCategoryService.create.mockResolvedValue(mockCreatedCategory);

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockCategoryService.create).toHaveBeenCalledWith(mockCategoryData);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Created", { id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: mockCreatedCategory,
      });
    });

    it("should handle creation errors", async () => {
      const error = new Error("Creation failed");
      const mockErrorBody = { code: 400, response: { error: "Bad Request" } };

      mockReq.body = { name: "Invalid Category" };
      mockCategoryService.create.mockRejectedValue(error);

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while creating:",
        {
          body: mockReq.body,
          error: error.message,
          stack: error.stack,
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });

  describe("get", () => {
    it("should retrieve categories successfully", async () => {
      const mockCategories = [
        {
          id: 1,
          name: "Postres",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Postres Fríos",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockResult = { count: 2, categories: mockCategories };

      mockReq.query = { name: "Post" };
      mockCategoryService.get.mockResolvedValue(mockResult);

      await controller.get(mockReq as Request, mockRes as Response);

      expect(mockCategoryService.get).toHaveBeenCalledWith(mockReq.query);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Retrieved", {
        count: 2,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        count: 2,
        data: mockCategories,
      });
    });

    it("should handle retrieval errors", async () => {
      const error = new Error("Retrieval failed");
      const mockErrorBody = {
        code: 500,
        response: { error: "Internal Server Error" },
      };

      mockReq.query = {};
      mockCategoryService.get.mockRejectedValue(error);

      await controller.get(mockReq as Request, mockRes as Response);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while fetching",
        {
          method: "get",
          query: mockReq.query,
          error: error.message,
          stack: error.stack,
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });

  describe("patch", () => {
    it("should update a category successfully", async () => {
      const categoryId = 1;
      const updateData = { name: "Postres Actualizados" };
      const updatedCategory = {
        id: 1,
        name: "Postres Actualizados",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.params = { id: categoryId.toString() };
      mockReq.body = updateData;
      mockCategoryService.patch.mockResolvedValue(updatedCategory);

      await controller.patch(mockReq as Request, mockRes as Response);

      expect(mockCategoryService.patch).toHaveBeenCalledWith(
        categoryId,
        updateData
      );
      expect(mockLoggerService.info).toHaveBeenCalledWith("Updated", {
        id: categoryId,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: updatedCategory,
      });
    });

    it("should handle update errors", async () => {
      const categoryId = 999;
      const updateData = { name: "New Name" };
      const error = new Error("Category not found");
      const mockErrorBody = { code: 404, response: { error: "Not Found" } };

      mockReq.params = { id: categoryId.toString() };
      mockReq.body = updateData;
      mockCategoryService.patch.mockRejectedValue(error);

      await controller.patch(mockReq as Request, mockRes as Response);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while updating",
        {
          id: categoryId,
          body: updateData,
          error: error.message,
          stack: error.stack,
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });

  describe("delete", () => {
    it("should delete a category successfully", async () => {
      const categoryId = 1;
      const deletedCategory = {
        id: 1,
        name: "Postres",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.params = { id: categoryId.toString() };
      mockCategoryService.delete.mockResolvedValue(deletedCategory);

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockCategoryService.delete).toHaveBeenCalledWith(categoryId);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Deleted", {
        id: categoryId,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        deleted: true,
        id: categoryId,
      });
    });

    it("should handle delete errors", async () => {
      const categoryId = 999;
      const error = new Error("Category not found");
      const mockErrorBody = { code: 404, response: { error: "Not Found" } };

      mockReq.params = { id: categoryId.toString() };
      mockCategoryService.delete.mockRejectedValue(error);

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while deleting",
        {
          id: categoryId,
          error: error.message,
          stack: error.stack,
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });
});
