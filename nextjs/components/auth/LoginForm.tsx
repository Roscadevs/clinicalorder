'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, AlertCircle, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// ============================================================================
// 1. ESQUEMA DEFENSIVO (ZOD)
// ============================================================================
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido.' })
    .trim()
    .min(1, 'El correo electrónico es requerido.')
    .email('Ingrese una dirección de correo electrónico válida con formato RFC compliant.'),
  password: z
    .string({ required_error: 'La contraseña es requerida.' })
    .min(6, 'La contraseña debe tener un mínimo de 6 caracteres.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// 2. COMPONENTE VISUAL Y TRANSACCIÓN DE ACCESO
// ============================================================================
export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    try {
      // Transacción de acceso mediante Supabase Auth con soporte de Cookies SSR
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        // DIRECTIVA ANTI-ENUMERATION:
        // Mensaje opaco estándar para prevenir user enumeration / password guessing
        setAuthError('Credenciales inválidas. Verifique sus datos de acceso.');
        return;
      }

      // Sincroniza cookies con Server Components y redirige a la zona protegida
      router.refresh();
      router.push('/dashboard');
    } catch {
      // Bloqueo de contingencia: nunca filtrar detalles de excepción de red o infraestructura
      setAuthError('Credenciales inválidas. Verifique sus datos de acceso.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Cabecera Corporativa B2B */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Acceso Corporativo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ingrese sus credenciales de seguridad autorizadas
          </p>
        </div>

        {/* Tarjeta de Seguridad */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
          {/* Banner de Error Defensivo (Anti-Enumeration) */}
          {authError && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/90 p-3.5 text-sm text-red-800 transition-all"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
              <span className="font-medium leading-tight">{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Campo: Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Correo Electrónico
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  placeholder="usuario@empresa.com"
                  {...register('email')}
                  className={`block w-full rounded-lg border py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 hover:border-slate-400 focus:border-slate-900 focus:ring-slate-900'
                  }`}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Campo: Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Contraseña
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  placeholder="••••••••••••"
                  {...register('password')}
                  className={`block w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 hover:border-slate-400 focus:border-slate-900 focus:ring-slate-900'
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Botón Principal (Tri-State: Idle / Submitting + Spinner / Disabled) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" aria-hidden="true" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer Informativo Corporativo */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Protegido por políticas de autenticación Zero-Trust y cifrado TLS end-to-end.
        </p>
      </div>
    </div>
  );
}
