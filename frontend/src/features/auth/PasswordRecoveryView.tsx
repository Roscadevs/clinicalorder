import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Key, CheckCircle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { Button, Input } from '../../components/ui';
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from './schemas/recoverySchemas';

export const PasswordRecoveryView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [lastEmail, setLastEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setLastEmail(data.email);

    try {
      // Flujo PKCE nativo de Supabase Auth
      const redirectTo = `${window.location.origin}/auth/callback?next=/update-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo,
      });

      if (error) {
        // Log técnico defensivo sin revelar el fallo al atacante (mitigación de enumeración)
        console.warn('[Supabase Auth PKCE] Error en resetPasswordForEmail:', error.message);
      }
    } catch (err) {
      console.error('[Supabase Auth PKCE] Excepción de red en recuperación:', err);
    } finally {
      setIsLoading(false);
      // UX Ciega: Siempre mostramos éxito para evitar ataques de enumeración de cuentas
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100">
          <Key className="w-8 h-8" />
        </div>
        <h1 className="mt-5 text-center font-display text-3xl font-bold text-sand-900 tracking-tight">
          Recuperar Contraseña
        </h1>
        <p className="mt-2 text-center text-sm text-sand-600 max-w-sm">
          Ingresa tu correo electrónico registrado para recibir un enlace de recuperación seguro
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-2xl sm:px-10 border border-sand-200">
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Input
                label="Correo Electrónico Institucional"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="operador@clinicadermatologica.com"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                disabled={isLoading}
                {...register('email')}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Enviar Enlace de Recuperación
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-success-100 flex items-center justify-center mx-auto border border-success-200">
                <CheckCircle className="w-7 h-7 text-success-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-sand-900">
                Instrucciones Enviadas
              </h3>
              <p className="text-sm text-sand-600 leading-relaxed">
                Si la cuenta asociada a{' '}
                <strong className="text-sand-900 font-semibold">{lastEmail}</strong>{' '}
                está registrada, recibirás un enlace seguro de un solo uso con vigencia de 15 minutos para actualizar tu contraseña.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => setSubmitted(false)}
                >
                  Probar con otro correo
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center border-t border-sand-100 pt-5">
            <Link
              to="/login"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1.5"
            >
              &larr; Volver al Inicio de Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
