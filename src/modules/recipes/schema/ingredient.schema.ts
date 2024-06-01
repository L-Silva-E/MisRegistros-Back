import { z } from "zod";

import { Unit } from "../../../shared/enums";

export const IngredientCreateZodSchema = z.object({
  body: z.object({
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
  }),
});

export const IngredientGetZodSchema = z.object({
  query: z.object({
    id: z
      .number({ invalid_type_error: "La 'id' debe ser un número" })
      .int()
      .positive()
      .optional(),
    name: z
      .string()
      .min(1, "El campo 'nombre' no puede estar vacío")
      .optional(),
    unit: z
      .nativeEnum(Unit, {
        errorMap: () => {
          return {
            message:
              "El campo 'unidad' debe ser uno de los siguientes tipos: " +
              Object.values(Unit).join(", "),
          };
        },
      })
      .optional(),
    createdAt: z
      .string()
      .min(1, "El campo 'creado' no puede estar vacío")
      .optional(),
    updatedAt: z
      .string()
      .min(1, "El campo 'actualizado' no puede estar vacío")
      .optional(),
  }),
});

export const IngredientUpdateZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "El campo 'nombre' no puede estar vacío")
      .optional(),
    unit: z
      .nativeEnum(Unit, {
        errorMap: () => {
          return {
            message:
              "El campo 'unidad' debe ser uno de los siguientes tipos: " +
              Object.values(Unit).join(", "),
          };
        },
      })
      .optional(),
  }),
});

export const IngredientDeleteZodSchema = z.object({
  params: z.object({
    id: z
      .number({ invalid_type_error: "La 'id' debe ser un número" })
      .int()
      .positive(),
  }),
});
