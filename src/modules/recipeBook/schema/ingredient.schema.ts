import { z } from "zod";
import {
  PrimaryKeySchema,
  GetZodSchema,
} from "../../../shared/zod/schema/base.schema";

import { Unit } from "../../../shared/enums";

// ~ Base Zod Squema
export const IngredientBaseZodSchema = z.object({
  name: z.string().min(1, "El campo 'nombre' no puede estar vacío"),
  unit: z.nativeEnum(Unit, {
    errorMap: () => {
      return {
        message:
          "El campo 'unidad' debe ser uno de los siguientes tipos: " +
          Object.values(Unit).join(", "),
      };
    },
  }),
});

// ~ CRUD Zod Schemas
export const IngredientCreateZodSchema = z.object({
  body: IngredientBaseZodSchema.strict(),
});

export const IngredientGetZodSchema = z.object({
  query: GetZodSchema.merge(IngredientBaseZodSchema.partial()).strict(),
});

export const IngredientUpdateZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
  body: IngredientBaseZodSchema.partial(),
});

export const IngredientDeleteZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
});
