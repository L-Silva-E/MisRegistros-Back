import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../../interfaces/api.response";
import environment from "../../environment";
import LoggerService from "../../../services/logger";

const logger = new LoggerService("Authorization");

export default function AuthorizationApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const apiKey = req?.get("api-key");

  if (!apiKey || apiKey !== environment.API_KEY) {
    logger.error("Invalid or missing API key", {
      method: req.method,
      endpoint: req.originalUrl,
      ip: req.ip,
    });

    const apiError: ErrorResponse = {
      error: "Unauthorized",
      details: "Invalid or missing API key",
    };

    return res.status(401).send(apiError);
  }

  next();
}
