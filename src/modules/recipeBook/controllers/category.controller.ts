import { Request, Response } from "express";
import CategoryService from "../services/category.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import {
  CollectionResponse,
  ItemResponse,
  DeleteResponse,
} from "../../../shared/interfaces/api.response";

const categoryService = new CategoryService();
const logger = new LoggerService("Category");

export default class CategoryController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const category = await categoryService.create(body);
      logger.info("Created", { id: category.id });

      const response: ItemResponse<typeof category> = {
        data: category,
      };

      return res.status(201).send(response);
    } catch (error: any) {
      logger.error("Error while creating:", {
        body: req.body,
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;

      const dataCategories = await categoryService.get(query);
      logger.info("Retrieved", { count: dataCategories.count });

      const response: CollectionResponse<
        (typeof dataCategories.categories)[0]
      > = {
        count: dataCategories.count,
        data: dataCategories.categories,
      };

      return res.status(200).send(response);
    } catch (error: any) {
      logger.error("Error while fetching", {
        method: "get",
        query: req.query,
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const id = Number(params.id);

      const category = await categoryService.patch(id, body);
      logger.info("Updated", { id: category.id });

      const response: ItemResponse<typeof category> = {
        data: category,
      };

      return res.status(200).send(response);
    } catch (error: any) {
      logger.error("Error while updating", {
        id: Number(req.params.id),
        body: req.body,
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);

      const category = await categoryService.delete(id);
      logger.info("Deleted", { id: category.id });

      const response: DeleteResponse = {
        deleted: true,
        id: category.id!,
      };

      return res.status(200).send(response);
    } catch (error: any) {
      logger.error("Error while deleting", {
        id: Number(req.params.id),
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody.response);
    }
  }
}
