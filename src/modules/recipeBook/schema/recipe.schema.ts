import { z } from "zod";
import {
  PrimaryKeySchema,
  GetZodSchema,
} from "../../../shared/zod/schema/base.schema";

import { StepBaseZodSchema } from "./step.schema";

// ~ Base Zod Squema
export const RecipeBaseZodSchema = z.object({
  idCategory: z.coerce
    .number({ invalid_type_error: "La 'id' de 'Categoría' debe ser un número" })
    .positive("Ingrese una 'id' válida"),
  idOrigin: z.coerce
    .number({ invalid_type_error: "La 'id' de 'Origen' debe ser un número" })
    .positive("Ingrese una 'id' válida"),
  name: z.string().min(1, "El campo 'nombre' no puede estar vacío"),
  description: z.string().min(1, "El campo 'descripción' no puede estar vacío"),
  thumbnail: z
    .string()
    .url("El campo 'thumbnail' debe ser una URL válida")
    .refine((url) => {
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        return /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(pathname);
      } catch {
        return false;
      }
    }, "Debe ser una URL de imagen válida")
    .optional(),
  score: z
    .number()
    .int()
    .gte(0, "El campo 'puntuación' debe ser mayor o igual a 0")
    .lte(5, "El campo 'puntuación' debe ser menor o igual a 5"),
  time: z.coerce
    .number()
    .int()
    .positive("El campo 'tiempo' debe ser mayor o igual a 0"),
  servings: z.coerce
    .number()
    .int()
    .positive("El campo 'porciones' debe ser mayor o igual a 0"),
  ingredients: z
    .array(
      z.object({
        quantity: z.number().gte(0, "La 'cantidad' debe ser mayor o igual a 0"),
        id: z.coerce
          .number({ invalid_type_error: "La 'id' debe ser un número" })
          .positive("Ingrese una 'id' válida"),
      })
    )
    .nonempty("Debe tener al menos un 'Ingrediente'"),
  steps: z
    .array(StepBaseZodSchema)
    .nonempty("Debe tener al menos un 'Paso'")
    .optional(),
});

// ~ CRUD Zod Schemas
export const RecipeCreateZodSchema = z.object({
  body: RecipeBaseZodSchema.strict(),
});

export const RecipeGetZodSchema = z.object({
  query: GetZodSchema.merge(RecipeBaseZodSchema.partial()).strict(),
});

export const RecipeUpdateZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
  body: RecipeBaseZodSchema.partial(),
});

export const RecipeDeleteZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
});
