import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { Context } from "../../../shared/jest/context";
import environments from "../../../shared/environment";
import { UserPublicModel, UserLoginResponse } from "../models/user.model";

const prismaClient = new PrismaClient();
const SALT_ROUNDS = 10;

export default class UserService {
  public async register(
    data: { email: string; username: string; password: string },
    ctx?: Context,
  ): Promise<UserPublicModel> {
    const prisma = ctx?.prisma || prismaClient;

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    return user;
  }

  public async login(
    data: { email: string; password: string },
    ctx?: Context,
  ): Promise<UserLoginResponse> {
    const prisma = ctx?.prisma || prismaClient;

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.isActive) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      environments.JWT_SECRET,
      { expiresIn: environments.JWT_EXPIRES_IN } as SignOptions,
    );

    const { passwordHash: _, ...userPublic } = user;

    return { token, user: userPublic };
  }

  public async getMe(idUser: number, ctx?: Context): Promise<UserPublicModel> {
    const prisma = ctx?.prisma || prismaClient;

    const user = await prisma.user.findUnique({
      where: { id: idUser },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  }
}
