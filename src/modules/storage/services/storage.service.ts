import cloudinary from "../../../config/cloudinary";
import LoggerService from "../../../services/logger";

export interface UploadResult {
  url: string;
  public_id: string;
}

const logger = new LoggerService("Storage");

export default class StorageService {
  public async upload(
    buffer: Buffer,
    folder = "mis-registros",
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            format: "webp",
            transformation: [{ quality: "auto" }],
          },
          (error, result) => {
            if (error || !result) {
              logger.error("Upload failed", { error });
              return reject(error ?? new Error("Upload failed: no result"));
            }
            resolve({ url: result.secure_url, public_id: result.public_id });
          },
        )
        .end(buffer);
    });
  }

  public async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      logger.error("Delete failed", { publicId, error });
      throw error;
    }
  }
}
