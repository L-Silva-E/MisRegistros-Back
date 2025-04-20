import { Request, Response } from "express";
import FeatureService from "../services/feature.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";
import logger from "../../../config/logger";

const featureService = new FeatureService();

export default class FeatureController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      logger.info("Creating feature", { metadata: { body: body } });
      const feature = await featureService.create(body);

      logger.info("Feature created", { metadata: { id: feature.id } });
      const response: IResponse = {
        code: 201,
        message: "Created",
        data: feature,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error creating feature: ${error.message}`, {
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

      logger.info("Getting features", { metadata: { query: query } });
      const dataFeatures = await featureService.get(query);

      logger.info("Features obtained", {
        metadata: { count: dataFeatures.count },
      });
      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataFeatures.count,
        data: dataFeatures.features,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error getting features: ${error.message}`, {
        metadata: {
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

      logger.info(`Updating feature`, { metadata: { id: id, body: body } });
      const feature = await featureService.patch(id, body);

      logger.info("Feature updated", { metadata: { id: feature.id } });
      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: feature,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error updating feature: ${error.message}`, {
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

      logger.info(`Deleting feature`, { metadata: { id: id } });
      const feature = await featureService.delete(id);

      logger.info("Feature deleted", { metadata: { id: feature.id } });
      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: feature,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error deleting feature: ${error.message}`, {
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
