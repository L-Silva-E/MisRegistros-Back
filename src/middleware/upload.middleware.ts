import multer, { FileFilterCallback, MulterError } from "multer";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../shared/types.environment";
import { ErrorResponse } from "../shared/interfaces/api.response";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("INVALID_FILE_TYPE"));
  }
};

const multerUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});

const uploadMiddleware =
  (fieldName: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    multerUpload.single(fieldName)(req, res, (error) => {
      if (!error) return next();

      if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: "Bad Request",
          details: `El archivo no puede superar los ${MAX_SIZE_MB}MB`,
        } satisfies ErrorResponse);
        return;
      }

      if (error instanceof Error && error.message === "INVALID_FILE_TYPE") {
        res.status(HttpStatusCode.UNSUPPORTED_MEDIA_TYPE).json({
          error: "Unsupported Media Type",
          details: "Solo se permiten imágenes en formato JPG, PNG o WebP",
        } satisfies ErrorResponse);
        return;
      }

      next(error);
    });
  };

export default uploadMiddleware;
