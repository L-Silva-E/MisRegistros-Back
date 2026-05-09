const mockUserService = {
  register: jest.fn(),
  login: jest.fn(),
  getMe: jest.fn(),
};

const mockLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
};

jest.mock("../services/user.service", () => {
  return jest.fn().mockImplementation(() => mockUserService);
});

jest.mock("../../../services/logger", () => {
  return jest.fn().mockImplementation(() => mockLoggerService);
});

const mockErrorCodes = jest.fn().mockImplementation((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  if (errorMessage.includes("unique") || errorMessage.includes("Conflict")) {
    return { code: 409, response: { error: "Conflict" } };
  }
  return { code: 500, response: { error: "Internal Server Error" } };
});

jest.mock(
  "../../../shared/prisma/middlewares/error.codes",
  () => mockErrorCodes,
);

import { Response } from "express";
import UserController from "../controllers/user.controller";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { Role } from "@prisma/client";

describe("UserController", () => {
  let controller: UserController;
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new UserController();

    mockReq = {
      body: {},
      user: undefined,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      const registerData = {
        email: "test@example.com",
        username: "testuser",
        password: "password123",
      };
      const mockUser = {
        id: 1,
        email: "test@example.com",
        username: "testuser",
        role: "USER" as Role,
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
      };

      mockReq.body = registerData;
      mockUserService.register.mockResolvedValue(mockUser);

      await controller.register(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
      );

      expect(mockUserService.register).toHaveBeenCalledWith(registerData);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Registered", {
        id: 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({ data: mockUser });
    });

    it("should handle registration errors", async () => {
      const error = new Error("unique constraint failed");
      const mockErrorBody = { code: 409, response: { error: "Conflict" } };

      mockReq.body = {
        email: "existing@example.com",
        username: "existing",
        password: "password123",
      };
      mockUserService.register.mockRejectedValue(error);

      await controller.register(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
      );

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while registering",
        {
          error: error.message,
          stack: error.stack,
        },
      );
      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      const loginData = { email: "test@example.com", password: "password123" };
      const mockResult = {
        token: "mock_jwt_token",
        user: {
          id: 1,
          email: "test@example.com",
          username: "testuser",
          role: "USER" as Role,
          isActive: true,
          lastLoginAt: null,
          createdAt: new Date(),
        },
      };

      mockReq.body = loginData;
      mockUserService.login.mockResolvedValue(mockResult);

      await controller.login(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
      );

      expect(mockUserService.login).toHaveBeenCalledWith(loginData);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Logged in", {
        id: 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ data: mockResult });
    });

    it("should return 401 for invalid credentials", async () => {
      const error = new Error("INVALID_CREDENTIALS");

      mockReq.body = { email: "test@example.com", password: "wrongpassword" };
      mockUserService.login.mockRejectedValue(error);

      await controller.login(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
      );

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while logging in",
        { error: error.message },
      );
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith({
        error: "Unauthorized",
        details: "Invalid email or password",
      });
    });

    it("should handle other login errors", async () => {
      const error = new Error("Database connection failed");
      const mockErrorBody = {
        code: 500,
        response: { error: "Internal Server Error" },
      };

      mockReq.body = { email: "test@example.com", password: "password123" };
      mockUserService.login.mockRejectedValue(error);

      await controller.login(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });

  describe("getMe", () => {
    it("should retrieve the authenticated user profile", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        username: "testuser",
        role: "USER" as Role,
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
      };

      mockReq.user = {
        id: 1,
        email: "test@example.com",
        username: "testuser",
        role: "USER" as Role,
      };
      mockUserService.getMe.mockResolvedValue(mockUser);

      await controller.getMe(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
      );

      expect(mockUserService.getMe).toHaveBeenCalledWith(1);
      expect(mockLoggerService.info).toHaveBeenCalledWith("Retrieved profile", {
        id: 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ data: mockUser });
    });

    it("should return 404 when user not found", async () => {
      const error = new Error("USER_NOT_FOUND");

      mockReq.user = {
        id: 999,
        email: "missing@example.com",
        username: "missing",
        role: "USER" as Role,
      };
      mockUserService.getMe.mockRejectedValue(error);

      await controller.getMe(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
      );

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        "Error while fetching profile",
        { error: error.message },
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        error: "Not Found",
        details: "User not found",
      });
    });

    it("should handle other profile errors", async () => {
      const error = new Error("Database connection failed");
      const mockErrorBody = {
        code: 500,
        response: { error: "Internal Server Error" },
      };

      mockReq.user = {
        id: 1,
        email: "test@example.com",
        username: "testuser",
        role: "USER" as Role,
      };
      mockUserService.getMe.mockRejectedValue(error);

      await controller.getMe(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith(mockErrorBody.response);
    });
  });
});
