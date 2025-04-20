import { Request, Response } from "express";
import CategoryService from "../services/category.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";
import logger from "../../../config/logger";

const categoryService = new CategoryService();

export default class CategoryController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      logger.info("Creating category", { metadata: { body: body } });
      const category = await categoryService.create(body);

      logger.info("Category created", { metadata: { id: category.id } });
      const response: IResponse = {
        code: 201,
        message: "Created",
        data: category,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error creating category: ${error.message}`, {
        metadata: {
          body: req.body,
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;

      logger.info("Getting categories", { metadata: { query: query } });
      const dataCategories = await categoryService.get(query);

      logger.info("Categories obtained", {
        metadata: { count: dataCategories.count },
      });
      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataCategories.count,
        data: dataCategories.categories,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error getting categories: ${error.message}`, {
        metadata: {
          method: "get",
          query: req.query,
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const id = Number(params.id);

      logger.info(`Updating category`, { metadata: { id: id, body: body } });
      const category = await categoryService.patch(id, body);

      logger.info(`Category updated`, {
        metadata: { id: category.id },
      });
      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: category,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error updating category: ${error.message}`, {
        metadata: {
          id: Number(req.params.id),
          body: req.body,
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);

      logger.info(`Deleting category`, { metadata: { id: id } });
      const category = await categoryService.delete(id);

      logger.info(`Category deleted`, { metadata: { id: category.id } });
      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: category,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error deleting category: ${error.message}`, {
        metadata: {
          id: Number(req.params.id),
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }
}
