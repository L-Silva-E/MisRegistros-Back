import { z } from "zod";
import {
  PrimaryKeySchema,
  GetZodSchema,
} from "../../../shared/zod/schema/base.schema";

// ~ Base Zod Squema
export const CategoryBaseZodSchema = z.object({
  name: z.string().min(1, "El campo 'nombre' no puede estar vacío"),
});

// ~ CRUD Zod Schemas
export const CategoryCreateZodSchema = z.object({
  body: CategoryBaseZodSchema.strict(),
});

export const CategoryGetZodSchema = z.object({
  query: GetZodSchema.merge(CategoryBaseZodSchema.partial()).strict(),
});

export const CategoryUpdateZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
  body: CategoryBaseZodSchema.partial(),
});

export const CategoryDeleteZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
});
