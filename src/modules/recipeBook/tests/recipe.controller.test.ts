// Mock RecipeService at module level before importing
const mockRecipeService = {
  create: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
};

jest.mock("../services/recipe.service", () => {
  return jest.fn().mockImplementation(() => mockRecipeService);
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

import { Response } from "express";
import RecipeController from "../controllers/recipe.controller";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { Role } from "@prisma/client";

describe("RecipeController", () => {
  let controller: RecipeController;
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;

  const adminUser = { id: 1, email: "admin@example.com", username: "admin", role: "ADMIN" as Role };
  const regularUser = { id: 2, email: "user@example.com", username: "user", role: "USER" as Role };

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new RecipeController();

    mockReq = {
      body: {},
      query: {},
      params: {},
      user: undefined,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("create", () => {
    it("should create a recipe successfully", async () => {
      const mockRecipeData = {
        idCategory: 1,
        idOrigin: 1,
        name: "Test Recipe",
        description: "A test recipe",
        score: 5,
        time: 30,
        servings: 4,
      };
      const mockCreatedRecipe = {
        id: 1,
        ...mockRecipeData,
        thumbnail: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.body = mockRecipeData;
      mockRecipeService.create.mockResolvedValue(mockCreatedRecipe);

      await controller.create(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockRecipeService.create).toHaveBeenCalledWith(mockRecipeData);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Created", { id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        data: mockCreatedRecipe,
      });
    });

    it("should handle creation errors", async () => {
      const error = new Error("Creation failed");
      const mockErrorBody = { code: 400, response: { error: "Bad Request" } };

      mockReq.body = { name: "Test Recipe" };
      mockRecipeService.create.mockRejectedValue(error);

      await controller.create(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while creating",
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
    it("should retrieve recipes successfully", async () => {
      const mockRecipes = [
        {
          id: 1,
          idCategory: 1,
          idOrigin: 1,
          name: "Recipe 1",
          description: "First recipe",
          thumbnail: null,
          score: 5,
          time: 30,
          servings: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          idCategory: 2,
          idOrigin: 1,
          name: "Recipe 2",
          description: "Second recipe",
          thumbnail: null,
          score: 4,
          time: 45,
          servings: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockResult = { count: 2, recipes: mockRecipes };

      mockReq.query = { limit: "10" };
      mockRecipeService.get.mockResolvedValue(mockResult);

      await controller.get(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockRecipeService.get).toHaveBeenCalledWith(mockReq.query);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Retrieved", {
        count: 2,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        count: 2,
        data: mockRecipes,
      });
    });

    it("should handle retrieval errors", async () => {
      const error = new Error("Retrieval failed");
      const mockErrorBody = {
        code: 500,
        response: { error: "Internal Server Error" },
      };

      mockReq.query = { limit: "10" };
      mockRecipeService.get.mockRejectedValue(error);

      await controller.get(mockReq as AuthenticatedRequest, mockRes as Response);

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
    const mockUpdateData = { name: "Updated Recipe", score: 4 };
    const mockUpdatedRecipe = {
      id: 1,
      idCategory: 1,
      idOrigin: 1,
      name: "Updated Recipe",
      description: "Updated description",
      thumbnail: null,
      score: 4,
      time: 30,
      servings: 4,
      ingredients: [],
      steps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should update a recipe as admin (no ownership check)", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = mockUpdateData;
      mockReq.user = adminUser;
      mockRecipeService.patch.mockResolvedValue(mockUpdatedRecipe);

      await controller.patch(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockRecipeService.patch).toHaveBeenCalledWith(1, mockUpdateData, undefined, undefined);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Updated", { id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ data: mockUpdatedRecipe });
    });

    it("should update a recipe as the owner", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = mockUpdateData;
      mockReq.user = regularUser;
      mockRecipeService.patch.mockResolvedValue(mockUpdatedRecipe);

      await controller.patch(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockRecipeService.patch).toHaveBeenCalledWith(1, mockUpdateData, undefined, regularUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 when recipe not found", async () => {
      mockReq.params = { id: "99" };
      mockReq.body = mockUpdateData;
      mockReq.user = regularUser;
      mockRecipeService.patch.mockRejectedValue(new Error("RECIPE_NOT_FOUND"));

      await controller.patch(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({ error: "Not Found", details: "Recipe not found" });
    });

    it("should return 403 when user does not own the recipe", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = mockUpdateData;
      mockReq.user = regularUser;
      mockRecipeService.patch.mockRejectedValue(new Error("RECIPE_FORBIDDEN"));

      await controller.patch(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.send).toHaveBeenCalledWith({ error: "Forbidden", details: "You can only edit your own recipes" });
    });

    it("should handle unexpected update errors", async () => {
      const error = new Error("Update failed");
      const mockErrorBody = { code: 400, response: { error: "Bad Request" } };

      mockReq.params = { id: "1" };
      mockReq.body = mockUpdateData;
      mockReq.user = adminUser;
      mockRecipeService.patch.mockRejectedValue(error);

      await controller.patch(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while updating",
        { id: 1, body: mockReq.body, error: error.message, stack: error.stack },
      );
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });

  describe("delete", () => {
    const mockDeletedRecipe = {
      id: 1,
      idCategory: 1,
      idOrigin: 1,
      name: "Deleted Recipe",
      description: "Deleted description",
      thumbnail: null,
      score: 5,
      time: 30,
      servings: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should delete a recipe as admin (no ownership check)", async () => {
      mockReq.params = { id: "1" };
      mockReq.user = adminUser;
      mockRecipeService.delete.mockResolvedValue(mockDeletedRecipe);

      await controller.delete(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockRecipeService.delete).toHaveBeenCalledWith(1, undefined, undefined);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Deleted", { id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ deleted: true, id: 1 });
    });

    it("should delete a recipe as the owner", async () => {
      mockReq.params = { id: "1" };
      mockReq.user = regularUser;
      mockRecipeService.delete.mockResolvedValue(mockDeletedRecipe);

      await controller.delete(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockRecipeService.delete).toHaveBeenCalledWith(1, undefined, regularUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 when recipe not found", async () => {
      mockReq.params = { id: "99" };
      mockReq.user = regularUser;
      mockRecipeService.delete.mockRejectedValue(new Error("RECIPE_NOT_FOUND"));

      await controller.delete(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({ error: "Not Found", details: "Recipe not found" });
    });

    it("should return 403 when user does not own the recipe", async () => {
      mockReq.params = { id: "1" };
      mockReq.user = regularUser;
      mockRecipeService.delete.mockRejectedValue(new Error("RECIPE_FORBIDDEN"));

      await controller.delete(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.send).toHaveBeenCalledWith({ error: "Forbidden", details: "You can only delete your own recipes" });
    });

    it("should handle unexpected deletion errors", async () => {
      const error = new Error("Deletion failed");
      const mockErrorBody = { code: 404, response: { error: "Not Found" } };

      mockReq.params = { id: "1" };
      mockReq.user = adminUser;
      mockRecipeService.delete.mockRejectedValue(error);

      await controller.delete(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while deleting",
        { id: 1, error: error.message, stack: error.stack },
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });
});
