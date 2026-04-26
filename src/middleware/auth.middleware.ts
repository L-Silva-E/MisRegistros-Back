import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import environments from "../shared/environment";
import { HttpStatusCode } from "../shared/types.environment";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
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
      code: HttpStatusCode.UNAUTHORIZED,
      message: "Unauthorized: No token provided",
      data: {},
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, environments.JWT_SECRET) as {
      id: number;
      email: string;
      username: string;
    };
    req.user = decoded;
    next();
  } catch {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      code: HttpStatusCode.UNAUTHORIZED,
      message: "Unauthorized: Invalid or expired token",
      data: {},
    });
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
      };
      req.user = decoded;
    } catch {
      // Token inválido — se ignora y req.user queda undefined
    }
  }

  next();
};

export default authMiddleware;
