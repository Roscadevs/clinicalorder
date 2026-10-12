import { z } from 'zod';

/**
 * Esquema defensivo para solicitar recuperación de contraseña.
 * Exige formato de correo válido RFC 5322.
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido')
    .max(100, 'El correo no puede exceder 100 caracteres')
    .trim()
    .toLowerCase(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Esquema defensivo para actualización de contraseña.
 * Exige complejidad:
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 * - Coincidencia exacta entre password y confirmPassword
 */
export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(100, 'La contraseña no puede exceder 100 caracteres')
      .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
      .regex(/[a-z]/, 'Debe incluir al menos una letra minúscula')
      .regex(/[0-9]/, 'Debe incluir al menos un número')
      .regex(/[^A-Za-z0-9]/, 'Debe incluir al menos un carácter especial (!@#$%^&*...)'),
    confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
