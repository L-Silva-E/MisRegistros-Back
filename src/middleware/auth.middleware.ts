import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import environments from "../shared/environment";
import { HttpStatusCode } from "../shared/types.environment";
import { ErrorResponse } from "../shared/interfaces/api.response";
import { Role } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
    role: Role;
  };
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      error: "Unauthorized",
      details: "No token provided",
    } satisfies ErrorResponse);
    return;
  }

  try {
    const decoded = jwt.verify(token, environments.JWT_SECRET) as {
      id: number;
      email: string;
      username: string;
      role: Role;
    };
    req.user = decoded;
    next();
  } catch {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      error: "Unauthorized",
      details: "Invalid or expired token",
    } satisfies ErrorResponse);
  }
};

export const optionalAuthMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, environments.JWT_SECRET) as {
        id: number;
        email: string;
        username: string;
        role: Role;
      };
      req.user = decoded;
    } catch {
      // Token inválido — se ignora y req.user queda undefined
    }
  }

  next();
};

export default authMiddleware;
