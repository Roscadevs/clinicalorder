import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../../components/ui';

/**
 * Interceptor PKCE de Callback (/auth/callback).
 * Extrae el parámetro 'code' de la URL proveniente del correo de Supabase,
 * realiza el intercambio criptográfico 'exchangeCodeForSession(code)'
 * y redirige a la ruta segura '/update-password'.
 */
export const AuthCallbackView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleExchange = async () => {
      // 1. Detección de errores explícitos provistos por Supabase en los query params
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const nextPath = searchParams.get('next') || '/update-password';

      if (errorParam || errorDescription) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(
          errorDescription ||
            'El enlace de recuperación es inválido, ha caducado o ya ha sido utilizado.'
        );
        return;
      }

      // 2. Extracción del código PKCE
      const code = searchParams.get('code');

      if (!code) {
        // En caso de que la sesión ya haya sido resuelta o venga por hash legacy
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          if (!isMounted) return;
          setStatus('success');
          navigate(nextPath, { replace: true });
          return;
        }

        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(
          'No se encontró el código criptográfico de recuperación en el enlace. Solicita uno nuevo.'
        );
        return;
      }

      try {
        // 3. Intercambio atómico PKCE: code -> session en Supabase Auth
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          if (!isMounted) return;
          setStatus('error');
          setErrorMessage(
            error.message ||
              'No se pudo autenticar el código temporal. Por favor, solicita otro enlace.'
          );
          return;
        }

        if (data.session) {
          if (!isMounted) return;
          setStatus('success');
          navigate(nextPath, { replace: true });
        } else {
          if (!isMounted) return;
          setStatus('error');
          setErrorMessage('No se pudo establecer la sesión segura de recuperación.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(
          err?.message || 'Ocurrió un error inesperado al procesar la seguridad del enlace.'
        );
      }
    };

    handleExchange();

    return () => {
      isMounted = false;
    };
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-card sm:rounded-2xl sm:px-10 border border-sand-200 text-center">
          {status === 'loading' && (
            <div className="space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto border border-primary-100 shadow-sm animate-pulse">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-sand-900 tracking-tight">
                Verificando Enlace Seguro
              </h2>
              <p className="text-sm text-sand-600 leading-relaxed max-w-xs mx-auto">
                Estamos validando tus credenciales temporales mediante el protocolo seguro PKCE de Supabase...
              </p>
              <div className="flex items-center justify-center gap-2 pt-2 text-primary-600 text-sm font-medium">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Estableciendo sesión protegida...</span>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-success-50 text-success-600 flex items-center justify-center mx-auto border border-success-200 shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-sand-900">
                Identidad Confirmada
              </h2>
              <p className="text-sm text-sand-600">
                Redirigiendo a la pantalla de actualización de contraseña...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-danger-50 text-danger-600 flex items-center justify-center mx-auto border border-danger-200 shadow-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-sand-900">
                Enlace Expirado o Inválido
              </h2>
              <p className="text-sm text-sand-600 leading-relaxed">
                {errorMessage}
              </p>
              <div className="pt-2 space-y-3">
                <Link to="/recover-password" className="block w-full">
                  <Button fullWidth size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Solicitar nuevo enlace
                  </Button>
                </Link>
                <Link
                  to="/login"
                  className="block text-sm font-semibold text-sand-600 hover:text-sand-900 transition-colors"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
