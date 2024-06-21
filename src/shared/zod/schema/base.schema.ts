import { z } from "zod";

export const PrimaryKeySchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: "La 'id' debe ser un número" })
    .positive("Ingrese una 'id' válida")
    .optional(),
});

export const GetZodSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: "La 'id' debe ser un número" })
    .positive("Ingrese una 'id' válida")
    .optional(),
  createdAt: z
    .string()
    .min(1, "El campo 'creado' no puede estar vacío")
    .optional(),
  updatedAt: z
    .string()
    .min(1, "El campo 'actualizado' no puede estar vacío")
    .optional(),
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "La 'página' debe ser un número válido",
    })
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "El 'límite' debe ser un número válido",
    })
    .optional(),
  from: z.string().min(1, "El campo 'desde' no puede estar vacío").optional(),
  to: z.string().min(1, "El campo 'hasta' no puede estar vacío").optional(),
  orderByField: z
    .string()
    .min(1, "El campo 'ordenar por' no puede estar vacío")
    .optional(),
  orderBy: z.enum(["asc", "desc"]).optional(),
});
