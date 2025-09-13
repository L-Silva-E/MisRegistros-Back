// Mock StepService at module level before importing
const mockStepService = {
  create: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
};

jest.mock("../services/step.service", () => {
  return jest.fn().mockImplementation(() => mockStepService);
});

jest.mock("../../../services/logger", () => {
  return jest.fn().mockImplementation(() => mockLoggerService);
});

const mockErrorCodes = jest.fn().mockImplementation((error: any) => {
  if (error.message.includes("Retrieval failed")) {
    return {
      code: 500,
      response: { error: "Internal Server Error" },
    };
  }
  if (
    error.message.includes("Deletion failed") ||
    error.message.includes("not found")
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
import StepController from "../controllers/step.controller";

describe("StepController", () => {
  let controller: StepController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new StepController();

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
    it("should create a step successfully", async () => {
      const mockStepData = {
        idRecipe: 1,
        number: 1,
        instruction: "Mix ingredients",
      };
      const mockCreatedStep = {
        id: 1,
        ...mockStepData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.body = mockStepData;
      mockStepService.create.mockResolvedValue(mockCreatedStep);

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockStepService.create).toHaveBeenCalledWith(mockStepData);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Created", { id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: mockCreatedStep,
      });
    });

    it("should handle creation errors", async () => {
      const error = new Error("Creation failed");
      const mockErrorBody = { code: 400, response: { error: "Bad Request" } };

      mockReq.body = { idRecipe: 1, number: 1, instruction: "Mix ingredients" };
      mockStepService.create.mockRejectedValue(error);

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
    it("should retrieve steps successfully", async () => {
      const mockSteps = [
        {
          id: 1,
          idRecipe: 1,
          number: 1,
          instruction: "Mix ingredients",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          idRecipe: 1,
          number: 2,
          instruction: "Cook for 20 minutes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockResult = { count: 2, steps: mockSteps };

      mockReq.query = { idRecipe: "1" };
      mockStepService.get.mockResolvedValue(mockResult);

      await controller.get(mockReq as Request, mockRes as Response);

      expect(mockStepService.get).toHaveBeenCalledWith(mockReq.query);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Retrieved", {
        count: 2,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        count: 2,
        data: mockSteps,
      });
    });

    it("should handle retrieval errors", async () => {
      const error = new Error("Retrieval failed");
      const mockErrorBody = {
        code: 500,
        response: { error: "Internal Server Error" },
      };

      mockReq.query = { idRecipe: "1" };
      mockStepService.get.mockRejectedValue(error);

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
    it("should update a step successfully", async () => {
      const mockUpdateData = { instruction: "Updated instruction" };
      const mockUpdatedStep = {
        id: 1,
        idRecipe: 1,
        number: 1,
        instruction: "Updated instruction",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.params = { id: "1" };
      mockReq.body = mockUpdateData;
      mockStepService.patch.mockResolvedValue(mockUpdatedStep);

      await controller.patch(mockReq as Request, mockRes as Response);

      expect(mockStepService.patch).toHaveBeenCalledWith(1, mockUpdateData);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Updated", { id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: mockUpdatedStep,
      });
    });

    it("should handle update errors", async () => {
      const error = new Error("Update failed");
      const mockErrorBody = { code: 400, response: { error: "Bad Request" } };

      mockReq.params = { id: "1" };
      mockReq.body = { instruction: "Updated instruction" };
      mockStepService.patch.mockRejectedValue(error);

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
    it("should delete a step successfully", async () => {
      const mockDeletedStep = {
        id: 1,
        idRecipe: 1,
        number: 1,
        instruction: "Deleted step",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.params = { id: "1" };
      mockStepService.delete.mockResolvedValue(mockDeletedStep);

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockStepService.delete).toHaveBeenCalledWith(1);
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
      mockStepService.delete.mockRejectedValue(error);

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
