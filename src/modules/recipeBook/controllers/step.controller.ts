import { Request, Response } from "express";
import StepService from "../services/step.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import {
  CollectionResponse,
  ItemResponse,
  DeleteResponse,
} from "../../../shared/interfaces/api.response";

const stepService = new StepService();
const logger = new LoggerService("Step");

export default class StepController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const step = await stepService.create(body);
      logger.info("Created", { id: step.id });

      const response: ItemResponse<typeof step> = {
        data: step,
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

      const dataSteps = await stepService.get(query);
      logger.info("Retrieved", { count: dataSteps.count });

      const response: CollectionResponse<(typeof dataSteps.steps)[0]> = {
        count: dataSteps.count,
        data: dataSteps.steps,
      };

      return res.status(200).send(response);
    } catch (error: any) {
      logger.error("Error while fetching", {
        filter: req.query,
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const id = Number(params.id);

      const step = await stepService.patch(id, body);
      logger.info("Updated", { id: step.id });

      const response: ItemResponse<typeof step> = {
        data: step,
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

      const step = await stepService.delete(id);
      logger.info("Deleted", { id: step.id });

      const response: DeleteResponse = {
        deleted: true,
        id: step.id!,
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
