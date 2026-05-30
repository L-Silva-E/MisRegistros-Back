import { Response } from "express";
import RecipeService from "../services/recipe.service";
import StorageService, {
  UploadResult,
} from "../../storage/services/storage.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import {
  CollectionResponse,
  ItemResponse,
  DeleteResponse,
  ErrorResponse,
} from "../../../shared/interfaces/api.response";
import { HttpStatusCode } from "../../../shared/types.environment";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";

const recipeService = new RecipeService();
const storageService = new StorageService();
const logger = new LoggerService("Recipe");

export default class RecipeController {
  public async create(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    let uploadResult: UploadResult | undefined;

    try {
      const { body } = req;
      const idUser = req.user?.id;

      if (req.file) {
        uploadResult = await storageService.upload(
          req.file.buffer,
          "mis-registros/recipes",
        );
      }

      const recipe = await recipeService.create({
        ...body,
        idUser,
        thumbnail: uploadResult?.url,
      });
      logger.info("Created", { id: recipe.id });

      const response: ItemResponse<typeof recipe> = { data: recipe };
      return res.status(HttpStatusCode.CREATED).send(response);
    } catch (error: unknown) {
      if (uploadResult) {
        await storageService.delete(uploadResult.public_id).catch(() => {});
      }

      logger.error("Error while creating", {
        body: req.body,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error)),
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async get(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    try {
      const query = { ...req.query } as Record<string, any>;

      if (query.idUser === "me") {
        if (!req.user) {
          return res.status(HttpStatusCode.UNAUTHORIZED).send({
            error: "Unauthorized",
            details: "Token required to filter by idUser=me",
          } satisfies ErrorResponse);
        }
        query.idUser = req.user.id;
      } else if (query.idUser !== undefined) {
        query.idUser = Number(query.idUser);
      }

      const dataRecipes = await recipeService.get(query);
      logger.info("Retrieved", { count: dataRecipes.count });

      const response: CollectionResponse<(typeof dataRecipes.recipes)[0]> = {
        count: dataRecipes.count,
        data: dataRecipes.recipes,
      };

      return res.status(HttpStatusCode.OK).send(response);
    } catch (error: unknown) {
      logger.error("Error while fetching", {
        filter: req.query,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : "UnknownError",
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error)),
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async patch(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    let uploadResult: UploadResult | undefined;

    try {
      const { body, params } = req;
      const id = Number(params.id);
      const idUser = req.user?.role !== "ADMIN" ? req.user!.id : undefined;

      let oldThumbnailUrl: string | undefined;
      if (req.file) {
        const current = await recipeService.findById(id);
        if (!current) throw new Error("RECIPE_NOT_FOUND");
        oldThumbnailUrl = current.thumbnail ?? undefined;
        uploadResult = await storageService.upload(
          req.file.buffer,
          "mis-registros/recipes",
        );
      }

      const recipe = await recipeService.patch(
        id,
        { ...body, thumbnail: uploadResult?.url ?? body.thumbnail },
        undefined,
        idUser,
      );

      if (uploadResult && oldThumbnailUrl) {
        const oldPublicId = storageService.extractPublicId(oldThumbnailUrl);
        if (oldPublicId) await storageService.delete(oldPublicId).catch(() => {});
      }

      logger.info("Updated", { id: recipe.id });
      const response: ItemResponse<typeof recipe> = { data: recipe };
      return res.status(HttpStatusCode.OK).send(response);
    } catch (error: unknown) {
      if (uploadResult) {
        await storageService.delete(uploadResult.public_id).catch(() => {});
      }

      const message = error instanceof Error ? error.message : String(error);

      if (message === "RECIPE_NOT_FOUND") {
        return res.status(HttpStatusCode.NOT_FOUND).send({
          error: "Not Found",
          details: "Recipe not found",
        } satisfies ErrorResponse);
      }
      if (message === "RECIPE_FORBIDDEN") {
        return res.status(HttpStatusCode.FORBIDDEN).send({
          error: "Forbidden",
          details: "You can only edit your own recipes",
        } satisfies ErrorResponse);
      }

      logger.error("Error while updating", {
        id: Number(req.params.id),
        body: req.body,
        error: message,
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(message),
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async delete(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);
      const idUser = req.user?.role !== "ADMIN" ? req.user!.id : undefined;

      const recipe = await recipeService.delete(id, undefined, idUser);

      if (recipe.thumbnail) {
        const publicId = storageService.extractPublicId(recipe.thumbnail);
        if (publicId) await storageService.delete(publicId).catch(() => {});
      }

      logger.info("Deleted", { id: recipe.id });

      const response: DeleteResponse = { deleted: true, id: recipe.id! };
      return res.status(HttpStatusCode.OK).send(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      if (message === "RECIPE_NOT_FOUND") {
        return res.status(HttpStatusCode.NOT_FOUND).send({
          error: "Not Found",
          details: "Recipe not found",
        } satisfies ErrorResponse);
      }
      if (message === "RECIPE_FORBIDDEN") {
        return res.status(HttpStatusCode.FORBIDDEN).send({
          error: "Forbidden",
          details: "You can only delete your own recipes",
        } satisfies ErrorResponse);
      }

      logger.error("Error while deleting", {
        id: Number(req.params.id),
        error: message,
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(message),
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }
}
