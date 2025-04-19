import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const ip =
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "";

    logger.http(`${req.method} ${req.originalUrl}`, {
      metadata: {
        method: req.method,
        url: req.originalUrl,
        ip,
        statusCode: res.statusCode,
        userAgent: req.headers["user-agent"],
        duration: `${duration}ms`,
      },
    });
  });

  next();
};

export default httpLogger;
