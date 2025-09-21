import { Request, Response } from "express";
import MetadataService from "../services/metadata.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import { ItemResponse } from "../../../shared/interfaces/api.response";
import { MetadataWithUsageResponse } from "../models/metadata.model";

const metadataService = new MetadataService();
const logger = new LoggerService("Metadata");

export default class MetadataController {
  public async getWithUsageCount(
    _req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const metadata = await metadataService.getMetadataWithUsageCount();

      logger.info("Retrieved metadata with usage count", {
        ingredientsCount: metadata.ingredients.length,
        categoriesCount: metadata.categories.length,
        originsCount: metadata.origins.length,
      });

      const response: ItemResponse<MetadataWithUsageResponse> = {
        data: metadata,
      };

      return res.status(200).send(response);
    } catch (error: unknown) {
      logger.error("Error while retrieving metadata with usage count:", {
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
