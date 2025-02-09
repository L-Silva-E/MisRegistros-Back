import { Request, Response } from "express";
import FeatureService from "../services/feature.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";

const featureService = new FeatureService();

export default class FeatureController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      const feature = await featureService.create(body);

      const response: IResponse = {
        code: 201,
        message: "Created",
        data: feature,
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
      const dataFeatures = await featureService.get(query);

      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataFeatures.count,
        data: dataFeatures.features,
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
      const feature = await featureService.patch(Number(params.id), body);

      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: feature,
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
      const feature = await featureService.delete(Number(params.id));

      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: feature,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }
}
