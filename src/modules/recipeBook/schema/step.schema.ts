import { z } from "zod";
import {
  PrimaryKeySchema,
  GetZodSchema,
} from "../../../shared/zod/schema/base.schema";

//~ Base Zod Squema
export const StepBaseZodSchema = z.object({
  idRecipe: z.coerce
    .number({ invalid_type_error: "Ingrese una 'id' válida" })
    .positive("Ingrese una 'id' válida")
    .optional(),
  number: z.coerce
    .number({ invalid_type_error: "Ingrese un 'orden' válido" })
    .positive("Ingrese un 'orden' válido")
    .optional(),
  instruction: z
    .string({ invalid_type_error: "El campo 'instrucción' debe ser un texto" })
    .min(1, "El campo 'instrucción' no puede estar vacío"),
});

//~ CRUD Zod Schemas
export const StepCreateZodSchema = z.object({
  body: StepBaseZodSchema.strict(),
});

export const StepGetZodSchema = z.object({
  query: GetZodSchema.merge(StepBaseZodSchema.partial()).strict(),
});

export const StepUpdateZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
  body: StepBaseZodSchema.partial(),
});

export const StepDeleteZodSchema = z.object({
  params: PrimaryKeySchema.strict(),
});
