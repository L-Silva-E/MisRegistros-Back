import { Router } from "express";
import AuthorizationApiKey from "../../../shared/prisma/middlewares/authorization";
import authMiddleware from "../../../middleware/auth.middleware";
import uploadMiddleware from "../../../middleware/upload.middleware";
import middlewareValidationSchema from "../../../shared/zod/middleware/schema.validation";
import {
  UserRegisterZodSchema,
  UserLoginZodSchema,
  UserForgotPasswordZodSchema,
  UserResetPasswordZodSchema,
} from "../schema/user.schema";
import UserController from "../controllers/user.controller";

export default class UserRouter {
  private version: string;
  public router: Router;
  public controller: UserController;

  constructor(version: string) {
    this.version = version;
    this.router = Router();
    this.controller = new UserController();

    this.router.post(
      `/${this.version}/user/register`,
      AuthorizationApiKey,
      middlewareValidationSchema(UserRegisterZodSchema),
      this.controller.register,
    );

    this.router.post(
      `/${this.version}/user/login`,
      AuthorizationApiKey,
      middlewareValidationSchema(UserLoginZodSchema),
      this.controller.login,
    );

    this.router.post(
      `/${this.version}/user/forgot-password`,
      AuthorizationApiKey,
      middlewareValidationSchema(UserForgotPasswordZodSchema),
      this.controller.forgotPassword,
    );

    this.router.post(
      `/${this.version}/user/reset-password`,
      AuthorizationApiKey,
      middlewareValidationSchema(UserResetPasswordZodSchema),
      this.controller.resetPassword,
    );

    this.router.get(
      `/${this.version}/user/me`,
      AuthorizationApiKey,
      authMiddleware,
      this.controller.getMe,
    );

    this.router.patch(
      `/${this.version}/user/me/avatar`,
      AuthorizationApiKey,
      authMiddleware,
      uploadMiddleware("avatar"),
      this.controller.updateAvatar,
    );

    this.router.delete(
      `/${this.version}/user/me/avatar`,
      AuthorizationApiKey,
      authMiddleware,
      this.controller.deleteAvatar,
    );
  }
}
