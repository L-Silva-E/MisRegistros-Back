import { z } from "zod";

export const PrimaryKeySchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: "Ingrese una 'id' válida" })
    .positive("Ingrese una 'id' válida")
    .optional(),
});

export const GetZodSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: "Ingrese una 'id' válida" })
    .positive("Ingrese una 'id' válida")
    .optional(),
  createdAt: z
    .string()
    .min(1, "El campo 'fecha de creación' no puede estar vacío")
    .optional(),
  updatedAt: z
    .string()
    .min(1, "El campo 'fecha de actualización' no puede estar vacío")
    .optional(),
  page: z.coerce
    .number({ invalid_type_error: "La 'página' debe ser un número válido" })
    .int("La 'página' debe ser un número entero")
    .min(0, "La 'página' debe ser mayor o igual a 0")
    .optional(),
  limit: z.coerce
    .number({ invalid_type_error: "El 'límite' debe ser un número válido" })
    .int("El 'límite' debe ser un número entero")
    .positive("El 'límite' debe ser mayor a 0")
    .optional(),
  from: z.string().min(1, "El campo 'desde' no puede estar vacío").optional(),
  to: z.string().min(1, "El campo 'hasta' no puede estar vacío").optional(),
  orderByField: z
    .string()
    .min(1, "El campo 'ordenar por' no puede estar vacío")
    .optional(),
  orderBy: z.enum(["asc", "desc"]).optional(),
});
