import { NextFunction, Request, Response } from "express";
import IResponse from "../../../shared/interfaces/Iresponse";

export default function AuthorizationApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const apiKey = req?.get("api-key");

  if (!apiKey || apiKey !== process.env.APP_KEY) {
    const apiError: IResponse = {
      code: 401,
      message: "Unauthorized",
      data: {},
    };

    return res.status(apiError.code).send(apiError);
  }

  next();
}
