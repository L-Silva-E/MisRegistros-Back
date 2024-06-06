import { z } from "zod";
import {
  PrimaryKeySchema,
  GetZodSchema,
} from "../../../shared/zod/schema/base.schema";

// ~ Base Zod Squema
export const RecipeBaseZodSchema = z.object({
  name: z.string().min(1, "El campo 'nombre' no puede estar vacío"),
  description: z.string().min(1, "El campo 'descripción' no puede estar vacío"),
  score: z
    .number()
    .int()
    .gte(0, "El campo 'puntuación' debe ser mayor o igual a 0")
    .lte(5, "El campo 'puntuación' debe ser menor o igual a 5"),
  ingredients: z.array(
    z.coerce
      .number({
        invalid_type_error: "La 'id' de 'Ingredient' debe ser un número",
      })
      .positive("Ingrese una 'id' válida de 'Ingredient'")
      .optional()
  ),
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
