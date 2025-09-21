// Mock OriginService at module level before importing
const mockOriginService = {
  create: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
};

jest.mock("../services/origin.service", () => {
  return jest.fn().mockImplementation(() => mockOriginService);
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
import OriginController from "../controllers/origin.controller";

describe("OriginController", () => {
  let controller: OriginController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new OriginController();

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
    it("should create an origin successfully", async () => {
      const mockOriginData = {
        name: "Italian",
        description: "Italian cuisine origin",
      };
      const mockCreatedOrigin = {
        id: 1,
        ...mockOriginData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.body = mockOriginData;
      mockOriginService.create.mockResolvedValue(mockCreatedOrigin);

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockOriginService.create).toHaveBeenCalledWith(mockOriginData);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Created", { id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: mockCreatedOrigin,
      });
    });

    it("should handle creation errors", async () => {
      const error = new Error("Creation failed");
      const mockErrorBody = { code: 400, response: { error: "Bad Request" } };

      mockReq.body = { name: "Italian" };
      mockOriginService.create.mockRejectedValue(error);

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
    it("should retrieve origins successfully", async () => {
      const mockOrigins = [
        {
          id: 1,
          name: "Italian",
          description: "Italian cuisine",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Mexican",
          description: "Mexican cuisine",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockResult = { count: 2, origins: mockOrigins };

      mockReq.query = { limit: "10" };
      mockOriginService.get.mockResolvedValue(mockResult);

      await controller.get(mockReq as Request, mockRes as Response);

      expect(mockOriginService.get).toHaveBeenCalledWith(mockReq.query);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Retrieved", {
        count: 2,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        count: 2,
        data: mockOrigins,
      });
    });

    it("should handle retrieval errors", async () => {
      const error = new Error("Retrieval failed");
      const mockErrorBody = {
        code: 500,
        response: { error: "Internal Server Error" },
      };

      mockReq.query = { limit: "10" };
      mockOriginService.get.mockRejectedValue(error);

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
    it("should update an origin successfully", async () => {
      const mockUpdateData = { name: "Updated Italian" };
      const mockUpdatedOrigin = {
        id: 1,
        name: "Updated Italian",
        description: "Updated Italian cuisine",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.params = { id: "1" };
      mockReq.body = mockUpdateData;
      mockOriginService.patch.mockResolvedValue(mockUpdatedOrigin);

      await controller.patch(mockReq as Request, mockRes as Response);

      expect(mockOriginService.patch).toHaveBeenCalledWith(1, mockUpdateData);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Updated", { id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: mockUpdatedOrigin,
      });
    });

    it("should handle update errors", async () => {
      const error = new Error("Update failed");
      const mockErrorBody = { code: 400, response: { error: "Bad Request" } };

      mockReq.params = { id: "1" };
      mockReq.body = { name: "Updated Italian" };
      mockOriginService.patch.mockRejectedValue(error);

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
    it("should delete an origin successfully", async () => {
      const mockDeletedOrigin = {
        id: 1,
        name: "Deleted Origin",
        description: "Deleted cuisine",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.params = { id: "1" };
      mockOriginService.delete.mockResolvedValue(mockDeletedOrigin);

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockOriginService.delete).toHaveBeenCalledWith(1);
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
      mockOriginService.delete.mockRejectedValue(error);

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
