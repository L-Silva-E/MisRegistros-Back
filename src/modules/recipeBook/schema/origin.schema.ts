import { z } from "zod";
import {
  PrimaryKeySchema,
  GetZodSchema,
} from "../../../shared/zod/schema/base.schema";

//~ Base Zod Squema
export const OriginBaseZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "El campo 'nombre' debe ser un texto" })
    .min(1, "El campo 'nombre' no puede estar vacío"),
});

//~ CRUD Zod Schemas
export const OriginCreateZodSchema = z.object({
  body: OriginBaseZodSchema.strict(),
});

export const OriginGetZodSchema = z.object({
  query: GetZodSchema.merge(OriginBaseZodSchema.partial()).strict(),
});

export const OriginUpdateZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
  body: OriginBaseZodSchema.partial(),
});

export const OriginDeleteZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
});
