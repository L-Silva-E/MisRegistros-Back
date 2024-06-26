import { Request, Response } from "express";
import OriginService from "../services/origin.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";

const originService = new OriginService();

export default class OriginController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      const origin = await originService.create(body);

      const response: IResponse = {
        code: 201,
        message: "Created",
        data: origin,
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
      const dataOrigins = await originService.get(query);

      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataOrigins.count,
        data: dataOrigins.origins,
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
      const origin = await originService.patch(Number(params.id), body);

      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: origin,
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
      const origin = await originService.delete(Number(params.id));

      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: origin,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }
}
