import { Request, Response } from "express";
import FeatureService from "../services/feature.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import {
  CollectionResponse,
  ItemResponse,
  DeleteResponse,
} from "../../../shared/interfaces/api.response";

const featureService = new FeatureService();
const logger = new LoggerService("Feature");

export default class FeatureController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const feature = await featureService.create(body);
      logger.info("Created", { id: feature.id });

      const response: ItemResponse<typeof feature> = {
        data: feature,
      };

      return res.status(201).send(response);
    } catch (error: unknown) {
      logger.error("Error while creating:", {
        body: req.body,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error))
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;

      const dataFeatures = await featureService.get(query);
      logger.info("Retrieved", { count: dataFeatures.count });

      const response: CollectionResponse<(typeof dataFeatures.features)[0]> = {
        count: dataFeatures.count,
        data: dataFeatures.features,
      };

      return res.status(200).send(response);
    } catch (error: unknown) {
      logger.error("Error while fetching", {
        filter: req.query,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : "UnknownError",
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error))
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const id = Number(params.id);

      const feature = await featureService.patch(id, body);
      logger.info("Updated", { id: feature.id });

      const response: ItemResponse<typeof feature> = {
        data: feature,
      };

      return res.status(200).send(response);
    } catch (error: unknown) {
      logger.error("Error while updating", {
        id: Number(req.params.id),
        body: req.body,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error))
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);

      const feature = await featureService.delete(id);
      logger.info("Deleted", { id: feature.id });

      const response: DeleteResponse = {
        deleted: true,
        id: feature.id!,
      };

      return res.status(200).send(response);
    } catch (error: unknown) {
      logger.error("Error while deleting", {
        id: Number(req.params.id),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error))
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }
}
