// Mock IngredientService at module level before importing
const mockIngredientService = {
  create: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
};

jest.mock("../services/ingredient.service", () => {
  return jest.fn().mockImplementation(() => mockIngredientService);
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
import IngredientController from "../controllers/ingredient.controller";

describe("IngredientController", () => {
  let controller: IngredientController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new IngredientController();

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
    it("should create an ingredient successfully", async () => {
      const mockIngredientData = {
        name: "Test Ingredient",
        unit: "kg",
      };
      const mockCreatedIngredient = {
        id: 1,
        ...mockIngredientData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.body = mockIngredientData;
      mockIngredientService.create.mockResolvedValue(mockCreatedIngredient);

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockIngredientService.create).toHaveBeenCalledWith(
        mockIngredientData
      );
      expect(mockLoggerService.info).toHaveBeenCalledWith("Created", { id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: mockCreatedIngredient,
      });
    });

    it("should handle creation errors", async () => {
      const error = new Error("Creation failed");
      const mockErrorBody = { code: 400, response: { error: "Bad Request" } };

      mockReq.body = { name: "Test Ingredient", unit: "kg" };
      mockIngredientService.create.mockRejectedValue(error);

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
    it("should retrieve ingredients successfully", async () => {
      const mockIngredients = [
        {
          id: 1,
          name: "Ingredient 1",
          unit: "kg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Ingredient 2",
          unit: "cup",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockResult = { count: 2, ingredients: mockIngredients };

      mockReq.query = { limit: "10" };
      mockIngredientService.get.mockResolvedValue(mockResult);

      await controller.get(mockReq as Request, mockRes as Response);

      expect(mockIngredientService.get).toHaveBeenCalledWith(mockReq.query);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Retrieved", {
        count: 2,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        count: 2,
        data: mockIngredients,
      });
    });

    it("should handle retrieval errors", async () => {
      const error = new Error("Retrieval failed");
      const mockErrorBody = {
        code: 500,
        response: { error: "Internal Server Error" },
      };

      mockReq.query = { limit: "10" };
      mockIngredientService.get.mockRejectedValue(error);

      await controller.get(mockReq as Request, mockRes as Response);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while fetching",
        {
          filter: mockReq.query,
          message: error.message,
          stack: error.stack,
          name: error.name,
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });

  describe("patch", () => {
    it("should update an ingredient successfully", async () => {
      const mockUpdateData = { name: "Updated Ingredient", unit: "l" };
      const mockUpdatedIngredient = {
        id: 1,
        name: "Updated Ingredient",
        unit: "l",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.params = { id: "1" };
      mockReq.body = mockUpdateData;
      mockIngredientService.patch.mockResolvedValue(mockUpdatedIngredient);

      await controller.patch(mockReq as Request, mockRes as Response);

      expect(mockIngredientService.patch).toHaveBeenCalledWith(
        1,
        mockUpdateData
      );
      expect(mockLoggerService.info).toHaveBeenCalledWith("Updated", { id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: mockUpdatedIngredient,
      });
    });

    it("should handle update errors", async () => {
      const error = new Error("Update failed");
      const mockErrorBody = { code: 400, response: { error: "Bad Request" } };

      mockReq.params = { id: "1" };
      mockReq.body = { name: "Updated Ingredient" };
      mockIngredientService.patch.mockRejectedValue(error);

      await controller.patch(mockReq as Request, mockRes as Response);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while updating",
        {
          id: 1,
          body: mockReq.body,
          error: error.message,
          stack: error.stack,
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });

  describe("delete", () => {
    it("should delete an ingredient successfully", async () => {
      const mockDeletedIngredient = {
        id: 1,
        name: "Deleted Ingredient",
        unit: "g",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.params = { id: "1" };
      mockIngredientService.delete.mockResolvedValue(mockDeletedIngredient);

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockIngredientService.delete).toHaveBeenCalledWith(1);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Deleted", { id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        deleted: true,
        id: 1,
      });
    });

    it("should handle deletion errors", async () => {
      const error = new Error("Deletion failed");
      const mockErrorBody = { code: 404, response: { error: "Not Found" } };

      mockReq.params = { id: "1" };
      mockIngredientService.delete.mockRejectedValue(error);

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while deleting",
        {
          id: 1,
          error: error.message,
          stack: error.stack,
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });
});
