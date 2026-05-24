import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { Context } from "../../../shared/jest/context";
import environments from "../../../shared/environment";
import { UserPublicModel, UserLoginResponse } from "../models/user.model";
import { SALT_ROUNDS } from "../constants";
import MailService from "../../../services/mail.service";
import {
  generateResetToken,
  generateResetTokenExpiry,
} from "../utils/token.utils";

const mailService = new MailService();

const prismaClient = new PrismaClient();

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
        avatar: true,
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

  public async forgotPassword(
    data: { email: string },
    ctx?: Context,
  ): Promise<void> {
    const prisma = ctx?.prisma || prismaClient;

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.isActive) {
      return;
    }

    const token = generateResetToken();
    const expires = generateResetTokenExpiry();

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpires: expires },
    });

    const resetLink = `${environments.FRONT_URL}/reset-password?token=${token}`;

    await mailService.sendResetPassword({
      to: user.email,
      username: user.username,
      resetLink,
    });
  }

  public async resetPassword(
    data: { token: string; newPassword: string },
    ctx?: Context,
  ): Promise<void> {
    const prisma = ctx?.prisma || prismaClient;

    const user = await prisma.user.findUnique({
      where: { resetToken: data.token },
    });

    if (!user || !user.resetTokenExpires) {
      throw new Error("INVALID_RESET_TOKEN");
    }

    if (user.resetTokenExpires < new Date()) {
      throw new Error("EXPIRED_RESET_TOKEN");
    }

    const passwordHash = await bcrypt.hash(data.newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });
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
        avatar: true,
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  }

  public async updateAvatar(
    userId: number,
    avatarUrl: string,
    ctx?: Context,
  ): Promise<UserPublicModel> {
    const prisma = ctx?.prisma || prismaClient;

    return prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        avatar: true,
      },
    });
  }

  public async deleteAvatar(
    userId: number,
    ctx?: Context,
  ): Promise<{ oldAvatarUrl: string; user: UserPublicModel }> {
    const prisma = ctx?.prisma || prismaClient;

    const current = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (!current?.avatar) {
      throw new Error("NO_AVATAR");
    }

    const oldAvatarUrl = current.avatar;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        avatar: true,
      },
    });

    return { oldAvatarUrl, user };
  }
}
