import { z } from "zod";

export const UserRegisterZodSchema = z.object({
  body: z.object({
    email: z
      .string({ invalid_type_error: "El campo 'email' debe ser un texto" })
      .email("El campo 'email' debe ser un correo válido"),
    username: z
      .string({ invalid_type_error: "El campo 'username' debe ser un texto" })
      .min(3, "El campo 'username' debe tener al menos 3 caracteres")
      .max(30, "El campo 'username' no puede superar los 30 caracteres"),
    password: z
      .string({ invalid_type_error: "El campo 'password' debe ser un texto" })
      .min(8, "El campo 'password' debe tener al menos 8 caracteres"),
  }),
});

export const UserLoginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ invalid_type_error: "El campo 'email' debe ser un texto" })
      .email("El campo 'email' debe ser un correo válido"),
    password: z
      .string({ invalid_type_error: "El campo 'password' debe ser un texto" })
      .min(1, "El campo 'password' no puede estar vacío"),
  }),
});

export const UserForgotPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({ invalid_type_error: "El campo 'email' debe ser un texto" })
      .email("El campo 'email' debe ser un correo válido"),
  }),
});

export const UserResetPasswordZodSchema = z.object({
  body: z.object({
    token: z
      .string({ invalid_type_error: "El campo 'token' debe ser un texto" })
      .min(1, "El campo 'token' no puede estar vacío"),
    newPassword: z
      .string({ invalid_type_error: "El campo 'newPassword' debe ser un texto" })
      .min(8, "El campo 'newPassword' debe tener al menos 8 caracteres"),
  }),
});
