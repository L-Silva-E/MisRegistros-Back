import { z } from "zod";
import {
  PrimaryKeySchema,
  GetZodSchema,
} from "../../../shared/zod/schema/base.schema";

import { UnitList } from "../../../shared/enums";

//~ Base Zod Squema
export const IngredientBaseZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "El campo 'nombre' debe ser un texto" })
    .min(1, "El campo 'nombre' no puede estar vacío"),
  unit: z.nativeEnum(UnitList, {
    errorMap: () => {
      return {
        message:
          "El campo 'unidad' debe ser uno de los siguientes tipos: " +
          Object.values(UnitList).join(", "),
      };
    },
  }),
});

//~ CRUD Zod Schemas
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
