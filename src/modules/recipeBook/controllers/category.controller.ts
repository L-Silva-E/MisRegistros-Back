import { Request, Response } from "express";
import CategoryService from "../services/category.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";

const categoryService = new CategoryService();

export default class CategoryController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      const category = await categoryService.create(body);

      const response: IResponse = {
        code: 201,
        message: "Created",
        data: category,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;
      const dataCategories = await categoryService.get(query);

      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataCategories.count,
        data: dataCategories.categories,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const category = await categoryService.patch(Number(params.id), body);

      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: category,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const category = await categoryService.delete(Number(params.id));

      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: category,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }
}
