import { z } from "zod";
import {
  PrimaryKeySchema,
  GetZodSchema,
} from "../../../shared/zod/schema/base.schema";

//~ Base Zod Schema
export const FeatureBaseZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "El campo 'nombre' debe ser un texto" })
    .min(1, "El campo 'nombre' no puede estar vacío"),
  description: z
    .string({ invalid_type_error: "El campo 'descripción' debe ser un texto" })
    .min(1, "El campo 'descripción' no puede estar vacío"),
  isActive: z.coerce.boolean().default(true),
});

//~ CRUD Zod Schemas
export const FeatureCreateZodSchema = z.object({
  body: FeatureBaseZodSchema.strict(),
});

export const FeatureGetZodSchema = z.object({
  query: GetZodSchema.merge(FeatureBaseZodSchema.partial()).strict(),
});

export const FeatureUpdateZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
  body: FeatureBaseZodSchema.partial(),
});

export const FeatureDeleteZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
});
