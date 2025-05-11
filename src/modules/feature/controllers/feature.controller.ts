import { Request, Response } from "express";
import FeatureService from "../services/feature.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";

const featureService = new FeatureService();
const logger = new LoggerService("Feature");

export default class FeatureController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const feature = await featureService.create(body);
      logger.info("Created", { id: feature.id });

      const response: IResponse = {
        code: 201,
        message: "Created",
        data: feature,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while creating:", {
        body: req.body,
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;

      const dataFeatures = await featureService.get(query);
      logger.info("Retrieved", { count: dataFeatures.count });

      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataFeatures.count,
        data: dataFeatures.features,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while fetching", {
        filter: req.query,
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const id = Number(params.id);

      const feature = await featureService.patch(id, body);
      logger.info("Updated", { id: feature.id });

      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: feature,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while updating", {
        id: Number(req.params.id),
        body: req.body,
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);

      const feature = await featureService.delete(id);
      logger.info("Deleted", { id: feature.id });

      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: feature,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while deleting", {
        id: Number(req.params.id),
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }
}
