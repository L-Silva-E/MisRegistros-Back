import { Response } from "express";
import UserService from "../services/user.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import { ItemResponse } from "../../../shared/interfaces/api.response";
import { HttpStatusCode } from "../../../shared/types.environment";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";

const userService = new UserService();
const logger = new LoggerService("User");

export default class UserController {
  public async register(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    try {
      const { body } = req;

      const user = await userService.register(body);
      logger.info("Registered", { id: user.id });

      const response: ItemResponse<typeof user> = { data: user };
      return res.status(HttpStatusCode.CREATED).send(response);
    } catch (error: unknown) {
      logger.error("Error while registering", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error)),
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async login(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    try {
      const { body } = req;

      const result = await userService.login(body);
      logger.info("Logged in", { id: result.user.id });

      const response: ItemResponse<typeof result> = { data: result };
      return res.status(HttpStatusCode.OK).send(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error("Error while logging in", { error: message });

      if (message === "INVALID_CREDENTIALS") {
        return res.status(HttpStatusCode.UNAUTHORIZED).send({
          error: "Unauthorized",
          details: "Invalid email or password",
        });
      }

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(message),
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async getMe(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    try {
      const idUser = req.user!.id;

      const user = await userService.getMe(idUser);
      logger.info("Retrieved profile", { id: idUser });

      const response: ItemResponse<typeof user> = { data: user };
      return res.status(HttpStatusCode.OK).send(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error("Error while fetching profile", { error: message });

      if (message === "USER_NOT_FOUND") {
        return res.status(HttpStatusCode.NOT_FOUND).send({
          error: "Not Found",
          details: "User not found",
        });
      }

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(message),
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }
}
