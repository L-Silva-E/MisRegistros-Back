import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserService from "../services/user.service";
import {
  Context,
  MockContext,
  createMockContext,
} from "../../../shared/jest/context";

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("UserService", () => {
  let userService: UserService;
  let mockCtx: MockContext;
  let ctx: Context;
  const currentDate = new Date();

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    userService = new UserService();
  });

  describe("register", () => {
    it("should register a user and hash the password", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "password123",
      };
      const mockHashedPassword = "hashed_password_123";
      const expectedUser = {
        id: 1,
        email: "test@example.com",
        username: "testuser",
        role: "USER",
        isActive: true,
        lastLoginAt: null,
        createdAt: currentDate,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      mockCtx.prisma.user.create.mockResolvedValue(expectedUser as any);

      // Act
      const result = await userService.register(userData, ctx);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockCtx.prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          username: userData.username,
          passwordHash: mockHashedPassword,
        },
        select: expect.objectContaining({
          id: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
        }),
      });
      expect(result).toEqual(expectedUser);
    });

    it("should not expose passwordHash in the result", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "password123",
      };
      const expectedUser = {
        id: 1,
        email: "test@example.com",
        username: "testuser",
        role: "USER",
        isActive: true,
        lastLoginAt: null,
        createdAt: currentDate,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
      mockCtx.prisma.user.create.mockResolvedValue(expectedUser as any);

      // Act
      const result = await userService.register(userData, ctx);

      // Assert
      expect(result).not.toHaveProperty("passwordHash");
    });

    it("should throw error when email already exists", async () => {
      // Arrange
      const userData = {
        email: "existing@example.com",
        username: "testuser",
        password: "password123",
      };
      const error = new Error("Unique constraint failed on email");

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
      mockCtx.prisma.user.create.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.register(userData, ctx)).rejects.toThrow(
        "Unique constraint failed on email",
      );
    });
  });

  describe("login", () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      username: "testuser",
      passwordHash: "hashed_password",
      role: "USER",
      isActive: true,
      lastLoginAt: null,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    it("should login successfully and return token and public user", async () => {
      // Arrange
      const loginData = { email: "test@example.com", password: "password123" };

      mockCtx.prisma.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockCtx.prisma.user.update.mockResolvedValue({
        ...mockUser,
        lastLoginAt: new Date(),
      } as any);
      (jwt.sign as jest.Mock).mockReturnValue("mock_jwt_token");

      // Act
      const result = await userService.login(loginData, ctx);

      // Assert
      expect(mockCtx.prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        mockUser.passwordHash,
      );
      expect(mockCtx.prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLoginAt: expect.any(Date) },
      });
      expect(result.token).toBe("mock_jwt_token");
      expect(result.user).not.toHaveProperty("passwordHash");
    });

    it("should throw INVALID_CREDENTIALS when user not found", async () => {
      // Arrange
      mockCtx.prisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        userService.login(
          { email: "noone@example.com", password: "pass" },
          ctx,
        ),
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    it("should throw INVALID_CREDENTIALS when user is inactive", async () => {
      // Arrange
      const inactiveUser = { ...mockUser, isActive: false };
      mockCtx.prisma.user.findUnique.mockResolvedValue(inactiveUser as any);

      // Act & Assert
      await expect(
        userService.login({ email: mockUser.email, password: "pass" }, ctx),
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    it("should throw INVALID_CREDENTIALS when password is wrong", async () => {
      // Arrange
      mockCtx.prisma.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        userService.login(
          { email: mockUser.email, password: "wrongpassword" },
          ctx,
        ),
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    it("should update lastLoginAt on successful login", async () => {
      // Arrange
      mockCtx.prisma.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockCtx.prisma.user.update.mockResolvedValue({
        ...mockUser,
        lastLoginAt: new Date(),
      } as any);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      // Act
      await userService.login(
        { email: mockUser.email, password: "password123" },
        ctx,
      );

      // Assert
      expect(mockCtx.prisma.user.update).toHaveBeenCalledTimes(1);
      expect(mockCtx.prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLoginAt: expect.any(Date) },
      });
    });
  });

  describe("getMe", () => {
    it("should return the user profile by id", async () => {
      // Arrange
      const userId = 1;
      const expectedUser = {
        id: 1,
        email: "test@example.com",
        username: "testuser",
        role: "USER",
        isActive: true,
        lastLoginAt: null,
        createdAt: currentDate,
      };

      mockCtx.prisma.user.findUnique.mockResolvedValue(expectedUser as any);

      // Act
      const result = await userService.getMe(userId, ctx);

      // Assert
      expect(mockCtx.prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: expect.objectContaining({
          id: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
        }),
      });
      expect(result).toEqual(expectedUser);
    });

    it("should throw USER_NOT_FOUND when user does not exist", async () => {
      // Arrange
      mockCtx.prisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getMe(999, ctx)).rejects.toThrow(
        "USER_NOT_FOUND",
      );
    });
  });
});
