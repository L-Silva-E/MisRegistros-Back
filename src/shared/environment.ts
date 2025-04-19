import { IformatEnvironments } from "./types.environment";
import dotenv from "dotenv";
dotenv.config();

const environments: IformatEnvironments = {
  API_ENV: process.env.API_ENV || "development",
  API_KEY: process.env.API_KEY || "MISSING_API_KEY",
  API_URL: process.env.API_URL || "http://localhost:9000",
  API_PORT: Number(process.env.API_PORT) || 9000,
  API_VERSION: process.env.API_VERSION || "v1",

  FRONT_URL_LOCAL: process.env.FRONT_URL_LOCAL || "http://localhost:5173",
  FRONT_URL_DEV: process.env.FRONT_URL_DEV || "",
  FRONT_URL_PROD: process.env.FRONT_URL_PROD || "",

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USERNAME: process.env.DB_USERNAME || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_DATABASE: process.env.DB_DATABASE || "postgres",
};

export default environments;
