import { Request, Response } from "express";
import OriginService from "../services/origin.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";
import logger from "../../../config/logger";

const originService = new OriginService();

export default class OriginController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      logger.info("Creating origin", { metadata: { body: body } });
      const origin = await originService.create(body);

      logger.info(`Origin created`, { metadata: { id: origin.id } });
      const response: IResponse = {
        code: 201,
        message: "Created",
        data: origin,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error creating origin: ${error.message}`, {
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

      logger.info("Getting origins", { metadata: { query: query } });
      const dataOrigins = await originService.get(query);

      logger.info("Origins obtained", {
        metadata: { count: dataOrigins.count },
      });
      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataOrigins.count,
        data: dataOrigins.origins,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error getting origins: ${error.message}`, {
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

      logger.info(`Updating origin`, { metadata: { id: id, body: body } });
      const origin = await originService.patch(id, body);

      logger.info(`Origin updated`, { metadata: { id: origin.id } });
      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: origin,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error updating origin: ${error.message}`, {
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

      logger.info(`Deleting origin`, { metadata: { id: id } });
      const origin = await originService.delete(id);

      logger.info(`Origin deleted`, { metadata: { id: origin.id } });
      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: origin,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error deleting origin: ${error.message}`, {
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
