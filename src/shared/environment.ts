import { IformatEnvironments } from "./types.environment";
import dotenv from "dotenv";
dotenv.config();

const environments: IformatEnvironments = {
  API_ENV: process.env.API_ENV || "development",
  API_KEY: process.env.API_KEY || "MISSING_API_KEY",
  API_URL: process.env.API_URL || "http://localhost:9000",
  API_PORT: Number(process.env.API_PORT) || 9000,
  API_VERSION: process.env.API_VERSION || "v1",

  JWT_SECRET: process.env.JWT_SECRET || "MISSING_JWT_SECRET",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "",
  SENDGRID_EMAIL_FROM: process.env.SENDGRID_EMAIL_FROM || "",
  SENDGRID_TEMPLATE_ID_RESET_PASSWORD: process.env.SENDGRID_TEMPLATE_ID_RESET_PASSWORD || "",

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USERNAME: process.env.DB_USERNAME || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_DATABASE: process.env.DB_DATABASE || "postgres",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  FRONT_URL: process.env.FRONT_URL || "http://localhost:5173",
};

if (environments.API_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required in production");
}

export default environments;
