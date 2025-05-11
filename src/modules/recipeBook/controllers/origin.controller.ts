import { Request, Response } from "express";
import OriginService from "../services/origin.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";

const originService = new OriginService();
const logger = new LoggerService("Origin");

export default class OriginController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const origin = await originService.create(body);
      logger.info("Created", { id: origin.id });

      const response: IResponse = {
        code: 201,
        message: "Created",
        data: origin,
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

      const dataOrigins = await originService.get(query);
      logger.info("Retrieved", { count: dataOrigins.count });

      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataOrigins.count,
        data: dataOrigins.origins,
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

      const origin = await originService.patch(id, body);
      logger.info("Updated", { id: origin.id });

      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: origin,
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

      const origin = await originService.delete(id);
      logger.info("Deleted", { id: origin.id });

      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: origin,
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
